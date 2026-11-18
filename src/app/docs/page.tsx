import type { Metadata } from "next";
import { API_BASE } from "@/lib/data";
import { ERROR_EXAMPLE, ERROR_TYPES, LEAGUE_INFO, RESOURCES, STATUS_CODES, type Endpoint, type Field } from "@/lib/apiSpec";
import { PLANS } from "@/lib/plans";
import { JsonSample, RequestSample } from "./CodeSample";
import { DocsShell, type NavGroup } from "./DocsShell";
import { Playground } from "@/components/Playground";

export const metadata: Metadata = { title: "API Reference" };

const GUIDES = [
  { id: "introduction", title: "Introduction" },
  { id: "playground", title: "Playground" },
  { id: "authentication", title: "Authentication" },
  { id: "errors", title: "Errors" },
  { id: "rate-limits", title: "Rate limits" },
  { id: "versioning", title: "Versioning and freshness" },
  { id: "leagues", title: "League codes" },
];

const NAV: NavGroup[] = [
  { title: "Getting started", items: GUIDES },
  {
    title: "Resources",
    items: RESOURCES.map((r) => ({
      id: r.id,
      title: r.title,
      children: [
        { id: `${r.id}-object`, title: `The ${r.object.name} object` },
        ...r.endpoints.map((e) => ({ id: e.id, title: e.title, method: e.method })),
      ],
    })),
  },
];

/* ---------- building blocks ---------- */

/** Prose on the left, code pinned on the right from 1280px; stacked below. */
function Row({ id, left, right, first }: { id: string; left: React.ReactNode; right?: React.ReactNode; first?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-[116px] px-4 py-12 md:px-10 lg:scroll-mt-[64px] ${first ? "" : "border-t border-[#eceef3]"}`}>
      <div className="mx-auto grid max-w-[1180px] gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-14">
        <div className="min-w-0">{left}</div>
        {right && <div className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-[84px] xl:self-start">{right}</div>}
      </div>
    </section>
  );
}

function H({ children, level = 2 }: { children: React.ReactNode; level?: 1 | 2 | 3 }) {
  const cls = level === 1 ? "t-h3" : level === 2 ? "t-h5" : "t-h6";
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  return <Tag className={cls}>{children}</Tag>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-[15px] leading-[1.6] text-gray-2">{children}</p>;
}

function C({ children }: { children: React.ReactNode }) {
  return <code className="rounded-md bg-gray-4 px-1.5 py-0.5 font-mono text-[13px] text-dark">{children}</code>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <h4 className="t-xs mt-8 mb-1 font-semibold tracking-wider text-gray-3 uppercase">{children}</h4>;
}

function Fields({ fields }: { fields: Field[] }) {
  return (
    <ul className="border-b border-[#eceef3]">
      {fields.map((f) => (
        <li key={f.name} className="border-t border-[#eceef3] py-3.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <code className="font-mono text-[13.5px] font-semibold text-dark">{f.name}</code>
            <span className="font-mono text-[12px] text-gray-2">{f.type}</span>
            {f.nullable && <span className="font-mono text-[12px] text-gray-3">nullable</span>}
            {f.required && <span className="text-[11px] font-semibold tracking-wide text-[#c2410c] uppercase">required</span>}
          </div>
          <p className="mt-1 text-[14px] leading-[1.55] text-gray-2">{f.desc}</p>
          {(f.values || f.default) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] text-gray-2">
              {f.values && (
                <>
                  <span>One of</span>
                  {f.values.map((v) => (
                    <C key={v}>{v}</C>
                  ))}
                </>
              )}
              {f.default && (
                <span className={f.values ? "ml-2" : ""}>
                  Default <C>{f.default}</C>
                </span>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function Table({ head, rows, mono = [0] }: { head: string[]; rows: readonly (readonly string[])[]; mono?: number[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl shadow-[0_0_0_1px_#eceef3]">
      <table className="w-full text-left text-[14px]">
        {head.some(Boolean) && (
          <thead className="bg-[#f8f9fb] text-[12px] text-gray-2">
            <tr>
              {head.map((h) => (
                <th key={h} className="px-4 py-2.5 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-[#eceef3]">
          {rows.map((r) => (
            <tr key={r[0]} className="align-top">
              {r.map((cell, i) => (
                <td key={i} className={`px-4 py-2.5 ${mono.includes(i) ? "font-mono text-[13px] font-semibold whitespace-nowrap text-dark" : "text-gray-2"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MethodPath({ method, path }: { method: string; path: string }) {
  return (
    <div className="mt-3 flex w-fit max-w-full items-center gap-2 overflow-x-auto rounded-lg bg-gray-4 px-3 py-2 font-mono text-[13px]">
      <span className="font-semibold text-[#15803d]">{method}</span>
      <span className="text-gray-3">/v1/pro-play</span>
      <span className="-ml-2 text-dark">{path}</span>
    </div>
  );
}

function EndpointRow({ e }: { e: Endpoint }) {
  return (
    <Row
      id={e.id}
      left={
        <>
          <H level={3}>{e.title}</H>
          <MethodPath method={e.method} path={e.path} />
          <P>{e.desc}</P>
          {e.pathParams && (
            <>
              <Label>Path parameters</Label>
              <Fields fields={e.pathParams} />
            </>
          )}
          {e.query && (
            <>
              <Label>Query parameters</Label>
              <Fields fields={e.query} />
            </>
          )}
          <Label>Returns</Label>
          <p className="text-[14px] text-gray-2">{e.returns} Errors follow the standard error format.</p>
        </>
      }
      right={
        <>
          <RequestSample method={e.method} path={e.example.path} params={e.example.params} />
          <JsonSample title="Response" status="200" json={e.response} />
        </>
      }
    />
  );
}

/* ---------- page ---------- */

export default function DocsPage() {
  return (
    <DocsShell groups={NAV}>
      <Row
        id="introduction"
        first
        left={
          <>
            <p className="t-xs mb-3 font-semibold tracking-wider text-primary uppercase">EBH Pro Play API · v1</p>
            <H level={1}>API reference</H>
            <P>
              A REST API over HTTPS for League of Legends esports data: Ratings, Predictions, Champion Stats and Team Profiles. Every
              endpoint is a <C>GET</C> and returns JSON.
            </P>
            <Label>Conventions</Label>
            <Table
              head={["", ""]}
              mono={[0]}
              rows={[
                ["Base URL", API_BASE],
                ["IDs", "Teams are addressed by slug, e.g. gen-g"],
                ["Dates", "ISO 8601 calendar dates, YYYY-MM-DD"],
                ["Rates", "Probabilities and rates are numbers from 0 to 1"],
                ["Lists", "Wrapped in an object with data and has_more"],
                ["Nulls", "Unknown values are null, never omitted"],
              ]}
            />
          </>
        }
        right={<JsonSample title="List envelope" json={{ object: "list", data: ["…"], has_more: false }} />}
      />

      <section id="playground" className="scroll-mt-[116px] border-t border-[#eceef3] bg-[#f8f9fb] px-4 py-12 md:px-10 lg:scroll-mt-[64px]">
        <div className="mx-auto max-w-[1180px]">
          <H>Playground</H>
          <P>
            Pick two Teams and a format. The Prediction is computed live from current Ratings, exactly as <C>GET /predictions</C>{" "}
            returns it. No key needed.
          </P>
          <div className="mt-8">
            <Playground />
          </div>
        </div>
      </section>

      <Row
        id="authentication"
        left={
          <>
            <H>Authentication</H>
            <P>
              Send your API key as a bearer token in the <C>Authorization</C> header. Keys start with <C>ebh_live_</C>. One key covers
              every API you have a Subscription for.
            </P>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-[14px] leading-[1.55] text-gray-2">
              <li>Keep the key server-side. Never ship it in a browser or mobile app.</li>
              <li>Regenerating a key in the dashboard disables the old one immediately.</li>
              <li>Requests without a valid key return <C>401</C>.</li>
            </ul>
          </>
        }
        right={
          <>
            <RequestSample method="GET" path="/teams" params={{}} />
            <JsonSample
              title="Response"
              status="401"
              json={{ error: { type: "authentication_error", code: "invalid_api_key", message: "The API key is invalid or was regenerated.", param: null } }}
            />
          </>
        }
      />

      <Row
        id="errors"
        left={
          <>
            <H>Errors</H>
            <P>Failures use standard HTTP status codes and a JSON body with an error object.</P>
            <Label>Status codes</Label>
            <Table head={["Code", "Status", "Meaning"]} mono={[0]} rows={STATUS_CODES} />
            <Label>Error types</Label>
            <Table head={["type", "Meaning"]} rows={ERROR_TYPES} />
          </>
        }
        right={
          <>
            <JsonSample title="Error object" status="404" json={ERROR_EXAMPLE} />
          </>
        }
      />

      <Row
        id="rate-limits"
        left={
          <>
            <H>Rate limits</H>
            <P>Each Plan includes a monthly number of requests. Every response reports where you stand.</P>
            <Label>Monthly requests</Label>
            <Table head={["Plan", "Requests / month"]} rows={PLANS.map((p) => [p.name, p.requests.toLocaleString("en-US")])} mono={[]} />
            <Label>Response headers</Label>
            <Table
              head={["Header", "Meaning"]}
              rows={[
                ["X-RateLimit-Limit", "Requests included this month"],
                ["X-RateLimit-Remaining", "Requests left this month"],
                ["X-RateLimit-Reset", "Unix time when the count resets"],
              ]}
            />
          </>
        }
        right={<JsonSample title="Response headers" json={`HTTP/1.1 200 OK\nContent-Type: application/json\nX-RateLimit-Limit: 100000\nX-RateLimit-Remaining: 99873\nX-RateLimit-Reset: 1796083200`} />}
      />

      <Row
        id="versioning"
        left={
          <>
            <H>Versioning and freshness</H>
            <P>
              The version is part of the path: <C>/v1</C>. We add endpoints, fields and enum values without notice, so ignore fields you
              don’t know. Breaking changes ship as a new version, announced in advance.
            </P>
            <P>
              Data updates after every match day. Every response says how current it is through <C>as_of</C> or <C>ratings_as_of</C>.
              Values the source never recorded are estimated and named in <C>estimated</C>.
            </P>
          </>
        }
        right={<JsonSample title="Freshness fields" json={{ as_of: "2026-10-23", estimated: ["gold_diff_15", "xp_diff_15"] }} />}
      />

      <Row
        id="leagues"
        left={
          <>
            <H>League codes</H>
            <P>
              Pass these as <C>league</C>. Ratings cover 50+ leagues; these four are the main ones.
            </P>
            <Table head={["Code", "League", "Region"]} rows={LEAGUE_INFO.map((l) => [l.code, l.name, l.region])} />
          </>
        }
      />

      {RESOURCES.map((r) => (
        <div key={r.id}>
          <Row
            id={r.id}
            left={
              <>
                <p className="t-xs mb-2 font-semibold tracking-wider text-gray-3 uppercase">Resource</p>
                <H level={2}>{r.title}</H>
                <P>{r.desc}</P>
                <Label>Endpoints</Label>
                <ul className="flex flex-col gap-1.5">
                  {r.endpoints.map((e) => (
                    <li key={e.id}>
                      <a href={`#${e.id}`} className="flex items-center gap-3 font-mono text-[13px] hover:underline">
                        <span className="w-8 font-semibold text-[#15803d]">{e.method}</span>
                        <span className="text-dark">{e.path}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            }
          />
          <Row
            id={`${r.id}-object`}
            left={
              <>
                <H level={3}>The {r.object.name} object</H>
                <Label>Attributes</Label>
                <Fields fields={r.object.fields} />
              </>
            }
            right={<JsonSample title={`The ${r.object.name} object`} json={r.object.example} />}
          />
          {r.endpoints.map((e) => (
            <EndpointRow key={e.id} e={e} />
          ))}
        </div>
      ))}
    </DocsShell>
  );
}
