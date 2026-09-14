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
import { BrokerPanel } from "../../019-moving-average/scenes/Scene01";

/** ⚠ 019'S OWN FRAME NUMBER. That episode runs at 30fps and this one at 60, so
 *  this is not a frame of THIS timeline and must never be derived from one. */
const AT = 170;

export const Platform = () => <BrokerPanel f={AT} structure={false} />;
