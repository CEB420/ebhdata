"use client";

// Prototype only: the signed-in Customer, their Subscription and API Key live in
// localStorage. Nothing is sent anywhere; no card is charged.
import { useCallback, useEffect, useState } from "react";
import { TRIAL_DAYS, type PlanId } from "./plans";

export type Session = {
  customer: { email: string; name: string; via: "email" | "google" };
  subscription?: {
    plan: PlanId;
    status: "trialing" | "canceling";
    trialEnds: string;
    cardLast4: string;
  };
  apiKey?: { value: string; createdAt: string; revealed: boolean };
  /** Requests per day (YYYY-MM-DD), from test requests sent in the dashboard. */
  usage?: Record<string, number>;
};

const STORAGE = "ebh-prototype-session";
const EVENT = "ebh-session";

function read(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function write(s: Session | null) {
  try {
    if (s) localStorage.setItem(STORAGE, JSON.stringify(s));
    else localStorage.removeItem(STORAGE);
  } catch {
    /* storage blocked: the prototype just forgets */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function newApiKey() {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return "ebh_live_" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function maskKey(key: string) {
  return `ebh_live_••••••${key.slice(-4)}`;
}

export function trialEndDate(from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + TRIAL_DAYS);
  return d.toISOString();
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** `session` is undefined until localStorage has been read on the client. */
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const sync = () => setSession(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((fn: (s: Session | null) => Session | null) => write(fn(read())), []);
  return { session, update };
}
