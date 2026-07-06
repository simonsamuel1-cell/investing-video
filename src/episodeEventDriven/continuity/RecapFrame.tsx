/**
 * RecapFrame — Recap & close group, Scenes 24–26 (comp 5823–6370), mounted once.
 * Owns the StepRail whose cards accumulate 1→2→3 across Scenes 24–25, then fades
 * as Scene 26's closing statement takes over. Frame here = group-local (0 at
 * comp 5823).
 *   S24 5823 d211 · S25 6040 d114 · S26 6154 d216
 */
import { useCurrentFrame, Sequence } from "remotion";
import { SafeArea, StepRail } from "../components";
import type { RailCard } from "../components";
import { fadeOut } from "../helpers";
import { Scene24 } from "../scenes/Scene24";
import { Scene25 } from "../scenes/Scene25";
import { Scene26 } from "../scenes/Scene26";

// Scene 24: card1 @0.5s, connector @3.5s, card2 @4.5s.
// Scene 25 (offset 217): connector @1.5s, card3 @2.3s.
const CARDS: RailCard[] = [
  { n: 1, title: "Understand The Event", glyph: "event", at: Math.round(0.5 * 30) },
  { n: 2, title: "Watch Price & Volume", glyph: "candle", at: Math.round(4.5 * 30), connectAt: Math.round(3.5 * 30) },
  { n: 3, title: "Act, Once Confirmed", glyph: "check", at: 217 + Math.round(2.3 * 30), connectAt: 217 + Math.round(1.5 * 30) },
];

export const RecapFrame = () => {
  const f = useCurrentFrame();
  const railOut = fadeOut(f, 331 + 15, 16); // fade as Scene 26 closing enters
  return (
    <SafeArea>
      <div style={{ opacity: railOut }}>
        <StepRail x={150} y={420} cardW={500} gap={60} cards={CARDS} frame={f} />
      </div>

      <Sequence durationInFrames={211} layout="none"><Scene24 /></Sequence>
      <Sequence from={217} durationInFrames={114} layout="none"><Scene25 /></Sequence>
      <Sequence from={331} durationInFrames={216} layout="none"><Scene26 /></Sequence>
    </SafeArea>
  );
};
