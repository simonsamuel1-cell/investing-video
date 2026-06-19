/**
 * SceneWrap — every scene renders inside this. Provides the SafeArea + a short
 * content fade-in at the scene head (cuts are masked by the next scene
 * materialising over the persistent silver). The background never fades, so
 * there is no flicker at scene boundaries.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { SafeArea } from "./SafeArea";
import { sceneIn } from "../util/anim";

export const SceneWrap = ({
  children,
  allowLogoSlot = false,
  fade = 8,
}: {
  children: ReactNode;
  allowLogoSlot?: boolean;
  fade?: number;
}) => {
  const frame = useCurrentFrame();
  const opacity = sceneIn(frame, fade);
  return (
    <SafeArea allowLogoSlot={allowLogoSlot}>
      <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
    </SafeArea>
  );
};
