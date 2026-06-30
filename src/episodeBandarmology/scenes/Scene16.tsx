/**
 * Scene 16 — Mistake 1: One Day (3962, dur 271). A single isolated greyed bar
 * ("snapshot") vs a multi-day indigo pattern over a timeline. The single bar
 * shakes/dismisses (~f120; UI element, bounce OK); the pattern stays. Label
 * "1 · One Day Tells You Almost Nothing", sub "Pattern Over Time".
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, textReveal } from "../helpers";

const { colors, font, type } = theme;

const HEIGHTS = [120, 90, 150, 110, 170, 140, 190];

export const Scene16 = () => {
  const f = useCurrentFrame();
  const shake = f > 120 && f < 150 ? Math.sin((f - 120) * 1.6) * 10 : 0;
  const dismissOp = fadeOut(f, 150, 18);

  return (
    <SafeArea>
      {/* snapshot single bar */}
      <div style={{ position: "absolute", left: 200, top: 280, opacity: dismissOp, transform: `translateX(${shake}px)` }}>
        <svg width={200} height={360} viewBox="0 0 200 360">
          <rect x={60} y={140} width={80} height={200} rx={6} fill={colors.slateFaint} />
        </svg>
        <div style={{ textAlign: "center", fontSize: type.chip, fontWeight: font.weights.bold, color: colors.slateMute }}>Snapshot</div>
      </div>

      {/* multi-day pattern */}
      <div style={{ position: "absolute", left: 620, top: 280 }}>
        <svg width={1000} height={360} viewBox="0 0 1000 360">
          {HEIGHTS.map((h, i) => (
            <rect key={i} x={40 + i * 130} y={340 - h} width={84} height={h} rx={6} fill={colors.indigo} opacity={fadeIn(f, 20 + i * 12, 16)} />
          ))}
        </svg>
        <div style={{ textAlign: "center", fontSize: type.chip, fontWeight: font.weights.bold, color: colors.indigoDeep }}>Pattern Over Time</div>
      </div>

      <div style={{ position: "absolute", left: 96, top: 720, width: 1600, ...textReveal(f, 8, 18) }}>
        <div style={{ fontSize: type.header, fontWeight: font.weights.extrabold }}>1 · One Day Tells You Almost Nothing</div>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, marginTop: 10 }}>Pattern Over Time</div>
      </div>
    </SafeArea>
  );
};
