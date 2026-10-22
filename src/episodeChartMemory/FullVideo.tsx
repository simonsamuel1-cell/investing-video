/**
 * TA01 finished (Simon, 20 Oct 2026): Intro ("Technical Analysis" / "Memahami Pergerakan Pasar dari Grafik"), the
 * episode, the next-video ending over TA01-Outro.mp3, CTA.mp4, Outro.mp4, and the BGM under all — core/EpisodeWrap.
 */
import { EpisodeWrap, fullFrames } from "../core";
import { ChartMemoryComposition, TOTAL_FRAMES } from "./Composition";
import { NEXT_TA01 } from "./NextVideoCandle";

export const TA01_FULL_FRAMES = fullFrames(TOTAL_FRAMES, 30, { next: NEXT_TA01, cta: true });
export const ChartMemoryFull = () => (
  <EpisodeWrap title={["Technical Analysis", "Memahami Pergerakan Pasar dari Grafik"]} frames={TOTAL_FRAMES} name="TA01 Memahami Pergerakan Pasar" next={NEXT_TA01} cta>
    <ChartMemoryComposition />
  </EpisodeWrap>
);
