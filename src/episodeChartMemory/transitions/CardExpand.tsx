/**
 * CardExpand — the SC07 → SC08 transition, a CameraCut that spans a SCENE
 * boundary rather than living inside one scene.
 *
 * SC07's right card ("Mingguan — Arah Besar") grows into SC08's full-width card
 * on ONE ease-in-out curve, global 4420 → 4524. Its midpoint is 4472 — which is
 * SC08's first frame — so the content swaps from the weekly series to the daily
 * one exactly where the move is fastest. The card never stops moving across the
 * boundary, so the swap reads as continuous.
 *
 * Both scenes import from here and evaluate the SAME curve from GLOBAL frames.
 * That is the whole trick: each scene only sees its own local frame, so without
 * a shared definition the two halves of the move would not line up.
 */
import { progressInOut, velocityBlur, type Box } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const EXPAND = { start: 4420, dur: 104 };
/** Global frame the content swaps on. MUST stay at the midpoint, and the
 *  midpoint MUST stay on the scene boundary (SC08 starts at 4472). */
export const EXPAND_CUT = EXPAND.start + EXPAND.dur / 2;
const BLUR_MAX = 7; // px at the fastest frame

// SC07's right card and its inner chart…
const FROM_CARD: Box = { x: 972, y: 250, w: 852, h: 490 };
const FROM_CHART: Box = { x: 1016, y: 306, w: 682, h: 380 };
// …growing into SC08's card and its inner chart.
const TO_CARD: Box = { x: 96, y: 160, w: 1728, h: 812 };
const TO_CHART: Box = { x: 200, y: 230, w: 1500, h: 590 };
// ═══════════════════════════════════════════════════════════════════════════

/** 0 before the move, 1 once it rests. Takes a GLOBAL frame. */
export const expandT = (g: number) => (g >= EXPAND.start ? progressInOut(g, EXPAND.start, EXPAND.dur) : 0);

const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
});

export const expandCard = (g: number) => lerpBox(FROM_CARD, TO_CARD, expandT(g));
export const expandChart = (g: number) => lerpBox(FROM_CHART, TO_CHART, expandT(g));

/** Motion blur from the move's own speed — same device as the SC04 camera cut. */
export const expandBlur = (g: number) => velocityBlur(expandT, g, EXPAND.start, EXPAND.dur, BLUR_MAX);
