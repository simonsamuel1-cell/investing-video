/**
 * Composition — assembles the "Event-Driven Investing" episode (id "eventDriven",
 * 1920×1080, 30fps, durationInFrames 6370). Seven continuity frames are each
 * mounted ONCE as a spanning <Sequence>; their member scenes are child sequences
 * inside (scene-local frame). Scene 8 is independent. A single root <Audio>
 * carries the VO. The root AbsoluteFill paints silver so the small VO-silence
 * gaps between groups read as held silver, never black.
 */
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { theme } from "./theme";

import { HookFrame } from "./continuity/HookFrame";
import { RateChart } from "./continuity/RateChart";
import { QuestionCards } from "./continuity/QuestionCards";
import { Step1Frame } from "./continuity/Step1Frame";
import { Step2Frame } from "./continuity/Step2Frame";
import { Step3Frame } from "./continuity/Step3Frame";
import { RecapFrame } from "./continuity/RecapFrame";
import { Scene08 } from "./scenes/Scene08";

// VO delivered 7 Jul ("Video 15 - Trading 1 Video 4 (2).wav", 212.18s — matches
// the 6370-frame / 212.33s timeline). Lives in public/eventDriven/voiceover.wav.
const MOUNT_VO = true;
const VO = "eventDriven/voiceover.wav";

// { from, durationInFrames, Component } — one spanning sequence per continuity group.
const GROUPS = [
  { from: 0, duration: 629, Component: HookFrame },
  { from: 638, duration: 437, Component: RateChart },
  { from: 1082, duration: 782, Component: QuestionCards },
  { from: 2077, duration: 1305, Component: Step1Frame },
  { from: 3391, duration: 1512, Component: Step2Frame }, // Scene 15 video runs continuously to 4903
  { from: 4903, duration: 920, Component: Step3Frame }, // Monitoring runs to 5823
  { from: 5823, duration: 547, Component: RecapFrame },
];

const INDEPENDENT_SCENES = [{ from: 1872, duration: 192, Component: Scene08 }];

export const EventDrivenVideo = () => (
  <AbsoluteFill style={{ backgroundColor: theme.bg }}>
    {MOUNT_VO && <Audio src={staticFile(VO)} />}

    {GROUPS.map((g) => (
      <Sequence key={g.from} from={g.from} durationInFrames={g.duration} layout="none">
        <g.Component />
      </Sequence>
    ))}

    {INDEPENDENT_SCENES.map((s) => (
      <Sequence key={s.from} from={s.from} durationInFrames={s.duration} layout="none">
        <s.Component />
      </Sequence>
    ))}
  </AbsoluteFill>
);
