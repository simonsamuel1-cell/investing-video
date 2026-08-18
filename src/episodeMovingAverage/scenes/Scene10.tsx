/**
 * SC10 — The beginner trap: riding the upper band (from 5439, dur 595).
 *
 * THE CHART DOES THE ARGUING. The assumption is put up plainly, in neutral
 * grey, and left standing for a beat with nothing against it. Then price walks
 * along the upper band for eight consecutive sessions while a counter ticks and
 * the price readout climbs. Only after the evidence has run does the card get
 * struck through. Contradicting it first and showing why afterwards would make
 * it an assertion rather than a demonstration.
 *
 * ⚠ COMPLIANCE. No buy or sell markers, no entry or exit arrows anywhere in
 * this scene. The single reference to entry/exit is a struck-through chip and
 * it must read as a negation.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card } from "../components/Stage";
import { Panel } from "../components/Panels";
import { CandleChart } from "../components/CandleChart";
import { BollingerBandsLayer } from "../components/BollingerBandsLayer";
import { MeasureCaliper } from "../components/Annotations";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { bollinger, sec, progress, textReveal, price } from "../helpers";
import { seriesGrid } from "../components/plot";
import { RIDING, toBars } from "../data/series";
import { CUTS, cutIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const SCENE_FROM = 5439;
const T = {
  head: sec(0.2),
  claim: sec(0.8),
  evidence: sec(3.0),
  strike: sec(9.5),
  measure: sec(13.0),
  chips: sec(16.4),
};
const PERIOD = 20;
const CLAIM = { x: theme.stage.active.x, y: 100, w: theme.stage.active.w, h: 110 };
const BOX = { x: theme.stage.active.x + 40, y: 280, w: theme.stage.active.w - 80, h: 400 };
/** How long one of the eight consecutive touches takes to tick over. */
const TOUCH = sec(0.7);
const TOUCHES = 8;
/** The bar the caliper measures — inside the ride, where the gap is widest. */
const MEASURED = 74;
// ═══════════════════════════════════════════════════════════════════════════

const BARS = toBars(RIDING, 1011);
const BB = bollinger(RIDING, PERIOD, 2);
const DOMAIN: [number, number] = [
  Math.min(...BB.lower.filter((v): v is number => v !== null)),
  Math.max(...BB.upper.filter((v): v is number => v !== null)),
];
const G = seriesGrid(RIDING, BOX, 0.14, DOMAIN);

export const Scene10 = () => {
  const f = useCurrentFrame();
  const g = f + SCENE_FROM;
  const dx = cutIn(g, CUTS.toTrap);
  const dy = cutOut(g, CUTS.toProcess);
  const blur = Math.max(cutBlur(g, CUTS.toTrap), cutBlur(g, CUTS.toProcess));

  const claim = textReveal(f, T.claim);
  const struck = f >= T.strike ? progress(f, T.strike, 16) : 0;
  const touches = f < T.evidence ? 0 : Math.min(TOUCHES, Math.floor((f - T.evidence) / TOUCH) + 1);
  /** How much of the series is on screen — the ride happens as we watch. */
  const shown = f < T.evidence ? 0.35 : Math.min(1, 0.35 + 0.65 * ((f - T.evidence) / sec(6.5)));
  const at = Math.max(1, Math.round((RIDING.length - 1) * shown));

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${dx}px, ${dy}px)`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Chip label="Jebakan Pemula" x={theme.stage.active.x} y={62} tone="indigo" anchor="left" at={T.head} pill />

        {/* stated plainly, and left standing until the chart has answered it */}
        {f >= T.claim && (
          <Panel rect={CLAIM} opacity={claim.opacity * (1 - struck * 0.6)}>
            <div
              style={{
                position: "absolute",
                left: theme.canvas.width / 2,
                top: CLAIM.y + CLAIM.h / 2 + claim.dy,
                transform: "translate(-50%, -50%)",
                fontFamily: theme.text.family,
                fontSize: theme.text.title.size,
                fontWeight: theme.text.title.weight,
                color: theme.color.slate,
                opacity: claim.opacity * (1 - struck * 0.6),
                whiteSpace: "nowrap",
                textDecoration: struck > 0.5 ? "line-through" : undefined,
              }}
            >
              “Sentuh upper band = waktunya jual”
            </div>
          </Panel>
        )}

        <Card rect={{ x: theme.stage.active.x, y: 240, w: theme.stage.active.w, h: 480 }}>
          <CandleChart bars={BARS} box={BOX} pad={0.14} range={DOMAIN} axis={false} reveal={shown} />
          <BollingerBandsLayer mid={BB.mid} upper={BB.upper} lower={BB.lower} grid={G} opacity={progress(f, T.evidence, sec(1))} />

          {/* what the bands actually measure: a distance from the average */}
          {f >= T.measure && BB.mid[MEASURED] !== null && (
            <MeasureCaliper
              from={{ x: G.x(MEASURED), y: G.y(BB.mid[MEASURED]!) }}
              to={{ x: G.x(MEASURED), y: G.y(RIDING[MEASURED]) }}
              label="Jarak dari rata-rata"
              f={f}
              at={T.measure}
              orientation="vertical"
            />
          )}
        </Card>

        {/* the evidence, counted */}
        {touches > 0 && (
          <Chip label={`Sentuhan berturut-turut: ${touches}`} x={theme.stage.active.x} y={758} tone="cyan" anchor="left" at={T.evidence} pill />
        )}
        {f >= T.evidence && (
          <Chip label={price(RIDING[at])} x={theme.stage.active.x + theme.stage.active.w} y={758} tone="slate" anchor="right" at={T.evidence} />
        )}

        {f >= T.strike && (
          <div
            style={{
              position: "absolute",
              left: theme.canvas.width / 2,
              top: 248 + textReveal(f, T.strike + 8).dy,
              transform: "translate(-50%, -50%)",
              fontFamily: theme.text.family,
              fontSize: theme.text.title.size,
              fontWeight: theme.text.title.weight,
              color: theme.color.indigo,
              opacity: textReveal(f, T.strike + 8).opacity,
              whiteSpace: "nowrap",
            }}
          >
            Dalam trend sehat, ini menunjukkan kekuatan.
          </div>
        )}

        {/* the only entry/exit reference in the scene, and it is a negation */}
        <Chip label="Mengukur jarak" x={theme.canvas.width / 2 - 280} y={830} tone="indigo" at={T.chips} check pill />
        <Chip label="Keputusan entry / exit" x={theme.canvas.width / 2 + 280} y={830} tone="slate" at={T.chips + 10} strike={progress(f, T.chips + 20, 14)} pill />
      </div>
    </Stage>
  );
};
