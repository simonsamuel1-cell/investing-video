import { Composition } from "remotion";
import {
  MovingAverageComposition,
  TOTAL_FRAMES,
} from "./episodeMovingAverage/Composition";
import { BoxLab, LAB_FRAMES } from "./threeLab/BoxLab";

/** One episode on this branch, plus a lab comp that ships with no episode. */
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
      id="ThreeBoxLab"
      component={BoxLab}
      durationInFrames={LAB_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
