# VoiceFolio — Developer Portfolio with a Real-Time Gemini Voice Assistant

A Next.js 15 (App Router) + Tailwind CSS portfolio with a floating voice orb that talks to
visitors about you in real time, using the **Gemini Live API** (bidirectional audio over WebSockets),
grounded in a single `data/portfolioData.ts` file.

---

## 1. Architecture & audio pipeline

```
 ┌──────────────────────────── Browser ─────────────────────────────┐
 │                                                                  │
 │  Mic ─getUserMedia (AEC/NS/AGC on)─▶ AudioContext (44.1/48 kHz)  │
 │        └─▶ AudioWorklet "pcm-recorder" (audio thread)            │
 │              Float32 ─▶ downsample 16 kHz ─▶ Int16 PCM           │
 │              posts 32 ms chunks (512 samples, zero-copy)         │
 │        └─▶ base64 ─▶ session.sendRealtimeInput({audio})  ──────┐ │
 │                                                                │ │
 │  Speaker ◀─ AnalyserNode ◀─ Gain ◀─ AudioBufferSource queue    │ │
 │        ▲    (visualizer)      gapless scheduling @ 24 kHz      │ │
 │        └── Int16 ─▶ Float32 ◀─ base64 ◀─ serverContent.audio ◀┐│ │
 └───────────────────────────────────────────────────────────────┼┼─┘
          ① POST /api/gemini/token            ② wss:// (direct)  ││
 ┌────────── Next.js route (server) ─────┐   ┌──── Gemini Live API ─┐
 │ GEMINI_API_KEY (never shipped)        │   │ server-side VAD       │
 │ authTokens.create({                   │   │ native-audio model    │
 │   uses: 1, expires 15 min,            │   │ barge-in → interrupted│
 │   liveConnectConstraints: {model,     │   │ input/output          │
 │     systemInstruction, voice, …} })   │   │ transcriptions        │
 └───────────────────────────────────────┘   └───────────────────────┘
```

**Why ephemeral tokens instead of a WebSocket relay?** Vercel serverless/edge functions can't hold
long-lived inbound WebSockets, and every relay adds a network hop. An ephemeral token lets the browser
connect *directly* to Google (lowest latency) while the real API key stays on the server. The token is
single-use, must be used within 60 s, and has the model, voice and **system prompt locked in**, so it
can't be abused to run other prompts on your quota.

**Where the latency goes:**
- 32 ms capture chunks — no "record then send"; audio streams continuously.
- Server-side voice-activity detection decides when you've finished speaking; no client round-trip.
- Native-audio model: speech-in → speech-out without a separate STT/TTS stage.
- Playback starts on the first ~40 ms chunk; chunks are scheduled back-to-back on the audio clock.
- Barge-in: when Gemini sends `interrupted`, all queued buffers are stopped immediately.
- Echo cancellation on the mic so the assistant doesn't hear (and interrupt) itself.

**Text fallback:** typed messages are sent with `sendClientContent` on the *same* Live session.
The reply is still spoken, and `outputAudioTranscription` shows it as text. If the visitor
never grants mic access, the session is opened text-only (no permission prompt).

---

## 2. Project structure

```
app/
  api/gemini/token/route.ts   # mints locked ephemeral tokens (API key stays here)
  layout.tsx, page.tsx, globals.css
components/
  sections/                   # Hero, About, Skills, Projects, Experience, Contact
  voice/VoiceAssistant.tsx    # floating orb + panel, captions, mute, text input
  voice/AudioVisualizer.tsx   # Framer Motion bars driven by AnalyserNode / mic RMS
data/portfolioData.ts         # ★ knowledge base + page content (edit this)
hooks/useGeminiLive.ts        # WebSocket lifecycle, streaming, transcripts, barge-in
lib/
  systemPrompt.ts             # builds the Gemini system instruction from your data
  geminiConfig.ts             # model / voice / sample-rate constants
  audio/AudioRecorder.ts      # mic → 16 kHz PCM via AudioWorklet
  audio/AudioPlayer.ts        # gapless 24 kHz PCM playback queue
  audio/pcm.ts                # base64 / PCM conversions
public/worklets/pcm-recorder.worklet.js
```

---

## 3. Knowledge base

Everything about you lives in **`data/portfolioData.ts`** (profile, contact, skills, projects,
experience, education, FAQs). The landing page renders from it, and `lib/systemPrompt.ts`
converts it to compact Markdown and embeds it in the system instruction — so updating that file
updates both the site and what the assistant knows. Add FAQs for anything recruiters often ask
(notice period, relocation, rates): the model is told never to invent facts that aren't there.

## 4. System prompt

See `buildSystemInstruction()` in `lib/systemPrompt.ts`. It:
- keeps replies to 1–3 spoken sentences, without markdown or emojis, and with URLs said aloud naturally;
- grounds every answer strictly in the knowledge base, and points to email when unsure;
- keeps the assistant on topic, refuses role changes, and never reveals its instructions;
- replies in the visitor's language and greets with a single sentence.

---

## 5. Setup

```bash
git clone <this repo> && cd voice-assistant
npm install                       # next, react, @google/genai, framer-motion, lucide-react, tailwindcss
cp .env.example .env.local        # then paste your key
npm run dev                       # http://localhost:3000
```

1. Create a free API key at **https://aistudio.google.com/apikey**.
2. `.env.local`:
   ```env
   GEMINI_API_KEY=AIza...
   # optional
   GEMINI_LIVE_MODEL=gemini-2.5-flash-native-audio-preview-09-2025
   GEMINI_VOICE=Puck
   ```
3. Edit `data/portfolioData.ts` with your details.

> **About the model:** `gemini-2.0-flash-exp` (and later `gemini-2.0-flash-live-001`) have been
> retired from the Live API. The default here is the free-tier 2.5 Flash native-audio Live model.
> If Google renames it, set `GEMINI_LIVE_MODEL` to any model listed as supporting the Live API in
> AI Studio. No code changes are needed.

Microphone access requires HTTPS or `localhost`.

## 6. Deploy to Vercel

```bash
npm i -g vercel
vercel                               # link and create the project
vercel env add GEMINI_API_KEY        # paste the key (Production + Preview)
vercel --prod
```

Or import the GitHub repo at vercel.com/new and add `GEMINI_API_KEY` under
*Settings → Environment Variables*. The token route runs as a regular Node function; the audio never
passes through Vercel.

### Production hardening
- The built-in rate limit (10 sessions per IP every 10 min) is in-memory and per instance. For real traffic,
  move it to Upstash Redis or Vercel KV, and consider Vercel BotID or Turnstile on the token route.
- Set a usage cap on your Google Cloud project to keep free-tier usage predictable.
- Sessions are capped at 15 minutes by the token `expireTime`. Audio-only Live sessions also have a
  server-side length limit; the UI shows an error and resets cleanly when the socket closes.
