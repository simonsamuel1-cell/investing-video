/**
 * Scene 17 — Company + sector sync (comp 4460–4660, dur 200). A company card
 * (left) and a sector panel (right); the sector rows light in sync with the
 * company, then a "Validation" chip lands. No arrows. Illustration. Frame=local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Chip, Illustration } from "../components";
import { textReveal, clamp01, pop } from "../helpers";

const c = theme.colors;
const COMPANY = Math.round(0.5 * 30); // @0.5s
const PANEL = Math.round(2.0 * 30); // @2.0s
const SYNC = Math.round(3.5 * 30); // @3.5s
const CHIP = Math.round(5.0 * 30); // @5.0s

const SECTORS = ["Sector Peer A", "Sector Peer B", "Sector Peer C"];

export const Scene17 = () => {
  const f = useCurrentFrame();
  const company = textReveal(f, COMPANY, 16);
  const panel = textReveal(f, PANEL, 16);
  const chip = pop(f, CHIP, 14);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* company card */}
      <div style={{ position: "absolute", left: 200, top: 340, width: 520, height: 360, borderRadius: theme.radius.card, background: c.cyanTint, border: `2px solid ${c.cyan}`, padding: 32, boxSizing: "border-box", ...company }}>
        <div style={{ fontSize: 22, color: c.grey, fontWeight: theme.font.weights.semibold }}>The Company</div>
        <div style={{ fontSize: 42, color: c.text, fontWeight: theme.font.weights.extrabold, marginTop: 10 }}>Event Confirmed</div>
        <div style={{ marginTop: 22, height: 14, borderRadius: 7, background: c.cyan, width: "82%" }} />
      </div>

      {/* sector panel */}
      <div style={{ position: "absolute", left: 1000, top: 340, width: 620, borderRadius: theme.radius.card, background: c.cardBg, border: `1px solid ${c.cardBorder}`, padding: 28, boxSizing: "border-box", ...panel }}>
        <div style={{ fontSize: 22, color: c.grey, fontWeight: theme.font.weights.semibold, marginBottom: 16 }}>The Sector</div>
        {SECTORS.map((s, i) => {
          const lit = clamp01((f - (SYNC + i * 10)) / 14);
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: i === 0 ? "none" : `1px solid ${c.hairline}` }}>
              <span style={{ fontSize: 26, color: c.text, fontWeight: theme.font.weights.medium }}>{s}</span>
              <span style={{ width: 220, height: 12, borderRadius: 6, background: c.hairline, overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${lit * 100}%`, background: c.indigo }} />
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 1000, top: 720, opacity: chip.opacity, transform: `scale(${chip.scale})`, transformOrigin: "left center" }}>
        <Chip label="Validation" tone="indigo" active dot fontSize={28} />
      </div>
      <Illustration op={clamp01((f - COMPANY) / 16)} />
    </AbsoluteFill>
  );
};
