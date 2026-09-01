/**
 * core/SourceTag.tsx — the ticker credit.
 *
 * ⚠ STANDING RULE FROM SIMON: THE WORD IS NEVER PUT ON SCREEN.
 *
 * This component used to print an illustrative-source tag over any chart that
 * was traced or generated. It no longer prints anything for those — his call,
 * and it is enforced HERE rather than by deleting the tag scene by scene, so a
 * later scene cannot bring the word back by mounting this again.
 *
 * What survives is the half that is a credit rather than a disclaimer: a REAL
 * OHLC export still prints its ticker and timeframe. `kind` still travels with
 * the Series and still decides — a generated series simply renders nothing.
 *
 * ⚠ SO THIS RENDERS NOTHING UNLESS THE DATA IS REAL. Mounting it is harmless
 * and still correct; the scenes keep their calls so that swapping a generated
 * series for a real export brings the credit back by itself.
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
  /* ⚠ ONLY REAL DATA PRINTS. See the header — the illustrative tag is gone by
     standing instruction, and a generated series draws no text at all. */
  const text = kind === "market" ? label : undefined;
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
