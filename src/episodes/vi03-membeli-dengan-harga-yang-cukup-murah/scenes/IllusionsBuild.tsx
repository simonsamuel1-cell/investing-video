/** VI03 SC07 v3. The before/after poses are in docs/vi-style/storyboards/VI03-SC07-v3.svg. */
import {
  CardE as Card,
  FigureE as Figure,
  PicE as Pic,
} from "../../../editable";
import type { ReactNode } from "react";
import { interpolateColors, staticFile, useCurrentFrame } from "remotion";
import {
  SoftGround,
  Stage,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
} from "../../../core";
import { BBCA_MARKS, BBCA_WEEKLY } from "../data/bbca";
import { BLOCK } from "../data/timing";
import { BoardGrid, KAMU_FULL, ease, useWords } from "../components/kit";

const { width, height } = theme.canvas;
const mid = width / 2;
/** Match the story frame Simon directed in IbuSariSendiri (SC03). */
const stageBox = {
  x: (width - 1600) / 2,
  y: (height - 700) / 2,
  w: 1600,
  h: 700,
};
const person = { h: 345, labelGap: 47 };
const personWidth = (person.h * KAMU_FULL.w) / KAMU_FULL.h;
const starts = [
  "Pertama",
  "Kedua",
  "Ketiga",
  "Keempat",
  "Dan yang kelima",
] as const;
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

const useClock = () => {
  const frame = useCurrentFrame();
  const motion = useMotion();
  const word = useWords(7, BLOCK.SC07);
  const move = (phrase: string, seconds = 0.72) =>
    ease(frame, word(phrase), motion.sec(seconds));
  return { frame, motion, word, move };
};

const Label = ({
  x,
  y,
  size = 36,
  weight = 600,
  opacity = 1,
  color,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  weight?: number;
  opacity?: number;
  color?: string;
  children: ReactNode;
}) => {
  const c = usePalette();
  return (
    <div
      style={{
        ...typeStyle("title"),
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        whiteSpace: "nowrap",
        color: color ?? c.ink,
        fontSize: size,
        fontWeight: weight,
        opacity,
      }}
    >
      {children}
    </div>
  );
};

const Vectors = ({ children }: { children: ReactNode }) => (
  <svg
    width={width}
    height={height}
    style={{ position: "absolute", inset: 0 }}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

/** The same rail and price knob carry from the business story into the price drop. */
const PriceComparison = () => {
  const c = usePalette();
  const { move } = useClock();
  const story = move("Karena bisnisnya", 0.95);
  const pull = move("Harga berapa", 0.85);
  const correct = move("Padahal", 0.67);
  const second = move("Kedua", 0.78);
  const fall = move("sudah turun", 1.42);
  const showDrop = move("turun 50%", 0.38);
  const compare = move("Tapi harga sekarang", 0.9);
  const fadeDrop = Math.min(1, compare * 4);
  const switchLeg = Math.min(1, Math.max(0, (compare - 0.25) / 0.55));
  const valueLeg = Math.max(0, (compare - 0.28) / 0.72);
  const peak = 1415;
  const priceX = mix(mix(1200, 1440, pull), mix(peak, 665, fall), second);
  const railY = mix(535, 515, second);
  const railL = mix(995, 410, second);
  const railR = 1535;
  const storeX = mix(1110, 625, story);
  const personX = mix(640, 350, story);
  const storeFloor = mix(720, 685, story);
  const storeH = mix(365, 350, story);
  const railIn = Math.max(0, (story - 0.7) / 0.3);
  const storyRail = railIn * (1 - second);
  const firstValue = correct * (1 - second);
  const peakShown = second * Math.max(0, Math.min(1, (fall - 0.46) * 4));
  const bracketX = mix(peak, priceX, switchLeg);
  const valueBox = { x: 915, y: 674, w: 480, h: 116 };
  const boxCy = valueBox.y + valueBox.h / 2;
  const priceLabelY = railY + 58;

  return (
    <>
      <Pic
        src={staticFile(KAMU_FULL.src)}
        style={{
          position: "absolute",
          left: personX - personWidth / 2,
          top: storeFloor - person.h,
          width: personWidth,
          height: person.h,
          transform: "scaleX(-1)",
          opacity: 1 - second,
        }}
      />
      <Label
        x={personX}
        y={storeFloor + person.labelGap}
        size={34}
        weight={500}
        opacity={1 - second}
      >
        Kamu
      </Label>
      <Figure
        name="warung"
        cx={storeX}
        floor={storeFloor}
        h={storeH}
        faint={correct * 0.55}
        style={{ opacity: 1 - second }}
      />
      <Label
        x={storeX}
        y={storeFloor + person.labelGap}
        size={34}
        weight={500}
        opacity={1 - second}
      >
        Cerita bisnis
      </Label>
      <Vectors>
        <line
          x1={railL}
          x2={railR}
          y1={railY}
          y2={railY}
          stroke={theme.color.skeleton}
          strokeWidth={10}
          opacity={Math.max(storyRail, second)}
        />
        <line
          x1={995}
          x2={priceX}
          y1={railY}
          y2={railY}
          stroke={c.indigo}
          strokeWidth={6}
          opacity={storyRail * (1 - correct)}
        />
        <path
          d={`M 1080 485 V 452 H ${priceX} V 485`}
          pathLength={1}
          stroke={c.indigo}
          strokeWidth={4}
          strokeDasharray="1 1"
          strokeDashoffset={1 - correct}
          opacity={firstValue}
        />
        <circle
          cx={1080}
          cy={railY}
          r={13}
          fill={c.cardBg}
          stroke={c.indigo}
          strokeWidth={4}
          opacity={firstValue}
        />
        <path
          d={`M ${priceX} 451 V 389 H ${bracketX} V 451`}
          stroke={c.indigo}
          strokeWidth={4}
          opacity={second * fall * (1 - compare)}
        />
        <circle
          cx={peak}
          cy={railY}
          r={13}
          fill={c.cardBg}
          stroke={theme.color.mute}
          strokeWidth={4}
          opacity={peakShown}
        />
        <path
          d={`M ${priceX} ${priceLabelY + 45} V ${boxCy - 20} Q ${priceX} ${boxCy} ${priceX + 20} ${boxCy} H ${valueBox.x}`}
          pathLength={1}
          stroke={c.indigo}
          strokeWidth={4}
          strokeDasharray="1 1"
          strokeDashoffset={1 - valueLeg}
          opacity={valueLeg}
        />
        <circle
          cx={priceX}
          cy={railY}
          r={21}
          fill={c.indigo}
          stroke={c.cardBg}
          strokeWidth={5}
          opacity={Math.max(storyRail, second)}
        />
      </Vectors>
      <Label
        x={1080}
        y={priceLabelY}
        opacity={firstValue}
        size={39}
        color={c.indigo}
      >
        Nilai bisnis
      </Label>
      <Label
        x={priceX}
        y={priceLabelY}
        size={41}
        opacity={railIn * Math.max(0, 1 - second * 2)}
      >
        Harga
      </Label>
      <Label
        x={priceX}
        y={priceLabelY}
        size={41}
        opacity={Math.max(0, second * 2 - 1)}
      >
        Harga sekarang
      </Label>
      <Label x={peak} y={priceLabelY} opacity={peakShown} color={c.slate}>
        Harga puncak
      </Label>
      <Label
        x={(priceX + bracketX) / 2}
        y={335}
        size={78}
        weight={700}
        color={theme.color.crossRed}
        opacity={second * showDrop * (1 - fadeDrop)}
      >
        −50%
      </Label>
      <Card
        {...valueBox}
        style={{ opacity: valueLeg, background: theme.color.indigoWashSolid }}
      />
      <Label
        x={valueBox.x + valueBox.w / 2}
        y={boxCy}
        opacity={valueLeg}
        size={40}
        color={c.indigo}
      >
        Nilai bisnis saat ini
      </Label>
    </>
  );
};

const Metric = ({
  x,
  y,
  w,
  label,
  level,
  opacity = 1,
  muted = 0,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  level: number;
  opacity?: number;
  muted?: number;
}) => {
  const c = usePalette();
  const fill = interpolateColors(muted, [0, 1], [c.indigo, c.slate]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity }}>
      <div
        style={{
          ...typeStyle("title"),
          color: c.ink,
          fontSize: 37,
          fontWeight: 600,
          marginBottom: 23,
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: 24,
          width: w,
          borderRadius: 999,
          background: theme.color.skeleton,
        }}
      >
        <div
          style={{
            height: "100%",
            width: w * level,
            borderRadius: 999,
            background: fill,
          }}
        />
      </div>
    </div>
  );
};

/** Conceptual levels, without numeric axes or quantitative claims. */
const ValueTrap = () => {
  const c = usePalette();
  const { move } = useClock();
  const ratio = move("semakin rendah", 0.85);
  const shift = move("tapi bisnisnya", 0.84);
  const profit = move("laba terus", 0.52);
  const edge = move("keunggulan bisnis", 0.48);
  const fallProfit = move("turun keunggulan bisnis", 0.8);
  const fallEdge = move("melemah", 0.9);
  const link = move("dan nilai", 0.85);
  const loss = move("ikut menurun", 1.0);
  const trap = move("Itu bisa menjadi", 0.5);
  const ratioBox = {
    x: mix(mid - 260, 303, shift),
    y: mix(480, 429, shift),
    w: mix(520, 435, shift),
  };
  const right = 1005;
  const spine = 932;
  const bend = 24;
  const rows = { profit: 337, edge: 486, value: 636 };
  const barCenter = 78;
  const join = rows.edge + barCenter + bend;
  return (
    <>
      <Card
        x={ratioBox.x - 40}
        y={ratioBox.y - 44}
        w={ratioBox.w + 80}
        h={170}
        line={interpolateColors(
          shift,
          [0, 1],
          [c.indigo, theme.color.skeleton],
        )}
      />
      <Card
        x={right - 30}
        y={304}
        w={642}
        h={146 + edge * 149 + link * 174}
        style={{ opacity: profit }}
      />
      <Metric
        {...ratioBox}
        label="Rasio valuasi"
        level={mix(1, 0.46, ratio)}
        muted={shift}
      />
      <Vectors>
        <path
          d={`M ${right + 5} ${rows.profit + barCenter} H ${spine + bend}
            Q ${spine} ${rows.profit + barCenter} ${spine} ${rows.profit + barCenter + bend}
            V ${join}`}
          pathLength={1}
          stroke={c.cyan}
          strokeWidth={5}
          strokeDasharray="1 1"
          strokeDashoffset={1 - fallProfit}
          opacity={fallProfit}
        />
        <path
          d={`M ${right + 5} ${rows.edge + barCenter} H ${spine + bend}
            Q ${spine} ${rows.edge + barCenter} ${spine} ${join}`}
          pathLength={1}
          stroke={c.cyan}
          strokeWidth={5}
          strokeDasharray="1 1"
          strokeDashoffset={1 - fallEdge}
          opacity={fallEdge}
        />
        <path
          d={`M ${spine} ${join} V ${rows.value + barCenter - bend}
            Q ${spine} ${rows.value + barCenter} ${spine + bend} ${rows.value + barCenter}
            H ${right + 5}`}
          pathLength={1}
          stroke={c.cyan}
          strokeWidth={5}
          strokeDasharray="1 1"
          strokeDashoffset={1 - link}
          opacity={link}
        />
      </Vectors>
      <Metric
        x={right}
        y={rows.profit}
        w={579}
        label="Laba"
        opacity={profit}
        level={mix(1, 0.55, fallProfit)}
      />
      <Metric
        x={right}
        y={rows.edge}
        w={579}
        label="Keunggulan bisnis"
        opacity={edge}
        level={mix(1, 0.7, fallEdge)}
      />
      <Metric
        x={right}
        y={rows.value}
        w={579}
        label="Nilai bisnis"
        opacity={link}
        level={mix(1, 0.42, loss)}
      />
      <Label
        x={mid}
        y={826}
        size={58}
        color={c.indigo}
        weight={700}
        opacity={trap}
      >
        Jebakan nilai
      </Label>
    </>
  );
};

const DividendCycle = () => {
  const c = usePalette();
  const { move } = useClock();
  const dock = move("Kalau dividen", 0.8);
  const cycle = move("laba saat", 1.42);
  const peak = move("di puncak", 0.54);
  const next = move("tahun depan", 0.64);
  const cx = mix(mid, 660, dock);
  const cy = mix(530, 696, dock);
  const w = mix(555, 422, dock);
  const h = mix(184, 132, dock);
  const peakY = 365;
  const future = { x: 1090, y: cy - h / 2, w: 386, h };
  const flowY = mix(peakY, cy - h / 2, peak);

  return (
    <>
      <Vectors>
        {/* One schematic rise to the peak. The drawing does not project a future payout. */}
        <path
          d={`M 325 548 C 500 548 500 ${peakY} 660 ${peakY}`}
          stroke={c.indigo}
          strokeWidth={7}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - cycle}
          opacity={cycle}
        />
        <line
          x1={660}
          y1={peakY}
          x2={660}
          y2={flowY}
          stroke={c.cyan}
          strokeWidth={5}
          opacity={peak}
        />
        <circle
          cx={660}
          cy={peakY}
          r={13}
          fill={c.cardBg}
          stroke={c.indigo}
          strokeWidth={5}
          opacity={peak}
        />
        <circle
          cx={660}
          cy={flowY}
          r={10}
          fill={c.cyan}
          opacity={peak * (1 - peak) * 4}
        />
        <path
          d={`M ${cx + w / 2} ${cy} H ${mix(cx + w / 2, future.x, next)}`}
          stroke={c.slate}
          strokeWidth={4}
          strokeDasharray="9 13"
          opacity={next}
        />
      </Vectors>
      <Label x={360} y={495} size={34} opacity={cycle}>
        Laba
      </Label>
      <Label x={845} y={peakY} size={35} opacity={peak} color={c.indigo}>
        Puncak siklus
      </Label>
      <Card
        x={cx - w / 2}
        y={cy - h / 2}
        w={w}
        h={h}
        style={{ background: c.indigo }}
      />
      <Label
        x={cx}
        y={cy}
        size={mix(57, 42, dock)}
        color={c.cardBg}
        weight={700}
      >
        Dividen hari ini
      </Label>
      <Card {...future} dashed line={c.slate} style={{ opacity: next }} />
      <Label
        x={future.x + future.w / 2}
        y={future.y - 41}
        opacity={next}
        size={36}
      >
        Tahun depan
      </Label>
      <Label
        x={future.x + future.w / 2}
        y={cy}
        opacity={next}
        size={70}
        color={c.indigo}
        weight={700}
      >
        ?
      </Label>
    </>
  );
};

/** The same closes and exact purchase day shown in SC05. Prices only on this chart. */
const closes = BBCA_WEEKLY.filter(
  ([day]) => day >= BBCA_MARKS.high.date && day <= BBCA_MARKS.eval.date,
);
const plot = { x: 842, y: 408, w: 713, h: 269, lo: 4000, hi: 12000 };
const px = (idx: number) => plot.x + (idx / (closes.length - 1)) * plot.w;
const py = (price: number) =>
  plot.y + (1 - (price - plot.lo) / (plot.hi - plot.lo)) * plot.h;
const curve = closes
  .map(([, price], i) => `${i ? "L" : "M"} ${px(i)} ${py(price)}`)
  .join(" ");
const format = (p: number) => p.toLocaleString("id-ID");

const GoodCompany = () => {
  const c = usePalette();
  const { move } = useClock();
  const company = move("Dan yang kelima", 0.62);
  const quality = move("perusahaannya sangat", 0.62);
  const dock = move("lalu simpan", 0.95);
  const ticker = move("membeli BBCA", 0.6);
  const chartCard = move("Rp11.000", 0.52);
  const draw = move("Rp11.000", 1.92);
  const lesson = move("Tapi perusahaan bagus", 0.64);
  const cx = mix(mid, 520, dock);
  const cy = 535;
  const w = mix(542, 377, dock);
  const p0 = BBCA_MARKS.high.close;
  const p1 = BBCA_MARKS.eval.close;
  const edgeX = mix(plot.x, plot.x + plot.w, draw);
  const idx = Math.min(
    closes.length - 2,
    Math.floor(draw * (closes.length - 1)),
  );
  const price = mix(
    closes[idx][1],
    closes[idx + 1][1],
    draw * (closes.length - 1) - idx,
  );
  const edgeY = py(price);

  return (
    <>
      <Card x={754} y={322} w={917} h={462} style={{ opacity: chartCard }} />
      <Card
        x={cx - w / 2}
        y={cy - 131}
        w={w}
        h={262}
        style={{ opacity: company }}
      />
      <Label
        x={cx}
        y={cy}
        size={mix(52, 38, dock)}
        weight={700}
        color={c.indigo}
        opacity={company * (1 - ticker)}
      >
        Perusahaan<span style={{ opacity: quality }}> bagus</span>
      </Label>
      <Pic
        src={staticFile("art/vi03/app/bbca-logo.png")}
        style={{
          position: "absolute",
          left: cx - 112,
          top: cy - 77,
          width: 65,
          height: 65,
          opacity: ticker,
        }}
      />
      <Label
        x={cx + 27}
        y={cy - 44}
        size={49}
        color={c.indigo}
        weight={700}
        opacity={ticker}
      >
        BBCA
      </Label>
      <Label x={cx} y={cy + 50} size={28} opacity={ticker}>
        Company Quality{" "}
        <span style={{ color: c.indigo, fontWeight: 700 }}>Best</span>
      </Label>
      <Vectors>
        <defs>
          <clipPath id="sc07-bbca-draw">
            <rect
              x={plot.x - 4}
              y={plot.y - 12}
              width={edgeX - plot.x + 8}
              height={plot.h + 24}
            />
          </clipPath>
        </defs>
        <line
          x1={plot.x}
          y1={plot.y + plot.h}
          x2={mix(plot.x, plot.x + plot.w, dock)}
          y2={plot.y + plot.h}
          stroke={theme.color.mute}
          strokeWidth={3}
          opacity={dock}
        />
        <line
          x1={plot.x}
          y1={py(p0)}
          x2={plot.x}
          y2={plot.y + plot.h}
          stroke={theme.color.mute}
          strokeWidth={3}
          strokeDasharray="7 9"
          opacity={Math.min(1, draw * 20)}
        />
        <path
          d={curve}
          stroke={c.indigo}
          strokeWidth={5}
          clipPath="url(#sc07-bbca-draw)"
          opacity={Math.min(1, draw * 20)}
        />
        <circle
          cx={plot.x}
          cy={py(p0)}
          r={11}
          fill={c.cardBg}
          stroke={c.indigo}
          strokeWidth={4}
          opacity={Math.min(1, draw * 15)}
        />
        <circle
          cx={edgeX}
          cy={edgeY}
          r={9}
          fill={c.indigo}
          opacity={Math.min(1, draw * 12)}
        />
      </Vectors>
      <Label
        x={plot.x + plot.w / 2}
        y={plot.y + plot.h + 56}
        size={35}
        opacity={dock * (1 - ticker)}
        color={c.slate}
      >
        Jangka panjang
      </Label>
      <Label
        x={plot.x}
        y={py(p0) - 45}
        size={42}
        weight={700}
        opacity={Math.min(1, draw * 8)}
        color={c.indigo}
      >
        {format(p0)}
      </Label>
      <Label
        x={plot.x + plot.w}
        y={py(p1) - 65}
        size={42}
        weight={700}
        opacity={Math.max(0, draw * 5 - 4)}
        color={c.indigo}
      >
        {format(p1)}
      </Label>
      <Label
        x={plot.x}
        y={plot.y + plot.h + 56}
        size={29}
        opacity={Math.min(1, draw * 8)}
      >
        23 Sep 2024
      </Label>
      <Label
        x={plot.x + plot.w}
        y={plot.y + plot.h + 56}
        size={29}
        opacity={Math.max(0, draw * 4 - 3)}
      >
        13 Nov 2026
      </Label>
      <Label
        x={mid}
        y={831}
        size={51}
        color={c.indigo}
        weight={700}
        opacity={lesson}
      >
        Perusahaan bagus juga harus dibeli cukup murah
      </Label>
    </>
  );
};

export const SC07 = () => {
  const c = usePalette();
  const shadow = useShadow();
  const { frame, motion, word } = useClock();
  const beats = starts.map((phrase) => word(phrase));
  // Keep the fifth point until the inter-scene cut. Each subject settles within the same stage.
  const worlds = [
    { from: beats[0], until: beats[2], Visual: PriceComparison },
    { from: beats[2], until: beats[3], Visual: ValueTrap },
    { from: beats[3], until: beats[4], Visual: DividendCycle },
    { from: beats[4], until: undefined, Visual: GoodCompany },
  ];
  const dock = ease(frame, beats[0] - motion.move, motion.move);
  const active = beats.filter((at) => frame >= at).length - 1;
  const globalFrame = frame + BLOCK.SC07;

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage: `linear-gradient(to bottom, ${c.ink} ${theme.captionBand.top - 70}px, transparent ${theme.captionBand.top}px)`,
        }}
      >
        <SoftGround f={globalFrame} />
        <BoardGrid g={globalFrame} on={1} />
      </div>
      <Card
        {...stageBox}
        style={{
          boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.ink}`,
          opacity: dock,
        }}
      />
      <Label
        x={mid}
        y={mix(462, 112, dock)}
        size={mix(108, 64, dock)}
        color={c.indigo}
        weight={700}
        opacity={ease(frame, word("Ada lima"), motion.reveal)}
      >
        Lima ilusi murah
      </Label>
      {beats.map((at, i) => {
        const reveal = ease(
          frame,
          word("lima ilusi") + i * motion.sec(0.11),
          motion.reveal,
        );
        const selected =
          ease(frame, at, motion.sec(0.45)) *
          (i < beats.length - 1
            ? 1 - ease(frame, beats[i + 1], motion.sec(0.45))
            : 1);
        const d = mix(62, 42, dock) + selected * 8;
        return (
          <div
            key={at}
            style={{
              position: "absolute",
              left: mid + (i - 2) * mix(117, 73, dock) - d / 2,
              top: mix(588, 246, dock) - d / 2,
              width: d,
              height: d,
              display: "grid",
              placeItems: "center",
              opacity: reveal,
              borderRadius: "50%",
              ...typeStyle("title"),
              fontSize: mix(36, 24, dock),
              fontWeight: 700,
              background: interpolateColors(
                selected,
                [0, 1],
                [theme.color.indigoWashStrongSolid, c.indigo],
              ),
              color: interpolateColors(
                selected,
                [0, 1],
                [i < active ? c.slate : c.indigo, c.cardBg],
              ),
            }}
          >
            {i + 1}
          </div>
        );
      })}
      {worlds.map(({ from, until, Visual }) => {
        const p =
          ease(frame, from, motion.fade) *
          (until === undefined
            ? 1
            : 1 - ease(frame, until - motion.fade, motion.fade));
        return p > 0 ? (
          <div
            key={from}
            style={{ position: "absolute", inset: 0, opacity: p }}
          >
            <Visual />
          </div>
        ) : null;
      })}
    </Stage>
  );
};
