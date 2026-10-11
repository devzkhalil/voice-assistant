import { DownloadIcon } from "@primer/octicons-react";
import { Badge } from "@/components/home/Badge";
import { ContributionGraph } from "@/components/home/ContributionGraph";
import { ProfileCard } from "@/components/home/ProfileCard";
import { Reveal } from "@/components/home/Reveal";
import { portfolioData } from "@/data/portfolioData";

const { profile, contact, skills, education } = portfolioData;

export default async function Overview({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year } = await searchParams;
  const parsed = Number(year);
  const y: "last" | number = Number.isInteger(parsed) && parsed >= 2021 && parsed <= new Date().getFullYear() ? parsed : "last";

  return (
    <div className="gap-5 md:flex">
      <ProfileCard />

      <div className="mt-8 w-full md:mt-0 md:w-3/4">
        <div className="rounded-md border border-borderDefault">
          <div className="p-6">
            <ContributionGraph user="devzkhalil" year={y} startYear={2021} />
          </div>

          <div className="p-6 text-textDefault">
            <Reveal>
              <h1 className="mb-4 text-2xl font-bold text-white md:text-3xl">Hello, I&apos;m {profile.name} 👋</h1>
              <h2 className="mb-2 text-xl font-bold md:text-2xl">About Me</h2>
              <p className="mb-6 leading-relaxed">{profile.longBio}</p>
            </Reveal>

            <Reveal>
              <h2 className="mb-2 text-xl font-bold md:text-2xl">Skills</h2>
              <ul className="mb-6 list-disc space-y-2 pl-6">
                {skills.map((g) => (
                  <li key={g.category}>
                    {g.category}:{" "}
                    <span className="inline-flex flex-wrap gap-1.5 align-middle">
                      {g.items.map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="mb-2 text-xl font-bold md:text-2xl">Education</h2>
              <ul className="mb-6 list-disc space-y-1 pl-6">
                {education.map((e) => (
                  <li key={e.institution}>
                    {e.degree} <span className="text-textMuted">— {e.institution}, {e.years}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <a
                href={contact.resume}
                download
                className="inline-flex items-center gap-2 whitespace-nowrap rounded border border-slate-600 bg-slate-800 px-4 py-2 text-xs font-medium tracking-wide text-slate-200 transition hover:border-slate-500 hover:bg-slate-700 md:text-sm"
              >
                <DownloadIcon size={16} /> Download Resume
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
