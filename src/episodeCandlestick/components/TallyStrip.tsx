/**
 * TallyStrip — N slots along the top of a chart; each fills with a chip +
 * small indigo check when its fillFrame passes. Right-aligned (right edge at
 * xEnd) so it stays clear of the logo zone. Slots fit their text with
 * 15px horizontal / 10px vertical padding.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

const PAD_X = 15;
const PAD_Y = 10;

export const TallyStrip = ({
  slots,
  xEnd,
  y,
  gap = 20,
}: {
  slots: { label: string; fillFrame: number }[];
  xEnd: number; // right edge of the strip
  y: number; // top edge
  gap?: number;
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", right: theme.canvas.width - xEnd, top: y, display: "flex", gap }}>
      {slots.map((s) => {
        const filled = f >= s.fillFrame;
        const pop = interpolate(f, [s.fillFrame, s.fillFrame + 9], [0.85, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: theme.motion.ease,
        });
        return (
          <div
            key={s.label}
            style={{
              padding: `${PAD_Y}px ${PAD_X}px`,
              borderRadius: theme.radius.chip,
              border: filled
                ? `${theme.stroke.hairline}px solid ${theme.colors.indigo}`
                : `${theme.stroke.hairline}px dashed ${theme.colors.neutralLine}`,
              background: filled ? theme.colors.neutralFill : undefined,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              transform: `scale(${filled ? pop : 1})`,
            }}
          >
            {filled && (
              <svg width={26} height={26} viewBox="0 0 26 26">
                <path d="M4 14 L10 20 L22 6" fill="none" stroke={theme.colors.indigo} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span
              style={{
                fontSize: theme.type.label.size,
                fontWeight: theme.type.label.weight,
                color: filled ? theme.colors.indigo : theme.colors.neutralMuted,
                whiteSpace: "nowrap",
              }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
