"use client";

import { useState, type ReactNode } from "react";
import { LANGS, LANG_LABEL, type Lang } from "@/lib/snippets";

const TOKEN =
  /("(?:[^"\\]|\\.)*")(\s*:)?|(\b(?:import|from|const|await|library|print|true|false|null)\b)|(-?\b\d+(?:\.\d+)?\b)|(\|>|-H|\\$)/gm;

/** Minimal highlighter for the snippet languages and JSON; enough for product shots. */
export function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of code.matchAll(TOKEN)) {
    if (m.index! > last) out.push(code.slice(last, m.index));
    const [whole, str, colon, kw, num, op] = m;
    if (str && colon) {
      out.push(<span key={i++} className="text-code-key">{str}</span>, colon);
    } else if (str) {
      out.push(<span key={i++} className="text-code-string">{str}</span>);
    } else if (kw) {
      out.push(<span key={i++} className="text-code-muted">{kw}</span>);
    } else if (num) {
      out.push(<span key={i++} className="text-white">{num}</span>);
    } else if (op) {
      out.push(<span key={i++} className="text-code-muted">{op}</span>);
    } else {
      out.push(whole);
    }
    last = m.index! + whole.length;
  }
  out.push(code.slice(last));
  return out;
}

export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          /* clipboard blocked */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors ${className}`}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 7.5l2.5 2.5L11 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="4.5" y="4.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M9.5 2.5h-6a1 1 0 0 0-1 1v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )}
      {copied ? "Copied" : label}
    </button>
  );
}

export function CodePane({ code, className = "" }: { code: string; className?: string }) {
  return (
    <pre className={`overflow-x-auto font-mono text-[13px] leading-[1.65] text-code-key ${className}`}>
      <code>{highlight(code)}</code>
    </pre>
  );
}

/** Dark code window with a language switcher and copy button. */
export function CodeTabs({
  make,
  initial = "python",
  className = "",
}: {
  make: (lang: Lang) => string;
  initial?: Lang;
  className?: string;
}) {
  const [lang, setLang] = useState<Lang>(initial);
  const code = make(lang);
  return (
    <div className={`overflow-hidden rounded-2xl bg-code ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-white/8 px-3 py-2">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Language">
          {LANGS.map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={l === lang}
              onClick={() => setLang(l)}
              className={`h-8 rounded-full px-3 text-[13px] font-medium whitespace-nowrap transition-colors ${
                l === lang ? "bg-white/10 text-white" : "text-gray-3 hover:text-white"
              }`}
            >
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>
        <CopyButton text={code} className="shrink-0 text-gray-3 hover:bg-white/10 hover:text-white" />
      </div>
      <CodePane code={code} className="p-4" />
    </div>
  );
}
