/**
 * SC16 — Timeframe trap (from 7666, dur 542).
 *
 * ONE series seen from two distances. The "5-minute chart" is not a second
 * dataset — it is TIMEFRAME magnified over TF_WINDOW, and the zoom-out is a
 * continuous widening of that window to the full range. Nothing is swapped, so
 * the viewer can watch a collapse turn into a higher low without the picture
 * ever cheating: the camera pulls back, the price does not change.
 *
 * IT OPENS ON THE MISTAKE, 7666 → 7760, named in words before it is shown.
 * Four lines, flush left, arriving one at a time with the narration — the two
 * that name who makes it in black, the two that name the habit in red. Then the
 * frame goes and does it, so the viewer recognises what they were just told.
 */
import { useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { CandleChart, barGrid } from "../components/CandleChart";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeIn, fadeOut, textReveal, clamp01 } from "../helpers";
import { CUTS, cutIn, cutPushOut, cutBlur } from "../transitions/CameraCut";
import { sceneBreath, LONG_ORIGIN } from "../transitions/Breath";
import { candles, window as cut } from "../data/shape";
import { TIMEFRAME, TF_WINDOW, TF_HIGHER_LOW } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** This scene's `from` in the Composition — needed to read the shared cut. */
const SCENE_FROM = 7666;
/** One slow breath over the card, starting once the statement has cleared. */
const BREATH = { at: 120, over: 400 };
const T = {
  /**
   * 7762. Held back from 60 so the opening statement owns the frame to 7760;
   * the line then traces faster to still be complete when "akhir tren" lands.
   */
  card: 96,
  fiveMinute: 101, // "chart lima menit"
  worry: 131, // "akhir tren"
  out: 216, // "chart harian"
  higherLow: 262, // "hanya higher low"
};
/**
 * THE OPENING STATEMENT.
 *
 * `stagger` is the gap between one line and the next — short and EQUAL, so the
 * four read as one sentence being set down rather than four separate beats.
 * The whole block is therefore up well before "chart terlalu dekat" is spoken;
 * it is a statement the frame makes, not a caption tracking the voice.
 *
 * Flush left on the plot's own left edge — the same x every chart in the
 * episode starts at, so the statement and the picture that follows it share a
 * margin instead of each finding their own.
 */
const NOTE = {
  /** The right-hand column. The figure holds the left. */
  x: 950,
  /** Centre of the first line. */
  y: 330,
  size: 96,
  weight: 800,
  lead: 124,
  stagger: 5,
  out: { at: 90, over: 14 },
};
/**
 * The figure that goes with the statement, in the left column. Its height is
 * what is set; the width follows from the artwork's own 2:3 so it can never be
 * squashed by a later tweak.
 */
const FIGURE = {
  src: "stickman-x.png",
  x: 200,
  y: 150,
  h: 780,
  aspect: 1024 / 1536,
};
/**
 * `hang` is punctuation set OUTSIDE the margin — the opening quote is pushed
 * into the gutter so the four lines start on the same vertical, with the mark
 * leaning in from the left. Aligning the quote instead of the word would leave
 * "Kesalahan" visibly indented from the three lines below it.
 */
const NOTE_LINES: { text: string; warn: boolean; hang?: string }[] = [
  { text: "Kesalahan", warn: false, hang: "“" },
  { text: "Pemula:", warn: false },
  { text: "Melihat chart", warn: true },
  { text: "terlalu dekat”", warn: true },
];
const OUT_OVER = 96; // frames the pull-back takes
const BOX = {
  x: theme.stage.plot.x,
  y: theme.stage.plot.y + 30,
  w: theme.stage.plot.w,
  h: theme.stage.plot.h - 110,
};
/**
 * THE TIMEFRAME SELECTOR — the row a charting app puts in this corner.
 *
 * All five are always on screen; only which one is lit changes, and it changes
 * INSTANTLY at T.out while the chart takes 96 frames to follow. That is the
 * right order of events: you click the tab, then the chart catches up.
 */
const TF = {
  x: theme.stage.card.x + 86,
  y: theme.stage.card.y + 54,
  gap: 100,
  options: ["5m", "1H", "4H", "1D", "1W"],
  /** Which option is lit before the switch, and after it. */
  from: 0,
  to: 3,
};
/**
 * Bars on screen, held CONSTANT as the window widens — which is exactly what
 * changing timeframe does. Each bar simply covers more of the same curve, so
 * the scene's claim still holds: the camera pulls back, the price does not
 * change. Nothing is swapped for a second dataset.
 */
const BAR_N = 46;
/**
 * ═══ TWO TREND LINES ON THE 5-MINUTE VIEW — EDIT THESE ═══
 *
 * Coordinates are FRACTIONS of the plot box, so they survive any change to the
 * box itself: x 0 is its left edge and 1 its right; y 0 is the TOP and 1 the
 * bottom. A line therefore falls to the right when y2 is greater than y1.
 * Position is (x1, y1); length is however far (x2, y2) is from it.
 *
 * They belong to the close-up only, and leave with it when the camera pulls
 * back — a trend line drawn on five-minute bars means nothing on a daily chart.
 *
 * TO KEEP THE TWO PARALLEL: give them the same (x2 − x1) and the same
 * (y2 − y1). The box is far wider than it is tall, so equal fraction deltas —
 * not equal fraction slopes — are what produce equal slopes on screen. The
 * second line here is the first one shifted straight down by 0.21.
 */
const TREND_5M = [
  { x1: 0.19, y1: 0.13, x2: 0.85, y2: 0.76 },
  { x1: 0.19, y1: 0.34, x2: 0.85, y2: 0.97 },
];
/**
 * THE TIME AXIS, under the plot, in whatever unit the lit timeframe is in.
 *
 * The daily dates are REAL positions, not evenly spaced ticks: 46 bars from
 * 1 Juli puts the last one on 15 Agustus, so 15 Juli and 1 Agustus land where
 * they actually fall in that span rather than where a quarter-marker would be.
 */
const AXIS_Y = 46;
const TIME_5M = [
  { label: "09.00", t: 0 },
  { label: "10.00", t: 1 / 3 },
  { label: "11.00", t: 2 / 3 },
  { label: "12.00", t: 1 },
];
const TIME_1D = [
  { label: "1 Jul", t: 0 },
  { label: "15 Jul", t: 14 / 45 },
  { label: "1 Agu", t: 31 / 45 },
  { label: "15 Agu", t: 1 },
];
/**
 * THE HIGHLIGHT BOX AND THE DROP OFF THE HIGHER LOW.
 *
 * `height` is a fraction of the plot's own height and is FIXED — the box is
 * this short from the frame it first appears on and never changes size. `drop`
 * is how far the leader off the higher low continues past the box's bottom
 * edge, and `labelDy` is the gap from that end to the name.
 */
const HILITE = { height: 0.5, drop: 30, labelDy: 30 };
const BOX_H = (BOX.h - 20) * HILITE.height;
const BOX_Y = BOX.y + 10 + (BOX.h - 20 - BOX_H) / 2;
const DROP_END = BOX_Y + BOX_H + HILITE.drop;
// ═══════════════════════════════════════════════════════════════════════════

const HL = TIMEFRAME.turns[TF_HIGHER_LOW];

/** One row of time labels under the plot. */
const TimeAxis = ({
  marks,
  opacity,
}: {
  marks: { label: string; t: number }[];
  opacity: number;
}) => {
  if (opacity <= 0.001) return null;
  return (
    <Layer opacity={opacity}>
      {marks.map((m, i) => (
        <text
          key={m.label}
          x={BOX.x + BOX.w * m.t}
          y={BOX.y + BOX.h + AXIS_Y}
          textAnchor={
            i === 0 ? "start" : i === marks.length - 1 ? "end" : "middle"
          }
          fontFamily={theme.text.family}
          fontSize={theme.text.axis.size}
          fontWeight={theme.text.axis.weight}
          fill={theme.color.slate}
        >
          {m.label}
        </text>
      ))}
    </Layer>
  );
};

export const Scene16 = () => {
  const f = useCurrentFrame();
  const card = fadeIn(f, T.card, 20);
  const out = f >= T.out ? progress(f, T.out, OUT_OVER) : 0;

  // the window the card is showing, opening from the five-minute view
  const a = interpolate(out, [0, 1], [TF_WINDOW[0], 0]);
  const b = interpolate(out, [0, 1], [TF_WINDOW[1], 1]);
  const bars = candles(cut(TIMEFRAME, [a, b]), BAR_N, 71, 0.02);
  const grid = barGrid(bars, BOX, 0.14);
  const draw = progress(f, T.card + 6, 30);
  const note = f >= NOTE.out.at ? fadeOut(f, NOTE.out.at, NOTE.out.over) : 1;
  const lit = f >= T.out ? TF.to : TF.from;
  /**
   * The close-up's furniture leaves FASTER than the zoom, and the wide view's
   * arrives LATER, so the two never share the frame. The zoom runs on the
   * episode's front-loaded settle curve, which is already 40% done a tenth of
   * the way in — at a plain `1 - out` the two time axes were both legible at
   * once and printed "15" through "10.00".
   */
  const close = clamp01(1 - out * 2.5);
  const wide = clamp01((out - 0.6) * 2.5);

  // ── arriving on the rise CG-B left in flight ──
  const g = f + SCENE_FROM;
  const dy = cutIn(g, CUTS.toMistake);
  /** ...and leaving on the push into the app. */
  const push = cutPushOut(g, CUTS.toApp, 0.18);
  const breath = sceneBreath(f, BREATH.at, BREATH.over);
  const blur = Math.max(cutBlur(g, CUTS.toMistake), cutBlur(g, CUTS.toApp));

  /** The window's t mapped into the view, then onto the bar that holds it. */
  const at = (t: number) => (t - a) / Math.max(1e-6, b - a);
  const hlBar = Math.round(at(HL.t) * (BAR_N - 1));
  const hl = {
    x: grid.x(Math.max(0, Math.min(BAR_N - 1, hlBar))),
    y: grid.scale(bars[Math.max(0, Math.min(BAR_N - 1, hlBar))].l),
  };
  const highlight = {
    x1: BOX.x + BOX.w * at(TF_WINDOW[0]),
    x2: BOX.x + BOX.w * at(TF_WINDOW[1]),
  };

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px) scale(${push * breath})`,
          transformOrigin: LONG_ORIGIN,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        {/* rides the camera cut in, like the first line beside it */}
        {note > 0.001 && (
          <Img
            src={staticFile(FIGURE.src)}
            style={{
              position: "absolute",
              left: FIGURE.x,
              top: FIGURE.y,
              width: FIGURE.h * FIGURE.aspect,
              height: FIGURE.h,
              opacity: note,
              translate: "118.6px -32.1px",
            }}
          />
        )}

        {note > 0.001 &&
          NOTE_LINES.map((l, i) => {
            /* The first line has no fade of its own: the camera cut IS its
             entrance, and a line that also faded in would leave the cut
             landing on an empty frame. */
            const rev =
              i === 0 ? { opacity: 1, dy: 0 } : textReveal(f, i * NOTE.stagger);
            return (
              <div
                key={l.text}
                style={{
                  position: "absolute",
                  left: NOTE.x,
                  top: NOTE.y + i * NOTE.lead,
                  transform: `translateY(calc(-50% + ${rev.dy}px))`,
                  fontFamily: theme.text.family,
                  fontSize: NOTE.size,
                  fontWeight: NOTE.weight,
                  color: l.warn ? theme.color.warn : theme.color.ink,
                  opacity: rev.opacity * note,
                  whiteSpace: "nowrap",
                }}
              >
                {/* right:100% sets the glyph's right edge on the line's left
                  edge, so the hang is exact without measuring the font */}
                {l.hang && (
                  <span style={{ position: "absolute", right: "100%" }}>
                    {l.hang}
                  </span>
                )}
                {l.text}
              </div>
            );
          })}

        <Card opacity={card}>
          {/* the highlight rectangle — only meaningful once we are outside it */}
          {out > 0.25 && (
            <Layer opacity={Math.min(1, (out - 0.25) / 0.35)}>
              <rect
                x={highlight.x1}
                y={BOX_Y}
                width={Math.max(0, highlight.x2 - highlight.x1)}
                height={BOX_H}
                fill={theme.color.indigoWash}
                stroke={theme.color.indigo}
                strokeWidth={theme.shape.hairline}
                rx={10}
              />
            </Layer>
          )}

          <CandleChart
            bars={bars}
            box={BOX}
            reveal={draw}
            axis={false}
            pad={0.14}
          />

          {/* close up, the fall has a shape you can draw lines on */}
          {f >= T.worry && close > 0.001 && (
            <Layer opacity={progress(f, T.worry, 24) * close}>
              {TREND_5M.map((t, i) => (
                <line
                  key={i}
                  x1={BOX.x + BOX.w * t.x1}
                  y1={BOX.y + BOX.h * t.y1}
                  x2={BOX.x + BOX.w * t.x2}
                  y2={BOX.y + BOX.h * t.y2}
                  stroke={theme.color.indigo}
                  strokeWidth={theme.shape.rule}
                  strokeLinecap="round"
                />
              ))}
            </Layer>
          )}

          {/* from further back it is a higher low inside a climb. The drop hangs
            it below the box rather than tucking the name under the bar, where
            the neighbouring candles were reading through it. */}
          {out > 0.7 && f >= T.higherLow && (
            <>
              <Layer opacity={progress(f, T.higherLow, 20)}>
                <circle cx={hl.x} cy={hl.y} r={7} fill={theme.color.cyan} />
                <line
                  x1={hl.x}
                  y1={hl.y}
                  x2={hl.x}
                  y2={DROP_END}
                  stroke={theme.color.cyan}
                  strokeWidth={theme.shape.rule}
                />
              </Layer>
              <Chip
                label="Higher low"
                x={hl.x}
                y={DROP_END + HILITE.labelDy}
                tone="cyan"
                size={theme.text.tag.size}
                at={T.higherLow + 6}
              />
            </>
          )}

          {/* the clock the close-up runs on, then the calendar it turns into */}
          <TimeAxis
            marks={TIME_5M}
            opacity={fadeIn(f, T.fiveMinute, 20) * close}
          />
          <TimeAxis marks={TIME_1D} opacity={wide} />
        </Card>

        {/* the timeframe row — the lit one is the card's own tab */}
        {TF.options.map((label, i) => (
          <Chip
            key={label}
            label={label}
            x={TF.x + i * TF.gap}
            y={TF.y}
            tone={i === lit ? "indigo" : "slate"}
            pill={i === lit}
            size={theme.text.tag.size}
            at={T.fiveMinute}
            opacity={card}
          />
        ))}
      </div>
    </Stage>
  );
};
