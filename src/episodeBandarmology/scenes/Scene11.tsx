/**
 * Scene 11 — Public data tracks (comp 2618, dur 228). From 2618 the phone shows
 * the MARK capture (scene14-06.jpg) with a broker-table highlight; at 2668 it
 * fades to reveal the real app captures, which cross-dissolve
 * flow → insider → shareholders with their per-section highlights. Four
 * data-source points appear beside-right; all fade out by 2846.
 * Frame = comp − 2618.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, textReveal, blinkTwice } from "../helpers";

const { colors, font, type, radius } = theme;

// four points (scene-local frames: comp − 2618)
const POINTS = [
  { label: "Broker net buying", at: 2635 - 2618 }, // 17
  { label: "Foreign flows", at: 2682 - 2618 }, // 64
  { label: "Insider trades", at: 2725 - 2618 }, // 107
  { label: "Number of shareholders", at: 2774 - 2618 }, // 156
];

// phone: cx 640, height 811.
const PCX = 640;
const PTOP = 149;
const PH = 811;
const BODYW = Math.round((PH * 980) / 1920) + 12; // 426
const HL_LEFT = PCX - BODYW / 2 - 20; // 407 — original section boxes (20px each side)
const HL_WIDTH = BODYW + 40; // 466
const HL_LEFT25 = PCX - BODYW / 2 - 25; // 402 — MARK box (25px each side)
const HL_WIDTH25 = BODYW + 50; // 476
const fyv = (v: number) => PTOP + v * PH; // image-y fraction → screen

const SWAP = 50; // comp 2668 — MARK fades to reveal the captures
const MARK_TABLE = { fy0: 0.385, fy1: 0.868 }; // broker table (header → IH)

export const Scene11 = () => {
  const f = useCurrentFrame();
  const phoneOp = Math.min(fadeIn(f, 0, 16), fadeOut(f, 214, 14)); // in at 2618, out by 2846
  const markVis = fadeOut(f, SWAP, 12); // MARK on top until 2668
  const insiderOp = fadeIn(f, 107, 16); // capture cross-dissolves with the points
  const shareOp = fadeIn(f, 156, 16);

  const flowVis = 1 - insiderOp; // flow visible until the insider capture covers it
  const boxes = [
    { fy0: 0.237, fy1: 0.503, op: fadeIn(f, 57, 12) * flowVis }, // 30 June section (flow) — appears 2675
    { fy0: 0.526, fy1: 0.904, op: fadeIn(f, 57, 12) * flowVis }, // Flow Detail (flow) — appears 2675
    { fy0: 0.208, fy1: 0.896, op: fadeIn(f, 107, 12) * insiderOp * (1 - shareOp) }, // Insider
    { fy0: 0.172, fy1: 0.896, op: fadeIn(f, 156, 12) * shareOp * fadeOut(f, 214, 14) }, // Shareholder Count
  ];
  const markBox = blinkTwice(f, 10, SWAP + 12); // broker-table highlight, fades with MARK

  return (
    <SafeArea>
      <CapturePhone
        cx={PCX}
        top={PTOP}
        height={PH}
        op={phoneOp}
        imageLayers={[
          { src: "bandarmology/scene11-flow.jpg", op: 1 },
          { src: "bandarmology/scene11-insider.jpg", op: insiderOp },
          { src: "bandarmology/scene11-shareholders.jpg", op: shareOp },
          { src: "bandarmology/scene14-06.jpg", op: markVis }, // MARK insert (on top, 2618–2668)
        ]}
      />

      {/* MARK broker-table highlight (2618–2668) */}
      {markBox > 0.01 && (
        <div style={{ position: "absolute", left: HL_LEFT25, top: fyv(MARK_TABLE.fy0), width: HL_WIDTH25, height: fyv(MARK_TABLE.fy1) - fyv(MARK_TABLE.fy0), border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: markBox, boxSizing: "border-box" }} />
      )}

      {/* original section highlights (flow / insider / shareholders) */}
      {boxes.map((b, i) =>
        b.op > 0.01 ? (
          <div key={i} style={{ position: "absolute", left: HL_LEFT, top: fyv(b.fy0), width: HL_WIDTH, height: fyv(b.fy1) - fyv(b.fy0), border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: b.op, boxSizing: "border-box" }} />
        ) : null
      )}

      {/* four data-source points, beside-right of the phone */}
      <div style={{ position: "absolute", left: 1120, top: 320, width: 660, display: "flex", flexDirection: "column", gap: 40 }}>
        {POINTS.map((p) => {
          const rev = textReveal(f, p.at, 16);
          return (
            <div
              key={p.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                fontSize: type.subhead,
                fontWeight: font.weights.bold,
                color: colors.text,
                transform: rev.transform,
                opacity: Math.min(rev.opacity, fadeOut(f, 214, 14)),
              }}
            >
              <span style={{ width: 16, height: 16, borderRadius: 999, background: colors.indigo, flex: "0 0 auto" }} />
              {p.label}
            </div>
          );
        })}
      </div>
    </SafeArea>
  );
};
