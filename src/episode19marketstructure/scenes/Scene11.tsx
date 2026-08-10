/**
 * SC11 — Trend size & speed (from 5212, dur 643).
 *
 * Module 1 separates SIZE. The wide indigo band is MAJOR drawn through its
 * pivots ALONE; the thin dark line is the very same structure with its swings
 * left in. One series, two readings — which is exactly the claim, so it is
 * drawn that way rather than with two datasets. The swings are drawn ON the
 * band, because that is the relationship: they ride the trend.
 *
 * The lens then magnifies one swing until a single red candle fills it. Nothing
 * about the trend changed; only how close we stood.
 *
 * Module 2 compares SPEED. The spec asks for a cross-wipe between modules;
 * wipes are not used here, so the handover is a cross-fade.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, ChartCard, Layer } from "../components/SafeArea";
import { CandleChart } from "../components/CandleChart";
import { StructureLine } from "../components/StructureLine";
import { ComparePanels, panelBox } from "../components/ComparePanels";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut } from "../helpers";
import { MAJOR, MAJOR_LENS, GRADUAL, VERTICAL, structure, geom, zoom, candlesFrom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  major: 79, // "major trend"
  minor: 169, // "minor swing"
  lens: 274, // "satu candle merah"
  noise: 316, // "noise"
  swap: 425, // "kecepatannya"
  spike: 571, // "hampir vertikal"
};
const BOX = { x: theme.frame.plot.x, y: theme.frame.plot.y + 40, w: theme.frame.plot.w, h: theme.frame.plot.h - 120 };
/** The magnified card that opens over the swing. */
const LENS_CARD = { x: 1090, y: 300, w: 470, h: 300 };
// ═══════════════════════════════════════════════════════════════════════════

/** The trend WITHOUT its swings — same pivots, no wiggle. */
const SMOOTH = structure(MAJOR.pivots, { wiggle: 0, seed: 19 });
const G_MAJOR = geom(MAJOR, BOX, { pad: 0.12 });
const G_SMOOTH = geom(SMOOTH, BOX, { pad: 0.12, range: [MAJOR.min, MAJOR.max] });

const LENS_CANDLES = candlesFrom(zoom(MAJOR, MAJOR_LENS), 9, 91);
const LENS_BOX = { x: LENS_CARD.x + 30, y: LENS_CARD.y + 30, w: LENS_CARD.w - 60, h: LENS_CARD.h - 60 };
/** The rectangle on the chart hugs the swing's own price range, not a guess. */
const LENS_YS = MAJOR.pts.filter((p) => p.t >= MAJOR_LENS[0] && p.t <= MAJOR_LENS[1]).map((p) => p.p);
const LENS_RECT = {
  x: G_MAJOR.x(MAJOR_LENS[0]) - 14,
  w: G_MAJOR.x(MAJOR_LENS[1]) - G_MAJOR.x(MAJOR_LENS[0]) + 28,
  top: G_MAJOR.y(Math.max(...LENS_YS)) - 34,
  bottom: G_MAJOR.y(Math.min(...LENS_YS)) + 34,
};

const inset = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x + 70, y: b.y + 90, w: b.w - 140, h: b.h - 230 });
const G_GRADUAL = geom(GRADUAL, inset(panelBox(0)), { pad: 0.14 });
const G_VERTICAL = geom(VERTICAL, inset(panelBox(1)), { pad: 0.14, range: [GRADUAL.min, GRADUAL.max] });

export const Scene11 = () => {
  const f = useCurrentFrame();

  const majorDraw = progress(f, T.major - 40, 120);
  const minorIn = f >= T.minor ? progress(f, T.minor, 46) : 0;
  const lens = f >= T.lens ? progress(f, T.lens, 34) : 0;
  const mod1 = f >= T.swap ? fadeOut(f, T.swap, 30) : 1;

  const mod2 = f >= T.swap + 10 ? fadeIn(f, T.swap + 10, 30) : 0;
  const drawL = f >= T.swap + 30 ? progress(f, T.swap + 30, 110) : 0;
  const drawR = f >= T.swap + 45 ? progress(f, T.swap + 45, T.spike - T.swap - 45) : 0;

  return (
    <SafeArea>
      {mod1 > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: mod1 }}>
          <ChartCard>
            <StructureLine g={G_SMOOTH} draw={majorDraw} color={theme.colors.indigo} width={theme.stroke.thick} opacity={0.5} />
            {minorIn > 0.001 && <StructureLine g={G_MAJOR} draw={minorIn} color={theme.colors.ink} width={2} opacity={0.9} />}

            {/* kept left of the lens card, which opens over the right half */}
            {majorDraw > 0.5 && (
              <Chip label="Major Trend" x={G_SMOOTH.headAt(0.45).x} y={G_SMOOTH.headAt(0.45).y + 96} variant="indigo" startFrame={T.major} />
            )}
            {minorIn > 0.4 && <Chip label="Minor Swing" x={G_MAJOR.headAt(0.2).x} y={G_MAJOR.headAt(0.2).y - 74} variant="slate" startFrame={T.minor + 24} />}

            {lens > 0.001 && (
              <Layer>
                <rect
                  x={LENS_RECT.x}
                  y={LENS_RECT.top}
                  width={LENS_RECT.w}
                  height={LENS_RECT.bottom - LENS_RECT.top}
                  fill="none"
                  stroke={theme.colors.slate}
                  strokeWidth={theme.stroke.rule}
                  rx={10}
                  opacity={lens}
                />
                <line
                  x1={LENS_RECT.x + LENS_RECT.w}
                  y1={(LENS_RECT.top + LENS_RECT.bottom) / 2}
                  x2={LENS_CARD.x}
                  y2={LENS_CARD.y + LENS_CARD.h / 2}
                  stroke={theme.colors.slate}
                  strokeWidth={theme.stroke.hair}
                  opacity={lens * 0.7}
                />
              </Layer>
            )}
          </ChartCard>

          {lens > 0.2 && (
            <ChartCard box={LENS_CARD} radius={theme.radius.card} scale={0.9 + 0.1 * lens} opacity={lens}>
              <CandleChart data={LENS_CANDLES} window={[0, LENS_CANDLES.length - 1]} box={LENS_BOX} showAxes={false} opacity={lens} />
            </ChartCard>
          )}
          {f >= T.noise && <Chip label="Noise" x={LENS_CARD.x + LENS_CARD.w / 2} y={LENS_CARD.y + LENS_CARD.h + 44} variant="slate" startFrame={T.noise} />}
        </div>
      )}

      <ComparePanels
        opacity={mod2}
        panels={[
          { title: "Bertahap", variant: "indigo", g: G_GRADUAL, draw: drawL, titleFrame: T.swap + 20, note: { label: "Lebih Stabil", startFrame: T.spike } },
          { title: "Hampir Vertikal", variant: "cyan", g: G_VERTICAL, draw: drawR, titleFrame: T.swap + 20 },
        ]}
      />
    </SafeArea>
  );
};
