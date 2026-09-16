/**
 * Draft.tsx — a composition that holds ONE scene, on the episode's own clock,
 * with the episode's voice and subtitles playing over it.
 *
 * ⚠ IT EXISTS SO A SCENE CAN BE SEEN WITHOUT THE EPISODE AROUND IT. The real
 * composition mounts twenty-odd scenes and a dozen overlays; here there is one
 * picture and nothing else on top of it, so what is being judged is the thing
 * being built.
 *
 * ⚠ AND THE VOICE COMES WITH IT — Simon. A scene in this episode is cut to
 * words, so a draft you cannot hear is a draft whose timing cannot be judged;
 * every beat we have placed was placed against a sentence.
 *
 * ⚠ THE AUDIO AND THE CUES ARE MOUNTED EXACTLY AS Composition.tsx MOUNTS THEM
 * — Simon: "VOnya kepotong tuh, copy dari TAMistakes022". They used to be
 * rebased inside a `Sequence from={-AT}`, which worked while the draft was one
 * scene long and broke the moment it became the length of the episode: the VO
 * started at 9130 and ran out 9130 frames before the composition did. Root
 * mount, no rebase, same as the real thing — the file plays from 0 to its end.
 *
 * ⚠ SO THE SCENE IS WHAT MOVES NOW, NOT THE SOUND. `Sequence from={AT}` puts
 * the picture where it will actually live, and a Sequence rebases what is
 * inside it — so scenes/Draft.tsx still counts from 0 and still knows nothing
 * about where it lands. That rule is unchanged and it is the one the whole
 * arrangement rests on: the scene file may not import data/timing.ts.
 */
import { AbsoluteFill, Audio, Sequence, getInputProps, staticFile } from "remotion";
import { Captions, PaletteProvider, Stage } from "../../core";
import { CUES } from "./subtitles";
import { BLOCK } from "./data/timing";
import { Draft, SCENE_FRAMES } from "./scenes/Draft";

/**
 * ⚠ CHANGE THIS TO WHERE THE SCENE WILL LIVE. The hindsight passage runs
 * 9130 → 10130 and cue 41 "Ada juga hindsight bias." starts on 9130 exactly
 * (checked against subtitles.ts, not assumed).
 *
 * ⚠ IT WAS 9110 AND THAT WAS 20 FRAMES EARLY. 9110 is where the previous
 * picture lifts, not where this one starts — with it, every beat written from
 * 0 read 20f AHEAD of the word it was supposed to land on, which is the one
 * thing this draft carries audio in order to prevent. Nothing outside this
 * file reads this number.
 */
export const AT = 9130;

/**
 * ⚠ THE SAME SWITCH Composition.tsx HAS, AND IT IS HERE FOR THE SAME REASON.
 * scripts/audit-frames.mjs proves the 108px subtitle band and the 360×150 logo
 * zone are EMPTY, and it cannot prove that against a still with the burned-in
 * captions painted into the band. Without it the draft's own QA row could
 * never be run at all:
 *
 *   node scripts/stills.mjs . TAMistakes022Draft out/check <frames> '{"chrome":false}'
 *   node scripts/audit-frames.mjs out/check
 *
 * Default is on; a normal scrub is unaffected.
 */
const { chrome = true } = getInputProps() as { chrome?: boolean };

/**
 * ⚠ THE SAME LENGTH AS THE EPISODE — Simon. It was 1100, which is one scene's
 * worth, and that meant the draft had to be re-lengthened every time the scene
 * being worked on changed size or moved. At `BLOCK.END` it never needs
 * touching again: park `AT` anywhere in the episode and the draft still has
 * room in front of it, with the whole voice-over running underneath.
 *
 * ⚠ IT IS READ FROM THE TABLE, NOT TYPED. A second copy of the episode's
 * length is a number that goes quietly out of step the next time the VO is
 * padded — which has happened in this episode already.
 *
 * ⚠ AND IT COSTS NOTHING. The Studio only renders the frame being looked at.
 */
export const DRAFT_FRAMES = BLOCK.END;

export const TAMistakesDraft = () => (
  <AbsoluteFill>
    <PaletteProvider>
      {/* ⚠ A GROUND UNDER THE WHOLE LENGTH. The scene paints its own Stage,
          but only while it is mounted — without this the 15,000 frames either
          side of it scrub as black rather than as the episode's own paper. */}
      <Stage>
        {/* ⚠ BOUNDED BY THE SCENE'S OWN LENGTH — Simon: "aku bukannya cuma
            minta build 1 scene aja ya?". Mounted open-ended it ran from 9130
            to the end of the composition, so the finished picture sat there
            for another 7,700 frames. The scene is 1000 frames and the draft
            has to show that, or the draft is not showing the scene. */}
        <Sequence from={AT} durationInFrames={SCENE_FRAMES} name="Draft scene">
          <Draft />
        </Sequence>

        {/* copied from Composition.tsx — root mount, no rebase. No watermark
            in the draft at all: the logo zone has to read as empty while the
            picture is judged, and the episode adds the mark once. */}
        <Captions cues={CUES} show={chrome} />
        <Audio src={staticFile("vo/ta-mistakes.mp3")} />
      </Stage>
    </PaletteProvider>
  </AbsoluteFill>
);
