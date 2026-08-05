/**
 * SC08 — The Market Remembers a Price Area (from 4472, dur 720) — INDEPENDENT.
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
// Card top clears the 150px logo zone.
const CARD: Box = { x: 96, y: 160, w: 1728, h: 812 };
const CHART: Box = { x: 200, y: 230, w: 1500, h: 590 };
const T = {
  playhead: 43, // the chart settles; the playhead sits at the right edge
  header: 90, // "pasar punya ingatan"
  band: 148, // "suatu area harga pernah membuat pembeli masuk"
  t1: 190,
  t2: 229, // "sering kembali menarik perhatian"
  t3: 429, // "kedua. Ingatan kolektif itu meninggalkan jejak"
  deepen: 500,
  trace: 564, // "Karena manusia mengingat harga"
  ghosts: 623, // "perilaku yang mirip"
};
const REVEAL_END = 325; // calibrated so each touch is revealed just before its ping
// ═══════════════════════════════════════════════════════════════════════════

const WINDOW = WIN.sc08;

export const Scene08 = () => {
  const f = useCurrentFrame();
  const g = chartGeom(bmriDaily, WINDOW, CHART);

  const reveal = interpolate(f, [0, REVEAL_END], [0.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bandDraw = f >= T.band ? progress(f, T.band, 46) : 0;
  const deepen = f >= T.deepen ? progress(f, T.deepen, 30) : 0;
  const trace = f >= T.trace ? progress(f, T.trace, 46) : 0;
  const ghosts = f >= T.ghosts && f < T.ghosts + 60 ? Math.sin(((f - T.ghosts) / 60) * Math.PI) : 0;
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

      {/* the moment the memory is named */}
      <div
        style={{
          position: "absolute",
          left: CHART.x,
          top: 200,
          fontFamily: theme.type.family,
          fontSize: theme.type.header.size,
          fontWeight: theme.type.header.weight,
          color: theme.colors.ink,
          opacity: progress(f, T.header, 24),
          transform: `translateY(${(1 - progress(f, T.header, 24)) * 14}px)`,
        }}
      >
        Pasar punya ingatan.
      </div>

      {/* the trace the area leaves, and the shape the three bounces share */}
      {(trace > 0.001 || ghosts > 0.001) && (
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={theme.canvas.width} height={theme.canvas.height}>
          {/* the trace the three touches leave along the band */}
          {trace > 0.001 && (
            <line
              x1={g.cx(ZONE_TOUCH_IDX[0])}
              y1={(yTop + yBot) / 2}
              x2={g.cx(ZONE_TOUCH_IDX[0]) + (g.cx(ZONE_TOUCH_IDX[2]) - g.cx(ZONE_TOUCH_IDX[0])) * trace}
              y2={(yTop + yBot) / 2}
              stroke={theme.colors.indigo}
              strokeWidth={theme.stroke.rule}
              strokeDasharray="10 8"
              opacity={0.8}
            />
          )}
          {/* the three bounces, outlined so their similarity reads */}
          {ghosts > 0.001 &&
            ZONE_TOUCH_IDX.map((idx) => (
              <rect
                key={`g${idx}`}
                x={g.cx(idx) - g.slot * 2.5}
                y={yTop - 30}
                width={g.slot * 5}
                height={yBot - yTop + 60}
                rx={10}
                fill="none"
                stroke={theme.colors.indigo}
                strokeWidth={theme.stroke.hair}
                opacity={0.7 * ghosts}
              />
            ))}
        </svg>
      )}

      {/* the three genuine touches */}
      {ZONE_TOUCH_IDX.map((idx, i) => (
        <Ping key={idx} x={g.cx(idx)} y={g.scale(bmriDaily[idx].l)} startFrame={[T.t1, T.t2, T.t3][i]} variant="cyan" />
      ))}

      {/* the one chip on the band — below it, hanging off the first touch */}
      <Chip
        label="Pembeli masuk"
        x={g.cx(ZONE_TOUCH_IDX[0])}
        y={yBot + 76}
        variant="cyan"
        anchor="center"
        startFrame={T.t1 + 8}
        connectorTo={{ x: g.cx(ZONE_TOUCH_IDX[0]), y: yBot + 8 }}
      />
    </SafeArea>
  );
};
