/**
 * SC18 — the colour misconception, as one candle that keeps changing its mind.
 * `from 16681 · dur 1167`
 *
 * ⚠ THIS IS THE ONE SCENE THAT EARNS THE COLOUR RULE. Green and red belong to
 * candle bodies, wicks and volume bars and nowhere else — and the reason volume
 * bars are on that list is exactly what this scene teaches: a volume bar is its
 * own candle RESTATED, so it takes that candle's colour. It is not a claim
 * about who was buying.
 *
 * ⚠ AND IT NOW TEACHES IT BY DEMONSTRATION RATHER THAN BY LEGEND. The scene
 * used to say it with a colour key beside a static chart; Simon replaced that
 * with the thing itself. The last candle closes above its open and below it,
 * over and over, and the bar underneath changes colour with it and NEVER
 * CHANGES HEIGHT. Same volume, either colour — which is the whole claim, made
 * without a single word.
 *
 * ⚠ EVERYTHING ELSE IS GONE — "ganti semua visual, tapi keep background
 * putihnya". The title, the two chips, the colour key and the reading were all
 * saying in type what the loop now says by moving.
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, Card, SourceTag, cutOutStyle, usePalette, gridOf, domainOf,
  ramp, textReveal, theme,
} from "../../../core";
import { BLOCK, CUTS, SC18_TICK, local } from "../data/timing";
import { TAG_Y } from "../data/layout";
import { TICK, TICK_VOL } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC18;
const V = SC18_TICK;
// ═══════════════════════════════════════════════════════════════════════════

/** ⚠ THE PANEL KEEPS THE CARD'S y AND HEIGHT AND LOSES TWO THIRDS OF ITS WIDTH.
 *  Only the width was asked for, so only the width moves — the scene still sits
 *  on the same band of the frame as every other scene in the episode. */
const CARD_W = theme.canvas.width * V.cardWidth;
const PANEL = {
  x: theme.canvas.width / 2 - CARD_W / 2 - V.shift,
  y: theme.stage.card.y,
  w: CARD_W,
  h: theme.stage.card.h,
};
const CHART = { x: PANEL.x + 56, y: PANEL.y + 70, w: PANEL.w - 112, h: PANEL.h * 0.46 };
const VOLBOX = { x: CHART.x, y: CHART.y + CHART.h + 46, w: CHART.w, h: PANEL.h * 0.2 };

/**
 * ⚠ THE DOMAIN COVERS THE OSCILLATION, NOT JUST THE NINE DRAWN BARS. Built from
 * the tape alone, the live candle would ride off the top of the plot at the top
 * of every cycle — and a chart whose scale is wrong only twice a second is
 * worse than one that is wrong all the time.
 */
const BASE = domainOf(TICK.closes, TICK.bars);
const SPAN = BASE[1] - BASE[0];
const AMP = SPAN * V.amp;
const OPEN = TICK.bars[TICK.bars.length - 1].c;
const REACH = AMP * V.wick;
const DOMAIN: [number, number] = [
  Math.min(BASE[0], OPEN - REACH),
  Math.max(BASE[1], OPEN + REACH),
];
/** Ten slots, because the live candle occupies the tenth. */
const G = gridOf([...TICK.closes, OPEN], DOMAIN, CHART, 0.12, 0);
const PEAK = Math.max(...TICK_VOL);
const LIVE = TICK.closes.length;

export const SC18 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const at = local(V.at, FROM);
  if (f < at) return null;

  /**
   * ⚠ ONE SINE DRIVES THE BODY AND THE TWO COLOURS. The close travels through
   * its own open, so `up` flips on the frame the body is at zero height — the
   * one frame where a colour change cannot be seen happening.
   */
  const swing = Math.sin((2 * Math.PI * (f - at)) / V.period);
  const close = OPEN + AMP * swing;
  const up = close >= OPEN;
  const fill = up ? c.candleGreen : c.candleRed;

  const w = Math.max(3, G.slot * 0.68);
  const x = G.x(LIVE);
  const top = Math.min(G.y(OPEN), G.y(close));
  const h = Math.max(1.5, Math.abs(G.y(close) - G.y(OPEN)));
  /** ⚠ THE BAR'S HEIGHT IS THE NINTH'S, FIXED. Same volume, either colour. */
  const vh = (TICK_VOL[LIVE] / PEAK) * VOLBOX.h;

  const C = V.col;
  /** ⚠ THE TWO BLOCKS ARE STACKED FROM ONE ORIGIN, so moving `col.y` moves both
   *  and the 60px between them cannot drift. */
  const okY = C.y;
  const okText = okY + C.icon + C.gap;
  const badY = okText + V.right.size + C.between;
  const badText = badY + C.icon + C.gap;
  /** ⚠ MEASURED FROM THE BOTTOM OF THE SECOND LINE, not from the block's top —
   *  Simon's 100 is a gap under "Volume merah…", and a gap under a block of two
   *  lines has to know where the second one ends. */
  const noteY = badText + V.wrong.size * 1.5 + V.wrong.size + V.note.gap;

  /** ⚠ LINEAR, AND COUNTED IN CHARACTERS. Typing that eases is a machine
   *  warming up; a hand goes at one speed. */
  const headTyped = Math.floor(
    ramp(f, local(V.head.at, FROM), V.head.tail.length * V.head.perChar) *
      V.head.tail.length,
  );
  const typed = Math.floor(
    ramp(f, local(V.right.at, FROM), V.right.text.length * V.right.perChar) *
      V.right.text.length,
  );

  return (
    <Stage>
      <div style={{ position: "absolute", inset: 0, ...cutOutStyle(f + FROM, CUTS.toLimits) }}>
      <SourceTag kind={TICK.kind} y={TAG_Y} />
      {/* ⚠ FLUSH LEFT ON THE MARGIN, AND IN TWO PARTS. "Common Mistake:" is
          the label the bonus chapter carries, so it is simply there; the typing
          spells out WHICH mistake. `Title` is not used because it reveals one
          string as a whole, which is the entrance this heading no longer has. */}
      <div
        style={{
          position: "absolute",
          left: theme.margin.left,
          top: theme.stage.title.y - theme.text.title.size / 2,
          fontFamily: theme.text.family,
          fontSize: theme.text.title.size,
          fontWeight: theme.text.title.weight,
          lineHeight: 1.2,
          color: theme.color.indigo,
          whiteSpace: "pre",
        }}
      >
        {V.head.lead}
        {V.head.tail.slice(0, headTyped)}
      </div>
      {/* ⚠ ONE GROUP: the panel and the column beside it travel together. The
          heading is deliberately outside it — it belongs to the margin. */}
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-V.group}px)` }}>
      {/* the white panel Simon kept, at a third of the frame */}
      <Card rect={PANEL} />

      {/* ── the nine that stand still ──────────────────────────────────── */}
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        {TICK.bars.map((b, i) => {
          const bx = G.x(i);
          const bfill = b.c >= b.o ? c.candleGreen : c.candleRed;
          const bt = Math.min(G.y(b.o), G.y(b.c));
          const bh = Math.max(1.5, Math.abs(G.y(b.c) - G.y(b.o)));
          const bv = (TICK_VOL[i] / PEAK) * VOLBOX.h;
          return (
            <g key={i}>
              <line x1={bx} y1={G.y(b.h)} x2={bx} y2={G.y(b.l)} stroke={bfill} strokeWidth={theme.shape.rule} />
              <rect x={bx - w / 2} y={bt} width={w} height={bh} rx={Math.min(w * 0.22, 5)} fill={bfill} />
              <rect
                x={bx - w / 2}
                y={VOLBOX.y + VOLBOX.h - bv}
                width={w}
                height={Math.max(1, bv)}
                rx={Math.min(w * 0.28, 8)}
                fill={bfill}
                opacity={0.72}
              />
            </g>
          );
        })}

        {/* ── and the one that does not ──────────────────────────────────
            ⚠ ITS WICK IS A FIXED ENVELOPE. High and low do not follow the
            close, so this reads as one candle updating rather than as a
            different candle every half-second. */}
        <line x1={x} y1={G.y(OPEN + REACH)} x2={x} y2={G.y(OPEN - REACH)} stroke={fill} strokeWidth={theme.shape.rule} />
        <rect x={x - w / 2} y={top} width={w} height={h} rx={Math.min(w * 0.22, 5)} fill={fill} />
        <rect
          x={x - w / 2}
          y={VOLBOX.y + VOLBOX.h - vh}
          width={w}
          height={Math.max(1, vh)}
          rx={Math.min(w * 0.28, 8)}
          fill={fill}
          opacity={0.72}
        />
      </svg>

      {/* ── the reading, typed out beside the loop ──────────────────────── */}
      {typed > 0 && (
        <>
          <Mark x={C.x} y={okY} d={C.icon} fill={c.candleGreen} kind="check" />
          <div
            style={{
              position: "absolute",
              left: C.x,
              top: okText,
              fontFamily: theme.text.family,
              fontSize: V.right.size,
              fontWeight: 700,
              lineHeight: 1,
              color: theme.color.indigo,
              whiteSpace: "nowrap",
            }}
          >
            {V.right.text.slice(0, typed)}
          </div>
        </>
      )}

      {/* ── and the misreading it rules out ─────────────────────────────── */}
      {f >= local(V.wrong.at, FROM) && (
        <>
          <Mark x={C.x} y={badY} d={C.icon} fill={theme.color.warn} kind="cross" />
          {V.wrong.lines.map((line, i) => {
            const r = textReveal(f, local(V.wrong.at, FROM) + i * V.wrong.stagger, V.wrong.over, 12);
            return (
              <div
                key={line}
                style={{
                  position: "absolute",
                  left: C.x,
                  top: badText + i * V.wrong.size * 1.5,
                  fontFamily: theme.text.family,
                  fontSize: V.wrong.size,
                  fontWeight: 600,
                  lineHeight: 1,
                  /* ⚠ INDIGO, LIKE EVERY OTHER WORD HERE — Simon: "semua warna
                     text di scene ini, indigo, tidak ada yang hitam". */
                  color: theme.color.indigo,
                  whiteSpace: "nowrap",
                  opacity: r.opacity,
                  transform: `translateY(${r.dy.toFixed(1)}px)`,
                }}
              >
                {line}
              </div>
            );
          })}
        </>
      )}

      {/* ── the aside, in the only handwriting in the episode ───────────── */}
      {f >= local(V.note.at, FROM) && (() => {
        const r = textReveal(f, local(V.note.at, FROM), V.note.over, 12);
        return (
          <>
            <Mark x={C.x} y={noteY} d={C.icon} fill={theme.color.indigo} kind="info" />
            <div
              style={{
                position: "absolute",
                left: C.x,
                top: noteY + C.icon + C.gap,
                fontFamily: theme.text.family,
                fontSize: V.note.size,
                fontWeight: 600,
                lineHeight: 1,
                color: theme.color.indigo,
                whiteSpace: "nowrap",
                opacity: r.opacity,
                transform: `translateY(${r.dy.toFixed(1)}px)`,
              }}
            >
              {V.note.text}
            </div>
          </>
        );
      })()}
      </div>
      </div>
    </Stage>
  );
};

/**
 * A filled disc with a white glyph in it — the two marks this scene needs and
 * nothing else.
 *
 * ⚠ THE COLOURS ARE THE SCENE'S OWN. Green and red are candle colours
 * everywhere else in this project; here they are what the scene is ABOUT, and
 * the red is `warn` — the one red allowed outside a candle, and only for naming
 * a mistake, which is exactly what the cross does.
 */
const Mark = ({
  x, y, d, fill, kind,
}: { x: number; y: number; d: number; fill: string; kind: "check" | "cross" | "info" }) => {
  const r = d / 2;
  const a = d * 0.24;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={d} height={d}>
      <circle cx={r} cy={r} r={r} fill={fill} />
      {/* ⚠ THE "i" IS A GLYPH, NOT A PATH — and handwritten, at Simon's word.
          The two marks above are drawn because a tick and a cross are shapes;
          a letter is a letter, and the face it is set in is the point of it. */}
      {kind === "info" ? (
        <text
          x={r}
          y={r}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={theme.text.hand}
          fontStyle="italic"
          fontWeight={700}
          fontSize={d * 0.72}
          fill="#FFFFFF"
        >
          i
        </text>
      ) : (
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
      )}
    </svg>
  );
};
