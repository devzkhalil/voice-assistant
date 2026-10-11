"use client";

import { GoogleGenAI, type LiveServerMessage, type Session } from "@google/genai";
import { useCallback, useEffect, useRef, useState } from "react";
import { AudioPlayer } from "@/lib/audio/AudioPlayer";
import { AudioRecorder } from "@/lib/audio/AudioRecorder";
import { arrayBufferToBase64, base64ToArrayBuffer } from "@/lib/audio/pcm";
import { INPUT_SAMPLE_RATE, type LiveTokenResponse } from "@/lib/geminiConfig";

export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** False while the transcription is still streaming in. */
  final: boolean;
}

interface Options {
  /** Open the mic when connecting. False = text-only mode (no mic permission needed). */
  withMic: boolean;
}

const uid = () => Math.random().toString(36).slice(2, 10);

/**
 * Owns the full Gemini Live lifecycle:
 *   fetch ephemeral token -> open WebSocket -> stream mic PCM up ->
 *   play PCM down -> surface transcripts -> handle barge-in -> tear down.
 */
export function useGeminiLive() {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [userLevel, setUserLevel] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  /** Time from the end of the user's speech (or a sent text) to the first reply audio. */
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const sessionRef = useRef<Session | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);
  // Ids of the in-progress messages so streamed transcript fragments append to the right bubble.
  const currentUserMsg = useRef<string | null>(null);
  const currentAssistantMsg = useRef<string | null>(null);
  // Latency meter: last moment the user was audibly speaking, and whether we're waiting for reply audio.
  const lastSpeechAt = useRef(0);
  const awaitingReply = useRef(false);

  /** Append streaming transcription text to the active bubble for `role`, creating it if needed. */
  const appendText = useCallback((role: ChatMessage["role"], text: string) => {
    const ref = role === "user" ? currentUserMsg : currentAssistantMsg;
    if (!ref.current) {
      const id = uid();
      ref.current = id;
      setMessages((m) => [...m, { id, role, text, final: false }]);
      return;
    }
    const id = ref.current;
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text: msg.text + text } : msg)));
  }, []);

  const finalize = useCallback((role: ChatMessage["role"]) => {
    const ref = role === "user" ? currentUserMsg : currentAssistantMsg;
    const id = ref.current;
    ref.current = null;
    if (id) setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, final: true } : msg)));
  }, []);

  const handleMessage = useCallback(
    (msg: LiveServerMessage) => {
      const content = msg.serverContent;
      if (!content) return;

      // 1) Audio chunks -> speaker queue (played as they arrive).
      for (const part of content.modelTurn?.parts ?? []) {
        const data = part.inlineData?.data;
        if (data && part.inlineData?.mimeType?.startsWith("audio/")) {
          if (awaitingReply.current) {
            awaitingReply.current = false;
            setLatencyMs(Math.round(performance.now() - lastSpeechAt.current));
          }
          playerRef.current?.enqueue(base64ToArrayBuffer(data));
        }
      }

      // 2) Live captions.
      if (content.inputTranscription?.text) appendText("user", content.inputTranscription.text);
      if (content.outputTranscription?.text) {
        // Model started answering, so the user's turn is over.
        finalize("user");
        appendText("assistant", content.outputTranscription.text);
      }

      // 3) Barge-in: the user spoke over the assistant -> drop queued audio now.
      if (content.interrupted) {
        playerRef.current?.interrupt();
        finalize("assistant");
      }

      if (content.turnComplete) {
        finalize("user");
        finalize("assistant");
      }
    },
    [appendText, finalize],
  );

  const disconnect = useCallback(async () => {
    sessionRef.current?.close();
    sessionRef.current = null;
    await recorderRef.current?.stop();
    recorderRef.current = null;
    await playerRef.current?.close();
    playerRef.current = null;
    setAnalyser(null);
    setMicActive(false);
    setIsAssistantSpeaking(false);
    setUserLevel(0);
    setStatus("idle");
  }, []);

  /** Starts the mic on an already-open session (used for "text first, then voice"). */
  const startMic = useCallback(async () => {
    if (recorderRef.current || !sessionRef.current) return;
    const recorder = new AudioRecorder((pcm, level) => {
      setUserLevel(level);
      if (level > 0.08) {
        lastSpeechAt.current = performance.now();
        awaitingReply.current = true;
      }
      sessionRef.current?.sendRealtimeInput({
        audio: { data: arrayBufferToBase64(pcm), mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}` },
      });
    });
    recorderRef.current = recorder;
    try {
      await recorder.start();
      recorder.setMuted(isMuted);
      setMicActive(true);
    } catch (e) {
      recorderRef.current = null;
      setError(
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "Microphone access was denied — you can still type below."
          : "Could not access the microphone — you can still type below.",
      );
    }
  }, [isMuted]);

  const connect = useCallback(
    async ({ withMic }: Options) => {
      if (sessionRef.current || status === "connecting") return;
      setError(null);
      setStatus("connecting");

      try {
        // Create the player inside the click handler so autoplay policies allow it.
        const player = new AudioPlayer();
        player.onPlayingChange = setIsAssistantSpeaking;
        await player.resume();
        playerRef.current = player;
        setAnalyser(player.analyser);

        // 1) Ask our server for a short-lived token (API key stays server-side).
        const res = await fetch("/api/gemini/token", { method: "POST" });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Token request failed (${res.status})`);
        }
        const { token, model } = (await res.json()) as LiveTokenResponse;

        // 2) Open the Live WebSocket straight to Google with the ephemeral token.
        //    Config (system prompt, voice, transcription) is locked into the token server-side.
        const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion: "v1alpha" } });
        const session = await ai.live.connect({
          model,
          config: {},
          callbacks: {
            onopen: () => setStatus("connected"),
            onmessage: handleMessage,
            onerror: (e) => {
              console.error("[gemini-live] error", e);
              setError("Connection error. Please try again.");
              setStatus("error");
            },
            onclose: (e) => {
              if (sessionRef.current) {
                // Unexpected close (token expiry, quota, network).
                if (e.code !== 1000) setError(e.reason || "The voice session ended.");
                void disconnect();
              }
            },
          },
        });
        sessionRef.current = session;
        setStatus("connected");

        // 3) Optional mic.
        if (withMic) await startMic();

        // 4) Nudge the model to greet the visitor.
        session.sendClientContent({
          turns: [{ role: "user", parts: [{ text: "(A visitor just opened the assistant. Greet them.)" }] }],
          turnComplete: true,
        });
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "Could not connect.");
        await disconnect();
        setStatus("error");
      }
    },
    [disconnect, handleMessage, startMic, status],
  );

  /** Text fallback: same session, so the assistant still answers out loud (and via captions). */
  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (!sessionRef.current) await connect({ withMic: false });
      if (!sessionRef.current) return;

      playerRef.current?.interrupt();
      finalize("assistant");
      setMessages((m) => [...m, { id: uid(), role: "user", text: trimmed, final: true }]);
      lastSpeechAt.current = performance.now();
      awaitingReply.current = true;
      sessionRef.current.sendClientContent({
        turns: [{ role: "user", parts: [{ text: trimmed }] }],
        turnComplete: true,
      });
    },
    [connect, finalize],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((m) => {
      recorderRef.current?.setMuted(!m);
      if (!m) setUserLevel(0);
      return !m;
    });
  }, []);

  // Always release the mic / sockets on unmount.
  useEffect(() => () => void disconnect(), [disconnect]);

  return {
    status,
    error,
    messages,
    isMuted,
    micActive,
    isAssistantSpeaking,
    userLevel,
    analyser,
    latencyMs,
    connect,
    disconnect,
    startMic,
    sendText,
    toggleMute,
  };
}
