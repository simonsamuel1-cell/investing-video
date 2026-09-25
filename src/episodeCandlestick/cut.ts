/**
 * Which cut of the film is being drawn. Scenes that look different in the
 * Indonesian cut read this; everything else ignores it. The English cut
 * (the default) must stay exactly as it was.
 */
import { createContext } from "react";

export type CutName = "english" | "indo";
export const Cut = createContext<CutName>("english");
