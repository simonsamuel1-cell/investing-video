/**
 * SC06 — The moving average as support and resistance (from 2882, dur 562).
 *
 * THE POINT IS THAT THE LEVEL MOVES. A horizontal level is a price; this one is
 * a price that changes every day, so the three bounces in the upper panel are
 * annotated with ASCENDING readouts on the right. Without those the picture is
 * just "price touched a line three times" and the word "dinamis" does no work.
 *
 * A 1.5s ghost at the top makes the contrast explicit once — a flat dashed line
 * tagged Statis beside a sloping one tagged Dinamis — and then gets out of the
 * way. It is the shortest way to say what the scene is about.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Layer } from "../components/Stage";
import { Panel } from "../components/Panels";
import { PriceLine } from "../components/PriceLine";
import { CandleChart } from "../components/CandleChart";
import { MovingAverageLine } from "../components/MovingAverageLine";
import { RingPing, CalloutTag } from "../components/Annotations";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { sma, sec, price, fadeOut, textReveal } from "../helpers";
import { seriesGrid } from "../components/plot";
import { PULLBACKS, REJECTIONS, toBars } from "../data/series";
import { CUTS, cutIn, cutPushOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 2882;
const T = { head: sec(0.2), ghost: sec(0.8), upper: sec(3.0), lower: sec(10.0), caption: sec(16.0) };
const PERIOD = 16;
const UPPER = { x: theme.stage.active.x, y: 120, w: theme.stage.active.w, h: 300 };
const LOWER = { x: theme.stage.active.x, y: 444, w: theme.stage.active.w, h: 300 };
/** Which bars the price comes back to the line on — one ping each. */
const TOUCHES = [30, 52, 74];
// ═══════════════════════════════════════════════════════════════════════════

const box = (p: typeof UPPER) => ({ x: p.x + 48, y: p.y + 40, w: p.w - 200, h: p.h - 80 });
const UG = seriesGrid(PULLBACKS, box(UPPER), 0.14);
const LG = seriesGrid(REJECTIONS, box(LOWER), 0.14);
const UMA = sma(PULLBACKS, PERIOD);
const UBARS = toBars(PULLBACKS, 611);
/** The candles are handed the line's own domain, so the two cannot disagree. */
const UDOMAIN: [number, number] = [UG.lo, UG.hi];
const LMA = sma(REJECTIONS, PERIOD);

export const Scene06 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dx = cutIn(g, CUTS.toSupport);
  /** …and it leaves on a dolly, since SC07 closes on one chart. */
  const push = cutPushOut(g, CUTS.toCross, 0.16);
  const blur = Math.max(cutBlur(g, CUTS.toSupport), cutBlur(g, CUTS.toCross));
  const ghost = f >= T.ghost ? fadeOut(f, T.ghost + sec(1.5), 12) : 0;
  const dim = f >= T.caption ? 1 - (1 - 0.55) * textReveal(f, T.caption).opacity : 1;
  const cap = textReveal(f, T.caption);

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${dx}px) scale(${push})`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Chip label="Support & Resistance Dinamis" x={theme.stage.active.x} y={72} tone="indigo" anchor="left" at={T.head} pill />

        {/* said once, in a picture, then out of the way */}
        {ghost > 0.001 && (
          <>
            <Layer opacity={ghost}>
              <line x1={1080} y1={78} x2={1240} y2={78} stroke={theme.color.hairline} strokeWidth={theme.shape.rule} strokeDasharray="8 8" />
              <line x1={1400} y1={94} x2={1560} y2={58} stroke={theme.color.indigo} strokeWidth={theme.shape.line} />
            </Layer>
            <CalloutTag text="Statis" x={1160} y={78} f={f} at={T.ghost} side="below" tone={theme.color.slate} opacity={ghost} />
            <CalloutTag text="Dinamis" x={1480} y={76} f={f} at={T.ghost} side="below" tone={theme.color.indigo} opacity={ghost} />
          </>
        )}

        <div style={{ opacity: dim }}>
          <Panel rect={UPPER} radius={theme.shape.cardRadius}>
            <CandleChart bars={UBARS} box={box(UPPER)} pad={0.14} range={UDOMAIN} axis={false} reveal={f >= T.upper ? Math.min(1, (f - T.upper) / sec(3.5)) : 0} />
            <MovingAverageLine values={UMA} grid={UG} f={f} at={T.upper} over={sec(3.5)} variant="slow" />
            <CalloutTag text="Support" x={UG.x(30)} y={UG.y(UMA[30] ?? PULLBACKS[30]) + 8} f={f} at={T.upper + sec(3)} side="below" />
            {TOUCHES.map((i, k) => {
              const at = T.upper + sec(1.6) + k * sec(1.6);
              const v = UMA[i] ?? PULLBACKS[i];
              return (
                <div key={i}>
                  <RingPing x={UG.x(i)} y={UG.y(v)} f={f} at={at} />
                  {/* ascending readouts — this is what makes the level "moving" */}
                  <CalloutTag
                    text={price(v)}
                    x={UPPER.x + UPPER.w - 158}
                    y={UPPER.y + UPPER.h - 52 - k * 58}
                    f={f}
                    at={at + 6}
                    side="right"
                    tone={theme.color.indigo}
                  />
                </div>
              );
            })}
          </Panel>

          <Panel rect={LOWER} radius={theme.shape.cardRadius}>
            <PriceLine values={REJECTIONS} grid={LG} f={f} at={T.lower} over={sec(3)} />
            <MovingAverageLine values={LMA} grid={LG} f={f} at={T.lower} over={sec(3)} variant="slow" />
            <CalloutTag text="Resistance" x={LG.x(86)} y={LG.y(LMA[86] ?? REJECTIONS[86]) - 8} f={f} at={T.lower + sec(2.6)} side="above" />
            {[38, 66].map((i, k) => (
              <RingPing key={i} x={LG.x(i)} y={LG.y(LMA[i] ?? REJECTIONS[i])} f={f} at={T.lower + sec(1.6) + k * sec(1.8)} />
            ))}
          </Panel>
        </div>

        {f >= T.caption && (
          <div
            style={{
              position: "absolute",
              left: theme.canvas.width / 2,
              top: (UPPER.y + UPPER.h + LOWER.y) / 2 + cap.dy,
              transform: "translate(-50%, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.title.size,
              fontWeight: theme.text.title.weight,
              color: theme.color.ink,
              opacity: cap.opacity,
              whiteSpace: "nowrap",
            }}
          >
            Konsepnya sama — levelnya yang bergerak.
          </div>
        )}
      </div>
    </Stage>
  );
};
