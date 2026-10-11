"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircleIcon } from "@primer/octicons-react";
import { Quote } from "@/components/pages/Quote";
import type { DeviceGroup } from "@/data/portfolioData";

const TABS = [
  { key: "current", label: "Current" },
  { key: "nov2025", label: "Nov 2025" },
] as const;

export function DeviceTabs({ devices }: { devices: Record<"current" | "nov2025", DeviceGroup[]> }) {
  const [tab, setTab] = useState<"current" | "nov2025">("current");

  return (
    <div className="text-textDefault">
      <Quote>
        No matter what else life may have, I want a good desk setup for myself!
        <br />
        But for now, this is what I have!
      </Quote>

      <div className="mb-6 flex gap-6 border-b border-borderDefault">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`border-b-2 px-1 py-2 text-sm font-medium transition-colors ${tab === t.key ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-300"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {devices[tab].map((g) => (
          <section key={g.title}>
            <h2 className="mb-3 text-xl font-extrabold text-white md:text-2xl">{g.title}</h2>
            <div className="space-y-2">
              {g.specs.map((s) => (
                <div key={s.label} className="flex items-start justify-between gap-3 rounded-lg border-2 border-borderDefault p-4 text-sm">
                  <div>
                    <p className="font-medium text-white">{s.label}</p>
                    <p className="text-textMuted">{s.value}</p>
                  </div>
                  <CheckCircleIcon size={20} className="shrink-0 text-textDefault" />
                </div>
              ))}
            </div>
            <Image
              src={g.image}
              alt={g.title}
              width={800}
              height={500}
              className="mt-3 w-full rounded opacity-70"
            />
          </section>
        ))}
      </div>
    </div>
  );
}
