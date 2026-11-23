import type React from "react";
import { theme } from "../core";
import { GlassPane } from "./CutCard";

/**
 * TA05's thumbnail visual: the uptrend's H / HH / HL curve on a glass card, REDRAWN (Simon 20 Nov: "line chartnya ditebelin
 * garisnya, text HH HL H L nya juga gedein 6 px", then "dan naikin heightnya") — a cut-out still cannot have a thicker line or
 * larger type. The curve is the video's own at f2670 (1:29), traced from the still every 12 px; the six turns and their labels
 * are where the still has them. Everything is in the still's pixels (the old cut: x 78–1560), drawn 0.517× on the thumbnail.
 *
 *  - line 3 → 8 units (about 4 px on the thumbnail)
 *  - labels 36 → 48 units (6 px larger on the thumbnail)
 *  - height: the card is 800 units tall instead of 576, and the curve's swing is stretched 1.45× to fill it
 * Every label and dot is white and the labels bold (Simon 20 Nov: "L H HH HL nya samain aja warnanya, dan bikin bold"); on the
 * white card highs were indigo and lows cyan.
 */
const CURVE: readonly (readonly [number, number])[] = [
  [144, 690], [156, 690], [168, 689], [180, 685.5], [192, 680], [204, 671.5], [216, 660], [228, 645.5], [240, 630], [252, 614.5], [264, 599.5],
  [276, 586.5], [288, 574.5], [300, 563.5], [312, 554], [324, 547], [336, 542.5], [348, 540], [378, 539], [390, 540], [402, 542.5], [414, 546],
  [426, 551], [438, 557], [450, 563], [462, 570], [474, 578], [486, 586], [498, 594], [510, 600], [522, 606], [534, 612], [546, 617], [558, 621],
  [570, 623], [582, 624], [612, 623.5], [624, 622], [636, 618], [648, 611], [660, 600.5], [672, 586], [684, 569], [696, 550.5], [708, 533],
  [720, 516.5], [732, 502.5], [744, 489.5], [756, 477.5], [768, 467.5], [780, 460.5], [792, 456], [804, 453.5], [834, 453], [846, 454], [858, 455],
  [870, 458], [882, 463], [894, 471], [906, 480], [918, 490.5], [930, 501.5], [942, 512.5], [954, 523.5], [966, 534], [978, 543], [990, 550],
  [1002, 555], [1014, 557.5], [1026, 559], [1056, 559.5], [1068, 558.5], [1080, 555.5], [1092, 550], [1104, 541], [1116, 528], [1128, 511.5],
  [1140, 493], [1152, 473], [1164, 454], [1176, 435], [1188, 416.5], [1200, 400.5], [1212, 387.5], [1224, 377.5], [1236, 370.5], [1248, 366.5],
  [1260, 365.5], [1290, 366], [1302, 368], [1314, 372.5], [1326, 378], [1338, 385], [1350, 392], [1362, 399], [1374, 407.5], [1386, 418],
  [1398, 429.5], [1410, 441.5], [1422, 452.5], [1434, 461], [1446, 467], [1458, 471], [1470, 473], [1482, 474], [1512, 474], [1524, 472],
  [1536, 468], [1548, 461], [1554, 457],
];
/** the turns: [x, y, label, high?] — the dot is on the curve; the label sits over a high and under a low */
const TURNS: readonly (readonly [number, number, string, boolean])[] = [
  [366, 539, "H", true],
  [593, 625, "L", false],
  [819, 452, "HH", true],
  [1041, 565, "HL", false],
  [1271, 366, "HH", true],
  [1497, 474, "HL", false],
];
/** the pull-back the video shades: from the second high down to the low after it */
const SHADE = { x0: 820, x1: 1044, y0: 426, y1: 586 };

const CUT = { x: 78, w: 1482 };
const H = 800;
const STRETCH = 1.45;
const MID = { from: 500, to: 400 };
const fy = (y: number) => MID.to + (y - MID.from) * STRETCH;
const LINE = 8;
const DOT = 12;
const LABEL = { size: 48, weight: 700, over: 34, under: 74, dx: -30 };
const SHADE_OPACITY = 0.2;
export const TA05_STRUCTURE = { w: CUT.w, h: H } as const;

export const Ta05ThumbStructure: React.FC = () => {
  const c = theme.color;
  const d = CURVE.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${fy(y)}`).join(" ");
  return (
    <GlassPane w={CUT.w} h={H}>
      <svg width={CUT.w} height={H} viewBox={`${CUT.x} 0 ${CUT.w} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={SHADE.x0} y={fy(SHADE.y0)} width={SHADE.x1 - SHADE.x0} height={fy(SHADE.y1) - fy(SHADE.y0)} rx={12} fill={c.cardBg} opacity={SHADE_OPACITY} />
        <path d={d} fill="none" stroke={c.cardBg} strokeWidth={LINE} strokeLinecap="round" strokeLinejoin="round" />
        {TURNS.map(([x, y, label, high]) => {
          const col = c.cardBg;
          return (
            <g key={`${label}-${x}`}>
              <circle cx={x} cy={fy(y)} r={DOT} fill={col} />
              <text x={x + LABEL.dx} y={fy(y) + (high ? -LABEL.over : LABEL.under)} textAnchor="middle" fontFamily={theme.text.family} fontSize={LABEL.size} fontWeight={LABEL.weight} fill={col}>
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </GlassPane>
  );
};
