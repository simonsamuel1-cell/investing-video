/**
 * S9 (A) — themes drive groups, not the reverse. Reuse the diagram; emphasise the
 * theme→stocks arrow and draw an X over the reverse arrow (showReverseX). (spec §7)
 */
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { ThemeStocksDiagram } from "../components/ThemeStocksDiagram";
import { COLORS } from "../theme";

export const Scene09 = () => (
  <SceneWrap>
    <Heading x={96} y={104} width={1728} align="center" size={54}>
      Themes lead — groups follow.
    </Heading>
    <ThemeStocksDiagram
      nodeLabel="Theme"
      accent={COLORS.purple}
      chips={["Stock A", "Stock B", "Stock C", "Stock D", "Stock E"]}
      showReverseX
    />
  </SceneWrap>
);
