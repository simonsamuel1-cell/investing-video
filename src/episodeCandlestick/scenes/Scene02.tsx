/**
 * Scene02 — from 240, duration 374 frames.
 * Hero green candle (open 1180 / high 1372 / low 1168 / close 1358) wipes in
 * bottom-up, wicks extend, then measurement annotations: body span
 * "Open → close", plus "Small wick" ticks top and bottom. At 7.6s the wick
 * labels dim while the body measurement brightens; chip "Conviction" pops
 * beneath the candle.
 * Compliance: fictional $ABCD, illustrative data only — no arrows, entry
 * markers, or price targets.
 */
import { useCurrentFrame, interpolateColors } from "remotion";
import { theme } from "../theme";
import { sec, progress, textReveal, priceScale } from "../helpers";
import { SafeArea } from "../components/SafeArea";
import { Candle } from "../components/Candle";
import { Chip } from "../components/Chip";
import { IllustrationTag } from "../components/IllustrationTag";

// ═══ EDIT ═══
const CANDLE_X = 620; // hero candle center
const CANDLE_W = 120;
const HERO = { open: 1180, high: 1372, low: 1168, close: 1358 }; // green
const P_MIN = 1165; // scale domain → body 1180→1358 spans ~593px
const P_MAX = 1375;
const Y_TOP = 170; // chart vertical box, px
const Y_BOTTOM = 870;
const MEASURE_X = 760; // vertical measurement lines
const LABEL_X = 800; // labels right of the measurement lines
const TICK_HALF = 8; // half-width of the horizontal end ticks
const TICK_GAP = 6; // gap between body line ends and wick ticks
const CHIP_Y = 890; // "Conviction" top edge (bottom stays above y 972)
const GROUP_DX = 190; // shift the whole group right to horizontally center it
const GROUP_DY = -30; // move up 30px (candle top stays clear of the 54px margin)
const T = {
  build: 0.0, // body wipes in bottom-up
  buildDur: 0.9,
  wicks: 1.2, // wicks extend
  wickDur: 0.6,
  bodyMeasure: 3.4, // body measurement line draws top→bottom + label
  measureDur: 0.7,
  upperTick: 4.6, // upper wick tick + label
  lowerTick: 5.2, // lower wick tick + label
  tickDur: 0.4,
  emph: 7.6, // wick labels dim, body measurement brightens
  chip: 9.6, // "Conviction" pops
  hold: 12.4, // hold to end
};
// ═══════════

const yOf = priceScale(P_MIN, P_MAX, Y_TOP, Y_BOTTOM, 0);
const Y_HIGH = yOf(HERO.high);
const Y_CLOSE = yOf(HERO.close); // body top (green)
const Y_OPEN = yOf(HERO.open); // body bottom
const Y_LOW = yOf(HERO.low);

const UPPER_MID = (Y_HIGH + Y_CLOSE) / 2;
const BODY_MID = (Y_CLOSE + Y_OPEN) / 2;
const LOWER_MID = (Y_OPEN + Y_LOW) / 2;

export const Scene02 = () => {
  const f = useCurrentFrame();

  const buildP = progress(f, sec(T.build), sec(T.buildDur));
  const wickP = progress(f, sec(T.wicks), sec(T.wickDur));

  // Body measurement draws top→bottom
  const measureP = progress(f, sec(T.bodyMeasure), sec(T.measureDur));
  const measureEnd = Y_CLOSE + (Y_OPEN - Y_CLOSE) * measureP;

  const upperP = progress(f, sec(T.upperTick), sec(T.tickDur));
  const lowerP = progress(f, sec(T.lowerTick), sec(T.tickDur));

  // 7.6s emphasis shift
  const emphP = progress(f, sec(T.emph), 12);
  const wickColor = interpolateColors(
    f,
    [sec(T.emph), sec(T.emph) + 12],
    [theme.colors.slate, theme.colors.neutralMuted]
  );
  const bodyEmphOpacity = 0.82 + 0.18 * emphP;

  const bodyLabel = textReveal(f, sec(T.bodyMeasure) + 6);
  const upperLabel = textReveal(f, sec(T.upperTick) + 4);
  const lowerLabel = textReveal(f, sec(T.lowerTick) + 4);

  const labelStyle = {
    position: "absolute" as const,
    left: LABEL_X,
    fontSize: theme.type.body.size,
    fontWeight: theme.type.body.weight,
    whiteSpace: "nowrap" as const,
  };

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${GROUP_DX}px, ${GROUP_DY}px)` }}>
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        <Candle
          x={CANDLE_X}
          width={CANDLE_W}
          open={HERO.open}
          high={HERO.high}
          low={HERO.low}
          close={HERO.close}
          scale={yOf}
          buildProgress={buildP}
          wickProgress={wickP}
        />

        {/* Body measurement — 2px indigo, end ticks, draws top→bottom */}
        {f >= sec(T.bodyMeasure) && (
          <g stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} opacity={bodyEmphOpacity}>
            <line x1={MEASURE_X} y1={Y_CLOSE} x2={MEASURE_X} y2={measureEnd} />
            <line x1={MEASURE_X - TICK_HALF} y1={Y_CLOSE} x2={MEASURE_X + TICK_HALF} y2={Y_CLOSE} />
            <line x1={MEASURE_X - TICK_HALF} y1={measureEnd} x2={MEASURE_X + TICK_HALF} y2={measureEnd} />
          </g>
        )}

        {/* Upper wick tick */}
        {f >= sec(T.upperTick) && (
          <g stroke={wickColor} strokeWidth={theme.stroke.standard}>
            <line x1={MEASURE_X} y1={Y_HIGH} x2={MEASURE_X} y2={Y_HIGH + (Y_CLOSE - TICK_GAP - Y_HIGH) * upperP} />
            <line x1={MEASURE_X - TICK_HALF} y1={Y_HIGH} x2={MEASURE_X + TICK_HALF} y2={Y_HIGH} opacity={upperP} />
          </g>
        )}

        {/* Lower wick tick */}
        {f >= sec(T.lowerTick) && (
          <g stroke={wickColor} strokeWidth={theme.stroke.standard}>
            <line x1={MEASURE_X} y1={Y_OPEN + TICK_GAP} x2={MEASURE_X} y2={Y_OPEN + TICK_GAP + (Y_LOW - Y_OPEN - TICK_GAP) * lowerP} />
            <line x1={MEASURE_X - TICK_HALF} y1={Y_LOW} x2={MEASURE_X + TICK_HALF} y2={Y_LOW} opacity={lowerP} />
          </g>
        )}
      </svg>

      {/* Labels — sentence case, 40px body type */}
      {f >= sec(T.bodyMeasure) && (
        <div
          style={{
            ...labelStyle,
            top: BODY_MID,
            color: theme.colors.ink,
            opacity: bodyLabel.opacity * bodyEmphOpacity,
            transform: `translateY(calc(-50% + ${bodyLabel.y}px))`,
          }}
        >
          Open → close
        </div>
      )}
      {f >= sec(T.upperTick) && (
        <div
          style={{
            ...labelStyle,
            top: UPPER_MID,
            color: wickColor,
            opacity: upperLabel.opacity,
            transform: `translateY(calc(-50% + ${upperLabel.y}px))`,
          }}
        >
          Small wick
        </div>
      )}
      {f >= sec(T.lowerTick) && (
        <div
          style={{
            ...labelStyle,
            top: LOWER_MID,
            color: wickColor,
            opacity: lowerLabel.opacity,
            transform: `translateY(calc(-50% + ${lowerLabel.y}px))`,
          }}
        >
          Small wick
        </div>
      )}

      <Chip label="Conviction" x={CANDLE_X} y={CHIP_Y} variant="indigo" startFrame={sec(T.chip)} />
      </div>

      <IllustrationTag />
    </SafeArea>
  );
};
