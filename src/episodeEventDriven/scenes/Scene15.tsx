/**
 * Scene 15 — Tuntun AI Key Events (comp 3535–4132, dur 597). Stock page → News
 * tab → "Tuntun AI · Key Events" is a [NEEDS ASSET] recording (spec §7): a
 * PhoneFrame placeholder holds the left slot. A Scorecard builds the factor rows
 * on the right. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { PhoneFrame, Scorecard } from "../components";
import type { ScoreRow } from "../components";
import { textReveal } from "../helpers";

const PANEL = Math.round(3.5 * 30); // @3.5s Tuntun AI panel
const ROWS = Math.round(7.0 * 30); // @7.0s first row (then every ~2s)

const ROW_DATA: ScoreRow[] = [
  { label: "Market Share", kind: "gauge", value: 0.72 },
  { label: "Profit Margins", kind: "bar", value: 0.64 },
  { label: "Valuation", kind: "gauge", value: 0.48 },
  { label: "Financial Performance", kind: "bar", value: 0.8 },
  { label: "Price & Volume", kind: "beforeafter", value: 0, before: 0.5, after: 0.9 },
];

export const Scene15 = () => {
  const f = useCurrentFrame();
  const cap = f < Math.round(0.5 * 30) ? "loading…" : f < PANEL ? "Stock page · News tab" : "Tuntun AI · Key Events";
  const head = textReveal(f, PANEL, 16);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <PhoneFrame cx={470} top={250} height={640} op={1} caption={`Scene 15 · ${cap}`} />

      <div style={{ position: "absolute", left: 840, top: 250, fontSize: 32, fontWeight: theme.font.weights.extrabold, color: theme.colors.indigo, ...head }}>
        Tuntun AI · Key Events
      </div>
      <Scorecard x={840} y={310} w={984} rows={ROW_DATA} frame={f} start={ROWS} rowStagger={Math.round(2.2 * 30)} />
    </AbsoluteFill>
  );
};
