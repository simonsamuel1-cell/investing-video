import type React from "react";
import { theme } from "../core";
import { BAL, BigBalance, rp } from "../episodes/in01-passive-income/scenes/PartOne";

/**
 * IN01's thumbnail extra: the video's own "Total Invested" pair — a card, an arrow, the card it becomes (PartTwo SC11, where it
 * reads Rp 300,000 → Rp 350,000) — added to the man, not instead of him (Simon 23 Nov: "pakein ini deh, tapi angkanya ganti aja,
 * dari 50juta ke sekian … ditambahin ya, bukan replace visual thumbnail"), and laid across his middle, over him ("Kartunya taro
 * di bagian perut orangnya aja, overlap") — as the video itself does at 4:46. It sits below the hand with the phone, centred on
 * well below the title, so it may reach left of the visual area without touching it.
 *
 * The cards are the video's component itself (BigBalance), so the look cannot drift; only the amounts and the scale are set here.
 * Amounts: Rp 50,000,000 → Rp 55,000,000 — a made-up illustration, as every balance in the video is; a tenth more, which reads at a
 * glance without looking like a promise. The arrow is white, not the video's indigo, which cannot be seen on the purple ground.
 */
const FROM = 50_000_000;
const TO = 55_000_000;
/** the gap between the two cards, and the arrow in it: 110 units, not the video's 200 (Simon 23 Nov: "jarak antar kartu juga deketin (panahnya juga pendekin)") */
const ARROW = { w: 110, pad: 18, stroke: 5, head: 18 };
/** 0.72, the size it was under the title ("ukurannya balikin jangan kecilin"); the pair is then wider than the visual area, so it ends at the right safe margin and reaches out to the left ("gapapa dibuat agak ke kiri aja") */
const SCALE = 0.72;
/** where the pair sits on the canvas: its right edge and its top */
const AT = { right: 1824, top: 850 };
const W = 2 * BAL.w + ARROW.w;
export const IN01_PAIR = { w: W * SCALE, h: BAL.h * SCALE } as const;

export const In01ThumbBalancePair: React.FC = () => {
  const y = BAL.h / 2;
  const x0 = BAL.w + ARROW.pad,
    x1 = BAL.w + ARROW.w - ARROW.pad;
  return (
    <div style={{ position: "absolute", left: AT.right - IN01_PAIR.w, top: AT.top, width: IN01_PAIR.w, height: IN01_PAIR.h }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: BAL.h, transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
        <BigBalance x={BAL.w / 2} y={0} label="TOTAL INVESTED:" amount={rp(FROM)} life={1} swell={0} tri={1} />
        <svg width={W} height={BAL.h} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={`M ${x0} ${y} L ${x1 - ARROW.head * 0.6} ${y}`} fill="none" stroke={theme.color.cardBg} strokeWidth={ARROW.stroke} strokeLinecap="round" />
          <path d={`M ${x1} ${y} L ${x1 - ARROW.head} ${y - ARROW.head * 0.62} L ${x1 - ARROW.head} ${y + ARROW.head * 0.62} Z`} fill={theme.color.cardBg} />
        </svg>
        <BigBalance x={W - BAL.w / 2} y={0} label="TOTAL INVESTED:" amount={rp(TO)} life={1} swell={0} tri={0} />
      </div>
    </div>
  );
};
