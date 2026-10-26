/**
 * VI07 · Cara Tuntun Membantu Investor Mengurangi Kesalahan — 11 scenes at 60 fps, timed by the VO's own words
 * (data/timing.ts). ONE root <Audio>. No visuals yet: each scene is an empty row on the Studio timeline; scenes are
 * built one at a time, each from its ChatGPT storyboard, in VI04's style (docs/vi-style/STYLE.md §0).
 */
import { AbsoluteFill, Audio, Sequence, getInputProps, random, staticFile, useCurrentFrame } from "remotion";
import { Captions, PaletteProvider, SoftGround, Stage, Watermark } from "../../core";
import { BLOCK, VO_LAST } from "./data/timing";
import { CUES } from "./subtitles";

export const VI07_FRAMES = BLOCK.END;
const KEYS = Object.keys(BLOCK) as (keyof typeof BLOCK)[];
const SCENES = KEYS.filter((k) => k !== "END").map((k, i) => ({ key: k, from: BLOCK[k], duration: BLOCK[KEYS[i + 1]] - BLOCK[k] }));

(() => {
  if (VI07_FRAMES < VO_LAST) throw new Error("vi07: the video ends before its voice");
})();

/** Captions and watermark off for clean plates: `--props='{"chrome":false}'`. */
const chrome = (getInputProps() as { chrome?: boolean }).chrome !== false;
/** Keyed per module load so Studio keeps its timeline rows in order (VI01's fix). */
const ROWS = String(random(null));

const Ground = () => <SoftGround f={useCurrentFrame()} />;

export const CaraTuntunMembantuComposition = () => (
  <AbsoluteFill>
    <PaletteProvider>
      <Stage>
        <Ground />
        {SCENES.map(({ key, from, duration }) => (
          <Sequence key={`${ROWS}-${key}`} from={from} durationInFrames={duration} name={key}>
            {null}
          </Sequence>
        ))}
        <Captions cues={CUES} show={chrome} />
        {chrome && <Watermark totalFrames={VI07_FRAMES} />}
        <Audio key={ROWS} src={staticFile("vo/vi07-cara-tuntun-membantu-investor.mp3")} />
      </Stage>
    </PaletteProvider>
  </AbsoluteFill>
);
