"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CodePane, CopyButton } from "@/components/Code";
import { LANGS, LANG_LABEL, snippet, type Lang } from "@/lib/snippets";

const STORAGE = "ebh-docs-lang";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "curl", setLang: () => {} });

/** One language choice for every code sample on the page, remembered per browser. */
export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("curl");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE) as Lang | null;
      if (saved && LANGS.includes(saved)) setLangState(saved);
    } catch {
      /* storage blocked */
    }
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE, l);
    } catch {
      /* storage blocked */
    }
  };
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

function Card({ head, children }: { head: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-code shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="flex h-11 items-center justify-between gap-3 border-b border-white/8 bg-white/[0.03] pr-2 pl-4">{head}</div>
      {children}
    </div>
  );
}

export function RequestSample({ method, path, params }: { method: string; path: string; params: Record<string, string | number> }) {
  const { lang, setLang } = useContext(LangContext);
  const code = snippet(lang, path, params, "YOUR_API_KEY");
  return (
    <Card
      head={
        <>
          <span className="flex min-w-0 items-center gap-2 font-mono text-[12px]">
            <span className="font-semibold text-[#4ade80]">{method}</span>
            <span className="truncate text-code-key">{path}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <label className="relative">
              <span className="sr-only">Language</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="h-8 cursor-pointer appearance-none rounded-full bg-white/8 pr-7 pl-3 text-[12px] font-medium text-white outline-none hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-primary"
              >
                {LANGS.map((l) => (
                  <option key={l} value={l} className="text-dark">
                    {LANG_LABEL[l]}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-3" width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>
            <CopyButton text={code} className="text-gray-3 hover:bg-white/10 hover:text-white" />
          </span>
        </>
      }
    >
      <CodePane code={code} className="p-4" />
    </Card>
  );
}

export function JsonSample({ title, json, status }: { title: string; json: unknown; status?: string }) {
  const code = typeof json === "string" ? json : JSON.stringify(json, null, 2);
  return (
    <Card
      head={
        <>
          <span className="flex items-center gap-2 text-[12px] font-medium tracking-wide text-code-muted uppercase">
            {title}
            {status && (
              <span className={`rounded px-1.5 py-0.5 font-mono normal-case ${status.startsWith("2") ? "bg-[#22c55e]/15 text-[#4ade80]" : "bg-[#f59e0b]/15 text-[#fbbf24]"}`}>
                {status}
              </span>
            )}
          </span>
          <CopyButton text={code} className="text-gray-3 hover:bg-white/10 hover:text-white" />
        </>
      }
    >
      <CodePane code={code} className="max-h-[420px] overflow-y-auto p-4" />
    </Card>
  );
}
