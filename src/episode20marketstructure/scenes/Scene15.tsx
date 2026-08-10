/**
 * SC15 — Lower-low confirmation. Renders INSIDE CG-B.
 *
 * `f` is GROUP-local. SC15 owns 493…814, so its beats are the spec's L + 493.
 *
 * The freeze is literal: the group's draw schedule holds the SAME value across
 * SC14's last frame and SC15's first, so no path is re-issued and nothing
 * re-animates. Price resumes only when "menembus lembah sebelumnya" lands.
 */
import { Reference } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, clamp01 } from "../helpers";
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
// ═══════════════════════════════════════════════════════════════════════════

export const Scene15 = ({ f, p, draw, plotRight }: { f: number; p: Plot; draw: number; plotRight: number }) => {
  const priorLow = p.turn(FAIL_PRIOR_LOW);
  const stalled = p.turn(FAIL_STALL);
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
      {f >= SC15.wary && f < SC15.flip + 30 && <Chip label="Waspada" x={stalled.x - 154} y={stalled.y - 48} tone="slate" at={SC15.wary} />}

      {draw >= 0.79 && <PivotLabel x={p.turn(FAIL_LOWER_LOW).x} y={p.turn(FAIL_LOWER_LOW).y} label="Lower Low" tone="cyan" side="below" at={SC15.breakLow + 50} />}

      {/* the state, turned over on the word that changes it */}
      <div
        style={{
          position: "absolute",
          left: STATE.x,
          top: STATE.y,
          transform: `translate(0, -50%) rotateY(${flip * 180}deg)`,
          transformStyle: "preserve-3d",
          padding: "8px 20px",
          borderRadius: theme.shape.chipRadius,
          background: flipped ? theme.color.cyanPale : theme.color.indigoPale,
          border: `${theme.shape.hairline}px solid ${flipped ? theme.color.cyan : theme.color.indigo}`,
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
