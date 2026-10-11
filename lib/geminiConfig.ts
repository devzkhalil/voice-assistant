/**
 * Shared Live API settings (server + client).
 * `gemini-2.0-flash-exp` has been retired from the Live API; the current
 * free-tier Live models are the 2.5 Flash native-audio models. Override with
 * GEMINI_LIVE_MODEL if Google ships a newer one.
 */
export const DEFAULT_LIVE_MODEL = "gemini-2.5-flash-native-audio-preview-09-2025";
export const DEFAULT_VOICE = "Puck";

/** Browser -> Gemini: 16-bit little-endian PCM, mono, 16 kHz. */
export const INPUT_SAMPLE_RATE = 16000;
/** Gemini -> Browser: 16-bit little-endian PCM, mono, 24 kHz. */
export const OUTPUT_SAMPLE_RATE = 24000;

export interface LiveTokenResponse {
  token: string;
  model: string;
  expiresAt: string;
}
