/**
 * VI03's shared pieces: VI02's kit (itself VI01's look on IN07's UI: line-art people, photo tiles, dashed text boxes, one
 * shot at a time), on this episode's words.
 */
import type React from "react";
import { Img, staticFile } from "remotion";
import { w } from "../data/timing";

export {
  Appear, AvatarFace, AvatarTile, BoardGrid, Card, Column, DashBox, Figure, GrowArrow, IconPill, KamuAvatar, Line, Mark,
  LedgerCard, ORANG_TUNTUN_RIGHT, OrangTuntun, PhotoTile, Pic, PriceCandles, Ring, Shot, WordPill, ease,
} from "../../vi02-membeli-saham-berarti-membeli-perusahaan/components/kit";
/** VI01's numbered heading at the top left (IN04's), as VI01 SC04–SC05 use it. */
export { Heading, HEADING, NumRing } from "../../vi01-apa-itu-value-investing/components/kit";

/** One of this episode's icons (Phosphor via Iconify, public/icons/vi03) painted in `tone` through its own shape. */
export const Glyph = ({ icon, size, tone }: { icon: string; size: number; tone: string }) => {
  const url = `url(${staticFile(`icons/vi03/ph-${icon}.svg`)})`;
  return <div style={{ width: size, height: size, flex: "none", background: tone, WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />;
};

/** A scene's word clock: the frame a phrase starts on, scene-local. */
export const useWords = (scene: number, block: number) => (phrase: string, nth = 0, edge: "f0" | "f1" = "f0") => w(scene, phrase, nth, edge) - block;

/** "Kamu" full body: VI02's young man (ChatGPT, public/art/vi02/kamu-full.png), facing right as drawn. */
export const KAMU_FULL = { src: "art/vi02/kamu-full.png", w: 453, h: 1451 } as const;

/**
 * VI03's black line-art drawings (ChatGPT, in VI01's warung style; public/art/vi03/line), with their pixel size — the ratio is
 * what matters. `Drawing` puts one `h` tall, centred on `cx`, standing on `floor`; its box (and any fade) on a wrapper div,
 * because Remotion's <Img> drops its own opacity in Studio (VI01's Pic).
 */
export const LINE_ART = {
  "fruit-stall": { w: 756, h: 721 },
  mango: { w: 533, h: 568 },
  bridge: { w: 576, h: 293 },
  minimarket: { w: 510, h: 325 },
  scooter: { w: 380, h: 295 },
} as const;
export type LineArtName = keyof typeof LINE_ART;
export const Drawing = ({ name, cx, floor, h, style }: { name: LineArtName; cx: number; floor: number; h: number; style?: React.CSSProperties }) => {
  const a = LINE_ART[name];
  const wd = (h * a.w) / a.h;
  return (
    <div style={{ position: "absolute", left: cx - wd / 2, top: floor - h, width: wd, height: h, ...style }}>
      <Img src={staticFile(`art/vi03/line/${name}.png`)} style={{ width: "100%", height: "100%", display: "block", maxWidth: "none" }} />
    </div>
  );
};
