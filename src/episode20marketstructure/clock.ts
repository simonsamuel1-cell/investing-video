/**
 * The extended cut's own frame, for a scene held under one of Simon's passages.
 *
 * During a passage the film is FROZEN on the outgoing scene's last still frame,
 * so `useCurrentFrame()` inside it never moves. A scene that has to change
 * while it is held (SC10's spotlight, under Extended Part 02) reads the output
 * frame from here instead. Null outside the Composition (a scene rendered on
 * its own is never held).
 */
import { createContext } from "react";

export const OutputClock = createContext<number | null>(null);
