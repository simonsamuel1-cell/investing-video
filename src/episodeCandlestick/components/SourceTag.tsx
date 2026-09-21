/**
 * SourceTag — real-data compliance tag ("Data: IDX, Jun 2026"), bottom-right.
 * Replaces IllustrationTag on real-data scenes (SC14A–C). The two must NEVER
 * both mount in the same frame.
 */
import { theme } from "../theme";

export const SourceTag = ({ text = "Data: IDX, Jun 2026" }: { text?: string }) => (
  <div
    style={{
      position: "absolute",
      right: 24,
      bottom: 20, // bottom-right corner — mirror of IllustrationTag
      fontSize: 36,
      fontWeight: 500,
      color: theme.colors.neutralMuted,
    }}
  >
    {text}
  </div>
);
