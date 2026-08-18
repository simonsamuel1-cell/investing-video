/**
 * SC04 — SMA vs EMA (from 1839, dur 467).
 *
 * ONE GRAPHIC CARRIES THE WHOLE DISTINCTION: ten weight bars under each card.
 * Flat identical bars mean every day counts the same; a ramp means the recent
 * days count more. There is no metaphor on top of it, because the metaphor
 * would be doing work the bars already do.
 *
 * BOTH CARDS PLOT THE SAME ARRAY. `WEIGHTS` is imported once and handed to both
 * sides, so the only difference on screen is the averaging method. Two series
 * that merely looked alike would make the comparison decorative.
 *
 * The VO says EMA weights the recent price more heavily — that is the corrected
 * SRT's wording and the script's. An earlier transcript had "SMA" there; if the
 * recording turns out to say SMA, this scene's two cards are inverted and it is
 * a re-record, not a code fix.
 */
import { useCurrentFrame } from "remotion";
import { Stage } from "../components/Stage";
import { Panel, WeightBars } from "../components/Panels";
import { PriceLine } from "../components/PriceLine";
import { MovingAverageLine } from "../components/MovingAverageLine";
import { CalloutTag, MeasureCaliper, RingPing } from "../components/Annotations";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { sma, ema, sec, textReveal } from "../helpers";
import { seriesGrid } from "../components/plot";
import { WEIGHTS } from "../data/series";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 1839;
const T = {
  cards: sec(0.2),
  bars: sec(3.5),
  lines: sec(8.0),
  strip: sec(11.5),
  ping: sec(12.6),
};
const CARD_W = 852;
const GAP = 24;
const CARDS = [
  { x: theme.stage.active.x, title: "SMA", tag: "Bobot sama", ramp: false },
  { x: theme.stage.active.x + CARD_W + GAP, title: "EMA", tag: "Bobot terbaru lebih besar", ramp: true },
];
const CARD = { y: 90, h: 530 };
const PLOT = { y: 170, h: 190 };
const BARS = { y: 400, h: 150 };
const STRIP = { y: 640, h: 90 };
const PERIOD = 12;
// ═══════════════════════════════════════════════════════════════════════════

/** Same array, both cards. The averaging method is the only variable. */
const SMA_V = sma(WEIGHTS, PERIOD);
const EMA_V = ema(WEIGHTS, PERIOD);
/**
 * Where each line turns after the series' own swing — the EMA gets there
 * first, and the caliper between the two is what "bereaksi cepat" means.
 */
const turnOf = (v: (number | null)[], from: number) => {
  let best = from;
  for (let i = from; i < v.length - 1; i++) {
    const a = v[i];
    const b = v[i + 1];
    if (a !== null && b !== null && b < a) return i;
    best = i;
  }
  return best;
};
const SWING = Math.round(WEIGHTS.length * 0.45);
const TURN = { ema: turnOf(EMA_V, SWING), sma: turnOf(SMA_V, SWING) };

export const Scene04 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dy = cutIn(g, CUTS.toTypes) === 0 ? cutOut(g, CUTS.toReading) : 0;
  const dx = cutIn(g, CUTS.toTypes);
  const blur = Math.max(cutBlur(g, CUTS.toTypes), cutBlur(g, CUTS.toReading));
  const strip = textReveal(f, T.strip);

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${dx}px, ${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        {CARDS.map((c, i) => {
          const box = { x: c.x + 60, y: PLOT.y, w: CARD_W - 120, h: PLOT.h };
          const grid = seriesGrid(WEIGHTS, box, 0.14);
          const values = c.ramp ? EMA_V : SMA_V;
          const head = textReveal(f, T.cards + i * 6);
          return (
            <Panel key={c.title} rect={{ x: c.x, y: CARD.y, w: CARD_W, h: CARD.h }} opacity={head.opacity} radius={theme.shape.cardRadius}>
              <div
                style={{
                  position: "absolute",
                  left: c.x + 40,
                  top: CARD.y + 44 + head.dy,
                  fontFamily: theme.text.family,
                  fontSize: theme.text.title.size,
                  fontWeight: theme.text.title.weight,
                  color: theme.color.ink,
                  opacity: head.opacity,
                }}
              >
                {c.title}
              </div>

              <PriceLine values={WEIGHTS} grid={grid} f={f} at={T.bars} over={sec(2)} opacity={0.4} />
              <MovingAverageLine
                values={values}
                grid={grid}
                f={f}
                at={T.lines}
                over={sec(3)}
                variant={c.ramp ? "fast" : "slow"}
              />

              <WeightBars rect={{ x: c.x + 60, y: BARS.y, w: CARD_W - 120, h: BARS.h }} ramp={c.ramp} f={f} at={T.bars + i * 6} />
              <CalloutTag text={c.tag} x={c.x + CARD_W / 2} y={BARS.y + BARS.h + 42} f={f} at={T.bars + sec(1.2)} side="below" tone={c.ramp ? theme.color.indigo : theme.color.slate} />

              {/* the EMA turns first, and it also turns back — false signal */}
              {c.ramp && (
                <>
                  <RingPing x={grid.x(TURN.ema)} y={grid.y(EMA_V[TURN.ema] ?? WEIGHTS[TURN.ema])} f={f} at={T.ping} r={22} />
                  <RingPing x={grid.x(TURN.ema + 6)} y={grid.y(EMA_V[TURN.ema + 6] ?? WEIGHTS[TURN.ema + 6])} f={f} at={T.ping + 14} r={22} />
                  <CalloutTag text="False signal" x={grid.x(TURN.ema + 3)} y={grid.y(EMA_V[TURN.ema] ?? WEIGHTS[TURN.ema]) - 8} f={f} at={T.ping + 6} side="above" />
                </>
              )}

              {/* how far apart the two turns are — the whole of "cepat" */}
              {!c.ramp && (
                <MeasureCaliper
                  from={{ x: grid.x(TURN.ema), y: PLOT.y + PLOT.h + 12 }}
                  to={{ x: grid.x(TURN.sma), y: PLOT.y + PLOT.h + 12 }}
                  label="Δ"
                  f={f}
                  at={T.lines + sec(2)}
                  orientation="horizontal"
                />
              )}
            </Panel>
          );
        })}

        {/* no red anywhere: this is a caveat, not an alarm */}
        {f >= T.strip && (
          <Panel
            rect={{ x: theme.stage.active.x, y: STRIP.y + strip.dy, w: theme.stage.active.w, h: STRIP.h }}
            opacity={strip.opacity}
          >
            <div
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: STRIP.y + STRIP.h / 2 + strip.dy,
                transform: "translate(-50%, -50%)",
                fontFamily: theme.text.family,
                fontSize: theme.text.title.size,
                fontWeight: theme.text.title.weight,
                color: theme.color.ink,
                opacity: strip.opacity,
              }}
            >
              Cepat ≠ lebih baik.
            </div>
          </Panel>
        )}

        <Chip label="Dua jenis moving average" x={theme.stage.active.x} y={54} tone="slate" anchor="left" at={T.cards} />
      </div>
    </Stage>
  );
};
