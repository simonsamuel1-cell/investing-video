/**
 * DemoChart — right-panel worked demo (docs/layout-4980.md right panel
 * 603,220,1047×680). ALL beat-driven motion lives here: candles build on the
 * beat, annotation callouts appear one at a time (each clears before the next),
 * an optional dashed reference line, an optional lower volume sub-panel, and an
 * isolate/dim state for the "control changes here" pause. Candle bodies carry
 * green/red; everything else is indigo/neutral.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";
import type { OHLC } from "../helpers";
import { priceScale, progress, fadeIn } from "../helpers";
import { Candle } from "./Candle";

export const RIGHT_PANEL = { x: 603, y: 220, w: 1047, h: 680 };

export type Annotation = { index: number; text: string; atFrame: number };

export const DemoChart = ({
  data,
  buildFrom,
  buildStagger = 3,
  buildDur = 10,
  annotations = [],
  refLine,
  refTickIndex,
  volume,
  isolateIndex,
  dimOthersTo = 0.3,
  opacity = 1,
}: {
  data: OHLC[];
  buildFrom: number;
  buildStagger?: number;
  buildDur?: number;
  annotations?: Annotation[];
  refLine?: { price: number; from: number };
  refTickIndex?: number; // dashed tick at this candle's body midpoint
  volume?: { heights: number[]; labels: string[]; from: number; stagger: number; startIndex: number };
  isolateIndex?: number;
  dimOthersTo?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const P = RIGHT_PANEL;
  const hasVol = !!volume;
  const chartTop = P.y + 26;
  const chartBottom = hasVol ? P.y + 470 : P.y + P.h - 30;
  const volTop = P.y + 500;
  const volBottom = P.y + P.h - 40;

  const min = Math.min(...data.map((d) => d.low), refLine ? refLine.price : Infinity);
  const max = Math.max(...data.map((d) => d.high), refLine ? refLine.price : -Infinity);
  const scale = priceScale(min, max, chartTop, chartBottom, 0.08);

  const slot = (P.w - 60) / data.length;
  const cx = (i: number) => P.x + 30 + slot * (i + 0.5);
  const bodyW = Math.min(30, slot * 0.55);

  // active annotation: the last one reached, until the next one's atFrame
  const sorted = [...annotations].sort((a, b) => a.atFrame - b.atFrame);
  let active: Annotation | undefined;
  for (let i = 0; i < sorted.length; i++) {
    const next = sorted[i + 1];
    if (f >= sorted[i].atFrame && (!next || f < next.atFrame)) active = sorted[i];
  }

  const refDraw = refLine && f >= refLine.from ? progress(f, refLine.from, 16) : 0;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity }}>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
        {/* candles */}
        {data.map((c, i) => {
          const start = buildFrom + i * buildStagger;
          if (f < start) return null;
          const p = progress(f, start, buildDur);
          const dim = isolateIndex !== undefined && i !== isolateIndex;
          return (
            <g key={i} opacity={dim ? dimOthersTo : 1}>
              <Candle x={cx(i)} width={bodyW} open={c.open} high={c.high} low={c.low} close={c.close} scale={scale} buildProgress={p} wickProgress={p} />
            </g>
          );
        })}

        {/* ref tick — dashed vertical at a candle's body midpoint */}
        {refTickIndex !== undefined && f >= buildFrom && (
          <line
            x1={cx(refTickIndex)}
            y1={scale((data[refTickIndex].open + data[refTickIndex].close) / 2) - 40}
            x2={cx(refTickIndex)}
            y2={scale((data[refTickIndex].open + data[refTickIndex].close) / 2) + 40}
            stroke={theme.colors.indigo}
            strokeWidth={theme.stroke.standard}
            strokeDasharray="8 8"
            opacity={0.7}
          />
        )}

        {/* dashed reference line */}
        {refLine && refDraw > 0 && (
          <line x1={P.x + 30} y1={scale(refLine.price)} x2={P.x + 30 + (P.w - 60) * refDraw} y2={scale(refLine.price)} stroke={theme.colors.indigo} strokeWidth={theme.stroke.standard} strokeDasharray="12 10" />
        )}

        {/* isolate ring */}
        {isolateIndex !== undefined && (
          <rect
            x={cx(isolateIndex) - slot / 2 + 4}
            y={scale(data[isolateIndex].high) - 14}
            width={slot - 8}
            height={scale(data[isolateIndex].low) - scale(data[isolateIndex].high) + 28}
            rx={10}
            fill="none"
            stroke={theme.colors.indigo}
            strokeWidth={theme.stroke.standard}
          />
        )}

        {/* volume sub-panel */}
        {hasVol && (
          <>
            <line x1={P.x + 30} y1={P.y + 486} x2={P.x + P.w - 30} y2={P.y + 486} stroke={theme.colors.neutralLine} strokeWidth={theme.stroke.hairline} />
            <line x1={P.x + 30} y1={volBottom} x2={P.x + P.w - 30} y2={volBottom} stroke={theme.colors.neutralLine} strokeWidth={theme.stroke.hairline} />
            {volume!.heights.map((h, k) => {
              const i = volume!.startIndex + k;
              const start = volume!.from + k * volume!.stagger;
              if (f < start) return null;
              const p = progress(f, start, 10);
              const barH = (volBottom - volTop) * h * p;
              const bw = bodyW;
              return <rect key={k} x={cx(i) - bw / 2} y={volBottom - barH} width={bw} height={barH} fill={theme.colors.indigo} opacity={0.85} />;
            })}
          </>
        )}
      </svg>

      {/* volume count labels */}
      {hasVol &&
        volume!.labels.map((lab, k) => {
          const i = volume!.startIndex + k;
          const start = volume!.from + k * volume!.stagger;
          if (f < start) return null;
          return (
            <div key={k} style={{ position: "absolute", left: cx(i), top: volBottom + 8, transform: "translateX(-50%)", fontSize: theme.type.label.size, fontWeight: theme.type.body.weight, color: theme.colors.slate }}>
              {lab}
            </div>
          );
        })}

      {/* one annotation callout at a time */}
      {active && (
        <div
          style={{
            position: "absolute",
            left: Math.min(cx(active.index), P.x + P.w - 420),
            top: scale(data[active.index].high) - 84,
            transform: "translateX(-50%)",
            padding: "10px 22px",
            borderRadius: theme.radius.chip,
            background: theme.colors.neutralFill,
            border: `${theme.stroke.hairline}px solid ${theme.colors.indigo}`,
            boxShadow: `inset 0 0 0 1px ${theme.colors.indigo}`,
            fontFamily: theme.type.family,
            fontSize: theme.type.label.size,
            fontWeight: theme.type.label.weight,
            color: theme.colors.indigo,
            whiteSpace: "nowrap",
            opacity: fadeIn(f, active.atFrame, 8),
          }}
        >
          {active.text}
        </div>
      )}
    </div>
  );
};
