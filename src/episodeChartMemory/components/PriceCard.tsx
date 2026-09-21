/**
 * PriceCard — white card (16px radius, 1px slate border) carrying a 48px
 * numeral. Used by SC02 for the chili price figures before they collapse onto
 * the chart baseline. Optional cyan rise glyph for the "naik lagi" beat.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";

export const PriceCard = ({
  value,
  caption,
  cx,
  cy,
  startFrame,
  scale = 1,
  opacity = 1,
  rise = false,
  width,
}: {
  value: string; // pre-formatted, e.g. "Rp40.000/kg"
  caption?: string;
  cx: number;
  cy: number;
  startFrame: number;
  scale?: number;
  opacity?: number;
  rise?: boolean; // cyan ↑ glyph
  /** Fixed outer width — lets a row of cards keep an exact gap between them. */
  width?: number;
}) => {
  const pal = usePalette();
  const f = useCurrentFrame();
  if (f < startFrame) return null;
  const p = interpolate(f, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.motion.ease,
  });
  const s = scale * (0.94 + 0.06 * p);

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        transform: `translate(-50%, -50%) scale(${s})`,
        transformOrigin: "center center",
        width,
        boxSizing: "border-box",
        padding: "22px 34px",
        borderRadius: theme.radius.card,
        background: pal.cardBg,
        border: `${theme.stroke.hair}px solid ${pal.border}`,
        textAlign: "center",
        opacity: p * opacity,
        whiteSpace: "nowrap",
      }}
    >
      {caption && (
        <div style={{ fontFamily: theme.type.family, fontSize: 28, fontWeight: 500, color: pal.slate, marginBottom: 6 }}>{caption}</div>
      )}
      <div style={{ fontFamily: theme.type.family, fontSize: theme.type.numeral.size, fontWeight: theme.type.numeral.weight, color: pal.ink }}>
        {value}
        {rise && <span style={{ color: pal.cyan, marginLeft: 10 }}>↑</span>}
      </div>
    </div>
  );
};
