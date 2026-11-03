/**
 * RouteMap.tsx — VI04's MASTER ROUTE MAP (2 Nov 2026, the boss's notes via Simon: "Buat visual ini menjadi master
 * route map, lalu gunakan ulang pada scene lain"; storyboard docs/vi-style/storyboards/VI04-SC02-v3.jpg). It takes
 * over from the two islands (components/Islands.tsx, still there for the switch's "lama" side).
 *
 * FLAT 2D, from above (Simon: "mending dibuat 2D aja deh, biar perbedaan jauhnya bisa diukur dengan mudah"), and LONG
 * (Simon, same day: "Tujuan harus terasa jauh … buat ilustrasi jarak antara karakter dengan tujuan tuh jauh" → the
 * zoom-out idea, after his reference pin.it/704109723021765798: a flat map with a road network, the camera close on
 * the traveller, then pulling out to the whole trip, pins and labels staying the same size).
 *
 * The world is a map three screens wide. Kamu stands on the near (south) bank at the far west; the TUJUAN INVESTASI
 * flag is across the river at the far east. The three ways there, numbered in the script's order:
 *   1 jalan kaki — the LONGEST: back west to the only bridge, then a winding road all the way east;
 *   2 kapal      — medium: a pier by Kamu, the whole winding river, a pier below the flag;
 *   3 pesawat    — the SHORTEST: an airstrip beside Kamu, one straight line.
 * World lengths, measured when laid out: 6655 / 5433 / 4272 (1.56 : 1.27 : 1). Move a point and measure again.
 *
 * The LAND rides the camera (it scales); what stands on it — Kamu, the flag, the routes, the discs, the names — is
 * drawn in screen space at the camera's point for it, at MARK(s) of its size, so it stays legible at every zoom.
 */
import { random, useCurrentFrame } from "remotion";
import { theme, useMotion, usePalette, useShadow } from "../../../core";
import { Ico, Mark, NumRing, OUTSIDE_RESERVES, ease } from "./kit";
import { NEUTRAL, Stickman, frameStyle, type IsleFrame } from "./Islands";

type P = [number, number];

/** The world: one map card. */
const MAP = { w: 5000, h: 1600, r: 120 };
const YOU: P = [420, 1320];
const GOAL: P = [4600, 440];
/** The river: a few slow, uneven bends across the whole map, `w` wide. */
const RIVER = { w: 110, knots: [[-200, 860], [300, 1080], [850, 800], [1400, 1090], [2000, 770], [2600, 1080], [3200, 790], [3800, 1080], [4400, 760], [4850, 860], [5250, 1000]] as P[] };
const BRIDGE = { x: 118, y: 930, w: 44, h: 220 };
const PIERS = [
  { x: 425, y: 1060, w: 30, h: 80 },
  { x: 4425, y: 660, w: 30, h: 80 },
];
/** The airstrip: from beside Kamu, pointing at the flag. */
const STRIP = { from: [500, 1310] as P, len: 380, half: 30 };

/** The winding road on the far bank (route 1 walks it): north of the river's highest swing, under the map's top. */
const WINDING: P[] = Array.from({ length: 8 }, (_, i): P => [600 + 500 * i, i % 2 ? 620 : 220]);

/**
 * The routes, in the script's order. `smooth`: a Catmull-Rom curve through the points; the plane's is a straight
 * line. `disc`: how far along the route its icon sits (placed clear of the other two routes).
 */
const ROUTES = [
  { n: 1, icon: "t-bridge-i", smooth: true, disc: 0.5, pts: [YOU, [300, 1350], [160, 1250], [140, 1150], [140, 930], [230, 600], ...WINDING, GOAL] as P[] },
  { n: 2, icon: "t-ferry-i", smooth: true, disc: 0.36, pts: [YOU, [440, 1200], [440, 1032], ...RIVER.knots.filter(([x]) => x > 440 && x <= 4400), [4440, 690], GOAL] as P[] },
  { n: 3, icon: "t-plane-i", smooth: false, disc: 0.62, pts: [YOU, STRIP.from, GOAL] as P[] },
];
/** Roads that are only roads: the network that makes it read as a map (none crosses the river). */
const ROADS: P[][] = [
  [[0, 1490], [900, 1440], [1800, 1510], [2700, 1450], [3600, 1520], [5000, 1470]],
  [[1500, 1600], [1520, 1460], [1450, 1250]],
  [[3000, 1600], [2960, 1440], [3030, 1240]],
  [[0, 90], [1300, 110], [2700, 80], [5000, 100]],
  [[1600, 220], [1640, 95]],
  [[3600, 220], [3560, 90]],
];

const catmull = (pts: P[], n = 16): P[] => {
  const p = [pts[0], ...pts, pts[pts.length - 1]];
  const out: P[] = [];
  for (let i = 1; i < p.length - 2; i++)
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
      out.push([f(p[i - 1][0], p[i][0], p[i + 1][0], p[i + 2][0]), f(p[i - 1][1], p[i][1], p[i + 1][1], p[i + 2][1])]);
    }
  out.push(pts[pts.length - 1]);
  return out;
};
const dOf = (pts: P[]) => pts.map((q, i) => `${i ? "L" : "M"} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" ");
const poly = (pts: P[]) => pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
const along = (pts: P[], t: number): P => {
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  let left = seg.reduce((a, b) => a + b, 0) * t;
  for (let i = 0; i < seg.length; i++) {
    if (left <= seg[i]) {
      const k = seg[i] ? left / seg[i] : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    left -= seg[i];
  }
  return pts[pts.length - 1];
};
const dense = (pts: P[]) => pts.flatMap((q, i) => (i ? Array.from({ length: 8 }, (_, k): P => [pts[i - 1][0] + ((q[0] - pts[i - 1][0]) * (k + 1)) / 8, pts[i - 1][1] + ((q[1] - pts[i - 1][1]) * (k + 1)) / 8]) : [q]));
const ROUTE_PTS = ROUTES.map((r) => (r.smooth ? catmull(r.pts) : dense(r.pts)));
const RIVER_PTS = catmull(RIVER.knots);
const ROAD_PTS = [catmull(ROUTES[0].pts.slice(4)), ...ROADS.map((r) => catmull(r))];
const near = (q: P, pts: P[], d: number) => pts.some((r) => Math.hypot(r[0] - q[0], r[1] - q[1]) < d);

/**
 * Trees, scattered once (seeded, so every render agrees): clear of the river, the routes, the roads, Kamu and the
 * flag, and of the band SC02's closing line sits on when the camera dives onto Kamu.
 */
const TREES: P[] = (() => {
  const out: P[] = [];
  const strip = dense([STRIP.from, [STRIP.from[0] + 380 * 0.98, STRIP.from[1] - 380 * 0.2]]);
  for (let i = 0; i < 900 && out.length < 46; i++) {
    const q: P = [100 + random(`vi04-tree-x-${i}`) * (MAP.w - 200), 100 + random(`vi04-tree-y-${i}`) * (MAP.h - 200)];
    if (near(q, RIVER_PTS, RIVER.w / 2 + 80) || near(q, strip, 90)) continue;
    if (ROUTE_PTS.some((r) => near(q, r, 80)) || ROAD_PTS.some((r) => near(q, r, 60)) || near(q, [YOU, GOAL], 260) || near(q, out, 220)) continue;
    if (q[0] < 1500 && q[1] > 640 && q[1] < 840) continue;
    out.push(q);
  }
  return out;
})();

/** How big the things standing on the map are drawn, for a camera scale s: full size close up, never under 55 %. */
export const MARK = (s: number) => Math.min(1, Math.max(0.55, 0.55 + (0.45 * (s - 0.24)) / 0.76));
const cam = (fr: IsleFrame, q: P): P => [fr.tx + fr.s * q[0], fr.ty + fr.s * q[1]];

/**
 * The camera on the map. screen = t + s · world. near — on Kamu at the river; goal — the same zoom, on the flag (the
 * long pan between the two IS the distance); full — the whole map; low — the whole map small under SC02's question
 * cards; dive — Kamu large under SC02's closing line (SC03 opens on it).
 */
const frameOn = (s: number, at: P, to: P): IsleFrame => ({ s, tx: to[0] - s * at[0], ty: to[1] - s * at[1] });
const CENTRE: P = [MAP.w / 2, MAP.h / 2];
export const MAP_FRAME: Record<"near" | "goal" | "full" | "low" | "dive", IsleFrame> = {
  near: frameOn(1, YOU, [560, 840]),
  goal: frameOn(1, GOAL, [1240, 600]),
  full: frameOn(1680 / MAP.w, CENTRE, [960, 540]),
  low: frameOn(0.24, CENTRE, [960, 744]),
  dive: frameOn(1.2, YOU, [700, 900]),
};

/** Where route `n`'s disc sits on SCREEN at the full framing, and its radius there (SC03 grows route 1's). */
export const mapDisc = (n: number): P => cam(MAP_FRAME.full, along(ROUTE_PTS[n - 1], ROUTES[n - 1].disc));
const DISC_R = 50;
export const MAP_DISC_R = DISC_R * MARK(MAP_FRAME.full.s);
const FLAG = { pole: 130, clothW: 78, clothH: 50 };

/** A name pill on the map ("Kamu", "TUJUAN INVESTASI"), its bottom-centre at `at`, at `k` of its size. */
export const Name = ({ at, k, text, size = 34 }: { at: P; k: number; text: string; size?: number }) => {
  const c = usePalette();
  return (
    <div style={{ position: "absolute", left: at[0], top: at[1], transform: `translate(-50%, -100%) scale(${k.toFixed(3)})`, transformOrigin: "50% 100%", padding: "10px 26px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, fontFamily: theme.text.family, fontSize: size, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

type MapProps = { g: number; landAt: number; riverAt: number; youAt: number; goalAt: number; routesAt?: number; check?: number; focus?: { n: number; p: number; lifted?: boolean } };

/**
 * The map under camera `fr`. Scene-local frames: each part rises on its own frame (`landAt`, `riverAt`, `youAt`,
 * `goalAt`); `routesAt` (optional) draws the three routes one after another in their numbered order, each disc
 * arriving as its line passes it; `check` (0–1) puts a ✓ by the flag's name. `g` (GLOBAL frame) drifts the
 * ripples, so they carry across a scene change. `focus` / `lifted` as on the islands (scenes/Routes.tsx grows route
 * 1's disc into the next layout). `layer`: MapCamera draws the land and what stands on it separately.
 */
export const RouteMap = ({ fr, g, landAt, riverAt, youAt, goalAt, routesAt, check = 0, focus, layer = "all" }: MapProps & { fr: IsleFrame; layer?: "all" | "ground" | "marks" }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const land = ease(f, landAt, m.reveal);
  const water = ease(f, riverAt, m.sec(0.8));
  const you = ease(f, youAt, m.reveal);
  const goal = ease(f, goalAt, m.pop);
  const k = MARK(fr.s);
  const W = theme.canvas.width;
  const H = theme.canvas.height;

  // the river band: the centre line offset either side along its normal
  const bank = (side: number) =>
    RIVER_PTS.map((q, i): P => {
      const a = RIVER_PTS[Math.max(0, i - 1)];
      const b = RIVER_PTS[Math.min(RIVER_PTS.length - 1, i + 1)];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      return [q[0] - ((b[1] - a[1]) / l) * side * (RIVER.w / 2), q[1] + ((b[0] - a[0]) / l) * side * (RIVER.w / 2)];
    });
  const dir = [GOAL[0] - STRIP.from[0], GOAL[1] - STRIP.from[1]];
  const dl = Math.hypot(dir[0], dir[1]);
  const [ux, uy] = [dir[0] / dl, dir[1] / dl];
  const end: P = [STRIP.from[0] + ux * STRIP.len, STRIP.from[1] + uy * STRIP.len];
  const across = (q: P, s: number): P => [q[0] - uy * STRIP.half * s, q[1] + ux * STRIP.half * s];
  const rect = (r: { x: number; y: number; w: number; h: number }, fill: string) => <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill={fill} />;

  const youAtS = cam(fr, YOU);
  const goalAtS = cam(fr, GOAL);
  const goalTop: P = [goalAtS[0], goalAtS[1] - FLAG.pole * k];
  const at = (q: P, s = k) => `translate(${q[0].toFixed(2)} ${q[1].toFixed(2)}) scale(${s.toFixed(4)})`;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {layer !== "marks" ? (
        <div style={frameStyle(fr)}>
          <div style={{ position: "absolute", inset: 0, opacity: land }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: MAP.w, height: MAP.h, borderRadius: MAP.r, background: c.cardBg, boxShadow: shadow.soft }} />
            <svg width={MAP.w} height={MAP.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <defs>
                <clipPath id="vi04-map-card">
                  <rect x={0} y={0} width={MAP.w} height={MAP.h} rx={MAP.r} />
                </clipPath>
              </defs>
              <g clipPath="url(#vi04-map-card)">
                {/* the road network (route 1's winding road among them) */}
                {ROAD_PTS.map((r, i) => (
                  <path key={i} d={dOf(r)} fill="none" stroke={NEUTRAL.left} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
                ))}
                {/* the river, white ripples drifting on it */}
                <g opacity={water}>
                  <polygon points={poly([...bank(1), ...bank(-1).reverse()])} fill={NEUTRAL.right} stroke={NEUTRAL.right} strokeWidth={6} strokeLinejoin="round" />
                  {Array.from({ length: 30 }, (_, i) => {
                    const [x, y] = along(RIVER_PTS, (i / 30 + ((g / 1800 + i * 0.37) % 1) * 0.012) % 1);
                    return <path key={i} d={`M ${(x - 18).toFixed(1)} ${y.toFixed(1)} q 9 -6 18 0 t 18 0`} fill="none" stroke={NEUTRAL.top} strokeWidth={4} strokeLinecap="round" />;
                  })}
                  {/* the bridge: a deck of planks between two rails */}
                  {rect(BRIDGE, theme.color.houseNFrame)}
                  {Array.from({ length: Math.floor(BRIDGE.h / 16) - 1 }, (_, i) => BRIDGE.y + 16 * (i + 1)).map((y) => (
                    <line key={y} x1={BRIDGE.x + 6} y1={y} x2={BRIDGE.x + BRIDGE.w - 6} y2={y} stroke={theme.color.houseNChimney} strokeWidth={3} />
                  ))}
                  {[BRIDGE.x, BRIDGE.x + BRIDGE.w].map((x) => (
                    <line key={x} x1={x} y1={BRIDGE.y - 6} x2={x} y2={BRIDGE.y + BRIDGE.h + 6} stroke={theme.color.neutralIcon} strokeWidth={7} strokeLinecap="round" />
                  ))}
                  {PIERS.map((p, i) => (
                    <g key={i}>{rect(p, theme.color.houseNFrame)}</g>
                  ))}
                </g>
                <polygon points={poly([across(STRIP.from, 1), across(end, 1), across(end, -1), across(STRIP.from, -1)])} fill={theme.color.houseNRoof} stroke={theme.color.houseNRoof} strokeWidth={10} strokeLinejoin="round" />
                {/* trees from above: a round crown, its lit side up-left */}
                {TREES.map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r={30} fill={theme.color.houseNBush} />
                    <circle cx={x - 8} cy={y - 8} r={16} fill={theme.color.houseNChimneyShade} />
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>
      ) : null}

      {layer !== "ground" ? (
        <>
          {/* the routes, in screen space so the dots keep their size at every zoom */}
          {routesAt !== undefined
            ? ROUTES.map((r, i) => {
                const p = ease(f, routesAt + m.sec(0.35) * (r.n - 1), m.sec(0.9));
                if (p <= 0.001) return null;
                const d = dOf(ROUTE_PTS[i].map((q) => cam(fr, q)));
                return (
                  <svg key={r.n} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                    <mask id={`vi04-map-way-${r.n}`} maskUnits="userSpaceOnUse">
                      <path d={d} pathLength={1} fill="none" stroke="white" strokeWidth={30} strokeDasharray={1} strokeDashoffset={1 - p} />
                    </mask>
                    <path d={d} fill="none" stroke={theme.color.connector} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 13" mask={`url(#vi04-map-way-${r.n})`} />
                  </svg>
                );
              })
            : null}

          {/* Kamu, and the flag far away */}
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <g opacity={you} transform={`translate(0 ${((1 - you) * 40).toFixed(2)})`}>
              <g transform={`${at(youAtS)} translate(${-YOU[0]} ${-YOU[1]})`}>
                <Stickman pal={NEUTRAL} at={YOU} />
              </g>
            </g>
            <g opacity={goal} transform={at(goalAtS, k * (0.7 + 0.3 * goal))}>
              <ellipse cx={0} cy={0} rx={30} ry={10} fill={NEUTRAL.right} />
              <line x1={0} y1={0} x2={0} y2={-FLAG.pole} stroke={theme.color.neutralIcon} strokeWidth={6} strokeLinecap="round" />
              <polygon points={poly([[3, -FLAG.pole + 2], [FLAG.clothW, -FLAG.pole + FLAG.clothH * 0.45], [3, -FLAG.pole + FLAG.clothH]])} fill={c.indigo} stroke={c.indigo} strokeWidth={6} strokeLinejoin="round" />
            </g>
          </svg>

          {/* the discs on the routes */}
          {routesAt !== undefined
            ? ROUTES.map((r, i) => {
                const q = ease(f, routesAt + m.sec(0.35) * (r.n - 1) + m.sec(0.45), m.pop);
                if (q <= 0.001 || (focus?.lifted && focus.n === r.n)) return null;
                const [x, y] = cam(fr, along(ROUTE_PTS[i], r.disc));
                // the route about to be told: a little bigger, and it glows (as on the islands, Simon 22 Oct)
                const hi = focus && focus.n === r.n ? focus.p : 0;
                const ring = `inset 0 0 0 2px ${hi > 0.01 ? theme.color.connector : theme.color.hairlineBrandSolid}`;
                const glow = hi > 0.001 ? `, 0 0 ${(40 * hi).toFixed(1)}px ${(10 * hi).toFixed(1)}px ${theme.color.indigoGlow}` : "";
                return (
                  <div key={r.n} style={{ position: "absolute", left: x - DISC_R, top: y - DISC_R, width: DISC_R * 2, height: DISC_R * 2, borderRadius: 999, background: c.cardBg, boxShadow: ring + glow, display: "flex", alignItems: "center", justifyContent: "center", opacity: q, transform: `scale(${(k * (0.6 + 0.4 * q) * (1 + 0.2 * hi)).toFixed(3)})`, zIndex: hi > 0.001 ? 1 : 0 }}>
                    <Ico name={r.icon} size={60} tone={theme.color.neutralIcon} />
                    <div style={{ position: "absolute", right: -10, top: -10 }}>
                      <NumRing n={r.n} size={40} />
                    </div>
                  </div>
                );
              })
            : null}

          {/* the names, and the ✓ by the flag's */}
          <div style={{ position: "absolute", inset: 0, opacity: you, transform: `translateY(${((1 - you) * 40).toFixed(2)}px)` }}>
            <Name at={[youAtS[0] + 36 * k, youAtS[1] - 178 * k]} k={k} text="Kamu" />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: goal }}>
            <Name at={[goalTop[0] + 10 * k, goalTop[1] - 16 * k]} k={k} text="TUJUAN INVESTASI" size={30} />
          </div>
          <div style={{ position: "absolute", left: goalTop[0] + 220 * k, top: goalTop[1] - 50 * k, transform: `scale(${k.toFixed(3)})` }}>
            <Mark kind="check" p={check} x={0} y={0} />
          </div>
        </>
      ) : null}
    </div>
  );
};

/** The caption band only — the map card is ground (like the grid), so it may run under the logo; nothing ON it may. */
const BAND_ONLY = `inset(0 0 ${theme.canvas.height - theme.captionBand.top}px 0)`;

/**
 * The map under a camera, in two layers: the land clipped to the caption band only, so a close framing has no notch
 * cut where the logo sits; Kamu, the flag, the routes and the names kept out of the logo zone as well.
 */
export const MapCamera = (props: MapProps & { fr: IsleFrame }) => (
  <>
    <div style={{ position: "absolute", inset: 0, clipPath: BAND_ONLY }}>
      <RouteMap {...props} layer="ground" />
    </div>
    <div style={{ position: "absolute", inset: 0, clipPath: OUTSIDE_RESERVES }}>
      <RouteMap {...props} layer="marks" />
    </div>
  </>
);
