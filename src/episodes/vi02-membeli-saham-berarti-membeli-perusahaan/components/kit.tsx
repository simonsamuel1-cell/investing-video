/** VI02's shared pieces: the kit of the videos before it, on this episode's words. */
import type React from "react";
import { Img, staticFile } from "remotion";
import { theme, typeStyle, usePalette, useShadow } from "../../../core";
import { w } from "../data/timing";

/** Illustrations go grey and soft (Simon 6 Nov: "minimalis, monochrome, dan UI", the same pictures, only their colour and style). */
export const MONO = "grayscale(1) contrast(0.72) brightness(1.18)";

export { Appear, BoardGrid, Card, Disc, HEADING, Ico, Line, Mark, NumRing, OpeningHeading, ORANG_TUNTUN_RIGHT, OrangTuntun, ease } from "../../in07-cara-tuntun-membantu-investor/components/kit";

/** A scene's word clock: the frame a phrase starts on, scene-local. */
export const useWords = (scene: number, block: number) => (phrase: string, nth = 0, edge: "f0" | "f1" = "f0") => w(scene, phrase, nth, edge) - block;

/** A round white node, its icon inside (or a round `logo` filling it) and its label under it, centred on (x, y). */
export const IconDisc = ({ x, y, d, icon, logo, label, ring, opacity = 1, labelSize = 30 }: { x: number; y: number; d: number; icon?: string; logo?: string; label?: string; ring?: string; opacity?: number; labelSize?: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, opacity }}>
      <div style={{ width: d, height: d, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 ${ring ? 4 : 2}px ${ring ?? theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {logo ? <Img src={staticFile(logo)} style={{ width: d, height: d, borderRadius: 999 }} /> : <Img src={staticFile(`icons/vi02/ph-${icon}.svg`)} style={{ width: d * 0.5, height: d * 0.5 }} />}
      </div>
      {label ? <div style={{ position: "absolute", left: "50%", top: d + 14, transform: "translateX(-50%)", ...typeStyle("label"), fontSize: labelSize, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{label}</div> : null}
    </div>
  );
};

/** The ring round a card the VO is on, easing in and out: a Card `line` would pop, and shift what is inside it by its width. */
export const Ring = ({ p, tone = theme.color.connector }: { p: number; tone?: string }) => <div style={{ position: "absolute", inset: 0, borderRadius: theme.shape.cardRadius, boxShadow: `inset 0 0 0 2px ${tone}`, opacity: p }} />;

/** A word in a pill. */
export const WordPill = ({ x, y, text, opacity = 1, size = 30 }: { x: number; y: number; text: string; opacity?: number; size?: number }) => {
  const c = usePalette();
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", padding: "12px 30px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("label"), fontSize: size, fontWeight: 600, letterSpacing: 0.5, color: c.indigo, whiteSpace: "nowrap", opacity }}>{text}</div>;
};

/** An arrow growing from (x0, y0) to (x1, y1), its head riding the tip. */
export const GrowArrow = ({ x0, y0, x1, y1, p }: { x0: number; y0: number; x1: number; y1: number; p: number }) => {
  if (p <= 0.001) return null;
  const x = x0 + (x1 - x0) * p;
  const y = y0 + (y1 - y0) * p;
  const a = Math.atan2(y1 - y0, x1 - x0);
  const head = (t: number) => `${(x - 14 * Math.cos(a + t)).toFixed(1)} ${(y - 14 * Math.sin(a + t)).toFixed(1)}`;
  return (
    <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g fill="none" stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <line x1={x0} y1={y0} x2={x} y2={y} />
        <path d={`M ${head(0.6)} L ${x.toFixed(1)} ${y.toFixed(1)} L ${head(-0.6)}`} />
      </g>
    </svg>
  );
};

/** A price tag, its nose to the left, a hole in it; `children` sit in its middle. */
export const PriceTag = ({ x, y, w, h, nose, hole, children }: { x: number; y: number; w: number; h: number; nose: number; hole: number; children: React.ReactNode }) => {
  const c = usePalette();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={`M ${nose} 12 Q ${nose + 6} 0 ${nose + 22} 0 L ${w - 34} 0 Q ${w} 0 ${w} 34 L ${w} ${h - 34} Q ${w} ${h} ${w - 34} ${h} L ${nose + 22} ${h} Q ${nose + 6} ${h} ${nose} ${h - 12} L 14 ${h / 2 + 14} Q 0 ${h / 2} 14 ${h / 2 - 14} Z`} fill={c.cardBg} stroke={theme.color.hairlineBrandSolid} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={nose - 6} cy={h / 2} r={hole / 2} fill={theme.color.neutralDisc} stroke={theme.color.hairlineBrandSolid} strokeWidth={2} />
      </svg>
      <div style={{ position: "absolute", left: nose + 10, right: 20, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

/** One of this episode's icons painted in `tone` through its own shape, so it can go grey at rest and indigo when lit. */
export const Glyph = ({ icon, size, tone }: { icon: string; size: number; tone: string }) => {
  const url = `url(${staticFile(`icons/vi02/ph-${icon}.svg`)})`;
  return <div style={{ width: size, height: size, flex: "none", background: tone, WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />;
};
