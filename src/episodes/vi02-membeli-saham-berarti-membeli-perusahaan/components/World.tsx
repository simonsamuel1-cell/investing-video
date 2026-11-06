/**
 * The business behind the code (VI02 SC01): one continuous world, left to right, every part of it running — the factory,
 * the conveyor, the packing machine, the loading bay, the road, the shops. World units are px at camera scale 1; everything
 * stands on GROUND. `f` is the works' clock (`workClock`): the belts, the packs and the smoke all run on it.
 */
import type React from "react";
import { theme } from "../../../core";
import { ease } from "./kit";

export const GROUND = 620;
const C = theme.color;
/** Where each part of the chain stands. */
export const AT = { factory: 620, belt: [1040, 2120], packer: 2240, cartons: [2340, 2720], bay: 2860, shops: [3980, 4280, 4580, 4880] } as const;
const BELT_Y = GROUND - 92;
const SPEED = 3.2;
/** Simon's standard: a thin dark outline, white and one hue's tints inside. It stays thin when the camera pulls back. */
const LINE = { stroke: C.artInk, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round", vectorEffect: "non-scaling-stroke" } as const;
const FINE = { ...LINE, strokeWidth: 2 } as const;
const HATCH = "url(#art-hatch)";

/** The diagonal hatching his reference puts on roofs. Every picture that uses it carries its own copy. */
const Hatch = () => (
  <defs>
    <pattern id="art-hatch" width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width={16} height={16} fill={C.artPale} />
      <rect width={6} height={16} fill={C.artMid} />
    </pattern>
  </defs>
);

/** The ground: white, under one thin line. */
export const GroundLine = () => (
  <>
    <rect x={-4000} y={GROUND} width={14000} height={4000} fill={C.worldGround} />
    <line x1={-4000} x2={10000} y1={GROUND} y2={GROUND} {...LINE} />
  </>
);

/** The works' clock: 0 until `at`, so nothing has moved yet, then picking up speed over `ramp` frames (Simon, 5 Nov). */
export const workClock = (f: number, at: number, ramp: number) => {
  const t = Math.max(0, f - at);
  return t < ramp ? (t * t) / (2 * ramp) : t - ramp / 2;
};
/** A clock past the smoke's first rise, for a factory that was already running when its scene began. */
export const RUNNING = 300;
/** How far along a belt an item takes to grow out of its start, or to shrink away past its end. */
const END_RUN = 70;

/** An item on a belt at scale `s`, standing on (x, y). */
const Grown = ({ x, y, s, children }: { x: number; y: number; s: number; children: React.ReactNode }) => (s <= 0.001 ? null : <g transform={`translate(${x.toFixed(1)} ${y}) scale(${s.toFixed(3)}) translate(${(-x).toFixed(1)} ${-y})`}>{children}</g>);

const Smoke = ({ x, y, f }: { x: number; y: number; f: number }) => (
  <>
    {[0, 1, 2, 3].map((i) => {
      // each puff leaves a quarter of a rise after the one before it: none before the clock starts
      const age = f / 150 - i / 4;
      if (age <= 0) return null;
      const t = age % 1;
      return <circle key={i} cx={x + 26 * t + 10 * Math.sin(t * 6 + i)} cy={y - 150 * t} r={12 + 22 * t} fill={C.artPale} opacity={(1 - t) * Math.min(1, t * 8)} />;
    })}
  </>
);

/** A factory: saw-tooth roof, two chimneys, rows of windows that come on with `lit` (0–1), a gate for the belt. */
export const Factory = ({ lit, f }: { lit: number; f: number }) => {
  const x = AT.factory - 400;
  const top = GROUND - 300;
  const windows = Array.from({ length: 12 }, (_, i) => ({ wx: x + 60 + (i % 6) * 106, wy: top + 44 + Math.floor(i / 6) * 94 }));
  return (
    <g>
      <Hatch />
      <Smoke x={x + 200} y={top - 200} f={f} />
      <Smoke x={x + 310} y={top - 170} f={f - 80} />
      {[{ cx: x + 176, h: 230, y: top - 200 }, { cx: x + 286, h: 200, y: top - 170 }].map((c) => (
        <g key={c.cx}>
          <rect x={c.cx} y={c.y} width={52} height={c.h} rx={6} fill={C.worldWall} {...LINE} />
          <rect x={c.cx} y={c.y + 22} width={52} height={22} fill={C.artStrong} {...FINE} />
        </g>
      ))}
      <path d={`M ${x} ${top + 8} L ${x + 44} ${top - 94} L ${x + 44} ${top + 8} L ${x + 288} ${top - 94} L ${x + 288} ${top + 8} L ${x + 532} ${top - 94} L ${x + 532} ${top + 8} L ${x + 800} ${top - 60} L ${x + 800} ${top + 20} Z`} fill={HATCH} {...LINE} />
      <rect x={x} y={top} width={800} height={300} rx={6} fill={C.worldWall} {...LINE} />
      <rect x={x} y={top} width={800} height={20} fill={C.artMid} {...FINE} />
      {windows.map(({ wx, wy }, i) => (
        <g key={i}>
          <rect x={wx} y={wy} width={78} height={60} rx={4} fill={lit * 12 > (i * 5) % 12 ? C.artStrong : C.worldWall} {...LINE} />
          <path d={`M ${wx + 39} ${wy} V ${wy + 60} M ${wx} ${wy + 30} H ${wx + 78}`} fill="none" {...FINE} />
        </g>
      ))}
      <rect x={x + 690} y={GROUND - 128} width={110} height={128} rx={4} fill={C.artMid} {...LINE} />
      <path d={`M ${x + 690} ${GROUND - 96} H ${x + 800} M ${x + 690} ${GROUND - 64} H ${x + 800} M ${x + 690} ${GROUND - 32} H ${x + 800}`} fill="none" {...FINE} />
    </g>
  );
};

/** The company as one picture, already running: sky, ground and the factory, filling a w × h box. */
export const CompanyArt = ({ w, h, s, f }: { w: number; h: number; s: number; f: number }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, background: `linear-gradient(to bottom, ${C.worldMorning}, ${C.worldWall})` }}>
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      <g transform={`translate(${w / 2 - AT.factory * s} ${h * 0.84 - GROUND * s}) scale(${s})`}>
        <GroundLine />
        <Factory lit={1} f={f + RUNNING} />
      </g>
    </svg>
  </div>
);

/** A product: a small pack. */
const Pack = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x - 26} y={y - 56} width={52} height={56} rx={6} fill={C.worldWall} {...LINE} />
    <rect x={x - 26} y={y - 38} width={52} height={20} fill={C.artStrong} {...FINE} />
  </g>
);

/** A carton, taped. */
const Carton = ({ x, y, w = 84, h = 68 }: { x: number; y: number; w?: number; h?: number }) => (
  <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx={6} fill={C.artPale} {...LINE} />
    <rect x={x - 7} y={y - h} width={14} height={h} fill={C.artMid} {...FINE} />
  </g>
);

const Belt = ({ x0, x1, f }: { x0: number; x1: number; f: number }) => {
  const rollers = Math.floor((x1 - x0) / 60);
  return (
    <g>
      {[x0 + 40, (x0 + x1) / 2, x1 - 40].map((lx) => (
        <rect key={lx} x={lx - 9} y={BELT_Y} width={18} height={GROUND - BELT_Y} rx={4} fill={C.worldWall} {...LINE} />
      ))}
      <rect x={x0} y={BELT_Y - 12} width={x1 - x0} height={30} rx={15} fill={C.artPale} {...LINE} />
      {Array.from({ length: rollers }, (_, i) => {
        const cx = x0 + 30 + ((i * 60 + f * SPEED) % (rollers * 60));
        return <circle key={i} cx={cx} cy={BELT_Y + 3} r={7 * ease(cx, x0 + 30, 20) * (1 - ease(cx, x1 - 40, 20))} fill={C.worldWall} {...FINE} />;
      })}
    </g>
  );
};

/**
 * The conveyor, packs riding it into the packing machine. `shown` brings each pack up (0–1), for a belt that starts empty;
 * `open` is a belt with no machine at its end, where the packs shrink away instead.
 */
export const Conveyor = ({ f, shown = () => 1, open = false }: { f: number; shown?: (i: number) => number; open?: boolean }) => {
  const [x0, x1] = AT.belt;
  const gap = 170;
  const n = Math.ceil((x1 - x0) / gap);
  return (
    <g>
      <Belt x0={x0} x1={x1} f={f} />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + ((i * gap + f * SPEED) % (n * gap));
        return (
          <Grown key={i} x={x} y={BELT_Y - 12} s={shown(i) * ease(x, x0, END_RUN) * (open ? 1 - ease(x, x1 - END_RUN, END_RUN) : 1)}>
            <Pack x={x} y={BELT_Y - 12} />
          </Grown>
        );
      })}
    </g>
  );
};

/** The packing machine: packs go in, cartons come out on a short belt to the loading bay, `shown` like Conveyor's packs. */
export const Packer = ({ f, shown = () => 1 }: { f: number; shown?: (i: number) => number }) => {
  const [x0, x1] = AT.cartons;
  const gap = 150;
  const n = Math.ceil((x1 - x0) / gap);
  const x = AT.packer;
  return (
    <g>
      <Belt x0={x0} x1={x1} f={f} />
      {Array.from({ length: n }, (_, i) => {
        const cx = x0 + ((i * gap + f * SPEED) % (n * gap));
        return (
          <Grown key={i} x={cx} y={BELT_Y - 12} s={shown(i) * (1 - ease(cx, x1 - 20, END_RUN))}>
            <Carton x={cx} y={BELT_Y - 12} />
          </Grown>
        );
      })}
      <rect x={x - 120} y={GROUND - 250} width={240} height={250} rx={10} fill={C.worldWall} {...LINE} />
      <rect x={x - 88} y={GROUND - 214} width={176} height={70} rx={6} fill={C.artPale} {...LINE} />
      <rect x={x - 70} y={GROUND - 192} width={140 * (0.3 + 0.7 * Math.abs(Math.sin(f / 26)))} height={24} rx={6} fill={C.artStrong} {...FINE} />
      <rect x={x - 136} y={BELT_Y - 86} width={46} height={92} rx={6} fill={C.artMid} {...LINE} />
      <rect x={x + 90} y={BELT_Y - 86} width={46} height={92} rx={6} fill={C.artMid} {...LINE} />
    </g>
  );
};

/** A truck, facing right, its wheels turning with the distance it has come; `s` scales it on the road. */
export const Truck = ({ x, y = GROUND + 94, s = 1 }: { x: number; y?: number; s?: number }) => (
  <Grown x={x} y={y} s={s}>
    <rect x={x - 200} y={y - 190} width={290} height={150} rx={8} fill={C.worldWall} {...LINE} />
    <rect x={x - 200} y={y - 94} width={290} height={22} fill={C.artStrong} {...FINE} />
    <path d={`M ${x + 98} ${y - 150} L ${x + 164} ${y - 150} Q ${x + 176} ${y - 150} ${x + 184} ${y - 138} L ${x + 216} ${y - 100} Q ${x + 222} ${y - 94} ${x + 222} ${y - 84} L ${x + 222} ${y - 52} Q ${x + 222} ${y - 40} ${x + 210} ${y - 40} L ${x + 98} ${y - 40} Z`} fill={C.artMid} {...LINE} />
    <path d={`M ${x + 118} ${y - 136} L ${x + 164} ${y - 136} L ${x + 196} ${y - 98} L ${x + 118} ${y - 98} Z`} fill={C.worldWall} {...FINE} />
    {[x - 130, x + 150].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={y - 34} r={36} fill={C.worldWall} {...LINE} />
        <circle cx={wx} cy={y - 34} r={16} fill={C.artMid} {...FINE} />
        <rect x={wx - 2} y={y - 50} width={4} height={32} rx={2} fill={C.artInk} transform={`rotate(${x * 1.6} ${wx} ${y - 34})`} />
      </g>
    ))}
  </Grown>
);

/** The loading bay: a canopy over the end of the carton belt, where the truck stands. */
export const Bay = () => (
  <g>
    <Hatch />
    <rect x={AT.bay - 180} y={GROUND - 300} width={26} height={300} rx={4} fill={C.worldWall} {...LINE} />
    <rect x={AT.bay + 330} y={GROUND - 300} width={26} height={300} rx={4} fill={C.worldWall} {...LINE} />
    <rect x={AT.bay - 210} y={GROUND - 332} width={596} height={44} rx={6} fill={HATCH} {...LINE} />
  </g>
);

/** A shop: wall, a striped awning, a door and a lit window with shelves. */
const Shop = ({ x, lit }: { x: number; lit: number }) => {
  const w = 260;
  const top = GROUND - 250;
  const stripes = 6;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={250} rx={6} fill={C.worldWall} {...LINE} />
      <rect x={x - w / 2 + 26} y={top + 94} width={124} height={100} rx={4} fill={lit > 0.5 ? C.artStrong : C.worldWall} {...LINE} />
      <path d={`M ${x - w / 2 + 26} ${top + 144} H ${x - w / 2 + 150} M ${x - w / 2 + 88} ${top + 94} V ${top + 194}`} fill="none" {...FINE} />
      <rect x={x + 44} y={top + 94} width={66} height={156} rx={4} fill={C.artMid} {...LINE} />
      {Array.from({ length: stripes }, (_, i) => (
        <path key={i} d={`M ${x - w / 2 - 14 + (i * (w + 28)) / stripes} ${top + 8} h ${(w + 28) / stripes} v 58 a ${(w + 28) / stripes / 2} 18 0 0 1 ${-(w + 28) / stripes} 0 Z`} fill={i % 2 ? C.worldWall : C.artMid} {...LINE} />
      ))}
      <rect x={x - w / 2 - 14} y={top - 6} width={w + 28} height={20} rx={6} fill={C.worldWall} {...LINE} />
    </g>
  );
};

/** The row of shops, the town behind them, and a basket by each door that a pack drops into (`sold`, 0–1 per shop). */
export const Shops = ({ sold }: { sold: number[] }) => (
  <g>
    {[3780, 3960, 4210, 4420, 4700, 4930, 5120].map((x, i) => (
      <rect key={x} x={x} y={GROUND - 380 - (i % 3) * 60} width={170} height={380 + (i % 3) * 60} rx={6} fill={C.artPale} />
    ))}
    {AT.shops.map((x, i) => (
      <g key={x}>
        <Shop x={x} lit={1} />
        {sold[i] > 0.001 ? (
          <g>
            <Pack x={x - 100 + 34} y={GROUND - 24 - 90 * (1 - sold[i])} />
            <path d={`M ${x - 110} ${GROUND - 44} h 88 l -10 44 h -68 Z`} fill={C.worldWall} {...LINE} />
          </g>
        ) : null}
      </g>
    ))}
  </g>
);
