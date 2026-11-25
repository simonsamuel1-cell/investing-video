/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';
import { withRizky } from "./referensi-rizky/_studio/webpack.mjs";

// Chromium 158 (Remotion 4.0.547) dies at launch from inside ~/Documents when started through `npx remotion`: macOS refuses its child
// processes their own icudtl.dat there ("icudtl.dat not found in bundle … GPU process isn't usable. Goodbye"). So it runs from a copy
// in the home folder. After a Remotion update, copy the new node_modules/.remotion/chrome-headless-shell/<version> there and change it here.
const CHROME = `${homedir()}/.remotion/chrome-headless-shell/158.0.8127.2-remotion-v3/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
if (existsSync(CHROME)) Config.setBrowserExecutable(CHROME);

// The timeline as it was before 4.0.547 (Simon, 25 Nov 2026: "Dulu aku tau mana scene tertentu karna layernya terpisah satu sama lain"):
// one bar per scene and only the objects of the scene under the playhead. By default Studio now lists every scene's objects at once
// (Sequence Activity) and mounts a scene 2 s early. Studio only; a render is not touched.
Config.setSequenceActivityLimit(0);
Config.setDefaultPremountInSeconds(0);

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((config) => withRizky(enableTailwind(config)));

// AAC priming. Remotion mixes the audio to ADTS (.aac), a container that can't record the encoder's delay, and copies it
// into the mp4 with an edit list that skips nothing, so every player hears the sound 2048 samples (42.7 ms, 2.6 frames
// at 60 fps) after the picture. Measured on IN04's 3 Nov render against its VO file: exactly that, all the way through.
// Moving the AAC track back 2048 samples makes the muxer write an edit list that skips the priming. From Rizky's
// projects (referensi-rizky/*/remotion.config.ts). Restart Studio for its Render button to read this.
Config.overrideFfmpegCommand(({ type, args }) => {
  // Remotion does this itself since 4.0.5xx (`-itsoffset -42667us`), so this only steps in where it doesn't.
  if (type !== "stitcher" || args.includes("-itsoffset")) return args;
  const i = args.findIndex((a, k) => a === "-i" && String(args[k + 1]).endsWith(".aac"));
  if (i < 0) return args;
  return [...args.slice(0, i), "-itsoffset", String(-2048 / 48000), ...args.slice(i)];
});
Config.setDefaultCodingAgent('claude-code');
