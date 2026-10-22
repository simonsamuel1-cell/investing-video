/**
 * VI04 · Investasi yang Cocok — 9 scenes at 60 fps, timed by the VO's own words (data/timing.ts).
 * ONE root <Audio>. Scenes are built one at a time (Simon, 19 Oct: per scene); the ones not built yet are empty
 * rows that only mark their blocks on the Studio timeline.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, getInputProps, random, staticFile, useCurrentFrame } from "remotion";
import { Captions, PaletteProvider, Stage, Watermark, cutInStyle, cutOutStyle, type Cut } from "../../core";
import { BLOCK, CUT, CUTS, VO_LAST } from "./data/timing";
import { CUES } from "./subtitles";
import { SC01 } from "./scenes/Opening";
import { SC02 } from "./scenes/River";
import { SC03 } from "./scenes/Routes";
import { SC04 } from "./scenes/Waves";
import { SC05 } from "./scenes/License";
import { SC06 } from "./scenes/Profiles";
import { SC07 } from "./scenes/Changes";
import { SC08 } from "./scenes/Recap";
import { SC09 } from "./scenes/Plan";

/** Built scenes; the rest are still empty rows on the timeline. */
const SCENE_COMPONENTS: Record<string, React.FC | undefined> = { SC01, SC02, SC03, SC04, SC05, SC06, SC07, SC08, SC09 };

export const TOTAL_FRAMES = BLOCK.END;
const KEYS = Object.keys(BLOCK) as (keyof typeof BLOCK)[];
const SCENES = KEYS.filter((k) => k !== "END").map((k, i) => ({ key: k, from: BLOCK[k], duration: BLOCK[KEYS[i + 1]] - BLOCK[k] }));

(() => {
  if (TOTAL_FRAMES < VO_LAST) throw new Error("vi04: the video ends before its voice");
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

const Body = () => (
  <Stage>
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
    {chrome && <Watermark totalFrames={TOTAL_FRAMES} />}
    <Audio key={ROWS} src={staticFile("vo/vi04-investasi-yang-cocok.mp3")} />
  </Stage>
);

export const InvestasiYangCocokComposition = () => (
  <AbsoluteFill>
    <PaletteProvider>
      <Body />
    </PaletteProvider>
  </AbsoluteFill>
);
