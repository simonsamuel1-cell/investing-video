/**
 * PatternPairScene — shared layout + choreography for SC13B (Morning/Evening
 * Star) and SC13C (Soldiers/Crows). Two stacked static reference cards on the
 * left (top + bottom), one combined round-trip DemoChart on the right, and a
 * highlight overlay: a ring on each card that steps candle 1→2→3, then a box on
 * each of the two clusters on the right chart. No flip/transition. Content fades
 * with the scene; the header (CaseStudyTabsPair) persists separately.
 *
 * Highlight timeline (scene-local frames): 100 → candle 1, 142 → candle 2,
 * 211 → candle 3, 285 → the two cluster boxes.
 */
import type { CSSProperties } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "./SafeArea";
import { CaseStudyLayoutFrame } from "./CaseStudyLayoutFrame";
import { ReferenceCard, LEFT_PANEL, referenceCandleGeom, type PanelRect } from "./ReferenceCard";
import { DemoChart, demoChartGeom } from "./DemoChart";
import { IllustrationTag } from "./IllustrationTag";
import { theme } from "../theme";
import { sec, progress, type OHLC } from "../helpers";

// Bottom reference panel — a clone of LEFT_PANEL, stacked beneath it.
const BOTTOM_PANEL: PanelRect = { x: LEFT_PANEL.x, y: 560, w: LEFT_PANEL.w, h: LEFT_PANEL.h };

const T = { ref: 0.4, trend: 0.8 };
const RING_KEYS = [100, 128, 142, 197, 211]; // hold-then-move between the three candles
const BOX_IN = 285;

const bottomChrome: CSSProperties = {
  position: "absolute",
  left: BOTTOM_PANEL.x,
  top: BOTTOM_PANEL.y,
  width: BOTTOM_PANEL.w,
  height: BOTTOM_PANEL.h,
  background: theme.colors.neutralFill,
  border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
  borderRadius: theme.radius.panel,
  boxSizing: "border-box",
};

type Geom = ReturnType<typeof referenceCandleGeom>;
type Cluster = [number, number];
type BoxRect = { x: number; y: number; w: number; h: number };
// A highlight box over a candle cluster, revealed at `from` (default BOX_IN),
// with an optional directional (momentum) arrow above (up) / below (down) it.
export type BoxSpec = { cluster: Cluster; from?: number; arrow?: "up" | "down" };

const ringRadii = (g: Geom) => g.centers.map((c) => Math.max(30, (c.bottom - c.top) / 2 + 16));

// Indigo directional arrow — a momentum indicator, not a buy/sell entry marker.
const TrendArrow = ({ box, dir }: { box: BoxRect; dir: "up" | "down" }) => {
  const cx = box.x + box.w / 2;
  const LEN = 74;
  const HEAD = 18;
  if (dir === "up") {
    const yBase = box.y - 14;
    const yTip = yBase - LEN;
    return (
      <>
        <line x1={cx} y1={yBase} x2={cx} y2={yTip + HEAD - 2} stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} strokeLinecap="round" />
        <polygon points={`${cx},${yTip} ${cx - 12},${yTip + HEAD} ${cx + 12},${yTip + HEAD}`} fill={theme.colors.indigo} />
      </>
    );
  }
  const yBase = box.y + box.h + 14;
  const yTip = yBase + LEN;
  return (
    <>
      <line x1={cx} y1={yBase} x2={cx} y2={yTip - HEAD + 2} stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} strokeLinecap="round" />
      <polygon points={`${cx},${yTip} ${cx - 12},${yTip - HEAD} ${cx + 12},${yTip - HEAD}`} fill={theme.colors.indigo} />
    </>
  );
};

export const PatternPairScene = ({
  topCandles,
  topCaption,
  botCandles,
  botCaption,
  data,
  boxes,
  showRings = true,
  buildFrom = sec(T.trend),
  buildStagger = 9,
}: {
  topCandles: OHLC[];
  topCaption: string;
  botCandles: OHLC[];
  botCaption: string;
  data: OHLC[];
  boxes: BoxSpec[]; // right-chart cluster highlights (each may carry a trend arrow)
  showRings?: boolean; // ring on each left card that steps candle 1→2→3
  buildFrom?: number; // frame the right-chart build starts
  buildStagger?: number; // frames between each candle's build
}) => {
  const f = useCurrentFrame();
  const reveal = progress(f, sec(T.ref), sec(0.5));

  const topGeom = referenceCandleGeom(topCandles, LEFT_PANEL);
  const botGeom = referenceCandleGeom(botCandles, BOTTOM_PANEL);
  const dgeom = demoChartGeom(data);

  const clusterBox = ([i0, i1]: Cluster): BoxRect => {
    const x1 = dgeom.cx(i0) - dgeom.slot / 2;
    const x2 = dgeom.cx(i1) + dgeom.slot / 2;
    const highs = data.slice(i0, i1 + 1).map((c) => dgeom.scale(c.high));
    const lows = data.slice(i0, i1 + 1).map((c) => dgeom.scale(c.low));
    const y1 = Math.min(...highs) - 16;
    const y2 = Math.max(...lows) + 16;
    return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  };

  // Rings track the three candles: candle 1 → 2 → 3.
  const track = (v: number[]) =>
    interpolate(f, RING_KEYS, [v[0], v[0], v[1], v[1], v[2]], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring = (g: Geom) => ({
    cx: track(g.centers.map((c) => c.cx)),
    cy: track(g.centers.map((c) => c.midY)),
    r: track(ringRadii(g)),
  });
  const topRing = ring(topGeom);
  const botRing = ring(botGeom);

  // Rings fully present at local 100. Boxes fade in on their own `from` frame.
  const ringOpacity = interpolate(f, [RING_KEYS[0] - 12, RING_KEYS[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SafeArea>
      <CaseStudyLayoutFrame
        leftPanel={<ReferenceCard candles={topCandles} caption={topCaption} reveal={reveal} />}
        leftSubZone={
          <>
            <div style={bottomChrome} />
            <ReferenceCard candles={botCandles} caption={botCaption} reveal={reveal} panel={BOTTOM_PANEL} />
          </>
        }
        rightPanel={<DemoChart data={data} buildFrom={buildFrom} buildStagger={buildStagger} />}
      />

      {/* highlight overlay — rings on the left cards, boxes on the right chart */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        {showRings &&
          f >= RING_KEYS[0] - 12 &&
          [topRing, botRing].map((rg, k) => (
            <circle key={k} cx={rg.cx} cy={rg.cy} r={rg.r} fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} opacity={ringOpacity} />
          ))}
        {boxes.map((spec, k) => {
          const from = spec.from ?? BOX_IN;
          if (f < from - 14) return null;
          const op = interpolate(f, [from - 14, from], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const b = clusterBox(spec.cluster);
          return (
            <g key={k} opacity={op}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={14} fill="none" stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} />
              {spec.arrow && <TrendArrow box={b} dir={spec.arrow} />}
            </g>
          );
        })}
      </svg>

      <IllustrationTag />
    </SafeArea>
  );
};
