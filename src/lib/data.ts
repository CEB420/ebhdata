import sample from "@/data/sample.json";

export type RatedTeam = {
  id: string;
  slug: string;
  name: string;
  league: string;
  rank: number;
  rating: number;
  rd: number;
};

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const AS_OF: string = sample.as_of;
export const MODEL = sample.model;
export const TEAMS: RatedTeam[] = sample.teams.map((t) => ({ ...t, slug: slugify(t.name) }));
export const LEAGUES = ["LCK", "LPL", "LEC", "LCS"] as const;
export const CHAMPION_STATS = sample.champion_stats;
export const TEAM_PROFILES = sample.team_profiles.map((p) => ({ ...p, team: slugify(p.team), team_name: p.team }));

export function teamBySlug(slug: string) {
  return TEAMS.find((t) => t.slug === slug)!;
}

export const API_BASE = "https://api.ebhdata.com/v1/pro-play";
