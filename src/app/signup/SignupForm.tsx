"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthLayout, PrototypeNote } from "@/components/AuthLayout";
import { Button } from "@/components/Button";
import { PLANS, TRIAL_DAYS, formatRequests, planById } from "@/lib/plans";
import { useSession } from "@/lib/session";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

export function SignupForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { update } = useSession();
  const login = params.get("mode") === "login";
  const [planId, setPlanId] = useState(planById(params.get("plan")).id);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const plan = planById(planId);

  const finish = (via: "email" | "google") => {
    const customer =
      via === "google"
        ? { email: "analyst@gmail.com", name: "Google user", via }
        : { email, name: name || email.split("@")[0], via };
    update((s) => (login && s?.subscription ? s : { customer }));
    router.push(login ? "/dashboard" : `/checkout?plan=${plan.id}`);
  };

  return (
    <AuthLayout step={1}>
      <div className="mx-auto max-w-[440px]">
        <div className="text-center">
          <h1 className="t-h3">{login ? "Welcome back" : "Create your account"}</h1>
          <p className="subline t-md mt-3">{login ? "Log in to see your API key and usage." : `Start your ${TRIAL_DAYS}-day trial in two minutes.`}</p>
        </div>

        <div className="card mt-8">
          <div className="flex flex-col gap-5 rounded-[20px] bg-white p-5 md:p-6">
            {!login && (
              <fieldset>
                <legend className="t-xs mb-2 text-gray-2">Plan</legend>
                <div className="grid grid-cols-3 gap-1 rounded-full bg-gray-4 p-1">
                  {PLANS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlanId(p.id)}
                      aria-pressed={p.id === planId}
                      className={`h-9 rounded-full text-[14px] font-medium transition-all ${
                        p.id === planId ? "bg-white text-dark shadow-[0_1px_3px_rgba(16,16,17,0.12)]" : "text-gray-2 hover:text-dark"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
                <p className="t-xs mt-2 text-center text-gray-2">
                  €{plan.price} / month · {formatRequests(plan.requests)} requests · first {TRIAL_DAYS} days free
                </p>
              </fieldset>
            )}

            <Button variant="ghost" full type="button" onClick={() => finish("google")}>
              <GoogleIcon />
              Continue with Google
            </Button>

            <div className="t-xs flex items-center gap-3 text-gray-3">
              <span className="h-px flex-1 bg-gray-4" />
              or
              <span className="h-px flex-1 bg-gray-4" />
            </div>

            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                finish("email");
              }}
            >
              {!login && (
                <label>
                  <span className="sr-only">Name</span>
                  <input className="field" placeholder="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
              )}
              <label>
                <span className="sr-only">Work email</span>
                <input
                  className="field"
                  type="email"
                  required
                  placeholder="Work email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <Button full type="submit" className="mt-1">
                {login ? "Email me a login link" : "Continue"}
              </Button>
            </form>
          </div>
        </div>

        <p className="t-sm mt-6 text-center text-gray-2">
          {login ? "New to EBH Data? " : "Already have an account? "}
          <Link href={login ? "/signup?plan=pro" : "/signup?mode=login"} className="text-dark underline-offset-4 hover:underline">
            {login ? "Create an account" : "Log in"}
          </Link>
        </p>
        <PrototypeNote>Any email works. Nothing is sent.</PrototypeNote>
      </div>
    </AuthLayout>
  );
}
