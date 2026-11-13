export type PlanId = "starter" | "pro" | "scale";

export type Plan = {
  id: PlanId;
  name: string;
  audience: string;
  price: number;
  requests: number;
  featured?: boolean;
};

export const PLANS: Plan[] = [
  { id: "starter", name: "Starter", audience: "For solo analysts", price: 49, requests: 10_000 },
  { id: "pro", name: "Pro", audience: "For analyst staffs and tools", price: 149, requests: 100_000, featured: true },
  { id: "scale", name: "Scale", audience: "For products at volume", price: 399, requests: 1_000_000 },
];

export const PLAN_FEATURES = [
  "Ratings and Predictions",
  "Champion Stats and Team Profiles",
  "50+ leagues since 2020",
  "Updated every match day",
];

export const TRIAL_DAYS = 14;

export function planById(id: string | null | undefined): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[1];
}

export function formatRequests(n: number) {
  return n >= 1_000_000 ? `${n / 1_000_000}M` : `${n / 1_000}k`;
}
