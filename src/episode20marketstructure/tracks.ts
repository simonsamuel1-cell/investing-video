/**
 * Whether the film's own Sequences (and its screen recordings) show as tracks
 * in Studio's timeline. The extended cut plays the film through a Sequence
 * whose `from` changes from run to run, and every track cascades from it — they
 * would jump about as the playhead is dragged (TA03 found this). So inside it
 * they are hidden and Composition.tsx draws fixed tracks instead.
 */
import { createContext } from "react";

export const FilmTracks = createContext(true);
