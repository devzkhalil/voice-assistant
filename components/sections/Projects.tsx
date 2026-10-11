import { Code2, ExternalLink } from "lucide-react";
import { portfolioData } from "@/data/portfolioData";
import { Reveal } from "./Reveal";

export function Projects() {
  return (
    <section id="projects" className="section">
      <h2 className="section-title">Projects</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {portfolioData.projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.05}>
            <article className="card flex h-full flex-col transition hover:border-accent/50">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-accent-2">{p.tagline}</p>
              <p className="mt-3 flex-1 text-sm text-zinc-400">{p.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <li key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-300">{t}</li>
                ))}
              </ul>
              <div className="mt-4 flex gap-4 text-sm">
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-accent"><ExternalLink className="size-4" />Live</a>}
                {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-accent"><Code2 className="size-4" />Code</a>}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
