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
  Stage, Candles, cutInStyle, gridOf, domainOf, progress, progressInOut, theme,
} from "../../../core";
import { BLOCK, CUTS, SC16_UI, SC16_V2, local } from "../data/timing";
import { ResistanceArea } from "./ResistanceArea";
import { SS2, SS2_DOMAIN, SS_BAND, SS_VIEW, SS_ZIG } from "../data/series";

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

  /**
   * ═══ THE WIDENING, AS A CHANGE OF GRID ═══
   *
   * ⚠ BOTH STATES ARE (BOX, DOMAIN) OVER THE SAME 232 BARS. The close-up is not
   * a different chart — it is this one on a box wide enough that 46 of its bars
   * fill the plot, slid so bar 168 lands on the left edge. Interpolating the
   * box and the domain therefore moves the FRAME, and every candle stays where
   * the data puts it. A cross-fade between two charts would ghost all 232.
   */
  const open = progressInOut(f, local(V.wide.at, FROM), V.wide.over);

  /** The panel: the portrait window, opening out to the whole screen. */
  const px0 = interpolate(open, [0, 1], [x, 0]);
  const py0 = interpolate(open, [0, 1], [y, 0]);
  const pw = interpolate(open, [0, 1], [w, theme.canvas.width]);
  const ph = interpolate(open, [0, 1], [h, theme.canvas.height]);
  const radius = interpolate(open, [0, 1], [Math.min(V.win.radius, w / 2, h / 2), 0]);

  /**
   * ⚠ THE PLOT IS BUILT FROM THE FINISHED RECT, NOT THE CURRENT ONE. While the
   * frame is still drawing itself the box is a sliver; laying the tape out
   * against it would stretch every candle as it opened. The frame's growth is
   * the chart's MASK, not its layout — Simon: "gunakan teknik masking".
   */
  /** The window's FINISHED position, which is where the tape is laid out. */
  const X0 = theme.canvas.width / 2 - V.win.w / 2;
  const Y0 = theme.canvas.height / 2 - V.win.h / 2;
  const near = { x: X0 + V.plot.x, y: Y0 + V.plot.y, w: V.win.w - V.plot.x * 2, h: V.win.h - V.plot.y * 2 };
  const far = V.full;
  const N = SS2.bars.length;
  const SPAN = SS_VIEW.to - SS_VIEW.from;
  /** The close-up, written as a grid: wide enough that `SPAN` bars fill the
   *  plot, and slid so `SS_VIEW.from` sits on its left edge. */
  const zoomW = (near.w * (N - 1)) / (SPAN - 1);
  const boxNear = { ...near, x: near.x - (zoomW * SS_VIEW.from) / (N - 1), w: zoomW };
  const win = SS2.bars.slice(SS_VIEW.from, SS_VIEW.to);
  const domNear = domainOf(win.map((b) => b.c), win);
  const mix = (a: number, b: number) => a + (b - a) * open;
  const box = {
    x: mix(boxNear.x, far.x),
    y: mix(boxNear.y, far.y),
    w: mix(boxNear.w, far.w),
    h: mix(boxNear.h, far.h),
  };
  const G = gridOf(
    SS2.closes,
    [mix(domNear[0], SS2_DOMAIN[0]), mix(domNear[1], SS2_DOMAIN[1])],
    box,
    0.06,
    0,
  );
  /** ⚠ THE CLOSE-UP'S OWN GRID, kept so `ResistanceArea` can convert its DROP
   *  into a price against the view that number was chosen in. */
  const G0 = gridOf(SS2.closes, domNear, near, 0.06, 0);

  /**
   * ═══ THE ZIGZAG, DRAWN FROM ITS TAIL FORWARDS ═══
   *
   * ⚠ ONE LENGTH FOR THE WHOLE POLYLINE, not one per leg. Revealing it leg by
   * leg would make each segment take the same time whatever its length, so a
   * short leg would crawl and a long one would race; measuring the whole path
   * once and running a dash offset along it keeps the pen at one speed.
   */
  const drawn = progressInOut(f, local(V.trend.at, FROM), V.trend.over);
  const zig = SS_ZIG.map((q) => ({ x: G.x(q.i), y: G.y(q.v) }));
  const segs = zig.slice(1).map((q, k) => Math.hypot(q.x - zig[k].x, q.y - zig[k].y));
  const zigLen = segs.reduce((a, b2) => a + b2, 0);
  const zigPath = "M " + zig.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" L ");
  /** The head takes the LAST leg's direction — that is the way the trend is
   *  pointing when it arrives. */
  const last = zig[zig.length - 1];
  const prev = zig[zig.length - 2];
  const dl = Math.max(1, Math.hypot(last.x - prev.x, last.y - prev.y));
  const tDir = { x: (last.x - prev.x) / dl, y: (last.y - prev.y) / dl };
  const nx = -tDir.y;
  const ny = tDir.x;
  const headPts = [
    [last.x, last.y],
    [last.x - tDir.x * V.trend.head.len + nx * V.trend.head.half, last.y - tDir.y * V.trend.head.len + ny * V.trend.head.half],
    [last.x - tDir.x * V.trend.head.len - nx * V.trend.head.half, last.y - tDir.y * V.trend.head.len - ny * V.trend.head.half],
  ]
    .map((q) => q.map((v) => v.toFixed(1)).join(","))
    .join(" ");

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
                left: px0,
                top: py0,
                width: pw,
                height: ph,
                borderRadius: radius,
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
                left: px0,
                top: py0,
                width: pw,
                height: ph,
                borderRadius: radius,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: -px0, top: -py0, width: theme.canvas.width, height: theme.canvas.height }}>
                {/* ── the area price kept failing at ─────────────────────── */}
                {/* ⚠ NO ENTRANCE — Simon: "sudah ada sejak awal". The level is
                    on the chart from its first frame and the window opening
                    over it is what reveals it; its position lives in
                    ResistanceArea.tsx, where DROP is the one number to change. */}
                <ResistanceArea
                  grid={G}
                  box={box}
                  band={SS_BAND}
                  closeUp={G0}
                  label={V.label}
                />

                <Candles bars={SS2.bars} grid={G} />

                {/* ── the trend leg ────────────────────────────────────────
                    ⚠ INDIGO — Simon's call. The reference draws it white on a
                    dark chart; on this pale ground the episode's own marking
                    colour is the reading of that, and it puts the trend in the
                    same voice as the level it breaks. */}
                {drawn > 0.001 && (
                  <svg
                    style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
                    width={theme.canvas.width}
                    height={theme.canvas.height}
                  >
                    <path
                      d={zigPath}
                      fill="none"
                      stroke={theme.color.indigo}
                      strokeWidth={V.trend.width}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={zigLen}
                      strokeDashoffset={zigLen * (1 - drawn)}
                    />
                    {drawn > 0.995 && <polygon points={headPts} fill={theme.color.indigo} />}
                  </svg>
                )}
              </div>
            </div>

          </>
        )}
      </div>
    </Stage>
  );
};
