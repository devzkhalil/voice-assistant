import { INPUT_SAMPLE_RATE } from "@/lib/geminiConfig";
import { pcm16Level } from "./pcm";

type ChunkHandler = (pcm16: ArrayBuffer, level: number) => void;

/**
 * Captures the microphone and emits 16 kHz Int16 PCM chunks via an AudioWorklet.
 * Echo cancellation is essential: without it the assistant hears itself and
 * interrupts its own speech through Gemini's voice-activity detection.
 */
export class AudioRecorder {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private node: AudioWorkletNode | null = null;
  private muted = false;

  constructor(private onChunk: ChunkHandler) {}

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // Use the device's native rate; the worklet downsamples (Firefox refuses
    // to connect a mic to a context running at a different rate).
    this.ctx = new AudioContext({ latencyHint: "interactive" });
    await this.ctx.audioWorklet.addModule("/worklets/pcm-recorder.worklet.js");

    this.source = this.ctx.createMediaStreamSource(this.stream);
    this.node = new AudioWorkletNode(this.ctx, "pcm-recorder", {
      processorOptions: { targetSampleRate: INPUT_SAMPLE_RATE },
    });
    this.node.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
      if (this.muted) return;
      this.onChunk(e.data, pcm16Level(e.data));
    };
    this.source.connect(this.node);
    // The worklet has no outputs connected to speakers, so no local echo.
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.stream?.getAudioTracks().forEach((t) => (t.enabled = !muted));
  }

  async stop(): Promise<void> {
    this.node?.port.close();
    this.node?.disconnect();
    this.source?.disconnect();
    this.stream?.getTracks().forEach((t) => t.stop());
    if (this.ctx && this.ctx.state !== "closed") await this.ctx.close();
    this.ctx = this.stream = this.source = this.node = null;
  }
}
