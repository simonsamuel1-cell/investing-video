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
 * Removed with everything else in 3008–4471: the two cards, the divider rule,
 * the three reversal pings and the trend arrow. The pings and the arrow were
 * pinned to candle coordinates, so they had nothing left to point at.
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
import { progress, fadeOut } from "../helpers";
import { BbcaImage, BbcaLabel, rowSlot, paneSlot, lerpSlot, ROW_IMAGE, ROW_LABEL, LABEL, PANE_HEADER_Y, PANE_CAPTION_Y } from "../components/TimeframeImages";
import { expandT, expandBlur } from "../transitions/CardExpand";

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
/** Where the right image lands at the end of the CardExpand move — the centre
 *  and height of SC08's full-width card. */
const EXPAND_TO = { cx: 960, cy: 566, h: 812 };
const T = {
  rightIn: 241, // "Semakin panjang timeframe"
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

export const Scene07 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM; // the CardExpand curve is defined in global frames
  // The right image starts growing into SC08's card before this scene ends; the
  // rest of the scene clears out of its way.
  const expand = expandT(g);
  // Everything but the travelling image must be GONE before the boundary, not
  // half-faded on it — so it clears in the move's first 40%.
  const clearing = Math.max(0, 1 - expand * 2.5);

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

  // ── the right image, and the move it makes into SC08 ──
  // Driven off the shared CardExpand curve but interpolated from THIS pane, so
  // moving the panes never leaves the move starting somewhere else.
  const slotR = lerpSlot(paneSlot(1), EXPAND_TO, expand);

  return (
    <SafeArea>
      {/* the noisy side leads, then steps back while the trend side arrives */}
      <BbcaImage index={PANE_IMAGE[0]} slot={slotL} opacity={leftDim * clearing} />

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
          <BbcaImage index={PANE_IMAGE[1]} slot={slotR} opacity={rightIn} blur={expandBlur(g)} />
        </div>
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
          opacity={clearing}
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
          opacity={clearing}
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
            opacity={swapOut * clearing}
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
            opacity={swapOut * clearing}
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
        opacity={clearing}
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
        opacity={clearing}
      />
    </SafeArea>
  );
};
