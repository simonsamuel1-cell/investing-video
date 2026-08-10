/**
 * SC15 — Lower-low confirmation. Renders INSIDE CG-B.
 *
 * `f` is GROUP-local; SC15 owns 493…814, so its beats are the spec's L + 493.
 *
 * The freeze is literal: the group's draw keyframes hold the SAME value across
 * SC14's last frame and SC15's first, so no path is re-issued and nothing
 * re-animates. Only when "menembus lembah sebelumnya" lands does price resume.
 */
import { ReferenceLine } from "../components/StructureLine";
import { PivotLabel } from "../components/PivotLabel";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, clamp01 } from "../helpers";
import { FAIL_PRIOR_LOW, FAIL_PEAK, FAIL_LL, type Geom } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Group-local frame where SC15 begins (global 7344). */
export const SC15_FROM = 493;
const B = (l: number) => l + SC15_FROM;
export const SC15 = {
  wary: B(0), // "belum otomatis berarti tren berbalik"
  breakLow: B(170), // "menembus lembah sebelumnya"
  flip: B(243), // "downtrend"
};
/** Where the structure's state is stated — one place, one value, throughout. */
const STATE = { x: theme.frame.card.x + 56, y: theme.frame.card.y + 56 };
// ═══════════════════════════════════════════════════════════════════════════

export const Scene15 = ({ f, g, draw, boxRight }: { f: number; g: Geom; draw: number; boxRight: number }) => {
  const low = g.pivot(FAIL_PRIOR_LOW);
  const peak = g.pivot(FAIL_PEAK);
  const ll = g.pivot(FAIL_LL);

  const flip = f >= SC15.flip ? progress(f, SC15.flip, 26) : 0;
  const flipped = flip > 0.5;

  return (
    <>
      {/* the trough SC15 has to break — drawn only when it starts to matter */}
      {f >= SC15.breakLow - 40 && (
        <ReferenceLine
          x1={low.x}
          x2={boxRight}
          y={low.y}
          draw={progress(f, SC15.breakLow - 40, 26)}
          color={theme.colors.cyan}
          pierce={{ x: g.headAt(0.72).x, amount: f >= SC15.breakLow ? clamp01((f - SC15.breakLow) / 30) : 0 }}
        />
      )}

      {/* one lower high is a reason to watch, not to conclude */}
      {f >= SC15.wary && f < SC15.flip + 30 && <Chip label="Waspada" x={peak.x - 150} y={peak.y - 46} variant="slate" startFrame={SC15.wary} />}

      {draw >= 0.79 && <PivotLabel x={ll.x} y={ll.y} label="Lower Low" variant="cyan" side="below" startFrame={SC15.breakLow + 50} />}

      {/* the state, turned over on the word that changes it */}
      <div
        style={{
          position: "absolute",
          left: STATE.x,
          top: STATE.y,
          transform: `translate(0, -50%) rotateY(${flip * 180}deg)`,
          transformStyle: "preserve-3d",
          padding: "8px 20px",
          borderRadius: theme.radius.chip,
          background: flipped ? theme.colors.cyanSoft : theme.colors.indigoSoft,
          border: `${theme.stroke.hair}px solid ${flipped ? theme.colors.cyan : theme.colors.indigo}`,
          color: flipped ? theme.colors.cyan : theme.colors.indigo,
          fontFamily: theme.type.family,
          fontSize: theme.type.chip.size,
          fontWeight: theme.type.chip.weight,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ display: "inline-block", transform: flipped ? "rotateY(180deg)" : undefined }}>{flipped ? "Downtrend" : "Uptrend"}</span>
      </div>
    </>
  );
};
