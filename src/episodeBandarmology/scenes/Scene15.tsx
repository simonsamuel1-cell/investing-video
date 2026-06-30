/**
 * Scene 15 — Five Classic Mistakes Intro (3797, dur 157). A generic "Broker
 * Summary" panel (no real brokers/tickers) appears; a translucent surface line
 * cuts across (~f40); title "Five Classic Mistakes" resolves (~f70); five empty
 * numbered slots 1–5 fade in as a roadmap (~f100–150), cyan-outlined.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components";
import { theme } from "../theme";
import { fadeIn, tween, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

export const Scene15 = () => {
  const f = useCurrentFrame();
  const surface = tween(f, [40, 90], [0, 1]);

  return (
    <SafeArea>
      {/* generic Broker Summary panel */}
      <div style={{ position: "absolute", left: 96, top: 110, width: 760, height: 320, background: colors.card, border: `2px solid ${colors.divider}`, borderRadius: radius.lg, padding: 28, opacity: fadeIn(f, 0, 18) }}>
        <div style={{ fontSize: type.descriptor, fontWeight: font.weights.bold, color: colors.slate, marginBottom: 18 }}>Broker Summary</div>
        {["Broker A", "Broker B", "Broker C"].map((b, i) => (
          <div key={b} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <span style={{ width: 130, fontSize: type.chip, color: colors.slateMute }}>{b}</span>
            <div style={{ height: 18, width: 360 - i * 90, background: colors.indigoTint, borderRadius: 6 }} />
          </div>
        ))}
        {/* translucent surface line */}
        <div style={{ position: "absolute", left: 0, top: 40 + surface * 220, width: "100%", height: 3, background: colors.cyan, opacity: 0.5 * surface }} />
      </div>

      <div style={{ position: "absolute", left: 920, top: 150, width: 800, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 70, 18) }}>
        Five Classic Mistakes
      </div>

      {/* five empty numbered slots */}
      <div style={{ position: "absolute", left: 920, top: 300, width: 800, display: "flex", flexDirection: "column", gap: 18 }}>
        {[1, 2, 3, 4, 5].map((n, i) => (
          <div
            key={n}
            style={{
              height: 96,
              borderRadius: radius.md,
              border: `2px solid ${colors.cyan}`,
              display: "flex",
              alignItems: "center",
              paddingLeft: 26,
              gap: 20,
              opacity: fadeIn(f, 100 + i * 12, 16),
            }}
          >
            <span style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.cyanDeep }}>{n}</span>
            <span style={{ fontSize: type.chip, color: colors.slateMute }}>—</span>
          </div>
        ))}
      </div>
    </SafeArea>
  );
};
