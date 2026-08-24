import { Composition } from "remotion";
import {
  MovingAverageComposition,
  TOTAL_FRAMES,
} from "./episodeMovingAverage/Composition";
/**
 * ⚠ THE BACKUP. `src/episodeMovingAverage2/` is a frozen copy of the episode,
 * taken at Simon's request, and NOTHING IN IT IS EVER EDITED — not a colour,
 * not a frame number, not a comment. It exists to be reverted to.
 *
 * It is a real copy of the source, not a second Composition pointing at the
 * same components: two ids sharing one component tree would both change the
 * moment the episode is edited, which is the one thing a backup must not do.
 *
 * The id is MovingAverage-2, with a HYPHEN. Remotion validates composition ids
 * against /^([a-zA-Z0-9-\u4E00-\u9FFF])+$/ — an underscore fails outright.
 */
import {
  MovingAverageComposition as MovingAverage2Composition,
  TOTAL_FRAMES as TOTAL_FRAMES_2,
} from "./episodeMovingAverage2/Composition";
import { BoxLab, LAB_FRAMES } from "./threeLab/BoxLab";

/** One episode on this branch, its frozen backup, and a lab comp. */
export const Root = () => (
  <>
    <Composition
      id="MovingAverage"
      component={MovingAverageComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="MovingAverage-2"
      component={MovingAverage2Composition}
      durationInFrames={TOTAL_FRAMES_2}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="ThreeBoxLab"
      component={BoxLab}
      durationInFrames={LAB_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
