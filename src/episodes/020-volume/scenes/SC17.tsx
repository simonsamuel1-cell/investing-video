/**
 * SC17 — two product windows, one spike each.  `from 16078 · dur 575`
 *
 * ═══ WHY IT IS A PRODUCT PAGE ═══  (Simon's reference, and his call)
 *
 * The same volume spike means opposite things depending on what price was
 * doing around it, and the hard part of that sentence is "depending on". A
 * product page is a layout the eye already knows how to read as ONE THING
 * DESCRIBED: a display, its name, and the paragraph that explains it. Two of
 * them side by side turn a comparison into two entries in the same catalogue,
 * which is exactly the claim — same object, different context, different read.
 *
 * ⚠ NO PRICE. The reference sets one beside the title and Simon struck it:
 * "dalam konteks chart, jangan gunakan harga". A number in that slot on a chart
 * card would be read as the chart's price, and there isn't one — these tapes
 * are traced pixels, not quotes.
 *
 * ⚠ THE GROUND IS SC16'S OWN, and that is what makes the cut land. The camera
 * cuts at 16078 from a chart on this ground to two windows on the same ground:
 * the room does not change, only what is standing in it.
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, cutInStyle, gridOf, popIn, progress, textReveal, usePalette, theme,
} from "../../../core";
import { BLOCK, CUTS, SC16_UI, SPIKES, local } from "../data/timing";
import {
  SS4, SS4_DOMAIN, SS4_VOL, SS5, SS5_DOMAIN, SS5_VOL,
} from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC17;
const V = SPIKES;
// ═══════════════════════════════════════════════════════════════════════════

/** The two windows, in canvas coordinates. Centred as a PAIR, so neither one
 *  has a typed x of its own. */
const PAIR_W = V.win.w * 2 + V.win.gap;
const CARDS = V.cards.map((card, i) => ({
  ...card,
  x: theme.canvas.width / 2 - PAIR_W / 2 + i * (V.win.w + V.win.gap),
  series: i === 0 ? SS4 : SS5,
  domain: i === 0 ? SS4_DOMAIN : SS5_DOMAIN,
  vol: i === 0 ? SS4_VOL : SS5_VOL,
}));

/* ── the device's own furniture ──────────────────────────────────────────── */

const StatusBar = ({ ink }: { ink: string }) => {
  const U = V.ui;
  return (
    <div
      style={{
        position: "absolute",
        left: U.pad + 12,
        right: U.pad + 12,
        top: U.status.y,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: theme.text.family,
        fontSize: U.status.size,
        fontWeight: 700,
        color: ink,
      }}
    >
      <span>9:41</span>
      {/* signal, wifi, battery — shapes, not glyphs, so no font can lose them */}
      <span style={{ display: "flex", alignItems: "flex-end", gap: 5 }}>
        {[4, 7, 10, 13].map((h) => (
          <i key={h} style={{ width: 3, height: h, borderRadius: 1, background: ink }} />
        ))}
        <i style={{ width: 9, height: 9, marginLeft: 3, borderRadius: "50% 50% 2px 50%", transform: "rotate(45deg)", background: ink }} />
        <i style={{ width: 22, height: 11, marginLeft: 5, borderRadius: 3, border: `1.5px solid ${ink}`, boxSizing: "border-box", padding: 2 }}>
          <i style={{ display: "block", width: "100%", height: "100%", borderRadius: 1, background: ink }} />
        </i>
      </span>
    </div>
  );
};

const Header = ({ ink }: { ink: string }) => {
  const U = V.ui;
  const s = U.header.size;
  return (
    <div
      style={{
        position: "absolute",
        left: U.pad + 10,
        right: U.pad + 10,
        top: U.header.y,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M15 5 L7 12 L15 19" stroke={ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <circle cx={10.5} cy={10.5} r={6.5} stroke={ink} strokeWidth={2} />
        <path d="M15.5 15.5 L20 20" stroke={ink} strokeWidth={2} strokeLinecap="round" />
      </svg>
    </div>
  );
};

/* ── one window ──────────────────────────────────────────────────────────── */

const Window = ({ card }: { card: (typeof CARDS)[number] }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const U = V.ui;
  const at = local(card.at, FROM);
  const pop = popIn(f, at, V.pop);
  if (pop.opacity <= 0.001) return null;

  /** ⚠ THE GRID IS THE DISPLAY'S, NOT THE WINDOW'S. Everything inside is drawn
   *  in the device's own coordinates and the device is placed once, so the tape
   *  cannot drift away from the frame it sits in. */
  const g = gridOf(card.series.closes, card.domain, U.price, 0.08, 0);
  const built = progress(f, at + V.build.after, V.build.over);
  const words = card.desc.map((_, i) =>
    textReveal(f, at + V.words.after + i * V.words.stagger, V.words.over, 12),
  );
  const head = textReveal(f, at + V.words.after, V.words.over, 12);

  return (
    <div
      style={{
        position: "absolute",
        left: card.x,
        top: V.win.y,
        width: V.win.w,
        height: V.win.h,
        borderRadius: V.win.radius,
        background: theme.color.glassPanel,
        border: `${theme.shape.hairline}px solid ${theme.color.glassEdge}`,
        boxShadow: theme.color.glassShadow,
        opacity: pop.opacity,
        transform: `translateY(${((1 - pop.opacity) * 26).toFixed(1)}px) scale(${pop.scale.toFixed(4)})`,
      }}
    >
      <StatusBar ink={theme.color.glassInk} />
      <Header ink={theme.color.glassInk} />

      {/* ── the product display ─────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: U.display.x,
          top: U.display.y,
          width: U.display.w,
          height: U.display.h,
          borderRadius: U.display.radius,
          background: theme.color.glassBg,
          overflow: "hidden",
        }}
      />
      {/* ⚠ THE TAPE IS A SIBLING OF THE DISPLAY, NOT A CHILD. `Candles` draws
          into a canvas-sized SVG at 0,0; inside the display it would be offset
          by the display's own origin and land 20px right and 118px down. */}
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "hidden" }}
        width={V.win.w}
        height={V.win.h}
      >
        <clipPath id={`d${card.at}`}>
          <rect x={U.display.x} y={U.display.y} width={U.display.w} height={U.display.h} rx={U.display.radius} />
        </clipPath>
        <g clipPath={`url(#d${card.at})`}>
          {card.series.bars.slice(0, Math.ceil(card.series.bars.length * built)).map((b, i) => {
            const x = g.x(i);
            const w = Math.max(3, g.slot * 0.66);
            const top = Math.min(g.y(b.o), g.y(b.c));
            const h = Math.max(1.5, Math.abs(g.y(b.c) - g.y(b.o)));
            const fill = b.c >= b.o ? c.candleGreen : c.candleRed;
            const vh = (card.vol[i] / Math.max(...card.vol)) * U.volume.h;
            return (
              <g key={i}>
                <line x1={x} y1={g.y(b.h)} x2={x} y2={g.y(b.l)} stroke={fill} strokeWidth={theme.shape.hairline} />
                <rect x={x - w / 2} y={top} width={w} height={h} rx={Math.min(w * 0.22, 4)} fill={fill} />
                <rect
                  x={x - w / 2}
                  y={U.volume.y + U.volume.h - vh}
                  width={w}
                  height={Math.max(1, vh)}
                  rx={Math.min(w * 0.28, 4)}
                  fill={fill}
                  opacity={0.72}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* the reference's own button, kept because it is what makes the shape
          read as a product page rather than as a card with a chart on it */}
      <div
        style={{
          position: "absolute",
          left: U.display.x + U.display.w - U.fab.d - 18,
          top: U.display.y + U.display.h - U.fab.d / 2,
          width: U.fab.d,
          height: U.fab.d,
          borderRadius: "50%",
          background: theme.color.glassInk,
          boxShadow: theme.color.glassShadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={26} height={26} viewBox="0 0 24 24">
          <path d="M12 5 V19 M5 12 H19" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
        </svg>
      </div>

      {/* ── name and paragraph ──────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: U.pad + 14,
          top: U.title.y,
          fontFamily: theme.text.family,
          fontSize: U.title.size,
          fontWeight: 800,
          lineHeight: 1,
          color: theme.color.glassInk,
          opacity: head.opacity,
          transform: `translateY(${head.dy.toFixed(1)}px)`,
        }}
      >
        {card.title}
      </div>
      {card.desc.map((line, i) => (
        <div
          key={line}
          style={{
            position: "absolute",
            left: U.pad + 14,
            top: U.desc.y + i * U.desc.size * U.desc.leading,
            width: V.win.w - (U.pad + 14) * 2,
            fontFamily: theme.text.family,
            fontSize: U.desc.size,
            fontWeight: 500,
            lineHeight: 1,
            color: c.slate,
            whiteSpace: "nowrap",
            opacity: words[i].opacity,
            transform: `translateY(${words[i].dy.toFixed(1)}px)`,
          }}
        >
          {line}
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: V.win.w / 2 - U.home.w / 2,
          top: U.home.y,
          width: U.home.w,
          height: U.home.h,
          borderRadius: U.home.h / 2,
          background: theme.color.glassInk,
          opacity: 0.85,
        }}
      />
    </div>
  );
};

export const SC17 = () => {
  const f = useCurrentFrame();
  const U = SC16_UI;
  /** ⚠ THE DRIFT CONTINUES FROM SC16'S OWN CLOCK, not from zero. The cut does
   *  not stop the room moving; restarting the drift here would put a visible
   *  jolt on the one thing that is supposed to carry across it. */
  const d = (f + BLOCK.SC17 - BLOCK.SC16) / U.drift.over;

  return (
    <Stage transparent>
      <div style={{ position: "absolute", inset: 0, ...cutInStyle(f + FROM, CUTS.toSpikes) }}>
        <div
          style={{
            position: "absolute",
            inset: -120,
            background: theme.color.glassBg,
            transform:
              `translate(${(d * U.drift.ground.x).toFixed(2)}px, ${(d * U.drift.ground.y).toFixed(2)}px) ` +
              `scale(${(1 + d * U.drift.ground.zoom).toFixed(4)})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter: `blur(${U.ghost.blur}px)`,
            transform: `translate(${(d * U.drift.ghost.x).toFixed(2)}px, ${(d * U.drift.ghost.y).toFixed(2)}px)`,
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

        {CARDS.map((card) => (
          <Window key={card.at} card={card} />
        ))}
      </div>
    </Stage>
  );
};

/** Kept honest: the description lines are typed, so nothing here can silently
 *  wrap. If one grows past the device, it fails at build rather than on screen. */
{
  const MAX = 46;
  SPIKES.cards.forEach((card) =>
    card.desc.forEach((line) => {
      if (line.length > MAX) {
        throw new Error(`SC17: "${line}" is ${line.length} characters and will not fit a ${SPIKES.win.w}px window at ${SPIKES.ui.desc.size}px`);
      }
    }),
  );
}
