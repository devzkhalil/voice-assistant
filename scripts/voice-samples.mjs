// Generates a Bangla sample for each Gemini prebuilt voice into ./voice-samples/<voice>.wav
//   node --env-file=.env.local scripts/voice-samples.mjs [model]
import fs from "node:fs";
import { GoogleGenAI, Modality } from "@google/genai";
const model = process.argv[2] ?? "gemini-3.1-flash-live-preview";
const voices = ["Kore", "Aoede", "Leda", "Zephyr", "Puck", "Charon", "Fenrir", "Orus"];
const TEXT = "আসসালামু আলাইকুম! আমি অ্যালেক্সের AI অ্যাসিস্ট্যান্ট। উনি ঢাকা থেকে রিমোটলি কাজ করেন। ওনার সম্পর্কে আপনি কী জানতে চান?";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function wav(pcm, rate = 24000) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

for (const voice of voices) {
  const chunks = [];
  let done; const fin = new Promise((r) => (done = r));
  try {
    const s = await ai.live.connect({
      model,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: "You are a voice reader. Speak the user's text exactly as written, in natural conversational Bangladeshi Bangla. Do not add anything.",
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
      },
      callbacks: {
        onmessage: (m) => {
          for (const p of m.serverContent?.modelTurn?.parts ?? []) if (p.inlineData?.data) chunks.push(Buffer.from(p.inlineData.data, "base64"));
          if (m.serverContent?.turnComplete) done();
        },
        onerror: (e) => { console.log(voice, "ERROR", e.message); done(); },
        onclose: () => done(),
      },
    });
    s.sendRealtimeInput({ text: `Read this aloud exactly: ${TEXT}` });
    await Promise.race([fin, new Promise((r) => setTimeout(r, 25000))]);
    s.close();
  } catch (e) { console.log(voice, "FAILED", String(e.message ?? e).slice(0, 100)); continue; }
  const pcm = Buffer.concat(chunks);
  fs.writeFileSync(`voice-samples/${voice}.wav`, wav(pcm));
  console.log(`${voice.padEnd(8)} ${(pcm.length / 48000).toFixed(1)}s`);
}
