/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

/**
 * WebGL needs a real GL backend. Headless Chrome's default has none, and
 * @remotion/three fails outright with "Error creating WebGL context" rather
 * than falling back — `angle` is the renderer that works on macOS.
 */
Config.setChromiumOpenGlRenderer("angle");

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);
