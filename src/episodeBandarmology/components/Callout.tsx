/**
 * Callout — annotation chip with a leader line pointing to an element (the
 * "tells"). Anchor (ax, ay) and box offset (dx, dy) are absolute frame coords;
 * the leader runs from the anchor to the box. Body text is sentence case.
 */
import { theme } from "../theme";

const { colors, font, type, radius } = theme;

export const Callout = ({
  ax,
  ay,
  dx,
  dy,
  width = 460,
  body,
  op = 1,
  variant = "indigo",
}: {
  ax: number;
  ay: number;
  dx: number;
  dy: number;
  width?: number;
  body: string;
  op?: number;
  variant?: "indigo" | "cyan";
}) => {
  const bx = ax + dx;
  const by = ay + dy;
  const accent = variant === "cyan" ? colors.cyan : colors.indigo;
  return (
    <>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", opacity: op }}>
        <line x1={ax} y1={ay} x2={bx + width / 2} y2={by + 30} stroke={accent} strokeWidth={2} />
        <circle cx={ax} cy={ay} r={7} fill={accent} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: bx,
          top: by,
          width,
          boxSizing: "border-box",
          padding: "16px 22px",
          background: colors.cardWhite,
          border: `2px solid ${accent}`,
          borderRadius: radius.md,
          fontSize: type.descriptor,
          fontWeight: font.weights.medium,
          color: colors.text,
          lineHeight: 1.25,
          opacity: op,
        }}
      >
        {body}
      </div>
    </>
  );
};
