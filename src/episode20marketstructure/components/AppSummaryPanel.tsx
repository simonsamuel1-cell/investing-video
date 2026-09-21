/**
 * AppSummaryPanel.tsx — the FALLBACK for SC17's right-hand pane.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ [NEEDS ASSET] Tuntun app screen recording — the trend & momentum summary │
 * │ panel. When it lands it replaces this component VERBATIM: stage the file │
 * │ in public/ and mount an <OffthreadVideo/> in the same rect. Do NOT       │
 * │ delete this note before the recording exists.                            │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Until then this draws the SHAPE of that panel and nothing else: two rows, two
 * neutral gauges, and a placeholder value. It deliberately shows no reading.
 * Inventing one would be faking product UI, and it would style a call as
 * advice — which is exactly what the compliance note forbids.
 */
import { theme } from "../theme";
import { clamp01, type Rect } from "../helpers";

const ROWS = ["Tren", "Momentum"] as const;

export const AppSummaryPanel = ({ rect, reveal }: { rect: Rect; reveal: number }) => (
  <>
    {ROWS.map((row, i) => {
      const y = rect.y + 210 + i * 152;
      const p = clamp01(reveal * 2 - i * 0.4);
      return (
        <div key={row}>
          <div
            style={{
              position: "absolute",
              left: rect.x + 72,
              top: y,
              transform: "translate(0, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.body.size,
              fontWeight: 600,
              color: theme.color.ink,
              opacity: p,
            }}
          >
            {row}
          </div>
          {/* a gauge that shows there IS a gauge, not what it reads */}
          <div
            style={{
              position: "absolute",
              left: rect.x + 72,
              top: y + 46,
              width: (rect.w - 144) * p,
              height: 16,
              borderRadius: 999,
              background: theme.color.indigoWashStrong,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: rect.x + rect.w - 72,
              top: y,
              transform: "translate(-100%, -50%)",
              color: theme.color.slate,
              fontFamily: theme.text.family,
              fontSize: theme.text.axis.size,
              fontWeight: theme.text.axis.weight,
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
        left: rect.x + rect.w / 2,
        top: rect.y + rect.h - 72,
        transform: "translate(-50%, -50%)",
        fontFamily: theme.text.family,
        fontSize: theme.text.axis.size,
        fontWeight: theme.text.axis.weight,
        color: theme.color.faint,
        opacity: reveal,
      }}
    >
      Ringkasan aplikasi
    </div>
  </>
);
