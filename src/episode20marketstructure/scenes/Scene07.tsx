/**
 * SC07 — Downtrend (from 3042, dur 466).
 *
 * The same argument inverted, drawn the same way, so SC19 can compare the two
 * shapes by eye. Peaks stay indigo and troughs stay cyan even though the trend
 * has flipped — the colours name the TURN, not the direction.
 *
 * IT DOES NOT START FROM NOTHING. Frame 3042 is CG-A's staircase, unchanged;
 * everything written on it has already cleared. The camera then PANS sideways,
 * the climb leaving to the left and the descent arriving from the right. Where
 * SC04→SC05 pulled back to show one chart from further away, this one travels
 * to a different chart — the move says "here is the other case", which is what
 * the narration says.
 *
 * The spec asked for a mirror wipe here. Wipes are not used as transitions in
 * these videos, and a pan makes the same point without an effect.
 *
 * The first turn of each kind is just the level — "Low", "High". Only the ones
 * after it can be called lower, because only they have something to be lower
 * than.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { PivotLabel } from "../components/PivotLabel";
import { StepLinks } from "../components/StepLink";
import { Chip } from "../components/Chip";
import { Title } from "../components/Text";
import { theme } from "../theme";
import { progress } from "../helpers";
import { peaksOf, troughsOf, plot } from "../data/shape";
import { STAIR, STAIR_BOX, clipRight, pathOf, CLIP_X } from "../data/staircaseView";
import { DESCENT } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  firstLow: 66, // the level everything after is measured against
  highs: 84, // "berhenti lebih rendah"
  lows: 206, // "titik terendah baru"
  shorten: 336, // "lower high dan lower low"
  title: 422, // "downtrend"
};
const BOX = STAIR_BOX;
const STEP = 46;
/**
 * THE PAN. One screen width, so the climb is completely off the card by the
 * time the descent is centred and the two are never both readable at once —
 * this is a move to another chart, not a comparison of two.
 */
const PAN = { over: 45, dx: theme.canvas.width };
/** The first of each kind is the level; the rest are lower than it. */
const PEAK_NAMES = ["High", "Lower high", "Lower high"];
const PEAK_SHORT = ["H", "LH", "LH"];
const TROUGH_NAMES = ["Low", "Lower low", "Lower low"];
const TROUGH_SHORT = ["L", "LL", "LL"];
/** Matching SC05: the label sits to the LEFT of its dot, height unchanged. */
const LABEL_GAP = 46;
const LABEL_DX = -10;
const LABEL_ANCHOR = "right" as const;
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(DESCENT, BOX, { pad: 0.12 });
const PEAKS = peaksOf(DESCENT);
const TROUGHS = troughsOf(DESCENT);
/** The staircase, in the framing CG-A left it in — the pan's starting view. */
const STAIR_LINE = clipRight(STAIR.points, CLIP_X);
const peakAt = (k: number) => T.highs + k * STEP;
const troughAt = (k: number) => (k === 0 ? T.firstLow : T.lows + (k - 1) * STEP);

export const Scene07 = () => {
  const f = useCurrentFrame();
  const pan = progress(f, 0, PAN.over);
  const camX = -PAN.dx * pan;
  const shorten = f >= T.shorten ? progress(f, T.shorten, 14) : 0;
  const press = f >= T.lows ? progress(f, T.lows, 28) : 0;
  const newLow = P.turn(TROUGHS[1]); // the low the sellers force

  return (
    <Stage>
      <Title text="Downtrend" at={T.title} />

      <Card>
        {/* both charts live in one world; the camera moves across it */}
        <Layer clip={theme.stage.card}>
          <g transform={`translate(${camX},0)`}>
            {pan < 0.999 && (
              <path
                d={pathOf(STAIR_LINE)}
                fill="none"
                stroke={theme.color.ink}
                strokeWidth={theme.shape.line}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <g transform={`translate(${PAN.dx},0)`}>
              <path
                d={pathOf(P.points)}
                fill="none"
                stroke={theme.color.ink}
                strokeWidth={theme.shape.line}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </Layer>

        <StepLinks
          f={f}
          opacity={1 - shorten}
          links={[
            ...PEAKS.slice(1).map((idx, k) => ({
              at: peakAt(k + 1),
              from: P.turn(PEAKS[k]),
              to: P.turn(idx),
              tone: theme.color.indigo,
              riseFirst: true,
            })),
            ...TROUGHS.slice(1).map((idx, k) => ({
              at: troughAt(k + 1),
              from: P.turn(TROUGHS[k]),
              to: P.turn(idx),
              tone: theme.color.cyan,
              riseFirst: false,
            })),
          ]}
        />

        {PEAKS.map((idx, k) => {
          const t = P.turn(idx);
          const at = peakAt(k);
          return (
            <React.Fragment key={`lh${idx}`}>
              {/* the dot is drawn once and stays; only the WORD crossfades */}
              <PivotLabel x={t.x} y={t.y} tone="indigo" at={at} />
              <Chip label={PEAK_NAMES[k]} x={t.x + LABEL_DX} y={t.y - LABEL_GAP} anchor={LABEL_ANCHOR} tone="indigo" at={at + 4} opacity={1 - shorten} />
              <Chip label={PEAK_SHORT[k]} x={t.x + LABEL_DX} y={t.y - LABEL_GAP} anchor={LABEL_ANCHOR} tone="indigo" at={T.shorten} opacity={shorten} />
            </React.Fragment>
          );
        })}

        {TROUGHS.map((idx, k) => {
          const t = P.turn(idx);
          const at = troughAt(k);
          return (
            <React.Fragment key={`ll${idx}`}>
              <PivotLabel x={t.x} y={t.y} tone="cyan" at={at} />
              <Chip label={TROUGH_NAMES[k]} x={t.x + LABEL_DX} y={t.y + LABEL_GAP} anchor={LABEL_ANCHOR} tone="cyan" at={at + 4} opacity={1 - shorten} />
              <Chip label={TROUGH_SHORT[k]} x={t.x + LABEL_DX} y={t.y + LABEL_GAP} anchor={LABEL_ANCHOR} tone="cyan" at={T.shorten} opacity={shorten} />
            </React.Fragment>
          );
        })}

        {/* sellers leaning on it — descriptive pressure, never an exit marker */}
        {press > 0.001 && (
          <Layer>
            {[0, 1, 2].map((i) => {
              const a = Math.max(0, Math.min(1, press * 3 - i));
              const y = newLow.y - 98 + 22 * a;
              const x = newLow.x - 34 + i * 34;
              return <polygon key={i} points={`${x},${y} ${x - 11},${y - 18} ${x + 11},${y - 18}`} fill={theme.color.slate} opacity={a * 0.9} />;
            })}
          </Layer>
        )}
        {/* down at the foot of the card, matching SC05's caption */}
        {press > 0.4 && (
          <Chip label="Penjual menekan" x={newLow.x} y={theme.stage.card.y + theme.stage.card.h - 50} tone="slate" at={T.lows + 12} />
        )}
      </Card>
    </Stage>
  );
};
