/** Motion board: docs/vi-style/storyboards/VI03-SC07-mindmap.svg.
 * The branch tips retain their identity as the map grows (Jobster); the active
 * connection traces from the root to the example (Ancrid). */
import { CardE as Card, PicE as Pic } from "../../../editable";
import type { ReactNode } from "react";
import {
  staticFile,
  useCurrentFrame,
  interpolateColors,
  Interactive,
} from "remotion";
import {
  HighlightBox,
  INTRO_FRAMES,
  SoftGround,
  Stage,
  theme,
  typeStyle,
  useMotion,
  usePalette,
} from "../../../core";
import { BoardGrid, ease, useWords } from "../components/kit";
import { BLOCK } from "../data/timing";
import {
  CandleRun,
  RUN,
  RUN_LAST,
  RUN_TOP,
  runX,
  runY,
} from "../components/CandleRunChart";
import {
  APP_PART,
  BBCA_FAIR_VALUE,
  CompanyQualityCut,
  FairValueCut,
  appPartSize,
} from "../components/AppCardParts";
import {
  BUSINESS_CHAIN_BOX,
  BusinessChain,
} from "../../vi02-membeli-saham-berarti-membeli-perusahaan/scenes/CodeAndBusiness";
import {
  COMPANY_TWO_FLOORS,
  CompanyTwoFloors,
  companyBuildParts,
} from "../components/CompanyTwoFloors";
import { BBCA_WEEKLY, BBCA_MARKS } from "../data/bbca";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const unit = (n: number) => Math.max(0, Math.min(1, n));
const { width, height } = theme.canvas;
const mid = width / 2;
const panel = { x: 190, y: 355, w: 1540, h: 478 };
/** the whole board (title, map, card) moved down to balance its white space (Simon 18 Nov) */
const LAYOUT_DY = 60;
const center = panel.w / 2;
/**
 * "Cerita bisnis": the clean office (components/CompanyTwoFloors, as in comp VI03-Scene03) in the card (Simon 18 Nov: "terapkan
 * ke video utama, di cerita bisnis. Fit in aja ke kartu dan ke timing"). Its lines 30 px clear of the card's top and bottom;
 * centred in the card while alone, then — on "Karena bisnisnya" — 40 px in from its left, clear of the quote (767). Its build-up
 * starts at Simon's Studio frame for the building, 20586.
 */
const COMPANY_REVEAL = { from: 20586 };
const OFFICE = { pad: 30, left: 40 };
/**
 * Which business "Cerita bisnis" shows (Simon 18 Nov: "ganti deh kantor tadi, jadi prosedur ini di VI02. Kantor tadi simpan
 * aja"): "chain" — VI02 SC01's factory and its chain Produksi · Kardus · Truk · Toko (BusinessChain), without its frame, fitted to
 * the card; "office" — the clean office above, kept.
 */
const BUSINESS_ART: "chain" | "office" = "chain";
/** the chain: its box 30 px clear of the card's top and bottom, centred; on "Karena bisnisnya" it shrinks into the card's left,
 * 40 px in, clear of the quote (767); the factory first, the chain 0.45 s later, the packs running from 0.9 s */
const CHAIN_FIT = {
  pad: 30,
  left: 40,
  right: 727,
  chainAt: 0.45,
  packsAt: 0.9,
};
const ink = theme.color;
const branches = [
  ["Pertama", "Cerita bisnis"],
  ["Kedua", "Harga turun"],
  ["Ketiga", "Rasio rendah"],
  ["Keempat", "Dividen tinggi"],
  ["Dan yang kelima", "Beli dan simpan"],
] as const;

function useBeat() {
  const f = useCurrentFrame(),
    m = useMotion(),
    W = useWords(7, BLOCK.SC07);
  return {
    f,
    m,
    W,
    on: (phrase: string, seconds = 0.7) => ease(f, W(phrase), m.sec(seconds)),
  };
}
function Text({
  x,
  y,
  children,
  size = 38,
  color,
  weight = 600,
  opacity = 1,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  opacity?: number;
}) {
  const c = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        ...typeStyle("title"),
        fontSize: size,
        fontWeight: weight,
        color: color ?? c.ink,
        textAlign: "center",
        whiteSpace: "nowrap",
        opacity,
      }}
    >
      {children}
    </div>
  );
}
function Svg({
  children,
  full = false,
}: {
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <svg
      width={full ? width : panel.w}
      height={full ? height : panel.h}
      style={{ position: "absolute", inset: 0 }}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
function Trace({
  d,
  p,
  tone,
  weight = 4,
}: {
  d: string;
  p: number;
  tone: string;
  weight?: number;
}) {
  return p > 0 ? (
    <path
      d={d}
      stroke={tone}
      strokeWidth={weight}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - unit(p)}
    />
  ) : null;
}
function Business() {
  const c = usePalette(),
    { on, f, m } = useBeat();
  const [x0, y0, x1, y1] = COMPANY_TWO_FLOORS.ink;
  const k = (panel.h - 2 * OFFICE.pad) / (y1 - y0);
  const officeX = mix(
    panel.w / 2,
    OFFICE.left + ((x1 - x0) * k) / 2,
    on("Karena bisnisnya", 1.05),
  );
  /** the build-up at its own pace from Simon's frame (not stretched over his window: "Animasinya terlalu lama") */
  const buildAt = COMPANY_REVEAL.from - INTRO_FRAMES - BLOCK.SC07;
  const parts = companyBuildParts(
    (s) => ease(f, buildAt + m.sec(s), m.reveal),
    k,
  );
  const quote = on("Harga berapa"),
    check = on("Padahal", 0.85);
  const fade = unit(1 - check * 2),
    selection = unit(2 * check - 1);
  /** the chain, fitted to the card, then to its left part */
  const box = BUSINESS_CHAIN_BOX;
  const bw = box.x1 - box.x0,
    bh = box.y1 - box.y0;
  const shift = on("Karena bisnisnya", 1.05);
  const kBig = (panel.h - 2 * CHAIN_FIT.pad) / bh;
  const kSmall = Math.min(kBig, (CHAIN_FIT.right - CHAIN_FIT.left) / bw);
  const kc = mix(kBig, kSmall, shift);
  const cx = mix((panel.w - bw * kBig) / 2, CHAIN_FIT.left, shift);
  const cy = (panel.h - bh * kc) / 2;
  /** no Kamu here any more (Simon 18 Nov: "Si Kamu nya di remove") */
  return (
    <>
      {BUSINESS_ART === "office" ? (
        <Interactive.Div
          name="Objek"
          style={{
            position: "absolute",
            left: officeX - ((x0 + x1) / 2) * k,
            top: OFFICE.pad - y0 * k,
          }}
        >
          <CompanyTwoFloors width={COMPANY_TWO_FLOORS.w * k} parts={parts} />
        </Interactive.Div>
      ) : (
        <Interactive.Div
          name="Objek"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: width,
            height: height,
            transformOrigin: "0 0",
            transform: `translate(${(cx - box.x0 * kc).toFixed(2)}px, ${(cy - box.y0 * kc).toFixed(2)}px) scale(${kc.toFixed(5)})`,
          }}
        >
          <BusinessChain
            f={f}
            from={buildAt + m.sec(CHAIN_FIT.packsAt)}
            factory={ease(f, buildAt, m.reveal)}
            chain={ease(f, buildAt + m.sec(CHAIN_FIT.chainAt), m.reveal)}
          />
        </Interactive.Div>
      )}
      <div style={{ position: "absolute", inset: 0, opacity: quote * fade }}>
        <Card
          x={767}
          y={132}
          w={641}
          h={197}
          line={ink.indigoWashDeepSolid}
          dashed
        />
        <Text x={1087} y={230} size={44}>
          “Harga berapa pun,
          <br />
          beli saja.”
        </Text>
      </div>
      {/* "Padahal cerita yang bagus bukan berarti semua harga layak dibayar.": one summary line in the quote's place, fading in
          (Simon 18 Nov: no "Harga — vs — Nilai bisnis" here, "kasih kalimat ringkasan aja"); 567 px wide at 44 px, measured */}
      <Text
        x={1087}
        y={230}
        size={44}
        weight={700}
        color={c.indigo}
        opacity={selection}
      >
        Cerita bagus bukan berarti
        <br />
        semua harga layak dibayar
      </Text>
    </>
  );
}
/**
 * "Harga turun" (Simon 18 Nov: the two bars "ganti jadi chart di gambar 2 aja, tapi pastikan turunnya 50% dari harga tertinggi.
 * Buat chartnya yang estetik dan detail"): a candlestick run (components/CandleRunChart — made up, top exactly 100, last close
 * exactly 50) drawn up to its top as the branch opens, its fall on "sudah turun". Then one by one, as the VO names them (Simon
 * 18 Nov: "munculnya satu per satu sesuai script"): on "turun 50%" the bracket at the right drawn down from the top to today's
 * price, −50% beside it; on "harga sekarang" a dashed line drawn across at today's price, "Harga sekarang" over it; on "harga
 * tertingginya" the same at the top, "Harga tertinggi". The two labels sit 150 px further right than first set (Simon 18 Nov:
 * "di geser ke kanan deh 150 px", then 300 more), "Harga tertinggi" and its line in black. On "Tapi harga sekarang": the top,
 * its line and the −50% fade; a dashed indigo line 50 px under today's price is drawn across to "Nilai bisnis saat ini" at the
 * right (no "?" box: Simon 18 Nov).
 */
/**
 * The chart and its right-hand labels as one group in the card's middle (Simon 18 Nov: the watchlist "kurang bagus ya ternyata
 * … Remove aja deh. Lalu kecilin width kartu, fit ke visual"): 44 candles 14.5 px apart; the bracket 50 px past the last candle
 * and −50% 40 px past it (162 wide, measured), "Nilai bisnis saat ini" (245 wide) ending where −50% ends. The card narrows round
 * the group while this branch is open (PRICE_CARD_W, in SC07) and widens back for "Rasio rendah" ("widthnya buat normal lagi").
 */
const RUN_W = RUN.length * 14.5;
const RUN_RIGHT_ZONE = 50 + 40 + 162;
/** the first candle's body starts half a pitch less half a body into the box */
const RUN_INK_LEFT = 14.5 / 2 - (14.5 * 0.62) / 2;
const RUN_GROUP_W = RUN_W + RUN_RIGHT_ZONE - RUN_INK_LEFT;
/** the ink runs from the top label's cap, 35 px over the box, to the lowest wick, 325 px into it: centred in the card's height */
const RUN_INK = { above: 35, below: 325 };
const RUN_BOX = {
  x: center - RUN_GROUP_W / 2 - RUN_INK_LEFT,
  y: (panel.h - RUN_INK.above - RUN_INK.below) / 2 + RUN_INK.above,
  w: RUN_W,
  h: 330,
};
/** the narrowed card: the group and 60 px each side */
const PRICE_CARD_W = RUN_GROUP_W + 2 * 60;
const RUN_END = RUN_BOX.x + RUN_W + RUN_RIGHT_ZONE;
const RUN_SIDE = {
  bracket: RUN_BOX.x + RUN_BOX.w + 50,
  label: RUN_END - 162 / 2,
  value: RUN_END - 245 / 2,
  valueLineTo: RUN_END - 245 - 16,
};
/** the two line labels' middle: over the same candle as when Simon set them (150, then 300 px right of first; 18 Nov) — the
 * 14th of the 44 now */
const RUN_LABEL_X = RUN_BOX.x + 200;
/** each line starts at its label's "H" (Simon 18 Nov: "paling kirinya berhenti di huruf H"): the labels' half widths at 30 px,
 * measured on the rendered frame (left edges 518 / 513 in the card); the lines long dashes, not dots ("panjang dan putus putus") */
const RUN_LINE = {
  topFrom: RUN_LABEL_X - 102,
  nowFrom: RUN_LABEL_X - 107,
  dash: "14 10",
  value: 50,
};
function Price() {
  const c = usePalette(),
    { on } = useBeat();
  const rise = on("Kedua", 1.2),
    fall = on("sudah turun", 1.35),
    pct = on("turun 50%", 0.9),
    nowLine = on("harga sekarang", 0.6),
    topLine = on("harga tertingginya", 0.6);
  const swap = on("Tapi harga sekarang", 0.94),
    old = 1 - unit(swap * 2),
    current = unit(swap * 2 - 1);
  const yTop = runY(RUN_BOX, RUN_TOP.price);
  const yNow = runY(RUN_BOX, RUN_LAST.price);
  const xNow = runX(RUN_BOX, RUN_LAST.i);
  const upto = (RUN_TOP.i + 2) * rise + (RUN.length - RUN_TOP.i - 2) * fall;
  return (
    <>
      <Svg>
        {/* the top and today: dotted lines across the chart */}
        {topLine > 0.001 ? (
          <g opacity={old}>
            <line
              x1={RUN_LINE.topFrom}
              y1={yTop}
              x2={mix(RUN_LINE.topFrom, RUN_SIDE.bracket + 14, topLine)}
              y2={yTop}
              stroke={c.ink}
              strokeWidth={2.5}
              strokeDasharray={RUN_LINE.dash}
            />
          </g>
        ) : null}
        {nowLine > 0.001 ? (
          <line
            x1={RUN_LINE.nowFrom}
            y1={yNow}
            x2={mix(RUN_LINE.nowFrom, RUN_SIDE.bracket + 14, nowLine)}
            y2={yNow}
            stroke={c.ink}
            strokeWidth={2.5}
            strokeDasharray={RUN_LINE.dash}
          />
        ) : null}
        <CandleRun box={RUN_BOX} upto={upto} />
        {/* the last candle's close, marked */}
        <circle
          cx={xNow}
          cy={yNow}
          r={7}
          fill={c.cardBg}
          stroke={c.ink}
          strokeWidth={3}
          opacity={nowLine}
        />
        {/* the fall from the top, measured */}
        {/* the bracket drawn as one stroke with a trim path (Simon 18 Nov: "garis ini dikasih animasi trim path"): the top tick,
            down the side, the bottom tick */}
        {pct > 0.001 ? (
          <g opacity={old}>
            <Trace
              d={`M ${RUN_SIDE.bracket - 10} ${yTop} H ${RUN_SIDE.bracket + 10}`}
              p={unit(pct / 0.15)}
              tone={ink.crossRed}
              weight={3}
            />
            <Trace
              d={`M ${RUN_SIDE.bracket} ${yTop} V ${yNow}`}
              p={unit((pct - 0.15) / 0.7)}
              tone={ink.crossRed}
              weight={3}
            />
            <Trace
              d={`M ${RUN_SIDE.bracket - 10} ${yNow} H ${RUN_SIDE.bracket + 10}`}
              p={unit((pct - 0.85) / 0.15)}
              tone={ink.crossRed}
              weight={3}
            />
          </g>
        ) : null}
        {/* the business's value today: a dashed indigo line 50 px under today's price, drawn from the same "H" across to its
            name at the right (Simon 18 Nov: "buat garisnya 50px di bawah Harga sekarang … Label (?) nya gausah") */}
        {current > 0.001 ? (
          <line
            x1={RUN_LINE.nowFrom}
            y1={yNow + RUN_LINE.value}
            x2={mix(RUN_LINE.nowFrom, RUN_SIDE.valueLineTo, current)}
            y2={yNow + RUN_LINE.value}
            stroke={c.indigo}
            strokeWidth={2.5}
            strokeDasharray={RUN_LINE.dash}
          />
        ) : null}
      </Svg>
      <Text
        x={RUN_LABEL_X}
        y={yTop - 24 + (1 - topLine) * 10}
        size={30}
        weight={600}
        opacity={topLine * old}
      >
        Harga tertinggi
      </Text>
      <Text
        x={RUN_LABEL_X}
        y={yNow - 24 + (1 - nowLine) * 10}
        size={30}
        weight={600}
        opacity={nowLine}
      >
        Harga sekarang
      </Text>
      <Text
        x={RUN_SIDE.label}
        y={(yTop + yNow) / 2 + (1 - pct) * 10}
        size={55}
        weight={700}
        color={ink.crossRed}
        opacity={pct * old}
      >
        −50%
      </Text>
      <Text
        x={RUN_SIDE.value}
        y={yNow + RUN_LINE.value}
        size={30}
        weight={600}
        color={c.indigo}
        opacity={current}
      >
        Nilai bisnis saat ini
      </Text>
    </>
  );
}
/**
 * "Rasio rendah" (Simon 18 Nov: "gambar 1 remove aja, ganti dengan kalimat ringkasan … muncul bar chart … ambil bagian Company
 * Quality nya aja … reference fair value yang parameter di tengah, dibuat menurun", "Company qualitynya bisa kamu animasi fade
 * transition dari Best ke Good aja", then "gambar 1 ini gajadi geser kiri deh. Labanya tambah tahun dari 2024 … Company quality
 * dan reference fair value kasih border abu abu dan shadow. Jebakan nilai nya letakkan di luar kartu, di bawah kartu"):
 *  - "rasio valuasinya": one summary line in the card's middle (branch 1's style);
 *  - "Kalau laba": it fades out where it is ("gajadi geser kiri … juga harus fade out ya saat mulai ngomongin laba menurun"),
 *    and the row comes in, centred in the card: the "Laba" chart, 2024 · 2025 · 2026, each half the year before, its bars
 *    growing from 0 together on "turun";
 *  - "keunggulan bisnis": Tuntun's Company Quality (the BBCA card's column) on a card of its own (grey border, shadow), "Best"
 *    fading to "Good" on "melemah";
 *  - "dan nilai": its Reference Fair Value on the same kind of card, the figures counting down to half on "ikut menurun";
 *  - "Itu bisa menjadi": "Jebakan nilai" at the foot of the card, inside it (Simon 18 Nov: first "di luar kartu, di bawah
 *    kartu", then "di dalam kartu aja deh, di bagian bawah kartu"); the row rises as it comes so the two sit centred together.
 * The row centred in the card both ways (with "Jebakan nilai" under it, the pair).
 */
const TRAP = {
  sum: { size: 40 },
  trap: { size: 44, gap: 30 },
  /** chart → Company Quality, Company Quality → Fair Value: 60 and 40, then 50 more each (Simon 18 Nov: "Kasih jarak lagi antar
   * objek sebesar 50 px") */
  gap: 60 + 50,
  gapCards: 40 + 50,
  /** the app card at 2.5 px a unit, on a card 14 px round it */
  k: 2.5,
  pad: 14,
  chart: {
    barW: 70,
    barGap: 44,
    overhang: 22,
    full: 160,
    title: 34,
    titleTop: 20,
    titleGap: 42,
    label: 28,
    labelGap: 30,
    labelBottom: 16,
  },
};
const TRAP_CHART_W =
  3 * TRAP.chart.barW + 2 * TRAP.chart.barGap + 2 * TRAP.chart.overhang;
const TRAP_CHART_H =
  TRAP.chart.titleTop +
  TRAP.chart.titleGap +
  TRAP.chart.full +
  TRAP.chart.labelGap +
  TRAP.chart.labelBottom;
const TRAP_CQ = appPartSize(APP_PART.cq, TRAP.k);
const TRAP_FV = appPartSize(APP_PART.rfv, TRAP.k);
const TRAP_CARD_H = TRAP_CQ.h + 2 * TRAP.pad;
const TRAP_ROW_W =
  TRAP_CHART_W +
  TRAP.gap +
  TRAP_CQ.w +
  2 * TRAP.pad +
  TRAP.gapCards +
  TRAP_FV.w +
  2 * TRAP.pad;
const TRAP_Y = { row: panel.h / 2 };
const TRAP_X = {
  chart: (panel.w - TRAP_ROW_W) / 2 + TRAP_CHART_W / 2,
  cq: (panel.w - TRAP_ROW_W) / 2 + TRAP_CHART_W + TRAP.gap,
  fv:
    (panel.w - TRAP_ROW_W) / 2 +
    TRAP_CHART_W +
    TRAP.gap +
    TRAP_CQ.w +
    2 * TRAP.pad +
    TRAP.gapCards,
};
/** the chart's title, baseline and year labels, its height centred on the row */
const TRAP_TITLE_Y = TRAP_Y.row - TRAP_CHART_H / 2 + TRAP.chart.titleTop;
const TRAP_BASE = TRAP_TITLE_Y + TRAP.chart.titleGap + TRAP.chart.full;
const TRAP_YEARS = [
  { year: "2024", share: 1 },
  { year: "2025", share: 0.5 },
  { year: "2026", share: 0.25 },
] as const;
/** "Jebakan nilai" under the row, the two centred in the card: how far the row rises, where the name sits */
const TRAP_NAME_H = TRAP.trap.size * 1.15;
const TRAP_PAIR_TOP =
  (panel.h - (TRAP_CHART_H + TRAP.trap.gap + TRAP_NAME_H)) / 2;
const TRAP_RISE = TRAP_Y.row - (TRAP_PAIR_TOP + TRAP_CHART_H / 2);
const TRAP_NAME_Y =
  TRAP_PAIR_TOP + TRAP_CHART_H + TRAP.trap.gap + TRAP_NAME_H / 2;
function Trap() {
  const c = usePalette(),
    { f, m, W, on } = useBeat();
  const sumIn = on("rasio valuasinya", 0.6),
    sumOut = on("Kalau laba", 0.45);
  const chartIn = ease(f, W("Kalau laba") + m.sec(0.4), m.fade),
    grow = on("turun keunggulan", 0.8);
  const cqIn = on("keunggulan bisnis", 0.6),
    good = on("melemah", 0.8);
  const fvIn = on("dan nilai", 0.6),
    down = on("ikut menurun", 1.2);
  const trap = on("Itu bisa menjadi", 0.7);
  const ch = TRAP.chart;
  const barX = (i: number) => TRAP_X.chart + (i - 1) * (ch.barW + ch.barGap);
  const cardTop = TRAP_Y.row - TRAP_CARD_H / 2;
  return (
    <>
      <Text
        x={center}
        y={panel.h / 2}
        size={TRAP.sum.size}
        weight={700}
        color={c.indigo}
        opacity={sumIn * (1 - sumOut)}
      >
        Rasio makin rendah,
        <br />
        bisnis makin buruk
      </Text>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${(-TRAP_RISE * trap).toFixed(2)}px)`,
        }}
      >
        {/* "Laba": 2024, 2025, 2026, each half the year before, all growing from 0 at once */}
        <Text
          x={TRAP_X.chart}
          y={TRAP_TITLE_Y}
          size={ch.title}
          weight={700}
          opacity={chartIn}
        >
          Laba
        </Text>
        <Svg>
          <line
            x1={TRAP_X.chart - TRAP_CHART_W / 2}
            y1={TRAP_BASE}
            x2={TRAP_X.chart + TRAP_CHART_W / 2}
            y2={TRAP_BASE}
            stroke={c.ink}
            strokeWidth={2.5}
            opacity={chartIn}
          />
          {TRAP_YEARS.map(({ year, share }, i) => {
            const h = ch.full * share * grow;
            return h > 0.5 ? (
              <rect
                key={year}
                x={barX(i) - ch.barW / 2}
                y={TRAP_BASE - h}
                width={ch.barW}
                height={h}
                rx={Math.min(12, h / 2)}
                fill={c.indigo}
              />
            ) : null;
          })}
        </Svg>
        {TRAP_YEARS.map(({ year }, i) => (
          <Text
            key={year}
            x={barX(i)}
            y={TRAP_BASE + ch.labelGap}
            size={ch.label}
            opacity={chartIn}
          >
            {year}
          </Text>
        ))}
        <Card
          x={TRAP_X.cq}
          y={cardTop}
          w={TRAP_CQ.w + 2 * TRAP.pad}
          h={TRAP_CARD_H}
          line={ink.skeleton}
          style={{ opacity: cqIn }}
        >
          <CompanyQualityCut
            k={TRAP.k}
            x={TRAP.pad - 2}
            y={TRAP.pad - 2}
            good={good}
          />
        </Card>
        <Card
          x={TRAP_X.fv}
          y={cardTop}
          w={TRAP_FV.w + 2 * TRAP.pad}
          h={TRAP_CARD_H}
          line={ink.skeleton}
          style={{ opacity: fvIn }}
        >
          <FairValueCut
            k={TRAP.k}
            x={TRAP.pad - 2}
            y={TRAP.pad - 2}
            from={BBCA_FAIR_VALUE}
            to={[BBCA_FAIR_VALUE[0] / 2, BBCA_FAIR_VALUE[1] / 2]}
            p={down}
          />
        </Card>
      </div>
      <Text
        x={center}
        y={TRAP_NAME_Y + (1 - trap) * 10}
        size={TRAP.trap.size}
        weight={700}
        color={c.indigo}
        opacity={trap}
      >
        Jebakan nilai
      </Text>
    </>
  );
}
/**
 * "Dividen tinggi" (Simon 18 Nov: "Gambar 1 ganti jadi pake 2 screenshot ini", his BBCA screens in 01 Academy/VI03, Dividen.jpg
 * and Revenue.jpg, "bar chart dan tabelnya aja … Buy button bawah juga harus di crop out"): the two cut to their chart and table
 * (public/art/vi03/app/bbca-dividend.jpg, 26–1054 × 979–1901 of the screen, the same height as the revenue's; bbca-revenue.jpg, 26–1054 × 1012–1934: 10 px round the legend and the table), each on a
 * card with a grey border and a shadow like "Rasio rendah"'s. The dividend comes in on "imbal hasil", alone in the card's middle;
 * on "Kalau dividen" it steps left and the revenue comes in at its right. The pair centred across the card.
 * The card grows downward for this branch, its top where it is (Simon 18 Nov: "kartu saat dividen tinggi ditingkatkan heightnya
 * (height meningkat, anchor atas), lalu buat screenshotnya fit to height kartunya"): its foot 36 px over the subtitle band, so its shadow
 * stays out of it (DIV_CARD_H, in SC07), back to its height for "Beli dan simpan"; the screens fit that height, 20 px from its top and foot.
 */
const DIV_CARD_H = theme.captionBand.top - 36 - (panel.y + LAYOUT_DY);
const SHOTS = {
  dividend: { src: "art/vi03/app/bbca-dividend.jpg", w: 1028, h: 922 },
  revenue: { src: "art/vi03/app/bbca-revenue.jpg", w: 1028, h: 922 },
  margin: 20,
  gap: 60,
};
const SHOT_K = (DIV_CARD_H - 2 * SHOTS.margin) / SHOTS.revenue.h;
const SHOT_W = SHOTS.dividend.w * SHOT_K;
const SHOT_X = {
  alone: center - SHOT_W / 2,
  left: center - SHOT_W - SHOTS.gap / 2,
  right: center + SHOTS.gap / 2,
};
function AppShot({
  shot,
  x,
  opacity,
}: {
  shot: typeof SHOTS.dividend;
  x: number;
  opacity: number;
}) {
  const h = shot.h * SHOT_K;
  return opacity > 0.001 ? (
    <Card
      x={x}
      y={SHOTS.margin}
      w={SHOT_W}
      h={h}
      line={ink.skeleton}
      style={{ opacity, overflow: "hidden" }}
    >
      <Pic
        src={staticFile(shot.src)}
        style={{
          position: "absolute",
          left: -2,
          top: -2,
          width: SHOT_W,
          height: h,
        }}
      />
    </Card>
  ) : null;
}
/**
 * On "tahun depan" the dividend's 2026 column — its bar and 45.00, the year, and the table's 45.00 / −86.61% / −31.89% — gets a
 * rounded highlight box that blinks twice and stays (Simon 18 Nov: "yang dividen, kasih HL box rounded corner deh, kedip dulu 2x
 * lalu stay"). The column's ink measured on bbca-dividend.jpg: x 866–978, y 295–866; the box 20 px (of the screen) round it,
 * 10 px at the right where the table card ends.
 */
const DIV_2026 = { x1: 846, y1: 275, x2: 998, y2: 886 };
const BLINK = { step: 0.16, times: 2 };
function Dividend() {
  const { f, m, W, on } = useBeat();
  const dividend = on("imbal hasil", 0.6),
    shift = on("Kalau dividen", 0.85),
    revenue = ease(f, W("Kalau dividen") + m.sec(0.5), m.fade);
  /** on, off, on, off, then on to stay — hard steps, as a blink is */
  const t = f - W("tahun depan");
  const step = Math.floor(t / m.sec(BLINK.step));
  const hl = t < 0 ? 0 : step >= 2 * BLINK.times ? 1 : step % 2 === 0 ? 1 : 0;
  const x = mix(SHOT_X.alone, SHOT_X.left, shift);
  return (
    <>
      <AppShot shot={SHOTS.dividend} x={x} opacity={dividend} />
      <AppShot shot={SHOTS.revenue} x={SHOT_X.right} opacity={revenue} />
      <HighlightBox
        rect={{
          x1: x + DIV_2026.x1 * SHOT_K,
          y1: SHOTS.margin + DIV_2026.y1 * SHOT_K,
          x2: x + DIV_2026.x2 * SHOT_K,
          y2: SHOTS.margin + DIV_2026.y2 * SHOT_K,
        }}
        opacity={hl}
        fill="none"
        width={4}
        radius={16}
      />
    </>
  );
}

const prices = BBCA_WEEKLY.filter(
  ([day]) => day >= BBCA_MARKS.high.date && day <= BBCA_MARKS.eval.date,
);
const px = (i: number) => 585 + (760 * i) / (prices.length - 1);
const py = (value: number) => 318 - ((value - 4000) / 8000) * 220;
const tape = prices
  .map(([, v], i) => `${i ? "L" : "M"}${px(i)} ${py(v)}`)
  .join(" ");
/**
 * "Beli dan simpan" opens straight on Tuntun's Company Quality card (Simon 18 Nov: "Gambar 3 langsung ke kartu Company Quality
 * aja" — no bank icon, no "Perusahaan bagus"): the BBCA card's column, large in the card's middle; on "lalu simpan" it steps left
 * to its place, still centred in the card's height; on "membeli BBCA" the logo and the code come in over it as it moves down to
 * its old spot (top 250).
 */
/** its card (Simon 18 Nov: "ilusi ke5, kasih border dan shadow ya"): 14 px round the cut at Rasio rendah's 2.5 px a unit, in
 * step with the cut's size; the logo and the code 12 px higher than before, to leave room over it */
const HOLD_CQ = { big: 3.4, k: 2.05, top: 258, pad: 14 / 2.5 };
function Hold() {
  const c = usePalette(),
    { f, m, W, on } = useBeat();
  /** the card moves down first, then the logo and the code come in over it (so the code never crosses the moving card) */
  const dock = on("lalu simpan", 1),
    bank = on("membeli BBCA", 0.5),
    brand = ease(f, W("membeli BBCA") + m.sec(0.4), m.fade),
    draw = on("Rp11.000", 2.45);
  const cx = mix(center, 283, dock),
    kq = mix(HOLD_CQ.big, HOLD_CQ.k, dock),
    q = appPartSize(APP_PART.cq, kq),
    idx = draw * (prices.length - 1),
    a = Math.min(Math.floor(idx), prices.length - 2),
    y = py(mix(prices[a][1], prices[a + 1][1], idx - a));
  return (
    <>
      <Card
        x={cx - q.w / 2 - HOLD_CQ.pad * kq}
        y={mix((panel.h - q.h) / 2, HOLD_CQ.top, bank) - HOLD_CQ.pad * kq}
        w={q.w + 2 * HOLD_CQ.pad * kq}
        h={q.h + 2 * HOLD_CQ.pad * kq}
        line={ink.skeleton}
      >
        <CompanyQualityCut
          k={kq}
          x={HOLD_CQ.pad * kq - 2}
          y={HOLD_CQ.pad * kq - 2}
        />
      </Card>
      <Pic
        src={staticFile("art/vi03/app/bbca-logo.png")}
        style={{
          position: "absolute",
          left: cx - 42,
          top: 66,
          width: 84,
          height: 84,
          opacity: brand,
        }}
      />
      <Text x={cx} y={190} size={49} weight={700} opacity={brand}>
        BBCA
      </Text>
      <Svg>
        <defs>
          <clipPath id="sc07-tape">
            <rect
              x={px(0) - 3}
              y={55}
              width={px(idx) - px(0) + 6}
              height={290}
            />
          </clipPath>
        </defs>
        <path
          d={`M ${px(0)} 337 H ${mix(px(0), px(prices.length - 1), dock)}`}
          stroke={ink.mute}
          strokeWidth={3}
          opacity={dock}
        />
        <g opacity={unit(draw * 12)}>
          <path
            d={tape}
            clipPath="url(#sc07-tape)"
            stroke={c.indigo}
            strokeWidth={5}
          />
          <path
            d={`M ${px(0)} ${py(prices[0][1])} V 337`}
            stroke={ink.mute}
            strokeWidth={2}
            strokeDasharray="6 8"
          />
          <circle
            cx={px(0)}
            cy={py(prices[0][1])}
            r={10}
            fill={c.cardBg}
            stroke={c.indigo}
            strokeWidth={4}
          />
          <circle cx={px(idx)} cy={y} r={8} fill={c.indigo} />
        </g>
      </Svg>
      <Text x={965} y={385} opacity={dock * (1 - bank)} size={34}>
        Jangka panjang
      </Text>
      <Text
        x={px(0)}
        y={py(prices[0][1]) - 43}
        color={c.indigo}
        opacity={unit(draw * 9)}
      >
        10.950
      </Text>
      <Text
        x={px(prices.length - 1)}
        y={py(prices[prices.length - 1][1]) - 64}
        color={c.indigo}
        opacity={unit(draw * 6 - 5)}
      >
        5.500
      </Text>
      <Text x={px(0)} y={384} size={28} opacity={unit(draw * 9)}>
        23 Sep 2024
      </Text>
      <Text
        x={px(prices.length - 1)}
        y={384}
        size={28}
        opacity={unit(draw * 6 - 5)}
      >
        13 Nov 2026
      </Text>
    </>
  );
}
const views = [Business, Price, Trap, Dividend, Hold];
function branchPath(x: number) {
  const offset = x - mid,
    gap = Math.min(25, Math.abs(offset) / 2),
    dir = Math.sign(offset);
  return `M ${mid} 161 V ${192 - gap} Q ${mid} 192 ${mid + dir * gap} 192 H ${x - dir * gap} Q ${x} 192 ${x} ${192 + gap} V 218`;
}
export function SC07() {
  const c = usePalette(),
    { f, m, W, on } = useBeat();
  const times = branches.map(([phrase]) => W(phrase));
  const opens = times.map((t, i) =>
    ease(f, i === 4 ? W("kelima") : t, m.sec(0.55)),
  );
  const dock = ease(f, times[0] - m.move, m.move),
    rootY = mix(460, 109, dock);
  const mapOffset = rootY - 109;
  const spacing = 310,
    nodeY = 255 + mapOffset;
  const narrow =
    ease(f, times[1], m.sec(0.6)) * (1 - ease(f, times[2] - m.fade, m.fade));
  const cardW = mix(panel.w, PRICE_CARD_W, narrow);
  /** taller for "Dividen tinggi": from "Keempat" (once "Rasio rendah" has gone), back as the screens fade out */
  const tall =
    ease(f, times[3], m.sec(0.6)) * (1 - ease(f, times[4] - m.fade, m.fade));
  const cardH = mix(panel.h, DIV_CARD_H, tall);
  const nodes = branches.map(([, label], i) => ({
    label,
    x: mid + (i - (branches.length - 1) / 2) * spacing,
    p: opens[i],
    lit: opens[i] * (1 - (opens[i + 1] ?? 0)),
  }));
  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage: `linear-gradient(to bottom,${c.ink} ${theme.captionBand.top - 70}px,transparent ${theme.captionBand.top}px)`,
        }}
      >
        <SoftGround f={f + BLOCK.SC07} />
        <BoardGrid g={f + BLOCK.SC07} on={1} />
      </div>
      {/* everything over the background, 60 px lower: the white space above the title and under the card even within the safe
          area (title top 74 → 134, card foot 833 → 893, 80 px each from 54 and 972; Simon 18 Nov: "di geser turun deh, biar balance
          white space atas dan bawahnya"). The closing line is gone ("remove aja"). */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${LAYOUT_DY}px)`,
        }}
      >
        <Text
          x={mid}
          y={rootY}
          size={mix(106, 64, dock)}
          color={c.indigo}
          weight={700}
          opacity={on("Ada lima", 0.52)}
        >
          Lima ilusi murah
        </Text>
        <Svg full>
          {nodes.map(({ x }, i) => {
            return (
              <g key={i} transform={`translate(0 ${mapOffset})`}>
                <Trace d={branchPath(x)} p={1} tone={ink.mute} weight={2} />
              </g>
            );
          })}
          {nodes.map(({ x, p, lit }, i) => {
            return (
              <g key={i} opacity={lit}>
                <Trace d={branchPath(x)} p={p} tone={c.indigo} />
                <Trace d={`M ${x} 289 V ${panel.y}`} p={p} tone={c.indigo} />
              </g>
            );
          })}
        </Svg>
        {nodes.map(({ label, x, p, lit }, i) => (
          <div key={label} style={{ position: "absolute", inset: 0 }}>
            <Card
              x={x - 143}
              y={nodeY - 36}
              w={286}
              h={72}
              style={{
                background: interpolateColors(
                  lit,
                  [0, 1],
                  [c.cardBg, c.indigo],
                ),
                boxShadow: `inset 0 0 0 2px ${interpolateColors(lit, [0, 1], [ink.skeleton, c.indigo])}`,
              }}
            />
            <Text
              x={x}
              y={nodeY}
              size={30}
              color={interpolateColors(lit, [0, 1], [c.slate, c.cardBg])}
            >
              <span style={{ opacity: Math.abs(1 - 2 * p) }}>
                {p < 0.5 ? i + 1 : label}
              </span>
            </Text>
          </div>
        ))}
        {/* the card narrows round "Harga turun" (after "Cerita bisnis" has gone) and is back to full width as "Rasio rendah"
          comes in (Simon 18 Nov) */}
        <Card
          x={mid - cardW / 2}
          y={panel.y}
          w={cardW}
          h={cardH}
          style={{ opacity: opens[0] }}
        />
        {views.map((View, i) => {
          const t = times[i],
            next = times[i + 1];
          const p =
            ease(f, t, m.fade) *
            (next === undefined ? 1 : 1 - ease(f, next - m.fade, m.fade));
          return p > 0 ? (
            <div
              key={t}
              style={{
                position: "absolute",
                left: panel.x,
                top: panel.y + mix(12, 0, p),
                width: panel.w,
                height: panel.h,
                opacity: p,
              }}
            >
              <View />
            </div>
          ) : null;
        })}
      </div>
    </Stage>
  );
}
