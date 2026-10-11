"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { LocationIcon, MarkGithubIcon, OrganizationIcon, XIcon, MailIcon } from "@primer/octicons-react";
import { portfolioData } from "@/data/portfolioData";

const { profile, contact, organizations } = portfolioData;

/** Rotating one-liner under the name (v3's title slider). */
function RoleSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % profile.roles.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative h-6 overflow-hidden text-textMuted">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

const Linked = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <li className="mb-1.5 flex items-center gap-2">
    <span className="text-textMuted">{icon}</span>
    <a href={href} target="_blank" rel="noreferrer" className="text-sm text-textDefault hover:text-blue-500 hover:underline">
      {children}
    </a>
  </li>
);

// Brand glyphs Octicons doesn't ship.
const Fb = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.3-1.6 1.7-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.3h2.9V22h3.3Z" /></svg>
);
const Li = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.54h.05c.53-1 1.82-2.04 3.75-2.04 4 0 4.75 2.63 4.75 6.05V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.69V21h-4V9.75Z" /></svg>
);
const Ig = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
);

export function ProfileCard() {
  return (
    <aside className="w-full md:sticky md:top-0 md:w-1/4 md:self-start">
      <div className="flex items-center gap-4">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={296}
            height={296}
            priority
            className="avatar h-[120px] w-[120px] rounded object-cover md:h-[296px] md:w-[296px]"
          />
        </motion.div>
        <h2 className="text-2xl font-bold leading-tight text-white md:hidden">{profile.name}</h2>
      </div>

      <div className="py-4 text-white">
        <h2 className="hidden text-2xl font-bold leading-tight md:block">{profile.name}</h2>
        <div className="mt-4">
          <RoleSlider />
        </div>
      </div>

      <ul className="mb-5 mt-2">
        <li className="mb-1.5 flex items-center gap-2 text-sm text-textDefault">
          <span className="text-textMuted"><OrganizationIcon size={16} /></span>
          {profile.company}
        </li>
        <li className="mb-1.5 flex items-center gap-2 text-sm text-textDefault">
          <span className="text-textMuted"><LocationIcon size={16} /></span>
          {profile.location}
        </li>
        <Linked href={`mailto:${contact.email}`} icon={<MailIcon size={16} />}>{contact.email}</Linked>
        <Linked href={contact.x} icon={<XIcon size={16} />}>@devzkhalil</Linked>
        <Linked href={contact.facebook} icon={<Fb />}>devzkhalil</Linked>
        <Linked href={contact.linkedin} icon={<Li />}>in/devzkhalil</Linked>
        <Linked href={contact.instagram} icon={<Ig />}>devzkhalil</Linked>
        <Linked href={contact.github} icon={<MarkGithubIcon size={16} />}>devzkhalil</Linked>
      </ul>

      <hr className="border-borderDefault" />
      <div className="mt-3">
        <h3 className="font-bold text-textDefault">Organizations</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {organizations.map((o) => {
            const img = (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={o.avatar} alt={o.name} title={o.name} width={32} height={32} className="avatar h-8 w-8 rounded-md" />
            );
            return o.url ? (
              <a key={o.name} href={o.url} target="_blank" rel="noreferrer">{img}</a>
            ) : (
              <span key={o.name}>{img}</span>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
