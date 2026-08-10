/**
 * SC11 — Trend size & speed (from 5212, dur 643).
 *
 * Module 1 separates SIZE, and it does it with one shape drawn twice: MAJOR
 * with its jitter (the swings) and MAJOR_TREND without it (the trend). Same
 * legs, same seed, one flag apart. That is the claim the scene makes, so it is
 * built rather than illustrated — and the swings are drawn ON the trend band,
 * because that is the relationship being described.
 *
 * The lens then magnifies one swing until a single red candle fills it. Nothing
 * about the trend changed; only how close we stood.
 *
 * Module 2 compares SPEED. The spec asks for a cross-wipe between the modules;
 * wipes are not used here, so the handover is a cross-fade.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart } from "../components/CandleChart";
import { StructureLine } from "../components/StructureLine";
import { ComparePanels, panelRects } from "../components/ComparePanels";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut, inset } from "../helpers";
import { plot, window as cut, candles } from "../data/shape";
import { MAJOR, MAJOR_TREND, MAJOR_LENS, GRADUAL, STEEP } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  major: 79, // "major trend"
  minor: 169, // "minor swing"
  lens: 274, // "satu candle merah"
  noise: 316, // "noise"
  swap: 425, // "kecepatannya"
  spike: 571, // "hampir vertikal"
};
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
/** The magnified card that opens over the swing. */
const LENS_CARD = { x: 1090, y: 300, w: 470, h: 300 };
// ═══════════════════════════════════════════════════════════════════════════

const P_SWINGS = plot(MAJOR, BOX, { pad: 0.12 });
const P_TREND = plot(MAJOR_TREND, BOX, { pad: 0.12, range: [MAJOR.lo, MAJOR.hi] });

const LENS_BARS = candles(cut(MAJOR, MAJOR_LENS), 9, 91);
const LENS_BOX = inset(LENS_CARD, 30);
/** The rectangle on the chart hugs the swing's own price range, not a guess. */
const LENS_PRICES = MAJOR.samples.filter((s) => s.t >= MAJOR_LENS[0] && s.t <= MAJOR_LENS[1]).map((s) => s.p);
const LENS_RECT = {
  x: P_SWINGS.x(MAJOR_LENS[0]) - 14,
  w: P_SWINGS.x(MAJOR_LENS[1]) - P_SWINGS.x(MAJOR_LENS[0]) + 28,
  top: P_SWINGS.y(Math.max(...LENS_PRICES)) - 34,
  bottom: P_SWINGS.y(Math.min(...LENS_PRICES)) + 34,
};

const PANELS = panelRects(2);
const paneBox = (i: number) => ({ x: PANELS[i].x + 70, y: PANELS[i].y + 100, w: PANELS[i].w - 140, h: PANELS[i].h - 250 });
const P_GRADUAL = plot(GRADUAL, paneBox(0), { pad: 0.14 });
const P_STEEP = plot(STEEP, paneBox(1), { pad: 0.14, range: [GRADUAL.lo, GRADUAL.hi] });

export const Scene11 = () => {
  const f = useCurrentFrame();

  const trend = progress(f, T.major - 40, 120);
  const swings = f >= T.minor ? progress(f, T.minor, 46) : 0;
  const lens = f >= T.lens ? progress(f, T.lens, 34) : 0;
  const first = f >= T.swap ? fadeOut(f, T.swap, 30) : 1;

  const second = f >= T.swap + 10 ? fadeIn(f, T.swap + 10, 30) : 0;
  const left = f >= T.swap + 30 ? progress(f, T.swap + 30, 110) : 0;
  const right = f >= T.swap + 45 ? progress(f, T.swap + 45, T.spike - T.swap - 45) : 0;

  return (
    <Stage>
      {first > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: first }}>
          <Card>
            <StructureLine plot={P_TREND} draw={trend} color={theme.color.indigo} width={theme.shape.heavy} opacity={0.5} />
            {swings > 0.001 && <StructureLine plot={P_SWINGS} draw={swings} color={theme.color.ink} width={2} opacity={0.9} />}

            {/* kept left of the lens card, which opens over the right half */}
            {trend > 0.5 && <Chip label="Major Trend" x={P_TREND.along(0.45).x} y={P_TREND.along(0.45).y + 96} tone="indigo" at={T.major} />}
            {swings > 0.4 && <Chip label="Minor Swing" x={P_SWINGS.along(0.2).x} y={P_SWINGS.along(0.2).y - 76} tone="slate" at={T.minor + 24} />}

            {lens > 0.001 && (
              <Layer>
                <rect
                  x={LENS_RECT.x}
                  y={LENS_RECT.top}
                  width={LENS_RECT.w}
                  height={LENS_RECT.bottom - LENS_RECT.top}
                  fill="none"
                  stroke={theme.color.slate}
                  strokeWidth={theme.shape.rule}
                  rx={10}
                  opacity={lens}
                />
                <line
                  x1={LENS_RECT.x + LENS_RECT.w}
                  y1={(LENS_RECT.top + LENS_RECT.bottom) / 2}
                  x2={LENS_CARD.x}
                  y2={LENS_CARD.y + LENS_CARD.h / 2}
                  stroke={theme.color.slate}
                  strokeWidth={theme.shape.hairline}
                  opacity={lens * 0.7}
                />
              </Layer>
            )}
          </Card>

          {lens > 0.2 && (
            <Card rect={LENS_CARD} radius={theme.shape.panelRadius} scale={0.9 + 0.1 * lens} opacity={lens}>
              <CandleChart bars={LENS_BARS} box={LENS_BOX} axis={false} opacity={lens} />
            </Card>
          )}
          {f >= T.noise && <Chip label="Noise" x={LENS_CARD.x + LENS_CARD.w / 2} y={LENS_CARD.y + LENS_CARD.h + 46} tone="slate" at={T.noise} />}
        </div>
      )}

      <ComparePanels
        opacity={second}
        panels={[
          { title: "Bertahap", tone: "indigo", plot: P_GRADUAL, draw: left, titleAt: T.swap + 20, note: { label: "Lebih Stabil", at: T.spike } },
          { title: "Hampir Vertikal", tone: "cyan", plot: P_STEEP, draw: right, titleAt: T.swap + 20 },
        ]}
      />
    </Stage>
  );
};
