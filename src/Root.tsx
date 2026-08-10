import { Composition } from "remotion";
import { MarketStructureComposition, TOTAL_FRAMES } from "./episodeMarketStructure/Composition";

/**
 * One episode on this branch: "Market Structure". Composition ids cannot
 * contain underscores.
 */
export const Root = () => (
  <>
    <Composition
      id="MarketStructure"
      component={MarketStructureComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
