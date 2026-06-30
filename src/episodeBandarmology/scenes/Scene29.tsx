/**
 * Scene 29 — Clues line up: confluence (7616, dur 178). Four toggle-chips
 * (Shareholder Count ↓ · Insider Buy · Foreign Buy · Quiet Squeeze); three flip
 * "on" (cyan, bounce OK); a "Confluence" Gauge firms up but stays CAPPED (echo
 * Sc21). Label (sentence case). Badge "3 / 4 aligned."
 */
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SafeArea, Gauge } from "../components";
import { theme } from "../theme";
import { tween, textReveal, fadeIn, popIn } from "../helpers";

const { colors, font, type, radius } = theme;

const CLUES = [
  { label: "Shareholder Count ↓", on: true, at: 20 },
  { label: "Insider Buy", on: true, at: 50 },
  { label: "Foreign Buy", on: true, at: 80 },
  { label: "Quiet Squeeze", on: false, at: 110 },
];

export const Scene29 = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const conf = tween(f, [40, 150], [0.15, 0.62]);

  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        The clues line up
      </div>

      <div style={{ position: "absolute", left: 150, top: 350, width: 760, display: "flex", flexDirection: "column", gap: 22 }}>
        {CLUES.map((c) => {
          const lit = c.on && f >= c.at + 8;
          return (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 18, opacity: fadeIn(f, c.at, 12) }}>
              <span style={{ transform: `scale(${lit ? popIn(f, fps, c.at, true) : 1})`, transformOrigin: "left center", padding: "14px 28px", borderRadius: radius.pill, background: lit ? colors.cyan : colors.cardWhite, border: `2px solid ${c.on ? colors.cyan : colors.divider}`, color: lit ? colors.white : colors.slateMute, fontSize: type.descriptor, fontWeight: font.weights.bold }}>{c.label}</span>
              {!c.on && <span style={{ fontSize: type.chip, color: colors.slateMute }}>not yet</span>}
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 1010, top: 400, width: 660 }}>
        <Gauge left={0} top={0} width={620} value={conf} cap={0.7} label="Confluence" capLabel="Capped — steadier, not certain" op={fadeIn(f, 60, 18)} />
        <div style={{ marginTop: 130, fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.indigoDeep }}>3 / 4 aligned</div>
      </div>

      <div style={{ position: "absolute", left: 96, top: 840, width: 1600, fontSize: type.descriptor, fontWeight: font.weights.medium, color: colors.slate, ...textReveal(f, 130, 18) }}>
        When several line up, your read gets steadier.
      </div>
    </SafeArea>
  );
};
