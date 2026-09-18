/**
 * SC17 — the trader checks himself. `from 15008 · to 15949`
 *
 * ⚠ IT ARRIVES ON A CAMERA CUT. SC16 leaves through the outgoing half of CUT16
 * at 15008; this takes the half that cut brings in, so the first pose has no
 * entrance of its own and is already complete on the frame it lands.
 * `cutInStyle` reads GLOBAL frames — the Sequence rebases them, so `at` has to
 * be added back. That is the number one bug in this pipeline.
 *
 * ⚠ SIX POSES, ONE FIGURE. Simon gave six frames and six drawings of the same
 * character; each REPLACES the one before it rather than joining it, and the
 * swap is a hard cut. A crossfade between two poses of one body is two bodies
 * for the length of the fade — the arms ghost through each other — and there is
 * no reading of that which is not a mistake.
 *
 * ⚠ NO artShadow ON THE FIGURE, AND THAT IS A DECISION. core's cut-out shadow
 * is a pink-over-cyan gradation meant to light a figure standing on a stage;
 * on a yellow character against a grid it reads as a sticker outline, and it
 * was nobody's instruction — it also pushed the figure 78px off the band to
 * make room for its own tail. These drawings are cut at the hips, so the frame
 * edge grounds them and nothing has to be added.
 *
 * ⚠ AND THE GROUND IS THE ONLY THING THAT MOVES. "Background kotak kotak
 * bergerak pelan" — core/GridGround, six seconds to travel one cell, which is
 * slow enough that the eye reads it as texture and only notices the motion if
 * it goes looking. It is a ground: the figure is the subject.
 */
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { GridGround, Stage, cutInStyle, usePalette } from "../../../core";
import { CUT16, MIND } from "../data/timing";
import { MIND_SHOT } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = MIND;
const S = MIND_SHOT;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE GROUND GOES TO NOTHING OVER THE RESERVES RATHER THAN STOPPING AT THEM.
 * See MIND_SHOT.fade in data/layout.ts for why, and for where the stops come
 * from. `vignette` is off with it: the grid's own mask fades the SIDES too, and
 * a ground that falls away left and right is the crop this is avoiding.
 */
const GROUND_FADE = (() => {
  const F = MIND_SHOT.fade;
  const ramp =
    `linear-gradient(to bottom, transparent 0px, transparent ${F.inFrom}px, ` +
    `#000 ${F.inTo}px, #000 ${F.outFrom}px, transparent ${F.outTo}px)`;
  return {
    position: "absolute",
    inset: 0,
    maskImage: ramp,
    WebkitMaskImage: ramp,
  } as const;
})();

export const Mindset = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  /** ⚠ GLOBAL FRAMES for the cut. See the header. */
  const g = f + V.at;

  /**
   * Which pose is up. The LAST beat that has happened — written as a search
   * from the end rather than a chain of ifs, so adding a seventh drawing is an
   * edit to data/timing.ts and nothing here.
   */
  let pose = 0;
  V.poses.forEach((at, i) => {
    if (g >= at) pose = i;
  });

  return (
    <Stage>
      <AbsoluteFill style={cutInStyle(g, CUT16)}>
        {/* ⚠ EDGE TO EDGE, WITH THE EPISODE'S OWN GROUND AS ITS PAPER. Simon:
            "background kotak kotaknya jangan cropped ya, full screen". It was
            windowed between the two reserves first, which left a seam across
            the top of the frame where the white paper met the grey ground.
            Giving the paper that ground instead makes it invisible: the LINES
            become the whole of the effect, they run to every edge, and the
            grid's own vignette keeps them clear of the band and the logo zone
            without anything being cut. */}
        <div style={GROUND_FADE}>
          <GridGround f={f} paper={c.bg} vignette={false} />
        </div>
        <Img
          src={staticFile(S.srcs[pose])}
          style={{
            position: "absolute",
            left: S.rect.x,
            top: S.rect.y,
            width: S.rect.w,
            height: S.rect.h,
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
