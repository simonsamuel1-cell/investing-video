/**
 * VI02 SC01's factory passage as IN01 tells things: still pictures, simple UI, and something sent from one picture to the next
 * (Simon, 6 Nov). The sketches are IN04's ink style, from ChatGPT (docs/vi-style/storyboards/VI02-SC01-sketch-sheet.png). A pack
 * leaves the factory on "Produk", reaches the box on "masuk ke kardus", the truck on "dikirim", the shop on "toko-toko"; on
 * "Semua aktivitas" packs keep running down the whole chain.
 */
import { Img, staticFile } from "remotion";
import { Connector, TuntunMark, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { Appear, ease } from "./kit";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// the pictures zigzag, so the lines between them have room to run
const STILLS = [
  { name: "factory", x: 225, y: 310, w: 320, h: 340, at: "sebuah pabrik" },
  { name: "box", x: 655, y: 490, w: 210, h: 220, at: "masuk ke kardus" },
  { name: "truck", x: 1065, y: 310, w: 320, h: 240, at: "dikirim dengan" },
  { name: "shop", x: 1495, y: 490, w: 300, h: 300, at: "toko-toko" },
];
const GAP = 20;
const PACK = { d: 64, every: 0.55, line: 3 };
const TOP = { y: 56, mascot: 76, pillX: 110 };
const STATUS = { y: 690, dot: 16, size: 40 };
const LEGS = STILLS.slice(1).map((s, i) => {
  const from = STILLS[i];
  return { a: { x: from.x + from.w / 2 + GAP, y: from.y }, b: { x: s.x - s.w / 2 - GAP, y: s.y } };
});
/** Along Connector's curve: leaving and arriving level. */
const onLeg = ({ a, b }: (typeof LEGS)[number], p: number) => {
  const pull = (b.x - a.x) * 0.55;
  const q = 1 - p;
  return {
    x: q * q * q * a.x + 3 * q * q * p * (a.x + pull) + 3 * q * p * p * (b.x - pull) + p * p * p * b.x,
    y: q * q * q * a.y + 3 * q * q * p * a.y + 3 * q * p * p * b.y + p * p * p * b.y,
  };
};

const Pack = ({ x, y, size }: { x: number; y: number; size: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  const d = PACK.d * size;
  return (
    <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connector}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Img src={staticFile("icons/vi02/ph-package.svg")} style={{ width: d * 0.56, height: d * 0.56 }} />
    </div>
  );
};

/** In the window's own frame, `w` × `h`, scaled by `scale` as the window shrinks into the phone. */
export const FactoryStills = ({ f, W, w, h, scale }: { f: number; W: (phrase: string, nth?: number, edge?: "f0" | "f1") => number; w: number; h: number; scale: number }) => {
  const c = usePalette();
  const m = useMotion();
  // each leg: the line grows, then the pack rides it to the next picture
  const legs = [
    { at: W("Produk"), to: W("masuk ke kardus") },
    { at: W("kardus", 0, "f1"), to: W("dikirim dengan") },
    { at: W("lalu sampai"), to: W("toko-toko") },
  ];
  const loopAt = W("Semua");
  const ran = Math.max(0, (f - loopAt) / m.sec(PACK.every));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `scale(${scale.toFixed(4)})`, transformOrigin: "0 0" }}>
      {STILLS.map((s) => {
        const p = ease(f, W(s.at) - m.sec(0.2), m.reveal);
        return <Img key={s.name} src={staticFile(`art/vi02/sketch/${s.name}.png`)} style={{ position: "absolute", left: s.x - s.w / 2, top: s.y - s.h / 2, width: s.w, height: s.h, objectFit: "contain", opacity: p, transform: `scale(${mix(0.94, 1, p).toFixed(4)})` }} />;
      })}
      {LEGS.map((leg, i) => <Connector key={i} a={leg.a} b={leg.b} p={ease(f, legs[i].at, m.sec(0.4))} width={PACK.line} dot={false} />)}
      {/* the first pack, on its words */}
      {f < loopAt ? legs.map((leg, i) => {
        const p = ease(f, leg.at, leg.to - leg.at);
        return p > 0 && p < 1 ? <Pack key={i} {...onLeg(LEGS[i], p)} size={Math.min(1, 6 * p, 6 * (1 - p))} /> : null;
      }) : null}
      {/* then the chain keeps running */}
      {f >= loopAt ? Array.from({ length: LEGS.length * 2 }, (_, k) => {
        const along = (ran / 2 + k / 2) % LEGS.length;
        const i = Math.floor(along);
        const p = along - i;
        return <Pack key={k} {...onLeg(LEGS[i], p)} size={Math.min(1, 6 * p, 6 * (1 - p), ran)} />;
      }) : null}
      <TuntunMark x={TOP.mascot / 2 + 24} y={TOP.y - TOP.mascot / 2 + 3 * Math.sin((f / m.sec(1.6)) * Math.PI * 2)} height={TOP.mascot} opacity={ease(f, W("Jam"), m.reveal)} />
      <Appear at={W("Jam")} style={{ left: TOP.pillX, top: TOP.y - 34 }}>
        <div style={{ padding: "12px 30px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("title"), fontVariantNumeric: "tabular-nums", color: c.ink, whiteSpace: "nowrap" }}>04.00</div>
      </Appear>
      <Appear at={W("terus berjalan")} style={{ left: 0, top: STATUS.y, width: w }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, ...typeStyle("label"), fontSize: STATUS.size, fontWeight: 500, color: c.indigo }}>
          <span style={{ width: STATUS.dot, height: STATUS.dot, borderRadius: 999, background: theme.color.checkGreen, transform: `scale(${(1 + 0.25 * Math.sin((f / m.sec(1)) * Math.PI * 2)).toFixed(3)})` }} />
          Terus berjalan
        </div>
      </Appear>
    </div>
  );
};
