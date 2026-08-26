/**
 * THE CLOSING ROADMAP — the contents page again, one chapter later.
 * `from 4160 · dur 91`
 *
 * SC01 opened by shrinking the broker session into the roadmap's FIRST card.
 * This closes the moving-average chapter by shrinking the reading chart into
 * its SECOND — the Moving Average card. Same ground, same four cards, same
 * captions, same move: only the card that catches it differs, which is why
 * `RoadmapGround` and `RoadmapCards` live in SC01 and take a `landing`.
 *
 * IT IS MOUNTED LAST, and still overlaps — but only by design now. CG-B opens
 * at 4227 and this runs to 4251, so its last 24 frames are the CROSS-FADE:
 * this scene dissolves off the top of a Bollinger Bands that has already begun
 * drawing underneath. Mounted anywhere else in the tree, CG-B would be over it
 * and there would be nothing to dissolve.
 *
 * ⚠ AND IT DRAWS SC05's CHART, not a likeness of it. The picture has to be
 * identical on the frame the shrink starts or the handover reads as a cut, so
 * the bars, both averages, both crossing marks and the quote all come from
 * `READING_FINAL` — SC05's own data at its own final pitch.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Layer } from "../components/ChartFrame";
import { HighlightBox } from "../components/HighlightBox";
import { QuoteBox } from "../components/QuoteBox";
import { TitleChip } from "../components/TitleChip";
import { RoadmapGround, RoadmapCards, CARD, CARDS, cardPush } from "./Scene01";
import { READING_FINAL as R } from "./Scene05";
import { theme } from "../theme";
import { progress, progressInOut } from "../helpers";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this scene is mounted, needed to quote Simon's frames as globals. */
const FROM = 4160;
const at = (global: number) => global - FROM;

/**
 * ═══ THE TIMELINE ═══
 *
 * 4160 – 4190   the chart shrinks into the Moving Average card
 * 4168, 4174, 4180   the other three cards open, one after another
 * 4190 – 4210   the BOLLINGER BANDS card takes the border and glow — the same
 *        call-out SC01 puts on Moving Average before it pushes into it, now
 *        pointing at where the episode goes next
 * 4216 – 4250   the camera pushes into that card, and dissolves off it
 *
 * ONE SECOND, not two and a third. SC01's shrink takes 70 frames because it is
 * the first thing the episode does and the viewer has never seen the roadmap;
 * here they have, and 70 frames spent re-showing a picture they already know
 * is a wait.
 *
 * The card cues are compressed WITH it rather than left where they were. SC01
 * lands the last card on the exact frame the shrink finishes — the roadmap
 * arrives as one object, not as a picture plus three latecomers — and that
 * only holds if the cascade fits inside the shrink. Three 15-frame reveals do
 * not fit in 30, so they are 10 apart and 10 long: 4180 + 10 = 4190 = the
 * frame the chart lands.
 */
const T = {
  map: at(4160),
  mapDur: 30,
  cards: [at(4168), at(4174), at(4180)],
  cardDur: 10,
  /** The call-out on the card the episode is about to hand over to. */
  glow: at(4190),
  glowOver: 20,
  /** The push into it, and the dissolve off it. */
  push: at(4216),
  pushOver: 34,
  /**
   * The fade starts INSIDE the push, not after it. A push that finishes and
   * then dissolves is two moves; a push that dissolves while still travelling
   * is one — and it is the same reason the episode's camera cuts blur at their
   * fastest frame rather than at their end.
   */
  fade: at(4230),
  fadeOver: 20,
};
/** The card the chart lands in. 1 is Moving Average — see CARDS in SC01. */
const LANDING = 1;
/** The card the episode is handed to. 2 is Bollinger Bands. */
const HANDOFF = 2;
/** How far the camera closes on it. SC01's push into its own card is the same. */
const PUSH_AMOUNT = 0.55;
// ═══════════════════════════════════════════════════════════════════════════

/** A series as a path in the chart's final grid. */
const pathOf = (v: (number | null)[]) => {
  let d = "";
  v.forEach((n, i) => {
    if (n === null) return;
    d += `${d === "" ? "M" : "L"}${R.x(i).toFixed(1)},${R.y(n).toFixed(1)} `;
  });
  return d.trim();
};

export const SceneRoadmap = () => {
  const f = useCurrentFrame();

  /**
   * THE SHRINK. `transformOrigin` is the chart card's own top-left corner, so
   * the scale keeps that corner still and the translate then carries it to the
   * roadmap card — one move rather than a scale that also drifts.
   */
  const shrink = progressInOut(f, T.map, T.mapDur);
  /** The Bollinger card's call-out: reveals over `glowOver`, then holds. */
  const glow = progress(f, T.glow, T.glowOver);
  /**
   * THE HANDOVER. The camera closes on the Bollinger Bands card and dissolves
   * off it, revealing the scene that has already started drawing underneath.
   * The origin is that card's own centre — which happens to be the middle of
   * the frame, so the push reads as a straight walk into it.
   */
  const push = progressInOut(f, T.push, T.pushOver);
  const out = 1 - progress(f, T.fade, T.fadeOver);
  /**
   * FILL BY WIDTH, less 10px a side. The chart card is proportionally wider
   * than a roadmap card, so strips open above and below it; they are the
   * roadmap card's own white, not a hole, because the mask closes to that
   * card's rect regardless of what fills it.
   */
  const s0 = (CARD.w - 20) / R.box.w;
  const scale = 1 - (1 - s0) * shrink;
  const land = {
    x: CARDS[LANDING].x + (CARD.w - R.box.w * s0) / 2,
    y: CARDS[LANDING].y + (CARD.h - R.box.h * s0) / 2,
  };
  const mapX = (land.x - R.box.x) * shrink;
  const mapY = (land.y - R.box.y) * shrink;
  /**
   * THE MASK. A screen-space window that closes from the whole frame down to
   * the landing card's rounded rect, so the chart is clipped INTO the card
   * rather than merely parked on it. It lives on an OUTER, untransformed
   * element — a clip-path on the scaling wrapper would scale with it and never
   * match the card.
   */
  const lerp = (a: number, b: number) => a + (b - a) * shrink;
  const c = CARDS[LANDING];
  const clip =
    shrink <= 0.001
      ? undefined
      : `inset(${lerp(0, c.y).toFixed(1)}px ` +
        `${lerp(0, theme.layout.width - c.x - CARD.w).toFixed(1)}px ` +
        `${lerp(0, theme.layout.height - c.y - CARD.h).toFixed(1)}px ` +
        `${lerp(0, c.x).toFixed(1)}px round ${(theme.layout.radius.md * shrink).toFixed(1)}px)`;

  return (
    /*
     * EVERYTHING is one unit for the push and the dissolve: a single transform
     * and a single opacity on this wrapper is what makes the whole frame close
     * on the Bollinger card and fade away as one picture, rather than the card
     * growing inside a frame that stays still.
     */
    /*
     * A TRANSPARENT fill, NOT SafeArea. The white ground belongs to the wrapper
     * that FADES; put it on an outer element that does not and the dissolve has
     * nothing to reveal — Bollinger Bands would stay hidden behind a white
     * sheet for the whole transition. Same trap SC05's overlay hit.
     */
    <AbsoluteFill
      style={{
        fontFamily: theme.type.family,
        color: theme.colors.text,
      }}
    >
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

        {/*
        SC05's heading, carried across the seam and handed to the shrink. It is
        on screen at 4160 and the roadmap has none, so without this it would
        blink off on the handover frame — the one frame that has to be
        indistinguishable from what came before it.
      */}
        <TitleChip
          text="Cara Baca Moving Average"
          f={f}
          at={-999}
          opacity={1 - shrink}
        />

        {/* the mask that closes the chart into the roadmap's Moving Average card */}
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
              transformOrigin: `${R.box.x}px ${R.box.y}px`,
            }}
          >
            {/* SC05's card, chart and marks — the same picture, drawn from the
              same data, so the frame the shrink starts on is not a cut */}
            <div
              style={{
                position: "absolute",
                left: R.box.x,
                top: R.box.y,
                width: R.box.w,
                height: R.box.h,
                borderRadius: theme.layout.radius.lg,
                background: theme.colors.surface,
                border: `${theme.layout.border.thin}px solid ${theme.colors.border}`,
              }}
            />

            <Layer>
              <defs>
                <clipPath id="mapCard">
                  <rect
                    x={R.box.x}
                    y={R.box.y}
                    width={R.box.w}
                    height={R.box.h}
                    rx={theme.layout.radius.lg}
                  />
                </clipPath>
              </defs>
              <g clipPath="url(#mapCard)">
                {R.bars.map((b, i) => {
                  const x = R.x(i);
                  const top = Math.min(R.y(b.o), R.y(b.c));
                  const h = Math.max(1.5, Math.abs(R.y(b.c) - R.y(b.o)));
                  /* one bar, one colour — see ChartFrame */
                  const fill =
                    b.c >= b.o
                      ? theme.colors.candleGreen
                      : theme.colors.candleRed;
                  return (
                    <g key={i}>
                      <line
                        x1={x}
                        y1={R.y(b.h)}
                        x2={x}
                        y2={R.y(b.l)}
                        stroke={fill}
                        strokeWidth={theme.layout.stroke.wick}
                      />
                      <rect
                        x={x - R.bodyW / 2}
                        y={top}
                        width={R.bodyW}
                        height={h}
                        fill={fill}
                      />
                    </g>
                  );
                })}

                {[
                  { v: R.slow, c: theme.colors.indigo },
                  { v: R.ma, c: theme.colors.maOrange },
                ].map((l) => (
                  <path
                    key={l.c}
                    d={pathOf(l.v)}
                    fill="none"
                    stroke={l.c}
                    strokeWidth={theme.layout.stroke.ma}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </g>
            </Layer>

            {/* the two crossing boxes, found the same way SC05 finds them */}
            {R.marks.map((m) => {
              const up = !m.above;
              const lo = Math.max(0, m.i - R.markBox.bars);
              const hi = Math.min(R.bars.length - 1, m.i + R.markBox.bars);
              const yCross = R.y(R.fast[m.i] as number);
              let far = yCross;
              for (let i = lo; i <= hi; i++) {
                const v = up ? R.y(R.bars[i].h) : R.y(R.bars[i].l);
                far = up ? Math.min(far, v) : Math.max(far, v);
              }
              return (
                <HighlightBox
                  key={m.text}
                  x1={R.x(lo) - R.markBox.pad + R.markBox.trimX}
                  x2={R.x(hi) + R.markBox.pad - R.markBox.trimX}
                  y1={
                    up
                      ? far - R.markBox.pad
                      : yCross - R.markBox.pad - R.markBox.overCross
                  }
                  y2={
                    up
                      ? yCross + R.markBox.pad + R.markBox.overCross
                      : far + R.markBox.pad
                  }
                  f={f}
                  /* already open — this scene inherits it, it does not play it */
                  at={-999}
                  over={1}
                  fill={R.markBox.fill}
                />
              );
            })}

            {R.marks.map((m) => (
              <div
                key={m.text}
                style={{
                  position: "absolute",
                  left: R.x(m.i) + R.mark.r + R.mark.gap,
                  top:
                    R.y(R.fast[m.i] as number) +
                    (m.above ? -R.mark.r - R.mark.gap : R.mark.r + R.mark.gap),
                  transform: m.above ? "translateY(-100%)" : undefined,
                  background: m.fill,
                  color: theme.colors.surface,
                  borderRadius: theme.layout.radius.sm,
                  padding: `${R.mark.padY}px ${R.mark.padX}px`,
                  fontFamily: theme.type.family,
                  fontSize: R.mark.size,
                  fontWeight: theme.type.label.weight,
                  whiteSpace: "nowrap",
                }}
              >
                {m.text}
              </div>
            ))}

            <QuoteBox
              f={f}
              at={-999}
              w={R.quote.w}
              h={R.quote.h}
              y={R.box.y + R.box.h - 30}
              lines={[
                {
                  segments: [
                    {
                      text: "Indikator untuk konfirmasi,",
                      tone: "indigo",
                      ink: true,
                    },
                  ],
                },
                { segments: [{ text: "bukan meramal" }] },
              ]}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
