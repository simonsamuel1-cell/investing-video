import { Composition } from "remotion";
import { MovingAverageComposition, TOTAL_FRAMES } from "./episodeMovingAverage/Composition";

/** One episode on this branch. Composition ids cannot contain underscores. */
export const Root = () => (
  <Composition
    id="MovingAverageBollingerBands"
    component={MovingAverageComposition}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);
