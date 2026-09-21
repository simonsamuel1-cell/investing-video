/**
 * SceneThemeGrid — NV 700 onward (new content, 15 Jul revision). A 2×2 grid of
 * placeholder labels (Catalyst / Policy / Commodity / Sector), then a BUMI +12%
 * stock drops in below; the grid fades and BUMI rises, and four "????" tickers
 * appear beneath it. Frame = scene-local (0 at NV 700).
 *
 *   0        (700)  2×2 placeholder grid + headers fade in
 *   182      (882)  "BUMI +12%" appears below
 *   259→295  (959)  grid + headers fade out · BUMI glides up
 *   316      (1016) four "????" tickers appear below BUMI (1×4)
 */
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../theme";

const GREEN = "#22B573";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fIn = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [0, 1], CLAMP);
const fOut = (f: number, s: number, d: number) => interpolate(f, [s, s + d], [1, 0], CLAMP);

const CARD_W = 620;
const CARD_H = 120;
const COL1 = 310;
const COL2 = COL1 + CARD_W + 64; // 994
// `at` = scene-local appearance frame (NV frame − 700).
const CELLS = [
  { header: "Catalyst", x: COL1, hy: 208, cy: 260, at: 9 }, // 709
  { header: "Policy", x: COL2, hy: 208, cy: 260, at: 51 }, // 751
  { header: "Commodity", x: COL1, hy: 430, cy: 482, at: 95 }, // 795
  { header: "Sector", x: COL2, hy: 430, cy: 482, at: 139 }, // 839
];

// BUMI card (centred), glides up at 959.
const BUMI_W = 360;
const BUMI_Y0 = 648;
const BUMI_Y1 = 320;

// "????" tickers — 1 row × 4 cols below the risen BUMI.
const TICK_W = 280;
const TICK_H = 120;
const TICK_GAP = 36;
const TICK_LEFT = 960 - (4 * TICK_W + 3 * TICK_GAP) / 2; // 346
const TICK_Y = 476;

// Scan the four "????" one at a time (1132→1261): active one +20%, others −30%,
// indigo highlight. Then ABCD scales up + highlights at 1268. Scene-local frames.
const SCAN_START = 432; // 1132
const SCAN_END = 561; // 1261
const PER = (SCAN_END - SCAN_START) / 4; // 32.25 per label
const ABCD_HL = 568; // 1268

export const SceneThemeGrid = () => {
  const f = useCurrentFrame();

  const bumiOp = fIn(f, 182, 16);
  const bumiY = interpolate(f, [259, 295], [BUMI_Y0, BUMI_Y1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const tickOp = fIn(f, 316, 16);

  // scan envelope (0 outside the scan window, 1 inside)
  const scanEnv = interpolate(f, [SCAN_START - 8, SCAN_START, SCAN_END, SCAN_END + 8], [0, 1, 1, 0], CLAMP);
  // per-????-label scale (−30% resting, +20% when it's the active one) + highlight.
  // Trapezoid pulse: ramp up → quick hold at the top → ramp down (crossfades to next).
  const tick = (i: number) => {
    const d = Math.abs(f - (SCAN_START + (i + 0.5) * PER));
    const pulse = Math.max(0, Math.min(1, (6 + 10 - d) / 10)); // hold ±6, ramp 10
    return { scale: 1 + scanEnv * (-0.3 + pulse * 0.5), hl: scanEnv * pulse };
  };
  // ABCD scales up + highlights at 1268
  const abcdScale = interpolate(f, [ABCD_HL, ABCD_HL + 14], [1, 1.15], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const abcdHl = interpolate(f, [ABCD_HL, ABCD_HL + 12], [0, 1], CLAMP);

  return (
    <AbsoluteFill>
      {/* 2×2 placeholder grid + headers — each cell staggers in, all fade out at 959 */}
      {CELLS.map((c) => {
        const op = Math.min(fIn(f, c.at, 16), fOut(f, 259, 16));
        return (
          <div key={c.header} style={{ opacity: op }}>
            <div style={{ position: "absolute", left: c.x, top: c.hy, width: CARD_W, textAlign: "center", fontSize: 34, fontWeight: 800, color: COLORS.purple }}>
              {c.header}
            </div>
            <div style={{ position: "absolute", left: c.x, top: c.cy, width: CARD_W, height: CARD_H, boxSizing: "border-box", borderRadius: 18, border: `2px dashed ${COLORS.hairline}`, background: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 600, color: "#9AA0AA" }}>
              input placeholder here
            </div>
          </div>
        );
      })}

      {/* ABCD +12% */}
      <div style={{ position: "absolute", left: 960 - BUMI_W / 2, top: bumiY, width: BUMI_W, height: 104, boxSizing: "border-box", borderRadius: 20, border: `2.5px solid ${GREEN}`, background: "#FFFFFF", boxShadow: `0 18px 45px rgba(34,181,115,0.18), 0 0 0 ${4 * abcdHl}px rgba(95,77,238,${abcdHl}), 0 16px 44px rgba(95,77,238,${0.32 * abcdHl})`, padding: "0 26px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", opacity: bumiOp, transform: `scale(${abcdScale})`, transformOrigin: "center" }}>
        <span style={{ fontSize: 44, fontWeight: 800, color: COLORS.black, letterSpacing: 0.5 }}>ABCD</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 15px", borderRadius: 11, background: "rgba(34,181,115,0.12)", color: GREEN, fontSize: 29, fontWeight: 800 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>▲</span>12%
        </span>
      </div>

      {/* four "????" tickers (1×4) — scanned one at a time from 1132 */}
      {tickOp > 0 &&
        [0, 1, 2, 3].map((i) => {
          const { scale, hl } = tick(i);
          return (
            <div key={i} style={{ position: "absolute", left: TICK_LEFT + i * (TICK_W + TICK_GAP), top: TICK_Y, width: TICK_W, height: TICK_H, boxSizing: "border-box", borderRadius: 16, border: `2px solid ${COLORS.hairline}`, background: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, fontWeight: 800, color: "#9AA0AA", letterSpacing: 4, opacity: tickOp, transform: `scale(${scale})`, transformOrigin: "center", boxShadow: `0 0 0 ${3 * hl}px rgba(95,77,238,${hl}), 0 14px 34px rgba(95,77,238,${0.3 * hl})` }}>
              ????
            </div>
          );
        })}
    </AbsoluteFill>
  );
};
