/**
 * core/StepRail.tsx — the episode roadmap, and the chapter card that opens each
 * section.
 *
 * ONE OBJECT, CARRIED ACROSS THE EPISODE. The rail that introduces the five
 * parts at the top is the same rail that ticks them off at the end. It is never
 * rebuilt; only `active` and `done` change.
 *
 * ⚠ TIMING REALITY. Chapter cards usually have almost no silence to live in —
 * a recorded VO leaves 0.3–0.7s between scenes, not the ~1s a card wants. Give
 * the card a window that STRADDLES the cut: it starts before the outgoing
 * scene's last word ends and clears after the incoming scene's first word. The
 * outgoing scene has already made its point by then.
 */
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { usePalette } from "./palette";
import { progress, textReveal } from "./helpers";
import { useMotion } from "./useMotion";

export type Step = { n: string; label: string };

export const StepRail = ({
  steps,
  at,
  /** Index of the step being entered. -1 for none. */
  active = -1,
  /** Indices already completed — rendered with a tick. */
  done = [],
  y = theme.stage.card.y + theme.stage.card.h / 2,
  opacity = 1,
}: {
  steps: Step[];
  at: number;
  active?: number;
  done?: number[];
  y?: number;
  opacity?: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (opacity <= 0.001) return null;
  const step = Math.max(1, Math.round(m.reveal / 3));
  const rowH = 78;
  const top = y - (steps.length * rowH) / 2;

  return (
    <>
      {steps.map((s, i) => {
        const r = textReveal(f, at + i * step, m.reveal);
        const isDone = done.includes(i);
        const isActive = i === active;
        const ink = isActive ? c.indigo : isDone ? c.slate : c.muted;
        return (
          <div
            key={s.n}
            style={{
              position: "absolute",
              left: theme.stage.card.x + 96,
              top: top + i * rowH,
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontFamily: theme.text.family,
              opacity: opacity * r.opacity * (isActive || isDone ? 1 : 0.45),
              transform: `translateY(${r.dy}px)`,
            }}
          >
            <span
              style={{
                fontSize: theme.text.title.size,
                fontWeight: 700,
                color: ink,
                minWidth: 62,
              }}
            >
              {s.n}
            </span>
            <span style={{ fontSize: theme.text.body.size, fontWeight: isActive ? 700 : 500, color: ink }}>
              {s.label}
            </span>
            {isDone && (
              <span style={{ fontSize: theme.text.body.size, color: c.slate }}>✓</span>
            )}
            {isActive && (
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: c.indigo,
                  transform: `scale(${progress(f, at + i * step, m.pop)})`,
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

/**
 * The card that names a chapter, over the cut between two scenes. Number,
 * title, and a one-line subtitle. It is deliberately short-lived: it is a
 * signpost, not a scene.
 */
export const ChapterCard = ({
  n,
  title,
  sub,
  at,
  over,
}: {
  n: string;
  title: string;
  sub?: string;
  at: number;
  /** Total frames the card is on screen, including its fade out. */
  over: number;
}) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  if (f < at || f > at + over) return null;
  const inP = progress(f, at, m.fade);
  const outP = 1 - progress(f, at + over - m.fade, m.fade);
  const op = Math.min(inP, outP);
  const head = textReveal(f, at, m.reveal);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: theme.canvas.width,
        height: theme.captionBand.top,
        background: c.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        fontFamily: theme.text.family,
        opacity: op,
      }}
    >
      <div style={{ fontSize: theme.text.title.size, fontWeight: 700, color: c.indigo }}>{n}</div>
      <div
        style={{
          fontSize: theme.text.display.size,
          fontWeight: theme.text.display.weight,
          color: c.ink,
          opacity: head.opacity,
          transform: `translateY(${head.dy}px)`,
        }}
      >
        {title}
      </div>
      {sub && (
        <div style={{ fontSize: theme.text.body.size, fontWeight: 500, color: c.slate }}>{sub}</div>
      )}
    </div>
  );
};
