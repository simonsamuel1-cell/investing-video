/**
 * SceneFramePhone — a single centred phone playing a 980×1920 video clip, at the
 * SAME size/position as the entry-point phones (PH_TOP 137, PH_H 806, cx 960), with
 * a fade-out over the final `fadeDur` frames. `dur` = the sequence length (frames).
 * Frame = scene-local.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PhoneCenter } from "../components/PhoneCenter";

const PH_TOP = 137;
const PH_H = 806;

export const SceneFramePhone = ({ video, dur, fadeDur = 14 }: { video: string; dur: number; fadeDur?: number }) => {
  const f = useCurrentFrame();
  const out = f < dur - fadeDur ? 1 : Math.max(0, (dur - f) / fadeDur);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <PhoneCenter video={video} cx={960} top={PH_TOP} height={PH_H} delay={0} />
    </AbsoluteFill>
  );
};
