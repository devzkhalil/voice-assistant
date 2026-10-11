import type { Metadata } from "next";
import Image from "next/image";
import { StarFillIcon } from "@primer/octicons-react";
import { Quote } from "@/components/pages/Quote";
import { Reveal } from "@/components/home/Reveal";
import { portfolioData } from "@/data/portfolioData";

export const metadata: Metadata = { title: "Colleagues" };

export default function ColleaguesPage() {
  return (
    <div className="text-textDefault">
      <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">Colleagues</h1>
      <Quote>These people&apos;s names will be remembered in golden letters in my career journey!</Quote>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {portfolioData.colleagues.map((c, i) => (
          <Reveal key={c.name + i} delay={(i % 4) * 0.05}>
            <div
              className={`flex items-center gap-3 rounded-md border p-3 transition hover:bg-bgMuted ${c.special ? "border-yellow-500/60" : "border-borderDefault"}`}
            >
              <Image
                src={`/images/colleagues/${c.image}`}
                alt={c.name}
                width={48}
                height={48}
                className="avatar h-12 w-12 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-sm font-semibold text-white">
                  {c.name}
                  {c.special && <StarFillIcon size={12} className="text-yellow-400" />}
                </p>
                <p className="truncate text-xs text-textMuted">{c.position}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
