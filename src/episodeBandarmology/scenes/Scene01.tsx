/**
 * Scene 01 — Wholesale Market Metaphor (0, dur 207). Isometric line-art stalls
 * fade in row-by-row; a cyan retail shopper slides in from the left (~f90); a
 * "Retail Price" tag reveals (~f130). No data. Nothing in the top-right zone.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Chip } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal } from "../helpers";

const { colors, font, type } = theme;

const Stall = ({ x, y, op }: { x: number; y: number; op: number }) => (
  <g transform={`translate(${x},${y})`} opacity={op} stroke={colors.indigo} strokeWidth={3} fill="none">
    {/* awning */}
    <path d="M -70 0 L 70 0 L 86 36 L -86 36 Z" fill={colors.indigoTint} />
    {/* posts + counter */}
    <line x1={-78} y1={36} x2={-78} y2={150} />
    <line x1={78} y1={36} x2={78} y2={150} />
    <rect x={-86} y={150} width={172} height={36} fill={colors.white} />
    {/* crates */}
    <rect x={-58} y={104} width={42} height={42} />
    <rect x={14} y={104} width={42} height={42} />
  </g>
);

export const Scene01 = () => {
  const f = useCurrentFrame();
  const cols = [330, 700, 1070, 1440];
  const rows = [330, 600];
  const shopperX = tween(f, [90, 130], [60, 360]);

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 96,
          width: 1272,
          fontSize: type.header,
          fontWeight: font.weights.extrabold,
          ...textReveal(f, 8, 18),
        }}
      >
        A Wholesale Market
      </div>

      <svg width={1728} height={760} viewBox="0 0 1728 760" style={{ position: "absolute", left: 96, top: 200, overflow: "visible" }}>
        {rows.map((ry, r) =>
          cols.map((cx, c) => {
            const idx = r * cols.length + c;
            const op = fadeIn(f, 8 + idx * 8, 18);
            return <Stall key={idx} x={cx - 96} y={ry - 60} op={op} />;
          }),
        )}

        {/* cyan retail shopper */}
        <g transform={`translate(${shopperX},520)`} opacity={fadeIn(f, 90, 16)}>
          <circle cx={0} cy={-44} r={22} fill={colors.cyan} />
          <rect x={-20} y={-18} width={40} height={70} rx={16} fill={colors.cyan} />
          <rect x={26} y={-6} width={30} height={30} rx={6} fill={colors.cyanDeep} />
        </g>
      </svg>

      <div style={{ position: "absolute", left: 360, top: 470, ...textReveal(f, 130, 16) }}>
        <Chip label="Retail Price" variant="cyan" delay={130} />
      </div>
    </SafeArea>
  );
};
