/**
 * S7 (A) — government policy → infrastructure. Theme node "Policy" with chips
 * that light on cue (highlightStagger). ILLUSTRATIVE diagram. (spec §7)
 */
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { ThemeStocksDiagram } from "../components/ThemeStocksDiagram";
import { COLORS } from "../theme";

export const Scene07 = () => (
  <SceneWrap>
    <Heading x={96} y={104} width={1728} align="center" size={54}>
      One policy lifts a whole sector.
    </Heading>
    <ThemeStocksDiagram
      nodeLabel="Policy"
      accent={COLORS.purple}
      chips={["Construction", "Cement", "Steel", "Toll Roads", "Logistics"]}
      highlightStagger
    />
  </SceneWrap>
);
