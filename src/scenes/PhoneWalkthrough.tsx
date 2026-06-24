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
import { COLORS, TYPE, WEIGHT, RADII, EASE } from "../theme";
import { fadeIn, fadeOut, textLife } from "../helpers";
import { ASSETS } from "../timeline";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE } as const;

// ── S3–S6 triggers (continuity-relative, cf = abs − 1532) ───────────────────
const T1 = 62, T2 = 338, T4 = 468, T5 = 530, T6 = 686, T7 = 730, T8 = 734;
const S4 = 1051;
const S4A = S4 + 120, S4B = S4 + 278, S4C = S4 + 432, S4D = S4 + 580, S4E = S4 + 757;
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
const HL_ASPECT = 2192 / 1112;
const ROW_ASPECT = 2456 / 557;
const MA_ASPECT = 2332 / 1504;
const PHONE_H = 856;
const BADGE_H = 792;

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

  // phone position: S3 entrance → centre, S6 2-up/3-up nudges, then HELD centre
  // through S7–S9 (clamp holds 960 past S6_END).
  const phoneCx = interpolate(
    cf,
    [0, 40, T1, T2, T2 + 22, T4, T4 + 22, S6A, S6A + 22, S6B, S6B + 22, S6_END],
    [1410, 1410, 960, 960, 1150, 1150, 960, 960, 1183, 1183, 960, 960],
    CLAMP,
  );
  const esipCx = interpolate(cf, [T2, T4, T4 + 22], [682, 682, 350], CLAMP);
  const lajuCx = interpolate(cf, [S6A, S6B, S6B + 22], [690, 690, 471], CLAMP);

  const titleOp = Math.min(interpolate(cf, [0, 15], [0, 1], CLAMP), interpolate(cf, [40, 62], [1, 0], CLAMP));

  // screen cross-dissolve opacities
  const opRec36 = fadeOut(cf, S6_END, DIS);
  const opRec78 = Math.min(fadeIn(cf, S6_END, DIS), fadeOut(cf, S8_SWITCH, DIS));
  const opRadar = Math.min(fadeIn(cf, S8_SWITCH, DIS), fadeOut(cf, SEAM89, DIS));
  const opRec9 = fadeIn(cf, SEAM89, DIS);

  const disclaimer = textLife(cf, S8_SWITCH + 5, SEAM89 - 8, 16, 10);
  const closeTag = textLife(cf, S7_CLOSE, S7_OUT);
  const closing = textLife(cf, S9_T);

  return (
    <SceneWrap fade={10}>
      {/* S3 T0 title */}
      <div style={{ position: "absolute", left: 110, top: 470, opacity: titleOp, fontSize: TYPE.display, fontWeight: WEIGHT.bold, color: COLORS.text, whiteSpace: "nowrap" }}>
        This is the{" "}
        <span style={{ color: COLORS.primary, borderBottom: `6px solid ${COLORS.secondary}`, paddingBottom: 8 }}>Technical Tab.</span>
      </div>

      {/* ── S3 badges ── */}
      <PopAsset src={ASSETS.s3BadgeBullish} cx={esipCx} y={152} h={BADGE_H} aspect={BADGE_ASPECT} inAt={T2} outAt={T6} />
      <PopAsset src={ASSETS.s3BadgeBearish} cx={1568} y={152} h={BADGE_H} aspect={BADGE_ASPECT} inAt={T4} outAt={T6} />

      {/* ── the ONE phone, mounted once for all of 3–9 — screen content
          cross-dissolves inside the aperture ── */}
      <PhoneSvg cx={phoneCx} top={110} h={PHONE_H}>
        <OffthreadVideo src={staticFile(ASSETS.rec3to6)} muted style={{ ...fill, ...screenImg, opacity: opRec36 }} />
        <div style={{ ...fill, opacity: opRec78 }}>
          <Sequence from={S6_END} name="S7-8 screen">
            <OffthreadVideo src={staticFile(ASSETS.rec7to8)} muted style={screenImg} />
          </Sequence>
        </div>
        <Img src={staticFile(ASSETS.shotRadar8)} style={{ ...fill, ...screenImg, opacity: opRadar }} />
        <div style={{ ...fill, opacity: opRec9 }}>
          <Sequence from={SEAM89} name="S9 screen">
            <Scene9Screen />
          </Sequence>
        </div>
      </PhoneSvg>

      {/* ── S3 highlights (centered in column) ── */}
      <PopAsset src={ASSETS.s3HlBullish} cx={682} y={205} w={520} aspect={HL_ASPECT} inAt={T2} outAt={T4} />
      <PopAsset src={ASSETS.s3HlBearish} cx={1568} y={205} w={520} aspect={HL_ASPECT} inAt={T5} outAt={T6} />
      <PopAsset src={ASSETS.s3HlNeutral} cx={960} y={250} w={600} aspect={HL_ASPECT} inAt={T6} outAt={T7} />

      {/* S3 T8 typography */}
      <RailBeat cf={cf} inAt={T8} outAt={S4} top={430}>
        <div style={{ fontSize: TYPE.body, fontWeight: WEIGHT.semibold, color: COLORS.slate }}>
          Beginner → <span style={{ color: COLORS.text, fontWeight: WEIGHT.bold }}>Is This Worth Attention?</span>
        </div>
        <div style={{ fontSize: TYPE.body, fontWeight: WEIGHT.semibold, color: COLORS.slate }}>
          Intermediate → <span style={{ color: COLORS.primary, fontWeight: WEIGHT.bold }}>Use It As A Filter.</span>
        </div>
      </RailBeat>

      {/* ── S4 Market-Conditions row highlights ── */}
      <PopAsset src={ASSETS.s4Trend} cx={960} y={512} w={560} aspect={ROW_ASPECT} inAt={S4A} outAt={S4B} />
      <PopAsset src={ASSETS.s4Momentum} cx={960} y={552} w={560} aspect={ROW_ASPECT} inAt={S4B} outAt={S4C} />
      <PopAsset src={ASSETS.s4Strength} cx={960} y={592} w={560} aspect={ROW_ASPECT} inAt={S4C} outAt={S4D} />

      {/* S4 E typography */}
      <RailBeat cf={cf} inAt={S4E} outAt={S5} top={420}>
        <div style={{ fontSize: TYPE.principle, fontWeight: WEIGHT.heavy, color: COLORS.primary }}>Right Stock. Wrong Moment.</div>
        <div style={{ fontSize: TYPE.body, fontWeight: WEIGHT.semibold, color: COLORS.text }}>Sideways + Neutral → Different Strategy.</div>
      </RailBeat>

      {/* ── S5 MA block ── */}
      <PopAsset src={ASSETS.s5Ma} cx={960} y={345} w={520} aspect={MA_ASPECT} inAt={S5A} outAt={S5B} />

      {/* S5 typography */}
      <RailBeat cf={cf} inAt={S5B} outAt={S6} top={448}>
        <div style={{ fontSize: TYPE.headline, fontWeight: WEIGHT.bold, color: COLORS.text }}>Alignment Over Readings.</div>
        <div style={{ fontSize: TYPE.headline, fontWeight: WEIGHT.heavy, color: COLORS.primary, opacity: textLife(cf, S5C, S6).opacity }}>Trust The Summary.</div>
      </RailBeat>

      {/* ── S6 examples (LAJU stays, RGAS joins → 3-up; both out before S7) ── */}
      <PopAsset src={ASSETS.s6Laju} cx={lajuCx} y={152} h={BADGE_H} aspect={BADGE_ASPECT} inAt={S6A} outAt={S6_END - 50} />
      <PopAsset src={ASSETS.s6Rgas} cx={1443} y={152} h={BADGE_H} aspect={BADGE_ASPECT} inAt={S6B} outAt={S6_END - 50} />

      {/* ── S7 decision rows + close tag ── */}
      <Row verdict="Bullish" desc="Condition Supports Action — Check Support, Decide Entry" inAt={B1} top={206} frame={cf} />
      <Row verdict="Neutral" desc="No Clear Edge — Wait, Or Range Strategy" inAt={B2} top={406} frame={cf} />
      <Row verdict="Bearish" desc="Not The Moment — Next Candidate" inAt={B3} top={606} frame={cf} />
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
      <PopAsset src={ASSETS.s8Highlight} cx={1092} y={300} w={216} aspect={1034 / 1699} inAt={S8_H} outAt={SEAM89 - 6} />
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
