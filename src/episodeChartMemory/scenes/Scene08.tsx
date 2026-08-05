/**
 * SC08 — The Market Remembers a Price Area (from 3750, dur 600) — INDEPENDENT.
 * The playhead reveals the daily series left→right; a zone band is drawn across
 * an area the price genuinely revisits, and each of the three real touches is
 * pinged as it arrives. Ends WITHOUT a fourth touch — the chips describe past
 * recorded behaviour, never a projection.
 * TODO [NEEDS DATA: confirm zone from BMRI daily CSV; widen window rather than
 * force a band]
 */
import { useCurrentFrame, interpolate } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { CandlestickChart, chartGeom } from "../components/CandlestickChart";
import { ZoneBand } from "../components/ZoneBand";
import { Ping } from "../components/Ping";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { progress, type Box } from "../helpers";
import { bmriDaily, WIN, ZONE, ZONE_TOUCH_IDX } from "../data/bmri";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const CARD: Box = { x: 96, y: 54, w: 1728, h: 918 };
const CHART: Box = { x: 200, y: 230, w: 1500, h: 590 };
const T = { band: 120, t1: 210, t2: 330, t3: 390, deepen: 450 };
const REVEAL_END = 462; // calibrated so each touch lands on its beat
// ═══════════════════════════════════════════════════════════════════════════

const WINDOW = WIN.sc08;

export const Scene08 = () => {
  const f = useCurrentFrame();
  const g = chartGeom(bmriDaily, WINDOW, CHART);

  const reveal = interpolate(f, [0, REVEAL_END], [0.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bandDraw = f >= T.band ? progress(f, T.band, 46) : 0;
  const deepen = f >= T.deepen ? progress(f, T.deepen, 30) : 0;
  const fill = interpolate(deepen, [0, 1], [0.08, 0.14]);

  const yTop = g.scale(ZONE.hi);
  const yBot = g.scale(ZONE.lo);

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: theme.radius.cardLg,
          background: theme.colors.cardBg,
          border: `${theme.stroke.hair}px solid ${theme.colors.border}`,
        }}
      />

      {bandDraw > 0.001 && <ZoneBand x={CHART.x} w={CHART.w} yTop={yTop} yBottom={yBot} fillOpacity={fill} drawProgress={bandDraw} />}

      <CandlestickChart data={bmriDaily} window={WINDOW} box={CHART} revealProgress={reveal} />

      {/* the three genuine touches */}
      {ZONE_TOUCH_IDX.map((idx, i) => (
        <Ping key={idx} x={g.cx(idx)} y={g.scale(bmriDaily[idx].l)} startFrame={[T.t1, T.t2, T.t3][i]} variant="cyan" />
      ))}

      {/* chips alternate sides of the band so they never stack */}
      <Chip
        label="Pembeli masuk"
        x={g.cx(ZONE_TOUCH_IDX[0])}
        y={yTop - 76}
        variant="cyan"
        anchor="center"
        startFrame={T.t1 + 8}
        connectorTo={{ x: g.cx(ZONE_TOUCH_IDX[0]), y: yTop - 8 }}
      />
      <Chip
        label="Menunggu kesempatan kedua"
        x={g.cx(ZONE_TOUCH_IDX[1])}
        y={yBot + 76}
        variant="indigo"
        anchor="center"
        startFrame={T.t2 + 8}
        connectorTo={{ x: g.cx(ZONE_TOUCH_IDX[1]), y: yBot + 8 }}
      />

      {/* the trace the area leaves behind */}
      {/* inside the band's right end — the price axis owns the margin outside it */}
      <Chip label="3× Disentuh" x={CHART.x + CHART.w - 20} y={(yTop + yBot) / 2} variant="indigo" anchor="right" startFrame={T.deepen} />
    </SafeArea>
  );
};
