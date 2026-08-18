/**
 * SC05 — Reading position and slope (from 2306, dur 576).
 *
 * TWO THINGS ARE READ, and the scene says so before it shows anything: where
 * price sits relative to the line, and which way the line is going. Three
 * panels then work through the three cases in the order the VO gives them.
 *
 * Every pill sits INSIDE its own panel. A status pill floating between two
 * panels belongs to neither, and the viewer has to guess.
 */
import { useCurrentFrame } from "remotion";
import { Stage } from "../components/Stage";
import { Panel, StrengthMeter } from "../components/Panels";
import { PriceLine } from "../components/PriceLine";
import { MovingAverageLine } from "../components/MovingAverageLine";
import { SlopeGuide } from "../components/Annotations";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { sma, sec, textReveal } from "../helpers";
import { seriesGrid } from "../components/plot";
import { RISING, FALLING, FLAT } from "../data/series";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 2306;
const T = { head: sec(0.2), a: sec(2.5), b: sec(8.0), c: sec(12.0), meter: sec(16.0) };
const PERIOD = 14;
const PANEL_W = 560;
const GAP = 24;
const PANEL = { y: 180, h: 440 };
const PLOT = { y: 250, h: 250 };
/** 560 x 3 + 24 x 2 = 1728 — the active width exactly. */
const PANELS = [0, 1, 2].map((i) => ({ x: theme.stage.active.x + i * (PANEL_W + GAP) }));
const CASES = [
  { series: RISING, status: "Trend Naik", marker: "Harga > MA", at: () => T.a, filled: 3 as const },
  { series: FALLING, status: "Trend Turun", marker: "Harga < MA", at: () => T.b, filled: 3 as const },
  { series: FLAT, status: "Belum Ada Arah", marker: "Harga ≈ MA", at: () => T.c, filled: 1 as const },
];
// ═══════════════════════════════════════════════════════════════════════════

export const Scene05 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dy = cutIn(g, CUTS.toReading);
  const dx = cutOut(g, CUTS.toSupport);
  const blur = Math.max(cutBlur(g, CUTS.toReading), cutBlur(g, CUTS.toSupport));
  const head = textReveal(f, T.head);

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
        <div
          style={{
            position: "absolute",
            left: theme.stage.active.x,
            top: 76 + head.dy,
            transform: "translateY(-50%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.h1.size,
            fontWeight: theme.text.h1.weight,
            color: theme.color.ink,
            opacity: head.opacity,
          }}
        >
          Dua hal yang dibaca
        </div>
        <Chip label="1  Posisi harga" x={theme.stage.active.x} y={160} tone="indigo" anchor="left" at={T.head + 8} pill />
        <Chip label="2  Arah garis" x={theme.stage.active.x + 340} y={160} tone="cyan" anchor="left" at={T.head + 14} pill />

        {CASES.map((c, i) => {
          const at = c.at();
          const box = { x: PANELS[i].x + 44, y: PLOT.y, w: PANEL_W - 88, h: PLOT.h };
          const grid = seriesGrid(c.series, box, 0.16);
          const ma = sma(c.series, PERIOD);
          const p = textReveal(f, at);
          const first = ma.findIndex((v) => v !== null);
          const last = ma.length - 1;
          return (
            <Panel key={c.status} rect={{ x: PANELS[i].x, y: PANEL.y, w: PANEL_W, h: PANEL.h }} opacity={p.opacity} radius={theme.shape.cardRadius}>
              <PriceLine values={c.series} grid={grid} f={f} at={at} over={sec(1.8)} />
              <MovingAverageLine values={ma} grid={grid} f={f} at={at + sec(0.6)} over={sec(1.8)} variant="slow" />

              {/* the slope, drawn along the line's own last stretch */}
              {f >= T.meter && (
                <SlopeGuide
                  a={{ x: grid.x(Math.round(last * 0.55)), y: grid.y(ma[Math.round(last * 0.55)] ?? c.series[Math.round(last * 0.55)]) }}
                  b={{ x: grid.x(last), y: grid.y(ma[last] ?? c.series[last]) }}
                  f={f}
                  at={T.meter + i * 6}
                  tone={theme.color.cyan}
                />
              )}

              <Chip label={c.marker} x={PANELS[i].x + PANEL_W / 2} y={PLOT.y - 34} tone="slate" at={at + sec(1.2)} />
              <Chip label={c.status} x={PANELS[i].x + PANEL_W / 2} y={PANEL.y + PANEL.h - 56} tone={i === 2 ? "slate" : "indigo"} at={at + sec(1.6)} pill />

              <StrengthMeter
                rect={{ x: PANELS[i].x + 44, y: PANEL.y + PANEL.h - 112, w: PANEL_W - 88, h: 16 }}
                filled={c.filled}
                f={f}
                at={T.meter + i * 8}
              />
              {/* `first` is only used to prove the MA has warmed up before it draws */}
              {first < 0 && null}
            </Panel>
          );
        })}

        <Chip label="Semakin curam, semakin kuat" x={theme.canvas.width / 2} y={676} tone="indigo" at={T.meter + sec(1.4)} />
      </div>
    </Stage>
  );
};
