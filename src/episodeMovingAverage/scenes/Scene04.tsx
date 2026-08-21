/**
 * SCENE 04 — SMA vs EMA. `from 1765 · dur 559`
 *
 * The camera tracks left out of CG-A and lands here, and what it lands on is
 * deliberately BARE: the same white card in the same place, a new chart on it,
 * and nothing else. The heading does not arrive with it — "Moving Average" is
 * mounted at the composition root and simply stays put through the cut,
 * because this is still the same subject.
 *
 * The two indicator buttons then appear over the card, off, exactly as MA20
 * and MA200 did. Nothing is selected here and no average is drawn yet.
 *
 * [PLACEHOLDER] The candles are traced by eye from Simon's crop — see
 * `data/shots.ts`. That crop has no symbol header and no price axis, so this
 * chart carries neither a ticker nor price labels: only its shape is claimed.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { Layer, gridOf, pathOf, lengthOf } from "../components/ChartFrame";
import { QuoteBox } from "../components/QuoteBox";
import { theme } from "../theme";
import { progress, sma, ema, mulberry32, drawPath } from "../helpers";
import { toBars, domainOf } from "../series";
import { SMA_EMA_2, fromAnchors } from "../data/shots";
import { CUTS, cutInStyle, cutOutStyle } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this scene is mounted, needed to read the cut from global frames. */
const FROM = 1765;
/** Global → local. Every beat below is quoted in Simon's global frames. */
const at = (global: number) => global - FROM;

/**
 * ═══ THE TIMELINE ═══
 *
 * 1765   the track left lands: white card and candles, already there
 * 1815   SMA appears in the middle of the frame, off
 * 1852   EMA appears beside it, off
 * 1902   SMA lights indigo, and the simple average is traced
 * 2018   EMA lights indigo, and the exponential one is traced over it
 * 2183   the quote box opens on the card's bottom edge
 */
const T = {
  sma: at(1815),
  ema: at(1852),
  smaOn: at(1902),
  emaOn: at(2018),
  quote: at(2183),
  /** How long each average takes to draw across the series. */
  drawOver: 90,
};
/**
 * The same period for both, which is the whole point: two ways of weighting
 * the SAME twenty closes. Different periods would make the comparison a
 * comparison of lengths instead.
 */
const PERIOD = 20;
const N = 110;
/**
 * The card is in the SAME place as CG-A's, to the pixel. The cut moves the
 * camera sideways, not the furniture — a card that also shifted would read as
 * two different surfaces rather than one the camera panned along.
 */
const DROP = 30;
const BOX = {
  x: theme.layout.chartA.x,
  y: theme.layout.chartA.y + DROP,
  w: theme.layout.chartA.w,
  h: theme.layout.chartA.h,
};
/** Same chip as MA20 / MA200: light grey at 35% until it is switched on. */
const BTN = { top: 118, gap: 10, padX: 16, padY: 6, size: 30, off: 0.35 };
/**
 * The quote box rides the card's bottom edge, as CG-A's does. Three lines, so
 * it is 150 tall: centred on 880 that puts its lower edge at 955, and the
 * subtitle band starts at 972. There is no room for a fourth line here.
 */
const QUOTE = { w: 760, h: 150 };
// ═══════════════════════════════════════════════════════════════════════════

const CLOSES = fromAnchors(SMA_EMA_2, N, 5804);
const BARS = toBars(CLOSES, 5805);

/**
 * THE WINDOW IS A SLICE OF A LONGER HISTORY.
 *
 * Both averages are computed over the visible closes PLUS a seeded run of
 * prior ones, and only the visible part is drawn — so each line starts at the
 * LEFT EDGE rather than a fifth of the way across. The chart did not begin the
 * day it was opened.
 *
 * The prior walk is FLAT. The first visible bar is the lowest of the window,
 * so a prior history that trends anywhere drags the averages out of the box.
 */
const PRIOR = (() => {
  const rnd = mulberry32(5806);
  const step = CLOSES[0] * 0.004;
  const out: number[] = [];
  let p = CLOSES[0];
  for (let i = 0; i < PERIOD + 10; i++) {
    p += (rnd() - 0.5) * 2 * step;
    out.unshift(p);
  }
  return out;
})();
const WITH_HISTORY = [...PRIOR, ...CLOSES];
const SMA = sma(WITH_HISTORY, PERIOD).slice(PRIOR.length);
const EMA = ema(WITH_HISTORY, PERIOD).slice(PRIOR.length);

const DOMAIN = domainOf(CLOSES, BARS);
const G = gridOf(CLOSES, DOMAIN, BOX, 0.12, 0);
const PITCH = G.x(1) - G.x(0);
const BODY_W = Math.max(2, Math.min(20, PITCH * 0.62));

export const Scene04 = () => {
  const f = useCurrentFrame();
  const g = f + FROM;
  /**
   * This scene sits BETWEEN two cuts: CG-A tracks it in at 1765, and it rises
   * out at 2324. Both are read from the GLOBAL frame, because the other half
   * of each reads the same curve from its own position. The windows never
   * overlap, and away from both each returns a zero offset and no blur.
   */
  const cut = g < CUTS.toReading.at - CUTS.toReading.over
    ? cutInStyle(g, CUTS.toTypes)
    : cutOutStyle(g, CUTS.toReading);

  return (
    <SafeArea>
      <div style={{ position: "absolute", inset: 0, ...cut }}>
        {/* the white card, in CG-A's place */}
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

          {/* THE COLOUR BINDING: the slow average is indigo, the fast one is
              cyan, episode-wide. SMA weights its twenty closes evenly and EMA
              leans on the newest, so EMA is the one that turns first. */}
          {f >= T.smaOn && (
            <path
              d={pathOf(SMA, G)}
              fill="none"
              stroke={theme.colors.indigo}
              strokeWidth={theme.layout.stroke.ma}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...drawPath(f, T.smaOn, T.drawOver, lengthOf(SMA, G))}
            />
          )}
          {f >= T.emaOn && (
            <path
              d={pathOf(EMA, G)}
              fill="none"
              stroke={theme.colors.cyan}
              strokeWidth={theme.layout.stroke.ma}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...drawPath(f, T.emaOn, T.drawOver, lengthOf(EMA, G))}
            />
          )}
        </Layer>

        {/* ── SMA, then EMA — in the middle of the frame ── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BTN.top,
            width: theme.layout.width,
            display: "flex",
            justifyContent: "center",
            gap: BTN.gap,
          }}
        >
          {[
            { label: "SMA", show: T.sma, on: T.smaOn },
            { label: "EMA", show: T.ema, on: T.emaOn },
          ].map((b) => {
            /**
             * BOTH are always laid out, even before they are shown. Mounting
             * EMA only when it arrives would re-centre the row and shove SMA
             * sideways on that one frame.
             *
             * The two skins CROSS-FADE. Swapping them on a threshold changes
             * fill, border and label on a single frame, which reads as a
             * flicker rather than a control being switched on.
             */
            const here = progress(f, b.show, theme.motion.revealF);
            const sel = f >= b.on ? progress(f, b.on, 16) : 0;
            const skin = (on: boolean) => ({
              fontFamily: theme.type.family,
              fontSize: BTN.size,
              fontWeight: theme.type.label.weight,
              color: on ? theme.colors.surface : theme.colors.textMuted,
              background: on ? theme.colors.indigo : theme.colors.surface,
              border: `${theme.layout.border.thin}px solid ${on ? theme.colors.indigo : theme.colors.border}`,
              borderRadius: theme.layout.radius.sm,
              padding: `${BTN.padY}px ${BTN.padX}px`,
            });
            return (
              <span key={b.label} style={{ position: "relative", display: "inline-block" }}>
                <span
                  style={{ ...skin(false), display: "inline-block", opacity: here * (1 - sel) * BTN.off }}
                >
                  {b.label}
                </span>
                <span style={{ ...skin(true), position: "absolute", left: 0, top: 0, opacity: sel }}>
                  {b.label}
                </span>
              </span>
            );
          })}
        </div>

        {/* ── the line the scene leaves you with ── */}
        <QuoteBox
          f={f}
          at={T.quote}
          w={QUOTE.w}
          h={QUOTE.h}
          y={BOX.y + BOX.h}
          /* Marked by SENTENCE — the tint alone, with the ink left dark. The
             mark lands on the clause that NAMES each average; the qualifier
             that follows is left plain, because marking it too would say the
             warning is a third thing rather than part of the EMA line. */
          lines={[
            { segments: [{ text: "SMA berbobot sama rata.", tone: "indigo", ink: true }] },
            { segments: [{ text: "EMA berbobot lebih besar, maka lebih reaktif,", tone: "cyan", ink: true }] },
            { segments: [{ text: "tapi jadi lebih banyak false signal." }] },
          ]}
        />
      </div>
    </SafeArea>
  );
};
