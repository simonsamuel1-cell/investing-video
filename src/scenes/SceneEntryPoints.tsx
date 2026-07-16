/**
 * SceneEntryPoints — NV 2455→2595 (new content). Two lines: "Different entry points"
 * (2467) then "Same tool" (2537, the punchline in indigo); all fade out by 2595.
 * Frame = scene-local (0 at NV 2455).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { fadeIn, fadeOut } from "../util/anim";

export const SceneEntryPoints = () => {
  const f = useCurrentFrame();
  const t1 = fadeIn(f, 12, 16); // "Different entry points" @2467
  const t2 = fadeIn(f, 82, 16); // "Same tool" @2537
  const out = fadeOut(f, 126, 14); // all out by 2595 (local 140)
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* POSITION — `top` moves the pair vertically; `gap` sets the 10px distance. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div style={{ fontSize: 98, fontWeight: 800, letterSpacing: 0, color: COLORS.black, opacity: t1 }}>Different entry points</div>
        <div style={{ fontSize: 98, fontWeight: 800, letterSpacing: 0, color: COLORS.purple, opacity: t2 }}>Same tool</div>
      </div>
    </AbsoluteFill>
  );
};
