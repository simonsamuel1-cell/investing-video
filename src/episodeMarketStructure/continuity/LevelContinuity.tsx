/**
 * SC12 + SC13 — the same level, told from both sides (global 5855 → 6851).
 *
 * Mounted as one Sequence: the script's sentence runs across the boundary
 * ("…berikutnya. | Hal sebaliknya…"), and the two halves are one argument.
 *
 * This is the episode's callback to the Support & Resistance video, so the room
 * grammar is obeyed exactly: an INDIGO band is a floor, a CYAN band is a
 * ceiling. Neither scene draws a new band when price passes through — the SAME
 * band re-tints. That is the whole claim: one level, two stories, and nothing
 * about it changed except which side of it the price is standing on.
 *
 * Frames are LOCAL. SC13's doc beats are its own L + 496.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { PriceLine } from "../components/PriceLine";
import { PivotMarker } from "../components/PivotMarker";
import { Band } from "../components/Band";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress, fadeIn, fadeOut, textReveal } from "../helpers";
import { BREAK_UP, BREAK_UP_LEVEL, BREAK_UP_HL, BREAK_DOWN, BREAK_DOWN_LEVEL, BREAK_DOWN_LH, geom } from "../data/structures";
import { CARD, PLOT, CAPTION_Y } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Local frame where SC13 begins (global 6351). */
const PHASE = 496;

const T = {
  // ── SC12: ceiling becomes floor ──
  recall: 0, // "support dan resistance"
  breakout: 226, // "menembus resistance"
  retint: 280, // "lantai baru"
  retest: 366, // "kembali lalu memantul"
  hl: 419, // "higher low"
  // ── SC13: floor becomes ceiling ──
  breakdown: PHASE + 91, // "support ditembus"
  retint2: PHASE + 126, // "langit-langit baru"
  bounce: PHASE + 223, // "memantul ke sana"
  lh: PHASE + 276, // "lower high"
  paired: PHASE + 351, // "breakout dan perubahan struktur"
};
/** How thick the level reads on screen, in price units either side. */
const BAND_HALF = 55;
const BOX = { x: PLOT.x, y: PLOT.y + 40, w: PLOT.w, h: PLOT.h - 120 };
const HANDOVER = 30; // frames the two halves cross-fade over
/** Centre-y of the closing pair, over the dimmed chart. */
const PAIRED_Y = 510;
// ═══════════════════════════════════════════════════════════════════════════

const G_UP = geom(BREAK_UP, BOX, { pad: 0.12 });
const G_DN = geom(BREAK_DOWN, BOX, { pad: 0.12 });

/** Draw schedules, keyed so the line is always where the narration says. */
const UP_KEYS = [40, T.breakout, T.breakout + 64, T.retest, T.retest + 104];
const UP_VALS = [0, 0.5, 0.62, 0.72, 1];
const DN_KEYS = [PHASE + 20, T.breakdown, T.breakdown + 64, T.bounce, T.bounce + 104];
const DN_VALS = [0, 0.5, 0.62, 0.72, 1];

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const LevelContinuity = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  // The two halves hand over without a wipe: one fades down as the other rises.
  const sc12 = f >= PHASE - HANDOVER ? fadeOut(f, PHASE - HANDOVER, HANDOVER) : 1;
  const sc13 = f >= PHASE ? fadeIn(f, PHASE, HANDOVER) : 0;

  const drawUp = interpolate(f, UP_KEYS, UP_VALS, { ...CLAMP, easing: theme.motion.ease });
  const drawDn = interpolate(f, DN_KEYS, DN_VALS, { ...CLAMP, easing: theme.motion.ease });
  const retint = f >= T.retint ? progress(f, T.retint, 26) : 0;
  const retint2 = f >= T.retint2 ? progress(f, T.retint2, 26) : 0;

  // the pierce glow, at the x where price crosses the level
  const pierceUp = f >= T.breakout ? Math.max(0, Math.min(1, (f - T.breakout) / 34)) : 0;
  const pierceDn = f >= T.breakdown ? Math.max(0, Math.min(1, (f - T.breakdown) / 34)) : 0;

  const hlPoint = G_UP.pivot(BREAK_UP_HL);
  const lhPoint = G_DN.pivot(BREAK_DOWN_LH);
  const paired = f >= T.paired ? progress(f, T.paired, 26) : 0;
  const note = textReveal(f, T.retint + 40);

  return (
    <SafeArea>
      {/* ── SC12: the ceiling that becomes a floor ── */}
      {sc12 > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: sc12 * (1 - paired * 0.9) }}>
          <ChartCard box={CARD}>
            <Band
              x={BOX.x}
              w={BOX.w}
              yTop={G_UP.y(BREAK_UP_LEVEL + BAND_HALF)}
              yBottom={G_UP.y(BREAK_UP_LEVEL - BAND_HALF)}
              variant="cyan"
              variantTo="indigo"
              blend={retint}
              draw={f >= 30 ? progress(f, 30, 26) : 0}
            />
            {/* the label is the only thing that swaps outright */}
            <Chip label="Resistance" x={BOX.x + 24} y={G_UP.y(BREAK_UP_LEVEL) - 44} variant="cyan" anchor="left" startFrame={46} opacity={1 - retint} />
            <Chip label="Support" x={BOX.x + 24} y={G_UP.y(BREAK_UP_LEVEL) + 44} variant="indigo" anchor="left" startFrame={T.retint} opacity={retint} />

            {pierceUp > 0.001 && (
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
                <circle
                  cx={G_UP.x(0.52)}
                  cy={G_UP.y(BREAK_UP_LEVEL)}
                  r={12 + 40 * pierceUp}
                  fill="none"
                  stroke={pal.cyan}
                  strokeWidth={theme.stroke.rule}
                  opacity={1 - pierceUp}
                />
              </svg>
            )}

            <PriceLine g={G_UP} draw={drawUp} color={pal.ink} width={3} head />
            {drawUp >= 0.71 && <PivotMarker x={hlPoint.x} y={hlPoint.y} label="Higher Low" variant="cyan" side="below" startFrame={T.hl} />}
          </ChartCard>

          {/* the recall, flashed once at the top of the scene */}
          <Chip label="Support" x={700} y={CAPTION_Y} variant="indigo" startFrame={T.recall} opacity={fadeOut(f, 92, 24)} />
          <Chip label="Resistance" x={1000} y={CAPTION_Y} variant="cyan" startFrame={T.recall + 14} opacity={fadeOut(f, 100, 24)} />

          <div
            style={{
              position: "absolute",
              left: 1520,
              top: CAPTION_Y,
              transform: `translate(-50%, calc(-50% + ${note.y}px))`,
              opacity: note.opacity,
              fontFamily: theme.type.family,
              fontSize: theme.type.axis.size,
              fontWeight: 600,
              color: pal.slate,
              whiteSpace: "nowrap",
            }}
          >
            Level Sama, Dua Cerita
          </div>
        </div>
      )}

      {/* ── SC13: the floor that becomes a ceiling ── */}
      {sc13 > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: sc13 * (1 - paired * 0.9) }}>
          <ChartCard box={CARD}>
            <Band
              x={BOX.x}
              w={BOX.w}
              yTop={G_DN.y(BREAK_DOWN_LEVEL + BAND_HALF)}
              yBottom={G_DN.y(BREAK_DOWN_LEVEL - BAND_HALF)}
              variant="indigo"
              variantTo="cyan"
              blend={retint2}
              draw={f >= PHASE + 10 ? progress(f, PHASE + 10, 26) : 0}
            />
            <Chip label="Support" x={BOX.x + 24} y={G_DN.y(BREAK_DOWN_LEVEL) + 44} variant="indigo" anchor="left" startFrame={PHASE + 26} opacity={1 - retint2} />
            <Chip label="Resistance" x={BOX.x + 24} y={G_DN.y(BREAK_DOWN_LEVEL) - 44} variant="cyan" anchor="left" startFrame={T.retint2} opacity={retint2} />

            {pierceDn > 0.001 && (
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
                <circle
                  cx={G_DN.x(0.52)}
                  cy={G_DN.y(BREAK_DOWN_LEVEL)}
                  r={12 + 40 * pierceDn}
                  fill="none"
                  stroke={pal.indigo}
                  strokeWidth={theme.stroke.rule}
                  opacity={1 - pierceDn}
                />
              </svg>
            )}

            <PriceLine g={G_DN} draw={drawDn} color={pal.ink} width={3} head />
            {drawDn >= 0.71 && (
              <>
                <PivotMarker x={lhPoint.x} y={lhPoint.y} label="Lower High" variant="indigo" startFrame={T.lh} />
                {/* a small tick, not an alarm: the structure is being read, not traded */}
                <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
                  <path
                    d={`M ${lhPoint.x + 44},${lhPoint.y - 8} l 13,22 l -26,0 z`}
                    fill="none"
                    stroke={pal.indigo}
                    strokeWidth={theme.stroke.rule}
                    opacity={f >= T.lh + 12 ? 1 : 0}
                  />
                </svg>
              </>
            )}
          </ChartCard>
        </div>
      )}

      {/* the two views, side by side, joined by an equals */}
      {paired > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: paired }}>
          <Chip label="Breakout" x={theme.canvas.width / 2 - 300} y={PAIRED_Y} variant="cyan" size={theme.type.header.size} startFrame={T.paired} />
          <Chip label="Perubahan Struktur" x={theme.canvas.width / 2 + 300} y={PAIRED_Y} variant="indigo" size={theme.type.header.size} startFrame={T.paired + 12} />
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
            <line x1={theme.canvas.width / 2 - 26} y1={PAIRED_Y - 10} x2={theme.canvas.width / 2 + 26} y2={PAIRED_Y - 10} stroke={pal.slate} strokeWidth={3} />
            <line x1={theme.canvas.width / 2 - 26} y1={PAIRED_Y + 10} x2={theme.canvas.width / 2 + 26} y2={PAIRED_Y + 10} stroke={pal.slate} strokeWidth={3} />
          </svg>
        </div>
      )}
    </SafeArea>
  );
};
