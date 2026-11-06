/**
 * An isometric plant, recreated from the picture Simon sent on 6 Nov: a rounded slab, an office, a hall, a warehouse, two chimneys,
 * two tanks, drums, crates and planters; the green truck came out on his word. All measured in the picture's own frame (FRAME, a 3× enlargement of it);
 * a box is given by the corner nearest us at its foot, its two lengths and its height, so each one reads as in the picture.
 */
import { AbsoluteFill } from "remotion";
import { theme } from "../../../core";

const C = theme.color;
const FRAME = { w: 1620, h: 1470, k: 0.66 };
const STROKE = { thin: 1.7, line: 2.3 };
const LINE = { stroke: C.plantLine, strokeWidth: STROKE.line, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const THIN = { ...LINE, strokeWidth: STROKE.thin } as const;
const COS = 0.866;
const SIN = 0.5;
const WHITE = C.worldWall;
const SHADE = C.plantShade;

type P = readonly [number, number];
const d = (pts: readonly P[]) => `M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} Z`;
const open = (pts: readonly P[]) => `M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")}`;
const mid = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** The eight corners that matter: at the foot, then `t` for the same at the top. */
const corners = (fx: number, fy: number, lx: number, ly: number, h: number) => {
  const F: P = [fx, fy];
  const L: P = [fx - lx * COS, fy - lx * SIN];
  const R: P = [fx + ly * COS, fy - ly * SIN];
  const B: P = [L[0] + R[0] - fx, L[1] + R[1] - fy];
  const up = (p: P): P => [p[0], p[1] - h];
  return { F, L, R, B, Ft: up(F), Lt: up(L), Rt: up(R), Bt: up(B) };
};
type Corners = ReturnType<typeof corners>;
/** A point on the left face: `u` along it from its far end, `v` up it. */
const onLeft = (c: Corners, u: number, v: number) => mid(mid(c.L, c.F, u), mid(c.Lt, c.Ft, u), v);
const onRight = (c: Corners, u: number, v: number) => mid(mid(c.F, c.R, u), mid(c.Ft, c.Rt, u), v);
/** A point on the top: `u` from far left to near, `v` from near right to far. */
const onTop = (c: Corners, u: number, v: number) => mid(mid(c.Lt, c.Ft, u), mid(c.Bt, c.Rt, u), v);

const Box = ({ c, top = WHITE, left = WHITE, right = SHADE, line = LINE }: { c: Corners; top?: string; left?: string; right?: string; line?: object }) => (
  <g {...line}>
    <path d={d([c.L, c.F, c.Ft, c.Lt])} fill={left} />
    <path d={d([c.F, c.R, c.Rt, c.Ft])} fill={right} />
    <path d={d([c.Lt, c.Ft, c.Rt, c.Bt])} fill={top} />
  </g>
);

/** A window: a quad given by its two `u`s and two `v`s, recessed, so its reveal shows on the left and along the bottom. */
const Pane = ({ on, c, u, v }: { on: typeof onLeft; c: Corners; u: [number, number]; v: [number, number] }) => {
  const [u0, u1] = u;
  const [v0, v1] = v;
  const su = u0 + (u1 - u0) * 0.2;
  const sv = v0 + (v1 - v0) * 0.16;
  return (
    <g {...THIN}>
      <path d={d([on(c, u0, v0), on(c, u1, v0), on(c, u1, v1), on(c, u0, v1)])} fill={WHITE} />
      <path d={d([on(c, u0, v0), on(c, u1, v0), on(c, u1, sv), on(c, su, sv), on(c, su, v1), on(c, u0, v1)])} fill={SHADE} />
    </g>
  );
};

/** An upright cylinder: `bands` are shaded stretches, in px down from its top. */
const Drum = ({ cx, y, rx, ry, h, bands = [], side = WHITE, top = WHITE, ring = 0 }: { cx: number; y: number; rx: number; ry: number; h: number; bands?: [number, number][]; side?: string; top?: string; ring?: number }) => (
  <g {...LINE}>
    <path d={`M ${cx - rx} ${y} V ${y + h} A ${rx} ${ry} 0 0 0 ${cx + rx} ${y + h} V ${y} Z`} fill={side} />
    {bands.map(([a, b]) => <path key={a} d={`M ${cx - rx} ${y + a} A ${rx} ${ry} 0 0 0 ${cx + rx} ${y + a} V ${y + b} A ${rx} ${ry} 0 0 1 ${cx - rx} ${y + b} Z`} fill={SHADE} {...THIN} />)}
    <ellipse cx={cx} cy={y} rx={rx} ry={ry} fill={top} />
    {ring ? <ellipse cx={cx} cy={y} rx={rx * ring} ry={ry * ring} fill={SHADE} {...THIN} /> : null}
  </g>
);

const SLAB = { corners: [[764, 447], [1662, 965], [842, 1438], [-46, 920]] as P[], round: 170, drop: 38 };
const slab = (dy: number) => {
  const n = SLAB.corners.length;
  const to = (a: P, b: P) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return mid(a, b, SLAB.round / l); };
  const parts = SLAB.corners.map((p, i) => {
    const before = to(p, SLAB.corners[(i + n - 1) % n]);
    const after = to(p, SLAB.corners[(i + 1) % n]);
    return `${i === 0 ? "M" : "L"} ${before[0].toFixed(1)} ${(before[1] + dy).toFixed(1)} Q ${p[0]} ${p[1] + dy} ${after[0].toFixed(1)} ${(after[1] + dy).toFixed(1)}`;
  });
  return `${parts.join(" ")} Z`;
};

const ROADS: P[][] = [
  [[185, 775], [850, 1158], [1195, 958]],
  [[470, 935], [755, 770]],
  [[580, 1000], [870, 832]],
  [[60, 851], [855, 1295], [1312, 1031]],
];

const OFFICE = corners(484, 815, 184, 356, 145);
const OFFICE_NEAR = corners(484, 815, 184, 212, 145);
const VENT = corners(422, 592, 72, 200, 32);
const HOLES: P[] = [[421, 517], [478, 487], [534, 456]];
const HALL = corners(905, 847, 274, 64, 157);
const COLLAR = corners(905, 688, 256, 330, 38);
const ROOF = corners(905, 652, 275, 354, 40);
const WAREHOUSE = corners(1318, 1022, 413, 225, 187);
const STACKS: P[] = [[1051, 586], [1129, 628], [1348, 628], [1427, 671]];
const CRATES: P[] = [[300, 806], [348, 835], [394, 862]];
const DRUMS: P[] = [[90, 830], [144, 862], [199, 893], [254, 925], [308, 957], [365, 990]];
const TRAYS: P[] = [[938, 1336], [1155, 1210], [1370, 1083]];
const TANKS: { cx: number; y: number; pipe: number }[] = [{ cx: 1023, y: 905, pipe: 966 }, { cx: 848, y: 1005, pipe: 792 }];

const Tank = ({ cx, y, pipe }: { cx: number; y: number; pipe: number }) => (
  <g>
    <ellipse cx={cx} cy={y + 60} rx={86} ry={48} fill={WHITE} {...LINE} />
    <Drum cx={cx} y={y} rx={80} ry={44} h={58} side={SHADE} />
    <path d={`M ${pipe} ${y + 25} H ${pipe + 8} V ${y + 88} H ${pipe} Z`} fill={SHADE} {...LINE} />
    <path d={`M ${pipe + 8} ${y + 25} H ${pipe + 15} V ${y + 30} H ${pipe + 8}`} fill="none" {...THIN} />
  </g>
);

const Stack = ({ x, y }: { x: number; y: number }) => (
  <g>
    <Drum cx={x} y={y + 48} rx={19} ry={9} h={11} side={WHITE} />
    <Drum cx={x} y={y + 16} rx={15} ry={7} h={34} side={WHITE} bands={[[20, 34]]} />
    <Drum cx={x} y={y} rx={25} ry={12} h={18} side={WHITE} ring={0.6} />
  </g>
);

const Tray = ({ x, y }: { x: number; y: number }) => {
  const c = corners(x, y, 38, 187, 22);
  return (
    <g>
      <Box c={c} />
      <path d={d([onTop(c, 0.16, 0.03), onTop(c, 0.84, 0.03), onTop(c, 0.84, 0.97), onTop(c, 0.16, 0.97)])} fill={SHADE} {...THIN} />
      <path d={d([onTop(c, 0.36, 0.07), onTop(c, 0.84, 0.07), onTop(c, 0.84, 0.94), onTop(c, 0.36, 0.94)])} fill={WHITE} {...THIN} />
    </g>
  );
};

const Crate = ({ x, y }: { x: number; y: number }) => {
  const c = corners(x, y, 43, 40, 40);
  return (
    <g>
      <Box c={c} />
      <path d={d([onLeft(c, 0.52, 0.42), onLeft(c, 0.86, 0.42), onLeft(c, 0.86, 0.8), onLeft(c, 0.52, 0.8)])} fill={SHADE} {...THIN} />
    </g>
  );
};

export const IsoPlant = () => (
  <AbsoluteFill style={{ background: C.plantPaper }}>
    <svg viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} width={FRAME.w * FRAME.k} height={FRAME.h * FRAME.k} style={{ position: "absolute", left: (theme.canvas.width - FRAME.w * FRAME.k) / 2, top: (theme.canvas.height - FRAME.h * FRAME.k) / 2, overflow: "visible" }}>
      <path d={slab(SLAB.drop)} fill={SHADE} {...LINE} />
      <path d={slab(0)} fill={WHITE} {...LINE} />
      {ROADS.map((r, i) => <path key={i} d={open(r)} fill="none" {...THIN} />)}

      <Drum cx={680} y={58} rx={34} ry={15} h={400} bands={[[72, 129], [187, 244]]} ring={0.72} />
      <Drum cx={764} y={107} rx={34} ry={15} h={340} bands={[[71, 128], [188, 243]]} ring={0.72} />

      <Box c={OFFICE} />
      {[0.23, 0.5, 0.76].map((u) => <Pane key={u} on={onLeft} c={OFFICE} u={[u - 0.08, u + 0.08]} v={[0.58, 0.79]} />)}
      {[0.16, 0.39, 0.61, 0.83].map((u) => <Pane key={u} on={onRight} c={OFFICE_NEAR} u={[u - 0.068, u + 0.068]} v={[0.58, 0.79]} />)}
      <Box c={VENT} left={SHADE} />
      {HOLES.map(([x, y]) => (
        <g key={x} {...THIN}>
          <ellipse cx={x} cy={y} rx={22} ry={13} fill={WHITE} />
          <ellipse cx={x} cy={y + 1.5} rx={21} ry={11.5} fill={SHADE} />
        </g>
      ))}

      <Box c={HALL} />
      <path d={d([onLeft(HALL, 0.39, 0), onLeft(HALL, 0.85, 0), onLeft(HALL, 0.85, 0.63), onLeft(HALL, 0.39, 0.63)])} fill={WHITE} {...THIN} />
      <path d={d([onLeft(HALL, 0.41, 0), onLeft(HALL, 0.85, 0), onLeft(HALL, 0.85, 0.42), onLeft(HALL, 0.79, 0.56), onLeft(HALL, 0.41, 0.56)])} fill={SHADE} {...THIN} />
      <Box c={COLLAR} line={THIN} />
      <path d={open([onLeft(COLLAR, 0, 0.2), onLeft(COLLAR, 1, 0.2)])} fill="none" {...THIN} />
      <Box c={ROOF} line={THIN} />
      <path d={d([onTop(ROOF, 0.015, 0.085), onTop(ROOF, 0.915, 0.085), onTop(ROOF, 0.915, 0.985), onTop(ROOF, 0.015, 0.985)])} fill={WHITE} {...THIN} />
      <path d={open([ROOF.Ft, onTop(ROOF, 0.915, 0.085)])} fill="none" {...THIN} />
      <path d={open([ROOF.Lt, onTop(ROOF, 0.015, 0.085)])} fill="none" {...THIN} />
      <path d={open([ROOF.Rt, onTop(ROOF, 0.915, 0.985)])} fill="none" {...THIN} />

      <Box c={corners(1196, 572, 22, 22, 46)} />
      <Box c={WAREHOUSE} />
      <path d={d([onLeft(WAREHOUSE, 0, 0), onLeft(WAREHOUSE, 1, 0), onLeft(WAREHOUSE, 1, 0.3), onLeft(WAREHOUSE, 0, 0.3)])} fill={SHADE} {...THIN} />
      <path d={open([onRight(WAREHOUSE, 0, 0.3), onRight(WAREHOUSE, 1, 0.3)])} fill="none" {...THIN} />
      <path d={d([onLeft(WAREHOUSE, 0.05, 0.76), onLeft(WAREHOUSE, 0.955, 0.76), onLeft(WAREHOUSE, 0.955, 0.835), onLeft(WAREHOUSE, 0.05, 0.835)])} fill={WHITE} {...THIN} />
      <path d={d([onLeft(WAREHOUSE, 0.062, 0.765), onLeft(WAREHOUSE, 0.955, 0.765), onLeft(WAREHOUSE, 0.955, 0.8), onLeft(WAREHOUSE, 0.062, 0.8)])} fill={SHADE} {...THIN} />
      <path d={d([onTop(WAREHOUSE, 0.014, 0.022), onTop(WAREHOUSE, 0.988, 0.022), onTop(WAREHOUSE, 0.988, 0.975), onTop(WAREHOUSE, 0.014, 0.975)])} fill={WHITE} {...THIN} />
      <path d={open([WAREHOUSE.Ft, WAREHOUSE.Lt, WAREHOUSE.Bt, WAREHOUSE.Rt])} fill="none" {...LINE} strokeWidth={STROKE.line * 1.4} />
      {STACKS.map(([x, y]) => <Stack key={x} x={x} y={y} />)}

      {TANKS.map((t) => <Tank key={t.cx} {...t} />)}
      {CRATES.map(([x, y]) => <Crate key={x} x={x} y={y} />)}
      {DRUMS.map(([x, y]) => <Drum key={x} cx={x} y={y} rx={23} ry={11} h={88} bands={[[0, 46], [72, 88]]} top={SHADE} ring={0.9} />)}
      {TRAYS.map(([x, y]) => <Tray key={x} x={x} y={y} />)}
    </svg>
  </AbsoluteFill>
);
