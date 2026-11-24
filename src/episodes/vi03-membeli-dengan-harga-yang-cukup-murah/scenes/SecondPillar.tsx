/**
 * VI03 · SC02 — "Pilar Kedua: Beli Cukup Murah", from the ChatGPT storyboard docs/vi-style/storyboards/VI03-SC02.png, in
 * VI02's look (VI01's columns, the real photo tile, the dashed text box, IN07's cards).
 *
 *  A  "Pilar kedua": VI01's four columns under "Value Investing" (as VI02 SC02 showed them); the second, "Beli murah", stays
 *     in its colour and lifts, the other three go grey.
 *  B  "Warren Buffett menulis" (a cut): his photo tile, his English sentence in a dashed text box, "Berkshire Hathaway · 2008"
 *     (his 2008 letter to shareholders) under it; "Value" lit when he says it.
 *  C  "Harga adalah yang kamu bayar" (a cut): two cards, Harga (wallet) / yang kamu bayar, Value (box) / yang kamu dapatkan.
 *  D  "Jadi saham Rp5.000" (a cut): two price cards, Rp5.000 "belum tentu murah", Rp50.000 "belum tentu mahal".
 *  E  "Murah hanya punya satu arti" (a cut): "Harga wajar" as a line, the price as a dot that drops clearly under it, the gap
 *     bracketed "Murah".
 */
import {
  AppearE as Appear,
  CardE as Card,
  WordPillE as WordPill,
} from "../../../editable";
import { interpolateColors, useCurrentFrame, Interactive } from "remotion";
import {
  SoftGround,
  Stage,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
} from "../../../core";
import { BLOCK } from "../data/timing";
import {
  BoardGrid,
  Column,
  DashBox,
  Glyph,
  PhotoTile,
  Ring,
  Shot,
  ease,
  useWords,
} from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A — VI01's columns, where VI02 SC02 showed them
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
const HEADING = { y: 250, size: 64 };
const OURS = 1;

// B — Buffett and his sentence
const TILE = { d: 300, x: 200, y: 300 };
const TILE_H = (TILE.d * 423) / 406;
const QUOTE = { cx: 1150, y: 290, w: 900, h: 330, size: 58 };
const SOURCE_Y = QUOTE.y + QUOTE.h + 50;

// C — what you pay, what you get
const PAIR = {
  w: 600,
  h: 520,
  y: 230,
  gap: 80,
  disc: 170,
  title: 72,
  line: 42,
};
const PAIR_X = (i: number) =>
  CX - PAIR.w - PAIR.gap / 2 + i * (PAIR.w + PAIR.gap);
const PAIRS = [
  {
    title: "Harga",
    icon: "wallet",
    line: "yang kamu bayar",
    at: "Harga adalah",
  },
  {
    title: "Value",
    icon: "package",
    line: "yang kamu dapatkan",
    at: "Value adalah",
  },
] as const;

// D — two prices, each on a plain card (Simon 16 Nov: no price-tag shape for any price)
const TAG = { w: 560, h: 230, y: 330, gap: 120, size: 96, noteY: 680 };
const TAG_X = (i: number) => CX - TAG.w - TAG.gap / 2 + i * (TAG.w + TAG.gap);
const TAGS = [
  {
    price: "Rp5.000",
    note: "belum tentu murah",
    at: "Jadi saham",
    noteAt: "belum tentu murah",
  },
  {
    price: "Rp50.000",
    note: "belum tentu mahal",
    at: "Dan saham",
    noteAt: "belum tentu mahal",
  },
] as const;

// E — the measure
const MEASURE = {
  x0: 760,
  x1: 1260,
  fair: 330,
  low: 740,
  dot: 22,
  bracket: 690,
  label: 46,
};

export const SC02 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(2, BLOCK.SC02);
  const g = f + BLOCK.SC02;

  const buffettAt = W("Warren Buffett");
  const pairAt = W("Harga adalah");
  const tagsAt = W("Jadi saham");
  const measureAt = W("Murah hanya");

  // A
  const greyed = ease(f, W("Pilar kedua"), m.move);
  const ownLit = ease(f, W("membeli dengan harga"), m.pop);

  // B
  const valueLit = ease(f, W("Value is"), m.reveal);

  // E
  const fairAt = W("harga wajar");
  const dotAt = W("harga yang kita");
  const dropAt = W("jelas di bawah");
  const drop = ease(f, dropAt, m.move);
  const dotY = mix(MEASURE.fair + 150, MEASURE.low, drop);
  const bracket = ease(f, dropAt + m.sec(0.4), m.reveal);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the columns; the second one is this video's */}
      <Shot from={-1} to={buffettAt} block={BLOCK.SC02} cutIn={false}>
        <Interactive.Div
          name="Value Investing"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: HEADING.y,
            textAlign: "center",
            ...typeStyle("title"),
            fontSize: HEADING.size,
            fontWeight: 700,
            color: c.ink,
          }}
        >
          Value Investing
        </Interactive.Div>
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
                  fontSize: PILLAR.text * (1 + 0.18 * lift),
                  fontWeight: 600,
                  lineHeight: 1.25,
                  color: interpolateColors(g0, [0, 1], [ink, theme.color.mute]),
                }}
              >
                {text}
              </div>
            </div>
          );
        })}
      </Shot>

      {/* B — Buffett's sentence */}
      <Shot from={buffettAt} to={pairAt} block={BLOCK.SC02}>
        <PhotoTile
          name="buffett"
          d={TILE.d}
          style={{ left: TILE.x, top: TILE.y }}
        />
        <Interactive.Div
          name="Warren Buffett"
          style={{
            position: "absolute",
            left: TILE.x - 40,
            width: TILE.d + 80,
            top: TILE.y + TILE_H + 26,
            textAlign: "center",
            ...typeStyle("label"),
            fontSize: 36,
            fontWeight: 600,
            color: c.ink,
          }}
        >
          Warren Buffett
        </Interactive.Div>
        <DashBox
          cx={QUOTE.cx}
          y={QUOTE.y}
          w={QUOTE.w}
          h={QUOTE.h}
          at={W("Price is")}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "0 60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              ...typeStyle("title"),
              fontSize: QUOTE.size,
              fontWeight: 500,
              fontStyle: "italic",
              lineHeight: 1.3,
              color: c.ink,
            }}
          >
            <span>“Price is what you pay.</span>
            <span>
              <span
                style={{
                  color: interpolateColors(valueLit, [0, 1], [c.ink, c.indigo]),
                  background:
                    valueLit > 0.001 ? theme.color.indigoWashSolid : undefined,
                  borderRadius: 8,
                }}
              >
                Value
              </span>{" "}
              is what you get.”
            </span>
          </div>
        </DashBox>
        <Appear
          at={W("Value is") + m.sec(0.3)}
          style={{ left: 0, top: SOURCE_Y, width: theme.canvas.width }}
        >
          <WordPill
            x={QUOTE.cx}
            y={0}
            text="Berkshire Hathaway · 2008"
            size={30}
          />
        </Appear>
      </Shot>

      {/* C — Harga / Value */}
      <Shot from={pairAt} to={tagsAt} block={BLOCK.SC02}>
        {PAIRS.map((k, i) => {
          const at = W(k.at);
          const p = ease(f, at - m.sec(0.2), m.reveal);
          const lit =
            ease(f, at, m.pop) *
            (i === 0 ? 1 - ease(f, W(PAIRS[1].at), m.pop) : 1);
          return p > 0.001 ? (
            <div
              key={k.title}
              style={{
                position: "absolute",
                left: PAIR_X(i),
                top: PAIR.y + (1 - p) * 14,
                width: PAIR.w,
                height: PAIR.h,
                opacity: p,
              }}
            >
              <Card
                x={0}
                y={0}
                w={PAIR.w}
                h={PAIR.h}
                style={{ boxShadow: lit > 0.5 ? shadow.glow : shadow.soft }}
              >
                <Ring p={lit} tone={c.indigo} />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    width: PAIR.w,
                    top: 56,
                    textAlign: "center",
                    ...typeStyle("title"),
                    fontSize: PAIR.title,
                    fontWeight: 600,
                    color: c.ink,
                  }}
                >
                  {k.title}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: (PAIR.w - PAIR.disc) / 2,
                    top: 170,
                    width: PAIR.disc,
                    height: PAIR.disc,
                    borderRadius: 999,
                    background: theme.color.neutralDisc,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Glyph
                    icon={k.icon}
                    size={PAIR.disc * 0.54}
                    tone={interpolateColors(
                      lit,
                      [0, 1],
                      [theme.color.neutralIcon, c.indigo],
                    )}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    width: PAIR.w,
                    top: 400,
                    textAlign: "center",
                    ...typeStyle("label"),
                    fontSize: PAIR.line,
                    fontWeight: 500,
                    color: c.slate,
                  }}
                >
                  {k.line}
                </div>
              </Card>
            </div>
          ) : null;
        })}
      </Shot>

      {/* D — two prices, neither tells you cheap or dear */}
      <Shot from={tagsAt} to={measureAt} block={BLOCK.SC02}>
        {TAGS.map((t, i) => {
          const p = ease(f, W(t.at), m.reveal);
          return p > 0.001 ? (
            <div
              key={t.price}
              style={{
                position: "absolute",
                inset: 0,
                opacity: p,
                transform: `translateY(${((1 - p) * 14).toFixed(1)}px)`,
              }}
            >
              <Card x={TAG_X(i)} y={TAG.y} w={TAG.w} h={TAG.h}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...typeStyle("title"),
                    fontSize: TAG.size,
                    fontWeight: 600,
                    color: c.ink,
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {t.price}
                </div>
              </Card>
              <Appear at={W(t.noteAt)} style={{ left: 0, top: 0 }}>
                <WordPill
                  x={TAG_X(i) + TAG.w / 2}
                  y={TAG.noteY}
                  text={t.note}
                  size={40}
                />
              </Appear>
            </div>
          ) : null;
        })}
      </Shot>

      {/* E — cheap: the price clearly under the fair value */}
      <Shot from={measureAt} to={1e6} block={BLOCK.SC02} cutOut={false}>
        <svg
          width={theme.canvas.width}
          height={theme.canvas.height}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {(() => {
            const p = ease(f, fairAt - m.sec(0.3), m.reveal);
            const len = MEASURE.x1 - MEASURE.x0;
            return p > 0.001 ? (
              <line
                x1={MEASURE.x0}
                y1={MEASURE.fair}
                x2={MEASURE.x1}
                y2={MEASURE.fair}
                stroke={c.ink}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - p)}
              />
            ) : null;
          })()}
          {/* the bracket: the gap between the price and the fair value */}
          {bracket > 0.001 ? (
            <path
              d={`M ${MEASURE.bracket + 26} ${MEASURE.fair} Q ${MEASURE.bracket} ${MEASURE.fair} ${MEASURE.bracket} ${MEASURE.fair + 40} L ${MEASURE.bracket} ${(MEASURE.fair + MEASURE.low) / 2 - 24} Q ${MEASURE.bracket} ${(MEASURE.fair + MEASURE.low) / 2} ${MEASURE.bracket - 22} ${(MEASURE.fair + MEASURE.low) / 2} Q ${MEASURE.bracket} ${(MEASURE.fair + MEASURE.low) / 2} ${MEASURE.bracket} ${(MEASURE.fair + MEASURE.low) / 2 + 24} L ${MEASURE.bracket} ${MEASURE.low - 40} Q ${MEASURE.bracket} ${MEASURE.low} ${MEASURE.bracket + 26} ${MEASURE.low}`}
              fill="none"
              stroke={c.indigo}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={bracket}
            />
          ) : null}
          {/* the price: a dot that drops clearly under the line */}
          {(() => {
            const p = ease(f, dotAt, m.pop);
            const x = (MEASURE.x0 + MEASURE.x1) / 2;
            return p > 0.001 ? (
              <g opacity={p}>
                <line
                  x1={x}
                  y1={MEASURE.fair}
                  x2={x}
                  y2={dotY}
                  stroke={c.indigo}
                  strokeWidth={3}
                  strokeDasharray="8 10"
                  opacity={drop}
                />
                <circle
                  cx={x}
                  cy={dotY}
                  r={MEASURE.dot}
                  fill={c.cardBg}
                  stroke={c.indigo}
                  strokeWidth={4}
                />
                <circle
                  cx={x}
                  cy={dotY}
                  r={MEASURE.dot * 0.5}
                  fill={c.indigo}
                />
              </g>
            ) : null;
          })()}
        </svg>
        <Appear
          at={fairAt}
          style={{ left: MEASURE.x1 + 40, top: MEASURE.fair - 40 }}
        >
          <div
            style={{
              ...typeStyle("label"),
              fontSize: MEASURE.label,
              fontWeight: 600,
              color: c.ink,
              whiteSpace: "nowrap",
              lineHeight: "80px",
            }}
          >
            Harga wajar
          </div>
        </Appear>
        {f >= dotAt ? (
          <Interactive.Div
            name="Harga"
            style={{
              position: "absolute",
              left: (MEASURE.x0 + MEASURE.x1) / 2 + 50,
              top: dotY - 40,
              opacity: ease(f, dotAt, m.reveal),
              ...typeStyle("label"),
              fontSize: MEASURE.label,
              fontWeight: 600,
              color: c.indigo,
              whiteSpace: "nowrap",
              lineHeight: "80px",
            }}
          >
            Harga
          </Interactive.Div>
        ) : null}
        <Appear at={W("Murah hanya")} style={{ left: 0, top: 0 }}>
          <WordPill
            x={MEASURE.bracket - 150}
            y={(MEASURE.fair + MEASURE.low) / 2}
            text="Murah"
            size={52}
          />
        </Appear>
      </Shot>
    </Stage>
  );
};
