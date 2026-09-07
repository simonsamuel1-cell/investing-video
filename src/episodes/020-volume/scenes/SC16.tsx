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
        <div style={{ position: "absolute", inset: -120, background: theme.color.glassBg }} />

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

        {U.lines.map((line, i) => {
          const at = i * U.stagger;
          /* A panel is a UI element, so it may pop; the line inside it never
             does — see core/Text. */
          const p = popIn(f, at, m.pop, { from: 0.94, back: 1.02 });
          const t = textReveal(f, at + m.fade, m.reveal);
          const y = U.top + i * (U.h + U.gap);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: U.x,
                top: y,
                width: U.w,
                height: U.h,
                borderRadius: U.radius,
                /* ⚠ A GRADIENT, NOT A TINT — the reference's panels are brighter
                   along their top edge, and that is what makes them read as
                   glass catching the light rather than as a pale rectangle. */
                /* ⚠ OPAQUE, NOT FROSTED. At 0:06 — the frame Simon named — the
                   card in front is #FDFDFF and solid; the see-through panels
                   are a LATER part of that video. What gives this one depth is
                   the blurred layer behind it, not translucency. */
                background: theme.color.glassPanel,
                border: `${theme.shape.hairline}px solid ${theme.color.glassEdge}`,
                boxShadow: theme.color.glassShadow,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: p.opacity,
                transform: `scale(${p.scale.toFixed(4)})`,
                transformOrigin: "50% 50%",
              }}
            >
              <div
                style={{
                  fontFamily: theme.text.family,
                  fontSize: U.size,
                  fontWeight: 600,
                  color: theme.color.glassInk,
                  opacity: t.opacity,
                  transform: `translateY(${t.dy}px)`,
                  whiteSpace: "nowrap",
                }}
              >
                {line}
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};
