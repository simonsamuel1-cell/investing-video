/**
 * SC01 — the trading app panel (from 0, dur 659).
 *
 * A rebuild of the app UI Simon supplied as a reference, with the reference's
 * crypto pairs replaced by IDX equities. It is deliberately STATIC: no entrance,
 * no reveal, no camera work of its own beyond the cut it hands to SC02.
 *
 * [PLACEHOLDER] Every price, percentage and candle here is invented and none of
 * it is a record of what BBCA or any other listing actually did. The series is
 * seeded synthetic, and the panel carries a visible "Ilustrasi" tag for exactly
 * that reason — real tickers with made-up numbers, untagged, is a fabricated
 * record. The tag comes off when Simon's screenshot of the real chart lands.
 *
 * TWO HOUSE RULES SHOW UP AS LAYOUT DECISIONS HERE:
 *   · the panel starts at y = 150, so nothing at all enters the top-right logo
 *     zone and the header's right-hand controls are free to run to the margin;
 *   · no card carries a shadow. A 24px blur bleeds ~16px past its box, and the
 *     outer cards sit ON the safe margin, so the bleed would land outside it.
 *     Borders do the same work and stay inside.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { theme } from "../theme";
import { price as fmt, sma, bollinger, progress, progressInOut, clamp01, textReveal, drawPath } from "../helpers";
import { toBars } from "../series";
import { BBCA_1D, BBRI_1H, TLKM_1H, ASII_1H, BMRI_1H, fromAnchors, type Anchor } from "../data/shots";
import { CUTS, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 0;

/**
 * ═══ THE TIMELINE ═══
 *
 *   0 – 188   the BBCA chart alone, arriving on the isometric move: candles
 *             fade and trim in left to right while the plate is turned and the
 *             camera rides along them, landing FLAT and at rest
 * 189 – 246   the four watchlist cards, one at a time
 * 307         the cards slide down, blur and go; the two indicator pills take
 *             their place
 * 407         the Moving Average pill lights up, and its line draws
 * 543         the Bollinger Bands pill lights up, and the bands unfold
 * 658         the two pills rise to the middle of the frame while the chart
 *             blurs and fades away behind them
 * 700         the Moving Average pill grows and glows — the VO is saying
 *             "Kita mulai dari moving average" over exactly this
 * 718         the cut to SC02 takes it from here
 */
const T = {
  reveal: 8,
  travel: 150,
  home: 188,
  cards: 189,
  cardStep: 14,
  cardIn: 12,
  cardsGone: 307,
  cardsOut: 22,
  pills: 320,
  maOn: 407,
  bbOn: 543,
  /** The pills leave the watchlist's row and take the middle of the frame. */
  centre: 658,
  centreOver: 34,
  /**
   * The Moving Average one is then singled out, on the line that names it.
   *
   * It starts the frame the rise lands (658 + 34) and is fully up by 704 —
   * the cut's blur begins at 706, so the highlight gets its own clean beat
   * instead of arriving inside the blur.
   */
  glow: 692,
  glowOver: 12,
};
/** Frames per candle. The whole series has to land before the camera does. */
const PER_BAR = 1.2;
const CANDLE_IN = { fade: 8, trim: 10 };
/**
 * The isometric pose. It is FULL from frame 0 — the panel is already turned
 * when the scene opens, rather than swinging into the angle — and it is fixed:
 * no drift, so the only thing moving is the camera, and it moves in a straight
 * line.
 */
const ISO = { yaw: -26, pitch: 6, roll: 5 };
/** How far in the camera pushes while it travels. */
const DOLLY = { from: 2.6, to: 3.4 };
/** The indicator pills. */
/** `h` is the pill's own height, needed to centre it on the canvas by its
    middle rather than by its top edge. */
const PILL = { gap: 30, y: 856, h: 84, padX: 40, padY: 18 };
const MA_PERIOD = 20;

/** The panel, and the plot inside it. The axis is on the LEFT, as in the ref. */
const PANEL = { x: 96, y: 150, w: 1728, h: 650 };
const PLOT = { x: PANEL.x + 150, y: PANEL.y + 200, w: PANEL.w - 150 - 56, h: 390 };
/** The four watchlist cards, filling the same width as the panel. */
const ROW = { y: 830, h: 122, gap: 24 };

/**
 * ═══ THE QUOTES ═══
 *
 * Every number below is READ OFF Simon's own screenshots — the ticker, the
 * last price, the change, and the O/H/L/C on the headline chart's header. They
 * are not invented, and they are not to be edited to look tidier.
 *
 * The headline is the daily BBCA chart. Its four watchlist companions are the
 * 1H screenshots, so ASII appears once here and once there at two different
 * timeframes — that is what the screenshots say, not a slip.
 */
const MAIN = {
  ticker: "BBCA",
  name: "Bank Central Asia",
  /** From the chart header: O6,300 H6,425 L6,300 C6,325 +25 (+0,40%). */
  price: 6325,
  change: "+0,40%",
  up: true,
  ohlc: { o: 6300, h: 6425, l: 6300, c: 6325 },
};
/** The four 1H screenshots, in the order Simon sent them. */
const WATCH: {
  ticker: string; name: string; price: number; change: string; up: boolean;
  shot: Anchor[]; seed: number;
}[] = [
  { ticker: "BBRI", name: "Bank Rakyat Indonesia", price: 3080, change: "−0,32%", up: false, shot: BBRI_1H, seed: 11 },
  { ticker: "TLKM", name: "Telkom Indonesia", price: 2590, change: "−0,38%", up: false, shot: TLKM_1H, seed: 12 },
  { ticker: "ASII", name: "Astra International", price: 4770, change: "+0,42%", up: true, shot: ASII_1H, seed: 13 },
  { ticker: "BMRI", name: "Bank Mandiri", price: 4150, change: "−0,24%", up: false, shot: BMRI_1H, seed: 14 },
];
const FRAMES = ["5m", "15m", "1H", "1D", "1W"];
/** The headline screenshot is a DAILY chart, so 1D is the live pill. */
const ACTIVE = "1D";
/** A daily chart's axis is dates, not session hours. */
const AXIS = ["Apr", "Mei", "Jun", "Jul", "Agu", "Sep"];
/**
 * The size of the headline numeral.
 *
 * NOT one of the episode's four type sizes. This panel is a reproduction of a
 * broker's own UI and the number is its readout, not a heading, a sentence or
 * an in-chart label — so it is named here, in the scene that needs it, rather
 * than added to the scale as a fifth role.
 */
/** The header's own metrics, so the price group can be derived from them
    rather than repeating a number that would drift when the avatar changes. */
const HEAD = { x: 40, avatar: 52, gap: 16 };
/**
 * The price column's centre line. The axis labels and the last-price pill are
 * BOTH centred on it — right-aligning the labels and the pill lined up their
 * right edges but left their middles apart, because the pill carries padding
 * the labels do not.
 */
const AXIS_CX = 84;
const PRICE_SIZE = 70;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The candles, traced from the screenshot — see `data/shots.ts` for what that
 * does and does not mean. The turns are where the screenshot's turns are; no
 * individual bar is the bar that printed, which is what the "Ilustrasi" tag
 * on the panel is there to say.
 */
const CLOSES = fromAnchors(BBCA_1D, 105, 4041);
const BARS = toBars(CLOSES, 4042);
const LO = Math.min(...BARS.map((b) => b.l));
const HI = Math.max(...BARS.map((b) => b.h));
/**
 * Gridlines on a round step, CHOSEN from the range rather than hardcoded: a
 * fixed 200 gives four lines on a 900-point chart and eleven on a 2.000-point
 * one. This keeps it near five whatever ticker is swapped in.
 */
const STEP = (() => {
  const want = (HI - LO) / 5;
  return [50, 100, 200, 250, 500, 1000, 2000].find((n) => n >= want) ?? 2000;
})();
const LEVELS = (() => {
  const out: number[] = [];
  for (let v = Math.ceil(LO / STEP) * STEP; v <= HI; v += STEP) out.push(v);
  return out;
})();
const px = (i: number) => PLOT.x + 14 + ((PLOT.w - 28) * i) / (BARS.length - 1);
const py = (v: number) => PLOT.y + PLOT.h * (1 - (v - LO) / (HI - LO)) * 0.88 + PLOT.h * 0.06;
const BODY_W = ((PLOT.w - 28) / BARS.length) * 0.6;
const CUR_Y = py(MAIN.price);

/**
 * The two indicators, on the same closes the candles are drawn from — so the
 * line the scene is about is genuinely the average OF this chart, not a curve
 * laid over it.
 *
 * The Bollinger middle band is the SAME 20-period average, so it is not drawn
 * twice: the MA line already IS the middle band, which is the point the second
 * half of the episode spends five scenes on.
 */
const MA = sma(CLOSES, MA_PERIOD);
const BB = bollinger(CLOSES, MA_PERIOD, 2);

/** A series of values as an SVG path in the panel's own coordinates. */
const pathOf = (v: (number | null)[]) => {
  let d = "";
  v.forEach((n, i) => {
    if (n === null) return;
    d += `${d === "" ? "M" : "L"}${(px(i) - PANEL.x).toFixed(1)},${(py(n) - PANEL.y).toFixed(1)} `;
  });
  return d.trim();
};
const lenOf = (v: (number | null)[]) => {
  let len = 0;
  let prev: { x: number; y: number } | null = null;
  v.forEach((n, i) => {
    if (n === null) return;
    const q = { x: px(i), y: py(n) };
    if (prev) len += Math.hypot(q.x - prev.x, q.y - prev.y);
    prev = q;
  });
  return len;
};

/**
 * ═══ THE CAMERA ═══
 *
 * ONE eased travel, in a STRAIGHT LINE from the first candle to the last.
 *
 * It used to ride a smoothed centreline through the prices, which meant the
 * whole panel rose and sank as the chart did. A straight segment between the
 * two ends keeps the move readable as a camera move: the chart is what has
 * shape, the camera does not.
 */
/**
 * The height the camera holds: the plot's own middle, the same at both ends.
 *
 * Aiming at each candle's price instead put the camera up near 6.900 at the
 * start — and at this magnification that is where the panel's HEADER is, so
 * the opening frame was the big price readout rather than the chart. A level
 * track keeps the candles in the middle of the frame the whole way across.
 */
const TRACK_Y = PLOT.y + PLOT.h / 2;
const START = { x: px(0), y: TRACK_Y };
const END = { x: px(BARS.length - 1), y: TRACK_Y };
const along = (p: number) => {
  const t = clamp01(p);
  return { x: START.x + (END.x - START.x) * t, y: TRACK_Y };
};

const font = theme.text.family;

/**
 * A watchlist card's sparkline — the same trace as its screenshot, not a
 * decorative squiggle. Its last point is the quoted price, so the line and the
 * number under it end in the same place.
 */
const spark = (shot: Anchor[], seed: number, w: number, h: number) => {
  const v = fromAnchors(shot, 46, seed, 0.002);
  const lo = Math.min(...v);
  const hi = Math.max(...v);
  return v
    .map((n, i) => {
      const x = (w * i) / (v.length - 1);
      const y = h - ((n - lo) / Math.max(1e-9, hi - lo)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

export const Scene01 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dy = cutOut(g, CUTS.toAverage);
  const blur = cutBlur(g, CUTS.toAverage);
  const cardW = (PANEL.w - ROW.gap * 3) / 4;

  /**
   * ═══ THE ISOMETRIC ARRIVAL ═══
   *
   * Done in CSS 3D rather than WebGL, deliberately: the whole panel — card,
   * axis, header, chip — turns as ONE plate, and every glyph on it stays a
   * glyph. A WebGL plate can only carry what has been redrawn as geometry, and
   * the type would have to be baked to a texture to come along.
   *
   * `home` unwinds all of it to nothing, so frame 188 onwards is exactly the
   * flat, at-rest panel and no transform is left in the way.
   */
  const home = progressInOut(f, T.travel, T.home - T.travel);
  /* full lean from frame 0 — the scene opens on the angle, it does not turn
     into it — and it unwinds only when the camera goes home */
  const on = 1 - home;
  const p = progressInOut(f, T.reveal, T.travel - T.reveal);
  const at = along(p);
  const zoom = 1 + (DOLLY.from + (DOLLY.to - DOLLY.from) * p - 1) * (1 - home);
  const yaw = ISO.yaw * on;
  const pitch = ISO.pitch * on;
  const roll = ISO.roll * on;
  /* the tracked point travels to the middle of the frame; at `home` the whole
     offset has decayed to zero and the panel is back where it belongs */
  const tx = (theme.canvas.width / 2 - at.x) * (1 - home);
  const ty = (theme.canvas.height / 2 - at.y) * (1 - home);
  const plate =
    home >= 0.999
      ? undefined
      : `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${zoom.toFixed(3)}) rotateZ(${roll.toFixed(2)}deg) rotateY(${yaw.toFixed(2)}deg) rotateX(${pitch.toFixed(2)}deg)`;

  /** The watchlist leaves downwards, blurring, and the pills take its place. */
  const out = progressInOut(f, T.cardsGone, T.cardsOut);
  const maLive = f >= T.maOn;
  const bbLive = f >= T.bbOn;

  /**
   * The closing beat. The pills rise to the middle of the frame and the chart
   * BLURS AWAY behind them on the same curve — it does not dim and stay, it
   * leaves. By the time the pills land, the frame is the two of them and
   * nothing else, which is what the cut then carries into SC02.
   */
  const rise = progressInOut(f, T.centre, T.centreOver);
  const pillY = PILL.y + (theme.canvas.height / 2 - PILL.h / 2 - PILL.y) * rise;
  const behind = 1 - rise;
  const behindBlur = rise * 16;
  /** Only the Moving Average is singled out. */
  const lit = progress(f, T.glow, T.glowOver);

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        {/* the plate the panel is turned on — perspective lives on the parent,
            never on the element that rotates */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            perspective: 2200,
            perspectiveOrigin: "50% 50%",
          }}
        >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `${at.x}px ${at.y}px`,
            transform: plate,
            opacity: behind,
            filter: behindBlur > 0.05 ? `blur(${behindBlur.toFixed(1)}px)` : undefined,
          }}
        >
        {/* ── the panel ──────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            borderRadius: theme.shape.cardRadius,
            background: theme.color.surface,
            border: `${theme.shape.hairline}px solid ${theme.color.hairline}`,
            overflow: "hidden",
          }}
        >
          {/* the chart's own ground — a wash, hue-locked to the palette */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 168,
              width: PANEL.w,
              height: PANEL.h - 168,
              background: `linear-gradient(180deg, ${theme.color.indigo12} 0%, ${theme.color.cyan12} 46%, ${theme.color.surface} 100%)`,
            }}
          />

          {/* ── header ── */}
          <div style={{ position: "absolute", left: HEAD.x, top: 36, display: "flex", alignItems: "center", gap: HEAD.gap }}>
            <div
              style={{
                width: HEAD.avatar,
                height: HEAD.avatar,
                borderRadius: HEAD.avatar / 2,
                background: theme.color.indigo,
                color: theme.color.onIndigo,
                fontFamily: font,
                fontSize: theme.text.tag.size,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              B
            </div>
            <span style={{ fontFamily: font, fontSize: theme.text.chip.size, fontWeight: theme.text.chip.weight, color: theme.color.ink }}>
              {MAIN.ticker}
            </span>
            <span style={{ fontFamily: font, fontSize: theme.text.tag.size, fontWeight: theme.text.tag.weight, color: theme.color.textMuted }}>
              {MAIN.name}
            </span>
            {/* real ticker, invented numbers — see the header note */}
            <span
              style={{
                fontFamily: font,
                fontSize: theme.text.tag.size,
                fontWeight: theme.text.tag.weight,
                color: theme.color.textMuted,
                border: `${theme.shape.hairline}px solid ${theme.color.border}`,
                borderRadius: theme.shape.chipRadius,
                padding: "4px 14px",
              }}
            >
              Ilustrasi
            </span>
          </div>

          {/* left edge on "BBCA", not on the avatar beside it */}
          <div
            style={{
              position: "absolute",
              left: HEAD.x + HEAD.avatar + HEAD.gap,
              top: 92,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <span style={{ fontFamily: font, fontSize: PRICE_SIZE, fontWeight: theme.text.display.weight, color: theme.color.ink, lineHeight: 1 }}>
              {fmt(MAIN.price)}
            </span>
            <span
              style={{
                fontFamily: font,
                fontSize: theme.text.tag.size,
                fontWeight: theme.text.tag.weight,
                color: MAIN.up ? theme.color.candleGreen : theme.color.candleRed,
                background: MAIN.up ? "rgba(34, 181, 115, 0.12)" : "rgba(229, 71, 93, 0.12)",
                borderRadius: theme.shape.chipRadius,
                padding: "6px 16px",
              }}
            >
              {MAIN.change}
            </span>
          </div>

          {/* timeframe pills, top-right of the panel — clear of the logo zone
              because the panel itself starts below it */}
          <div style={{ position: "absolute", right: 40, top: 40, display: "flex", gap: 8 }}>
            {FRAMES.map((t) => {
              const on = t === ACTIVE;
              return (
                <span
                  key={t}
                  style={{
                    fontFamily: font,
                    fontSize: theme.text.tag.size,
                    fontWeight: theme.text.tag.weight,
                    color: on ? theme.color.onIndigo : theme.color.textMuted,
                    background: on ? theme.color.indigo : theme.color.indigoPale,
                    borderRadius: theme.shape.chipRadius,
                    padding: "8px 20px",
                  }}
                >
                  {t}
                </span>
              );
            })}
          </div>

          {/* ── the chart ── */}
          <svg
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
            width={PANEL.w}
            height={PANEL.h}
          >
            {LEVELS.map((v) => (
              <g key={v}>
                <line
                  x1={PLOT.x - PANEL.x}
                  y1={py(v) - PANEL.y}
                  x2={PLOT.x + PLOT.w - PANEL.x}
                  y2={py(v) - PANEL.y}
                  stroke={theme.color.gridline}
                  strokeWidth={theme.shape.hairline}
                  strokeDasharray="2 8"
                />
                <text
                  x={AXIS_CX}
                  y={py(v) - PANEL.y + 10}
                  textAnchor="middle"
                  fontFamily={font}
                  fontSize={theme.text.axis.size}
                  fontWeight={theme.text.axis.weight}
                  fill={theme.color.textMuted}
                >
                  {fmt(v)}
                </text>
              </g>
            ))}

            {BARS.map((b, i) => {
              const x = px(i) - PANEL.x;
              const top = Math.min(py(b.o), py(b.c)) - PANEL.y;
              const h = Math.max(2, Math.abs(py(b.c) - py(b.o)));
              const up = b.c >= b.o;
              /* fade AND trim together — the range opens around the price
                 rather than the bar rising into place from below */
              const at = T.reveal + i * PER_BAR;
              const o = clamp01((f - at) / CANDLE_IN.fade);
              if (o <= 0.001) return null;
              const k = progress(f, at, CANDLE_IN.trim);
              const cy = (py(b.h) + py(b.l)) / 2 - PANEL.y;
              return (
                <g key={i} opacity={o} transform={`translate(0 ${cy}) scale(1 ${k.toFixed(3)}) translate(0 ${-cy})`}>
                  <line
                    x1={x}
                    y1={py(b.h) - PANEL.y}
                    x2={x}
                    y2={py(b.l) - PANEL.y}
                    stroke={up ? theme.color.candleGreen : theme.color.candleRed}
                    strokeWidth={theme.shape.wick}
                  />
                  <rect
                    x={x - BODY_W / 2}
                    y={top}
                    width={BODY_W}
                    height={h}
                    rx={2}
                    fill={up ? theme.color.candleGreen : theme.color.candleRed}
                  />
                </g>
              );
            })}

            {/* ── Bollinger Bands, under the average that is their middle ── */}
            {bbLive && (
              <g opacity={progress(f, T.bbOn + 8, 14)}>
                <path
                  d={`${pathOf(BB.upper)} ${BB.lower
                    .map((v, i) =>
                      v === null ? "" : `L${(px(i) - PANEL.x).toFixed(1)},${(py(v) - PANEL.y).toFixed(1)}`,
                    )
                    .reverse()
                    .join(" ")} Z`}
                  fill={theme.color.cyan}
                  fillOpacity={0.1}
                  stroke="none"
                />
                {[BB.upper, BB.lower].map((band, n) => (
                  <path
                    key={n}
                    d={pathOf(band)}
                    fill="none"
                    stroke={theme.color.cyan}
                    strokeWidth={theme.shape.band}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    {...drawPath(f, T.bbOn + 8, 34, lenOf(band))}
                  />
                ))}
              </g>
            )}

            {/* ── the moving average ── */}
            {maLive && (
              <path
                d={pathOf(MA)}
                fill="none"
                stroke={theme.color.indigo}
                strokeWidth={theme.shape.ma}
                strokeLinecap="round"
                strokeLinejoin="round"
                {...drawPath(f, T.maOn + 8, 34, lenOf(MA))}
              />
            )}

            {/* the last-price line, and nothing else on it — the readout it
                carries is the pill on the axis */}
            <line
              x1={PLOT.x - PANEL.x}
              y1={CUR_Y - PANEL.y}
              x2={PLOT.x + PLOT.w - PANEL.x}
              y2={CUR_Y - PANEL.y}
              stroke={theme.color.ink}
              strokeWidth={theme.shape.hairline}
              strokeDasharray="8 8"
            />

            {AXIS.map((t, i) => (
              <text
                key={t}
                x={PLOT.x - PANEL.x + 14 + ((PLOT.w - 28) * i) / (AXIS.length - 1)}
                /* +62 put the baseline at 652 in a 650-tall panel, and the panel
                   clips — the labels were being cut in half */
                y={PLOT.y + PLOT.h - PANEL.y + 34}
                textAnchor="middle"
                fontFamily={font}
                fontSize={theme.text.axis.size}
                fontWeight={theme.text.axis.weight}
                fill={theme.color.textMuted}
              >
                {t}
              </text>
            ))}
          </svg>

          {/* the price the crosshair sits on, on the axis */}
          <div
            style={{
              position: "absolute",
              /* centred on the same line as the axis labels */
              left: AXIS_CX,
              transform: "translateX(-50%)",
              top: CUR_Y - PANEL.y - 22,
              background: theme.color.ink,
              color: theme.color.onIndigo,
              fontFamily: font,
              fontSize: theme.text.axis.size,
              fontWeight: theme.text.tag.weight,
              borderRadius: theme.shape.chipRadius,
              padding: "6px 16px",
            }}
          >
            {fmt(MAIN.price)}
          </div>

        </div>

        </div>
        </div>

        {/* ── the watchlist ──────────────────────────────────────────── */}
        {WATCH.map((w, i) => {
          /* one at a time, in the order they were sent */
          const at = T.cards + i * T.cardStep;
          const r = textReveal(f, at, T.cardIn);
          const alive = f >= at && out < 0.999;
          return !alive ? null : (
          <div
            key={w.ticker}
            style={{
              position: "absolute",
              left: PANEL.x + i * (cardW + ROW.gap),
              /* in on a rise, out downwards — and it BLURS on the way out, so
                 the eye lets go of it before the pills arrive */
              top: ROW.y + r.dy + out * 90,
              opacity: r.opacity * (1 - out),
              filter: out > 0.01 ? `blur(${(out * 9).toFixed(1)}px)` : undefined,
              width: cardW,
              height: ROW.h,
              borderRadius: theme.shape.panelRadius,
              background: theme.color.surface,
              border: `${theme.shape.hairline}px solid ${theme.color.hairline}`,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 24, top: 18, display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: theme.color.indigoPale,
                  color: theme.color.indigo,
                  fontFamily: font,
                  fontSize: 18,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {w.ticker[0]}
              </div>
              <span style={{ fontFamily: font, fontSize: theme.text.tag.size, fontWeight: theme.text.tag.weight, color: theme.color.ink }}>
                {w.ticker}
              </span>
              <span
                style={{
                  fontFamily: font,
                  fontSize: theme.text.tag.size,
                  fontWeight: theme.text.tag.weight,
                  color: w.up ? theme.color.candleGreen : theme.color.candleRed,
                }}
              >
                {w.change}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                left: 24,
                top: 64,
                fontFamily: font,
                fontSize: theme.text.tag.size,
                fontWeight: 700,
                color: theme.color.ink,
              }}
            >
              {fmt(w.price)}
            </div>
            <svg style={{ position: "absolute", right: 20, bottom: 16 }} width={150} height={44}>
              <path
                d={spark(w.shot, w.seed, 150, 40)}
                fill="none"
                stroke={w.up ? theme.color.candleGreen : theme.color.candleRed}
                strokeWidth={theme.shape.band}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          );
        })}

        {/* ── the two indicators, as pills ───────────────────────────── */}
        {f >= T.pills && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: pillY,
              width: theme.canvas.width,
              height: PILL.h,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: PILL.gap,
            }}
          >
            {[
              { label: "Moving Average", on: maLive, at: T.maOn, single: true },
              { label: "Bollinger Bands", on: bbLive, at: T.bbOn, single: false },
            ].map((pill, i) => {
              const r = textReveal(f, T.pills + i * 8, T.cardIn);
              /* the selection is a cross-fade between the two skins, so the
                 border and the fill arrive together instead of snapping */
              const sel = pill.on ? progress(f, pill.at, 10) : 0;
              const mix = (a: string, b: string) => (sel > 0.5 ? b : a);
              return (
                <div
                  key={pill.label}
                  style={{
                    transform: `translateY(${r.dy}px) scale(${(1 + (pill.single ? 0.1 * lit : 0)).toFixed(3)})`,
                    opacity: r.opacity,
                    boxShadow: pill.single && lit > 0.01 ? `0 0 ${(46 * lit).toFixed(0)}px ${theme.color.glow}` : undefined,
                    padding: `${PILL.padY}px ${PILL.padX}px`,
                    borderRadius: theme.shape.chipRadius,
                    background: mix(theme.color.pillFill, theme.color.indigo12),
                    border: `${theme.shape.rule}px solid ${mix(theme.color.border, theme.color.indigo)}`,
                    fontFamily: theme.text.family,
                    fontSize: theme.text.chip.size,
                    fontWeight: theme.text.chip.weight,
                    color: mix(theme.color.textMuted, theme.color.indigo),
                  }}
                >
                  {pill.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SafeArea>
  );
};
