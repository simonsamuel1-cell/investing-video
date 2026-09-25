/**
 * Whether the film's own Sequences (and the BBRI footage) show as tracks in
 * Studio's timeline. True for the English cut. False for the Indonesian cut:
 * there the film plays through a Sequence whose `from` changes from run to
 * run of the re-timing, and every track cascades from it — so the tracks
 * jumped about as the playhead was dragged. The Indonesian cut draws its own
 * fixed tracks instead (INDO_TRACKS in Composition.tsx).
 */
import { createContext } from "react";

export const FilmTracks = createContext(true);
