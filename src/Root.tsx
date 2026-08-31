import "./index.css";
import { Composition } from "remotion";
import { ConceptSectorVideo } from "./Video";
import { DURATION, FPS, FRAME } from "./theme";
import {
  MovingAverageComposition,
  TOTAL_FRAMES as MA_FRAMES,
} from "./episodes/019-moving-average/Composition";
import { theme } from "./core";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ConceptSectorTutorial"
        component={ConceptSectorVideo}
        durationInFrames={DURATION}
        fps={FPS}
        width={FRAME.width}
        height={FRAME.height}
      />
      {/* VIDEO 19 — Moving Averages & Bollinger Bands, migrated onto src/core.
          Still 30fps: the 60fps conversion is a separate pass, so a difference
          that shows up here can only have come from core. */}
      <Composition
        id="MovingAverage019"
        component={MovingAverageComposition}
        durationInFrames={MA_FRAMES}
        fps={30}
        width={theme.canvas.width}
        height={theme.canvas.height}
      />
    </>
  );
};
