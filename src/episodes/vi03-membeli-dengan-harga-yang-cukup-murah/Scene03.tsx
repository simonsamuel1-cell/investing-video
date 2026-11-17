/**
 * VI03 · Scene 3, the v3 build in a composition of its own (Simon, 17 Nov: "maksudku adalah duplikat visual tadi, lalu pisahkan
 * composition, karna ada beberapa yang bagus untuk diambil"). The Full comp plays Simon's own SC03 (IbuSariSendiri.tsx);
 * this one plays the one-layout build (IbuSariBuild.tsx) over the same VO, subtitles, logo and cuts: the episode started at
 * SC03's first frame and stopped at SC04's. No intro, no BGM. Frame 0 here = Studio 3597 of the Full comp.
 */
import { Sequence } from "remotion";
import { MembeliCukupMurahComposition } from "./Composition";
import { BLOCK } from "./data/timing";
import { SC03 as SC03_BUILD } from "./scenes/IbuSariBuild";

export const VI03_SC03_FRAMES = BLOCK.SC04 - BLOCK.SC03;
export const MembeliCukupMurahScene03 = () => (
  <Sequence from={-BLOCK.SC03} name="VI03 · from SC03 (v3)">
    <MembeliCukupMurahComposition scenes={{ SC03: SC03_BUILD }} />
  </Sequence>
);
