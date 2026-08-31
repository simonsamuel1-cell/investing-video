/**
 * THE ROADMAP AGAIN — one more chapter later. `from 6040 · dur 91`
 *
 * SC01 shrank the broker session into the roadmap's FIRST card. The closing
 * roadmap at 4160 shrank the reading chart into its SECOND. This one shrinks
 * the Bollinger scene into its THIRD, and calls out the fourth — "Cara Pakai
 * Indikator" — which is where the episode goes next.
 *
 * IT DISSOLVES OFF THE CARD, the same hand-off the other two roadmaps make:
 * the camera closes on the fourth card and the whole frame fades, revealing
 * SC11 which has already begun drawing underneath. One opacity on the wrapper
 * that carries `cardPush`, so the picture that walks into the card is the same
 * picture that leaves.
 *
 * ═══ ⚠ AND IT DOES NOT REDRAW CG-B — IT FREEZES IT ═══
 *
 * The picture that shrinks has to be identical to the one underneath on the
 * frame the shrink starts, or the handover reads as a cut. The other two
 * roadmaps achieve that by importing the scene's own data and drawing it
 * again; that works because what they shrink is a CARD with a chart in it.
 *
 * CG-B's closing picture is not a card. It is a full-bleed tape under a camera
 * that has been stretched, panned and travelled through four framings, plus a
 * heading, a badge and a quote. Redrawing that would be several hundred lines
 * duplicating a moving target — and it would be wrong the first time anything
 * in CG-B changed.
 *
 * So it is the SAME COMPONENT, held still: `<Freeze frame={FREEZE}>` makes
 * `useCurrentFrame()` return CG-B's own local frame for 6040 and nothing else
 * is needed. Identical by construction rather than by careful copying.
 */
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";
import { RoadmapGround, RoadmapCards, CARD, CARDS, cardPush } from "./Scene01";
import { BandsGroup } from "../continuity/BandsGroup";
import { theme } from "../theme";
import { progress, progressInOut } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this scene is mounted, needed to quote Simon's frames as globals. */
const FROM = 6040;
const at = (global: number) => global - FROM;
/**
 * CG-B's own local frame for global 6040 — the group is mounted at 4227. This
 * is the ONE number that ties the two together; if CG-B ever moves, this is
 * what moves with it.
 */
const FREEZE = 6040 - 4227;

/**
 * ═══ THE TIMELINE ═══
 *
 * 6040 – 6070   the Bollinger scene shrinks into the Bollinger Bands card
 * 6048, 6054, 6060   the other three cards open, one after another
 * 6070 – 6090   "CARA PAKAI INDIKATOR" takes the border and glow
 * 6096 – 6130   the camera pushes into that card
 *
 * The cascade fits INSIDE the shrink and the last card lands on the exact
 * frame the picture does — the roadmap has to arrive as one object, not as a
 * picture plus three latecomers. Same rhythm as 4160, for the same reason.
 */
const T = {
  map: at(6040),
  mapDur: 30,
  cards: [at(6048), at(6054), at(6060)],
  cardDur: 10,
  glow: at(6070),
  glowOver: 20,
  push: at(6096),
  pushOver: 34,
  /**
   * ⚠ THE FADE CANNOT START BEFORE 6116. That is the frame SC11 mounts on, and
   * a dissolve begun any earlier would reveal CG-B's held chart for a few
   * frames and only then cut to SC11 — the old scene flashing back through the
   * new one. It is not a stylistic margin; it is the earliest frame there is
   * anything underneath to reveal.
   *
   * Fourteen frames, so it is fully transparent ON 6130 — this scene's last.
   * It starts INSIDE the push for the same reason the other roadmaps' do: a
   * push that finishes and then dissolves is two moves, a push that dissolves
   * while still travelling is one.
   */
  fade: at(6116),
  fadeOver: 14,
};
/** The card the picture lands in. 2 is Bollinger Bands — see CARDS in SC01. */
const LANDING = 2;
/** The card the episode is handed to. 3 is Cara Pakai Indikator. */
const HANDOFF = 3;
/** How far the camera closes on it. The other two roadmaps use the same. */
const PUSH_AMOUNT = 0.55;
/** How far inside the card's left and right edges the picture sits. */
const INSET = 10;
// ═══════════════════════════════════════════════════════════════════════════

export const SceneRoadmap2 = () => {
  const f = useCurrentFrame();

  const shrink = progressInOut(f, T.map, T.mapDur);
  const glow = progress(f, T.glow, T.glowOver);
  const push = progressInOut(f, T.push, T.pushOver);
  /* `1 - progress`, the same form SceneRoadmap uses — `fadeOut`'s duration
     parameter is pinned to the theme's own reveal length. */
  const out = 1 - progress(f, T.fade, T.fadeOver);

  /**
   * THE SHRINK. The whole frame goes into the card, so the origin is the
   * frame's own top-left and the translate carries that corner to the card's.
   *
   * FILL BY WIDTH. The frame is 1920×1080 and a card is 536×302 — 1.78 against
   * 1.77, so the fit is very nearly exact and the strips left above and below
   * are three pixels. That is luck rather than design, and the rule is still
   * width, because the card's own white is what shows if it is ever not.
   */
  const s0 = (CARD.w - INSET * 2) / theme.layout.width;
  const scale = 1 - (1 - s0) * shrink;
  const c = CARDS[LANDING];
  const land = {
    x: c.x + INSET,
    y: c.y + (CARD.h - theme.layout.height * s0) / 2,
  };
  const mapX = land.x * shrink;
  const mapY = land.y * shrink;

  /**
   * THE MASK — a screen-space window closing from the whole frame down to the
   * landing card's rounded rect, so the picture is clipped INTO the card
   * rather than parked on it. It lives on an OUTER, untransformed element: a
   * clip-path on the scaling wrapper would scale with it and never match.
   */
  const lerp = (a: number, b: number) => a + (b - a) * shrink;
  const clip =
    shrink <= 0.001
      ? undefined
      : `inset(${lerp(0, c.y).toFixed(1)}px ` +
        `${lerp(0, theme.layout.width - c.x - CARD.w).toFixed(1)}px ` +
        `${lerp(0, theme.layout.height - c.y - CARD.h).toFixed(1)}px ` +
        `${lerp(0, c.x).toFixed(1)}px round ${(theme.layout.radius.md * shrink).toFixed(1)}px)`;

  return (
    /* A TRANSPARENT fill, NOT SafeArea — SafeArea paints an opaque ground, and
       the white this scene needs belongs to the wrapper below so that a fade,
       when one is added, has something to reveal. */
    <AbsoluteFill
      style={{ fontFamily: theme.type.family, color: theme.colors.text }}
    >
      {/* everything is ONE unit for the push: a single transform here is what
          makes the whole frame close on the fourth card, rather than the card
          growing inside a frame that stays still */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: theme.colors.bg,
          ...cardPush(push, HANDOFF, PUSH_AMOUNT),
          opacity: out,
        }}
      >
        <RoadmapGround f={f} reveal={shrink} />

        <RoadmapCards
          f={f}
          reveal={shrink}
          cardsAt={T.cards}
          cardDur={T.cardDur}
          landing={LANDING}
          glow={glow}
          glowOn={HANDOFF}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: clip,
            WebkitClipPath: clip,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate(${mapX.toFixed(1)}px, ${mapY.toFixed(1)}px) scale(${scale.toFixed(4)})`,
              transformOrigin: "0px 0px",
            }}
          >
            <Freeze frame={FREEZE}>
              <BandsGroup />
            </Freeze>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
