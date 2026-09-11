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
 * ⚠ NOT ONE NUMBER IN THIS SCENE. No win rate, no probability, no score, no
 * "7 dari 10". An uncapped probability is precisely what the compliance line
 * forbids, and it would also be a fabricated number — there is no study behind
 * it. A tick, a cross and a strike say the same thing and are true.
 */
import { useCurrentFrame } from "remotion";
import {
  Line, Stage, VerdictMark, Words,
  textReveal, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, PREMISE, local } from "../data/timing";
import { GAP } from "../data/layout";
import { columns } from "../../../core";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC03;
const V = PREMISE;
// ═══════════════════════════════════════════════════════════════════════════

const [LEFT, RIGHT] = columns(theme.stage.card, 2, GAP);
/**
 * The readings' row, under the carried heading. ⚠ DERIVED FROM THE CARD, not
 * typed: the heading lands a little above the card's middle, so the row sits at
 * two thirds of it and the sentence under each reading still has room.
 */
const ROW_Y = theme.stage.card.y + theme.stage.card.h * 0.62;
const MARK = theme.text.title.size;

const Reading = ({
  rect,
  kind,
  label,
  at,
}: {
  rect: { x: number; y: number; w: number; h: number };
  kind: "check" | "cross";
  label: string;
  at: number;
}) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const r = textReveal(f, at, m.reveal);
  if (r.opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: ROW_Y,
        width: rect.w,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        fontFamily: theme.text.family,
        fontSize: theme.text.title.size,
        fontWeight: theme.text.title.weight,
        color: c.ink,
        whiteSpace: "nowrap",
        opacity: r.opacity,
        transform: `translate(0, calc(-50% + ${r.dy}px))`,
      }}
    >
      <VerdictMark kind={kind} size={MARK} />
      {label}
    </div>
  );
};

export const SC03 = () => (
  /* ⚠ TRANSPARENT, SO THE SCENE BEFORE IT CAN LEAVE PROPERLY. Simon asked for
     everything at 1139 to FADE except the carried words; an opaque stage here
     would cut the window off on the boundary frame instead. The composition's
     own Stage paints the ground, so nothing is missing. */
  <Stage transparent>
    <Reading rect={LEFT} kind="check" label="Probabilitas" at={local(V.probabilitas, FROM)} />
    <Reading rect={RIGHT} kind="cross" label="Kepastian" at={local(V.kepastian, FROM)} />

    <Words
      text="SETUP BAGUS → KUALITAS KEPUTUSAN NAIK"
      x={LEFT.x + LEFT.w / 2}
      y={ROW_Y + theme.text.title.size * 2}
      at={local(V.left, FROM)}
      anchor="center"
      maxWidth={LEFT.w * 0.8}
      size={theme.text.body.size}
    />
    <Words
      text="≠ JAMINAN HASIL"
      x={RIGHT.x + RIGHT.w / 2}
      y={ROW_Y + theme.text.title.size * 2}
      at={local(V.right, FROM)}
      anchor="center"
      maxWidth={RIGHT.w * 0.8}
      size={theme.text.body.size}
    />

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
