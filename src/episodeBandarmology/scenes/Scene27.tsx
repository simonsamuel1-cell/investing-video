/**
 * Scene 27 — Verify: insider + foreign (7058, dur 271). Two cards: "Insider
 * Buying" filings (Director · Buy · 1.2 M · Rp 1,210) and "Foreign Net Buy (Large
 * Cap)" — a 10-day all-positive bar series, +Rp 312 Bn cumulative. The "tends to"
 * qualifier is a soft "Reliability: Moderate" sub-tag, not a guarantee.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea, Card } from "../components";
import { theme } from "../theme";
import { textReveal, fadeIn } from "../helpers";

const { colors, font, type, radius } = theme;

const FOREIGN = [0.3, 0.42, 0.38, 0.55, 0.6, 0.52, 0.7, 0.78, 0.72, 0.9];

const Reliability = () => (
  <span style={{ position: "absolute", right: 28, top: 28, padding: "8px 18px", borderRadius: radius.sm, border: `2px dashed ${colors.cyan}`, color: colors.cyanDeep, fontSize: type.chip, fontWeight: font.weights.bold, opacity: 0.8 }}>Reliability: Moderate</span>
);

export const Scene27 = () => {
  const f = useCurrentFrame();
  return (
    <SafeArea>
      <div style={{ position: "absolute", left: 96, top: 210, width: 1272, fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, ...textReveal(f, 8, 18) }}>
        Two more clues
      </div>

      {/* insider buying */}
      <div style={{ position: "absolute", left: 96, top: 320, opacity: fadeIn(f, 20, 18) }}>
        <Card width={740} height={420} title="Insider Buying">
          <Reliability />
          <div style={{ marginTop: 12 }}>
            {[["Filing", "Director · Buy"], ["Volume", "1.2 M lot"], ["Price", "Rp 1,210"], ["Date", "Last filing"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${colors.divider}`, fontSize: type.descriptor }}>
                <span style={{ color: colors.slate }}>{k}</span>
                <span style={{ fontWeight: font.weights.bold, color: colors.text, fontVariantNumeric: "tabular-nums" }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* foreign net buy */}
      <div style={{ position: "absolute", left: 900, top: 320, opacity: fadeIn(f, 90, 18) }}>
        <Card width={780} height={420} title="Foreign Net Buy (Large Cap)">
          <Reliability />
          <svg width={720} height={240} viewBox="0 0 720 240" style={{ marginTop: 20 }}>
            <line x1={0} y1={220} x2={720} y2={220} stroke={colors.slateFaint} strokeWidth={2} />
            {FOREIGN.map((v, i) => (
              <rect key={i} x={20 + i * 68} y={220 - v * 190} width={44} height={v * 190} rx={4} fill={colors.cyan} opacity={fadeIn(f, 100 + i * 8, 12)} />
            ))}
          </svg>
          <div style={{ fontSize: type.subhead, fontWeight: font.weights.extrabold, color: colors.cyanDeep, marginTop: 12, fontVariantNumeric: "tabular-nums" }}>+Rp 312 Bn cumulative</div>
        </Card>
      </div>

    </SafeArea>
  );
};
