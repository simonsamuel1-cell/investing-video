/**
 * RouteMap.tsx — IN04's MASTER ROUTE MAP (2 Nov 2026, the boss's notes via Simon: "Buat visual ini menjadi master
 * route map, lalu gunakan ulang pada scene lain"; storyboard docs/vi-style/storyboards/IN04-SC02-v3.jpg). It takes
 * over from the two islands (components/Islands.tsx, still there for the switch's "lama" side).
 *
 * The map is Template-map's (Simon, 3 Nov: "Ok sejauh ini cocok. Coba implementasiin ke IN04. Ukurannya juga
 * sesuaiin ya"): the traced harbour map, simplified, in IN04's colours (components/HarbourMap.tsx); Kamu on the
 * far-left road, west of the river; and the three ways of scripts/vi/harbour-routes.py, numbered in the script's order:
 *   1 jalan kaki — the LONGEST: on the roads, up to the only bridge, over it, round the top and down the long road;
 *   2 kapal      — medium: to the bank, down the river, up the pier;
 *   3 pesawat    — the SHORTEST: one straight line from Kamu.
 * Lengths 5476 / 2989 / 2606 (2.1 : 1.15 : 1) — move a point and run the script again. Where Template-map has its
 * house, IN04 keeps the boss's TUJUAN INVESTASI flag, at the house's door, where every way ends.
 *
 * The LAND rides the camera (it scales); what stands on it — Kamu, the flag, the routes, the discs, the names — is
 * drawn in screen space at the camera's point for it, at MARK(s) of its size, so it stays legible at every zoom. A
 * route is one solid line 2 px wider than the road each side, at every zoom (Simon, 3 Nov: "daripada jadi titik2,
 * mending langsung garis aja, sedikit lebih tebal dari jalanan").
 */
import { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { theme, useMotion, usePalette, useShadow } from "../../../core";
import HARBOUR from "../data/harbour-routes.json";
import { HARBOUR_ROAD_W, HARBOUR_SIZE, HarbourMap, harbourPaint, type HarbourHide } from "./HarbourMap";
import { Ico, Mark, NumRing, OUTSIDE_RESERVES, ease } from "./kit";
import { NEUTRAL, Stickman, frameStyle, type IsleFrame } from "./Islands";

type P = [number, number];
const pt = (q: number[]): P => [q[0], q[1]];

/** The world: the harbour map's simple drawing as shown, one card. */
const MAP = { w: HARBOUR_SIZE.simple.w, h: HARBOUR_SIZE.simple.h, r: 120 };
const YOU = pt(HARBOUR.kamu);
const GOAL = pt(HARBOUR.door);

const dense = (pts: P[]) => pts.flatMap((q, i) => (i ? Array.from({ length: 8 }, (_, k): P => [pts[i - 1][0] + ((q[0] - pts[i - 1][0]) * (k + 1)) / 8, pts[i - 1][1] + ((q[1] - pts[i - 1][1]) * (k + 1)) / 8]) : [q]));
const [WALK, BOAT] = HARBOUR.routes;
/** Where the plane takes off: on its straight line to the flag, right by Kamu (the boss's SC05 notes, 3 Nov 2026:
 *  "pesawat menjadi kendaraan dengan jalur paling langsung; titik keberangkatan pesawat berada dekat karakter; jangan
 *  membuat pesawat terlihat sebagai kendaraan yang lokasinya paling jauh") — PLANE_T of the way. */
const PLANE_T = 0.09;
/** The routes, in the script's order, each with where its disc sits. The plane flies to the flag (Template-map's to its house's side). */
const ROUTES = [
  { n: 1, icon: "t-bridge-i", pts: WALK.pts.map(pt), disc: pt(WALK.disc) },
  { n: 2, icon: "t-ferry-i", pts: BOAT.pts.map(pt), disc: pt(BOAT.disc) },
  { n: 3, icon: "t-plane-i", pts: dense([YOU, GOAL]), disc: [YOU[0] + (GOAL[0] - YOU[0]) * PLANE_T, YOU[1] + (GOAL[1] - YOU[1]) * PLANE_T] as P },
];
/** How far along its route (by length, 0–1) each disc sits — it pops as its line passes it. */
const DISC_AT = ROUTES.map((r) => {
  const seg = r.pts.slice(1).map((q, i) => Math.hypot(q[0] - r.pts[i][0], q[1] - r.pts[i][1]));
  const near = r.pts.reduce((b, q, i) => (Math.hypot(q[0] - r.disc[0], q[1] - r.disc[1]) < Math.hypot(r.pts[b][0] - r.disc[0], r.pts[b][1] - r.disc[1]) ? i : b), 0);
  return seg.slice(0, near).reduce((a, b) => a + b, 0) / seg.reduce((a, b) => a + b, 0);
});
/** The routes draw one at a time, each in full before the next begins (Simon, 3 Nov: "jangan langsung muncul
 *  sekaligus 3, munculnya harus bergantian, tunggu yang pertama selesai baru muncul yang selanjutnya"): seconds each,
 *  unless the scene says how long (`drawFor`). */
const DRAW_S = 1.1;
const dOf = (pts: P[]) => pts.map((q, i) => `${i ? "L" : "M"} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" ");
const poly = (pts: P[]) => pts.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");

/** How big the things standing on the map are drawn, for a camera scale s: full size close up, never under 55 %. */
export const MARK = (s: number) => Math.min(1, Math.max(0.55, 0.55 + (0.45 * (s - 0.24)) / 0.76));
const cam = (fr: IsleFrame, q: P): P => [fr.tx + fr.s * q[0], fr.ty + fr.s * q[1]];
/** A route's line on screen: the road's width at this zoom, and this much more on each side. */
const OVER_ROAD = 2;

/**
 * The camera on the map. screen = t + s · world. near — on Kamu, the river beside him; goal — the same zoom, on the
 * flag (the long pan between the two IS the distance); full — the whole map; low — the whole map small under SC02's
 * question cards; dive — Kamu large under SC02's closing line (SC03 opens on it).
 *
 * The sizes ("ukurannya juga sesuaiin"): the whole map stands between the logo zone and the subtitle band — its top at
 * the logo zone's foot, its foot FULL_GAP above the band, so 800 tall and 1200 wide; under the cards (their foot at
 * 518, scenes/River.tsx CARDS) it keeps LOW_GAP from them and the same from the band.
 */
const frameOn = (s: number, at: P, to: P): IsleFrame => ({ s, tx: to[0] - s * at[0], ty: to[1] - s * at[1] });
const CENTRE: P = [MAP.w / 2, MAP.h / 2];
const FULL_GAP = 22;
const FULL = { top: theme.logoZone.height, bottom: theme.captionBand.top - FULL_GAP };
const LOW_GAP = 22;
const LOW = { top: 518 + LOW_GAP, bottom: theme.captionBand.top - LOW_GAP };
export const MAP_FRAME: Record<"near" | "goal" | "full" | "low" | "dive", IsleFrame> = {
  near: frameOn(1, YOU, [560, 840]),
  goal: frameOn(1, GOAL, [1240, 640]),
  full: frameOn((FULL.bottom - FULL.top) / MAP.h, CENTRE, [theme.canvas.width / 2, (FULL.top + FULL.bottom) / 2]),
  low: frameOn((LOW.bottom - LOW.top) / MAP.h, CENTRE, [theme.canvas.width / 2, (LOW.top + LOW.bottom) / 2]),
  dive: frameOn(1.2, YOU, [700, 900]),
};

/** The camera that puts the whole map `w` wide on screen, its left edge at x, its middle at height cy (SC03 sets it
 *  beside the mindmap). */
export const mapInto = (r: { x: number; w: number; cy: number }): IsleFrame => frameOn(r.w / MAP.w, CENTRE, [r.x + r.w / 2, r.cy]);
/** The routes not being told, while another is lit: gone, disc and all (Simon, 3 Nov: first "jalur yang lainnya berubah
 *  jadi transparency 25%", then "Saat giliran 1/2/3, buat yang tidak terhighlight hilang aja deh"). */
const DIM = 0;

const DISC_R = 50;
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

/** The drawing in two: the dry land with its roads, and the water with its ripples and the bridge over it. */
const DRY: HarbourHide[] = ["water", "waves", "bridge"];
const WET: HarbourHide[] = ["land", "road"];

type MapProps = { g: number; landAt: number; riverAt: number; youAt: number; goalAt: number; routesAt?: number; drawFor?: number; check?: number; focus?: { n: number; p: number; lifted?: boolean }; lit?: number[] };

/**
 * The map under camera `fr`. Scene-local frames: each part rises on its own frame (`landAt`, `riverAt`, `youAt`,
 * `goalAt`); `routesAt` (optional) draws the three routes in their numbered order, each finished before the next
 * starts (`drawFor` frames each, DRAW_S by default), each disc arriving as its line passes it; `check` (0–1) puts a ✓ by the flag's name. `g` (GLOBAL frame) is kept for the
 * callers (the old map drifted its ripples by it). `focus` / `lifted` as on the islands (scenes/Routes.tsx grows
 * route 1's disc into the next layout). `lit` (0–1 per route): the route being told glows indigo and the others go
 * to DIM (Simon, 3 Nov: "jalur 1 (jembatan) terhighlight … Style highlightnya adalah glow indigo"), crossfading as
 * the weight moves from one route to the next. `layer`: MapCamera draws the land and what stands on it separately.
 */
export const RouteMap = ({ fr, landAt, riverAt, youAt, goalAt, routesAt, drawFor, check = 0, focus, lit, layer = "all" }: MapProps & { fr: IsleFrame; layer?: "all" | "ground" | "marks" }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const paint = useMemo(() => harbourPaint(c.cardBg), [c.cardBg]);
  const land = ease(f, landAt, m.reveal);
  const water = ease(f, riverAt, m.sec(0.8));
  const you = ease(f, youAt, m.reveal);
  const goal = ease(f, goalAt, m.pop);
  const k = MARK(fr.s);
  const W = theme.canvas.width;
  const H = theme.canvas.height;
  const routeW = HARBOUR_ROAD_W * fr.s + 2 * OVER_ROAD;
  // how lit each route is, and how far the others' light dims it; the lit one is drawn last, over the rest
  const glowOf = (n: number) => lit?.[n - 1] ?? 0;
  const opOf = (n: number) => 1 - (1 - DIM) * Math.min(1, Math.max(0, (lit ?? []).reduce((a, b) => a + b, 0) - glowOf(n)));
  const order = [...ROUTES].sort((a, b) => glowOf(a.n) - glowOf(b.n));
  const each = drawFor ?? m.sec(DRAW_S);
  const drawAt = (n: number) => (routesAt ?? 0) + each * (n - 1);

  const youAtS = cam(fr, YOU);
  const goalAtS = cam(fr, GOAL);
  const goalTop: P = [goalAtS[0], goalAtS[1] - FLAG.pole * k];
  const at = (q: P, s = k) => `translate(${q[0].toFixed(2)} ${q[1].toFixed(2)}) scale(${s.toFixed(4)})`;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {layer !== "marks" ? (
        <div style={frameStyle(fr)}>
          <div style={{ position: "absolute", left: 0, top: 0, width: MAP.w, height: MAP.h, borderRadius: MAP.r, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft, opacity: land }}>
            <HarbourMap x={0} y={0} h={MAP.h} version="simple" hide={DRY} paint={paint} />
            <div style={{ position: "absolute", inset: 0, opacity: water }}>
              <HarbourMap x={0} y={0} h={MAP.h} version="simple" hide={WET} paint={paint} />
            </div>
          </div>
        </div>
      ) : null}

      {layer !== "ground" ? (
        <>
          {/* the routes, in screen space so a line keeps its edge over the road at every zoom */}
          {routesAt !== undefined
            ? order.map((r) => {
                const p = ease(f, drawAt(r.n), each);
                if (p <= 0.001) return null;
                const d = dOf(r.pts.map((q) => cam(fr, q)));
                const gl = glowOf(r.n);
                const glow = gl > 0.001 ? `drop-shadow(0 0 ${(12 * gl).toFixed(1)}px ${theme.color.indigoGlow}) drop-shadow(0 0 ${(4 * gl).toFixed(1)}px ${theme.color.indigoGlow})` : undefined;
                return (
                  <svg key={r.n} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: opOf(r.n), filter: glow }}>
                    <mask id={`in04-map-way-${r.n}`} maskUnits="userSpaceOnUse">
                      <path d={d} pathLength={1} fill="none" stroke="white" strokeWidth={routeW + 12} strokeDasharray={1} strokeDashoffset={1 - p} />
                    </mask>
                    <path d={d} fill="none" stroke={theme.color.connector} strokeWidth={routeW} strokeLinecap="round" strokeLinejoin="round" mask={`url(#in04-map-way-${r.n})`} />
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
            ? ROUTES.map((r) => {
                const q = ease(f, drawAt(r.n) + each * DISC_AT[r.n - 1], m.pop);
                if (q <= 0.001 || (focus?.lifted && focus.n === r.n)) return null;
                const [x, y] = cam(fr, r.disc);
                // the route about to be told: a little bigger, and it glows (as on the islands, Simon 22 Oct); lit, the same
                const hi = Math.max(focus && focus.n === r.n ? focus.p : 0, glowOf(r.n));
                const ring = `inset 0 0 0 2px ${hi > 0.01 ? theme.color.connector : theme.color.hairlineBrandSolid}`;
                const glow = hi > 0.001 ? `, 0 0 ${(40 * hi).toFixed(1)}px ${(10 * hi).toFixed(1)}px ${theme.color.indigoGlow}` : "";
                return (
                  <div key={r.n} style={{ position: "absolute", left: x - DISC_R, top: y - DISC_R, width: DISC_R * 2, height: DISC_R * 2, borderRadius: 999, background: c.cardBg, boxShadow: ring + glow, display: "flex", alignItems: "center", justifyContent: "center", opacity: q * opOf(r.n), transform: `scale(${(k * (0.6 + 0.4 * q) * (1 + 0.2 * hi)).toFixed(3)})`, zIndex: hi > 0.001 ? 1 : 0 }}>
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
