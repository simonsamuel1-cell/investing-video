/**
 * Which cut of the film is being drawn. Scenes that look different in the
 * Indonesian cut read this; everything else ignores it. The English cut
 * (the default) must stay exactly as it was.
 */
import { createContext } from "react";

export type CutName = "english" | "indo";
export const Cut = createContext<CutName>("english");

/**
 * The Indonesian cut's OUTPUT frame, for beats that play while the cut holds
 * a scene's frame under a passage (SC01's zoom under the first passage).
 * null outside the Indonesian cut.
 */
export const IndoClock = createContext<number | null>(null);
