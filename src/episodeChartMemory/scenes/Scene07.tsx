/**
 * SC07 — Noise vs Direction (from 3720, dur 752) — INDEPENDENT.
 *
 * Same two-sided argument as before and the same beats, but the two candlestick
 * charts are now the BBCA screenshots. Which file lands in which pane is not
 * decided here — it follows ROW_IMAGE, so the row SC06 leaves behind carries
 * straight through. Today that means Timeframe_3 (5m) on the left and
 * Timeframe_1 (weekly) on the right.
 *
 * Kept, as briefed: "5 Menit — Noise", "Mingguan — Arah Besar", "Kapan
 * bertindak", "Arah besar", and the swap to "Kapan?" / "Kemana?".
 *
 * Removed with everything else in 3008–4471: the two cards and the divider
 * rule. The three checkpoints and the broad-direction line are BACK — they used
 * to be computed from the series, so with a JPEG under them they are now placed
 * in normalized screenshot coordinates (see CHECKPOINTS and TREND).
 *
 * The opening is a continuation, not a cut: SC06 leaves three images in a row,
 * and this scene's first frame draws exactly that row. The left one then grows
 * out of its row slot into the left pane while the other two clear; the one
 * from the right end comes back on the "Semakin panjang timeframe" beat, with
 * the same slide-in the right card always had.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { Chip } from "../components/Chip";
import { Ping } from "../components/Ping";
import { theme } from "../theme";
import { progress, fadeOut } from "../helpers";
import { BbcaImage, BbcaLabel, rowSlot, paneSlot, lerpSlot, ROW_IMAGE, ROW_LABEL, LABEL, PANE_HEADER_Y, PANE_CAPTION_Y, ASPECT, type Slot } from "../components/TimeframeImages";
import { SLIDES, slideOut, slideBlur } from "../transitions/SlideCut";
import { usePalette } from "../palette";

/** This scene's `from` in Composition — needed to read the shared global curve. */
const SCENE_FROM = 3720;

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
// Every chip in this scene now matches the row labels' type size, and each one
// is centred on the pane it belongs to — the old card boxes are gone.
const CHIP_SIZE = LABEL.size;
// ── HANDOFF from SC06 ───────────────────────────────────────────────────────
// This scene opens on SC06's row of three and resolves it. CARRY is how long
// the left image takes to grow into its pane; CLEAR is how long the other two
// take to leave. Both start on frame 0, so global 3719 and 3720 are the same
// picture.
const CARRY = 44;
const CLEAR = 26;
/**
 * Which screenshot fills which pane: [left, right].
 *
 * NOT a free choice — it is forced by the row. The left pane grows out of row
 * slot 0 and the right pane is the one that left from row slot 2, so both must
 * be whatever ROW_IMAGE put there. Hard-coding different files here would make
 * the picture change on the frame the scene starts.
 *
 * With ROW_IMAGE = [2, 1, 0] this resolves to [Timeframe_3, Timeframe_1] —
 * which is also the pairing that makes the labels true: "5 Menit — Noise" now
 * sits over the 5m screenshot and "Mingguan — Arah Besar" over the weekly one.
 */
const PANE_IMAGE = [ROW_IMAGE[0], ROW_IMAGE[2]];
/**
 * The overlay marks, in NORMALIZED screenshot coordinates — nx is a fraction of
 * the image's width, ny of its height, so they stay on the same candles
 * whatever size the pane is.
 *
 * The originals were computed from the series: three local extrema on the 5m
 * data, and a line from an early swing to a late one on the weekly. A JPEG has
 * no series, so these were read off the screenshots by eye and are the one
 * thing here that is hand-placed. Nudge them freely.
 */
const CHECKPOINTS = [
  { nx: 0.15, ny: 0.397 }, // the spike to 6,500 early in 8/5
  { nx: 0.591, ny: 0.546 }, // the step down mid-session
  { nx: 0.885, ny: 0.672 }, // the drop into the 6,350 close
];
/**
 * The broad direction on the weekly. Same construction as the original — an
 * extreme near the START of the window to one near the END — which on this
 * chart runs DOWNHILL: 7,925 in January to 6,350 in August. The old arrow rose
 * because the placeholder series rose; this one follows what BBCA actually did.
 */
const TREND = { from: { nx: 0.08, ny: 0.412 }, to: { nx: 0.911, ny: 0.554 } };

const T = {
  p1: 105, // "setiap reaksi kecil"
  p2: 140, // "keraguan"
  p3: 173, // "sesaat, dan kepanikan pasar"
  rightIn: 241, // "Semakin panjang timeframe"
  arrow: 278, // "arah besarnya semakin jelas"
  capLeft: 354, // "kapan harus bertindak"
  capRight: 548, // "arah besar tempat keputusan itu diambil"
  pulse: 631, // "Keduanya berguna"
  // "pertanyaan yang berbeda" — the two captions become the questions
  // themselves. Global 4418; this scene ends at 4471, so this is as late as the
  // swap can land and still be readable.
  questions: 698,
  swapDur: 8, // old label clears before the new one arrives — they never overlap
};
// ═══════════════════════════════════════════════════════════════════════════

/** A normalized mark → canvas coordinates inside a slot. */
const at = (slot: Slot, n: { nx: number; ny: number }) => ({
  x: slot.cx - (slot.h * ASPECT) / 2 + n.nx * slot.h * ASPECT,
  y: slot.cy - slot.h / 2 + n.ny * slot.h,
});

export const Scene07 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();
  // ── the outgoing half of the SlideCut at 4472 ──
  // Nothing has to fade out any more: the whole frame pans off and the cut
  // lands at peak velocity.
  const g = f + SCENE_FROM;
  const dx = slideOut(g, SLIDES.toSupport);
  const slideFx = slideBlur(g, SLIDES.toSupport);

  const rightIn = f >= T.rightIn ? progress(f, T.rightIn, 34) : 0;
  // the noisy side steps back while the trend side is introduced, then returns
  const leftDim = 1 - 0.35 * rightIn * (1 - (f >= T.capLeft ? progress(f, T.capLeft, 26) : 0));
  const swapOut = f >= T.questions ? fadeOut(f, T.questions, T.swapDur) : 1;
  const pulseL = f >= T.pulse && f < T.pulse + 26 ? Math.sin(((f - T.pulse) / 26) * Math.PI) : 0;
  const pulseR = pulseL;

  // ── the row of three resolving into the left pane ──
  const carry = progress(f, 0, CARRY);
  const leaving = 1 - progress(f, 0, CLEAR);
  const slotL = lerpSlot(rowSlot(0), paneSlot(0), carry);

  const slotR = paneSlot(1);

  // ── the broad-direction line, drawn on with a trim path ──
  const arrow = f >= T.arrow ? progress(f, T.arrow, 56) : 0;
  const a1 = at(slotR, TREND.from);
  const a2 = at(slotR, TREND.to);
  const alen = Math.hypot(a2.x - a1.x, a2.y - a1.y);
  const ang = Math.atan2(a2.y - a1.y, a2.x - a1.x);
  const hx = a1.x + (a2.x - a1.x) * arrow;
  const hy = a1.y + (a2.y - a1.y) * arrow;

  return (
    <SafeArea>
      <div style={{ transform: `translateX(${dx}px)`, filter: slideFx > 0.05 ? `blur(${slideFx}px)` : undefined }}>
      {/* the noisy side leads, then steps back while the trend side arrives */}
      <BbcaImage index={PANE_IMAGE[0]} slot={slotL} opacity={leftDim} />

      {/* the other two, still where SC06 left them, on their way out */}
      <BbcaImage index={ROW_IMAGE[1]} slot={rowSlot(1)} opacity={leaving} />
      {rightIn <= 0.001 && <BbcaImage index={PANE_IMAGE[1]} slot={rowSlot(2)} opacity={leaving} />}

      {/* SC06's three small labels, carried across the boundary and cleared
          with the row they belong to. The left one rides its image as it grows,
          then hands the job to the "5 Menit — Noise" chip. */}
      <BbcaLabel text={ROW_LABEL[0]} slot={slotL} opacity={leaving} />
      <BbcaLabel text={ROW_LABEL[1]} slot={rowSlot(1)} opacity={leaving} />
      <BbcaLabel text={ROW_LABEL[2]} slot={rowSlot(2)} opacity={leaving} />

      {/* the broad-direction side, arriving on its own beat */}
      {rightIn > 0.001 && (
        <div style={{ transform: `translateX(${(1 - rightIn) * 60}px)` }}>
          <BbcaImage index={PANE_IMAGE[1]} slot={slotR} opacity={rightIn} />
        </div>
      )}

      {/* three checkpoints on the noisy side — descriptive, never entry markers */}
      <div>
        {CHECKPOINTS.map((c, i) => {
          const p = at(slotL, c);
          return <Ping key={i} x={p.x} y={p.y} startFrame={[T.p1, T.p2, T.p3][i]} variant="slate" />;
        })}
      </div>

      {/* one line along the weekly's broad direction */}
      {arrow > 0.001 && (
        <svg
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
          width={theme.canvas.width}
          height={theme.canvas.height}
        >
          <line
            x1={a1.x}
            y1={a1.y}
            x2={a2.x}
            y2={a2.y}
            stroke={pal.indigo}
            strokeWidth={theme.stroke.rule}
            strokeDasharray={alen}
            strokeDashoffset={alen * (1 - arrow)}
          />
          <polygon
            points={`${hx},${hy} ${hx - 16 * Math.cos(ang - 0.4)},${hy - 16 * Math.sin(ang - 0.4)} ${hx - 16 * Math.cos(ang + 0.4)},${hy - 16 * Math.sin(ang + 0.4)}`}
            fill={pal.indigo}
            opacity={arrow}
          />
        </svg>
      )}

      {/* Header chips, centred over their own image. */}
      <div style={{ transform: `scale(${1 + 0.04 * pulseL})`, transformOrigin: `${paneSlot(0).cx}px ${PANE_HEADER_Y}px` }}>
        <Chip
          label="5 Menit — Noise"
          x={paneSlot(0).cx}
          y={PANE_HEADER_Y}
          size={CHIP_SIZE}
          variant="slate"
          anchor="center"
          startFrame={0}
          />
      </div>
      <div style={{ transform: `scale(${1 + 0.04 * pulseR})`, transformOrigin: `${paneSlot(1).cx}px ${PANE_HEADER_Y}px` }}>
        <Chip
          label="Mingguan — Arah Besar"
          x={paneSlot(1).cx}
          y={PANE_HEADER_Y}
          size={CHIP_SIZE}
          variant="indigo"
          anchor="center"
          startFrame={T.rightIn}
          />
      </div>

      {/* One caption per pane, centred under its image. On the "pertanyaan yang
          berbeda" beat each one is replaced, in place, by the question it
          stands for. All four are bare indigo type now — no pill, no border. */}
      {f < T.questions + T.swapDur && (
        <>
          <Chip
            label="Kapan bertindak"
            x={paneSlot(0).cx}
            y={PANE_CAPTION_Y}
            size={CHIP_SIZE}
            variant="indigo"
            bare
            anchor="center"
            startFrame={T.capLeft}
            opacity={swapOut}
          />
          <Chip
            label="Arah besar"
            x={paneSlot(1).cx}
            y={PANE_CAPTION_Y}
            size={CHIP_SIZE}
            variant="indigo"
            bare
            anchor="center"
            startFrame={T.capRight}
            opacity={swapOut}
          />
        </>
      )}
      <Chip
        label="Kapan?"
        x={paneSlot(0).cx}
        y={PANE_CAPTION_Y}
        size={CHIP_SIZE}
        variant="indigo"
        bare
        anchor="center"
        startFrame={T.questions + T.swapDur}
      />
      <Chip
        label="Kemana?"
        x={paneSlot(1).cx}
        y={PANE_CAPTION_Y}
        size={CHIP_SIZE}
        variant="indigo"
        bare
        anchor="center"
        startFrame={T.questions + T.swapDur}
      />
      </div>
        </SafeArea>
  );
};
