/**
 * SahamChart — the right comparison window, grown into the film's main chart.
 * Continuity-local frames (mounted bare inside ChartContinuity).
 *
 * Simon, at 1370: "Saat ini window kiri yang membesar, ubah jadi window kanan
 * yang membesar. Lalu jeda 30 frame, dan lalu chartnya shrinking, preview
 * chartnya jadi seperti screenshot ini."
 *
 *   578–612   GROW   the card goes from its comparison rectangle to the paper,
 *                    and the close-up candles go with it — re-laid out every
 *                    frame, never scaled as a picture
 *   612–642   HOLD   thirty frames on the close-up at full size
 *   642–690   ZOOM   the window widens from candles 4–40 to all 101: the chart
 *                    "shrinks" as the rest of its history comes into view
 *   …–handover       SC03 is read off the wide view
 *   handover         the card dissolves onto the continuity paper beneath it,
 *                    which is the same white rectangle, and SC04's BMRI chart
 *                    is there underneath
 *
 * ⚠ NO PRICE OR DATE LABELS while this chart is up. The series is a trace of a
 * screenshot, not market data; the BMRI axes would caption it with figures it
 * does not have. ChartContinuity keeps its own axes hidden until the handover.
 */
import { useCurrentFrame, interpolate } from "remotion";
import { CandlestickChart, chartGeom } from "../components/CandlestickChart";
import { theme } from "../theme";
import { progress, progressInOut, type Box } from "../helpers";
import { usePalette } from "../palette";
import {
  SAHAM_CANDLES,
  SAHAM_CLOSE,
  SAHAM_ALL,
  FRAME_CLOSE,
  FRAME_ALL,
  rangeOf,
  sahamScale,
} from "../data/sahamReference";
import { PAIR_CARD, PAIR_LABEL_DY, SAHAM_BOX, SAHAM_TAKEOVER } from "../scenes/Scene02";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
export const S = {
  grow: SAHAM_TAKEOVER, // global 1369
  growDur: 34,
  hold: 30, // "Lalu jeda 30 frame"
  zoomDur: 48, // lands on 690 — global 1481, six frames before the trendlines
  labelOut: 12, // "Saham" clears early in the grow
  /** The candles clear this long before the handover… */
  contentOut: 18,
  /** …and the card this long after it, over the identical paper. */
  cardOut: 20,
};
// ═══════════════════════════════════════════════════════════════════════════

const ZOOM_AT = S.grow + S.growDur + S.hold;
const CLOSE = rangeOf(SAHAM_CLOSE);
const ALL = rangeOf(SAHAM_ALL);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

/** Everything about the saham chart on frame `f` — SC03 reads it off geom. */
export const sahamGeomAt = (f: number, paper: Box, full: Box, handover: number) => {
  const grow = f >= S.grow ? progressInOut(f, S.grow, S.growDur) : 0;
  const zoom = f >= ZOOM_AT ? progressInOut(f, ZOOM_AT, S.zoomDur) : 0;
  const card = lerpBox(PAIR_CARD(1), paper, grow);
  const box = lerpBox(SAHAM_BOX, full, grow);
  const win: [number, number] = [lerp(SAHAM_CLOSE[0], SAHAM_ALL[0], zoom), lerp(SAHAM_CLOSE[1], SAHAM_ALL[1], zoom)];
  /**
   * ⚠ THE PRICE RANGE RUNS AHEAD OF THE WINDOW. It is fully open by 80% of
   * the zoom, so every candle that walks in on the right — the tallest,
   * candle 93, arrives at 88% — lands inside a frame already big enough for
   * it, instead of poking out of the top and being chased by the scale.
   */
  const lead = interpolate(zoom, [0, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const frame = { top: lerp(FRAME_CLOSE.top, FRAME_ALL.top, zoom), bottom: lerp(FRAME_CLOSE.bottom, FRAME_ALL.bottom, zoom) };
  const y = sahamScale(box, lerp(CLOSE.hi, ALL.hi, lead), lerp(CLOSE.lo, ALL.lo, lead), frame);
  const cx = chartGeom(SAHAM_CANDLES, win, box).cx;
  const contentOp = f >= handover - S.contentOut ? 1 - progress(f, handover - S.contentOut, S.contentOut) : 1;
  const cardOp = f >= handover ? 1 - progress(f, handover, S.cardOut) : 1;
  return { grow, zoom, card, box, win, y, cx, contentOp, cardOp, live: f >= S.grow && cardOp > 0.001 };
};
export type SahamGeom = ReturnType<typeof sahamGeomAt>;

export const SahamChart = ({ paper, full, handover }: { paper: Box; full: Box; handover: number }) => {
  const pal = usePalette();
  const f = useCurrentFrame();
  const G = sahamGeomAt(f, paper, full, handover);
  if (!G.live) return null;
  const labelOp = 1 - progress(f, S.grow, S.labelOut);

  return (
    /* ⚠ ABOVE THE FADING LEFT WINDOW WHILE IT GROWS — that window is lifted
       (zIndex 3) for its own fold and would otherwise ghost over this card.
       After the grow it drops back into normal order, so SC03's overlays,
       mounted later, sit on top of it. */
    <div style={{ position: "absolute", inset: 0, zIndex: f < S.grow + S.growDur ? 5 : undefined }}>
      <div
        style={{
          position: "absolute",
          left: G.card.x,
          top: G.card.y,
          width: G.card.w,
          height: G.card.h,
          borderRadius: lerp(theme.radius.card, theme.radius.cardLg, G.grow),
          background: pal.cardBg,
          border: `${theme.stroke.hair}px solid ${pal.border}`,
          opacity: G.cardOp,
        }}
      />
      {labelOp > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: G.card.x,
            top: G.card.y + PAIR_LABEL_DY,
            width: G.card.w,
            textAlign: "center",
            fontFamily: theme.type.family,
            fontSize: theme.type.label.size,
            fontWeight: theme.type.label.weight,
            color: pal.slate,
            opacity: labelOp,
          }}
        >
          Saham
        </div>
      )}
      {G.contentOp > 0.001 && (
        <div style={{ position: "absolute", inset: 0, opacity: G.contentOp }}>
          <CandlestickChart data={SAHAM_CANDLES} window={G.win} box={G.box} scaleOverride={G.y} showAxes={false} />
        </div>
      )}
    </div>
  );
};
