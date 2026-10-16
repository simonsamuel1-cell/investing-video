/**
 * VI04 · Investasi yang Cocok — 9 scenes at 60 fps, timed by the VO's own words (data/timing.ts).
 * ONE root <Audio>. No visuals yet (Simon, 16 Oct: VO + subtitles first, to hear where the VO differs from the
 * script); the scene rows are empty and only mark the blocks on the Studio timeline.
 */
import { AbsoluteFill, Audio, Sequence, getInputProps, random, staticFile } from "remotion";
import { Captions, PaletteProvider, Stage, Watermark } from "../../core";
import { BLOCK, VO_CHECKS, VO_LAST } from "./data/timing";
import { CUES } from "./subtitles";

export const TOTAL_FRAMES = BLOCK.END;
const KEYS = Object.keys(BLOCK) as (keyof typeof BLOCK)[];
const SCENES = KEYS.filter((k) => k !== "END").map((k, i) => ({ key: k, from: BLOCK[k], duration: BLOCK[KEYS[i + 1]] - BLOCK[k] }));

(() => {
  if (TOTAL_FRAMES < VO_LAST) throw new Error("vi04: the video ends before its voice");
})();

/** Captions and watermark off for clean plates: `--props='{"chrome":false}'`. */
const chrome = (getInputProps() as { chrome?: boolean }).chrome !== false;
/** Keyed per module load so Studio keeps its timeline rows in order (VI01's fix). */
const ROWS = String(random(null));

const Body = () => (
  <Stage>
    {SCENES.map(({ key, from, duration }) => (
      <Sequence key={`${ROWS}-${key}`} from={from} durationInFrames={duration} name={key}>
        {null}
      </Sequence>
    ))}
    {VO_CHECKS.map((c) => (
      <Sequence key={`${ROWS}-${c.name}`} from={c.from} durationInFrames={c.to - c.from} name={c.name}>
        {null}
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
