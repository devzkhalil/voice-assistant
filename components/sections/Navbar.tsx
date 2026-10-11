import { portfolioData } from "@/data/portfolioData";

const links = ["about", "skills", "projects", "experience", "contact"];

export function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-semibold">{portfolioData.profile.name}</a>
        <ul className="hidden gap-6 text-sm text-zinc-400 sm:flex">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l}`} className="capitalize hover:text-white">{l}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
