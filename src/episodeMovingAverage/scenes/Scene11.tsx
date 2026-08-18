/**
 * SC11 — Where indicators sit in your process (from 6034, dur 636).
 *
 * THE STACK BUILDS BOTTOM-UP, and the foundation is built first and alone: your
 * own analysis exists before any indicator is added to it. Building downward
 * from the tools, or revealing all three at once, would say the opposite.
 *
 * "Analisismu sendiri" is shown as an ACTUAL CHART on the right — a trend line
 * and two marked levels, drawn by hand-ish — not as the word in a box. A word
 * in a box would make the foundation the most abstract thing on screen, when it
 * is meant to be the most concrete.
 */
import { useCurrentFrame } from "remotion";
import { Stage } from "../components/Stage";
import { Panel, LayerStack } from "../components/Panels";
import { PriceLine } from "../components/PriceLine";
import { Chip } from "../components/Chip";
import { Layer } from "../components/Stage";
import { theme } from "../theme";
import { sec, progress, textReveal, clamp01 } from "../helpers";
import { seriesGrid } from "../components/plot";
import { PULLBACKS } from "../data/series";
import { CUTS, cutIn, cutPushOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 6034;
const T = {
  head: sec(0.2),
  base: sec(3.0),
  ma: sec(9.0),
  bb: sec(13.0),
  close: sec(17.5),
};
const STACK = { x: theme.stage.active.x, y: 200, w: 940, h: 480 };
const THUMB = { x: 1080, y: 200, w: theme.stage.active.x + theme.stage.active.w - 1080, h: 300 };
const CLOSE_CARD = { x: 1080, y: 540, w: theme.stage.active.x + theme.stage.active.w - 1080, h: 180 };
/** Two levels marked on the thumbnail — the "level yang kamu tandai". */
const LEVELS = [0.32, 0.68];
// ═══════════════════════════════════════════════════════════════════════════

const TBOX = { x: THUMB.x + 32, y: THUMB.y + 40, w: THUMB.w - 64, h: THUMB.h - 80 };
const TG = seriesGrid(PULLBACKS, TBOX, 0.16);

export const Scene11 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dy = cutIn(g, CUTS.toProcess);
  const push = cutPushOut(g, CUTS.toCase, 0.16);
  const blur = Math.max(cutBlur(g, CUTS.toProcess), cutBlur(g, CUTS.toCase));
  const head = textReveal(f, T.head);
  const closing = textReveal(f, T.close);
  /** The base pulses once at the end: the foundation is what matters. */
  const pulse = f >= T.close ? Math.sin(Math.PI * clamp01((f - T.close) / 26)) : 0;

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px) scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: theme.stage.active.x,
            top: 108 + head.dy,
            transform: "translateY(-50%)",
            fontFamily: theme.text.family,
            fontSize: theme.text.h1.size,
            fontWeight: theme.text.h1.weight,
            color: theme.color.ink,
            opacity: head.opacity,
          }}
        >
          Di mana indikator dipakai?
        </div>

        <div style={{ transform: `scale(${1 + pulse * 0.012})`, transformOrigin: `${STACK.x + STACK.w / 2}px ${STACK.y + STACK.h}px` }}>
          <LayerStack
            rect={STACK}
            f={f}
            layers={[
              { label: "Analisismu Sendiri", at: T.base, tone: "solid", chips: ["Trend", "Pattern", "Level"] },
              { label: "Moving Average", note: "Mengonfirmasi trend", at: T.ma, tone: "outline" },
              { label: "Bollinger Bands", note: "Mengencang  /  Sudah bergerak kuat", at: T.bb, tone: "outline" },
            ]}
          />
        </div>

        {/* your own analysis, as an actual chart */}
        <Panel rect={THUMB} opacity={progress(f, T.base, sec(1))}>
          <PriceLine values={PULLBACKS} grid={TG} f={f} at={T.base} over={sec(2.5)} />
          {f >= T.base + sec(1.5) && (
            <Layer opacity={progress(f, T.base + sec(1.5), 14)}>
              {LEVELS.map((p) => {
                const y = TBOX.y + TBOX.h * p;
                return <line key={p} x1={TBOX.x} y1={y} x2={TBOX.x + TBOX.w} y2={y} stroke={theme.color.indigo40} strokeWidth={theme.shape.rule} strokeDasharray="10 8" />;
              })}
              <line
                x1={TG.x(6)}
                y1={TG.y(PULLBACKS[6])}
                x2={TG.x(PULLBACKS.length - 6)}
                y2={TG.y(PULLBACKS[PULLBACKS.length - 6])}
                stroke={theme.color.indigo}
                strokeWidth={theme.shape.rule}
              />
            </Layer>
          )}
        </Panel>

        {/* the closing reading, and what it is not */}
        {f >= T.close && (
          <Panel rect={CLOSE_CARD} opacity={closing.opacity}>
            <div
              style={{
                position: "absolute",
                left: CLOSE_CARD.x + 32,
                top: CLOSE_CARD.y + 54 + closing.dy,
                fontFamily: theme.text.family,
                fontSize: theme.text.title.size,
                fontWeight: theme.text.title.weight,
                color: theme.color.indigo,
                opacity: closing.opacity,
              }}
            >
              Second opinion.
            </div>
            <div
              style={{
                position: "absolute",
                left: CLOSE_CARD.x + 32,
                top: CLOSE_CARD.y + 54 + theme.text.title.size + 18 + closing.dy,
                fontFamily: theme.text.family,
                fontSize: theme.text.tag.size,
                fontWeight: theme.text.body.weight,
                color: theme.color.slate,
                opacity: closing.opacity,
                textDecoration: "line-through",
              }}
            >
              Pengambil keputusan
            </div>
          </Panel>
        )}

        <Chip label="Fondasinya tetap analisismu sendiri" x={theme.stage.active.x} y={760} tone="slate" anchor="left" at={T.base + sec(1)} />
      </div>
    </Stage>
  );
};
