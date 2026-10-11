import type { Metadata } from "next";
import { LinkExternalIcon, RepoIcon } from "@primer/octicons-react";
import { Reveal } from "@/components/home/Reveal";
import { portfolioData, type Project } from "@/data/portfolioData";

export const metadata: Metadata = { title: "Projects" };

function Card({ p }: { p: Project }) {
  const href = p.liveUrl ?? p.repoUrl;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col rounded-md border border-borderDefault p-4 transition hover:border-borderEmphasis hover:bg-bgMuted"
    >
      <div className="flex items-center gap-2 text-sm">
        <RepoIcon size={16} className="text-textMuted" />
        <span className="truncate font-semibold text-accent group-hover:underline">{p.name}</span>
        <LinkExternalIcon size={12} className="ml-auto shrink-0 text-textMuted" />
      </div>
      <p className="mt-2 text-xs font-medium text-textDefault">{p.tagline}</p>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-textMuted">{p.description}</p>
      {p.tech.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span key={t} className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
              {t}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}

function Grid({ items }: { items: Project[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => (
        <Reveal key={p.name} delay={(i % 3) * 0.06}>
          <Card p={p} />
        </Reveal>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="text-textDefault">
      <h1 className="mb-1 text-2xl font-bold text-white md:text-3xl">Projects</h1>
      <p className="mb-6 text-sm text-textMuted">Live products I&apos;ve worked on, and open-source packages I&apos;ve published.</p>

      <h2 className="mb-3 text-lg font-semibold text-white">Live projects</h2>
      <Grid items={portfolioData.projects} />

      <h2 className="mb-3 mt-10 text-lg font-semibold text-white">Open source</h2>
      <Grid items={portfolioData.openSource} />
    </div>
  );
}
