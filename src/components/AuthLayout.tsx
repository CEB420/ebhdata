import Link from "next/link";
import { Logo } from "./Logo";

/** Focused frame for sign-up and checkout: logo, a step indicator, no site navigation. */
export function AuthLayout({ step, children }: { step: 1 | 2 | 3; children: React.ReactNode }) {
  const steps = ["Account", "Payment", "API key"];
  return (
    <div className="wash min-h-dvh">
      <header className="container-page flex h-[66px] items-center justify-between">
        <Logo />
        <ol className="t-sm hidden items-center gap-2 md:flex" aria-label="Progress">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span
                className={`grid size-6 place-items-center rounded-full text-[12px] ${
                  i + 1 < step ? "bg-dark text-white" : i + 1 === step ? "bg-white text-dark shadow-[0_0_0_1px_#101011]" : "bg-white text-gray-3 shadow-[var(--ring)]"
                }`}
              >
                {i + 1 < step ? "✓" : i + 1}
              </span>
              <span className={i + 1 === step ? "text-dark" : "text-gray-2"}>{s}</span>
              {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-[#d9dce4]" />}
            </li>
          ))}
        </ol>
        <Link href="/" className="t-sm text-gray-2 hover:text-dark">
          Back to site
        </Link>
      </header>
      <main className="container-page pt-8 pb-24 md:pt-14">{children}</main>
    </div>
  );
}

export function PrototypeNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="t-xs mx-auto mt-5 flex max-w-[420px] items-center justify-center gap-2 text-center text-gray-2">
      <span className="rounded-full bg-dark/6 px-2 py-0.5 font-semibold text-dark/70">Prototype</span>
      {children}
    </p>
  );
}
