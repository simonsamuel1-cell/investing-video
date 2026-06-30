/**
 * Scene 12 — The Nego Market (2849, dur 249). A fifth dashed-border card "Nego
 * Market" slides in, set apart/offset behind a central "Screen" panel; two large
 * blocks move directly between two private nodes, bypassing the central screen.
 * "Nego Market" kept verbatim.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

export const Scene12 = () => {
  const f = useCurrentFrame();
  const negoX = tween(f, [30, 80], [1500, 1180]);
  const block = tween(f, [110, 200], [0, 1]);

  // two private nodes (left, right) with a bypass arc around the central screen
  const ax = 320;
  const bx = 1600;
  const ay = 720;
  const bxPos = ax + (bx - ax) * block;
  const byPos = ay + Math.sin(block * Math.PI) * 150; // arc dips below the screen

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 110,
          width: 1272,
          fontSize: type.header,
          fontWeight: font.weights.extrabold,
          ...textReveal(f, 8, 18),
        }}
      >
        Off The Normal Screen
      </div>

      {/* central Screen panel */}
      <div style={{ position: "absolute", left: 660, top: 300, width: 600, height: 360, background: colors.card, border: `2px solid ${colors.divider}`, borderRadius: radius.lg, opacity: fadeIn(f, 10, 18), display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.slate }}>Normal Screen</div>
        <svg width={420} height={140} viewBox="0 0 420 140" stroke={colors.indigo} strokeWidth={3} fill="none">
          <path d="M 10 110 L 90 70 L 160 90 L 240 40 L 320 60 L 410 30" />
        </svg>
      </div>

      {/* dashed Nego Market card offset behind-right */}
      <div style={{ position: "absolute", left: negoX, top: 250, width: 560, height: 320, background: colors.indigoSoft, border: `2px dashed ${colors.indigo}`, borderRadius: radius.lg, opacity: fadeIn(f, 30, 18), display: "flex", alignItems: "flex-start", padding: 28 }}>
        <div style={{ fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.indigoDeep }}>Nego Market</div>
      </div>

      {/* two private nodes + bypass blocks */}
      <svg width={1728} height={500} viewBox="0 0 1728 500" style={{ position: "absolute", left: 96, top: 470, overflow: "visible" }}>
        <circle cx={ax - 96} cy={ay - 470} r={40} fill={colors.indigo} opacity={fadeIn(f, 90, 14)} />
        <circle cx={bx - 96} cy={ay - 470} r={40} fill={colors.indigo} opacity={fadeIn(f, 90, 14)} />
        <rect x={bxPos - 96 - 36} y={byPos - 470 - 36} width={72} height={72} rx={8} fill={colors.cyan} opacity={block > 0 && block < 1 ? 1 : 0} />
      </svg>
    </SafeArea>
  );
};
