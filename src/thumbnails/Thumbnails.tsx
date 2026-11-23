import type React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { theme } from "../core";
import { In04ThumbAppScreens } from "./ThumbAppScreen";
import { In07ThumbGuidanceShots } from "./ThumbGuidanceShots";
import { In01ThumbBalancePair } from "./ThumbBalancePair";
import { TA03_PATTERNS, Ta03ThumbCandlePatterns } from "./ThumbCandlePatterns";
import { TA05_STRUCTURE, Ta05ThumbStructure } from "./ThumbStructure";
import { TA07_BANDS, Ta07ThumbCandleBands } from "./ThumbCandleBands";
import { TA09_VOLUME, Ta09ThumbCandleVolume } from "./ThumbCandleVolume";
import { TA01_CANDLES, TA01_CARD, Ta01ThumbCandleChartWords, Ta01ThumbCandlesOnly } from "./ThumbCandleChart";

/**
 * YouTube thumbnails, one per video, shown one after another (Simon 20 Nov: "buat composition baru khusus untuk menunjukkan
 * thumbnail. Tiap thumbnail 60 frame"). A thumbnail is a still: nothing here animates, and frame `i × THUMB_FRAMES` is thumbnail `i`.
 *
 * A thumbnail = one of the indigo backgrounds (public/thumbnail/bg, drawn from Simon's three social-post SVGs: the vertical
 * gradient 775CFF → 412F9B with the dark foot; he kept A, B, C, D and H. The dark foot is black 0 → 30 % over the bottom 40 %,
 * LOCKED by Simon 20 Nov ("kunci 30%") after 55 and 60; the svg sources are in out/thumbnail/bg) + the video's title + one card from the video,
 * redrawn for the thumbnail (20 Nov: "perkecil kartu chartnya (beserta isi) 60% anchor bawah, kasih judul di atasnya").
 */
export const THUMB_FRAMES = 60;

/**
 * "latar": the background of the other five lessons' thumbnails (branch Thumbnail-Technical-Analysis, `_generator/latar_1920.jpg`:
 * brand purple with a lit grid), copied here on Simon's word (20 Nov: "ganti background, copy backgroundnya dari … Thumbnail-
 * Technical-Analysis") so the eleven lessons share one ground. The five drawn here (A, B, C, D, H) stay as unused options.
 */
type Bg = "latar" | "A_asli" | "B_diagonal" | "C_sorot" | "D_grid" | "H_titik";
const bgFile = (bg: Bg) => `thumbnail/bg/${bg}.${bg === "latar" ? "jpg" : "png"}`;
type Thumb = {
  id: string;
  bg: Bg;
  /** "stack": pill + title centred over the card. "side": pill + title on the left, the card on the right (Simon 20 Nov, TA01 v2) */
  layout: "stack" | "side";
  /** the pill over the title: module, video number — one entry per line (Simon 20 Nov: "video 1 dan technical analysisnya atas bawah") */
  pill: readonly string[];
  /** the title, as the video's intro spells it: the heavy lines, then the light one (as in Simon's posts) */
  title: { heavy: readonly string[]; light?: string };
  /** the pill's width when its label is shorter than "Technical Analysis – Lesson NN" (which fills the 463 px the artwork was drawn at) */
  pillW?: number;
  /** something of the video's laid over the visual; it places itself on the canvas (IN01's Total Invested pair) */
  over?: React.FC;
  /** this thumbnail's own visual width, when it is not SIDE.cardW — the visual still ends at the right margin, so it grows to the left */
  visualW?: number;
  /** the visual turned about its vertical axis, seen in perspective (deg; positive = its right side goes back) */
  tilt?: { rotateY: number; perspective: number };
  /** the card, in its own units */
  card?: { w: number; h: number; Draw: React.FC };
  /** instead of a card: a cut-out photo standing on the background itself, running off the foot of the frame (px on the canvas) */
  figure?: { src: string; left: number; top: number; width: number };
};

/** the card: 60 % of the first version's 1560 px, anchored at its foot (906), then pill + title + card 50 px lower, then the card another 20 % smaller, still from its foot (Simon 20 Nov). The "stack" layout only. */
const CARD = { width: 1560 * 0.6 * 0.8, bottom: 906 };
/** the title: 100 px for every thumbnail (Simon 20 Nov, after 124, 112, 100, 120) */
const TITLE = { size: 100, lineHeight: 1.14, heavy: 700, light: 400, gap: 56 };

/** the pill of Simon's reference (20 Nov): a pale glass capsule, a lighter rim, heavy white type */
const PILL = { gap: 28 };
/**
 * Tuntun's white logo, as Simon's posts carry it (the PNG is lifted from his 12.11.26 svg, untouched): top-right as in the videos
 * (Simon 20 Nov: "logo tetep di kanan"), its ink ending at the safe margins. The file is 2208 × 781 with its ink at 62–2208 × 61–720.
 */
/** inkHeight 97 = the size of the logo in the videos (public/watermark.png: 315 × 97) */
const LOGO = { src: "thumbnail/tuntun-logo-white.png", w: 2208, h: 781, ink: { x: 62, y: 61, h: 659 }, inkHeight: 97 };

/**
 * TA01's visual. "candles": the tape alone on the background (20 Nov: "aku mau liat kalo visualnya candlesticknya aja tanpa
 * background, tanpa text, tanpa area support, tanpa garis"). "card": the white card with its words, as before — one word to go back.
 */
const TA01_LOOK: "candles" | "card" = "candles";
const TA01_VISUAL = TA01_LOOK === "candles" ? { ...TA01_CANDLES, Draw: Ta01ThumbCandlesOnly } : { ...TA01_CARD, Draw: Ta01ThumbCandleChartWords };

// The backgrounds are mixed across the videos (Simon 20 Nov: "di mix aja"): D, A, B, D, H, D. Lesson 07 had C until he asked for
// lesson 01's there too ("background lesson 07 di buat sama seperti lesson 01"), so C is unused for now.
/** "Investing 101 – Lesson NN" is shorter than the TA label; its pill keeps the same 31 px of air each side of the words */
const IN_PILL_W = 398;

export const THUMBS: readonly Thumb[] = [
  // TA01: "Pasar punya ingatan." (3:22 of the video) — the zone touched three times. The title is broken into three lines to fit its column.
  // (Its first version, the "stack" layout, was cancelled 20 Nov: "kita akan pake layout kiri kanan mulai sekarang" — every thumbnail is "side" now.)
  { id: "TA01", bg: "latar", layout: "side", visualW: 816, pill: ["Technical Analysis – Lesson 01"], title: { heavy: ["Memahami", "Pergerakan Pasar", "dari Grafik"] }, card: TA01_VISUAL },
  // The other TA videos (20 Nov: "buat thumbnails untuk TA yang lainnya ... kasih frame baru aja"): 60 frames each, in video order.
  // Their cards are cut from clean stills of the videos (CutCard.tsx); the still's frame is in the comment.
  // TA03: six candlestick patterns, bare on the background in TA01's colours and shadow (ThumbCandlePatterns.tsx). Until 20 Nov a
  // 3 × 2 of tiles cut from the video's wall at 2:27; the same six patterns, now redrawn without tile, card or names.
  { id: "TA03", bg: "latar", layout: "side", pill: ["Technical Analysis – Lesson 03"], title: { heavy: ["Candlestick", "(Intermediate)"] }, card: { ...TA03_PATTERNS, Draw: Ta03ThumbCandlePatterns } },
  // TA05: the uptrend's H / HH / HL of f2670 (1:29) on a glass card, redrawn from a trace of the still (ThumbStructure.tsx)
  { id: "TA05", bg: "latar", layout: "side", pill: ["Technical Analysis – Lesson 05"], title: { heavy: ["Mengenal", "Market Structure", "dan Perubahan", "Tren"] }, card: { ...TA05_STRUCTURE, Draw: Ta05ThumbStructure } },
  // TA07: Bollinger Bands round their candles on a glass card, redrawn from a trace of f4650 (2:35) in the thumbnail's colours (ThumbCandleBands.tsx)
  { id: "TA07", bg: "latar", layout: "side", pill: ["Technical Analysis – Lesson 07"], title: { heavy: ["Moving Averages", "& Bollinger Bands"] }, card: { ...TA07_BANDS, Draw: Ta07ThumbCandleBands } },
  // TA09 (a 30° turn about its vertical axis was asked for and cancelled the same minute, 20 Nov; `tilt` stays as an unused option): the candles over their volume bars, bare on the background in TA01's colours and shadow (ThumbCandleVolume.tsx) — the
  // tape of f4846 (1:21, the frame Simon named), traced from the still; until 20 Nov the two white cards themselves, cut out.
  { id: "TA09", bg: "latar", layout: "side", pill: ["Technical Analysis – Lesson 09"], title: { heavy: ["Volume Analysis"] }, card: { ...TA09_VOLUME, Draw: Ta09ThumbCandleVolume } },
  // TA11: the puzzled man of IN01 f1211 (Simon 20 Nov: "lesson 11 kasih gambar ini aja deh, dari IN01 1211", then "orangnya aja,
  // backgroundnya jangan ikutan"): the scene's own cut-out (art/in01/orang-bingung.png, 1086 × 1448, transparent), no card, no grid.
  // Scaled 1.27 (1.06, then 20 % larger: "gedein gambarnya 20%"; head top and centre line kept), centred on the visual area (x 1441), and left to run off the foot of
  // the frame at mid-thigh — a cut-out that stops in mid-air needs an edge, and the frame is the only one that is not a card.
  { id: "TA11", bg: "latar", layout: "side", pill: ["Technical Analysis – Lesson 11"], title: { heavy: ["The Most Common", "Technical Analysis", "Mistakes"] }, figure: { src: "art/in01/orang-bingung.png", left: 660, top: 184, width: 1381 } },
  // ── Investing 101 (Simon 23 Nov: "bikin thumbnail buat video IN") — the same rules as the TA set: side layout, the copied
  // ground and pill, title 100 px bold. The visual is a person of the video itself, cut out, as on TA11: shadow, fade to nothing at
  // the foot, head top at y 200, centred on the visual area (x 1441), no wider than its 766 px. Titles are the deliverable names
  // Simon gave the three videos on 20 Nov. Frames 360, 420, 480.
  // IN01: the happy man with his phone (art/in01/orang-senang.png, 1086 × 1448), 0.72× — the raised fist sets the width
  { id: "IN01", bg: "latar", layout: "side", pillW: IN_PILL_W, pill: ["Investing 101 – Lesson 01"], title: { heavy: ["Passive Income"] }, over: In01ThumbBalancePair, figure: { src: "art/in01/orang-senang.png", left: 1059, top: 176, width: 782 } },
  // IN04: the app's four investment-style screens in a row (ThumbAppScreen.tsx); Orang Tuntun with open arms was its first visual and was taken out
  { id: "IN04", bg: "latar", layout: "side", pillW: IN_PILL_W, pill: ["Investing 101 – Lesson 04"], title: { heavy: ["Kenali", "Profil Risiko"] }, over: In04ThumbAppScreens },
  // IN07: Orang Tuntun with a finger raised, the video's own closing pose (art/in01/orang-tuntun.png, 941 × 1672), 1.127× —
  // 15 % larger than first set, grown from his head down, then 30 px and another 50 px higher (Simon 23 Nov); the Guidance card lies over him
  { id: "IN07", bg: "latar", layout: "side", pillW: IN_PILL_W, pill: ["Investing 101 – Lesson 07"], title: { heavy: ["Cara Tuntun", "Membantu Investor"] }, over: In07ThumbGuidanceShots, figure: { src: "art/in01/orang-tuntun.png", left: 819, top: 88, width: 1060 } },
];

/**
 * The "side" layout, inside the safe margins: a text column on the left, the card on the right, a gutter between; both centred
 * on one line, below the logo. The title is sized so its longest line fills the column.
 */
/** 20 Nov: the title at version 1's size (TITLE.size), so the column widens to hold "Pergerakan Pasar" and the card takes what is left; all of it 50 px higher */
/**
 * cardW: the widest the visual on the right may be — 766 px (Simon 20 Nov: "ok terapkan 766 px"). It was 658, lesson 1's width; 766 is
 * what the widest title (lesson 11, ending at x 998 at 100 px) leaves after the 60 px gutter, so no title had to change.
 * cardH: nor taller than 580 px (500 grown by the same 766 / 658), so a near-square visual (TA09's two stacked cards) does not
 * outgrow the others. The visual area ends at the right margin; a narrower card is centred in it.
 */
const SIDE = { cardW: 766, cardH: 580, gutter: 60, centreY: 540 };

/**
 * A cut-out figure (Simon 20 Nov: "orangnya di kasih shadow, lalu di kasih gradasi transparan. Paling bawah adalah 0%"): the plain
 * photo shadow he chose for this same man in IN01 with its blur widened from 5 to 30 px (theme.shape.photoShadowWide), and a fade from solid at 65 % of the frame's height —
 * below the hand with the phone — to nothing at its foot.
 */
const FIGURE = { fade: "linear-gradient(to bottom, black 65%, transparent 100%)" };

export const THUMBNAILS_FRAMES = THUMBS.length * THUMB_FRAMES;

/** one line: the capsule of the reference, PILL.h tall. More lines: the same capsule grown by a line each, its ends as round as the one-line pill's */
/**
 * The series pill, COPIED from the other five lessons' thumbnails (branch Thumbnail-Technical-Analysis; Simon 20 Nov: "design pill
 * nya juga di copy"). Its capsule is that file's own artwork, lifted whole into public/thumbnail/pill.svg — the indigo glow, the
 * pale gloss, the white-to-sky border — so nothing is approximated; only the words are set here, as there: Plus Jakarta Sans Bold
 * 27 px, white, centred, an en dash between series and lesson. The capsule is one fixed size (463 × 46), which every
 * "Technical Analysis – Lesson NN" fills alike.
 */
const SERIES_PILL = { src: "thumbnail/pill.svg", w: 463.47, h: 45.8, size: 27, weight: 700, baseline: 353 - 320.81 };

/** the capsule's two round ends are kept as drawn; only the straight middle stretches, so a shorter label gets a shorter pill with the same ends */
const PILL_CAP = 26;

const Pill = ({ lines, width = SERIES_PILL.w }: { lines: readonly string[]; width?: number }) => {
  const mid = SERIES_PILL.w - 2 * PILL_CAP;
  const sx = (width - 2 * PILL_CAP) / mid;
  const img = { position: "absolute", top: 0, height: SERIES_PILL.h, maxWidth: "none" } as const;
  const slice = { position: "absolute", top: 0, height: SERIES_PILL.h, overflow: "hidden" } as const;
  return (
    <div style={{ position: "relative", width, height: SERIES_PILL.h, marginBottom: PILL.gap, flexShrink: 0 }}>
      <div style={{ ...slice, left: 0, width: PILL_CAP }}>
        <Img src={staticFile(SERIES_PILL.src)} style={{ ...img, left: 0, width: SERIES_PILL.w }} />
      </div>
      <div style={{ ...slice, left: PILL_CAP, width: width - 2 * PILL_CAP }}>
        <Img src={staticFile(SERIES_PILL.src)} style={{ ...img, left: -PILL_CAP * sx, width: SERIES_PILL.w * sx }} />
      </div>
      <div style={{ ...slice, left: width - PILL_CAP, width: PILL_CAP }}>
        <Img src={staticFile(SERIES_PILL.src)} style={{ ...img, left: PILL_CAP - SERIES_PILL.w, width: SERIES_PILL.w }} />
      </div>
      <svg width={width} height={SERIES_PILL.h} style={{ position: "absolute", left: 0, top: 0 }}>
        <text x={width / 2} y={SERIES_PILL.baseline} textAnchor="middle" fontFamily={theme.text.family} fontSize={SERIES_PILL.size} fontWeight={SERIES_PILL.weight} fill={theme.color.cardBg}>
          {lines.join(" ")}
        </text>
      </svg>
    </div>
  );
};

const TitleLines = ({ t }: { t: Thumb }) => (
  <>
    {t.title.heavy.map((line) => (
      <div key={line} style={{ fontWeight: TITLE.heavy, whiteSpace: "nowrap" }}>
        {line}
      </div>
    ))}
    {t.title.light ? <div style={{ fontWeight: TITLE.light, whiteSpace: "nowrap" }}>{t.title.light}</div> : null}
  </>
);

const Thumbnail = ({ t }: { t: Thumb }) => {
  const { width: W, height: H } = theme.canvas;
  const margin = theme.stage.active.x;
  const side = t.layout === "side";
  const card = t.card ?? { w: 1, h: 1, Draw: () => null };
  const areaW = t.visualW ?? SIDE.cardW;
  const k = side ? Math.min(areaW / card.w, SIDE.cardH / card.h) : CARD.width / card.w;
  const cardW = card.w * k;
  const h = card.h * k;
  const top = side ? SIDE.centreY - h / 2 : CARD.bottom - h;
  // a card narrower than the visual area sits in its centre (Simon 20 Nov: "align-center terhadap area visualnya")
  const left = side ? W - margin - areaW + (areaW - cardW) / 2 : (W - cardW) / 2;
  const { Draw } = card;
  const logoK = LOGO.inkHeight / LOGO.ink.h;
  const type = { fontFamily: theme.text.family, lineHeight: TITLE.lineHeight, color: theme.color.cardBg, display: "flex", flexDirection: "column" } as const;
  return (
    <AbsoluteFill>
      <Img src={staticFile(bgFile(t.bg))} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />
      {side ? (
        <div style={{ ...type, position: "absolute", left: margin, top: 0, width: W - 2 * margin - SIDE.cardW - SIDE.gutter, height: 2 * SIDE.centreY, justifyContent: "center", alignItems: "flex-start", fontSize: TITLE.size, textAlign: "left" }}>
          <Pill lines={t.pill} width={t.pillW} />
          <TitleLines t={t} />
        </div>
      ) : (
        <div style={{ ...type, position: "absolute", left: 0, top: 0, width: W, height: top - TITLE.gap, justifyContent: "flex-end", alignItems: "center", fontSize: TITLE.size, textAlign: "center" }}>
          <Pill lines={t.pill} width={t.pillW} />
          <TitleLines t={t} />
        </div>
      )}
      <Img
        src={staticFile(LOGO.src)}
        style={{
          position: "absolute",
          left: W - margin - LOGO.w * logoK,
          top: theme.stage.active.y - LOGO.ink.y * logoK,
          width: LOGO.w * logoK,
          height: LOGO.h * logoK,
          maxWidth: "none",
        }}
      />
      {t.figure ? (
        // the fade is on a frame-sized wrapper, so its stops are canvas heights; the shadow is inside it and fades with the figure
        <AbsoluteFill style={{ maskImage: FIGURE.fade, WebkitMaskImage: FIGURE.fade }}>
          <Img src={staticFile(t.figure.src)} style={{ position: "absolute", left: t.figure.left, top: t.figure.top, width: t.figure.width, maxWidth: "none", filter: theme.shape.photoShadowWide }} />
        </AbsoluteFill>
      ) : null}
      {t.card ? (
        // two boxes: the outer one is the visual's place on the canvas and holds the perspective; the inner one turns
        <div style={{ position: "absolute", left, top, width: cardW, height: h, perspective: t.tilt ? t.tilt.perspective : undefined }}>
          <div style={{ width: cardW, height: h, transform: t.tilt ? `rotateY(${t.tilt.rotateY}deg)` : undefined }}>
            <div style={{ width: card.w, height: card.h, transform: `scale(${k})`, transformOrigin: "0 0" }}>
              <Draw />
            </div>
          </div>
        </div>
      ) : null}
      {t.over ? <t.over /> : null}
    </AbsoluteFill>
  );
};

export const Thumbnails = () => (
  <AbsoluteFill>
    {THUMBS.map((t, i) => (
      <Sequence key={t.id} from={i * THUMB_FRAMES} durationInFrames={THUMB_FRAMES} name={t.id}>
        <Thumbnail t={t} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
