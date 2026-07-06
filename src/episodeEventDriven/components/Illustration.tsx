/**
 * Illustration — the small "Illustration" tag every illustrative (non-asset)
 * chart carries, so no drawn figure is mistaken for a real screen/number.
 * Sits bottom-left inside the usable box, clear of the subtitle zone.
 */
import { theme } from "../theme";

export const Illustration = ({ op = 1, x = 96, y = 930 }: { op?: number; x?: number; y?: number }) =>
  op <= 0 ? null : (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 12px",
        borderRadius: theme.radius.chip,
        border: `1px solid ${theme.colors.hairline}`,
        background: theme.colors.white,
        opacity: op,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 4, background: theme.colors.cyan }} />
      <span style={{ fontSize: 20, fontWeight: theme.font.weights.semibold, color: theme.colors.grey, letterSpacing: 0.3 }}>
        Illustration
      </span>
    </div>
  );
