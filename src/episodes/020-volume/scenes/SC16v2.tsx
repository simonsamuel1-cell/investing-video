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
  Stage, Candles, VolumeBars, HighlightBox, cutInStyle, gridOf, domainOf,
  progress, progressInOut, ramp, textReveal, candleWidth, GRID_PAD_X, theme,
} from "../../../core";
import { BLOCK, CUTS, SC16_UI, SC16_V2, local } from "../data/timing";
import { ResistanceArea, resistanceTop } from "./ResistanceArea";
import {
  SS2, SS2_DOMAIN, SS3, SS_BAND, SS_GROWN, SS_GROWN_DOMAIN, SS_GROWN_VOL,
  SS_KEEP, SS_VIEW, SS_ZIG,
} from "../data/series";

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

  /**
   * ═══ AND AT f14933 THE SAME TRICK A THIRD TIME ═══  (Simon's beat at 14893)
   *
   * "bergeser ke kiri dan ke bawah hingga keluar dan tersisa 20 candlestick
   * paling kanan" — a third (box, domain) state, interpolated exactly like the
   * widening was, and for the same reason: what has to move is the FRAME.
   *
   * ⚠ LEFT comes out of the box. The panned box is solved so that bar 212 —
   * the first of the twenty Simon keeps — lands on `V.pan.x0`, which drags the
   * 212 bars before it off the left edge as one rigid tape. Nothing is
   * translated by hand, so no candle can slip out of step with its own volume.
   *
   * ⚠ DOWN comes out of the domain, and would be missing without this. The
   * grown view's ceiling is SS3's high, which is 50 units above anything on
   * screen right now; opening the domain to it pushes the survivors into the
   * bottom third, which is where a tape that is about to rise has to start.
   *
   * ⚠ AND THE PRICE PANEL GIVES UP 200px OF ITS HEIGHT to the histogram in the
   * same move, so the panel does not have to shove the candles aside when it
   * arrives — by the time it fades up, its room is already there.
   */
  const pan = progressInOut(f, local(V.pan.at, FROM), V.pan.over);
  /** The pitch the grown 140-slot tape wants across the plot. */
  const PITCH = (V.full.w - GRID_PAD_X * 2) / (SS_GROWN.length - 1);
  /** The first surviving bar, in SS2's own indices. */
  const HEAD = N - SS_KEEP;
  const boxPan = {
    x: V.pan.x0 - GRID_PAD_X - PITCH * HEAD,
    y: V.pan.price.y,
    w: PITCH * (N - 1) + GRID_PAD_X * 2,
    h: V.pan.price.h,
  };
  const slide = (a: number, b: number) => a + (b - a) * pan;
  const box = {
    x: slide(mix(boxNear.x, far.x), boxPan.x),
    y: slide(mix(boxNear.y, far.y), boxPan.y),
    w: slide(mix(boxNear.w, far.w), boxPan.w),
    h: slide(mix(boxNear.h, far.h), boxPan.h),
  };
  const G = gridOf(
    SS2.closes,
    [
      slide(mix(domNear[0], SS2_DOMAIN[0]), SS_GROWN_DOMAIN[0]),
      slide(mix(domNear[1], SS2_DOMAIN[1]), SS_GROWN_DOMAIN[1]),
    ],
    box,
    0.06,
    0,
  );
  /**
   * ⚠ TWO VIEWS ONTO G, NOT TWO GRIDS. SS3 continues SS2's slots, so its bar k
   * is SS2's slot N+k; the histogram runs under the twenty survivors first, so
   * its bar k is slot HEAD+k. Both borrow G's y and its slot, which is what
   * guarantees a volume bar can never drift off the candle it belongs to.
   */
  const Gnew = { ...G, x: (k: number) => G.x(N + k) };
  const Gvol = { ...G, x: (k: number) => G.x(HEAD + k) };
  const volBox = { x: V.full.x, y: V.pan.volume.y, w: V.full.w, h: V.pan.volume.h };

  /** The level and the trend leave first, and finish leaving before anything
   *  moves — Simon has rejected a fade that runs under the next beat before. */
  const clear = progress(f, local(V.clear.at, FROM), V.clear.over);
  const volIn = progress(f, local(V.vol.at, FROM), V.vol.over);
  /** ⚠ UN-EASED. A tape prints at one bar a moment, not slowly-fast-slowly. */
  const built = ramp(f, local(V.build.at, FROM), V.build.over);
  const grown = (SS_KEEP + SS3.bars.length * built) / SS_GROWN.length;

  /**
   * ⚠ THE PLOT'S OWN EDGE, CLOSING IN AS THE PAN RUNS. Twenty candles have to
   * be twenty: at the end of the move SS2's bar 211 still sits at x≈116, inside
   * the canvas though outside the plot, and without a clip it would stand there
   * as a twenty-first. Interpolated rather than typed so that before the pan it
   * is the whole canvas and clips nothing — the close-up and the widening are
   * already framed by the window, and a second frame around them would cut the
   * tape early.
   */
  const clipX = interpolate(pan, [0, 1], [0, V.full.x]);
  const clipW = interpolate(pan, [0, 1], [theme.canvas.width, V.full.w]);

  /** ⚠ THE CLOSE-UP'S OWN GRID, kept so `ResistanceArea` can convert its DROP
   *  into a price against the view that number was chosen in. */
  const G0 = gridOf(SS2.closes, domNear, near, 0.06, 0);
  /** The line over the chart — see `caption` in timing.ts for why its y is the
   *  band's own edge rather than a number. */
  const C = V.caption;
  const cap = textReveal(f, local(C.at, FROM), C.over);
  const capOut = progress(f, local(C.gone, FROM), C.over);
  const capY = resistanceTop(G, SS_BAND, G0) - C.gap - C.size;

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

  /**
   * ⚠ THE BOX IS SOLVED FROM THE GRID, so it cannot come off its bars. Its
   * left and right edges are the outer bars' own edges plus a pad, and its top
   * is the tallest bar inside it — a box drawn to the panel's ceiling would
   * claim a height none of these bars reach.
   */
  const P = V.markPad;
  const marks = V.marks.map((m) => {
    const grow =
      progressInOut(f, local(m.in.at, FROM), m.in.over) -
      progressInOut(f, local(m.out.at, FROM), m.out.over);
    if (grow <= 0.001) return null;
    const half = candleWidth(Gvol) / 2;
    const peak = Math.max(...SS_GROWN_VOL);
    const tall = Math.max(...SS_GROWN_VOL.slice(m.from, m.to + 1));
    return {
      grow,
      rect: {
        x1: Gvol.x(m.from) - half - P.x,
        x2: Gvol.x(m.to) + half + P.x,
        y1: volBox.y + volBox.h - (tall / peak) * volBox.h - P.top,
        y2: volBox.y + volBox.h + P.bottom,
      },
    };
  });

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
               {/* ⚠ THE PLOT'S EDGE — see `clipX`. Two divs, because the outer
                   one moves and everything inside it is written in CANVAS
                   coordinates; the inner one puts that origin back. */}
               <div style={{ position: "absolute", left: clipX, top: 0, width: clipW, height: theme.canvas.height, overflow: "hidden" }}>
                <div style={{ position: "absolute", left: -clipX, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
                {/* ── the area price kept failing at ─────────────────────── */}
                {/* ⚠ NO ENTRANCE — Simon: "sudah ada sejak awal". The level is
                    on the chart from its first frame and the window opening
                    over it is what reveals it; its position lives in
                    ResistanceArea.tsx, where DROP is the one number to change.
                    It LEAVES at f14893, before the view moves, so it never has
                    to be dragged across the screen on its way out. */}
                {clear < 0.999 && (
                  <div style={{ opacity: 1 - clear }}>
                    <ResistanceArea
                      grid={G}
                      box={box}
                      band={SS_BAND}
                      closeUp={G0}
                      label={V.label}
                    />
                  </div>
                )}

                {/* ⚠ ALL 232, ALWAYS — the twenty that stay are simply the ones
                    the plot's edge does not cut. Drawing "the survivors" as
                    their own array would mean creating twenty candles at the
                    moment 212 others are destroyed, and the seam would show. */}
                <Candles bars={SS2.bars} grid={G} />

                {/* ── and the tape that grows out of them ─────────────────── */}
                {built > 0.001 && <Candles bars={SS3.bars} grid={Gnew} shown={built} />}

                {/* ⚠ THE HISTOGRAM STARTS UNDER THE SURVIVORS AND FOLLOWS THE
                    NEW BARS IN. `shown` is the fraction of all 140 slots that
                    exist, so the twenty are there from the moment the panel
                    fades up and every newcomer's bar arrives with its own
                    candle rather than a beat behind it. */}
                <VolumeBars
                  bars={SS_GROWN}
                  volume={SS_GROWN_VOL}
                  grid={Gvol}
                  box={volBox}
                  shown={grown}
                  opacity={volIn}
                />

                {/* ── the two marks on the histogram ─────────────────────── */}
                {marks.map((mk, i) =>
                  mk === null ? null : (
                    <HighlightBox key={i} rect={mk.rect} grow={mk.grow} />
                  ),
                )}

                {/* ── the trend leg ────────────────────────────────────────
                    ⚠ INDIGO — Simon's call. The reference draws it white on a
                    dark chart; on this pale ground the episode's own marking
                    colour is the reading of that, and it puts the trend in the
                    same voice as the level it breaks. */}
                {drawn > 0.001 && clear < 0.999 && (
                  <svg
                    style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - clear }}
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

               {/* ⚠ OUTSIDE THE PLOT'S CLIP. The line is type about the chart,
                   not part of the tape, and clipping it at x=120 would shave
                   its ends the moment the pan closes that edge in. */}
               {cap.opacity > 0.001 && capOut < 0.999 && (
                 <div
                   style={{
                     position: "absolute",
                     /* ⚠ FLUSH LEFT ON THE PLOT'S EDGE, under the same x as
                        the "Resistance" label. Centred, a 60px line of this
                        length ends at x≈1650 and lands on the tape's own high
                        — type over candles, which is the one thing a caption
                        about a chart must not be. */
                     left: V.full.x,
                     top: capY,
                     fontFamily: theme.text.family,
                     fontSize: C.size,
                     fontWeight: 700,
                     lineHeight: 1,
                     color: theme.color.glassInk,
                     opacity: cap.opacity * (1 - capOut),
                     transform: `translateY(${cap.dy.toFixed(1)}px)`,
                   }}
                 >
                   {C.text}
                 </div>
               )}
              </div>
            </div>

          </>
        )}
      </div>
    </Stage>
  );
};
