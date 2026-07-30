import { Composition } from "remotion";
import { CandlestickComposition, TOTAL_FRAMES } from "./episodeCandlestick/Composition";
import { theme } from "./episodeCandlestick/theme";
import { SUBTITLES } from "./episodeCandlestick/subtitles";
import { SUBTITLES_INDO } from "./episodeCandlestick/subtitlesIndo";

// Remotion composition ids may not contain underscores — "Candlestick_Indo"
// is registered as "Candlestick-Indo".
export const Root = () => (
  <>
    <Composition
      id="candlestickControl"
      component={CandlestickComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={theme.canvas.fps}
      width={theme.canvas.width}
      height={theme.canvas.height}
      defaultProps={{ subtitles: SUBTITLES, audioSrc: "vo.mp3" }}
    />
    <Composition
      id="Candlestick-Indo"
      component={CandlestickComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={theme.canvas.fps}
      width={theme.canvas.width}
      height={theme.canvas.height}
      defaultProps={{ subtitles: SUBTITLES_INDO, audioSrc: "vo-indo.mp3", showSubtitles: false, muted: true }}
    />
  </>
);
