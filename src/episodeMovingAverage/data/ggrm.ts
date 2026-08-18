/**
 * ggrm.ts — the one place in this episode that claims to show a real market.
 *
 * [NEEDS DATA] `ggrm.json` ships with `bars: []`. Required range is
 * 2026-06-01 → 2026-08-08: the June bars are the slow MA's warm-up window, so
 * without them the line the VO calls "garis ungu" would either start late or
 * start from nothing.
 *
 * THE GUARD IS THE POINT. `READY` is false while the file is empty, and Scenes
 * 12A/12B then draw the chart frame, the axes and the legend with a visible
 * "Menunggu data" placeholder. They do NOT fall back to the synthetic
 * generator: every other series in this episode is illustrating a mechanic,
 * but this one is named, dated and priced, and a made-up candle presented as
 * GGRM is a fabricated record.
 *
 * The ≈20.350 level the VO names must also come OUT of these bars — see
 * `PEAK` — never be typed as a string into a scene.
 */
import raw from "./ggrm.json";

export type GgrmBar = { date: string; o: number; h: number; l: number; c: number; v: number };

export const GGRM = raw as {
  ticker: string;
  name: string;
  timeframe: string;
  source: string;
  retrievedAt: string;
  bars: GgrmBar[];
};

/** False until Simon's export lands. Every consumer must branch on this. */
export const READY = GGRM.bars.length > 0;

export const CLOSES = GGRM.bars.map((b) => b.c);

/** The high the VO calls "sekitar 20.350" — read from the data, not typed. */
export const PEAK = READY ? Math.max(...GGRM.bars.map((b) => b.h)) : null;

/**
 * The move the StatCard reports. Null while there is no data, and the card
 * renders "—" rather than a number, because a percentage is a claim.
 */
export const bounceToPeak = (): number | null => {
  if (!READY) return null;
  const lows = GGRM.bars.map((b) => b.l);
  const i = lows.indexOf(Math.min(...lows));
  const after = GGRM.bars.slice(i).map((b) => b.h);
  return ((Math.max(...after) - lows[i]) / lows[i]) * 100;
};
