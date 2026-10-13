/**
 * kit.tsx — the pieces VI03 is drawn from.
 *
 * VI style (docs/vi-style/STYLE.md): flat illustrations (ChatGPT, transparent PNG, public/art/vi03), Iconify
 * icons (public/icons/vi03), white rounded cards, the mascot, Orang Tuntun only on insights. Every move an
 * easy ease. VI01's tested pieces (Cutout, TypeBox, the reserves clip) are reused rather than copied.
 *
 * ⚠ THE THREE KINDS OF MONEY ARE A COLOUR CODE for the whole video: uang aktif green, uang stabil amber,
 * uang jangka panjang indigo (theme.color.wallet*). A wallet, its label, its chips and its icons always
 * wear their own colour.
 */
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { theme, useMotion, usePalette, useShadow } from "../../../core";
import { ease } from "../../vi01-passive-income/components/kit";
import { w as wordAt } from "../data/timing";

export { Cutout, OUTSIDE_RESERVES, TypeBox, ease } from "../../vi01-passive-income/components/kit";

export type Kind = "aktif" | "stabil" | "panjang";
export const KIND = {
  aktif: { label: "Uang Aktif", art: "art/vi03/wallet-aktif.png", aspect: 548 / 524 },
  stabil: { label: "Uang Stabil", art: "art/vi03/wallet-stabil.png", aspect: 537 / 533 },
  panjang: { label: "Uang Jangka Panjang", art: "art/vi03/wallet-panjang.png", aspect: 545 / 517 },
} as const;
export const ink = (k: Kind) => (k === "aktif" ? theme.color.walletAktif : k === "stabil" ? theme.color.walletStabil : theme.color.walletPanjang);
export const wash = (k: Kind) => (k === "aktif" ? theme.color.walletAktifWash : k === "stabil" ? theme.color.walletStabilWash : theme.color.walletPanjangWash);

/** Scene-local frame of a phrase in a scene: `W("uang ini kapan")`. */
export const useWords = (scene: number, block: number) => (phrase: string, nth = 0, edge: "f0" | "f1" = "f0") => wordAt(scene, phrase, nth, edge) - block;

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

export const Ico = ({ name, size }: { name: string; size: number }) => <Img src={staticFile(`icons/vi03/${name}.svg`)} style={{ width: size, height: size, display: "block" }} />;

/** A flat illustration, centred on (cx, cy), `h` tall at its own aspect. */
export const Art = ({ src, aspect, cx, cy, h, style }: { src: string; aspect: number; cx: number; cy: number; h: number; style?: React.CSSProperties }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", left: cx - (h * aspect) / 2, top: cy - h / 2, width: h * aspect, height: h, ...style }} />
);

export const Wallet = ({ kind, cx, cy, h, style }: { kind: Kind; cx: number; cy: number; h: number; style?: React.CSSProperties }) => <Art src={KIND[kind].art} aspect={KIND[kind].aspect} cx={cx} cy={cy} h={h} style={style} />;

/** A white rounded card with the soft shadow. */
export const Panel3 = ({ x, y, w, h, style, children }: { x: number; y: number; w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode }) => {
  const c = usePalette();
  const shadow = useShadow();
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: shadow.soft, boxSizing: "border-box", ...style }}>{children}</div>;
};

/**
 * A pill: an icon in a tinted circle, then a label. Centred on (cx, cy) with width `w`; or, with `anchor`, one
 * END pinned at cx ("left" = its left edge there, "right" = its right edge) and the pill as wide as its label
 * needs (at least `w`) — so a long label grows the pill outward instead of running off it.
 */
export const Pill = ({ cx, cy, w, icon, label, tint, size = 34, iconSize = 44, anchor }: { cx: number; cy: number; w: number; icon: string; label: string; tint?: string; size?: number; iconSize?: number; anchor?: "left" | "right" }) => {
  const c = usePalette();
  const shadow = useShadow();
  const h = iconSize + 36;
  const place: React.CSSProperties = anchor === "left" ? { left: cx, minWidth: w } : anchor === "right" ? { right: theme.canvas.width - cx, minWidth: w } : { left: cx - w / 2, width: w };
  return (
    <div style={{ position: "absolute", ...place, top: cy - h / 2, height: h, borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", gap: 16, padding: "0 28px 0 18px", boxSizing: "border-box", fontFamily: theme.text.family, fontSize: size, fontWeight: 700, color: c.ink, whiteSpace: "nowrap" }}>
      <div style={{ width: iconSize + 16, height: iconSize + 16, borderRadius: 999, background: tint ?? theme.color.indigoWash, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <Ico name={icon} size={iconSize} />
      </div>
      {label}
    </div>
  );
};

/** A small label chip — the "Tanya juga" type on a tinted pill. */
export const Tag = ({ x, y, text, tint, color }: { x: number; y: number; text: string; tint?: string; color?: string }) => {
  const c = usePalette();
  return <div style={{ position: "absolute", left: x, top: y, padding: "12px 26px", borderRadius: 999, background: tint ?? theme.color.indigoWash, fontFamily: theme.text.family, fontSize: 34, fontWeight: 700, letterSpacing: 1, color: color ?? c.indigo, whiteSpace: "nowrap", lineHeight: 1.1 }}>{text}</div>;
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
