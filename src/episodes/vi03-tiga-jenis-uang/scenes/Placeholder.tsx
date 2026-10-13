/** A scene not built yet: the grid, and its number small in the corner — so the timeline plays end to end. */
import { useCurrentFrame } from "remotion";
import { GridGround, Stage, theme, usePalette } from "../../../core";

export const placeholder = (n: number, from: number) => {
  const Scene = () => {
    const f = useCurrentFrame();
    const c = usePalette();
    return (
      <Stage>
        <GridGround f={f + from} paper={c.bg} />
        <div style={{ position: "absolute", left: theme.margin.left, top: theme.margin.top, fontFamily: theme.text.family, fontSize: 28, fontWeight: 700, color: c.muted }}>SC{String(n).padStart(2, "0")}</div>
      </Stage>
    );
  };
  return Scene;
};
