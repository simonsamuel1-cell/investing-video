/**
 * VI02 · Membeli Saham Berarti Membeli Perusahaan — 8 scenes at 60 fps, timed by the VO's own words (data/timing.ts).
 * ONE root <Audio> for the VO. A scene not built yet is an empty row that only marks its block on the Studio timeline.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, getInputProps, random, staticFile, useCurrentFrame } from "remotion";
import { Captions, PaletteProvider, SoftGround, Stage, Watermark, cutInStyle, cutOutStyle, type Cut } from "../../core";
import { BLOCK, CUT, CUTS, VO_LAST } from "./data/timing";
import { CUES } from "./subtitles";
import { SC01 as SC01_OLD } from "./scenes/BehindTheCode";
import { SC02 as SC02_OLD } from "./scenes/Owner";
import { SC03 as SC03_OLD } from "./scenes/IbuSariBusiness";
import { SC01 as SC01_VI01 } from "./scenes/CodeAndBusiness";
import { SC02 as SC02_VI01 } from "./scenes/PillarOwner";
import { SC03 as SC03_VI01 } from "./scenes/IbuSariLedger";
import { VI01_LOOK } from "./data/switches";
import { SC04 } from "./scenes/PerShare";
import { SC05 } from "./scenes/Rumours";
import { SC06 } from "./scenes/VoteOrWeigh";
import { SC07 } from "./scenes/FourQuestions";
import { SC08 } from "./scenes/FromWhyToPrice";

/** `false` while the VO is being revised (Simon, 5 Nov): the blocks, VO, subtitles and BGM stay, the scenes draw nothing. */
const VISUALS: boolean = true;

/** The scenes built so far. */
/** SC01–SC03 in VI01's look (12 Nov) or the 6 Nov scenes, by VI01_LOOK. */
const SC01 = VI01_LOOK ? SC01_VI01 : SC01_OLD;
const SC02 = VI01_LOOK ? SC02_VI01 : SC02_OLD;
const SC03 = VI01_LOOK ? SC03_VI01 : SC03_OLD;
const SCENE_COMPONENTS: Record<string, React.FC | undefined> = { SC01, SC02, SC03, SC04, SC05, SC06, SC07, SC08 };

export const VI02_FRAMES = BLOCK.END;
const KEYS = Object.keys(BLOCK) as (keyof typeof BLOCK)[];
const SCENES = KEYS.filter((k) => k !== "END").map((k, i) => ({ key: k, from: BLOCK[k], duration: BLOCK[KEYS[i + 1]] - BLOCK[k] }));

(() => {
  if (VI02_FRAMES < VO_LAST) throw new Error("vi02: the video ends before its voice");
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

export const MembeliSahamComposition = () => (
  <AbsoluteFill>
    <PaletteProvider>
      <Stage>
        <Ground />
        {SCENES.map(({ key, from, duration }) => (
          <Sequence key={`${ROWS}-${key}`} from={from} durationInFrames={duration} name={key}>
            {VISUALS && SCENE_COMPONENTS[key] ? (
              <InCuts from={from} to={from + duration}>
                {React.createElement(SCENE_COMPONENTS[key] as React.FC)}
              </InCuts>
            ) : null}
          </Sequence>
        ))}
        <Captions cues={CUES} show={chrome} />
        {chrome && <Watermark totalFrames={VI02_FRAMES} />}
        <Audio key={ROWS} src={staticFile("vo/vi02-membeli-saham-berarti-membeli-perusahaan.mp3")} />
      </Stage>
    </PaletteProvider>
  </AbsoluteFill>
);
