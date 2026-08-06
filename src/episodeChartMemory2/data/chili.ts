/**
 * data/chili.ts — the everyday price series SC02 uses to show that a chart is
 * just numbers arranged over time. The three spoken figures (40.000 → 20.000 →
 * 35.000 per kg) are FINAL — they come from the VO. The intermediate months
 * exist so the drawn line is a real price path rather than three dots.
 */
export type ChiliPoint = { month: string; price: number };

/** Title Case month abbreviations, per the on-screen text-case rule. */
export const chiliMonthly: ChiliPoint[] = [
  { month: "Jan", price: 40000 },
  { month: "Feb", price: 36000 },
  { month: "Mar", price: 30500 },
  { month: "Apr", price: 24500 },
  { month: "Mei", price: 20000 },
  { month: "Jun", price: 21000 },
  { month: "Jul", price: 23500 },
  { month: "Agu", price: 26000 },
  { month: "Sep", price: 28500 },
  { month: "Okt", price: 31000 },
  { month: "Nov", price: 33000 },
  { month: "Des", price: 35000 },
];

/** Indices of the three figures the VO names. */
export const CHILI_SPOKEN = { high: 0, low: 4, back: 11 };
