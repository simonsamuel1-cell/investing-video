/**
 * VI03 · SC06 v2 — "Murah Asli vs Murah Palsu", told the way Simon told SC01–SC03 (17 Nov: "Habis ini langsung revisi scene
 * 06"; "pelajarin … cara penyampaiannya, termasuk apa yang boleh dan tidak boleh dijadikan visual"). Storyboard:
 * docs/vi-style/storyboards/VI03-SC06-v2.png. The first build (one Shot per sentence) is RealCheap.tsx (switch SC06_LOOK).
 *
 * What is shown is only what the VO names; text is labels in the VO's own words, and one insight line. No source, no
 * invented number, no calculator icon (Simon removed it in SC04).
 *
 *  A  "Tapi sesuatu yang terlihat murah …": the scene's question "Benar-benar murah?" opens in the middle; it docks as the
 *     heading and stays to the end.
 *  B  "Kembali ke warung Ibu Sari": VI01's white frame; Ibu Sari and her warung, named.
 *  C  "Murah yang sebenarnya …": one summary sentence on the right, fading in on "menghitung" —
 *     "Menghitung total nilai 10–20 tahun ke depan, dibanding harga hari ini" (Simon 17 Nov: the bars card here was "terlalu
 *     abstrak").
 *  D  "Cara yang terlihat lebih mudah …": that card goes; in its place two rows, "Laba hari ini × kelipatan" and "Aset bersih
 *     hari ini", each on its words.
 *  E  "Masalahnya, dua angka tersebut hanya menggambarkan kondisi hari ini": "Hanya menggambarkan kondisi hari ini" fades in
 *     over the card (Simon 17 Nov), the card sliding down to make room; the two "hari ini" turn indigo.
 *  F  "Bayangkan besok ada warung baru …": at Studio 16745 Ibu Sari, the card and its line fade out and her warung moves so
 *     that it and the new shop stand as a pair centred on the screen (Simon 17 Nov); the shop comes in on "warung baru". No pills, no
 *     customer icons, no scooter, no ring on the AC (Simon 17 Nov).
 *     Under it, on their sentences, pills "Tempat lebih besar", "Pasang AC", "Ada layanan delivery".
 *  G  "Laba … belum berubah" / "Aset bersihnya juga belum berubah": pills under Ibu Sari's warung, "Laba belum berubah", "Aset
 *     bersih belum berubah".
 *  H  "Tapi jumlah pelanggan … bisa berkurang": under them a "Pelanggan" row, its bar going from 95 % to 75 % (no figures).
 *  I  "Artinya, laba … di masa depan sudah berubah": the street goes; "Laba masa depan", a column chart (Thn 1–10, y-axis
 *     5 jt … 25 jt), its bars growing from 0; on "sudah berubah" the projection comes down, the earlier one grey behind it.
 *     Under the chart one line: "Laba masa depan sudah berubah," fades in, then ", nilai bisnis ikut berubah" joins it on
 *     "Dan kalau laba …".
 *  J  "Inilah inti masalahnya. Investasi menguji …": in the same place, the one insight line fades in.
 *  K  "Contohnya terlihat pada perusahaan batu bara pada 2022" (a camera cut; no white frame from here, as in SC05): a card
 *     "Batu bara 2022" — Harga batu bara Tinggi, PE 3–4x (the VO's own figures, no company named); on "Kelihatannya sangat
 *     murah" the 3–4x turns green; a "Laba" card comes in beside it, 2023's bar half of 2022's on "turun sekitar separuh".
 *  L  "Itulah alasan Tuntun …": the two cards (shown 20 % smaller) slide down and Tuntun's card (the T mark) comes in over
 *     them: Riset mendalam, Terus mengikuti perkembangan; on "Bukan sekadar melihat beberapa rasio keuangan" the coal card goes
 *     grey.
 */
import {
  CardE as Card,
  DrawingVI03E as Drawing,
  FigureE as Figure,
  PicE as Pic,
} from "../../../editable";
import {
  interpolateColors,
  staticFile,
  useCurrentFrame,
  Interactive,
} from "remotion";
import {
  INTRO_FRAMES,
  SoftGround,
  Stage,
  cutInStyle,
  cutOutStyle,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
  type Cut,
} from "../../../core";
import { BLOCK, CUT } from "../data/timing";
import {
  ART,
  BoardGrid,
  Glyph,
  LINE_ART,
  ease,
  useWords,
} from "../components/kit";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
type Box = { x: number; y: number; w: number; h: number };

const MID_X = theme.canvas.width / 2;
const MID_Y = theme.canvas.height / 2;
/** VI01's story frame */
const FRAME = { x: 160, y: 190, w: 1600, h: 700, line: 3 };
/** the scene's question: opens in the middle, docks over the frame (SC04/SC05's heading place and size) */
const HEAD = {
  text: "Benar-benar murah?",
  openCy: 520,
  openScale: 1.7,
  cy: 112,
  size: 64,
};
const NAME = { gap: 22, size: 34 };

// B–H — the street
/** the people and shops stand on this line; with the names under them the block is centred in the frame */
const FLOOR = 690;
const WARUNG_H = 364;
const WARUNG_W = (WARUNG_H * ART.warung.w) / ART.warung.h;
const IBU_H = 336;
const IBU_W = (IBU_H * ART["ibu-sari"].w) / ART["ibu-sari"].h;
/** SC03's gap between Ibu Sari and her warung */
const IBU_GAP = 120;
/** C's card, right of the warung */
const FUT_W = 680;
const FUT_GAP = 110;
const ROW_W = IBU_W + IBU_GAP + WARUNG_W + FUT_GAP + FUT_W;
const X0 = FRAME.x + (FRAME.w - ROW_W) / 2;
const IBU_CX = X0 + IBU_W / 2;
const WARUNG_CX = X0 + IBU_W + IBU_GAP + WARUNG_W / 2;
const WARUNG_R = X0 + IBU_W + IBU_GAP + WARUNG_W;
const FUT_A: Box = { x: WARUNG_R + FUT_GAP, y: MID_Y - 220, w: FUT_W, h: 440 };
/**
 * C: a summary instead of a picture (Simon 17 Nov: the bars card was "terlalu abstrak" — "kasih text ringkasan aja"), one
 * sentence ("langsung kalimat aja"), "Menghitung" in front (his words), broken where the phrases break; it fades in on the VO's
 * "menghitung" (Simon 17 Nov: "gausa animasi ngetik, animasi fade in aja semua").
 */
const SUMMARY = {
  text: "Menghitung total nilai\n10–20 tahun ke depan,\ndibanding harga hari ini",
  at: "menghitung",
  inset: 20,
};

/** D–E: the two shortcuts, in C's place */
const SHORT: Box = { x: FUT_A.x, y: MID_Y - 150, w: FUT_W, h: 300 };
/**
 * E: "Hanya menggambarkan kondisi hari ini" over the card (Simon 17 Nov), fading in on "Masalahnya"; the card
 * slides down by half the text's height + gap so text and card stand centred in the frame together. Two lines, the wider 600 px
 * at 52 px (measured), inside the card's width.
 */
const TODAY_ONLY = {
  text: "Hanya menggambarkan\nkondisi hari ini",
  gap: 30,
  size: 52,
  lineH: 1.3,
  inset: 20,
};
const SHORT_SHIFT =
  (2 * TODAY_ONLY.size * TODAY_ONLY.lineH + TODAY_ONLY.gap) / 2;
const SHORT_ROW = { pad: 30, ys: [40, 160], h: 100, size: 36, disc: 60 };
const SHORTS = [
  {
    icon: "coins",
    pre: "Laba ",
    today: "hari ini",
    post: " × kelipatan",
    at: "mengambil laba",
  },
  {
    icon: "bank",
    pre: "Aset bersih ",
    today: "hari ini",
    post: "",
    at: "aset bersih",
  },
] as const;

/**
 * F: from Studio 16745 Ibu Sari fades out and her warung and the new shop stand as a pair centred on the screen (Simon 17 Nov:
 * "16745 Ibu Sari nya fade out, lalu Warung Ibu Sari dan warung barunya di buat align-center horizontal pada layar"); the
 * card and its line go with her. No scooter, no ring on the air-conditioner (Simon 17 Nov: "Hapus gambar motor, hapus highlight
 * pada AC"), no customer icons (Simon 17 Nov: "ini juga hapus"). The shop 15 % smaller
 * than first drawn (Simon 17 Nov: "warung barunya kecilin 15%").
 */
const IBU_OUT_STUDIO = 16745;
const SHOP_H = 380 * 0.85;
const SHOP_W = (SHOP_H * LINE_ART.minimarket.w) / LINE_ART.minimarket.h;
const PAIR_GAP = 300;
const PAIR_W = WARUNG_W + PAIR_GAP + SHOP_W;
const WARUNG_F_CX = MID_X - PAIR_W / 2 + WARUNG_W / 2;
const SHOP_CX = MID_X + PAIR_W / 2 - SHOP_W / 2;
/**
 * F–H: pills under the two shops (Simon 17 Nov) — under the new one, on their sentences, "Tempat lebih besar", "Pasang AC",
 * "Ada layanan delivery" (his words); under Ibu Sari's, "Laba belum berubah", "Aset bersih belum berubah", then a "Pelanggan" row
 * with a bar on its right going from 95 % to 75 % on "bisa berkurang" (no figures written: Simon). Each column one width (its
 * widest text at 30 px + the paddings, measured); the drawings and the three rows under them centred in the frame.
 */
const ROW = { h: 58, gap: 14, top: 30, size: 30, pad: 28 };
const SHOP_PILLS = [
  { text: "Tempat lebih besar", at: "Tempatnya lebih" },
  { text: "Pasang AC", at: "Ada AC" },
  { text: "Ada layanan delivery", at: "Dan menyediakan" },
] as const;
const WARUNG_PILLS = [
  { text: "Laba belum berubah", at: "Laba Ibu Sari" },
  { text: "Aset bersih belum berubah", at: "Aset bersihnya" },
] as const;
const COL_W = { warung: 440, shop: 360 };
const CUSTOMERS = {
  text: "Pelanggan",
  at: "Tapi jumlah",
  drop: "bisa berkurang",
  from: 0.95,
  to: 0.75,
  barH: 18,
  gap: 20,
};
const STREET_H = Math.max(WARUNG_H, SHOP_H) + ROW.top + 3 * ROW.h + 2 * ROW.gap;
/** the street's floor: the drawings and the rows under them centred in the frame */
const FLOOR_F = MID_Y - STREET_H / 2 + Math.max(WARUNG_H, SHOP_H);
const rowY = (k: number) => FLOOR_F + ROW.top + k * (ROW.h + ROW.gap);

/** J: the one insight line */
const INSIGHT = {
  text: "Investasi menguji kemampuan menilai masa depan",
  size: 52,
};

/**
 * I: Ibu Sari's profit for the years ahead as a column chart (Simon 17 Nov: "bar chartnya ganti arah, jadi bar chart berdiri
 * aja. Tiap bar chart adalah tahunnya, tingginya adalah proyeksi labanya"), in the design of his reference (title pill with a
 * hard shadow, pale grid, rounded bar ends). The y-axis reads 5 jt … 25 jt (his choice, 17 Nov: the scale of SC03's 20 juta a
 * year). Year 1 is SC03's 20 jt, the optimistic projection rising gently to 23 jt by year 10; once the new shop is open the
 * projection falls (year 1, today's profit, unchanged) to 12 jt — the coloured bars come down and grey bars stay behind them
 * at the earlier, optimistic projection (his words). The bars grow from 0, all together. The grey is a light one
 * (Simon 17 Nov: "abu abunya yang terang"). Illustrative figures on SC03's own
 * number, not data.
 */
const YEARS = 10;
const PROFIT = { now: 20, hope: 23, worst: 12, max: 25, step: 5 };
const hopeJt = (i: number) =>
  PROFIT.now + (PROFIT.hope - PROFIT.now) * (i / (YEARS - 1));
const afterJt = (i: number) =>
  PROFIT.now - (PROFIT.now - PROFIT.worst) * (i / (YEARS - 1));
const CHART = {
  title: "Laba masa depan",
  titleH: 64,
  titleSize: 34,
  gap: 40,
  axisW: 90,
  axisGap: 20,
  plotW: 900,
  plotH: 340,
  barW: 52,
  labelSize: 24,
  xLabelGap: 34,
};
const CHART_H =
  CHART.titleH +
  CHART.gap +
  CHART.plotH +
  CHART.xLabelGap +
  CHART.labelSize / 2;
const INSIGHT_GAP = 44;
const CHART_TOP = MID_Y - (CHART_H + INSIGHT_GAP + INSIGHT.size * 1.2) / 2;
const PLOT_TOP = CHART_TOP + CHART.titleH + CHART.gap;
const PLOT_BASE = PLOT_TOP + CHART.plotH;
const PLOT_X =
  MID_X -
  (CHART.axisW + CHART.axisGap + CHART.plotW) / 2 +
  CHART.axisW +
  CHART.axisGap;
const jtY = (jt: number) => PLOT_BASE - (jt / PROFIT.max) * CHART.plotH;
const barCx = (i: number) => PLOT_X + (i + 0.5) * (CHART.plotW / YEARS);
const INSIGHT_CY = CHART_TOP + CHART_H + INSIGHT_GAP + (INSIGHT.size * 1.2) / 2;
/**
 * I–J: one line under the chart (Simon 17 Nov: "digabung aja … muncul 1 dulu lalu nyambung muncul 2"): "Laba masa depan sudah
 * berubah," fades in on "laba yang bisa", then ", nilai bisnis ikut berubah" fades in after it on "Dan kalau laba" — the whole line
 * laid out from the start so the first half never moves (1433 px at 52 px, measured, inside the frame). On "Inilah inti" it
 * fades out and the insight fades in in its place. Fades only, no typing (Simon).
 */
const UNDER = [
  { text: "Laba masa depan sudah berubah,", at: "laba yang bisa" },
  { text: " nilai bisnis ikut berubah", at: "Dan kalau laba" },
] as const;
const INSIGHT_AT = "Inilah inti";

// K–L — the coal case, on the grid
const COAL_W = 700;
const RIGHT_W = 820;
const CASE_GAP = 60;
const CASE_H = 400;
const CASE_TITLE = { y: 76, size: 48 };
/**
 * The cards are drawn at the sizes above and shown 20 % smaller (Simon 17 Nov: "kecilin ukuran gambar 2 20%"). On "Itulah alasan
 * Tuntun" the coal and Laba cards slide down and Tuntun's card comes in over them (his words); the Laba card stays to the end
 * (it was on screen too briefly: "cepet banget sih munculnya"). The two rows, one over the other, are centred on the screen.
 */
const CASE_K = 0.8;
const COAL_VW = COAL_W * CASE_K;
const RIGHT_VW = RIGHT_W * CASE_K;
const CASE_VH = CASE_H * CASE_K;
const CASE_X0 = MID_X - (COAL_VW + CASE_GAP * CASE_K + RIGHT_VW) / 2;
const STACK_GAP = 40;
const STACK_TOP = MID_Y - (2 * CASE_VH + STACK_GAP) / 2;
const ROW_Y = {
  alone: MID_Y - CASE_VH / 2,
  under: STACK_TOP + CASE_VH + STACK_GAP,
};
const COAL_ROWS = [
  { label: "Harga batu bara", value: "Tinggi", at: "harga batu bara" },
  { label: "PE", value: "3–4x", at: "PE" },
] as const;
const CASE_ROW = { pad: 36, ys: [140, 262], h: 96, size: 38, disc: 64 };
const LABA = { barW: 150, gap: 110, base: 320, full: 200, label: 34 };
const MARK = { src: "art/vi03/tuntun-academy-mark.png", d: 84 };
const TUNTUN_ROWS = [
  { icon: "magnifying-glass", text: "Riset mendalam", at: "riset mendalam" },
  {
    icon: "arrows-clockwise",
    text: "Terus mengikuti perkembangan",
    at: "terus mengikuti",
  },
] as const;

/** I: the years-ahead chart; `on` brings in the title, the axis and the grid, `grow[i]` each bar from 0, `fall` the projection down */
const FutureChart = ({
  on,
  grow,
  fall,
}: {
  on: number;
  grow: number[];
  fall: number;
}) => {
  const c = usePalette();
  const ticks = Array.from(
    { length: PROFIT.max / PROFIT.step },
    (_, k) => (k + 1) * PROFIT.step,
  );
  const bar = (i: number, jt: number, tone: string) => {
    const h = (jt / PROFIT.max) * CHART.plotH * grow[i];
    return h > 0.5 ? (
      <rect
        key={`${tone}${i}`}
        x={barCx(i) - CHART.barW / 2}
        y={PLOT_BASE - h}
        width={CHART.barW}
        height={h}
        rx={Math.min(12, h / 2)}
        fill={tone}
      />
    ) : null;
  };
  return (
    <>
      <Interactive.Div
        name="Objek"
        style={{
          position: "absolute",
          left: MID_X,
          top: CHART_TOP + (1 - on) * 12,
          transform: "translateX(-50%)",
          opacity: on,
          height: CHART.titleH,
          padding: "0 44px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          borderRadius: CHART.titleH / 2,
          background: c.cardBg,
          boxShadow: `inset 0 0 0 3px ${c.ink}, 0 6px 0 ${c.ink}`,
          ...typeStyle("title"),
          fontSize: CHART.titleSize,
          fontWeight: 600,
          color: c.ink,
          whiteSpace: "nowrap",
        }}
      >
        {CHART.title}
      </Interactive.Div>
      <svg
        width={theme.canvas.width}
        height={theme.canvas.height}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <g opacity={on}>
          {ticks.map((t) => (
            <line
              key={t}
              x1={PLOT_X}
              y1={jtY(t)}
              x2={PLOT_X + CHART.plotW}
              y2={jtY(t)}
              stroke={theme.color.skeleton}
              strokeWidth={2}
            />
          ))}
          <line
            x1={PLOT_X}
            y1={PLOT_BASE}
            x2={PLOT_X + CHART.plotW}
            y2={PLOT_BASE}
            stroke={c.ink}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>
        {/* the earlier, optimistic projection, grey, behind — seen once the coloured bars come down */}
        {fall > 0.001
          ? Array.from({ length: YEARS }, (_, i) =>
              bar(i, hopeJt(i), theme.color.skeleton),
            )
          : null}
        {Array.from({ length: YEARS }, (_, i) =>
          bar(i, mix(hopeJt(i), afterJt(i), fall), c.indigo),
        )}
      </svg>
      {ticks.map((t) => (
        <div
          key={t}
          style={{
            position: "absolute",
            left: PLOT_X - CHART.axisGap,
            top: jtY(t),
            transform: "translate(-100%, -50%)",
            opacity: on,
            ...typeStyle("label"),
            fontSize: CHART.labelSize,
            fontWeight: 500,
            color: c.slate,
            whiteSpace: "nowrap",
          }}
        >
          {t} jt
        </div>
      ))}
      {Array.from({ length: YEARS }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: barCx(i),
            top: PLOT_BASE + CHART.xLabelGap,
            transform: "translate(-50%, -50%)",
            opacity: on,
            ...typeStyle("label"),
            fontSize: CHART.labelSize,
            fontWeight: 500,
            color: c.ink,
            whiteSpace: "nowrap",
          }}
        >
          Thn {i + 1}
        </div>
      ))}
    </>
  );
};

/** D–E: one shortcut, a row in the card; "hari ini" in indigo from E (`lit`) */
const Shortcut = ({
  s,
  b,
  lit,
  on,
}: {
  s: (typeof SHORTS)[number];
  b: Box;
  lit: number;
  on: number;
}) => {
  const c = usePalette();
  return (
    <Interactive.Div
      name="Objek"
      style={{
        position: "absolute",
        left: b.x,
        top: b.y,
        width: b.w,
        height: b.h,
        opacity: on,
        borderRadius: 20,
        boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`,
        display: "flex",
        alignItems: "center",
        gap: SHORT_ROW.size * 0.5,
        padding: `0 ${SHORT_ROW.size * 0.8}px 0 ${(b.h - SHORT_ROW.disc) / 2}px`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: SHORT_ROW.disc,
          height: SHORT_ROW.disc,
          borderRadius: 999,
          background: theme.color.neutralDisc,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "none",
        }}
      >
        <Glyph icon={s.icon} size={SHORT_ROW.disc * 0.58} tone={c.indigo} />
      </div>
      <div
        style={{
          ...typeStyle("label"),
          fontSize: SHORT_ROW.size,
          fontWeight: 600,
          color: c.ink,
          whiteSpace: "nowrap",
        }}
      >
        {s.pre}
        <span
          style={{ color: interpolateColors(lit, [0, 1], [c.ink, c.indigo]) }}
        >
          {s.today}
        </span>
        {s.post}
      </div>
    </Interactive.Div>
  );
};

/** F–H: a pill under a shop, its middle at `cx`, its top at `y` */
const StreetPill = ({
  cx,
  y,
  w,
  p,
  children,
}: {
  cx: number;
  y: number;
  w: number;
  p: number;
  children: React.ReactNode;
}) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: y + (1 - p) * 10,
        width: w,
        height: ROW.h,
        opacity: p,
        borderRadius: 999,
        background: c.cardBg,
        boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${ROW.pad}px`,
        boxSizing: "border-box",
        ...typeStyle("label"),
        fontSize: ROW.size,
        fontWeight: 600,
        color: c.ink,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** K–L: a label-and-value row in a case card */
const CaseRow = ({
  y,
  w,
  label,
  value,
  tone,
  ink,
  p,
}: {
  y: number;
  w: number;
  label: string;
  value: string;
  tone: string;
  ink: string;
  p: number;
}) => (
  <Interactive.Div
    name="Objek"
    style={{
      position: "absolute",
      left: CASE_ROW.pad,
      top: y + (1 - p) * 10,
      width: w - 2 * CASE_ROW.pad,
      height: CASE_ROW.h,
      opacity: p,
      borderRadius: 18,
      boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`,
      display: "flex",
      alignItems: "center",
      padding: "0 26px",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        ...typeStyle("label"),
        fontSize: CASE_ROW.size,
        fontWeight: 600,
        color: ink,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
    <div
      style={{
        marginLeft: "auto",
        ...typeStyle("title"),
        fontSize: CASE_ROW.size + 4,
        fontWeight: 700,
        color: tone,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </div>
  </Interactive.Div>
);

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(6, BLOCK.SC06);
  const g = f + BLOCK.SC06;

  // A–B
  const backAt = W("Kembali ke warung");
  const dock = ease(f, backAt - m.sec(0.2), m.move);
  const headIn = ease(f, -m.reveal, m.reveal);
  const worldIn = ease(f, backAt, m.reveal);
  // C
  const sumIn = ease(f, W(SUMMARY.at), m.reveal);
  const easyAt = W("Cara yang terlihat");
  const futOutA = ease(f, easyAt - m.fade, m.fade);
  // D–E
  const shortIn = ease(f, easyAt, m.reveal);
  const rowIn = SHORTS.map((s) => ease(f, W(s.at), m.reveal));
  const lit = ease(f, W("kondisi hari ini"), m.reveal);
  const problemAt = W("Masalahnya");
  const cardDy = SHORT_SHIFT * ease(f, problemAt, m.move);
  const todayIn = ease(f, problemAt, m.reveal);
  // F
  /** Studio 16745: Ibu Sari, the card and its line go; the warung moves to its place in the centred pair; the shop follows */
  const ibuOutAt = IBU_OUT_STUDIO - INTRO_FRAMES - BLOCK.SC06;
  const ibuOut = ease(f, ibuOutAt, m.fade);
  const toPair = ease(f, ibuOutAt, m.move);
  const todayOut = ibuOut;
  const shortCardOut = ibuOut;
  const shopIn = ease(
    f,
    Math.max(W("warung baru"), ibuOutAt + m.move),
    m.reveal,
  );
  const shopPill = SHOP_PILLS.map((q) => ease(f, W(q.at), m.reveal));
  const warungPill = WARUNG_PILLS.map((q) => ease(f, W(q.at), m.reveal));
  const custIn = ease(f, W(CUSTOMERS.at), m.reveal);
  /** the drop lands before the street goes, so it is seen */
  const custLevel = mix(
    CUSTOMERS.from,
    CUSTOMERS.to,
    ease(f, W(CUSTOMERS.drop) - m.sec(0.3), m.sec(0.8)),
  );
  // I–J
  const meansAt = W("Artinya");
  const streetOut = ease(f, meansAt, m.fade);
  const futIn = ease(f, meansAt + m.fade, m.reveal);
  /** all the bars grow together (Simon 17 Nov: "semuanya aja langsung, jangan satu per satu") */
  const barsUp = ease(f, meansAt + m.fade + m.sec(0.2), m.sec(0.8));
  const barGrow = Array.from({ length: YEARS }, () => barsUp);
  const shrunk = ease(f, W("sudah berubah"), m.sec(1.2));
  const underIn = UNDER.map((u) => ease(f, W(u.at), m.reveal));
  const underOut = ease(f, W(INSIGHT_AT) - m.fade, m.fade);
  const insightIn = ease(f, W(INSIGHT_AT), m.reveal);
  // K–L
  const cut: Cut = { at: W("Contohnya") - m.sec(0.1), axis: "x", ...CUT };
  const coalIn = ease(f, cut.at, m.reveal);
  const coalRow = COAL_ROWS.map((r) => ease(f, W(r.at), m.reveal));
  const cheap = ease(f, W("Kelihatannya"), m.reveal);
  const labaAt = W("Kelihatannya");
  const slide = ease(f, labaAt, m.move);
  const labaIn = ease(f, labaAt + m.sec(0.2), m.reveal);
  const half = ease(f, W("labanya turun"), m.sec(1));
  const tuntunAt = W("Itulah alasan");
  const down = ease(f, tuntunAt, m.move);
  const tuntunIn = ease(f, tuntunAt + m.sec(0.3), m.reveal);
  const tuntunRow = TUNTUN_ROWS.map((r) => ease(f, W(r.at), m.reveal));
  const grey = ease(f, W("Bukan sekadar"), m.reveal);

  const coalX = mix(MID_X - COAL_VW / 2, CASE_X0, slide);
  const rightX = CASE_X0 + COAL_VW + CASE_GAP * CASE_K;
  const caseY = mix(ROW_Y.alone, ROW_Y.under, down);
  /** a card drawn at its full size, shown CASE_K of it, its top-left at (x, y) */
  const shrunkAt = (x: number, y: number): React.CSSProperties => ({
    position: "absolute",
    left: x,
    top: y,
    transform: `scale(${CASE_K})`,
    transformOrigin: "0 0",
  });
  const coalInk = interpolateColors(grey, [0, 1], [c.ink, theme.color.mute]);
  const peTone = interpolateColors(
    grey,
    [0, 1],
    [
      interpolateColors(cheap, [0, 1], [c.ink, theme.color.ok]),
      theme.color.mute,
    ],
  );

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A–J — the warung story in the white frame; cut away at "Contohnya" */}
      {f < cut.at ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...(f >= cut.at - cut.over / 2 ? cutOutStyle(f, cut) : {}),
          }}
        >
          {worldIn > 0.001 ? (
            <div style={{ position: "absolute", inset: 0, opacity: worldIn }}>
              <Interactive.Div
                name="Objek"
                style={{
                  position: "absolute",
                  left: FRAME.x,
                  top: FRAME.y,
                  width: FRAME.w,
                  height: FRAME.h,
                  borderRadius: theme.shape.cardRadius,
                  background: c.cardBg,
                  boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME.line}px ${c.ink}`,
                }}
              />

              {/* B–H: the street — Ibu Sari, her warung, then the shop across from it */}
              {streetOut < 0.999 ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 1 - streetOut,
                  }}
                >
                  <Figure
                    name="warung"
                    cx={mix(WARUNG_CX, WARUNG_F_CX, toPair)}
                    floor={mix(FLOOR, FLOOR_F, toPair)}
                    h={WARUNG_H}
                  />
                  {ibuOut < 0.999 ? (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 1 - ibuOut,
                      }}
                    >
                      <Figure
                        name="ibu-sari"
                        cx={IBU_CX}
                        floor={FLOOR}
                        h={IBU_H}
                      />
                      <Interactive.Div
                        name="Ibu Sari"
                        style={{
                          position: "absolute",
                          left: IBU_CX,
                          top: FLOOR + NAME.gap,
                          transform: "translateX(-50%)",
                          ...typeStyle("label"),
                          fontSize: NAME.size,
                          fontWeight: 500,
                          color: c.ink,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Ibu Sari
                      </Interactive.Div>
                    </div>
                  ) : null}
                  {shopIn > 0.001 ? (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: shopIn,
                        transform: `translateY(${((1 - shopIn) * 18).toFixed(1)}px)`,
                      }}
                    >
                      <Drawing
                        name="minimarket"
                        cx={SHOP_CX}
                        floor={FLOOR_F}
                        h={SHOP_H}
                      />
                    </div>
                  ) : null}
                  {SHOP_PILLS.map((q, k) => (
                    <StreetPill
                      key={q.text}
                      cx={SHOP_CX}
                      y={rowY(k)}
                      w={COL_W.shop}
                      p={shopPill[k]}
                    >
                      {q.text}
                    </StreetPill>
                  ))}
                  {WARUNG_PILLS.map((q, k) => (
                    <StreetPill
                      key={q.text}
                      cx={WARUNG_F_CX}
                      y={rowY(k)}
                      w={COL_W.warung}
                      p={warungPill[k]}
                    >
                      {q.text}
                    </StreetPill>
                  ))}
                  <StreetPill
                    cx={WARUNG_F_CX}
                    y={rowY(2)}
                    w={COL_W.warung}
                    p={custIn}
                  >
                    <span style={{ flex: "none" }}>{CUSTOMERS.text}</span>
                    <div
                      style={{
                        flex: 1,
                        height: CUSTOMERS.barH,
                        marginLeft: CUSTOMERS.gap,
                        borderRadius: 999,
                        background: theme.color.skeleton,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(custLevel * 100).toFixed(2)}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: c.indigo,
                        }}
                      />
                    </div>
                  </StreetPill>
                </div>
              ) : null}

              {/* C: a summary, right of the warung, each line on its words (Simon 17 Nov: "kasih text ringkasan aja", the bars card
                  was "terlalu abstrak"); I: the card, larger, in the middle */}
              {sumIn > 0.001 && futOutA < 0.999 ? (
                <Interactive.Div
                  name="Objek"
                  style={{
                    position: "absolute",
                    left: FUT_A.x + SUMMARY.inset,
                    top: MID_Y,
                    width: FUT_A.w - 2 * SUMMARY.inset,
                    transform: `translateY(calc(-50% + ${((1 - sumIn) * 12).toFixed(1)}px))`,
                    opacity: sumIn * (1 - futOutA),
                    textAlign: "center",
                    whiteSpace: "pre-line",
                    ...typeStyle("title"),
                    fontSize: INSIGHT.size,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: c.indigo,
                  }}
                >
                  {SUMMARY.text}
                </Interactive.Div>
              ) : null}
              {futIn > 0.001 ? (
                <FutureChart on={futIn} grow={barGrow} fall={shrunk} />
              ) : null}

              {/* D–E: the two shortcuts in C's place; F on: the same rows as pills over the frame */}
              {shortIn > 0.001 && shortCardOut < 0.999 ? (
                <Card
                  x={SHORT.x}
                  y={SHORT.y + cardDy + (1 - shortIn) * 16}
                  w={SHORT.w}
                  h={SHORT.h}
                  style={{ opacity: shortIn * (1 - shortCardOut) }}
                />
              ) : null}
              {todayIn > 0.001 && todayOut < 0.999 ? (
                <Interactive.Div
                  name="Objek"
                  style={{
                    position: "absolute",
                    left: SHORT.x + TODAY_ONLY.inset,
                    top: SHORT.y + cardDy - TODAY_ONLY.gap,
                    width: SHORT.w - 2 * TODAY_ONLY.inset,
                    transform: "translateY(-100%)",
                    opacity: todayIn * (1 - todayOut),
                    textAlign: "center",
                    whiteSpace: "pre-line",
                    ...typeStyle("title"),
                    fontSize: TODAY_ONLY.size,
                    fontWeight: 700,
                    lineHeight: TODAY_ONLY.lineH,
                    color: c.indigo,
                  }}
                >
                  {TODAY_ONLY.text}
                </Interactive.Div>
              ) : null}
              {SHORTS.map((s, i) => {
                const on = rowIn[i] * shortIn * (1 - shortCardOut);
                if (on <= 0.001) return null;
                const b: Box = {
                  x: SHORT.x + SHORT_ROW.pad,
                  y: SHORT.y + cardDy + SHORT_ROW.ys[i] + (1 - rowIn[i]) * 10,
                  w: SHORT.w - 2 * SHORT_ROW.pad,
                  h: SHORT_ROW.h,
                };
                return <Shortcut key={s.at} s={s} b={b} lit={lit} on={on} />;
              })}

              {/* I: the line under the chart, its second half joining the first; J: the insight in its place */}
              {underIn[0] > 0.001 && underOut < 0.999 ? (
                <Interactive.Div
                  name="Objek"
                  style={{
                    position: "absolute",
                    left: MID_X,
                    top: INSIGHT_CY,
                    transform: "translate(-50%, -50%)",
                    opacity: 1 - underOut,
                    ...typeStyle("title"),
                    fontSize: INSIGHT.size,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: c.indigo,
                    whiteSpace: "nowrap",
                  }}
                >
                  {UNDER.map((u, i) => (
                    <span key={u.text} style={{ opacity: underIn[i] }}>
                      {u.text}
                    </span>
                  ))}
                </Interactive.Div>
              ) : null}
              {insightIn > 0.001 ? (
                <Interactive.Div
                  name="Objek"
                  style={{
                    position: "absolute",
                    left: MID_X,
                    top: INSIGHT_CY,
                    transform: `translate(-50%, calc(-50% + ${((1 - insightIn) * 12).toFixed(1)}px))`,
                    opacity: insightIn,
                    ...typeStyle("title"),
                    fontSize: INSIGHT.size,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: c.indigo,
                    whiteSpace: "nowrap",
                  }}
                >
                  {INSIGHT.text}
                </Interactive.Div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* K–L — the coal case on the grid, cut in at "Contohnya" */}
      {f >= cut.at ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...(f < cut.at + cut.over / 2 ? cutInStyle(f, cut) : {}),
          }}
        >
          <div style={shrunkAt(coalX, caseY)}>
            <Card
              x={0}
              y={(1 - coalIn) * 16}
              w={COAL_W}
              h={CASE_H}
              style={{ opacity: coalIn }}
            >
              <Interactive.Div
                name="Batu bara 2022"
                style={{
                  position: "absolute",
                  left: CASE_ROW.pad,
                  top: CASE_TITLE.y,
                  transform: "translateY(-50%)",
                  ...typeStyle("title"),
                  fontSize: CASE_TITLE.size,
                  fontWeight: 700,
                  color: coalInk,
                  whiteSpace: "nowrap",
                }}
              >
                Batu bara 2022
              </Interactive.Div>
              {COAL_ROWS.map((r, i) => (
                <CaseRow
                  key={r.label}
                  y={CASE_ROW.ys[i]}
                  w={COAL_W}
                  label={r.label}
                  value={r.value}
                  tone={i === 1 ? peTone : coalInk}
                  ink={coalInk}
                  p={coalRow[i]}
                />
              ))}
            </Card>
          </div>
          {labaIn > 0.001 ? (
            <div style={shrunkAt(rightX, caseY)}>
              <Card
                x={0}
                y={(1 - labaIn) * 16}
                w={RIGHT_W}
                h={CASE_H}
                style={{ opacity: labaIn }}
              >
                <Interactive.Div
                  name="Laba"
                  style={{
                    position: "absolute",
                    left: CASE_ROW.pad,
                    top: CASE_TITLE.y,
                    transform: "translateY(-50%)",
                    ...typeStyle("title"),
                    fontSize: CASE_TITLE.size,
                    fontWeight: 700,
                    color: c.ink,
                  }}
                >
                  Laba
                </Interactive.Div>
                <svg
                  width={RIGHT_W}
                  height={CASE_H}
                  style={{ position: "absolute", left: 0, top: 0 }}
                >
                  {[0, 1].map((k) => {
                    const x =
                      RIGHT_W / 2 -
                      LABA.barW -
                      LABA.gap / 2 +
                      k * (LABA.barW + LABA.gap);
                    const h =
                      k === 0
                        ? LABA.full
                        : LABA.full * mix(1, 0.5, half) * Math.min(1, half * 3);
                    return h > 0.5 ? (
                      <rect
                        key={k}
                        x={x}
                        y={LABA.base - h}
                        width={LABA.barW}
                        height={h}
                        rx={12}
                        fill={c.indigo}
                      />
                    ) : null;
                  })}
                  <line
                    x1={RIGHT_W / 2 - LABA.barW - LABA.gap / 2 - 30}
                    y1={LABA.base}
                    x2={RIGHT_W / 2 + LABA.barW + LABA.gap / 2 + 30}
                    y2={LABA.base}
                    stroke={c.ink}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                  />
                </svg>
                {["2022", "2023"].map((y, k) => (
                  <div
                    key={y}
                    style={{
                      position: "absolute",
                      left:
                        RIGHT_W / 2 -
                        LABA.barW / 2 -
                        LABA.gap / 2 +
                        k * (LABA.barW + LABA.gap),
                      top: LABA.base + 34,
                      transform: "translate(-50%, -50%)",
                      opacity: k === 0 ? 1 : Math.min(1, half * 3),
                      ...typeStyle("label"),
                      fontSize: LABA.label,
                      fontWeight: 600,
                      color: c.ink,
                    }}
                  >
                    {y}
                  </div>
                ))}
              </Card>
            </div>
          ) : null}
          {tuntunIn > 0.001 ? (
            <div style={shrunkAt(MID_X - RIGHT_VW / 2, STACK_TOP)}>
              <Card
                x={0}
                y={(1 - tuntunIn) * 16}
                w={RIGHT_W}
                h={CASE_H}
                style={{ opacity: tuntunIn }}
              >
                <Interactive.Div
                  name="Tuntun"
                  style={{
                    position: "absolute",
                    left: CASE_ROW.pad,
                    top: CASE_TITLE.y,
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <Pic
                    src={staticFile(MARK.src)}
                    style={{ width: MARK.d, height: MARK.d, flex: "none" }}
                  />
                  <div
                    style={{
                      ...typeStyle("title"),
                      fontSize: CASE_TITLE.size,
                      fontWeight: 700,
                      color: c.ink,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Tuntun
                  </div>
                </Interactive.Div>
                {TUNTUN_ROWS.map((r, i) => (
                  <div
                    key={r.text}
                    style={{
                      position: "absolute",
                      left: CASE_ROW.pad,
                      top: CASE_ROW.ys[i] + (1 - tuntunRow[i]) * 10,
                      width: RIGHT_W - 2 * CASE_ROW.pad,
                      height: CASE_ROW.h,
                      opacity: tuntunRow[i],
                      borderRadius: 18,
                      boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      padding: "0 24px 0 12px",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        width: CASE_ROW.disc,
                        height: CASE_ROW.disc,
                        borderRadius: 999,
                        background: theme.color.neutralDisc,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "none",
                      }}
                    >
                      <Glyph
                        icon={r.icon}
                        size={CASE_ROW.disc * 0.56}
                        tone={c.indigo}
                      />
                    </div>
                    <div
                      style={{
                        ...typeStyle("label"),
                        fontSize: CASE_ROW.size,
                        fontWeight: 600,
                        color: c.ink,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.text}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the scene's question: opens in the middle, then the heading to the end (it stays through the cut) */}
      <Interactive.Div
        name="Objek"
        style={{
          position: "absolute",
          left: MID_X,
          top: mix(HEAD.openCy, HEAD.cy, dock),
          transform: `translate(-50%, -50%) scale(${mix(HEAD.openScale, 1, dock).toFixed(4)})`,
          opacity: headIn,
          ...typeStyle("title"),
          fontSize: HEAD.size,
          fontWeight: 700,
          lineHeight: 1.1,
          color: c.indigo,
          whiteSpace: "nowrap",
        }}
      >
        {HEAD.text}
      </Interactive.Div>
    </Stage>
  );
};
