/**
 * VI01's shared pieces: the kit of the videos before it, on this episode's words, plus its people.
 *
 * The people are black simplified line art from ChatGPT in the style of Simon's three references (10 Nov 2026,
 * Pustaka "Tokoh · garis hitam sederhana"): public/art/vi01, cut from one sheet by scripts/vi/split-sprites.py.
 */
import type React from "react";
import { Img, interpolateColors, staticFile } from "remotion";
import { theme, typeStyle, usePalette, useShadow } from "../../../core";
import { w } from "../data/timing";

export { Appear, Card, Line, OUTSIDE_RESERVES, ease } from "../../in07-cara-tuntun-membantu-investor/components/kit";

/** A scene's word clock: the frame a phrase starts on, scene-local. */
export const useWords = (scene: number, block: number) => (phrase: string, nth = 0, edge: "f0" | "f1" = "f0") => w(scene, phrase, nth, edge) - block;

/** The drawings, with their pixel size (the ratio is what matters). */
export const ART = {
  warung: { w: 1135, h: 1067 },
  "ibu-sari": { w: 479, h: 1414 },
  "ibu-sari-stok": { w: 369, h: 834 },
  "ibu-sari-sapu": { w: 475, h: 782 },
  "ibu-sari-duduk": { w: 581, h: 944 },
  "mr-market": { w: 568, h: 926 },
  "investor-panik": { w: 363, h: 916 },
  graham: { w: 406, h: 423 },
  buffett: { w: 404, h: 423 },
  schloss: { w: 404, h: 423 },
  munger: { w: 405, h: 424 },
} as const;
export type ArtName = keyof typeof ART;

/**
 * A drawing `h` tall, centred on `cx`, standing on `floor`. `faint` takes its black lines to a light grey and keeps every
 * fill opaque (no transparency: Simon's rule) — someone the scene is not looking at.
 */
export const Figure = ({ name, cx, floor, h, faint = 0, flip = false, style }: { name: ArtName; cx: number; floor: number; h: number; faint?: number; flip?: boolean; style?: React.CSSProperties }) => {
  const a = ART[name];
  const wd = (h * a.w) / a.h;
  const filter = faint > 0.001 ? `contrast(${(1 - 0.62 * faint).toFixed(3)}) brightness(${(1 + 0.5 * faint).toFixed(3)})` : undefined;
  const transform = [style?.transform, flip ? "scaleX(-1)" : undefined].filter(Boolean).join(" ") || undefined;
  return <Pic src={staticFile(`art/vi01/${name}.png`)} style={{ position: "absolute", left: cx - wd / 2, top: floor - h, width: wd, height: h, filter, ...style, transform }} />;
};

/**
 * A picture whose box — position, size, OPACITY, transform — is a div around the <Img>.
 *
 * ⚠ IN STUDIO, REMOTION'S <Img> DROPS `opacity` FROM ITS OWN STYLE: a fade written on the <Img> renders in a still or an
 * export but never shows while scrubbing in Studio (Simon 10 Nov: "transparansinya 100%, langsung 0%, langsung 100% lagi").
 * So every faded picture goes through here. Without a height in `style` the picture keeps its own ratio.
 */
export const Pic = ({ src, style }: { src: string; style: React.CSSProperties }) => (
  <div style={style}>
    <Img src={src} style={{ width: "100%", height: style.height === undefined ? "auto" : "100%", display: "block", maxWidth: "none" }} />
  </div>
);

/** One of this episode's icons (Phosphor, public/icons/vi01) painted in `tone` through its own shape. */
export const Glyph = ({ icon, size, tone }: { icon: string; size: number; tone: string }) => {
  const url = `url(${staticFile(`icons/vi01/ph-${icon}.svg`)})`;
  return <div style={{ width: size, height: size, flex: "none", background: tone, WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />;
};

/** A pill with an icon on a grey disc and a short label, its top-left at (x, y). */
export const IconPill = ({ x, y, icon, text, size = 34, style }: { x: number; y: number; icon: string; text: string; size?: number; style?: React.CSSProperties }) => {
  const c = usePalette();
  const shadow = useShadow();
  const d = size * 1.65;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: size * 0.5, padding: `${size * 0.28}px ${size * 0.9}px ${size * 0.28}px ${size * 0.28}px`, borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, whiteSpace: "nowrap", ...style }}>
      <div style={{ width: d, height: d, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <Glyph icon={icon} size={d * 0.56} tone={theme.color.neutralIcon} />
      </div>
      <div style={{ ...typeStyle("label"), fontSize: size, fontWeight: 500, color: c.ink }}>{text}</div>
    </div>
  );
};

/** Ibu Sari's book: its three lines, the same figures wherever the book appears. */
export const LEDGER_ROWS = [
  { label: "Customers", value: "72 orang" },
  { label: "Sales", value: "Rp2.400.000" },
  { label: "Profit", value: "Rp480.000" },
] as const;

/**
 * The cash book as a card, drawn at scale `s` (1 = the full card, 560 px tall). `lit` per row 0..1: an indigo ring and a
 * soft wash on the row the VO is asking about. Children of the card sit inside it (a fade, a flip) — its own box only.
 */
export const LedgerCard = ({ title, s = 1, lit = [0, 0, 0] }: { title: string; s?: number; lit?: number[] }) => {
  const c = usePalette();
  return (
    <div style={{ position: "absolute", inset: 0, padding: `${40 * s}px ${44 * s}px`, display: "flex", flexDirection: "column", gap: 22 * s }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 * s, height: 72 * s }}>
        <Glyph icon="book-open" size={64 * s} tone={c.ink} />
        <div style={{ ...typeStyle("title"), fontSize: 50 * s, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{title}</div>
      </div>
      {LEDGER_ROWS.map((r, i) => (
        <div key={r.label} style={{ position: "relative", height: 104 * s, borderRadius: 22 * s, background: lit[i] > 0.5 ? theme.color.indigoWashSolid : c.cardBg, boxShadow: `inset 0 0 0 ${2 * s}px ${theme.color.skeleton}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${34 * s}px` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 22 * s, boxShadow: `inset 0 0 0 ${3 * s}px ${c.indigo}`, opacity: lit[i] }} />
          <div style={{ ...typeStyle("label"), fontSize: 38 * s, fontWeight: 600, color: c.ink }}>{r.label}</div>
          <div style={{ ...typeStyle("label"), fontSize: 38 * s, fontWeight: 500, color: lit[i] > 0.5 ? c.indigo : c.slate, fontVariantNumeric: "tabular-nums" }}>{r.value}</div>
        </div>
      ))}
    </div>
  );
};

/** A price that only falls: a line stepping down, drawn up to `p`, and the change under it. */
const FALL = [0.18, 0.3, 0.22, 0.36, 0.3, 0.46, 0.4, 0.58, 0.52, 0.7, 0.66, 0.84];
export const PriceFace = ({ title, s = 1, draw = 1, change = 1 }: { title: string; s?: number; draw?: number; change?: number }) => {
  const c = usePalette();
  const W = 400;
  const H = 260;
  const pts = FALL.map((y, i) => [(i / (FALL.length - 1)) * W, y * H] as const);
  const n = Math.max(1, Math.round(draw * (pts.length - 1)));
  const d = pts.slice(0, n + 1).map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <div style={{ position: "absolute", inset: 0, padding: `${40 * s}px ${44 * s}px`, display: "flex", flexDirection: "column", gap: 26 * s }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 * s, height: 72 * s }}>
        <Glyph icon="trend-down" size={64 * s} tone={c.ink} />
        <div style={{ ...typeStyle("title"), fontSize: 50 * s, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{title}</div>
      </div>
      {/* the chart takes whatever height the card leaves it, at any size: stretched, its stroke kept even */}
      <svg viewBox={`-10 -10 ${W + 20} ${H + 20}`} preserveAspectRatio="none" style={{ width: "100%", height: 0, flex: 1, minHeight: 0, overflow: "visible" }}>
        {draw > 0.001 ? <path d={d} fill="none" stroke={c.ink} strokeWidth={6 * s} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" /> : null}
      </svg>
      <div style={{ ...typeStyle("title"), fontSize: 96 * s, fontWeight: 600, lineHeight: 1, color: theme.color.crossRed, opacity: change, fontVariantNumeric: "tabular-nums" }}>−3%</div>
    </div>
  );
};

/** A speech bubble whose tail points down and to the right, at whoever stands below its right end. */
export const Bubble = ({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: React.ReactNode }) => {
  const c = usePalette();
  const r = h / 2;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h + h * 0.4 }}>
      <svg width={w} height={h * 1.4} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={`M ${r} 0 L ${w - r} 0 A ${r} ${r} 0 0 1 ${w - r} ${h} L ${w * 0.84} ${h} Q ${w * 0.88} ${h * 1.28} ${w * 0.95} ${h * 1.4} Q ${w * 0.8} ${h * 1.3} ${w * 0.72} ${h} L ${r} ${h} A ${r} ${r} 0 0 1 ${r} 0 Z`} fill={c.cardBg} stroke={theme.color.hairlineBrandSolid} strokeWidth={2} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
};

/**
 * A column after Simon's "Pillar Infographic" reference (10 Nov, replacing the Doric silhouettes he found ugly): a solid
 * capital and base — a wide slab and a narrower one each — in `tone`, the shaft between them in a pale tint of it with four
 * pointed flutes in a middle tint. All opaque: the tints are `tone` mixed toward the card white. `w` is the slab width.
 */
export const Column = ({ w, h, tone }: { w: number; h: number; tone: string }) => {
  const c = usePalette();
  const tint = (t: number) => interpolateColors(t, [0, 1], [tone, c.cardBg]);
  const slab = 0.15 * w;
  const r = 0.05 * w;
  const neck = 0.86 * w;
  const shaft = 0.72 * w;
  const x0 = (w - shaft) / 2;
  const top = 2 * slab;
  const bottom = h - 2 * slab;
  const pad = 0.12 * w;
  const half = 0.04 * w;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <rect x={x0} y={top - 2} width={shaft} height={bottom - top + 4} fill={tint(0.62)} />
      <g fill={tint(0.28)}>
        {[0, 1, 2, 3].map((i) => {
          const cx = x0 + (shaft * (i + 0.5)) / 4;
          const y0 = top + pad;
          const y1 = bottom - pad;
          const k = (y1 - y0) * 0.22;
          return <path key={i} d={`M ${cx} ${y0} C ${cx + half * 1.4} ${y0 + k} ${cx + half * 1.4} ${y1 - k} ${cx} ${y1} C ${cx - half * 1.4} ${y1 - k} ${cx - half * 1.4} ${y0 + k} ${cx} ${y0} Z`} />;
        })}
      </g>
      <g fill={tone}>
        <rect x={0} y={0} width={w} height={slab} rx={r} />
        <rect x={(w - neck) / 2} y={slab - 1} width={neck} height={slab + 1} rx={r} />
        <rect x={(w - neck) / 2} y={bottom} width={neck} height={slab + 1} rx={r} />
        <rect x={0} y={h - slab} width={w} height={slab} rx={r} />
      </g>
    </svg>
  );
};

/**
 * Graham and Buffett as their real photos (Simon 10 Nov: "ganti ilustrasi B.G. dan W.B. jadi yang gambar real"), cropped to
 * head and shoulders in a white rounded tile the shape of the drawn faces, both heads the same size in the same place.
 * Graham: his photo used as-is; Buffett: his colour photo, recreated by ChatGPT with the head whole, never made monochrome.
 */
const PHOTOS = {
  graham: { src: "art/vi01/graham-overcoat.png", w: 1165, h: 1350, head: { cx: 525, top: 20, w: 350 } },
  buffett: { src: "art/vi01/buffett-photo.png", w: 1345, h: 1169, head: { cx: 665, top: 51, w: 540 } },
} as const;

export const PhotoTile = ({ name, d, style }: { name: keyof typeof PHOTOS; d: number; style?: React.CSSProperties }) => {
  const c = usePalette();
  const shadow = useShadow();
  const ph = PHOTOS[name];
  const h = (d * ART.graham.h) / ART.graham.w;
  const k = (0.52 * d) / ph.head.w;
  return (
    <div style={{ position: "absolute", width: d, height: h, borderRadius: d * 0.13, background: c.cardBg, boxShadow: shadow.soft, overflow: "hidden", flex: "none", ...style }}>
      <Pic src={staticFile(ph.src)} style={{ position: "absolute", left: d / 2 - ph.head.cx * k, top: h * 0.1 - ph.head.top * k, width: ph.w * k, height: ph.h * k }} />
    </div>
  );
};
