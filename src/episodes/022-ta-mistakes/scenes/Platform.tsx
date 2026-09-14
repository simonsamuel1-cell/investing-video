/**
 * SC06 · THE PLATFORM.  `from 4047 · to 5031`
 *
 * ⚠ IT IS VIDEO 19'S PANEL, NOT A COPY OF IT — Simon: "replace dengan visual di
 * composition Moving Average 170. Copy paste persis aja". `BrokerPanel` is
 * already exported from 019's Scene01, so the way to have that picture exactly
 * is to draw it, not to reproduce it. A second copy would be two drawings of
 * one thing that could only ever drift apart.
 *
 * ⚠ FROZEN ON 170, and frozen is what "the visual at 170" means: the frame is
 * handed in rather than read off the clock, so nothing here can wander into the
 * beats 019 has after it — the structure, the average, the bands.
 *
 * ⚠ WITHOUT THE ZIGZAG OR ITS HL/HH/LH/LL LABELS — Simon. They begin on exactly
 * frame 170 in 019, so at rest they would be invisible anyway; `structure` is
 * passed off regardless, because a thing that is hidden by luck is a thing that
 * comes back the day the number moves.
 *
 * ⚠ THE "Ilustrasi" TAG STAYS, and has to. The prices on that panel are
 * invented on a real ticker, and the tag is the only thing on screen saying so.
 * Simon's standing rule against the word is about labels this project adds to
 * its own drawings; this one is a disclosure.
 */
import { useCurrentFrame } from "remotion";
import { progress } from "../../../core";
import { BrokerPanel } from "../../019-moving-average/scenes/Scene01";
import { BLOCK, PLATFORM } from "../data/timing";

/** ⚠ 019'S OWN FRAME NUMBER. That episode runs at 30fps and this one at 60, so
 *  this is not a frame of THIS timeline and must never be derived from one. */
const AT = 170;

export const Platform = () => {
  const f = useCurrentFrame();
  /**
   * ⚠ GLOBAL FRAMES. A scene inside a Sequence sees its own rebased frame, and
   * 4282 is written in the timeline's numbers, so the scene's `from` has to go
   * back on before anything is asked about it.
   *
   * ⚠ AND IT IS A FADE, NOT A MOVE — Simon. The panel is under the card list
   * until 4281, so anything that has to start before the frame it lands on
   * would do half its work unseen; a fade has no hidden half.
   */
  const shown = progress(f + BLOCK.SC06, PLATFORM.at, PLATFORM.fade);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: shown }}>
      <BrokerPanel f={AT} structure={false} />
    </div>
  );
};
