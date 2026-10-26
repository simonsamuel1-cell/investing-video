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

export { Appear, BoardGrid, Card, Heading, HEADING, Line, NumRing, OrangTuntun, ORANG_TUNTUN_RIGHT, OUTSIDE_RESERVES, Typed, ease, useAppear } from "../../vi04-investasi-yang-cocok/components/kit";

/** Scene-local frame of a phrase in a scene: `W("Cepat jual", 2)`. */
export const useWords = (scene: number, block: number) => (phrase: string, nth = 0, edge: "f0" | "f1" = "f0") => wordAt(scene, phrase, nth, edge) - block;

/** An icon from public/icons/vi07, painted in `tone` through its own shape (a CSS mask). */
export const Ico = ({ name, size, tone }: { name: string; size: number; tone: string }) => (
  <div style={{ width: size, height: size, flex: "none", background: tone, WebkitMaskImage: `url(${staticFile(`icons/vi07/${name}.svg`)})`, maskImage: `url(${staticFile(`icons/vi07/${name}.svg`)})`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />
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

/** A small mark on a white disc: ✕ in grey, ✓ in indigo, each with a solid ring (VI04's Mark, without the rgba hairline). */
export const Mark = ({ kind, p, x, y }: { kind: "check" | "cross"; p: number; x: number; y: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x - 28, top: y - 28, width: 56, height: 56, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${kind === "check" ? theme.color.connector : theme.color.connectorMuteSolid}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `scale(${(0.75 + 0.25 * p).toFixed(3)})` }}>
      <span style={{ fontFamily: theme.text.family, fontWeight: 600, fontSize: 28, lineHeight: 1, color: kind === "check" ? c.indigo : theme.color.neutralIcon }}>{kind === "check" ? "✓" : "✕"}</span>
    </div>
  );
};
