"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  /** Analyser on the assistant's output; drives the bars while it speaks. */
  analyser: AnalyserNode | null;
  /** 0..1 RMS level of the user's mic. */
  userLevel: number;
  mode: "idle" | "listening" | "speaking" | "connecting";
  bars?: number;
}

/**
 * Bar-style waveform. Reads the AnalyserNode on every animation frame while the
 * assistant speaks, and mirrors the mic RMS level while the user speaks.
 * Framer Motion springs smooth the bar heights.
 */
export function AudioVisualizer({ analyser, userLevel, mode, bars = 5 }: Props) {
  const [levels, setLevels] = useState<number[]>(() => Array(bars).fill(0.15));
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const tick = () => {
      if (mode === "speaking" && analyser && data) {
        analyser.getByteFrequencyData(data);
        // Voice energy sits in the low bins — sample bands from the first ~40%.
        const usable = Math.floor(data.length * 0.4);
        const band = Math.max(1, Math.floor(usable / bars));
        setLevels(
          Array.from({ length: bars }, (_, i) => {
            let sum = 0;
            for (let j = i * band; j < (i + 1) * band; j++) sum += data[j];
            return Math.max(0.15, sum / band / 255);
          }),
        );
      } else if (mode === "listening") {
        // Symmetric shape around the centre, scaled by mic volume.
        setLevels(
          Array.from({ length: bars }, (_, i) => {
            const centre = 1 - Math.abs(i - (bars - 1) / 2) / bars;
            return Math.max(0.15, Math.min(1, userLevel * centre * 1.6 + Math.random() * 0.05));
          }),
        );
      } else {
        setLevels(Array(bars).fill(0.15));
      }
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [analyser, bars, mode, userLevel]);

  return (
    <div className="flex h-8 items-center justify-center gap-1" aria-hidden>
      {levels.map((l, i) => (
        <motion.span
          key={i}
          className={`w-1.5 rounded-full ${mode === "speaking" ? "bg-accent-2" : "bg-white"}`}
          animate={
            mode === "connecting"
              ? { height: ["20%", "70%", "20%"], transition: { repeat: Infinity, duration: 0.9, delay: i * 0.12 } }
              : { height: `${Math.round(l * 100)}%` }
          }
          transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.4 }}
        />
      ))}
    </div>
  );
}
