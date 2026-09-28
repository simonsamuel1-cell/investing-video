/**
 * CG-B — SC14 + SC15 as ONE spanning Sequence (global 6851 → 7666, dur 815).
 *
 * The line is mounted ONCE, here, and both halves annotate it. SC14 draws up to
 * the push that fails; the schedule then HOLDS the same value across the
 * boundary, so the freeze SC15 opens on is literal — no path is re-issued and
 * nothing re-animates under the narration. SC15 resumes the identical path when
 * its beat lands.
 *
 * Mounting either half as its own scene would remount the chart and restart the
 * line, which would quietly undo the argument these two scenes make together.
 *
 * IT OPENS ON THE QUESTION, 6851 → 6940. The narration asks how you see an
 * uptrend losing power; the frame asks it back, in words, with nothing else on
 * it. The chart only arrives once the question has been put — so the trace
 * starts after the title leaves rather than running underneath it.
 */
import { useContext } from "react";
import { useCurrentFrame } from "remotion";
import { OutputClock } from "../clock";
import { Layer } from "../components/Stage";
import { Stage, Card } from "../components/Stage";
import { StructureLine } from "../components/StructureLine";
import { Scene14, SC14 } from "../scenes/Scene14";
import { Scene15, SC15 } from "../scenes/Scene15";
import { theme } from "../theme";
import { hold, progress, progressInOut } from "../helpers";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";
import { sceneBreath, LONG_ORIGIN } from "../transitions/Breath";
import { plot } from "../data/shape";
import { FAILURE, FAIL_STOP_T, FAIL_LAST_HH, FAIL_STALL, FAIL_LOWER_LOW } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const BOX = {
  x: theme.stage.plot.x,
  y: theme.stage.plot.y + 30,
  w: theme.stage.plot.w,
  h: theme.stage.plot.h - 100,
};
/**
 * THE OPENING QUESTION.
 *
 * `TITLE.out` is 90 = 6941, so the card holds the frame to itself through 6940
 * exactly. The chart then fades up and the line starts tracing; `SC14.reference`
 * was moved back to match, and its comment says why.
 */
const TITLE = {
  text: "Q: Kapan Uptrend Melemah?",
  /** "Q:" reads as the label on the question, so it carries the accent. */
  lead: "Q:",
  y: 520,
  size: 76,
  weight: 800,
  out: 90,
  over: 14,
};
const CHART_IN = { at: 92, over: 16 };
const TRACE_FROM = 100;
/** This group's `from` in the Composition — needed to read the shared cut. */
const GROUP_FROM = 6851;
/** One slow breath over the card, starting once the title has cleared. */
const BREATH = { at: 120, over: 620 };
/**
 * ⚠ UNDER EXTENDED PART 03, TWO ARROWS. The film holds SC15's last still frame
 * while the passage says "Kita bukan cuma melihat apakah harga naik atau
 * turun", and Simon: "8393, kasih panah diagonal naik dan panah diagonal
 * turun, tempatkan yang bener ya". OUTPUT frame (clock.ts). Each arrow lies
 * along the leg it names, measured off the line's own turns, and sits `offset`
 * px beneath it in the empty card — the rise from the first low to the last
 * higher high (indigo, as "Uptrend" is), the fall from the failed high to the
 * lower low (cyan, as "Downtrend" is).
 */
const ARROWS = {
  at: 8393,
  over: 20,
  stroke: 8,
  head: { length: 34, width: 34 },
  up: { from: 0, to: FAIL_LAST_HH, offset: 130, length: 360 },
  /** Shorter, so its head stays clear of the "Lower low" label beside it. */
  down: { from: FAIL_STALL, to: FAIL_LOWER_LOW, offset: 130, length: 230 },
};
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(FAILURE, BOX, { pad: 0.12 });

/** An arrow parallel to the leg between two turns, `offset` px beneath it and centred on it. */
const legArrow = (leg: { from: number; to: number; offset: number; length: number }) => {
  const a = P.turn(leg.from);
  const b = P.turn(leg.to);
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  /** The normal that points DOWN the frame, whichever way the leg runs. */
  const down = ux >= 0 ? 1 : -1;
  const nx = -uy * down;
  const ny = ux * down;
  const mx = (a.x + b.x) / 2 + nx * leg.offset;
  const my = (a.y + b.y) / 2 + ny * leg.offset;
  return {
    x1: mx - (ux * leg.length) / 2,
    y1: my - (uy * leg.length) / 2,
    ux,
    uy,
  };
};
const UP = legArrow(ARROWS.up);
const DOWN = legArrow(ARROWS.down);

/** Drawn on from its tail, the head riding the tip. */
const Arrow = ({ a, length, grow, color }: { a: ReturnType<typeof legArrow>; length: number; grow: number; color: string }) => {
  if (grow <= 0.001) return null;
  const h = ARROWS.head;
  const tipX = a.x1 + a.ux * length * grow;
  const tipY = a.y1 + a.uy * length * grow;
  const baseX = tipX - a.ux * h.length;
  const baseY = tipY - a.uy * h.length;
  const px = -a.uy * (h.width / 2);
  const py = a.ux * (h.width / 2);
  return (
    <g opacity={Math.min(1, grow * 3)}>
      <line x1={a.x1} y1={a.y1} x2={baseX} y2={baseY} stroke={color} strokeWidth={ARROWS.stroke} strokeLinecap="round" />
      <polygon points={`${tipX},${tipY} ${baseX + px},${baseY + py} ${baseX - px},${baseY - py}`} fill={color} strokeLinejoin="round" stroke={color} strokeWidth={4} />
    </g>
  );
};
/** Where the draw stops: exactly on the failed peak, measured along the line. */
const STOP = P.reaches(FAIL_STOP_T);

/** The flat stretch between `SC14.stall` and `SC15.breakLow` IS the freeze. */
const DRAW_AT = [
  TRACE_FROM,
  SC14.reference,
  SC14.push,
  SC14.stall,
  SC15.breakLow,
  SC15.breakLow + 62,
  SC15.flip + 40,
];
const DRAW_TO = [0, 0.44, 0.44, STOP, STOP, 0.8, 1];

export const FailedPeakGroup = () => {
  const f = useCurrentFrame();
  const out = useContext(OutputClock);
  const arrows = out !== null && out >= ARROWS.at ? progress(out, ARROWS.at, ARROWS.over) : 0;
  const draw = hold(f, DRAW_AT, DRAW_TO);
  const gone = f >= TITLE.out ? progressInOut(f, TITLE.out, TITLE.over) : 0;
  const chart =
    f >= CHART_IN.at ? progressInOut(f, CHART_IN.at, CHART_IN.over) : 0;

  // ── arriving on the rise SC13 left in flight, leaving on the next one ──
  const g = f + GROUP_FROM;
  /** The two moves are 800 frames apart, so only one is ever non-zero. */
  const dy = cutIn(g, CUTS.toQuestion) + cutOut(g, CUTS.toMistake);
  const breath = sceneBreath(f, BREATH.at, BREATH.over);
  const blur = Math.max(cutBlur(g, CUTS.toQuestion), cutBlur(g, CUTS.toMistake));

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px) scale(${breath})`,
          transformOrigin: LONG_ORIGIN,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        {gone < 0.999 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: TITLE.y,
              width: theme.canvas.width,
              transform: "translateY(-50%)",
              textAlign: "center",
              fontFamily: theme.text.family,
              fontSize: TITLE.size,
              fontWeight: TITLE.weight,
              color: theme.color.ink,
              /* No fade-and-rise of its own: the camera cut IS this title's
                 entrance, and type that also faded in would leave the cut
                 landing on an empty frame — which is the one thing a cut
                 cannot do. */
              opacity: 1 - gone,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: theme.color.indigo }}>{TITLE.lead}</span>
            {TITLE.text.slice(TITLE.lead.length)}
          </div>
        )}

        {chart > 0.001 && (
          <div style={{ position: "absolute", inset: 0, opacity: chart }}>
            <Card>
              <Scene14 f={f} p={P} plotRight={BOX.x + BOX.w} />
              <StructureLine plot={P} draw={draw} head />
              <Scene15 f={f} p={P} draw={draw} plotRight={BOX.x + BOX.w} />
              {arrows > 0.001 && (
                <Layer>
                  <Arrow a={UP} length={ARROWS.up.length} grow={arrows} color={theme.color.indigo} />
                  <Arrow a={DOWN} length={ARROWS.down.length} grow={arrows} color={theme.color.cyan} />
                </Layer>
              )}
            </Card>
          </div>
        )}
      </div>
    </Stage>
  );
};
