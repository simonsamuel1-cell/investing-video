/**
 * VI03 · SC02 v3 — "Pilar Kedua: Beli Cukup Murah" in VI01/VI02's own language (Simon 16 Nov: "Coba pelajarin dulu deh dari
 * VI01-VI02"): ONE layout that builds sentence by sentence — no camera cuts, nothing giant — with VI01's numbered heading, its
 * columns, its cash book and price card, and its "Harga vs Value" chart. Storyboard: docs/vi-style/storyboards/VI03-SC02-v3.png.
 * Earlier builds: SecondPillar.tsx (one Shot per sentence), SecondPillarFlow.tsx (one camera take); switch SC02_LOOK.
 *
 *  A  "Pilar kedua": VI02 SC02's four columns under "Value Investing"; "Beli murah" stays lit and lifts, the rest go grey.
 *  B  "Warren Buffett menulis": the columns step back and "Beli murah" travels up to the heading "② Beli murah"; Buffett's tile
 *     and his sentence on one line in TA09's quote card, centred vertically (no source pill, no cyan: Simon 16 Nov).
 *  C  "Harga adalah yang kamu bayar": the first sentence is underlined, "Harga adalah yang dibayar" under it in smaller type;
 *     "Value adalah yang kamu dapatkan": the second, "Value adalah yang didapat" (Simon 16 Nov — the Harga / Value cards under
 *     the quote were removed).
 *  D  "Jadi saham Rp5.000": the quote clears, and two "Harga vs Value" charts come in (VI01's picture of price swinging round
 *     value): Rp5.000 with its price above value — belum tentu murah; Rp50.000 with its price below — belum tentu mahal.
 *  E  "Murah hanya punya satu arti": the Rp50.000 card grows into the frame, centred; the other simply goes (Simon 16 Nov: "yang
 *     kiri hilang aja"); its value line becomes "Harga wajar", the gap down to the price is shaded (no bracket, no "Murah" pill: Simon 16 Nov), and
 *     one summary line sits under the chart: "Murah: harga jelas di bawah harga wajar" (Simon 16 Nov; the cash book was
 *     removed).
 *
 * The price lines are shapes (no figures but the VO's own two prices); no source tag.
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import {
  Line,
  QuoteCard,
  SoftGround,
  Stage,
  Words,
  quoteListY,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
} from "../../../core";
import { BLOCK } from "../data/timing";
import {
  BoardGrid,
  Card,
  Column,
  HEADING,
  Line as Statement,
  NumRing,
  PhotoTile,
  ease,
  useWords,
} from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
type Box = { x: number; y: number; w: number; h: number };
const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: mix(a.x, b.x, t),
  y: mix(a.y, b.y, t),
  w: mix(a.w, b.w, t),
  h: mix(a.h, b.h, t),
});

// A — VI02 SC02's columns
const K = 0.81;
const PILLAR = {
  w: 340 * K,
  gap: 50 * K,
  col: 150,
  h: 340,
  text: 34 * K,
  label: 92,
};
const LABEL_Y = 423;
const PILLARS = [
  "Beli saham =\nBeli perusahaan",
  "Beli murah",
  "Manfaatkan market",
  "Investasi pada bisnis yang dipahami",
] as const;
const ROW = 4 * PILLAR.w + 3 * PILLAR.gap;
const pillarX = (i: number) => CX - ROW / 2 + i * (PILLAR.w + PILLAR.gap);
const BOTTOM = LABEL_Y + PILLAR.label + PILLAR.h;
const OURS = 1;
/** The heading the column's label travels to (IN04's, as VI01 SC04 places it). */
const HEAD_TEXT = {
  x: HEADING.x + HEADING.disc + 24,
  y: HEADING.y,
  size: theme.type.title.size,
};

// B — Buffett's sentence, centred vertically on the charts that follow (Simon 16 Nov: "center vertikal")
const TILE_D = 220;
const TILE_H = (TILE_D * 423) / 406;
/** Buffett's name under his tile: gap + one 30 px line */
const NAME = { gap: 18, h: 36 };
/** QuoteCard's indigo block sits this far below the panel */
const BLOCK_DROP = 14;
/**
 * Buffett's sentence in TA09's quote card (Simon 16 Nov: "pake style ini deh, termasuk style font nya. Ambil dari TA09"): core QuoteCard —
 * a bordered panel on a solid indigo block, the marks in opposite corners — and its Words, 48 px / 600, no highlight. One line, level
 * with Buffett's tile; the pair's box is centred on the charts' middle.
 */
const QUOTE_H = 280;
/** the middle of the charts in D */
const MID_Y = 570;
/** tile + name, and the quote card with its block, each centred on that middle */
const QUOTE = {
  x: 470,
  y: Math.round(MID_Y - (QUOTE_H + BLOCK_DROP) / 2),
  w: 1270,
  h: QUOTE_H,
  size: 48,
  line: "Price is what you pay. Value is what you get.",
};
const TILE = {
  x: 180,
  y: Math.round(MID_Y - (TILE_H + NAME.gap + NAME.h) / 2),
  d: TILE_D,
};
/**
 * Two rows in the card: the sentence, and under each underline its gloss in smaller type (Simon 16 Nov, his words exactly). The
 * card is laid out for both from the start so the sentence never moves. CAPTION_LEAD is the second row's lead for the marks'
 * placement: the 30 px gloss's descenders end where a 48 px row's would 50 px lower.
 */
const CAPTION_LEAD = 50;
const QUOTE_LIST_Y = quoteListY(QUOTE.y, QUOTE.h, CAPTION_LEAD, 2);
const CAPTION = { size: 30, y: QUOTE_LIST_Y + 96 };
/** each gloss in indigo, left-aligned with its sentence (Simon 16 Nov); x = where the sentence's underline starts, measured on a still */
const GLOSS = [
  { text: "Harga adalah yang dibayar", x: 572 },
  { text: "Value adalah yang didapat", x: 1103 },
] as const;
/** The sentence's words in the VO, each with which repeat of it in the scene it is. */
const QUOTE_WORDS: [string, number][] = [
  ["Price", 0],
  ["is", 0],
  ["what", 0],
  ["you", 0],
  ["pay", 0],
  ["Value", 1],
  ["is", 1],
  ["what", 1],
  ["you", 1],
  ["get", 0],
];

// D — two charts; E — the second grown
/** the two charts, low (Simon 16 Nov: "Height kedua kartu ini bisa kamu kecilin"), centred on MID_Y like the quote before them */
const HIGH_H = 420;
/** the chart's own height inside a HIGH card: the card less pad 36, title 36, gap 40 and the 44 margin under it */
const HIGH_CHART_H = HIGH_H - (36 + 36 + 40) - 44;
const HIGH: Box[] = [
  { x: 240, y: MID_Y - HIGH_H / 2, w: 700, h: HIGH_H },
  { x: 980, y: MID_Y - HIGH_H / 2, w: 700, h: HIGH_H },
];
/** E: the Rp50.000 card grown, centred now that the other card is gone; the Rp5.000 card stays where it was as it fades */
const BIG: Box[] = [
  HIGH[0],
  { x: (theme.canvas.width - 1200) / 2, y: 260, w: 1200, h: 640 },
];
const STOCKS = [
  {
    title: "Saham Rp 5.000",
    priceText: "5.000",
    /** 20 px lower than first built (Simon 16 Nov), as a share of the chart's height in the card */
    value: 0.34 - 20 / HIGH_CHART_H,
    price: 0.7,
    note: "belum tentu murah",
    at: "Jadi saham",
    noteAt: "belum tentu murah",
  },
  {
    title: "Saham Rp 50.000",
    priceText: "50.000",
    value: 0.68,
    price: 0.32,
    note: "belum tentu mahal",
    at: "Dan saham",
    noteAt: "belum tentu mahal",
  },
] as const;

/** Price swinging round a level, 0–1 up, as VI01 SC08's card draws it. */
const priceAt = (t: number, level: number, seed: number) =>
  level +
  0.11 * Math.sin(t * 9.5 + seed) +
  0.05 * Math.sin(t * 23 + seed * 2) +
  0.04 * Math.sin(t * 3.1 + seed);

/** A "Harga vs Value" chart in a box: the dashed value line (indigo, as its label), the price drawn up to `draw` and labelled on
 * two lines, "Harga" over its figure; `gap` shades the space between them over the chart's last stretch. No base
 * line (Simon 16 Nov). Inside an <svg> the size of `w` × `h`. */
const HvV = ({
  w,
  h,
  value,
  price,
  seed,
  draw,
  gap,
  fairLabel,
  labelSize,
  labels = 1,
  priceText,
}: {
  w: number;
  h: number;
  value: number;
  price: number;
  seed: number;
  draw: number;
  gap: number;
  fairLabel: number;
  labelSize: number;
  labels?: number;
  /** the price's figure, the label's second line */
  priceText: string;
}) => {
  const c = usePalette();
  const padR = labelSize * 6.2;
  const X = (t: number) => t * (w - padR);
  const Y = (v: number) => h - v * h;
  const n = 90;
  const shown = Math.max(2, Math.round(draw * n));
  const pts = Array.from({ length: shown }, (_, k) => {
    const t = k / (n - 1);
    return `${X(t).toFixed(1)},${Y(priceAt(t, price, seed)).toFixed(1)}`;
  }).join(" ");
  const vy = (t: number) => Y(value + 0.03 * t);
  const end = priceAt(1, price, seed);
  const t0 = 0.62;
  const band = Array.from({ length: 30 }, (_, k) => t0 + ((1 - t0) * k) / 29);
  return (
    <g>
      {gap > 0.001 ? (
        <path
          d={`M ${band.map((t) => `${X(t).toFixed(1)} ${vy(t).toFixed(1)}`).join(" L ")} L ${band
            .slice()
            .reverse()
            .map(
              (t) =>
                `${X(t).toFixed(1)} ${Y(priceAt(t, price, seed)).toFixed(1)}`,
            )
            .join(" L ")} Z`}
          fill={theme.color.indigoWashSolid}
          opacity={gap}
        />
      ) : null}
      <line
        x1={0}
        y1={vy(0)}
        x2={X(1)}
        y2={vy(1)}
        stroke={c.indigo}
        strokeWidth={3 + fairLabel}
        strokeDasharray="10 10"
      />
      {draw > 0.001 ? (
        <polyline
          points={pts}
          fill="none"
          stroke={c.ink}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ) : null}
      <text
        x={X(1) + 16}
        y={Y(end) + labelSize * 0.35}
        fontFamily={theme.text.family}
        fontSize={labelSize}
        fontWeight={600}
        fill={c.ink}
        opacity={draw > 0.95 ? labels : 0}
      >
        {/* two lines centred on the price's end */}
        <tspan x={X(1) + 16} dy={-labelSize * 0.6}>
          Harga
        </tspan>
        <tspan x={X(1) + 16} dy={labelSize * 1.2}>
          {priceText}
        </tspan>
      </text>
      {/* "Value" fades into "Harga wajar" (Simon 16 Nov) */}
      {(["Value", "Harga wajar"] as const).map((word, k) => (
        <text
          key={word}
          x={X(1) + 16}
          y={vy(1) + labelSize * 0.35}
          fontFamily={theme.text.family}
          fontSize={labelSize}
          fontWeight={600}
          fill={c.indigo}
          opacity={labels * (k === 0 ? 1 - fairLabel : fairLabel)}
        >
          {word}
        </text>
      ))}
    </g>
  );
};

export const SC02 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(2, BLOCK.SC02);
  const g = f + BLOCK.SC02;

  const buffettAt = W("Warren Buffett");
  const hargaAt = W("Harga adalah");
  const valueAt = W("Value adalah");
  const aAt = W(STOCKS[0].at);
  const bAt = W(STOCKS[1].at);
  const murahAt = W("Murah hanya");

  // A → B: the columns step back, their "Beli murah" travels up to the heading
  const greyed = ease(f, W("Pilar kedua"), m.move);
  const ownLit = ease(f, W("membeli dengan harga"), m.pop);
  const away = ease(f, buffettAt - m.sec(0.5), m.move);
  const ringIn = ease(f, buffettAt - m.sec(0.5) + m.move * 0.6, m.pop);

  // B → C
  const quoteOut = ease(f, aAt - m.sec(0.5), m.fade);

  // D → E: the cards' boxes. A comes in on "Jadi saham", B on "Dan saham".
  const grow = ease(f, murahAt - m.sec(0.1), m.move);
  const box = (i: number) => lerpBox(HIGH[i], BIG[i], grow);
  const inAt = [aAt, bAt];
  /** the Rp5.000 card fades out as the other grows, a little ahead of it so the grown card never sweeps over it */
  const aGone = ease(f, murahAt - m.sec(0.35), m.fade);
  const cardIn = (i: number) =>
    ease(f, inAt[i] - m.sec(0.1), m.reveal) * (i === 0 ? 1 - aGone : 1);
  const draw = (i: number) => ease(f, inAt[i] + m.sec(0.25), m.sec(1.0));

  // E
  /** "Value" → "Harga wajar", a cross-fade */
  const fairLabel = ease(f, W("harga wajar"), m.fade);
  const gap = ease(f, W("jelas di bawah"), m.reveal);
  /** the summary under the chart, once the gap is shaded */
  const summary = ease(f, W("jelas di bawah") + m.reveal, m.reveal);

  // the label's flight from its column to the heading
  const lab0 = {
    x: pillarX(OURS) + PILLAR.w / 2,
    y: LABEL_Y + PILLAR.label - 30,
  };
  const labX = mix(lab0.x, HEAD_TEXT.x, away);
  const labY = mix(lab0.y - 14 * ownLit, HEAD_TEXT.y, away);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the columns, stepping back on "Warren Buffett" */}
      {away < 0.999 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - away,
            transform: `translateY(${(away * 24).toFixed(1)}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 250,
              textAlign: "center",
              ...typeStyle("title"),
              fontSize: 64,
              fontWeight: 700,
              color: c.ink,
            }}
          >
            Value Investing
          </div>
          {PILLARS.map((text, i) => {
            const tone = interpolateColors(i / 3, [0, 1], [c.cyan, c.indigo]);
            const ink = interpolateColors(
              i / 3,
              [0, 1],
              [theme.color.cyanInk, c.indigo],
            );
            const g0 = i === OURS ? 0 : greyed;
            const x = pillarX(i);
            const lift = i === OURS ? ownLit : 0;
            return (
              <div
                key={text}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translateY(${(-14 * lift).toFixed(1)}px)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: x + (PILLAR.w - PILLAR.col) / 2,
                    top: BOTTOM - PILLAR.h,
                    width: PILLAR.col,
                    height: PILLAR.h,
                  }}
                >
                  <Column
                    w={PILLAR.col}
                    h={PILLAR.h}
                    tone={interpolateColors(
                      g0,
                      [0, 1],
                      [tone, theme.color.skeleton],
                    )}
                  />
                </div>
                {i !== OURS ? (
                  <div
                    style={{
                      position: "absolute",
                      left: x - PILLAR.gap / 2 + 5,
                      width: PILLAR.w + PILLAR.gap - 10,
                      top: LABEL_Y,
                      height: PILLAR.label - 14,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      textAlign: "center",
                      whiteSpace: "pre-line",
                      ...typeStyle("label"),
                      fontSize: PILLAR.text,
                      fontWeight: 600,
                      lineHeight: 1.25,
                      color: interpolateColors(
                        g0,
                        [0, 1],
                        [ink, theme.color.mute],
                      ),
                    }}
                  >
                    {text}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* "Beli murah": the column's label, then the heading */}
      <div
        style={{
          position: "absolute",
          left: labX,
          top: labY,
          transform: `translate(${(-50 * (1 - away)).toFixed(1)}%, -50%)`,
          ...typeStyle(away > 0.5 ? "title" : "label"),
          fontSize: mix(
            PILLAR.text * (1 + 0.18 * ownLit),
            HEAD_TEXT.size,
            away,
          ),
          fontWeight: mix(600, 500, away),
          color: interpolateColors(away, [0, 1], [c.indigo, c.ink]),
          whiteSpace: "nowrap",
        }}
      >
        Beli murah
      </div>
      {ringIn > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: HEADING.x,
            top: HEADING.y - HEADING.disc / 2,
            opacity: ringIn,
            transform: `scale(${(0.8 + 0.2 * ringIn).toFixed(3)})`,
          }}
        >
          <NumRing n={2} size={HEADING.disc} />
        </div>
      ) : null}

      {/* B — Buffett's sentence */}
      {f >= buffettAt - m.sec(0.5) + m.move && quoteOut < 0.999 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - quoteOut,
            transform: `translateY(${(-20 * quoteOut).toFixed(1)}px)`,
          }}
        >
          {/* the tile waits until the flying label has passed over its place */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: ease(f, buffettAt - m.sec(0.5) + m.move, m.reveal),
            }}
          >
            <PhotoTile
              name="buffett"
              d={TILE.d}
              style={{ left: TILE.x, top: TILE.y }}
            />
            <div
              style={{
                position: "absolute",
                left: TILE.x - 40,
                width: TILE.d + 80,
                top: TILE.y + TILE_H + 18,
                textAlign: "center",
                ...typeStyle("label"),
                fontSize: 30,
                fontWeight: 600,
                color: c.ink,
              }}
            >
              Warren Buffett
            </div>
          </div>
          <QuoteCard
            x={QUOTE.x}
            y={QUOTE.y}
            w={QUOTE.w}
            h={QUOTE.h}
            at={W("menulis")}
            listY={QUOTE_LIST_Y}
            lead={CAPTION_LEAD}
            count={2}
          >
            {/* each word as it is spoken; each sentence underlined as the VO explains it */}
            <Words
              text={QUOTE.line}
              x={QUOTE.x + QUOTE.w / 2}
              y={QUOTE_LIST_Y + QUOTE.size * 0.62}
              at={W("Price")}
              atEach={QUOTE_WORDS.map(([word, nth]) => W(word, nth))}
              anchor="center"
              size={QUOTE.size}
              weight={600}
              markStyle="underline"
              marks={[
                {
                  text: "Price is what you pay.",
                  color: c.indigo,
                  at: hargaAt,
                },
                {
                  text: "Value is what you get.",
                  color: c.indigo,
                  at: valueAt,
                },
              ]}
            />
            {GLOSS.map((gl, k) => (
              <Line
                key={gl.text}
                text={gl.text}
                x={gl.x}
                anchor="left"
                y={CAPTION.y}
                at={(k === 0 ? hargaAt : valueAt) + m.sec(0.15)}
                size={CAPTION.size}
                weight={500}
                color={c.indigo}
              />
            ))}
          </QuoteCard>
        </div>
      ) : null}

      {/* D–E — the two charts */}
      {[0, 1].map((i) => {
        const inP = cardIn(i);
        if (inP <= 0.001) return null;
        const b = box(i);
        const st = STOCKS[i];
        const grey = 0;
        const big = i === 1 ? grow : 0;
        const pad = mix(36, 50, big);
        const titleSize = mix(36, 44, big);
        const chartTop = pad + titleSize + 40;
        /** the verdict pill sits beside the title, so the chart runs down to a plain margin; grown, it leaves a band under
         * it for the summary line */
        const summaryBand = 150;
        const chartH = b.h - chartTop - mix(44, summaryBand, big);
        const chartW = b.w - 2 * pad;
        const labelSize = mix(26, 32, big);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y + (1 - inP) * 16,
              width: b.w,
              height: b.h,
              opacity: inP,
              filter:
                grey > 0.001 ? `grayscale(${grey.toFixed(3)})` : undefined,
            }}
          >
            <Card
              x={0}
              y={0}
              w={b.w}
              h={b.h}
              style={{
                boxShadow: i === 1 && big > 0.5 ? shadow.glow : shadow.soft,
              }}
            >
              {/* D — Harga vs Value */}
              <div style={{ position: "absolute", inset: 0 }}>
                {/* the title, and its verdict beside it (Simon 16 Nov) */}
                <div
                  style={{
                    position: "absolute",
                    left: pad,
                    top: pad,
                    height: titleSize * 1.2,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      ...typeStyle("title"),
                      fontSize: titleSize,
                      fontWeight: 600,
                      color: c.ink,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {st.title}
                  </div>
                  <div
                    style={{
                      opacity:
                        ease(f, W(st.noteAt), m.reveal) *
                        (1 - big) *
                        (1 - grey),
                      padding: "8px 22px",
                      borderRadius: 999,
                      background: theme.color.neutralDisc,
                      ...typeStyle("label"),
                      fontSize: 28,
                      fontWeight: 600,
                      color: c.slate,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {st.note}
                  </div>
                </div>
                <svg
                  width={chartW}
                  height={chartH}
                  style={{
                    position: "absolute",
                    left: pad,
                    top: chartTop,
                    overflow: "visible",
                  }}
                >
                  <HvV
                    w={chartW}
                    h={chartH}
                    value={st.value}
                    price={st.price}
                    seed={i * 1.7 + 0.4}
                    draw={draw(i)}
                    gap={i === 1 ? gap : 0}
                    fairLabel={i === 1 ? fairLabel : 0}
                    labelSize={labelSize}
                    labels={1 - grey}
                    priceText={st.priceText}
                  />
                </svg>
                {/* E — the sentence in one line, under the chart */}
                {i === 1 && summary > 0.001 ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: summary,
                      transform: `translateY(${((1 - summary) * 14).toFixed(1)}px)`,
                    }}
                  >
                    <Statement
                      x={0}
                      y={b.h - summaryBand / 2}
                      w={b.w}
                      text="Murah: harga jelas di bawah harga wajar"
                      mark="Murah"
                      size={42}
                      align="center"
                      weight={600}
                    />
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        );
      })}
    </Stage>
  );
};
