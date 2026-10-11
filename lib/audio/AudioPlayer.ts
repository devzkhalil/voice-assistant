import { OUTPUT_SAMPLE_RATE } from "@/lib/geminiConfig";
import { pcm16ToFloat32 } from "./pcm";

/**
 * Gapless streaming player for Gemini's 24 kHz PCM output.
 *
 * Each incoming chunk is scheduled to start exactly when the previous one ends
 * (`nextStartTime`), so playback begins as soon as the first ~40 ms chunk
 * arrives instead of waiting for the whole reply. `interrupt()` drops every
 * queued source instantly to support barge-in.
 */
export class AudioPlayer {
  private ctx: AudioContext;
  private gain: GainNode;
  readonly analyser: AnalyserNode;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  onPlayingChange?: (playing: boolean) => void;

  constructor() {
    this.ctx = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE, latencyHint: "interactive" });
    this.gain = this.ctx.createGain();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.7;
    this.gain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  /** Must be called from a user gesture on iOS/Safari. */
  async resume() {
    if (this.ctx.state === "suspended") await this.ctx.resume();
  }

  enqueue(pcm16: ArrayBuffer) {
    const samples = pcm16ToFloat32(pcm16);
    if (!samples.length) return;
    const buffer = this.ctx.createBuffer(1, samples.length, OUTPUT_SAMPLE_RATE);
    buffer.copyToChannel(samples, 0);

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.gain);

    // Tiny 20 ms safety margin when (re)starting avoids clicks from late scheduling.
    const now = this.ctx.currentTime;
    if (this.nextStartTime < now) this.nextStartTime = now + 0.02;
    src.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;

    if (this.sources.size === 0) this.onPlayingChange?.(true);
    this.sources.add(src);
    src.onended = () => {
      this.sources.delete(src);
      if (this.sources.size === 0) this.onPlayingChange?.(false);
    };
  }

  /** Stop all queued audio immediately (user barged in). */
  interrupt() {
    this.sources.forEach((s) => {
      s.onended = null;
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
    });
    this.sources.clear();
    this.nextStartTime = 0;
    this.onPlayingChange?.(false);
  }

  async close() {
    this.interrupt();
    if (this.ctx.state !== "closed") await this.ctx.close();
  }
}
