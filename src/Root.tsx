import { Composition } from "remotion";
import { ChartComposition, TOTAL_FRAMES } from "./episodeChart/Composition";
import { theme } from "./episodeChart/theme";

export const Root = () => (
  <Composition
    id="chart"
    component={ChartComposition}
    durationInFrames={TOTAL_FRAMES}
    fps={theme.canvas.fps}
    width={theme.canvas.width}
    height={theme.canvas.height}
  />
);
