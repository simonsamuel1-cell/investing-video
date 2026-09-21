/**
 * Scene 1 (v5) — Problem Setup. The hero chart is a FICTIONAL ticker "$ABCD"
 * (the reference was a Bitcoin chart; the name is hidden on purpose). The chart
 * shape and axis values are illustrative, not real data.
 *
 * The "ten stocks to check" beat lists ten real IDX tickers as plain labels
 * (per Simon, 25 Jun) — names only, no prices/signals/recommendation, just the
 * workload of having many to review.
 */
export const S1_TICKER = "$ABCD";

// Ten real IDX tickers — labels only (workload illustration, no data).
export const S1_TEN = [
  "BBCA",
  "BBRI",
  "BMRI",
  "TLKM",
  "ASII",
  "ANTM",
  "ADRO",
  "GOTO",
  "UNVR",
  "ICBP",
] as const;
