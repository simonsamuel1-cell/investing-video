import type React from "react";
import { Img, Interactive, staticFile } from "remotion";
import { theme } from "../core";
import { BUMI_CARD } from "../episodes/in07-cara-tuntun-membantu-investor/data/bumi-card";

/**
 * IN07's thumbnail extra: the app's Guidance card of the video's "Fair Value" beat (Price.tsx) — Company Quality · Reference Fair
 * Value · Bullish Signals — WITHOUT the scene's words ("Fair Value", "Terlalu mahal? Jangan langsung dikejar.") and WITHOUT its
 * indigo highlight box; Orang Tuntun stays, and the card lies over him (Simon 23 Nov: "IN07 tambahin 2 screenshot ini, tidak
 * termasuk text dan highlight. Orang Tuntun jangan diremove"). The second screenshot, the BUMI stock page on a phone, was added
 * with it and taken out again the same day ("screenshot bumi nya remove … perbesar kartu Reference Fair Value").
 *
 * The card is the video's own file, untouched: art/in07/app/BUMI-kartu.png (2160 × 752, the framed cut the video uses). Its gauge
 * pointer is painted out of that PNG so the video can move it; it is redrawn here where the app has it (14 % along, in the
 * green), not where the scene slides it.
 */
/**
 * on the canvas: the card lies across Orang Tuntun's chest, 720 px wide (it was 540), centred on his face — x 1344.5, measured on
 * the cut-out — and 50 px higher than first set (Simon 23 Nov: "geser, hingga align-center pada wajah Orang Tuntun, lalu kartunya
 * geser naik 50 px")
 */
const FACE_X = 1344.5;
const CARD = { left: FACE_X - 360, top: 740, w: 720 };

export const In07ThumbGuidanceShots: React.FC = () => {
  const f = BUMI_CARD.framed;
  const fw = f.x2 - f.x1,
    fh = f.y2 - f.y1;
  const k = CARD.w / fw;
  const g = BUMI_CARD.gauge;
  const px = g.x0 + (g.x1 - g.x0) * g.at;
  const { w: pw, h: ph } = BUMI_CARD.pointer;
  return (
    <>
      <Interactive.Div
        name="Kartu Fair Value"
        style={{
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.w,
          height: fh * k,
          borderRadius: BUMI_CARD.radius * k,
          overflow: "hidden",
          boxShadow: theme.shape.thumbCardShadow,
          background: theme.color.cardBg,
        }}
      >
        <Img
          showInTimeline={false}
          src={staticFile(BUMI_CARD.src)}
          style={{
            position: "absolute",
            left: -f.x1 * k,
            top: -f.y1 * k,
            width: BUMI_CARD.w * k,
            maxWidth: "none",
            display: "block",
          }}
        />
        <svg
          width={CARD.w}
          height={fh * k}
          viewBox={`${f.x1} ${f.y1} ${fw} ${fh}`}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <path
            d={`M ${px} ${g.y} L ${px + pw / 2} ${g.y + ph} H ${px - pw / 2} Z`}
            fill={theme.color.ink}
          />
        </svg>
      </Interactive.Div>
    </>
  );
};
