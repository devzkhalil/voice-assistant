import { portfolioData } from "@/data/portfolioData";
import { Reveal } from "./Reveal";

export function Skills() {
  return (
    <section id="skills" className="section">
      <h2 className="section-title">Skills</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {portfolioData.skills.map((g, i) => (
          <Reveal key={g.category} delay={i * 0.05}>
            <div className="card h-full">
              <h3 className="mb-4 font-semibold">{g.category}</h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <li key={s} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
