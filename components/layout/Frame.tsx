"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookIcon,
  ChecklistIcon,
  ChevronDownIcon,
  DeviceDesktopIcon,
  PeopleIcon,
  ProjectIcon,
  ThreeBarsIcon,
} from "@primer/octicons-react";

/** Pages shown in the "Also" menu. The first match for the current path sets the left notch title. */
const PAGES = [
  { href: "/", label: "Overview", icon: BookIcon },
  { href: "/projects", label: "Projects", icon: ProjectIcon },
  { href: "/experience", label: "Experience", icon: ChecklistIcon },
  { href: "/device-setup", label: "Device Setup", icon: DeviceDesktopIcon },
  { href: "/colleagues", label: "Colleague", icon: PeopleIcon },
];

const VERSIONS = [
  { label: "v3", href: "/", current: true },
  { label: "v1", href: "https://devzkhalil.vercel.app", current: false },
];

/** The angled "tail" that joins a notch tab to the panel border. Same curve as the v3 site. */
function NotchTail() {
  return (
    <svg className="notch-tail" viewBox="0 0 60 42" fill="none" preserveAspectRatio="none" aria-hidden>
      <path
        d="M0 1H7.08C14.77 1 21.78 5.44 25.11 12.37L33.89 30.67C37.22 37.61 44.23 42 51.92 42H59H0V1Z"
        fill="var(--frame-bg)"
      />
      <path
        d="M0 1H7.08C14.77 1 21.78 5.44 25.11 12.37L33.89 30.67C37.22 37.61 44.23 42 51.92 42H59"
        stroke="var(--frame-stroke)"
        strokeWidth="1"
      />
    </svg>
  );
}

function Menu({ open, onClose, items, active }: {
  open: boolean;
  onClose: () => void;
  items: { href: string; label: string; icon?: React.ElementType; external?: boolean }[];
  active: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && !(e.target as HTMLElement).closest("[data-menu-trigger]")) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-3 top-[42px] z-30 min-w-56 origin-top-right rounded-sm border border-gray-700 bg-gray-900 shadow-xl"
        >
          {items.map((it, i) => {
            const Icon = it.icon;
            const isActive = it.href === active;
            const cls = `flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-gray-100 transition hover:bg-gray-700 hover:text-white ${i ? "border-t border-gray-700" : ""} ${isActive ? "bg-gray-700 text-white" : ""}`;
            return it.external ? (
              <a key={it.href} href={it.href} target="_blank" rel="noreferrer" className={cls}>
                {it.label}
              </a>
            ) : (
              <Link key={it.href} href={it.href} onClick={onClose} className={cls}>
                {Icon && <Icon size={16} />}
                <span>{it.label}</span>
              </Link>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** App chrome: notched header + bordered content panel (the v3 "dialog" look). */
export function Frame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);

  const page = PAGES.find((p) => (p.href === "/" ? pathname === "/" : pathname.startsWith(p.href))) ?? PAGES[0];

  // Close menus on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setVersionOpen(false);
  }, [pathname]);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:py-5">
      <header className="frame-nav">
        <div className="notch" data-side="left">
          <Link href="/" className="pill !border-0 !text-base !font-semibold !text-gray-200 !shadow-none">
            {page.label}
          </Link>
          <NotchTail />
        </div>

        <div className="notch" data-side="right">
          <div className="flex items-center gap-3">
            <button
              data-menu-trigger
              onClick={() => {
                setVersionOpen((v) => !v);
                setMenuOpen(false);
              }}
              className="pill ml-4"
              aria-haspopup="menu"
              aria-expanded={versionOpen}
            >
              v3
              <ChevronDownIcon size={14} />
            </button>
            <button
              data-menu-trigger
              onClick={() => {
                setMenuOpen((v) => !v);
                setVersionOpen(false);
              }}
              className="pill"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              Also
              <ThreeBarsIcon size={14} />
            </button>
          </div>
          <NotchTail />
        </div>
      </header>

      <main className="frame-panel flex-1 p-3 md:p-6">{children}</main>

      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={PAGES.map((p) => ({ href: p.href, label: p.label, icon: p.icon }))}
        active={page.href}
      />
      <Menu
        open={versionOpen}
        onClose={() => setVersionOpen(false)}
        items={VERSIONS.map((v) => ({ href: v.href, label: v.label, external: !v.current }))}
        active="/"
      />
    </div>
  );
}
