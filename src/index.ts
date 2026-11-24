import { getRemotionEnvironment, registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);

// The Effects Library panel: Studio only, never in a render, and its failure never takes the Studio down.
if (typeof document !== "undefined" && getRemotionEnvironment().isStudio) {
  import("./effects-library/panel").then((p) => p.mount()).catch((e) => console.warn("[Effects Library]", e));
}
