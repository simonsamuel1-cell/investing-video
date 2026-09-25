/**
 * IllustrationTag — compliance tag, flush in the bottom-left corner (margin
 * intentionally ignored). Mounted in every chart-bearing scene (SC01–07, SC09–16).
 *
 * The Indonesian cut draws it as a pill — Simon: "Ganti style 'Only
 * illustration' jadi pill design dan ada icon lingkaran di kiri text. text
 * warna putih, pill warna indigo, lingkaran warna hijau". The English cut keeps
 * the plain grey line it always had.
 */
import { useContext } from "react";
import { theme } from "../theme";
import { Cut } from "../cut";

const PILL = { padX: 18, padY: 8, dot: 12, gap: 10 };

export const IllustrationTag = () =>
  useContext(Cut) === "indo" ? (
    <div
      style={{
        position: "absolute",
        left: 24,
        bottom: 20,
        display: "flex",
        alignItems: "center",
        gap: PILL.gap,
        padding: `${PILL.padY}px ${PILL.padX}px`,
        borderRadius: 999,
        background: theme.colors.indigo,
        color: theme.colors.neutralFill,
        fontSize: 24,
        fontWeight: 500,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          width: PILL.dot,
          height: PILL.dot,
          borderRadius: PILL.dot / 2,
          background: theme.colors.tagDot,
          flexShrink: 0,
        }}
      />
      only illustration
    </div>
  ) : (
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
