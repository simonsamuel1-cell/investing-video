/**
 * PhoneWalkthrough — Scenes 3–9 as ONE continuous phone shot (abs 1532→6824,
 * 5292f). The Untitled-2.svg phone is mounted ONCE here, never remounts and never
 * moves off its centred placement (it only translates between storyboard spots
 * within S3/S6). NO shadow (flat on #F5F5F5). Inside the aperture, the screen
 * content cross-dissolves between four sources (the footage is one recording for
 * 3–6, then three different files for 7–9 — continuity = held device + soft
 * screen dissolves, never a fabricated scroll between screens):
 *   rec3to6 (1532–4844, continuous scroll) ─✕→ rec7to8 (4844–6024) ─✕→ shot-radar
 *   (Scene 8.jpg, 6024–6406) ─✕→ rec9 (6406–6824, last frame frozen ~17f).
 * Overlays pop (UI highlights) or textReveal (typography) on VO-derived triggers.
 *
 * Layout authority = storyboards Scene 3 1–7 / Scene 4 1–3 / Scene 5 / Scene 6
 * 1–3 / Scene 8 (Scene 7 brand-built — no storyboard). Recording scroll for 3–6
 * must line up; S5→S6 loosest (~2s) — re-time the mount if it drifts, never cut.
 */
import { AbsoluteFill, interpolate, Sequence, Img, OffthreadVideo, Freeze, staticFile, useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { SceneWrap, PhoneSvg, PopAsset } from "../components";
import { COLORS, TYPE, WEIGHT, RADII, BORDER, EASE, VO_PAD } from "../theme";
import { fadeIn, fadeOut, textLife } from "../helpers";
import { montserratFamily } from "../fonts";
import { ASSETS } from "../timeline";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE } as const;

// ── S3–S6 triggers (continuity-relative, cf = abs − 1532) ───────────────────
const T2 = 338, T4 = 468, T6 = 686;
const S6 = 2502;
const S6A = S6 + 327, S6B = S6 + 585;
const S6_END = 3312; // abs 4844 (S7 start)

// ── S7–S9 triggers (tail = cf 3312; values are tail-relative + TAIL) ─────────
const TAIL = 3312;
const B1 = TAIL + 486, B2 = TAIL + 630, B3 = TAIL + 841, S7_CLOSE = TAIL + 922, S7_OUT = TAIL + 1109; // rows/closeTag now end abs 6437 (was 6286)
const S8_SWITCH = TAIL + 1180; // abs 6024
const SEAM89 = TAIL + 1562; // abs 6406
const DIS = 10; // dissolve frames
const REC9_LAST = 254; // freeze Scene 9 at the abs-7307 frame (rec9 local 254) and hold to 7387 (Simon, 26 Jun)

const BADGE_ASPECT = 1741 / 3254;
const PHONE_H = 856;
const PHONE_W = 442; // rendered PhoneSvg width for PHONE_H (matches the device)
const HL_OVERHANG = 20; // highlight boxes extend 20px beyond the phone on each side (Simon's rule)
const PHONE_LEFT_CX = 520; // phone slides here for the S3 recap (abs 2724+, Simon 25 Jun)
const BADGE_H = 792;

// S3 comparison badges flank the phone with a 40px gap (Simon, 25 Jun).
const S3_BADGE_W = Math.round(BADGE_H * BADGE_ASPECT);
const S3_GAP = 40;
const BULL_CX = 960 - PHONE_W / 2 - S3_GAP - S3_BADGE_W / 2;
const BEAR_CX = 960 + PHONE_W / 2 + S3_GAP + S3_BADGE_W / 2;

// Highlight boxes — phone width + 20px each side, brand indigo outline.
const HL_LEFT = 960 - PHONE_W / 2 - HL_OVERHANG;
const HL_W = PHONE_W + HL_OVERHANG * 2;
const LINCLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// Market-Conditions row box tops (measured on the static Technical view).
const ROW_TREND = 543, ROW_MOM = 590, ROW_STR = 637, ROW_BOX_H = 48;

// S3 recap label (image 1): big indigo word + small grey Montserrat sub-line,
// centred on `cx` (aligned with the verdict question).
const RecapLabel = ({ cx, y, op, label, sub }: { cx: number; y: number; op: number; label: string; sub: string }) => (
  <div style={{ position: "absolute", left: cx - 500, top: y, width: 1000, textAlign: "center", opacity: op }}>
    <div style={{ fontSize: TYPE.lead, fontWeight: WEIGHT.bold, color: COLORS.primary }}>{label}</div>
    <div style={{ marginTop: 8, fontSize: TYPE.sub, fontWeight: WEIGHT.medium, color: COLORS.slate, fontFamily: montserratFamily }}>{sub}</div>
  </div>
);

// S3 verdict chip (image 2): a black word in a bordered pill.
const VerdictChip = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "inline-block", padding: "8px 26px", borderRadius: RADII.chip, border: `${BORDER.regular}px solid ${COLORS.text}`, fontSize: TYPE.headline, fontWeight: WEIGHT.bold, color: COLORS.text }}>
    {children}
  </div>
);

// A phone template playing a video, fading in at mount and out at `outAt`
// (frames relative to its own start). Used for the S5 three-up recap.
const VideoPhoneInner = ({ video, cx, top, h, outAt }: { video: string; cx: number; top: number; h: number; outAt: number }) => {
  const f = useCurrentFrame();
  const op = Math.min(fadeIn(f, 0, 14), fadeOut(f, outAt, 12));
  return (
    <div style={{ opacity: op }}>
      <PhoneSvg cx={cx} top={top} h={h} video={video} />
    </div>
  );
};
const VideoPhone = ({ video, cx, top, h, inAt, outAt }: { video: string; cx: number; top: number; h: number; inAt: number; outAt: number }) => (
  <Sequence from={inAt} durationInFrames={outAt - inAt + 14} name="recap phone">
    <VideoPhoneInner video={video} cx={cx} top={top} h={h} outAt={outAt - inAt} />
  </Sequence>
);

// A phone template showing a STATIC image (S6 two-up examples). `op` fades the
// whole device. Screen image is fill-fit (captures share the 980×1920 aspect).
const ImgPhone = ({ src, cx, top, h, op }: { src: string; cx: number; top: number; h: number; op: number }) => (
  <div style={{ opacity: op }}>
    <PhoneSvg cx={cx} top={top} h={h}>
      <Img src={staticFile(src)} style={screenImg} />
    </PhoneSvg>
  </div>
);

// A free-placed highlight box (custom left/width/colour) — for the S6 example
// callouts that frame sub-regions of a phone screen rather than a full row.
const FreeBox = ({ left, top, width, height, op, color, wash }: { left: number; top: number; width: number; height: number; op: number; color: string; wash: string }) => (
  <div style={{ position: "absolute", left, top, width, height, opacity: op, borderRadius: RADII.chip, border: `${BORDER.bold}px solid ${color}`, background: wash, pointerEvents: "none" }} />
);

const HiliteBox = ({ top, height, opacity, left = HL_LEFT }: { top: number; height: number; opacity: number; left?: number }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width: HL_W,
      height,
      opacity,
      borderRadius: RADII.card,
      border: `${BORDER.bold}px solid ${COLORS.primary}`,
      background: COLORS.primaryWash,
      pointerEvents: "none",
    }}
  />
);

const fill = { position: "absolute", inset: 0, width: "100%", height: "100%" } as const;
const screenImg = { width: "100%", height: "100%", objectFit: "fill" } as const;

// S9 screen: plays from abs 7053, then freezes at the abs-7307 frame to hold to 7387.
const Scene9Screen = () => {
  const f = useCurrentFrame(); // 0 at the rec9 Sequence start (abs 7053)
  return (
    <Freeze frame={REC9_LAST} active={f >= REC9_LAST}>
      <OffthreadVideo src={staticFile(ASSETS.rec9)} muted style={screenImg} />
    </Freeze>
  );
};

// S7 cumulative decision row (textReveal; verdict word indigo, not green/red).
const Row = ({ verdict, desc, inAt, top, frame }: { verdict: string; desc: string; inAt: number; top: number; frame: number }) => {
  const r = textLife(frame, inAt, S7_OUT);
  return (
    <div style={{ position: "absolute", left: 96, top, width: 580, opacity: r.opacity, transform: `translateY(${r.ty}px)` }}>
      <div style={{ fontSize: TYPE.title, fontWeight: WEIGHT.heavy, color: COLORS.primary }}>{verdict}</div>
      <div style={{ marginTop: 6, fontSize: TYPE.body, fontWeight: WEIGHT.medium, color: COLORS.slate, lineHeight: 1.3 }}>{desc}</div>
    </div>
  );
};

export const PhoneWalkthrough = () => {
  const cf = useCurrentFrame();

  // A 20f (VO_PAD) silence is inserted in the VO at abs 1594 (cf 62). The phone
  // video freezes on its first frame for the first VO_PAD frames (below), and
  // every overlay/dissolve runs on `ecf` — a clock that HOLDS for VO_PAD frames
  // at the gap (cf 62), so all S3–9 timings after the gap shift +VO_PAD and stay
  // synced to the padded VO. Trigger constants are unchanged. (Simon, 25 Jun)
  // Clock mapping final cf → original continuity frame for vo.mp3-synced visuals,
  // accounting for: +20f pad @cf 62 (abs 1594); +906f new-VO insert over cf
  // 2171–3077 (abs 3703–4609, old VO paused); and the −443f deletion @abs 4609
  // which drops old narration ocf 2151–2593 (so old VO resumes at ocf 2593).
  const ecf =
    cf <= 62 ? cf
      : cf < 82 ? 62
        : cf < 2171 ? cf - 20
          : cf < 3077 ? 2151
            : cf - 484;

  // phone position: locked centre, then SLIDES LEFT at abs 2724 (cf 1192) for the
  // S3 recap and verdict (Simon, 25 Jun). Stays left afterwards.
  // centre → left (abs 2724) → back to centre after the verdict text fades out
  // (abs 3596–3716), then it disappears at 3831.
  const phoneCx = interpolate(cf, [1192, 1212, 2064, 2184], [960, PHONE_LEFT_CX, PHONE_LEFT_CX, 960], CLAMP);
  const lajuCx = interpolate(ecf, [S6A, S6B, S6B + 22], [690, 690, 471], CLAMP);

  // ── New S3 boxes + recap/verdict text — timed on RAW cf (= abs − 1532). ──
  // Overall Summary box: fade-in + 2 blinks, hold, fade out (abs 1614–1892).
  const osOp = interpolate(cf, [82, 88, 94, 100, 106, 112, 348, 360], [0, 1, 0, 1, 0, 1, 1, 0], LINCLAMP);
  // Market Conditions section box (abs 2605–2722).
  const mcOp = interpolate(cf, [1073, 1085, 1178, 1190], [0, 1, 1, 0], LINCLAMP);
  // Moving row box on the (now left) phone — dwell Trend → slide → Momentum →
  // slide → Market Strength (abs 2722–3126). Its LEFT tracks the phone.
  const rowOp = interpolate(cf, [1190, 1202, 1594, 1606], [0, 1, 1, 0], LINCLAMP);
  const rowTop = interpolate(cf, [1190, 1348, 1368, 1504, 1524, 1594], [ROW_TREND, ROW_TREND, ROW_MOM, ROW_MOM, ROW_STR, ROW_STR], CLAMP);
  // S3 recap (image 1): three labels appear one-by-one (right, centred), then ALL
  // fade out together (abs 3128–3186).
  const labelsOut = fadeOut(cf, 1596, 30);
  const trendOp = fadeIn(cf, 1192, 12) * labelsOut; // abs 2724
  const momOp = fadeIn(cf, 1353, 12) * labelsOut; // abs 2885
  const strOp = fadeIn(cf, 1503, 12) * labelsOut; // abs 3035
  // S3 verdict (image 2): the question (fades in), then the chips + answer appear
  // in order, all fading out at abs 3549.
  const questionOp = Math.min(fadeIn(cf, 1654, 16), fadeOut(cf, 1740, 16)); // abs 3186–3272
  const vOut = fadeOut(cf, 2019, 45); // all verdict text fades out abs 3551–3596
  const cTrend = fadeIn(cf, 1740, 14) * vOut; // abs 3272
  const cSide = fadeIn(cf, 1758, 14) * vOut;
  const cMom = fadeIn(cf, 1776, 14) * vOut;
  const cNeut = fadeIn(cf, 1794, 14) * vOut; // …through abs 3354
  const cArrow = fadeIn(cf, 1836, 14) * vOut; // abs 3368
  const cVerdict = fadeIn(cf, 1850, 14) * vOut;
  const cSub = fadeIn(cf, 1864, 14) * vOut; // …through abs 3415
  // S5 recap (Simon, 26 Jun): TI box blinks twice (abs 3596) + holds to 3836;
  // "Don't read one by one" (3703–3764) → "Read the pattern" (3764–3836); the
  // centred phone DISAPPEARS at 3836 and RE-APPEARS at 4609.
  const tiOp = interpolate(cf, [2064, 2070, 2076, 2082, 2088, 2094, 2298, 2304], [0, 1, 0, 1, 0, 1, 1, 0], LINCLAMP);
  const phoneDim = interpolate(cf, [2298, 2304, 3077, 3083, 3568, 3574, 3903, 3921, 5348, 5354, 5515, 5521], [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1], CLAMP); // …→ in @5435 (Scene 7-8) → out @6886 (interstitial texts) → in @7053 (Scene 9)
  const read1 = Math.min(fadeIn(cf, 2171, 12), fadeOut(cf, 2232, 12)); // "Don't read one by one" abs 3703–3764
  const read2 = Math.min(fadeIn(cf, 2232, 12), fadeOut(cf, 2298, 8)); // "Read the pattern" abs 3764–3836
  // Three-up recap (abs 3836–4609): Bullish / Bearish / Mix + heading at 4416.
  const aggOp = Math.min(fadeIn(cf, 2884, 14), fadeOut(cf, 3055, 12)); // "The Overall Summary aggregates this" — out @4587
  // Support & Resistance section box: in @4609, ends @4753 (abs).
  const srOp = Math.min(fadeIn(cf, 3083, 14), fadeOut(cf, 3209, 12));
  // Left pair — "If want to enter" + Support box (S1/S2/S3, indigo): abs 4753–4953.
  const leftOp = Math.min(fadeIn(cf, 3221, 12), fadeOut(cf, 3409, 12));
  // Right text "If already in" (abs 4953–5106) + Resistance box R1/R2/R3 (cyan,
  // abs 5000–5106). Phone itself goes @5106.
  const rightTextOp = Math.min(fadeIn(cf, 3421, 12), fadeOut(cf, 3562, 12));
  const rightBoxOp = Math.min(fadeIn(cf, 3468, 10), fadeOut(cf, 3562, 12));
  // S6 two-up examples (abs 5106–5435): LAJU (left) appears @5106 with its 2
  // highlights, RGAS (right) @5238 with its 2; "Better risk-reward" @5196,
  // "Exit zone" @5382; ALL gone @5435, then the centre phone returns w/ Scene 7-8.
  const lajuOp = Math.min(fadeIn(cf, 3574, 18), fadeOut(cf, 3885, 18)); // fade in @5106 / out by @5435
  const rgasOp = Math.min(fadeIn(cf, 3706, 18), fadeOut(cf, 3885, 18)); // fade in @5238 / out by @5435
  // Highlight boxes blink twice on appearance (like the Overall Summary / TI box), then hold, then fade out @5435.
  const lajuBox = interpolate(cf, [3574, 3580, 3586, 3592, 3598, 3604, 3885, 3903], [0, 1, 0, 1, 0, 1, 1, 0], LINCLAMP);
  const rgasBox = interpolate(cf, [3706, 3712, 3718, 3724, 3730, 3736, 3885, 3903], [0, 1, 0, 1, 0, 1, 1, 0], LINCLAMP);
  const rrTextOp = Math.min(fadeIn(cf, 3664, 12), fadeOut(cf, 3891, 12)); // "Better risk-reward"
  const exitTextOp = Math.min(fadeIn(cf, 3850, 10), fadeOut(cf, 3891, 12)); // "Exit zone"
  // Beginner (left) / Intermediate (right) rail text.
  const begin = textLife(cf, 716, 1073); // abs 2248–2605
  const inter = textLife(cf, 865, 1073); // abs 2397–2605

  const titleOp = Math.min(interpolate(ecf, [0, 15], [0, 1], CLAMP), interpolate(ecf, [40, 62], [1, 0], CLAMP));

  // screen cross-dissolve opacities
  const opRec36 = fadeOut(ecf, S6_END, DIS);
  const opRec78 = Math.min(fadeIn(ecf, S6_END, DIS), fadeOut(ecf, S8_SWITCH, DIS));
  const opRadar = Math.min(fadeIn(ecf, S8_SWITCH, DIS), fadeOut(ecf, SEAM89, DIS));
  const opRec9 = fadeIn(ecf, SEAM89, DIS);

  const closeTag = textLife(ecf, S7_CLOSE, S7_OUT);

  // ── S7 workflow steps (right of phone), S8 radar label/highlights, S8→S9
  //    interstitial texts — all timed on RAW cf (= abs − 1532). ──
  const step1 = Math.min(fadeIn(cf, 3974, 14), fadeOut(cf, 4893, 12)); // "Find a stock" abs 5506 → 6437
  const step2 = Math.min(fadeIn(cf, 4140, 14), fadeOut(cf, 4893, 12)); // "Open Technical Tab" abs 5672 → 6437
  const step3 = Math.min(fadeIn(cf, 4196, 14), fadeOut(cf, 4893, 12)); // "Read Overall Summary" abs 5728 → 6437
  const checkRadarOp = Math.min(fadeIn(cf, 5046, 14), fadeOut(cf, 5342, 12)); // "Check market radar" abs 6578 → 6886
  // Right-side status highlights on the radar (blink twice @6653, hold, out @6886).
  const radarBox = interpolate(cf, [5121, 5127, 5133, 5139, 5145, 5151, 5340, 5354], [0, 1, 0, 1, 0, 1, 1, 0], LINCLAMP);
  const twoSysOp = Math.min(fadeIn(cf, 5354, 14), fadeOut(cf, 5447, 12)); // "two independent systems…" abs 6886 → 6991
  const validateOp = Math.min(fadeIn(cf, 5459, 14), fadeOut(cf, 5843, 12)); // "If you want to validate further" abs 6991 → 7387 (beside phone once it returns @7053)

  return (
    <SceneWrap fade={10}>
      {/* S3 T0 title — two lines (clears the centred phone) */}
      <div style={{ position: "absolute", left: 110, top: 432, opacity: titleOp, fontSize: TYPE.display, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.2 }}>
        This is the
        <br />
        <span style={{ color: COLORS.primary, borderBottom: `6px solid ${COLORS.secondary}`, paddingBottom: 8 }}>Technical Tab.</span>
      </div>
      {/* ── S3 badges — flank the phone with a 40px gap (bullish left, bearish right) ── */}
      <PopAsset frame={ecf} src={ASSETS.s3BadgeBullish} cx={BULL_CX} y={152} h={BADGE_H} aspect={BADGE_ASPECT} inAt={T2} outAt={T6} />
      <PopAsset frame={ecf} src={ASSETS.s3BadgeBearish} cx={BEAR_CX} y={152} h={BADGE_H} aspect={BADGE_ASPECT} inAt={T4} outAt={T6} />
      {/* ── the ONE phone, mounted once for all of 3–9 — screen content
          cross-dissolves inside the aperture. Dims to 30% at abs 3811. ── */}
      <AbsoluteFill style={{ opacity: phoneDim }}>
      <PhoneSvg cx={phoneCx} top={110} h={PHONE_H}>
        {/* rec3to6: first frame held for VO_PAD frames (freeze from 1532), then
            plays — delayed by VO_PAD to match the padded VO. */}
        <div style={{ ...fill, opacity: opRec36 }}>
          {cf < VO_PAD && (
            <Freeze frame={0}>
              <OffthreadVideo src={staticFile(ASSETS.rec3to6)} muted style={{ ...fill, ...screenImg }} />
            </Freeze>
          )}
          <Sequence from={VO_PAD} name="S3-6 screen (delayed)">
            <OffthreadVideo src={staticFile(ASSETS.rec3to6)} muted style={{ ...fill, ...screenImg }} />
          </Sequence>
        </div>
        <div style={{ ...fill, opacity: opRec78 }}>
          <Sequence from={S6_END + 484} name="S7-8 screen">
            <OffthreadVideo src={staticFile(ASSETS.rec7to8)} muted style={screenImg} />
          </Sequence>
        </div>
        <Img src={staticFile(ASSETS.shotRadar8)} style={{ ...fill, ...screenImg, opacity: opRadar }} />
        <div style={{ ...fill, opacity: opRec9 }}>
          <Sequence from={5521} name="S9 screen">
            <Scene9Screen />
          </Sequence>
        </div>
        {/* S5–6 revision (Simon, 26 Jun): new recording replaces the screen for
            abs 3703–5431 (cf 2171, 1728f) — hard cut, on top of everything. */}
        <div style={fill}>
          <Sequence from={2171} durationInFrames={1728} name="New Scene 5-6 (abs 3703–5431)">
            <OffthreadVideo src={staticFile(ASSETS.newScene56)} muted style={screenImg} />
          </Sequence>
        </div>
      </PhoneSvg>
      </AbsoluteFill>
      {/* ── S3 highlight boxes (phone-width + 20px each side) ── */}
      {/* Overall Summary — fade in + 2 blinks (abs 1614–1892) */}
      <HiliteBox top={258} height={196} opacity={osOp} />
      {/* Market Conditions section (abs 2605–2722) */}
      <HiliteBox top={456} height={236} opacity={mcOp} />
      {/* Moving row box: Trend → Momentum → Market Strength (abs 2722–3126) —
          its left edge tracks the phone as it slides off-centre. */}
      <HiliteBox left={phoneCx - PHONE_W / 2 - HL_OVERHANG} top={rowTop} height={ROW_BOX_H} opacity={rowOp} />
      {/* ── Beginner (left) / Intermediate (right) rail text — beside the phone ── */}
      <div style={{ position: "absolute", left: 96, top: 478, width: 616, textAlign: "center", opacity: begin.opacity, transform: `translateY(${begin.ty}px)` }}>
        <div style={{ fontSize: TYPE.lead, fontWeight: WEIGHT.bold, color: COLORS.primary }}>Beginner</div>
        <div style={{ marginTop: 14, fontSize: TYPE.headline, fontWeight: WEIGHT.medium, color: COLORS.text, fontFamily: montserratFamily }}>This is enough</div>
      </div>
      <div style={{ position: "absolute", left: 1208, top: 478, width: 616, textAlign: "center", opacity: inter.opacity, transform: `translateY(${inter.ty}px)` }}>
        <div style={{ fontSize: TYPE.lead, fontWeight: WEIGHT.bold, color: COLORS.primary }}>Intermediate</div>
        <div style={{ marginTop: 14, fontSize: TYPE.headline, fontWeight: WEIGHT.medium, color: COLORS.text, fontFamily: montserratFamily }}>This is a filter</div>
      </div>
      {/* ── S3 recap (image 1): three labels on the right, centred on the verdict
          axis (cx 1292), appear one-by-one (abs 2724–3128) ── */}
      <RecapLabel cx={1292} y={168} op={trendOp} label="Trend" sub="tells direction" />
      <RecapLabel cx={1292} y={368} op={momOp} label="Momentum" sub="tells the speed" />
      <RecapLabel cx={1292} y={568} op={strOp} label="Market Strength" sub="tells the conviction" />
      {/* ── S3 verdict (image 2) — the question (fades in, abs 3186–3272) ── */}
      <div style={{ position: "absolute", left: 760, top: 380, width: 1064, textAlign: "center", opacity: questionOp, fontSize: TYPE.lead, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.2 }}>
        Should i trade
        <br />
        this stock?
      </div>
      {/* ── S3 verdict (image 2) — chips → arrow → answer, in order (abs 3272–3549) ── */}
      <div style={{ position: "absolute", left: 760, top: 250, width: 1064, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 30 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ opacity: cTrend }}><VerdictChip>Trend</VerdictChip></div>
            <div style={{ marginTop: 12, opacity: cSide, fontSize: TYPE.headline, fontWeight: WEIGHT.semibold, color: COLORS.primary }}>Sideways</div>
          </div>
          <div style={{ opacity: cMom, fontSize: TYPE.display, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.4 }}>+</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ opacity: cMom }}><VerdictChip>Momentum</VerdictChip></div>
            <div style={{ marginTop: 12, opacity: cNeut, fontSize: TYPE.headline, fontWeight: WEIGHT.semibold, color: COLORS.primary }}>Neutral</div>
          </div>
        </div>
        <div style={{ opacity: cArrow, fontSize: 56, fontWeight: WEIGHT.bold, color: COLORS.slate, lineHeight: 1 }}>↓</div>
        <div style={{ opacity: cVerdict, fontSize: TYPE.lead, fontWeight: WEIGHT.bold, color: COLORS.primary }}>Not a bad stock</div>
        <div style={{ opacity: cSub, fontSize: TYPE.headline, fontWeight: WEIGHT.medium, color: COLORS.text, fontFamily: montserratFamily }}>wrong moment to trade</div>
      </div>
      {/* ── S5 recap: Technical Indicators box (blinks twice, abs 3596–3836) ── */}
      <HiliteBox left={phoneCx - PHONE_W / 2 - HL_OVERHANG} top={248} height={520} opacity={tiOp} />
      {/* "Don't read one by one" (3703–3764) → "Read the pattern" (3764–3836) — right of the phone */}
      <div style={{ position: "absolute", left: 1210, top: 446, width: 600, textAlign: "center", opacity: read1, fontSize: TYPE.lead, fontWeight: WEIGHT.bold, lineHeight: 1.2 }}>
        <span style={{ color: COLORS.text }}>Don&rsquo;t read</span>
        <br />
        <span style={{ color: COLORS.primary }}>one by one</span>
      </div>
      <div style={{ position: "absolute", left: 1210, top: 446, width: 600, textAlign: "center", opacity: read2, fontSize: TYPE.lead, fontWeight: WEIGHT.bold, lineHeight: 1.2 }}>
        <span style={{ color: COLORS.text }}>Read the</span>
        <br />
        <span style={{ color: COLORS.primary }}>pattern</span>
      </div>
      {/* ── S5 three-up recap (abs 3836–4609): Bullish / Bearish / Mix, left→right ── */}
      <VideoPhone video={ASSETS.newScene5Bull} cx={554} top={240} h={600} inAt={2304} outAt={3055} />
      <VideoPhone video={ASSETS.newScene5Bear} cx={960} top={240} h={600} inAt={2508} outAt={3055} />
      <VideoPhone video={ASSETS.newScene5Mix} cx={1366} top={240} h={600} inAt={2630} outAt={3055} />
      {/* heading above the 3 phones (abs 4416–4609) */}
      <div style={{ position: "absolute", left: 96, top: 120, width: 1728, textAlign: "center", opacity: aggOp, fontSize: TYPE.lead, fontWeight: WEIGHT.bold, color: COLORS.text }}>
        The <span style={{ color: COLORS.primary }}>Overall Summary</span> aggregates this
      </div>
      {/* Support & Resistance section highlight on the re-appeared centre phone (abs 4609 → 4753) */}
      <HiliteBox top={612} height={246} opacity={srOp} />
      {/* ── Left pair: "If want to enter" + Support box S1/S2/S3 (indigo), abs 4753–4953 ── */}
      <div style={{ position: "absolute", left: 250, top: 680, width: 620, textAlign: "center", opacity: leftOp, fontSize: TYPE.lead, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.2 }}>
        If want
        <br />
        to enter
      </div>
      <div style={{ position: "absolute", left: 760, top: 698, width: 150, height: 150, opacity: leftOp, borderRadius: RADII.card, border: `${BORDER.bold}px solid ${COLORS.primary}`, background: COLORS.primaryWash, pointerEvents: "none" }} />
      {/* ── Right text "If already in" (abs 4953–5106) + Resistance box R1/R2/R3 (cyan, abs 5000–5106) ── */}
      <div style={{ position: "absolute", left: 1100, top: 730, width: 620, textAlign: "center", opacity: rightTextOp, fontSize: TYPE.lead, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.2 }}>
        If already in
      </div>
      <div style={{ position: "absolute", left: 1003, top: 698, width: 157, height: 150, opacity: rightBoxOp, borderRadius: RADII.card, border: `${BORDER.bold}px solid ${COLORS.secondary}`, background: COLORS.secondaryWash, pointerEvents: "none" }} />
      {/* ── S6 two-up examples (abs 5106–5435): LAJU (left) + RGAS (right), centred pair ── */}
      <ImgPhone src={ASSETS.newScene6Laju} cx={741} top={200} h={700} op={lajuOp} />
      {/* LAJU highlights — header code+price (top-left) + S1+price (bottom-left), blink twice */}
      <FreeBox left={612} top={208} width={134} height={56} op={lajuBox} color={COLORS.primary} wash={COLORS.primaryWash} />
      <FreeBox left={578} top={778} width={120} height={48} op={lajuBox} color={COLORS.primary} wash={COLORS.primaryWash} />
      {/* "Better risk-reward" above the LAJU phone — "risk-reward" indigo */}
      <div style={{ position: "absolute", left: 511, top: 120, width: 460, textAlign: "center", opacity: rrTextOp, fontSize: TYPE.headline, fontWeight: WEIGHT.bold, lineHeight: 1.2 }}>
        <span style={{ color: COLORS.text }}>Better </span>
        <span style={{ color: COLORS.primary }}>risk-reward</span>
      </div>
      <ImgPhone src={ASSETS.newScene6Rgas} cx={1179} top={200} h={700} op={rgasOp} />
      {/* RGAS highlights — header code+price (top-left) + R1/R2+prices (bottom-right), blink twice */}
      <FreeBox left={1052} top={208} width={112} height={56} op={rgasBox} color={COLORS.primary} wash={COLORS.primaryWash} />
      <FreeBox left={1214} top={740} width={128} height={84} op={rgasBox} color={COLORS.primary} wash={COLORS.primaryWash} />
      {/* "Exit zone" above the RGAS phone — "Exit" indigo */}
      <div style={{ position: "absolute", left: 949, top: 120, width: 460, textAlign: "center", opacity: exitTextOp, fontSize: TYPE.headline, fontWeight: WEIGHT.bold, lineHeight: 1.2 }}>
        <span style={{ color: COLORS.primary }}>Exit</span>
        <span style={{ color: COLORS.text }}> zone</span>
      </div>
      {/* ── S6 examples (LAJU/RGAS) — SUPERSEDED by New_Scene 5-6 (abs 3703–5431).
          They are ecf-driven and would otherwise pop over the new centre-phone
          S&R content (abs ~4845+), so suppress them inside the new-scene window. ── */}
      {cf < 2171 && (
        <>
          <PopAsset frame={ecf} src={ASSETS.s6Laju} cx={lajuCx} y={152} h={BADGE_H} aspect={BADGE_ASPECT} inAt={S6A} outAt={S6_END - 50} />
          <PopAsset frame={ecf} src={ASSETS.s6Rgas} cx={1443} y={152} h={BADGE_H} aspect={BADGE_ASPECT} inAt={S6B} outAt={S6_END - 50} />
        </>
      )}
      {/* ── S7 decision rows + close tag ── */}
      <Row verdict="Bullish" desc="Condition supports action — check support, decide entry." inAt={B1} top={206} frame={ecf} />
      <Row verdict="Neutral" desc="No clear edge — wait, or range strategy" inAt={B2} top={406} frame={ecf} />
      <Row verdict="Bearish" desc="Not the moment — next candidate" inAt={B3} top={606} frame={ecf} />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 786,
          opacity: closeTag.opacity,
          transform: `translateY(${closeTag.ty}px)`,
          padding: "12px 24px",
          borderRadius: RADII.chip,
          background: COLORS.primary,
          color: COLORS.white,
          fontSize: TYPE.chip,
          fontWeight: WEIGHT.bold,
        }}
      >
        Under a minute per stock
      </div>
      {/* ── S7 workflow steps — 3 sequential points, right of phone (50px gap) ── */}
      <div style={{ position: "absolute", left: 1226, top: 320, width: 598, opacity: step1, fontSize: TYPE.title, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.2 }}>Find a stock</div>
      <div style={{ position: "absolute", left: 1226, top: 446, width: 598, opacity: step2, fontSize: TYPE.title, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.2 }}>Open Technical Tab</div>
      <div style={{ position: "absolute", left: 1226, top: 572, width: 598, opacity: step3, fontSize: TYPE.title, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.2 }}>Read Overall Summary</div>
      {/* ── S8 — "Check market radar" (left of phone, 50px gap) + right-side
          status highlight on each stock (blink twice @6653, out @6886) ── */}
      <div style={{ position: "absolute", left: 96, top: 436, width: 598, textAlign: "right", opacity: checkRadarOp, fontSize: TYPE.title, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.2 }}>
        Check market radar
      </div>
      <FreeBox left={1026} top={290} width={142} height={58} op={radarBox} color={COLORS.primary} wash={COLORS.primaryWash} />
      <FreeBox left={1026} top={424} width={142} height={52} op={radarBox} color={COLORS.primary} wash={COLORS.primaryWash} />
      <FreeBox left={1026} top={492} width={142} height={52} op={radarBox} color={COLORS.primary} wash={COLORS.primaryWash} />
      {/* ── S8→S9 interstitial — phone hidden (abs 6886–7053), centred, title sized ── */}
      <div style={{ position: "absolute", left: 96, top: 410, width: 1728, textAlign: "center", opacity: twoSysOp, fontSize: TYPE.lead, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.3 }}>
        That&rsquo;s two independent systems
        <br />
        pointing the <span style={{ color: COLORS.primary }}>same direction</span>.
      </div>
      {/* "If you want to validate further" — centred while the phone is hidden
          (6991–7053), then sits beside-LEFT the phone once Scene 9 returns, to 7387 */}
      <div style={{ position: "absolute", left: 96, top: 430, width: 600, textAlign: "center", opacity: validateOp, fontSize: TYPE.title, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.3 }}>
        If you want to
        <br />
        <span style={{ color: COLORS.primary }}>validate further</span>
      </div>
    </SceneWrap>
  );
};
