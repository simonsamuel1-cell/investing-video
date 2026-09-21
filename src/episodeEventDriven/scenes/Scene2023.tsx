/**
 * Scene 20-23 — Holds vs Fade → 1 Hour vs 1 Day (comp 5315–5823, dur 508). Two
 * phones fade in (Biasa left, Pro right); holds/fade arrows spring from the price
 * (5415), then volume highlight boxes land (5534, right box wider than the phone).
 * At 5644 the phone contents cross-fade to the "1 Hour" (left) and "1 Day" (right)
 * charts. At 5674 the left phone grows 5% while the right dims to 20%; at 5748 that
 * reverses (left back to size + dims, right grows 5% + returns to full). All out by
 * 5823. Frame = scene-local (0 at comp 5315).
 */
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { PhoneFrame } from "../components";
import { fadeIn, fadeOut } from "../helpers";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const RAMP = 14; // frames per transition

const TOP = 160;
const H = 780;
const CY = TOP + H / 2; // phone centre-y (for scaling origin)
const CX_L = 628; // left phone (Biasa → 1 Hour)
const CX_R = 1292; // right phone (Pro → 1 Day)

const ARROWS_AT = 100; // 5415 — arrows + labels appear
const ARROWS_OUT = 210; // 5525 — arrows + labels fully faded out
const VOL_AT = 219; // 5534 — volume highlight boxes appear
const SWAP_AT = 329; // 5644 — phone contents change to 1 Hour / 1 Day
const LEFT_BIG_AT = 359; // 5674 — left grows 5%, right dims to 20%
const SWAP2_AT = 433; // 5748 — left back + dims, right grows 5% + back to full
const END = 508; // 5823 — all visuals out

// Volume highlight boxes (over each phone's volume section).
const LEFT_VOL = { left: 440, top: 574, width: 256, height: 82 };
// Right box — wider than the phone (25px past each side: body 1090–1494).
const RIGHT_VOL = { left: 1065, top: 664, width: 454, height: 192 };

// ─── EDIT POSITIONS HERE ──────────────────────────────────────────────
// Each arrow runs from (x1,y1) [origin, on the price] to (x2,y2) [the tip].
const L_UP = { x1: 560, y1: 466, x2: 610, y2: 416 }; // Biasa — up arrow ("holds")
const L_DN = { x1: 560, y1: 476, x2: 610, y2: 526 }; // Biasa — down arrow ("fade")
const R_UP = { x1: 1360, y1: 536, x2: 1410, y2: 486 }; // Pro — up arrow ("holds")
const R_DN = { x1: 1360, y1: 546, x2: 1410, y2: 596 }; // Pro — down arrow ("fade")
// Label positions (top-left corner of the text).
const L_HOLDS = { x: 560, y: 356 }; // Biasa — "holds"
const R_HOLDS = { x: 1360, y: 426 }; // Pro — "holds"
const L_FADE = { x: 560, y: 526 }; // Biasa — "fade"
const R_FADE = { x: 1360, y: 596 }; // Pro — "fade"
// ──────────────────────────────────────────────────────────────────────

// Arrow thickness/head (30% of the original 17 / 54 / 34).
const SHAFT = 5;
const HEAD_LEN = 16;
const HEAD_W = 10;
const LABEL_SIZE = 42;

const Arrow = ({ x1, y1, x2, y2, color, op }: { x1: number; y1: number; x2: number; y2: number; color: string; op: number }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy; // perpendicular
  const py = ux;
  const bx = x2 - ux * HEAD_LEN; // base of the head
  const by = y2 - uy * HEAD_LEN;
  if (op <= 0) return null;
  return (
    <g opacity={op}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={SHAFT} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${bx + px * HEAD_W},${by + py * HEAD_W} ${bx - px * HEAD_W},${by - py * HEAD_W}`} fill={color} />
    </g>
  );
};

const Label = ({ x, y, text, color, op }: { x: number; y: number; text: string; color: string; op: number }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: LABEL_SIZE, fontWeight: theme.font.weights.extrabold, color, opacity: op }}>{text}</div>
);

const VolBox = ({ b, op }: { b: { left: number; top: number; width: number; height: number }; op: number }) =>
  op > 0 ? <div style={{ position: "absolute", ...b, border: `3px solid ${theme.colors.indigo}`, borderRadius: 10, opacity: op, boxSizing: "border-box" }} /> : null;

// A phone that can be scaled about its own centre (via a wrapping AbsoluteFill).
const ScaledPhone = ({ cx, img, op, scale }: { cx: number; img: string; op: number; scale: number }) =>
  op > 0 ? (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `${cx}px ${CY}px` }}>
      <PhoneFrame cx={cx} top={TOP} height={H} op={op} img={img} />
    </AbsoluteFill>
  ) : null;

export const Scene2023 = () => {
  const f = useCurrentFrame();

  // Biasa/Pro charts fade out as the contents swap at 5644.
  const oldPhoneOp = Math.min(fadeIn(f, 0, 16), fadeOut(f, SWAP_AT, RAMP));
  const arrOp = Math.min(fadeIn(f, ARROWS_AT, 14), fadeOut(f, ARROWS_OUT - 14, 14));
  const volOp = Math.min(fadeIn(f, VOL_AT, 14), fadeOut(f, SWAP_AT, RAMP));

  // 1 Hour / 1 Day charts: fade in at swap, then the focus dance, then out at 5823.
  const enterIn = fadeIn(f, SWAP_AT, RAMP);
  const finalOut = fadeOut(f, END - RAMP, RAMP);
  const leftFocus = interpolate(f, [SWAP2_AT, SWAP2_AT + RAMP], [1, 0.2], CLAMP);
  const rightFocus = interpolate(f, [LEFT_BIG_AT, LEFT_BIG_AT + RAMP, SWAP2_AT, SWAP2_AT + RAMP], [1, 0.2, 0.2, 1], CLAMP);
  const leftNewOp = enterIn * leftFocus * finalOut;
  const rightNewOp = enterIn * rightFocus * finalOut;
  const leftScale = interpolate(f, [LEFT_BIG_AT, LEFT_BIG_AT + RAMP, SWAP2_AT, SWAP2_AT + RAMP], [1, 1.05, 1.05, 1], CLAMP);
  const rightScale = interpolate(f, [SWAP2_AT, SWAP2_AT + RAMP], [1, 1.05], CLAMP);

  const up = theme.colors.indigo;
  const dn = theme.colors.candleRed;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* original Biasa/Pro charts */}
      <PhoneFrame cx={CX_L} top={TOP} height={H} op={oldPhoneOp} img="eventDriven/s2023-biasa.jpg" />
      <PhoneFrame cx={CX_R} top={TOP} height={H} op={oldPhoneOp} img="eventDriven/s2023-pro.jpg" />

      {/* 1 Hour / 1 Day charts (swap in at 5644) */}
      <ScaledPhone cx={CX_L} img="eventDriven/s23-1hour.jpg" op={leftNewOp} scale={leftScale} />
      <ScaledPhone cx={CX_R} img="eventDriven/s23-1day.jpg" op={rightNewOp} scale={rightScale} />

      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Arrow {...L_UP} color={up} op={arrOp} />
        <Arrow {...L_DN} color={dn} op={arrOp} />
        <Arrow {...R_UP} color={up} op={arrOp} />
        <Arrow {...R_DN} color={dn} op={arrOp} />
      </svg>

      <Label {...L_HOLDS} text="holds" color={up} op={arrOp} />
      <Label {...R_HOLDS} text="holds" color={up} op={arrOp} />
      <Label {...L_FADE} text="fade" color={dn} op={arrOp} />
      <Label {...R_FADE} text="fade" color={dn} op={arrOp} />

      {/* volume highlight boxes (5534 → out at the 5644 swap) */}
      <VolBox b={LEFT_VOL} op={volOp} />
      <VolBox b={RIGHT_VOL} op={volOp} />
    </AbsoluteFill>
  );
};
