"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/Button";
import { CopyButton } from "@/components/Code";
import { Logo } from "@/components/Logo";
import { API_BASE } from "@/lib/data";
import { useSession } from "@/lib/session";
import { LangProvider } from "./CodeSample";

export type NavItem = { id: string; title: string; method?: string; children?: NavItem[] };
export type NavGroup = { title: string; items: NavItem[] };

function flatten(groups: NavGroup[]) {
  return groups.flatMap((g) => g.items.flatMap((i) => [i, ...(i.children ?? [])]));
}

/** Tracks which section is under the header as the page scrolls. */
function useActive(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids[ids.length - 1];
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}

function NavLink({ item, active, nested }: { item: NavItem; active: string; nested?: boolean }) {
  const on = item.id === active;
  return (
    <a
      href={`#${item.id}`}
      aria-current={on ? "location" : undefined}
      className={`flex items-center gap-2 rounded-lg py-1.5 pr-2 text-[14px] transition-colors ${nested ? "pl-5" : "pl-3"} ${
        on ? "bg-gray-4 font-semibold text-dark" : "text-gray-2 hover:text-dark"
      }`}
    >
      {item.method && <span className="w-7 shrink-0 font-mono text-[10px] font-semibold text-[#15803d]">{item.method}</span>}
      <span className="truncate">{item.title}</span>
    </a>
  );
}

export function DocsShell({ groups, children }: { groups: NavGroup[]; children: React.ReactNode }) {
  const [ids] = useState(() => flatten(groups).map((i) => i.id));
  const active = useActive(ids);
  const { session } = useSession();

  return (
    <LangProvider>
      <div className="min-h-dvh bg-white">
        <header className="sticky top-0 z-40 border-b border-[#eceef3] bg-white/90 backdrop-blur-xl">
          <div className="flex h-[60px] items-center justify-between gap-4 px-4 md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Logo />
              <span className="hidden h-5 w-px bg-[#e3e6ed] sm:block" />
              <span className="t-sm hidden font-semibold sm:inline">API Reference</span>
              <span className="t-xs hidden rounded-full bg-gray-4 px-2 py-0.5 font-mono text-gray-2 sm:inline">v1</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1 rounded-full bg-gray-4 py-1 pr-1 pl-3 lg:flex">
                <code className="font-mono text-[12px] text-gray-2">{API_BASE}</code>
                <CopyButton text={API_BASE} label="" className="h-7 px-2 text-gray-2 hover:bg-white hover:text-dark" />
              </div>
              <Link href="/" className="t-sm hidden text-gray-2 hover:text-dark md:inline">
                Home
              </Link>
              <ButtonLink href={session?.subscription ? "/dashboard" : "/signup?plan=pro"} variant="dark" size="md">
                {session?.subscription ? "Dashboard" : "Get API key"}
              </ButtonLink>
            </div>
          </div>
          {/* Phone and tablet: jump menu instead of the sidebar */}
          <div className="border-t border-[#eceef3] px-4 py-2 lg:hidden">
            <label className="relative block">
              <span className="sr-only">Jump to section</span>
              <select
                value={active}
                onChange={(e) => {
                  document.getElementById(e.target.value)?.scrollIntoView();
                  history.replaceState(null, "", `#${e.target.value}`);
                }}
                className="h-9 w-full appearance-none rounded-full bg-gray-4 pr-8 pl-4 text-[14px] font-medium outline-none"
              >
                {groups.map((g) => (
                  <optgroup key={g.title} label={g.title}>
                    {g.items.flatMap((i) => [i, ...(i.children ?? [])]).map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.method ? `${i.method} · ${i.title}` : i.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <svg className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-2" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="sticky top-[60px] hidden h-[calc(100dvh-60px)] overflow-y-auto border-r border-[#eceef3] px-4 py-8 lg:block">
            <nav aria-label="API reference" className="flex flex-col gap-7">
              {groups.map((g) => (
                <div key={g.title}>
                  <p className="t-xs mb-2 px-3 font-semibold tracking-wider text-gray-3 uppercase">{g.title}</p>
                  <ul className="flex flex-col gap-0.5">
                    {g.items.map((i) => {
                      const open = i.id === active || i.children?.some((c) => c.id === active);
                      return (
                        <li key={i.id}>
                          <NavLink item={i} active={active} />
                          {i.children && open && (
                            <ul className="mt-0.5 flex flex-col gap-0.5">
                              {i.children.map((c) => (
                                <li key={c.id}>
                                  <NavLink item={c} active={active} nested />
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <main className="min-w-0">
            {children}
            <footer className="t-sm flex flex-wrap items-center justify-between gap-4 border-t border-[#eceef3] px-4 py-8 text-gray-2 md:px-10">
              <span>© 2026 EBH Data</span>
              <span className="flex gap-5">
                {[
                  ["/legal/imprint", "Imprint"],
                  ["/legal/privacy", "Privacy"],
                  ["/legal/terms", "Terms"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="hover:text-dark">
                    {label}
                  </Link>
                ))}
              </span>
            </footer>
          </main>
        </div>
      </div>
    </LangProvider>
  );
}
