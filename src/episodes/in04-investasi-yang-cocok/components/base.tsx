/**
 * base.tsx — the first pieces of the VI style, shared by IN04 and everything built on its kit (they came from a test
 * video on Tiga Jenis Uang, since deleted). IN01's tested pieces (the reserves clip, Cutout) are reused rather than copied.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { GridGround, theme, useMotion, usePalette, useShadow } from "../../../core";
import { Cutout, OUTSIDE_RESERVES, ease } from "../../in01-passive-income/components/kit";

export { OUTSIDE_RESERVES, ease } from "../../in01-passive-income/components/kit";

/** 0→1 on `at`, 1→0 on `out` — the one life every element here has. */
export const useAppear = (at: number, out?: number, over?: number) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const inn = ease(f, at, over ?? m.reveal);
  const gone = out === undefined ? 0 : ease(f, out, m.fade);
  return inn * (1 - gone);
};

/** Anything, easing up a few px into place and fading in; gone on `out`. */
export const Appear = ({ at, out, rise = 18, style, children }: { at: number; out?: number; rise?: number; style?: React.CSSProperties; children: React.ReactNode }) => {
  const p = useAppear(at, out);
  if (p <= 0.001) return null;
  return <div style={{ position: "absolute", opacity: p, transform: `translateY(${((1 - p) * rise).toFixed(2)}px)`, ...style }}>{children}</div>;
};

/** A white rounded card with the soft shadow. */
export const Panel3 = ({ x, y, w, h, style, children }: { x: number; y: number; w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode }) => {
  const c = usePalette();
  const shadow = useShadow();
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft, boxSizing: "border-box", ...style }}>{children}</div>;
};

/** Big statement text, centred on cx; `mark` tinted (and underlined by a soft wash) in `markInk`. */
export const Statement = ({ cx, cy, text, size, mark, markInk, maxWidth, align = "center" }: { cx: number; cy: number; text: string; size: number; mark?: string; markInk?: string; maxWidth?: number; align?: "center" | "left" }) => {
  const c = usePalette();
  const i = mark ? text.indexOf(mark) : -1;
  return (
    <div style={{ position: "absolute", left: align === "center" ? cx - (maxWidth ?? 1400) / 2 : cx, top: cy, transform: "translateY(-50%)", width: maxWidth ?? 1400, textAlign: align, fontFamily: theme.text.family, fontSize: size, fontWeight: 800, lineHeight: 1.15, letterSpacing: -2, color: c.ink }}>
      {i < 0 ? (
        text
      ) : (
        <>
          {text.slice(0, i)}
          <span style={{ color: markInk ?? c.indigo }}>{mark}</span>
          {text.slice(i + (mark as string).length)}
        </>
      )}
    </div>
  );
};

/** The grid ground a scene stands on (read off the GLOBAL frame → the same drift across scenes). */
export const Ground = ({ from }: { from: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
      <GridGround f={f + from} paper={c.bg} />
    </div>
  );
};

/**
 * Orang Tuntun (public/art/in01/orang-tuntun.png) — head to belly at the left, his foot fading out, rising in
 * on `at`. Cast ONLY on an insight (STYLE.md §3).
 */
const MAN = { src: "art/in01/orang-tuntun.png", w: 941, h: 1672, ink: { x0: 233, x1: 794, y0: 84 }, belly: 820, top: 150, floor: 900, foot: 0.28, left: 40 };
const MAN_K = (MAN.floor - MAN.top) / (MAN.belly - MAN.ink.y0);
export const ORANG_TUNTUN_RIGHT = theme.margin.left + MAN.left + (MAN.ink.x1 - MAN.ink.x0) * MAN_K;
export const OrangTuntun = ({ at }: { at: number }) => {
  const m = useMotion();
  const mask = `linear-gradient(to bottom, black ${MAN.floor - MAN.foot * (MAN.floor - MAN.top)}px, transparent ${MAN.floor}px)`;
  return (
    <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask }}>
      <Cutout src={MAN.src} aspect={MAN.w / MAN.h} x={theme.margin.left + MAN.left + ((MAN.ink.x1 - MAN.ink.x0) * MAN_K) / 2 + (MAN.w / 2 - (MAN.ink.x0 + MAN.ink.x1) / 2) * MAN_K} y={MAN.floor + (MAN.h - MAN.belly) * MAN_K} h={MAN.h * MAN_K} at={at} rise={theme.canvas.height - MAN.top} riseFrames={m.move} />
    </div>
  );
};

/** A round badge — ✓ (green), ✗ (red) — easing in on `p`. */
export const Badge = ({ x, y, kind, p, size = 64 }: { x: number; y: number; kind: "check" | "cross"; p: number; size?: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: 999, background: kind === "check" ? theme.color.checkGreen : theme.color.calendarRed, color: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontSize: size * 0.5, fontWeight: 800, opacity: p, transform: `scale(${(0.7 + 0.3 * p).toFixed(3)})`, boxShadow: `0 0 0 6px ${c.cardBg}` }}>{kind === "check" ? "✓" : "✕"}</div>
  );
};
