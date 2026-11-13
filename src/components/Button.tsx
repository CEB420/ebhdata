import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "dark" | "ghost";
type Size = "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  dark: "bg-dark text-white hover:bg-dark-hover",
  ghost: "bg-white text-dark shadow-[inset_0_0_0_1px_#e3e6ed] hover:bg-gray-4",
};

const SIZE: Record<Size, string> = {
  md: "h-10 px-4 text-[15px]",
  lg: "h-12 px-6 text-base",
};

function classes(variant: Variant, size: Size, arrow: boolean, full: boolean, extra = "") {
  return [
    "group inline-flex items-center justify-center gap-3 rounded-full font-medium whitespace-nowrap",
    "transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    VARIANT[variant],
    SIZE[size],
    arrow ? "pr-2" : "",
    full ? "w-full" : "",
    extra,
  ].join(" ");
}

function Arrow({ variant }: { variant: Variant }) {
  return (
    <span
      className={`arrow-dot grid size-8 place-items-center rounded-full ${variant === "ghost" ? "bg-dark text-white" : "bg-white text-dark"}`}
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7h10m0 0L8 3m4 4L8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

type Common = { variant?: Variant; size?: Size; arrow?: boolean; full?: boolean; children: ReactNode; className?: string };

export function ButtonLink({ href, variant = "primary", size = "lg", arrow = false, full = false, children, className }: Common & { href: string }) {
  return (
    <Link href={href} className={classes(variant, size, arrow, full, className)}>
      {children}
      {arrow && <Arrow variant={variant} />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "lg",
  arrow = false,
  full = false,
  children,
  className,
  ...rest
}: Common & Omit<ComponentProps<"button">, "children" | "className">) {
  return (
    <button className={classes(variant, size, arrow, full, className)} {...rest}>
      {children}
      {arrow && <Arrow variant={variant} />}
    </button>
  );
}
