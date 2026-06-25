/**
 * Scene 2 (v4) — The Real Question (Simon's beat list, 25 Jun). The S1 chart
 * (with indicators) returns, the indicators strip away leaving the price chart
 * centred, then the two real condition-questions appear; the two indicator
 * "detail" questions appear struck-through below; everything fades to the
 * Montserrat resolve line. No data/ticker/numbers beyond the fictional chart.
 */
export const S2_CONDITION_QS = [
  "What is the condition of this stock?",
  "Is now a good time to act?",
] as const;

// Demoted "detail" questions — appear struck-through, below the chart.
export const S2_DETAIL_QS = [
  "What does the RSI say?",
  "Is the MACD crossed?",
] as const;

// Resolve: condition line (kept as it was — indigo, brand font) over the
// details line (Montserrat, per Simon).
export const S2_CONDITION_FIRST = "The condition comes first.";
export const S2_RESOLVE = "The details come after — only if needed.";
