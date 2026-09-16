/**
 * Draft.tsx — a composition that holds ONE scene, on its own clock.
 *
 * ⚠ IT EXISTS SO A SCENE CAN BE SEEN WITHOUT THE EPISODE AROUND IT. The real
 * composition is 16830 frames long and the scene being built might start at
 * 9110; scrubbing there to check a 40-frame move is most of the cost of making
 * the move. Here the scene starts at 0.
 *
 * ⚠ NO VOICE-OVER, AND THAT IS DELIBERATE. There is exactly one root <Audio> in
 * this episode and it belongs to the real composition. A second mount would
 * decode the same file twice in the Studio and, worse, would invite the draft to
 * be timed against it — which is the thing this arrangement keeps in one place.
 *
 * ⚠ AND NO CAPTIONS OR WATERMARK. What is being judged here is the picture. The
 * chrome is added once, by the composition this ends up in.
 */
import { AbsoluteFill } from "remotion";
import { PaletteProvider } from "../../core";
import { Draft } from "./scenes/Draft";

/** Long enough for any single scene in this episode. It costs nothing: the
 *  Studio only renders the frame being looked at. */
export const DRAFT_FRAMES = 900;

export const TAMistakesDraft = () => (
  <AbsoluteFill>
    <PaletteProvider>
      <Draft />
    </PaletteProvider>
  </AbsoluteFill>
);
