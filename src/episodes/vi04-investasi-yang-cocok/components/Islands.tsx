/**
 * Islands.tsx — Simon's sketch for VI04 SC02–SC03 (19 Oct): isometric, two islands — "Kamu" (a stickman) and
 * "Rumah" (a house) — and later three dashed routes between them, each with a simple transport icon sitting on
 * its middle. Everything is drawn here as flat isometric faces (theme.color.iso*), no picture files: the slabs,
 * the house and the stickman (outlined, after the reference sheet he sent).
 */
import { useCurrentFrame } from "remotion";
import { theme, useMotion, usePalette } from "../../../core";
import { ease } from "../../vi03-tiga-jenis-uang/components/kit";
import { Ico, NumRing } from "./kit";

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
type P = [number, number];
/** An isometric point (x right-down, y left-down, z up) seen from origin `o` on screen. */
const iso = (o: P, x: number, y: number, z: number): P => [o[0] + (x - y) * COS, o[1] + (x + y) * SIN - z];
const poly = (pts: P[]) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

/** Where things stand on screen: each island by the centre of its top face. */
export const ISLES = {
  you: { cx: 560, cy: 650, a: 300, t: 46 },
  home: { cx: 1350, cy: 560, a: 360, t: 52 },
} as const;
const originOf = (isle: { cx: number; cy: number; a: number }): P => [isle.cx, isle.cy - isle.a * SIN];

/**
 * Two palettes for the same drawing: the pastels Simon approved on 19 Oct, and the neutrals of Benchmark v1
 * (22 Oct: "untuk hal-hal yang obvious, pakai warna netral aja") — white tops, grey sides, a grey house.
 */
type Pal = { top: string; left: string; right: string; wall: string; wallShade: string; roof: string; roofShade: string; chimney: string; chimneyShade: string; glass: string; frame: string; planter: string; bush: string };
const PASTEL: Pal = {
  top: theme.color.isoTop, left: theme.color.isoLeft, right: theme.color.isoRight,
  wall: theme.color.houseWall, wallShade: theme.color.houseWallShade, roof: theme.color.houseRoof, roofShade: theme.color.houseRoofShade,
  chimney: theme.color.houseChimney, chimneyShade: theme.color.houseChimneyShade, glass: theme.color.houseGlass, frame: theme.color.houseFrame,
  planter: theme.color.housePlanter, bush: theme.color.houseBush,
};
const NEUTRAL: Pal = {
  top: theme.color.isoNTop, left: theme.color.isoNLeft, right: theme.color.isoNRight,
  wall: theme.color.houseNWall, wallShade: theme.color.houseNWallShade, roof: theme.color.houseNRoof, roofShade: theme.color.houseNRoofShade,
  chimney: theme.color.houseNChimney, chimneyShade: theme.color.houseNChimneyShade, glass: theme.color.houseNGlass, frame: theme.color.houseNFrame,
  planter: theme.color.houseNPlanter, bush: theme.color.houseNBush,
};

/**
 * The camera on the islands — SC02 and SC03 are ONE shot (Simon, 22 Oct: "punya visual yang sama persis, mending buat
 * continuous"), so both scenes frame the drawing with these. screen = t + s · world. full — as drawn; low — small at
 * the bottom (SC02's questions); dive — Kamu large, the house still in frame, the island's foot above the subtitles.
 */
export type IsleFrame = { s: number; tx: number; ty: number };
export const ISLE_FRAME: Record<"full" | "low" | "dive", IsleFrame> = {
  full: { s: 1, tx: 0, ty: 0 },
  low: { s: 0.56, tx: 960 * 0.44, ty: 975 * 0.44 },
  dive: { s: 1.25, tx: 620 - 1.25 * ISLES.you.cx, ty: 960 - 1.25 * (ISLES.you.cy + 196) },
};
export const mixFrame = (a: IsleFrame, b: IsleFrame, t: number): IsleFrame => ({ s: a.s + (b.s - a.s) * t, tx: a.tx + (b.tx - a.tx) * t, ty: a.ty + (b.ty - a.ty) * t });
export const frameStyle = (fr: IsleFrame): React.CSSProperties => ({ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${fr.tx.toFixed(2)}px, ${fr.ty.toFixed(2)}px) scale(${fr.s.toFixed(4)})` });

/** The river's ripple lines (world coordinates): long, staggered, running under both islands. */
const RIVER = [
  { x0: 140, x1: 1700, y: 600 },
  { x0: 380, x1: 1840, y: 660 },
  { x0: 60, x1: 1500, y: 720 },
  { x0: 300, x1: 1800, y: 790 },
  { x0: 120, x1: 1620, y: 860 },
];
/** The river. `g` is the GLOBAL frame, so its drift carries straight across the scene change; `p(i)` = how far line i is in. */
export const RiverLines = ({ g, p }: { g: number; p: (i: number) => number }) => (
  <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    {RIVER.map((r, i) => {
      const shift = 14 * Math.sin(g / 50 + i * 1.3);
      let d = `M ${r.x0 + shift} ${r.y}`;
      for (let x = r.x0; x < r.x1; x += 120) d += ` q 30 -10 60 0 t 60 0`;
      return <path key={i} d={d} fill="none" stroke={theme.color.connectorMute} strokeWidth={3} strokeLinecap="round" opacity={p(i)} />;
    })}
  </svg>
);

/** A slab: top face and the two front faces, corners softened by a same-colour stroke. */
const Island = ({ isle, pal }: { isle: { cx: number; cy: number; a: number; t: number }; pal: Pal }) => {
  const o = originOf(isle);
  const A = isle.a;
  const T = isle.t;
  const top = [iso(o, 0, 0, 0), iso(o, A, 0, 0), iso(o, A, A, 0), iso(o, 0, A, 0)];
  const left = [iso(o, 0, A, 0), iso(o, A, A, 0), iso(o, A, A, -T), iso(o, 0, A, -T)];
  const right = [iso(o, A, 0, 0), iso(o, A, A, 0), iso(o, A, A, -T), iso(o, A, 0, -T)];
  const face = (pts: P[], fill: string) => <polygon points={poly(pts)} fill={fill} stroke={fill} strokeWidth={10} strokeLinejoin="round" />;
  return (
    <>
      {face(left, pal.left)}
      {face(right, pal.right)}
      {face(top, pal.top)}
    </>
  );
};

/**
 * The house, after the reference Simon sent (19 Oct), in pastels: a long body with its gable end to the left,
 * a pitched roof running its length (ridge along y), a chimney, framed windows, a glass door on the long side
 * and a planter at the gable's foot. Ridge along y so the gable faces left-front and the long wall right-front,
 * as in the reference.
 */
const HOUSE = { a: 140, b: 260, h: 108, r: 76, ov: 14 };
const houseOrigin = (): P => {
  const isle = ISLES.home;
  return iso(originOf(isle), (isle.a - HOUSE.a) / 2, (isle.a - HOUSE.b) / 2 + 10, 0);
};
const House = ({ pal }: { pal: Pal }) => {
  const { a: A, b: B, h: H, r: R, ov } = HOUSE;
  const o = houseOrigin();
  const eave = H - (ov * R) / (A / 2);
  const q = (x: number, y: number, z: number) => iso(o, x, y, z);
  const gable = [q(0, B, 0), q(A, B, 0), q(A, B, H), q(A / 2, B, H + R), q(0, B, H)];
  const wall = [q(A, 0, 0), q(A, B, 0), q(A, B, H), q(A, 0, H)];
  const roof = [q(A / 2, -ov, H + R), q(A / 2, B + ov, H + R), q(A + ov, B + ov, eave), q(A + ov, -ov, eave)];
  const fascia = [q(A / 2, B + ov, H + R), q(-ov, B + ov, eave), q(-ov, B + ov, eave - 10), q(A / 2, B + ov, H + R - 10)];
  const chim = { x0: A * 0.18, x1: A * 0.4, y0: B * 0.12, y1: B * 0.24, top: H + R + 26 };
  const chimR = [q(chim.x1, chim.y0, H), q(chim.x1, chim.y1, H), q(chim.x1, chim.y1, chim.top), q(chim.x1, chim.y0, chim.top)];
  const chimL = [q(chim.x0, chim.y1, H), q(chim.x1, chim.y1, H), q(chim.x1, chim.y1, chim.top), q(chim.x0, chim.y1, chim.top)];
  const chimT = [q(chim.x0, chim.y0, chim.top), q(chim.x1, chim.y0, chim.top), q(chim.x1, chim.y1, chim.top), q(chim.x0, chim.y1, chim.top)];
  // openings: a window on the gable, a window and a glass door on the long wall
  const gWin = [q(A * 0.25, B, H * 0.38), q(A * 0.55, B, H * 0.38), q(A * 0.55, B, H * 0.82), q(A * 0.25, B, H * 0.82)];
  const wWin = [q(A, B * 0.56, H * 0.4), q(A, B * 0.8, H * 0.4), q(A, B * 0.8, H * 0.75), q(A, B * 0.56, H * 0.75)];
  const door = [q(A, B * 0.12, 0), q(A, B * 0.36, 0), q(A, B * 0.36, H * 0.8), q(A, B * 0.12, H * 0.8)];
  const doorMid = [q(A, B * 0.24, 0), q(A, B * 0.24, H * 0.8)];
  // planter with bushes at the gable's foot
  const pl = { x0: A * 0.55, x1: A * 1.05, y0: B + 6, y1: B + 30, z: 22 };
  const plL = [q(pl.x0, pl.y1, 0), q(pl.x1, pl.y1, 0), q(pl.x1, pl.y1, pl.z), q(pl.x0, pl.y1, pl.z)];
  const plR = [q(pl.x1, pl.y0, 0), q(pl.x1, pl.y1, 0), q(pl.x1, pl.y1, pl.z), q(pl.x1, pl.y0, pl.z)];
  const bushes = [0.2, 0.5, 0.8].map((t) => q(pl.x0 + (pl.x1 - pl.x0) * t, (pl.y0 + pl.y1) / 2, pl.z + 12));
  const f = (pts: P[], fill: string, sw = 4) => <polygon points={poly(pts)} fill={fill} stroke={fill} strokeWidth={sw} strokeLinejoin="round" />;
  const framed = (pts: P[], fill: string) => <polygon points={poly(pts)} fill={fill} stroke={pal.frame} strokeWidth={5} strokeLinejoin="round" />;
  return (
    <>
      {f(chimR, pal.chimney)}
      {f(chimL, pal.chimneyShade)}
      {f(chimT, pal.chimney)}
      {f(gable, pal.wallShade)}
      {f(wall, pal.wall)}
      {framed(gWin, pal.glass)}
      {framed(wWin, pal.glass)}
      {framed(door, pal.glass)}
      <line x1={doorMid[0][0]} y1={doorMid[0][1]} x2={doorMid[1][0]} y2={doorMid[1][1]} stroke={pal.frame} strokeWidth={4} />
      {f(fascia, pal.roofShade)}
      {f(roof, pal.roof)}
      {f(plL, pal.planter)}
      {f(plR, pal.planter)}
      {bushes.map((b, i) => (
        <circle key={i} cx={b[0]} cy={b[1]} r={15} fill={pal.bush} />
      ))}
    </>
  );
};
/** Over the middle of the ridge, for the house's name. */
export const HOUSE_TOP: P = (() => {
  const [x, y] = iso(houseOrigin(), HOUSE.a / 2, HOUSE.b / 2, HOUSE.h + HOUSE.r);
  return [x, y - 96];
})();

/**
 * The figure Simon sent (19 Oct): a round head, and one outlined body — square shoulders with round corners,
 * arms hanging straight at the sides (a single line parts each arm from the torso), two straight legs with a gap
 * between them. White inside, a thin ink outline; feet on the island.
 */
const STICK = { h: 160 };
export const STICK_TOP: P = [ISLES.you.cx, ISLES.you.cy - STICK.h - 18];
const Stickman = ({ pal }: { pal: Pal }) => {
  const c = usePalette();
  const [x, y] = [ISLES.you.cx, ISLES.you.cy - 4];
  // the body, in px from the feet (y) and the centre line (x); mirrored left/right
  const B = { top: -118, sh: 34, r: 14, arm: 22, armEnd: -60, leg: 4, crotch: -54, foot: 7 };
  const X = (v: number) => (x + v).toFixed(1);
  const Y = (v: number) => (y + v).toFixed(1);
  const body = [
    `M ${X(-B.sh + B.r)} ${Y(B.top)}`,
    `L ${X(B.sh - B.r)} ${Y(B.top)}`,
    `Q ${X(B.sh)} ${Y(B.top)} ${X(B.sh)} ${Y(B.top + B.r)}`,
    `L ${X(B.sh)} ${Y(B.armEnd - 6)}`,
    `Q ${X(B.sh)} ${Y(B.armEnd)} ${X((B.sh + B.arm) / 2)} ${Y(B.armEnd)}`,
    `Q ${X(B.arm)} ${Y(B.armEnd)} ${X(B.arm)} ${Y(B.armEnd - 6)}`,
    `L ${X(B.arm)} ${Y(-B.foot)}`,
    `Q ${X(B.arm)} ${Y(0)} ${X((B.arm + B.leg) / 2)} ${Y(0)}`,
    `Q ${X(B.leg)} ${Y(0)} ${X(B.leg)} ${Y(-B.foot)}`,
    `L ${X(B.leg)} ${Y(B.crotch + 4)}`,
    `Q ${X(0)} ${Y(B.crotch - 2)} ${X(-B.leg)} ${Y(B.crotch + 4)}`,
    `L ${X(-B.leg)} ${Y(-B.foot)}`,
    `Q ${X(-B.leg)} ${Y(0)} ${X(-(B.arm + B.leg) / 2)} ${Y(0)}`,
    `Q ${X(-B.arm)} ${Y(0)} ${X(-B.arm)} ${Y(-B.foot)}`,
    `L ${X(-B.arm)} ${Y(B.armEnd - 6)}`,
    `Q ${X(-B.arm)} ${Y(B.armEnd)} ${X(-(B.sh + B.arm) / 2)} ${Y(B.armEnd)}`,
    `Q ${X(-B.sh)} ${Y(B.armEnd)} ${X(-B.sh)} ${Y(B.armEnd - 6)}`,
    `L ${X(-B.sh)} ${Y(B.top + B.r)}`,
    `Q ${X(-B.sh)} ${Y(B.top)} ${X(-B.sh + B.r)} ${Y(B.top)}`,
    "Z",
  ].join(" ");
  const armLines = [-1, 1].map((k) => `M ${X(k * B.arm)} ${Y(B.top + 18)} L ${X(k * B.arm)} ${Y(B.armEnd - 6)}`);
  return (
    <>
      <ellipse cx={x} cy={y + 2} rx={42} ry={13} fill={pal.left} opacity={0.6} />
      <path d={body} fill={c.cardBg} stroke={c.ink} strokeWidth={5} strokeLinejoin="round" />
      {armLines.map((d) => (
        <path key={d} d={d} stroke={c.ink} strokeWidth={5} strokeLinecap="round" fill="none" />
      ))}
      <circle cx={x} cy={y + B.top - 24} r={18} fill={c.cardBg} stroke={c.ink} strokeWidth={5} />
    </>
  );
};

/** A name pill centred over a point; `border` gives it the brand hairline instead of a tint. */
const Name = ({ at, text, tint, color, border }: { at: P; text: string; tint: string; color: string; border?: string }) => (
  <div style={{ position: "absolute", left: at[0], top: at[1] - 62, transform: "translateX(-50%)", padding: "10px 26px", borderRadius: 999, background: tint, boxShadow: border ? `inset 0 0 0 2px ${border}` : undefined, fontFamily: theme.text.family, fontSize: 34, fontWeight: 600, color, whiteSpace: "nowrap" }}>{text}</div>
);

// the three ways across: control points of each dashed curve, the icon on its middle, and its number in the
// SCRIPT's order (Simon, 22 Oct: "tambahin urutan 1 2 3 … berdasarkan urutan di script") — jembatan, kapal, pesawat
export const WAYS = [
  { icon: "plane", n: 3, pts: [[440, 560], [380, 40], [1800, 10], [1610, 440]] as P[] },
  { icon: "bridge", n: 1, pts: [[740, 640], [880, 540], [1030, 540], [1120, 600]] as P[] },
  { icon: "ferry", n: 2, pts: [[700, 760], [840, 930], [1170, 920], [1290, 780]] as P[] },
];
const bez = (p: P[], t: number): P => {
  const u = 1 - t;
  return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0], u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]];
};
/** Where route `n`'s icon disc sits (world coordinates, = screen at the full framing). */
export const wayDisc = (n: number): P => bez((WAYS.find((w) => w.n === n) ?? WAYS[0]).pts, 0.5);
/** The disc's radius, as drawn (it is 100 px across). */
export const WAY_DISC_R = 50;

/**
 * The whole picture. `youAt` / `homeAt` bring each island up; `wayAt` (optional) draws the three routes one
 * after another in their numbered order, each icon arriving as its line passes the middle.
 */
export const Islands = ({ youAt, homeAt, wayAt, neutral = false, homeFade = 0, focus }: { youAt: number; homeAt: number; wayAt?: number; neutral?: boolean; homeFade?: number; focus?: { n: number; p: number; lifted?: boolean } }) => {
  const pal = neutral ? NEUTRAL : PASTEL;
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const you = ease(f, youAt, m.reveal);
  const home = ease(f, homeAt, m.reveal) * (1 - 0.65 * homeFade);
  const W = theme.canvas.width;
  const H = theme.canvas.height;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {wayAt !== undefined
        ? WAYS.map((w, i) => {
            const p = ease(f, wayAt + m.sec(0.35) * (w.n - 1), m.sec(0.8));
            if (p <= 0.001) return null;
            const d = `M ${w.pts[0][0]} ${w.pts[0][1]} C ${w.pts[1][0]} ${w.pts[1][1]}, ${w.pts[2][0]} ${w.pts[2][1]}, ${w.pts[3][0]} ${w.pts[3][1]}`;
            return (
              <svg key={w.icon} width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
                <mask id={`vi04-way-${i}`} maskUnits="userSpaceOnUse">
                  <path d={d} pathLength={1} fill="none" stroke="white" strokeWidth={30} strokeDasharray={1} strokeDashoffset={1 - p} />
                </mask>
                <path d={d} fill="none" stroke={neutral ? theme.color.connector : c.indigo} strokeWidth={neutral ? 4 : 6} strokeLinecap="round" strokeDasharray={neutral ? "2 12" : "4 16"} mask={`url(#vi04-way-${i})`} />
              </svg>
            );
          })
        : null}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g opacity={you} transform={`translate(0 ${((1 - you) * 40).toFixed(2)})`}>
          <Island isle={ISLES.you} pal={pal} />
          <Stickman pal={pal} />
        </g>
        <g opacity={home} transform={`translate(0 ${((1 - home) * 40).toFixed(2)})`}>
          <Island isle={ISLES.home} pal={pal} />
          <House pal={pal} />
        </g>
      </svg>
      {wayAt !== undefined
        ? WAYS.map((w, i) => {
            const q = ease(f, wayAt + m.sec(0.35) * (w.n - 1) + m.sec(0.4), m.pop);
            // `lifted`: the scene has taken this disc over (it grows into the next layout — scenes/Routes.tsx)
            if (q <= 0.001 || (focus?.lifted && focus.n === w.n)) return null;
            const [x, y] = bez(w.pts, 0.5);
            // the route about to be told: a little bigger, and it glows (Simon, 22 Oct)
            const hi = focus && focus.n === w.n ? focus.p : 0;
            const ring = neutral ? `inset 0 0 0 2px ${hi > 0.01 ? theme.color.connector : theme.color.hairlineBrand}` : `0 0 0 6px ${theme.color.indigoWash}`;
            const glow = hi > 0.001 ? `, 0 0 ${(40 * hi).toFixed(1)}px ${(10 * hi).toFixed(1)}px ${theme.color.indigoGlow}` : "";
            return (
              <div key={w.icon} style={{ position: "absolute", left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: 999, background: c.cardBg, boxShadow: ring + glow, display: "flex", alignItems: "center", justifyContent: "center", opacity: q, transform: `scale(${((0.6 + 0.4 * q) * (1 + 0.2 * hi)).toFixed(3)})`, zIndex: hi > 0.001 ? 1 : 0 }}>
                <Ico name={`t-${w.icon}-i`} size={60} tone={neutral ? theme.color.neutralIcon : undefined} />
                <div style={{ position: "absolute", right: -10, top: -10 }}>
                  <NumRing n={w.n} size={40} />
                </div>
              </div>
            );
          })
        : null}
      <div style={{ position: "absolute", inset: 0, opacity: you, transform: `translateY(${((1 - you) * 40).toFixed(2)}px)` }}>
        <Name at={STICK_TOP} text="Kamu" tint={neutral ? c.cardBg : theme.color.indigoWash} color={c.indigo} border={neutral ? theme.color.hairlineBrand : undefined} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: home * (1 - homeFade), transform: `translateY(${((1 - home) * 40).toFixed(2)}px)` }}>
        <Name at={HOUSE_TOP} text="Rumahmu" tint={neutral ? c.cardBg : theme.color.indigoWash} color={c.indigo} border={neutral ? theme.color.hairlineBrand : undefined} />
      </div>
    </div>
  );
};
