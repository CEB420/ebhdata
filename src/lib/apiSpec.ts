// The EBH Pro Play API, described as data. The docs page renders from this;
// example responses are built from the real sample export (sample.json).
import { AS_OF, CHAMPION_STATS, TEAMS, TEAM_PROFILES, teamBySlug } from "./data";
import { predict } from "./prediction";

export type Field = {
  name: string;
  type: string;
  desc: string;
  required?: boolean;
  default?: string;
  values?: string[];
  nullable?: boolean;
};

export type Endpoint = {
  id: string;
  title: string;
  method: "GET";
  path: string;
  desc: string;
  pathParams?: Field[];
  query?: Field[];
  returns: string;
  example: { path: string; params: Record<string, string | number> };
  response: unknown;
};

export type Resource = {
  id: string;
  title: string;
  desc: string;
  object: { name: string; fields: Field[]; example: unknown };
  endpoints: Endpoint[];
};

const r3 = (n: number) => +n.toFixed(3);

export const LEAGUE_INFO = [
  { code: "LCK", name: "LoL Champions Korea", region: "Korea" },
  { code: "LPL", name: "LoL Pro League", region: "China" },
  { code: "LEC", name: "LoL EMEA Championship", region: "EMEA" },
  { code: "LCS", name: "LoL Championship Series", region: "North America" },
];

const teamObj = (slug: string) => {
  const t = teamBySlug(slug);
  return { object: "team", id: t.slug, name: t.name, league: t.league };
};

const ratingObj = (slug: string) => {
  const t = teamBySlug(slug);
  return { object: "rating", team: t.slug, team_name: t.name, league: t.league, rank: t.rank, rating: t.rating, rd: t.rd, as_of: AS_OF };
};

export const predictionObj = (a: string, b: string, bestOf: number) => {
  const p = predict(teamBySlug(a), teamBySlug(b), bestOf);
  return {
    object: "prediction",
    team_a: a,
    team_b: b,
    best_of: bestOf,
    team_a_win: r3(p.series),
    team_b_win: r3(1 - p.series),
    per_game: p.games.map(r3),
    ratings_as_of: AS_OF,
  };
};

const championObj = (c: (typeof CHAMPION_STATS.champions)[number]) => ({
  object: "champion_stat",
  champion: c.champion,
  league: CHAMPION_STATS.league,
  patch: CHAMPION_STATS.patch,
  games: CHAMPION_STATS.games,
  pick_rate: c.pick_rate,
  ban_rate: c.ban_rate,
  presence: c.presence,
  win_rate: c.win_rate,
});

const lplProfile = TEAM_PROFILES.find((p) => p.estimated.length > 0)!;
const profileObj = (p: (typeof TEAM_PROFILES)[number]) => ({
  object: "team_profile",
  team: p.team,
  league: p.league,
  period: p.period,
  games: p.games,
  win_rate: p.win_rate,
  avg_game_minutes: p.avg_game_minutes,
  gold_diff_15: p.gold_diff_15,
  xp_diff_15: p.xp_diff_15,
  first_dragon_rate: p.first_dragon_rate,
  first_tower_rate: p.first_tower_rate,
  first_blood_rate: p.first_blood_rate,
  estimated: p.estimated,
});

const list = (data: unknown[], extra: Record<string, unknown> = {}) => ({ object: "list", ...extra, data, has_more: false });

const LEAGUE_PARAM: Field = { name: "league", type: "string", desc: "League code.", values: LEAGUE_INFO.map((l) => l.code) };

export const RESOURCES: Resource[] = [
  {
    id: "teams",
    title: "Teams",
    desc: "Professional rosters. A Team’s id is a stable slug you pass to every other endpoint.",
    object: {
      name: "Team",
      fields: [
        { name: "id", type: "string", desc: "Slug, e.g. gen-g. Stable across roster changes." },
        { name: "name", type: "string", desc: "Display name." },
        { name: "league", type: "string", desc: "Home League code: the last domestic League the Team played in." },
      ],
      example: teamObj("gen-g"),
    },
    endpoints: [
      {
        id: "list-teams",
        title: "List teams",
        method: "GET",
        path: "/teams",
        desc: "Returns all Teams, optionally filtered by home League.",
        query: [{ ...LEAGUE_PARAM, desc: "Only Teams whose home League is this code." }],
        returns: "A list of Team objects.",
        example: { path: "/teams", params: { league: "LCK" } },
        response: list(TEAMS.filter((t) => t.league === "LCK").map((t) => teamObj(t.slug))),
      },
    ],
  },
  {
    id: "ratings",
    title: "Ratings",
    desc: "EBH Data’s strength estimate per Team, region-adjusted, with its uncertainty. Recomputed after every match day.",
    object: {
      name: "Rating",
      fields: [
        { name: "team", type: "string", desc: "Team id." },
        { name: "team_name", type: "string", desc: "Team display name." },
        { name: "league", type: "string", desc: "Home League code." },
        { name: "rank", type: "integer", desc: "Position within the League, 1 is strongest." },
        { name: "rating", type: "number", desc: "Strength including the League’s regional term. Only differences are meaningful." },
        { name: "rd", type: "number", desc: "Rating deviation. Lower is more certain; it grows while a Team doesn’t play." },
        { name: "as_of", type: "date", desc: "Last day of games included." },
      ],
      example: ratingObj("gen-g"),
    },
    endpoints: [
      {
        id: "list-ratings",
        title: "List ratings",
        method: "GET",
        path: "/ratings",
        desc: "Returns Ratings for every Team in a League, strongest first.",
        query: [
          { ...LEAGUE_PARAM, required: true },
          { name: "date", type: "date", desc: "Return Ratings as they stood at the end of this day.", default: "latest" },
        ],
        returns: "A list of Rating objects.",
        example: { path: "/ratings", params: { league: "LCK" } },
        response: list(
          TEAMS.filter((t) => t.league === "LCK").map((t) => ratingObj(t.slug)),
          { as_of: AS_OF },
        ),
      },
    ],
  },
  {
    id: "predictions",
    title: "Predictions",
    desc: "Win probabilities for any Matchup of two Teams, whether or not they are scheduled to play.",
    object: {
      name: "Prediction",
      fields: [
        { name: "team_a", type: "string", desc: "Team id, as requested." },
        { name: "team_b", type: "string", desc: "Team id, as requested." },
        { name: "best_of", type: "integer", desc: "Series format.", values: ["1", "3", "5"] },
        { name: "team_a_win", type: "number", desc: "Probability that team_a wins the series, 0 to 1." },
        { name: "team_b_win", type: "number", desc: "1 − team_a_win." },
        { name: "per_game", type: "number[]", desc: "team_a’s chance in each game, assuming it is played. Narrows under Fearless Draft." },
        { name: "ratings_as_of", type: "date", desc: "Ratings the Prediction was computed from." },
      ],
      example: predictionObj("gen-g", "t1", 5),
    },
    endpoints: [
      {
        id: "get-prediction",
        title: "Get a prediction",
        method: "GET",
        path: "/predictions",
        desc: "Computes a Prediction for one Matchup from current Ratings.",
        query: [
          { name: "team_a", type: "string", required: true, desc: "Team id." },
          { name: "team_b", type: "string", required: true, desc: "Team id. Must differ from team_a." },
          { name: "best_of", type: "integer", desc: "Series format.", values: ["1", "3", "5"], default: "1" },
        ],
        returns: "A Prediction object.",
        example: { path: "/predictions", params: { team_a: "gen-g", team_b: "t1", best_of: 5 } },
        response: predictionObj("gen-g", "t1", 5),
      },
    ],
  },
  {
    id: "champions",
    title: "Champion Stats",
    desc: "Pick, ban and win rates per champion, aggregated per patch and League.",
    object: {
      name: "Champion Stat",
      fields: [
        { name: "champion", type: "string", desc: "Champion name." },
        { name: "league", type: "string", desc: "League code." },
        { name: "patch", type: "string", desc: "Game patch, e.g. 16.16." },
        { name: "games", type: "integer", desc: "Games in this League and patch." },
        { name: "pick_rate", type: "number", desc: "Share of games the champion was picked." },
        { name: "ban_rate", type: "number", desc: "Share of games the champion was banned." },
        { name: "presence", type: "number", desc: "pick_rate + ban_rate." },
        { name: "win_rate", type: "number", nullable: true, desc: "Share of picks that won. null if never picked." },
      ],
      example: championObj(CHAMPION_STATS.champions[1]),
    },
    endpoints: [
      {
        id: "list-champions",
        title: "List champion stats",
        method: "GET",
        path: "/champions",
        desc: "Returns Champion Stats for one League and patch, sorted by presence.",
        query: [
          { ...LEAGUE_PARAM, required: true },
          { name: "patch", type: "string", desc: "Game patch.", default: "latest" },
          { name: "limit", type: "integer", desc: "Number of champions, 1 to 200.", default: "20" },
        ],
        returns: "A list of Champion Stat objects.",
        example: { path: "/champions", params: { league: "LCK", patch: CHAMPION_STATS.patch, limit: 3 } },
        response: list(CHAMPION_STATS.champions.slice(0, 3).map(championObj), { has_more: true }),
      },
    ],
  },
  {
    id: "team-profiles",
    title: "Team Profiles",
    desc: "A Team’s averaged early-game and objective tendencies over a period.",
    object: {
      name: "Team Profile",
      fields: [
        { name: "team", type: "string", desc: "Team id." },
        { name: "league", type: "string", desc: "League the games were played in." },
        { name: "period", type: "string", desc: "Season year." },
        { name: "games", type: "integer", desc: "Games averaged." },
        { name: "win_rate", type: "number", desc: "Share of games won." },
        { name: "avg_game_minutes", type: "number", desc: "Mean game length." },
        { name: "gold_diff_15", type: "number", desc: "Mean gold difference at 15:00." },
        { name: "xp_diff_15", type: "number", desc: "Mean experience difference at 15:00." },
        { name: "first_dragon_rate", type: "number", nullable: true, desc: "Share of games with the first dragon." },
        { name: "first_tower_rate", type: "number", nullable: true, desc: "Share of games with the first tower." },
        { name: "first_blood_rate", type: "number", nullable: true, desc: "Share of games with first blood." },
        { name: "estimated", type: "string[]", desc: "Fields that are Estimated values. Empty when everything was measured." },
      ],
      example: profileObj(lplProfile),
    },
    endpoints: [
      {
        id: "get-team-profile",
        title: "Retrieve a team profile",
        method: "GET",
        path: "/teams/{team}/profile",
        desc: "Returns one Team’s profile for a period.",
        pathParams: [{ name: "team", type: "string", required: true, desc: "Team id." }],
        query: [{ name: "period", type: "string", desc: "Season year.", default: "current season" }],
        returns: "A Team Profile object.",
        example: { path: `/teams/${lplProfile.team}/profile`, params: { period: 2026 } },
        response: profileObj(lplProfile),
      },
    ],
  },
];

export const ERROR_EXAMPLE = {
  error: {
    type: "invalid_request_error",
    code: "team_not_found",
    message: "No Team with id 'gen_g'. Did you mean 'gen-g'?",
    param: "team_a",
  },
};

export const STATUS_CODES = [
  ["200", "OK", "The request succeeded."],
  ["400", "Bad Request", "A parameter is missing or invalid."],
  ["401", "Unauthorized", "No API key, or the key is invalid or regenerated."],
  ["403", "Forbidden", "The key has no active Subscription for this API."],
  ["404", "Not Found", "Unknown Team, League or patch."],
  ["429", "Too Many Requests", "The monthly request limit is used up."],
  ["500", "Server Error", "Something failed on our side. Safe to retry."],
] as const;

export const ERROR_TYPES = [
  ["invalid_request_error", "Bad parameters. code and param say which."],
  ["authentication_error", "The API key is missing or invalid."],
  ["permission_error", "No active Subscription for this API."],
  ["rate_limit_error", "Monthly limit reached."],
  ["api_error", "Temporary problem on our side."],
] as const;
