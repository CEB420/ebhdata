import { PLANS, PLAN_FEATURES, TRIAL_DAYS, formatRequests } from "@/lib/plans";
import { ButtonLink } from "./Button";
import { Reveal } from "./Reveal";

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-px shrink-0 text-dark">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeOpacity=".15" strokeWidth="1.5" />
      <path d="M5 8.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PricingCards() {
  return (
    <div className="mx-auto grid max-w-[1080px] gap-5 md:grid-cols-3">
      {PLANS.map((plan, i) => (
        <Reveal key={plan.id} delay={i * 80}>
          <div className={`card card-lift flex h-full flex-col bg-gray-4 ${plan.featured ? "shadow-[0_0_0_1px_rgba(53,99,240,0.35)]" : ""}`}>
            <div className="flex flex-col gap-5 rounded-[20px] bg-white p-5">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="t-h6">{plan.name}</h3>
                  {plan.featured && <span className="t-xs rounded-full bg-primary/10 px-2.5 py-1 text-primary">Most popular</span>}
                </div>
                <p className="t-sm mt-2 text-gray-2">{plan.audience}</p>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="t-h3">€{plan.price}</span>
                <span className="t-sm text-gray-2">/ month</span>
              </div>
              <ButtonLink href={`/signup?plan=${plan.id}`} variant={plan.featured ? "primary" : "dark"} full>
                Start {TRIAL_DAYS}-day trial
              </ButtonLink>
            </div>
            <div className="flex flex-1 flex-col gap-3 px-5 pt-5 pb-6">
              <p className="t-xs text-gray-2">Included features:</p>
              <ul className="t-sm flex flex-col gap-2.5">
                <li className="flex gap-2.5">
                  <Check />
                  <span>
                    <strong className="font-semibold">{formatRequests(plan.requests)}</strong> requests / month
                  </span>
                </li>
                {PLAN_FEATURES.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
