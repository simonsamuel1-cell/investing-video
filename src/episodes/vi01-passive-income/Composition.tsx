/**
 * VI01 · Passive Income — 18 scenes, 19,455 frames (05:24.250) at 60fps.
 *
 * Every `from` is a BLOCK boundary from data/timing.ts, which is the sync
 * document's master table (docs/VI01_PassiveIncome_Script_SYNCED.md) — VO-
 * locked, never estimated. The scenes TILE: each runs until the next begins,
 * and the check below throws on the first frame nobody owns.
 *
 * Three SCENE TRANSISI ride over the chapter cuts (scenes/Transition.tsx),
 * mounted bare above the tiling so they can freeze any scene by its global
 * frame. ONE root <Audio>; no scene has audio of its own.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, getInputProps, random, staticFile, useCurrentFrame } from "remotion";
import { Captions, PaletteProvider, Stage, Watermark, cutInStyle, cutOutStyle, type Cut } from "../../core";
import { BG_FADE, BLOCK, CUT, CUTS, HANDOFF_FADE, TRANS, VO_LAST } from "./data/timing";
import { CUES } from "./subtitles";
import { SC01, SC02, SC03 } from "./scenes/ColdOpen";
import { BankBalance, CarriedTitle, SC04, SC05, SC06, SC07, SC08 } from "./scenes/PartOne";
import { SC09, SC10, SC11, SC12 } from "./scenes/PartTwo";
import { SC13, SC14, SC15 } from "./scenes/PartThree";
import { SC16, SC17, SC18 } from "./scenes/Close";
import { ListTransisi, SceneTransisi, type Mount } from "./scenes/Transition";

export const TOTAL_FRAMES = BLOCK.END;

type Mounted = Mount & { name: string; extended?: boolean };

const ORDER = [
  ["SC01", SC01, "SC01 Gajian"],
  ["SC02", SC02, "SC02 Menambah penghasilan"],
  ["SC03", SC03, "SC03 24 jam"],
  ["SC04", SC04, "SC04 Passive income"],
  ["SC05", SC05, "SC05 Compounding"],
  ["SC06", SC06, "SC06 Kebiasaan"],
  ["SC07", SC07, "SC07 Human vs financial asset"],
  ["SC08", SC08, "SC08 Estafet"],
  ["SC09", SC09, "SC09 BCA"],
  ["SC10", SC10, "SC10 Produk di sekitar kita"],
  ["SC11", SC11, "SC11 Roda bisnis"],
  ["SC12", SC12, "SC12 Mulai kecil"],
  ["SC13", SC13, "SC13 Lo Kheng Hong"],
  ["SC14", SC14, "SC14 United Tractors"],
  ["SC15", SC15, "SC15 Prosesnya"],
  ["SC16", SC16, "SC16 Bukan lari dari kerja"],
  ["SC17", SC17, "SC17 Berapa yang bisa disisihkan"],
  ["SC18", SC18, "SC18 Penutup"],
] as const;

const KEYS = Object.keys(BLOCK) as (keyof typeof BLOCK)[];
/** Scenes that carry on over the next one's first frames — the continuous cuts: the next scene is drawn on top. */
const EXTEND: Partial<Record<keyof typeof BLOCK, number>> = { SC11: BLOCK.SC13 - BLOCK.SC12 + BG_FADE };
/** Scenes that run on a little past their block but stay in their place, UNDER the next scene — which fades in over them. */
const HOLD: Partial<Record<keyof typeof BLOCK, number>> = { SC12: BG_FADE, SC16: HANDOFF_FADE };
const SCENES: Mounted[] = ORDER.map(([key, Component, name]) => {
  const from = BLOCK[key];
  const next = KEYS[KEYS.indexOf(key) + 1];
  return { from, duration: BLOCK[next] - from + (EXTEND[key] ?? 0) + (HOLD[key] ?? 0), Component, name, extended: (EXTEND[key] ?? 0) > 0 };
});

/* ⚠ EVERY FRAME IS OWNED, and the video outlasts its voice. */
(() => {
  const owned = new Array<boolean>(TOTAL_FRAMES).fill(false);
  for (const s of SCENES) for (let i = s.from; i < s.from + s.duration; i++) owned[i] = true;
  const hole = owned.indexOf(false);
  if (hole >= 0) throw new Error(`vi01-passive-income: frame ${hole} is unowned`);
  if (TOTAL_FRAMES < VO_LAST) throw new Error("vi01-passive-income: the video ends before its voice");
})();

/**
 * A scene inside its cuts: it arrives on the cut at its first frame (if there is
 * one) and leaves on the cut at its last. Both read the GLOBAL frame, so the two
 * halves of a cut are one move.
 */
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

/**
 * ⚠ THE ROWS REMOUNT TOGETHER, EVERY TIME THIS MODULE LOADS. Simon: "panel
 * compositionnya dibuat stay still aja, klo aku geser garis merahnya,
 * layer2nya ga gerak2". Studio orders its rows by when each first mounted,
 * counted per hot reload, and settles ties through whichever hidden sequences
 * are mounted (the Scene Transisi's frozen scenes come and go as the playhead
 * moves). Keyed on a value drawn once per load, the scene rows and the voice
 * always mount as one batch and keep their order — TA05's fix. Studio only:
 * a render reads no key.
 */
const ROWS = String(random(null));

const Body = () => (
  <Stage>
    {/* the scenes in order — those that carry on past their block are drawn after the rest, over the next one */}
    {[...SCENES.filter((s) => !s.extended), ...SCENES.filter((s) => s.extended)].map(({ from, duration, Component, name }) => (
      <Sequence key={`${ROWS}-${name}`} from={from} durationInFrames={duration} name={name}>
        <InCuts from={from} to={from + duration}>
          <Component />
        </InCuts>
      </Sequence>
    ))}

    <ListTransisi scenes={SCENES} />
    {/* "Passive Income", over the SC04 → SC05 cut rather than in it */}
    <CarriedTitle />
    {/* the Bank balance card, riding the SC05 → SC06 scroll */}
    <BankBalance />
    {TRANS.map((t) => (
      <SceneTransisi key={t.at} t={t} scenes={SCENES} />
    ))}

    <Captions cues={CUES} show={chrome} />
    {chrome && <Watermark totalFrames={TOTAL_FRAMES} />}
    <Audio key={ROWS} src={staticFile("vo/passive-income.mp3")} />
  </Stage>
);

export const PassiveIncomeComposition = () => (
  <AbsoluteFill>
    <PaletteProvider>
      <Body />
    </PaletteProvider>
  </AbsoluteFill>
);
