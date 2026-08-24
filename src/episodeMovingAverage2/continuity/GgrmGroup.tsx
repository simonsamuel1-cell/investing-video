/**
 * CG-C — Scenes 12A + 12B as ONE spanning Sequence (global 6645 → 8271).
 *
 * MUST be one Sequence. The reveal mask lifts ACROSS the internal boundary —
 * the question is asked on one side of it and answered on the other, same
 * chart, same scales, no re-fit. A cut here destroys the quiz payoff.
 *
 * [NEEDS DATA] `ggrm.json` ships with `bars: []`. Required range is
 * 2026-02-01 → 2026-08-08: the February start is mandatory because SMA100
 * needs 100 sessions of warm-up before the July action, so a July-only export
 * cannot compute the line the voice-over calls "garis ungu" at all.
 *
 * THE GUARD IS THE POINT. Below 120 bars this renders the frame, the axes and
 * the legend with a visible placeholder and NOTHING else. It does not fall
 * back to the synthetic generator: every other series here illustrates a
 * mechanic, but this one is named, dated and priced, and a generated candle
 * labelled GGRM is a fabricated record.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, Layer } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { BollingerBands } from "../components/BollingerBands";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { HighlightBox } from "../components/HighlightBox";
import { Ping } from "../components/Ping";
import { RevealMask } from "../components/RevealMask";
import { Countdown } from "../components/Countdown";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, sma, bollinger, layoutMode, fmtRp, progress } from "../helpers";
import raw from "../data/ggrm.json";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Scene 12B begins here, in the group's own local frames. */
const SC12B = 858;
const T = {
  title: sec(0.0),
  chart: sec(1.6),
  bounce: sec(6.4),
  squeeze: sec(12.2),
  modeB: sec(17.9),
  q1: sec(17.9),
  q2: sec(21.2),
  mask: sec(24.6),
  // ── Scene 12B ──
  wipe: SC12B + sec(0.0),
  level: SC12B + sec(8.6),
  modeB2: SC12B + sec(14.1),
  trend: SC12B + sec(14.3),
  vol: SC12B + sec(17.7),
  modeC: SC12B + sec(21.8),
  combine: SC12B + sec(22.0),
};
const SLOW_P = 100;
const BB_P = 20;
/** Where the mask sits — the last bar 12A lets the viewer see. */
const HIDE_AT = 0.66;
const MIN_BARS = 120;
// ═══════════════════════════════════════════════════════════════════════════

type GgrmBar = { date: string; o: number; h: number; l: number; c: number; v: number };
const GGRM = raw as { ticker: string; name: string; bars: GgrmBar[] };

/** False until Simon's export lands. Every consumer branches on this. */
const READY = GGRM.bars.length >= MIN_BARS;
const CLOSES = GGRM.bars.map((b) => b.c);
const SLOW = READY ? sma(CLOSES, SLOW_P) : [];
const BB = READY ? bollinger(CLOSES, BB_P, 2) : { mid: [], upper: [], lower: [] };
const DOMAIN: [number, number] = READY
  ? [Math.min(...GGRM.bars.map((b) => b.l)), Math.max(...GGRM.bars.map((b) => b.h))]
  : [0, 1];
/** The level the VO names — read OUT of the data, never typed as a string. */
const PEAK = READY ? Math.max(...GGRM.bars.map((b) => b.h)) : null;
/** The pullback low the VO calls the bounce — read from the bars, not chosen. */
const BOUNCE = READY ? GGRM.bars.reduce((b, x, i) => (x.l < GGRM.bars[b].l ? i : b), 0) : 0;
const HIDE_FROM = READY ? Math.round(GGRM.bars.length * HIDE_AT) : 0;

assertBlocks("GgrmGroup", [
  { from: T.bounce, until: T.squeeze },
  { from: T.squeeze, until: T.modeB },
  { from: T.q1, until: T.q2 },
  { from: T.q2, until: T.mask },
  { from: T.trend, until: T.vol },
  { from: T.vol, until: T.modeC },
  { from: T.combine, until: 1626 },
]);

export const GgrmGroup = () => {
  const f = useCurrentFrame();
  const box = layoutMode(f, [
    { at: 0, mode: "A" },
    { at: T.modeB, mode: "B" },
    { at: T.modeC, mode: "C" },
  ]);
  const G = gridOf(READY ? CLOSES : [0, 1], DOMAIN, box);

  return (
    <SafeArea>
      <ChartFrame
        closes={READY ? CLOSES : [0, 1]}
        bars={READY ? GGRM.bars : []}
        grid={G}
        mode={READY ? "candle" : "line"}
        f={f}
        drawFrom={READY ? T.chart : 1e9}
        drawDur={sec(3.2)}
        opacity={box.dim}
      />

      {READY && (
        <>
          {/* midTone steps back a tint: a solid indigo SMA100 is on screen at
              the same time and the VO's "garis ungu" must stay unambiguous */}
          <BollingerBands
            mid={BB.mid}
            upper={BB.upper}
            lower={BB.lower}
            grid={G}
            midTone={theme.colors.indigo70}
            opacity={progress(f, T.chart + sec(1), sec(2)) * box.dim}
          />
          <MALine
            values={SLOW}
            grid={G}
            f={f}
            drawFrom={T.chart}
            drawDur={sec(3.2)}
            variant="slow"
            opacity={box.dim}
          />
          <Ping x={G.x(BOUNCE)} y={G.y(CLOSES[BOUNCE])} f={f} at={T.bounce} r={38} />
          <HighlightBox
            x1={G.x(Math.max(0, HIDE_FROM - 22))}
            x2={G.x(HIDE_FROM)}
            y1={box.y + 30}
            y2={box.y + box.h - 30}
            f={f}
            at={T.squeeze}
            opacity={box.dim}
          />
          {PEAK !== null && f >= T.level && (
            <Layer opacity={progress(f, T.level, 14) * box.dim}>
              <line
                x1={box.x}
                y1={G.y(PEAK)}
                x2={box.x + box.w}
                y2={G.y(PEAK)}
                stroke={theme.colors.indigo}
                strokeWidth={theme.layout.stroke.band}
              />
            </Layer>
          )}
          {PEAK !== null && (
            <LabelChip
              text={fmtRp(PEAK)}
              x={box.x + box.w}
              y={G.y(PEAK)}
              f={f}
              at={T.level + 10}
              anchor="left"
              opacity={box.dim}
            />
          )}
          {/* the future, genuinely hidden — solid fill, never a scrim */}
          {f >= T.mask && (
            <RevealMask
              x={G.x(HIDE_FROM)}
              f={f}
              wipeFrom={T.wipe}
              wipeDur={66}
              box={box}
            />
          )}
        </>
      )}

      {!READY && (
        <div
          style={{
            position: "absolute",
            left: box.x + box.w / 2,
            top: box.y + box.h / 2,
            transform: "translate(-50%, -50%)",
            fontFamily: theme.type.family,
            fontSize: theme.type.labelSm.size,
            fontWeight: theme.type.labelSm.weight,
            color: theme.colors.textMuted,
          }}
        >
          Menunggu data
        </div>
      )}

      {f >= T.mask && f < SC12B && (
        <Countdown
          x={(G.x(HIDE_FROM) + box.x + box.w) / 2}
          y={box.y + box.h / 2}
          f={f}
          at={T.mask}
        />
      )}

      <TitleChip text="Kuis" f={f} at={T.title} opacity={f >= SC12B ? 0 : 1} />
      <LabelChip
        text={`${GGRM.ticker} · Daily`}
        x={theme.layout.titleChip.x}
        y={box.y - 22}
        f={f}
        at={T.title + 8}
        anchor="right"
        tone={theme.colors.textMuted}
      />

      <TextBlock
        mode="A"
        localFrame={f}
        from={T.bounce}
        until={T.squeeze}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 100}
        lines={[
          { text: "RISING SMA100", size: "h2", color: "indigo" },
          { text: "↓", size: "label", color: "muted" },
          { text: "PRICE BOUNCES ✓", size: "h2", color: "text" },
          { text: "DYNAMIC SUPPORT HOLDS", size: "label", color: "muted" },
        ]}
      />
      <TextBlock
        mode="A"
        localFrame={f}
        from={T.squeeze}
        until={T.modeB}
        x={theme.layout.panelB.x}
        y={theme.layout.chartA.y + 100}
        lines={[
          { text: "BAND WIDTH ↓ → SQUEEZE", size: "h2", color: "indigo" },
          { text: "PRICE > MIDDLE BAND", size: "label", color: "muted" },
        ]}
      />

      <TextBlock
        mode="B"
        localFrame={f}
        from={T.q1}
        until={T.q2}
        lines={[
          { text: "1. IS THE UPTREND\n     STILL INTACT?", size: "h2", color: "indigo" },
          { text: "YES / NO", size: "label", color: "muted" },
        ]}
      />
      {/* COMPLIANCE: struck misconception, never a statement — and struck
          BEFORE the countdown, so the wrong answer is cancelled without the
          outcome being revealed. Nothing directional renders before 12B. */}
      <TextBlock
        mode="B"
        localFrame={f}
        from={T.q2}
        until={T.mask}
        lines={[
          { text: "2. WHAT DOES THE\n     SQUEEZE TELL US?", size: "h2", color: "indigo" },
          { text: "A. BIGGER MOVE MAY COME", size: "labelSm", color: "text" },
          { text: "B. PRICE MUST GO UP", size: "labelSm", color: "muted", struck: T.q2 + sec(2.4) },
        ]}
      />

      {/* ── Scene 12B ── the two clues return separately, then combine */}
      <TextBlock
        mode="B"
        localFrame={f}
        from={T.trend}
        until={T.vol}
        lines={[
          { text: "TREND CONTEXT", size: "h2", color: "indigo" },
          { text: "Rising MA + Support Holds", size: "labelSm", color: "muted" },
          { text: "↓", size: "label", color: "muted" },
          { text: "Bullish Bias ↑", size: "h2", color: "text" },
        ]}
      />
      <TextBlock
        mode="B"
        localFrame={f}
        from={T.vol}
        until={T.modeC}
        lines={[
          { text: "VOLATILITY CONTEXT", size: "h2", color: "cyan" },
          { text: "Bollinger Squeeze", size: "labelSm", color: "muted" },
          { text: "↓", size: "label", color: "muted" },
          { text: "Big Move May Come ↕", size: "h2", color: "text" },
        ]}
      />
      {/* COMPLIANCE — highest risk in the episode. The voice-over no longer
          says "bukan jaminan", so `Confirmation, Not Certainty` is the ONLY
          caveat left in the whole video. It mounts at T.combine and the group
          runs to 1626, which holds it far past the required 60 frames, at
          labelSm. Do not shorten this block. */}
      <TextBlock
        mode="C"
        localFrame={f}
        from={T.combine}
        until={1626}
        lines={[
          { text: "TREND GAVE THE BIAS", size: "h2", color: "indigo" },
          { text: "SQUEEZE GAVE THE SETUP", size: "h2", color: "cyan" },
          { text: "RESULT: BREAKOUT ↑", size: "h2", color: "text" },
          { text: "Confirmation, Not Certainty", size: "labelSm", color: "muted" },
        ]}
      />
    </SafeArea>
  );
};
