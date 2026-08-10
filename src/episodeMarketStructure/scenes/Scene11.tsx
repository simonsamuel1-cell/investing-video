/**
 * SC11 — Trend size and speed (from 5212, dur 643) — INDEPENDENT.
 *
 * Two modules in one scene. The first separates SIZE: the thick indigo line is
 * MAJOR drawn through its pivots alone, the thin slate line is the very same
 * structure with its swings left in. One series, two readings — which is
 * exactly the claim, so it is drawn that way rather than with two datasets.
 *
 * The lens then magnifies one swing until a single red candle fills it. Nothing
 * about the trend changed; only how close we stood.
 *
 * The second module compares SPEED. The doc calls for a cross-wipe between the
 * modules; wipes are not used here, so the handover is a cross-fade.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { CandlestickChart } from "../components/CandlestickChart";
import { PriceLine } from "../components/PriceLine";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress, fadeIn, fadeOut } from "../helpers";
import { MAJOR, MAJOR_LENS, GRADUAL, VERTICAL, structure, geom, zoom, candlesFrom, type Geom } from "../data/structures";
import { CARD, PLOT, CAPTION_Y, paneBox } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  major: 79, // "major trend"
  minor: 169, // "minor swing"
  lens: 274, // "satu candle merah"
  noise: 316, // "noise"
  swap: 425, // "kecepatannya"
  spike: 571, // "hampir vertikal"
};
const BOX = { x: PLOT.x, y: PLOT.y + 40, w: PLOT.w, h: PLOT.h - 120 };
/** The magnified card that opens over the swing. */
const LENS_CARD = { x: 1090, y: 300, w: 470, h: 300 };
// ═══════════════════════════════════════════════════════════════════════════

/** The trend WITHOUT its swings — same pivots, no wiggle. */
const SMOOTH = structure(MAJOR.pivots, { wiggle: 0, seed: 19 });
const G_MAJOR = geom(MAJOR, BOX, { pad: 0.12 });
const G_SMOOTH = geom(SMOOTH, BOX, { pad: 0.12, range: [MAJOR.min, MAJOR.max] });

const LENS_CANDLES = candlesFrom(zoom(MAJOR, MAJOR_LENS), 9, 91);
const LENS_BOX = { x: LENS_CARD.x + 30, y: LENS_CARD.y + 30, w: LENS_CARD.w - 130, h: LENS_CARD.h - 60 };

const PANE_L = paneBox(0);
const PANE_R = paneBox(1);
const inset = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x + 70, y: b.y + 90, w: b.w - 140, h: b.h - 230 });
const G_GRADUAL = geom(GRADUAL, inset(PANE_L), { pad: 0.14 });
const G_VERTICAL = geom(VERTICAL, inset(PANE_R), { pad: 0.14, range: [GRADUAL.min, GRADUAL.max] });

/** The opening slope of a line, as an angle arc drawn at its start. */
const SlopeArc = ({ g, opacity }: { g: Geom; opacity: number }) => {
  const pal = usePalette();
  const a = g.pts[0];
  const b = g.headAt(0.55);
  const r = 74;
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const ex = a.x + r * Math.cos(ang);
  const ey = a.y + r * Math.sin(ang);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height} opacity={opacity}>
      <line x1={a.x} y1={a.y} x2={a.x + r + 30} y2={a.y} stroke={pal.slate} strokeWidth={theme.stroke.hair} strokeDasharray="8 8" />
      <path d={`M ${a.x + r},${a.y} A ${r} ${r} 0 0 0 ${ex},${ey}`} fill="none" stroke={pal.cyan} strokeWidth={theme.stroke.rule} />
    </svg>
  );
};

export const Scene11 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  // ── module 1: size ──
  const majorDraw = progress(f, T.major - 40, 120);
  const minorIn = f >= T.minor ? progress(f, T.minor, 46) : 0;
  const lens = f >= T.lens ? progress(f, T.lens, 34) : 0;
  const mod1 = f >= T.swap ? fadeOut(f, T.swap, 30) : 1;

  // ── module 2: speed ──
  const mod2 = f >= T.swap + 10 ? fadeIn(f, T.swap + 10, 30) : 0;
  const drawL = f >= T.swap + 30 ? progress(f, T.swap + 30, 110) : 0;
  const drawR = f >= T.swap + 45 ? progress(f, T.swap + 45, T.spike - T.swap - 45) : 0;

  const lensRect = {
    x: G_MAJOR.x(MAJOR_LENS[0]),
    w: G_MAJOR.x(MAJOR_LENS[1]) - G_MAJOR.x(MAJOR_LENS[0]),
  };

  return (
    <SafeArea>
      {mod1 > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: mod1 }}>
          <ChartCard box={CARD}>
            {/* the swings, riding the trend */}
            {minorIn > 0.001 && <PriceLine g={G_MAJOR} draw={minorIn} color={pal.slate} width={2} opacity={0.75} />}
            {/* the trend itself */}
            <PriceLine g={G_SMOOTH} draw={majorDraw} color={pal.indigo} width={7} />

            {majorDraw > 0.5 && <Chip label="Major Trend" x={G_SMOOTH.headAt(0.62).x} y={G_SMOOTH.headAt(0.62).y + 70} variant="indigo" startFrame={T.major} />}
            {minorIn > 0.4 && <Chip label="Minor Swing" x={G_MAJOR.headAt(0.2).x} y={G_MAJOR.headAt(0.2).y - 74} variant="slate" startFrame={T.minor + 24} />}

            {/* the lens: a rectangle on the chart, opened into a card */}
            {lens > 0.001 && (
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
                <rect
                  x={lensRect.x}
                  y={BOX.y + BOX.h * 0.18}
                  width={lensRect.w}
                  height={BOX.h * 0.5}
                  fill="none"
                  stroke={pal.slate}
                  strokeWidth={theme.stroke.rule}
                  rx={10}
                  opacity={lens}
                />
                <line
                  x1={lensRect.x + lensRect.w}
                  y1={BOX.y + BOX.h * 0.3}
                  x2={LENS_CARD.x}
                  y2={LENS_CARD.y + LENS_CARD.h / 2}
                  stroke={pal.slate}
                  strokeWidth={theme.stroke.hair}
                  opacity={lens * 0.7}
                />
              </svg>
            )}
          </ChartCard>

          {lens > 0.2 && (
            <ChartCard box={LENS_CARD} lifted scale={0.9 + 0.1 * lens} opacity={lens}>
              <CandlestickChart data={LENS_CANDLES} window={[0, LENS_CANDLES.length - 1]} box={LENS_BOX} showAxes={false} dimOpacity={lens} />
            </ChartCard>
          )}
          {f >= T.noise && <Chip label="Noise" x={LENS_CARD.x + LENS_CARD.w / 2} y={LENS_CARD.y + LENS_CARD.h + 44} variant="slate" startFrame={T.noise} />}
        </div>
      )}

      {/* ── the same climb at two speeds ── */}
      {mod2 > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: mod2 }}>
          <ChartCard box={PANE_L} />
          <ChartCard box={PANE_R} />
          <PriceLine g={G_GRADUAL} draw={drawL} color={pal.indigo} width={4} />
          <PriceLine g={G_VERTICAL} draw={drawR} color={pal.indigo} width={4} />
          <SlopeArc g={G_GRADUAL} opacity={drawL} />
          <SlopeArc g={G_VERTICAL} opacity={drawR} />
          <Chip label="Bertahap" x={PANE_L.x + PANE_L.w / 2} y={PANE_L.y + 56} variant="indigo" startFrame={T.swap + 20} />
          <Chip label="Hampir Vertikal" x={PANE_R.x + PANE_R.w / 2} y={PANE_R.y + 56} variant="cyan" startFrame={T.swap + 20} />
          {f >= T.spike && <Chip label="Lebih Stabil" x={PANE_L.x + PANE_L.w / 2} y={CAPTION_Y} variant="indigo" startFrame={T.spike} />}
        </div>
      )}
    </SafeArea>
  );
};
