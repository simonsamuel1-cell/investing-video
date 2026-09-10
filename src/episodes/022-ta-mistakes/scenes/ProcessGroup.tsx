/**
 * CG-C — SC16 + SC17. `from 13670 · dur 2054`
 *
 * ONE rail, built and then carried. SC16 fills it question by question; SC17
 * moves it to the left and keeps it there while the self-check happens beside
 * it. The process did not go away — what is being checked in SC17 is the
 * person running it, and a rail that vanished at the cut would say the
 * opposite.
 *
 * ⚠⚠ THE SIX QUESTIONS ARE NOT EVENLY SPACED. 70 · 88 · 56 · 74 frames, then
 * 120 to "Dan yang paling penting:" and 117 more to the sixth. They are spoken
 * that way. Every one of them is `local(item.at, FROM)` and NOT `i * step` —
 * a tidy grid laid over speech is the single most common way a build in this
 * project comes off its own voice.
 *
 * ⚠ THE FIVE ARE THE SERIES SO FAR. Trend, level, setup, volume, multi-
 * timeframe are the episodes before this one; the rail is where that series
 * gets closed. It is left to read that way, with no line of narration spent
 * pointing at it.
 */
import { useCurrentFrame } from "remotion";
import {
  Card, Chip, Line, Stage, Words,
  fadeOut, progress, textReveal, theme, useMotion, usePalette,
} from "../../../core";
import { BLOCK, PROCESS, SELF, local } from "../data/timing";
import { RAIL, RAIL_LEFT, SELF_PANEL } from "../data/layout";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = BLOCK.SC16;
const V = PROCESS;
// ═══════════════════════════════════════════════════════════════════════════

const ROWS = 6;

export const ProcessGroup = () => {
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;

  /** ⚠ THE RAIL MOVES, IT IS NOT REPLACED. One curve carries the rect from the
   *  middle of the card to the left column; the row size follows the rect
   *  rather than being scaled, so nothing is stretched. */
  const move = progress(f, local(SELF.shrink.at, FROM), SELF.shrink.over);
  const lerp = (a: number, b: number) => a + (b - a) * move;
  const rect = {
    x: lerp(RAIL.x, RAIL_LEFT.x),
    y: lerp(RAIL.y, RAIL_LEFT.y),
    w: lerp(RAIL.w, RAIL_LEFT.w),
    h: lerp(RAIL.h, RAIL_LEFT.h),
  };
  const size = lerp(theme.text.body.size, theme.text.tag.size);
  const rowH = rect.h / (ROWS + 1);

  const quiet = progress(f, local(V.quiet, FROM), m.fade);
  const items = [...V.items, V.sixth];

  return (
    <Stage>
      <Line
        text="Sebelum entry, jadikan satu proses."
        x={theme.canvas.width / 2}
        y={theme.stage.title.y}
        at={local(V.pull, FROM)}
        size={theme.text.body.size}
        weight={theme.text.body.weight}
        color={c.slate}
      />

      <Card rect={rect} opacity={progress(f, local(V.rail.at, FROM), m.fade)} soft />

      {items.map((q, i) => {
        const at = local(q.at, FROM);
        const r = textReveal(f, at, m.reveal);
        const isSixth = i === ROWS - 1;
        /* one row goes blank to show "satu bagian penting belum jelas" */
        const blank = !isSixth && i === 2 ? fadeOut(f, local(V.blank, FROM), m.fade) : 1;
        return (
          <div
            key={q.text}
            style={{
              position: "absolute",
              left: rect.x + rect.w * 0.08,
              top: rect.y + rowH * (i + 0.7),
              display: "flex",
              alignItems: "center",
              gap: size * 0.6,
              fontFamily: theme.text.family,
              fontSize: isSixth ? size * 1.16 : size,
              fontWeight: isSixth ? theme.text.title.weight : theme.text.body.weight,
              color: isSixth ? c.indigo : c.ink,
              /* ⚠ THE ROW STAYS, THE ANSWER GOES. Fading the whole row made 03
                 vanish, which reads as a list of five — the point is that a
                 numbered part of the process is UNANSWERED. */
              opacity: r.opacity * (isSixth ? 1 : 1 - quiet * 0.45),
              transform: `translateY(${r.dy}px)`,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: c.muted, fontSize: size * 0.8 }}>{`0${i + 1}`}</span>
            <span style={{ opacity: blank > 0.5 ? 1 : 0.55 }}>{blank > 0.5 ? q.text : "—"}</span>
          </div>
        );
      })}

      {g >= V.close && g < BLOCK.SC17 && (
        <Line
          text="SATU BAGIAN BELUM JELAS → TRADE BELUM SIAP."
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(V.close, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}

      {g >= BLOCK.SC17 && <SelfCheck f={f} />}
    </Stage>
  );
};

/**
 * SC17 — the person, beside the process.
 *
 * ⚠ THE THREE EMOTION CHIPS ARE NOT DELETED AT THE END. "Emosi boleh ada" is
 * the line; they move out of the process's path instead. Removing them would
 * have the picture contradict the sentence under it.
 */
const SelfCheck = ({ f }: { f: number }) => {
  const m = useMotion();
  const c = usePalette();
  const g = f + FROM;
  const P = SELF_PANEL;
  const aside = progress(f, local(SELF.move.at, FROM), SELF.move.over);

  return (
    <>
      <Card rect={P} opacity={progress(f, local(SELF.panel, FROM), m.fade)} soft />
      <Line
        text="CEK DIRIMU SENDIRI"
        x={P.x + P.w / 2}
        y={P.y + P.h * 0.1}
        at={local(SELF.panel, FROM)}
        size={theme.text.tag.size}
        weight={theme.text.tag.weight}
        color={c.slate}
      />

      {/* ⚠ EACH FLAG LANDS ON ITS OWN WORD — 14999 / 15024 / 15099. The first
          two are 25 frames apart because "FOMO, kesal," is said that fast. */}
      {SELF.flags.map((q, i) => (
        <div key={q.label} style={{ transform: `translateX(${aside * P.w * 0.06}px)`, opacity: 1 - aside * 0.55 }}>
          <Chip
            label={q.label}
            x={P.x + P.w * 0.5}
            /* ⚠ 0.15 APART, NOT 0.13 — a pill is taller than its type and
               the three flags were sitting on each other. */
            y={P.y + P.h * (0.24 + i * 0.15)}
            at={local(q.at, FROM)}
            tone="warn"
            pill
          />
        </div>
      ))}

      {g >= SELF.stop && (
        <Chip
          label="BERHENTI DULU"
          x={P.x + P.w * 0.5}
          y={P.y + P.h * 0.68}
          at={local(SELF.stop, FROM)}
          tone="indigo"
          pill
        />
      )}

      {g >= SELF.tool && (
        <Words
          text="TA = ALAT BANTU KEPUTUSAN"
          x={P.x + P.w * 0.5}
          y={P.y + P.h * 0.83}
          at={local(SELF.tool, FROM)}
          anchor="center"
          size={theme.text.tag.size}
          weight={theme.text.chip.weight}
          marks={[{ text: "ALAT BANTU KEPUTUSAN", color: theme.color.hlCyan }]}
        />
      )}
      {g >= SELF.notCertainty && (
        <Line
          text="✗ alat untuk mencari kepastian"
          x={P.x + P.w * 0.5}
          y={P.y + P.h * 0.93}
          at={local(SELF.notCertainty, FROM)}
          size={theme.text.tag.size}
          weight={theme.text.tag.weight}
          color={c.muted}
        />
      )}

      {g >= SELF.close && (
        <Line
          text="EMOSI BOLEH ADA — JANGAN BIARKAN MENGAMBIL ALIH PROSES."
          x={theme.canvas.width / 2}
          y={theme.stage.caption.y}
          at={local(SELF.close, FROM)}
          size={theme.text.title.size}
          weight={theme.text.title.weight}
        />
      )}
    </>
  );
};
