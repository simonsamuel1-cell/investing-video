/**
 * scenes/Draft.tsx — SC10 · HINDSIGHT BIAS.  `episode f9130–10130 · 1000 f`
 *
 * ⚠ ONE FILE, OWNED BY ONE CHAT AT A TIME. Simon runs a second conversation
 * while this one builds the next scene. Two agents on one branch collide on
 * whatever they both touch, so the split is by FILE, and this is the whole of
 * this session's half.
 *
 * ⚠ IT MUST NOT IMPORT data/timing.ts. The frame table is the one thing both
 * sides need and the one thing that cannot be merged — every VO pad so far has
 * shifted everything after it. So this file owns the PICTURE and writes its
 * beats as local constants counted from 0; the other side owns the CLOCK and
 * puts them into the real table at handover. `useCurrentFrame()` here is frames
 * since the scene began, never a timeline frame.
 *
 * ═══ THE ARGUMENT ═══
 *
 * A chart looks obvious only because we already know how it ended, so outcome
 * alone cannot grade a decision. It is made TWICE with the same shape, and the
 * second half is the payoff of the first, not a new picture bolted on:
 *
 *   B2 → B3a   the chart reads perfectly → its right half is cut away → the
 *              legibility was borrowed from the future.
 *   B4 → B5    one Outcome axis → a Process axis drops in → outcome alone was
 *              never enough.
 *
 * ═══ COMPLIANCE, CARRIED FROM THE IDEATION ═══
 *
 * ⚠ NO ARROW IN THIS SCENE. The original down-arrow plus a "Breakdown Here"
 * chip reads as a directional marker. Replaced by Zone + Swing Low + Prior
 * High, which describe STRUCTURE without asserting where price goes next.
 * ⚠ THE THREE BRANCHES ARE EQUALLY WEIGHTED — same stroke, same dash, same
 * opacity. That equality IS the scene's argument; a heavier "down" branch
 * would invert it.
 * ⚠ THE VERDICTS GRADE A PROCESS, NEVER A STOCK. No ticker anywhere near the
 * matrix, and no buy/sell, entry/exit or price projection in the scene at all.
 *
 * ═══ HANDOVER ═══  When the picture is right:
 *   1. rename this file to Hindsight.tsx,
 *   2. move `V` into data/timing.ts as one block,
 *   3. Composition.tsx gains one import and one <Sequence from={9130}
 *      durationInFrames={1000}>.
 * That is the "copy" — a component, not a timeline. `ProcessMatrix` lives at
 * the bottom of this file rather than in components/; it is one scene's device
 * until a second episode needs it, and keeping it here keeps this session's
 * half to one file.
 */
import { useCurrentFrame } from "remotion";
import {
  Card, Chart, Chip, HighlightCircle, IndicatorPills, Layer, Level,
  Line, RevealMask, SourceTag, Stage, TimeAxis, Words, Zone,
  domainOf, fadeOut, fromAnchors, gridOf, popIn, progress, toBars,
  theme, useMotion, usePalette,
} from "../../../core";
import type { Series } from "../../../core";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/**
 * Beats, in frames from this scene's own start. They become one block in
 * data/timing.ts at handover — never written there from here.
 *
 * ⚠ POSITIONS HERE, DURATIONS FROM useMotion(). WHEN something happens is a
 * position and belongs in a table; HOW LONG it takes is a feel and belongs to
 * the motion system. The audit enforces it.
 *
 * ⚠ THE GAPS ARE VO SILENCE AND THEY HOLD. 138-160, 308-340, 626-662 and
 * 828-864 are deliberately still — no drift, no idle float. B3a and B3b share
 * f482 and run straight through it; there is no transition there.
 */
const V = {
  b1: { chip: 0, head: 10, sub: 34, rule: 46, out: 120 },
  b2: { card: 160, head: 160, candles: 180, level: 232, zone: 250, swing: 268, prior: 286 },
  b3a: { clear: 340, head: 340, mask: 362, divider: 404, glyph: 424 },
  b3b: { head: 482, glyphOut: 482, br: [496, 524, 552], tag: [526, 554, 582], out: 600, gone: 662 },
  b4: { head: 662, axis: 690, ends: 720, caption: 738, dotA: 760, dotB: 776 },
  b5: { head: 864, axis: 868, sides: 900, quadTop: 912, quadLow: 926, travel: 944, lit: 976 },
} as const;

/**
 * How long the scene runs, in its own frames.
 *
 * ⚠ THIS IS THE ONE LENGTH THE PICTURE IS ALLOWED TO KNOW, and it has to be
 * declared rather than left open. Mounted without it the scene simply never
 * ends: it held the finished matrix for the remaining 7,700 frames of the
 * draft, which is not what a 1000-frame scene looks like and is not what the
 * episode will do with it either.
 *
 * ⚠ IT IS A SCENE-LOCAL NUMBER, NOT A TIMELINE ONE. `1000` is this picture's
 * own duration, counted from its own 0 — it says nothing about where the scene
 * sits, so it does not break the rule that keeps this file off data/timing.ts.
 * It travels with `V` at handover, as the <Sequence>'s durationInFrames.
 */
export const SCENE_FRAMES = 1000;
// ═══════════════════════════════════════════════════════════════════════════

/* ── geometry ────────────────────────────────────────────────────────────
   ⚠ ANYTHING THE THEME ALREADY KNOWS IS READ FROM IT. A card edge typed as
   96 is a card that stops following the margin the day the margin moves. */
const ACTIVE = theme.stage.active;
const CARD = { x: ACTIVE.x, y: 230, w: ACTIVE.w, h: 640 };
/** The drawing area. The price scale lives OUTSIDE it, in the column between
 *  its right edge and the card's — see `SPAN`. */
const PLOT = { x: 160, y: 290, w: 1440, h: 460 };
/** ⚠ GRIDLINES AND LABELS RUN PAST THE PLOT, ON PURPOSE. `Chart` hangs its
 *  tick labels 8px inside `span.x2`, so this is what puts the scale in its own
 *  column at x1790 instead of on top of the newest candles. */
const SPAN = { x1: PLOT.x, x2: 1798, y1: PLOT.y, y2: PLOT.y + PLOT.h };
/**
 * ⚠ 182, NOT §5's 140 — MEASURED, NOT CHOSEN. At y140 a 48px line sits inside
 * the top-150 logo band, and the longest of the five headlines ("Setelah harga
 * bergerak, chart sering terlihat sangat jelas.") reaches x1395 — 27px past
 * the x≤1368 the band allows. Shrinking the type to fit is a hack and the copy
 * is the VO's, so the slot moves instead: at 182 the line clears 150 entirely,
 * the whole canvas width is legal again, and it is still clear of the card at
 * 230. Nothing else in the scene moves.
 */
const HEAD_Y = 182;
/** How far a chip stands off the point it names. ⚠ DOWN IS FURTHER THAN UP:
 *  below the swing low the tape is still climbing through, so a chip at the
 *  same offset as the one above lands on the candles it is labelling. */
const CHIP_UP = 62;
const CHIP_DOWN = 138;
/** How far the decision divider overshoots the plot, so it reads as a cut
 *  through the whole panel rather than a line inside the chart. */
const DIV_OVER = { top: 40, bottom: 100 };

/* ── the tape ────────────────────────────────────────────────────────────── */
const N = 60;
/**
 * ⚠ [NEEDS DATA] SC10 chart — awaiting real OHLC, currently generated.
 *
 * Wanted: ~60 IDX daily bars, ISO dates, TradingView export with ADJ active —
 * uptrend, resistance tested twice, then a breakdown, with the decision bar at
 * ≈65% of the visible range. It must NOT be ADMR: SC11 is the ADMR case study
 * and this chart would spoil its reveal.
 *
 * ⚠ NOT `fromShape`, AND THAT IS NOT A SHORTCUT. Its five shapes cannot
 * produce "rises, fails at a level twice, then breaks" — the turns have to
 * land where the narration says they do, so the closes are designed from
 * anchors and the kind stays honest at "synthetic".
 */
const SERIES: Series = (() => {
  const closes = fromAnchors(
    [
      [0, 100], [0.12, 108], [0.2, 104], [0.34, 116], [0.42, 111],
      [0.54, 124], [0.6, 118], [0.66, 124.5],
      [0.72, 112], [0.8, 106], [0.88, 101], [1, 96],
    ],
    N,
    0x22c1,
  );
  return { closes, bars: toBars(closes, 0x22c2), kind: "synthetic" };
})();
const DOMAIN = domainOf(SERIES.closes, SERIES.bars);
/** The last bar the viewer would actually have had. */
const DECIDE = 39;
const RESISTANCE = 125;
/** Read off the tape, never typed — a swing named by hand stops being the
 *  swing the moment an anchor moves. */
const idxOf = (from: number, to: number, pick: "min" | "max") => {
  let best = from;
  for (let i = from; i <= to; i++) {
    const better = pick === "min" ? SERIES.closes[i] < SERIES.closes[best] : SERIES.closes[i] > SERIES.closes[best];
    if (better) best = i;
  }
  return best;
};
const SWING_LOW = idxOf(33, 38, "min");
const PRIOR_HIGH = idxOf(28, 34, "max");
/** ⚠ RELATIVE, NOT DATED. A made-up date on a generated tape is a fabricated
 *  fact; these become real ISO months with the export. */
const AXIS: [number, string][] = [
  [0, "−3 bln"], [19, "−2 bln"], [38, "−1 bln"], [57, "Sekarang"],
];

/* ── the headline slot ───────────────────────────────────────────────────
   One line, one place, cross-faded. ⚠ IT SITS IN THE TOP-150 BAND, so it must
   end before the logo zone — every string here is well inside x1368 at 44px. */
const HEADS: { at: number; text: string }[] = [
  { at: V.b2.head, text: "Setelah harga bergerak, chart sering terlihat sangat jelas." },
  { at: V.b3a.head, text: "Padahal saat candle itu belum terbentuk…" },
  { at: V.b3b.head, text: "…kita belum tahu apa yang terjadi berikutnya." },
  { at: V.b4.head, text: "Jadi jangan nilai keputusan hanya dari hasil akhir." },
  { at: V.b5.head, text: "Lihat juga apakah prosesnya sudah benar." },
];

export const Draft = () => {
  const f = useCurrentFrame();
  return (
    <Stage>
      {f < V.b2.card && <TitleCard f={f} />}
      {/* ⚠ ONE MOUNTED CHART FOR B2, B3a AND B3b. The condition does not change
          across the three beats, so the node is never remounted — B2 adds
          annotations to it, B3a takes them away and cuts it, B3b draws on top
          of it. A remount at either boundary would rebuild the tape mid-sentence. */}
      {f >= V.b2.card && f < V.b3b.gone && <ChartBlock f={f} />}
      {f >= V.b4.head && <ProcessMatrix f={f} />}
      {f >= V.b2.head && <Headline f={f} />}
    </Stage>
  );
};

/** The one headline slot. The last beat to have arrived owns it; `key` makes
 *  each arrival a fresh reveal rather than a string swap mid-fade. */
const Headline = ({ f }: { f: number }) => {
  const h = [...HEADS].reverse().find((q) => f >= q.at);
  if (!h) return null;
  return (
    <Line
      key={h.text}
      text={h.text}
      x={ACTIVE.x}
      y={HEAD_Y}
      at={h.at}
      anchor="left"
      size={theme.text.title.size}
      weight={theme.text.title.weight}
    />
  );
};

/* ═══ B1 · the title card ══════════════════════════════════════════════════ */
const TitleCard = ({ f }: { f: number }) => {
  const m = useMotion();
  const c = usePalette();
  const out = fadeOut(f, V.b1.out, m.fade);
  const rule = progress(f, V.b1.rule, m.sec(0.5));
  return (
    <div style={{ opacity: out, transform: `translateY(${(1 - out) * -m.sec(0.4)}px)` }}>
      {/* ⚠ SOLID INDIGO, SO core/IndicatorPills RATHER THAN A HAND-DRAWN BOX.
          Chip's pill is tinted and outlined; this one is filled. */}
      <IndicatorPills
        items={[{ label: "Mistake #7", at: V.b1.chip }]}
        right={ACTIVE.x + 240}
        y={202}
      />
      <Words
        text="Hindsight Bias"
        x={ACTIVE.x}
        y={252}
        at={V.b1.head}
        anchor="left"
        stagger={m.sec(0.067)}
        size={theme.text.display.size}
        weight={theme.text.display.weight}
      />
      <Line
        text="Bias melihat ke belakang"
        x={ACTIVE.x}
        y={372}
        at={V.b1.sub}
        anchor="left"
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />
      <div
        style={{
          position: "absolute",
          left: ACTIVE.x,
          top: 444,
          width: 420 * rule,
          height: theme.shape.line,
          background: c.cyan,
        }}
      />
    </div>
  );
};

/* ═══ B2 – B3b · the chart ═════════════════════════════════════════════════ */
const ChartBlock = ({ f }: { f: number }) => {
  const m = useMotion();
  const c = usePalette();
  const grid = gridOf(SERIES.closes, DOMAIN, PLOT, 0.12);

  /** B3a takes the knowledge away before it takes the pixels. */
  const known = fadeOut(f, V.b3a.clear, m.sec(0.3));
  /** 1 → 0. The right half is cut away, not covered. */
  const open = 1 - progress(f, V.b3a.mask, m.sec(0.8));
  const glyph = f < V.b3b.glyphOut
    ? progress(f, V.b3a.glyph, m.reveal)
    : fadeOut(f, V.b3b.glyphOut, m.sec(0.33));
  const out = fadeOut(f, V.b3b.out, m.sec(0.43));

  const cut = grid.x(DECIDE + 1);
  const origin = { x: grid.x(DECIDE), y: grid.y(SERIES.closes[DECIDE]) };
  /** ⚠ EQUALLY WEIGHTED, ALL THREE — see the header. Only the hue and the
   *  terminal height differ, and the hues are the palette's two anchors plus a
   *  neutral, so none of them reads as the "real" one. */
  const BRANCH = [
    { y: 360, ink: c.cyan, label: "Up?" },
    { y: 500, ink: c.slate, label: "Sideways?" },
    { y: 640, ink: c.indigo, label: "Down?" },
  ];

  return (
    <div style={{ opacity: out, transform: `translateY(${(1 - out) * -m.sec(0.53)}px)` }}>
      <Card rect={CARD} opacity={progress(f, V.b2.card, m.fade)} soft />

      <Chart
        series={SERIES}
        grid={grid}
        at={V.b2.candles}
        over={m.sec(0.83)}
        gridSpan={SPAN}
        ticks={[100, 105, 110, 115, 120, 125]}
        baseline={false}
      />
      <TimeAxis labels={AXIS} grid={grid} at={V.b2.candles + m.reveal} />
      {/* ⚠ MOUNTED, AND IT DRAWS NOTHING WHILE THE TAPE IS GENERATED — that is
          core/SourceTag's standing behaviour, not an omission. Swapping in the
          real export makes the credit appear by itself. */}
      <SourceTag kind={SERIES.kind} label={SERIES.label} x={1580} y={826} anchor="left" />

      {/* ── B2 · the reading that looks complete ─────────────────────────── */}
      <div style={{ opacity: known }}>
        <Level
          value={RESISTANCE}
          grid={grid}
          at={V.b2.level}
          over={m.sec(0.23)}
          label="Resistance"
          to={24}
        />
        <Zone
          hi={RESISTANCE}
          lo={SERIES.closes[SWING_LOW]}
          grid={grid}
          at={V.b2.zone}
          over={m.sec(0.23)}
          opacity={0.66}
        />
        <HighlightCircle
          cx={grid.x(SWING_LOW)}
          cy={grid.y(SERIES.closes[SWING_LOW])}
          r={theme.text.chip.size}
          land={progress(f, V.b2.swing, m.sec(0.23))}
        />
        <Chip
          label="Swing Low"
          x={grid.x(SWING_LOW)}
          y={grid.y(SERIES.closes[SWING_LOW]) + CHIP_DOWN}
          at={V.b2.swing}
          tone="cyan"
          pill
        />
        <Chip
          label="Prior High"
          x={grid.x(PRIOR_HIGH)}
          y={grid.y(SERIES.closes[PRIOR_HIGH]) - CHIP_UP}
          at={V.b2.prior}
          tone="indigo"
          pill
        />
      </div>

      {/* ── B3a · the future is cut away ─────────────────────────────────── */}
      {/* ⚠ BLEED PAST THE TIME AXIS. At the default the labels' bottom few
          pixels poked out under the cut and "Sekarang" sat there as a ghost —
          a date the viewer is explicitly not supposed to have. */}
      <RevealMask fromIndex={DECIDE + 1} grid={grid} open={open} bleed={60} />
      {f >= V.b3a.divider && (
        <>
          <Layer>
            <line
              x1={cut}
              y1={PLOT.y - DIV_OVER.top}
              x2={cut}
              y2={PLOT.y + PLOT.h + DIV_OVER.bottom}
              stroke={c.indigo}
              strokeWidth={theme.shape.rule}
              strokeDasharray={grid.box.h * 2}
              strokeDashoffset={grid.box.h * 2 * (1 - progress(f, V.b3a.divider, m.sec(0.27)))}
            />
          </Layer>
          <Chip label="Decision Point" x={cut} y={210} at={V.b3a.divider} tone="indigo" pill />
        </>
      )}
      {glyph > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: (cut + SPAN.x2) / 2,
            top: 540,
            transform: "translate(-50%, -50%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.display.size,
            fontWeight: theme.text.display.weight,
            color: c.muted,
            opacity: glyph,
          }}
        >
          ?
        </div>
      )}

      {/* ── B3b · three futures, none of them known ──────────────────────── */}
      {BRANCH.map((b, i) =>
        f < V.b3b.br[i] ? null : (
          <div key={b.label}>
            <Layer>
              <path
                d={`M${origin.x},${origin.y} C${(origin.x + 1400) / 2},${origin.y} ${(origin.x + 1400) / 2},${b.y} 1400,${b.y}`}
                fill="none"
                stroke={b.ink}
                strokeWidth={theme.shape.rule}
                strokeDasharray="10 8"
                opacity={progress(f, V.b3b.br[i], m.sec(0.6))}
              />
            </Layer>
            <Chip
              label={b.label}
              x={1475}
              y={b.y}
              at={V.b3b.tag[i]}
              tone={b.ink === c.cyan ? "cyan" : b.ink === c.indigo ? "indigo" : "slate"}
              pill
            />
          </div>
        ),
      )}
    </div>
  );
};

/* ═══ B4 – B5 · outcome, then process ══════════════════════════════════════
 *
 * ⚠ ONE COMPONENT OWNS BOTH STATES. B5 has to grow OUT of B4 — the horizontal
 * axis stays, the vertical one drops in, and the two dots TRAVEL. Two
 * components would mean two pairs of dots, and the whole point is that these
 * are the same two trades being asked a second question.
 */
const AXIS_Y = 620;
const MID_X = 960;
const QUAD = { w: 440, h: 280 };
const QUADS = [
  { x: 496, y: 316, cond: "Loss + Right Process", verdict: "Bad Luck", tone: "cyan" as const },
  { x: 984, y: 316, cond: "Profit + Right Process", verdict: "Deserved", tone: "cyan" as const },
  { x: 496, y: 644, cond: "Loss + Wrong Process", verdict: "Deserved Loss", tone: "slate" as const },
  { x: 984, y: 644, cond: "Profit + Wrong Process", verdict: "Lucky", tone: "indigo" as const },
];
/** Trade A ends in the top-left quadrant, Trade B in the bottom-right — the
 *  two readings that outcome alone gets wrong. */
/** ⚠ THEY LAND BELOW THE VERDICT, NOT ON IT. Travelling to the quadrant's
 *  geometric centre put both dots straight through "Bad Luck" and "Lucky" —
 *  the words the quadrant exists to say. The copy sits high in the card and
 *  the dot arrives under it. */
const DOTS = [
  { from: { x: 700, y: AXIS_Y }, to: { x: 716, y: 526 }, tone: "indigo" as const, at: V.b4.dotA, quad: 0 },
  { from: { x: 1220, y: AXIS_Y }, to: { x: 1204, y: 854 }, tone: "cyan" as const, at: V.b4.dotB, quad: 3 },
];

const ProcessMatrix = ({ f }: { f: number }) => {
  const m = useMotion();
  const c = usePalette();
  const inkOf = (t: "cyan" | "indigo" | "slate") =>
    t === "cyan" ? c.cyan : t === "indigo" ? c.indigo : c.slate;

  const across = progress(f, V.b4.axis, m.sec(0.6));
  const down = progress(f, V.b5.axis, m.move);
  const travel = progress(f, V.b5.travel, m.move);
  /** ⚠ THE OUTCOME CAPTION HAS TO GO WHEN THE VERTICAL AXIS ARRIVES. It is
   *  centred on x960, which is exactly where that axis lands. */
  const caption = fadeOut(f, V.b5.axis, m.fade);

  return (
    <>
      <Layer>
        <line
          x1={460}
          y1={AXIS_Y}
          x2={460 + 1000 * across}
          y2={AXIS_Y}
          stroke={c.ink}
          strokeWidth={theme.shape.line}
        />
        {down > 0.001 && (
          <line
            x1={MID_X}
            y1={296}
            x2={MID_X}
            y2={296 + 648 * down}
            stroke={c.ink}
            strokeWidth={theme.shape.line}
          />
        )}
      </Layer>

      {/* the two ends of the outcome axis, and later the matrix's side labels */}
      <Chip label="Loss" x={380} y={610} at={V.b4.ends} tone="slate" pill />
      <Chip label="Profit" x={1540} y={610} at={V.b4.ends} tone="slate" pill />
      <div style={{ opacity: caption }}>
        <Chip label="Outcome" x={MID_X} y={560} at={V.b4.caption} tone="indigo" pill />
      </div>

      {f >= V.b5.sides && (
        <>
          <Chip label="Right Process" x={ACTIVE.x} y={456} at={V.b5.sides} anchor="left" tone="cyan" pill />
          <Chip label="Wrong Process" x={ACTIVE.x} y={790} at={V.b5.sides} anchor="left" tone="slate" pill />
        </>
      )}

      {/* ⚠ IN PAIRS, TOP ROW FIRST. Four cards arriving together is a slide;
          two then two is a claim being completed. */}
      {QUADS.map((q, i) => {
        const at = q.y < AXIS_Y ? V.b5.quadTop : V.b5.quadLow;
        const p = progress(f, at, m.sec(0.47));
        if (p <= 0.001) return null;
        const lands = DOTS.some((d) => d.quad === i);
        const lit = lands ? progress(f, V.b5.lit, m.reveal) : 0;
        return (
          <div
            key={q.verdict}
            style={{
              position: "absolute",
              left: q.x,
              top: q.y,
              width: QUAD.w,
              height: QUAD.h,
              boxSizing: "border-box",
              borderRadius: theme.shape.cardRadius,
              background: c.cardBg,
              border: `${theme.shape.hairline + lit}px solid ${
                lit > 0.5 ? inkOf(q.tone) : c.border
              }`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 44,
              gap: m.sec(0.2),
              fontFamily: theme.text.family,
              opacity: p,
            }}
          >
            <span style={{ fontSize: theme.text.axis.size, fontWeight: 500, color: c.slate }}>
              {q.cond}
            </span>
            <span
              style={{
                fontSize: theme.text.body.size,
                fontWeight: theme.text.display.weight,
                color: inkOf(q.tone),
              }}
            >
              {q.verdict}
            </span>
          </div>
        );
      })}

      {/* ⚠ THE SAME TWO NODES THROUGHOUT — they move, they are never replaced.
          Plain circles rather than Ping: a ping pulses, and these are positions,
          not events. */}
      <Layer>
        {DOTS.map((d) => {
          const pop = popIn(f, d.at, m.sec(0.27));
          if (pop.opacity <= 0.001) return null;
          return (
            <circle
              key={d.tone}
              cx={d.from.x + (d.to.x - d.from.x) * travel}
              cy={d.from.y + (d.to.y - d.from.y) * travel}
              r={16 * pop.scale}
              fill={inkOf(d.tone)}
              opacity={pop.opacity}
            />
          );
        })}
      </Layer>
    </>
  );
};
