/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';
import { withRizky } from "./referensi-rizky/_studio/webpack.mjs";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((config) => withRizky(enableTailwind(config)));

// AAC priming. Remotion mixes the audio to ADTS (.aac), a container that can't record the encoder's delay, and copies it
// into the mp4 with an edit list that skips nothing, so every player hears the sound 2048 samples (42.7 ms, 2.6 frames
// at 60 fps) after the picture. Measured on IN04's 3 Nov render against its VO file: exactly that, all the way through.
// Moving the AAC track back 2048 samples makes the muxer write an edit list that skips the priming. From Rizky's
// projects (referensi-rizky/*/remotion.config.ts). Restart Studio for its Render button to read this.
Config.overrideFfmpegCommand(({ type, args }) => {
  if (type !== "stitcher") return args;
  const i = args.findIndex((a, k) => a === "-i" && String(args[k + 1]).endsWith(".aac"));
  if (i < 0) return args;
  return [...args.slice(0, i), "-itsoffset", String(-2048 / 48000), ...args.slice(i)];
});
