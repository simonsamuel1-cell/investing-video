/**
 * SCENE 05 — How to read it. `from 2324 · dur 579`
 *
 * ONE SERIES, THREE READINGS. A climb, the decline that follows it and the
 * range the decline settles into are joined end to end, and the WINDOW travels
 * along them — it is a window onto a chart that keeps running, not three
 * charts being swapped. Each seam is exact: every crop's last anchor is the
 * next one's first, so no gap bar prints at a join.
 *
 * The average is ONE line too. It is drawn once, across the first window —
 * that is the lesson — and after that it only ever lengthens, because it is
 * the same line continuing rather than a new one being introduced.
 *
 * [PLACEHOLDER] The candles are traced by eye from Simon's crops, see
 * `data/shots.ts`. None of those crops carries a symbol header or a price
 * axis, so this chart shows neither ticker nor price labels. The AVERAGE is
 * not traced: it is computed from these closes, because a hand-drawn curve
 * that merely looks like the mean of the bars under it is not one.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { Layer, gridOf, pathOf, lengthOf } from "../components/ChartFrame";
import { TitleChip } from "../components/TitleChip";
import { theme } from "../theme";
import { sma, mulberry32, drawPath, progress, progressInOut, clamp01, textReveal } from "../helpers";
import { toBars, domainOf } from "../series";
import { READ_1, READ_2, READ_3, fromAnchors } from "../data/shots";
import { CUTS, cutInStyle } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this scene is mounted, needed to read the cut from global frames. */
const FROM = 2324;
/** Global → local. Every beat below is quoted in Simon's global frames. */
const at = (global: number) => global - FROM;

/**
 * ═══ THE TIMELINE ═══
 *
 * 2324   the rise lands: white card and the first 60 sessions, already there
 * 2389 – 2487   the average is DRAWN through them — price above a rising line
 * 2489 – 2516   the window scrolls 54 sessions left; the climb runs off the
 *        left and the decline runs in from the right
 * 2516 – 2626   the average lengthens across them — price below a falling line
 * 2691 – 2716   the window scrolls 54 more; the range runs in
 * 2716 – 2754   the average lengthens across the range and FLATTENS — there is
 *        nowhere for it to slope
 */
const T = {
  title: 0,
  ma: at(2389),
  maOver: at(2487) - at(2389),
  /** Each scroll, and the growth that follows it. They never overlap. */
  steps: [
    { scroll: at(2489), scrollDur: 27, grow: at(2516), growDur: 110, bars: 54 },
    /**
     * 75. The range leg is fifteen bars LONGER than the window, and the scroll
     * travels the whole of it — so the window lands on the LAST sixty, not the
     * first. Those fifteen bars are why: a 20-period average needs twenty bars
     * to forget the decline behind it, and landing on the first sixty left the
     * line still falling steeply into the left edge. Fifteen bars deeper in,
     * the average has nothing but the range in it, and it is flat all the way
     * across.
     */
    { scroll: at(2691), scrollDur: 25, grow: at(2716), growDur: 38, bars: 75 },
  ],
};
const PERIOD = 20;
/**
 * 60 bars in the window, not 100. The crops are chunky, low-count charts and
 * the count is what gives them that: across this card 60 bars are 28px apart,
 * so a body is 17px wide. At 100 they thin to 10px and stop looking like the
 * reference.
 */
const WINDOW = 60;
/** How long each leg is, in bars. Each scroll travels the NEXT leg's length. */
const LEGS = [60, 54, 75];
/**
 * The card sits DROP px below its layout box, matching CG-A and SC04 to the
 * pixel — the cut lifts the camera, it does not move the furniture. The chart
 * keeps its FULL WIDTH for the whole scene; nothing shrinks it.
 */
const DROP = 30;
const BOX = {
  x: theme.layout.chartA.x,
  y: theme.layout.chartA.y + DROP,
  w: theme.layout.chartA.w,
  h: theme.layout.chartA.h,
};
// ═══════════════════════════════════════════════════════════════════════════

const CLOSES = [
  ...fromAnchors(READ_1, LEGS[0], 8801),
  ...fromAnchors(READ_2, LEGS[1], 8811),
  ...fromAnchors(READ_3, LEGS[2], 8821),
];
const BARS = toBars(CLOSES, 8802);

/**
 * THE WINDOW IS A SLICE OF A LONGER HISTORY. The average is computed over the
 * visible closes PLUS a seeded run of prior ones and only the visible part is
 * drawn, so the line starts at the LEFT EDGE rather than a fifth of the way
 * across. The prior walk is flat, so it cannot drag the line out of the box.
 */
const PRIOR = (() => {
  const rnd = mulberry32(8803);
  const step = CLOSES[0] * 0.004;
  const out: number[] = [];
  let p = CLOSES[0];
  for (let i = 0; i < PERIOD + 10; i++) {
    p += (rnd() - 0.5) * 2 * step;
    out.unshift(p);
  }
  return out;
})();
const MA = sma([...PRIOR, ...CLOSES], PERIOD).slice(PRIOR.length);

/**
 * ONE SCALE, FIXED, over the whole series.
 *
 * It was briefly refitted to each window, the way a real chart does when you
 * scroll it — and that was wrong here. Refitting magnifies the range leg into
 * the full height of the card, and a magnified range is a WAVY average: the
 * flatness the scene is about only exists relative to the trends before it.
 * Held on the trends' own scale, the line through the range is visibly, plainly
 * flat, which is the whole lesson. It also means nothing stretches mid-scroll.
 */
const DOMAIN = domainOf([...CLOSES, ...MA], BARS);

/**
 * The grid is built from the RESTING window — the first 60 bars across the
 * card. `x` is linear and unclamped, so bar 60 and up land off the right edge
 * at the same pitch, and the scroll brings them in.
 */
const G = gridOf(CLOSES.slice(0, WINDOW), DOMAIN, BOX, 0.12, 0);
const PITCH = G.x(1) - G.x(0);
const BODY_W = Math.max(2, Math.min(20, PITCH * 0.62));

/**
 * ═══ THE CHIPS ═══
 *
 * One reading per beat, in a row UNDER the card — they were inside it, at the
 * top-left, and there they simply sat on the chart they were describing.
 *
 * The row is CENTRED as a group at every count: the first chip arrives in the
 * middle of the frame, and each new one pushes the ones before it left so the
 * whole run stays centred. That is why the widths below are measured constants
 * rather than left to the browser — an absolutely-positioned row can be eased
 * into its new place, and a flex row can only jump to it.
 *
 * MEASURED from a render at this exact size and weight. Re-measure if the
 * text, the size, the padding or the font changes.
 *
 * Dark grey, not indigo: they comment ON the chart rather than being part of
 * it, and indigo is the colour of the average they are describing.
 */
const CHIP = { top: 902, gap: 20, size: 26, padX: 16, padY: 8, slide: 18 };
/**
 * The closing summary, in the empty top half of the card. It sits INSIDE the
 * chart because it is the answer to what the chart has been showing — the
 * heading outside the card names the lesson, this names the two things to do.
 */
const SUM = { at: at(2818), top: 250, gap: 20, size: 30, padX: 22, padY: 10, step: 8 };
const CHIPS = [
  { at: at(2387), w: 368, text: "Harga di atas MA = uptrend" },
  { at: at(2495), w: 438, text: "Harga di bawah MA = downtrend" },
  { at: at(2594), w: 403, text: "Makin curam = trend menguat" },
  { at: at(2689), w: 363, text: "Datar = market belum jelas" },
];

export const Scene05 = () => {
  const f = useCurrentFrame();
  /** The incoming half of SC04's rise. Read from the GLOBAL frame. */
  const cut = cutInStyle(f + FROM, CUTS.toReading);

  /** Every step contributes its own travel, and its own length of line. */
  const shift =
    PITCH * T.steps.reduce((a, s) => a + s.bars * progressInOut(f, s.scroll, s.scrollDur), 0);
  const upto =
    WINDOW +
    Math.round(
      T.steps.reduce((a, s) => a + s.bars * clamp01((f - s.grow) / s.growDur), 0),
    );
  /** The dash only animates the FIRST draw; after that the line just grows. */
  const drawing = f < T.steps[0].grow;
  const line = MA.slice(0, upto);

  return (
    <SafeArea>
      <div style={{ position: "absolute", inset: 0, ...cut }}>
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
            <clipPath id="sc05Card">
              <rect
                x={BOX.x}
                y={BOX.y}
                width={BOX.w}
                height={BOX.h}
                rx={theme.layout.radius.lg}
              />
            </clipPath>
          </defs>

          <g clipPath="url(#sc05Card)">
            <g transform={`translate(${-shift.toFixed(1)},0)`}>
              {/* the tape is simply THERE — the cut is its entrance */}
              {BARS.map((b, i) => {
                const x = G.x(i);
                const top = Math.min(G.y(b.o), G.y(b.c));
                const h = Math.max(1.5, Math.abs(G.y(b.c) - G.y(b.o)));
                /* candle bodies are the ONLY place green and red appear */
                const fill = b.c >= b.o ? theme.colors.candleGreen : theme.colors.candleRed;
                return (
                  <g key={i}>
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

              {f >= T.ma && (
                <path
                  d={pathOf(line, G)}
                  fill="none"
                  stroke={theme.colors.indigo}
                  strokeWidth={theme.layout.stroke.ma}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...(drawing ? drawPath(f, T.ma, T.maOver, lengthOf(line, G)) : {})}
                />
              )}
            </g>
          </g>
        </Layer>

        {/* ── the closing summary, at the top of the chart ── */}
        {f >= SUM.at && (
          <div
            style={{
              position: "absolute",
              left: BOX.x,
              top: SUM.top,
              width: BOX.w,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 26,
            }}
          >
            <div
              style={{
                ...textReveal(f, SUM.at),
                fontFamily: theme.type.family,
                fontSize: theme.type.h2.size,
                fontWeight: theme.type.h2.weight,
                color: theme.colors.indigo,
              }}
            >
              Perhatikan
            </div>
            <div style={{ display: "flex", gap: SUM.gap }}>
              {["Posisi harga", "Arah MA"].map((label, i) => (
                <span
                  key={label}
                  style={{
                    ...textReveal(f, SUM.at + (i + 1) * SUM.step),
                    background: theme.colors.indigo,
                    color: theme.colors.surface,
                    border: `${theme.layout.border.thin}px solid ${theme.colors.indigo}`,
                    borderRadius: theme.layout.radius.sm,
                    padding: `${SUM.padY}px ${SUM.padX}px`,
                    fontFamily: theme.type.family,
                    fontSize: SUM.size,
                    fontWeight: theme.type.label.weight,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── the readings, in a row under the card ── */}
        {CHIPS.map((c, i) => {
          if (f < c.at) return null;
          /**
           * The row's width at any moment is the chips that have ARRIVED, and
           * a chip counts as arriving over its own reveal — so the ones before
           * it ease left instead of jumping the moment it mounts.
           */
          const grown = CHIPS.map((k) => (f < k.at ? 0 : progress(f, k.at, theme.motion.revealF)));
          const width = CHIPS.reduce(
            (a, k, n) => a + grown[n] * (k.w + (n === 0 ? 0 : CHIP.gap)),
            0,
          );
          const before = CHIPS.slice(0, i).reduce(
            (a, k, n) => a + grown[n] * (k.w + (n === 0 ? 0 : CHIP.gap)),
            0,
          );
          const left =
            (theme.layout.width - width) / 2 + before + (i === 0 ? 0 : CHIP.gap * grown[i]);
          const r = textReveal(f, c.at);
          return (
            <div
              key={c.text}
              style={{
                position: "absolute",
                left,
                top: CHIP.top,
                width: c.w,
                boxSizing: "border-box",
                textAlign: "center",
                opacity: r.opacity,
                background: theme.colors.surface,
                border: `${theme.layout.border.thin}px solid ${theme.colors.ink}`,
                borderRadius: theme.layout.radius.sm,
                padding: `${CHIP.padY}px ${CHIP.padX}px`,
                fontFamily: theme.type.family,
                fontSize: CHIP.size,
                fontStyle: "italic",
                fontWeight: theme.type.label.weight,
                color: theme.colors.ink,
                whiteSpace: "nowrap",
              }}
            >
              {c.text}
            </div>
          );
        })}

        <TitleChip text="Cara Baca Moving Average" f={f} at={T.title} />
      </div>
    </SafeArea>
  );
};
