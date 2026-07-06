/**
 * NewsFeed — stacked news cards with a timestamp, an optional "New" chip and a
 * clock icon. Cards stagger in on their onsets. Used by the Hook group. An
 * optional bottom "button" (e.g. "Click") is exposed for the cursor beats.
 */
import { theme } from "../theme";
import { textReveal } from "../helpers";

const c = theme.colors;

export type NewsItem = { title: string; time: string; at: number; isNew?: boolean };

const Clock = ({ op }: { op: number }) => (
  <svg width={22} height={22} viewBox="0 0 22 22" style={{ opacity: op }}><circle cx={11} cy={11} r={9} fill="none" stroke={c.grey} strokeWidth={2} /><path d="M11 6 L11 11 L15 13" fill="none" stroke={c.grey} strokeWidth={2} strokeLinecap="round" /></svg>
);

export const NewsFeed = ({
  x,
  y,
  w,
  items,
  frame,
  newChipStart,
  button,
  buttonHighlight = 0,
}: {
  x: number;
  y: number;
  w: number;
  items: NewsItem[];
  frame: number;
  newChipStart?: number;
  button?: string;
  buttonHighlight?: number;
}) => {
  let stack = 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      {items.map((it, i) => {
        const top = stack;
        stack += 120;
        if (frame < it.at) return null;
        const showChip = it.isNew && newChipStart != null && frame >= newChipStart;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top, width: w, height: 100, padding: "18px 24px", boxSizing: "border-box", background: c.cardBg, border: `1px solid ${c.cardBorder}`, borderRadius: theme.radius.card, boxShadow: "0 8px 22px rgba(0,0,0,0.05)", ...textReveal(frame, it.at, 16) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <Clock op={newChipStart != null && frame >= newChipStart ? 1 : 0} />
              <span style={{ fontSize: 18, color: c.grey, fontWeight: theme.font.weights.medium }}>{it.time}</span>
              {showChip && <span style={{ marginLeft: 6, padding: "3px 12px", borderRadius: theme.radius.chip, background: c.cyan, color: c.white, fontSize: 16, fontWeight: theme.font.weights.bold }}>New</span>}
            </div>
            <div style={{ fontSize: 26, fontWeight: theme.font.weights.bold, color: c.text }}>{it.title}</div>
          </div>
        );
      })}
      {button && (
        <div style={{ position: "absolute", left: w - 220, top: stack + 16, width: 200, textAlign: "center", padding: "16px 0", borderRadius: theme.radius.chip, background: c.indigo, color: c.white, fontSize: 26, fontWeight: theme.font.weights.bold, boxShadow: buttonHighlight > 0 ? `0 0 0 ${6 * buttonHighlight}px ${c.indigoWash}` : "none" }}>
          {button}
        </div>
      )}
    </div>
  );
};
