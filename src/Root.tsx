import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { waitUntilDone } from "./fonts";

waitUntilDone();

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FairValue2"
      component={MyComposition}
      durationInFrames={6919}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
