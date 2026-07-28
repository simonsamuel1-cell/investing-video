/**
 * Composition — "Reading Charts: The Market's Memory". 10 scenes, VO-locked to
 * Chart-corrected.srt (47 cues, 5,091 frames). SC10 extended +45f to 563 (total
 * 5,136) so the closing card breathes (Open Decision #1 default).
 * Governing device: the ONE CHART SURFACE (components/ChartCard) persists across
 * every scene. NOTE: root <Audio> pending — supply public/chart.wav (Chart.wav).
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { theme } from "./theme";
import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03 } from "./scenes/Scene03";
import { Scene04 } from "./scenes/Scene04";
import { Scene05 } from "./scenes/Scene05";
import { Scene06 } from "./scenes/Scene06";
import { Scene07 } from "./scenes/Scene07";
import { Scene08 } from "./scenes/Scene08";
import { Scene09 } from "./scenes/Scene09";
import { Scene10 } from "./scenes/Scene10";
import { Subtitles } from "./components/Subtitles";

export const TOTAL_FRAMES = 5136; // 5,091 VO + 45f SC10 tail (Open Decision #1)

const SCENES: { from: number; duration: number; Component: React.FC }[] = [
  { from: 0, duration: 313, Component: Scene01 },
  { from: 313, duration: 619, Component: Scene02 },
  { from: 932, duration: 434, Component: Scene03 },
  { from: 1366, duration: 631, Component: Scene04 },
  { from: 1997, duration: 415, Component: Scene05 },
  { from: 2412, duration: 505, Component: Scene06 },
  { from: 2917, duration: 544, Component: Scene07 },
  { from: 3461, duration: 523, Component: Scene08 },
  { from: 3984, duration: 589, Component: Scene09 },
  { from: 4573, duration: 563, Component: Scene10 },
];

export const ChartComposition = () => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.type.family }}>
    {SCENES.map(({ from, duration, Component }) => (
      <Sequence key={from} from={from} durationInFrames={duration}>
        <Component />
      </Sequence>
    ))}
    <Subtitles />
  </AbsoluteFill>
);
