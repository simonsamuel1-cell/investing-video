/**
 * SC19 — what volume cannot do. `from 17760 · dur 944`
 *
 * The chart stops at today and the next candle is a question mark, because the
 * claim is precisely that volume confirms what HAS happened and does not settle
 * what happens next. Drawing a next candle at all — even faintly — would
 * contradict the sentence being spoken over it.
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, VolumeBars, Chip, Title, StatStrip, SourceTag,
  gridOf, useMotion, progress, theme,
} from "../../../core";
import { BLOCK, BEAT, local } from "../data/timing";
import { PRICE, VOL, TAG_Y } from "../data/layout";
import { UP, UP_DOMAIN, HEALTHY_VOL } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC19;
const T = {
  limits: local(BEAT.limits, FROM),
  already: local(BEAT.alreadyHappened, FROM),
  notCertain: local(BEAT.notCertainty, FROM),
  trend: local(BEAT.trend, FROM),
  levels: local(BEAT.levels, FROM),
  pattern: local(BEAT.pattern, FROM),
};
// ═══════════════════════════════════════════════════════════════════════════
const G = gridOf(UP.closes, UP_DOMAIN, PRICE, 0.12, 96);
const LAST = UP.closes.length - 1;

export const SC19 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  return (
    <Stage>
      <Card />
      <SourceTag kind={UP.kind} y={TAG_Y} />
      <Title text="Pahami batasnya" at={T.limits} />
      <Chart series={UP} grid={G} at={0} over={m.sec(1.4)} />
      <VolumeBars bars={UP.bars} volume={HEALTHY_VOL} grid={G} box={VOL} />
      {/* the future, as the only honest thing that can be drawn there */}
      <div
        style={{
          position: "absolute",
          left: G.x(LAST) + G.slot,
          top: G.y(UP.closes[LAST]) - theme.text.display.size / 2,
          fontFamily: theme.text.family,
          fontSize: theme.text.display.size,
          fontWeight: theme.text.display.weight,
          color: theme.color.muted,
          opacity: progress(f, T.already, m.reveal),
        }}
      >
        ?
      </div>
      <Chip
        label="Volume = prediksi"
        x={theme.canvas.width / 2}
        y={theme.stage.card.y + theme.text.chip.size}
        at={T.notCertain}
        tone="slate"
        strike={progress(f, T.notCertain + m.sec(0.5), m.sec(0.5))}
      />
      <Chip label="Volume = konfirmasi" x={theme.canvas.width / 2} y={theme.stage.card.y + theme.text.chip.size * 2.4} at={T.notCertain + m.sec(1.2)} check pill />
      <StatStrip
        stats={[
          { label: "Baca bersama", value: "Trend" },
          { label: "", value: "Support & resistance" },
          { label: "", value: "Pola candle" },
          { label: "", value: "Kondisi market" },
        ]}
        rect={{ x: theme.stage.card.x, y: theme.stage.caption.y - theme.text.title.size, w: theme.stage.card.w, h: theme.text.title.size * 2 }}
        at={T.trend}
        stagger={T.levels - T.trend}
      />
    </Stage>
  );
};
