/**
 * subtitles.ts — burned-in cues, in frames at 30fps.
 *
 * [NEEDS ASSET] Empty until the corrected SRT arrives.
 *
 * When it does: TIMING comes from the SRT verbatim, WORDING from the approved
 * script — so the casing, the punctuation and the numbers on screen are the
 * ones that were written, not the ones the transcriber heard. Generated from
 * the two files, never hand-typed.
 *
 * These live in the reserved bottom 108px band, which every scene keeps clear.
 */
export type Cue = { start: number; end: number; text: string };

export const CUES: Cue[] = [];
