/**
 * SceneFramePhone — a single centred phone playing a 980×1920 video clip, at the
 * SAME size/position as the entry-point phones (PH_TOP 137, PH_H 806, cx 960), with
 * a fade-out over the final `fadeDur` frames. `dur` = the sequence length (frames).
 * Frame = scene-local.
 *
 * noEnter: the clip must HARD-START on its exact frame — no fade/scale entrance —
 * so frame 0 of the video is visible on the sequence's very first frame.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PhoneCenter } from "../components/PhoneCenter";

const PH_TOP = 137;
const PH_H = 806;

export const SceneFramePhone = ({ video, dur, fadeDur = 14, fadeInDur = 0 }: { video: string; dur: number; fadeDur?: number; fadeInDur?: number }) => {
  const f = useCurrentFrame();
  const out = f < dur - fadeDur ? 1 : Math.max(0, (dur - f) / fadeDur);
  // fadeInDur 0 (default) = hard-start on the exact frame. Use >0 only when the clip
  // follows an empty gap, where a hard pop reads as a glitch.
  const into = fadeInDur > 0 ? Math.min(1, f / fadeInDur) : 1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(into, out) }}>
      <PhoneCenter video={video} cx={960} top={PH_TOP} height={PH_H} delay={0} noEnter />
    </AbsoluteFill>
  );
};
