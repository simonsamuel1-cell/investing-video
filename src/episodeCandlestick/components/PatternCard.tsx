/**
 * PatternCard — shelf card: mini PatternGlyph on top, Title Case name beneath.
 * Supports lifted (−24px + subtle shadow), dimmed, nameOpacity, a whole-card
 * `scale`, and `glyphTop` (raise/center the glyph as the name fades).
 */
import { theme } from "../theme";
import { PatternGlyph } from "./PatternGlyph";
import type { PatternName } from "./PatternGlyph";

export const CARD_W = 300;
export const CARD_H = 340;
export const GLYPH_SIZE = 190;
export const GLYPH_TOP_DEFAULT = 22; // glyph near the top (name below)
export const GLYPH_TOP_CENTER = (CARD_H - GLYPH_SIZE) / 2; // glyph centered in the card

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
  scale = 1,
  glyphTop = GLYPH_TOP_DEFAULT,
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
  scale?: number;
  glyphTop?: number;
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
      transformOrigin: "center center",
      transform: `translateY(${lifted ? -24 : 0}px) scale(${scale})`,
      opacity: opacity * (dimmed ? 0.15 : 1),
    }}
  >
    <PatternGlyph
      pattern={pattern}
      cx={CARD_W / 2}
      top={glyphTop}
      size={GLYPH_SIZE}
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
