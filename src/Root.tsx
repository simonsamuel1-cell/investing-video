import "./index.css";
import { Composition } from "remotion";
import { TechnicalTabEp } from "./Video";
import { DURATION, FPS, FRAME } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TechnicalTabPreview"
        component={TechnicalTabEp}
        durationInFrames={DURATION}
        fps={FPS}
        width={FRAME.width}
        height={FRAME.height}
      />
    </>
  );
};
