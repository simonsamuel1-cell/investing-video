/**
 * STOCK A — the single fictional instrument the bandarmology worked example runs
 * on across Scenes 3 → 11 → 15. All figures illustrative; keep them identical in
 * every scene (QA: consistency across Sc3/11/15). The three "tells":
 *   (a) a large resting bid well below last, (b) one broker dominating net buy,
 *   (c) that broker's low average price = accumulating cheap.
 */
import type { BookRow, TableRow } from "./components";

export const A = {
  last: "Rp 1,205",
  bigBidPrice: "Rp 1,180",
  bigBidLot: 48500,
  broker01Net: "+9,420",
  broker01Avg: "Rp 1,182",
  broker01Value: "Rp 9.8 Bn",
  broker01Pct: "41%",
};

// Order book ladder (asks above the last strip, bids below). The 1,180 bid is the
// oversized resting bid (tell a).
export const ASKS: BookRow[] = [
  { price: "1,225", lot: 6200, orders: 22 },
  { price: "1,220", lot: 9800, orders: 31 },
  { price: "1,215", lot: 12400, orders: 40 },
  { price: "1,210", lot: 8100, orders: 27 },
  { price: "1,206", lot: 5300, orders: 19 },
];
export const BIDS: BookRow[] = [
  { price: "1,200", lot: 7400, orders: 25 },
  { price: "1,195", lot: 9100, orders: 33 },
  { price: "1,190", lot: 11200, orders: 38 },
  { price: "1,180", lot: 48500, orders: 64, highlight: true },
  { price: "1,170", lot: 6800, orders: 21 },
];

// Broker Summary (Sc15), sorted by net lot desc.
export const BROKER_SUMMARY: TableRow[] = [
  { cells: { broker: "Broker 01", net: "+9,420", avg: "1,182", value: "9.8 Bn", pct: "41%" }, highlight: true },
  { cells: { broker: "Broker 02", net: "+3,210", avg: "1,196", value: "3.5 Bn", pct: "14%" } },
  { cells: { broker: "Broker 03", net: "+1,980", avg: "1,201", value: "2.1 Bn", pct: "9%" } },
  { cells: { broker: "Broker 04", net: "+1,240", avg: "1,199", value: "1.3 Bn", pct: "6%" } },
  { cells: { broker: "Broker 05", net: "+640", avg: "1,203", value: "0.7 Bn", pct: "3%" } },
  { cells: { broker: "Broker 06", net: "−820", avg: "1,188", value: "0.9 Bn", pct: "4%" } },
  { cells: { broker: "Broker 07", net: "−1,450", avg: "1,205", value: "1.6 Bn", pct: "7%" } },
  { cells: { broker: "Broker 08", net: "−2,100", avg: "1,207", value: "2.3 Bn", pct: "9%" } },
  { cells: { broker: "Broker 09", net: "−3,120", avg: "1,209", value: "3.4 Bn", pct: "14%" } },
];
