import "./index.css";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03 } from "./scenes/Scene03";
import { Scene04 } from "./scenes/Scene04";
import { Scene05 } from "./scenes/Scene05";
import { Scene06 } from "./scenes/Scene06";
import { Scene07 } from "./scenes/Scene07";
import { Scene08 } from "./scenes/Scene08";
import { Scene09 } from "./scenes/Scene09";
import { Scene10Disclaimer } from "./scenes/Scene10Disclaimer";
import { waitUntilDone } from "./fonts";

waitUntilDone();

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#F5F5F5" }}>
      <Audio src={staticFile("VO_FAIR_VALUE_2.mp3")} />
      <Sequence from={0} durationInFrames={457}>
        <Scene01 />
      </Sequence>
      <Sequence from={481} durationInFrames={599}>
        <Scene02 />
      </Sequence>
      <Sequence from={1082} durationInFrames={694}>
        <Scene03 />
      </Sequence>
      <Sequence from={1778} durationInFrames={836}>
        <Scene04 />
      </Sequence>
      <Sequence from={2618} durationInFrames={1016}>
        <Scene05 />
      </Sequence>
      <Sequence from={3634} durationInFrames={615}>
        <Scene06 />
      </Sequence>
      <Sequence from={4249} durationInFrames={690}>
        <Scene07 />
      </Sequence>
      <Sequence from={4939} durationInFrames={719}>
        <Scene08 />
      </Sequence>
      <Sequence from={5658} durationInFrames={601}>
        <Scene09 />
      </Sequence>
      <Sequence from={6259} durationInFrames={660}>
        <Scene10Disclaimer />
      </Sequence>
    </AbsoluteFill>
  );
};
