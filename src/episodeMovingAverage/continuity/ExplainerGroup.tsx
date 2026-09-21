/**
 * CG-A — Scenes 02 + 03 + 04 as ONE spanning Sequence (global 626 → 2381).
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
import React from "react";
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { Layer, gridOf, pathOf, lengthOf } from "../components/ChartFrame";
import { QuoteBox } from "../components/QuoteBox";
import { theme } from "../theme";
import {
  sec,
  sma,
  ema,
  mulberry32,
  clamp01,
  progress,
  progressInOut,
  drawPath,
} from "../helpers";
import { toBars, domainOf } from "../series";
import { EXPLAINER_2, fromAnchors } from "../data/shots";
import { CUTS, cutOutStyle } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this group is mounted, needed to read the cut from global frames. */
/**
 * 626, not 715. SC01 no longer CUTS here — it dissolves off the top of this
 * group over 660 → 680, so the group has to be mounted underneath before the
 * fade starts. Nothing else moved: every beat below is quoted as a GLOBAL
 * frame through `at()`, so lowering FROM shifts the local frames and leaves
 * the timeline where it was.
 */
const FROM = 626;
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
 *
 * ─── and then SCENE 04, on the same candles ───
 *
 * 1788   MA20, MA200, both their lines and the quote box RISE AWAY and are
 *        gone. The chart does not move. This is the whole reason SC04 stopped
 *        being its own scene: the two KINDS of average have to be drawn on the
 *        average the viewer already knows, and a cut to a fresh chart would
 *        have thrown that away and asked them to trust a new one.
 * 1840   SMA and EMA arrive at title size in the middle of the screen
 * 1925   they shrink into the row and the frame comes back to full
 * 1959   SMA lights indigo, and the simple average is traced
 * 2075   EMA lights indigo, and the exponential one is traced over it
 * 2240   the second quote box opens
 */
const T = {
  title: at(667),
  /**
   * ON THE LINE THAT DESCRIBES IT. 700 + 2.3s = 769, and "Harga bergerak
   * naik-turun dan penuh noise" runs 703 → 773 — the draw and the sentence
   * start and finish together.
   *
   * The dissolve finishes at 680, so twenty frames pass on a clean white frame
   * with only the heading on it before anything is drawn. That gap is the
   * point rather than a hole: "Kita mulai dari moving average" ends at 691, so
   * the roadmap leaves, the sentence lands, and only then does the chart begin.
   */
  price: at(700),
  ma: at(817),
  /**
   * TWO BEATS, not one. The window SLIDES first and leaves the right-hand
   * third of the card empty; only then do the new sessions print into it, one
   * at a time, with the average lengthening behind them. Doing both at once
   * hid the move — candles arriving at the edge is exactly what a scrolling
   * chart looks like, so nothing appeared to have happened.
   */
  slide: at(1015),
  slideDur: 45,
  print: at(1060),
  /* 70, not 105: the print has to be DONE by 1130 — "Angkanya menunjukkan
     berapa periode yang dihitung" starts right there, about the number on a
     button that has to already be a finished chart's button, not one still
     being drawn. */
  printDur: 70,
  /** Scene 02's orange average steps aside for Scene 03's named pair. */
  clear: at(1166),
  fast: at(1237),
  slow: at(1447),
  /** The pull-back onto the whole series, under the MA200 line. */
  zoom: at(1558),
  zoomOver: 24,
  quote: at(1635),
  pulse: at(1748),
  /**
   * MA20 / MA200 do not exist before this. They arrive together, in their OFF
   * skin, exactly on "Angkanya menunjukkan berapa periode yang dihitung" — the
   * line the number is the subject of.
   *
   * THE CAMERA DOES NOT MOVE HERE. An earlier cut pushed the whole frame in on
   * the button row; Simon rejected it as disorienting, and he was right — a
   * lens move on a static chart has nothing to track, so the picture just
   * swells. The buttons carry the emphasis themselves instead: they land at
   * TITLE SIZE in the middle of the screen with the rest of the frame at half
   * strength, then shrink and rise into their row. Same emphasis, but the
   * thing being emphasised is the thing that moves.
   */
  numberAppear: at(1131),
  numberSettle: at(1201),
  numberOut: at(1250),

  /* ─── SCENE 04 ─── the two kinds, on the same candles ─── */
  /**
   * MA20, MA200, their two lines and the quote box BLUR AWAY together —
   * Simon's revision, and the better read: they used to rise off the top, and
   * a rise is a CAMERA move, which says the frame went somewhere. The frame
   * does not go anywhere here. Losing focus says only that these four things
   * stopped being what is being looked at, which is exactly what happens.
   */
  clearTypes: at(1788),
  clearOver: 24,
  typesAppear: at(1840),
  typesSettle: at(1925),
  /**
   * The shrink lands ON `smaOn`, not before it. The pair has to be seated in
   * the row at the exact frame the first of them lights up — a button still
   * drifting when it is switched on reads as the switch having missed.
   */
  typesOut: at(1959),
  smaOn: at(1959),
  emaOn: at(2075),
  quoteTypes: at(2240),
  /** How long each of SC04's averages takes to draw across the series. */
  typesDraw: 90,
};
const FAST_P = 20;
const SLOW_P = 200;
/** Scene 02's single average. One line, so it takes the orange. */
const MID_P = 40;
/**
 * Bars in the window at rest, and the ones that print while it runs. 45 bars
 * is 639px — better than a third of the card, so the empty space the slide
 * opens up is unmistakably empty.
 */
const BASE = 120;
const EXTRA = 45;
/**
 * The indicator buttons: light grey at 35% until their line is drawn, then
 * indigo. `h` is the row's resting height at `size` 30 — declared rather than
 * measured, because the shrink-and-rise has to know where the row's centre is
 * BEFORE layout, and a browser measurement is only available after it.
 */
const MA_BTN = {
  top: 118,
  gap: 10,
  padX: 16,
  padY: 6,
  size: 30,
  off: 0.35,
  h: 52,
};
/**
 * The entrance size, as a multiple of the resting one: h1, the episode's
 * heading size. "Ukuran judul" is literal — these two words are the title of
 * this beat, so they arrive at the size a title would.
 */
const BTN_BIG = theme.type.h1.size / MA_BTN.size;
/** Where they land on arrival: the middle of the screen, not the row. */
const BTN_BIG_Y = theme.layout.height / 2;
/**
 * How far the rest of the frame steps back while a pair is the subject. 0.75
 * leaves it at 25% — Simon's second call on this. At 50% the chart was still
 * competing; at 25% it is unmistakably background, and it comes all the way
 * back to full the moment the pair takes its row.
 */
const BTN_DIM = 0.75;
/** The radius the outgoing pair defocuses to at 1788. */
const BLUR_OUT = 14;
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
/**
 * SC04's is three lines, so it is 150 tall: centred on 880 that puts its lower
 * edge at 955, and the subtitle band starts at 972. No room for a fourth.
 */
const QUOTE_TYPES = { w: 760, h: 150 };
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
/**
 * SCENE 04's exponential twin. Same PERIOD as MA_FAST, which is the whole
 * point of the comparison: two ways of weighting the SAME twenty closes, not
 * two different lengths. And MA_FAST *is* the SMA — the line the viewer has
 * been calling MA20 for six hundred frames — so SC04 does not introduce a
 * simple average, it renames one they already trust.
 */
const MA_EXP = ema(WITH_HISTORY, FAST_P).slice(PRIOR.length);

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
  const g = f + FROM;
  /**
   * ONE cut, at the way OUT: at 2381 this group RISES away and SC05 catches it.
   * It is read from the GLOBAL frame, because the other half reads the same
   * curve from its own position; evaluate it locally and the two halves move
   * apart.
   *
   * Nothing at the way IN — SC01 dissolves off the top of this rather than
   * cutting to it — and nothing at 1788, where SC04 lives inside this group.
   */
  const cut = cutOutStyle(g, CUTS.toReading);

  /** The slide, then the printing. They do not overlap. */
  const shift = SHIFT_MAX * progressInOut(f, T.slide, T.slideDur);
  const printed =
    BASE + Math.floor(clamp01((f - T.print) / T.printDur) * EXTRA);

  /**
   * Scene 02's orange average fades out as Scene 03's named pair arrives. The
   * CANDLES no longer fade with it: they used to sit at 40% for the rest of
   * the group, and Simon's call is that the frame returns to full strength the
   * moment a spotlight ends. The only thing that dims here now is a spotlight,
   * and every spotlight gives it back.
   */
  const midOut = f >= T.clear ? 1 - progress(f, T.clear, sec(2.2)) : 1;
  /** Both lines thicken once, together — "trader sering melihat keduanya". */
  const pulse =
    f >= T.pulse ? Math.sin(Math.PI * clamp01((f - T.pulse) / 30)) : 0;
  /**
   * The averages hold their ON-SCREEN weight through the pull-back. Everything
   * in the scaled group thins with it, and these two lines are what the scene
   * is about — a thinner MA200 at the exact moment it is being explained reads
   * as it mattering less.
   */
  const zoom = 1 - (1 - ZOOM) * progressInOut(f, T.zoom, T.zoomOver);
  const width = (theme.layout.stroke.ma + pulse * 1.5) / zoom;

  /**
   * ═══ A SPOTLIGHT ═══
   *
   * The episode's one way of introducing a pair of indicator buttons, used
   * TWICE — MA20 / MA200 at 1131 and SMA / EMA at 1840. They land at title
   * size in the middle of the screen with the rest of the frame at a quarter
   * strength, hold, then shrink into their row as the frame comes back.
   *
   * `big` is 1 while the pair owns the screen and 0 once it is seated; the
   * shrink and the rise are the SAME number, so they cannot drift apart. It
   * falls on the symmetric curve — this move has a start and a finish that
   * both need settling, unlike a fade-in, which only has a finish.
   *
   * `dim` is what the rest of the frame is multiplied by. It is eased in as
   * well as out: this is the same gesture as a camera pull, and a step change
   * in brightness reads as a light being switched, not as attention moving.
   */
  const spotlight = (appear: number, settle: number, out: number) => {
    const big = 1 - progressInOut(f, settle, out - settle);
    const on = f < settle ? progressInOut(f, appear, 24) : big;
    return {
      big,
      dim: 1 - BTN_DIM * on,
      /* Laid out at its FINAL position and transformed away from it, never the
         reverse. Animating `top` and `fontSize` would relayout the pair every
         frame, and a flex row that reflows while it scales jitters — each
         frame rounds its own text metrics. */
      style: {
        transform:
          `translateY(${((BTN_BIG_Y - (MA_BTN.top + MA_BTN.h / 2)) * big).toFixed(2)}px) ` +
          `scale(${(1 + (BTN_BIG - 1) * big).toFixed(4)})`,
        transformOrigin: "center center",
      },
    };
  };
  const nums = spotlight(T.numberAppear, T.numberSettle, T.numberOut);
  const types = spotlight(T.typesAppear, T.typesSettle, T.typesOut);
  /**
   * PRODUCT, and it is safe: the two spotlights never overlap, so at any frame
   * at most one of these is below 1. If they ever did overlap this would have
   * to become a min — two reasons to recede must not compound into invisible.
   */
  const chartO = nums.dim * types.dim;

  /**
   * SCENE 04 CLEARS THE DECK. MA20, MA200, their lines and the quote box all
   * ride this one number out of focus and out of the frame.
   *
   * `k` scales the blur radius: 1 in screen space, 1/zoom inside the chart's
   * pulled-back group, so the lines defocus at the same rate the buttons do.
   */
  const gone = progressInOut(f, T.clearTypes, T.clearOver);
  const goneStyle = (k = 1) => ({
    filter:
      gone > 0.001 ? `blur(${(BLUR_OUT * k * gone).toFixed(1)}px)` : undefined,
    opacity: 1 - gone,
  });

  /** Grey → indigo on the digits alone. rgb: textMuted (107,112,118), indigo (95,77,238). */
  const numGlow = f >= T.numberAppear ? progress(f, T.numberAppear, 24) : 0;
  const numColor = `rgb(${Math.round(107 - 12 * numGlow)}, ${Math.round(112 - 35 * numGlow)}, ${Math.round(118 + 120 * numGlow)})`;

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

  /**
   * ONE ROW BUILDER, used by both pairs. `spot` is the entrance; `leave` is
   * the rise-away at 1788, which only the MA pair has; `mount` is the frame
   * before which the row does not exist at all.
   */
  const row = (
    spot: ReturnType<typeof spotlight>,
    leave: React.CSSProperties | undefined,
    mount: number,
    items: { label: string; digits?: string; on: number }[],
  ) => {
    if (f < mount) return null;
    return (
      <div style={{ position: "absolute", inset: 0, ...leave }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: MA_BTN.top,
            width: theme.layout.width,
            height: MA_BTN.h,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: MA_BTN.gap,
            opacity: progress(f, mount, theme.motion.revealF),
            ...spot.style,
          }}
        >
          {items.map((b) => {
            /**
             * The two skins CROSS-FADE. Swapping them on a threshold made the
             * fill, the border and the label all change on one frame, which
             * reads as a flicker rather than a control being switched on. Both
             * are rendered, one over the other.
             */
            const sel = f >= b.on ? progress(f, b.on, 16) : 0;
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
              <span
                key={b.label + b.digits}
                style={{ position: "relative", display: "inline-block" }}
              >
                {/* off — sits back at 35%, present but plainly not chosen.
                    Full strength while the pair owns the middle of the screen
                    though: 35% is the weight of a control nobody has chosen
                    yet, which is right for a chip in a row and wrong for two
                    words that are the title of the beat. */}
                <span
                  style={{
                    ...skin(false),
                    display: "inline-block",
                    opacity:
                      (1 - sel) * (MA_BTN.off + (1 - MA_BTN.off) * spot.big),
                  }}
                >
                  {b.label}
                  {/* the DIGITS run indigo from the entrance while the "MA"
                      stays grey: the VO there is about the number, not the
                      label. SMA / EMA have no digits and take none of this. */}
                  {b.digits && (
                    <span style={{ color: numColor }}>{b.digits}</span>
                  )}
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
                  {b.digits}
                </span>
              </span>
            );
          })}
        </div>
      </div>
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
        {/*
          NO CARD HERE. Simon: drop the white ground and the price gridlines
          from this chart — it reads directly on the episode's own white
          background instead of sitting on its own surface.
        */}

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

          <g clipPath="url(#cgaCard)">
            <g
              transform={
                `translate(${ANCHOR.x} ${ANCHOR.y}) scale(${zoom.toFixed(4)}) ` +
                `translate(${-ANCHOR.x} ${-ANCHOR.y}) translate(${-shift.toFixed(1)},0)`
              }
            >
              {/* the tape */}
              <g opacity={chartO}>
                {BARS.map((b, i) => {
                  if (i >= printed) return null;
                  /* the resting window draws in; the new sessions fade on as
                     they cross the right edge */
                  const o =
                    i < BASE
                      ? progress(f, T.price, sec(2.3)) >= (i + 1) / BASE
                        ? 1
                        : 0
                      : progress(f, arrivalOf(i - BASE), 8);
                  if (o <= 0.001) return null;
                  const x = G.x(i);
                  const top = Math.min(G.y(b.o), G.y(b.c));
                  const h = Math.max(1.5, Math.abs(G.y(b.c) - G.y(b.o)));
                  /* one bar, one colour — see ChartFrame */
                  const fill =
                    b.c >= b.o
                      ? theme.colors.candleGreen
                      : theme.colors.candleRed;
                  return (
                    <g key={i} opacity={o}>
                      <line
                        x1={x}
                        y1={G.y(b.h)}
                        x2={x}
                        y2={G.y(b.l)}
                        stroke={fill}
                        strokeWidth={theme.layout.stroke.wick}
                      />
                      <rect
                        x={x - BODY_W / 2}
                        y={top}
                        width={BODY_W}
                        height={h}
                        fill={fill}
                      />
                    </g>
                  );
                })}
              </g>

              {/* Scene 02's single average — the line that came out of the
                  noise, before it had a name */}
              {trace(
                MA_MID,
                theme.colors.maOrange,
                T.ma,
                sec(6.1),
                midOut * chartO,
              )}

              {/* Scene 03's named pair, and the blur that takes them away at
                  1788 */}
              <g style={goneStyle(1 / zoom)}>
                {trace(MA_FAST, theme.colors.cyan, T.fast, sec(4.0), chartO)}
                {trace(MA_SLOW, theme.colors.indigo, T.slow, sec(4.0), chartO)}
              </g>

              {/* Scene 04's pair, on those same candles. SMA is MA_FAST again
                  — the identical twenty-period line, now under the name that
                  says HOW it is weighted — and EMA is drawn over it, so the
                  gap between them IS the lesson. */}
              {trace(
                MA_FAST,
                theme.colors.indigo,
                T.smaOn,
                T.typesDraw,
                chartO,
              )}
              {trace(MA_EXP, theme.colors.cyan, T.emaOn, T.typesDraw, chartO)}
            </g>
          </g>
        </Layer>

        {/* The heading is NOT here. "Moving Average" is mounted at the
            composition root, spanning this group and SC04, so it holds still
            through the cut at 1765 — the subject does not change there, and a
            heading that left and came back would say that it did. */}

        {/*
          ── the indicator buttons ──
          MA20 / MA200 from 1131, then SMA / EMA from 1840. Both rows are the
          same object: nothing before their frame, then a spotlight entrance,
          then a seat in the row at the top of the card.
        */}
        {row(nums, goneStyle(), T.numberAppear, [
          { label: "MA", digits: "20", on: T.fast },
          { label: "MA", digits: "200", on: T.slow },
        ])}
        {row(types, undefined, T.typesAppear, [
          { label: "SMA", on: T.smaOn },
          { label: "EMA", on: T.emaOn },
        ])}

        {/* ── the line the MA20 / MA200 run leaves you with. It rises away
               at 1788 with everything else that belonged to that pair. ── */}
        <div style={{ position: "absolute", inset: 0, ...goneStyle() }}>
          <QuoteBox
            f={f}
            at={T.quote}
            w={QUOTE.w}
            h={QUOTE.h}
            /* 30px higher than the card's own edge — Simon's call, no
               geometric reason it has to sit exactly on that line */
            y={BOX.y + BOX.h - 30}
            lines={[
              {
                segments: [
                  { text: "Pendek", tone: "cyan" },
                  { text: " lebih responsif." },
                ],
              },
              {
                segments: [
                  { text: "Panjang", tone: "indigo" },
                  { text: " untuk big picture." },
                ],
              },
            ]}
          />
        </div>

        {/* ── and the line SC04 leaves you with ── */}
        <QuoteBox
          f={f}
          at={T.quoteTypes}
          w={QUOTE_TYPES.w}
          h={QUOTE_TYPES.h}
          /* 60px above the card's own edge — Simon's call. */
          y={BOX.y + BOX.h - 60}
          /* Marked by SENTENCE — the tint alone, with the ink left dark. The
             mark lands on the clause that NAMES each average; the qualifier
             that follows is left plain, because marking it too would say the
             warning is a third thing rather than part of the EMA line. */
          lines={[
            {
              segments: [
                { text: "SMA berbobot sama rata.", tone: "indigo", ink: true },
              ],
            },
            {
              segments: [
                {
                  text: "EMA berbobot lebih besar, maka lebih reaktif,",
                  tone: "cyan",
                  ink: true,
                },
              ],
            },
            { segments: [{ text: "tapi jadi lebih banyak false signal." }] },
          ]}
        />
      </div>
    </SafeArea>
  );
};
