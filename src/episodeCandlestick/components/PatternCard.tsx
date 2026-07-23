/**
 * PatternCard — shelf card: mini PatternGlyph on top, Title Case name beneath.
 * Supports lifted (−24px + subtle shadow), dimmed, and nameOpacity.
 */
import { theme } from "../theme";
import { PatternGlyph } from "./PatternGlyph";
import type { PatternName } from "./PatternGlyph";

export const CARD_W = 300;
export const CARD_H = 340;

export const PatternCard = ({
  pattern,
  name,
  cx,
  cy,
  lifted = false,
  dimmed = false,
  nameOpacity = 1,
  showPathLine = false,
  pathLineOpacity = 0.35,
  opacity = 1,
}: {
  pattern: PatternName;
  name: string;
  cx: number;
  cy: number;
  lifted?: boolean;
  dimmed?: boolean;
  nameOpacity?: number;
  showPathLine?: boolean;
  pathLineOpacity?: number;
  opacity?: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: cx - CARD_W / 2,
      top: cy - CARD_H / 2,
      width: CARD_W,
      height: CARD_H,
      borderRadius: theme.radius.card,
      background: theme.colors.neutralFill,
      border: `${theme.stroke.hairline}px solid ${theme.colors.neutralLine}`,
      boxShadow: lifted ? "0 14px 30px rgba(0,0,0,0.10)" : undefined,
      transform: lifted ? "translateY(-24px)" : undefined,
      opacity: opacity * (dimmed ? 0.15 : 1),
    }}
  >
    <PatternGlyph
      pattern={pattern}
      cx={CARD_W / 2}
      top={22}
      size={190}
      showPathLine={showPathLine}
      pathLineOpacity={pathLineOpacity}
    />
    <div
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        top: 226,
        textAlign: "center",
        fontSize: theme.type.label.size,
        fontWeight: theme.type.label.weight,
        lineHeight: 1.15,
        color: theme.colors.ink,
        opacity: nameOpacity,
      }}
    >
      {name}
    </div>
  </div>
);
