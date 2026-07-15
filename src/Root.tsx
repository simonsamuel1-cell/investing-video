import "./index.css";
import { Composition } from "remotion";
import { ConceptSectorVideo, PreviousCut } from "./Video";
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
      {/* Reference only — the full PREVIOUS cut, to scrub for timestamps. */}
      <Composition
        id="ConceptSector-PreviousCut"
        component={PreviousCut}
        durationInFrames={6928}
        fps={FPS}
        width={FRAME.width}
        height={FRAME.height}
      />
    </>
  );
};
