"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ButtonLink } from "./Button";
import { useSession } from "@/lib/session";

const LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { session } = useSession();
  const signedIn = !!session?.subscription;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || open ? "bg-white/80 shadow-[0_1px_0_#eef0f4] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="container-page flex h-[66px] items-center justify-between" aria-label="Main">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-gray-2 transition-colors hover:text-dark">
              {l.label}
            </Link>
          ))}
          {signedIn ? (
            <ButtonLink href="/dashboard" variant="dark" size="md">
              Dashboard
            </ButtonLink>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/signup?mode=login" className="text-gray-2 transition-colors hover:text-dark">
                Log in
              </Link>
              <ButtonLink href="/signup?plan=pro" variant="dark" size="md">
                Get API key
              </ButtonLink>
            </div>
          )}
        </div>
        <button
          className="grid size-10 place-items-center rounded-full md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>
      {open && (
        <div className="container-page flex flex-col gap-1 pb-5 md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2.5 text-lg text-dark">
              {l.label}
            </Link>
          ))}
          <ButtonLink href={signedIn ? "/dashboard" : "/signup?plan=pro"} variant="dark" full className="mt-3">
            {signedIn ? "Dashboard" : "Get API key"}
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
