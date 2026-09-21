/**
 * Scene 20 — The common mistake (comp 4963–5315, dur 352). Real captures of the
 * impulse flow: a centred News-List phone, then "Most common & expensive mistake"
 * above it; the phone slides left and two more phones fade in beside it — the News
 * item (centre) and the Buy screen (right). A big mouse cursor glides in onto the
 * Buy button, then at 5279 the whole scene drops to 20% opacity and a red "Don't"
 * appears; all fades out at 5315. Frame = scene-local (0 at comp 4963).
 */
import type { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { PhoneFrame } from "../components";
import { fadeIn, fadeOut, tween, blinkTwice } from "../helpers";

const TOP = 160;
const H = 780;
const CX_C = 960; // centre
const CX_L = 466; // left (News List after the move)
const CX_R = 1454; // right (Buy)
const BODY_W = 404;
const BOX_X = (cx: number) => cx - BODY_W / 2 - 25; // 25px past the phone each side
const BOX_W = BODY_W + 50;

const TEXT_AT = 76; // 5039 — "Most common & expensive mistake"
const MOVE = 170; // 5133 — News List slides left
const NEWS_AT = 212; // 5175 — News phone (centre)
const BUY_AT = 258; // 5221 — Buy phone (right)
const CURSOR_AT = 256; // 5219 — cursor lands on the Buy button
const DIM_AT = 316; // 5279 — scene dims to 80% & red "Don't" appears
const END = 352; // 5315 — everything fades out

export const Scene20 = () => {
  const f = useCurrentFrame();
  const sceneOut = fadeOut(f, END - 14, 14);
  const listCx = tween(f, [MOVE, MOVE + 16], [CX_C, CX_L]);
  const listOp = Math.min(fadeIn(f, 0, 14), sceneOut);
  const newsOp = Math.min(fadeIn(f, NEWS_AT, 14), sceneOut);
  const buyOp = Math.min(fadeIn(f, BUY_AT, 14), sceneOut);
  const textOp = Math.min(fadeIn(f, TEXT_AT, 14), sceneOut);
  const cursorOp = Math.min(fadeIn(f, CURSOR_AT, 8), sceneOut);
  // Cursor glides in from below-right of the Buy phone onto the Buy button.
  const cursorX = tween(f, [CURSOR_AT, CURSOR_AT + 26], [1772, 1451]);
  const cursorY = tween(f, [CURSOR_AT, CURSOR_AT + 26], [1030, 862]);

  // Scene drops to 20% opacity at 5279 while "Don't" appears on top.
  const dimOp = interpolate(f, [DIM_AT, DIM_AT + 10], [1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dontOp = Math.min(fadeIn(f, DIM_AT, 12), sceneOut);

  // Highlights (two blinks then hold, both end at 5274).
  const newsListHl = blinkTwice(f, 186, 311); // 5149 — all news (left phone)
  const titleHl = blinkTwice(f, 216, 311); // 5179 — news title (centre phone)
  const box = (style: CSSProperties, op: number) =>
    op > 0 ? <div style={{ position: "absolute", border: `3px solid ${theme.colors.indigo}`, borderRadius: 10, opacity: op, boxSizing: "border-box", ...style }} /> : null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* the whole scene dims to 80% at 5279 */}
      <AbsoluteFill style={{ opacity: dimOp }}>
        <PhoneFrame cx={listCx} top={TOP} height={H} op={listOp} img="eventDriven/s20-newslist.jpg" />
        <PhoneFrame cx={CX_C} top={TOP} height={H} op={newsOp} img="eventDriven/s20-news.jpg" />
        <PhoneFrame cx={CX_R} top={TOP} height={H} op={buyOp} img="eventDriven/s20-buy.jpg" />

        {box({ left: BOX_X(CX_L), width: BOX_W, top: 273, height: 591 }, newsListHl)}
        {box({ left: BOX_X(CX_C), width: BOX_W, top: 370, height: 150 }, titleHl)}

        {/* mouse cursor glides in and lands on the green Buy button (right phone) */}
        {cursorOp > 0 && (
          <svg width={110} height={110} viewBox="0 0 32 32" style={{ position: "absolute", left: cursorX, top: cursorY, opacity: cursorOp, filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))" }}>
            <path d="M8 4 L8 26 L14 20 L18 28 L22 26 L18 18 L26 18 Z" fill="#000000" stroke="#FFFFFF" strokeWidth={1.5} strokeLinejoin="round" />
          </svg>
        )}

        <div style={{ position: "absolute", left: 96, right: 96, top: 84, textAlign: "center", fontSize: 44, fontWeight: theme.font.weights.extrabold, color: theme.colors.text, opacity: textOp }}>
          Most common &amp; expensive mistake
        </div>
      </AbsoluteFill>

      {/* red "Don't" — full opacity, appears as the scene dims (5279 → 5315) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontSize: 160, fontWeight: theme.font.weights.extrabold, color: theme.colors.candleRed, opacity: dontOp }}>
        Don&rsquo;t
      </div>
    </AbsoluteFill>
  );
};
