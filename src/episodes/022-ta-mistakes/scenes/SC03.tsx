/**
 * SC03 — probabilitas, bukan kepastian. `from 1140 · dur 855`
 *
 * The premise the rest of the video stands on, and the one scene that has to
 * make its point without a chart.
 *
 * ⚠ ITS HEADING IS NOT ITS OWN. "Technical Analysis" arrives from SC02, where
 * it was the subject of the question — see scenes/CarryLine.tsx. This scene
 * opens with two words already on screen and says what they give you, which is
 * why it no longer needs "Intinya:" to introduce itself.
 *
 * ⚠ TWO READINGS, NOT TWO PANELS — Simon. A tick and a cross beside a word
 * each, one at a time, on the frames he gave. The cards and the divider that
 * used to hold them said "here is a comparison" before either side of it had
 * arrived; the marks say it as they land.
 *
 * ⚠ AND THEY ARE ONE CENTRED ROW, NOT TWO PLACED COLUMNS. The distance between
 * the two words is a number Simon sets (150px), and that is only possible if
 * the layout owns it — placed independently, the gap would be whatever the
 * words happened to measure. Each reading carries its own sentence, so the
 * sentence moves when the reading does.
 *
 * ⚠ NOT ONE NUMBER IN THIS SCENE. No win rate, no probability, no score, no
 * "7 dari 10". An uncapped probability is precisely what the compliance line
 * forbids, and it would also be a fabricated number — there is no study behind
 * it. A tick, a cross and a sentence say the same thing and are true.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Line, Stage, VerdictMark,
  progress, textReveal, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, PREMISE, local } from "../data/timing";
import { READINGS } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC03;
const V = PREMISE;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Where the pair sits. ⚠ DERIVED FROM THE CARD, not typed: the carried heading
 * lands a little above the card's middle, so the row starts below that and the
 * sentences still clear the caption row.
 */
const ROW_Y = theme.stage.card.y + theme.stage.card.h * 0.58;
const MARK = theme.text.title.size;

const Row = ({
  children,
  y,
}: {
  children: React.ReactNode;
  y: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: READINGS.gap,
      fontFamily: theme.text.family,
    }}
  >
    {children}
  </div>
);

const Mark = ({ kind, label, at }: { kind: "check" | "cross"; label: string; at: number }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const r = textReveal(f, at, m.reveal);
  /** ⚠ THEY LEAVE AS THE CHART ARRIVES — Simon: "saat transisi ke chart, semua
   *  text fade out". The reading has been made; what the scene hands back to is
   *  the trade it was made about. */
  const out = progress(f, local(PREMISE.resume.at, FROM), m.fade);
  if (r.opacity <= 0.001 || out >= 0.999) return <span style={{ visibility: "hidden" }} />;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 24,
        fontSize: theme.text.title.size,
        fontWeight: theme.text.title.weight,
        color: c.ink,
        whiteSpace: "nowrap",
        opacity: r.opacity * (1 - out),
        transform: `translateY(${r.dy}px)`,
      }}
    >
      <VerdictMark kind={kind} size={MARK} />
      {label}
    </span>
  );
};

export const SC03 = () => (
  /* ⚠ TRANSPARENT, SO THE SCENE BEFORE IT CAN LEAVE PROPERLY. Simon asked for
     everything at 1139 to FADE except the carried words; an opaque stage here
     would cut the window off on the boundary frame instead. The composition's
     own Stage paints the ground, so nothing is missing. */
  <Stage transparent>
    {/* ⚠ TWO ROWS, EACH CENTRED, SO THE 150 IS BETWEEN THE WORDS. Simon set the
        distance between "Probabilitas" and "Kepastian"; sized as two columns
        the gap would have been 150 plus whatever slack each column had left
        over, which is not a number anyone can set. The sentences are their own
        centred pair underneath. */}
    <Row y={ROW_Y}>
      <Mark kind="check" label="Probabilitas" at={local(V.probabilitas, FROM)} />
      <Mark kind="cross" label="Kepastian" at={local(V.kepastian, FROM)} />
    </Row>
    <Line
      text="SETUP LENGKAP TETAP BISA GAGAL."
      x={theme.canvas.width / 2}
      y={theme.stage.caption.y}
      at={local(V.close, FROM)}
      size={theme.text.title.size}
      weight={theme.text.title.weight}
    />
  </Stage>
);
