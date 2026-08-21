/**
 * CG-A — Scenes 02 + 03 as ONE spanning Sequence (global 607 → 1765).
 *
 * The chart mounts once, here, and never unmounts. The candles drawn in Scene
 * 02 are the same objects Scene 03 keeps annotating — a remount would redraw
 * the series the viewer just watched appear, and quietly undo the one thing
 * these two scenes prove together.
 *
 * ═══ THE WINDOW SCROLLS, THE CARD DOES NOT ═══
 *
 * The chart and its averages travel LEFT inside a card that stays exactly
 * where it is, leaving the right third empty; then new sessions print into
 * that space one at a time. The card clips it all, which is the whole trick:
 * it is a window onto a series that keeps running, not a picture redrawn.
 *
 * Everything that moves lives inside one clipped, translated group. Gridlines
 * do not — they belong to the card, not to the tape, and translating them
 * would open a gap at the right edge as the chart slid away from it.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { Layer, gridOf, pathOf, lengthOf } from "../components/ChartFrame";
import { QuoteBox } from "../components/QuoteBox";
import { theme } from "../theme";
import { sec, sma, mulberry32, clamp01, progress, progressInOut, drawPath } from "../helpers";
import { toBars, domainOf } from "../series";
import { EXPLAINER_2, fromAnchors } from "../data/shots";
import { CUTS, cutInStyle, cutOutStyle } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this group is mounted, needed to read the cut from global frames. */
const FROM = 607;
/** Global → local. Every beat below is quoted in Simon's global frames. */
const at = (global: number) => global - FROM;

/**
 * ═══ THE TIMELINE ═══ (global frames in the margin)
 *
 *  607   the card, the title, and MA20 / MA200 sitting under it, both off
 *  679   the candles draw in
 *  757   the orange average is traced through them
 *  955 – 1000   the window SLIDES left, leaving the right third of the card
 *        empty
 * 1000 – 1105   forty-five new sessions print into that space one at a time,
 *        and the average lengthens behind them
 *                                  "Setiap hari, garisnya ikut bergerak."
 * 1106   MA20 / MA200 move to the middle of the frame
 * 1177   MA20 lights indigo, and the 20-period average is traced
 * 1387   MA200 lights indigo, and the 200-period average is traced
 * 1498   the camera backs off onto the whole series — the forty-five bars the
 *        slide pushed off the left come back into the card
 * 1575   the quote box opens on the card's bottom edge
 */
const T = {
  title: at(607),
  price: at(679),
  ma: at(757),
  /**
   * TWO BEATS, not one. The window SLIDES first and leaves the right-hand
   * third of the card empty; only then do the new sessions print into it, one
   * at a time, with the average lengthening behind them. Doing both at once
   * hid the move — candles arriving at the edge is exactly what a scrolling
   * chart looks like, so nothing appeared to have happened.
   */
  slide: at(955),
  slideDur: 45,
  print: at(1000),
  printDur: 105,
  /** Everything from here belongs to Scene 03. */
  clear: at(1106),
  centre: at(1106),
  fast: at(1177),
  slow: at(1387),
  /** The pull-back onto the whole series, under the MA200 line. */
  zoom: at(1498),
  zoomOver: 24,
  quote: at(1575),
  pulse: at(1688),
};
const FAST_P = 20;
const SLOW_P = 200;
/** Scene 02's single average. One line, so it takes the orange. */
const MID_P = 40;
const TICKS = [73000, 74000, 75000, 76000, 77000];
/**
 * Bars in the window at rest, and the ones that print while it runs. 45 bars
 * is 639px — better than a third of the card, so the empty space the slide
 * opens up is unmistakably empty.
 */
const BASE = 120;
const EXTRA = 45;
/**
 * The indicator buttons: light grey at 35% until their line is drawn, then
 * indigo. `rowW` is the pair's own width, needed to centre them — it is
 * measured, not computed, because a browser measurement is only available
 * after layout and this has to be known before it.
 */
const MA_BTN = { top: 118, gap: 10, padX: 16, padY: 6, size: 30, off: 0.35, rowW: 248 };
/**
 * How far the card sits below its layout box. 170 + 30 + 680 = 880, and the
 * subtitle band starts at 972 — the drop has 92px to spend and takes 30.
 */
const DROP = 30;
const BOX = {
  x: theme.layout.chartA.x,
  y: theme.layout.chartA.y + DROP,
  w: theme.layout.chartA.w,
  h: theme.layout.chartA.h,
};
/** The quote box rides the card's bottom edge. */
const QUOTE = { w: 640, h: 118 };
// ═══════════════════════════════════════════════════════════════════════════

const SEEDED = fromAnchors(EXPLAINER_2, BASE, 3702);
/**
 * The sessions that print WHILE the scene runs — random, and bounded.
 *
 * A plain random walk over thirty bars wanders far enough to widen the price
 * domain, and the domain is fixed at module scope: everything drawn before
 * would silently re-scale to accommodate bars that have not printed yet. The
 * pull back towards the last known close is what keeps it in the band.
 */
const CLOSES = (() => {
  const rnd = mulberry32(9014);
  const out = [...SEEDED];
  const anchor = SEEDED[BASE - 1];
  const step = anchor * 0.0065;
  let p = anchor;
  for (let i = 0; i < EXTRA; i++) {
    p += (rnd() - 0.5) * 2 * step - (p - anchor) * 0.045;
    out.push(p);
  }
  return out;
})();
const BARS = toBars(CLOSES, 3703);

/**
 * THE WINDOW IS A SLICE OF A LONGER HISTORY.
 *
 * A 200-period average cannot exist inside a 150-bar window — by the time the
 * first visible bar prints, MA200 has had its two hundred sessions long since.
 * So every average is computed over the visible bars PLUS a seeded run of
 * prior ones, and only the visible part is drawn. It is also why every line
 * here starts at the LEFT EDGE rather than a fifth of the way across.
 *
 * The prior walk is FLAT, not drifting. The first visible bar is the lowest of
 * the window, so a prior history that trends anywhere drags MA200 below the
 * box — and since the domain has to contain it, the candles get squashed into
 * a strip to make room for a line nobody is looking at.
 */
const PRIOR = (() => {
  const rnd = mulberry32(2301);
  const step = CLOSES[0] * 0.0025;
  const out: number[] = [];
  let p = CLOSES[0];
  for (let i = 0; i < SLOW_P + 10; i++) {
    p += (rnd() - 0.5) * 2 * step;
    out.unshift(p);
  }
  return out;
})();
const WITH_HISTORY = [...PRIOR, ...CLOSES];
const maOf = (period: number) => sma(WITH_HISTORY, period).slice(PRIOR.length);
const MA_FAST = maOf(FAST_P);
const MA_SLOW = maOf(SLOW_P);
/** Scene 02's single line — the one that appears through the noise. */
const MA_MID = maOf(MID_P);

const DOMAIN = domainOf([...MA_SLOW], BARS);
/**
 * The grid is built from the RESTING window — the first 120 bars across the
 * card. `x` is linear and unclamped, so bar 120 and up land off the right edge
 * at the same pitch, and the scroll brings them in.
 */
const G = gridOf(SEEDED, DOMAIN, BOX, 0.12, 0);
const PITCH = G.x(1) - G.x(0);
const SHIFT_MAX = EXTRA * PITCH;
const BODY_W = Math.max(2, Math.min(20, PITCH * 0.62));
/** One bar at a time, evenly across the printing beat. */
const arrivalOf = (k: number) => T.print + (k / EXTRA) * T.printDur;

/**
 * ═══ THE PULL-BACK ═══
 *
 * MA200 is the line about the big picture, so under it the camera backs off
 * until the WHOLE series is in the card — including the forty-five bars the
 * slide pushed off the left edge. 120 visible bars become 165, which is a
 * scale of 120/165, anchored on the newest bar so the right edge stays put and
 * history opens up on the left rather than the chart drifting sideways.
 *
 * It is a uniform scale, not a horizontal squeeze: scaling one axis alone
 * makes SVG stroke widths behave unpredictably, and a wick that thins while a
 * body does not is a chart that looks broken rather than distant.
 */
const ZOOM = BASE / (BASE + EXTRA);
/** The newest bar's resting position — 18px in from the card's right edge. */
const ANCHOR = { x: BOX.x + BOX.w - 18, y: BOX.y + BOX.h / 2 };

export const ExplainerGroup = () => {
  const f = useCurrentFrame();
  /**
   * The other half of SC01's cut. This group is mounted at global 607, so its
   * own frames are rebased and the cut's curve has to be read from the GLOBAL
   * frame — `f + FROM` — or the two halves would evaluate different points of
   * the same move and the join would read as two separate slides.
   */
  const g = f + FROM;
  /**
   * This group sits BETWEEN two cuts: SC01 hands it in on a rise at 607, and
   * it hands SC04 on with a track left at 1765. Both are read from the GLOBAL
   * frame, because the other half of each reads the same curve from its own
   * position — evaluate one of them locally and the two halves move apart.
   *
   * The windows never overlap, so whichever is live wins; away from both, each
   * returns a zero offset and no blur.
   */
  const cut = g < CUTS.toTypes.at - CUTS.toTypes.over
    ? cutInStyle(g, CUTS.toAverage)
    : cutOutStyle(g, CUTS.toTypes);

  /** The slide, then the printing. They do not overlap. */
  const shift = SHIFT_MAX * progressInOut(f, T.slide, T.slideDur);
  const printed = BASE + Math.floor(clamp01((f - T.print) / T.printDur) * EXTRA);

  /** Scene 02 quietens the price when Scene 03 takes over the card. */
  const price = f >= T.clear ? 0.4 : 1;
  const midOut = f >= T.clear ? 1 - progress(f, T.clear, sec(2.2)) : 1;
  /** Both lines thicken once, together — "trader sering melihat keduanya". */
  const pulse = f >= T.pulse ? Math.sin(Math.PI * clamp01((f - T.pulse) / 30)) : 0;
  /**
   * The averages hold their ON-SCREEN weight through the pull-back. Everything
   * in the scaled group thins with it, and these two lines are what the scene
   * is about — a thinner MA200 at the exact moment it is being explained reads
   * as it mattering less.
   */
  const zoom = 1 - (1 - ZOOM) * progressInOut(f, T.zoom, T.zoomOver);
  const width = (theme.layout.stroke.ma + pulse * 1.5) / zoom;

  /** The buttons leave the title and take the middle of the frame. */
  const centred = progressInOut(f, T.centre, 20);
  const btnLeft =
    theme.layout.titleChip.x +
    ((theme.layout.width - MA_BTN.rowW) / 2 - theme.layout.titleChip.x) * centred;

  /** A trace of one average, clipped to what has printed. */
  const trace = (
    values: (number | null)[],
    color: string,
    from: number,
    dur: number,
    o = 1,
  ) => {
    if (f < from || o <= 0.001) return null;
    const upto = values.slice(0, printed);
    return (
      <path
        d={pathOf(upto, G)}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={o}
        {...drawPath(f, from, dur, lengthOf(upto, G))}
      />
    );
  };

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          ...cut,
        }}
      >
        {/* the white card every chart in this episode is drawn on */}
        <div
          style={{
            position: "absolute",
            left: BOX.x,
            top: BOX.y,
            width: BOX.w,
            height: BOX.h,
            borderRadius: theme.layout.radius.lg,
            background: theme.colors.surface,
            border: `${theme.layout.border.thin}px solid ${theme.colors.border}`,
          }}
        />

        <Layer>
          <defs>
            {/* everything that scrolls is clipped to the card */}
            <clipPath id="cgaCard">
              <rect
                x={BOX.x}
                y={BOX.y}
                width={BOX.w}
                height={BOX.h}
                rx={theme.layout.radius.lg}
              />
            </clipPath>
          </defs>

          {/* gridlines belong to the CARD, not to the tape: they do not move */}
          <g opacity={price}>
            {TICKS.filter((p) => G.y(p) >= BOX.y && G.y(p) <= BOX.y + BOX.h).map((p) => (
              <line
                key={p}
                x1={BOX.x}
                y1={G.y(p)}
                x2={BOX.x + BOX.w}
                y2={G.y(p)}
                stroke={theme.colors.gridline}
                strokeWidth={theme.layout.border.thin}
              />
            ))}
          </g>

          <g clipPath="url(#cgaCard)">
            <g
              transform={
                `translate(${ANCHOR.x} ${ANCHOR.y}) scale(${zoom.toFixed(4)}) ` +
                `translate(${-ANCHOR.x} ${-ANCHOR.y}) translate(${-shift.toFixed(1)},0)`
              }
            >
              {/* the tape */}
              <g opacity={price}>
                {BARS.map((b, i) => {
                  if (i >= printed) return null;
                  /* the resting window draws in; the new sessions fade on as
                     they cross the right edge */
                  const o =
                    i < BASE
                      ? progress(f, T.price, sec(2.3)) >= (i + 1) / BASE
                        ? 1
                        : 0
                      : clamp01((f - arrivalOf(i - BASE)) / 6);
                  if (o <= 0.001) return null;
                  const x = G.x(i);
                  const top = Math.min(G.y(b.o), G.y(b.c));
                  const h = Math.max(1.5, Math.abs(G.y(b.c) - G.y(b.o)));
                  /* candle bodies are the ONLY place green and red appear */
                  const fill = b.c >= b.o ? theme.colors.candleGreen : theme.colors.candleRed;
                  return (
                    <g key={i} opacity={o}>
                      <line
                        x1={x}
                        y1={G.y(b.h)}
                        x2={x}
                        y2={G.y(b.l)}
                        stroke={theme.colors.price}
                        strokeWidth={theme.layout.stroke.wick}
                      />
                      <rect x={x - BODY_W / 2} y={top} width={BODY_W} height={h} fill={fill} />
                    </g>
                  );
                })}
              </g>

              {/* Scene 02's single average, and Scene 03's pair */}
              {trace(MA_MID, theme.colors.maOrange, T.ma, sec(6.1), midOut)}
              {trace(MA_FAST, theme.colors.cyan, T.fast, sec(4.0))}
              {trace(MA_SLOW, theme.colors.indigo, T.slow, sec(4.0))}
            </g>
          </g>
        </Layer>

        {/* The heading is NOT here. "Moving Average" is mounted at the
            composition root, spanning this group and SC04, so it holds still
            through the cut at 1765 — the subject does not change there, and a
            heading that left and came back would say that it did. */}

        {/* ── MA20 / MA200 — under the title, then in the middle ── */}
        {f >= T.title + 12 && (
          <div
            style={{
              position: "absolute",
              left: btnLeft,
              top: MA_BTN.top,
              display: "flex",
              gap: MA_BTN.gap,
              opacity: progress(f, T.title + 12, theme.motion.revealF),
            }}
          >
            {[
              { label: "MA20", at: T.fast },
              { label: "MA200", at: T.slow },
            ].map((b) => {
              /**
               * The two skins CROSS-FADE. Swapping them on a threshold made
               * the fill, the border and the label all change on one frame,
               * which reads as a flicker rather than a control being switched
               * on. Both are rendered, one over the other.
               */
              const sel = f >= b.at ? progress(f, b.at, 16) : 0;
              const skin = (on: boolean) => ({
                fontFamily: theme.type.family,
                fontSize: MA_BTN.size,
                fontWeight: theme.type.label.weight,
                color: on ? theme.colors.surface : theme.colors.textMuted,
                background: on ? theme.colors.indigo : theme.colors.surface,
                border: `${theme.layout.border.thin}px solid ${on ? theme.colors.indigo : theme.colors.border}`,
                borderRadius: theme.layout.radius.sm,
                padding: `${MA_BTN.padY}px ${MA_BTN.padX}px`,
              });
              return (
                <span key={b.label} style={{ position: "relative", display: "inline-block" }}>
                  {/* off — sits back at 35%, present but plainly not chosen */}
                  <span style={{ ...skin(false), display: "inline-block", opacity: (1 - sel) * MA_BTN.off }}>
                    {b.label}
                  </span>
                  {/* on — laid exactly over it, so nothing shifts as it lands */}
                  <span
                    style={{
                      ...skin(true),
                      position: "absolute",
                      left: 0,
                      top: 0,
                      opacity: sel,
                    }}
                  >
                    {b.label}
                  </span>
                </span>
              );
            })}
          </div>
        )}

        {/* ── the line the run leaves you with ── */}
        <QuoteBox
          f={f}
          at={T.quote}
          w={QUOTE.w}
          h={QUOTE.h}
          y={BOX.y + BOX.h}
          lines={[
            { segments: [{ text: "Pendek", tone: "cyan" }, { text: " lebih responsif." }] },
            { segments: [{ text: "Panjang", tone: "indigo" }, { text: " untuk big picture." }] },
          ]}
        />
      </div>
    </SafeArea>
  );
};
