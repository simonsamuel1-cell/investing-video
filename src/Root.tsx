import { Composition } from "remotion";
import { CandlestickComposition, TOTAL_FRAMES } from "./episodeCandlestick/Composition";
import { theme } from "./episodeCandlestick/theme";

export const Root = () => (
  <Composition
    id="candlestickControl"
    component={CandlestickComposition}
    durationInFrames={TOTAL_FRAMES}
    fps={theme.canvas.fps}
    width={theme.canvas.width}
    height={theme.canvas.height}
  />
);
