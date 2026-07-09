import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";

/**
 * Scene 10 — Disclaimer.
 * Continuous text beats handed off in sync with the VO.
 *
 * Frames 0–268 build a literal empty graph (X/Y axes) with a "Fair value" area
 * inside it; the graph fades out with the "Changes…" caption. The remaining beats
 * are text-only.
 *
 * Timings are OFFSETS from sceneStartFrame; do not hardcode an absolute position.
 * (In this project the parent <Sequence from=...> rebases frame to 0, so the
 * default sceneStartFrame=0 makes local === frame.)
 */

export interface Scene10DisclaimerProps {
  sceneStartFrame?: number;
  logoSrc?: string;
  showEntityLine?: boolean;
  // Copy — swap to Bahasa by passing props
  kicker?: string;
  estimate?: string;
  notGuarantee?: string;
  fairValue?: string;
  changes?: string;
  education?: string;
  notRecommendation?: string;
  carriesRisk?: string;
  yours?: string;
  research?: string;
  entityLine?: string;
}

// Composition / brand constants
const W = 1920;
const SAFE_L = 96;
const SAFE_R = W - 96; // 1824

const COL_PRIMARY = "#5F4DEE";
const COL_INK = "#000000";
const COL_SLATE = "#626266";

const FONT = "Plus Jakarta Sans";

// Empty-graph geometry (all inside the safe area). Centered on x=960, and vertically centered on y=540.
const AX_LEFT = 260; // y-axis x / origin x
const AX_BOTTOM = 875; // x-axis y / origin y  (clear of the 108 px subtitle zone)
const AX_LEN = 1400; // x-axis length
const AX_TOP = 205; // y-axis top
const AX_RIGHT = AX_LEFT + AX_LEN; // 1660
const AREA_H = 143; // Fair value band height (scaled with the y-axis)

const clampInOut = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Scene10Disclaimer: React.FC<Scene10DisclaimerProps> = ({
  sceneStartFrame = 0,
  logoSrc,
  showEntityLine = false,
  kicker = "And finally —",
  estimate = "Estimate",
  notGuarantee = "not a guarantee",
  fairValue = "Fair value",
  changes = "Changes as the business changes.",
  education = "Education",
  notRecommendation = "Not a Buy / Sell Recommendation",
  carriesRisk = "Investing Carries Risk",
  yours = "Yours",
  research = "Do Your Own Research",
  entityLine = "PT Tuntun Sekuritas Indonesia",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - sceneStartFrame;

  // Guard: nothing renders before the scene starts (prevents end-state ghost flash)
  if (local < 0) return <AbsoluteFill style={{ background: "#F5F5F5" }} />;

  // ── Fade helper (staggered in/out so text boxes never overlap) ──────────
  const fade = (inS: number, inE: number, outS: number, outE: number) =>
    Math.min(
      interpolate(local, [inS, inE], [0, 1], { ...clampInOut, easing: Easing.out(Easing.cubic) }),
      interpolate(local, [outS, outE], [1, 0], clampInOut)
    );

  // ── Empty graph: axes draw in 0–12, whole graph fades out 258–268 ───────
  const graphOut = interpolate(local, [258, 268], [1, 0], clampInOut);
  const yAxisTop = interpolate(local, [0, 12], [AX_BOTTOM, AX_TOP], { ...clampInOut, easing: Easing.out(Easing.cubic) });
  const xAxisRight = interpolate(local, [0, 12], [AX_LEFT, AX_RIGHT], { ...clampInOut, easing: Easing.out(Easing.cubic) });

  // ── "Fair value" area: appears at 78; moves up 100 px at 202 ────────────
  const areaOp = interpolate(local, [78, 92], [0, 1], { ...clampInOut, easing: Easing.out(Easing.cubic) });
  const areaCenterY = interpolate(local, [202, 216], [645, 495], { ...clampInOut, easing: Easing.inOut(Easing.cubic) });

  // ── Beat opacities ──────────────────────────────────────────────────────
  const kickerOp = fade(0, 12, 50, 59); // B1  0.00–1.98
  const estimateOp = fade(62, 78, 170, 181); // B2  1.98–6.03
  const notGuaranteeOp = fade(138, 150, 170, 181); // appears at 03:33.07
  const changesOp = fade(186, 202, 258, 268); // B3  6.03–8.92
  const educationOp = fade(272, 288, 380, 390); // B4  8.92–13.00
  const notRecOp = fade(280, 296, 380, 390);
  const carriesRiskOp = fade(394, 410, 444, 452); // B5a 13.00–15.0
  const yoursOp = fade(456, 472, 510, 518); // B5b 15.0–17.22
  const researchOp = fade(520, 536, 585, 600); // B6  17.22–19.00 (holds, then logo-tail fade)

  // "Yours" soft settle pulse (scale 1.06 → 1.0)
  const yoursSettle = spring({ frame: Math.max(0, local - 456), fps, config: { damping: 14, stiffness: 110, mass: 0.7 } });
  const yoursScale = interpolate(yoursSettle, [0, 1], [1.06, 1.0]);

  // ── Book / edu glyph (B4), draws in beside "Education" ──
  const bookOp = fade(276, 292, 380, 390);
  const bookScale = interpolate(local, [276, 292], [0.7, 1], { ...clampInOut, easing: Easing.out(Easing.cubic) });

  // ── Logo tail: content fades out 585–600, logo fades in 600–620 ──
  const contentFade = interpolate(local, [585, 600], [1, 0], clampInOut);
  const logoOp = interpolate(local, [600, 620], [0, 1], clampInOut);

  return (
    <AbsoluteFill style={{ background: "#F5F5F5", fontFamily: FONT, fontVariantNumeric: "tabular-nums" }}>
      {/* ── Main content; fades out for the logo tail ── */}
      <AbsoluteFill style={{ opacity: contentFade }}>
        {/* ── Empty graph (axes + Fair value area), gated on local >= 0; fades out 258–268 ── */}
        <AbsoluteFill style={{ opacity: graphOut }}>
          <svg width={W} height={1080} viewBox={`0 0 ${W} 1080`} style={{ position: "absolute", top: 0, left: 0 }}>
            {/* Y-axis */}
            <line x1={AX_LEFT} y1={AX_BOTTOM} x2={AX_LEFT} y2={yAxisTop} stroke={COL_SLATE} strokeWidth={2} strokeLinecap="round" />
            {/* X-axis */}
            <line x1={AX_LEFT} y1={AX_BOTTOM} x2={xAxisRight} y2={AX_BOTTOM} stroke={COL_SLATE} strokeWidth={2} strokeLinecap="round" />
          </svg>

          {/* Fair value band — fill with dashed top/bottom edges (no side border, square corners) */}
          <div
            style={{
              position: "absolute",
              left: AX_LEFT,
              top: areaCenterY - AREA_H / 2,
              width: AX_LEN,
              height: AREA_H,
              boxSizing: "border-box",
              background: "rgba(92,200,227,0.12)",
              borderTop: `2px dashed ${COL_PRIMARY}`,
              borderBottom: `2px dashed ${COL_PRIMARY}`,
              borderRadius: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: areaOp,
            }}
          >
            <span style={{ fontFamily: FONT, fontWeight: 400, fontStyle: "italic", fontSize: 44, color: COL_PRIMARY }}>{fairValue}</span>
          </div>
        </AbsoluteFill>

        {/* B4 book / edu glyph beside "Education" (independent of the graph) */}
        {bookOp > 0.001 && (
          <svg width={W} height={1080} viewBox={`0 0 ${W} 1080`} style={{ position: "absolute", top: 0, left: 0 }}>
            <g opacity={bookOp} transform={`translate(648 425) scale(${bookScale})`}>
              <path d="M 0 -18 L 0 18 L -26 12 L -26 -22 Z" stroke={COL_PRIMARY} strokeWidth={2} fill="none" strokeLinejoin="round" />
              <path d="M 0 -18 L 0 18 L 26 12 L 26 -22 Z" stroke={COL_PRIMARY} strokeWidth={2} fill="none" strokeLinejoin="round" />
            </g>
          </svg>
        )}

        {/* ── Text beats (centered horizontally; vertical center via translateY(-50%)) ── */}

        {/* B1 — kicker (top of screen, header position) */}
        <TextLine top={220} opacity={kickerOp} style={{ fontWeight: 500, fontSize: 32, color: COL_SLATE }}>
          {kicker}
        </TextLine>

        {/* B2 — "Estimate" + "not a guarantee" (top of screen, header position) */}
        <TextLine top={210} opacity={estimateOp} style={{ fontWeight: 700, fontSize: 96, color: COL_PRIMARY }}>
          {estimate}
        </TextLine>
        <TextLine top={295} opacity={notGuaranteeOp} style={{ fontWeight: 500, fontSize: 40, color: COL_SLATE }}>
          {notGuarantee}
        </TextLine>

        {/* B3 — caption (top of screen, header position) */}
        <TextLine top={220} opacity={changesOp} style={{ fontWeight: 500, fontSize: 36, color: COL_INK }}>
          {changes}
        </TextLine>

        {/* B4 — "Education" + sub-line */}
        <TextLine top={425} opacity={educationOp} style={{ fontWeight: 800, fontSize: 104, color: COL_PRIMARY }}>
          {education}
        </TextLine>
        <TextLine top={545} opacity={notRecOp} style={{ fontWeight: 600, fontSize: 44, color: COL_INK }}>
          {notRecommendation}
        </TextLine>

        {/* B5a — "Investing Carries Risk" */}
        <TextLine top={470} opacity={carriesRiskOp} style={{ fontWeight: 700, fontSize: 72, color: COL_INK }}>
          {carriesRisk}
        </TextLine>

        {/* B5b — "Yours" lands with a soft settle */}
        <TextLine top={475} opacity={yoursOp} style={{ fontWeight: 800, fontSize: 96, color: COL_PRIMARY, transform: `translateY(-50%) scale(${yoursScale})` }}>
          {yours}
        </TextLine>

        {/* B6 — "Do Your Own Research" holds center */}
        <TextLine top={465} opacity={researchOp} style={{ fontWeight: 700, fontSize: 80, color: COL_INK }}>
          {research}
        </TextLine>
      </AbsoluteFill>

      {/* ── Logo tail (only renders when a logo asset is supplied) ── */}
      {logoSrc && (
        <AbsoluteFill style={{ opacity: logoOp, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src={logoSrc} style={{ width: 420, height: "auto", display: "block" }} />
          {showEntityLine && <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 26, color: COL_SLATE }}>{entityLine}</div>}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Centered text line; its vertical center sits at `top`.
const TextLine: React.FC<{ top: number; opacity: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ top, opacity, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE_L,
      right: W - SAFE_R,
      top,
      transform: "translateY(-50%)",
      textAlign: "center",
      opacity,
      fontFamily: FONT,
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);
