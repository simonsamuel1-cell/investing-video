/**
 * shapes.ts — the episode's price curves, one named export per shape.
 *
 * [NEEDS DATA] Empty until the ideation names the shapes each scene needs.
 *
 * Every curve is built with `make()` from ./shape: a `from` price and a list of
 * legs, where the leg's WEIGHT sets how much of the width it takes and the
 * price only sets direction — `plot()` normalises each curve to its own box, so
 * slope is controlled by weight, never by the size of the move.
 *
 * Anything presented as real data comes from a supplied source. Illustrative
 * shapes are fine here, but the scene that draws one has to say so on screen.
 */
export {};
