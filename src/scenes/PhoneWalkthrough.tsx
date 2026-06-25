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
import { interpolate, Sequence, Img, OffthreadVideo, Freeze, staticFile, useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { SceneWrap, PhoneSvg, PopAsset } from "../components";
import { COLORS, TYPE, WEIGHT, RADII, BORDER, EASE, VO_PAD } from "../theme";
import { fadeIn, fadeOut, textLife } from "../helpers";
import { montserratFamily } from "../fonts";
import { ASSETS } from "../timeline";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE } as const;

// ── S3–S6 triggers (continuity-relative, cf = abs − 1532) ───────────────────
const T2 = 338, T4 = 468, T6 = 686;
const S5 = 1940;
const S5A = S5 + 214, S5B = S5 + 427, S5C = S5 + 466;
const S6 = 2502;
const S6A = S6 + 327, S6B = S6 + 585;
const S6_END = 3312; // abs 4844 (S7 start)

// ── S7–S9 triggers (tail = cf 3312; values are tail-relative + TAIL) ─────────
const TAIL = 3312;
const B1 = TAIL + 486, B2 = TAIL + 630, B3 = TAIL + 841, S7_CLOSE = TAIL + 922, S7_OUT = TAIL + 958;
const S8_SWITCH = TAIL + 1180; // abs 6024
const S8_H = TAIL + 1327; // abs 6171
const SEAM89 = TAIL + 1562; // abs 6406
const S9_T = TAIL + 1935; // abs 6779
const DIS = 10; // dissolve frames
const REC9_LAST = 400; // Scene_9.mp4 ≈13.37s ≈401f → freeze from here

const BADGE_ASPECT = 1741 / 3254;
const MA_ASPECT = 2332 / 1504;
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

// S9 screen: plays then freezes its last frame for the ~17f shortfall.
const Scene9Screen = () => {
  const f = useCurrentFrame(); // 0 at SEAM89
  return (
    <Freeze frame={REC9_LAST} active={f >= REC9_LAST}>
      <OffthreadVideo src={staticFile(ASSETS.rec9)} muted style={screenImg} />
    </Freeze>
  );
};

// S3/S4/S5 typography beat (left rail, textReveal — never pop).
const RailBeat = ({ cf, inAt, outAt, top, children }: { cf: number; inAt: number; outAt?: number; top: number; children: ReactNode }) => {
  const r = textLife(cf, inAt, outAt);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top,
        width: 600,
        opacity: r.opacity,
        transform: `translateY(${r.ty}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {children}
    </div>
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
  const GAP = 62; // cf for abs 1594
  const ecf = cf <= GAP ? cf : Math.max(GAP, cf - VO_PAD);

  // phone position: locked centre, then SLIDES LEFT at abs 2724 (cf 1192) for the
  // S3 recap and verdict (Simon, 25 Jun). Stays left afterwards.
  const phoneCx = interpolate(cf, [1192, 1212], [960, PHONE_LEFT_CX], CLAMP);
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
  const vOut = fadeOut(cf, 2017, 24); // all verdict text fades at abs 3549
  const cTrend = fadeIn(cf, 1740, 14) * vOut; // abs 3272
  const cSide = fadeIn(cf, 1758, 14) * vOut;
  const cMom = fadeIn(cf, 1776, 14) * vOut;
  const cNeut = fadeIn(cf, 1794, 14) * vOut; // …through abs 3354
  const cArrow = fadeIn(cf, 1836, 14) * vOut; // abs 3368
  const cVerdict = fadeIn(cf, 1850, 14) * vOut;
  const cSub = fadeIn(cf, 1864, 14) * vOut; // …through abs 3415
  // Beginner (left) / Intermediate (right) rail text.
  const begin = textLife(cf, 716, 1073); // abs 2248–2605
  const inter = textLife(cf, 865, 1073); // abs 2397–2605

  const titleOp = Math.min(interpolate(ecf, [0, 15], [0, 1], CLAMP), interpolate(ecf, [40, 62], [1, 0], CLAMP));

  // screen cross-dissolve opacities
  const opRec36 = fadeOut(ecf, S6_END, DIS);
  const opRec78 = Math.min(fadeIn(ecf, S6_END, DIS), fadeOut(ecf, S8_SWITCH, DIS));
  const opRadar = Math.min(fadeIn(ecf, S8_SWITCH, DIS), fadeOut(ecf, SEAM89, DIS));
  const opRec9 = fadeIn(ecf, SEAM89, DIS);

  const disclaimer = textLife(ecf, S8_SWITCH + 5, SEAM89 - 8, 16, 10);
  const closeTag = textLife(ecf, S7_CLOSE, S7_OUT);
  const closing = textLife(ecf, S9_T);

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
          cross-dissolves inside the aperture ── */}
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
          <Sequence from={S6_END + VO_PAD} name="S7-8 screen">
            <OffthreadVideo src={staticFile(ASSETS.rec7to8)} muted style={screenImg} />
          </Sequence>
        </div>
        <Img src={staticFile(ASSETS.shotRadar8)} style={{ ...fill, ...screenImg, opacity: opRadar }} />
        <div style={{ ...fill, opacity: opRec9 }}>
          <Sequence from={SEAM89 + VO_PAD} name="S9 screen">
            <Scene9Screen />
          </Sequence>
        </div>
      </PhoneSvg>

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
            <div style={{ marginTop: 12, opacity: cSide, fontSize: TYPE.headline, fontWeight: WEIGHT.semibold, color: COLORS.amber }}>Sideways</div>
          </div>
          <div style={{ opacity: cMom, fontSize: TYPE.display, fontWeight: WEIGHT.bold, color: COLORS.text, lineHeight: 1.4 }}>+</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ opacity: cMom }}><VerdictChip>Momentum</VerdictChip></div>
            <div style={{ marginTop: 12, opacity: cNeut, fontSize: TYPE.headline, fontWeight: WEIGHT.semibold, color: COLORS.amber }}>Neutral</div>
          </div>
        </div>
        <div style={{ opacity: cArrow, fontSize: 56, fontWeight: WEIGHT.bold, color: COLORS.slate, lineHeight: 1 }}>↓</div>
        <div style={{ opacity: cVerdict, fontSize: TYPE.lead, fontWeight: WEIGHT.bold, color: COLORS.primary }}>Not a bad stock</div>
        <div style={{ opacity: cSub, fontSize: TYPE.headline, fontWeight: WEIGHT.medium, color: COLORS.slate, fontFamily: montserratFamily }}>wrong moment to trade</div>
      </div>

      {/* ── S5 MA block ── */}
      <PopAsset frame={ecf} src={ASSETS.s5Ma} cx={960} y={345} w={520} aspect={MA_ASPECT} inAt={S5A} outAt={S5B} />

      {/* S5 typography */}
      <RailBeat cf={ecf} inAt={S5B} outAt={S6} top={448}>
        <div style={{ fontSize: TYPE.headline, fontWeight: WEIGHT.bold, color: COLORS.text }}>Alignment Over Readings.</div>
        <div style={{ fontSize: TYPE.headline, fontWeight: WEIGHT.heavy, color: COLORS.primary, opacity: textLife(ecf, S5C, S6).opacity }}>Trust The Summary.</div>
      </RailBeat>

      {/* ── S6 examples (LAJU stays, RGAS joins → 3-up; both out before S7) ── */}
      <PopAsset frame={ecf} src={ASSETS.s6Laju} cx={lajuCx} y={152} h={BADGE_H} aspect={BADGE_ASPECT} inAt={S6A} outAt={S6_END - 50} />
      <PopAsset frame={ecf} src={ASSETS.s6Rgas} cx={1443} y={152} h={BADGE_H} aspect={BADGE_ASPECT} inAt={S6B} outAt={S6_END - 50} />

      {/* ── S7 decision rows + close tag ── */}
      <Row verdict="Bullish" desc="Condition Supports Action — Check Support, Decide Entry" inAt={B1} top={206} frame={ecf} />
      <Row verdict="Neutral" desc="No Clear Edge — Wait, Or Range Strategy" inAt={B2} top={406} frame={ecf} />
      <Row verdict="Bearish" desc="Not The Moment — Next Candidate" inAt={B3} top={606} frame={ecf} />
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
        Under A Minute Per Stock
      </div>

      {/* ── S8 highlight + compliance disclaimer ── */}
      <PopAsset frame={ecf} src={ASSETS.s8Highlight} cx={1092} y={300} w={216} aspect={1034 / 1699} inAt={S8_H} outAt={SEAM89 - 6} />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 858,
          width: 600,
          opacity: disclaimer.opacity,
          transform: `translateY(${disclaimer.ty}px)`,
          fontSize: TYPE.micro,
          fontWeight: WEIGHT.medium,
          color: COLORS.slate,
          lineHeight: 1.4,
        }}
      >
        Market Radar Is A Feature Illustration — Not A Recommendation.
        <br />
        Signals Are Estimates · Data As Of Jun 2026.
      </div>

      {/* ── S9 closing line (verbatim) ── */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 430,
          width: 600,
          opacity: closing.opacity,
          transform: `translateY(${closing.ty}px)`,
          fontSize: TYPE.principle,
          fontWeight: WEIGHT.heavy,
          color: COLORS.primary,
          lineHeight: 1.2,
        }}
      >
        The Technical Tab Already Did The Work.
      </div>
    </SceneWrap>
  );
};
