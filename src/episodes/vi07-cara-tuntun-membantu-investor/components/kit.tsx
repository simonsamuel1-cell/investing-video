/**
 * kit.tsx — the pieces VI07 is drawn from. VI04's Benchmark-v1 pieces (cards, lines, the grid, the eased Appear) are
 * reused rather than copied, as VI04 reuses VI03's; only what VI07 adds lives here.
 *
 * Text on screen has to earn its place (STYLE.md §0.10, Simon 26 Oct): a number, a keyword, a label, or the scene's one
 * key line — the subtitles already carry the VO.
 */
import React from "react";
import { staticFile } from "remotion";
import { theme, usePalette, useShadow } from "../../../core";
import { w as wordAt } from "../data/timing";
import { HEADING, NumRing } from "../../vi04-investasi-yang-cocok/components/kit";

export { Appear, BoardGrid, Card, Heading, HEADING, Line, NumRing, OrangTuntun, ORANG_TUNTUN_RIGHT, OUTSIDE_RESERVES, Typed, ease, useAppear } from "../../vi04-investasi-yang-cocok/components/kit";

/** Where a situation heading opens: big, centred, its subjudul under it (Simon 28 Oct, SC03). */
export const HEADING_OPEN = { y: 520, scale: 1.7, subGap: 96, ringGap: 16 };

/**
 * A situation heading that opens big in the middle with a subjudul — the line under a title, not the VO subtitle — then
 * docks to its usual place top left (Simon 28 Oct: "judulnya mulai dari tengah dulu lalu ada subtitlenya"). Opened, the
 * number ring sits above the line; docking, it swings back to its place left of the line ("angka 1 nya dari atas Panik
 * dulu, lalu nanti pas ke pojok kiri atas, balik ke posisi semula"), in a straight line. `dock` 0 → 1 moves it; at 1 it is exactly
 * `Heading`. `subP` shows the subjudul, which leaves as the heading docks. The subjudul is a line of text, or any row of
 * things (SC04: its three cause chips), centred under the line.
 */
export const OpeningHeading = ({ n, text, sub, p, dock, subP, hidden = false }: { n: number; text: string; sub: React.ReactNode; p: number; dock: number; subP: number; hidden?: boolean }) => {
  const c = usePalette();
  if (p <= 0.001 || hidden) return null;
  const cx = theme.canvas.width / 2;
  const d = HEADING.disc;
  const k = HEADING_OPEN.scale + (1 - HEADING_OPEN.scale) * dock;
  const y = HEADING_OPEN.y + (HEADING.y - HEADING_OPEN.y) * dock;
  // the line: centred on the canvas at dock 0 (−50 % of its own width, scaled about its centre), left-aligned where
  // `Heading` puts it at 1
  const tx = cx + (HEADING.x + d + 24 - cx) * dock;
  const o = 50 * (1 - dock);
  // the ring: above the line at 0, left of it at 1, on a straight path (Simon 28 Oct: "lurus aja, ngga usa curving").
  // It runs ahead of the line along that path — in step with it, it crosses the "P" midway.
  const ry0 = HEADING_OPEN.y - HEADING_OPEN.scale * (d + HEADING_OPEN.ringGap);
  const r = 1 - (1 - dock) ** 2;
  const rx = cx + (HEADING.x + d / 2 - cx) * r;
  const ry = ry0 + (HEADING.y - ry0) * r;
  const sub1 = subP * (1 - dock);
  return (
    <>
      <div style={{ position: "absolute", left: rx - d / 2, top: ry - d / 2, opacity: p, transform: `scale(${k.toFixed(4)})` }}>
        <NumRing n={n} size={d} />
      </div>
      <div style={{ position: "absolute", left: tx, top: y - d / 2, height: d, display: "flex", alignItems: "center", opacity: p, transformOrigin: `${o}% 50%`, transform: `translateX(${-o}%) scale(${k.toFixed(4)})` }}>
        <div style={{ fontFamily: theme.text.family, fontSize: theme.type.title.size, fontWeight: 500, letterSpacing: theme.type.title.tracking, color: c.ink, whiteSpace: "nowrap" }}>{text}</div>
      </div>
      {sub1 > 0.001 ? (
        typeof sub === "string" ? (
          <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: HEADING_OPEN.y + HEADING_OPEN.subGap + (1 - subP) * 12 - dock * 30, textAlign: "center", opacity: sub1 * p, fontFamily: theme.text.family, fontSize: 40, fontWeight: 500, color: c.slate, whiteSpace: "nowrap" }}>{sub}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: HEADING_OPEN.y + HEADING_OPEN.subGap - dock * 30, display: "flex", justifyContent: "center", opacity: (1 - dock) * p }}>{sub}</div>
        )
      ) : null}
    </>
  );
};

/** Scene-local frame of a phrase in a scene: `W("Cepat jual", 2)`. */
export const useWords = (scene: number, block: number) => (phrase: string, nth = 0, edge: "f0" | "f1" = "f0") => wordAt(scene, phrase, nth, edge) - block;

const masked = (file: string, size: number, tone: string, style?: React.CSSProperties) => (
  <div style={{ width: size, height: size, flex: "none", background: tone, WebkitMaskImage: `url(${staticFile(`icons/vi07/${file}.svg`)})`, maskImage: `url(${staticFile(`icons/vi07/${file}.svg`)})`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", ...style }} />
);

/**
 * An icon from public/icons/vi07, painted in `tone` through its own shape (a CSS mask). With `fill`, the icon's
 * `<name>-fill.svg` silhouette is painted opaque underneath (Simon 28 Oct: "icon ini transparan. bikin full fill aja").
 */
export const Ico = ({ name, size, tone, fill }: { name: string; size: number; tone: string; fill?: string }) =>
  fill ? (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      {masked(`${name}-fill`, size, fill, { position: "absolute", inset: 0 })}
      {masked(name, size, tone, { position: "absolute", inset: 0 })}
    </div>
  ) : (
    masked(name, size, tone)
  );

/** An icon on a round disc. */
export const Disc = ({ icon, size, tone, tint }: { icon: string; size: number; tone: string; tint: string }) => (
  <div style={{ width: size, height: size, borderRadius: 999, background: tint, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
    <Ico name={icon} size={size * 0.56} tone={tone} />
  </div>
);

/** A grey bar standing in for text (Benchmark v1: skeleton lines instead of fake copy). */
export const Skel = ({ w, h = 14, style }: { w: number; h?: number; style?: React.CSSProperties }) => (
  <div style={{ position: "absolute", width: w, height: h, borderRadius: h / 2, background: theme.color.skeleton, ...style }} />
);

/**
 * The four situations the mistakes show up in (SC01 names them, SC02 gives each its question, SC03–SC08 take them one
 * by one) — the same label and icon everywhere they appear.
 */
export const SITUATION = [
  { label: "Panik", icon: "fall" },
  { label: "Terburu-buru", icon: "hurry" },
  { label: "Ikut ramai", icon: "hype" },
  { label: "Terlalu yakin", icon: "confident" },
] as const;

/** A voice note on its own (SC04, SC06): the play disc and a waveform, `played` 0..1 of it in dark ink. */
const WAVE = [10, 18, 26, 14, 30, 22, 12, 28, 34, 20, 16, 30, 24, 12, 22, 32, 18, 26, 14, 20, 10, 16];
export const VoiceBubble = ({ played = 0, scale = 1 }: { played?: number; scale?: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
  <div style={{ position: "relative", width: 280 * scale, height: 76 * scale, borderRadius: `${8 * scale}px ${24 * scale}px ${24 * scale}px ${24 * scale}px`, background: c.cardBg, boxShadow: shadow.soft }}>
    <div style={{ position: "absolute", left: 14 * scale, top: 16 * scale }}>
      <Disc icon="play" size={44 * scale} tone={theme.color.neutralDotOn} tint={theme.color.neutralDisc} />
    </div>
    {WAVE.map((h, i) => (
      <div key={i} style={{ position: "absolute", left: (72 + i * 8) * scale, top: (38 - h / 2) * scale, width: 4 * scale, height: h * scale, borderRadius: 2 * scale, background: i / WAVE.length < played ? theme.color.neutralDotOn : theme.color.neutralDot }} />
    ))}
  </div>
  );
};

/**
 * A small mark on a solid disc: ✕ white on red, ✓ white on green (Simon 28 Oct 2026: "icon x: lingkarannya merah, X nya
 * putih / icon centang: lingkarannya hijau, centangnya putih").
 */
export const Mark = ({ kind, p, x, y, size = 56 }: { kind: "check" | "cross"; p: number; x: number; y: number; size?: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: 999, background: kind === "check" ? theme.color.ok : theme.color.crossRed, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `scale(${(0.75 + 0.25 * p).toFixed(3)})` }}>
      <span style={{ fontFamily: theme.text.family, fontWeight: 700, fontSize: size / 2, lineHeight: 1, color: c.cardBg }}>{kind === "check" ? "✓" : "✕"}</span>
    </div>
  );
};
