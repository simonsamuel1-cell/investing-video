/**
 * Scene 23 — Step 1 Screen (5800, ends 6776). "1. Screen" label + the real
 * Screen-step capture (scene23-flow-v2.mp4). The capture walks Bullish Signals →
 * the Flow / Dominant Broker Analysis table, with highlight boxes (each blinks
 * twice) tracking the on-screen UI.
 *
 * The phone is the full Verify-step size all scene (top 124, height 811, matching
 * the 6800 phone). Only its horizontal position changes: centred until the 6177
 * move, then it slides left to cx 727 — freeing the right side for a 3-question
 * checklist (style per Scene 11's list at 2793). The culminating question fades in
 * at 6602, vertically centred. The capture holds each screen still across its
 * highlight window, so box y-values are fixed. Frame = comp − 5800.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeArea, CapturePhone } from "../components";
import { theme } from "../theme";
import { fadeIn, fadeOut, blinkTwice, tween, textReveal } from "../helpers";

const { colors, font, type, radius } = theme;

// Phone: top 124 / height 811 the whole scene. cx: centred (960) until the 6177
// move (local 377), then left (727) — matching the Verify phone at 6800.
const PTOP = 124;
const PH = 811;
const MOVE = 377;
const MOVE_END = 393;

// Highlight-box x geometry (boxes run 25px past the phone body — 411px — each side).
const BXC = 960 - 411 / 2 - 25; // 729.5 — centred phone (boxes 1–2)
const BXL = 727 - 411 / 2 - 25; // 496.5 — left phone (boxes 3–5)
const BW = 411 + 50; // 461

const HLBox = ({ left, top, width = BW, height, op }: { left: number; top: number; width?: number; height: number; op: number }) =>
  op <= 0 ? null : (
    <div style={{ position: "absolute", left, top, width, height, border: `3px solid ${colors.indigo}`, borderRadius: radius.sm, opacity: op, boxSizing: "border-box" }} />
  );

// Right-side checklist (style per Scene 11 @2793). Frames are scene-local (comp − 5800).
const QLIST = [
  { txt: "1. One player or small group?", at: 426 }, // 6226
  { txt: "2. Is price close to what they paid?", at: 588 }, // 6388
  { txt: "3. Are they holding?", at: 658 }, // 6458
];

export const Scene23 = () => {
  const f = useCurrentFrame();
  const stageOut = fadeOut(f, 962, 14); // end 6776
  const inOp = fadeIn(f, 0, 16);

  const cx = tween(f, [MOVE, MOVE_END], [960, 727]);

  const textOut = fadeOut(f, 751, 14); // all checklist text gone by 6565
  const quoteOp = fadeIn(f, 802, 16); // 6602

  return (
    <SafeArea>
      <AbsoluteFill style={{ opacity: stageOut }}>
        <div style={{ position: "absolute", left: 96, top: 66, textAlign: "left", fontSize: 56, fontWeight: font.weights.extrabold, color: colors.text, opacity: inOp }}>
          1. Screen
        </div>

        <CapturePhone video="bandarmology/scene23-flow-v2.mp4" cx={cx} top={PTOP} height={PH} op={inOp} aspect={980 / 1990} />

        {/* 1 · Bullish-Signals tab row — 5919→6005 (centred phone) */}
        <HLBox left={BXC} top={276} height={47} op={blinkTwice(f, 119, 205)} />

        {/* 2 · Flow tab + "Dominant Broker Analysis" heading — 6116 (centred phone) */}
        <HLBox left={BXC} top={206} height={100} op={blinkTwice(f, 316, 360)} />

        {/* 3 · "Broker Code" rows, top & bottom tables — 6224→6362 (left phone) */}
        <HLBox left={BXL} top={349} height={42} op={blinkTwice(f, 424, 562)} />
        <HLBox left={BXL} top={678} height={42} op={blinkTwice(f, 424, 562)} />

        {/* 4 · "Average Buy Price" row — 6388→6431 (left phone) */}
        <HLBox left={BXL} top={513} height={42} op={blinkTwice(f, 588, 631)} />

        {/* 4b · ticker "MMIX" + price "700" at the phone's top-left — same timing as box 4 */}
        <HLBox left={586} top={132} width={62} height={50} op={blinkTwice(f, 588, 631)} />

        {/* 5 · "Buy Value + Net Buy Value" (6454), then "Sell Value + Net Sell Value"
            (6502) — both end 6565 (left phone) */}
        <HLBox left={BXL} top={389} height={82} op={blinkTwice(f, 654, 765)} />
        <HLBox left={BXL} top={719} height={82} op={blinkTwice(f, 702, 765)} />

        {/* 3-question checklist, right of the moved phone — all gone by 6565 */}
        <div style={{ position: "absolute", left: 980, top: 220, width: 840, display: "flex", flexDirection: "column", gap: 46 }}>
          {QLIST.map((q) => {
            const rev = textReveal(f, q.at, 16);
            return (
              <div key={q.txt} style={{ display: "flex", alignItems: "center", gap: 22, fontSize: type.subhead, fontWeight: font.weights.bold, color: colors.text, transform: rev.transform, opacity: Math.min(rev.opacity, textOut) }}>
                <span style={{ width: 16, height: 16, borderRadius: 999, background: colors.indigo, flex: "0 0 auto" }} />
                {q.txt}
              </div>
            );
          })}
        </div>

        {/* culminating question (bigger), vertically centred on the right — 6602 */}
        <div style={{ position: "absolute", left: 980, top: 54, width: 840, height: 918, display: "flex", flexDirection: "column", justifyContent: "center", fontSize: type.header, fontWeight: font.weights.extrabold, color: colors.text, lineHeight: 1.32, opacity: quoteOp }}>
          <div>
            Is this stock shifting from
            <br />
            <span style={{ color: colors.indigo }}>"nobody in charge"</span>
            <br />
            to
            <br />
            <span style={{ color: colors.indigo }}>"quietly building
              <br />
              a position"</span>
          </div>
        </div>
      </AbsoluteFill>
    </SafeArea>
  );
};
