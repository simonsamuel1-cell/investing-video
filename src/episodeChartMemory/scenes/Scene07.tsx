/**
 * SC07 — Noise vs Direction (from 3720, dur 752) — INDEPENDENT.
 *
 * Same two-sided argument as before and the same beats, but the two candlestick
 * charts are now the BBCA screenshots: Timeframe_1 on the left (the noisy
 * side), Timeframe_3 on the right (the broad direction).
 *
 * Kept, as briefed: "5 Menit — Noise", "Mingguan — Arah Besar", "Kapan
 * bertindak", "Arah besar", and the swap to "Kapan?" / "Kemana?".
 *
 * Removed with everything else in 3008–4471: the two cards, the divider rule,
 * the three reversal pings and the trend arrow. The pings and the arrow were
 * pinned to candle coordinates, so they had nothing left to point at.
 *
 * The opening is a continuation, not a cut: SC06 leaves three images in a row,
 * and this scene's first frame draws exactly that row. Timeframe_1 then grows
 * out of its row slot into the left pane while the other two clear;
 * Timeframe_3 comes back on the "Semakin panjang timeframe" beat, with the
 * same slide-in the right card always had.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { Chip } from "../components/Chip";
import { progress, fadeOut, type Box } from "../helpers";
import { BbcaImage, rowSlot, paneSlot, lerpSlot } from "../components/TimeframeImages";
import { expandT, expandCard, expandBlur } from "../transitions/CardExpand";

/** This scene's `from` in Composition — needed to read the shared global curve. */
const SCENE_FROM = 3720;

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const GAP = 24;
const CARD_W = (1728 - GAP) / 2;
// The cards are no longer drawn, but their boxes still set where the header and
// caption chips sit — leave them alone unless the chips should move too.
const LEFT: Box = { x: 96, y: 250, w: CARD_W, h: 490 };
const RIGHT: Box = { x: 96 + CARD_W + GAP, y: 250, w: CARD_W, h: 490 };
// Header chips sit clear of the top-150px logo band (the right chip runs past
// x = 1368, so it must not be inside that band).
const HEADER_Y = 200;
// ── HANDOFF from SC06 ───────────────────────────────────────────────────────
// This scene opens on SC06's row of three and resolves it. CARRY is how long
// Timeframe_1 takes to grow into the left pane; CLEAR is how long the other two
// take to leave. Both start on frame 0, so global 3719 and 3720 are the same
// picture.
const CARRY = 44;
const CLEAR = 26;
/**
 * Which screenshot fills which pane: [left, right].
 *
 * ⚠ As briefed — left ("5 Menit — Noise") = Timeframe_1, right ("Mingguan —
 * Arah Besar") = Timeframe_3. But the screenshots are the other way round:
 * Timeframe_1 has W selected and runs Jan–Aug 2026 (weekly), Timeframe_3 has
 * 5m selected and runs 8/4–8/6 (five-minute intraday). So each label currently
 * sits over the opposite chart.
 *
 * Change this to [2, 0] and the labels match the images. One edit, nothing
 * else moves.
 */
const PANE_IMAGE = [0, 2];
/** Height Timeframe_3 reaches at the end of the CardExpand move. */
const EXPAND_H = 812;
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
  // At expand = 0 the expanded card's centre is already the right pane's, so
  // this one expression covers both the resting state and the move.
  const rc = expandCard(g);
  const slotR = { cx: rc.x + rc.w / 2, cy: rc.y + rc.h / 2, h: paneSlot(1).h + (EXPAND_H - paneSlot(1).h) * expand };

  return (
    <SafeArea>
      {/* the noisy side leads, then steps back while the trend side arrives */}
      <BbcaImage index={PANE_IMAGE[0]} slot={slotL} opacity={leftDim * clearing} />

      {/* the other two, still where SC06 left them, on their way out */}
      <BbcaImage index={1} slot={rowSlot(1)} opacity={leaving} />
      {rightIn <= 0.001 && <BbcaImage index={PANE_IMAGE[1]} slot={rowSlot(2)} opacity={leaving} />}

      {/* the broad-direction side, arriving on its own beat */}
      {rightIn > 0.001 && (
        <div style={{ transform: `translateX(${(1 - rightIn) * 60}px)` }}>
          <BbcaImage index={PANE_IMAGE[1]} slot={slotR} opacity={rightIn} blur={expandBlur(g)} />
        </div>
      )}

      {/* Header chips, centred over their own image. They used to hang off the
          card's top-left corner; with the cards gone that left them floating
          far from the thing they label. */}
      <div style={{ transform: `scale(${1 + 0.04 * pulseL})`, transformOrigin: `${paneSlot(0).cx}px ${HEADER_Y}px` }}>
        <Chip label="5 Menit — Noise" x={paneSlot(0).cx} y={HEADER_Y} variant="slate" anchor="center" startFrame={0} opacity={clearing} />
      </div>
      <div style={{ transform: `scale(${1 + 0.04 * pulseR})`, transformOrigin: `${paneSlot(1).cx}px ${HEADER_Y}px` }}>
        <Chip label="Mingguan — Arah Besar" x={paneSlot(1).cx} y={HEADER_Y} variant="indigo" anchor="center" startFrame={T.rightIn} opacity={clearing} />
      </div>

      {/* One caption per pane. On the "pertanyaan yang berbeda" beat each one
          is replaced, in place, by the question it stands for. */}
      {f < T.questions + T.swapDur && (
        <>
          <Chip
            label="Kapan bertindak"
            x={LEFT.x + LEFT.w / 2}
            y={LEFT.y + LEFT.h + 52}
            variant="slate"
            anchor="center"
            startFrame={T.capLeft}
            opacity={swapOut * clearing}
          />
          <Chip
            label="Arah besar"
            x={RIGHT.x + RIGHT.w / 2}
            y={RIGHT.y + RIGHT.h + 52}
            variant="indigo"
            anchor="center"
            startFrame={T.capRight}
            opacity={swapOut * clearing}
          />
        </>
      )}
      <Chip
        label="Kapan?"
        x={LEFT.x + LEFT.w / 2}
        y={LEFT.y + LEFT.h + 52}
        variant="slate"
        anchor="center"
        startFrame={T.questions + T.swapDur}
        opacity={clearing}
      />
      <Chip
        label="Kemana?"
        x={RIGHT.x + RIGHT.w / 2}
        y={RIGHT.y + RIGHT.h + 52}
        variant="indigo"
        anchor="center"
        startFrame={T.questions + T.swapDur}
        opacity={clearing}
      />
    </SafeArea>
  );
};
