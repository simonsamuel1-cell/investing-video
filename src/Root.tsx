import { Composition } from "remotion";
import { ChartMemoryComposition, TOTAL_FRAMES } from "./episodeChartMemory/Composition";

export const Root = () => (
  <Composition
    id="ChartMemory"
    component={ChartMemoryComposition}
    durationInFrames={TOTAL_FRAMES}
    fps={30}
    width={1920}
    height={1080}
  />
);
