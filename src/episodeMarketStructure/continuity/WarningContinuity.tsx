/**
 * SC14 + SC15 — the warning, then the confirmation (global 6851 → 7666).
 *
 * One chart, mounted once. SC14 draws the uptrend up to the push that fails and
 * STOPS there — the line genuinely halts below the dashed reference, which is
 * the visual claim the narration makes. SC15 resumes the very same line from
 * the very same frame; nothing is redrawn.
 *
 * That stop is why these two are a continuity group rather than two scenes: a
 * remount would restart the line and quietly undo the argument.
 *
 * Frames are LOCAL. SC15's doc beats are its own L + 493.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { PriceLine } from "../components/PriceLine";
import { PivotMarker } from "../components/PivotMarker";
import { Level } from "../components/Level";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress } from "../helpers";
import { FAILURE, FAIL_LAST_HH, FAIL_PRIOR_LOW, FAIL_PEAK, FAIL_LL, FAIL_SC14_END, geom } from "../data/structures";
import { CARD, PLOT } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Local frame where SC15 begins (global 7344). */
const PHASE = 493;

const T = {
  // ── SC14 ──
  ref: 96, // "harga gagal"
  push: 189, // "puncak yang lebih tinggi"
  stall: 316, // "tidak mampu melewati"
  alert: 399, // "mulai melemah"
  // ── SC15 ──
  wary: PHASE, // "belum otomatis berarti tren berbalik"
  breakLow: PHASE + 170, // "menembus lembah sebelumnya"
  flip: PHASE + 243, // "downtrend"
};
const BOX = { x: PLOT.x, y: PLOT.y + 40, w: PLOT.w, h: PLOT.h - 120 };
/** Where the state chip lives — one place, one value, the whole way through. */
const STATE = { x: CARD.x + 56, y: CARD.y + 56 };
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(FAILURE, BOX, { pad: 0.12 });
const HH = G.pivot(FAIL_LAST_HH);
const LOW = G.pivot(FAIL_PRIOR_LOW);
const PEAK = G.pivot(FAIL_PEAK);
const LL = G.pivot(FAIL_LL);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** The line halts on the failed peak and waits there for the next scene. */
const DRAW_KEYS = [0, T.ref, T.push, T.stall, T.breakLow, T.breakLow + 62, T.flip + 40];
const DRAW_VALS = [0, 0.44, 0.44, FAIL_SC14_END, FAIL_SC14_END, 0.8, 1];

export const WarningContinuity = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const draw = interpolate(f, DRAW_KEYS, DRAW_VALS, { ...CLAMP, easing: theme.motion.ease });
  const ref = f >= T.ref ? progress(f, T.ref, 30) : 0;
  // buyers trying: two arrows that get smaller and fainter as the push stalls
  const effort = f >= T.push ? Math.max(0, 1 - progress(f, T.stall, 40)) * progress(f, T.push, 20) : 0;
  const alert = f >= T.alert ? progress(f, T.alert, 20) : 0;

  // the state chip turns over on its own axis — the one flip in the episode
  const flip = f >= T.flip ? progress(f, T.flip, 26) : 0;
  const flipped = flip > 0.5;
  const spin = `rotateY(${flip * 180}deg)`;

  return (
    <SafeArea>
      <ChartCard box={CARD}>
        {/* the last real higher high, extended right */}
        <Level x1={HH.x} x2={BOX.x + BOX.w} y={HH.y} draw={ref} variant="slate" label="Puncak terakhir" />
        {/* the trough SC15 has to break — drawn only when it matters */}
        {f >= T.breakLow - 40 && (
          <Level
            x1={LOW.x}
            x2={BOX.x + BOX.w}
            y={LOW.y}
            draw={progress(f, T.breakLow - 40, 26)}
            variant="cyan"
            pierce={{ x: G.headAt(0.72).x, amount: f >= T.breakLow ? Math.min(1, (f - T.breakLow) / 30) : 0 }}
          />
        )}

        <PriceLine g={G} draw={draw} color={pal.ink} width={3} head />

        {/* effort, fading: they tried and could not clear it */}
        {effort > 0.001 && (
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            {[0, 1].map((i) => {
              const s = 1 - i * 0.28;
              const x = PEAK.x - 70 + i * 46;
              const y = PEAK.y + 96 - i * 14;
              return (
                <polygon
                  key={i}
                  points={`${x},${y - 22 * s} ${x - 13 * s},${y} ${x + 13 * s},${y}`}
                  fill={pal.indigo}
                  opacity={effort * (1 - i * 0.35)}
                />
              );
            })}
          </svg>
        )}

        {/* the failed peak, marked once */}
        {alert > 0.001 && (
          <>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
              <path d={`M ${PEAK.x},${PEAK.y - 62} l 20,34 l -40,0 z`} fill="none" stroke={pal.indigo} strokeWidth={theme.stroke.rule} opacity={alert} />
              <line x1={PEAK.x} y1={PEAK.y - 50} x2={PEAK.x} y2={PEAK.y - 40} stroke={pal.indigo} strokeWidth={theme.stroke.rule} opacity={alert} />
            </svg>
            <Chip label="Gagal HH" x={PEAK.x + 130} y={PEAK.y - 46} variant="indigo" startFrame={T.alert + 8} />
          </>
        )}

        {/* SC15 — one lower high is a reason to watch, not to conclude */}
        {f >= T.wary && f < T.flip + 30 && <Chip label="Waspada" x={PEAK.x - 150} y={PEAK.y - 46} variant="slate" startFrame={T.wary} />}

        {draw >= 0.79 && <PivotMarker x={LL.x} y={LL.y} label="Lower Low" variant="cyan" side="below" startFrame={T.breakLow + 50} />}
      </ChartCard>

      {/* the structure's state, turned over on the word that changes it */}
      <div
        style={{
          position: "absolute",
          left: STATE.x,
          top: STATE.y,
          transform: `translate(0, -50%) ${spin}`,
          transformStyle: "preserve-3d",
          padding: "8px 20px",
          borderRadius: theme.radius.chip,
          background: flipped ? pal.cyanSoft : pal.indigoSoft,
          border: `${theme.stroke.hair}px solid ${flipped ? pal.cyan : pal.indigo}`,
          color: flipped ? pal.cyan : pal.indigo,
          fontFamily: theme.type.family,
          fontSize: theme.type.chip.size,
          fontWeight: theme.type.chip.weight,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ display: "inline-block", transform: flipped ? "rotateY(180deg)" : undefined }}>{flipped ? "Downtrend" : "Uptrend"}</span>
      </div>
    </SafeArea>
  );
};
