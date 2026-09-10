/**
 * core/Dashboard.tsx — the chrome that turns a bare plot into a screen.
 *
 * Built for VIDEO 22 from Simon's `Chart Dashboard.jpeg`: a strip of ticker
 * tiles across the top, an instrument header with the price and its change,
 * and a grid of stat tiles. The chart itself is unchanged — these are the
 * things AROUND it, and they are the whole difference between "a chart" and
 * "a chart someone is looking at".
 *
 * ⚠ THE REFERENCE IS A US DASHBOARD; THIS IS NOT A COPY OF IT.
 * Numbers are formatted the IDX way (dot thousands, comma decimals) through
 * core/helpers, the change reads "+2,8%" rather than "+2.80%", and the slot
 * the reference gives to a currency holds the TIMEFRAME instead — a made-up
 * currency figure beside an illustrative tape would be a fabricated number
 * wearing a real label.
 *
 * ═══ ⚠ GREEN AND RED, OUTSIDE THE CANDLES ═══
 *
 * The standing rule is that only candle bodies and wicks carry those two
 * colours; chart chrome is indigo / cyan / neutral. These components break it,
 * deliberately, and for the reason core/Candles.tsx already accepts for the
 * volume histogram: **a change readout is its own candle restated**. "+2,8%"
 * IS the last bar. Colouring it indigo would say the number is chrome; the
 * reference is built on this and so is every trading screen a viewer has seen.
 *
 * It stays confined: only a value that restates a bar's direction is tinted.
 * Labels, borders, gridlines, tile fills and every other pixel here are
 * palette neutrals. If Simon would rather hold the line, `upDown` below is the
 * one function to change.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette, useShadow } from "./palette";
import { pct as fmtPct, popIn, textReveal } from "./helpers";
import { useMotion } from "./useMotion";
import type { Palette } from "./theme";
import type { Rect } from "./helpers";

/** The one place a direction becomes a colour. See the header. */
const upDown = (c: Palette, v: number) => (v >= 0 ? c.candleGreen : c.candleRed);
const arrow = (v: number) => (v >= 0 ? "↗" : "↘");

export type Ticker = {
  symbol: string;
  /** Already formatted — the caller owns the number and its units. */
  price: string;
  /** Percent change. Sign decides the colour and the arrow. */
  pct: number;
};

/**
 * The row of ticker tiles.
 *
 * ⚠ THE LAST TILE IS CUT OFF ON PURPOSE. The reference's strip runs past the
 * edge of its card, which is what says "there are more of these" without a
 * scrollbar or an ellipsis. `rect` is the visible window; the tiles are laid
 * out past it and clipped.
 */
export const TickerStrip = ({
  items,
  active = 0,
  rect,
  at,
  stagger,
  tileW,
  opacity = 1,
}: {
  items: Ticker[];
  /** Index of the instrument the scene is about. Rendered inverted. */
  active?: number;
  rect: Rect;
  at: number;
  stagger?: number;
  /** Tile width. Default lays the tiles so the last one is clipped. */
  tileW?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  if (opacity <= 0.001 || !items.length) return null;

  const step = stagger ?? Math.max(1, Math.round(m.pop / 4));
  const gap = 16;
  /* 5.4 tiles across the window, so the sixth is half in and half out */
  const w = tileW ?? (rect.w - gap * 5) / 5.4;

  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        overflow: "hidden",
        opacity,
      }}
    >
      {items.map((t, i) => {
        const p = popIn(f, at + i * step, m.pop);
        if (p.opacity <= 0.001) return null;
        const on = i === active;
        const ink = on ? theme.color.onIndigo : c.ink;
        return (
          <div
            key={t.symbol}
            style={{
              position: "absolute",
              left: i * (w + gap),
              top: 0,
              width: w,
              height: rect.h,
              boxSizing: "border-box",
              padding: `${Math.round(rect.h * 0.13)}px ${Math.round(w * 0.09)}px`,
              borderRadius: theme.shape.chipRadius,
              background: on ? c.ink : c.cardBg,
              border: `${theme.shape.hairline}px solid ${on ? c.ink : c.border}`,
              boxShadow: on ? shadow.rest : undefined,
              fontFamily: theme.text.family,
              opacity: p.opacity,
              transform: `scale(${p.scale})`,
              transformOrigin: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: theme.text.axis.size,
                  fontWeight: 700,
                  color: ink,
                  letterSpacing: 0.4,
                  lineHeight: 1,
                }}
              >
                {t.symbol}
              </span>
              {/* the live dot, on the one the scene is about */}
              {on && (
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: upDown(c, t.pct),
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: theme.text.axis.size, fontWeight: 500, color: ink, lineHeight: 1 }}>
              {t.price}
            </span>
            <span
              style={{
                fontSize: theme.text.axis.size * 0.84,
                fontWeight: 600,
                color: upDown(c, t.pct),
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {arrow(t.pct)} {fmtPct(t.pct)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * The instrument header: a mark, the name and its subtitle on the left, the
 * price and its change on the right.
 *
 * ⚠ THE PRICE IS A STRING THE CALLER COMPUTES. It is meant to COUNT while the
 * tape builds — the reference folder's second model of continuous motion, "the
 * data advances and the readout counts with it" — and only the scene knows how
 * far its own tape has got.
 */
export const InstrumentHeader = ({
  name,
  sub,
  price,
  unit,
  change,
  pct,
  note,
  rect,
  at,
  opacity = 1,
}: {
  name: string;
  sub: string;
  price: string;
  /** The small grey word beside the price — a timeframe, not a currency. */
  unit?: string;
  /** Absolute change, already formatted and signed. */
  change: string;
  /** Percent change. Sign decides the colour and the arrow. */
  pct: number;
  /** "Hari ini", "Sesi ini" — whatever the change is measured over. */
  note?: string;
  rect: Rect;
  at: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (opacity <= 0.001) return null;
  const l = textReveal(f, at, m.reveal);
  const r = textReveal(f, at + Math.round(m.reveal / 2), m.reveal);
  const mid = rect.y + rect.h / 2;

  return (
    <>
      {/* ── left: the mark, the name, the subtitle ─────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: rect.x,
          top: mid,
          transform: `translateY(calc(-50% + ${l.dy}px))`,
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontFamily: theme.text.family,
          opacity: l.opacity * opacity,
        }}
      >
        <div
          style={{
            width: rect.h * 0.62,
            height: rect.h * 0.62,
            borderRadius: theme.shape.panelRadius,
            background: theme.color.indigoWash,
            border: `${theme.shape.hairline}px solid ${c.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: theme.text.body.size,
            fontWeight: 800,
            color: c.indigo,
          }}
        >
          {name.slice(0, 1)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: theme.text.body.size, fontWeight: 700, color: c.ink }}>
            {name}
          </span>
          <span style={{ fontSize: theme.text.axis.size, fontWeight: 500, color: c.muted }}>
            {sub}
          </span>
        </div>
      </div>

      {/* ── right: the price, and what it did ──────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: rect.x + rect.w,
          top: mid,
          transform: `translate(-100%, calc(-50% + ${r.dy}px))`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
          fontFamily: theme.text.family,
          opacity: r.opacity * opacity,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span
            style={{
              fontSize: theme.text.title.size,
              fontWeight: theme.text.title.weight,
              color: c.ink,
              /* ⚠ TABULAR, BECAUSE IT COUNTS. Proportional digits make the
                 whole readout twitch sideways on every frame it changes. */
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {price}
          </span>
          {unit && (
            <span style={{ fontSize: theme.text.axis.size, fontWeight: 500, color: c.muted }}>
              {unit}
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: theme.text.axis.size,
            fontWeight: 600,
            color: upDown(c, pct),
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {arrow(pct)} {change} ({fmtPct(pct)}){note ? ` ${note}` : ""}
        </span>
      </div>
    </>
  );
};

/**
 * The stat tiles under (or beside) the chart: a small muted label with a bold
 * value under it, on a quiet fill. Left-aligned, because a column of numbers
 * is read down its left edge.
 *
 * ⚠ A TILE IS NOT A StatStrip COLUMN. `StatStrip` centres its columns and
 * separates them with rules — it is a summary ROW. This is a grid of facts you
 * scan, which is what the reference uses and why both exist.
 */
export const StatTiles = ({
  stats,
  rect,
  cols = 3,
  at,
  stagger,
  gap = 16,
  opacity = 1,
}: {
  stats: { label: string; value: string }[];
  rect: Rect;
  cols?: number;
  at: number;
  stagger?: number;
  gap?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (opacity <= 0.001 || !stats.length) return null;

  const step = stagger ?? Math.max(1, Math.round(m.reveal / 4));
  const rows = Math.ceil(stats.length / cols);
  const w = (rect.w - gap * (cols - 1)) / cols;
  const h = (rect.h - gap * (rows - 1)) / rows;

  return (
    <>
      {stats.map((s, i) => {
        const p = popIn(f, at + i * step, m.pop);
        if (p.opacity <= 0.001) return null;
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <div
            key={s.label}
            style={{
              position: "absolute",
              left: rect.x + col * (w + gap),
              top: rect.y + row * (h + gap),
              width: w,
              height: h,
              boxSizing: "border-box",
              padding: `${Math.round(h * 0.2)}px ${Math.round(w * 0.09)}px`,
              borderRadius: theme.shape.panelRadius,
              background: theme.color.greyWash,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 8,
              fontFamily: theme.text.family,
              opacity: p.opacity * opacity,
              transform: `scale(${p.scale})`,
              transformOrigin: "center",
            }}
          >
            <span style={{ fontSize: theme.text.axis.size * 0.9, fontWeight: 500, color: c.slate }}>
              {s.label}
            </span>
            <span
              style={{
                fontSize: theme.text.body.size,
                fontWeight: 700,
                color: c.ink,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
            </span>
          </div>
        );
      })}
    </>
  );
};

/**
 * ═══ THE OTHER HEADER ═══  (VIDEO 19's GGRM panel)
 *
 * One line: a round badge, the ticker, the company name. No price, no change,
 * no second row.
 *
 * ⚠ IT IS NOT `InstrumentHeader` WITH THINGS TURNED OFF. That one exists to
 * put a price OPPOSITE a name — the whole point of its layout is the gap
 * between them. This is an identity line, and 019 arrived at it by CUTTING the
 * price: Simon's note there is "kurang berguna", because a last-price readout
 * beside a chart that runs on past it quotes a level nothing has been at for a
 * month. Two headers, two claims; a prop would blur them.
 */
export const InstrumentRow = ({
  ticker,
  name,
  x,
  y,
  at,
  opacity = 1,
}: {
  ticker: string;
  name: string;
  x: number;
  /** Centre-y of the row. */
  y: number;
  at: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (opacity <= 0.001) return null;
  const r = textReveal(f, at, m.reveal);
  const badge = theme.text.title.size + 8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateY(calc(-50% + ${r.dy}px))`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        fontFamily: theme.text.family,
        opacity: r.opacity * opacity,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: badge,
          height: badge,
          borderRadius: 999,
          background: c.indigo,
          color: theme.color.onIndigo,
          fontSize: theme.text.body.size,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ticker.slice(0, 1)}
      </div>
      <span
        style={{ fontSize: theme.text.title.size, fontWeight: theme.text.title.weight, color: c.ink }}
      >
        {ticker}
      </span>
      <span style={{ fontSize: theme.text.tag.size, fontWeight: 500, color: c.slate }}>{name}</span>
    </div>
  );
};

/**
 * The indicator pills, right-aligned on the header line.
 *
 * ⚠ A PILL ARRIVES WITH ITS INDICATOR, NEVER BEFORE IT. 019's rule, and it is
 * the right one: "a chip that says an indicator is on while the plot has none
 * is the panel lying about itself." Each entry carries its own frame.
 */
export const IndicatorPills = ({
  items,
  right,
  y,
  opacity = 1,
}: {
  items: { label: string; at: number }[];
  /** Right edge the row is anchored to. */
  right: number;
  /** Centre-y of the row. */
  y: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: right,
        top: y,
        transform: "translate(-100%, -50%)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontFamily: theme.text.family,
        opacity,
      }}
    >
      {items.map((q) => {
        const p = popIn(f, q.at, m.pop);
        if (p.opacity <= 0.001) return null;
        return (
          <div
            key={q.label}
            style={{
              padding: `${Math.round(theme.text.tag.size * 0.42)}px ${Math.round(theme.text.tag.size * 0.82)}px`,
              borderRadius: 999,
              background: c.indigo,
              color: theme.color.onIndigo,
              fontSize: theme.text.tag.size,
              fontWeight: theme.text.tag.weight,
              whiteSpace: "nowrap",
              opacity: p.opacity,
              transform: `scale(${p.scale})`,
            }}
          >
            {q.label}
          </div>
        );
      })}
    </div>
  );
};

/** The hairline that separates a dashboard's bands. */
export const DashRule = ({
  y,
  x,
  w,
  at,
  over,
  opacity = 1,
}: {
  y: number;
  x: number;
  w: number;
  at: number;
  over: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  if (opacity <= 0.001 || f < at) return null;
  const p = Math.max(0, Math.min(1, (f - at) / Math.max(1, over)));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w * p,
        height: theme.shape.hairline,
        background: c.border,
        opacity,
      }}
    />
  );
};
