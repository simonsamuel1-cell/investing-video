/**
 * CandleChart — SVG candlestick series. Candle BODIES are the only place
 * green/red is allowed; axis, gridlines, marker and ghost branches stay
 * indigo/cyan/neutral. Candles reveal left→right from `drawStart` (each wick+body
 * mounts only once its onset has passed, so there is no frame-0 ghost flash).
 *
 * Coordinates: `data` candles carry o/h/l/c in arbitrary price units; the chart
 * maps the pooled min/max (incl. branch points) to the plot box. Optional:
 *  • marker  — labelled drop line at a candle index
 *  • gapIndex — dashed connector marking a gap between candle i-1 close and i open
 *  • branches — ghosted continuation polylines from the last candle
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";

export type Candle = { o: number; h: number; l: number; c: number };
export type Branch = { pts: Array<[number, number]>; label: string; tone?: "indigo" | "cyan" | "grey" };

const c = theme.colors;

export const CandleChart = ({
  x,
  y,
  w,
  h,
  data,
  frame,
  drawStart,
  drawDur = 40,
  count,
  marker,
  gapIndex,
  branches,
  branchStart = 0,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  data: Candle[];
  frame: number;
  drawStart: number;
  drawDur?: number;
  count?: number; // explicit number of candles to reveal (overrides drawStart progress)
  marker?: { index: number; label: string };
  gapIndex?: number;
  branches?: Branch[];
  branchStart?: number;
}) => {
  const padL = 46;
  const plotW = w - padL - 8;
  const plotH = h - 34;
  const n = data.length;

  // pooled price range (include branch points so nothing clips)
  let lo = Infinity;
  let hi = -Infinity;
  for (const d of data) {
    lo = Math.min(lo, d.l);
    hi = Math.max(hi, d.h);
  }
  if (branches) for (const b of branches) for (const p of b.pts) {
    lo = Math.min(lo, p[1]);
    hi = Math.max(hi, p[1]);
  }
  const pad = (hi - lo) * 0.12 || 1;
  lo -= pad;
  hi += pad;

  // when branches are present, reserve ~3 trailing slots so the ghost paths and
  // their labels have room to the right of the last candle (they'd otherwise be
  // clipped by the SVG when the series has few candles).
  const slotDiv = branches && branches.length ? n + 3 : n;
  const px = (i: number) => padL + (plotW * (i + 0.5)) / slotDiv;
  const py = (v: number) => 8 + plotH * (1 - (v - lo) / (hi - lo));
  const cw = Math.min(26, (plotW / slotDiv) * 0.55);

  const progress = clamp01((frame - drawStart) / drawDur);
  const shown = count != null ? count : progress * n;
  const branchP = clamp01((frame - branchStart) / 26);

  const toneStroke = (t?: "indigo" | "cyan" | "grey") => (t === "cyan" ? c.cyan : t === "grey" ? c.greyLight : c.indigo);

  return (
    <svg
      style={{ position: "absolute", left: x, top: y }}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
    >
      {/* gridlines (neutral) */}
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={padL} x2={w - 8} y1={8 + plotH * g} y2={8 + plotH * g} stroke={c.hairline} strokeWidth={1} />
      ))}
      {/* baseline axis */}
      <line x1={padL} x2={padL} y1={6} y2={plotH + 10} stroke={c.line} strokeWidth={2} />
      <line x1={padL} x2={w - 8} y1={plotH + 10} y2={plotH + 10} stroke={c.line} strokeWidth={2} />

      {/* candles — mount only once revealed */}
      {data.map((d, i) => {
        if (i >= shown) return null;
        const up = d.c >= d.o;
        const bodyTop = py(Math.max(d.o, d.c));
        const bodyBot = py(Math.min(d.o, d.c));
        const fill = up ? c.candleGreen : c.candleRed;
        return (
          <g key={i}>
            <line x1={px(i)} x2={px(i)} y1={py(d.h)} y2={py(d.l)} stroke={fill} strokeWidth={2} />
            <rect
              x={px(i) - cw / 2}
              y={bodyTop}
              width={cw}
              height={Math.max(2, bodyBot - bodyTop)}
              rx={2}
              fill={fill}
            />
          </g>
        );
      })}

      {/* gap connector */}
      {gapIndex != null && gapIndex < shown && (
        <line
          x1={px(gapIndex - 1)}
          x2={px(gapIndex)}
          y1={py(data[gapIndex - 1].c)}
          y2={py(data[gapIndex].o)}
          stroke={c.indigo}
          strokeWidth={2}
          strokeDasharray="5 5"
          opacity={0.8}
        />
      )}

      {/* marker drop line + tag */}
      {marker && marker.index < shown && (
        <g>
          <line x1={px(marker.index)} x2={px(marker.index)} y1={6} y2={plotH + 10} stroke={c.indigo} strokeWidth={2} strokeDasharray="4 5" opacity={0.7} />
          <rect x={px(marker.index) - 78} y={10} width={156} height={30} rx={8} fill={c.indigo} />
          <text x={px(marker.index)} y={31} textAnchor="middle" fontSize={17} fontWeight={700} fill={c.white} fontFamily={theme.font.family}>
            {marker.label}
          </text>
        </g>
      )}

      {/* ghosted continuation branches */}
      {branches && frame >= branchStart &&
        branches.map((b, bi) => {
          const pts = b.pts.map((p, k) => {
            const fx = px(n - 1) + (px(1) - px(0)) * (k + 1) * branchP * 0.9;
            return `${fx},${py(p[1])}`;
          });
          const last = b.pts[b.pts.length - 1];
          const lx = px(n - 1) + (px(1) - px(0)) * b.pts.length * branchP * 0.9;
          return (
            <g key={bi} opacity={0.5 * branchP}>
              <polyline points={`${px(n - 1)},${py(data[n - 1].c)} ${pts.join(" ")}`} fill="none" stroke={toneStroke(b.tone)} strokeWidth={2.5} strokeDasharray="6 6" />
              <text x={lx + 8} y={py(last[1]) + 5} fontSize={18} fontWeight={700} fill={toneStroke(b.tone)} fontFamily={theme.font.family}>
                {b.label}
              </text>
            </g>
          );
        })}
    </svg>
  );
};
