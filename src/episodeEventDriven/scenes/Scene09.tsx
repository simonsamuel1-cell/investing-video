/**
 * Scene 9 — Screening chapter open (comp 2077–2259). Shows Scene 9.mp4 (980×500)
 * as a rounded, shadowed card (no phone template), centred under the persistent
 * "01 · Screening" header. Fades out at the end. Frame = scene-local.
 */
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { fadeIn, fadeOut } from "../helpers";

const W = 640; // 50% size
const Hh = Math.round((W * 500) / 980); // 327 — native aspect
const TOP = 300;
const TEXT_IN = 95; // comp 2172

export const Scene09 = () => {
  const f = useCurrentFrame();
  const out = fadeOut(f, 169, 14); // end with a fade
  const op = Math.min(fadeIn(f, 0, 12), out);
  const textOp = Math.min(fadeIn(f, TEXT_IN, 14), out);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: TOP, width: W, height: Hh, opacity: op, borderRadius: theme.radius.card, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.16)" }}>
        <OffthreadVideo src={staticFile("eventDriven/s9.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", left: 96, top: TOP + Hh + 20, width: 1728, textAlign: "center", fontSize: 56, fontWeight: theme.font.weights.extrabold, color: theme.colors.indigo, fontFamily: theme.font.family, opacity: textOp }}>
        3 ways in
      </div>
    </AbsoluteFill>
  );
};
