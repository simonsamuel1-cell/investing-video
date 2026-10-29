/**
 * VI07 · Cara Tuntun Membantu Investor Mengurangi Kesalahan — every frame of the episode, at 60 fps.
 *
 * NOTHING HERE IS TYPED BY HAND FROM LISTENING. The VO (INV07/VI07_VO.mp3 → public/vo/vi07-cara-tuntun-membantu-
 * investor.mp3) was aligned word by word against data/script.txt by scripts/vi/align-words.py → data/words.json (each
 * word: its scene, f0/f1). Scene blocks are cut at the midpoint of the silence between a scene's last word and the next
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
  if (hits[nth] === undefined) throw new Error(`VI07: "${phrase}" #${nth} not found in SC${scene}`);
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

/**
 * Scene starts — the midpoint of the silence between one scene's last word and the next one's first. Derived
 * from words.json rather than typed, so a VO revision (scripts/vi/vo-refresh.sh) moves every block by itself.
 */
export const BLOCK: Record<string, number> = Object.fromEntries([
  ...SCENE_NUMBERS.map((n, i) => [`SC${String(n).padStart(2, "0")}`, i === 0 ? 0 : Math.floor((speech(SCENE_NUMBERS[i - 1]).last + speech(n).first) / 2)]),
  ["END", VO_LAST + END_HOLD],
]);

/** A camera cut at every scene change unless a scene is built to carry over (house style: no wipes). */
export const CUT = { over: 40, distance: 120, blur: 10 } as const;
/**
 * Scene changes inside one situation: the paper, the grid and the heading stay put through the cut and only the content
 * moves (Simon 28 Oct: "Dari scene 4 ke scene 5 masih ngomongin Terburu-buru ya? Kalo gitu background dan judulnya ga
 * perlu ikut transisi"). The scenes either side leave those out while `heldAt` says so; the Composition draws them.
 * SC07 → SC08 is one since SC07 was rebuilt (29 Oct) with "Terlalu yakin" held to its end.
 */
export const HELD = [
  { at: BLOCK.SC05, n: 2 },
  { at: BLOCK.SC08, n: 4 },
] as const;
export const heldAt = (g: number) => HELD.find((h) => g >= h.at - CUT.over / 2 && g < h.at + CUT.over / 2) ?? null;
/** Scene changes built to carry over, with no cut — none yet. */
export const CONTINUOUS: number[] = [];
export const CUTS: { at: number; axis: "x" | "y" }[] = Object.keys(BLOCK)
  .filter((k) => k !== "SC01" && k !== "END")
  .map((k) => BLOCK[k])
  .filter((at) => !CONTINUOUS.includes(at))
  .map((at) => ({ at, axis: "x" as const }));

/**
 * Sound effects, each on the frame its picture lands — a track of their own beside the VO, never the BGM (which the
 * Composition does not even hold). `volume` is set by ear against the voice.
 *   fah  SC07's "Fahhh" (Simon 29 Oct: "masukin sfx FAHHH nya"): remotion.media/fah.wav, the @remotion/sfx copy of the
 *        meme (credited there to myinstants.com, not under a free licence — Simon was told), 0.1 s (6 f) after "market."
 */
export const SFX = {
  /**
   * 0.5 first; then 30 % of that ("volume FAHH nya kecilin 70%, jadi existingnya cuma 30% aja"); then 10 % of it
   * ("Masih terlalu besar, buat jadi 10% deh") — Simon 29 Oct.
   */
  fah: { src: "sfx/vi07/fah.wav", at: w(7, "market.") + 6, volume: 0.05 },
} as const;
