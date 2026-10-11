// Lists models that support the Live API (bidiGenerateContent) for the key in GEMINI_API_KEY.
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
for await (const m of await ai.models.list()) {
  if (m.supportedActions?.includes("bidiGenerateContent")) console.log(m.name);
}
