/**
 * SC15 — Lower-low confirmation. Renders INSIDE CG-B.
 *
 * `f` is GROUP-local. SC15 owns 493…814, so its beats are the spec's L + 493.
 *
 * The freeze is literal: the group's draw schedule holds the SAME value across
 * SC14's last frame and SC15's first, so no path is re-issued and nothing
 * re-animates. Price resumes only when "menembus lembah sebelumnya" lands.
 */
import { Layer } from "../components/Stage";
import { Reference } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { LEADER_ARROW } from "./Scene14";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, fadeOut, clamp01 } from "../helpers";
import type { Plot } from "../data/shape";
import { FAIL_PRIOR_LOW, FAIL_STALL, FAIL_LOWER_LOW } from "../data/shapes";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Group-local frame where SC15 begins (global 7344). */
export const SC15_FROM = 493;
const at = (l: number) => l + SC15_FROM;
export const SC15 = {
  wary: at(0), // "belum otomatis berarti tren berbalik"
  breakLow: at(170), // "menembus lembah sebelumnya"
  flip: at(243), // "downtrend"
};
/** Where the structure's state is stated — one place, one value, throughout. */
const STATE = { x: theme.stage.card.x + 56, y: theme.stage.card.y + 56 };
/**
 * "Mulai waspada", under the peak that failed. Two lines rather than one so it
 * reads as an aside next to the drop line, not as a second heading competing
 * with "Gagal HH" above it.
 *
 * It hangs off the SAME peak on a line of its own, mirroring SC14's mark
 * downward: one point, two readings, each on its own leader. `labelDy` is the
 * gap between the end of that leader and the first line, and matches SC14's so
 * the two halves are built the same way.
 */
const WARY = { lines: ["Mulai", "waspada"], dy: 150, lead: 44, labelDy: 30, outOver: 30 };
// ═══════════════════════════════════════════════════════════════════════════

export const Scene15 = ({ f, p, draw, plotRight }: { f: number; p: Plot; draw: number; plotRight: number }) => {
  const priorLow = p.turn(FAIL_PRIOR_LOW);
  const stalled = p.turn(FAIL_STALL);
  const wary = f >= SC15.wary ? progress(f, SC15.wary, 20) : 0;
  const waryEnd = stalled.y + (WARY.dy - WARY.labelDy) * wary;
  /**
   * It leaves ON the flip, and by fading rather than by being cut. Once the
   * structure has actually turned over, "start watching" is no longer the
   * reading — but it was true a moment ago, so it dissolves out of the frame
   * instead of being deleted from it.
   */
  const waryShown = wary * (f >= SC15.flip ? fadeOut(f, SC15.flip, WARY.outOver) : 1);
  const flip = f >= SC15.flip ? progress(f, SC15.flip, 26) : 0;
  const flipped = flip > 0.5;

  return (
    <>
      {/* the trough SC15 has to break — drawn only when it starts to matter */}
      {f >= SC15.breakLow - 40 && (
        <Reference
          x1={priorLow.x}
          x2={plotRight}
          y={priorLow.y}
          draw={progress(f, SC15.breakLow - 40, 26)}
          color={theme.color.cyan}
          pierce={{ x: p.along(0.72).x, amount: f >= SC15.breakLow ? clamp01((f - SC15.breakLow) / 30) : 0 }}
        />
      )}

      {/* one lower high is a reason to watch, not to conclude */}
      {waryShown > 0.001 && (
        <>
          {/* indigo, matching the leader above it: the two are one mark through
            a single point, so they cannot be two colours — the slate stays on
            the label, which is the muted part */}
          <Layer opacity={waryShown}>
            <line x1={stalled.x} y1={stalled.y} x2={stalled.x} y2={waryEnd} stroke={theme.color.indigo} strokeWidth={theme.shape.rule} />
            <polygon
              points={`${stalled.x},${waryEnd} ${stalled.x - LEADER_ARROW.w / 2},${waryEnd - LEADER_ARROW.h} ${stalled.x + LEADER_ARROW.w / 2},${waryEnd - LEADER_ARROW.h}`}
              fill={theme.color.indigo}
            />
          </Layer>
          {WARY.lines.map((line, i) => (
            <Chip
              key={line}
              label={line}
              x={stalled.x}
              y={stalled.y + WARY.dy + i * WARY.lead}
              tone="slate"
              size={theme.text.tag.size}
              at={SC15.wary + 10 + i * 4}
              opacity={waryShown}
            />
          ))}
        </>
      )}

      {draw >= 0.79 && <PivotLabel x={p.turn(FAIL_LOWER_LOW).x} y={p.turn(FAIL_LOWER_LOW).y} label="Lower low" tone="cyan" side="below" at={SC15.breakLow + 50} />}

      {/* the state, turned over on the word that changes it */}
      <div
        style={{
          position: "absolute",
          left: STATE.x,
          top: STATE.y,
          transform: `translate(0, -50%) rotateY(${flip * 180}deg)`,
          transformStyle: "preserve-3d",
          color: flipped ? theme.color.cyan : theme.color.indigo,
          fontFamily: theme.text.family,
          fontSize: theme.text.chip.size,
          fontWeight: theme.text.chip.weight,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ display: "inline-block", transform: flipped ? "rotateY(180deg)" : undefined }}>{flipped ? "Downtrend" : "Uptrend"}</span>
      </div>
    </>
  );
};
