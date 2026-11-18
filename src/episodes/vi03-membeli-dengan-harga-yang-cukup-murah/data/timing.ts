/**
 * VI03 · Membeli dengan Harga yang Cukup Murah — every frame of the episode, at 60 fps.
 *
 * NOTHING HERE IS TYPED BY HAND FROM LISTENING. The VO (01 Academy/VI03/VO VI03.mp3 → public/vo/vi03-membeli-dengan-
 * harga-yang-cukup-murah.mp3) was aligned word by word against data/script.txt by scripts/vi/align-words.py →
 * data/words.json (each word: its scene, f0/f1). Scene blocks are cut at the midpoint of the silence between a scene's
 * last word and the next scene's first; beats are named by their WORDS through `w(scene, "phrase")`.
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

/** Where a scene's speech starts and ends. */
const speech = (scene: number) => {
  const ws = WORDS.words.filter((x) => x.scene === scene);
  return { first: Math.min(...ws.map((x) => x.f0)), last: Math.max(...ws.map((x) => x.f1)) };
};
const SCENE_NUMBERS = [...new Set(WORDS.words.map((x) => x.scene))].sort((p, q) => p - q);
/** After the last word: 1.5 s hold, the last half second of it fading out (core/EpisodeWrap). */
const END_HOLD = 90;
export const VO_LAST = speech(SCENE_NUMBERS[SCENE_NUMBERS.length - 1]).last;

/** Frames of pause at each scene's end, in the VO. None yet (the previous episode's 30 f was asked for there only). */
const SCENE_PAUSE = 0;
/**
 * A pause asked for at one scene's end, keyed by the scene that FOLLOWS it (Simon 18 Nov, SC07: "Akhir scene, kasih jeda 30
 * frame"): the VO carries the silence (data/vo-edits.json), and the cut moves past it so the scene before holds the whole of it.
 */
const PAUSE_BEFORE: Record<number, number> = { 8: 30 };

/**
 * Scene starts — the midpoint of the silence between one scene's last word and the next one's first, moved past
 * SCENE_PAUSE: that pause belongs to the scene before, so its picture holds through it and the cut comes after. Derived
 * from words.json rather than typed, so a VO revision (scripts/vi/vo-refresh.sh) moves every block by itself.
 */
export const BLOCK: Record<string, number> = Object.fromEntries([
  ...SCENE_NUMBERS.map((n, i) => [`SC${String(n).padStart(2, "0")}`, i === 0 ? 0 : Math.floor((speech(SCENE_NUMBERS[i - 1]).last + speech(n).first) / 2) + (SCENE_PAUSE + (PAUSE_BEFORE[n] ?? 0)) / 2]),
  ["END", VO_LAST + END_HOLD],
]);

/** A camera cut at every scene change unless a scene is built to carry over (house style: no wipes). */
export const CUT = { over: 40, distance: 120, blur: 10 } as const;
/** Scene changes built to carry over, with no cut — none yet. */
export const CONTINUOUS: number[] = [];
export const CUTS: { at: number; axis: "x" | "y" }[] = Object.keys(BLOCK)
  .filter((k) => k !== "SC01" && k !== "END")
  .map((k) => BLOCK[k])
  .filter((at) => !CONTINUOUS.includes(at))
  .map((at) => ({ at, axis: "x" as const }));
