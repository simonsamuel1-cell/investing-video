/**
 * Scene 02 — The Super-Wholesalers (224, dur 334). One stall scales up into a
 * large indigo warehouse block (~f30–80); oversized crates flow out in bulk;
 * a cyan lens/spotlight sweeps over it (~f150); chip "Super-Wholesaler" (~f200).
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Chip } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal } from "../helpers";

const { colors, font, type } = theme;

export const Scene02 = () => {
  const f = useCurrentFrame();
  const grow = tween(f, [30, 80], [0.4, 1]);
  const sweep = tween(f, [150, 210], [-260, 1180]);

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
        Some Buy In Bulk
      </div>

      <svg width={1728} height={720} viewBox="0 0 1728 720" style={{ position: "absolute", left: 96, top: 220, overflow: "visible" }}>
        {/* warehouse */}
        <g transform={`translate(420,360) scale(${grow})`} style={{ transformBox: "fill-box" }} stroke={colors.indigo} strokeWidth={4} fill={colors.indigoTint}>
          <rect x={-260} y={-200} width={520} height={400} rx={12} />
          <path d="M -260 -200 L 0 -300 L 260 -200 Z" fill={colors.indigo} />
          <rect x={-70} y={40} width={140} height={160} fill={colors.white} />
        </g>

        {/* bulk crates flowing out to the right */}
        {Array.from({ length: 5 }).map((_, i) => {
          const t = tween(f, [120 + i * 18, 200 + i * 18], [0, 1]);
          return (
            <rect
              key={i}
              x={760 + t * (560 + i * 30)}
              y={300 + (i % 2) * 70}
              width={84}
              height={84}
              rx={8}
              fill={colors.indigo}
              opacity={fadeIn(f, 120 + i * 18, 14) * (1 - t * 0.2)}
            />
          );
        })}

        {/* cyan lens sweep */}
        <rect x={sweep} y={0} width={120} height={720} fill={colors.cyan} opacity={0.18} />
      </svg>

      <div style={{ position: "absolute", left: 96, top: 760 }}>
        <Chip label="Super-Wholesaler" variant="indigo" bounce delay={200} />
      </div>
    </SafeArea>
  );
};
