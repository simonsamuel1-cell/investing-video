/**
 * Scene 20-23 — Holds vs Fade (comp 5315–5814, dur 499). After the "Don't" beat,
 * two phones fade in: the "Biasa" (regular) chart on the left and the "Pro" chart
 * on the right. At 5415 an indigo arrow (up) and a red arrow (down) spring from the
 * current price on each phone — "holds" beside the up arrows, "fade" beside the
 * down arrows. Arrow thickness reduced to 30%. At 5534 a highlight box lands on the
 * volume section of each phone; at 5644 everything cross-fades to the full-width
 * "Scene 23" image. Frame = scene-local (0 at comp 5315).
 */
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { PhoneFrame } from "../components";
import { fadeIn, fadeOut } from "../helpers";

const TOP = 160;
const H = 780;
const CX_L = 628; // left phone (Biasa)
const CX_R = 1292; // right phone (Pro)

const ARROWS_AT = 100; // 5415 — arrows + labels appear
const ARROWS_OUT = 210; // 5525 — arrows + labels fully faded out
const VOL_AT = 219; // 5534 — volume highlight boxes appear
const TRANS_AT = 329; // 5644 — cross-fade to Scene 23
const END = 499; // 5814 — group end

// Volume highlight boxes (over each phone's volume section).
const LEFT_VOL = { left: 440, top: 574, width: 256, height: 82 };
const RIGHT_VOL = { left: 1150, top: 664, width: 336, height: 192 };

// Scene 23 image — full frame, no phone template, ~1120px wide (1920×980 source).
const S23_W = 1120;
const S23_H = Math.round((S23_W * 980) / 1920); // 572
const S23_LEFT = Math.round((1920 - S23_W) / 2); // 400
const S23_TOP = Math.round((1080 - S23_H) / 2); // 254

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

export const Scene2023 = () => {
  const f = useCurrentFrame();
  // Everything (phones, arrows, boxes) fades out into Scene 23 at 5644.
  const transOut = fadeOut(f, TRANS_AT, 14);
  const phoneOp = Math.min(fadeIn(f, 0, 16), transOut);
  const arrOp = Math.min(fadeIn(f, ARROWS_AT, 14), fadeOut(f, ARROWS_OUT - 14, 14));
  const volOp = Math.min(fadeIn(f, VOL_AT, 14), transOut);
  const s23Op = Math.min(fadeIn(f, TRANS_AT, 14), fadeOut(f, END - 14, 14));
  const up = theme.colors.indigo;
  const dn = theme.colors.candleRed;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <PhoneFrame cx={CX_L} top={TOP} height={H} op={phoneOp} img="eventDriven/s2023-biasa.jpg" />
      <PhoneFrame cx={CX_R} top={TOP} height={H} op={phoneOp} img="eventDriven/s2023-pro.jpg" />

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

      {/* volume highlight boxes (5534 → cross-fade at 5644) */}
      <VolBox b={LEFT_VOL} op={volOp} />
      <VolBox b={RIGHT_VOL} op={volOp} />

      {/* Scene 23 — full-width image, no phone template (fades in at 5644) */}
      {s23Op > 0 && (
        <Img src={staticFile("eventDriven/scene23.jpg")} style={{ position: "absolute", left: S23_LEFT, top: S23_TOP, width: S23_W, height: S23_H, opacity: s23Op }} />
      )}
    </AbsoluteFill>
  );
};
