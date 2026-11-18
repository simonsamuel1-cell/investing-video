/**
 * VI03 · SC08, from "John Templeton" to "Di video selanjutnya" (Simon 18 Nov: "Scene 08 pas ngomong John Templeton hingga akhir
 * scene, revisi ya. Gambar 1 adalah fotonya, harus ada ya", then "banyak terms2 yang uda ada screenshotnya, jadi pakein
 * screenshotnya"), from the ChatGPT storyboard docs/vi-style/storyboards/VI03-SC08-v2.png. Two takes, one camera cut between them
 * (the story turns from investors to the app); inside each, things stay and change rather than cut.
 *
 * TempletonPart — "John Templeton … pesimisme" → "Templeton Growth Fund … 38 tahun" → "Value investing …":
 *  1  his photo (Simon's John Templeton_1.png, public/art/vi03/templeton-photo.png) with his name; his line in TA09's quote
 *     card (Simon 18 Nov: "buat stylenya seperti di TA09 frame 19842" — core QuoteCard, 48 px / 600, each word as it is
 *     spoken, "pesimisme" under the cyan highlighter);
 *  2  the box closes; in its place the fund's card: "±15% per tahun" and 38 bars compounding at 15 % a year (the VO's own two
 *     numbers, nothing else), "38 tahun" under them;
 *  3  the card goes; "Value investing", under it "paling konsisten dan paling sesuai untuk" in indigo (Simon 18 Nov, his words); his
 *     photo moves into a row with Buffett and Graham under the category "investor profesional dunia" in black (his words), then a plain
 *     person icon, "Investor ritel Indonesia".
 * TuntunPart — "Di Tuntun …" → "Kemudian Top Undervalued …" → "Tapi ingat …" (Simon's re-recorded lines, 18 Nov, say "Top
 * Undervalued" where the script said "Most Undervalued"; the list's title follows the voice):
 *  4  Tuntun's real BBCA card (VIDEO 09's screen, the one SC05 shows) under a Tuntun heading; a highlight box on Reference Fair
 *     Value, then one on its status line "15 - 27% Undervalued" (Valuation Status);
 *  5  the card rises and shrinks; from its Reference Fair Value three columns come down, each on its word, each with Tuntun's
 *     own screen: Laba (the 9M earning card), Waktu (the revenue years), Keyakinan (Tuntun Research's fair value by case);
 *  6  Tuntun's Top Undervalued screen, its home-screen card over it (30 % bigger, 400 px right); on "selisih besar" a box on the
 *     card's Undervalued (%) column; the card goes as the list steps left;
 *  7  the list steps left; Kandidat → Analisis → Layak dimiliki? come down beside it, each on its word, the list joined to
 *     Kandidat on "Daftar tersebut".
 */
import type React from "react";
import { staticFile, useCurrentFrame } from "remotion";
import { HighlightBox, QUOTE, QuoteCard, Words, quoteListY, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { BBCA_CARD } from "../components/AppCardParts";
import { Card, Glyph, GrowArrow, PhotoTile, Pic, ease, useWords } from "../components/kit";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const unit = (n: number) => Math.max(0, Math.min(1, n));
const CX = theme.canvas.width / 2;
/** the middle of the active area (54–972) */
const CY = theme.stage.active.y + theme.stage.active.h / 2;
/** a photo tile's height for its width (the tiles' shape, VI01's) */
const TILE_H = 423 / 406;
const NAME = { gap: 22, size: 34 };

/** centred text */
const Txt = ({ x, y, size, weight = 600, color, opacity = 1, children, style }: { x: number; y: number; size: number; weight?: number; color?: string; opacity?: number; children: React.ReactNode; style?: React.CSSProperties }) => {
  const c = usePalette();
  return opacity > 0.001 ? (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", ...typeStyle("title"), fontSize: size, fontWeight: weight, color: color ?? c.ink, lineHeight: 1.15, textAlign: "center", whiteSpace: "nowrap", opacity, ...style }}>
      {children}
    </div>
  ) : null;
};

const useBeat = () => {
  const f = useCurrentFrame(),
    m = useMotion(),
    W = useWords(8, BLOCK.SC08);
  return { f, m, W, on: (phrase: string, seconds = 0.6) => ease(f, W(phrase), m.sec(seconds)) };
};

// ── 1–3: Templeton ─────────────────────────────────────────────────────────────────────────────────────────────────────────
/** his tile beside the quote/fund card: 340 wide, 80 apart, the pair centred; the tile and its name centred in the free height.
 * The quote card is TA09's (its 300 height, 48 px type, 66 lead), 900 wide here to sit beside the photo. */
const T1 = { d: 340, gap: 80, box: { w: 900, h: 300 }, fund: { w: 900, h: 420 } };
const QUOTE_TYPE = { size: 48, lead: 66 };
const T1_X = CX - (T1.d + T1.gap + T1.box.w) / 2;
const T1_TOP = CY - (T1.d * TILE_H + NAME.gap + NAME.size) / 2;
const T1_MID = T1_TOP + (T1.d * TILE_H) / 2;
const BOX_CX = T1_X + T1.d + T1.gap + T1.box.w / 2;
/** the fund's card: title, the pill, 38 bars at 15 % a year compounding (the VO's numbers), "38 tahun" under the axis */
const FUND = { title: 56, pill: 122, plot: { x: 60, w: 780, base: 330, h: 150 }, years: 38, rate: 0.15, gap: 6, label: 372 };
const BAR_W = (FUND.plot.w - (FUND.years - 1) * FUND.gap) / FUND.years;
/** the quote, line by line, each word on its own spoken word (the phrase that finds it in the VO) */
const QUOTE_LINES = [
  { text: "Pasar bullish lahir", words: ["pasar bullish", "bullish", "lahir"] },
  { text: "dari pesimisme", words: ["dari pesimisme", "pesimisme"] },
] as const;
/**
 * 3: "Value investing", its subheading, the category over the three investors, four tiles 230 wide and 60 apart, the names
 * under them; the block centred in the free height (each line's box = its size × 1.15).
 */
const T3 = { d: 230, gap: 60, title: 112, sub: 40, cat: 34, subGap: 22, catGap: 56, tileGap: 24 };
const LH = 1.15;
const T3_H = T3.title * LH + T3.subGap + T3.sub * LH + T3.catGap + T3.cat * LH + T3.tileGap + T3.d * TILE_H + NAME.gap + 2 * NAME.size * LH;
const T3_TOP = CY - T3_H / 2;
const T3_TITLE_Y = T3_TOP + (T3.title * LH) / 2;
const T3_SUB_Y = T3_TOP + T3.title * LH + T3.subGap + (T3.sub * LH) / 2;
const T3_CAT_Y = T3_SUB_Y + (T3.sub * LH) / 2 + T3.catGap + (T3.cat * LH) / 2;
const T3_TILE_Y = T3_CAT_Y + (T3.cat * LH) / 2 + T3.tileGap;
const T3_X = (i: number) => CX - (4 * T3.d + 3 * T3.gap) / 2 + i * (T3.d + T3.gap);

export const TempletonPart = () => {
  const c = usePalette();
  const shadow = useShadow();
  const { f, m, W, on } = useBeat();
  const tempAt = W("John Templeton");
  const viAt = W("Value investing adalah");
  const tileIn = ease(f, tempAt, m.reveal);
  /** the quote card comes in just after his name, its words as they are spoken; it goes as the fund is named, the fund's card in
   * its place */
  const quoteAt = tempAt + m.sec(0.3);
  const quoteOut = ease(f, W("Templeton Growth") - m.sec(0.15), m.fade);
  const fundIn = ease(f, W("Templeton Growth") + m.sec(0.25), m.reveal) * (1 - ease(f, viAt, m.fade));
  const sub = on("konsisten", 0.6);
  const pill = on("15% per", 0.5);
  const bars = ease(f, W("15% per") - m.sec(0.1), m.sec(1.8));
  const span = on("38 tahun", 0.5);
  const move = ease(f, viAt + m.sec(0.1), m.move);
  const title = ease(f, viAt + m.sec(0.25), m.reveal);
  const pro = [0, 1].map((i) => ease(f, W("investor profesional") + m.sec(0.15 * i), m.reveal));
  const retail = on("investor ritel", 0.6);
  // Templeton: from beside the quote into the row's third place
  const tD = mix(T1.d, T3.d, move);
  const tX = mix(T1_X, T3_X(2), move);
  const tY = mix(T1_TOP, T3_TILE_Y, move);
  const nameY = (top: number, d: number) => top + d * TILE_H + NAME.gap + NAME.size / 2;
  const fundTop = T1_MID - T1.fund.h / 2;
  const quoteY = T1_MID - (T1.box.h + QUOTE.drop) / 2;
  const quoteList = quoteListY(quoteY, T1.box.h, QUOTE_TYPE.lead, 2);
  return (
    <>
      {/* 1 — his line in TA09's quote card */}
      {quoteOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - quoteOut }}>
          <QuoteCard x={BOX_CX - T1.box.w / 2} y={quoteY} w={T1.box.w} h={T1.box.h} at={quoteAt} listY={quoteList} lead={QUOTE_TYPE.lead} count={2}>
            {QUOTE_LINES.map((line, n) => (
              <Words
                key={line.text}
                text={line.text}
                x={BOX_CX}
                y={quoteList + QUOTE_TYPE.lead * n + QUOTE_TYPE.size * 0.62}
                at={W(line.words[0])}
                atEach={line.words.map((wd) => W(wd))}
                anchor="center"
                size={QUOTE_TYPE.size}
                weight={600}
                marks={n === 1 ? [{ text: "pesimisme", color: theme.color.cyanWashDeepSolid }] : undefined}
              />
            ))}
          </QuoteCard>
        </div>
      ) : null}
      {/* 2 — Templeton Growth Fund */}
      {fundIn > 0.001 ? (
        <Card x={BOX_CX - T1.fund.w / 2} y={fundTop + (1 - unit(fundIn * 2)) * 14} w={T1.fund.w} h={T1.fund.h} style={{ opacity: fundIn }}>
          <Txt x={T1.fund.w / 2} y={FUND.title} size={42} weight={700}>
            Templeton Growth Fund
          </Txt>
          <Txt x={T1.fund.w / 2} y={FUND.pill + (1 - pill) * 8} size={34} weight={700} color={c.indigo} opacity={pill} style={{ padding: "8px 26px", borderRadius: 999, background: theme.color.indigoWashSolid }}>
            ±15% per tahun
          </Txt>
          <svg width={T1.fund.w} height={T1.fund.h} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: FUND.years }, (_, i) => {
              const grow = unit(bars * (FUND.years + 6) - i);
              const h = Math.max(3, (FUND.plot.h * (1 + FUND.rate) ** i) / (1 + FUND.rate) ** (FUND.years - 1)) * grow;
              return h > 0.5 ? <rect key={i} x={FUND.plot.x + i * (BAR_W + FUND.gap)} y={FUND.plot.base - h} width={BAR_W} height={h} rx={Math.min(3, h / 2)} fill={c.indigo} /> : null;
            })}
            <line x1={FUND.plot.x - 10} y1={FUND.plot.base} x2={FUND.plot.x + FUND.plot.w + 10} y2={FUND.plot.base} stroke={c.ink} strokeWidth={2.5} strokeLinecap="round" opacity={unit(bars * 6)} />
          </svg>
          <Txt x={T1.fund.w / 2} y={FUND.label + (1 - span) * 8} size={32} weight={600} opacity={span}>
            38 tahun
          </Txt>
        </Card>
      ) : null}
      {/* 3 — "Value investing" */}
      <Txt x={CX} y={T3_TITLE_Y + (1 - title) * 12} size={T3.title} weight={700} color={c.indigo} opacity={title}>
        Value investing
      </Txt>
      <Txt x={CX} y={T3_SUB_Y + (1 - sub) * 10} size={T3.sub} weight={500} color={c.indigo} opacity={sub}>
        paling konsisten dan paling sesuai untuk
      </Txt>
      {/* the category over the three, a light bracket under it to the three tiles' width */}
      {pro[0] > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: pro[0] }}>
          <Txt x={(T3_X(0) + T3_X(2) + T3.d) / 2} y={T3_CAT_Y} size={T3.cat} weight={600}>
            investor profesional dunia
          </Txt>
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            <path
              d={`M ${T3_X(0) + 12} ${T3_TILE_Y - 4} V ${T3_CAT_Y + 24} H ${T3_X(2) + T3.d - 12} V ${T3_TILE_Y - 4}`}
              fill="none"
              stroke={theme.color.connector}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : null}
      {(
        [
          { name: "buffett", label: "Warren Buffett", p: pro[0], slot: 0 },
          { name: "graham", label: "Benjamin Graham", p: pro[1], slot: 1 },
        ] as const
      ).map((t) =>
        t.p > 0.001 ? (
          <div key={t.name} style={{ position: "absolute", inset: 0, opacity: t.p, transform: `translateY(${((1 - t.p) * 14).toFixed(1)}px)` }}>
            <PhotoTile name={t.name} d={T3.d} style={{ left: T3_X(t.slot), top: T3_TILE_Y }} />
            <Txt x={T3_X(t.slot) + T3.d / 2} y={nameY(T3_TILE_Y, T3.d)} size={NAME.size} weight={500}>
              {t.label}
            </Txt>
          </div>
        ) : null,
      )}
      {tileIn > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: tileIn, transform: `translateY(${((1 - tileIn) * 14).toFixed(1)}px)` }}>
          <PhotoTile name="templeton" d={tD} style={{ left: tX, top: tY }} />
          <Txt x={tX + tD / 2} y={nameY(tY, tD)} size={NAME.size} weight={500}>
            John Templeton
          </Txt>
        </div>
      ) : null}
      {retail > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: retail, transform: `translateY(${((1 - retail) * 14).toFixed(1)}px)` }}>
          <div style={{ position: "absolute", left: T3_X(3), top: T3_TILE_Y, width: T3.d, height: T3.d * TILE_H, borderRadius: T3.d * 0.13, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Glyph icon="user" size={T3.d * 0.5} tone={c.indigo} />
          </div>
          <Txt x={T3_X(3) + T3.d / 2} y={nameY(T3_TILE_Y, T3.d) + (NAME.size * 1.15) / 2} size={NAME.size} weight={500}>
            Investor ritel
            <br />
            Indonesia
          </Txt>
        </div>
      ) : null}
    </>
  );
};

// ── 4–7: Tuntun ────────────────────────────────────────────────────────────────────────────────────────────────────────────
/**
 * The app card: a "Tuntun" heading (the Tuntun T and the name, as SC06's Tuntun card) over the BBCA card's three columns, the
 * screen 1260 wide. First centred in the free height; then 72 % and up, to leave room for the three columns under it.
 */
const APP = { w: 1340, pad: 40, head: 110, foot: 24, screenW: 1260, mark: 72 };
const APP_K = APP.screenW / BBCA_CARD.w;
const APP_H = APP.head + BBCA_CARD.h * APP_K + APP.foot;
/**
 * Under the card, the two terms the VO names, each on its word (Simon 18 Nov: "di bawah kartu, tulis 'Reference Fair Value' dan
 * 'Valuation Status'"): side by side, 90 apart, the pair centred; 44 px / 700, indigo like the boxes that mark them. The card and
 * the line under it centred together in the free height. They go as the card rises.
 */
const APP_LABEL = { gap: 44, size: 44, between: 90 };
const APP_TOP = CY - (APP_H + APP_LABEL.gap + APP_LABEL.size * 1.15) / 2;
const APP_LABEL_Y = APP_TOP + APP_H + APP_LABEL.gap + (APP_LABEL.size * 1.15) / 2;
/** risen: 60 % and near the top, to give the three screens room (its right edge, 1362, stays clear of the logo zone) */
const APP_UP = { scale: 0.6, top: 120 };
const MARK_SRC = "art/vi03/tuntun-academy-mark.png";
/** the screen's own units (343 × 78): the Reference Fair Value column, and its status line (measured on the svg, 18 Nov) */
const RFV_COL = { x1: 102, y1: 4, x2: 241, y2: 74 };
const RFV_STATUS = { x1: 120, y1: 56.5, x2: 223, y2: 71 };
/**
 * Three columns under the card, joined to it by a tree from its middle: a label and Tuntun's own screen for it (Simon 18 Nov:
 * "Laba ganti dengan Revenue_01.jpg, Waktu ganti dengan Revenue.jpg yang uda di crop di frame 23528, Keyakinan ganti dengan
 * Financial Health.jpg"), each cut to its content in public/art/vi03/app — the 9M earning card without its "Updated … Source"
 * line (no source on screen), the revenue as SC07 shows it, the financial health chart and table. Each screen fits its column's
 * picture box, centred.
 */
const COL = { w: 500, h: 470, gap: 40, top: 440, labelY: 46, branchY: 405, shot: { x: 20, y: 92, w: 460, h: 358 } };
const COL_X = (i: number) => CX - (3 * COL.w + 2 * COL.gap) / 2 + i * (COL.w + COL.gap);
const COL_SHOTS = [
  { label: "Laba", src: "art/vi03/app/bbca-earning-9m.jpg", w: 2040, h: 760 },
  { label: "Waktu", src: "art/vi03/app/bbca-revenue.jpg", w: 1028, h: 922 },
  /** then the Research Report's top, then (Simon 18 Nov: "ganti jadi gambar 1 deh. Nama filenya Keyakinan.jpg") his table of
   * fair value by case (01 Academy/VI03/Keyakinan.jpg), its "Source: …" line cut off (no source on screen), at half
   * (public/art/vi03/app/keyakinan-fair-value-cases.jpg) */
  { label: "Keyakinan", src: "art/vi03/app/keyakinan-fair-value-cases.jpg", w: 1847, h: 485 },
] as const;
/**
 * Top Undervalued: Tuntun's own screen (Simon 18 Nov: "ganti dengan Top Undervalued.jpg"), status and navigation bars and the
 * half row at the foot cut away (public/art/vi03/app/top-undervalued.jpg, 1080 × 2050), on a card 830 tall in the middle; on
 * "selisih besar" a box on its Undervalued (%) column (x 655–1005, y 630–2030 of the cut, measured).
 */
const LIST = { src: "art/vi03/app/top-undervalued.jpg", w0: 1080, h0: 2050, h: 830 };
const LIST_K = LIST.h / LIST.h0;
const LIST_W = LIST.w0 * LIST_K;
/**
 * Over it, Tuntun's home-screen Top Undervalued card (Simon 18 Nov: "Tambah 'Top Undervalued_1.jpg' … sizenya 30% lebih besar
 * dari original, lalu letaknya di atas Top Undervalued.jpg (overlap aja) geser ke kanan 400 px"): 30 % wider than the list
 * (public/art/vi03/app/top-undervalued-widget.jpg, his 4320 × 3020 shot at a third), centred on the list and 400 px right, on top
 * of it (later: 30 % bigger again, its left edge on the list's middle — see WIDGET). It comes in just after the list; the box on "selisih besar" is on ITS Undervalued (%) column (Simon: "yang kamu kasih HL
 * box adalah Top Undervalued_1"; header 1859–2908 × 619–742, figures 2623–2920 × 1162–2627 of his shot, measured). It goes as the
 * list steps left, where the pills come.
 */
/** then "Perbesar lagi deh 30%. Lalu geser ke kiri … hingga titik terujung kiri kartu Top Undervalued_01 posisinya ada di titik
 * tertengah kartu Top Undervalued": 1.3 × 1.3 the list's width, its left edge on the list's middle */
const WIDGET = { src: "art/vi03/app/top-undervalued-widget.jpg", w0: 1440, h0: 1007, scale: 1.3 * 1.3 };
const WIDGET_W = LIST_W * WIDGET.scale;
const WIDGET_K = WIDGET_W / WIDGET.w0;
const WIDGET_H = WIDGET.h0 * WIDGET_K;
/** ±10 px (on screen) round the header and the figures */
const WIDGET_HL = { x1: 1790 / 3, y1: 540 / 3, x2: 2985 / 3, y2: 2720 / 3 };
const LIST_SIDE = { gap: 120 };
const PILL = { w: 400, h: 88, gap: 70, size: 40 };
const SIDE_W = LIST_W + LIST_SIDE.gap + PILL.w;
const LIST_SIDE_X = CX - SIDE_W / 2;
const PILL_X = LIST_SIDE_X + LIST_W + LIST_SIDE.gap;
const PILL_TOP = CY - (3 * PILL.h + 2 * PILL.gap) / 2;
const PILLS = ["Kandidat", "Analisis", "Layak dimiliki?"] as const;

export const TuntunPart = () => {
  const c = usePalette();
  const shadow = useShadow();
  const { f, m, W, on } = useBeat();
  const appAt = W("Di Tuntun");
  const listAt = W("Kemudian Top");
  const appIn = ease(f, appAt, m.reveal);
  const out = ease(f, listAt, m.fade);
  const hlRfv = on("Reference Fair Value", 0.6);
  const hlStatus = on("Valuation Status", 0.6);
  const up = ease(f, W("Reference Fair Value dihitung"), m.move);
  /** the two terms go first, before the card rises past them */
  const labelOut = ease(f, W("Reference Fair Value dihitung") - m.sec(0.3), m.fade);
  const colAt = ["berapa banyak laba", "berapa lama", "seberapa pasti"].map((p) => W(p));
  const colIn = colAt.map((a) => ease(f, a, m.reveal));
  const trunk = ease(f, colAt[0] - m.sec(0.25), m.sec(0.4));
  // the card's place: centred, then up and smaller (origin: its top middle)
  const s = mix(1, APP_UP.scale, up);
  const top = mix(APP_TOP, APP_UP.top, up);
  const at = (u: number, v: number) => ({ x: CX + (APP.pad + u * APP_K - APP.w / 2) * s, y: top + (APP.head + v * APP_K) * s });
  const box = (r: { x1: number; y1: number; x2: number; y2: number }, pad: number) => {
    const a = at(r.x1, r.y1),
      b = at(r.x2, r.y2);
    return { x1: a.x - pad, y1: a.y - pad, x2: b.x + pad, y2: b.y + pad };
  };
  const cardFoot = top + APP_H * s;
  // the list
  const listIn = ease(f, listAt + m.sec(0.3), m.reveal);
  const gapBox = on("selisih besar", 0.6);
  const widgetIn = ease(f, listAt + m.sec(0.8), m.reveal) * (1 - ease(f, W("Tapi ingat") - m.sec(0.1), m.fade));
  const side = ease(f, W("Tapi ingat"), m.move);
  /** the list and the card over it, centred as a pair: the list's left where the card's middle-anchored right edge balances it */
  const lx = mix(CX - (LIST_W / 2 + WIDGET_W) / 2, LIST_SIDE_X, side);
  const ly = CY - LIST.h / 2;
  const pillIn = [ease(f, W("kumpulan kandidat"), m.reveal), ease(f, W("Analisis membantu") + m.sec(0.25), m.reveal), ease(f, W("layak dimiliki"), m.reveal)];
  const arrows = [
    ease(f, W("Daftar tersebut"), m.sec(0.5)),
    ease(f, W("Analisis membantu"), m.sec(0.35)),
    ease(f, W("layak dimiliki") - m.sec(0.3), m.sec(0.35)),
  ];
  const pillY = (i: number) => PILL_TOP + i * (PILL.h + PILL.gap);
  return (
    <>
      {/* 4–5 — the app card, its highlights, the three columns */}
      {appIn * (1 - out) > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: appIn * (1 - out) }}>
          <div style={{ position: "absolute", left: CX - APP.w / 2, top: top + (1 - appIn) * 14, width: APP.w, height: APP_H, transform: `scale(${s.toFixed(4)})`, transformOrigin: "50% 0" }}>
            <Card x={0} y={0} w={APP.w} h={APP_H} line={theme.color.skeleton}>
              <div style={{ position: "absolute", left: APP.pad, top: APP.head / 2, transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 18 }}>
                <Pic src={staticFile(MARK_SRC)} style={{ width: APP.mark, height: APP.mark, flex: "none" }} />
                <div style={{ ...typeStyle("title"), fontSize: 46, fontWeight: 700, color: c.ink, whiteSpace: "nowrap" }}>Tuntun</div>
              </div>
              <Pic src={staticFile(BBCA_CARD.src)} style={{ position: "absolute", left: APP.pad - 2, top: APP.head - 2, width: APP.screenW, height: BBCA_CARD.h * APP_K }} />
            </Card>
          </div>
          {/* the boxes shrink with the card — their margin, line and corners too (Simon 18 Nov: "HL box nya mengecil aja") — and
              fade out as it rises, gone once it has landed ("dibuat hilang saat sudah geser naik dan mengecil") */}
          <HighlightBox rect={box(RFV_COL, 6 * s)} grow={hlRfv} opacity={hlRfv * (1 - up)} fill="none" width={4 * s} radius={18 * s} />
          <HighlightBox rect={box(RFV_STATUS, 4 * s)} grow={hlStatus} opacity={hlStatus * (1 - up)} fill="none" width={4 * s} radius={14 * s} />
          {/* the two terms under the card */}
          {labelOut < 0.999 ? (
            <div style={{ position: "absolute", left: CX, top: APP_LABEL_Y, transform: "translate(-50%, -50%)", display: "flex", gap: APP_LABEL.between, opacity: 1 - labelOut, ...typeStyle("title"), fontSize: APP_LABEL.size, fontWeight: 700, color: c.indigo, whiteSpace: "nowrap" }}>
              <span style={{ opacity: hlRfv, transform: `translateY(${((1 - hlRfv) * 10).toFixed(1)}px)` }}>Reference Fair Value</span>
              <span style={{ opacity: hlStatus, transform: `translateY(${((1 - hlStatus) * 10).toFixed(1)}px)` }}>Valuation Status</span>
            </div>
          ) : null}
          {/* the tree: down from the card's middle, across, down to each column */}
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            <g fill="none" stroke={theme.color.connector} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              {trunk > 0.001 ? <line x1={CX} y1={cardFoot + 8} x2={CX} y2={mix(cardFoot + 8, COL.branchY, trunk)} /> : null}
              {[0, 1, 2].map((i) => {
                const p = colIn[i];
                if (p <= 0.001) return null;
                const x = COL_X(i) + COL.w / 2;
                return <path key={i} d={`M ${CX} ${COL.branchY} H ${mix(CX, x, unit(p * 1.6))} ${p > 0.62 ? `V ${mix(COL.branchY, COL.top - 8, unit((p - 0.62) / 0.38))}` : ""}`} />;
              })}
            </g>
          </svg>
          {COL_SHOTS.map((col, i) => {
            const p = colIn[i];
            if (p <= 0.001) return null;
            const k = Math.min(COL.shot.w / col.w, COL.shot.h / col.h);
            const w = col.w * k,
              h = col.h * k;
            return (
              <div key={col.label} style={{ position: "absolute", left: COL_X(i), top: COL.top + (1 - p) * 16, width: COL.w, height: COL.h, borderRadius: 24, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.skeleton}`, opacity: p }}>
                <Txt x={COL.w / 2} y={COL.labelY} size={36} weight={600}>
                  {col.label}
                </Txt>
                <Pic src={staticFile(col.src)} style={{ position: "absolute", left: COL.shot.x + (COL.shot.w - w) / 2, top: COL.shot.y + (COL.shot.h - h) / 2, width: w, height: h }} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* 6–7 — Top Undervalued (Tuntun's screen), the box on its Undervalued (%) column, then the way to a stock worth owning */}
      {listIn > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: listIn }}>
          <Card x={lx} y={ly + (1 - listIn) * 14} w={LIST_W} h={LIST.h} line={theme.color.skeleton} style={{ overflow: "hidden" }}>
            <Pic src={staticFile(LIST.src)} style={{ position: "absolute", left: -2, top: -2, width: LIST_W, height: LIST.h }} />
          </Card>
          {widgetIn > 0.001
            ? (() => {
                const wx = lx + LIST_W / 2;
                const wy = CY - WIDGET_H / 2;
                return (
                  <div style={{ position: "absolute", inset: 0, opacity: widgetIn }}>
                    <Card x={wx} y={wy + (1 - widgetIn) * 14} w={WIDGET_W} h={WIDGET_H} line={theme.color.skeleton} style={{ overflow: "hidden" }}>
                      <Pic src={staticFile(WIDGET.src)} style={{ position: "absolute", left: -2, top: -2, width: WIDGET_W, height: WIDGET_H }} />
                    </Card>
                    <HighlightBox
                      rect={{ x1: wx + WIDGET_HL.x1 * WIDGET_K, y1: wy + WIDGET_HL.y1 * WIDGET_K, x2: wx + WIDGET_HL.x2 * WIDGET_K, y2: wy + WIDGET_HL.y2 * WIDGET_K }}
                      grow={gapBox}
                      opacity={gapBox}
                      fill="none"
                      width={4}
                      radius={16}
                    />
                  </div>
                );
              })()
            : null}
        </div>
      ) : null}
      <GrowArrow x0={LIST_SIDE_X + LIST_W + 16} y0={pillY(0) + PILL.h / 2} x1={PILL_X - 16} y1={pillY(0) + PILL.h / 2} p={arrows[0]} />
      <GrowArrow x0={PILL_X + PILL.w / 2} y0={pillY(0) + PILL.h + 10} x1={PILL_X + PILL.w / 2} y1={pillY(1) - 10} p={arrows[1]} />
      <GrowArrow x0={PILL_X + PILL.w / 2} y0={pillY(1) + PILL.h + 10} x1={PILL_X + PILL.w / 2} y1={pillY(2) - 10} p={arrows[2]} />
      {PILLS.map((t, i) => {
        const p = pillIn[i];
        if (p <= 0.001) return null;
        const last = i === PILLS.length - 1;
        return (
          <div key={t} style={{ position: "absolute", left: PILL_X, top: pillY(i) + (1 - p) * 14, width: PILL.w, height: PILL.h, borderRadius: 24, background: last ? c.indigo : c.cardBg, boxShadow: last ? shadow.soft : `${shadow.soft}, inset 0 0 0 2px ${theme.color.skeleton}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, ...typeStyle("title"), fontSize: PILL.size, fontWeight: 700, color: last ? c.cardBg : c.ink, whiteSpace: "nowrap" }}>
            {t}
          </div>
        );
      })}
    </>
  );
};
