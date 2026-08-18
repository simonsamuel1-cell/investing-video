/**
 * CG-C — Scenes 12A + 12B as ONE spanning Sequence (global 6670 → 8318).
 *
 * THIS ONE IS NOT OPTIONAL. The reveal mask lifts ACROSS the internal boundary
 * at local 839: the question is asked on one side of it and answered on the
 * other, on the same chart, at the same y-scale and x-scale, with no remount
 * and no re-fit. A cut here would let the chart re-frame itself between the
 * question and the answer, and the quiz would be worthless.
 *
 * [NEEDS DATA] `ggrm.json` ships empty. While it is, this group draws the chart
 * frame, the axes and the legend with a visible "Menunggu data" placeholder and
 * NOTHING else — no candles, no bands, no bounce, no breakout. Every other
 * series in this episode is illustrating a mechanic; this one is named, dated
 * and priced, and a synthetic candle presented as GGRM would be a fabricated
 * record. There is deliberately no fallback generator here.
 *
 * ⚠ COMPLIANCE 12A. Both question cards stay interrogative. No probability, no
 * target price, no directional arrow and no colour bias renders before local
 * frame 839.
 *
 * ⚠ COMPLIANCE 12B. `TwoOutcomeBar` takes no numeric prop and floors the losing
 * outcome — see its own note. The VO's "condong ke atas" gets a taller bar and
 * nothing else: no percentage, no win rate, no axis.
 */
import { useCurrentFrame } from "remotion";
import { Stage, Card, Layer } from "../components/Stage";
import { Panel, StatCard, TwoOutcomeBar, BBWidthPanel } from "../components/Panels";
import { CandleChart } from "../components/CandleChart";
import { BollingerBandsLayer } from "../components/BollingerBandsLayer";
import { MovingAverageLine } from "../components/MovingAverageLine";
import { RingPing, CalloutTag, SlopeGuide, RevealMask, Countdown } from "../components/Annotations";
import { Chip } from "../components/Chip";
import { theme } from "../theme";
import { sma, bollinger, sec, progress, progressInOut, textReveal, price, fmtPct } from "../helpers";
import { seriesGrid } from "../components/plot";
import { GGRM, READY, CLOSES, PEAK, bounceToPeak } from "../data/ggrm";
import { CUTS, cutPushIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const GROUP_FROM = 6670;
/** Scene 12B begins here, in the group's own local frames. */
const SC12B = 839;
const T = {
  quiz: sec(0.2),
  chart: sec(2.5),
  bounce: sec(8.0),
  squeeze: sec(13.0),
  cards: sec(19.0),
  mask: sec(24.0),
  // ── Scene 12B ──
  wipe: SC12B + sec(0.2),
  confirm: SC12B + sec(4.0),
  level: SC12B + sec(9.0),
  score: SC12B + sec(15.0),
  honest: SC12B + sec(20.0),
};
const SLOW_P = 50;
const FAST_P = 20;
const BB_P = 20;
const BOX = { x: theme.stage.active.x + 40, y: 200, w: theme.stage.active.w - 80, h: 470 };
const WIDTH_PANEL = { x: theme.stage.active.x, y: 700, w: theme.stage.active.w, h: 130 };
/** How far the chart steps aside so the question cards have their own room. */
const SHIFT = -180;
const CARDS = { x: 1230, w: 590 };
// ═══════════════════════════════════════════════════════════════════════════

const SLOW = READY ? sma(CLOSES, SLOW_P) : [];
const FAST = READY ? sma(CLOSES, FAST_P) : [];
const BB = READY ? bollinger(CLOSES, BB_P, 2) : { mid: [], upper: [], lower: [], width: [] };
const DOMAIN: [number, number] = READY
  ? [Math.min(...GGRM.bars.map((b) => b.l)), Math.max(...GGRM.bars.map((b) => b.h))]
  : [0, 1];
const G = seriesGrid(READY ? CLOSES : [0, 1], BOX, 0.12, DOMAIN);

/** The pullback low the VO calls the bounce — read from the bars, not chosen. */
const BOUNCE = READY
  ? GGRM.bars.reduce((best, b, i) => (b.l < GGRM.bars[best].l ? i : best), 0)
  : 0;
/** Where the mask sits: the last bar the viewer is allowed to see in 12A. */
const HIDE_FROM = READY ? Math.round(GGRM.bars.length * 0.62) : 0;

export const GgrmCaseGroup = () => {
  const f = useCurrentFrame();
  const g = f + GROUP_FROM;
  const push = cutPushIn(g, CUTS.toCase, 0.16);
  const dy = cutOut(g, CUTS.toClose);
  const blur = Math.max(cutBlur(g, CUTS.toCase), cutBlur(g, CUTS.toClose));

  const shift = f >= T.cards ? SHIFT * progressInOut(f, T.cards, sec(1)) : 0;
  /**
   * The honesty beat gets seven seconds and it gets the frame. Everything the
   * viewer has already read steps back to a quarter — the chart, the legend,
   * the scorecard and the stat — so the last thing said is the only thing on
   * screen with any weight.
   */
  const read = f >= T.honest ? 1 - progressInOut(f, T.honest, sec(1)) * 0.75 : 1;
  const reveal = READY ? Math.min(1, progress(f, T.chart, sec(5.5))) : 0;
  const stat = bounceToPeak();

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy}px) scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Chip label="Kuis" x={theme.stage.active.x} y={62} tone="indigo" anchor="left" at={T.quiz} pill />
        <Chip label={`${GGRM.ticker} · ${GGRM.name} · Daily`} x={theme.stage.active.x} y={130} tone="slate" anchor="left" at={T.quiz + 8} />

        <div style={{ position: "absolute", inset: 0, transform: `translateX(${shift}px)`, opacity: read }}>
          <Card rect={{ x: theme.stage.active.x, y: 160, w: theme.stage.active.w, h: 540 }}>
            {READY ? (
              <>
                <CandleChart bars={GGRM.bars} box={BOX} pad={0.12} range={DOMAIN} axis={false} reveal={reveal} />
                <BollingerBandsLayer mid={BB.mid} upper={BB.upper} lower={BB.lower} grid={G} opacity={progress(f, T.chart + sec(1), sec(2))} />
                <MovingAverageLine values={SLOW} grid={G} f={f} at={T.chart} over={sec(4)} variant="slow" />
                <MovingAverageLine values={FAST} grid={G} f={f} at={T.chart + sec(0.6)} over={sec(4)} variant="fast" />
              </>
            ) : (
              /* the guard: frame, axes and legend, and an honest label */
              <div
                style={{
                  position: "absolute",
                  left: BOX.x + BOX.w / 2,
                  top: BOX.y + BOX.h / 2,
                  transform: "translate(-50%, -50%)",
                  fontFamily: theme.text.family,
                  fontSize: theme.text.title.size,
                  fontWeight: theme.text.title.weight,
                  color: theme.color.faint,
                }}
              >
                Menunggu data
              </div>
            )}

            {/* the bounce off the rising slow MA */}
            {READY && f >= T.bounce && (
              <>
                <RingPing x={G.x(BOUNCE)} y={G.y(CLOSES[BOUNCE])} f={f} at={T.bounce} r={34} />
                <SlopeGuide
                  a={{ x: G.x(Math.max(0, BOUNCE - 18)), y: G.y(SLOW[Math.max(0, BOUNCE - 18)] ?? CLOSES[BOUNCE]) }}
                  b={{ x: G.x(BOUNCE + 10), y: G.y(SLOW[BOUNCE + 10] ?? CLOSES[BOUNCE]) }}
                  f={f}
                  at={T.bounce + 10}
                />
                <CalloutTag text="Pullback → memantul" x={G.x(BOUNCE)} y={G.y(CLOSES[BOUNCE]) + 30} f={f} at={T.bounce + 16} side="below" />
              </>
            )}

            {/* the squeeze, and the closes holding above the middle band */}
            {READY && f >= T.squeeze && (
              <>
                <Layer opacity={progress(f, T.squeeze, sec(1))}>
                  <rect x={G.x(HIDE_FROM - 20)} y={BOX.y} width={G.x(HIDE_FROM) - G.x(HIDE_FROM - 20)} height={BOX.h} fill={theme.color.indigo12} rx={12} />
                </Layer>
                <CalloutTag text="Squeeze" x={G.x(HIDE_FROM - 10)} y={BOX.y + 16} f={f} at={T.squeeze + 8} side="below" />
                <CalloutTag text="Bertahan di atas middle band" x={G.x(HIDE_FROM - 10)} y={G.y(CLOSES[HIDE_FROM - 10]) - 20} f={f} at={T.squeeze + 20} side="above" tone={theme.color.slate} />
              </>
            )}

            {/* the level the VO names — read from the data, never typed */}
            {READY && f >= T.level && PEAK !== null && (
              <>
                <Layer opacity={progress(f, T.level, 14)}>
                  <line x1={BOX.x} y1={G.y(PEAK)} x2={BOX.x + BOX.w} y2={G.y(PEAK)} stroke={theme.color.indigo} strokeWidth={theme.shape.rule} />
                </Layer>
                <CalloutTag text={`≈ ${price(PEAK)}`} x={BOX.x + BOX.w - 40} y={G.y(PEAK)} f={f} at={T.level + 8} side="above" />
              </>
            )}

            {/* the future, genuinely hidden — solid fill, not a scrim */}
            {READY && f >= T.mask && (
              <RevealMask x={G.x(HIDE_FROM)} rect={BOX} f={f} wipeFrom={T.wipe} wipeDur={sec(4)} />
            )}
          </Card>

          {/* the three overlays, named, so "garis ungu" is unambiguous */}
          <Panel rect={{ x: theme.stage.active.x + 24, y: 548, w: 420, h: 156 }} opacity={progress(f, T.chart + sec(1), sec(1))}>
            {[
              { t: "MA lambat (ungu)", c: theme.color.indigo },
              { t: "MA cepat", c: theme.color.cyan },
              { t: "Bollinger Bands", c: theme.color.cyan },
            ].map((l, i) => (
              <div
                key={l.t}
                style={{
                  position: "absolute",
                  left: theme.stage.active.x + 48,
                  top: 578 + i * 40,
                  fontFamily: theme.text.family,
                  fontSize: theme.text.tag.size,
                  fontWeight: theme.text.tag.weight,
                  color: l.c,
                  opacity: progress(f, T.chart + sec(1), sec(1)),
                }}
              >
                — {l.t}
              </div>
            ))}
          </Panel>
        </div>

        {/* ⚠ both cards interrogative, and nothing directional beside them */}
        {f >= T.cards && f < SC12B + sec(2) &&
          [
            { q: "Apakah trend masih naik?", s: "MA bertahan sebagai support?" },
            { q: "Saat band serapat ini, apa yang biasanya terjadi?", s: "" },
          ].map((c, i) => {
            const r = textReveal(f, T.cards + i * 12);
            const y = 220 + i * 220;
            return (
              <Panel key={c.q} rect={{ x: CARDS.x, y: y + r.dy, w: CARDS.w, h: 190 }} opacity={r.opacity}>
                <div
                  style={{
                    position: "absolute",
                    left: CARDS.x + 28,
                    top: y + 46 + r.dy,
                    width: CARDS.w - 56,
                    fontFamily: theme.text.family,
                    fontSize: theme.text.chip.size,
                    fontWeight: theme.text.title.weight,
                    color: theme.color.ink,
                    opacity: r.opacity,
                  }}
                >
                  {c.q}
                </div>
                {c.s !== "" && (
                  <div
                    style={{
                      position: "absolute",
                      left: CARDS.x + 28,
                      top: y + 126 + r.dy,
                      fontFamily: theme.text.family,
                      fontSize: theme.text.tag.size,
                      fontWeight: theme.text.body.weight,
                      color: theme.color.slate,
                      opacity: r.opacity,
                    }}
                  >
                    {c.s}
                  </div>
                )}
              </Panel>
            );
          })}

        {f >= T.mask && f < SC12B && (
          <Countdown x={G.x(HIDE_FROM) + (BOX.x + BOX.w - G.x(HIDE_FROM)) / 2 + SHIFT} y={BOX.y + BOX.h / 2} f={f} at={T.mask} />
        )}

        {/* ── Scene 12B ──────────────────────────────────────────────── */}
        {READY && f >= T.confirm && (
          <>
            <CalloutTag text="MA lambat bertahan sebagai support  ✓" x={G.x(BOUNCE) + SHIFT} y={G.y(CLOSES[BOUNCE]) + 64} f={f} at={T.confirm} side="below" />
            <CalloutTag text="Squeeze terlepas  ✓" x={G.x(HIDE_FROM) + SHIFT} y={BOX.y + 60} f={f} at={T.confirm + 30} side="below" />
          </>
        )}

        {READY && (
          <BBWidthPanel
            rect={WIDTH_PANEL}
            width={BB.width}
            upto={f >= T.wipe ? BB.width.length - 1 : HIDE_FROM}
            f={f}
            at={T.confirm + 30}
            opacity={f >= T.confirm + 30 ? progress(f, T.confirm + 30, sec(0.8)) : 0}
          />
        )}

        <StatCard
          rect={{ x: theme.stage.active.x, y: 700, w: 520, h: 140 }}
          label="Dari bounce → puncak"
          /* [NEEDS DATA] a dash until the export lands — a zero would be a claim */
          value={stat === null ? "—" : fmtPct(stat)}
          f={f}
          at={T.level + sec(2)}
        />
        {/* the stat and the width panel step back with everything else */}

        {/* the scorecard, echoing 12A's two questions in the order asked */}
        {f >= T.score && (
          <Panel
            rect={{ x: 1060, y: 210, w: 760, h: 330 }}
            opacity={progressInOut(f, T.score, 14) * read}
          >
            {[
              { k: "Moving Average", v: "Trend naik — support bertahan" },
              { k: "Bollinger Bands", v: "Squeeze → pergerakan besar" },
            ].map((r, i) => {
              const rv = textReveal(f, T.score + 10 + i * 10);
              return (
                <div key={r.k}>
                  <div
                    style={{
                      position: "absolute",
                      left: 1092,
                      top: 264 + i * 104 + rv.dy,
                      fontFamily: theme.text.family,
                      fontSize: theme.text.tag.size,
                      fontWeight: theme.text.chip.weight,
                      color: i === 0 ? theme.color.indigo : theme.color.cyan,
                      opacity: rv.opacity,
                    }}
                  >
                    {r.k}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 1092,
                      top: 264 + i * 104 + theme.text.tag.size + 8 + rv.dy,
                      width: 700,
                      fontFamily: theme.text.family,
                      fontSize: theme.text.tag.size,
                      fontWeight: theme.text.body.weight,
                      color: theme.color.ink,
                      opacity: rv.opacity,
                    }}
                  >
                    {r.v}
                  </div>
                </div>
              );
            })}
            <div
              style={{
                position: "absolute",
                left: 1092,
                top: 478,
                fontFamily: theme.text.family,
                fontSize: theme.text.tag.size,
                fontWeight: theme.text.body.weight,
                color: theme.color.slate,
                opacity: textReveal(f, T.score + 34).opacity,
              }}
            >
              Searah dengan uptrend yang sudah terbentuk
            </div>
          </Panel>
        )}

        {/* the honesty beat — the full seven seconds, and its own surface */}
        {f >= T.honest && (
          <Panel
            rect={{ x: theme.stage.active.x, y: 220, w: theme.stage.active.w, h: 560 }}
            opacity={textReveal(f, T.honest).opacity}
            radius={theme.shape.cardRadius}
          >
            <div
              style={{
                position: "absolute",
                left: theme.stage.active.x + 72,
                top: 330 + textReveal(f, T.honest).dy,
                fontFamily: theme.text.family,
                fontSize: theme.text.display.size,
                fontWeight: theme.text.display.weight,
                color: theme.color.ink,
                opacity: textReveal(f, T.honest).opacity,
              }}
            >
              Bukan jaminan.
            </div>
            <TwoOutcomeBar
              rect={{ x: theme.stage.active.x + 72, y: 440, w: 620, h: 190 }}
              winLabel="Condong ke atas"
              loseLabel="Tetap mungkin sebaliknya"
              f={f}
              at={T.honest + 12}
            />
            <div
              style={{
                position: "absolute",
                left: 1080,
                top: 520 + textReveal(f, T.honest + sec(3)).dy,
                width: 620,
                fontFamily: theme.text.family,
                fontSize: theme.text.title.size,
                fontWeight: theme.text.body.weight,
                color: theme.color.ink,
                opacity: textReveal(f, T.honest + sec(3)).opacity,
              }}
            >
              <b style={{ fontWeight: theme.text.display.weight }}>Kali ini</b>, sesuai.
            </div>
          </Panel>
        )}

      </div>
    </Stage>
  );
};
