import "./index.css";
import { Composition } from "remotion";
import { ConceptSectorVideo } from "./Video";
import { EventDrivenVideo } from "./episodeEventDriven/Composition";
import { DURATION, FPS, FRAME } from "./theme";

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
      <Composition
        id="eventDriven"
        component={EventDrivenVideo}
        durationInFrames={6370}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
