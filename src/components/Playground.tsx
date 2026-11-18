"use client";

import { useMemo, useState } from "react";
import { predictionObj } from "@/lib/apiSpec";
import { LEAGUES, TEAMS, teamBySlug } from "@/lib/data";
import { predict } from "@/lib/prediction";
import { snippet } from "@/lib/snippets";
import { CodePane, CodeTabs } from "./Code";

const FORMATS = [1, 3, 5] as const;

function pct(p: number) {
  return `${Math.round(p * 100)}%`;
}

function TeamSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label className="relative min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full cursor-pointer appearance-none truncate rounded-full bg-gray-4 pr-9 pl-4 text-[15px] font-medium text-dark outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {LEAGUES.map((league) => (
          <optgroup key={league} label={league}>
            {TEAMS.filter((t) => t.league === league).map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <svg className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-2" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

/** Hero product shot: a live request against the real Ratings, and the Prediction it returns. */
export function Playground() {
  const [a, setA] = useState("gen-g");
  const [b, setB] = useState("g2-esports");
  const [bestOf, setBestOf] = useState<number>(5);

  const teamA = teamBySlug(a);
  const teamB = teamBySlug(b);
  const result = useMemo(() => predict(teamA, teamB, bestOf), [teamA, teamB, bestOf]);

  const pick = (side: "a" | "b") => (v: string) => {
    if (side === "a") {
      if (v === b) setB(a);
      setA(v);
    } else {
      if (v === a) setA(b);
      setB(v);
    }
  };

  const params = { team_a: a, team_b: b, best_of: bestOf };
  const response = JSON.stringify(predictionObj(a, b, bestOf), null, 2).replace(
    /\[\n\s+([\s\S]*?)\n\s+\]/g,
    (_, inner: string) => `[${inner.replace(/\s*\n\s*/g, " ")}]`,
  );

  return (
    <div className="mx-auto grid max-w-[1080px] items-stretch gap-4 text-left md:gap-5 lg:grid-cols-[1.75fr_1fr]">
      {/* Request + response */}
      <div className="frame min-w-0">
        <div className="flex h-full flex-col rounded-[16px] bg-white">
          <div className="flex items-center justify-between px-4 pt-3.5 pb-3">
            <span className="t-sm font-semibold">Playground</span>
            <span className="t-xs flex items-center gap-1.5 text-gray-2">
              <span className="live-dot size-1.5 rounded-full bg-[#22c55e]" />
              200 OK · 42 ms
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
            <TeamSelect value={a} onChange={pick("a")} label="Team A" />
            <span className="t-sm px-1 text-gray-3">vs</span>
            <TeamSelect value={b} onChange={pick("b")} label="Team B" />
            <div className="flex rounded-full bg-gray-4 p-1" role="radiogroup" aria-label="Series format">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  role="radio"
                  aria-checked={bestOf === f}
                  onClick={() => setBestOf(f)}
                  className={`h-8 rounded-full px-3 text-[14px] font-medium transition-all duration-300 ${
                    bestOf === f ? "bg-white text-dark shadow-[0_1px_3px_rgba(16,16,17,0.12)]" : "text-gray-2 hover:text-dark"
                  }`}
                >
                  BO{f}
                </button>
              ))}
            </div>
          </div>
          <div className="mx-1 mb-1 flex flex-1 flex-col overflow-hidden rounded-[14px] bg-code">
            <CodeTabs make={(l) => snippet(l, "/predictions", params, "YOUR_API_KEY")} className="rounded-none" />
            <div className="border-t border-white/8 px-4 pt-3 text-[12px] font-medium tracking-wide text-code-muted uppercase">Response</div>
            <CodePane code={response} className="px-4 pt-2 pb-4" />
          </div>
        </div>
      </div>

      {/* Prediction card */}
      <div className="frame min-w-0">
        <div className="flex h-full flex-col gap-6 rounded-[16px] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="t-sm font-semibold">Prediction</span>
            <span className="t-xs rounded-full bg-gray-4 px-2.5 py-1 text-gray-2">BO{bestOf}</span>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { t: teamA, p: result.series },
              { t: teamB, p: 1 - result.series },
            ].map(({ t, p }, i) => (
              <div key={t.slug} className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <div className="t-xs text-gray-2">
                    {t.league} · {Math.round(t.rating)}
                  </div>
                  <div className="t-h6 truncate">{t.name}</div>
                </div>
                <div className={`text-[40px] leading-none font-semibold tracking-[-0.03em] tabular-nums ${i === 0 ? "text-dark" : "text-gray-3"}`}>
                  {pct(p)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex h-2 overflow-hidden rounded-full bg-gray-4">
            <div className="h-full rounded-full bg-primary transition-[width] duration-700 ease-[var(--ease-soft)]" style={{ width: pct(result.series) }} />
          </div>
          <div className="mt-auto">
            <div className="t-xs mb-3 text-gray-2">Per game · {teamA.name}</div>
            <div className="flex h-[92px] items-end gap-2">
              {result.games.map((p, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[11px] font-medium text-gray-2 tabular-nums">{pct(p)}</span>
                  <div className="flex h-14 w-full items-end overflow-hidden rounded-md bg-primary/10">
                    <div className="w-full rounded-md bg-primary/70 transition-[height] duration-700 ease-[var(--ease-soft)]" style={{ height: `${Math.round(p * 100)}%` }} />
                  </div>
                  <span className="text-[11px] text-gray-3">G{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
