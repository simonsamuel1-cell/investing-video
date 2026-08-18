/**
 * CG-B — Scenes 08 + 09 as ONE spanning Sequence (global 4134 → 5439).
 *
 * The chart and the bands mount once and persist. The bands keep breathing
 * across the internal boundary at local 604, which is the whole reason this is
 * a group: Scene 09's squeeze is a stretch of the same breathing Scene 08 just
 * demonstrated, and a remount would present it as a different chart that
 * happens to look similar.
 *
 * NO CALIPER, NO WIDTH READOUT, NO SUB-PANEL. The bands opening and closing is
 * legible on its own; a measurement under it would be a second graphic
 * explaining the first.
 *
 * ⚠ COMPLIANCE (Scene 09, local 14–19s). The two direction arrows come from ONE
 * `Arrow` call rendered twice, the second with `mirror`, which flips the
 * vertical component about the same origin. They cannot differ in opacity,
 * stroke or length because there is only one set of numbers. Any asymmetry
 * would turn a volatility explainer into a directional call.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf, CHART } from "../components/ChartFrame";
import { BollingerBands } from "../components/BollingerBands";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { HighlightBox } from "../components/HighlightBox";
import { Arrow } from "../components/Arrow";
import { theme } from "../theme";
import { sec, bollinger, progressInOut, fadeOut, textReveal, clamp01 } from "../helpers";
import { SERIES_BREATH, BARS_BREATH, domainOf } from "../series";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const GROUP_FROM = 4134;
/** Scene 09 begins here, in the group's own local frames. */
const SC09 = 604;
const T = {
  title: sec(0.2),
  price: sec(0.6),
  mid: sec(3.0),
  bands: sec(7.0),
  // ── Scene 09 ──
  squeeze: SC09 + sec(0.4),
  hold: SC09 + sec(8.0),
  ask: SC09 + sec(14.0),
  resolve: SC09 + sec(19.0),
};
const PERIOD = 20;
const TICKS = [4600, 5000, 5400, 5800];
/** The long tight stretch in SERIES_BREATH — what Scene 09 calls the squeeze. */
const SQUEEZE = { from: 80, to: 118 };
/** The two mirrored arrows: ONE set of numbers, drawn twice. */
const ASK = { run: 230, rise: 130 };
/** Room on the right for the price axis, so no label lands on the data. */
const AXIS_GUTTER = 150;
// ═══════════════════════════════════════════════════════════════════════════

const BB = bollinger(SERIES_BREATH, PERIOD, 2);
const DOMAIN = domainOf(BARS_BREATH, [BB.lower, BB.upper]);
const G = gridOf(SERIES_BREATH, DOMAIN, CHART, 0.12, AXIS_GUTTER);
const MID_X = Math.round((SQUEEZE.from + SQUEEZE.to) / 2);

export const BandsGroup = () => {
  const f = useCurrentFrame();
  const g = f + GROUP_FROM;
  const dy = cutIn(g, CUTS.toBands);
  const dx = cutOut(g, CUTS.toTrap);
  const blur = Math.max(cutBlur(g, CUTS.toBands), cutBlur(g, CUTS.toTrap));

  const unfold = f >= T.bands ? progressInOut(f, T.bands, sec(4)) : 0;
  const asking = f >= T.ask ? progressInOut(f, T.ask, sec(1)) * (f >= T.resolve ? fadeOut(f, T.resolve, sec(1)) : 1) : 0;
  const ask = textReveal(f, T.ask);
  /** The chart steps back a little while the question owns the frame. */
  const back = 1 - 0.35 * clamp01(asking);

  /** Centred on the squeeze, above the band it is asking about. */
  const askAt = { x: G.x(MID_X), y: CHART.y + 96 };

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${dx}px, ${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <div style={{ opacity: back }}>
          <ChartFrame
            closes={SERIES_BREATH}
            bars={BARS_BREATH}
            grid={G}
            f={f}
            drawFrom={T.price}
            drawDur={sec(2.4)}
            ticks={TICKS}
            opacity={0.5}
          />
          {f >= T.mid && (
            <BollingerBands
              mid={BB.mid}
              upper={BB.upper}
              lower={BB.lower}
              grid={G}
              unfold={unfold}
              opacity={progressInOut(f, T.mid, sec(1.4))}
            />
          )}
        </div>

        {/* the squeeze, boxed on the chart it happens on, breathing gently */}
        <HighlightBox
          x1={G.x(SQUEEZE.from)}
          x2={G.x(SQUEEZE.to)}
          y1={CHART.y + 30}
          y2={CHART.y + CHART.h - 30}
          f={f}
          at={T.squeeze}
          pulse
          opacity={back}
        />

        {/* ⚠ ONE arrow, drawn twice — the second is the sign-flipped mirror */}
        {asking > 0.001 &&
          [false, true].map((mirror) => (
            <Arrow
              key={String(mirror)}
              from={{ x: askAt.x + 96, y: askAt.y }}
              to={{ x: askAt.x + 96 + ASK.run, y: askAt.y - ASK.rise }}
              mirror={mirror}
              f={f}
              at={T.ask}
              opacity={asking * 0.4}
            />
          ))}

        {/* the question itself — a single glyph, so the count stays at two */}
        {asking > 0.001 && (
          <div
            style={{
              position: "absolute",
              left: askAt.x - 110,
              top: askAt.y + ask.dy,
              transform: "translate(-50%, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.display.size,
              fontWeight: theme.text.display.weight,
              color: theme.color.indigo,
              opacity: asking,
            }}
          >
            ?
          </div>
        )}

        <TitleChip
          text={f >= SC09 ? "Squeeze" : "Bollinger Bands"}
          f={f}
          at={f >= SC09 ? SC09 : T.title}
        />

        {/* one label at a time, and never at the same moment as another */}
        <LabelChip
          text="Middle = Moving Average"
          x={G.x(30)}
          y={G.y(BB.mid[30] ?? SERIES_BREATH[30])}
          f={f}
          at={T.mid + sec(1)}
          anchor="above"
          opacity={f >= T.bands ? fadeOut(f, T.bands, 14) : 1}
        />
        <LabelChip
          text="Volatility"
          x={G.x(56)}
          y={G.y(BB.upper[56] ?? SERIES_BREATH[56])}
          f={f}
          at={T.bands + sec(2)}
          anchor="above"
          tone={theme.color.cyan}
          opacity={f >= SC09 ? fadeOut(f, SC09 - sec(1), 14) : 1}
        />
        <LabelChip
          text="Squeeze"
          x={G.x(MID_X)}
          y={CHART.y + 40}
          f={f}
          at={T.squeeze + sec(1)}
          anchor="below"
          opacity={f >= T.ask ? fadeOut(f, T.ask, 14) : 1}
        />
      </div>
    </SafeArea>
  );
};
