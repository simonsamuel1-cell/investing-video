/**
 * Scene 10 — Screening walkthrough (comp 2277–2801, dur 524). Three beats:
 * Watchlist → Bullish Signals → Concepts & Sectors. Real app screens are
 * [NEEDS ASSET] (spec §7): a PhoneFrame placeholder holds each beat's slot, with
 * the active route chip lit. Do not fake app UI as real. Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PhoneFrame, Chip } from "../components";

const BEATS = [
  { key: "Watchlist", at: Math.round(0.5 * 30), caption: "Watchlist table + Event chip" },
  { key: "Bullish Signals", at: Math.round(6.5 * 30), caption: "Event-Driven theme rows" },
  { key: "Concepts & Sectors", at: Math.round(11.5 * 30), caption: "Sector tile grid" },
];

export const Scene10 = () => {
  const f = useCurrentFrame();
  let active = 0;
  for (let i = 0; i < BEATS.length; i++) if (f >= BEATS[i].at) active = i;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* route chips — active beat lit */}
      <div style={{ position: "absolute", left: 96, top: 210, display: "flex", gap: 22 }}>
        {BEATS.map((b, i) => (
          <Chip key={b.key} label={b.key} tone={i === 2 ? "cyan" : "indigo"} active={i === active} dot fontSize={26} op={f >= b.at ? 1 : 0.35} />
        ))}
      </div>

      <PhoneFrame cx={960} top={310} height={630} op={1} caption={`Scene 10 · ${BEATS[active].caption}`} />
    </AbsoluteFill>
  );
};
