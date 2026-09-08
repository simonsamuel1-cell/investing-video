/**
 * SC16 · VERSION 2 — one portrait window, with Simon's own breakout in it.
 *
 * Pick between this and the two chips with `SC16_VERSION` in data/timing.ts;
 * nothing else selects between them.
 *
 * ═══ HOW THE WINDOW ARRIVES ═══
 *
 * The way a rectangle actually gets drawn, in three beats that never overlap:
 * a DOT, then its WIDTH, then its HEIGHT. A box that grows both ways at once is
 * a box scaling up — a different gesture, and the one this is not.
 *
 * ⚠ THE GROUND IS THE SAME ONE VERSION 1 PAINTS, and it drifts the same way:
 * this is the same scene told differently, not a different-looking scene.
 *
 * ⚠ THE TAPE IS TRACED, NOT DESIGNED. 62 candles colour-keyed out of SS1.png,
 * and the resistance is that image's own dotted line — found as the one row
 * whose teal runs the full width. See SS1 in data/series.ts, which also asserts
 * that the thing really does break out.
 */
import { interpolate, useCurrentFrame } from "remotion";
import {
  Stage, Candles, cutInStyle, gridOf, progress, progressInOut, theme,
} from "../../../core";
import { BLOCK, CUTS, SC16_UI, SC16_V2, local } from "../data/timing";
import { SS1, SS1_DOMAIN, SS1_BAND } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC16;
const V = SC16_V2;
// ═══════════════════════════════════════════════════════════════════════════

export const SC16v2 = () => {
  const f = useCurrentFrame();
  const U = SC16_UI;
  /** Linear and unclamped — a drift that eases reads as one about to finish. */
  const d = f / U.drift.over;

  const at = local(V.open.at, FROM);
  /**
   * ⚠ THREE BEATS, EACH STARTING WHERE THE LAST ENDED. Written as one running
   * total rather than three typed frames, so changing the middle one cannot
   * leave a gap or an overlap behind it.
   */
  const born = progress(f, at, V.open.dot);
  const wide = progressInOut(f, at + V.open.dot, V.open.wide);
  const tall = progressInOut(f, at + V.open.dot + V.open.wide, V.open.tall);
  const w = interpolate(wide, [0, 1], [V.win.dot, V.win.w]);
  const h = interpolate(tall, [0, 1], [V.win.dot, V.win.h]);
  const x = theme.canvas.width / 2 - w / 2;
  const y = theme.canvas.height / 2 - h / 2;

  /** The plot, inside whatever the window currently is. */
  const box = { x: x + V.plot.x, y: y + V.plot.y, w: w - V.plot.x * 2, h: h - V.plot.y * 2 };
  const G = gridOf(SS1.closes, SS1_DOMAIN, box, 0.06, 0);
  const shown = progress(f, local(V.build.at, FROM), V.build.over);
  const zone = progressInOut(f, local(V.zone.at, FROM), V.zone.over);
  const named = progress(f, local(V.label.at, FROM), V.zone.over);

  return (
    <Stage transparent>
      <div style={{ position: "absolute", inset: 0, ...cutInStyle(f + FROM, CUTS.toSC16) }}>
        {/* ⚠ A PLAIN DIV, NOT `AbsoluteFill` — that one also sets width and
            height to 100%, and 100% measured from left:-120 ends at x=1800. */}
        <div
          style={{
            position: "absolute",
            inset: -120,
            background: theme.color.glassBg,
            transform:
              `translate(${(d * U.drift.ground.x).toFixed(2)}px, ${(
                d * U.drift.ground.y
              ).toFixed(2)}px) scale(${(1 + d * U.drift.ground.zoom).toFixed(4)})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: `blur(${U.ghost.blur}px)`,
            pointerEvents: "none",
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

        {born > 0.001 && (
          <>
            {/* ⚠ THE FRAME AND ITS CONTENTS ARE SEPARATE LAYERS. The tape is
                positioned in CANVAS coordinates against the window's current
                rect, so it follows the frame open without being scaled by it —
                a chart inside a growing box would stretch, and a stretched
                candle is a lie about its price. */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                height: h,
                borderRadius: Math.min(V.win.radius, w / 2, h / 2),
                background: theme.color.glassPanel,
                border: `${theme.shape.hairline}px solid ${theme.color.glassEdge}`,
                boxShadow: theme.color.glassShadow,
                opacity: born,
              }}
            />

            {/* ⚠ CLIPPED TO THE WINDOW. Until the frame has finished opening the
                plot rect is taller than the box it is inside; without this the
                first candles would be drawn on the ground beside it. */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                height: h,
                borderRadius: Math.min(V.win.radius, w / 2, h / 2),
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: -x, top: -y, width: theme.canvas.width, height: theme.canvas.height }}>
                {/* ── the area price kept failing at ─────────────────────── */}
                {zone > 0.001 && (
                  <div
                    style={{
                      position: "absolute",
                      left: box.x,
                      top: G.y(SS1_BAND.hi),
                      width: box.w,
                      height: (G.y(SS1_BAND.lo) - G.y(SS1_BAND.hi)) * zone,
                      background: theme.color.zoneFill,
                      borderTop: `${theme.shape.rule}px solid ${theme.color.indigo}`,
                      borderBottom: `${theme.shape.rule}px solid ${theme.color.indigo}`,
                    }}
                  />
                )}

                <Candles bars={SS1.bars} grid={G} shown={shown} />
              </div>
            </div>

            {/* ⚠ THE NAME SITS OUTSIDE THE CLIP, AT THE FAR LEFT — Simon's
                call, and the one place the library's own `Zone` would not put
                it: that component labels at the RIGHT end, where the eye lands
                as a level draws. Here the level is an area that is simply
                there, and the left is the end price never came back to. */}
            {named > 0.001 && (
              <div
                style={{
                  position: "absolute",
                  left: box.x,
                  top: G.y(SS1_BAND.hi) - V.label.gap - V.label.size,
                  fontFamily: theme.text.family,
                  fontSize: V.label.size,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: theme.color.indigo,
                  opacity: named,
                  whiteSpace: "nowrap",
                }}
              >
                {V.label.text}
              </div>
            )}
          </>
        )}
      </div>
    </Stage>
  );
};
