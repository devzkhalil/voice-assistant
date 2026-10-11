// Controlled latency benchmark for the Gemini Live API (no mic, no browser).
// Streams a recorded question in real time (32 ms chunks), then silence like a live mic,
// and measures: last speech sample sent -> first reply audio. Run:
//   node --env-file=.env.local scripts/latency-bench.mjs /tmp/bench/q.wav <model> [transcription=on|off] [vad=custom|default]
import fs from "node:fs";
import { GoogleGenAI, Modality, EndSensitivity, StartSensitivity } from "@google/genai";

const [wavPath, model, transcription = "on", vad = "custom"] = process.argv.slice(2);
const wav = fs.readFileSync(wavPath);
const pcm = wav.subarray(44); // 16 kHz mono int16, canonical 44-byte header
const CHUNK = 1024; // 512 samples = 32 ms
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const config = {
  responseModalities: [Modality.AUDIO],
  systemInstruction: "You are Alex's portfolio assistant. Answer in one short sentence.",
  ...(transcription === "on" ? { inputAudioTranscription: {}, outputAudioTranscription: {} } : {}),
  ...(vad === "custom"
    ? {
        realtimeInputConfig: {
          automaticActivityDetection: {
            startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
            endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_HIGH,
            prefixPaddingMs: 20,
            silenceDurationMs: 300,
          },
        },
      }
    : {}),
};

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let lastSpeechSentAt = 0;
let firstAudioAt = 0;
let firstTextAt = 0;
let done;
const finished = new Promise((r) => (done = r));

const t0 = performance.now();
let session;
try {
  session = await ai.live.connect({
    model,
    config,
    callbacks: {
      onmessage: (m) => {
        const c = m.serverContent;
        if (!c) return;
        if (!firstAudioAt && c.modelTurn?.parts?.some((p) => p.inlineData?.data)) firstAudioAt = performance.now();
        if (!firstTextAt && c.outputTranscription?.text) firstTextAt = performance.now();
        if (c.turnComplete) done();
      },
      onerror: (e) => {
        console.log(`${model} ERROR ${e.message ?? e}`);
        done();
      },
      onclose: () => done(),
    },
  });
} catch (e) {
  console.log(`${model} CONNECT FAILED: ${String(e.message ?? e).slice(0, 120)}`);
  process.exit(0);
}
const connectMs = Math.round(performance.now() - t0);

// Real-time pacing: one chunk every 32 ms, speech first, then 4 s of silence.
const silence = Buffer.alloc(CHUNK);
const start = performance.now();
let sent = 0;
const total = Math.ceil(pcm.length / CHUNK) + Math.ceil(4000 / 32);
for (let i = 0; i < total; i++) {
  const isSpeech = i * CHUNK < pcm.length;
  const chunk = isSpeech ? pcm.subarray(i * CHUNK, (i + 1) * CHUNK) : silence;
  session.sendRealtimeInput({ audio: { data: Buffer.from(chunk).toString("base64"), mimeType: "audio/pcm;rate=16000" } });
  if (isSpeech) lastSpeechSentAt = performance.now();
  sent++;
  if (firstAudioAt && i > 0 && !isSpeech) break;
  await sleep(Math.max(0, start + (i + 1) * 32 - performance.now()));
}
await Promise.race([finished, sleep(15000)]);
session.close();

const r = (x) => (x ? Math.round(x - lastSpeechSentAt) : "none");
console.log(
  `${model.padEnd(52)} trans=${transcription} vad=${vad}  connect=${connectMs}ms  first_audio=${r(firstAudioAt)}ms  first_text=${r(firstTextAt)}ms`,
);
