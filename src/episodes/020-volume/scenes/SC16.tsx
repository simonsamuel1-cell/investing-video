/**
 * SC16 — what volume is actually for, in two panes of glass. `from 14518`
 *
 * ⚠ THE CHART THAT USED TO BE HERE IS GONE — Simon: "hilangkan semua visual
 * karna tidak dipakai". The healthy-uptrend tape, its histogram and the three
 * captions that read it are in git history; nothing here refers to them.
 *
 * ═══ IT IS QUOTING ANOTHER VIDEO, ON PURPOSE ═══
 *
 * The look is the ConversBank reference in Simon's folder, AT THE SECOND HE
 * NAMED — 0:06: a pale blue-grey ground that is lightest in its middle, a whole
 * app's worth of cards blurred out behind, and near-white rounded cards in
 * front. Every colour was READ OFF THAT FRAME rather than matched by eye — see
 * the `glass*` slots in core/theme.ts.
 *
 * ⚠ 0:06 IS NOT 0:15. The strong periwinkle-and-pink ground with see-through
 * frosted panels is a later part of that video, and it is what this scene was
 * built as first; Simon then named the second, and the two looks share nothing
 * but the radius.
 *
 * ⚠ WHICH IS WHY THE STAGE IS TRANSPARENT. This scene paints its own ground.
 * Every other scene in the episode would be wrong to do that, and the colours
 * are named `glass*` rather than added to the palette so nothing reaches for
 * them by accident.
 *
 * ⚠ AND IT IS NOT THE BRAND PALETTE. Simon: "tidak perlu memikirkan warna
 * branding".
 */
import { useCurrentFrame } from "remotion";
import { Stage, cutInStyle, useMotion, textReveal, popIn, theme } from "../../../core";
import { BLOCK, CUTS, SC16_UI } from "../data/timing";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC16;
// ═══════════════════════════════════════════════════════════════════════════

export const SC16 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const U = SC16_UI;
  /**
   * ⚠ LINEAR AND UNCLAMPED — see `drift` in data/timing. `progress` would ease
   * it, and an eased drift reads as a move that is about to finish; this one is
   * never supposed to arrive.
   */
  const d = f / U.drift.over;

  return (
    <Stage transparent>
      {/* ⚠ THE GROUND IS PART OF WHAT THE CUT CARRIES IN. Left outside the
          wrapper it would snap on while the panes were still travelling, and
          the cut would read as a background change with a slide over it. */}
      <div style={{ position: "absolute", inset: 0, ...cutInStyle(f + FROM, CUTS.toSC16) }}>
        {/* ⚠ INSET NEGATIVE, so the ground still covers the frame while the cut
            is carrying it 90px sideways. A gradient that stops at the canvas
            edge shows the episode's own paper down one side mid-move. */}
        {/* ⚠ A PLAIN DIV, NOT `AbsoluteFill`. That component also sets width and
            height to 100%, and 100% of the canvas measured from left:-120 ends
            at x=1800 — which left a strip of the episode's own paper down the
            right edge and along the bottom. Inset alone stretches. */}
        <div
          style={{
            position: "absolute",
            inset: -120,
            background: theme.color.glassBg,
            /* ⚠ THE 120px OF OVERSCAN IS WHAT PAYS FOR THE DRIFT. Moving a
               ground that stops at the canvas edge uncovers the edge. */
            transform:
              `translate(${(d * U.drift.ground.x).toFixed(2)}px, ${(
                d * U.drift.ground.y
              ).toFixed(2)}px) scale(${(1 + d * U.drift.ground.zoom).toFixed(4)})`,
          }}
        />

        {/* ⚠ THE BLURRED PANELS BEHIND — the reference's own depth at 0:06,
            where a whole app's worth of cards sits out of focus behind the one
            in front. One blurred group rather than eight blurred elements: a
            filter per element is eight compositing passes a frame, and their
            soft edges would not overlap the way a single blurred layer's do. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: `blur(${U.ghost.blur}px)`,
            pointerEvents: "none",
            /* ⚠ FURTHER AND THE OTHER WAY. Two layers at the same speed are one
               layer; the parallax is what puts these in front of the ground. */
            transform: `translate(${(d * U.drift.ghost.x).toFixed(2)}px, ${(
              d * U.drift.ghost.y
            ).toFixed(2)}px)`,
          }}
        >
          {U.ghost.rects.map((r, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: r.w,
                height: r.h,
                borderRadius: U.ghost.radius,
                background: theme.color.glassGhost,
              }}
            />
          ))}
        </div>

        {/* ⚠ ONE CENTRED COLUMN, NOT TWO PLACED RECTS — Simon: "kelompokkan
            keduanya lalu center align, horizontal dan vertikal". The group is
            centred on both axes by LAYOUT, so nothing here has to know how tall
            two padded lines come out, and it stays centred if either line
            changes length. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: U.gap,
          }}
        >
          {U.lines.map((line, i) => {
            const at = i * U.stagger;
            /* A panel is a UI element, so it may pop; the line inside it never
               does — see core/Text. */
            const p = popIn(f, at, m.pop, { from: 0.94, back: 1.02 });
            const tx = textReveal(f, at + m.fade, m.reveal);
            return (
              <div
                key={i}
                style={{
                  /* ⚠ THE PANE'S SIZE COMES FROM ITS PADDING. No width, no
                     height: 40 either side and 60 above and below is the whole
                     specification, and the browser does the measuring. */
                  padding: `${U.pad.y}px ${U.pad.x}px`,
                  position: "relative",
                  opacity: p.opacity,
                }}
              >
                {/* ⚠ THE PANEL POPS, THE TYPE DOES NOT — and this layer is what
                    separates them. The scale used to sit on the padded box, so
                    the LINE INSIDE scaled with it: during the ten frames of
                    stagger the second pane was still at 0.94 and its 36px read
                    as 34, which is exactly the "font sizenya beda" Simon saw.
                    Both are `U.size`, one variable — they cannot differ. The
                    background is now an absolute sibling that carries the pop
                    and nothing else.

                    ⚠ OPAQUE, NOT FROSTED. At 0:06 — the frame Simon named — the
                    card in front is #FDFDFF and solid; the see-through panels
                    are a LATER part of that video. What gives this one depth is
                    the blurred layer behind it, not translucency. */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: U.radius,
                    background: theme.color.glassPanel,
                    border: `${theme.shape.hairline}px solid ${theme.color.glassEdge}`,
                    boxShadow: theme.color.glassShadow,
                    transform: `scale(${p.scale.toFixed(4)})`,
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    fontFamily: theme.text.family,
                    fontSize: U.size,
                    fontWeight: 600,
                    lineHeight: 1,
                    color: theme.color.glassInk,
                    opacity: tx.opacity,
                    transform: `translateY(${tx.dy}px)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {line}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};
