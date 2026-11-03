/**
 * Template-map — named Stickman-Walk until 3 Nov (Simon: "Stickman-Walk ganti nama jadi Template-map"). Born as a test
 * composition, only to look at the walking stickman (Simon, 19 Oct: "coba buat composition baru, khusus buat liat
 * animasi stickman jalan"). Left: facing the viewer, walking on the spot on an island. Right: in profile, walking
 * across a ground line, turning round at each end.
 *
 * Also the sandbox for the VI style tokens (Simon, 20 Oct: "coba bikin dulu di stickman-walk mulai dari nomor 1.
 * Tulis Lorem Ipsum dengan 5 kategori tersebut"): the type scale, one line per level, at the top.
 *
 * And, from 2 Nov, the place for a still object (Simon: "Bikin still object dulu deh, taro dulu di stickman walk"):
 * `SHOW` switches between the walking test and the traced harbour map (components/HarbourMap.tsx).
 */
import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GridGround, PaletteProvider, Stage, TYPE_LEVELS, theme, typeStyle, useMotion, usePalette } from "../../core";
import { HOUSE_W, House, NEUTRAL, Stickman, houseOn } from "./components/Islands";
import { HarbourRouteDiscs, HarbourRoutePaths, harbourHouse } from "./components/HarbourRoutes";
import { MAP_FRAME, MARK, Name } from "./components/RouteMap";
import { Walker } from "./components/Walker";
import { HARBOUR_SIZE, HarbourMap, type HarbourHide } from "./components/HarbourMap";

export const TEMPLATE_MAP_FRAMES = 600;

/** What the composition shows: the walking test, or the still object — the traced harbour map. */
const SHOW = "map" as "walk" | "map";
/** What Simon has said to drop from the map (names and families in components/HarbourMap.tsx). */
const HIDE: HarbourHide[] = [
  // 2 Nov: "hapus Judul ("The pinnacle of luxury yachting" dan bahasa mandarinnya), semua nama template, semua pohon,
  // semua gedung dan kapal, semua angka" + "hapus semua angka tuh termasuk icon pinpoint mapnya" — the whole title
  // block, every place name (and "Route 2"), the trees, the buildings and ships, and every pin with its number
  // (the gold "S" pin too)
  "title-*",
  "label-*",
  "trees",
  "bld-*",
  "ship-*",
  "pin-*",
  "num-*",
  // + "hapus gambar 1 [the compass], lalu di gambar 2 ada kayak garis hijau gelap gitu [the route], hapus juga"
  "compass",
  "route",
];
/**
 * Which drawing: the trace with HIDE applied, or — Simon's next step, 2 Nov: "lurusin garis-garis yang zigzag …
 * pathways yang putus … simplify aja mapnya" — the ground alone, redrawn smooth (HIDE's objects aren't in it at all).
 */
const VERSION = "simple" as "traced" | "simple";
/** Where Kamu stands: on the road at mid-height on the far left, west of the river, in the simple drawing's own units
 *  (measured off a still). */
const KAMU_ON_ROAD = { x: 222, y: 1188 }; // scripts/vi/harbour-routes.py starts the routes here too
/** The house as wide as Simon's red box for it (sketch 4, docs/vi-style/refs/starry-harbour-route-34-simon.png), in
 *  the drawing's units. */
const HOUSE_SPAN = 420;

/** The map, whole, as big as the canvas holds it, in the middle. */
const MapStill = () => {
  const c = usePalette();
  const size = HARBOUR_SIZE[VERSION];
  const k = Math.min(theme.canvas.width / size.w, theme.canvas.height / size.h);
  const w = size.w * k;
  const h = size.h * k;
  // in VI04's route-map colours (components/RouteMap.tsx), not the reference's own (Simon, 2 Nov: "peta yang di
  // stickman walk yang dibenerin ke warna peta yang di VI04") — white land, grey water with white ripples, pale grey
  // roads, the bridge in the route map's bridge grey
  const paint = useMemo(
    () => ({ land: c.cardBg, water: NEUTRAL.right, waves: NEUTRAL.top, road: NEUTRAL.left, bridge: theme.color.houseNFrame }),
    [c.cardBg],
  );
  const left = (theme.canvas.width - w) / 2;
  const top = (theme.canvas.height - h) / 2;
  // Kamu — VI04's, at the size it has when VI04 shows its whole map (Simon, 2 Nov: "kasih icon Kamu"), standing on
  // a road ("icon Kamunya dibuat dari jalan di tengah paling kiri luar sungai")
  const kamuK = MARK(MAP_FRAME.full.s);
  const kamu: [number, number] = [left + KAMU_ON_ROAD.x * k, top + KAMU_ON_ROAD.y * k];
  // the three ways to the house (Simon, 2 Nov: "berikan highlight ke 3 jalur ini … Gambar 4 adalah lokasi rumahnya"):
  // VI04's dotted routes, and VI04's house where his red box is
  const place = { left, top, k };
  const house = harbourHouse(place);
  const houseK = (HOUSE_SPAN * k) / HOUSE_W;
  const scaleAt = (p: [number, number], s: number) => `translate(${p[0]} ${p[1]}) scale(${s.toFixed(4)}) translate(${-p[0]} ${-p[1]})`;
  return (
    <Stage>
      <AbsoluteFill style={{ background: c.bg }} />
      <HarbourMap x={left} y={top} h={h} hide={HIDE} paint={paint} version={VERSION} />
      <HarbourRoutePaths {...place} />
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={scaleAt(house, houseK)}>
          <House pal={NEUTRAL} o={houseOn(house)} />
        </g>
        <g transform={scaleAt(kamu, kamuK)}>
          <Stickman pal={NEUTRAL} at={kamu} />
        </g>
      </svg>
      <HarbourRouteDiscs {...place} mark={kamuK} />
      <Name at={[kamu[0] + 36 * kamuK, kamu[1] - 178 * kamuK]} k={kamuK} text="Kamu" />
    </Stage>
  );
};

const SAMPLE: Record<(typeof TYPE_LEVELS)[number], string> = {
  hero: "Lorem Ipsum",
  statement: "Lorem ipsum dolor sit",
  title: "Lorem ipsum dolor sit amet",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  label: "Lorem ipsum dolor sit amet",
};
const LEVEL_NAME = { hero: "Hero", statement: "Statement", title: "Title", body: "Body", label: "Label" };

/** The five type levels, each with its name and size beside it. */
const TypeSpecimen = () => {
  const c = usePalette();
  return (
    <div style={{ position: "absolute", left: theme.margin.left, top: 70, display: "flex", flexDirection: "column", gap: 24 }}>
      {TYPE_LEVELS.map((level) => (
        <div key={level} style={{ display: "flex", alignItems: "baseline" }}>
          <div style={{ ...typeStyle("label"), width: 300, color: c.slate, flex: "none" }}>
            {LEVEL_NAME[level]} · {theme.type[level].size}
          </div>
          <div style={{ ...typeStyle(level), color: level === "hero" ? c.indigo : c.ink, whiteSpace: "nowrap" }}>{SAMPLE[level]}</div>
        </div>
      ))}
    </div>
  );
};

const Body = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  // the profile walker crosses from x0 to x1 and back, slowing to a stop at each end
  const lap = m.sec(4.5);
  const pause = m.sec(0.5);
  const cycle = 2 * (lap + pause);
  const t = f % cycle;
  const x0 = 1100;
  const x1 = 1740;
  let x = x0;
  let facing: 1 | -1 = 1;
  let walking = 1;
  if (t < lap) {
    x = x0 + (x1 - x0) * (t / lap);
    walking = Math.min(1, t / m.sec(0.3), (lap - t) / m.sec(0.3));
  } else if (t < lap + pause) {
    x = x1;
    walking = 0;
  } else if (t < 2 * lap + pause) {
    const u = (t - lap - pause) / lap;
    x = x1 - (x1 - x0) * u;
    facing = -1;
    walking = Math.min(1, (t - lap - pause) / m.sec(0.3), (2 * lap + pause - t) / m.sec(0.3));
  } else {
    x = x0;
    facing = -1;
    walking = 0;
  }
  const ground = 760;
  return (
    <Stage>
      <GridGround f={f} paper={c.bg} />
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, color: c.ink }}>
        {/* left: an island to stand on */}
        <polygon points="480,600 760,740 480,880 200,740" fill={theme.color.isoTop} />
        <polygon points="200,740 480,880 480,920 200,780" fill={theme.color.isoLeft} />
        <polygon points="480,880 760,740 760,780 480,920" fill={theme.color.isoRight} />
        <Walker x={480} y={760} view="front" />
        {/* right: a ground line to walk along */}
        <line x1={x0 - 80} y1={ground} x2={x1 + 80} y2={ground} stroke={theme.color.isoLeft} strokeWidth={10} strokeLinecap="round" />
        <Walker x={x} y={ground} view="side" facing={facing} walking={walking} />
      </svg>
      <TypeSpecimen />
      <div style={{ ...typeStyle("label"), position: "absolute", left: 280, top: 932, width: 400, textAlign: "center", color: c.indigo }}>Tampak depan</div>
      <div style={{ ...typeStyle("label"), position: "absolute", left: x0, top: ground + 40, width: x1 - x0, textAlign: "center", color: c.indigo }}>Tampak samping</div>
    </Stage>
  );
};

export const TemplateMap = () => (
  <AbsoluteFill>
    <PaletteProvider>
      {SHOW === "map" ? <MapStill /> : <Body />}
    </PaletteProvider>
  </AbsoluteFill>
);
