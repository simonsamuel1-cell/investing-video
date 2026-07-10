/**
 * Scene 24 — Recap opens (comp 5823–6034, dur 211). The section title and StepRail
 * cards are now owned by RecapFrame (so the title can persist and fade with the rest
 * at 6169); this scene carries no overlay. Frame = scene-local.
 */
import { AbsoluteFill } from "remotion";

export const Scene24 = () => <AbsoluteFill style={{ pointerEvents: "none" }} />;
