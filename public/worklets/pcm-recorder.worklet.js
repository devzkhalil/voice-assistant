/**
 * AudioWorkletProcessor that runs on the audio rendering thread.
 * - Receives Float32 mic samples at the AudioContext's native rate (44.1/48 kHz).
 * - Downsamples to 16 kHz with simple averaging (adequate for speech).
 * - Converts to Int16 PCM and posts ~32 ms chunks to the main thread.
 *
 * Small chunks keep end-to-end latency low; Gemini's server-side VAD handles turn-taking.
 */
class PcmRecorderProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.targetRate = (options.processorOptions && options.processorOptions.targetSampleRate) || 16000;
    this.ratio = sampleRate / this.targetRate; // `sampleRate` is a worklet global
    this.chunkSize = Math.round(this.targetRate * 0.032); // 512 samples @16k
    this.buffer = new Int16Array(this.chunkSize);
    this.offset = 0;
    this.carry = 0; // fractional read position across render quanta
  }

  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel) return true;

    let pos = this.carry;
    while (pos < channel.length) {
      // Average the source samples that map onto one output sample.
      const start = Math.floor(pos);
      const end = Math.min(channel.length, Math.floor(pos + this.ratio));
      let sum = 0;
      let n = 0;
      for (let i = start; i < end; i++) {
        sum += channel[i];
        n++;
      }
      const s = Math.max(-1, Math.min(1, n ? sum / n : channel[start]));
      this.buffer[this.offset++] = s < 0 ? s * 0x8000 : s * 0x7fff;

      if (this.offset === this.chunkSize) {
        // Transfer the underlying buffer (zero-copy) and start a new one.
        this.port.postMessage(this.buffer.buffer, [this.buffer.buffer]);
        this.buffer = new Int16Array(this.chunkSize);
        this.offset = 0;
      }
      pos += this.ratio;
    }
    this.carry = pos - channel.length;
    return true;
  }
}

registerProcessor("pcm-recorder", PcmRecorderProcessor);
