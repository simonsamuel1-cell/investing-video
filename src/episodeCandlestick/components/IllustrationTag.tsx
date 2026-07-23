/**
 * IllustrationTag — compliance tag, bottom-right of the active area, above the
 * subtitle zone. Mounted in every chart-bearing scene (SC01–07, SC09–16).
 */
import { theme } from "../theme";

export const IllustrationTag = () => (
  <div
    style={{
      position: "absolute",
      right: theme.layout.safeRight,
      top: 922, // above the 108px subtitle zone (972+)
      fontSize: theme.type.label.size,
      fontWeight: 500,
      color: theme.colors.neutralMuted,
    }}
  >
    Illustration — fictional data
  </div>
);
