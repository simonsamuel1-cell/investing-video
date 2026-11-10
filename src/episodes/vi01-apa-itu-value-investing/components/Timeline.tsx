/**
 * The master timeline, 1934 → 2026 (Simon's VISUAL for SC03, replayed in SC08): every name on his list in his order, evenly
 * spaced — a sequence, not a scale, so no name is pinned to a year it may not own. The line grows from the left; each name
 * pops as the line reaches it; a name the VO is on grows and turns indigo.
 */
import { staticFile } from "remotion";
import { theme, typeStyle, usePalette, useShadow } from "../../../core";
import { ART, Pic } from "./kit";

export const MASTER = [
  "Security Analysis",
  "Graham-Newman",
  "Templeton Growth",
  "Walter Schloss",
  "Buffett Partnership",
  "Charlie Munger",
  "Berkshire Hathaway",
  "Tweedy, Browne",
  "Sequoia Fund",
  "Magellan",
  "Fairfax Financial",
  "Oakmark",
  "Himalaya Capital",
  "Nomad",
  "Fundsmith",
] as const;
export type MasterName = (typeof MASTER)[number];

export const AXIS = { x0: 200, x1: 1720, y: 700, tick: 12, rows: [-58, 58, -118, 118] };
export const nodeX = (i: number) => AXIS.x0 + (i / (MASTER.length - 1)) * (AXIS.x1 - AXIS.x0);

/** `grow` 0..1 draws the line and its names; `lit` is the name the VO is on and how far it has grown (0..1). */
export const Timeline = ({ grow, lit, litP = 0, opacity = 1, graham = 1 }: { grow: number; lit?: MasterName; litP?: number; opacity?: number; graham?: number }) => {
  const c = usePalette();
  const shadow = useShadow();
  if (grow <= 0.001 || opacity <= 0.001) return null;
  const end = AXIS.x0 + (AXIS.x1 - AXIS.x0) * grow;
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <line x1={AXIS.x0} y1={AXIS.y} x2={end} y2={AXIS.y} stroke={c.ink} strokeWidth={4} strokeLinecap="round" />
        {grow > 0.98 ? <path d={`M ${AXIS.x1 + 6} ${AXIS.y - 14} L ${AXIS.x1 + 22} ${AXIS.y} L ${AXIS.x1 + 6} ${AXIS.y + 14}`} fill="none" stroke={c.ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
        {MASTER.map((name, i) => {
          const x = nodeX(i);
          if (x > end + 1) return null;
          const dy = AXIS.rows[i % 4];
          return <line key={name} x1={x} y1={AXIS.y} x2={x} y2={AXIS.y + dy * 0.62} stroke={theme.color.skeleton} strokeWidth={2} />;
        })}
        {MASTER.map((name, i) => (nodeX(i) > end + 1 ? null : <circle key={name} cx={nodeX(i)} cy={AXIS.y} r={name === lit ? 9 + 5 * litP : 8} fill={name === lit && litP > 0.5 ? c.indigo : c.cardBg} stroke={name === lit && litP > 0.5 ? c.indigo : c.ink} strokeWidth={3} />))}
      </svg>
      {(["1934", "2026"] as const).map((y, i) => (
        <div key={y} style={{ position: "absolute", left: i ? AXIS.x1 + 40 : AXIS.x0 - 40, top: AXIS.y, transform: `translate(${i ? 0 : -100}%, -50%)`, ...typeStyle("label"), fontSize: 36, fontWeight: 600, color: c.ink, opacity: i ? Math.max(0, grow * 20 - 19) : 1 }}>{y}</div>
      ))}
      {MASTER.map((name, i) => {
        const x = nodeX(i);
        if (x > end + 1) return null;
        const dy = AXIS.rows[i % 4];
        const on = name === lit ? litP : 0;
        const k = 1 + 0.35 * on;
        return (
          <div key={name} style={{ position: "absolute", left: x, top: AXIS.y + dy, transform: `translate(-50%, -50%) scale(${k.toFixed(3)})`, transformOrigin: dy < 0 ? "50% 100%" : "50% 0%", padding: "6px 16px", borderRadius: 999, background: on > 0.5 ? theme.color.indigoWashSolid : c.cardBg, boxShadow: on > 0.5 ? `${shadow.soft}, inset 0 0 0 2px ${c.indigo}` : shadow.soft, ...typeStyle("label"), fontSize: 22, fontWeight: on > 0.5 ? 600 : 500, color: on > 0.5 ? c.indigo : c.ink, whiteSpace: "nowrap", zIndex: on > 0 ? 2 : 1 }}>
            {name}
          </div>
        );
      })}
      {graham > 0.001 ? <Pic src={staticFile("art/vi01/graham.png")} style={{ position: "absolute", left: AXIS.x0 - 75, top: AXIS.y - 104 - 150 * (ART.graham.h / ART.graham.w), width: 150, opacity: graham }} /> : null}
    </div>
  );
};
