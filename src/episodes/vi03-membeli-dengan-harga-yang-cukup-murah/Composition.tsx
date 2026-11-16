/**
 * VI03 · Membeli dengan Harga yang Cukup Murah — 8 scenes at 60 fps, timed by the VO's own words (data/timing.ts).
 * ONE root <Audio> for the VO. A scene not built yet is an empty row that only marks its block on the Studio timeline.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, getInputProps, random, staticFile, useCurrentFrame } from "remotion";
import { Captions, PaletteProvider, SoftGround, Stage, Watermark, cutInStyle, cutOutStyle, type Cut } from "../../core";
import { BLOCK, CUT, CUTS, VO_LAST } from "./data/timing";
import { CUES } from "./subtitles";
import { SC01 as SC01_SHOTS } from "./scenes/BuyingMangoes";
import { SC01 as SC01_BUILD } from "./scenes/MangoBuild";
import { SC02 as SC02_SHOTS } from "./scenes/SecondPillar";
import { SC02 as SC02_ONE_TAKE } from "./scenes/SecondPillarFlow";
import { SC02 as SC02_BUILD } from "./scenes/SecondPillarBuild";
import { SC01_LOOK, SC02_LOOK } from "./data/switches";
import { SC03 } from "./scenes/IbuSariValue";
import { SC04 } from "./scenes/MarginOfSafety";
import { SC05 } from "./scenes/BbcaTwoPrices";
import { SC06 } from "./scenes/RealCheap";
import { SC07 } from "./scenes/FiveIllusions";
import { SC08 } from "./scenes/ThreeQuestions";

/** SC01: one story frame built sentence by sentence (16 Nov) or its first, cut-up build. */
const SC01 = SC01_LOOK === "build" ? SC01_BUILD : SC01_SHOTS;
/** SC02: built in VI01/VI02's language (16 Nov, v3), or its two rejected earlier builds. */
const SC02 = SC02_LOOK === "build" ? SC02_BUILD : SC02_LOOK === "take" ? SC02_ONE_TAKE : SC02_SHOTS;
/** The scenes built so far. Add each as `SCnn` when it is built. */
const SCENE_COMPONENTS: Record<string, React.FC | undefined> = { SC01, SC02, SC03, SC04, SC05, SC06, SC07, SC08 };

export const VI03_FRAMES = BLOCK.END;
const KEYS = Object.keys(BLOCK) as (keyof typeof BLOCK)[];
const SCENES = KEYS.filter((k) => k !== "END").map((k, i) => ({ key: k, from: BLOCK[k], duration: BLOCK[KEYS[i + 1]] - BLOCK[k] }));

(() => {
  if (VI03_FRAMES < VO_LAST) throw new Error("vi03: the video ends before its voice");
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
/** Keyed per module load so Studio keeps its timeline rows in order (IN01's fix). */
const ROWS = String(random(null));

/** The paper under the scenes not built yet. */
const Ground = () => <SoftGround f={useCurrentFrame()} />;

export const MembeliCukupMurahComposition = () => (
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
        {chrome && <Watermark totalFrames={VI03_FRAMES} />}
        <Audio key={ROWS} src={staticFile("vo/vi03-membeli-dengan-harga-yang-cukup-murah.mp3")} />
      </Stage>
    </PaletteProvider>
  </AbsoluteFill>
);
