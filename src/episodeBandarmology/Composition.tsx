/**
 * Bandarmology — the program. Frame-exact §4 timeline, single root <Audio>, and
 * the two continuity sequences (WyckoffStage, WorkflowStage) running in parallel
 * with the independent scenes.
 *
 * from/duration are ABSOLUTE frames @30fps, calibrated to the recorded VO —
 * do NOT re-estimate. Scenes 5–10 are owned by WyckoffStage (NOT in
 * INDEPENDENT_SCENES); Scenes 22–33 content ARE independent and the WorkflowStage
 * chrome (rail + phone) spans the same range on top.
 */
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import type { FC } from "react";
import { theme } from "./theme";

import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03 } from "./scenes/Scene03";
import { Scene04 } from "./scenes/Scene04";
import { Scene11 } from "./scenes/Scene11";
import { Scene12 } from "./scenes/Scene12";
import { Scene13 } from "./scenes/Scene13";
import { Scene14 } from "./scenes/Scene14";
import { Scene15 } from "./scenes/Scene15";
import { Scene16 } from "./scenes/Scene16";
import { Scene17 } from "./scenes/Scene17";
import { Scene18 } from "./scenes/Scene18";
import { Scene19 } from "./scenes/Scene19";
import { Scene20 } from "./scenes/Scene20";
import { Scene21 } from "./scenes/Scene21";
import { Scene22 } from "./scenes/Scene22";
import { Scene23 } from "./scenes/Scene23";
import { Scene24 } from "./scenes/Scene24";
import { Scene25 } from "./scenes/Scene25";
import { Scene26 } from "./scenes/Scene26";
import { Scene27 } from "./scenes/Scene27";
import { Scene28 } from "./scenes/Scene28";
import { Scene29 } from "./scenes/Scene29";
import { Scene30 } from "./scenes/Scene30";
import { Scene31 } from "./scenes/Scene31";
import { Scene32 } from "./scenes/Scene32";
import { Scene33 } from "./scenes/Scene33";
import { Scene34 } from "./scenes/Scene34";

import { WyckoffStage } from "./continuity/WyckoffStage";
import { WorkflowStage } from "./continuity/WorkflowStage";

// Flip true once public/bandarmology-vo.mp3 is in place. Kept false so Studio
// previews the visuals before the VO is delivered (a missing staticFile throws).
const MOUNT_VO = false;

const INDEPENDENT_SCENES: Array<{ from: number; duration: number; Component: FC }> = [
  { from: 0, duration: 207, Component: Scene01 }, // wholesale market metaphor
  { from: 224, duration: 334, Component: Scene02 }, // super-wholesalers
  { from: 571, duration: 175, Component: Scene03 }, // bandarmology term
  { from: 755, duration: 287, Component: Scene04 }, // clues not fortune-telling (DISCLAIMER)
  // 1055–2482 — Scenes 5–10 rendered by WyckoffStage (see below). Gap intentional.
  { from: 2502, duration: 327, Component: Scene11 }, // public data tracks
  { from: 2849, duration: 249, Component: Scene12 }, // nego market
  { from: 3098, duration: 339, Component: Scene13 }, // four questions
  { from: 3453, duration: 336, Component: Scene14 }, // average cost matters most
  { from: 3797, duration: 157, Component: Scene15 }, // five mistakes intro
  { from: 3962, duration: 271, Component: Scene16 }, // mistake 1 one day
  { from: 4246, duration: 290, Component: Scene17 }, // mistake 2 rank w/o value
  { from: 4544, duration: 226, Component: Scene18 }, // mistake 3 concentration
  { from: 4784, duration: 214, Component: Scene19 }, // mistake 4 average cost
  { from: 5010, duration: 216, Component: Scene20 }, // mistake 5 nego
  { from: 5232, duration: 368, Component: Scene21 }, // honest caveat (DISCLAIMER)
  // 5609–9020 — Scenes 22–33 content; WorkflowStage chrome spans same range.
  { from: 5609, duration: 180, Component: Scene22 }, // three steps intro
  { from: 5806, duration: 359, Component: Scene23 }, // step1 screen (PHONE [NEEDS DATA])
  { from: 6173, duration: 363, Component: Scene24 }, // screen: three checks
  { from: 6552, duration: 200, Component: Scene25 }, // big-picture question
  { from: 6776, duration: 259, Component: Scene26 }, // step2 verify: shareholder count
  { from: 7058, duration: 271, Component: Scene27 }, // verify: insider+foreign
  { from: 7342, duration: 261, Component: Scene28 }, // verify: volume dry-up squeeze
  { from: 7616, duration: 178, Component: Scene29 }, // clues line up
  { from: 7839, duration: 352, Component: Scene30 }, // step3 monitor: the trigger
  { from: 8205, duration: 274, Component: Scene31 }, // market radar (PHONE [NEEDS DATA])
  { from: 8498, duration: 167, Component: Scene32 }, // story changes
  { from: 8670, duration: 350, Component: Scene33 }, // short-term traders (compliance)
  { from: 9035, duration: 306, Component: Scene34 }, // bottom line (DISCLAIMER / close)
];

export const Bandarmology: FC = () => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
    {MOUNT_VO && <Audio src={staticFile("bandarmology-vo.mp3")} />}

    {INDEPENDENT_SCENES.map(({ from, duration, Component }, i) => (
      <Sequence key={i} from={from} durationInFrames={duration}>
        <Component />
      </Sequence>
    ))}

    {/* Continuity 1: Wyckoff curve, Scenes 5–10. Mounted once, never remounts. */}
    <Sequence from={1055} durationInFrames={1427}>
      <WyckoffStage />
    </Sequence>

    {/* Continuity 2: Workflow rail + phone, Scenes 22–33. Parallel chrome. */}
    <Sequence from={5609} durationInFrames={3411}>
      <WorkflowStage />
    </Sequence>
  </AbsoluteFill>
);
