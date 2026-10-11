/** Helpers for moving raw PCM between the Web Audio API and the Gemini Live API (base64 JSON). */

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const CHUNK = 0x8000; // avoid call-stack limits on large buffers
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/** Int16 little-endian PCM -> Float32 in [-1, 1] for an AudioBuffer. */
export function pcm16ToFloat32(buffer: ArrayBuffer): Float32Array<ArrayBuffer> {
  const view = new DataView(buffer);
  const out = new Float32Array(buffer.byteLength / 2);
  for (let i = 0; i < out.length; i++) out[i] = view.getInt16(i * 2, true) / 0x8000;
  return out;
}

/** Root-mean-square level of an Int16 chunk, normalised to 0..1. */
export function pcm16Level(buffer: ArrayBuffer): number {
  const samples = new Int16Array(buffer);
  if (!samples.length) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i] / 0x8000;
    sum += v * v;
  }
  return Math.min(1, Math.sqrt(sum / samples.length) * 4);
}
