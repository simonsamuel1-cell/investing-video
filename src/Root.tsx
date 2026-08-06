import { Composition } from "remotion";
import { ChartMemoryComposition, TOTAL_FRAMES } from "./episodeChartMemory/Composition";
import { ChartMemoryComposition as ChartMemory2Composition, TOTAL_FRAMES as TOTAL_FRAMES_2 } from "./episodeChartMemory2/Composition";

/**
 * Two INDEPENDENT episodes. ChartMemory2 has its own copy of every scene,
 * component and data file under src/episodeChartMemory2/ — editing one never
 * touches the other. Composition ids cannot contain underscores.
 */
export const Root = () => (
  <>
    <Composition
      id="ChartMemory"
      component={ChartMemoryComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="ChartMemory2"
      component={ChartMemory2Composition}
      durationInFrames={TOTAL_FRAMES_2}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
