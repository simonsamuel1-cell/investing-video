/**
 * SC17 — App: trend & momentum as a second opinion (from 8208, dur 347) — INDEPENDENT.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │ [NEEDS ASSET] Tuntun app screen recording — the trend & momentum summary │
 * │ panel. When it arrives it replaces the right-hand card VERBATIM: drop it │
 * │ in public/app/ and swap <SummaryFallback/> for an <OffthreadVideo/> in    │
 * │ the same box. Nothing else in the scene changes.                         │
 * │                                                                          │
 * │ Until then the right pane is a BRAND-DRAWN panel showing the structure   │
 * │ of that summary only — two rows and two neutral gauges. It deliberately   │
 * │ renders no directional value: inventing an app reading would be faking    │
 * │ product UI, which is worse than shipping a placeholder.                   │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * The ordering is the compliance point and the teaching point at once: read it
 * yourself first, then check. The badges say so in that order, and the left
 * pane is re-lit before the right on the closing beat.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartCard } from "../components/ChartCard";
import { PriceLine } from "../components/PriceLine";
import { PivotMarker } from "../components/PivotMarker";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { usePalette } from "../palette";
import { progress, fadeIn } from "../helpers";
import { UPTREND, UP_PEAKS, UP_TROUGHS, geom } from "../data/structures";
import { CAPTION_Y, paneBox } from "../layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const T = {
  panel: 22, // "ringkasan tren dan momentum"
  badges: 176, // "second opinion"
  order: 228, // "membaca struktur harganya sendiri lebih dulu"
};
const PANE_L = paneBox(0);
const PANE_R = paneBox(1);
const BOX = { x: PANE_L.x + 70, y: PANE_L.y + 110, w: PANE_L.w - 140, h: PANE_L.h - 260 };
/** The two rows the app's summary panel is built from. */
const ROWS = ["Tren", "Momentum"];
// ═══════════════════════════════════════════════════════════════════════════

const G = geom(UPTREND, BOX, { pad: 0.14 });

/** The drawn stand-in for the app panel. Structure only — no reading shown. */
const SummaryFallback = ({ reveal }: { reveal: number }) => {
  const pal = usePalette();
  return (
    <>
      {ROWS.map((r, i) => {
        const y = PANE_R.y + 200 + i * 150;
        const p = Math.max(0, Math.min(1, reveal * 2 - i * 0.4));
        return (
          <div key={r}>
            <div
              style={{
                position: "absolute",
                left: PANE_R.x + 70,
                top: y,
                transform: "translate(0, -50%)",
                fontFamily: theme.type.family,
                fontSize: theme.type.label.size,
                fontWeight: 600,
                color: pal.ink,
                opacity: p,
              }}
            >
              {r}
            </div>
            <div
              style={{
                position: "absolute",
                left: PANE_R.x + 70,
                top: y + 44,
                width: (PANE_R.w - 140) * p,
                height: 16,
                borderRadius: 8,
                background: pal.indigoTint14,
                overflow: "hidden",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: PANE_R.x + PANE_R.w - 70,
                top: y,
                transform: "translate(-100%, -50%)",
                padding: "6px 16px",
                borderRadius: theme.radius.chip,
                border: `${theme.stroke.hair}px solid ${pal.muted}`,
                color: pal.slate,
                fontFamily: theme.type.family,
                fontSize: theme.type.axis.size,
                fontWeight: 600,
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
          left: PANE_R.x + PANE_R.w / 2,
          top: PANE_R.y + PANE_R.h - 70,
          transform: "translate(-50%, -50%)",
          fontFamily: theme.type.family,
          fontSize: theme.type.axis.size,
          fontWeight: 500,
          color: pal.muted,
          opacity: reveal,
        }}
      >
        Ringkasan aplikasi
      </div>
    </>
  );
};

export const Scene17 = () => {
  const pal = usePalette();
  const f = useCurrentFrame();

  const panel = f >= T.panel ? progress(f, T.panel, 34) : 0;
  const draw = progress(f, 0, 70);
  // on the closing line the left pane is lit first, the right one after it
  const liftL = f >= T.order ? 1 : 0.85;
  const liftR = f >= T.order + 40 ? 1 : 0.85;

  return (
    <SafeArea>
      {/* your own reading */}
      <div style={{ position: "absolute", inset: 0, opacity: liftL }}>
        <ChartCard box={PANE_L}>
          <PriceLine g={G} draw={draw} color={pal.ink} width={3} />
          {[...UP_PEAKS, ...UP_TROUGHS].map((pi, i) => {
            const p = G.pivot(pi);
            return <PivotMarker key={pi} x={p.x} y={p.y} variant={UP_PEAKS.includes(pi) ? "indigo" : "cyan"} startFrame={30 + i * 9} />;
          })}
          <Chip label="Analisis Sendiri" x={PANE_L.x + PANE_L.w / 2} y={PANE_L.y + 56} variant="indigo" startFrame={0} />
        </ChartCard>
      </div>

      {/* the app's summary, arriving second and staying second */}
      <div style={{ position: "absolute", inset: 0, opacity: liftR * panel, transform: `translateX(${(1 - panel) * 70}px)` }}>
        <ChartCard box={PANE_R} opacity={fadeIn(f, T.panel, 24)}>
          <Chip label="Tren & Momentum" x={PANE_R.x + PANE_R.w / 2} y={PANE_R.y + 56} variant="cyan" startFrame={T.panel} />
          <SummaryFallback reveal={panel} />
        </ChartCard>
      </div>

      <Chip label="1. Baca Sendiri" x={PANE_L.x + PANE_L.w / 2} y={CAPTION_Y} variant="indigo" startFrame={T.badges} />
      <Chip label="2. Second Opinion" x={PANE_R.x + PANE_R.w / 2} y={CAPTION_Y} variant="cyan" startFrame={T.badges + 18} />
    </SafeArea>
  );
};
