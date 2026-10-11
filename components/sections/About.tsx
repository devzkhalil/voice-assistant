import { portfolioData } from "@/data/portfolioData";
import { Reveal } from "./Reveal";

export function About() {
  const { profile, education, certifications } = portfolioData;
  return (
    <section id="about" className="section">
      <Reveal>
        <h2 className="section-title">About me</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <p className="text-zinc-300 md:col-span-2 leading-relaxed">{profile.longBio}</p>
          <div className="card space-y-3 text-sm">
            <p><span className="text-zinc-500">Based in</span><br />{profile.location}</p>
            <p><span className="text-zinc-500">Experience</span><br />{profile.yearsOfExperience}+ years</p>
            {education.map((e) => (
              <p key={e.institution}><span className="text-zinc-500">Education</span><br />{e.degree}, {e.institution}</p>
            ))}
            {certifications.length > 0 && <p><span className="text-zinc-500">Certifications</span><br />{certifications.join(", ")}</p>}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
