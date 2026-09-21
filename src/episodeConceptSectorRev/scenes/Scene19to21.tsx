/**
 * S19+S20+S21 merged into ONE continuous block (frames 3806–4735, dur 930) per the
 * GLOBAL continuous rule: combo17_21 (Scene_17__19__20__21.mp4, 30.28s) is mounted
 * ONCE and plays straight through at rate 0.977 (fills the 31.0s block) — no fade,
 * no cut, no remount between S19/S20/S21. Only the text overlays cross-fade.
 *
 * Layout: CENTRED (phone left-of-centre, text right-of-centre). The old chip boxes
 * are gone — the "reads"/items are plain text (no number, no box, no border) at the
 * old heading size (46). S19's heading ("Open a theme — read it four ways") removed.
 *
 * Block-local timeline (0 = 3806):
 *   S19: 0–334   — 4 plain "reads"; on-phone highlights (next pass)
 *   S20: 334–604 — heading + 3 plain items; traveling highlight (next pass)
 *   S21: 604–930 — heading + 3 plain items; 3 stock highlights (next pass)
 */
import { interpolate, Sequence, useCurrentFrame } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { Fragment } from "react";
import type { ReactNode } from "react";
import { SceneWrap } from "../components/SceneWrap";
import { PhoneFrame } from "../components/PhoneFrame";
import { ASSETS } from "../timeline";
import { COLORS } from "../theme";
import { fadeIn, fadeOut, rise } from "../util/anim";

// Montserrat (thin) for the S20 subtext lines.
const MONTSERRAT = loadMontserrat("normal", { weights: ["200", "300", "400"] }).fontFamily;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// on-phone highlight box (cyan by default). fill optional (Sub Sector box has none).
const Hl = ({ x, y, w, h, op, fill = true, radius = 14, color = COLORS.cyan, wash = COLORS.cyanWash, glow = "rgba(92,200,227,0.16)" }: { x: number; y: number; w: number; h: number; op: number; fill?: boolean; radius?: number; color?: string; wash?: string; glow?: string }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: radius,
      border: `3px solid ${color}`,
      background: fill ? wash : "transparent",
      boxShadow: `0 0 0 4px ${glow}`,
      opacity: op,
    }}
  />
);

const RATE = 0.977; // 30.28s clip across the 31.0s block → continuous
const S19_DUR = 334;
const S20_AT = 334, S20_DUR = 270;
const S21_AT = 604, S21_DUR = 326;

// centred composition: phone left-of-centre, a CENTRE-ALIGNED text column
// right-of-centre. Group balanced around x≈960 now that the wide chip boxes are
// gone (phone cx≈594, text centre≈1310).
const PHONE = { x: 380, y: 80, w: 428 };
const TEXT_X = 920;
const TEXT_W = 780;
const PT_SIZE = 64; // all S19–21 points

// plain text point (no number/box/border), left-aligned + purple, fades+rises in at `delay`
const TextPoint = ({ children, y, delay, size = PT_SIZE, weight = 900, color = COLORS.purple, fontFamily }: { children: ReactNode; y: number; delay: number; size?: number; weight?: number; color?: string; fontFamily?: string }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: TEXT_X,
        top: y,
        width: TEXT_W,
        textAlign: "left",
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.15,
        letterSpacing: -0.3,
        color,
        opacity: fadeIn(frame, delay, 12),
        transform: `translateY(${rise(frame, delay, 16, 18)}px)`,
      }}
    >
      {children}
    </div>
  );
};

const S19Text = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: fadeOut(f, S19_DUR - 16, 16) }}>
      {["Broad or isolated", "Who is leading", "Sub-theme driving it", "Foreign money"].map((t, i) => (
        <TextPoint key={t} y={301 + i * 116} delay={24 + i * 60}>
          {t}
        </TextPoint>
      ))}
    </div>
  );
};

const S20Text = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: fadeOut(f, S20_DUR - 16, 16) }}>
      {[
        { title: "Catalyst", sub: "what's driving it now" },
        { title: "Narrative", sub: "the story in plain words" },
        { title: "Risk", sub: "what could break it" },
      ].map((p, i) => (
        <Fragment key={p.title}>
          <TextPoint y={280 + i * 175} delay={20 + i * 40}>
            {p.title}
          </TextPoint>
          <TextPoint y={280 + i * 175 + 80} delay={24 + i * 40} size={40} weight={200} fontFamily={MONTSERRAT}>
            {p.sub}
          </TextPoint>
        </Fragment>
      ))}
    </div>
  );
};

const S21Text = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: fadeOut(f, S21_DUR - 16, 16) }}>
      {["Technical", "Accumulation", "Valuation"].map((t, i) => (
        <TextPoint key={t} y={359 + i * 116} delay={20 + i * 36}>
          {t}
        </TextPoint>
      ))}
    </div>
  );
};

// ── on-phone highlights (quick — VO is fast). Seq-local frames. ───────────────
// S19: overview (Trending Stocks + Leading Company) flash, then after the video
// scrolls to the Sub Sector view, a no-fill frame on the section + boxes on the
// "Net Foreign Buy/Sell" labels. NOTE: the clip scrolls overview→Sub Sector ~f200–248,
// so the Sub Sector/Net-Foreign highlights land ~f248+ (a touch later than 02:13.15).
const S19Highlights = () => {
  const f = useCurrentFrame();
  const overview = fadeIn(f, 165, 8) * fadeOut(f, 196, 10); // 02:12.11, quick
  const sub = fadeIn(f, 248, 10) * fadeOut(f, 318, 12);
  const netf = fadeIn(f, 254, 8) * fadeOut(f, 318, 10); // 02:15.08–02:17.13
  return (
    <>
      <Hl x={388} y={200} w={420} h={352} op={overview} />
      <Hl x={388} y={576} w={420} h={288} op={overview} />
      <Hl x={388} y={408} w={420} h={448} op={sub} fill={false} radius={18} color={COLORS.purple} glow="rgba(95,77,238,0.16)" />
      <Hl x={410} y={480} w={130} h={30} op={netf} />
      <Hl x={410} y={604} w={130} h={30} op={netf} />
      <Hl x={410} y={728} w={130} h={30} op={netf} />
    </>
  );
};

// S20: one filled box that travels Diversified → Nickel → Oil and Gas (02:19.08–02:26.18,
// seq-local 38–258), three roughly-equal holds with quick moves between.
const S20Highlight = () => {
  const f = useCurrentFrame();
  const op = fadeIn(f, 34, 8) * fadeOut(f, 256, 10);
  const ks = [38, 100, 111, 174, 185, 258];
  const y = interpolate(f, ks, [305, 305, 485, 485, 665, 665], CLAMP);
  const h = interpolate(f, ks, [150, 150, 145, 145, 150, 150], CLAMP);
  return <Hl x={384} y={y} w={420} h={h} op={op} />; // x centred on phone (cx 594)
};

// S21: three boxes at once (02:30.09, seq-local 99) over ENRG / INCO / BUMI rows.
const S21Highlights = () => {
  const f = useCurrentFrame();
  const op = fadeIn(f, 99, 10) * fadeOut(f, 228, 12); // all end at 02:35.00 (seq-local 240)
  return (
    <>
      <Hl x={389} y={245} w={410} h={80} op={op} />
      <Hl x={389} y={455} w={410} h={88} op={op} />
      <Hl x={389} y={670} w={410} h={86} op={op} />
    </>
  );
};

export const Scene19to21 = () => {
  return (
    <SceneWrap>
      {/* combo17_21 mounted ONCE — continuous across S19→S20→S21 */}
      <PhoneFrame x={PHONE.x} y={PHONE.y} w={PHONE.w} video={ASSETS.combo17_21} startSec={0} playbackRate={RATE} />

      <Sequence durationInFrames={S19_DUR} name="S19 · open a theme (4 reads)">
        <S19Text />
        <S19Highlights />
      </Sequence>
      <Sequence from={S20_AT} durationInFrames={S20_DUR} name="S20 · research">
        <S20Text />
        <S20Highlight />
      </Sequence>
      <Sequence from={S21_AT} durationInFrames={S21_DUR} name="S21 · filter (stock tab)">
        <S21Text />
        <S21Highlights />
      </Sequence>
    </SceneWrap>
  );
};
