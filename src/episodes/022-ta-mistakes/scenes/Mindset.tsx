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
import {
  Chip, GridGround, Line, Stage, TuntunMark, cutInStyle, progress, progressInOut,
  theme, useMotion, usePalette,
} from "../../../core";
import { CUT16, MIND, local } from "../data/timing";
import { MIND_SHOT } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const V = MIND;
const S = MIND_SHOT;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ⚠ THE SCENE IS FENCED OFF THE SUBTITLE BAND, because the figure is MEANT to
 * run past it: 15444 drops it 400 and its floor lands on 1372. Clipping is the
 * honest way to say "it slides out of frame" — the alternative is a drawing
 * that stops dead at an invisible line.
 *
 * ⚠ AND THE FENCE IS OUTSIDE THE CUT, for the reason SC16's had to be moved
 * there: a filter applies to what its element has already produced, so CUT16's
 * blur would smear the clipped edge straight back into the band.
 */
const FENCE = {
  clipPath: `inset(0px 0px ${theme.captionBand.height}px 0px)`,
} as const;

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
  const m = useMotion();
  /** ⚠ GLOBAL FRAMES for the cut. See the header. */
  const g = f + V.at;

  /**
   * ⚠ ONE CURVE CLEARS THE THREE NAMES AND BRINGS THE ANSWER — "semua label
   * text fade out, langsung muncul". Written twice it would be two curves, and
   * a frame with neither on it is the thing that reads as a dropped shot.
   */
  const answered = progress(g, V.stop.at, m.fade);

  /**
   * ⚠ A LABEL'S BEAT IS THE FRAME IT IS UP ON, NOT THE FRAME IT STARTS — Simon:
   * "15210, 15262, dan 15315 bukan waktu untuk mulai fade in textnya, tapi
   * harus sudah muncul". So the pop is run BACKWARDS off the beat and it lands
   * exactly there.
   *
   * ⚠ AND core/Chip POPS OVER `m.pop`, NOT `m.reveal`. Subtracting the wrong
   * duration would leave it a few frames short of full on the frame that has to
   * be full, which is the one thing this is for.
   */
  const upBy = (beat: number) => local(beat, V.at) - m.pop;
  /** And the same shape again for the answer leaving as the mark arrives. */
  const marked = progress(g, V.mark.at, m.fade);

  /**
   * The figure's drop. `progressInOut` because it is a MOVE: it has to settle
   * as deliberately as it sets off, with the mark coming down over it.
   */
  const dropped = progressInOut(g, V.mark.at, m.move) * S.drop;
  /**
   * ⚠ ONE CURVE FOR THE WHOLE DIAGONAL — "artinya geser serong". Up and left on
   * two curves would be an L however closely their timings were matched, and it
   * also carries the sentence out and the mark across, so none of the four can
   * finish while another is still going.
   */
  const slid = progressInOut(g, V.slide.at, m.move);

  /**
   * The mark falls in from above the frame and then breathes — the same pair
   * VIDEO 20's mascot floats on, so the two readings of one character move
   * alike. The float starts only once it has landed, or the fall would arrive
   * somewhere slightly different every time it is retimed.
   */
  const fell = progressInOut(g, V.mark.at, m.move);
  const markX = S.mark.x + (S.slide.mark.x - S.mark.x) * slid;
  const markY =
    S.mark.from + (S.mark.y + (S.slide.mark.y - S.mark.y) * slid - S.mark.from) * fell +
    (fell >= 0.999
      ? Math.sin(((g - V.mark.at) / S.mark.float.period) * Math.PI * 2) * S.mark.float.amount
      : 0);

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
      <AbsoluteFill style={FENCE}>
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
            left: S.rect.x - S.slide.left * slid,
            top: S.rect.y + dropped - S.slide.up * slid,
            width: S.rect.w,
            height: S.rect.h,
          }}
        />
        {/* ── the three names the voice lists ──────────────────────────── */}
        <div style={{ opacity: 1 - answered }}>
          {V.labels.map((l, i) => {
            const at = S.labels.at(l.side, S.labels.steps[i]);
            return (
              <Chip
                key={l.text}
                label={l.text}
                x={at.x}
                y={at.y}
                at={upBy(l.at)}
                anchor={at.anchor}
                tone="warn"
                size={S.labels.size}
                pill
                solid
              />
            );
          })}
        </div>

        {/* ⚠ NO PILL, AND THAT IS THE POINT. The three above are things being
            named; this is the instruction about them. */}
        {g >= V.stop.at && (
          <div style={{ opacity: answered * (1 - marked) }}>
            <Line
              text={V.stop.text}
              x={S.stop.x}
              y={S.stop.y}
              at={local(V.stop.at, V.at)}
              size={S.stop.size}
              weight={theme.text.display.weight}
              color={theme.color.warn}
            />
          </div>
        )}

        {/* ── the mark, level with the logo, and the sentence under it ───── */}
        {g >= V.mark.at && (
          <>
            <TuntunMark x={markX} y={markY} height={S.mark.h} opacity={fell} />
            {/* ⚠ TWO Lines, NOT ONE WRAPPED BLOCK. Simon chose where the break
                falls; a wrap would put it wherever the width happens to. */}
            {slid < 0.999 && V.mark.lines.map((row, i) => (
              <Line
                key={row}
                text={row}
                x={S.line.x}
                y={S.line.y0 + i * S.line.lead}
                at={local(V.mark.at, V.at) + m.move}
                size={S.line.size}
                weight={theme.text.title.weight}
                color={c.indigo}
              />
            ))}
          </>
        )}
      </AbsoluteFill>
      </AbsoluteFill>
    </Stage>
  );
};
