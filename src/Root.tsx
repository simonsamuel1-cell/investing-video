import "./index.css";
import { Composition } from "remotion";
import { ConceptSectorVideo } from "./Video";
import { DURATION, FPS, FRAME } from "./theme";
import { Bandarmology } from "./episodeBandarmology/Composition";
import {
  DURATION as BANDAR_DURATION,
  FPS as BANDAR_FPS,
  FRAME as BANDAR_FRAME,
} from "./episodeBandarmology/theme";

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
        id="Bandarmology"
        component={Bandarmology}
        durationInFrames={BANDAR_DURATION}
        fps={BANDAR_FPS}
        width={BANDAR_FRAME.width}
        height={BANDAR_FRAME.height}
      />
    </>
  );
};
