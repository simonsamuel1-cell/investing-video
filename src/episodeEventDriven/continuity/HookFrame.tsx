/**
 * HookFrame — Hook group, Scenes 1–3 (comp 0–621), mounted once. Owns the
 * persistent news feed that carries across Scenes 1→2 and then morphs into the
 * TwoBarGap chart in Scene 3 (no hard cut). Member scenes are child sequences
 * (scene-local frame) that add each scene's text/cursor beats on top.
 *   Scene 1: from 0   dur 175
 *   Scene 2: from 175 dur 88
 *   Scene 3: from 268 dur 353
 * Frame here = comp frame (group starts at 0).
 */
import { Sequence, useCurrentFrame } from "remotion";
import { SafeArea, NewsFeed } from "../components";
import type { NewsItem } from "../components";
import { fadeOut } from "../helpers";
import { Scene01 } from "../scenes/Scene01";
import { Scene02 } from "../scenes/Scene02";
import { Scene03 } from "../scenes/Scene03";

const NEWS: NewsItem[] = [
  { title: "Central Bank Holds Key Rate", time: "09:41 · Markets", at: 0, isNew: true },
  { title: "Earnings Beat Expectations", time: "09:41 · Business", at: 36 },
  { title: "New Policy Package Announced", time: "09:42 · Policy", at: 42, isNew: true },
];

export const HookFrame = () => {
  const f = useCurrentFrame();
  // news feed fades as the chart takes over (Scene 3 begins at 268)
  const feedOut = fadeOut(f, 258, 20);

  return (
    <SafeArea>
      {/* persistent news feed (Scenes 1–2), fades into the chart at Scene 3 */}
      <div style={{ opacity: feedOut }}>
        <NewsFeed x={96} y={196} w={720} items={NEWS} frame={f} newChipStart={78} button="Click" />
      </div>

      <Sequence durationInFrames={175} layout="none"><Scene01 /></Sequence>
      <Sequence from={175} durationInFrames={88} layout="none"><Scene02 /></Sequence>
      <Sequence from={268} durationInFrames={353} layout="none"><Scene03 /></Sequence>
    </SafeArea>
  );
};
