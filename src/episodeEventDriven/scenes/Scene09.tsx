/**
 * Scene 9 — Screening chapter open (comp 2077–2260, dur 183). Header is owned
 * by Step1Frame; this overlay lands the three route chips: Watchlist,
 * Bullish Signals, Concepts & Sectors. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Chip } from "../components";
import { pop } from "../helpers";

const CHIPS = [
  { label: "Watchlist", at: Math.round(2.5 * 30) },
  { label: "Bullish Signals", at: Math.round(3.5 * 30) },
  { label: "Concepts & Sectors", at: Math.round(4.5 * 30) },
];

export const Scene09 = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 96, top: 360, display: "flex", gap: 28 }}>
        {CHIPS.map((ch, i) => {
          const p = pop(f, ch.at, 14);
          return (
            <div key={ch.label} style={{ opacity: p.opacity, transform: `scale(${p.scale})`, transformOrigin: "left center" }}>
              <Chip label={ch.label} tone={i === 2 ? "cyan" : "indigo"} active={i === 0} dot fontSize={34} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
