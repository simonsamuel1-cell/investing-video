/**
 * Scene 1 (v2) — Thematic Blindness. Three traders each fixate on a separate
 * poultry ticker, all unknowingly reacting to one theme. Real IDX poultry names,
 * used as labels only. Per-ticker data option (b) [DEFAULT]: NO per-stock figures
 * anywhere in Scene 1 — ticker + the six indicator NAMES only (no readings, no
 * prices, no intraday %). The single verified figure lives in Scene 2.
 */
export interface TraderColumn {
  symbol: string; // real IDX poultry ticker
  trader: string; // the "trader" fixated on it
}

export const TICKERS: TraderColumn[] = [
  { symbol: "JPFA", trader: "Trader A" },
  { symbol: "CPIN", trader: "Trader B" },
  { symbol: "MAIN", trader: "Trader C" },
];

// The six indicator names straight from the VO — NAMES ONLY (overwhelm, not data).
export const INDICATOR_NOISE: string[] = [
  "MA5",
  "MA20",
  "RSI",
  "MACD",
  "Stochastic",
  "Parabolic SAR",
];
