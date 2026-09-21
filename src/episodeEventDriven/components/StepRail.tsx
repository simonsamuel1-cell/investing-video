/**
 * StepRail — numbered recap cards joined by an indigo connector. Cards
 * accumulate 1→2→3 across Scenes 24–26. Each card and each connector segment
 * reveals on its own onset; a simple glyph sits beside each title.
 */
import { theme } from "../theme";
import { textReveal, clamp01 } from "../helpers";

const c = theme.colors;

export type RailCard = { n: number; title: string; glyph: "event" | "candle" | "check"; at: number; connectAt?: number };

const Glyph = ({ kind }: { kind: RailCard["glyph"] }) => {
  if (kind === "event")
    return (
      <svg width={40} height={40} viewBox="0 0 40 40"><rect x={6} y={8} width={28} height={24} rx={5} fill="none" stroke={c.indigo} strokeWidth={2.5} /><line x1={6} y1={16} x2={34} y2={16} stroke={c.indigo} strokeWidth={2.5} /><circle cx={13} cy={5} r={2.5} fill={c.indigo} /><circle cx={27} cy={5} r={2.5} fill={c.indigo} /></svg>
    );
  if (kind === "candle")
    return (
      <svg width={40} height={40} viewBox="0 0 40 40"><line x1={13} y1={6} x2={13} y2={34} stroke={c.indigo} strokeWidth={2.5} /><rect x={9} y={13} width={8} height={14} fill={c.indigo} /><rect x={23} y={22} width={10} height={12} rx={2} fill={c.cyan} /></svg>
    );
  return (
    <svg width={40} height={40} viewBox="0 0 40 40"><circle cx={20} cy={20} r={16} fill="none" stroke={c.indigo} strokeWidth={2.5} /><path d="M12 20 L18 26 L28 14" fill="none" stroke={c.indigo} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
};

export const StepRail = ({
  x,
  y,
  cardW = 500,
  gap = 60,
  cards,
  frame,
}: {
  x: number;
  y: number;
  cardW?: number;
  gap?: number;
  cards: RailCard[];
  frame: number;
}) => (
  <>
    {cards.map((card, i) => {
      if (frame < card.at) return null;
      const cxPos = x + i * (cardW + gap);
      const connect = card.connectAt != null && i > 0;
      return (
        <div key={card.n}>
          {connect && frame >= (card.connectAt as number) && (
            <div style={{ position: "absolute", left: cxPos - gap - 4, top: y + 58, width: (gap + 8) * clamp01((frame - (card.connectAt as number)) / 16), height: 4, background: c.indigo, borderRadius: 2 }} />
          )}
          <div style={{ position: "absolute", left: cxPos, top: y, width: cardW, padding: "26px 30px", background: c.cardBg, border: `2px solid ${c.indigo}`, borderRadius: theme.radius.card, boxShadow: "0 12px 30px rgba(0,0,0,0.06)", ...textReveal(frame, card.at, 16) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              <span style={{ width: 46, height: 46, borderRadius: "50%", background: c.indigo, color: c.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: theme.font.weights.extrabold }}>{card.n}</span>
              <Glyph kind={card.glyph} />
            </div>
            <div style={{ fontSize: 30, fontWeight: theme.font.weights.bold, color: c.text }}>{card.title}</div>
          </div>
        </div>
      );
    })}
  </>
);
