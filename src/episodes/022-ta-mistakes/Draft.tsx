/**
 * Draft.tsx — a composition that holds ONE scene, on its own clock, with the
 * episode's voice and subtitles playing over it.
 *
 * ⚠ IT EXISTS SO A SCENE CAN BE SEEN WITHOUT THE EPISODE AROUND IT. The real
 * composition is 16830 frames long and the scene being built might start at
 * 9110; scrubbing there to check a 40-frame move is most of the cost of making
 * the move. Here the scene starts at 0.
 *
 * ⚠ AND THE VOICE COMES WITH IT — Simon. A scene in this episode is cut to
 * words, so a draft you cannot hear is a draft whose timing cannot be judged;
 * every beat we have placed was placed against a sentence. What it costs is one
 * number: the draft has to know WHERE in the episode it sits.
 *
 * ⚠ ONE NUMBER, NOT THE TABLE. `AT` is the only timeline frame this side of the
 * arrangement knows, and it lives HERE rather than in scenes/Draft.tsx — the
 * picture still counts from 0 and still knows nothing about where it lands. The
 * rule that matters is unchanged: the scene file may not import data/timing.ts.
 *
 * ⚠ REBASED WITH A NEGATIVE `from`, NOT WITH ARITHMETIC. One Sequence at
 * `-AT` puts the audio and the cues on the episode's own clock, so both behave
 * exactly as they do in the real composition — no offsets to get wrong, and
 * `Captions` reads the global frame it asks for. It is the same device the card
 * rows use to carry a scene on someone else's timeline.
 */
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Captions, PaletteProvider } from "../../core";
import { CUES } from "./subtitles";
import { Draft } from "./scenes/Draft";

/**
 * ⚠ CHANGE THIS TO WHERE THE SCENE WILL LIVE. 9110 is where SC10 lifts, which
 * is where the next picture starts; the hindsight passage runs 9130 → 10130.
 * Nothing but the draft reads it.
 */
export const AT = 9110;
/** Long enough for any single scene in this episode. It costs nothing: the
 *  Studio only renders the frame being looked at. */
export const DRAFT_FRAMES = 1100;

export const TAMistakesDraft = () => (
  <AbsoluteFill>
    <PaletteProvider>
      <Draft />
      <Sequence from={-AT} layout="none">
        <Captions cues={CUES} />
        <Audio src={staticFile("vo/ta-mistakes.mp3")} />
      </Sequence>
    </PaletteProvider>
  </AbsoluteFill>
);
