"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { CodePane, CodeTabs, CopyButton } from "@/components/Code";
import { Logo } from "@/components/Logo";
import { AS_OF, TEAMS } from "@/lib/data";
import { PLANS, formatRequests, planById, type PlanId } from "@/lib/plans";
import { formatDate, maskKey, newApiKey, useSession, type Session } from "@/lib/session";
import { snippet } from "@/lib/snippets";

const SAMPLE_PATH = "/ratings";
const SAMPLE_PARAMS = { league: "LCK" };

function today() {
  return new Date().toISOString().slice(0, 10);
}

function Panel({ title, action, children, className = "" }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card min-w-0 ${className}`}>
      <div className="h-full rounded-[20px] bg-white p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="t-h6">{title}</h2>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

function KeyReveal({ session, onSaved }: { session: Session; onSaved: () => void }) {
  const key = session.apiKey!.value;
  return (
    <section className="frame">
      <div className="rounded-[16px] bg-white p-5 md:p-7">
        <span className="t-xs inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
          <span className="size-1.5 rounded-full bg-primary" /> Trial active
        </span>
        <h1 className="t-h3 mt-4">Here’s your API key</h1>
        <p className="t-md mt-2 text-gray-2">Copy it now. For your security we only show it once.</p>
        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-gray-4 p-2 pl-4 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 font-mono text-[14px] break-all text-dark md:text-[16px]">{key}</code>
          <CopyButton text={key} label="Copy key" className="h-10 justify-center bg-dark px-4 text-white hover:bg-dark-hover" />
        </div>
        <p className="t-sm mt-8 mb-3 font-semibold">Paste it into your code</p>
        <CodeTabs make={(l) => snippet(l, SAMPLE_PATH, SAMPLE_PARAMS, key)} />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="t-sm text-gray-2">Store it like a password, for example in an environment variable.</p>
          <Button variant="dark" onClick={onSaved}>
            I’ve saved my key
          </Button>
        </div>
      </div>
    </section>
  );
}

function KeyPanel({ session, onRegenerate }: { session: Session; onRegenerate: () => void }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <Panel
      title="API key"
      action={
        !confirm && (
          <Button variant="ghost" size="md" onClick={() => setConfirm(true)}>
            Regenerate
          </Button>
        )
      }
    >
      <div className="flex items-center gap-3 rounded-2xl bg-gray-4 px-4 py-3.5">
        <code className="min-w-0 flex-1 truncate font-mono text-[15px]">{maskKey(session.apiKey!.value)}</code>
        <span className="t-xs shrink-0 text-gray-2">Created {formatDate(session.apiKey!.createdAt)}</span>
      </div>
      {confirm && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#fff6e8] p-4">
          <p className="t-sm text-dark/80">The current key stops working immediately.</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="md" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button variant="dark" size="md" onClick={onRegenerate}>
              Regenerate key
            </Button>
          </div>
        </div>
      )}
      <div className="mt-5">
        <CodeTabs make={(l) => snippet(l, SAMPLE_PATH, SAMPLE_PARAMS, "YOUR_API_KEY")} />
      </div>
    </Panel>
  );
}

function UsagePanel({ session, onRequest }: { session: Session; onRequest: () => void }) {
  const plan = planById(session.subscription!.plan);
  const usage = session.usage ?? {};
  const month = today().slice(0, 7);
  const used = Object.entries(usage)
    .filter(([d]) => d.startsWith(month))
    .reduce((s, [, n]) => s + n, 0);
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return usage[d.toISOString().slice(0, 10)] ?? 0;
  });
  const peak = Math.max(1, ...days);
  const [response, setResponse] = useState<string | null>(null);

  const send = () => {
    onRequest();
    const lck = TEAMS.filter((t) => t.league === "LCK");
    setResponse(
      JSON.stringify(
        { league: "LCK", as_of: AS_OF, ratings: lck.map((t) => ({ team: t.slug, rating: Math.round(t.rating), rd: Math.round(t.rd) })) },
        null,
        2,
      ),
    );
  };

  return (
    <Panel
      title="Usage"
      action={
        <Button variant="ghost" size="md" onClick={send}>
          Send test request
        </Button>
      }
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="t-h4 tabular-nums">{used.toLocaleString("en-US")}</div>
        <div className="t-sm text-gray-2">of {plan.requests.toLocaleString("en-US")} this month</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-4">
        <div className="h-full rounded-full bg-dark transition-[width] duration-500" style={{ width: `${Math.max(used > 0 ? 1 : 0, (used / plan.requests) * 100)}%` }} />
      </div>
      <div className="mt-6 flex h-24 items-end gap-[3px]" aria-label="Requests per day, last 30 days">
        {days.map((n, i) => (
          <div key={i} className="flex h-full flex-1 items-end rounded-sm bg-gray-4/70">
            <div className="w-full rounded-sm bg-secondary/80 transition-[height] duration-500" style={{ height: `${(n / peak) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="t-xs mt-2 flex justify-between text-gray-3">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
      {used === 0 && !response && <p className="t-sm mt-5 text-gray-2">No requests yet. Send a test request or run the snippet.</p>}
      {response && (
        <div className="mt-5 max-h-64 overflow-auto rounded-2xl bg-code">
          <div className="t-xs flex justify-between px-4 pt-3 font-mono text-code-muted">
            <span>GET {SAMPLE_PATH}?league=LCK</span>
            <span className="text-[#4ade80]">200</span>
          </div>
          <CodePane code={response} className="px-4 pt-2 pb-4" />
        </div>
      )}
    </Panel>
  );
}

function SubscriptionPanel({ session, onChange }: { session: Session; onChange: (s: Session) => void }) {
  const sub = session.subscription!;
  const plan = planById(sub.plan);
  const [changing, setChanging] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const setPlan = (id: PlanId) => {
    onChange({ ...session, subscription: { ...sub, plan: id } });
    setChanging(false);
  };

  return (
    <Panel title="Subscription">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="t-xs text-gray-2">EBH Pro Play API</div>
          <div className="t-h5 mt-1">{plan.name}</div>
          <div className="t-sm mt-1 text-gray-2">
            €{plan.price} / month · {formatRequests(plan.requests)} requests
          </div>
        </div>
        <span
          className={`t-xs shrink-0 rounded-full px-2.5 py-1 ${sub.status === "trialing" ? "bg-primary/10 text-primary" : "bg-[#fff1dc] text-[#9a5b00]"}`}
        >
          {sub.status === "trialing" ? "Trial" : "Cancels"}
        </span>
      </div>

      <dl className="t-sm mt-5 flex flex-col gap-2.5 border-t border-gray-4 pt-5">
        <div className="flex justify-between gap-3">
          <dt className="text-gray-2">{sub.status === "trialing" ? "Trial ends" : "Access ends"}</dt>
          <dd>{formatDate(sub.trialEnds)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-2">Payment method</dt>
          <dd className="font-mono">•••• {sub.cardLast4}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-gray-2">Invoices</dt>
          <dd className="text-right text-gray-2">{sub.status === "trialing" ? `First on ${formatDate(sub.trialEnds)}` : "None"}</dd>
        </div>
      </dl>

      {changing ? (
        <div className="mt-5 grid grid-cols-3 gap-2">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlan(p.id)}
              className={`rounded-2xl p-3 text-left transition-colors ${p.id === sub.plan ? "bg-dark text-white" : "bg-gray-4 hover:bg-[#e6e9f0]"}`}
            >
              <div className="t-sm font-semibold">{p.name}</div>
              <div className={`t-xs mt-0.5 ${p.id === sub.plan ? "text-white/70" : "text-gray-2"}`}>€{p.price}</div>
            </button>
          ))}
        </div>
      ) : confirmCancel ? (
        <div className="mt-5 rounded-2xl bg-[#fff6e8] p-4">
          <p className="t-sm text-dark/80">You keep access until {formatDate(sub.trialEnds)} and won’t be charged.</p>
          <div className="mt-3 flex gap-2">
            <Button variant="ghost" size="md" onClick={() => setConfirmCancel(false)}>
              Keep plan
            </Button>
            <Button
              variant="dark"
              size="md"
              onClick={() => {
                onChange({ ...session, subscription: { ...sub, status: "canceling" } });
                setConfirmCancel(false);
              }}
            >
              Cancel subscription
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="ghost" size="md" onClick={() => setChanging(true)}>
            Change plan
          </Button>
          {sub.status === "trialing" ? (
            <Button variant="ghost" size="md" onClick={() => setConfirmCancel(true)} className="text-gray-2">
              Cancel
            </Button>
          ) : (
            <Button variant="dark" size="md" onClick={() => onChange({ ...session, subscription: { ...sub, status: "trialing" } })}>
              Resume subscription
            </Button>
          )}
        </div>
      )}
    </Panel>
  );
}

export function Dashboard() {
  const router = useRouter();
  const { session, update } = useSession();

  useEffect(() => {
    if (session === null) router.replace("/signup?plan=pro");
    else if (session && !session.subscription) router.replace("/checkout?plan=pro");
  }, [session, router]);

  if (!session?.subscription || !session.apiKey) {
    return <div className="wash min-h-dvh" />;
  }

  const set = (s: Session) => update(() => s);

  return (
    <div className="min-h-dvh bg-[#f7f8fb]">
      <header className="border-b border-[#eceef3] bg-white">
        <div className="container-page flex h-[66px] items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="t-sm hidden gap-6 md:flex">
              <span className="text-dark">Dashboard</span>
              <Link href="/docs" className="text-gray-2 hover:text-dark">
                Docs
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="t-sm hidden text-gray-2 sm:inline">{session.customer.email}</span>
            <button
              className="t-sm text-gray-2 hover:text-dark"
              onClick={() => {
                update(() => null);
                router.push("/");
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="container-page flex max-w-[1080px] flex-col gap-5 py-10 md:py-14">
        {!session.apiKey.revealed ? (
          <KeyReveal session={session} onSaved={() => set({ ...session, apiKey: { ...session.apiKey!, revealed: true } })} />
        ) : (
          <>
            <div>
              <h1 className="t-h3">Dashboard</h1>
              <p className="t-md mt-2 text-gray-2">Welcome back, {session.customer.name}.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <KeyPanel
                session={session}
                onRegenerate={() => set({ ...session, apiKey: { value: newApiKey(), createdAt: new Date().toISOString(), revealed: false } })}
              />
              <SubscriptionPanel session={session} onChange={set} />
            </div>
          </>
        )}
        <UsagePanel
          session={session}
          onRequest={() => update((s) => (s ? { ...s, usage: { ...s.usage, [today()]: (s.usage?.[today()] ?? 0) + 1 } } : s))}
        />
      </main>
    </div>
  );
}
