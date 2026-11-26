/**
 * VI02 · SC08 — "Dari “Kenapa” ke “Berapa Harganya?”" in VI01's look (Simon 13 Nov: "revamp visual untuk scene 5-8"), from the
 * ChatGPT storyboard docs/vi-style/storyboards/VI02-SC08-v3.png, on the 12 Nov VO. The old scene is scenes/FromWhyToPrice.tsx
 * (VI01_LOOK = false).
 *
 *  A  "Tiga hal yang perlu diingat": "3 hal yang perlu diingat" over three numbered cards, each filling on its sentence with
 *     a small picture recalling its scene and one plain sentence (Simon 16 Nov: no icon strings, no abbreviations).
 *  B  "Prinsip ini digunakan oleh investor…" (a cut): a title, Simon's picture of Schloss, Buffett and Lynch whole (16 Nov,
 *     "3 figures.png"), each name and figure (the script's) under its man; on "Investor seperti" the picture slides left and
 *     Templeton and Nick Sleep come in at its right, each on his name (25 Nov), then a line under their names with "Beda gaya
 *     investasi" and "Beda beli perusahaan" on those sentences; "Yang dibeli tetap perusahaan, bukan kode saham".
 *  C–D "Di Tuntun" to "…di masa depan" (a cut in, then one take; positions after Simon's wireframe, the scene's own
 *     style — his 26 Nov directions): over the first sentence, its summary in the middle of the screen (his words), gone
 *     on "Melalui Revenue Breakdown"; the mascot over a column of numbers 1–4, muted (light grey, dark grey number, no
 *     border); on its question each number lights (white, indigo border and number), then an indigo highlight comes to it
 *     (on 1 it fades in and stretches right into a pill; on 2–4 it slides straight down from the one before; one length
 *     for all, the longest question's), the label stretches under it, and the question shows white on it — one step after the other; a label the highlight has left stays white, indigo ring and words. At the right
 *     two screens at most, each with its term right above it and a short summary under it: Revenue Breakdown and
 *     Profitability together, then (on "Pertanyaan ketiga") Dividend and Payout Ratio. Each tag, screen and summary is
 *     one group; the mascot and the four questions are another; all share one top (Simon 26 Nov; the screens' page
 *     120 px right, his Studio move, locked). On "pertanyaan keempat" the dividend page goes and question 4 itself comes
 *     on the page, then "Sulit dijawab"; on "Deep Research Report" the report's first page with its term.
 *  E  "Tapi setelah memahami perusahaannya" (a cut; Simon 16 Nov: not the two static cards, not a scale — Tuntun's own UI):
 *     "Perusahaan bagus" ✓ with SC01's factory on top; "satu pertanyaan": Tuntun's Company Quality / Reference Fair Value /
 *     Bullish Signals card under it; Company Quality boxed on "perusahaan bagus", then on "membayar terlalu mahal" Fair Value
 *     boxed in red, its pointer into the red, "Terlalu mahal" on it; "Perusahaan bagus belum tentu investasi bagus" under all.
 *     (Simon 26 Nov: first only the summary "Setelah paham perusahaannya, masih ada pertanyaan penting"; both cards on
 *     "Perusahaan yang bagus", the verdict line on "belum tentu".)
 *  F  "Jadi di video selanjutnya" (a cut): the next video's question, set big and light with "layak" bold and selected.
 */
import { Img, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { HighlightBox, SoftGround, Stage, TuntunMark, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, DashBox, Drawing, Glyph, Line, Pic, Shot, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;
const R = theme.shape.cardRadius;

// A — three things to remember (Simon 16 Nov: the icon list was "terlalu maksa"; storyboard VI02-SC08-opening-v4): three cards,
// each a small picture recalling its scene and one plain sentence
const THREE = { w: 500, h: 590, gap: 50, y: 272, disc: 76, headY: 172, headSize: 56, textY: 440, textSize: 32 }; // textSize: Simon 26 Nov, 36 → 32
const threeX = (i: number) => CX - (3 * THREE.w + 2 * THREE.gap) / 2 + i * (THREE.w + THREE.gap);
const POINTS = [
  { text: "Di balik kode saham,\nada pabrik, pelanggan, laba", at: "Di balik" },
  { text: "Rumor tidak bisa\nmenggantikan analisis", at: "Bagi orang" },
  { text: "Sebelum beli untuk 10\u00a0menit,\npikirkan bisnisnya 10\u00a0tahun", at: "sebelum membeli" },
] as const;
const MINI_BOOK = { x: 118, y: 92, w: 264, rowH: 62, gap: 12, head: 64 };
/** the two rumours bouncing off the book, inside the card: their centres, width, height and how far they spring back */
const RUMOUR = { w: 88, h: 54, xs: [64, 436], ys: [150, 300], bounce: 14 };

// B — three investors (VI01's line-art tiles; the figures are the script's)
/** Simon's picture whole, one image (16 Nov: "ini 1 gambar, jangan di crop"; 25 Nov: Buffett in Munger's place, as the script says), each name and figure under its man */
const GROUP = { w: 1140, y: 232, src: "art/vi02/three-figures-buffett.jpg", w0: 2172, h0: 724, cxs: [360, 1080, 1768], name: 26, pct: 78, line: 892, boxW: 1240, boxH: 112 };
const GROUP_K = GROUP.w / GROUP.w0;
const GROUP_H = GROUP.h0 * GROUP_K;
const GROUP_X = CX - GROUP.w / 2;
/**
 * "Investor seperti John Templeton dan Nick Sleep" (Simon 25 Nov: "gambar 3 digeser ke kiri, lalu muncul gambar 1 dan gambar 2"):
 * the picture goes to the left margin at `h`, its top staying where it is, and his two squares whole at its right fill the
 * row to the right margin. No figures: the script gives none.
 */
const ROW = { x: theme.margin.left, h: 336, gap: 24, at: "Investor seperti", sec: 0.75 };
const ROW_K = ROW.h / GROUP_H;
const ROW_Y = GROUP.y;
const ROW_X = (i: number) => ROW.x + GROUP.w * ROW_K + ROW.gap + i * (ROW.h + ROW.gap);
const MORE = [
  { name: "John Templeton", src: "art/vi02/john-templeton.jpg", at: "John Templeton" },
  { name: "Nick Sleep", src: "art/vi02/nick-sleep.jpg", at: "Nick Sleep" },
] as const;
/**
 * "Gaya investasi mereka berbeda. Perusahaan yang mereka beli juga berbeda" (Simon 25 Nov, his drawing): an indigo line of 3 px
 * under the two names, from the left of "John Templeton" to the right of "Nick Sleep", its ends meeting in the middle; under it
 * one line per sentence. `h` = the line's depth, `ys` = the texts' centres.
 */
const DIFF = { x1: 1172, x2: 1746, y: 654, h: 46, r: 34, stroke: 3, sec: 0.6, size: 32, at: "Gaya investasi" };
const DIFF_W = DIFF.x2 - DIFF.x1;
/** half the line: down from one end, round the corner, to the middle */
const DIFF_HALF = (side: 1 | -1) => `M ${(side * DIFF_W) / 2} 0 V ${DIFF.h - DIFF.r} Q ${(side * DIFF_W) / 2} ${DIFF.h} ${side * (DIFF_W / 2 - DIFF.r)} ${DIFF.h} H 0`;
const DIFFS = [
  { text: "Beda gaya investasi", y: 736, at: "Gaya investasi", wait: 0.45 },
  { text: "Beda beli perusahaan", y: 778, at: "Perusahaan yang mereka", wait: 0 },
] as const;
/** the title over the three (Simon 16 Nov: "kasih judul"), from "Prinsip ini digunakan oleh investor dari generasi yang berbeda" */
const PEOPLE_HEAD = { y: 172, size: 56, text: "Prinsip yang sama, generasi berbeda" };
/**
 * Their photos (Simon 16 Nov: "coba apply foto2 walter schloss, charlie munger, dan peter lynch"): Schloss's from VI01 (11 Nov),
 * Munger's and Lynch's from his VIDEO 04 folder (Scene 2 - Figur-figur). Theirs are low-key studio portraits whose black suits
 * melt into a black background, so they can't be cut out; all three sit on that same black, head and shoulders, heads alike
 * (VI01's PhotoTile framing: `head` = its centre, top and width in the picture's own pixels).
 */
const INVESTORS = [
  { name: "Walter Schloss", pct: "15,3%", years: "45 tahun", at: "Walter Schloss" },
  { name: "Warren Buffett", pct: "19,7%", years: "60+ tahun", at: "Warren Buffett" },
  { name: "Peter Lynch", pct: "29,2%", years: "13 tahun", at: "Peter Lynch" },
] as const;

// C–D — one take (Simon 26 Nov). Left: the mascot over numbers 1–4. A number is muted until its question (its word below),
// then lights, stretches into a pill and shows the question — in that order; on the next one's word it goes back to muted,
// pill and question kept. Right: a page of at most two screens (Simon's, 1080 × 1700 from y 300), each with its term right above it and a
// summary of the VO under it; the first page goes on "Pertanyaan ketiga". Screens: the app's tab bar and Key Stats row cut off (Simon
// 26 Nov: "potong aja"), each from its title to its last table (36 px either side) out of his 1080 × 2340 originals — no
// Financial Health, no bottom bar, no white space (the -body files); SHOT_H is the room, not a screen's height. Each tag + screen + summary is one
// group (Simon 26 Nov: "group … lalu buat align-top terhadap pertanyaan 1"); then the mascot and the four questions became
// one group too, moved down till its top is level with the tags' ("align-top terhadap tag"); tag and summary
// centred on the screen.
const COL = { x: theme.margin.left, d: 60, step: 100, num: 32, mascot: 72, mascotGap: 16, bob: 3, bobFor: 1.6, askSize: 32, askGap: 4, askPadR: 26 };
/** Simon 26 Nov: the first sentence's summary, his words, in the middle of the screen until the first screen comes — set as
 *  a title ("design dong jadi judul"): the series' heading type (SC02's "Value Investing", 64/700), two lines, the key term
 *  in indigo */
/** E opens on the summary of "Namun, setelah memahami perusahaannya, masih ada satu pertanyaan penting" (Simon 26 Nov, his
 *  words), set as the opening title is; the good-company card and Tuntun's card come on "Perusahaan yang bagus" instead */
const E_LINE = { lines: ["Setelah paham perusahaannya,", "masih ada pertanyaan penting"], mark: "pertanyaan penting", size: 64, until: "Perusahaan yang bagus" };
/** F's question set like Simon's type reference (26 Nov, "biar estetik"): big, tight, light against bold, the key word
 *  bold and SELECTED — a text selection dragged over it on its word, with its two handles */
const NEXT_Q = { size: 132, tracking: "-0.045em", lead: 1.04, light: 300, bold: 700, pad: 8, bar: 4, knob: 22 };
const OPEN_LINE = { lines: ["Di Tuntun bisa baca", "“buku bisnis” di halaman sahamnya"], mark: "“buku bisnis”", size: 64, until: "Melalui Revenue" };
const ASKS = [
  { text: "Jual apa?", at: "Revenue Breakdown" },
  { text: "Menghasilkan laba?", at: "Profitability Chart" },
  { text: "Labanya untuk apa?", at: "Pertanyaan ketiga" },
  { text: "Bisa tumbuh?", at: "pertanyaan keempat" },
] as const; // SC07's four cards
/** each question's text width at 32/600, measured off a still; the pill grows by gap + this + its right padding */
const ASK_TEXT_W = [140, 304, 307, 209];
const PAGE = { tagY: 156, tagH: 56, tagGap: 16, tagPadX: 26, tagSize: 28, x: 688, gap: 36, sumGap: 20, sumSize: 28, sumLines: 2, ratio: 0.6353 };
const Q_TOP = PAGE.tagY; // every group's top: the tags', and the mascot's
const ASK_TOP = COL.mascot + COL.mascotGap; // number 1's circle's top, inside the mascot + questions group
const askTop = (i: number) => ASK_TOP + i * COL.step;
/** one pill length for every question and the highlight (Simon 26 Nov: "sama panjang" with the longest, 2 or 3) */
const ASK_PILL_W = COL.d + COL.askGap + Math.max(...ASK_TEXT_W) + COL.askPadR;
const SHOT_Y = PAGE.tagY + PAGE.tagH + PAGE.tagGap; // a screen's top, under its tag
const SUM_H = Math.ceil(PAGE.sumSize * 1.3 * PAGE.sumLines);
const SHOT_H = theme.captionBand.top - 12 - SUM_H - PAGE.sumGap - Q_TOP; // the screens' size, as before the groups moved
/** the summary under each screen as TA07's closing quote card (Simon 26 Nov, "seperti … TA07, frame 9182"): white, a dark
 *  border, a solid indigo block offset down-right behind it, “ and ” in opposite corners, the words bold and centred —
 *  sized down to the room under the screens, two lines for every summary */
const QUOTE = { gap: 16, size: 26, lead: 1.3, padY: 20, padX: 56, border: 3, drop: 10, mark: 48, markX: 1, markTop: 5, markBot: 33 };
const QUOTE_H = Math.ceil(2 * QUOTE.size * QUOTE.lead) + 2 * QUOTE.padY;
const SHOT_W = SHOT_H * PAGE.ratio;
const shotX = (slot: number) => PAGE.x + slot * (SHOT_W + PAGE.gap);
const SCREENS = [
  { tag: "Revenue Breakdown", src: "art/vi02/app/sc08-revenue-breakdown-body.jpg", h: 1195, page: 0, slot: 0, at: "Revenue Breakdown", sum: "Sumber pendapatan\nperusahaan", sumAt: "menjual", until: "Pertanyaan ketiga" },
  { tag: "Profitability Chart", src: "art/vi02/app/sc08-perkembangan-laba-body.jpg", h: 1396, page: 0, slot: 1, at: "Profitability Chart", sum: "Perkembangan laba\ntiap tahun", sumAt: "menghasilkan", until: "Pertanyaan ketiga" },
  { tag: "Dividend", src: "art/vi02/app/sc08-dividend-body.jpg", h: 1361, page: 1, slot: 0, at: "berapa besar dividen", sum: "Dividen yang dibagikan\nkepada pemegang saham", sumAt: "dibagikan", until: "pertanyaan keempat" },
  { tag: "Payout Ratio", src: "art/vi02/app/sc08-payout-ratio-body.jpg", h: 1361, page: 1, slot: 1, at: "berapa besar laba", sum: "Laba yang disimpan dan\nditanam kembali", sumAt: "disimpan", until: "pertanyaan keempat" },
] as const;
/** a screen's own height at SHOT_W (Simon 26 Nov: the white space and the app's bottom bar cut, so the four differ); a page's
 *  summaries sit level, under its taller screen */
const shotH = (h: number) => (SHOT_W * h) / 1080;
const pageH = (page: number) => Math.max(...SCREENS.filter((o) => o.page === page).map((o) => shotH(o.h)));
/** C–D, question 4 (Simon 26 Nov): the dividend page goes on "pertanyaan keempat"; the question itself comes on the page,
 *  each half on its words, then the tag "Sulit dijawab" (his words) above it; on "Deep Research Report" both go and the
 *  report's first page (his screen, 5 Nov) comes in with its term above it. Both centred on the page, tops on the tags' row. */
const Q4 = {
  lines: [
    { text: "Apakah laba perusahaan bisa\nterus berkelanjutan?", at: "Apakah laba perusahaan" },
    { text: "Apakah ke depannya akan menjadi\nlebih baik atau lebih buruk?", at: "Apakah ke depannya" },
  ],
  size: 48,
  lead: 1.25,
  gap: 24,
  tag: { text: "Sulit dijawab", at: "paling sulit dijawab" },
  until: "Deep Research Report",
} as const;
const DEEP = { tag: "Deep Research Report", src: "art/vi02/app/sc08-deep-research.jpg", at: "Deep Research Report", w: 978, h: 1540 };
/** the Deep Research magnifier (Simon 26 Nov): on "memberikan analisis" the report slides to the far right; a lens (indigo
 *  border, its fill indigo at 15 %, his numbers) comes onto it and goes to each thing the VO lists, and the empty middle
 *  shows what is under the lens, enlarged, the sentence that says it boxed in orange (a border, no fill); every piece fades
 *  in and out. The VO got 30 frames after each of the first three points for it ("tiap poin kamu kasih jeda 30 frame").
 *  Where each point is on THIS screenshot (sc08-deep-research.jpg, page 1 — read 26 Nov), in its own 978 × 1540 px:
 *    prospek industri       Valuation Summary, "The market is Indonesian credit and payments …" (its first two sentences)
 *    kekuatan perusahaan    Company Quality, third paragraph: 45.67 % of revenue kept as profit, 21.46 % ROE, grade Best
 *    keunggulan kompetitif  Company Quality, first paragraph: the brand makes its funding cheap; a rival cannot price its way in
 *    berbagai risiko        Valuation Summary, "Net profit margin settles at 33.78 % and 36.03 % … against 45.67 % today" */
const DEEP_S = SHOT_W / DEEP.w; // the report's scale on screen
const DEEP_RIGHT_X = theme.canvas.width - theme.margin.right - SHOT_W;
const LENS = { x: -10, w: 620, h: 310, border: 3, radius: 10, fill: 0.15, hl: 3 };
const ZOOM = { w: 800, x: (COL.x + ASK_PILL_W + DEEP_RIGHT_X) / 2 - 400 };
const ZOOM_K = ZOOM.w / LENS.w; // how much the middle enlarges what is under the lens
const LENS_POINTS = [
  { at: "prospek industri", top: 701, box: [820, 893] },
  { at: "kekuatan perusahaan", top: 510, box: [611, 718] },
  { at: "keunggulan kompetitif", top: 235, box: [311, 468] },
  { at: "berbagai risiko", top: 858, box: [966, 1060] },
] as const;
const PAGE_CX = PAGE.x + SHOT_W + PAGE.gap / 2; // the page's centre, between its two screens
/** question 4 designed (Simon 26 Nov, "ini di design dong"): the VO quotes it, so it sits in the TA07 quote card the summaries
 *  use, at full size — white, a dark border, the indigo block behind, “ and ” in its corners; each half's second line indigo
 *  (his rule for the three cards in A); "Sulit dijawab" a filled indigo pill under it ("di bawah"); card and pill one group,
 *  centred on the page and centred VERTICALLY on the screen (Simon: "center vertikal aja") */
const Q4CARD = { w: 2 * SHOT_W + PAGE.gap - 40, size: 44, padTop: 58, padBot: 58, border: 4, drop: 14, mark: 76, markX: 9, markY: 17, markBot: 62, tagGap: 24 };
const Q4CARD_H = Q4CARD.padTop + 4 * Math.round(Q4CARD.size * Q4.lead) + Q4.gap + Q4CARD.padBot;
const Q4_Y = theme.canvas.height / 2 - (Q4CARD_H + Q4CARD.drop + Q4CARD.tagGap + PAGE.tagH) / 2; // the group's top
const Q4_TAG_Y = Q4_Y + Q4CARD_H + Q4CARD.drop + Q4CARD.tagGap;
// the after version carries Simon's Studio moves on these two (card −60.2 px, pill −129.2 px: on the card's bottom edge); copied here

// E — good company, but the price?
/**
 * E (Simon 16 Nov: "pake UI Tuntun yang menunjukkan Company Quality, Reference Fair Value, dan Bullish Signals … di atasnya
 * gambar pabrik tadi"): the good-company card with SC01's factory on top; under it Tuntun's own card (IN07's BUMI screenshot,
 * public/art/in07/app/BUMI-kartu.png, its gauge pointer painted out so it can be redrawn and moved — data/bumi-card.ts
 * there). Company Quality boxed on "perusahaan bagus"; on "kalau kita membayar terlalu mahal" Fair Value boxed and its pointer
 * slides into the red, the "Undervalued" line covered (it would contradict the pointer, as in IN07); Bullish Signals greyed.
 */
const GOOD = { w: 860, h: 190, y: 136 };
const BUMI = {
  src: "art/in07/app/BUMI-kartu.png",
  w: 2160,
  card: { x: 93, y: 93, w: 1974, h: 608 },
  radius: 54,
  signals: { x0: 1484, x1: 2063, y0: 96, y1: 532 },
  cq: { x1: 130, y1: 154, x2: 617, y2: 469 },
  fv: { x1: 734, y1: 154, x2: 1425, y2: 471 },
  gauge: { x0: 737, x1: 1423, y: 382, at: (835 - 737) / (1423 - 737), red: 0.88 },
  pointer: { w: 23, h: 16, k: 1.5 },
  fvNote: { x1: 800, y1: 426, x2: 1360, y2: 488 },
} as const;
const UI = { w: 1240, y: 400 };
const UI_K = UI.w / BUMI.card.w;
const UI_H = BUMI.card.h * UI_K;
const UI_X = CX - UI.w / 2;
/** a rectangle of the card's pixels on the canvas, padded */
const onUI = (r: { x1: number; y1: number; x2: number; y2: number }, pad = 14) => ({ x1: UI_X + (r.x1 - BUMI.card.x) * UI_K - pad, y1: UI.y + (r.y1 - BUMI.card.y) * UI_K - pad, x2: UI_X + (r.x2 - BUMI.card.x) * UI_K + pad, y2: UI.y + (r.y2 - BUMI.card.y) * UI_K + pad });
const VERDICT_Y = 880;


export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(8, BLOCK.SC08);
  const g = f + BLOCK.SC08;

  const peopleAt = W("Prinsip yang");
  const slide = ease(f, W(ROW.at), m.sec(ROW.sec));
  const diffP = ease(f, W(DIFF.at), m.sec(DIFF.sec));
  const appAt = W("Di Tuntun");
  const twoAt = W("Namun, setelah");
  // C–D's questions (Simon 26 Nov): each one lights on its word (a: white, indigo ring and number); then the indigo highlight
  // comes — on 1 it fades in and stretches into the pill, on 2–4 it slides straight down from the one before ("langsung geser
  // aja"), one length for all ("sama panjang", the longest question's) — and only once it is there does the label stretch,
  // hidden under it ("pemanjangan label fill putihnya tidak terlihat"); the question shows, white on the highlight, as it
  // arrives. A label the highlight has left stays white with an indigo ring and indigo words.
  const askT = ASKS.map((a) => {
    const lit = W(a.at);
    const come = lit + m.sec(0.3);
    const there = come + m.sec(0.5);
    return { lit, come, open: there, say: there };
  });
  const hi = askT.reduce((k, t, i) => (f >= t.come ? i : k), -1);
  const hiSlide = hi > 0 ? ease(f, askT[hi].come, m.sec(0.5)) : 1;
  const hiY = hi > 0 ? askTop(hi - 1) + (askTop(hi) - askTop(hi - 1)) * hiSlide : askTop(0);
  const hiW = hi === 0 ? COL.d + (ASK_PILL_W - COL.d) * ease(f, askT[0].come, m.sec(0.5)) : ASK_PILL_W;
  const hiO = hi >= 0 ? ease(f, askT[0].come, m.sec(0.2)) : 0;
  const nextAt = W("Karena itu");
  const goodAt = W("Perusahaan yang bagus"); // the cards (Simon 26 Nov: no longer on "Namun, setelah")

  // E
  const uiAt = goodAt + m.sec(0.3);
  const cqOn = ease(f, goodAt + m.sec(0.6), m.reveal);
  const fvOn = ease(f, W("kalau kita"), m.reveal);
  const toRed = ease(f, W("kalau kita") + m.sec(0.15), m.sec(0.9));
  const pointerAt = BUMI.gauge.at + (BUMI.gauge.red - BUMI.gauge.at) * toRed;

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A: three things to remember — each card a picture from its scene and one sentence */}
      <Shot from={-1} to={peopleAt} block={BLOCK.SC08} cutIn={false}>
        <Appear at={W("Ada tiga hal")} style={{ left: 0, top: THREE.headY, width: theme.canvas.width, textAlign: "center" }}>
          <div style={{ transform: "translateY(-50%)", ...typeStyle("title"), fontSize: THREE.headSize, fontWeight: 600, color: c.ink }}>3 hal yang perlu diingat</div>
        </Appear>
        {POINTS.map((pt, i) => {
          const p = ease(f, W("Ada tiga hal") + m.sec(0.2) + i * m.sec(0.12), m.reveal);
          const filled = ease(f, W(pt.at), m.reveal);
          const on = ease(f, W(pt.at), m.pop) * (i < 2 ? 1 - ease(f, W(POINTS[i + 1].at), m.pop) : 1);
          return (
            <div key={pt.text} style={{ position: "absolute", left: threeX(i), top: THREE.y + (1 - p) * 14, width: THREE.w, height: THREE.h, opacity: p }}>
              <Card x={0} y={0} w={THREE.w} h={THREE.h} style={{ boxShadow: `${on > 0.5 ? shadow.glow : shadow.soft}, inset 0 0 0 ${on > 0.5 ? 4 : 2}px ${on > 0.5 ? c.indigo : theme.color.skeleton}` }}>
                <div style={{ position: "absolute", left: THREE.w / 2 - THREE.disc / 2, top: -THREE.disc / 2, width: THREE.disc, height: THREE.disc, borderRadius: 999, background: on > 0.5 ? c.indigo : c.cardBg, boxShadow: `inset 0 0 0 3px ${on > 0.5 ? c.indigo : c.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: on > 0.5 ? c.cardBg : c.ink }}>{i + 1}</div>
                <div style={{ position: "absolute", inset: 0, opacity: filled }}>
                  {i === 0 ? (
                    <>
                      {/* SC01: a code, and the business behind it */}
                      <svg width={THREE.w} height={THREE.h} style={{ position: "absolute", left: 0, top: 0 }}>
                        <path d={`M ${THREE.w / 2} 142 L ${THREE.w / 2} 186 M 145 214 L 145 198 Q 145 186 157 186 L 348 186 Q 360 186 360 198 L 360 268`} fill="none" stroke={c.ink} strokeWidth={3} strokeLinecap="round" />
                      </svg>
                      <div style={{ position: "absolute", left: THREE.w / 2, top: 110, transform: "translate(-50%, -50%)", padding: "8px 30px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 3px ${c.ink}`, fontFamily: theme.text.family, fontSize: 40, fontWeight: 700, letterSpacing: 1, color: c.indigo }}>ABCD</div>
                      <Drawing name="factory" cx={145} floor={380} h={160} />
                      <Drawing name="shops" cx={360} floor={380} h={104} />
                    </>
                  ) : null}
                  {i === 1 ? (
                    <>
                      {/* SC05: the business book, the rumours bouncing off it */}
                      <div style={{ position: "absolute", left: MINI_BOOK.x, top: MINI_BOOK.y, width: MINI_BOOK.w, height: MINI_BOOK.head + 3 * MINI_BOOK.rowH + 2 * MINI_BOOK.gap + 22, borderRadius: 20, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.ink}` }}>
                        <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", ...typeStyle("title"), fontSize: 30, fontWeight: 600, color: c.ink }}>Buku bisnis</div>
                        {["package", "coins", "chart-line-up"].map((ic, k) => (
                          <div key={ic} style={{ position: "absolute", left: 18, right: 18, top: MINI_BOOK.head + k * (MINI_BOOK.rowH + MINI_BOOK.gap), height: MINI_BOOK.rowH, borderRadius: 14, boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`, display: "flex", alignItems: "center", gap: 16, padding: "0 14px" }}>
                            <div style={{ width: 40, height: 40, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                              <Glyph icon={ic} size={24} tone={theme.color.neutralIcon} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              <div style={{ width: 130, height: 9, borderRadius: 5, background: c.indigo }} />
                              <div style={{ width: 86, height: 9, borderRadius: 5, background: theme.color.skeleton }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      {[
                        { x: RUMOUR.xs[0], y: RUMOUR.ys[0], side: -1, phase: 0 },
                        { x: RUMOUR.xs[1], y: RUMOUR.ys[1], side: 1, phase: 0.5 },
                      ].map((b, k) => {
                        const bounce = Math.abs(Math.sin(((f - W(pt.at)) / m.sec(1.1) + b.phase) * Math.PI));
                        const x = b.x + b.side * RUMOUR.bounce * bounce;
                        return (
                          <div key={k} style={{ position: "absolute", left: x - RUMOUR.w / 2, top: b.y - RUMOUR.h / 2, width: RUMOUR.w, height: RUMOUR.h, borderRadius: b.side < 0 ? "20px 20px 20px 6px" : "20px 20px 6px 20px", background: theme.color.neutralDisc, boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            {[0, 1, 2].map((d) => <div key={d} style={{ width: 9, height: 9, borderRadius: 999, background: theme.color.mute }} />)}
                          </div>
                        );
                      })}
                    </>
                  ) : null}
                  {i === 2 ? (
                    <>
                      {/* SC06: the factory, ten years on */}
                      <Drawing name="factory" cx={THREE.w / 2} floor={318} h={210} />
                      <div style={{ position: "absolute", left: THREE.w / 2, top: 362, transform: "translate(-50%, -50%)", padding: "6px 24px", borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`, ...typeStyle("label"), fontSize: 28, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>10 tahun ke depan</div>
                    </>
                  ) : null}
                  <div style={{ position: "absolute", left: 36, right: 36, top: THREE.textY, textAlign: "center", ...typeStyle("title"), fontSize: THREE.textSize, fontWeight: 600, lineHeight: 1.25, color: c.ink, textWrap: "balance", whiteSpace: "pre-line" }}>{pt.text.split("\n").map((line, k) => <div key={k} style={{ color: k > 0 ? c.indigo : c.ink }}>{line}</div>)}</div>
                </div>
              </Card>
            </div>
          );
        })}
      </Shot>

      {/* B: three investors, one principle */}
      <Shot from={peopleAt} to={appAt} block={BLOCK.SC08}>
        <Appear at={peopleAt + m.sec(0.1)} style={{ left: 0, top: PEOPLE_HEAD.y, width: theme.canvas.width, textAlign: "center" }}>
          <div style={{ transform: "translateY(-50%)", ...typeStyle("title"), fontSize: PEOPLE_HEAD.size, fontWeight: 600, color: c.ink }}>{PEOPLE_HEAD.text}</div>
        </Appear>
        <div style={{ position: "absolute", left: GROUP_X, top: GROUP.y, width: GROUP.w, height: GROUP_H, transformOrigin: "0px 0px", translate: `${(ROW.x - GROUP_X) * slide}px ${(ROW_Y - GROUP.y) * slide}px`, scale: String(1 + (ROW_K - 1) * slide) }}>
          <Appear at={peopleAt + m.sec(0.2)} style={{ left: 0, top: 0, width: GROUP.w, height: GROUP_H }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: R, overflow: "hidden", boxShadow: shadow.soft, background: c.ink }}>
              <Pic src={staticFile(GROUP.src)} style={{ position: "absolute", left: 0, top: 0, width: GROUP.w, height: GROUP_H }} />
            </div>
          </Appear>
        </div>
        {INVESTORS.map((iv, i) => {
          const p = ease(f, peopleAt + m.sec(0.35) + i * m.sec(0.15), m.reveal);
          const said = ease(f, W(iv.at), m.reveal);
          const x0 = GROUP_X + GROUP.cxs[i] * GROUP_K;
          const x = x0 + (ROW.x + GROUP.cxs[i] * GROUP_K * ROW_K - x0) * slide;
          const top = GROUP.y + GROUP_H + (ROW_Y + ROW.h - GROUP.y - GROUP_H) * slide;
          return (
            <div key={iv.name} style={{ position: "absolute", left: x - 200, width: 400, top, textAlign: "center" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: GROUP.name, opacity: p, ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>{iv.name}</div>
              <div style={{ position: "absolute", left: 0, right: 0, top: GROUP.pct, opacity: said, transform: `translateY(${((1 - said) * 10).toFixed(1)}px)` }}>
                <div style={{ ...typeStyle("title"), fontSize: 64, fontWeight: 600, lineHeight: 1.05, color: c.indigo, fontVariantNumeric: "tabular-nums" }}>{iv.pct}</div>
                <div style={{ fontFamily: theme.text.mono, fontSize: 28, fontWeight: 500, letterSpacing: 0, color: c.indigo }}>{iv.years}</div>
              </div>
            </div>
          );
        })}
        {MORE.map((iv, i) => {
          const p = ease(f, W(iv.at), m.reveal);
          return (
            <div key={iv.name} style={{ position: "absolute", left: ROW_X(i), top: ROW_Y, width: ROW.h, height: ROW.h, opacity: p, translate: `${((1 - p) * 40).toFixed(2)}px 0px` }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: R * ROW_K, overflow: "hidden", boxShadow: shadow.soft, background: c.ink }}>
                <Pic src={staticFile(iv.src)} style={{ position: "absolute", left: 0, top: 0, width: ROW.h, height: ROW.h }} />
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: ROW.h + GROUP.name, textAlign: "center", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>{iv.name}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: DIFF.x1, top: DIFF.y, width: DIFF_W, height: DIFF.h }}>
          {diffP > 0.001 ? (
            <svg width={DIFF_W} height={DIFF.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <g transform={`translate(${DIFF_W / 2} 0)`} fill="none" stroke={c.indigo} strokeWidth={DIFF.stroke} strokeLinecap="round">
                <path d={DIFF_HALF(-1)} pathLength={1} strokeDasharray="1 2" strokeDashoffset={1 - diffP} />
                <path d={DIFF_HALF(1)} pathLength={1} strokeDasharray="1 2" strokeDashoffset={1 - diffP} />
              </g>
            </svg>
          ) : null}
        </div>
        {DIFFS.map((d) => (
          <Appear key={d.text} at={W(d.at) + m.sec(d.wait)} style={{ left: DIFF.x1, top: d.y, width: DIFF_W, textAlign: "center" }}>
            <div style={{ transform: "translateY(-50%)", ...typeStyle("label"), fontSize: DIFF.size, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>{d.text}</div>
          </Appear>
        ))}
        {/* in the dashed text box (Simon 16 Nov: "kasih text box garis putus putus") */}
        <DashBox cx={CX} y={GROUP.line - GROUP.boxH / 2} w={GROUP.boxW} h={GROUP.boxH} at={W("Sebuah bisnis")}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 50, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>
            <span>
              Yang dibeli tetap <span style={{ color: c.indigo }}>perusahaan</span>, bukan kode saham
            </span>
          </div>
        </DashBox>
      </Shot>

      {/* C–D: the mascot over numbers 1–4, each lit and stretched into its question in turn; at the right a page of two
          screens, the term above each and a summary under it */}
      <Shot from={appAt} to={twoAt} block={BLOCK.SC08}>
        {(() => {
          const q = ease(f, appAt + m.sec(0.3), m.reveal) * (1 - ease(f, W(OPEN_LINE.until), m.sec(0.3)));
          return (
            <div style={{ position: "absolute", left: 0, top: (1 - ease(f, appAt + m.sec(0.3), m.reveal)) * 12, width: theme.canvas.width, height: theme.canvas.height, opacity: q }}>
              <div style={{ position: "absolute", left: 0, top: theme.canvas.height / 2, width: theme.canvas.width, transform: "translateY(-50%)", textAlign: "center", ...typeStyle("title"), fontSize: OPEN_LINE.size, lineHeight: 1.2, fontWeight: 700, color: c.ink }}>
                {OPEN_LINE.lines.map((l) => {
                  const i = l.indexOf(OPEN_LINE.mark);
                  return (
                    <div key={l}>
                      {i < 0 ? l : (
                        <>
                          {l.slice(0, i)}
                          <span style={{ color: c.indigo }}>{OPEN_LINE.mark}</span>
                          {l.slice(i + OPEN_LINE.mark.length)}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
        <TuntunMark x={COL.x + COL.d / 2} y={Q_TOP + COL.bob * Math.sin(((f - appAt) / m.sec(COL.bobFor)) * Math.PI * 2)} height={COL.mascot} />
        {ASKS.map((a, i) => {
          const p = ease(f, appAt + m.sec(0.3) + i * m.sec(0.1), m.reveal);
          const hl = ease(f, askT[i].lit, m.sec(0.3)); // stays lit (Simon 26 Nov)
          const grow = ease(f, askT[i].open, m.sec(0.3)); // under the highlight
          const txt = ease(f, askT[i].say, m.sec(0.35));
          return (
            <div key={a.text} style={{ position: "absolute", left: COL.x, top: Q_TOP + ASK_TOP + i * COL.step + (1 - p) * 12, width: COL.d + grow * (ASK_PILL_W - COL.d), height: COL.d, borderRadius: 999, overflow: "hidden", background: interpolateColors(hl, [0, 1], [theme.color.greyWash, c.cardBg]), boxShadow: `inset 0 0 0 ${(3 * hl).toFixed(2)}px ${c.indigo}`, opacity: p }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: COL.d, height: COL.d, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: COL.num, fontWeight: 600, color: interpolateColors(hl, [0, 1], [c.slate, c.indigo]) }}>{i + 1}</div>
              <div style={{ position: "absolute", left: COL.d + COL.askGap, top: 0, height: COL.d, display: "flex", alignItems: "center", ...typeStyle("label"), fontSize: COL.askSize, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap", opacity: txt, transform: `translateX(${((1 - txt) * -8).toFixed(1)}px)` }}>{a.text}</div>
            </div>
          );
        })}
        {hiO > 0.001 && (
          <div style={{ position: "absolute", left: COL.x, top: Q_TOP + hiY, width: hiW, height: COL.d, borderRadius: 999, overflow: "hidden", background: c.indigo, opacity: hiO }}>
            {ASKS.map((a, i) => {
              const txt = ease(f, askT[i].say, m.sec(0.35));
              return (
                <div key={a.text} style={{ position: "absolute", left: 0, top: askTop(i) - hiY, width: ASK_PILL_W, height: COL.d }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: COL.d, height: COL.d, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: COL.num, fontWeight: 600, color: c.cardBg }}>{i + 1}</div>
                  <div style={{ position: "absolute", left: COL.d + COL.askGap, top: 0, height: COL.d, display: "flex", alignItems: "center", ...typeStyle("label"), fontSize: COL.askSize, fontWeight: 600, color: c.cardBg, whiteSpace: "nowrap", opacity: txt, transform: `translateX(${((1 - txt) * -8).toFixed(1)}px)` }}>{a.text}</div>
                </div>
              );
            })}
          </div>
        )}
        {SCREENS.map((k) => {
          const p = ease(f, W(k.at), m.reveal);
          const out = k.until ? ease(f, W(k.until), m.sec(0.3)) : 0;
          if (p * (1 - out) <= 0.001) return null;
          const sp = ease(f, W(k.sumAt), m.reveal);
          return (
            <div key={k.src} style={{ position: "absolute", left: shotX(k.slot), top: PAGE.tagY + (1 - p) * 24, width: SHOT_W, height: SHOT_Y - PAGE.tagY + pageH(k.page) + QUOTE.gap + QUOTE_H + QUOTE.drop, opacity: 1 - out }}>
              <div style={{ position: "absolute", left: SHOT_W / 2, top: 0, transform: "translateX(-50%)", height: PAGE.tagH, display: "flex", alignItems: "center", padding: `0 ${PAGE.tagPadX}px`, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connector}`, ...typeStyle("label"), fontSize: PAGE.tagSize, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap", opacity: p }}>{k.tag}</div>
              <div style={{ position: "absolute", left: 0, top: SHOT_Y - PAGE.tagY, width: SHOT_W, height: shotH(k.h), borderRadius: R, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft, opacity: p }}>
                <Img src={staticFile(k.src)} style={{ width: SHOT_W, height: shotH(k.h), display: "block", maxWidth: "none" }} />
              </div>
              <div style={{ position: "absolute", left: 0, top: SHOT_Y - PAGE.tagY + pageH(k.page) + QUOTE.gap + (1 - sp) * 8, width: SHOT_W, height: QUOTE_H, opacity: sp }}>
                <div style={{ position: "absolute", left: QUOTE.drop, top: QUOTE.drop, width: SHOT_W, height: QUOTE_H, borderRadius: R, background: c.indigo }} />
                <div style={{ position: "absolute", left: 0, top: 0, width: SHOT_W, height: QUOTE_H, boxSizing: "border-box", borderRadius: R, background: c.cardBg, border: `${QUOTE.border}px solid ${c.ink}`, display: "flex", alignItems: "center", justifyContent: "center", padding: `0 ${QUOTE.padX}px`, textAlign: "center", ...typeStyle("label"), fontSize: QUOTE.size, fontWeight: 700, lineHeight: QUOTE.lead, color: c.ink, whiteSpace: "pre-line" }}>{k.sum}</div>
                {["\u201C", "\u201D"].map((ch, j) => (
                  <div key={ch} style={{ position: "absolute", left: j === 0 ? QUOTE.markX : SHOT_W - QUOTE.markX - QUOTE.mark, top: j === 0 ? QUOTE.markTop : QUOTE_H - QUOTE.markBot, width: QUOTE.mark, textAlign: "center", fontFamily: typeStyle("title").fontFamily, fontSize: QUOTE.mark, fontWeight: 700, lineHeight: 1, color: c.ink }}>{ch}</div>
                ))}
              </div>
            </div>
          );
        })}
        {/* question 4: the question, then "Sulit dijawab"; then the Deep Research report */}
        {(() => {
          const out = ease(f, W(Q4.until), m.sec(0.3));
          const tp = ease(f, W(Q4.tag.at), m.reveal) * (1 - out);
          const dp = ease(f, W(DEEP.at) + m.sec(0.3), m.reveal);
          const slide = ease(f, W("memberikan analisis"), m.sec(0.6));
          const lensO = ease(f, W("memberikan analisis") + m.sec(0.6), m.sec(0.4));
          const lensY = LENS_POINTS.reduce((y, q, i) => (i === 0 ? q.top : y + (q.top - LENS_POINTS[i - 1].top) * ease(f, W(q.at), m.sec(0.5))), 0);
          const lit = (i: number) =>
            ease(f, W(LENS_POINTS[i].at) + (i > 0 ? m.sec(0.5) : 0), m.sec(0.3)) * (1 - (i + 1 < LENS_POINTS.length ? ease(f, W(LENS_POINTS[i + 1].at), m.sec(0.25)) : 0));
          const tag: React.CSSProperties = { height: PAGE.tagH, display: "flex", alignItems: "center", padding: `0 ${PAGE.tagPadX}px`, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connector}`, ...typeStyle("label"), fontSize: PAGE.tagSize, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" };
          const dh = shotH(DEEP.h * (1080 / DEEP.w));
          return (
            <>
              {out < 0.999 && (
                <div style={{ position: "absolute", translate: "0px -60.2px", left: PAGE_CX - Q4CARD.w / 2, top: Q4_Y + (1 - ease(f, W(Q4.lines[0].at), m.reveal)) * 12, width: Q4CARD.w, height: Q4CARD_H, opacity: ease(f, W(Q4.lines[0].at), m.reveal) * (1 - out) }}>
                  <div style={{ position: "absolute", left: Q4CARD.drop, top: Q4CARD.drop, width: Q4CARD.w, height: Q4CARD_H, borderRadius: R, background: c.indigo }} />
                  <div style={{ position: "absolute", left: 0, top: 0, width: Q4CARD.w, height: Q4CARD_H, boxSizing: "border-box", borderRadius: R, background: c.cardBg, border: `${Q4CARD.border}px solid ${c.ink}`, paddingTop: Q4CARD.padTop - Q4CARD.border, textAlign: "center", ...typeStyle("title"), fontSize: Q4CARD.size, fontWeight: 700, lineHeight: `${Math.round(Q4CARD.size * Q4.lead)}px`, color: c.ink }}>
                    {Q4.lines.map((l, i) => {
                      const p = ease(f, W(l.at), m.reveal);
                      return (
                        <div key={l.at} style={{ marginTop: i > 0 ? Q4.gap : 0, opacity: p, transform: `translateY(${((1 - p) * 12).toFixed(1)}px)` }}>
                          {l.text.split("\n").map((t, k) => <div key={t} style={{ color: k > 0 ? c.indigo : c.ink }}>{t}</div>)}
                        </div>
                      );
                    })}
                  </div>
                  {["\u201C", "\u201D"].map((ch, j) => (
                    <div key={ch} style={{ position: "absolute", left: j === 0 ? Q4CARD.markX : Q4CARD.w - Q4CARD.markX - Q4CARD.mark, top: j === 0 ? Q4CARD.markY : Q4CARD_H - Q4CARD.markBot, width: Q4CARD.mark, textAlign: "center", fontFamily: typeStyle("title").fontFamily, fontSize: Q4CARD.mark, fontWeight: 700, lineHeight: 1, color: c.ink }}>{ch}</div>
                  ))}
                </div>
              )}
              {tp > 0.001 && <div style={{ position: "absolute", translate: "0px -129.2px", left: PAGE_CX, top: Q4_TAG_Y + (1 - tp) * 10, transform: "translateX(-50%)", ...tag, background: c.indigo, boxShadow: "none", color: c.cardBg, opacity: tp }}>{Q4.tag.text}</div>}
              {dp > 0.001 && (
                <div style={{ position: "absolute", left: PAGE_CX - SHOT_W / 2 + (DEEP_RIGHT_X - (PAGE_CX - SHOT_W / 2)) * slide, top: PAGE.tagY + (1 - dp) * 24, width: SHOT_W, height: SHOT_Y - PAGE.tagY + dh, opacity: dp }}>
                  <div style={{ position: "absolute", left: SHOT_W / 2, top: 0, transform: "translateX(-50%)", ...tag }}>{DEEP.tag}</div>
                  <div style={{ position: "absolute", left: 0, top: SHOT_Y - PAGE.tagY, width: SHOT_W, height: dh, borderRadius: R, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft }}>
                    <Img src={staticFile(DEEP.src)} style={{ width: SHOT_W, height: dh, display: "block", maxWidth: "none" }} />
                  </div>
                  {lensO > 0.001 && (
                    <div style={{ position: "absolute", left: LENS.x * DEEP_S, top: SHOT_Y - PAGE.tagY + lensY * DEEP_S, width: LENS.w * DEEP_S, height: LENS.h * DEEP_S, opacity: lensO }}>
                      <div style={{ position: "absolute", inset: 0, borderRadius: LENS.radius, background: c.indigo, opacity: LENS.fill }} />
                      <div style={{ position: "absolute", inset: 0, borderRadius: LENS.radius, boxShadow: `inset 0 0 0 ${LENS.border}px ${c.indigo}` }} />
                    </div>
                  )}
                </div>
              )}
              {lensO > 0.001 && (
                <div style={{ position: "absolute", left: ZOOM.x, top: SHOT_Y, width: ZOOM.w, height: LENS.h * ZOOM_K, borderRadius: R, overflow: "hidden", background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 ${LENS.border}px ${c.indigo}`, opacity: lensO }}>
                  <div style={{ position: "absolute", left: -LENS.x * ZOOM_K, top: -lensY * ZOOM_K, width: DEEP.w * ZOOM_K, height: DEEP.h * ZOOM_K }}>
                    <Img src={staticFile(DEEP.src)} style={{ width: DEEP.w * ZOOM_K, height: DEEP.h * ZOOM_K, display: "block", maxWidth: "none" }} />
                    {LENS_POINTS.map((q, i) => (
                      <div key={q.at} style={{ position: "absolute", left: (LENS.x + 14) * ZOOM_K, top: q.box[0] * ZOOM_K, width: (LENS.w - 28) * ZOOM_K, height: (q.box[1] - q.box[0]) * ZOOM_K, borderRadius: LENS.radius, boxShadow: `inset 0 0 0 ${LENS.hl}px ${theme.color.orange}`, opacity: lit(i) }} />
                    ))}
                  </div>
                  <div style={{ position: "absolute", inset: 0, borderRadius: R, boxShadow: `inset 0 0 0 ${LENS.border}px ${c.indigo}` }} />
                </div>
              )}
            </>
          );
        })()}
      </Shot>

      {/* E: a good company — at what price? Tuntun's own card says both */}
      <Shot from={twoAt} to={nextAt} block={BLOCK.SC08}>
        {(() => {
          const q = ease(f, twoAt + m.sec(0.15), m.reveal) * (1 - ease(f, W(E_LINE.until), m.sec(0.3)));
          if (q <= 0.001) return null;
          return (
            <div style={{ position: "absolute", left: 0, top: theme.canvas.height / 2 + (1 - ease(f, twoAt + m.sec(0.15), m.reveal)) * 12, width: theme.canvas.width, transform: "translateY(-50%)", textAlign: "center", ...typeStyle("title"), fontSize: E_LINE.size, lineHeight: 1.2, fontWeight: 700, color: c.ink, opacity: q }}>
              {E_LINE.lines.map((l) => {
                const i = l.indexOf(E_LINE.mark);
                return <div key={l}>{i < 0 ? l : <>{l.slice(0, i)}<span style={{ color: c.indigo }}>{E_LINE.mark}</span>{l.slice(i + E_LINE.mark.length)}</>}</div>;
              })}
            </div>
          );
        })()}
        <Appear at={goodAt} style={{ left: CX - GOOD.w / 2, top: GOOD.y, width: GOOD.w, height: GOOD.h }}>
          <Card x={0} y={0} w={GOOD.w} h={GOOD.h} style={{ display: "flex", alignItems: "center", gap: 34, padding: "0 46px" }}>
            <div style={{ position: "relative", width: 170, height: 150, flex: "none" }}>
              <Drawing name="factory" cx={85} floor={150} h={150} />
            </div>
            <div style={{ ...typeStyle("title"), fontSize: 50, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Perusahaan bagus</div>
            <div style={{ width: 64, height: 64, borderRadius: 999, background: theme.color.ok, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.text.family, fontWeight: 700, fontSize: 36, color: c.cardBg, flex: "none", transform: `scale(${(0.7 + 0.3 * ease(f, goodAt + m.sec(0.4), m.pop)).toFixed(3)})` }}>✓</div>
          </Card>
        </Appear>
        <Appear at={uiAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <div style={{ position: "absolute", left: UI_X, top: UI.y, width: UI.w, height: UI_H, borderRadius: BUMI.radius * UI_K, overflow: "hidden", boxShadow: shadow.soft }}>
            <Img src={staticFile(BUMI.src)} style={{ position: "absolute", left: -BUMI.card.x * UI_K, top: -BUMI.card.y * UI_K, width: BUMI.w * UI_K, maxWidth: "none" }} />
            {/* Bullish Signals greyed: the two that matter here are the other two */}
            <div style={{ position: "absolute", left: (BUMI.signals.x0 - BUMI.card.x) * UI_K, top: (BUMI.signals.y0 - BUMI.card.y) * UI_K, width: (BUMI.signals.x1 - BUMI.signals.x0) * UI_K, height: (BUMI.signals.y1 - BUMI.signals.y0) * UI_K, overflow: "hidden" }}>
              <Img src={staticFile(BUMI.src)} style={{ position: "absolute", left: -BUMI.signals.x0 * UI_K, top: -BUMI.signals.y0 * UI_K, width: BUMI.w * UI_K, maxWidth: "none", filter: "grayscale(1)" }} />
            </div>
            {/* the "Undervalued" line, covered once the pointer heads into the red */}
            <div style={{ position: "absolute", left: (BUMI.fvNote.x1 - BUMI.card.x) * UI_K, top: (BUMI.fvNote.y1 - BUMI.card.y) * UI_K, width: (BUMI.fvNote.x2 - BUMI.fvNote.x1) * UI_K, height: (BUMI.fvNote.y2 - BUMI.fvNote.y1) * UI_K, background: c.cardBg, opacity: ease(f, W("kalau kita"), m.sec(0.3)) }} />
          </div>
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            {(() => {
              const x = UI_X + (BUMI.gauge.x0 + (BUMI.gauge.x1 - BUMI.gauge.x0) * pointerAt - BUMI.card.x) * UI_K;
              const y = UI.y + (BUMI.gauge.y - BUMI.card.y) * UI_K;
              const w = BUMI.pointer.w * UI_K * BUMI.pointer.k;
              const h = BUMI.pointer.h * UI_K * BUMI.pointer.k;
              return <path d={`M ${x} ${y} L ${x + w / 2} ${y + h} L ${x - w / 2} ${y + h} Z`} fill={c.ink} stroke={c.ink} strokeWidth={2} strokeLinejoin="round" />;
            })()}
            <HighlightBox rect={onUI(BUMI.cq)} grow={cqOn} opacity={cqOn} fill="none" width={4} radius={18} />
            <HighlightBox rect={onUI(BUMI.fv)} grow={fvOn} opacity={fvOn} fill="none" width={4} radius={18} stroke={theme.color.crossRed} />
          </svg>
          <Appear at={W("terlalu mahal")} style={{ left: 0, top: 0 }}>
            <div style={{ position: "absolute", left: (onUI(BUMI.fv).x1 + onUI(BUMI.fv).x2) / 2, top: UI.y - 34, transform: "translate(-50%, -50%)", padding: "8px 26px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 3px ${theme.color.crossRed}`, ...typeStyle("label"), fontSize: 32, fontWeight: 600, color: theme.color.crossRed, whiteSpace: "nowrap" }}>Terlalu mahal</div>
          </Appear>
        </Appear>
        <Appear at={W("belum tentu")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={VERDICT_Y} w={theme.canvas.width} align="center" size={48} weight={500} text="Perusahaan bagus belum tentu investasi bagus" mark="belum tentu" />
        </Appear>
      </Shot>

      {/* F: the next video's question */}
      <Shot from={nextAt} to={1e6} block={BLOCK.SC08} cutOut={false}>
        <Appear at={nextAt + m.sec(0.15)} style={{ left: 0, top: 250, width: theme.canvas.width, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 34px 12px 16px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}` }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: c.indigo, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={22} height={24} viewBox="0 0 22 24"><path d="M 3 2 L 20 12 L 3 22 Z" fill={c.cardBg} stroke={c.cardBg} strokeWidth={3} strokeLinejoin="round" /></svg>
            </div>
            <div style={{ ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>Video selanjutnya</div>
          </div>
        </Appear>
        <Appear at={W("berapa harga")} style={{ left: CX - 640, top: 380, width: 1280 }}>
          {(() => {
            const sel = ease(f, W("layak kita bayar"), m.sec(0.45));
            return (
              <div style={{ textAlign: "center", ...typeStyle("title"), fontSize: NEXT_Q.size, letterSpacing: NEXT_Q.tracking, lineHeight: NEXT_Q.lead, fontWeight: NEXT_Q.light, color: c.ink, whiteSpace: "nowrap" }}>
                <div>Berapa harga</div>
                <div>
                  yang{" "}
                  <span style={{ position: "relative", display: "inline-block", fontWeight: NEXT_Q.bold }}>
                    <span style={{ position: "absolute", left: -NEXT_Q.pad, top: "6%", height: "96%", width: `calc(${(sel * 100).toFixed(2)}% + ${(2 * NEXT_Q.pad * sel).toFixed(1)}px)`, background: theme.color.indigoWashDeepSolid }} />
                    {sel > 0.001 && (
                      <>
                        <span style={{ position: "absolute", left: -NEXT_Q.pad - NEXT_Q.bar / 2, top: "6%", width: NEXT_Q.bar, height: "96%", borderRadius: NEXT_Q.bar, background: c.indigo }} />
                        <span style={{ position: "absolute", left: -NEXT_Q.pad - NEXT_Q.knob / 2, top: `calc(102% - ${NEXT_Q.knob / 2}px)`, width: NEXT_Q.knob, height: NEXT_Q.knob, borderRadius: 999, background: c.indigo }} />
                        <span style={{ position: "absolute", left: `calc(${(sel * 100).toFixed(2)}% + ${(2 * NEXT_Q.pad * sel - NEXT_Q.pad - NEXT_Q.bar / 2).toFixed(1)}px)`, top: "6%", width: NEXT_Q.bar, height: "96%", borderRadius: NEXT_Q.bar, background: c.indigo }} />
                        <span style={{ position: "absolute", left: `calc(${(sel * 100).toFixed(2)}% + ${(2 * NEXT_Q.pad * sel - NEXT_Q.pad - NEXT_Q.knob / 2).toFixed(1)}px)`, top: `calc(6% - ${NEXT_Q.knob / 2}px)`, width: NEXT_Q.knob, height: NEXT_Q.knob, borderRadius: 999, background: c.indigo }} />
                      </>
                    )}
                    <span style={{ position: "relative" }}>layak</span>
                  </span>
                  ?
                </div>
              </div>
            );
          })()}
        </Appear>
      </Shot>
    </Stage>
  );
};
