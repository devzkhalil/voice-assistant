"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Captions, CaptionsOff, Keyboard, Mic, MicOff, PhoneOff, Send, Sparkles, X, Zap } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useGeminiLive } from "@/hooks/useGeminiLive";
import { portfolioData } from "@/data/portfolioData";
import { AudioVisualizer } from "./AudioVisualizer";

/**
 * Floating voice orb + expandable panel.
 * - Click the orb: opens the panel and starts a voice session.
 * - Mute / end call controls, live captions, and a text input fallback.
 */
export default function VoiceAssistant() {
  const live = useGeminiLive();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  // Voice-first: during a voice call show the live orb, not a chat log. Captions are opt-in.
  const [showCaptions, setShowCaptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const connected = live.status === "connected";
  const mode = live.status === "connecting"
    ? "connecting"
    : live.isAssistantSpeaking
      ? "speaking"
      : connected && live.micActive && !live.isMuted
        ? "listening"
        : "idle";

  const statusLabel = {
    connecting: "Connecting…",
    speaking: "Speaking",
    listening: "Listening",
    idle: connected ? (live.micActive ? "Muted" : "Text mode") : "Tap the mic to talk",
  }[mode];

  // Auto-scroll captions.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [live.messages]);

  const startVoice = () => {
    if (!connected) void live.connect({ withMic: true });
    else if (!live.micActive) void live.startMic();
  };

  const voiceView = connected && live.micActive && !showCaptions;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowCaptions(true);
    void live.sendText(draft);
    setDraft("");
  };

  const close = () => {
    void live.disconnect();
    setOpen(false);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/90 shadow-2xl shadow-black/50 backdrop-blur-xl"
            aria-label="Voice assistant"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Ask about {portfolioData.profile.firstName}</p>
                <p className="flex items-center gap-1.5 text-xs text-zinc-400" aria-live="polite">
                  <span
                    className={`size-2 rounded-full ${
                      mode === "speaking" ? "bg-accent-2" : mode === "listening" ? "bg-emerald-400" : connected ? "bg-zinc-400" : "bg-zinc-600"
                    } ${mode === "listening" || mode === "speaking" ? "animate-pulse" : ""}`}
                  />
                  {statusLabel}
                  {live.latencyMs !== null && (
                    <span className="ml-1 flex items-center gap-0.5 text-zinc-500" title="Time from end of speech to first reply audio">
                      <Zap className="size-3" />
                      {live.latencyMs} ms
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowCaptions((v) => !v)}
                  className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                  aria-label={showCaptions ? "Hide captions" : "Show captions"}
                  aria-pressed={showCaptions}
                >
                  {showCaptions ? <CaptionsOff className="size-4" /> : <Captions className="size-4" />}
                </button>
              <button onClick={close} className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Close assistant">
                <X className="size-4" />
              </button>
              </div>
            </header>

            {voiceView ? (
              /* Live call view: a big reactive orb, like a phone call — no text to wait for. */
              <div className="flex flex-1 flex-col items-center justify-center gap-6">
                <motion.div
                  className="grid size-36 place-items-center rounded-full bg-gradient-to-br from-accent/30 to-accent-2/30"
                  animate={{
                    scale: mode === "speaking" ? [1, 1.08, 1] : 1 + live.userLevel * 0.25,
                  }}
                  transition={mode === "speaking" ? { repeat: Infinity, duration: 0.8 } : { type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="grid size-24 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 shadow-lg shadow-accent/40">
                    <AudioVisualizer analyser={live.analyser} userLevel={live.userLevel} mode={mode} bars={5} />
                  </div>
                </motion.div>
                <p className="px-6 text-center text-sm text-zinc-400">
                  {mode === "speaking" ? "Speak anytime to interrupt." : "Just talk — I'm listening."}
                </p>
                {live.error && <p className="mx-5 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-300">{live.error}</p>}
              </div>
            ) : (


            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm">
              {live.messages.length === 0 && (
                <div className="mt-6 text-center text-zinc-400">
                  <Sparkles className="mx-auto mb-3 size-6 text-accent" />
                  <p>Talk or type to ask about my projects, skills, experience or availability.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {["What are your main skills?", "Tell me about a recent project", "Are you available for hire?"].map((q) => (
                      <button key={q} onClick={() => { setShowCaptions(true); void live.sendText(q); }} className="rounded-full border border-white/10 px-3 py-1 text-xs hover:border-accent hover:text-white">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {live.messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                    m.role === "user" ? "ml-auto bg-accent text-white" : "bg-white/5 text-zinc-100"
                  } ${m.final ? "" : "opacity-80"}`}
                >
                  {m.text}
                </motion.div>
              ))}
              {live.error && <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-300">{live.error}</p>}
            </div>
            )}

            {/* Voice controls */}
            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3">
              <AudioVisualizer analyser={live.analyser} userLevel={live.userLevel} mode={mode} bars={7} />
              <div className="flex items-center gap-2">
                {connected && live.micActive ? (
                  <button
                    onClick={live.toggleMute}
                    className={`rounded-full p-2.5 ${live.isMuted ? "bg-red-500/20 text-red-300" : "bg-white/10 hover:bg-white/20"}`}
                    aria-label={live.isMuted ? "Unmute microphone" : "Mute microphone"}
                    aria-pressed={live.isMuted}
                  >
                    {live.isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                  </button>
                ) : (
                  <button onClick={startVoice} disabled={live.status === "connecting"} className="rounded-full bg-accent p-2.5 hover:brightness-110 disabled:opacity-50" aria-label="Start voice">
                    <Mic className="size-4" />
                  </button>
                )}
                {connected && (
                  <button onClick={() => void live.disconnect()} className="rounded-full bg-red-500/80 p-2.5 hover:bg-red-500" aria-label="End session">
                    <PhoneOff className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Text fallback */}
            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
              <Keyboard className="size-4 shrink-0 text-zinc-500" aria-hidden />
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Prefer typing? Ask here…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
                aria-label="Message"
              />
              <button type="submit" disabled={!draft.trim()} className="rounded-full p-2 text-accent disabled:opacity-30" aria-label="Send">
                <Send className="size-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating orb */}
      <motion.button
        onClick={() => {
          if (open) return close();
          setOpen(true);
          startVoice();
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative grid size-16 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 shadow-lg shadow-accent/40"
        aria-label={open ? "Close voice assistant" : "Talk to my AI assistant"}
      >
        {/* Pulse rings react to state */}
        {(mode === "listening" || mode === "speaking") && (
          <>
            {[0, 0.6].map((delay) => (
              <motion.span
                key={delay}
                className="absolute inset-0 rounded-full bg-accent/40"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.7 + (mode === "speaking" ? 0.3 : live.userLevel), opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.6, delay, ease: "easeOut" }}
              />
            ))}
          </>
        )}
        <span className="relative">
          {open ? <X className="size-6" /> : <Mic className="size-6" />}
        </span>
      </motion.button>
    </div>
  );
}
