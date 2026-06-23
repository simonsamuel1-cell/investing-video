/**
 * S14+S15+S16 merged into ONE continuous block (frames 2756–3457, dur 702) per the
 * GLOBAL continuous rule: the combo clip is mounted ONCE and never remounts/fades.
 * The same phone is reused as the RIGHT (Group) phone of S16 — it simply moves.
 *
 * NOTE — boundaries:
 *   • S13 → S14: a real FADE (S13 block fades out, this block fades in).
 *   • S14 → S15: CONTINUOUS — phone slides left(B-side)→centre(B-top); chips fade
 *     out, "One owner, many companies." fades in.
 *   • S15 → S16: CONTINUOUS — NO fade. The combo has frozen on its last frame (clip
 *     ends frame 3347 = Group tab); we keep that frozen frame (no image swap, per
 *     Simon: its last frame ≈ the Group screen) and MOVE the phone centre→right.
 *     Tab_1 (left) and Tab_2 (middle) then appear as images; title + labels in.
 *   • S16 → S17: normal cut (S17 fades in over the persistent silver).
 *
 * Block-local timeline (0 = frame 2756):
 *   S14: 0–398    phone LEFT + heading + 4 numbered Concept chips
 *   S15: 398–604  phone → CENTRE + "One owner, many companies."
 *   S16: 604–702  phone → RIGHT (Group, frozen); +Tab_1 left +Tab_2 middle; title/labels
 * Combo clock continues the clip from 18.0s = (2756−2216)/30.
 */
import { useCurrentFrame, Sequence } from "remotion";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneFrame } from "../components/PhoneFrame";
import { PhoneCenter } from "../components/PhoneCenter";
import { Heading } from "../components/Heading";
import { Chip } from "../components/Chip";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { ease, fadeIn, fadeOut } from "../util/anim";

const START_SEC = (2756 - 2216) / 30; // 18.0s

// phone poses: S14 (left) → S15 (centre) → S16 (right / Group)
const POSE14 = { x: 108, y: 80, w: 428 };
const POSE15 = { x: 771, y: 180, w: 378 };
const POSE16 = { x: 1172, y: 266, w: 285 }; // right column (cx≈1314), h≈576
// Block dur 728 = 702 + 26 hold-frames (Simon, 23 Jun): +16 before the S16 move
// (the static S15 hold @ block 590) and +10 in the static S16 tail (@ block 694).
// The +16 is realised by pushing the S16 move/content from 604 → 620; the +10 is
// absorbed by the longer block duration holding the static S16 row at the end.
const BLOCK_DUR = 728;
const M1_0 = 398, M1_1 = 424; // S14→S15 move
const M2_0 = 620, M2_1 = 640; // S15→S16 move (+16: delayed by the first inserted hold)
const S16_AT = 620;

// S16 row geometry (left & middle phones added as images)
const CX_LEFT = 606, CX_MID = 960;
const PH16_TOP = 266, PH16_H = 576, LABEL_Y = 872;

const CONCEPTS = ["Legendary Investors", "Government-Affiliated", "Common Ownership", "Special Situations"];

// S16 overlays (mounted only from the S16 boundary so they don't show in S14/S15)
const Scene16Extras = () => {
  const f = useCurrentFrame(); // 0 at S16_AT
  const lineW = ease(f, [4, 20], [0, 440]);
  return (
    <>
      <div style={{ position: "absolute", left: 96, top: 56, width: 1728, textAlign: "center", fontSize: 56, fontWeight: 800, letterSpacing: -0.5, color: COLORS.black, opacity: fadeIn(f, 0, 12) }}>
        One screen, Every angle
      </div>
      <div style={{ position: "absolute", left: 0, top: 138, width: 1920, display: "flex", justifyContent: "center" }}>
        <div style={{ height: 6, width: lineW, background: COLORS.cyan, borderRadius: 3 }} />
      </div>

      {/* left = Tab_1 (Sector), middle = Tab_2 (Concept) — appear after the move */}
      <PhoneCenter img={ASSETS.tab1} cx={CX_LEFT} top={PH16_TOP} height={PH16_H} delay={20} />
      <PhoneCenter img={ASSETS.tab2} cx={CX_MID} top={PH16_TOP} height={PH16_H} delay={26} />

      {[
        { label: "Sector", cx: CX_LEFT, d: 30 },
        { label: "Concept", cx: CX_MID, d: 34 },
        { label: "Group", cx: 1314, d: 34 },
      ].map((l) => (
        <div key={l.label} style={{ position: "absolute", left: l.cx - 130, top: LABEL_Y, width: 260, textAlign: "center", fontSize: 32, fontWeight: 800, color: COLORS.black, opacity: fadeIn(f, l.d, 10) }}>
          {l.label}
        </div>
      ))}
    </>
  );
};

export const Scene14to16 = () => {
  const frame = useCurrentFrame();

  // continuous phone pose: pose14 → pose15 (move1) → pose16 (move2). Nested eases
  // so the hold segment between moves stays constant.
  const px = ease(frame, [M2_0, M2_1], [ease(frame, [M1_0, M1_1], [POSE14.x, POSE15.x]), POSE16.x]);
  const py = ease(frame, [M2_0, M2_1], [ease(frame, [M1_0, M1_1], [POSE14.y, POSE15.y]), POSE16.y]);
  const pw = ease(frame, [M2_0, M2_1], [ease(frame, [M1_0, M1_1], [POSE14.w, POSE15.w]), POSE16.w]);

  const s14Op = fadeOut(frame, M1_0 - 14, 14); // S14 chips clear out as move1 starts
  const s15Op = fadeIn(frame, M1_1 - 14, 14) * fadeOut(frame, S16_AT - 6, 12); // in at centre, out at S16

  return (
    <SceneWrap>
      {/* combo12_15 mounted ONCE — never remounts; frozen on its last frame by S16 */}
      <PhoneFrame x={px} y={py} w={pw} video={ASSETS.combo12_15} startSec={START_SEC} />

      {/* S14 — heading + numbered Concept chips (right zone) */}
      <div style={{ opacity: s14Op }}>
        <Heading x={648} y={242} width={1128} size={42} delay={4}>
          Concepts: the stories tying stocks together.
        </Heading>
        {CONCEPTS.map((label, i) => (
          <Chip key={label} x={648} y={362 + i * 80} width={1128} variant={i % 2 === 0 ? "purple" : "cyan"} size={32} delay={18 + i * 16} badge={i + 1}>
            {label}
          </Chip>
        ))}
      </div>

      {/* S15 — centred heading */}
      <div style={{ opacity: s15Op }}>
        <Heading x={96} y={74} width={1728} align="center" size={56} delay={0}>
          One owner, many companies.
        </Heading>
      </div>

      {/* S16 — title, left/middle phones, labels */}
      <Sequence from={S16_AT} durationInFrames={BLOCK_DUR - S16_AT} name="S16 · one screen every angle">
        <Scene16Extras />
      </Sequence>
    </SceneWrap>
  );
};
