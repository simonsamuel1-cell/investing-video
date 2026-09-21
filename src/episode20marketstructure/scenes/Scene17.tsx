/**
 * SC17 — the Tuntun app, on film (from 8208, dur 347).
 *
 * This slot carried a `[NEEDS ASSET]` placeholder: the app's own trend and
 * momentum screen, which no drawn mock-up should stand in for. The recording
 * has arrived, so everything drawn here is gone and the frame is the recording.
 *
 * `market-structure.mp4` is 347 frames at 30fps — exactly this scene's length,
 * so it fills 8208 → 8554 with nothing left over at either end.
 *
 * The scene has two halves. First the app alone, with the Market Conditions
 * panel ringed as the voice names it. Then the recording steps aside and the
 * caveat is stated in words: it is a SECOND opinion, not the first one.
 */
import { useCurrentFrame } from "remotion";
import { Stage } from "../components/Stage";
import { ScreenClip } from "../components/ScreenClip";
import { HighlightBox, blink } from "../components/HighlightBox";
import { theme } from "../theme";
import { progress, fadeOut, textReveal } from "../helpers";
import { CUTS, cutPushIn, cutOut, cutBlur } from "../transitions/CameraCut";

// ═══ EDIT ═══════════════════════════════════════════════════════════════════
/** This scene's `from` in the Composition — needed to read the shared cuts. */
const SCENE_FROM = 8208;
/** The dolly SC16 started is still closing on the first frames of this one. */
const PUSH = 0.18;
const T = {
  mark: 76, // 8284 — the panel the voice is describing
  markOut: 168, // 8376 — it has been read; the box goes
  slide: 172, // the recording steps aside
  words: 176, // 8384 — "Gunakan sebagai second opinion,"
};
/**
 * The recording is portrait, so HEIGHT is what is set and the width follows
 * from its own 980 × 1080. It fills the active area top to bottom and stops
 * clear of the subtitle band, which owns the bottom 108px of every frame.
 *
 * `inset` is trimmed off EACH side. `shift` is how far it moves left to make
 * room for the words, and `over` is how long that move takes.
 */
const CLIP = {
  src: "market-structure.mp4",
  h: theme.stage.active.h,
  aspect: 980 / 1080,
  inset: 5,
  shift: 100,
  over: 26,
};
/** Where the footage sits once masked — the box is measured against this. */
const CLIP_W = CLIP.h * CLIP.aspect - CLIP.inset * 2;
const CLIP_X = (theme.canvas.width - CLIP_W) / 2;
/**
 * THE HIGHLIGHT, over Market Conditions and its table. `pad` is how far the
 * box reaches past the footage on each side; `blinkStep` is half a flash.
 */
const MARK = {
  pad: 20,
  y1: 478,
  y2: 940,
  /** One rise or fall of a flash. The pulse takes three of these. */
  blinkStep: 8,
  out: 12,
};
/**
 * The caveat, to the right of the recording once it has moved. Left-aligned
 * off the recording's new right edge, so the two read as one row.
 */
const WORDS = {
  x: 1330,
  y: 486,
  lead: 68,
  size: theme.text.title.size,
  weight: theme.text.title.weight,
  stagger: 10,
};
const WORD_LINES = [
  { text: "Gunakan sebagai", accent: false },
  { text: "second opinion", accent: true },
];
// ═══════════════════════════════════════════════════════════════════════════

export const Scene17 = () => {
  const f = useCurrentFrame();
  const slide =
    f >= T.slide ? progress(f, T.slide, CLIP.over) * -CLIP.shift : 0;
  const mark =
    blink(f, T.mark, MARK.blinkStep) *
    (f >= T.markOut ? fadeOut(f, T.markOut, MARK.out) : 1);

  // ── arriving on SC16's push, leaving on the slide into SC18 ──
  const g = f + SCENE_FROM;
  const push = cutPushIn(g, CUTS.toApp, PUSH);
  const dx = cutOut(g, CUTS.toChart);
  /** The two moves are 340 frames apart, so only one is ever non-zero. */
  const blur = Math.max(cutBlur(g, CUTS.toApp), cutBlur(g, CUTS.toChart));

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${dx}px) scale(${push})`,
          transformOrigin: `${theme.canvas.width / 2}px ${theme.canvas.height / 2}px`,
          filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: slide === 0 ? undefined : `translateX(${slide}px)`,
          }}
        >
          <ScreenClip
            src={CLIP.src}
            height={CLIP.h}
            aspect={CLIP.aspect}
            inset={CLIP.inset}
          />
          <HighlightBox
            rect={{
              x1: CLIP_X - MARK.pad,
              x2: CLIP_X + CLIP_W + MARK.pad,
              y1: MARK.y1,
              y2: MARK.y2,
            }}
            opacity={mark}
          />
        </div>

        {f >= T.words &&
          WORD_LINES.map((l, i) => {
            const rev = textReveal(f, T.words + i * WORDS.stagger);
            return (
              <div
                key={l.text}
                style={{
                  position: "absolute",
                  left: WORDS.x,
                  top: WORDS.y + i * WORDS.lead,
                  transform: `translateY(calc(-50% + ${rev.dy}px))`,
                  fontFamily: theme.text.family,
                  fontSize: WORDS.size,
                  fontWeight: WORDS.weight,
                  color: l.accent ? theme.color.indigo : theme.color.ink,
                  opacity: rev.opacity,
                  whiteSpace: "nowrap",
                }}
              >
                {l.text}
              </div>
            );
          })}
      </div>
    </Stage>
  );
};
