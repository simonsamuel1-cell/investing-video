import { Composition } from "remotion";
import { MarketStructureComposition, TOTAL_FRAMES } from "./episode19marketstructure/Composition";

/** One episode on this branch. Composition ids cannot contain underscores. */
export const Root = () => (
  <Composition
    id="MarketStructure"
    component={MarketStructureComposition}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);
