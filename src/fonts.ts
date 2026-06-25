/**
 * Plus Jakarta Sans — the brand typeface, loaded via @remotion/google-fonts so
 * it is embedded at render time (no network call during render).
 */
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
});

// Montserrat — used for the S2 closing resolve line (per Simon, 25 Jun).
export const { fontFamily: montserratFamily } = loadMontserrat("normal", {
  weights: ["500", "600", "700"],
});
