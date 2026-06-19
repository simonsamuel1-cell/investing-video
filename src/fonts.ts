/**
 * Plus Jakarta Sans — the ONLY typeface (spec §3). Loaded via @remotion/google-fonts
 * so it is embedded at render time (no network call during render).
 */
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
});
