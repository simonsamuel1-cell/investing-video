/**
 * VI03 · Tiga Jenis Uang — 20 scenes at 60 fps, timed by the VO's own words (data/timing.ts).
 * ONE root <Audio>; scenes tile from 0 to END; a camera cut at every scene change unless listed CONTINUOUS.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, getInputProps, random, staticFile, useCurrentFrame } from "remotion";
import { Captions, PaletteProvider, Stage, Watermark, cutInStyle, cutOutStyle, type Cut } from "../../core";
import { BLOCK, CUT, CUTS, VO_LAST } from "./data/timing";
import { CUES } from "./subtitles";
import { SCENE_COMPONENTS } from "./scenes";

export const TOTAL_FRAMES = BLOCK.END;
const KEYS = Object.keys(BLOCK) as (keyof typeof BLOCK)[];
const SCENES = KEYS.filter((k) => k !== "END").map((k, i) => ({ key: k, from: BLOCK[k], duration: BLOCK[KEYS[i + 1]] - BLOCK[k], Component: SCENE_COMPONENTS[k] }));

(() => {
  if (TOTAL_FRAMES < VO_LAST) throw new Error("vi03: the video ends before its voice");
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
    {SCENES.map(({ key, from, duration, Component }) => (
      <Sequence key={`${ROWS}-${key}`} from={from} durationInFrames={duration} name={key}>
        <InCuts from={from} to={from + duration}>
          <Component />
        </InCuts>
      </Sequence>
    ))}
    <Captions cues={CUES} show={chrome} />
    {chrome && <Watermark totalFrames={TOTAL_FRAMES} />}
    <Audio key={ROWS} src={staticFile("vo/vi03-tiga-jenis-uang.mp3")} />
  </Stage>
);

export const TigaJenisUangComposition = () => (
  <AbsoluteFill>
    <PaletteProvider>
      <Body />
    </PaletteProvider>
  </AbsoluteFill>
);
