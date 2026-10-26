/**
 * VI07 · Cara Tuntun Membantu Investor Mengurangi Kesalahan — 11 scenes at 60 fps, timed by the VO's own words
 * (data/timing.ts). ONE root <Audio>. Scenes are built from their ChatGPT storyboards in VI04's style
 * (docs/vi-style/STYLE.md §0); the ones not built yet are empty rows that only mark their blocks on the Studio timeline.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, getInputProps, random, staticFile, useCurrentFrame } from "remotion";
import { Captions, PaletteProvider, SoftGround, Stage, Watermark, cutInStyle, cutOutStyle, type Cut } from "../../core";
import { BLOCK, CUT, CUTS, VO_LAST } from "./data/timing";
import { CUES } from "./subtitles";
import { SC01 } from "./scenes/Opening";
import { SC02 } from "./scenes/Questions";
import { SC03 } from "./scenes/Price";
import { SC04 } from "./scenes/Research";
import { SC05 } from "./scenes/Ask";
import { SC06 } from "./scenes/Hype";
import { SC07 } from "./scenes/Confident";
import { SC08 } from "./scenes/Market";
import { SC09 } from "./scenes/TwoWays";
import { SC10 } from "./scenes/Context";
import { SC11 } from "./scenes/Decide";

/** The scenes, all built (SC01–SC11). */
const SCENE_COMPONENTS: Record<string, React.FC | undefined> = { SC01, SC02, SC03, SC04, SC05, SC06, SC07, SC08, SC09, SC10, SC11 };

export const VI07_FRAMES = BLOCK.END;
const KEYS = Object.keys(BLOCK) as (keyof typeof BLOCK)[];
const SCENES = KEYS.filter((k) => k !== "END").map((k, i) => ({ key: k, from: BLOCK[k], duration: BLOCK[KEYS[i + 1]] - BLOCK[k] }));

(() => {
  if (VI07_FRAMES < VO_LAST) throw new Error("vi07: the video ends before its voice");
})();

const cutAt = (at: number): Cut | null => {
  const c = CUTS.find((k) => k.at === at);
  return c ? { at: c.at, axis: c.axis, ...CUT } : null;
};
const InCuts = ({ from, to, children }: { from: number; to: number; children: React.ReactNode }) => {
  const g = useCurrentFrame() + from;
  const cin = cutAt(from);
  const cout = cutAt(to);
  const style = cin && g < from + CUT.over / 2 ? cutInStyle(g, cin) : cout && g >= to - CUT.over / 2 ? cutOutStyle(g, cout) : {};
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

/** Captions and watermark off for clean plates: `--props='{"chrome":false}'`. */
const chrome = (getInputProps() as { chrome?: boolean }).chrome !== false;
/** Keyed per module load so Studio keeps its timeline rows in order (VI01's fix). */
const ROWS = String(random(null));

/** The paper under the scenes not built yet. */
const Ground = () => <SoftGround f={useCurrentFrame()} />;

export const CaraTuntunMembantuComposition = () => (
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
        {chrome && <Watermark totalFrames={VI07_FRAMES} />}
        <Audio key={ROWS} src={staticFile("vo/vi07-cara-tuntun-membantu-investor.mp3")} />
      </Stage>
    </PaletteProvider>
  </AbsoluteFill>
);
