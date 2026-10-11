import type { Metadata } from "next";
import { Reveal } from "@/components/home/Reveal";
import { portfolioData } from "@/data/portfolioData";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-3xl text-textDefault">
      <h1 className="mb-6 text-2xl font-bold text-white md:text-3xl">Experience</h1>
      <ol className="relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-700">
        {portfolioData.experience.map((e) => (
          <li key={e.company + e.start} className="relative pl-8">
            <span className="absolute -left-[5px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-black" />
            <Reveal>
              <p className="text-xs text-textMuted">
                {e.start} – {e.end}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white">{e.role}</h2>
              <p className="text-sm text-accent">{e.company}</p>
              <p className="mt-2 text-sm leading-relaxed">{e.summary}</p>
              {e.tech.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.tech.map((t) => (
                    <span key={t} className="rounded border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs text-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
