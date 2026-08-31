/**
 * core/SourceTag.tsx — the "Ilustrasi" tag, and the ticker credit.
 *
 * ⚠ THIS IS COMPLIANCE, NOT DECORATION.
 *
 * A chart drawn from a traced screenshot or generated from a shape is NOT a
 * market, and the frame must say so. A chart from a real OHLC export is, and
 * must not be tagged as illustrative.
 *
 * The kind travels with the Series, so a scene cannot lose the tag by
 * forgetting it — pass `series.kind` and the right thing renders. Swap a traced
 * series for a real export and the tag comes off by itself.
 */
import { theme } from "./theme";
import { usePalette } from "./palette";
import type { SourceKind } from "./chart/series";

export const SourceTag = ({
  kind,
  label,
  x = theme.stage.card.x + theme.stage.card.w,
  y = theme.stage.card.y - 18,
  anchor = "right",
}: {
  kind: SourceKind;
  /** Ticker and timeframe for real data, e.g. "GGRM · 1D · IDX". */
  label?: string;
  x?: number;
  y?: number;
  anchor?: "left" | "right";
}) => {
  const c = usePalette();
  const text =
    kind === "market"
      ? label
      : label
        ? `${label} · Ilustrasi`
        : "Ilustrasi";
  if (!text) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${anchor === "right" ? "-100%" : "0"}, -100%)`,
        fontFamily: theme.text.family,
        fontSize: theme.text.axis.size,
        fontWeight: theme.text.axis.weight,
        color: c.muted,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
