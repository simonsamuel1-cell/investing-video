/**
 * CG-C — Scenes 12A + 12B as ONE spanning Sequence (global 6670 → 8318).
 *
 * NOT OPTIONAL. The reveal mask lifts ACROSS the internal boundary at local 839:
 * the question is asked on one side of it and answered on the other, on the same
 * chart, at the same scales, with no remount and no re-fit. A cut here would let
 * the chart re-frame itself between the question and the answer.
 *
 * [NEEDS DATA] `ggrm.json` ships empty. While `bars.length < 120` this draws the
 * chart frame, the axes and the legend with a visible "Menunggu data" and
 * NOTHING else. Required range is 2026-02-01 → 2026-08-08: SMA100 needs 100
 * sessions of warm-up before the July action, so a July-only export cannot
 * compute it at all. There is deliberately no fallback generator — a synthetic
 * candle labelled GGRM is a fabricated record.
 *
 * ⚠ COMPLIANCE 12A. Nothing directional renders before local frame 839 — no
 * arrow, no target price, no probability, no colour bias. The VO's two
 * questions are NOT put on screen; they are already in the narration.
 *
 * ⚠ COMPLIANCE 12B. The probability line gets no number, bar, gauge or
 * percentage. `Bukan jaminan.` renders at h1 and `Kali ini, sesuai.` at label
 * size, so the caveat carries more weight than the result.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, Layer, CHART } from "../components/ChartFrame";
import { BollingerBands } from "../components/BollingerBands";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { HighlightBox } from "../components/HighlightBox";
import { Ping } from "../components/Ping";
import { RevealMask } from "../components/RevealMask";
import { Countdown } from "../components/Countdown";
import { theme } from "../theme";
import {
  sec,
  sma,
  bollinger,
  progress,
  textReveal,
  fadeOut,
  price,
} from "../helpers";
import { GGRM, READY, CLOSES, PEAK } from "../data/ggrm";
import { CUTS, cutPushIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const GROUP_FROM = 6670;
/** Scene 12B begins here, in the group's own local frames. */
const SC12B = 839;
const T = {
  title: sec(0.2),
  chart: sec(3.0),
  bounce: sec(9.0),
  squeeze: sec(15.0),
  mask: sec(21.0),
  // ── Scene 12B ──
  wipe: SC12B + sec(0.2),
  ticks: SC12B + sec(5.0),
  level: SC12B + sec(11.0),
  honest: SC12B + sec(19.0),
};
const SLOW_P = 100;
const BB_P = 20;
/** Where the mask sits — the last bar 12A lets the viewer see. */
const HIDE_AT = 0.66;
// ═══════════════════════════════════════════════════════════════════════════

const SLOW = READY ? sma(CLOSES, SLOW_P) : [];
const BB = READY
  ? bollinger(CLOSES, BB_P, 2)
  : { mid: [], upper: [], lower: [], width: [] };
const DOMAIN: [number, number] = READY
  ? [
      Math.min(...GGRM.bars.map((b) => b.l)),
      Math.max(...GGRM.bars.map((b) => b.h)),
    ]
  : [0, 1];
const G = gridOf(READY ? CLOSES : [0, 1], DOMAIN, CHART);
/** The pullback low the VO calls the bounce — read from the bars, not chosen. */
const BOUNCE = READY
  ? GGRM.bars.reduce((b, x, i) => (x.l < GGRM.bars[b].l ? i : b), 0)
  : 0;
const HIDE_FROM = READY ? Math.round(GGRM.bars.length * HIDE_AT) : 0;

export const GgrmGroup = () => {
  const f = useCurrentFrame();
  const g = f + GROUP_FROM;
  const push = cutPushIn(g, CUTS.toCase, 0.16);
  const dy = cutOut(g, CUTS.toClose);
  const blur = Math.max(cutBlur(g, CUTS.toCase), cutBlur(g, CUTS.toClose));
  const honest = textReveal(f, T.honest);
  const result = textReveal(f, T.honest + sec(3));
  /** The chart steps back for the honesty beat and stays as a backdrop. */
  const back = f >= T.honest ? 1 - progress(f, T.honest, sec(1)) * 0.5 : 1;

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px) scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <div style={{ opacity: back }}>
          {READY ? (
            <>
              <ChartFrame
                closes={CLOSES}
                bars={GGRM.bars}
                grid={G}
                mode="candle"
                f={f}
                drawFrom={T.chart}
                drawDur={sec(5)}
                tickLabels={false}
              />
              <BollingerBands
                mid={BB.mid}
                upper={BB.upper}
                lower={BB.lower}
                grid={G}
                midTone={theme.color.indigo70}
                opacity={progress(f, T.chart + sec(1), sec(2))}
              />
              <MALine
                values={SLOW}
                grid={G}
                f={f}
                drawFrom={T.chart}
                drawDur={sec(4)}
                variant="slow"
              />
            </>
          ) : (
            <>
              <ChartFrame
                closes={[0, 1]}
                grid={G}
                mode="line"
                f={f}
                drawFrom={1e9}
                drawDur={1}
                tickLabels={false}
              />
              {/* the placeholder yields the frame to the countdown and to the
                closing lines — otherwise three texts stack on one another */}
              {f < T.mask && f < T.honest && (
                <div
                  style={{
                    position: "absolute",
                    left: CHART.x + CHART.w / 2,
                    top: CHART.y + CHART.h / 2,
                    transform: "translate(-50%, -50%)",
                    fontFamily: theme.text.family,
                    fontSize: theme.text.h2.size,
                    fontWeight: theme.text.h2.weight,
                    color: theme.color.faint,
                  }}
                >
                  Menunggu data
                </div>
              )}
            </>
          )}

          {/* the bounce off the rising SMA100 — the VO's "garis ungu" */}
          {READY && (
            <Ping
              x={G.x(BOUNCE)}
              y={G.y(CLOSES[BOUNCE])}
              f={f}
              at={T.bounce}
              r={38}
            />
          )}

          {/* the squeeze, boxed */}
          {READY && (
            <HighlightBox
              x1={G.x(HIDE_FROM - 22)}
              x2={G.x(HIDE_FROM)}
              y1={CHART.y + 30}
              y2={CHART.y + CHART.h - 30}
              f={f}
              at={T.squeeze}
            />
          )}

          {/* the level the VO names — read out of the data, never typed */}
          {READY && PEAK !== null && f >= T.level && (
            <Layer opacity={progress(f, T.level, 14)}>
              <line
                x1={CHART.x}
                y1={G.y(PEAK)}
                x2={CHART.x + CHART.w}
                y2={G.y(PEAK)}
                stroke={theme.color.indigo}
                strokeWidth={theme.shape.band}
              />
            </Layer>
          )}

          {/* the future, genuinely hidden — solid fill, not a scrim */}
          {READY && f >= T.mask && (
            <RevealMask
              x={G.x(HIDE_FROM)}
              f={f}
              wipeFrom={T.wipe}
              wipeDur={150}
            />
          )}
        </div>

        {f >= T.mask && f < SC12B && (
          <Countdown
            x={(G.x(HIDE_FROM) + CHART.x + CHART.w) / 2}
            y={CHART.y + CHART.h / 2}
            f={f}
            at={T.mask}
          />
        )}

        <TitleChip
          text="Kuis"
          f={f}
          at={T.title}
          opacity={f >= T.honest ? fadeOut(f, T.honest, 14) : 1}
        />

        {/* the ticker, and then one label at a time on the chart */}
        <LabelChip
          text={`${GGRM.ticker} · Daily`}
          x={theme.stage.titleChip.x}
          y={CHART.y - 22}
          f={f}
          at={T.title + 8}
          anchor="right"
          tone={theme.color.textMuted}
          size={theme.text.labelSm.size}
          weight={theme.text.labelSm.weight}
          opacity={f >= T.honest ? fadeOut(f, T.honest, 14) : 1}
        />
        {READY && (
          <>
            <LabelChip
              text={f >= T.ticks ? "Bounce  ✓" : "Bounce"}
              x={G.x(BOUNCE)}
              y={G.y(CLOSES[BOUNCE])}
              f={f}
              at={T.bounce + 10}
              anchor="below"
              opacity={
                f >= T.squeeze
                  ? f >= T.ticks
                    ? 1
                    : fadeOut(f, T.squeeze, 14)
                  : 1
              }
            />
            <LabelChip
              text={f >= T.ticks ? "Squeeze  ✓" : "Squeeze"}
              x={G.x(HIDE_FROM - 11)}
              y={CHART.y + 40}
              f={f}
              at={T.squeeze + 10}
              anchor="below"
              opacity={f >= T.mask && f < T.ticks ? fadeOut(f, T.mask, 14) : 1}
            />
            {PEAK !== null && (
              <LabelChip
                text={price(PEAK)}
                x={CHART.x + CHART.w}
                y={G.y(PEAK)}
                f={f}
                at={T.level + 10}
                anchor="left"
                opacity={f >= T.honest ? fadeOut(f, T.honest, 14) : 1}
              />
            )}
          </>
        )}

        {/* the honesty beat — two plain lines, the caveat set larger */}
        {f >= T.honest && (
          <>
            <div
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: 430 + honest.dy,
                transform: "translate(-50%, -50%)",
                fontFamily: theme.text.family,
                fontSize: theme.text.h1.size,
                fontWeight: theme.text.h1.weight,
                color: theme.color.ink,
                opacity: honest.opacity,
              }}
            >
              Bukan jaminan.
            </div>
            <div
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: 540 + result.dy,
                transform: "translate(-50%, -50%)",
                fontFamily: theme.text.family,
                fontSize: theme.text.label.size,
                fontWeight: theme.text.label.weight,
                color: theme.color.textMuted,
                opacity: result.opacity,
              }}
            >
              Kali ini, sesuai.
            </div>
          </>
        )}
      </div>
    </SafeArea>
  );
};
