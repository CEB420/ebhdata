"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthLayout, PrototypeNote } from "@/components/AuthLayout";
import { Button } from "@/components/Button";
import { PLAN_FEATURES, TRIAL_DAYS, formatRequests, planById } from "@/lib/plans";
import { formatDate, newApiKey, trialEndDate, useSession } from "@/lib/session";

function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
}

export function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { session, update } = useSession();
  const plan = planById(params.get("plan"));
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [busy, setBusy] = useState(false);
  const [trialEnds, setTrialEnds] = useState<string | null>(null);

  useEffect(() => setTrialEnds(trialEndDate()), []);
  useEffect(() => {
    if (session === null) router.replace(`/signup?plan=${plan.id}`);
    else if (session?.subscription) router.replace("/dashboard");
  }, [session, plan.id, router]);

  const valid = card.replace(/\s/g, "").length === 16 && expiry.length === 7 && cvc.length >= 3;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setTimeout(() => {
      update((s) =>
        s
          ? {
              ...s,
              subscription: { plan: plan.id, status: "trialing", trialEnds: trialEndDate(), cardLast4: card.slice(-4) },
              apiKey: { value: newApiKey(), createdAt: new Date().toISOString(), revealed: false },
            }
          : s,
      );
      router.push("/dashboard");
    }, 900);
  };

  return (
    <AuthLayout step={2}>
      <div className="mx-auto grid max-w-[920px] gap-5 md:grid-cols-[1fr_1.1fr]">
        {/* Order summary */}
        <div className="card bg-gray-4">
          <div className="rounded-[20px] bg-white p-5 md:p-6">
            <p className="t-xs text-gray-2">EBH Pro Play API</p>
            <h1 className="t-h4 mt-1">{plan.name}</h1>
            <p className="t-sm mt-2 text-gray-2">{formatRequests(plan.requests)} requests / month</p>
            <div className="mt-6 flex flex-col gap-3 border-t border-gray-4 pt-5">
              <div className="t-sm flex justify-between">
                <span className="text-gray-2">Due today</span>
                <span className="font-semibold">€0.00</span>
              </div>
              <div className="t-sm flex justify-between">
                <span className="text-gray-2">After trial{trialEnds ? `, from ${formatDate(trialEnds)}` : ""}</span>
                <span>€{plan.price}.00 / month</span>
              </div>
            </div>
          </div>
          <ul className="t-sm flex flex-col gap-2.5 px-5 pt-5 pb-6 text-gray-2 md:px-6">
            {PLAN_FEATURES.map((f) => (
              <li key={f} className="flex gap-2.5">
                <span className="text-dark">✓</span>
                {f}
              </li>
            ))}
            <li className="flex gap-2.5">
              <span className="text-dark">✓</span>
              Cancel anytime before the trial ends
            </li>
          </ul>
        </div>

        {/* Payment */}
        <form onSubmit={submit} className="card">
          <div className="flex h-full flex-col gap-4 rounded-[20px] bg-white p-5 md:p-6">
            <div>
              <h2 className="t-h6">Payment details</h2>
              <p className="t-sm mt-2 text-gray-2">You won’t be charged for {TRIAL_DAYS} days.</p>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="t-xs text-gray-2">Card number</span>
              <input
                className="field font-mono tracking-wide"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                value={card}
                onChange={(e) => setCard(formatCard(e.target.value))}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="t-xs text-gray-2">Expiry</span>
                <input
                  className="field font-mono"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="t-xs text-gray-2">CVC</span>
                <input
                  className="field font-mono"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="t-xs text-gray-2">Country</span>
              <select className="field appearance-none" defaultValue="DE" autoComplete="country">
                {[
                  ["DE", "Germany"],
                  ["AT", "Austria"],
                  ["CH", "Switzerland"],
                  ["FR", "France"],
                  ["GB", "United Kingdom"],
                  ["KR", "South Korea"],
                  ["US", "United States"],
                ].map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-auto pt-2">
              <Button full type="submit" disabled={!valid || busy} arrow={!busy}>
                {busy ? "Starting trial…" : "Start free trial"}
              </Button>
              <p className="t-xs mt-3 text-center text-gray-2">
                {trialEnds ? `Then €${plan.price}/month from ${formatDate(trialEnds)}.` : " "}
              </p>
            </div>
          </div>
        </form>
      </div>
      <PrototypeNote>No card is charged. Use 4242 4242 4242 4242.</PrototypeNote>
    </AuthLayout>
  );
}
