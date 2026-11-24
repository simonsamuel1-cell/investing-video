/**
 * VI03 · SC02 v2 — "Pilar Kedua: Beli Cukup Murah" as ONE continuous take (Simon 16 Nov: "kebanyakan transisi camera cut, tiap
 * visualnya terlalu sederhana dan kurang ada valuenya"). Storyboard: docs/vi-style/storyboards/VI03-SC02-v2.png. The first
 * build, one Shot per sentence, is scenes/SecondPillar.tsx (switch SC02_FLOW in data/switches.ts).
 *
 * One world, a camera moving through it on the VO's words (pan, push-in), no cuts; objects carry from beat to beat:
 *  1  "Pilar kedua …": VI01's four columns; "Beli murah" stays lit, the camera pushes in on it.
 *  2  "Warren Buffett menulis": the camera glides right to Buffett's tile and his sentence; "Price" and "Value" lit as spoken.
 *  3  "Harga adalah yang kamu bayar": the camera glides down; "Price" and "Value" fly down with it and become two panel headers.
 *     Harga: a wallet, coins leaving it, "yang kamu bayar". Value: what the business gives you — Laba, Aset, Pertumbuhan.
 *  4  "Jadi saham Rp5.000": each panel becomes a stock card (A, then B) with two bars, Harga and Value; the headers fly up into a
 *     legend. A's value under its price: "belum tentu murah"; B's value over its price: "belum tentu mahal".
 *  5  "Murah hanya punya satu arti": the camera pushes in on B, A goes grey; B's value becomes the "Harga wajar" line, the gap
 *     down to the price is bracketed "Murah", and Laba / Aset come back under it: the company has a base.
 *
 * Saham A / B are the script's own example prices; their value bars carry no figures.
 */
import { CardE as Card, WordPillE as WordPill } from "../../../editable";
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
  ease,
  useWords,
} from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** Where the camera's centre lands on the screen: a little above the middle, clear of the subtitle band. */
const SCREEN = { x: CX, y: 500 };

// 1 — the columns (VI02 SC02's)
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

// 2 — Buffett's station, to the right
const TILE = { x: 2080, y: 330, d: 300 };
const TILE_H = (TILE.d * 423) / 406;
const QUOTE = { cx: 3060, y: 310, w: 1000, h: 330, size: 58 };
/** Where "Price" and "Value" sit in the quote (measured on a still): the flying headers start there. */
const WORD = { price: { x: 2880, y: 434 }, value: { x: 2832, y: 511 } };

// 3–5 — the two panels below it, which become the two stock cards
const PANEL = { w: 760, h: 640, y: 1290, xs: [2080, 2920] };
const pcx = (i: number) => PANEL.xs[i] + PANEL.w / 2;
const HEAD_Y = PANEL.y + 70;
const LEGEND = { y: 1222, xs: [2760, 3020] };
const BARS = { base: 470, max: 300, w: 130, xs: [200, 400] };
const STOCKS = [
  {
    name: "Saham A",
    price: "Rp5.000",
    harga: 0.82,
    value: 0.5,
    note: "belum tentu murah",
    at: "Jadi saham",
    noteAt: "belum tentu murah",
  },
  {
    name: "Saham B",
    price: "Rp50.000",
    harga: 0.58,
    value: 0.98,
    note: "belum tentu mahal",
    at: "Dan saham",
    noteAt: "belum tentu mahal",
  },
] as const;
const GETS = [
  { icon: "coins", text: "Laba" },
  { icon: "bank", text: "Aset" },
  { icon: "chart-line-up", text: "Pertumbuhan" },
] as const;

type Cam = { x: number; y: number; s: number };

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

  // the camera: one take, each move on its word
  const pin: Cam = { x: pillarX(OURS) + PILLAR.w / 2, y: 640, s: 1.7 };
  const moves: { at: number; dur: number; to: Cam }[] = [
    { at: W("membeli dengan harga") - m.sec(0.2), dur: m.sec(1.2), to: pin },
    {
      at: buffettAt - m.sec(0.45),
      dur: m.sec(1.1),
      to: { x: 2900, y: 520, s: 1 },
    },
    {
      at: hargaAt - m.sec(0.35),
      dur: m.sec(1.0),
      to: { x: 2880, y: 1590, s: 1 },
    },
    {
      at: murahAt - m.sec(0.1),
      dur: m.sec(1.1),
      to: { x: pcx(1), y: 1615, s: 1.3 },
    },
  ];
  const cam = moves.reduce<Cam>(
    (cur, mv) => {
      const p = ease(f, mv.at, mv.dur);
      return {
        x: mix(cur.x, mv.to.x, p),
        y: mix(cur.y, mv.to.y, p),
        s: mix(cur.s, mv.to.s, p),
      };
    },
    { x: CX, y: 520, s: 1 },
  );

  // 1
  const greyed = ease(f, W("Pilar kedua"), m.move);
  const ownLit = ease(f, W("membeli dengan harga"), m.pop);

  // 2
  const priceLit = ease(f, W("Price is"), m.reveal);
  const valueLit = ease(f, W("Value is"), m.reveal);

  // 3 — the two words fly down with the camera and become headers; 4 — they fly up into the legend
  /** each word leaves the quote as its panel arrives: "Price" with the camera's glide, "Value" on its own sentence */
  const flyAt = [hargaAt - m.sec(0.35), valueAt - m.sec(0.35)];
  const flies = [ease(f, flyAt[0], m.sec(1.0)), ease(f, flyAt[1], m.sec(0.9))];
  const toLegend = [ease(f, aAt, m.move), ease(f, bAt, m.move)];
  const head = (i: number) => {
    const from = i === 0 ? WORD.price : WORD.value;
    const fly = flies[i];
    const x = mix(mix(from.x, pcx(i), fly), LEGEND.xs[i], toLegend[i]);
    const y = mix(mix(from.y, HEAD_Y, fly), LEGEND.y, toLegend[i]);
    const size = mix(mix(58, 64, fly), 32, toLegend[i]);
    return { x, y, size, fly };
  };
  // the panels' first content leaves as each card arrives
  const panelOut = [
    ease(f, aAt - m.sec(0.15), m.sec(0.15)),
    ease(f, bAt - m.sec(0.15), m.sec(0.15)),
  ];
  const cardIn = [
    ease(f, aAt + m.sec(0.1), m.sec(0.3)),
    ease(f, bAt + m.sec(0.1), m.sec(0.3)),
  ];

  // 5
  const aGrey = ease(f, murahAt, m.move);
  const payLit = ease(f, W("harga yang kita"), m.pop);
  const below = ease(f, W("jelas di bawah"), m.reveal);
  const fair = ease(f, W("harga wajar"), m.reveal);
  const base = ease(f, W("punya dasar"), m.reveal);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* the world, under the camera */}
      <Interactive.Div
        name="Value Investing"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          transformOrigin: "0 0",
          transform: `translate(${SCREEN.x}px, ${SCREEN.y}px) scale(${cam.s.toFixed(4)}) translate(${(-cam.x).toFixed(2)}px, ${(-cam.y).toFixed(2)}px)`,
        }}
      >
        {/* 1 — the columns */}
        <Interactive.Div
          name="Value Investing"
          style={{
            position: "absolute",
            left: 0,
            width: theme.canvas.width,
            top: 250,
            textAlign: "center",
            ...typeStyle("title"),
            fontSize: 64,
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
              style={{ position: "absolute", left: 0, top: -14 * lift }}
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

        {/* 2 — Buffett and his sentence */}
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
        {f >= W("menulis") ? (
          <Interactive.Div
            name="Price"
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <DashBox
              cx={QUOTE.cx}
              y={QUOTE.y}
              w={QUOTE.w}
              h={QUOTE.h}
              at={W("menulis")}
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
                <span>
                  “
                  <span
                    style={{
                      color: interpolateColors(
                        priceLit,
                        [0, 1],
                        [c.ink, c.indigo],
                      ),
                      background:
                        priceLit > 0.001
                          ? theme.color.indigoWashSolid
                          : undefined,
                      borderRadius: 8,
                    }}
                  >
                    Price
                  </span>{" "}
                  is what you pay.
                </span>
                <span>
                  <span
                    style={{
                      color: interpolateColors(
                        valueLit,
                        [0, 1],
                        [c.ink, c.indigo],
                      ),
                      background:
                        valueLit > 0.001
                          ? theme.color.indigoWashSolid
                          : undefined,
                      borderRadius: 8,
                    }}
                  >
                    Value
                  </span>{" "}
                  is what you get.”
                </span>
              </div>
            </DashBox>
          </Interactive.Div>
        ) : null}
        <Interactive.Div
          name="Berkshire Hathaway · 2008"
          style={{
            position: "absolute",
            left: QUOTE.cx,
            top: QUOTE.y + QUOTE.h + 50,
            opacity: ease(f, W("Value is") + m.sec(0.3), m.reveal),
          }}
        >
          <WordPill x={0} y={0} text="Berkshire Hathaway · 2008" size={30} />
        </Interactive.Div>

        {/* 3–5 — the two panels, then the two stock cards */}
        {[0, 1].map((i) => {
          const pIn = ease(
            f,
            hargaAt + (i === 0 ? 0 : valueAt - hargaAt) - m.sec(0.2),
            m.reveal,
          );
          if (pIn <= 0.001) return null;
          const x = PANEL.xs[i];
          const st = STOCKS[i];
          const grey = i === 0 ? aGrey : 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: PANEL.y + (1 - pIn) * 16,
                width: PANEL.w,
                height: PANEL.h,
                opacity: pIn,
                filter:
                  grey > 0.001
                    ? `grayscale(${grey.toFixed(3)}) contrast(${(1 - 0.35 * grey).toFixed(3)}) brightness(${(1 + 0.1 * grey).toFixed(3)})`
                    : undefined,
              }}
            >
              <Card
                x={0}
                y={0}
                w={PANEL.w}
                h={PANEL.h}
                style={{
                  boxShadow:
                    i === 1 && murahAt <= f ? shadow.glow : shadow.soft,
                }}
              >
                {i === 1 ? (
                  <Ring p={ease(f, murahAt, m.pop)} tone={c.indigo} />
                ) : null}

                {/* 3 — what you pay / what you get */}
                {panelOut[i] < 0.999 ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 1 - panelOut[i],
                      filter:
                        panelOut[i] > 0.001
                          ? `blur(${(8 * panelOut[i]).toFixed(1)}px)`
                          : undefined,
                    }}
                  >
                    {i === 0 ? (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            left: (PANEL.w - 190) / 2,
                            top: 190,
                            width: 190,
                            height: 190,
                            borderRadius: 999,
                            background: theme.color.neutralDisc,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Glyph icon="wallet" size={104} tone={c.ink} />
                        </div>
                        {/* coins leaving the wallet, one after another */}
                        {[0, 1, 2].map((k) => {
                          const p = ease(
                            f,
                            hargaAt + m.sec(0.4) + k * m.sec(0.35),
                            m.sec(0.9),
                          );
                          if (p <= 0.001 || p >= 0.999) return null;
                          return (
                            <div
                              key={k}
                              style={{
                                position: "absolute",
                                left: PANEL.w / 2 + 40 + p * 250,
                                top: 240 + k * 26 - p * 30,
                                width: 92,
                                height: 92,
                                borderRadius: 999,
                                background: c.cardBg,
                                boxShadow: `${shadow.soft}, inset 0 0 0 4px ${c.slate}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: Math.min(1, (1 - p) * 3, p * 6),
                                ...typeStyle("label"),
                                fontSize: 30,
                                fontWeight: 700,
                                color: c.slate,
                              }}
                            >
                              Rp
                            </div>
                          );
                        })}
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            width: PANEL.w,
                            top: 430,
                            textAlign: "center",
                            ...typeStyle("title"),
                            fontSize: 44,
                            fontWeight: 500,
                            color: c.slate,
                          }}
                        >
                          yang kamu bayar
                        </div>
                      </>
                    ) : (
                      <>
                        {GETS.map((k, j) => {
                          const p = ease(
                            f,
                            valueAt + m.sec(0.3) + j * m.sec(0.25),
                            m.reveal,
                          );
                          return p > 0.001 ? (
                            <div
                              key={k.text}
                              style={{
                                position: "absolute",
                                left: (PANEL.w - 420) / 2,
                                top: 160 + j * 96 + (1 - p) * 14,
                                width: 420,
                                height: 80,
                                opacity: p,
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                padding: "0 20px",
                                borderRadius: 999,
                                background: theme.color.indigoWashSolid,
                                boxShadow: `inset 0 0 0 2px ${c.indigo}`,
                              }}
                            >
                              <Glyph icon={k.icon} size={40} tone={c.indigo} />
                              <div
                                style={{
                                  ...typeStyle("title"),
                                  fontSize: 36,
                                  fontWeight: 600,
                                  color: c.indigo,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {k.text}
                              </div>
                            </div>
                          ) : null;
                        })}
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            width: PANEL.w,
                            top: 470,
                            textAlign: "center",
                            ...typeStyle("title"),
                            fontSize: 44,
                            fontWeight: 500,
                            color: c.slate,
                          }}
                        >
                          yang kamu dapatkan
                        </div>
                      </>
                    )}
                  </div>
                ) : null}

                {/* 4 — the stock card */}
                {cardIn[i] > 0.001 ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: cardIn[i],
                      filter:
                        cardIn[i] < 0.999
                          ? `blur(${(8 * (1 - cardIn[i])).toFixed(1)}px)`
                          : undefined,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 44,
                        top: 36,
                        ...typeStyle("title"),
                        fontSize: 46,
                        fontWeight: 700,
                        color: c.ink,
                      }}
                    >
                      {st.name}
                    </div>
                    {/* the two bars */}
                    {(["harga", "value"] as const).map((key, j) => {
                      const h =
                        BARS.max *
                        st[key] *
                        ease(f, W(st.at) + m.sec(0.2 + 0.25 * j), m.sec(0.7));
                      const x0 = BARS.xs[j];
                      const lit = key === "harga" && i === 1 ? payLit : 0;
                      return (
                        <div key={key}>
                          <div
                            style={{
                              position: "absolute",
                              left: x0,
                              top: BARS.base - h,
                              width: BARS.w,
                              height: h,
                              borderRadius: 18,
                              background: key === "harga" ? c.slate : c.indigo,
                              boxShadow:
                                lit > 0.5
                                  ? `0 0 0 6px ${theme.color.indigoWashStrongSolid}`
                                  : undefined,
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              left: x0 - 30,
                              width: BARS.w + 60,
                              top: BARS.base + 14,
                              textAlign: "center",
                              ...typeStyle("label"),
                              fontSize: 32,
                              fontWeight: 600,
                              color: key === "harga" ? c.slate : c.indigo,
                            }}
                          >
                            {key === "harga" ? "Harga" : "Value"}
                          </div>
                        </div>
                      );
                    })}
                    <div
                      style={{
                        position: "absolute",
                        left: BARS.xs[0] - 40,
                        width: BARS.w + 80,
                        top: BARS.base - BARS.max * st.harga - 56,
                        textAlign: "center",
                        opacity: ease(f, W(st.at) + m.sec(0.7), m.reveal),
                        ...typeStyle("title"),
                        fontSize: 36,
                        fontWeight: 700,
                        color: c.ink,
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {st.price}
                    </div>
                    {/* the verdict */}
                    <div
                      style={{
                        position: "absolute",
                        right: 40,
                        top: 40,
                        opacity:
                          ease(f, W(st.noteAt), m.reveal) *
                          (1 - (i === 1 ? below : 0)),
                        padding: "10px 24px",
                        borderRadius: 999,
                        background: theme.color.neutralDisc,
                        ...typeStyle("label"),
                        fontSize: 30,
                        fontWeight: 600,
                        color: c.slate,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {st.note}
                    </div>

                    {/* 5 — on B only: the fair value line, the gap, the base */}
                    {i === 1 ? (
                      <>
                        {fair > 0.001 ? (
                          <>
                            <div
                              style={{
                                position: "absolute",
                                left: 170,
                                top: BARS.base - BARS.max * st.value - 2,
                                width: 390 * fair,
                                height: 0,
                                borderTop: `4px dashed ${c.indigo}`,
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                left: 572,
                                top: BARS.base - BARS.max * st.value - 24,
                                opacity: fair,
                                ...typeStyle("label"),
                                fontSize: 30,
                                fontWeight: 600,
                                color: c.indigo,
                                whiteSpace: "nowrap",
                              }}
                            >
                              Harga wajar
                            </div>
                          </>
                        ) : null}
                        {below > 0.001 ? (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              opacity: below,
                            }}
                          >
                            <svg
                              width={PANEL.w}
                              height={PANEL.h}
                              style={{ position: "absolute", left: 0, top: 0 }}
                            >
                              {(() => {
                                const yt = BARS.base - BARS.max * st.value;
                                const yb = BARS.base - BARS.max * st.harga;
                                const x = 352;
                                return (
                                  <path
                                    d={`M ${x + 22} ${yt} Q ${x} ${yt} ${x} ${yt + 22} L ${x} ${(yt + yb) / 2 - 18} Q ${x} ${(yt + yb) / 2} ${x - 18} ${(yt + yb) / 2} Q ${x} ${(yt + yb) / 2} ${x} ${(yt + yb) / 2 + 18} L ${x} ${yb - 22} Q ${x} ${yb} ${x + 22} ${yb}`}
                                    fill="none"
                                    stroke={c.indigo}
                                    strokeWidth={4}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                );
                              })()}
                            </svg>
                            <div
                              style={{
                                position: "absolute",
                                left: 560,
                                top:
                                  (2 * BARS.base -
                                    BARS.max * (st.value + st.harga)) /
                                    2 +
                                  6,
                                padding: "10px 26px",
                                borderRadius: 999,
                                background: theme.color.indigoWashSolid,
                                boxShadow: `inset 0 0 0 3px ${c.indigo}`,
                                ...typeStyle("title"),
                                fontSize: 38,
                                fontWeight: 700,
                                color: c.indigo,
                                whiteSpace: "nowrap",
                              }}
                            >
                              Murah
                            </div>
                          </div>
                        ) : null}
                        {base > 0.001 ? (
                          <div
                            style={{
                              position: "absolute",
                              left: 400,
                              top: 560,
                              display: "flex",
                              gap: 12,
                              opacity: base,
                              transform: `translateY(${((1 - base) * 12).toFixed(1)}px)`,
                            }}
                          >
                            {GETS.slice(0, 2).map((k) => (
                              <div
                                key={k.text}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  height: 56,
                                  padding: "0 18px",
                                  borderRadius: 999,
                                  background: theme.color.indigoWashSolid,
                                  boxShadow: `inset 0 0 0 2px ${c.indigo}`,
                                }}
                              >
                                <Glyph
                                  icon={k.icon}
                                  size={28}
                                  tone={c.indigo}
                                />
                                <div
                                  style={{
                                    ...typeStyle("label"),
                                    fontSize: 26,
                                    fontWeight: 600,
                                    color: c.indigo,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {k.text} ✓
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            </div>
          );
        })}

        {/* the flying words: Price → Harga, Value → Value; headers, then the legend */}
        {[0, 1].map((i) => {
          if (f < flyAt[i]) return null;
          const h = head(i);
          const legend = toLegend[i];
          const label = i === 0 ? (h.fly > 0.5 ? "Harga" : "Price") : "Value";
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: h.x,
                top: h.y,
                transform: "translate(-50%, -50%)",
                opacity: 1 - aGrey,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: legend > 0.5 ? "8px 22px" : 0,
                borderRadius: 999,
                background: legend > 0.5 ? c.cardBg : undefined,
                boxShadow:
                  legend > 0.5
                    ? `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`
                    : undefined,
              }}
            >
              {legend > 0.5 ? (
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: i === 0 ? c.slate : c.indigo,
                  }}
                />
              ) : null}
              <div
                style={{
                  ...typeStyle("title"),
                  fontSize: h.size,
                  fontWeight: 600,
                  fontStyle: h.fly < 0.3 ? "italic" : "normal",
                  color: i === 0 ? c.ink : c.indigo,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </Interactive.Div>
    </Stage>
  );
};
