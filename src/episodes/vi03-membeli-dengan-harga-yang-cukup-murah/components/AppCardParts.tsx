import type React from "react";
import { Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Lato";
import { theme, usePalette } from "../../../core";

/**
 * Columns of Tuntun's BBCA card (VIDEO 09's screenshot, public/art/vi03/app/bbca-rfv.svg, 343 × 78 units — the card SC05 shows),
 * cut out one at a time, for VI03 SC07 (Simon 18 Nov: "ingat reference fair value? ambil bagian Company Quality nya aja";
 * "reference fair value yang parameter di tengah, dibuat menurun"; then "Company qualitynya bisa kamu animasi fade transition dari
 * Best ke Good aja"). Every number below is in the card's own units, measured on an 8× render of the svg (18 Nov):
 *   Company Quality   title 13–84.75 × 11.25–19.88 · "Best" 38–60.88 × 29.38–38 · bar 8–90 × 46–50, three segments
 *                     8–34.63 / 35.75–62.25 / 63.38–90 · labels 8.25–89.63 × 60.5–69
 *   Reference FV      title 128.25–214.38 × 11.13–18.13 · figures 136.13–206.88 × 29.25–39.75 · gauge 106.5–236.5 × 46–53
 *                     (pointer 138–142) · "15 - 27% Undervalued" 125.25–217.5 × 60.38–67.13
 *   dividers at x ≈ 98.25 and 244.5 (left out of both cuts)
 * What changes is drawn over the screenshot in the app's own type (Lato Bold) and colours (theme appQualityGreen /
 * appMeterEmpty): "Good" over "Best" and the third segment going grey; the fair value's figures, counting.
 */
const { fontFamily: LATO } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const BBCA_CARD = { src: "art/vi03/app/bbca-rfv.svg", w: 343, h: 78 } as const;
/** the two cuts, 6 units round each column's ink */
export const APP_PART = {
  cq: { x0: 2, y0: 5, x1: 96, y1: 75 },
  rfv: { x0: 100.5, y0: 5, x1: 242.5, y1: 75 },
} as const;
type Part = (typeof APP_PART)[keyof typeof APP_PART];
/** the value line ("Best", the figures): Lato Bold whose cap height is the screenshot's 8.63 units (cap = 0.7165 em) */
const VALUE = { size: 8.63 / 0.7165, baseline: 38 };
const CQ = { mid: 49.44, best: { x0: 37, y0: 28.4, x1: 62, y1: 39 }, third: { x0: 63.38, x1: 90, y0: 46, y1: 50 } };
const RFV = { mid: 171.5, cover: { x0: 134.5, y0: 28.2, x1: 208.5, y1: 41 } };

export const appPartSize = (part: Part, k: number) => ({ w: (part.x1 - part.x0) * k, h: (part.y1 - part.y0) * k });

/** a cut of the card, `k` px per card unit, its top-left at (x, y); `children` is SVG in the card's units, drawn over it */
const Cut = ({ part, k, x, y, opacity = 1, children }: { part: Part; k: number; x: number; y: number; opacity?: number; children?: React.ReactNode }) => {
  const { w, h } = appPartSize(part, k);
  if (opacity <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", opacity }}>
      <Img showInTimeline={false} src={staticFile(BBCA_CARD.src)} style={{ position: "absolute", left: -part.x0 * k, top: -part.y0 * k, width: BBCA_CARD.w * k, height: BBCA_CARD.h * k, maxWidth: "none", display: "block" }} />
      {children ? (
        <svg width={w} height={h} viewBox={`${part.x0} ${part.y0} ${part.x1 - part.x0} ${part.y1 - part.y0}`} style={{ position: "absolute", left: 0, top: 0 }}>
          {children}
        </svg>
      ) : null}
    </div>
  );
};

/** Company Quality; `good` 0 → 1 fades "Best" (the screenshot) into "Good", its third segment into the empty grey */
export const CompanyQualityCut = ({ k, x, y, opacity = 1, good = 0 }: { k: number; x: number; y: number; opacity?: number; good?: number }) => {
  const c = usePalette();
  const b = CQ.best,
    t = CQ.third,
    r = (t.y1 - t.y0) / 2;
  return (
    <Cut part={APP_PART.cq} k={k} x={x} y={y} opacity={opacity}>
      {good > 0.001 ? (
        <g opacity={good}>
          <rect x={b.x0} y={b.y0} width={b.x1 - b.x0} height={b.y1 - b.y0} fill={c.cardBg} />
          <text x={CQ.mid} y={VALUE.baseline} textAnchor="middle" fontFamily={LATO} fontWeight={700} fontSize={VALUE.size} fill={theme.color.appQualityGreen}>
            Good
          </text>
          {/* the third segment: square at its left, round at its right, as in the screenshot */}
          {/* 0.3 units over the green all round its outer edges, so no green rim shows through the anti-aliasing */}
          <path d={`M ${t.x0} ${t.y0 - 0.3} H ${t.x1 - r} A ${r + 0.3} ${r + 0.3} 0 0 1 ${t.x1 - r} ${t.y1 + 0.3} H ${t.x0} Z`} fill={theme.color.appMeterEmpty} />
        </g>
      ) : null}
    </Cut>
  );
};

const thousands = (n: number) => Math.round(n).toLocaleString("en-US");

/** Reference Fair Value; its figures redrawn (the screenshot's covered) from `from` to `to`, `p` 0 → 1 */
export const FairValueCut = ({
  k,
  x,
  y,
  opacity = 1,
  from,
  to,
  p,
}: {
  k: number;
  x: number;
  y: number;
  opacity?: number;
  from: readonly [number, number];
  to: readonly [number, number];
  p: number;
}) => {
  const c = usePalette();
  const v = RFV.cover;
  const lo = from[0] + (to[0] - from[0]) * p,
    hi = from[1] + (to[1] - from[1]) * p;
  return (
    <Cut part={APP_PART.rfv} k={k} x={x} y={y} opacity={opacity}>
      <rect x={v.x0} y={v.y0} width={v.x1 - v.x0} height={v.y1 - v.y0} fill={c.cardBg} />
      <text x={RFV.mid} y={VALUE.baseline} textAnchor="middle" fontFamily={LATO} fontWeight={700} fontSize={VALUE.size} fill={c.ink} style={{ fontVariantNumeric: "tabular-nums" }}>
        {`${thousands(lo)} - ${thousands(hi)}`}
      </text>
    </Cut>
  );
};

/** the card's fair value as the screenshot shows it */
export const BBCA_FAIR_VALUE = [6943, 8168] as const;
