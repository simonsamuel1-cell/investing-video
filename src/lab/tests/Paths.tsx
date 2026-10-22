/**
 * lab/tests/Paths.tsx — TEST 03 · generative canvas.
 *
 * ⚠ THIS IS THE ONE WITH A JOB ALREADY WAITING FOR IT. SC10's B3b draws three
 * dashed branches — up, sideways, down — to say "kita belum tahu apa yang
 * terjadi berikutnya". Three branches is not what not-knowing looks like. It
 * looks like three options, which is a smaller and more confident claim than
 * the sentence makes. What not-knowing looks like is THIS: eight hundred
 * journeys leaving the same bar, none of them privileged.
 *
 * ⚠ DENSITY IS THE WHOLE POINT, AND IT IS WHY EACH PATH IS STROKED ALONE.
 * Batched into one Path2D the overlaps paint once and the cloud comes out
 * flat; stroked separately at a very low alpha they ACCUMULATE, so the darker
 * a region is, the more futures passed through it. Nothing is being drawn to
 * represent probability — the probability is the ink piling up.
 *
 * ⚠ SEEDED, AND RE-SEEDED FROM THE SAME NUMBER EVERY FRAME. core/seeded is
 * mulberry32. The eight hundred walks are therefore identical on every frame
 * and on every worker; the only thing the frame changes is HOW FAR along each
 * one is drawn. Math.random here would make the cloud boil and no two renders
 * would match.
 *
 * ⚠ THE CONE WIDENS AS sqrt(t), WHICH IS NOT A STYLING CHOICE. That is what a
 * random walk actually does. Drawing a straight-sided cone would be inventing
 * a shape; this one is the honest null model, which is exactly the claim the
 * scene is making.
 *
 * ⚠ ONE THING FOR SIMON TO RULE ON. A real walk's density is heaviest in the
 * middle, so the picture does lean toward "sideways". That is a true statement
 * about a random walk, not about a stock — but SC10's compliance note says
 * nothing may imply one outcome is likelier. Flattening it would mean drawing
 * something that is not a walk. His call.
 *
 * Everything is confined to theme.stage.card, so the subtitle band and the
 * logo zone are never touched and no masking is needed.
 */
import { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Line, Stage, progress, seeded, theme, useMotion, usePalette } from "../../core";

const BOX = theme.stage.card;
/** Where the known tape ends and the futures begin. */
const CUT = BOX.x + BOX.w * 0.36;
const MID = BOX.y + BOX.h * 0.56;

const WALKS = 800;
const STEPS = 90;
/** A handful drawn solid, so the cloud still reads as made of journeys. */
const TRACED = 5;

/** One walk's final offset, without drawing it. The step rule here must stay
 *  identical to the one in the render loop or the picked paths are not the
 *  paths that get traced. */
const endOf = (w: number) => {
  const r = seeded(0x5000 + w);
  let y = 0;
  for (let s = 1; s <= STEPS; s++) y += (r() - 0.5) * 17;
  return y;
};

/**
 * ⚠ CHOSEN BY SPREAD, NOT BY INDEX — AND THIS IS A COMPLIANCE FIX, NOT A
 * STYLING ONE. Tracing walks 0..4 drew five journeys that all happened to
 * drift UP, and five bold rising lines over a neutral cloud say "up is
 * likelier" as loudly as a label would. SC10's own note forbids exactly that.
 * Picking at even quantiles of the final offset guarantees the traced few span
 * the range: one near the bottom, one near the top, the rest between.
 */
const TRACE_SET = (() => {
  const order = Array.from({ length: WALKS }, (_, w) => w).sort((a, b) => endOf(a) - endOf(b));
  const picks = new Set<number>();
  for (let i = 0; i < TRACED; i++) {
    picks.add(order[Math.round((i * (WALKS - 1)) / (TRACED - 1))]);
  }
  return picks;
})();

/** The known tape — a seeded walk, drawn as plain bars. */
const KNOWN = (() => {
  const r = seeded(0x3101);
  const n = 42;
  const pts: number[] = [];
  let v = 0;
  for (let i = 0; i < n; i++) {
    v += (r() - 0.46) * 26;
    pts.push(v);
  }
  return pts;
})();

export const PathsTest = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const f = useCurrentFrame();
  const m = useMotion();
  const c = usePalette();

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* ── the past, which is known ──────────────────────────────────────── */
    const stepX = (CUT - BOX.x - 40) / KNOWN.length;
    ctx.strokeStyle = c.slate;
    ctx.lineWidth = theme.shape.rule;
    ctx.lineCap = "round";
    const grown = progress(f, 0, m.sec(1.1));
    ctx.beginPath();
    KNOWN.slice(0, Math.ceil(KNOWN.length * grown)).forEach((v, i) => {
      const x = BOX.x + 40 + i * stepX;
      const y = MID + v;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    /* ── the futures, which are not ────────────────────────────────────── */
    const reveal = progress(f, m.sec(1.0), m.sec(3.4));
    const shown = Math.ceil(STEPS * reveal);
    if (shown > 1) {
      const span = BOX.x + BOX.w - 40 - CUT;
      const dx = span / STEPS;
      const y0 = MID + KNOWN[KNOWN.length - 1];

      for (let w = 0; w < WALKS; w++) {
        /* ⚠ RE-SEEDED PER WALK, FROM THE WALK'S OWN INDEX. One stream shared
           across all eight hundred would make every walk depend on how many
           were drawn before it — and the cloud would change shape the moment
           WALKS changed. */
        const r = seeded(0x5000 + w);
        const traced = TRACE_SET.has(w);
        ctx.globalAlpha = traced ? 0.9 : 0.035;
        ctx.strokeStyle = traced ? c.indigo : c.cyan;
        ctx.lineWidth = traced ? theme.shape.rule : theme.shape.hairline;
        ctx.beginPath();
        ctx.moveTo(CUT, y0);
        let y = y0;
        for (let s = 1; s <= shown; s++) {
          /* the step is constant; the SPREAD grows as sqrt of distance, which
             is the walk's own doing rather than anything drawn */
          y += (r() - 0.5) * 17;
          ctx.lineTo(CUT + s * dx, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    /* the decision line, last, so it sits on top of its own futures */
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c.indigo;
    ctx.lineWidth = theme.shape.rule;
    ctx.setLineDash([12, 9]);
    ctx.beginPath();
    ctx.moveTo(CUT, BOX.y + 40);
    ctx.lineTo(CUT, BOX.y + BOX.h - 40);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [f, m, c]);

  return (
    <Stage>
      <AbsoluteFill>
        <canvas ref={ref} width={theme.canvas.width} height={theme.canvas.height} />
      </AbsoluteFill>
      <Line
        text="yang sudah terjadi"
        x={BOX.x + 40}
        y={BOX.y + 24}
        at={0}
        anchor="left"
        size={theme.text.axis.size}
        weight={theme.text.axis.weight}
        color={c.slate}
      />
      <Line
        text="800 kemungkinan, tidak satu pun diistimewakan"
        x={CUT + 24}
        y={BOX.y + 24}
        at={m.sec(1.0)}
        anchor="left"
        size={theme.text.axis.size}
        weight={theme.text.axis.weight}
        color={c.slate}
      />
    </Stage>
  );
};
