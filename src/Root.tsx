import { Composition } from "remotion";
import { MovingAverageComposition, TOTAL_FRAMES } from "./episode21movingaverage/Composition";

/** One episode on this branch. Composition ids cannot contain underscores. */
export const Root = () => (
  <Composition
    id="MovingAverage"
    component={MovingAverageComposition}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);
