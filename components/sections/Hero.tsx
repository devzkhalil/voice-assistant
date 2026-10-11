import { portfolioData } from "@/data/portfolioData";
import { Reveal } from "./Reveal";

export function Hero() {
  const { profile, contact } = portfolioData;
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      <div className="section relative flex min-h-[90vh] flex-col justify-center">
        <Reveal>
          <p className="mb-4 inline-block rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
            {profile.availability}
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Hi, I&apos;m {profile.firstName}.
            <br />
            <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">{profile.title}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-400">{profile.shortBio}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200">View projects</a>
            <a href={`mailto:${contact.email}`} className="rounded-full border border-white/15 px-5 py-2.5 text-sm hover:bg-white/5">Get in touch</a>
          </div>
          <p className="mt-10 text-sm text-zinc-500">🎙️ Tip: tap the glowing mic in the corner and just ask me anything.</p>
        </Reveal>
      </div>
    </section>
  );
}
