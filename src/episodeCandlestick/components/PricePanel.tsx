/**
 * PricePanel — chart chrome only: white rounded panel, neutral gridlines, right
 * Rp axis (slate, half label size, placed 20px past the panel's right edge).
 * Composed with CandleSeries or SessionView content.
 * Also exports Ticker — the fictional "$ABCD" label for chart panels.
 */
import { theme } from "../theme";
import { fmtRp } from "../helpers";

export const Ticker = ({ x = 130, y = 148, label = "$ABCD" }: { x?: number; y?: number; label?: string }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      zIndex: 10, // stays above panel chrome regardless of mount order
      fontSize: theme.type.label.size + 4,
      fontWeight: theme.type.headline.weight, // bold
      color: theme.colors.slate,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </div>
);

export const PricePanel = ({
  x,
  y,
  width,
  height,
  min,
  max,
  scale,
  ticks = 4,
  showPanel = true,
  opacity = 1,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  min: number;
  max: number;
  scale: (price: number) => number;
  ticks?: number;
  showPanel?: boolean;
  opacity?: number;
}) => {
  const tickPrices = Array.from({ length: ticks }, (_, i) => Math.round(min + ((max - min) * (i + 0.5)) / ticks));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity }}>
      {showPanel && (
        <div
          style={{
            position: "absolute",
            left: x - 24,
            top: y - 24,
            width: width + 48, // symmetric 24px inset around the chart (right edge = x+width+24)
            height: height + 48,
            background: theme.colors.neutralFill,
            border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
            borderRadius: theme.radius.panel,
          }}
        />
      )}
      <svg
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        width={theme.canvas.width}
        height={theme.canvas.height}
      >
        {tickPrices.map((p) => (
          <g key={p}>
            <line x1={x} y1={scale(p)} x2={x + width} y2={scale(p)} stroke={theme.colors.neutralLine} strokeWidth={theme.stroke.hairline} />
            <text
              x={x + width + 44} // 20px past the panel's right edge (x+width+24)
              y={scale(p) + 8}
              fontFamily={theme.type.family}
              fontSize={24}
              fontWeight={500}
              fill={theme.colors.slate}
            >
              {fmtRp(p)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
