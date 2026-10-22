/**
 * outroCues.ts — the subtitles for TA09-Outro.mp3 (SC21, the next video). Kept apart from subtitles.ts, which is
 * generated from Volume_Sub_CORRECTED.srt and hand-shifted after the bonus transition; regenerating it must not lose
 * these. Frames are episode frames: NEXT.at + faster-whisper's word times on the clip.
 *
 * ⚠ THE WORDS ARE A TRANSCRIPTION, not Simon's script — there was none for the outro.
 */
import type { Cue } from "../../core";
import { NEXT } from "./data/timing";

const at = (k: number) => NEXT.at + k;

export const OUTRO_CUES: Cue[] = [
  { start: at(0), end: at(110), text: "Di video selanjutnya, kita akan bahas" },
  { start: at(113), end: at(224), text: "multi-timeframe analysis." },
  { start: at(248), end: at(345), text: "Gimana melihat satu saham" },
  { start: at(352), end: at(426), text: "dari beberapa timeframe," },
  { start: at(428), end: at(NEXT.words.last + 24), text: "dan menggabungkan sinyal yang saling mendukung." },
];
