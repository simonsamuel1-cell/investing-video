/**
 * SCENE TRANSISI 3 — the chapter hands over to the bonus.  `from 16647`
 *
 * The same gesture as CombosOutro with one beat added:
 *
 *   1. the two product windows SHRINK into the last card on the board, while
 *      the board reveals underneath them;
 *   2. the whole board LEAVES UPWARD and a card that was never on it rises
 *      from below — "Bonus Tips - Common Mistakes";
 *   3. that card is pushed into the frame and faded off it, with SC18 already
 *      running underneath.
 *
 * ⚠ THE PICTURE IS THE REAL SCENE, FROZEN. `Freeze` holds SC17 on its own last
 * frame, so whatever it ends on is exactly what shrinks. A redrawn stand-in
 * would be wrong the first time anyone changed SC17 and forgot.
 *
 * ⚠ IT IS MOUNTED LAST, ABOVE EVERYTHING — it has to be over SC18 or it would
 * be transitioning underneath the scene it is transitioning to.
 *
 * ⚠ THE NEW CARD IS NOT ON THE BOARD, AND THAT IS THE POINT. The four cards are
 * the video's chapters; this one is the thing that comes after them. Putting it
 * in the row would have said it was a fifth chapter, and the board leaving
 * before it arrives is what says it is not.
 */
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";
import {
  GridGround, RoadmapCards, ROADMAP_CARD, ROADMAP_SLOTS, shrinkClip,
  useMotion, usePalette, useShadow, progress, progressInOut, theme,
} from "../../../core";
import { BLOCK, BONUS, MAP_LABELS, SPIKES, local } from "../data/timing";
import { SC17 } from "./SC17";
import { roadmapContents } from "./MainChartGroup";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BONUS.at;
/** ⚠ SC17'S OWN LAST FRAME, in SC17's numbering. Freezing on a global number
 *  would hold it 16646 frames into a scene 569 frames long and draw nothing. */
const FROZEN = BONUS.at - BLOCK.SC17 - 1;
/** Where the bonus card comes to rest: the middle of the frame. */
const REST = {
  x: theme.canvas.width / 2 - ROADMAP_CARD.w / 2,
  y: theme.canvas.height / 2 - ROADMAP_CARD.h / 2,
};
// ═══════════════════════════════════════════════════════════════════════════

export const BonusOutro = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const shadow = useShadow();
  const g = f + FROM;

  /** ⚠ ONE CURVE SHRINKS THE PICTURE AND REVEALS THE BOARD, so the picture
   *  cannot arrive before the card that catches it exists. */
  const map = progressInOut(g, BONUS.at, BONUS.over);
  const rise = progressInOut(g, BONUS.rise.at, BONUS.rise.over);
  /** ⚠ THREE SEPARATE CURVES NOW. Growing and vanishing on one of them read as
   *  a single gesture; apart, the card arrives, holds long enough to be read,
   *  and only then hands the frame over. */
  const push = progressInOut(g, BONUS.grow.at, BONUS.grow.over);
  const clear = progress(g, BONUS.fade.at, BONUS.fade.over);
  if (clear >= 0.999) return null;

  const scale = 1 - map * (1 - ROADMAP_CARD.w / theme.canvas.width);
  const slot = ROADMAP_SLOTS[BONUS.landing];
  /**
   * ⚠ CORRECTED FOR THE FRAME'S EMPTY EDGES. What shrinks is the whole
   * 1920x1080 canvas, but SC17's PICTURE is the two windows — the caption band
   * and the paper either side of them are empty by design. Centring the canvas
   * would leave the pair low and left inside the card with ground around it.
   */
  const PAIR_W = SPIKES.win.w * 2 + SPIKES.win.gap;
  const seen = {
    top: SPIKES.win.y,
    bottom: SPIKES.win.y + SPIKES.win.h,
    left: theme.canvas.width / 2 - PAIR_W / 2,
    right: theme.canvas.width / 2 + PAIR_W / 2,
  };
  const off = theme.canvas.height / 2 - (seen.top + seen.bottom) / 2;
  const offX = theme.canvas.width / 2 - (seen.left + seen.right) / 2;
  const centre = {
    x: slot.x + ROADMAP_CARD.w / 2 - theme.canvas.width / 2 + offX * scale,
    y: slot.y + ROADMAP_CARD.h / 2 - theme.canvas.height / 2 + off * scale,
  };

  /** The board's exit and the new card's entrance are ONE number, so the card
   *  cannot arrive before the row it replaces has gone. */
  const lift = rise * (theme.canvas.height + 220);

  return (
    <AbsoluteFill style={{ opacity: 1 - clear }}>
      {/* ⚠ THE SAME GROUND SC17 STANDS ON, so the shrink does not change the
          room it is happening in. */}
      <AbsoluteFill style={{ background: theme.color.glassBg }} />

      {/* ⚠ THE GROUND STAYS — Simon's correction. It is not inside the lifted
          group and it does not fade with the cards: the bonus card arrives INTO
          this room rather than bringing a second one with it, which is what
          makes the two halves one move instead of two cuts. */}
      <GridGround f={f} opacity={map} />

      {/* ── the cards, and only the cards, leaving upward ────────────────── */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(-lift).toFixed(1)}px)` }}>
        <RoadmapCards
          labels={MAP_LABELS}
          reveal={map}
          landing={BONUS.landing}
          /* ⚠ SCENE-LOCAL. RoadmapCards reads the frame of the group it is
             mounted in, and this one starts at f16647. */
          /* ⚠ STAGGERED, LIKE TRANS2'S. Three cards opening together is one
             event; opening 12 frames apart they are three, and the board is
             built rather than switched on. */
          cardsAt={BONUS.cards.map((q) => local(q, FROM))}
          cardDur={BONUS.cardDur}
          contents={roadmapContents(
            f,
            m,
            [0, 1, 2, 3].map((i) =>
              i === BONUS.landing
                ? 0
                : local(BONUS.cards[i > BONUS.landing ? i - 1 : i], FROM),
            ),
            BONUS.landing,
          )}
        />

        {/* ⚠ CLIP OUTSIDE, SCALE INSIDE — a clip-path on the scaling wrapper
            scales with it and never matches the card it is clipping into. */}
        <div style={{ position: "absolute", inset: 0, clipPath: shrinkClip(map, BONUS.landing) }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform:
                `translate(${(centre.x * map).toFixed(1)}px, ${(centre.y * map).toFixed(1)}px) ` +
                `scale(${scale.toFixed(4)})`,
            }}
          >
            <Freeze frame={FROZEN}>
              <SC17 />
            </Freeze>
          </div>
        </div>
      </div>

      {/* ── and the card that was never on it, rising into the middle ───── */}
      {rise > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: REST.x,
            top: REST.y,
            width: ROADMAP_CARD.w,
            height: ROADMAP_CARD.h,
            transform:
              `translateY(${((1 - rise) * (theme.canvas.height + 220)).toFixed(1)}px) ` +
              `scale(${(1 + BONUS.grow.amount * push).toFixed(4)})`,
            transformOrigin: `${ROADMAP_CARD.w / 2}px ${ROADMAP_CARD.h / 2}px`,
            borderRadius: theme.shape.panelRadius,
            background: c.cardBg,
            border: `${theme.shape.hairline}px solid ${c.border}`,
            boxShadow: shadow.lift,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: BONUS.card.pad,
            boxSizing: "border-box",
            fontFamily: theme.text.family,
            fontSize: BONUS.card.size,
            fontWeight: 800,
            lineHeight: 1.25,
            textAlign: "center",
            color: c.ink,
          }}
        >
          {BONUS.card.title}
        </div>
      )}
    </AbsoluteFill>
  );
};
