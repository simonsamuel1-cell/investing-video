/**
 * SC06 — One Stock, Three Timeframes (from 3008, dur 712) — INDEPENDENT.
 *
 * Everything this scene used to draw — the card, the timeframe selector, the
 * ticker chip, the three wipe-over charts, the triptych and its closing line —
 * has been removed. What is left is the three BBCA screenshots in a row, held
 * at half strength and lit one at a time.
 *
 * Frame numbers below are GLOBAL, as briefed; `S` converts them to this scene's
 * local clock by subtracting SCENE_FROM.
 *
 * Slots are left / middle / right. ROW_IMAGE decides which file sits in each,
 * so the timing below never has to change when the pictures are reordered.
 *
 *   3008 – 3109   all three at 50%
 *   3110 – 3200   left lit: 100%, +5%
 *   3201 – 3277   middle lit; left back to 50% and its own size
 *   3278 – 3374   right lit; middle back to 50% and its own size
 *   3375 – 3534   all three at 100%
 *   3535 – 3596   left +5%          ("seberapa dekat")
 *   3597 – 3646   right +5%; left back down   ("atau seberapa jauh")
 *   3647 – 3719   right back down — the row rests, and SC07 picks the left one
 *                 up from here
 *
 * Two readings the brief left open, resolved here:
 *   · at 3375 the right image also returns to its own size. The brief only
 *     names opacity for that stretch, but 3535 asks for a 5% grow, which only
 *     means anything if nothing is grown going in.
 *   · each change is eased over CHANGE frames rather than switching on the
 *     frame itself — a hard step would be the only cut of its kind in the
 *     episode.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { theme } from "../theme";
import { BbcaImage, BbcaLabel, rowSlot, ROW_IMAGE, ROW_LABEL } from "../components/TimeframeImages";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 3008;
/** Global frames from the brief, converted to scene-local. */
const G = (globalFrame: number) => globalFrame - SCENE_FROM;
const S = {
  base: G(3008), // 0    — the row arrives at 50%
  hi1: G(3110), // 102  — #1 lit
  hi2: G(3201), // 193  — #2 lit
  hi3: G(3278), // 270  — #3 lit
  allOn: G(3375), // 367  — everything at full strength
  up1: G(3535), // 527  — #1 grows
  up2: G(3597), // 589  — #2 grows, #1 settles
  down2: G(3647), // 639  — #2 settles
};
const CHANGE = 16; // frames each opacity / scale change takes
const DIM = 0.5;
const GROW = 1.05;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hold-then-ease between keyframes: the value sits at vals[i] until keys[i+1],
 * then eases to vals[i+1] over CHANGE frames. Every gap in S is wider than
 * CHANGE, so no two changes ever overlap.
 */
const holdEase = (f: number, keys: number[], vals: number[]) => {
  const inp = [keys[0]];
  const out = [vals[0]];
  for (let i = 1; i < keys.length; i++) {
    inp.push(keys[i], keys[i] + CHANGE);
    out.push(vals[i - 1], vals[i]);
  }
  return interpolate(f, inp, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.motion.ease });
};

const OPACITY = [
  { keys: [S.base, S.hi1, S.hi2, S.allOn], vals: [DIM, 1, DIM, 1] },
  { keys: [S.base, S.hi2, S.hi3, S.allOn], vals: [DIM, 1, DIM, 1] },
  { keys: [S.base, S.hi3], vals: [DIM, 1] },
];

/**
 * The second pass, 3535 → 3719, follows the voice-over rather than the order
 * the first pass used:
 *
 *   3542–3602  "Semuanya bergantung pada seberapa DEKAT"  → slot 0, the 5m
 *   3607–3635  "atau seberapa JAUH"                       → slot 2, the weekly
 *
 * So the middle image (1D) is not part of it — close and far are the two ends,
 * and lighting the daily chart on "jauh" would say the wrong thing.
 */
const SCALE = [
  { keys: [S.base, S.hi1, S.hi2, S.up1, S.up2], vals: [1, GROW, 1, GROW, 1] },
  { keys: [S.base, S.hi2, S.hi3], vals: [1, GROW, 1] },
  { keys: [S.base, S.hi3, S.allOn, S.up2, S.down2], vals: [1, GROW, 1, GROW, 1] },
];

export const Scene06 = () => {
  const f = useCurrentFrame();

  return (
    <SafeArea>
      {/* `i` is the SLOT. The timing below is indexed by slot, so swapping which
          file sits where (ROW_IMAGE) moves the pictures and leaves the
          highlight order exactly as it was. */}
      {[0, 1, 2].map((i) => (
        <BbcaImage
          key={i}
          index={ROW_IMAGE[i]}
          slot={rowSlot(i)}
          opacity={holdEase(f, OPACITY[i].keys, OPACITY[i].vals)}
          scale={holdEase(f, SCALE[i].keys, SCALE[i].vals)}
        />
      ))}

      {/* The timeframe each screenshot is showing. It dims with its own image,
          and fills indigo exactly while that image is the one being lit —
          `active` is read off the grow itself, so the two can never disagree. */}
      {[0, 1, 2].map((i) => (
        <BbcaLabel
          key={i}
          text={ROW_LABEL[i]}
          slot={rowSlot(i)}
          opacity={holdEase(f, OPACITY[i].keys, OPACITY[i].vals)}
          active={(holdEase(f, SCALE[i].keys, SCALE[i].vals) - 1) / (GROW - 1)}
        />
      ))}
    </SafeArea>
  );
};
