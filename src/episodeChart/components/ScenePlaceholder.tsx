/**
 * ScenePlaceholder — temporary scaffold content for a scene not yet built.
 * Renders the persistent ChartCard chrome + a centered label, so the full
 * 10-scene composition compiles and the timeline is navigable while each scene's
 * real choreography is built in turn.
 */
import { SafeArea } from "./SafeArea";
import { ChartCard, CHART } from "./ChartCard";
import { theme } from "../theme";

export const ScenePlaceholder = ({ n, cardTitle, label }: { n: number; cardTitle: string; label: string }) => (
  <SafeArea>
    <ChartCard title={cardTitle}>
      <div
        style={{
          position: "absolute",
          left: CHART.x,
          top: CHART.y,
          width: CHART.w,
          height: CHART.h,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <div style={{ fontFamily: theme.type.family, fontSize: 30, fontWeight: 600, color: theme.colors.neutralMuted }}>SCENE {n}</div>
        <div style={{ fontFamily: theme.type.family, fontSize: theme.type.header.size, fontWeight: 700, color: theme.colors.slate, textAlign: "center", maxWidth: 1200 }}>{label}</div>
      </div>
    </ChartCard>
  </SafeArea>
);
