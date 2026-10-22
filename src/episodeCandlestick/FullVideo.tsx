/**
 * TA03, the Indonesian cut, finished (Simon, 20 Oct 2026): Intro ("Technical Analysis" / "Technical Analysis -
 * Candlestick (Intermediate)"), the episode, the next-video ending over TA03-Outro.mp3, CTA.mp4, Outro.mp4, and the BGM under
 * all — core/EpisodeWrap. The props are the ones Root used to pass the Indonesian composition.
 */
import { EpisodeWrap, fullFrames } from "../core";
import { CandlestickComposition } from "./Composition";
import { INDO_TOTAL_FRAMES } from "./data/indoTimeline";
import { SUBTITLES_INDO } from "./subtitlesIndo";
import { NEXT_TA03 } from "./NextVideo";

export const TA03_FULL_FRAMES = fullFrames(INDO_TOTAL_FRAMES, 30, { next: NEXT_TA03, cta: true });
export const CandlestickIndoFull = () => (
  <EpisodeWrap title={["Technical Analysis", "Technical Analysis - Candlestick (Intermediate)"]} frames={INDO_TOTAL_FRAMES} name="TA03 Candlestick Intermediate" next={NEXT_TA03} cta>
    <CandlestickComposition subtitles={SUBTITLES_INDO} audioSrc="vo-indo.mp3" showSubtitles muted={false} timeline="indo" />
  </EpisodeWrap>
);
