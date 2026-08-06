import { Composition } from "remotion";
import { ChartMemoryComposition, TOTAL_FRAMES } from "./episodeChartMemory/Composition";

/**
 * Two compositions, ONE component. The copy shares every scene file — editing a
 * visual changes both. Only the props below (subtitle track, voice-over, and
 * whether either is on) belong to one composition and not the other.
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
      component={ChartMemoryComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      // Same subtitle track and VO as the original for now — swap these when
      // the copy gets its own. Composition ids cannot contain underscores.
      defaultProps={{
        subtitles: undefined,
        audioSrc: "vo/chart-memory.mp3",
        showSubtitles: true,
        muted: false,
      }}
    />
  </>
);
