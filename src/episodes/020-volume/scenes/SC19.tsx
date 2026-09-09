/**
 * SC19 — what volume is for, and what it is not. `from 17848 · dur 944`
 *
 * Everything the scene used to draw is gone — Simon: "17848-18791 hilangkan
 * semua visual". What is left is two of SC17's windows: the correct reading
 * alone in the middle, then the wrong one beside it, then the correct one
 * opened out to fill the frame.
 *
 * ⚠ THE SAME WINDOW AS 16583, MINUS ITS GROUND — Simon's words. It is the
 * object this episode has already used to say "here is one thing, named", so
 * using it again says these two are the same KIND of thing as those two. A new
 * card shape would have said they were something else.
 *
 * ⚠ AND THE FIRST ARRIVES ALONE. It is the correct reading; it gets the frame
 * to itself before the wrong one turns up beside it and makes the shot a
 * comparison.
 *

 * ═══ THE TWO DISPLAYS ARE LOCKED TO SS6 ═══  (Simon, and he is owed it)
 *
 * ⚠ SS6.png IS THIS FILE'S OWN OUTPUT AT f18250, AND IT IS THE CONTRACT. It was
 * verified pixel-for-pixel: both 400×400 display regions differ from the render
 * in ZERO pixels. Anything that changes them is a regression, whatever else it
 * was trying to do — `npm run lock:ss6` re-checks it, and the assertions at the
 * foot of this file fail the build if the geometry or the tape moves.
 *
 * ⚠ WHICH IS WHY THE TAPE HERE IS SS4 AND NOT SS4_LONG. The longer tape was
 * added so the GROWN chart would stop looking stretched, and it did — but the
 * same 46 bars in the 400px window turned the display into the cramped thing
 * Simon rejected. The display Simon approved wins; the grown view is stretched
 * again as a result, and that is a trade he has to make knowingly rather than
 * one I make for him.
 *
 * ⚠ AND THE MASKING REWRITE IS REVERTED. Laying the tape out once and cutting a
 * hole in front of it is the right idea and it is what "extend" means — but it
 * cannot also reproduce SS6, because SS6's small display shows the WHOLE tape
 * at a size the big display does not use. One of the two had to go, and the one
 * Simon has approved twice stays.
 *
 * ⚠ THE GROUND AND THE HEADING ARE NOT HERE. They belong to MistakesLayer,
 * which spans this scene and SC18 — see the cut at 17847 that neither of them
 * takes part in.
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, cutInStyle, cutOutStyle, gridOf, pathOf, popIn, progress,
  progressInOut, sma, textReveal, usePalette, GRID_PAD_X, theme,
} from "../../../core";
import { BLOCK, CUTS, LIMITS, local } from "../data/timing";
import {
  SS4, SS4_DOMAIN, SS4_VOL, SS4_LEAD, SS4_KEEP, SS4_RUNUP, SS4_RUNUP_VOL, COLOUR, COLOUR_VOL,
  domainOfColour, zigzagOf,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC19;
const V = LIMITS;
// ═══════════════════════════════════════════════════════════════════════════

type Rect = { x: number; y: number; w: number; h: number };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

/** Where each window rests: the first alone in the middle, then the pair. */
const PAIR_W = V.win.w * 2 + V.win.gap;
const SOLO_X = theme.canvas.width / 2 - V.win.w / 2;
const PAIR_X = [theme.canvas.width / 2 - PAIR_W / 2, theme.canvas.width / 2 - PAIR_W / 2 + V.win.w + V.win.gap];

/**
 * ═══ THE SMALL STATE AND THE FULL ONE, BOTH WRITTEN AS BOXES ═══
 *
 * ⚠ NOT ONE SCALED FROM THE OTHER — Simon: "window di kiri membesar memenuhi
 * layar sesuai batas margin". The window is portrait and the margin is
 * landscape, so scaling the small layout by a factor would stretch a chart that
 * has to stay a chart. Both states are typed as rects and interpolated, which
 * is the same technique every zoom in this episode uses.
 *
 * ⚠ AND FULL IS THE CARD, NOT THE CANVAS. The heading lives at the top of the
 * margin; a window that filled to the true edge would cover the sentence it is
 * illustrating.
 */
const small = (x: number): Record<string, Rect> => ({
  win: { x, y: V.win.y, w: V.win.w, h: V.win.h },
  display: { x: x + V.ui.display.x, y: V.win.y + V.ui.display.y, w: V.ui.display.w, h: V.ui.display.h },
  price: { x: x + V.ui.price.x, y: V.win.y + V.ui.price.y, w: V.ui.price.w, h: V.ui.price.h },
  volume: { x: x + V.ui.volume.x, y: V.win.y + V.ui.volume.y, w: V.ui.volume.w, h: V.ui.volume.h },
});
/**
 * ⚠ 25 ON THREE SIDES AND A LINE OF TEXT AT THE BOTTOM — Simon's numbers, and
 * the bottom one is DERIVED from the row's own size. This rect is only used
 * once the window has opened out, so it cannot touch SS6.
 */
const CARD = theme.stage.card;
const P = V.full.pad;
const ROW_H = V.full.gap + V.full.size + V.full.gap;
const DISPLAY_H = CARD.h - P - ROW_H;
const FULL: Record<string, Rect> = {
  win: { x: CARD.x, y: CARD.y, w: CARD.w, h: CARD.h },
  display: { x: CARD.x + P, y: CARD.y + P, w: CARD.w - P * 2, h: DISPLAY_H },
  price: { x: CARD.x + P + 34, y: CARD.y + P + 30, w: CARD.w - P * 2 - 68, h: DISPLAY_H * 0.6 },
  volume: { x: CARD.x + P + 34, y: CARD.y + P + DISPLAY_H * 0.68, w: CARD.w - P * 2 - 68, h: DISPLAY_H * 0.26 },
};
const ROW_Y = CARD.y + P + DISPLAY_H + V.full.gap;

const COLOUR_DOMAIN = domainOfColour;

/**
 * ═══ THE CHART'S TWO STATES, AND WHY THEY CANNOT STRETCH ═══
 *
 * ⚠ BOTH ARE DERIVED FROM SS4'S OWN SMALL LAYOUT, and the grown one is that
 * layout times `grow.scale` in BOTH axes. Pitch, panel heights and the gap
 * between the panels all take the same factor, so every proportion inside the
 * display is identical before and after — which is the whole of "lock ratio…
 * tidak stretch". Nothing here is a rect chosen to fill a space.
 *
 * ⚠ AND THE SMALL STATE DRAWS SS4 EXACTLY WHERE IT ALREADY DID. The box is
 * solved so that bar SS4_LEAD — the first of the twenty under contract — lands
 * on the pixel SS4's own bar 0 lands on today, at the same pitch. The 41 bars
 * in front of it fall off the display's left edge and are clipped.
 */
const chartBoxes = (S: Record<string, Rect>, open: number) => {
  const N = SS4_LEAD + SS4.bars.length;
  /** SS4's own pitch in the small window — the number SS6 is drawn with. */
  const p = (S.price.w - GRID_PAD_X * 2) / (SS4.bars.length - 1);
  const x0 = S.price.x + GRID_PAD_X;
  const dropY = S.volume.y + S.volume.h - S.price.y;
  const gapY = S.volume.y - S.price.y;

  const k = LIMITS.grow.scale;
  const small = {
    price: { x: x0 - GRID_PAD_X - p * SS4_LEAD, y: S.price.y, w: p * (N - 1) + GRID_PAD_X * 2, h: S.price.h },
    volume: { x: 0, y: S.volume.y, w: 0, h: S.volume.h },
  };
  const gp = p * k;
  const innerG = gp * (N - 1);
  const right = FULL.display.x + FULL.display.w - LIMITS.grow.right;
  const bottom = FULL.display.y + FULL.display.h - LIMITS.grow.bottom;
  const gy = bottom - dropY * k;
  const grown = {
    price: { x: right - GRID_PAD_X - innerG, y: gy, w: innerG + GRID_PAD_X * 2, h: S.price.h * k },
    volume: { x: 0, y: gy + gapY * k, w: 0, h: S.volume.h * k },
  };
  return {
    price: mixRect(small.price, grown.price, open),
    volume: mixRect(small.volume, grown.volume, open),
    /** ⚠ THE CANDLE'S WIDTH COMES FROM THE PITCH, not from `grid.slot`. `slot`
     *  divides by the BAR COUNT, so lengthening the tape would have thinned the
     *  twenty locked candles by half a pixel — enough to break the lock. */
    w: lerp(p, gp, open) * (0.66 * (SS4.bars.length - 1)) / SS4.bars.length,
  };
};

/* ── one window ───────────────────────────────────────────────────────────── */

const Window = ({ i }: { i: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const card = V.cards[i];
  const at = local(card.at, FROM);
  const pop = popIn(f, at, V.pop);
  if (pop.opacity <= 0.001) return null;

  /** The first window slides aside as the second lands — one curve. */
  const spread = progressInOut(f, local(V.spread.at, FROM), V.spread.over);
  const x = i === 0 ? lerp(SOLO_X, PAIR_X[0], spread) : PAIR_X[1];

  /** ⚠ ONLY THE LEFT ONE OPENS OUT, and its words leave as it does — Simon:
   *  "text dan iconnya fade out". What is being enlarged is the chart. */
  const open = i === 0 ? progressInOut(f, local(V.grow.at, FROM), V.grow.over) : 0;
  const S = small(x);
  /**
   * ⚠ ONLY THE WINDOW AND ITS DISPLAY ARE INTERPOLATED AS RECTS. The chart
   * inside is not — it takes ONE scale factor, so it cannot stretch.
   *
   * ⚠ AND THE LONG TAPE ONLY EXISTS ONCE THE GROWTH HAS STARTED. Solving the
   * 61-bar box so that SS4's twenty land on the pixels they already occupy is
   * exact on paper and lands a few ten-thousandths off in floating point —
   * enough to move 493 antialiased pixels of a display that is under contract.
   * Before the growth the scene therefore runs the ORIGINAL arithmetic, not an
   * equivalent one. The swap happens on the first frame of the move, where the
   * 41 extra bars are still outside the display and clipped away.
   */
  const CB = i === 0 && open > 0.0001 ? chartBoxes(S, open) : null;
  const long = CB !== null;
  const R = {
    win: mixRect(S.win, FULL.win, open),
    display: mixRect(S.display, FULL.display, open),
    price: CB ? CB.price : S.price,
    volume: CB ? CB.volume : S.volume,
  };

  const series = i === 1 ? COLOUR : long ? SS4_RUNUP : SS4;
  const domain = i === 0 ? SS4_DOMAIN : COLOUR_DOMAIN;
  const vol = i === 1 ? COLOUR_VOL : long ? SS4_RUNUP_VOL : SS4_VOL;
  const g = gridOf(series.closes, domain, R.price, 0.08, i === 1 ? V.fan.gutter : 0);
  const built = progress(f, at + V.build.after, V.build.over);
  const head = textReveal(f, at + V.words.after, V.words.over, 12);
  const w = CB ? CB.w : Math.max(3, g.slot * 0.66);
  const peak = Math.max(...vol);
  const chrome = (1 - open) * pop.opacity;

  /** The three futures nobody can pick between — see `fan` in timing.ts. */
  const last = series.bars.length - 1;
  const tip = { x: g.x(last), y: g.y(series.bars[last].c) };

  /* ── the four marks, all derived from the tape ──────────────────────── */
  /**
   * ⚠ ONE AT A TIME: the LAST word to have arrived owns the chart, and the mark
   * before it is gone rather than faded under the next. `live` is that index,
   * and it is what the pill follows too — one number, so the highlight and the
   * drawing can never disagree about which reading is being spoken.
   */
  let live = -1;
  V.read.items.forEach((q, k) => { if (f >= local(q.at, FROM)) live = k; });
  const on = (k: number) => (k === live ? progress(f, local(V.read.items[k].at, FROM), V.read.over) : 0);
  const bars = series.bars;
  const zig = zigzagOf(bars, (domain[1] - domain[0]) * V.read.zigThr).map((q) => ({ x: g.x(q.i), y: g.y(q.v) }));
  const zigPath = "M " + zig.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" L ");
  /**
   * ⚠ BOTH BANDS ARE THE SAME HEIGHT — Simon. Left to their own extremes they
   * came out different depths, which reads as one level being a stronger claim
   * than the other; they are the same KIND of claim, so they are the same size.
   * Each is CENTRED on its own level rather than hung off one extreme.
   */
  const zoneH = (domain[1] - domain[0]) * V.read.zoneH;
  const top3 = [...bars.map((b) => b.h)].sort((a, b) => b - a).slice(0, 3);
  const bot3 = [...bars.map((b) => b.l)].sort((a, b) => a - b).slice(0, 3);
  const mid = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
  const zones = [mid(top3), mid(bot3)].map((v) => ({ hi: v + zoneH / 2, lo: v - zoneH / 2 }));
  /** ⚠ EACH LINE IS ASKED FOR ITS OWN SIDE — deriving it by comparing the pair
   *  back to its hull passes for both when they share an endpoint. */
  const hull = (key: "l" | "h", under: boolean) => {
    const h: number[] = [];
    for (let k = 0; k < bars.length; k++) {
      while (h.length >= 2) {
        const a = h[h.length - 2];
        const b = h[h.length - 1];
        const cross = (b - a) * (bars[k][key] - bars[a][key]) - (bars[b][key] - bars[a][key]) * (k - a);
        if (under ? cross <= 0 : cross >= 0) h.pop();
        else break;
      }
      h.push(k);
    }
    /**
     * ⚠ AN EDGE OF THE HULL, NOT ANY PAIR OF ITS VERTICES. The old version took
     * the widest pair, which is the CHORD from the first vertex to the last —
     * and the chord of a lower hull lies ABOVE it, so the line came out over
     * the candles instead of under them. Only adjacent vertices are an edge,
     * and only an edge is guaranteed to have nothing on its far side.
     */
    let best = [h[0], h[1] ?? h[0]];
    let bestSpan = -1;
    for (let k = 1; k < h.length; k++) {
      if (h[k] - h[k - 1] > bestSpan) { bestSpan = h[k] - h[k - 1]; best = [h[k - 1], h[k]]; }
    }
    return best;
  };
  /** ⚠ ONE LINE, UNDER THE LOWS — Simon. Two lines drew a channel, which is a
   *  claim about where price is contained; one under the lows is the pattern
   *  the word "pola candle" is naming. */
  const chan = (["l"] as const).map((key) => {
    const [a, b2] = hull(key, true);
    return { a, b: b2, key };
  });
  const maPath = pathOf(sma(series.closes, V.read.maPeriod), g);

  return (
    <div
      style={{
        /* ⚠ THE ONE THAT OPENS OUT GOES ON TOP. Left in mount order the second
           window sits over the first as it fills the frame, which reads as a
           card stuck to the glass rather than a card behind it. */
        position: "absolute",
        inset: 0,
        zIndex: open > 0.001 ? 2 : 1,
        opacity: pop.opacity,
        transform: `translateY(${((1 - pop.opacity) * 26).toFixed(1)}px) scale(${(open > 0 ? 1 : pop.scale).toFixed(4)})`,
        transformOrigin: `${(x + V.win.w / 2).toFixed(1)}px ${(V.win.y + V.win.h / 2).toFixed(1)}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: R.win.x,
          top: R.win.y,
          width: R.win.w,
          height: R.win.h,
          borderRadius: V.win.radius,
          background: theme.color.glassPanel,
          border: `${theme.shape.hairline}px solid ${theme.color.glassEdge}`,
          boxShadow: theme.color.glassShadow,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: R.display.x,
          top: R.display.y,
          width: R.display.w,
          height: R.display.h,
          borderRadius: V.ui.display.radius,
          background: theme.color.glassBg,
        }}
      />

      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        {/* ⚠ THE CHART IS CLIPPED INSIDE THE SVG, not by a div around it. The 41
            bars in front of SS4 have to be cut off at the display's edge — but
            wrapping the svg in an `overflow: hidden` div moved 493 pixels of the
            locked display, because a new clipping container rasterises the same
            shapes on a different sub-pixel grid. A clipPath on a `<g>` leaves
            the svg exactly where it was in the DOM. */}
        {CB && (
          <defs>
            <clipPath id={`d${i}`}>
              <rect x={R.display.x} y={R.display.y} width={R.display.w} height={R.display.h} rx={V.ui.display.radius} />
            </clipPath>
          </defs>
        )}
        <g clipPath={CB ? `url(#d${i})` : undefined}>
        {/* ⚠ THE BUILD COUNTS ONLY THE TWENTY. Counting all 61 would spend two
            thirds of the entrance drawing bars that are off the left edge, and
            the window would look empty while it filled. */}
        {series.bars
          .slice(0, long ? SS4_LEAD + Math.ceil(SS4_KEEP.length * built) : Math.ceil(series.bars.length * built))
          .map((b, k) => {
          const bx = g.x(k);
          const fill = b.c >= b.o ? c.candleGreen : c.candleRed;
          const top = Math.min(g.y(b.o), g.y(b.c));
          const h = Math.max(1.5, Math.abs(g.y(b.c) - g.y(b.o)));
          const vh = (vol[k] / peak) * R.volume.h;
          return (
            <g key={k}>
              <line x1={bx} y1={g.y(b.h)} x2={bx} y2={g.y(b.l)} stroke={fill} strokeWidth={theme.shape.hairline} />
              <rect x={bx - w / 2} y={top} width={w} height={h} rx={Math.min(w * 0.22, 4)} fill={fill} />
              <rect
                x={bx - w / 2}
                y={R.volume.y + R.volume.h - vh}
                width={w}
                height={Math.max(1, vh)}
                rx={Math.min(w * 0.28, 4)}
                fill={fill}
                opacity={0.72}
              />
            </g>
          );
        })}

        {/* ⚠ THREE ARROWS, NOT TWO — "di antaranya ada tanda panah". Up and
            down alone is a choice between two things, which is still a
            prediction; the one straight through the middle is what turns it
            into "nobody knows". */}
        {i === 1 &&
          built > 0.99 &&
          [-V.fan.spread, 0, V.fan.spread].map((dy) => {
            const ex = tip.x + V.fan.len;
            const ey = tip.y + dy;
            const a = Math.atan2(ey - tip.y, ex - tip.x);
            const hx = ex - Math.cos(a) * V.fan.head;
            const hy = ey - Math.sin(a) * V.fan.head;
            const nx = -Math.sin(a) * V.fan.head * 0.5;
            const ny = Math.cos(a) * V.fan.head * 0.5;
            return (
              <g key={dy} opacity={head.opacity}>
                <line x1={tip.x} y1={tip.y} x2={hx} y2={hy} stroke={theme.color.indigo} strokeWidth={V.fan.width} strokeLinecap="round" />
                <polygon
                  points={`${ex},${ey} ${hx + nx},${hy + ny} ${hx - nx},${hy - ny}`}
                  fill={theme.color.indigo}
                />
              </g>
            );
          })}

        {/* ── the four things to read volume against ──────────────────
            ⚠ ONLY ONCE THE WINDOW IS OPEN, so none of them can appear in the
            display SS6 locks. Each is DERIVED from the tape — a zigzag through
            its own swings, zones on its own extremes, a channel on its own
            hull, an average of its own closes — and drawn in the colour of the
            word that named it. */}
        {i === 0 && open > 0.99 && (
          <>
            {on(0) > 0.001 && (
              <path d={zigPath} fill="none" stroke={theme.color.indigo} strokeWidth={V.read.width} strokeLinecap="round" strokeLinejoin="round" opacity={on(0)} />
            )}
            {on(1) > 0.001 &&
              zones.map((z, k) => (
                <rect
                  key={k}
                  x={R.price.x}
                  y={g.y(z.hi)}
                  width={R.price.w}
                  height={Math.max(2, g.y(z.lo) - g.y(z.hi))}
                  fill={theme.color.indigoWash}
                  stroke={theme.color.indigo}
                  strokeWidth={theme.shape.rule}
                  rx={10}
                  opacity={on(1)}
                />
              ))}
            {on(2) > 0.001 &&
              chan.map((q, k) => (
                <line
                  key={k}
                  x1={g.x(q.a)}
                  y1={g.y(bars[q.a][q.key])}
                  x2={g.x(q.b)}
                  y2={g.y(bars[q.b][q.key])}
                  stroke={theme.color.indigo}
                  strokeWidth={V.read.width}
                  strokeLinecap="round"
                  opacity={on(2)}
                />
              ))}
            {on(3) > 0.001 && (
              <path d={maPath} fill="none" stroke={theme.color.indigo} strokeWidth={V.read.width} strokeLinecap="round" opacity={on(3)} />
            )}
          </>
        )}
        </g>
      </svg>

      {/* ── the row of words under the display ──────────────────────────── */}
      {i === 0 && open > 0.5 && (
        <div
          style={{
            position: "absolute",
            left: FULL.display.x,
            top: ROW_Y,
            width: FULL.display.w,
            display: "flex",
            alignItems: "baseline",
            gap: 22,
            fontFamily: theme.text.family,
            fontSize: V.full.size,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {[V.read.lead, ...V.read.items].map((q, k) => {
            const r = textReveal(f, local(q.at, FROM), V.read.over, 12);
            const lead = k === 0;
            const lit = k - 1 === live;
            return (
              <span
                key={q.text}
                style={{
                  /* ⚠ THE PADDING IS ON EVERY WORD, lit or not — only the fill
                     and the ink change, so the row cannot re-flow as the
                     highlight moves along it. */
                  padding: lead ? 0 : `${V.read.pill.y}px ${V.read.pill.x}px`,
                  borderRadius: V.read.pill.radius,
                  background: lit ? theme.color.indigo : undefined,
                  color: lead ? c.ink : lit ? theme.color.onIndigo : theme.color.mute,
                  whiteSpace: "nowrap",
                  opacity: r.opacity,
                  transform: `translateY(${r.dy.toFixed(1)}px)`,
                }}
              >
                {q.text}
              </span>
            );
          })}
        </div>
      )}

      {/* ── the mark at the top, and the name under the display ─────────── */}
      {chrome > 0.001 && (
        <>
          <Disc
            x={x + V.win.w / 2 - V.ui.icon.d / 2}
            y={V.win.y + V.ui.icon.top}
            d={V.ui.icon.d}
            fill={card.tone === "ok" ? c.candleGreen : theme.color.warn}
            kind={card.tone === "ok" ? "check" : "cross"}
            opacity={chrome}
          />
          <div
            style={{
              position: "absolute",
              left: x,
              top: V.win.y + V.ui.title.y,
              width: V.win.w,
              textAlign: "center",
              fontFamily: theme.text.family,
              fontSize: V.ui.title.size,
              fontWeight: 800,
              lineHeight: 1,
              color: theme.color.glassInk,
              opacity: head.opacity * chrome,
              transform: `translateY(${head.dy.toFixed(1)}px)`,
            }}
          >
            {card.title}
          </div>
        </>
      )}
    </div>
  );
};

const Disc = ({
  x, y, d, fill, kind, opacity,
}: { x: number; y: number; d: number; fill: string; kind: "check" | "cross"; opacity: number }) => {
  const r = d / 2;
  const a = d * 0.24;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={d} height={d} opacity={opacity}>
      <circle cx={r} cy={r} r={r} fill={fill} />
      <path
        d={
          kind === "check"
            ? `M${r - a} ${r} L${r - a * 0.15} ${r + a * 0.8} L${r + a} ${r - a * 0.7}`
            : `M${r - a} ${r - a} L${r + a} ${r + a} M${r + a} ${r - a} L${r - a} ${r + a}`
        }
        stroke="#FFFFFF"
        strokeWidth={Math.max(3, d * 0.09)}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export const SC19 = () => {
  const f = useCurrentFrame();
  /** ⚠ BOTH HALVES ON ONE ELEMENT, CONCATENATED — two style objects each with a
   *  `transform` means the second silently wins and the cut goes one-sided. */
  const cIn = cutInStyle(f + FROM, CUTS.toLimits);
  const cOut = cutOutStyle(f + FROM, CUTS.toClose);
  const cam = {
    transform: `${cIn.transform} ${cOut.transform}`,
    filter: [cIn.filter, cOut.filter].filter((q) => q && q !== "none").join(" ") || undefined,
  };
  return (
    <Stage transparent>
      <div style={{ position: "absolute", inset: 0, ...cam }}>
        {V.cards.map((_, i) => (
          <Window key={i} i={i} />
        ))}
      </div>
    </Stage>
  );
};

/**
 * ═══ THE LOCK, IN CODE ═══
 *
 * `npm run lock:ss6` catches a changed display by rendering it; these catch it
 * at BUILD time, before anything is rendered at all. Every number below is one
 * the two displays are made of — move any of them and this throws with the name
 * of what moved, instead of quietly producing a different picture.
 */
{
  const eq = (name: string, got: unknown, want: unknown) => {
    if (JSON.stringify(got) !== JSON.stringify(want)) {
      throw new Error(
        `SS6 LOCK: ${name} is ${JSON.stringify(got)}, and the approved display was drawn with ${JSON.stringify(want)}. ` +
          "Both product displays at f18250 are approved artwork — change the thing that moved this, not the lock.",
      );
    }
  };
  eq("LIMITS.win", V.win, { w: 440, h: 640, radius: 46, y: 220, gap: 160 });
  eq("LIMITS.ui.display", V.ui.display, { x: 20, y: 110, w: 400, h: 400, radius: 30 });
  eq("LIMITS.ui.price", V.ui.price, { x: 34, y: 124, w: 372, h: 250 });
  eq("LIMITS.ui.volume", V.ui.volume, { x: 34, y: 392, w: 372, h: 104 });
  eq("the frames the two windows arrive on", V.cards.map((q) => q.at), [17996, 18148]);
  eq("SS4's bar count", SS4.bars.length, 20);
  eq("COLOUR's bar count", COLOUR.bars.length, 14);
  /* the tapes themselves, at the ends — enough to catch a reseed or a retrace */
  eq(
    "SS4's first and last close",
    [SS4.closes[0], SS4.closes[SS4.closes.length - 1]].map((v) => Math.round(v * 1e3)),
    [276000,645000],
  );
}
