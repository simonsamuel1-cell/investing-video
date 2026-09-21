/**
 * IllustrationTag — compliance tag, flush in the bottom-left corner (margin
 * intentionally ignored). Mounted in every chart-bearing scene (SC01–07, SC09–16).
 */
import { theme } from "../theme";

export const IllustrationTag = () => (
  <div
    style={{
      position: "absolute",
      left: 24,
      bottom: 20, // bottom-left corner — outside the safe margin by design
      fontSize: 24,
      fontWeight: 500,
      color: theme.colors.neutralMuted,
    }}
  >
    only illustration
  </div>
);
