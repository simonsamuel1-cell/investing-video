/**
 * IllustrationTag — compliance tag, flush in the bottom-left corner (margin
 * intentionally ignored). Mounted in every chart-bearing scene (SC01–07, SC09–16).
 *
 * ⚠ NOT IN THE INDONESIAN CUT — Simon: "Label 'Only illustration' hapus aja
 * sepanjang video". The English cut keeps the plain grey line it always had.
 */
import { useContext } from "react";
import { theme } from "../theme";
import { Cut } from "../cut";

export const IllustrationTag = () =>
  useContext(Cut) === "indo" ? null : (
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
