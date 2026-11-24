/**
 * VI03 · Membeli dengan Harga yang Cukup Murah — 8 scenes at 60 fps, timed by the VO's own words (data/timing.ts).
 * ONE root <Audio> for the VO. A scene not built yet is an empty row that only marks its block on the Studio timeline.
 */
import React from "react";
import { LockedSequence as Sequence } from "../../core/nudge";
import { AbsoluteFill, Audio, getInputProps, random, staticFile, useCurrentFrame } from "remotion";
import { Captions, PaletteProvider, SoftGround, Stage, Watermark, cutInStyle, cutOutStyle, type Cut } from "../../core";
import { BLOCK, CUT, CUTS, VO_LAST } from "./data/timing";
import { CUES } from "./subtitles";
import { SC01 as SC01_SHOTS } from "./scenes/BuyingMangoes";
import { SC01 as SC01_BUILD } from "./scenes/MangoBuild";
import { SC02 as SC02_SHOTS } from "./scenes/SecondPillar";
import { SC02 as SC02_ONE_TAKE } from "./scenes/SecondPillarFlow";
import { SC02 as SC02_BUILD } from "./scenes/SecondPillarBuild";
import { SC01_LOOK, SC02_LOOK, SC03_LOOK, SC04_LOOK, SC05_LOOK, SC06_LOOK, SC07_LOOK } from "./data/switches";
import { SC03 as SC03_SHOTS } from "./scenes/IbuSariValue";
import { SC03 as SC03_BUILD } from "./scenes/IbuSariBuild";
import { SC03 as SC03_SENDIRI } from "./scenes/IbuSariSendiri";
import { SC04 as SC04_SHOTS } from "./scenes/MarginOfSafety";
import { SC04 as SC04_BUILD } from "./scenes/MarginBuild";
import { SC05 as SC05_SHOTS } from "./scenes/BbcaTwoPrices";
import { SC05 as SC05_BUILD } from "./scenes/BbcaBuild";
import { SC06 as SC06_SHOTS } from "./scenes/RealCheap";
import { SC06 as SC06_BUILD } from "./scenes/FutureValueBuild";
import { SC07 as SC07_SHOTS } from "./scenes/FiveIllusions";
import { SC07 as SC07_BUILD } from "./scenes/IllusionsMindmap";
import { SC08 } from "./scenes/ThreeQuestions";

/** SC01: one story frame built sentence by sentence (16 Nov) or its first, cut-up build. */
const SC01 = SC01_LOOK === "build" ? SC01_BUILD : SC01_SHOTS;
/** SC02: built in VI01/VI02's language (16 Nov, v3), or its two rejected earlier builds. */
const SC02 = SC02_LOOK === "build" ? SC02_BUILD : SC02_LOOK === "take" ? SC02_ONE_TAKE : SC02_SHOTS;
/** SC03: Simon's own from Studio 3802 (17 Nov), the one-layout build (17 Nov), or its first, cut-up build. */
const SC03 = SC03_LOOK === "sendiri" ? SC03_SENDIRI : SC03_LOOK === "build" ? SC03_BUILD : SC03_SHOTS;
/** SC04: told the way SC03 was (17 Nov), or its first, cut-up build. */
const SC04 = SC04_LOOK === "build" ? SC04_BUILD : SC04_SHOTS;
/** SC05: told the way SC03/SC04 were (17 Nov), or its first build. */
const SC05 = SC05_LOOK === "build" ? SC05_BUILD : SC05_SHOTS;
/** SC06: told the way SC01–SC03 were (17 Nov), or its first, cut-up build. */
const SC06 = SC06_LOOK === "build" ? SC06_BUILD : SC06_SHOTS;
const SC07 = SC07_LOOK === "build" ? SC07_BUILD : SC07_SHOTS;
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

/** `scenes` swaps a scene for another build of it (VI03-Scene03: SC03's v3 next to Simon's own). */
export const MembeliCukupMurahComposition = ({ scenes = {} }: { scenes?: Record<string, React.FC> }) => (
  <AbsoluteFill>
    <PaletteProvider>
      <Stage>
        <Ground />
        {SCENES.map(({ key, from, duration }) => {
          const Scene = scenes[key] ?? SCENE_COMPONENTS[key];
          return (
            <Sequence key={`${ROWS}-${key}`} from={from} durationInFrames={duration} name={key}>
              {Scene ? (
                <InCuts from={from} to={from + duration}>
                  <Scene />
                </InCuts>
              ) : null}
            </Sequence>
          );
        })}
        <Captions cues={CUES} show={chrome} />
        {chrome && <Watermark totalFrames={VI03_FRAMES} />}
        <Audio key={ROWS} src={staticFile("vo/vi03-membeli-dengan-harga-yang-cukup-murah.mp3")} />
      </Stage>
    </PaletteProvider>
  </AbsoluteFill>
);
