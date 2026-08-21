/**
 * CG-A — Scenes 02 + 03 as ONE spanning Sequence (global 607 → 1765).
 *
 * The chart mounts once, here, and never unmounts. The price line drawn in
 * Scene 02 is the same object Scene 03 keeps annotating — a remount would
 * redraw the series the viewer just watched appear, and quietly undo the one
 * thing these two scenes prove together.
 *
 * SCENE 02 HAS NO ARITHMETIC. No sliding window, no accumulating dots, no
 * averaging callout. A smooth line appearing through the noise, and the noise
 * then receding, IS the idea.
 */
import { useCurrentFrame } from "remotion";
import { SafeArea } from "../components/SafeArea";
import { ChartFrame, gridOf } from "../components/ChartFrame";
import { MALine } from "../components/MALine";
import { LabelChip } from "../components/LabelChip";
import { TitleChip } from "../components/TitleChip";
import { TextBlock, assertBlocks } from "../components/TextBlock";
import { theme } from "../theme";
import { sec, sma, mulberry32, layoutMode, clamp01, progress } from "../helpers";
import { toBars, domainOf } from "../series";
import { EXPLAINER_2, fromAnchors } from "../data/shots";
import { CUTS, cutIn, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** Where this group is mounted, needed to read the cut from global frames. */
const FROM = 607;
/** Scene 03 begins here, in the group's own local frames. */
const SC03 = 499;
const T = {
  title: sec(0.0),
  price: sec(2.4),
  ma: sec(5.0),
  quiet: sec(11.8),
  // ── Scene 03 ──
  clear: SC03,
  fast: SC03 + sec(2.5),
  slow: SC03 + sec(9.5),
  modeB: SC03 + sec(15.9),
  panel: SC03 + sec(16.4),
  pulse: SC03 + sec(19.4),
};
const FAST_P = 20;
const SLOW_P = 200;
/** Scene 02's single average. One line, so it takes the orange. */
const MID_P = 40;
const TICKS = [73000, 74000, 75000, 76000, 77000];
/** Bars in the window. 120 over the mode-A box gives ~8px bodies. */
const N = 120;
/**
 * The indicator buttons under the title. Light grey at 35% until their line is
 * drawn, then indigo — the same switch the broker panel in SC01 uses.
 */
const MA_BTN = { top: 118, gap: 10, padX: 16, padY: 6, size: 30, off: 0.35 };
/**
 * How far the card sits below its layout box. 170 + 30 + 680 = 880, and the
 * subtitle band starts at 972 — the drop has 92px to spend and takes 30.
 */
const DROP = 30;
// ═══════════════════════════════════════════════════════════════════════════

/**
 * THE WINDOW IS A SLICE OF A LONGER HISTORY.
 *
 * A 200-period average cannot exist inside a 140-bar window — by the time the
 * first visible bar prints, MA200 has had its two hundred sessions for a long
 * while. So both averages are computed over the visible bars PLUS a seeded run
 * of prior ones, and only the visible part is drawn. The prior bars are never
 * shown; they exist so the arithmetic on screen is the arithmetic it claims.
 */
const CLOSES = fromAnchors(EXPLAINER_2, N, 3702);
const BARS = toBars(CLOSES, 3703);
/**
 * A FLAT random walk, not a drifting one. The first visible bar is the lowest
 * of the window, so a prior history that trends anywhere drags MA200 far below
 * the box — and since the domain has to contain it, the candles get squashed
 * into a strip to make room for a line nobody is looking at.
 */
const PRIOR = (() => {
  const rnd = mulberry32(2301);
  const step = CLOSES[0] * 0.0025;
  const out: number[] = [];
  let p = CLOSES[0];
  for (let i = 0; i < SLOW_P + 10; i++) {
    p += (rnd() - 0.5) * 2 * step;
    out.unshift(p);
  }
  return out;
})();
const WITH_HISTORY = [...PRIOR, ...CLOSES];
const maOf = (period: number) => sma(WITH_HISTORY, period).slice(PRIOR.length);
const MA_FAST = maOf(FAST_P);
const MA_SLOW = maOf(SLOW_P);
/** Scene 02's single line — the one that appears through the noise. */
const MA_MID = maOf(MID_P);

const DOMAIN = domainOf([...MA_SLOW], BARS);
const LABEL_AT = CLOSES.length - 16;

assertBlocks("ExplainerGroup", [{ from: T.panel, until: 1158 }]);

export const ExplainerGroup = () => {
  const f = useCurrentFrame();
  /**
   * The other half of SC01's cut. This group is mounted at global 607, so its
   * own frames are rebased and the cut's curve has to be read from the GLOBAL
   * frame — `f + FROM` — or the two halves would evaluate different points of
   * the same move and the join would read as two separate slides.
   */
  const dy = cutIn(f + FROM, CUTS.toAverage);
  const cut = cutBlur(f + FROM, CUTS.toAverage);
  /**
   * The card and everything on it sit DROP px below the layout box. The chart
   * and its white ground are one object here, so the offset is applied once,
   * to the box — move the card alone and every annotation reads the old grid.
   */
  const raw = layoutMode(f, [
    { at: 0, mode: "A" },
    { at: T.modeB, mode: "B" },
  ]);
  const box = { ...raw, y: raw.y + DROP };
  /**
   * No right-hand gutter any more. It existed to keep a price label off the
   * line it was measuring; with the labels gone it is 150px of empty card.
   */
  const G = gridOf(CLOSES, DOMAIN, box, 0.12, 0);

  /** Scene 02 quietens the price; Scene 03 keeps it quiet. */
  const price =
    f >= T.clear ? 0.4 : f >= T.quiet ? 1 - 0.75 * clamp01((f - T.quiet) / 24) : 1;
  const midOut = f >= T.clear ? 1 - progress(f, T.clear, sec(2.2)) : 1;
  /** Both lines thicken once, together — "trader sering melihat keduanya". */
  const pulse = f >= T.pulse ? Math.sin(Math.PI * clamp01((f - T.pulse) / 30)) : 0;

  return (
    <SafeArea>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${dy.toFixed(1)}px)`,
          filter: cut > 0.05 ? `blur(${cut.toFixed(1)}px)` : undefined,
        }}
      >
      {/* the white card every chart in this episode is drawn on */}
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: theme.layout.radius.lg,
          background: theme.colors.surface,
          border: `${theme.layout.border.thin}px solid ${theme.colors.border}`,
        }}
      />

      <ChartFrame
        closes={CLOSES}
        bars={BARS}
        grid={G}
        mode="candle"
        f={f}
        drawFrom={T.price}
        drawDur={sec(2.3)}
        ticks={TICKS}
        opacity={price}
      />

      {/* Scene 02's line — smooth, calm, and given the full six seconds */}
      <MALine
        values={MA_MID}
        grid={G}
        f={f}
        drawFrom={T.ma}
        drawDur={sec(6.1)}
        variant="slow"
        color={theme.colors.maOrange}
        opacity={midOut}
      />

      {/* Scene 03's pair */}
      <MALine
        values={MA_FAST}
        grid={G}
        f={f}
        drawFrom={T.fast}
        drawDur={sec(6.6)}
        variant="fast"
        width={theme.layout.stroke.ma + pulse * 1.5}
      />
      <MALine
        values={MA_SLOW}
        grid={G}
        f={f}
        drawFrom={T.slow}
        drawDur={sec(5.7)}
        variant="slow"
        width={theme.layout.stroke.ma + pulse * 1.5}
      />

      <TitleChip text="Moving Average" f={f} at={T.title} />

      {/* ── MA20 / MA200, under the title ── */}
      {f >= T.title + 12 && (
        <div
          style={{
            position: "absolute",
            left: theme.layout.titleChip.x,
            top: MA_BTN.top,
            display: "flex",
            gap: MA_BTN.gap,
            opacity: progress(f, T.title + 12, theme.motion.revealF),
          }}
        >
          {[
            { label: "MA20", at: T.fast },
            { label: "MA200", at: T.slow },
          ].map((b) => {
            /* the switch is a cross-fade between the two skins, so fill, border
               and label arrive together instead of snapping */
            const sel = f >= b.at ? progress(f, b.at, 10) : 0;
            const on = sel > 0.5;
            return (
              <span
                key={b.label}
                style={{
                  fontFamily: theme.type.family,
                  fontSize: MA_BTN.size,
                  fontWeight: theme.type.label.weight,
                  color: on ? theme.colors.surface : theme.colors.textMuted,
                  background: on ? theme.colors.indigo : theme.colors.surface,
                  border: `${theme.layout.border.thin}px solid ${on ? theme.colors.indigo : theme.colors.border}`,
                  borderRadius: theme.layout.radius.sm,
                  padding: `${MA_BTN.padY}px ${MA_BTN.padX}px`,
                  /* unselected sits back at 35% — present, but plainly off */
                  opacity: on ? 1 : MA_BTN.off,
                }}
              >
                {b.label}
              </span>
            );
          })}
        </div>
      )}

      <LabelChip
        text="MA20 — Faster • Closer to Price"
        x={G.x(LABEL_AT)}
        y={G.y(MA_FAST[LABEL_AT] ?? CLOSES[LABEL_AT])}
        f={f}
        at={T.fast + sec(3.4)}
        anchor="above"
        gap={30}
        tone={theme.colors.cyan}
        opacity={f >= T.modeB ? 1 - progress(f, T.modeB, 14) : 1}
      />
      <LabelChip
        text="MA200 — Slower • Big Picture"
        x={G.x(LABEL_AT)}
        y={G.y(MA_SLOW[LABEL_AT] ?? CLOSES[LABEL_AT])}
        f={f}
        at={T.slow + sec(3.2)}
        anchor="below"
        gap={30}
        opacity={f >= T.modeB ? 1 - progress(f, T.modeB, 14) : 1}
      />

      {/*
        SCENE 02 CARRIES NO TEXT ON THE CHART. The two blocks that used to run
        here — "PRICE ↑↓↑↓ / MOVING AVERAGE ↗", then "MOVING AVERAGE / Smooths
        Price → Reveals Trend" — are gone at Simon's direction. The line
        appearing through the noise is the idea; captioning it in the same
        frame says it twice. The heading and the MA20 / MA200 buttons stay.
      */}

      {/* Scene 03's Mode-B panel */}
      <TextBlock
        mode="B"
        localFrame={f}
        from={T.panel}
        until={1158}
        lines={[
          { text: "MA20 →", size: "h2", color: "cyan" },
          { text: "Fast Reaction / Near-Term", size: "label", color: "muted" },
          { text: "MA200 →", size: "h2", color: "indigo" },
          { text: "Slow Reaction / Big Picture", size: "label", color: "muted" },
        ]}
      />
      </div>
    </SafeArea>
  );
};
