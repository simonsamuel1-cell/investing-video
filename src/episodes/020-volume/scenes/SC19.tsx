/**
 * SC19 — what volume is for, and what it is not. `from 17848 · dur 944`
 *
 * ═══ THE SMALL WINDOW IS A MASK, NOT A SMALL CHART ═══
 *
 * ⚠ THE TAPE IS LAID OUT ONCE AND NEVER RE-LAID. Simon: "yang kecil ini ibarat
 * masking sebagian kecil dari chart besarnya… aku gamau ukurannya berubah". The
 * chart has ONE geometry in canvas pixels; the window is a hole cut in front of
 * it. Opening the window makes the hole bigger, which REVEALS more bars — it
 * does not stretch the ones already showing.
 *
 * ⚠ WHICH IS WHY THE CHART'S HEIGHT FITS THE SMALL DISPLAY, NOT THE BIG ONE.
 * Extending sideways is the only extension that can happen without a rescale:
 * both panels must be wholly visible in the little window, so their combined
 * height is set to fit inside it and the grown window carries the spare room
 * instead. A chart sized to the tall display would have to shrink to fit the
 * short one, which is the change of size this scene exists not to make.
 *
 * ⚠ AND THE OFFSET IS THE ONLY THING THAT MOVES. In the small state the tape is
 * slid so its TAIL sits in the hole — the breakout is the point of the card —
 * and that slide goes to zero as the window opens out.
 *
 * Everything the scene used to draw is gone ("hilangkan semua visual"); the
 * ground and the heading belong to MistakesLayer, which spans this scene and
 * SC18 across the cut neither of them takes part in.
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, cutInStyle, cutOutStyle, gridOf, pathOf, popIn, progress,
  progressInOut, sma, textReveal, usePalette, theme,
} from "../../../core";
import { BLOCK, CUTS, LIMITS, local } from "../data/timing";
import {
  SS4_LONG, SS4_LONG_DOMAIN, SS4_LONG_VOL, COLOUR, COLOUR_VOL, domainOfColour,
  zigzagOf,
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
const PAIR_X = [
  theme.canvas.width / 2 - PAIR_W / 2,
  theme.canvas.width / 2 - PAIR_W / 2 + V.win.w + V.win.gap,
];

const small = (x: number): Record<string, Rect> => ({
  win: { x, y: V.win.y, w: V.win.w, h: V.win.h },
  display: { x: x + V.ui.display.x, y: V.win.y + V.ui.display.y, w: V.ui.display.w, h: V.ui.display.h },
});

/**
 * ⚠ 25 ON THREE SIDES AND A LINE OF TEXT AT THE BOTTOM — Simon's numbers, and
 * the bottom one is DERIVED from the row's own size, so setting the type bigger
 * takes exactly as much room from the chart as the words now need.
 */
const CARD = theme.stage.card;
const P = V.full.pad;
const ROW_H = V.full.gap + V.full.size + V.full.gap;
const DISPLAY_H = CARD.h - P - ROW_H;
const FULL: Record<string, Rect> = {
  win: { x: CARD.x, y: CARD.y, w: CARD.w, h: CARD.h },
  display: { x: CARD.x + P, y: CARD.y + P, w: CARD.w - P * 2, h: DISPLAY_H },
};
const ROW_Y = CARD.y + P + DISPLAY_H + V.full.gap;

/** The chart's ONE geometry — see the header. */
const CH_H = { price: 250, gap: 26, volume: 104 };
const CH_TOTAL = CH_H.price + CH_H.gap + CH_H.volume;
const CH_TOP = FULL.display.y + (DISPLAY_H - CH_TOTAL) / 2;
const CH = {
  price: { x: FULL.display.x + 34, y: CH_TOP, w: FULL.display.w - 68, h: CH_H.price },
  volume: { x: FULL.display.x + 34, y: CH_TOP + CH_H.price + CH_H.gap, w: FULL.display.w - 68, h: CH_H.volume },
};

/**
 * ⚠ THE SECOND WINDOW KEEPS ITS OWN LAYOUT, AND THAT IS NOT AN INCONSISTENCY.
 * The masking rule exists so that a chart which GROWS does not resize; this one
 * never grows, and laying its fourteen bars out on the big chart's pitch put
 * three of them in the window at 124px apart. A tape that is only ever seen at
 * one size should be drawn for that size.
 */
const SMALL_CH = (x: number) => {
  const d = small(x).display;
  return {
    price: { x: d.x + 22, y: d.y + 22, w: d.w - 44, h: d.h * 0.6 },
    volume: { x: d.x + 22, y: d.y + d.h * 0.7, w: d.w - 44, h: d.h * 0.24 },
  };
};

/** The five inks the row is set in, read from the palette where it has them so
 *  a palette swap takes the marks with it. */
const TONE = (c: ReturnType<typeof usePalette>) => ({
  ink: c.ink,
  indigo: theme.color.indigo,
  orange: theme.color.orange,
  cyan: c.cyan,
  marun: theme.color.marun,
});

/* ── one window ───────────────────────────────────────────────────────────── */

const Window = ({ i }: { i: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const card = V.cards[i];
  const at = local(card.at, FROM);
  const pop = popIn(f, at, V.pop);
  if (pop.opacity <= 0.001) return null;

  const spread = progressInOut(f, local(V.spread.at, FROM), V.spread.over);
  const x = i === 0 ? lerp(SOLO_X, PAIR_X[0], spread) : PAIR_X[1];

  /** ⚠ ONLY THE LEFT ONE OPENS OUT, and its words leave as it does — Simon:
   *  "text dan iconnya fade out". What is being revealed is more chart. */
  const open = i === 0 ? progressInOut(f, local(V.grow.at, FROM), V.grow.over) : 0;
  const S = small(x);
  const R = { win: mixRect(S.win, FULL.win, open), display: mixRect(S.display, FULL.display, open) };

  const series = i === 0 ? SS4_LONG : COLOUR;
  const domain = i === 0 ? SS4_LONG_DOMAIN : domainOfColour;
  const vol = i === 0 ? SS4_LONG_VOL : COLOUR_VOL;
  /** ⚠ ONE GEOMETRY FOR THE WINDOW THAT EXTENDS, ITS OWN FOR THE ONE THAT DOES
   *  NOT. See SMALL_CH. */
  const CHi = i === 0 ? CH : SMALL_CH(x);
  const g = gridOf(series.closes, domain, CHi.price, 0.08, i === 1 ? V.fan.gutter : 0);
  const built = progress(f, at + V.build.after, V.build.over);
  const head = textReveal(f, at + V.words.after, V.words.over, 12);
  const w = Math.max(3, g.slot * 0.66);
  const peak = Math.max(...vol);
  const chrome = (1 - open) * pop.opacity;
  const bars = series.bars;

  /**
   * ⚠ THE MASK'S OFFSET, AND NOTHING ELSE. In the small state the tape is slid
   * so its last bar sits `tail` inside the hole's right edge; opened out, the
   * slide is zero and the chart is exactly where it was laid.
   */
  const last = bars.length - 1;
  const tail = i === 1 ? V.fan.len + 60 : 44;
  const dx = i === 1 ? 0 : lerp(S.display.x + S.display.w - tail - g.x(last), 0, open);
  const dy = i === 1 ? 0 : lerp(S.display.y + (S.display.h - CH_TOTAL) / 2 - CH_TOP, 0, open);
  const tip = { x: g.x(last), y: g.y(bars[last].c) };

  /**
   * ═══ THE FOUR MARKS ═══  — each DERIVED from the tape rather than placed on
   * it: a zigzag through its own swings, zones on its own extremes, a channel
   * on its own hull, an average of its own closes.
   */
  const R2 = V.read;
  const on = (k: number) => progress(f, local(R2.items[k].at, FROM), R2.over);
  const ink = TONE(c);
  const span = domain[1] - domain[0];

  const zig = zigzagOf(bars, span * R2.zigThr).map((q) => ({ x: g.x(q.i), y: g.y(q.v) }));
  const zigPath = "M " + zig.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" L ");

  const highs = [...bars.map((b) => b.h)].sort((a, b) => b - a);
  const lows = [...bars.map((b) => b.l)].sort((a, b) => a - b);
  const zones = [
    { hi: highs[0], lo: highs[3] },
    { hi: lows[3], lo: lows[0] },
  ];

  /** ⚠ EACH LINE IS ASKED FOR ITS OWN SIDE. Deriving the side by comparing the
   *  pair back to the hull it came from passes for both when they share an
   *  endpoint, and drew the lows line twice. */
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
    let best = [h[0], h[h.length - 1]];
    let bestSpan = -1;
    for (let a = 0; a < h.length; a++) {
      for (let b = a + 1; b < h.length; b++) {
        if (h[b] - h[a] > bestSpan) { bestSpan = h[b] - h[a]; best = [h[a], h[b]]; }
      }
    }
    return best;
  };
  const chan = (["l", "h"] as const).map((key) => {
    const [a, b2] = hull(key, key === "l");
    return { a, b: b2, key };
  });
  const maPath = pathOf(sma(series.closes, R2.maPeriod), g);

  return (
    <div
      style={{
        /* ⚠ THE ONE THAT OPENS OUT GOES ON TOP, or the second sits over it as it
           fills the frame and reads as a card stuck to the glass. */
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

      {/* ⚠ THE HOLE. Two divs: one sized to the display, one shifted back by its
          origin so everything inside stays in CANVAS coordinates — and the tape
          slides behind it rather than being redrawn to fit. */}
      <div
        style={{
          position: "absolute",
          left: R.display.x,
          top: R.display.y,
          width: R.display.w,
          height: R.display.h,
          borderRadius: V.ui.display.radius,
          background: theme.color.glassBg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -R.display.x,
            top: -R.display.y,
            width: theme.canvas.width,
            height: theme.canvas.height,
            transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`,
          }}
        >
          <svg
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
            width={theme.canvas.width}
            height={theme.canvas.height}
          >
            {bars.slice(0, Math.ceil(bars.length * built)).map((b, k) => {
              const bx = g.x(k);
              const fill = b.c >= b.o ? c.candleGreen : c.candleRed;
              const top = Math.min(g.y(b.o), g.y(b.c));
              const h = Math.max(1.5, Math.abs(g.y(b.c) - g.y(b.o)));
              const vh = (vol[k] / peak) * CHi.volume.h;
              return (
                <g key={k}>
                  <line x1={bx} y1={g.y(b.h)} x2={bx} y2={g.y(b.l)} stroke={fill} strokeWidth={theme.shape.rule} />
                  <rect x={bx - w / 2} y={top} width={w} height={h} rx={Math.min(w * 0.22, 5)} fill={fill} />
                  <rect
                    x={bx - w / 2}
                    y={CHi.volume.y + CHi.volume.h - vh}
                    width={w}
                    height={Math.max(1, vh)}
                    rx={Math.min(w * 0.28, 6)}
                    fill={fill}
                    opacity={0.72}
                  />
                </g>
              );
            })}

            {/* ⚠ THREE ARROWS, NOT TWO — "di antaranya ada tanda panah". Up and
                down alone is a choice between two things, which is still a
                prediction; the one through the middle makes it "nobody knows". */}
            {i === 1 &&
              built > 0.99 &&
              [-V.fan.spread, 0, V.fan.spread].map((ddy) => {
                const ex = tip.x + V.fan.len;
                const ey = tip.y + ddy;
                const a = Math.atan2(ey - tip.y, ex - tip.x);
                const hx = ex - Math.cos(a) * V.fan.head;
                const hy = ey - Math.sin(a) * V.fan.head;
                const nx = -Math.sin(a) * V.fan.head * 0.5;
                const ny = Math.cos(a) * V.fan.head * 0.5;
                return (
                  <g key={ddy} opacity={head.opacity}>
                    <line x1={tip.x} y1={tip.y} x2={hx} y2={hy} stroke={theme.color.indigo} strokeWidth={V.fan.width} strokeLinecap="round" />
                    <polygon points={`${ex},${ey} ${hx + nx},${hy + ny} ${hx - nx},${hy - ny}`} fill={theme.color.indigo} />
                  </g>
                );
              })}

            {/* ── the four things to read volume against ──────────────────
                ⚠ EACH IN THE COLOUR OF THE WORD THAT NAMED IT, so the colour
                is the link rather than a decoration. */}
            {i === 0 && open > 0.99 && (
              <>
                {on(0) > 0.001 && (
                  <path d={zigPath} fill="none" stroke={ink.indigo} strokeWidth={R2.width} strokeLinecap="round" strokeLinejoin="round" opacity={on(0)} />
                )}
                {on(1) > 0.001 &&
                  zones.map((z, k) => (
                    <rect
                      key={k}
                      x={CHi.price.x}
                      y={g.y(z.hi)}
                      width={CHi.price.w}
                      height={Math.max(2, g.y(z.lo) - g.y(z.hi))}
                      fill={`${ink.orange}22`}
                      stroke={ink.orange}
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
                      stroke={ink.cyan}
                      strokeWidth={R2.width}
                      strokeLinecap="round"
                      opacity={on(2)}
                    />
                  ))}
                {on(3) > 0.001 && (
                  <path d={maPath} fill="none" stroke={ink.marun} strokeWidth={R2.width} strokeLinecap="round" opacity={on(3)} />
                )}
              </>
            )}
          </svg>
        </div>
      </div>

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
          {[V.read.lead, ...V.read.items].map((q) => {
            const r = textReveal(f, local(q.at, FROM), V.read.over, 12);
            return (
              <span
                key={q.text}
                style={{
                  color: ink[q.tone],
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
  /** ⚠ BOTH HALVES ON ONE ELEMENT, CONCATENATED. Two style objects each with a
   *  `transform` means the second silently wins, and the cut goes one-sided. */
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
