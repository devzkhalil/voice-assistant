import { GoogleGenAI, Modality } from "@google/genai";
import { NextResponse } from "next/server";
import { buildSystemInstruction } from "@/lib/systemPrompt";
import { DEFAULT_LIVE_MODEL, DEFAULT_VOICE, type LiveTokenResponse } from "@/lib/geminiConfig";

/**
 * POST /api/gemini/token
 *
 * Mints a short-lived, single-use *ephemeral token* for the Gemini Live API.
 * The browser then opens the WebSocket directly to Google (no relay hop = lowest
 * latency) while GEMINI_API_KEY never leaves the server.
 *
 * The model, voice and system instruction are locked into the token
 * (`liveConnectConstraints`), so a visitor cannot reuse it to run arbitrary
 * prompts against your quota.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Naive per-instance rate limit to protect the free-tier quota.
// For production at scale, swap for Upstash/Vercel KV.
const hits = new Map<string, { count: number; reset: number }>();
const LIMIT = 10; // tokens per IP per window
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is missing GEMINI_API_KEY" }, { status: 500 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many sessions, try again later." }, { status: 429 });
  }

  const model = process.env.GEMINI_LIVE_MODEL || DEFAULT_LIVE_MODEL;
  const voiceName = process.env.GEMINI_VOICE || DEFAULT_VOICE;

  try {
    // Ephemeral tokens are only available on v1alpha.
    const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1alpha" } });

    const expireTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // session may run 15 min
    const newSessionExpireTime = new Date(Date.now() + 60 * 1000).toISOString(); // must connect within 1 min

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime,
        newSessionExpireTime,
        liveConnectConstraints: {
          model,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: buildSystemInstruction(),
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
            // Transcripts power the on-screen captions and the text-chat fallback.
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            temperature: 0.6,
          },
        },
        lockAdditionalFields: [],
        httpOptions: { apiVersion: "v1alpha" },
      },
    });

    if (!token.name) throw new Error("Token response had no name");

    const body: LiveTokenResponse = { token: token.name, model, expiresAt: expireTime };
    return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[gemini/token] failed to mint token", err);
    return NextResponse.json({ error: "Could not start a voice session." }, { status: 502 });
  }
}
