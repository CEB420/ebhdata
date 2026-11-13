// Port of moneyprinter's scripts/model_oe.py: Glicko win probability plus the
// calibrated, Fearless-drifted series probability (series_prob).
import { MODEL, type RatedTeam } from "./data";

const Q = Math.log(10) / 400;

function g(rd: number) {
  return 1 / Math.sqrt(1 + (3 * Q * Q * rd * rd) / Math.PI ** 2);
}

/** Raw per-game probability that `a` beats `b` from Ratings and their uncertainty. */
export function gameProb(a: RatedTeam, b: RatedTeam) {
  const rd = Math.sqrt(a.rd ** 2 + b.rd ** 2);
  return 1 / (1 + 10 ** ((-g(rd) * (a.rating - b.rating)) / 400));
}

function logit(p: number) {
  return Math.log(p / (1 - p));
}

/** Probability of winning game n of a series, shrunk by calibration and Fearless drift. */
export function drifted(p1: number, game: number, k = MODEL.drift_k, scale = MODEL.scale) {
  return 1 / (1 + Math.exp(-logit(p1) * scale * (1 + k * (game - 1))));
}

export function seriesProb(p1: number, bestOf: number) {
  const need = Math.floor(bestOf / 2) + 1;
  const memo = new Map<string, number>();
  const winFrom = (a: number, b: number): number => {
    if (a === need) return 1;
    if (b === need) return 0;
    const key = `${a}:${b}`;
    if (!memo.has(key)) {
      const p = drifted(p1, a + b + 1);
      memo.set(key, p * winFrom(a + 1, b) + (1 - p) * winFrom(a, b + 1));
    }
    return memo.get(key)!;
  };
  return winFrom(0, 0);
}

export function predict(a: RatedTeam, b: RatedTeam, bestOf: number) {
  const p1 = gameProb(a, b);
  const series = seriesProb(p1, bestOf);
  const games = Array.from({ length: bestOf }, (_, i) => drifted(p1, i + 1));
  return { series, games };
}
