/**
 * AppSummaryPanel — the FALLBACK for SC17's right-hand pane.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ [NEEDS ASSET] Tuntun app screen recording — the trend & momentum summary │
 * │ panel. When it lands it replaces this component VERBATIM: stage the file │
 * │ in public/ and mount an <OffthreadVideo/> in the same box. Do NOT delete │
 * │ this TODO before the recording exists.                                   │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Until then this draws the STRUCTURE of that panel only — two rows, two
 * neutral gauge bars, and a slate placeholder value chip. It deliberately
 * renders no directional reading: inventing one would be faking product UI and
 * would style a call as advice, which the compliance note forbids outright.
 */
import { theme } from "../theme";
import { clamp01 } from "../helpers";

const ROWS = ["Tren", "Momentum"];

export const AppSummaryPanel = ({
  box,
  reveal,
}: {
  box: { x: number; y: number; w: number; h: number };
  reveal: number;
}) => (
  <>
    {ROWS.map((r, i) => {
      const y = box.y + 200 + i * 150;
      const p = clamp01(reveal * 2 - i * 0.4);
      return (
        <div key={r}>
          <div
            style={{
              position: "absolute",
              left: box.x + 70,
              top: y,
              transform: "translate(0, -50%)",
              fontFamily: theme.type.family,
              fontSize: theme.type.label.size,
              fontWeight: theme.type.label.weight,
              color: theme.colors.ink,
              opacity: p,
            }}
          >
            {r}
          </div>
          {/* a neutral gauge: it shows the panel has a gauge, not what it says */}
          <div
            style={{
              position: "absolute",
              left: box.x + 70,
              top: y + 44,
              width: (box.w - 140) * p,
              height: 16,
              borderRadius: theme.radius.pill,
              background: theme.colors.indigoTint14,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: box.x + box.w - 70,
              top: y,
              transform: "translate(-100%, -50%)",
              padding: "6px 16px",
              borderRadius: theme.radius.chip,
              border: `${theme.stroke.hair}px solid ${theme.colors.muted}`,
              color: theme.colors.slate,
              fontFamily: theme.type.family,
              fontSize: theme.type.axis.size,
              fontWeight: theme.type.axis.weight,
              opacity: p,
            }}
          >
            —
          </div>
        </div>
      );
    })}
    <div
      style={{
        position: "absolute",
        left: box.x + box.w / 2,
        top: box.y + box.h - 70,
        transform: "translate(-50%, -50%)",
        fontFamily: theme.type.family,
        fontSize: theme.type.axis.size,
        fontWeight: theme.type.axis.weight,
        color: theme.colors.muted,
        opacity: reveal,
      }}
    >
      Ringkasan aplikasi
    </div>
  </>
);
