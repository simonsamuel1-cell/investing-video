/**
 * TimeframeSelector — segmented control (5M · 1D · 1W) sitting at the top of the
 * chart card. Active segment fills indigo. UI element, so the fill slide is
 * allowed to move quickly. Ends at x ≤ 1368 so it clears the logo zone.
 */
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { usePalette } from "../palette";

export const TF_LABELS = ["5m", "1D", "1W"] as const;
export type TfIndex = 0 | 1 | 2;

export const TimeframeSelector = ({
  x,
  y,
  activeIndex,
  segW = 108,
  segH = 56,
  gap = 8,
  fillOpacity = 1,
}: {
  x: number; // left edge
  y: number; // top edge
  activeIndex: number; // may be fractional while sliding between segments
  segW?: number;
  segH?: number;
  gap?: number;
  /** 0 hides the active fill — for when the track is up but no timeframe is chosen yet. */
  fillOpacity?: number;
}) => {
  const pal = usePalette();
  const f = useCurrentFrame();
  const fillX = x + activeIndex * (segW + gap);
  const appear = interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: theme.motion.ease });

  return (
    <>
      {/* track */}
      <div
        style={{
          position: "absolute",
          left: x - 6,
          top: y - 6,
          width: TF_LABELS.length * segW + (TF_LABELS.length - 1) * gap + 12,
          height: segH + 12,
          borderRadius: theme.radius.chip + 4,
          background: pal.cardBg,
          border: `${theme.stroke.hair}px solid ${pal.border}`,
          opacity: appear,
        }}
      />
      {/* active fill */}
      <div
        style={{
          position: "absolute",
          left: fillX,
          top: y,
          width: segW,
          height: segH,
          borderRadius: theme.radius.chip,
          background: pal.indigo,
          opacity: appear * fillOpacity,
        }}
      />
      {TF_LABELS.map((lab, i) => {
        const isActive = Math.abs(activeIndex - i) < 0.5 && fillOpacity > 0.5;
        return (
          <div
            key={lab}
            style={{
              position: "absolute",
              left: x + i * (segW + gap),
              top: y,
              width: segW,
              height: segH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.type.family,
              fontSize: theme.type.label.size,
              fontWeight: theme.type.label.weight,
              color: isActive ? pal.cardBg : pal.slate,
              opacity: appear,
            }}
          >
            {lab}
          </div>
        );
      })}
    </>
  );
};
