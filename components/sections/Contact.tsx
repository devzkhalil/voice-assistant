import { Briefcase, Code2, Globe, Mail } from "lucide-react";
import { portfolioData } from "@/data/portfolioData";
import { Reveal } from "./Reveal";

export function Contact() {
  const { contact } = portfolioData;
  const items = [
    { href: `mailto:${contact.email}`, label: contact.email, Icon: Mail },
    { href: contact.linkedin, label: "LinkedIn", Icon: Briefcase },
    { href: contact.github, label: "GitHub", Icon: Code2 },
    ...(contact.website ? [{ href: contact.website, label: "Website", Icon: Globe }] : []),
  ];
  return (
    <section id="contact" className="section">
      <Reveal>
        <div className="card text-center">
          <h2 className="section-title mb-4">Let&apos;s build something</h2>
          <p className="mx-auto max-w-xl text-zinc-400">{contact.preferredContact}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {items.map(({ href, label, Icon }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm hover:border-accent hover:text-white">
                <Icon className="size-4" />{label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
      <footer className="mt-16 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} {portfolioData.profile.name}. Voice assistant powered by the Gemini Live API.
      </footer>
    </section>
  );
}
