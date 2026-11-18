import Link from "next/link";
import { Logo } from "./Logo";
import { Nav } from "./Nav";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#product", label: "Overview" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/docs", label: "Docs" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/legal/imprint", label: "Imprint" },
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
    ],
  },
];

const SOCIALS = [
  {
    label: "X",
    path: "M12.6 1h2.4L9.8 7l6.2 8h-4.9L7.3 10.1 2.9 15H.5l5.6-6.4L0 1h5l3.4 4.5L12.6 1zm-.8 12.6h1.3L4.2 2.3H2.8l9 11.3z",
  },
  {
    label: "LinkedIn",
    path: "M0 1.15C0 .52.52 0 1.17 0h13.66C15.48 0 16 .52 16 1.15v13.7c0 .63-.52 1.15-1.17 1.15H1.17C.52 16 0 15.48 0 14.85V1.15zM4.94 13.4V6.17H2.54v7.23h2.4zM3.74 5.18c.84 0 1.36-.56 1.36-1.25-.02-.71-.52-1.25-1.34-1.25-.82 0-1.36.54-1.36 1.25 0 .7.52 1.25 1.33 1.25h.01zm4.91 8.22V9.36c0-.22.02-.43.08-.59.17-.43.57-.88 1.23-.88.87 0 1.21.66 1.21 1.63v3.87h2.4V9.25c0-2.22-1.18-3.26-2.77-3.26-1.28 0-1.86.7-2.18 1.2V6.17h-2.4c.03.68 0 7.23 0 7.23h2.4z",
  },
  {
    label: "GitHub",
    path: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z",
  },
];

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-0 bg-dark text-white">
      <div className="container-page pt-20 pb-10 md:pt-24">
        <div className="flex flex-col justify-between gap-14 md:flex-row">
          <div>
            <Logo onDark />
            <p className="t-sm mt-6 text-gray-3">Follow us on:</p>
            <div className="mt-3 flex gap-4">
              {SOCIALS.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="text-white/90 transition-opacity hover:opacity-70">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-10 md:gap-x-24">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <h3 className="t-h6 text-white">{c.title}</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-gray-3 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-start md:justify-between">
          <p className="t-xs text-gray-3">© 2026 EBH Data</p>
          <p className="t-xs max-w-[560px] text-gray-3/80 md:text-right">
            EBH Data isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially
            involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or
            registered trademarks of Riot Games, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Page frame: content scrolls away to uncover the footer fixed underneath. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative z-10 rounded-b-[32px] bg-white [clip-path:inset(0_round_0_0_32px_32px)]">
        <Nav />
        {/* Content slides up under the transparent nav so the gradient runs to the top. */}
        <div className="-mt-[66px]">{children}</div>
      </div>
      <Footer />
    </>
  );
}
