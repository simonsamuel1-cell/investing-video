/**
 * CG-C — SC07 · SC08 · SC09 · SC10. `from 4894 · dur 3260`
 *
 * ═══ THE TABLE IS THE REASON THIS IS ONE GROUP ═══
 *
 * The script asks for a KEY POINT card summarising the four combinations, to
 * sit between SC10 and SC11. There is NO SILENCE THERE — not 0.3s, none: the
 * cut at f8154 falls mid-sentence, between "sudah datang." and "Nah,". The card
 * cannot exist.
 *
 * So the recap is not a card. One row lands per scene, while that scene is
 * being narrated, and by f8154 the table is already complete and simply holds
 * under the CHAPTER 03 overlay. Same information, no extra runtime — and the
 * viewer watches it being built instead of being handed a finished list.
 *
 * ⚠ THAT ONLY WORKS IF THE TABLE IS MOUNTED ONCE, ACROSS ALL FOUR. Rebuilding
 * it per scene restarts every row's entrance and the argument is gone while the
 * picture still looks right. Hence the group.
 *
 * ⚠ THE CUT AT f6798 IS INSIDE THIS GROUP AND IS A HARD CUT. SC08 → SC09 falls
 * between "posisi." and "Ketiga," — the chart simply changes on the word. No
 * wipe, no fade: a transition on a mid-word cut reads as a mistake.
 */
import { useCurrentFrame } from "remotion";
import {
  Stage, Card, Chart, VolumeBars, Chip, Title, ComboTable, SourceTag,
  gridOf, useMotion, theme,
} from "../../../core";
import type { ComboRow } from "../../../core";
import { BLOCK, BEAT, local } from "../data/timing";
import { TAG_Y } from "../data/layout";
import { COMBO, UP_DOMAIN, DOWN_DOMAIN } from "../data/series";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC07;
const T = {
  intro: 0,
  four: local(BEAT.fourCombos, FROM),
  first: local(BEAT.first, FROM),
  second: local(BEAT.second, FROM),
  third: local(BEAT.third, FROM),
  fourth: local(BEAT.fourth, FROM),
  sc08: local(BLOCK.SC08, FROM),
  sc09: local(BLOCK.SC09, FROM),
  sc10: local(BLOCK.SC10, FROM),
};
// ═══════════════════════════════════════════════════════════════════════════

/** The chart takes the left of the card, the table the right. */
const CARD = theme.stage.card;
const CHART = { x: CARD.x + 40, y: CARD.y + 56, w: CARD.w * 0.5, h: CARD.h * 0.62 };
const VOLBOX = { x: CHART.x, y: CHART.y + CHART.h + CARD.h * 0.06, w: CHART.w, h: CARD.h * 0.2 };
const TABLE = {
  x: CARD.x + CARD.w * 0.56,
  y: CARD.y + 72,
  w: CARD.w * 0.4,
  h: CARD.h * 0.7,
};

/** One grid per direction — the two tapes never share a frame, so they never
 *  need to share a domain. */
const G_UP = gridOf(COMBO.upUp.series.closes, UP_DOMAIN, CHART, 0.12, 0);
const G_DOWN = gridOf(COMBO.downUp.series.closes, DOWN_DOMAIN, CHART, 0.12, 0);

/**
 * ⚠ ONE ROW PER SCENE, and the frames are the spoken words: "Pertama" 5394,
 * "Kedua" 5902, "Ketiga" 6798, "Keempat" 7482.
 */
const ROWS: ComboRow[] = [
  { cells: ["↑", "↑", "Konfirmasi lebih kuat"], revealedAt: T.first, tone: "indigo" },
  { cells: ["↑", "↓", "Partisipasi melemah"], revealedAt: T.second, tone: "slate" },
  { cells: ["↓", "↑", "Tekanan jual lebih serius"], revealedAt: T.third, tone: "slate" },
  { cells: ["↓", "↓", "Tekanan jual mereda"], revealedAt: T.fourth, tone: "slate" },
];

/** Which combination owns the frame, by the word that introduces it. */
const STAGES = [
  { at: T.first, combo: COMBO.upUp, grid: G_UP, title: "Harga naik, volume naik", read: "Kenaikan lebih meyakinkan", tone: "indigo" as const },
  { at: T.second, combo: COMBO.upDown, grid: G_UP, title: "Harga naik, volume turun", read: "Aktivitas pendukungnya berkurang", tone: "slate" as const },
  { at: T.third, combo: COMBO.downUp, grid: G_DOWN, title: "Harga turun, volume naik", read: "Tekanan jual lebih serius", tone: "slate" as const },
  { at: T.fourth, combo: COMBO.downDown, grid: G_DOWN, title: "Harga turun, volume turun", read: "Tekanan jual mulai mereda", tone: "slate" as const },
];

export const CombosGroup = () => {
  const f = useCurrentFrame();
  const m = useMotion();

  /* the last stage whose word has been spoken */
  let k = -1;
  STAGES.forEach((s, i) => {
    if (f >= s.at) k = i;
  });
  const cur = k < 0 ? null : STAGES[k];

  return (
    <Stage>
      <Card />
      <Title text="Empat kombinasi dasar" at={T.four} />

      {cur && (
        <>
          <SourceTag kind={cur.combo.series.kind} y={TAG_Y} />
          {/* ⚠ KEYED ON THE STAGE. At f6798 the chart changes on the word,
              with nothing between the two pictures — that cut is hard by
              instruction and by the fact that the sentence runs through it. */}
          <Chart
            key={`chart-${k}`}
            series={cur.combo.series}
            grid={cur.grid}
            at={cur.at}
            over={m.sec(1.2)}
            tickLabels={false}
          />
          <VolumeBars
            key={`vol-${k}`}
            bars={cur.combo.series.bars}
            volume={cur.combo.vol}
            grid={cur.grid}
            box={VOLBOX}
          />
          <Chip label={cur.title} x={CHART.x} y={CHART.y - theme.text.chip.size} at={cur.at} anchor="left" pill />
          <Chip
            label={cur.read}
            x={CHART.x + CHART.w / 2}
            y={VOLBOX.y + VOLBOX.h + theme.text.chip.size}
            at={cur.at + m.sec(1.2)}
            tone={cur.tone}
          />
        </>
      )}

      {/* the recap, built a row at a time and holding to the end of the group */}
      <ComboTable
        columns={["Harga", "Volume", "Artinya"]}
        widths={[0.13, 0.15, 0.72]}
        rows={ROWS}
        rect={TABLE}
        headAt={T.four}
      />
      <Chip
        label="Harga menunjukkan geraknya · Volume memberi konteks"
        x={TABLE.x}
        y={TABLE.y + TABLE.h + theme.text.chip.size}
        at={T.fourth + m.sec(1.5)}
        anchor="left"
        tone="slate"
      />
    </Stage>
  );
};
