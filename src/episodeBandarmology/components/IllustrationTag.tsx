/**
 * IllustrationTag — small neutral "Illustration" pill that every chart/table
 * carries (compliance: all instruments are fictional/illustrative).
 */
import { theme } from "../theme";

const { colors, font, type, radius } = theme;

export const IllustrationTag = ({ left, top, op = 1 }: { left: number; top: number; op?: number }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      padding: "6px 16px",
      background: colors.divider,
      color: colors.slateMute,
      borderRadius: radius.sm,
      fontSize: type.chip,
      fontWeight: font.weights.bold,
      letterSpacing: 0.4,
      opacity: op,
    }}
  >
    Illustration
  </div>
);
