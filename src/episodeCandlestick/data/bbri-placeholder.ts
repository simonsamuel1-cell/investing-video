// PLACEHOLDER — replace from IDX CSV (BBRI daily OHLC, 25 May – 20 Jun 2026).
// The surrounding series is illustrative filler. The TWO ANCHOR DAYS below are
// verified real values and MUST NOT be regenerated when the CSV lands:
//   08/06/2026  O 2,700  C 2,590  (red)
//   09/06/2026  O 2,540  C 2,790  (green — engulfs the 8th's body)
// [NEEDS DATA: BBRI daily OHLC, 25 May – 20 Jun 2026]
import type { OHLC } from "../helpers";

export type BbriDay = OHLC & { date: string; label: string };

export const BBRI: BbriDay[] = [
  { date: "25/05/2026", label: "25 May", open: 2884, high: 2896, low: 2868, close: 2874 },
  { date: "26/05/2026", label: "26 May", open: 2872, high: 2882, low: 2850, close: 2856 },
  { date: "27/05/2026", label: "27 May", open: 2854, high: 2866, low: 2834, close: 2840 },
  { date: "28/05/2026", label: "28 May", open: 2842, high: 2850, low: 2816, close: 2824 },
  { date: "29/05/2026", label: "29 May", open: 2826, high: 2836, low: 2802, close: 2810 },
  { date: "01/06/2026", label: "1 Jun", open: 2812, high: 2822, low: 2786, close: 2794 },
  { date: "02/06/2026", label: "2 Jun", open: 2796, high: 2806, low: 2770, close: 2778 },
  { date: "03/06/2026", label: "3 Jun", open: 2780, high: 2788, low: 2754, close: 2762 },
  { date: "04/06/2026", label: "4 Jun", open: 2764, high: 2772, low: 2738, close: 2746 },
  { date: "05/06/2026", label: "5 Jun", open: 2748, high: 2756, low: 2716, close: 2726 },
  // ── ANCHOR (real) ─────────────────────────────────────────────
  { date: "08/06/2026", label: "8 Jun", open: 2700, high: 2712, low: 2578, close: 2590 },
  { date: "09/06/2026", label: "9 Jun", open: 2540, high: 2802, low: 2528, close: 2790 },
  // ──────────────────────────────────────────────────────────────
  { date: "10/06/2026", label: "10 Jun", open: 2792, high: 2812, low: 2770, close: 2802 },
  { date: "11/06/2026", label: "11 Jun", open: 2804, high: 2824, low: 2788, close: 2814 },
  { date: "12/06/2026", label: "12 Jun", open: 2816, high: 2832, low: 2800, close: 2822 },
  { date: "15/06/2026", label: "15 Jun", open: 2824, high: 2840, low: 2810, close: 2832 },
  { date: "16/06/2026", label: "16 Jun", open: 2834, high: 2846, low: 2820, close: 2840 },
  { date: "17/06/2026", label: "17 Jun", open: 2842, high: 2851, low: 2830, close: 2849 }, // peak ≈ +10% of 2,590
  { date: "18/06/2026", label: "18 Jun", open: 2846, high: 2852, low: 2818, close: 2826 },
  { date: "19/06/2026", label: "19 Jun", open: 2824, high: 2834, low: 2806, close: 2814 },
];

// Fixed indices used by SC14A–C (do not shift without re-checking the VO).
export const BBRI_IDX = { jun8: 10, jun9: 11, jun17: 17 } as const;
export const BBRI_BASELINE_CLOSE = 2590; // the 8th's close — the +10% delta baseline
