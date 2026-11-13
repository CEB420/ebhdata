"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Fades and rises into place when scrolled into view. `delay` staggers cards (ms). */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Section headline that appears word by word, unblurring as it enters. */
export function Headline({
  children,
  as = "h2",
  className = "t-h2",
}: {
  children: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  const ref = useInView<HTMLHeadingElement>();
  const words = children.split(" ");
  return createElement(
    as,
    { ref, className, "aria-label": children },
    words.map((w, i) => (
      <span key={i} aria-hidden="true">
        <span className="word" style={{ transitionDelay: `${i * 70}ms` }}>
          {w}
        </span>
        {i < words.length - 1 ? " " : ""}
      </span>
    )),
  );
}
