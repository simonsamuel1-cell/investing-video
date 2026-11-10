/**
 * VI01 · Apa Itu Value Investing dan Kenapa Cocok untuk Investor Indonesia? — 8 scenes at 60 fps, timed by the VO's own
 * words (data/timing.ts). ONE root <Audio> for the VO (the new one, 10 Nov). Scenes are built one at a time (SC01 on 10 Nov); a scene not built
 * yet is an empty row on the Studio timeline over the paper, with the subtitles and the logo.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, getInputProps, random, staticFile, useCurrentFrame } from "remotion";
import { Captions, PaletteProvider, SoftGround, Stage, Watermark, cutInStyle, cutOutStyle, type Cut } from "../../core";
import { BLOCK, CUT, CUTS, VO_LAST } from "./data/timing";
import { CUES } from "./subtitles";
import { SC01 } from "./scenes/TwoLedgers";
import { SC02 } from "./scenes/FourPillars";
import { SC03 } from "./scenes/Generations";
import { SC04 } from "./scenes/WhyIndonesia";
import { SC05 } from "./scenes/ThreeDoors";
import { SC06 } from "./scenes/OtherWays";
import { SC07 } from "./scenes/SixDrops";
import { SC08 } from "./scenes/ThreeSentences";

/** The scenes built so far. */
const SCENE_COMPONENTS: Record<string, React.FC | undefined> = { SC01, SC02, SC03, SC04, SC05, SC06, SC07, SC08 };

export const VI01_FRAMES = BLOCK.END;
const KEYS = Object.keys(BLOCK) as (keyof typeof BLOCK)[];
const SCENES = KEYS.filter((k) => k !== "END").map((k, i) => ({ key: k, from: BLOCK[k], duration: BLOCK[KEYS[i + 1]] - BLOCK[k] }));

(() => {
  if (VI01_FRAMES < VO_LAST) throw new Error("vi01: the video ends before its voice");
})();

const cutAt = (at: number): Cut | null => {
  const c = CUTS.find((k) => k.at === at);
  return c ? { at: c.at, axis: c.axis, ...CUT } : null;
};
/** The camera cut at each end of a scene (data/timing.ts CUTS), on the scene's own frames. */
const InCuts = ({ from, to, children }: { from: number; to: number; children: React.ReactNode }) => {
  const g = useCurrentFrame() + from;
  const cin = cutAt(from);
  const cout = cutAt(to);
  const style = cin && g < from + CUT.over / 2 ? cutInStyle(g, cin) : cout && g >= to - CUT.over / 2 ? cutOutStyle(g, cout) : {};
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

/** Captions and watermark off for clean plates: `--props='{"chrome":false}'`. */
const chrome = (getInputProps() as { chrome?: boolean }).chrome !== false;
/** Keyed per module load so Studio keeps its timeline rows in order (IN01's fix). */
const ROWS = String(random(null));

/** The paper under the scenes not built yet. */
const Ground = () => <SoftGround f={useCurrentFrame()} />;

export const ApaItuValueInvestingComposition = () => (
  <AbsoluteFill>
    <PaletteProvider>
      <Stage>
        <Ground />
        {SCENES.map(({ key, from, duration }) => (
          <Sequence key={`${ROWS}-${key}`} from={from} durationInFrames={duration} name={key}>
            {SCENE_COMPONENTS[key] ? (
              <InCuts from={from} to={from + duration}>
                {React.createElement(SCENE_COMPONENTS[key] as React.FC)}
              </InCuts>
            ) : null}
          </Sequence>
        ))}
        <Captions cues={CUES} show={chrome} />
        {chrome && <Watermark totalFrames={VI01_FRAMES} />}
        <Audio key={ROWS} src={staticFile("vo/vi01-apa-itu-value-investing.mp3")} />
      </Stage>
    </PaletteProvider>
  </AbsoluteFill>
);
