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
 *   3008 – 3109   all three at 50%
 *   3110 – 3200   #1 lit: 100%, +5%
 *   3201 – 3277   #2 lit; #1 back to 50% and its own size
 *   3278 – 3374   #3 lit; #2 back to 50% and its own size
 *   3375 – 3534   all three at 100%
 *   3535 – 3596   #1 +5%
 *   3597 – 3646   #2 +5%; #1 back down
 *   3647 – 3719   #2 back down — the row rests, and SC07 picks #1 up from here
 *
 * Two readings the brief left open, resolved here:
 *   · at 3375 #3 also returns to its own size. The brief only names opacity for
 *     that stretch, but 3535 asks for "#1 grows 5%", which only means anything
 *     if nothing is grown going in.
 *   · each change is eased over CHANGE frames rather than switching on the
 *     frame itself — a hard step would be the only cut of its kind in the
 *     episode.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { theme } from "../theme";
import { BbcaImage, rowSlot } from "../components/TimeframeImages";

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

const SCALE = [
  { keys: [S.base, S.hi1, S.hi2, S.up1, S.up2], vals: [1, GROW, 1, GROW, 1] },
  { keys: [S.base, S.hi2, S.hi3, S.up2, S.down2], vals: [1, GROW, 1, GROW, 1] },
  { keys: [S.base, S.hi3, S.allOn], vals: [1, GROW, 1] },
];

export const Scene06 = () => {
  const f = useCurrentFrame();

  return (
    <SafeArea>
      {[0, 1, 2].map((i) => (
        <BbcaImage
          key={i}
          index={i}
          slot={rowSlot(i)}
          opacity={holdEase(f, OPACITY[i].keys, OPACITY[i].vals)}
          scale={holdEase(f, SCALE[i].keys, SCALE[i].vals)}
        />
      ))}
    </SafeArea>
  );
};
