/**
 * SceneStocksHighlight — cyan highlight box around the stocks list on the phone
 * (everything below the "Overview / Research / Stock / Feeds" tab row).
 * NV 3978→4120; frame = scene-local. Transparent fill, cyan border + glow, and the
 * box is deliberately WIDER than the phone — OVERHANG px past each side.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fadeIn, fadeOut } from "../util/anim";

// ─── POSITION / SIZE — edit these ────────────────────────────────────────────
// Phone body spans x 767–1154 (width 387), y 187–892.
const PHONE_LEFT = 767; // phone's left edge
const PHONE_W = 387; // phone's width
const OVERHANG = 25; // how far the box sticks out past EACH side of the phone

const HL_TOP = 288; // top edge → just below the "Overview Research Stock Feeds" tabs
const HL_BOTTOM = 890; // bottom edge → the bottom of the phone screen

const BORDER = 3; // border thickness
const RADIUS = 16; // corner radius
// ─────────────────────────────────────────────────────────────────────────────

const HL_X = PHONE_LEFT - OVERHANG;
const HL_W = PHONE_W + OVERHANG * 2;
const HL_H = HL_BOTTOM - HL_TOP;

export const SceneStocksHighlight = () => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 10), fadeOut(f, 128, 14)); // in @3978, out by 4120
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", left: HL_X, top: HL_TOP, width: HL_W, height: HL_H, boxSizing: "border-box", borderRadius: RADIUS, background: "transparent", border: `${BORDER}px solid ${COLORS.cyan}`, boxShadow: "0 0 22px rgba(92,200,227,0.75), inset 0 0 22px rgba(92,200,227,0.35)" }} />
    </AbsoluteFill>
  );
};
