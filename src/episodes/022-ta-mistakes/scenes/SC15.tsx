/**
 * SC15 — the question worth asking. `from 13040 · dur 630`
 *
 * The wrong question arrives big, is struck, and drops; two better ones rise
 * in its place. One object replaced, not three appearing — the replacement IS
 * the claim.
 *
 * ⚠ THE FIRST QUESTION IS VERBATIM FROM THE SRT, curly quotes and sentence
 * case included: “Dia beli saham apa?”. The two that replace it are set in
 * caps because they are the scene's own headings, not quotations.
 */
import { useCurrentFrame } from "remotion";
import {
  Chip, Line, Stage, Words,
  fadeOut, progress, theme, useMotion, usePalette,
} from "../../../core";
import { ASK, BLOCK, local } from "../data/timing";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC15;
const V = ASK;
// ═══════════════════════════════════════════════════════════════════════════

const BOX = theme.stage.card;

export const SC15 = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;
  const drop = fadeOut(f, local(V.better[0].at, FROM) - m.fade, m.fade);

  return (
    <Stage>
      {/* the wrong question, struck, on its way out */}
      <div style={{ opacity: drop, transform: `translateY(${(1 - drop) * theme.text.title.size}px)` }}>
        <Chip
          label="“Dia beli saham apa?”"
          x={theme.canvas.width / 2}
          y={BOX.y + BOX.h * 0.26}
          at={local(V.wrong, FROM)}
          tone="slate"
          strike={progress(f, local(V.strike, FROM), m.reveal)}
          pill
        />
      </div>

      <Line
        text="Lebih penting:"
        x={theme.canvas.width / 2}
        y={theme.stage.title.y}
        at={local(V.better[0].at, FROM)}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />

      {V.better.map((q, i) => (
        <Words
          key={q.text}
          text={q.text}
          x={theme.canvas.width / 2}
          y={BOX.y + BOX.h * (0.36 + i * 0.18)}
          at={local(q.at, FROM)}
          anchor="center"
          maxWidth={BOX.w * 0.8}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      ))}

      {g >= V.close && (
        <Line
          text="KALAU LOGIKANYA TIDAK KAMU PAHAMI, JANGAN LANGSUNG IKUT."
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(V.close, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
          color={c.indigo}
        />
      )}
    </Stage>
  );
};
