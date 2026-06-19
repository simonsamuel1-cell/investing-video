/**
 * S8 (A) — legendary-investor holdings. Portfolio node with held-name chips that
 * pulse together. ILLUSTRATIVE diagram (generic placeholders, not real holdings).
 * Mid-flow — animate continuously. (spec §7)
 */
import { SceneWrap } from "../components/SceneWrap";
import { Heading } from "../components/Heading";
import { ThemeStocksDiagram } from "../components/ThemeStocksDiagram";
import { COLORS } from "../theme";

const PortfolioIcon = () => (
  <svg width={46} height={46} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="7" width="18" height="13" rx="2.5" stroke="#fff" strokeWidth="2" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" stroke="#fff" strokeWidth="2" />
    <path d="M3 12h18" stroke="#fff" strokeWidth="2" />
  </svg>
);

export const Scene08 = () => (
  <SceneWrap>
    <Heading x={96} y={104} width={1728} align="center" size={54}>
      Or follow where the legends hold.
    </Heading>
    <ThemeStocksDiagram
      nodeLabel="Portofolio"
      nodeIcon={<PortfolioIcon />}
      accent={COLORS.purpleDark}
      chips={["Perbankan", "Energi", "Konsumer", "Telko", "Properti"]}
    />
  </SceneWrap>
);
