/**
 * Benchmarked with scripts/latency-bench.mjs (same recorded question, real-time pacing):
 *   gemini-3.1-flash-live-preview ........ ~0.9 s from end of speech to first reply audio
 *   gemini-3.8-live ...................... ~1.2 s
 *   gemini-2.5-flash-native-audio-* ...... ~3-4.5 s (the previous default)
 * Override with GEMINI_LIVE_MODEL; `node --env-file=.env.local scripts/list-live-models.mjs`
 * lists the Live models your key can use.
 */
export const DEFAULT_LIVE_MODEL = "gemini-3.1-flash-live-preview";
export const DEFAULT_VOICE = "Puck";

/** Browser -> Gemini: 16-bit little-endian PCM, mono, 16 kHz. */
export const INPUT_SAMPLE_RATE = 16000;
/** Gemini -> Browser: 16-bit little-endian PCM, mono, 24 kHz. */
export const OUTPUT_SAMPLE_RATE = 24000;

export interface LiveTokenResponse {
  token: string;
  model: string;
  expiresAt: string;
  /** Silence (ms) that ends the user's turn; sent both in the token and on connect. */
  silenceMs: number;
}
