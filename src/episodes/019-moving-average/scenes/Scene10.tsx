/**
 * SCENE 10 — Walking the band. `from 5366 · dur 633` · Mode A → C at t=15.6
 *
 * ⚠ COMPLIANCE. `Sell?` renders ONLY as a struck misconception, and there is
 * no buy, entry or exit marker anywhere in this scene.
 *
 * The chip is pinned to the touch it was made on and the price runs away from
 * it. The growing distance is the argument — so the chip must not follow.
 */
import { useCurrentFrame } from "remotion";
import { Stage } from "../../../core";
import { ChartFrame, gridOf } from "../components/ChartFrame";
import { BollingerBands } from "../components/BollingerBands";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { Strike } from "../components/Strike";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, bollinger, layoutMode, textReveal, progressInOut, fadeOut } from "../helpers";
import { SERIES_UPTREND, BARS_UPTREND, domainOf } from "../series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  title: sec(0.0),
  chart: sec(0.4),
  sell: sec(4.5),
  strike: sec(11.0),
  walk: sec(13.1),
  modeC: sec(15.6),
  block: sec(16.0),
  blockStrike: sec(17.2),
};
const PERIOD = 20;
// ═══════════════════════════════════════════════════════════════════════════

const BB = bollinger(SERIES_UPTREND, PERIOD, 2);
const DOMAIN = domainOf([...BB.lower, ...BB.upper], BARS_UPTREND);

/** The first bar that closes at or above the upper band — where `Sell?` lands. */
const FIRST_TOUCH = (() => {
  for (let i = PERIOD; i < SERIES_UPTREND.length; i++) {
    const u = BB.upper[i];
    if (u !== null && SERIES_UPTREND[i] >= u - 12) return i;
  }
  return PERIOD + 6;
})();
/**
 * Deliberately NOT at the right-hand end: this scene leaves on a mode change,
 * and a label sitting high on the last bars gets carried into the top-right
 * logo zone on the way out.
 */
const WALK_AT = Math.min(SERIES_UPTREND.length - 20, FIRST_TOUCH + 40);

assertBlocks("Scene10", [{ from: T.block, until: 633 }]);

export const Scene10 = () => {
  const f = useCurrentFrame();
  const box = layoutMode(f, [
    { at: 0, mode: "A" },
    { at: T.modeC, mode: "C" },
  ]);
  const G = gridOf(SERIES_UPTREND, DOMAIN, box);
  const r = textReveal(f, T.sell);

  return (
    <Stage>
      <ChartFrame
        closes={SERIES_UPTREND}
        bars={BARS_UPTREND}
        grid={G}
        mode="candle"
        f={f}
        drawFrom={T.chart}
        drawDur={sec(12)}
        opacity={box.dim}
      />
      <BollingerBands
        mid={BB.mid}
        upper={BB.upper}
        lower={BB.lower}
        grid={G}
        opacity={progressInOut(f, T.chart + sec(1), sec(1.4)) * box.dim}
      />

      <TitleChip
        text="Beginner Trap"
        f={f}
        at={T.title}
        opacity={fadeOut(f, T.modeC)}
      />

      {/* COMPLIANCE: struck misconception, never a statement.
          Fixed at the touch it was made on — the price runs away from it. */}
      {f >= T.sell && f < T.modeC && (
        <div
          style={{
            position: "absolute",
            left: G.x(FIRST_TOUCH),
            top: G.y(BB.upper[FIRST_TOUCH] ?? SERIES_UPTREND[FIRST_TOUCH]) - 34,
            transform: `translate(-50%, -100%) ${r.transform}`,
            opacity: r.opacity * box.dim,
            fontFamily: theme.type.family,
            fontSize: theme.type.labelSm.size,
            fontWeight: theme.type.label.weight,
            color: theme.colors.textMuted,
            whiteSpace: "nowrap",
          }}
        >
          <Strike f={f} at={T.strike}>
            Sell?
          </Strike>
        </div>
      )}

      <LabelChip
        text="Walking the Band"
        x={G.x(WALK_AT)}
        y={G.y(BB.upper[WALK_AT] ?? SERIES_UPTREND[WALK_AT])}
        f={f}
        at={T.walk}
        anchor="above"
        gap={34}
        opacity={box.dim * fadeOut(f, T.modeC)}
      />

      {/* COMPLIANCE: struck misconception, never a statement */}
      <TextBlock
        mode="C"
        localFrame={f}
        from={T.block}
        until={633}
        lines={[
          { text: "UPPER BAND = SELL", size: "h2", color: "muted", struck: T.blockStrike },
          { text: "STRONG TREND CAN STAY NEAR UPPER BAND", size: "h2", color: "indigo" },
          { text: "BAND TOUCH ≠ ENTRY / EXIT", size: "h2", color: "text" },
        ]}
      />
    </Stage>
  );
};
