/**
 * BumiCrop — a rectangle of BUMI_3's card (data/bumi-card.ts) drawn `h` tall. When the rectangle holds the Fair Value
 * gauge, its pointer is redrawn where the app put it (14 % along, in the green): the PNG has it painted out so SC03 can
 * move it, and a still crop without it would not be the app's screen. SC10's tools and SC11's caveat use it (Simon
 * 30 Oct: "diganti jadi screenshot existing").
 */
import { Img, staticFile } from "remotion";
import { usePalette } from "../../../core";
import { BUMI_CARD } from "../data/bumi-card";

export type Rect = { x1: number; y1: number; x2: number; y2: number };

/** The Company Quality and Fair Value columns under their titles (the cards that show them carry their own), measured on the PNG. */
export const BUMI_CQ: Rect = { x1: 110, y1: 218, x2: 650, y2: 480 };
export const BUMI_FV: Rect = { x1: 720, y1: 218, x2: 1440, y2: 480 };

/** The width a crop takes at height `h`. */
export const cropW = (r: Rect, h: number) => ((r.x2 - r.x1) * h) / (r.y2 - r.y1);

/** As in SC03, half again the original's size, so it reads at a crop's scale. */
const POINTER_K = 1.5;

export const BumiCrop = ({ r, h }: { r: Rect; h: number }) => {
  const c = usePalette();
  const k = h / (r.y2 - r.y1);
  const w = (r.x2 - r.x1) * k;
  const g = BUMI_CARD.gauge;
  const gauge = g.x0 >= r.x1 && g.x1 <= r.x2 && g.y >= r.y1 && g.y <= r.y2;
  const px = (g.x0 + (g.x1 - g.x0) * g.at - r.x1) * k;
  const py = (g.y - r.y1) * k;
  const pw = BUMI_CARD.pointer.w * k * POINTER_K;
  const ph = BUMI_CARD.pointer.h * k * POINTER_K;
  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden" }}>
      <Img src={staticFile(BUMI_CARD.src)} style={{ position: "absolute", left: -r.x1 * k, top: -r.y1 * k, width: BUMI_CARD.w * k, maxWidth: "none" }} />
      {gauge ? (
        <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={`M ${px} ${py} L ${px + pw / 2} ${py + ph} L ${px - pw / 2} ${py + ph} Z`} fill={c.ink} stroke={c.ink} strokeWidth={Math.max(1, 3 * k)} strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  );
};
