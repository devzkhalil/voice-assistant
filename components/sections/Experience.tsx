import { portfolioData } from "@/data/portfolioData";
import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <section id="experience" className="section">
      <h2 className="section-title">Experience</h2>
      <ol className="relative space-y-10 border-l border-white/10 pl-8">
        {portfolioData.experience.map((e) => (
          <li key={e.company + e.start} className="relative">
            <span className="absolute top-1.5 -left-[37px] size-3 rounded-full bg-accent ring-4 ring-zinc-950" />
            <Reveal>
              <p className="text-xs text-zinc-500">{e.start} – {e.end} · {e.location}</p>
              <h3 className="mt-1 text-lg font-semibold">{e.role} <span className="text-zinc-400">@ {e.company}</span></h3>
              <p className="mt-2 text-sm text-zinc-400">{e.summary}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                {e.achievements.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
