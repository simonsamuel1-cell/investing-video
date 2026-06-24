/**
 * SceneWrap — every scene renders inside this: SafeArea + a short content
 * fade-in at the scene head. The #F5F5F5 background never fades, so scene
 * boundaries never flash.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { SafeArea } from "./SafeArea";
import { sceneIn } from "../helpers";

export const SceneWrap = ({
  children,
  fade = 10,
}: {
  children: ReactNode;
  fade?: number;
}) => {
  const frame = useCurrentFrame();
  const opacity = fade > 0 ? sceneIn(frame, fade) : 1;
  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
    </SafeArea>
  );
};
