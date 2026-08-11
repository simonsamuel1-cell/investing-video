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
 * IT DOES NOT START FROM NOTHING. Frame 1450 is SC03's chart, unchanged and
 * whole. The mechanism is not drawn onto an empty card — SC03's line TRANSFORMS
 * into it, left to right, on the same beats the drawing used to run on. That is
 * the honest picture: the mechanism is not a new shape, it is the shape the
 * previous scene was pointing at, seen close up.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { Reference } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { hold, progress, progressInOut } from "../helpers";
import { plot } from "../data/shape";
import { MECHANISM } from "../data/shapes";
import { morph, morphPoints, morphFront, pathOf } from "../transitions/Morph";
import { HOOK_LINE } from "./Scene03";
import { STAIR_START } from "../continuity/StaircaseGroup";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  rise: 49, // "pembeli lebih agresif"
  pullback: 179, // "mengambil untung dan harga turun"
  floor: 332, // "pembeli masuk sebelum harga"
  newHigh: 442, // "puncak baru"
};
/** Keyed to the turns, so the line is always where the narration says it is. */
/**
 * The last leg lands 44 frames after "puncak baru" rather than 62, which frees
 * the tail of the scene for the handoff below. The beat itself is unchanged —
 * it is still keyed to the word, just less padded after it.
 */
const DRAW_AT = [T.rise, T.rise + 96, T.pullback, T.pullback + 92, T.newHigh, T.newHigh + 44];
const DRAW_TO = [0, 0.36, 0.36, 0.62, 0.62, 1];
const BOX = { x: theme.stage.plot.x, y: theme.stage.plot.y + 30, w: theme.stage.plot.w, h: theme.stage.plot.h - 100 };
const BRACKET_DX = 58;
/**
 * How soft the transformation front is, as a fraction of the line's width.
 * Too sharp and it reads as a wipe passing over the chart; too soft and the
 * whole line squirms at once and the left-to-right reading is lost.
 */
const MORPH_FRONT = 0.12;
/**
 * THE HANDOFF INTO SC05, at 1964/1965.
 *
 * CG-A's staircase is drawn in the SAME box as this line, so both lines begin
 * at the same point on the card. That point is the element: everything else
 * here clears over these frames, the origin dot is left alone on the card, and
 * on the very next frame the staircase's head dot IS that dot, growing away
 * from it. Nothing moves across the cut, which is what makes it read as one
 * continuous drawing rather than two scenes that happen to share a card.
 */
const EXIT = { at: 494, over: 20 };
// ═══════════════════════════════════════════════════════════════════════════

const P = plot(MECHANISM, BOX, { pad: 0.12 });
/** SC03's shape paired point-for-point with this one. Built once, at load. */
const MORPH = morph(HOOK_LINE, P.points, 260, MORPH_FRONT);
const LOW = P.turn(0); // the prior low the pullback must respect
const PEAK = P.turn(1);
const TROUGH = P.turn(2); // where the pullback actually stopped

export const Scene04 = () => {
  const f = useCurrentFrame();
  const draw = hold(f, DRAW_AT, DRAW_TO);
  const floor = f >= T.floor ? progress(f, T.floor, 30) : 0;
  const bracket = f >= T.floor + 20 ? progress(f, T.floor + 20, 24) : 0;
  const arrows = f >= T.floor + 34 ? progress(f, T.floor + 34, 30) : 0;

  // ── clearing the card for the element SC05 picks up ──
  const gone = f >= EXIT.at ? progressInOut(f, EXIT.at, EXIT.over) : 0;
  const stay = 1 - gone;

  // ── SC03's shape becoming this one, on the same beats the drawing used ──
  const shape = morphPoints(MORPH, draw);
  const front = morphFront(MORPH, draw);

  return (
    <Stage>
      <Card>
        {/* the one thing that survives into SC05 — and it never moves */}
        {gone > 0.001 && (
          <Layer>
            <circle cx={STAIR_START.x} cy={STAIR_START.y} r={theme.shape.line + 2} fill={theme.color.ink} />
          </Layer>
        )}

        <Reference x1={LOW.x} x2={BOX.x + BOX.w} y={LOW.y} draw={floor * stay} label="Titik terendah sebelumnya" />

        {/* The line is ALWAYS whole — what advances is the transformation, not a
            trim path. At draw 0 this is SC03's chart down to the pixel. */}
        <Layer opacity={stay}>
          <path d={pathOf(shape)} fill="none" stroke={theme.color.ink} strokeWidth={theme.shape.line} strokeLinecap="round" strokeLinejoin="round" />
          {draw > 0.001 && draw < 0.999 && <circle cx={front.x} cy={front.y} r={theme.shape.line + 2} fill={theme.color.ink} />}
        </Layer>

        {/* the turns are only real once the front has passed them */}
        {draw >= 0.34 && <PivotLabel x={PEAK.x} y={PEAK.y} label="Puncak 1" tone="indigo" at={T.rise + 86} opacity={stay} />}
        {draw >= 0.99 && (
          <PivotLabel x={P.turn(3).x} y={P.turn(3).y} label="Puncak baru" tone="indigo" side="above" at={T.newHigh + 38} opacity={stay} />
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
        {arrows > 0.4 && <Chip label="Pembeli masuk" x={TROUGH.x} y={LOW.y + 74} tone="indigo" at={T.floor + 44} opacity={stay} />}
      </Card>
    </Stage>
  );
};
