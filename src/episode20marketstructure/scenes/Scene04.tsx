/**
 * SC04 — Why the shape forms (from 1450, dur 515).
 *
 * The mechanism, drawn once and slowly. The pullback stops ABOVE the last low
 * because interest is still there, and that "above" is the entire scene — so it
 * is MEASURED on screen: a dashed line at the prior low, and a cyan bracket
 * spanning the gap the pullback never closed.
 *
 * The line pauses between legs rather than running at one speed. Each leg is a
 * different decision, and the pause is where the narration explains it.
 *
 * It does not start from nothing. SC03's line wound itself back into a single
 * dot; that dot is still on screen on frame 0, travels to where THIS line
 * begins, and the line grows out of it. The card never left, so the only thing
 * that changes across the cut is the one element being handed over.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { Reference } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { hold, progress, progressInOut, fadeOut } from "../helpers";
import { STAIR, STAIR_BOX, STEP_TURN, zoomIn, clipRight, measure, pathOf, CLIP_X } from "../data/staircaseView";
import { HANDOFF_FROM } from "./Scene03";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  rise: 49, // "pembeli lebih agresif"
  pullback: 179, // "mengambil untung dan harga turun"
  floor: 332, // "pembeli masuk sebelum harga"
  newHigh: 442, // "puncak baru"
};
/**
 * Keyed to the turns, so the line is always where the narration says it is.
 * The last leg lands 44 frames after "puncak baru" rather than 62, which frees
 * the tail of the scene for the annotations to clear. The beat is unchanged —
 * still keyed to the word, just less padded after it.
 */
const DRAW_AT = [T.rise, T.rise + 96, T.pullback, T.pullback + 92, T.newHigh, T.newHigh + 44];
const BOX = STAIR_BOX;
const BRACKET_DX = 58;
/**
 * The handed-over dot travels for these frames and then waits, still, until the
 * line starts drawing at T.rise. The wait matters: it is what makes the line
 * look like it came OUT of the dot rather than past it.
 */
const HANDOFF_OVER = 40;
/**
 * THE HANDOFF INTO SC05, at 1964/1965.
 *
 * Only the ANNOTATIONS clear here — the measurements, the arrows, the names.
 * The line itself stays whole to the last frame, because CG-A opens on it and
 * transforms it into the staircase. SC05's picture is this one repeated, so a
 * card that emptied and started over would be arguing against the script.
 */
const EXIT = { at: 494, over: 20 };
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THIS SCENE IS A CROP. The line is CG-A's staircase, magnified until its first
 * step fills the card and cut off at the card's right edge — so the mechanism
 * being explained here is literally the same drawing SC05 pulls back to show,
 * not a second shape that resembles it.
 */
const CURVE = clipRight(STAIR.points.map(zoomIn), CLIP_X);
const M = measure(CURVE);
/** Where this line begins — the incoming dot's destination. */
const START = CURVE[0];
const LOW = zoomIn(STAIR.turn(0)); // the prior low the pullback must respect
const PEAK = zoomIn(STAIR.turn(1));
const TROUGH = zoomIn(STAIR.turn(2)); // where the pullback actually stopped
const NEW_PEAK = zoomIn(STAIR.turn(STEP_TURN));
/** The trim targets, read off the crop rather than typed as round numbers. */
const DRAW_TO = [0, M.fractionAtX(PEAK.x), M.fractionAtX(PEAK.x), M.fractionAtX(TROUGH.x), M.fractionAtX(TROUGH.x), 1];

export const Scene04 = () => {
  const f = useCurrentFrame();
  const draw = hold(f, DRAW_AT, DRAW_TO);
  const floor = f >= T.floor ? progress(f, T.floor, 30) : 0;
  const bracket = f >= T.floor + 20 ? progress(f, T.floor + 20, 24) : 0;
  const arrows = f >= T.floor + 34 ? progress(f, T.floor + 34, 30) : 0;

  // ── the element handed over from SC03 ──
  const travel = progressInOut(f, 0, HANDOFF_OVER);
  const seed = { x: HANDOFF_FROM.x + (START.x - HANDOFF_FROM.x) * travel, y: HANDOFF_FROM.y + (START.y - HANDOFF_FROM.y) * travel };
  // it hands over to the line, so it leaves as the line leaves it
  const seedOut = f >= T.rise ? fadeOut(f, T.rise, 22) : 1;

  // ── clearing the card for the element SC05 picks up ──
  const gone = f >= EXIT.at ? progressInOut(f, EXIT.at, EXIT.over) : 0;
  const stay = 1 - gone;

  return (
    <Stage>
      <Card>
        {seedOut > 0.001 && (
          <Layer opacity={seedOut}>
            <circle cx={seed.x} cy={seed.y} r={9} fill={theme.color.indigo} />
          </Layer>
        )}

        <Reference x1={LOW.x} x2={BOX.x + BOX.w} y={LOW.y} draw={floor * stay} label="Titik terendah sebelumnya" />

        {/* The line does NOT fade with the annotations — SC05 pulls back from
            it. Clipped to the card, because a crop runs off the edge. */}
        <Layer clip={theme.stage.card}>
          <path
            d={pathOf(CURVE)}
            fill="none"
            stroke={theme.color.ink}
            strokeWidth={theme.shape.line}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={M.length}
            strokeDashoffset={M.length * (1 - draw)}
          />
          {draw > 0.001 && draw < 0.999 && <circle cx={M.at(draw).x} cy={M.at(draw).y} r={theme.shape.line + 2} fill={theme.color.ink} />}
        </Layer>

        {draw >= DRAW_TO[1] - 0.01 && <PivotLabel x={PEAK.x} y={PEAK.y} label="Puncak 1" tone="indigo" at={T.rise + 86} opacity={stay} />}
        {draw >= 0.99 && (
          <PivotLabel x={NEW_PEAK.x} y={NEW_PEAK.y} label="Puncak baru" tone="indigo" side="above" at={T.newHigh + 38} opacity={stay} />
        )}

        {/* Parked over the DESCENT, not over the peak. Reading its height from
            the peak put it level with "Puncak 1", and the two ran together into
            one phrase; halfway down the pullback it is unmistakably its own
            label, and still clear of the line it describes. */}
        {draw >= 0.6 && (
          <Chip
            label="Ambil untung"
            x={(PEAK.x + TROUGH.x) / 2 + 40}
            y={(PEAK.y + TROUGH.y) / 2 - 46}
            tone="slate"
            at={T.pullback + 70}
            opacity={stay}
          />
        )}

        {/* the gap the pullback left — measured, not asserted */}
        {bracket * stay > 0.001 && (
          <Layer opacity={bracket * stay}>
            <g stroke={theme.color.cyan} strokeWidth={theme.shape.rule} fill="none">
              <line x1={TROUGH.x + BRACKET_DX} y1={TROUGH.y} x2={TROUGH.x + BRACKET_DX} y2={LOW.y} />
              <line x1={TROUGH.x + BRACKET_DX - 12} y1={TROUGH.y} x2={TROUGH.x + BRACKET_DX + 12} y2={TROUGH.y} />
              <line x1={TROUGH.x + BRACKET_DX - 12} y1={LOW.y} x2={TROUGH.x + BRACKET_DX + 12} y2={LOW.y} />
            </g>
          </Layer>
        )}

        {/* buyers stepping in under the trough — descriptive, never an entry */}
        {arrows * stay > 0.001 && (
          <Layer opacity={stay}>
            {[0, 1, 2].map((i) => {
              const a = Math.max(0, Math.min(1, arrows * 3 - i));
              const y = TROUGH.y + 80 - 22 * a;
              const x = TROUGH.x - 34 + i * 34;
              return <polygon key={i} points={`${x},${y} ${x - 11},${y + 18} ${x + 11},${y + 18}`} fill={theme.color.indigo} opacity={a * 0.9} />;
            })}
          </Layer>
        )}
        {/* below the prior-low line, never across it */}
        {arrows > 0.4 && <Chip label="Pembeli masuk" x={TROUGH.x} y={LOW.y + 52} tone="indigo" at={T.floor + 44} opacity={stay} />}
      </Card>
    </Stage>
  );
};
