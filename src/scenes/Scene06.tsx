/**
 * S6 (A) — poultry example. Theme node "Sektor: Unggas" with sub-chips along the
 * value chain that pulse together. ILLUSTRATIVE diagram (generic role labels, not
 * real tickers / not the real app UI). Mid-flow — animate continuously. (spec §7)
 */
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { ThemeStocksDiagram } from "../components/ThemeStocksDiagram";
import { COLORS } from "../theme";

export const Scene06 = () => (
  <SceneWrap>
    <Heading x={96} y={104} width={1728} align="center" size={54}>
      A sector moves as one chain.
    </Heading>
    <ThemeStocksDiagram
      nodeLabel="Sektor: Unggas"
      accent={COLORS.purple}
      chips={["Pakan ternak", "Peternakan", "Pengolahan", "Distribusi", "Ritel"]}
    />
  </SceneWrap>
);
