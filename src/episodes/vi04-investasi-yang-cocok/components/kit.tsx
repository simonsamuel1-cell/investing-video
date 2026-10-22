/**
 * kit.tsx — the pieces VI04 is drawn from.
 *
 * VI style (docs/vi-style/STYLE.md): Iconify icons (public/icons/vi04), white rounded cards, text, the mascot,
 * Orang Tuntun only on insights. VI03's tested pieces are reused rather than copied (VI03 itself reuses VI01's).
 *
 * ⚠ ONE ACCENT FOR THE WHOLE VIDEO: amber (theme.color.selfAmber*) is YOU — "diri kita sendiri", the investor
 * nobody researches. Other people's answers, products and numbers stay indigo/slate.
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { theme, useMotion, usePalette, useShadow } from "../../../core";
import { ease } from "../../vi03-tiga-jenis-uang/components/kit";
import { w as wordAt } from "../data/timing";

export { Appear, Badge, Ground, ORANG_TUNTUN_RIGHT, OUTSIDE_RESERVES, OrangTuntun, Panel3, Statement, ease, useAppear } from "../../vi03-tiga-jenis-uang/components/kit";

/** Scene-local frame of a phrase in a scene: `W("diri kita sendiri")`. */
export const useWords = (scene: number, block: number) => (phrase: string, nth = 0, edge: "f0" | "f1" = "f0") => wordAt(scene, phrase, nth, edge) - block;

/**
 * An icon. With `tone` it is painted in that colour through the SVG's own shape (a CSS mask), so the single-colour
 * Iconify files can go neutral (Benchmark v1, Simon 22 Oct: the obvious things neutral, the brand only on hairlines).
 */
export const Ico = ({ name, size, tone }: { name: string; size: number; tone?: string }) =>
  tone ? (
    <div style={{ width: size, height: size, flex: "none", background: tone, WebkitMaskImage: `url(${staticFile(`icons/vi04/${name}.svg`)})`, maskImage: `url(${staticFile(`icons/vi04/${name}.svg`)})`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" }} />
  ) : (
    <Img src={staticFile(`icons/vi04/${name}.svg`)} style={{ width: size, height: size, maxWidth: "none", display: "block", flex: "none" }} />
  );

/** An icon on a tinted disc. `neutral`: a light grey disc and a grey icon. */
export const IconDot = ({ name, size, tint, neutral = false, tone }: { name: string; size: number; tint?: string; neutral?: boolean; tone?: string }) => (
  <div style={{ width: size * 1.55, height: size * 1.55, borderRadius: 999, background: tint ?? (neutral ? theme.color.neutralDisc : theme.color.indigoWash), display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
    <Ico name={name} size={size} tone={tone ?? (neutral ? theme.color.neutralIcon : undefined)} />
  </div>
);

/**
 * A checkbox: an indigo outline that fills and ticks on `checkAt`; or, `open`, an amber dashed box that stays
 * empty and breathes — the one thing on the list nobody checked.
 */
export const CheckBox = ({ size, checkAt, open = false }: { size: number; checkAt?: number; open?: boolean }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const p = checkAt === undefined ? 0 : ease(f, checkAt, m.pop);
  const breathe = open ? 1 + 0.06 * Math.sin((f / m.sec(1.2)) * Math.PI) ** 2 : 1;
  const r = size * 0.28;
  return (
    <div style={{ position: "relative", width: size, height: size, borderRadius: r, boxSizing: "border-box", border: `5px ${open ? "dashed" : "solid"} ${open ? theme.color.selfAmber : c.indigo}`, background: open ? theme.color.selfAmberWash : "transparent", transform: `scale(${breathe.toFixed(3)})`, flex: "none" }}>
      {p > 0.001 ? (
        <div style={{ position: "absolute", inset: -5, borderRadius: r, background: c.indigo, opacity: p, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: theme.text.family, fontWeight: 800, fontSize: size * 0.6, lineHeight: 1, color: c.cardBg, transform: `scale(${(0.6 + 0.4 * p).toFixed(3)})` }}>✓</span>
        </div>
      ) : null}
    </div>
  );
};

/** A numbered disc (1, 2…) — the order of two questions. */
export const Num = ({ n, size, tint, color }: { n: number; size: number; tint: string; color: string }) => (
  <div style={{ width: size, height: size, borderRadius: 999, background: tint, color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontWeight: 800, fontSize: size * 0.52, flex: "none" }}>{n}</div>
);

/** A name over something — a pill centred on `cx` (in its parent), its top at `y`. */
export const Label = ({ cx, y, text, tint, color }: { cx: number; y: number; text: string; tint?: string; color?: string }) => {
  const c = usePalette();
  return (
    <div style={{ position: "absolute", left: cx, top: y, transform: "translateX(-50%)", padding: "10px 26px", borderRadius: 999, background: tint ?? theme.color.indigoWash, fontFamily: theme.text.family, fontSize: 34, fontWeight: 800, color: color ?? c.indigo, whiteSpace: "nowrap", lineHeight: 1.1 }}>{text}</div>
  );
};

/**
 * An app-icon tile — a white line icon on the indigo gradient, round corners, soft shadow. The flat, UI-style
 * stand-in for every vehicle (Simon, 19 Oct: "remove semua 3D, ganti jadi 2D flat design yang simple dan ada
 * UI style"). `icon` names the white file without its "-w".
 */
export const Tile = ({ icon, size }: { icon: string; size: number }) => {
  const shadow = useShadow();
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: theme.color.tileGrad, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
      <Ico name={`${icon}-w`} size={size * 0.56} />
    </div>
  );
};

/**
 * The vehicles as hand-drawn sketches (ChatGPT, one sheet split by scripts/vi/split-sprites.py; Simon, 19 Oct:
 * "icon jembatan, perahu, pesawat; coba buat jadi ilustrasi sketch"). `h` is the drawing's height; `neutral` draws it in grey.
 */
export const SKETCH = { bridge: 563 / 377, ferry: 522 / 317, speedboat: 452 / 197, plane: 453 / 279, waves: 2000 / 553 } as const;
export type SketchName = keyof typeof SKETCH;
export const Sketch = ({ name, h, neutral = false }: { name: SketchName; h: number; neutral?: boolean }) => (
  <Img src={staticFile(`art/vi04/sk-${name}.png`)} style={{ height: h, width: h * SKETCH[name], maxWidth: "none", display: "block", flex: "none", filter: neutral ? NEUTRAL_INK : undefined }} />
);
/** The indigo sketches redrawn in grey ink (Benchmark v1: the obvious things neutral) — their white fills stay white. */
const NEUTRAL_INK = "grayscale(1) brightness(1.18)";

/**
 * A statement in normal weight (Simon, 22 Oct: "tulisannya normal (tidak terlalu tebal)") — the VI04 replacement
 * for VI03's heavy Statement. `mark` is said in `markInk` (indigo by default): a word, not a block of colour.
 */
export const Line = ({ x, y, w, text, size = 64, mark, markInk, align = "left", weight = 600 }: { x: number; y: number; w: number; text: string; size?: number; mark?: string; markInk?: string; align?: "left" | "center"; weight?: number }) => {
  const c = usePalette();
  const i = mark ? text.indexOf(mark) : -1;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: "translateY(-50%)", textAlign: align, fontFamily: theme.text.family, fontSize: size, fontWeight: weight, letterSpacing: -0.5, lineHeight: 1.22, color: c.ink }}>
      {i < 0 ? text : (
        <>
          {text.slice(0, i)}
          <span style={{ color: markInk ?? c.indigo }}>{mark}</span>
          {text.slice(i + (mark as string).length)}
        </>
      )}
    </div>
  );
};

/** A white card: a soft shadow, and — when it matters — a brand (or amber) hairline instead of a fill. */
export const Card = ({ x, y, w, h, line, dashed = false, children, style }: { x: number; y: number; w: number; h: number; line?: string; dashed?: boolean; children?: React.ReactNode; style?: React.CSSProperties }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: dashed ? undefined : shadow.soft, border: line ? `2px ${dashed ? "dashed" : "solid"} ${line}` : undefined, boxSizing: "border-box", ...style }}>
      {children}
    </div>
  );
};

/** A number on a white disc with a brand hairline — the order of things (the routes, the two questions). */
export const NumRing = ({ n, size }: { n: number; size: number }) => {
  const c = usePalette();
  return (
    <div style={{ width: size, height: size, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.connector}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontFamily: theme.text.family, fontSize: size * 0.46, fontWeight: 600, color: c.indigo }}>{n}</div>
  );
};

/** A scene's heading at the top left: the number ring, then the line in normal weight. `y` is its middle. */
export const HEADING = { x: 140, y: 190, disc: 56 };
export const Heading = ({ n, text }: { n: number; text: string }) => {
  const c = usePalette();
  return (
    <div style={{ position: "absolute", left: HEADING.x, top: HEADING.y - HEADING.disc / 2, height: HEADING.disc, display: "flex", alignItems: "center", gap: 24 }}>
      <NumRing n={n} size={HEADING.disc} />
      <div style={{ fontFamily: theme.text.family, fontSize: theme.type.title.size, fontWeight: 500, letterSpacing: theme.type.title.tracking, color: c.ink, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

/** A vehicle sketch in grey ink, `h` tall, centred on (cx, cy) in its parent. */
export const Vehicle = ({ name, cx, cy, h }: { name: SketchName; cx: number; cy: number; h: number }) => (
  <div style={{ position: "absolute", left: cx - (h * SKETCH[name]) / 2, top: cy - h / 2 }}>
    <Sketch name={name} h={h} neutral />
  </div>
);

/** One of the isometric icons (art/vi04/ic-*.png — waves, wheel, stable, index, equity, stock), `h` tall. */
export const IsoIcon = ({ name, h }: { name: string; h: number }) => <Img src={staticFile(`art/vi04/ic-${name}.png`)} style={{ height: h, width: "auto", maxWidth: "none", display: "block", flex: "none" }} />;

/** How rough each route's path is (SC03 → SC04): the swell in px and the number of waves across. */
export const ROUGH = [
  { amp: 5, freq: 3 },
  { amp: 17, freq: 3.5 },
  { amp: 34, freq: 4 },
];
/** A sine path `w` wide about y = 0, as polyline points. */
export const wavePts = (amp: number, freq: number, w: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const t = i / 160;
    pts.push(`${(t * w).toFixed(1)},${(-Math.sin(t * Math.PI * 2 * freq) * amp).toFixed(1)}`);
  }
  return pts.join(" ");
};

/** The three routes as small cards (SC03's summary, SC04's choice): the vehicle, its name, its path drawn by `draw`. */
export const ROUTE_CARDS = [
  { art: "bridge" as SketchName, h: 120, name: "Jembatan", rough: ROUGH[0] },
  { art: "ferry" as SketchName, h: 110, name: "Kapal", rough: ROUGH[1] },
  { art: "plane" as SketchName, h: 112, name: "Pesawat", rough: ROUGH[2] },
];
export const ROUTE_CARD = { w: 380, h: 330 };
export const RouteCard = ({ i, x, y, draw, line }: { i: number; x: number; y: number; draw: number; line?: string }) => {
  const c = usePalette();
  const r = ROUTE_CARDS[i];
  const w = ROUTE_CARD.w;
  return (
    <Card x={x} y={y} w={w} h={ROUTE_CARD.h} line={line}>
      <Vehicle name={r.art} cx={w / 2 - (line ? 2 : 0)} cy={100} h={r.h} />
      <div style={{ position: "absolute", left: 0, top: 180, width: w - (line ? 4 : 0), textAlign: "center", fontFamily: theme.text.family, fontSize: theme.type.label.size, fontWeight: theme.type.label.weight, color: c.slate }}>{r.name}</div>
      <svg width={w - 80} height={80} style={{ position: "absolute", left: 40 - (line ? 2 : 0), top: 230, overflow: "visible" }}>
        <clipPath id={`vi04-route-card-${i}`}>
          <rect x={-10} y={-40} width={(w - 60) * draw} height={160} />
        </clipPath>
        <polyline transform="translate(0 40)" points={wavePts(r.rough.amp, r.rough.freq, w - 80)} fill="none" stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#vi04-route-card-${i})`} />
      </svg>
    </Card>
  );
};

/** A small mark on a white disc: ✕ in grey, ✓ in indigo — each with a hairline ring. */
export const Mark = ({ kind, p, x, y }: { kind: "check" | "cross"; p: number; x: number; y: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x - 28, top: y - 28, width: 56, height: 56, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${kind === "check" ? theme.color.connector : theme.color.connectorMute}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `scale(${(0.75 + 0.25 * p).toFixed(3)})` }}>
      <span style={{ fontFamily: theme.text.family, fontWeight: 600, fontSize: 28, lineHeight: 1, color: kind === "check" ? c.indigo : theme.color.neutralIcon }}>{kind === "check" ? "✓" : "✕"}</span>
    </div>
  );
};

/**
 * Text typed out a character at a time from `at` (Simon, 22 Oct: "animasi ngetik"), with a thin caret while it
 * types; `mark` is said in `markInk` (indigo by default). Nothing is reserved before `at`, so it starts empty.
 */
export const Typed = ({ text, at, cps = 34, mark, markInk }: { text: string; at: number; cps?: number; mark?: string; markInk?: string }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - at) * cps) / m.sec(1))));
  const i0 = mark ? text.indexOf(mark) : -1;
  const i1 = i0 < 0 ? -1 : i0 + (mark as string).length;
  const part = (a: number, b: number) => text.slice(Math.min(a, n), Math.min(b, n));
  const typing = f >= at && n < text.length;
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      {i0 < 0 ? part(0, text.length) : (
        <>
          {part(0, i0)}
          <span style={{ color: markInk ?? c.indigo }}>{part(i0, i1)}</span>
          {part(i1, text.length)}
        </>
      )}
      {typing ? <span style={{ display: "inline-block", width: 3, height: "0.95em", marginLeft: 2, verticalAlign: "-0.12em", background: c.indigo }} /> : null}
    </span>
  );
};
