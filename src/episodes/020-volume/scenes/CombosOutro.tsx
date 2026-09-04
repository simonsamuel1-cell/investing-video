/**
 * SCENE TRANSISI 2 — the combos chapter hands over to SC11. `from 8178`
 *
 * The same gesture as the one at f4958, one chapter along, and it replaces the
 * full-screen CHAPTER 03 card that used to drop over a chart still being read.
 *
 *   1. the chapter's own picture SHRINKS into "cara baca volume", the card it
 *      belongs to, while the roadmap board reveals underneath it;
 *   2. "cara pakai volume" — the box on the right — lights up and the camera
 *      closes on it;
 *   3. and then it fades, with SC11 already running underneath.
 *
 * ⚠ THE PICTURE IS THE REAL SCENE, FROZEN, not a copy of it. `Freeze` holds
 * CG-C on its own last frame, so whatever that chapter ends on is exactly what
 * shrinks — a redrawn stand-in would have to be updated every time the chapter
 * changes, and would be wrong the first time someone forgot.
 *
 * ⚠ IT IS MOUNTED LAST, ABOVE EVERYTHING. SC11 belongs to CG-A, which is drawn
 * on top of the tiling; this has to be over CG-A or it would be transitioning
 * underneath the scene it is transitioning to.
 *
 * ⚠ IT COVERS THE FIRST 138 FRAMES OF SC11, which has NO silence in front of
 * it. Every duration here is on a budget for that reason.
 */
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";
import {
  GridGround, RoadmapCards, ROADMAP_CARD, ROADMAP_SLOTS,
  shrinkClip, cardPush,
  useMotion, usePalette, progress, progressInOut, theme,
} from "../../../core";
import { BLOCK, MAP_LABELS, TRANS2, local } from "../data/timing";
import { CombosGroupV3 } from "./CombosGroupV3";
import { roadmapContents } from "./MainChartGroup";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = TRANS2.at;
/**
 * ⚠ THE LAST FRAME OF THE CHAPTER, IN CG-C'S OWN NUMBERING. CG-C is mounted
 * from BLOCK.SC07, so its local frame is the global one minus that; freezing on
 * a global number would hold it 4954 frames into a chapter 3260 frames long and
 * draw nothing at all.
 */
const FROZEN = TRANS2.at - BLOCK.SC07 - 1;
// ═══════════════════════════════════════════════════════════════════════════

export const CombosOutro = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;

  /**
   * ⚠ ONE CURVE DRIVES THE HAND-OVER. `map` shrinks the picture into the card
   * AND reveals the board behind it, so the picture cannot arrive before the
   * card that catches it exists.
   */
  const map = progressInOut(g, TRANS2.at, TRANS2.over);
  const push = progress(g, TRANS2.push.at, TRANS2.push.over);
  const clear = progress(g, TRANS2.clear.at, TRANS2.clear.over);
  if (clear >= 0.999) return null;

  const scale = 1 - map * (1 - ROADMAP_CARD.w / theme.canvas.width);
  const slot = ROADMAP_SLOTS[TRANS2.landing];
  /**
   * ⚠ CORRECTED FOR THE FRAME'S EMPTY EDGES. What shrinks is the whole
   * 1920x1080 canvas, but the chapter's PICTURE is the board and the reading
   * under it — the caption band is empty by design and the rail is only on one
   * side. Centring the canvas would leave the scene low and left inside the
   * card with paper around it.
   */
  const seen = { top: 176, bottom: 907, left: 113, right: 1799 };
  const off = theme.canvas.height / 2 - (seen.top + seen.bottom) / 2;
  const offX = theme.canvas.width / 2 - (seen.left + seen.right) / 2;
  const centre = {
    x: slot.x + ROADMAP_CARD.w / 2 - theme.canvas.width / 2 + offX * scale,
    y: slot.y + ROADMAP_CARD.h / 2 - theme.canvas.height / 2 + off * scale,
  };

  return (
    <AbsoluteFill style={{ opacity: 1 - clear }}>
      {/* ⚠ WHITE, NOT THE EPISODE'S PAPER — the chapter it is carrying out is
          white to its own edges, so the ground does not change under the
          shrink. */}
      <AbsoluteFill style={{ backgroundColor: c.cardBg }} />

      {/* ── the board, and the camera closing on the next chapter ───────── */}
      <div style={{ position: "absolute", inset: 0, ...cardPush(push, TRANS2.next, TRANS2.push.amount) }}>
        <GridGround f={f} opacity={map} />
        <RoadmapCards
          labels={MAP_LABELS}
          reveal={map}
          landing={TRANS2.landing}
          /* ⚠ SCENE-LOCAL. RoadmapCards reads the frame of the group it is
             mounted in, and this group starts at f8178. */
          cardsAt={TRANS2.cards.map((q) => local(q, FROM))}
          cardDur={TRANS2.cardDur}
          glow={{ card: TRANS2.next, at: local(TRANS2.glow.at, FROM), over: TRANS2.glow.over }}
          /* The landing card draws no picture of its own: the scene shrinking
             into it IS its picture. */
          contents={roadmapContents(
            f,
            m,
            [0, 1, 2, 3].map((i) =>
              i === TRANS2.landing
                ? 0
                : local(TRANS2.cards[i > TRANS2.landing ? i - 1 : i], FROM),
            ),
            TRANS2.landing,
          )}
        />

        {/* ⚠ CLIP OUTSIDE, SCALE INSIDE — a clip-path on the scaling wrapper
            scales with it and never matches the card it is clipping into. */}
        <div style={{ position: "absolute", inset: 0, clipPath: shrinkClip(map, TRANS2.landing) }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform:
                `translate(${(centre.x * map).toFixed(1)}px, ${(centre.y * map).toFixed(1)}px) ` +
                `scale(${scale.toFixed(4)})`,
              transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
            }}
          >
            <Freeze frame={FROZEN}>
              <CombosGroupV3 />
            </Freeze>
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
