/**
 * Scene 16 — Sources converge (comp 4141–4457, dur 316). Five scattered source
 * chips (Announcements · News · Sentiment · Research · Financials) converge and
 * lock into one structured card; "Decide Faster" lands beneath. Frame = local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Chip } from "../components";
import { tween, textReveal, clamp01 } from "../helpers";

const CONV = Math.round(4.0 * 30); // @4.0s converge
const LOCK = Math.round(7.5 * 30); // @7.5s lock into a card
const LABEL = Math.round(9.0 * 30); // @9.0s Decide Faster

const SOURCES = [
  { label: "Announcements", scatter: [140, 240], },
  { label: "News", scatter: [1420, 300] },
  { label: "Sentiment", scatter: [220, 720] },
  { label: "Research", scatter: [1380, 700] },
  { label: "Financials", scatter: [760, 200] },
];
const TARGET_X = 720;
const TARGET_Y0 = 340;
const ROW_H = 76;

export const Scene16 = () => {
  const f = useCurrentFrame();
  const t = clamp01((f - CONV) / (LOCK - CONV));
  const card = textReveal(f, LOCK, 16);
  const label = textReveal(f, LABEL, 16);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* lock card */}
      <div style={{ position: "absolute", left: TARGET_X - 40, top: TARGET_Y0 - 30, width: 520, height: ROW_H * 5 + 20, borderRadius: theme.radius.card, border: `2px solid ${theme.colors.indigo}`, background: theme.colors.cardBg, ...card }} />

      {SOURCES.map((s, i) => {
        const tx = s.scatter[0] + (TARGET_X - s.scatter[0]) * t;
        const ty = s.scatter[1] + (TARGET_Y0 + i * ROW_H - s.scatter[1]) * t;
        const op = tween(f, [Math.round(0.5 * 30), Math.round(0.5 * 30) + 16], [0, 1]);
        return (
          <div key={s.label} style={{ position: "absolute", left: tx, top: ty, opacity: op }}>
            <Chip label={s.label} tone="indigo" active={t > 0.9} dot fontSize={28} />
          </div>
        );
      })}

      <div style={{ position: "absolute", left: TARGET_X - 40, top: TARGET_Y0 + ROW_H * 5 + 12, width: 520, textAlign: "center", fontSize: 40, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, ...label }}>
        Decide Faster
      </div>
    </AbsoluteFill>
  );
};
