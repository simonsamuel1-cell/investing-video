/**
 * S13 (TWO continuous parts; per Simon's hand layout + 23 Jun revision) —
 * "Sectors cover real business categories … broken down further into Tuntun's own
 * sub-sectors."
 *
 * The combo clip is kept at S12's EXACT size (top 88, height 850, centred) so it
 * is continuous from S12 with no size jump. Because that phone fills the active
 * area, the title sits in the thin top margin and the 4×1 tag row in the thin
 * bottom margin (both shrunk, per Simon's allowance).
 *
 * Part 1 (local 0–196 ≈ 01:20–01:27): title (top), combo phone (centred, clock
 *   continues S12 at 6.6s), 4 tags in ONE row below; tags stagger at f76/106/136/
 *   166 (01:23–01:26).
 * Part 2 (local 196–342 ≈ 01:27–01:32): the whole page scrolls UP fast — combo
 *   exits the top, the tag row lands where the title was, and Scene_13.mp4 (same
 *   850 size) scrolls in from below, playing from its first frame (1×, no edits).
 *   Everything fades out before S14.
 *
 * Bottom band is reserved for burned-in subtitles (project-wide) — nothing drawn.
 */
import { Sequence, useCurrentFrame } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneCenter } from "../components/PhoneCenter";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";
import { ease, fadeOut } from "../util/anim";

// ── timing (local frames; scene from=2414) ──────────────────────────────────
const PART2 = 196; // 01:27 — Part 1 → Part 2 split (continuous)
const SCROLL_DUR = 16; // fast
const SCROLL = 880; // page lift: tag row (y936) → top band (y56)
const FADE_OUT = 322;
const FADE_DUR = 20;
const T_TAGS = [76, 106, 136, 166]; // 01:23 / 01:24 / 01:25 / 01:26

// ── layout (page coordinates; the whole page scrolls in Part 2) ──────────────
const COMBO = { top: 88, height: 850 }; // == S12 exactly → continuous, no size jump
const S13V = { top: 995, height: 850 }; // page-y; lands at ~115 (below tags) after scroll
const TITLE_Y = 56;
const TAGS_Y = 936; // thin bottom margin, just under the phone
const TAG_W = 224;
const TAG_PITCH = 242; // 224 + 18 gap
const TAG_X0 = 485; // 960 − (4·224 + 3·18)/2

const TAG_DEFS = [
  { label: "Agriculture", variant: "purple" as const },
  { label: "Consumer", variant: "cyan" as const },
  { label: "Mining", variant: "purple" as const },
  { label: "Infrastructure", variant: "cyan" as const },
];

// Scene_13.mp4 below the tags in the page; mounted in its own Sequence so it plays
// from its first frame as it scrolls in.
const Video2 = () => (
  <PhoneCenter video={ASSETS.sectorScroll} startSec={0} top={S13V.top} height={S13V.height} />
);

export const Scene13 = () => {
  const frame = useCurrentFrame();
  const scrollY = ease(frame, [PART2, PART2 + SCROLL_DUR], [0, -SCROLL]);
  const out = fadeOut(frame, FADE_OUT, FADE_DUR);

  return (
    <SceneWrap>
      {/* the page: title + combo + tags + Scene_13 stacked; transform scrolls it
          (and makes it the containing block for the absolute children). */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${scrollY}px)`, opacity: out }}>
        {/* combo12_15 — S12's size, clock continues at 6.6s = (2414−2216)/30 */}
        <PhoneCenter video={ASSETS.combo12_15} startSec={(2414 - 2216) / 30} top={COMBO.top} height={COMBO.height} />

        {/* Scene_13.mp4 scrolls up into view from below the tags */}
        <Sequence from={PART2} durationInFrames={342 - PART2} name="S13b · Scene_13.mp4 (sub-sectors)">
          <Video2 />
        </Sequence>

        {/* 4×1 tag row (in front), staggered */}
        {TAG_DEFS.map((t, i) => (
          <Chip
            key={t.label}
            x={TAG_X0 + i * TAG_PITCH}
            y={TAGS_Y}
            width={TAG_W}
            variant={t.variant}
            size={18}
            padding="6px 14px"
            align="center"
            delay={T_TAGS[i]}
          >
            {t.label}
          </Chip>
        ))}

        {/* title (in front, top margin) */}
        <Heading x={96} y={TITLE_Y} width={1728} align="center" size={28} delay={0}>
          Sectors cover real business categories
        </Heading>
      </div>
    </SceneWrap>
  );
};
