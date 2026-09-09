/**
 * The bonus chapter's own layer.  `from 16681 · to 18791`
 *
 * ⚠ IT EXISTS BECAUSE TWO THINGS HAVE TO OUTLIVE A SCENE. Simon: "ketika
 * transisi 17847-17848, judulnya tidak ikut transisi". A title owned by SC18 is
 * carried out with SC18 whatever you do to it — the only way for it to stay
 * still across a cut is for it to belong to NEITHER side. It belongs to the
 * chapter, and so does the ground under it: painted per scene, the drift would
 * restart on the cut, which is the one thing a background that never stops must
 * not do.
 *
 * ⚠ MOUNTED BELOW THE TILING, and both scenes above it are transparent. That is
 * what makes it one surface rather than a thing each scene has to remember to
 * draw.
 */
import { useCurrentFrame } from "remotion";
import { AbsoluteFill } from "remotion";
import { progress, ramp, useMotion, usePalette, theme } from "../../../core";
import { MISTAKES, local } from "../data/timing";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
const FROM = MISTAKES.from;
const V = MISTAKES;
// ═══════════════════════════════════════════════════════════════════════════

export const MistakesLayer = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  /** ⚠ LINEAR AND UNCLAMPED. A drift that eases reads as a move about to
   *  finish; this one neither starts nor ends on screen. */
  const d = f / V.ground.over;

  /**
   * ⚠ THE TAIL IS TYPED IN AND TYPED OUT, and the two are ONE number: how many
   * letters are showing. Typing out is the same gesture run backwards, so it is
   * the same arithmetic with the ends swapped — a separate fade would have made
   * the swap look like two different animations of two different titles.
   */
  const tail = V.head.tails
    .map((t) => {
      const on = ramp(f, local(t.at, FROM), t.text.length * V.head.perChar);
      const off = ramp(f, local(t.gone, FROM), t.text.length * V.head.perChar);
      return { text: t.text, chars: Math.floor((on - off) * t.text.length) };
    })
    .find((t) => t.chars > 0);

  return (
    <AbsoluteFill style={{ background: c.bg }}>
      {/* ── the drifting blooms ─────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, filter: `blur(${V.ground.blur}px)`, overflow: "hidden" }}>
        {V.ground.blobs.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.r,
              height: b.r,
              borderRadius: "50%",
              background: theme.color[b.c],
              transform: `translate(${(d * b.dx).toFixed(2)}px, ${(d * b.dy).toFixed(2)}px)`,
            }}
          />
        ))}
      </div>

      {/* ── the heading the cut does not touch ──────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: theme.margin.left,
          top: theme.stage.title.y - theme.text.title.size / 2,
          fontFamily: theme.text.family,
          fontSize: theme.text.title.size,
          fontWeight: theme.text.title.weight,
          lineHeight: 1.2,
          color: theme.color.indigo,
          whiteSpace: "pre",
          /* ⚠ EASED, AND ITS LENGTH COMES FROM THE THEME — it was a linear ramp
           over a frame count typed in here, which is the one thing a component
           may never do (see helpers.ts). */
        opacity: progress(f, 0, m.fade),
        }}
      >
        {V.head.lead}
        {tail ? tail.text.slice(0, tail.chars) : ""}
      </div>
    </AbsoluteFill>
  );
};
