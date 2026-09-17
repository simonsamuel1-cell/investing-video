/**
 * scenes/AdmrNote.tsx — the bar laid across the bottom of the ADMR window.
 *
 * Simon, 2026-09-17, with a dialog-box screenshot for the layout:
 *   "10950 muncul text box, isinya maskot di sebelah kiri, dan tulisannya
 *    'Kalau terlalu fokus pada satu skenario, kondisi ini bisa terlihat seperti
 *    persiapan rebound.' Style boxnya: fill indigo transparansi 70%, bordernya
 *    indigo agak gelap, maskotnya animasi naik turun, textnya putih … Animasi
 *    muncul text boxnya kayak biasa ya, dari tengah langsung memanjang ke kiri
 *    kanan (heightnya uda sama)."
 *
 * ⚠ THE 70% IS LOAD-BEARING, NOT A STYLE. The sentence is ABOUT the chart it is
 * lying on — it says what that chart looks like to somebody who has already
 * decided what they want to see. Painted solid, the box would be arguing with
 * evidence it had just covered up.
 *
 * ⚠ AND THE BAND GOES QUIET WHILE IT IS UP. These words are cue 10960 verbatim,
 * so the burned-in subtitle underneath would say them a second time. The window
 * is `ADMR_TAPE.note.mute`, handed to `Captions` at the composition root, and
 * data/timing.ts asserts at module load that the muted cue and this sentence
 * are the same string — correct the SRT and this throws rather than drifting.
 *
 * ⚠ THE CONTENT DOES NOT OPEN WITH THE BOX. The box widens from its middle with
 * its height already full; the mascot and the sentence fade in afterwards, on
 * the finished rectangle. Putting them inside the widening box squashes the
 * mark and re-wraps the sentence on every frame of the move.
 */
import { useCurrentFrame } from "remotion";
import { TuntunMark, theme, useMotion, usePalette } from "../../../core";
import { ADMR_NOTE as N } from "../data/layout";
import { ADMR_TAPE } from "../data/timing";

/** The indigo's opacity. Simon's number. */
const FILL = 0.7;

export const AdmrNote = ({
  open,
  ink,
}: {
  /** 0 → 1 as the box widens out of its own middle. */
  open: number;
  /** 0 → 1 as the mascot and the sentence arrive on it. */
  ink: number;
}) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();

  const wide = N.w * open;
  const left = theme.canvas.width / 2 - wide / 2;
  /** The mascot breathes. One period, not a bounce — see ADMR_NOTE.bob. */
  const bob = Math.sin((f / m.sec(N.bob.seconds)) * Math.PI * 2) * N.bob.amount;
  const column = N.x + N.pad + N.markBox / 2;
  const text = N.x + N.pad + N.markBox + N.gap;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          top: N.y,
          width: wide,
          height: N.h,
          borderRadius: N.radius,
          background: c.indigo,
          opacity: FILL,
        }}
      />
      <div
        style={{
          position: "absolute",
          left,
          top: N.y,
          width: wide,
          height: N.h,
          borderRadius: N.radius,
          border: `${theme.shape.line}px solid ${c.indigoDeep}`,
          boxSizing: "border-box",
        }}
      />

      <div style={{ opacity: ink }}>
        <TuntunMark x={column} y={N.y + (N.h - N.mark) / 2 + bob} height={N.mark} />
        <div
          style={{
            position: "absolute",
            left: text,
            top: N.y,
            width: N.x + N.w - N.pad - text,
            height: N.h,
            display: "flex",
            alignItems: "center",
            fontFamily: theme.text.family,
            fontSize: N.size,
            fontWeight: 500,
            lineHeight: 1.3,
            color: theme.color.onIndigo,
          }}
        >
          {ADMR_TAPE.note.text}
        </div>
      </div>
    </>
  );
};
