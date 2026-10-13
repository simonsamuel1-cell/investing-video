/**
 * VI03 · Tiga Jenis Uang — every frame of the episode, at 60 fps.
 *
 * NOTHING HERE IS TYPED BY HAND FROM LISTENING. The VO ("INV03 - VO.mp3", copied to public/vo/) was aligned
 * word by word against the script by scripts/vi/align-words.py → data/words.json (each word: its scene,
 * f0/f1). Scene blocks are cut at the midpoint of the silence between a scene's last word and the next
 * scene's first; beats are named by their WORDS through `w(scene, "phrase")`.
 */
import WORDS from "./words.json";

type Word = (typeof WORDS.words)[number];
const norm = (s: string) => s.toLowerCase().replace(/[^0-9a-z]/g, "");

/**
 * The GLOBAL frame a phrase starts on (or, with edge "f1", ends on) inside a scene. `nth` picks a repeat.
 * Throws at module load when the phrase is not in that scene — a typo is caught by tsc/stills, not on screen.
 */
export const w = (scene: number, phrase: string, nth = 0, edge: "f0" | "f1" = "f0") => {
  const ws: Word[] = WORDS.words.filter((x) => x.scene === scene);
  const q = phrase.split(/\s+/).map(norm).filter(Boolean);
  const hits: number[] = [];
  for (let i = 0; i + q.length <= ws.length; i++) if (q.every((t, k) => norm(ws[i + k].w) === t)) hits.push(i);
  if (hits[nth] === undefined) throw new Error(`VI03: "${phrase}" #${nth} not found in SC${scene}`);
  const i = hits[nth];
  return edge === "f0" ? ws[i].f0 : ws[i + q.length - 1].f1;
};
/** The frame a scene's first word starts / last word ends. */
export const sceneSpeech = (scene: number) => {
  const ws = WORDS.words.filter((x) => x.scene === scene);
  return { first: ws[0].f0, last: ws[ws.length - 1].f1 };
};

/** Scene starts — midpoints of the silences between scenes (computed from words.json, 13 Oct 2026). */
export const BLOCK = {
  SC01: 0, SC02: 1107, SC03: 2376, SC04: 3334, SC05: 4508,
  SC06: 5861, SC07: 7520, SC08: 8817, SC09: 10178, SC10: 11652,
  SC11: 12785, SC12: 14306, SC13: 15660, SC14: 17394, SC15: 18527,
  SC16: 20090, SC17: 21398, SC18: 22819, SC19: 24050, SC20: 25834,
  /** The last word ends on f27964; 90 frames hold, the last 30 of them fading out (core/EpisodeWrap). */
  END: 28054,
} as const;
export const VO_LAST = 27964;

/** A camera cut at every scene change unless a scene is built to carry over (house style: no wipes). */
export const CUT = { over: 40, distance: 120, blur: 10 } as const;
export const CONTINUOUS: number[] = [];
export const CUTS: { at: number; axis: "x" | "y" }[] = (Object.keys(BLOCK) as (keyof typeof BLOCK)[])
  .filter((k) => k !== "SC01" && k !== "END")
  .map((k) => BLOCK[k])
  .filter((at) => !CONTINUOUS.includes(at))
  .map((at) => ({ at, axis: "x" as const }));
