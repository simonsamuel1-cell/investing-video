/**
 * Person — Orang_1, the "kamu" Simon supplied (INV07/Orang_1.png, cut to public/art/in07/orang-1.png; 29 Oct: "Ganti
 * jadi lebih realistis. Yaitu menggunakan Orang_1.png"), in front of a cyan circle: the head stands out over its top
 * and the body ends at its rim, as in his reference. SC07 and SC09 use it.
 *
 * PERSON gives that circle in the picture's own pixels (centre x `cx`, top `top`, `d` across — on the shoulders);
 * `s` scales the picture, (cx, cy) put the circle's centre on the canvas; `tone` is the circle (amber: "kamu"). `filter` fades in the face-filter copy
 * (scripts/vi/face-filter.py, SC07's switch).
 */
import { Img, staticFile } from "remotion";
import { theme } from "../../../core";

export type Pic = { src: string; filtered?: string; w: number; h: number; cx: number; top: number; d: number };

export const PERSON: Pic = { src: "art/in07/orang-1.png", filtered: "art/in07/orang-1-filter.png", w: 370, h: 1000, cx: 152, top: 150, d: 420 };

/**
 * Orang_2, standing (INV07/Orang_2.png → public/art/in07/orang-2.png through scripts/vi/cutout.py; Simon 30 Oct:
 * "Pake Orang_2"). Measured off the cut-out: the neck is row 205, the shoulders are ~400 px across and centred on
 * x 222, so the circle sits on them exactly as Orang_1's does. SC11 uses it.
 */
export const PERSON_2: Pic = { src: "art/in07/orang-2.png", w: 505, h: 1331, cx: 222, top: 205, d: 585 };

/**
 * Orang Tuntun (public/art/in01/orang-tuntun.png, the insight man IN04 casts) on the same kind of circle, 560 px
 * across round x 460 with its top at row 380, on the shoulders — its middle low enough that his raised arm, elbow included, stays above its middle
 * and is never cut. SC04 uses him small,
 * as the analyst watching the research folder (Simon 9 Nov: "[ Orang Tuntun --> Folder ]").
 */
export const ORANG_TUNTUN: Pic = { src: "art/in01/orang-tuntun.png", w: 941, h: 1672, cx: 460, top: 380, d: 560 };

/** The circle's centre when the head's top (the picture's top) is at `top`. */
export const personCy = (top: number, s: number, pic: Pic = PERSON) => top + (pic.top + pic.d / 2) * s;

export const Person = ({ cx, cy, s, filter = 0, pic = PERSON, tone = theme.color.selfAmber }: { cx: number; cy: number; s: number; filter?: number; pic?: Pic; tone?: string }) => {
  const w = pic.w * s;
  const h = pic.h * s;
  const ox = pic.cx * s;
  const oy = (pic.top + pic.d / 2) * s;
  const r = (pic.d * s) / 2;
  // one path, both parts clockwise so they add up: the band above the circle's middle, and the circle
  const clip = `path('M 0 0 H ${w.toFixed(1)} V ${oy.toFixed(1)} H 0 Z M ${(ox - r).toFixed(1)} ${oy.toFixed(1)} A ${r} ${r} 0 1 1 ${(ox + r).toFixed(1)} ${oy.toFixed(1)} A ${r} ${r} 0 1 1 ${(ox - r).toFixed(1)} ${oy.toFixed(1)} Z')`;
  return (
    <>
      <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: 999, background: tone }} />
      <Img src={staticFile(pic.src)} style={{ position: "absolute", left: cx - ox, top: cy - oy, width: w, height: h, maxWidth: "none", clipPath: clip }} />
      {/* the face filter: the same picture warped, faded in over it (identical outside the face) */}
      {filter > 0.001 && pic.filtered ? <Img src={staticFile(pic.filtered)} style={{ position: "absolute", left: cx - ox, top: cy - oy, width: w, height: h, maxWidth: "none", clipPath: clip, opacity: filter }} /> : null}
    </>
  );
};
