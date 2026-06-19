import "./index.css";
import { Composition } from "remotion";
import { ConceptSectorVideo } from "./Video";
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
    </>
  );
};
