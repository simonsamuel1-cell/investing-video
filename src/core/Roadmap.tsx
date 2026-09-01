/**
 * core/Roadmap.tsx — the four-card contents page, and the shrink that lands a
 * scene inside one of them.
 *
 * Ported from episodeMovingAverage, where the geometry and the timing were
 * tuned and approved. It is one object carried across an episode: the same four
 * cards open the roadmap, mark each chapter, and close the video — never
 * rebuilt, only re-lit.
 *
 * ═══ THE SHRINK IS THE TRANSITION ═══
 *
 * The outgoing scene does not fade or wipe; it SHRINKS into the card that will
 * stand for it, while the other three open beside it. That is why `landing`
 * exists: the card catching the picture draws no thumbnail of its own, because
 * the thing arriving IS its thumbnail.
 *
 * ⚠ `shrinkClip` MUST LIVE ON AN OUTER, UNTRANSFORMED ELEMENT. A clip-path on
 * the scaling wrapper scales with it and never matches the card it is supposed
 * to be clipping into — the picture would shrink toward the card and stay
 * rectangular past its edges.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette, useShadow } from "./palette";
import { progress } from "./helpers";

/** The card, and the space around it. Canvas pixels. */
export const ROADMAP_CARD = { w: 536, h: 302, gap: 60, label: 14 };

/**
 * Where the four cards sit: one across the top, three in a row beneath it.
 * Derived from the margins, so the row spans the active area exactly.
 */
const ROW_Y = 570;
export const ROADMAP_SLOTS = [
  { x: theme.canvas.width / 2 - ROADMAP_CARD.w / 2, y: 126 },
  { x: theme.margin.left, y: ROW_Y },
  { x: theme.margin.left + ROADMAP_CARD.w + ROADMAP_CARD.gap, y: ROW_Y },
  { x: theme.margin.left + (ROADMAP_CARD.w + ROADMAP_CARD.gap) * 2, y: ROW_Y },
];

/**
 * The clip that lands a full-frame picture inside a card.
 *
 * Interpolates the four insets from "the whole canvas" to "exactly this card",
 * with the corner radius arriving alongside — so the scene is clipped INTO the
 * card rather than merely parked on top of it.
 */
export const shrinkClip = (shrink: number, card = 0) => {
  if (shrink <= 0.001) return undefined;
  const c = ROADMAP_SLOTS[card];
  const lerp = (a: number, b: number) => a + (b - a) * shrink;
  return (
    `inset(${lerp(0, c.y).toFixed(1)}px ` +
    `${lerp(0, theme.canvas.width - c.x - ROADMAP_CARD.w).toFixed(1)}px ` +
    `${lerp(0, theme.canvas.height - c.y - ROADMAP_CARD.h).toFixed(1)}px ` +
    `${lerp(0, c.x).toFixed(1)}px round ${(theme.shape.panelRadius * shrink).toFixed(1)}px)`
  );
};

/**
 * The camera closing on one card — for handing the roadmap to the scene that
 * card stands for. `amount` is how far past 1.0 the scale reaches.
 */
export const cardPush = (p: number, card: number, amount: number) => {
  const c = ROADMAP_SLOTS[card];
  const cx = c.x + ROADMAP_CARD.w / 2;
  const cy = c.y + ROADMAP_CARD.h / 2;
  return {
    transform:
      `translate(${((theme.canvas.width / 2 - cx) * p).toFixed(1)}px, ` +
      `${((theme.canvas.height / 2 - cy) * p).toFixed(1)}px) ` +
      `scale(${(1 + amount * p).toFixed(4)})`,
    transformOrigin: `${cx}px ${cy}px`,
  };
};

export const RoadmapCards = ({
  labels,
  reveal,
  landing,
  cardsAt,
  cardDur,
  contents,
  glow,
}: {
  /** Four captions, in slot order: top, then left to right. */
  labels: [string, string, string, string];
  /** 0→1. The landing card's frame rides this; the others use `cardsAt`. */
  reveal: number;
  /** Which card catches the shrinking scene. It draws no content of its own. */
  landing: number;
  /** One frame per card that is NOT the landing one, in card order. */
  cardsAt: number[];
  cardDur: number;
  /**
   * What stands INSIDE a card, by slot. Sparse: a hole means an empty card,
   * which is the normal state until that chapter is reached.
   *
   * ⚠ CANVAS COORDINATES, not card-local ones. The node is dropped into a
   * full-frame layer so a `Layer`-based chart (which draws into a 1920x1080
   * svg) lands where its own box says it does. Position content against
   * ROADMAP_SLOTS, not against the card's corner.
   */
  contents?: React.ReactNode[];
  /**
   * The one card being spoken about. It gets the indigo halo from the palette's
   * SHADOWS, ramped over `over` frames so it lights rather than snaps.
   *
   * ⚠ THE HALO IS ITS OWN ELEMENT. Fading a box-shadow means fading the whole
   * element it sits on, which would take the card's fill and border with it —
   * so the glow is drawn as a separate rectangle behind the card.
   */
  glow?: { card: number; at: number; over: number };
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  if (reveal <= 0.001) return null;
  const others = ROADMAP_SLOTS.map((_, i) => i).filter((i) => i !== landing);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {ROADMAP_SLOTS.map((slot, n) => {
        /* ⚠ THE LANDING CARD RIDES THE SHRINK. Its frame and caption arrive
           with the picture, because they ARE the picture arriving; the other
           three open one after another once the shrink is under way. */
        const a =
          n === landing ? reveal : progress(f, cardsAt[others.indexOf(n)], cardDur);
        if (a <= 0.001) return null;
        const lit =
          glow && glow.card === n ? progress(f, glow.at, glow.over) : 0;
        return (
          <div key={labels[n]} style={{ opacity: a }}>
            {/* the halo, BEHIND the card and on its own opacity, so lighting a
                card never touches the card's own fill or border */}
            {lit > 0.001 ? (
              <div
                style={{
                  position: "absolute",
                  left: slot.x,
                  top: slot.y,
                  width: ROADMAP_CARD.w,
                  height: ROADMAP_CARD.h,
                  borderRadius: theme.shape.panelRadius,
                  boxShadow: shadow.glow,
                  opacity: lit,
                }}
              />
            ) : null}
            <div
              style={{
                position: "absolute",
                left: slot.x,
                top: slot.y,
                width: ROADMAP_CARD.w,
                height: ROADMAP_CARD.h,
                borderRadius: theme.shape.panelRadius,
                background: c.cardBg,
                border: `${theme.shape.hairline}px solid ${c.border}`,
              }}
            />
            {/* ⚠ CLIPPED TO THE CARD. Content is authored in canvas
                coordinates, so nothing stops it drawing past the card's edge
                except this — and a bar hanging outside the frame reads as a
                bug, not as a flourish. */}
            {contents?.[n] ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath:
                    `inset(${slot.y}px ${theme.canvas.width - slot.x - ROADMAP_CARD.w}px ` +
                    `${theme.canvas.height - slot.y - ROADMAP_CARD.h}px ${slot.x}px ` +
                    `round ${theme.shape.panelRadius}px)`,
                }}
              >
                {contents[n]}
              </div>
            ) : null}
            <div
              style={{
                position: "absolute",
                left: slot.x,
                top: slot.y + ROADMAP_CARD.h + ROADMAP_CARD.label,
                width: ROADMAP_CARD.w,
                textAlign: "center",
                fontFamily: theme.text.family,
                /* under the smallest role in the scale: this names a card, it
                   does not compete with what is on it */
                fontSize: theme.text.tag.size,
                fontWeight: 700,
                /* indigo, not ink: these name chapters rather than state
                   findings, and the brand colour separates them from the
                   headings inside the cards */
                color: c.indigo,
                letterSpacing: 0.5,
              }}
            >
              {labels[n]}
            </div>
          </div>
        );
      })}
    </div>
  );
};
