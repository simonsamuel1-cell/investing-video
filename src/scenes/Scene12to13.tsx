/**
 * S12+S13 merged into ONE continuous block (frames 2216–2755, dur 540) per the
 * GLOBAL continuous rule: the combo clip Scene_12__13__14__15.mp4 is mounted ONCE
 * and never remounts/fades between S12 and S13 — it just keeps playing. Per-scene
 * graphics are layered by block-local frame.
 *
 * NOTE — boundaries:
 *   • S11 → S12: normal fade-in (SceneWrap head fade).
 *   • S12 → S13: CONTINUOUS — no fade/cut; the 3-tabs popup fades out and S13's
 *     title/tags fade in over the same uninterrupted combo phone (top 88, h 850).
 *   • S13 → S14: a real FADE — the whole block fades out at the end (S14 fades in).
 *
 * Block-local timeline (0 = frame 2216):
 *   S12: 0–198   — combo (Sector tab) + 3-tabs lift-up popup (in 96, out ~195)
 *   S13: 198–540 — title @198, tags @274/304/334/364, fast page-scroll @394 (combo
 *        exits top, tags ride to top, Scene_13.mp4 scrolls in below), fade-out @520
 */
import { Img, Sequence, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { ease, fadeOut, springUp } from "../util/anim";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── S12 portion ──────────────────────────────────────────────────────────────
const POPUP_AT = 96;
// 3-tabs card: centred horizontally (x=960) AND vertically (y=540).
const CARD = { left: 690, top: 540 - 61, width: 540, height: 122 };

// ── S13 portion (offsets = S13-local + 198) ──────────────────────────────────
const S13_TITLE = 198;
const T_TAGS = [274, 304, 334, 364]; // 198 + [76,106,136,166] → 01:23–01:26
const PART2 = 394; // 198 + 196 → 01:27 scroll
const SCROLL_DUR = 16;
const SCROLL = 880;
const FADE_OUT = 520; // 198 + 322
const FADE_DUR = 20;

// ── shared layout (combo == S12 size, continuous) ────────────────────────────
const COMBO = { top: 88, height: 850 };
const S13V = { top: 995, height: 850 }; // page-y; lands ~115 (below tags) after scroll
const TITLE_Y = 56;
const TAGS_Y = 936;
const TAG_W = 224;
const TAG_PITCH = 242;
const TAG_X0 = 485;
const TAG_DEFS = [
  { label: "Agriculture", variant: "purple" as const },
  { label: "Consumer", variant: "cyan" as const },
  { label: "Mining", variant: "purple" as const },
  { label: "Infrastructure", variant: "cyan" as const },
];

const Video2 = () => (
  <PhoneCenter video={ASSETS.sectorScroll} startSec={0} top={S13V.top} height={S13V.height} />
);

export const Scene12to13 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // S12 lift-up popup (fades out before S13 title)
  const popOp = interpolate(frame, [POPUP_AT, POPUP_AT + 10, 178, 196], [0, 1, 1, 0], CLAMP);
  const popLift = ease(frame, [POPUP_AT, POPUP_AT + 20], [160, 0]);
  const popScale = 0.9 + 0.1 * springUp(frame, fps, POPUP_AT);

  // S13 page scroll + end fade
  const scrollY = ease(frame, [PART2, PART2 + SCROLL_DUR], [0, -SCROLL]);
  const pageOut = fadeOut(frame, FADE_OUT, FADE_DUR);

  return (
    <SceneWrap>
      {/* the scrolling page: ONE combo + S13 title/tags/Scene_13. Combo never
          remounts across the S12→S13 boundary → continuous. */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${scrollY}px)`, opacity: pageOut }}>
        {/* combo12_15 — mounted once, plays from 0 through S12 (Sector tab) into S13 */}
        <PhoneCenter video={ASSETS.combo12_15} startSec={0} top={COMBO.top} height={COMBO.height} />

        {/* Scene_13.mp4 scrolls up into view from below the tags (plays from frame 0) */}
        <Sequence from={PART2} durationInFrames={540 - PART2} name="S13b · Scene_13.mp4 (sub-sectors)">
          <Video2 />
        </Sequence>

        {/* 4×1 tag row, staggered */}
        {TAG_DEFS.map((t, i) => (
          <Chip key={t.label} x={TAG_X0 + i * TAG_PITCH} y={TAGS_Y} width={TAG_W} variant={t.variant} size={18} padding="6px 14px" align="center" delay={T_TAGS[i]}>
            {t.label}
          </Chip>
        ))}

        {/* S13 title (top margin) */}
        <Heading x={96} y={TITLE_Y} width={1728} align="center" size={28} delay={S13_TITLE}>
          Sectors cover real business categories
        </Heading>
      </div>

      {/* S12 3-tabs lift-up popup (separate from the page; gone before S13) */}
      <div
        style={{
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.width,
          height: CARD.height,
          padding: 12,
          borderRadius: 22,
          background: COLORS.white,
          border: `2px solid ${COLORS.cyan}`,
          boxShadow: "0 26px 60px rgba(0,0,0,0.18)",
          opacity: popOp,
          transform: `translateY(${popLift}px) scale(${popScale})`,
        }}
      >
        <Img src={staticFile(ASSETS.tabs3)} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", scale: 1.14 }} />
      </div>
    </SceneWrap>
  );
};
