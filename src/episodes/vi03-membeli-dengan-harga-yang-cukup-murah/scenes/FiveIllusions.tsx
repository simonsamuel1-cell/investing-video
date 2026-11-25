/**
 * VI03 · SC07 — "Lima Ilusi", from the ChatGPT storyboard docs/vi-style/storyboards/VI03-SC07.png, in VI02's look: the rail
 * 1–5 at the left and ONE big card at the right (Simon preferred this layout in VI02 SC07).
 *
 *  A  "Ada lima ilusi": the title and five numbered dots.
 *  1  "Pertama": a good story — "Harga berapa pun, beli saja." in a dashed text box; the line under it.
 *  2  "Kedua": a price fallen 50% from its peak — not automatically a 50% discount; compare with the business, not the peak.
 *  3  "Ketiga": PE, profit and value all falling — "Jebakan nilai".
 *  4  "Keempat": dividends rising to the top of the cycle, next year "?".
 *  5  "Dan yang kelima": "Paling sering"; the BBCA buyer at ±Rp11.000 (−44%, SC05); the closing line.
 *
 * The small charts are shapes, no figures on them, except BBCA's result (data/bbca.ts).
 */
import {
  AppearE as Appear,
  CardE as Card,
  LineE as Line,
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
import { BBCA_RESULT } from "../data/bbca";
import { BLOCK } from "../data/timing";
import {
  BoardGrid,
  DashBox,
  Glyph,
  Ring,
  Shot,
  ease,
  useWords,
} from "../components/kit";

const CX = theme.canvas.width / 2;

// the rail and the card
const RAIL = { x: 210, y0: 250, gap: 140, d: 84 };
const CARD = { x: 340, y: 190, w: 1420, h: 690 };
const IN = { x: CARD.x + 60, w: CARD.w - 120 };
const TITLES = [
  "Cerita bisnisnya terlalu bagus",
  "Harganya sudah turun banyak",
  "Rasio makin rendah, bisnis makin buruk",
  "Dividen tinggi",
  "Perusahaan bagus, beli dan simpan",
] as const;
const STARTS = [
  "Pertama",
  "Kedua",
  "Ketiga",
  "Keempat",
  "Dan yang kelima",
] as const;

/** A path through 0–1 points inside a box (y = 1 at the top), drawn up to `p`. */
const Spark = ({
  x,
  y,
  w,
  h,
  pts,
  p,
  tone,
  width = 5,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  pts: number[];
  p: number;
  tone: string;
  width?: number;
}) => {
  const xy = pts.map(
    (v, i) => [x + (i / (pts.length - 1)) * w, y + (1 - v) * h] as const,
  );
  const n = Math.max(1, Math.round(p * (xy.length - 1)));
  const d = xy
    .slice(0, n + 1)
    .map(([a, b], i) => `${i ? "L" : "M"} ${a.toFixed(1)} ${b.toFixed(1)}`)
    .join(" ");
  return p > 0.001 ? (
    <path
      d={d}
      fill="none"
      stroke={tone}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ) : null;
};

/** A row of falling bars with its label, in a small card. */
const Falling = ({
  x,
  y,
  label,
  p,
  lit,
}: {
  x: number;
  y: number;
  label: string;
  p: number;
  lit: number;
}) => {
  const c = usePalette();
  const shadow = useShadow();
  const H = [1, 0.8, 0.62, 0.46, 0.32];
  const W0 = 300;
  const H0 = 250;
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + (1 - p) * 14,
        width: W0,
        height: H0 + 70,
        opacity: p,
      }}
    >
      <Card
        x={0}
        y={0}
        w={W0}
        h={H0 + 70}
        style={{ boxShadow: lit > 0.5 ? shadow.glow : shadow.soft }}
      >
        <Ring p={lit} tone={c.indigo} />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: W0,
            top: 20,
            textAlign: "center",
            ...typeStyle("title"),
            fontSize: 38,
            fontWeight: 600,
            color: c.ink,
          }}
        >
          {label}
        </div>
        {H.map((h, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 40 + i * 46,
              top: H0 + 30 - h * 150,
              width: 32,
              height: h * 150,
              borderRadius: 8,
              background:
                i === H.length - 1 ? c.indigo : theme.color.indigoWashDeepSolid,
            }}
          />
        ))}
        <div style={{ position: "absolute", right: 26, top: 20 }}>
          <Glyph icon="trend-down" size={40} tone={c.indigo} />
        </div>
      </Card>
    </div>
  );
};

export const SC07 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(7, BLOCK.SC07);
  const g = f + BLOCK.SC07;

  const at = STARTS.map((s) => W(s));
  const active = at.reduce((k, a, i) => (f >= a ? i : k), -1);

  // 2
  const fall = ease(f, W("turun 50%"), m.sec(1.2));
  const vsPeak = ease(f, W("Yang harus"), m.reveal);
  const vsValue = ease(f, W("Tapi: harga"), m.reveal);

  // 4
  const divGrow = ease(f, W("Dividen yang besar"), m.sec(1.2));
  const peak = ease(f, W("siklus bisnis"), m.pop);
  const next = ease(f, W("tahun depan"), m.reveal);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — five illusions */}
      <Shot start={-1} to={at[0]} block={BLOCK.SC07} cutIn={false}>
        <Appear at={-m.reveal} style={{ left: 0, top: 0 }}>
          <Line
            x={160}
            y={380}
            w={1600}
            text="Lima ilusi “murah”"
            mark="“murah”"
            size={96}
            align="center"
            weight={700}
          />
        </Appear>
        {[0, 1, 2, 3, 4].map((i) => (
          <Appear
            key={i}
            at={W("lima ilusi") + i * m.sec(0.15)}
            style={{
              left: CX - 2 * 150 + i * 150 - 45,
              top: 540,
              width: 90,
              height: 90,
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 999,
                background: c.cardBg,
                boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.indigo}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...typeStyle("title"),
                fontSize: 44,
                fontWeight: 700,
                color: c.indigo,
              }}
            >
              {i + 1}
            </div>
          </Appear>
        ))}
      </Shot>

      {/* 1–5 — the rail and the card */}
      <Shot start={at[0]} to={1e6} block={BLOCK.SC07} cutOut={false}>
        {/* the rail */}
        <svg
          width={theme.canvas.width}
          height={theme.canvas.height}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <line
            x1={RAIL.x}
            y1={RAIL.y0}
            x2={RAIL.x}
            y2={RAIL.y0 + 4 * RAIL.gap}
            stroke={theme.color.skeleton}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>
        {[0, 1, 2, 3, 4].map((i) => {
          const lit = active === i ? ease(f, at[i], m.pop) : i < active ? 0 : 0;
          const done = i < active;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: RAIL.x - RAIL.d / 2,
                top: RAIL.y0 + i * RAIL.gap - RAIL.d / 2,
                width: RAIL.d,
                height: RAIL.d,
                borderRadius: 999,
                background: lit > 0.5 ? c.indigo : c.cardBg,
                boxShadow: `${shadow.soft}, inset 0 0 0 3px ${done || lit > 0.5 ? c.indigo : theme.color.skeleton}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...typeStyle("title"),
                fontSize: 40,
                fontWeight: 700,
                color:
                  lit > 0.5 ? c.cardBg : done ? c.indigo : theme.color.mute,
                transform: `scale(${(1 + 0.12 * lit).toFixed(3)})`,
              }}
            >
              {i + 1}
            </div>
          );
        })}

        {/* the card, its title changing with the illusion */}
        <Card x={CARD.x} y={CARD.y} w={CARD.w} h={CARD.h} />
        {TITLES.map((t, i) => {
          const p =
            ease(f, at[i], m.reveal) *
            (i < 4 ? 1 - ease(f, at[i + 1] - m.fade, m.fade) : 1);
          return p > 0.001 ? (
            <div
              key={t}
              style={{
                position: "absolute",
                left: IN.x,
                top: CARD.y + 40,
                opacity: p,
                ...typeStyle("title"),
                fontSize: 54,
                fontWeight: 600,
                color: c.ink,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: c.indigo }}>{i + 1}. </span>
              {t}
            </div>
          ) : null;
        })}

        {/* 1 — the story */}
        {active === 0 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1 - ease(f, at[1] - m.fade, m.fade),
            }}
          >
            <Appear
              at={at[0] + m.sec(0.3)}
              style={{
                left: IN.x + 40,
                top: CARD.y + 190,
                width: 200,
                height: 200,
              }}
            >
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 999,
                  background: theme.color.indigoWashSolid,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph icon="sparkle" size={110} tone={c.indigo} />
              </div>
            </Appear>
            <DashBox
              cx={IN.x + 760}
              y={CARD.y + 190}
              w={760}
              h={200}
              at={W("Harga berapa")}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...typeStyle("title"),
                  fontSize: 50,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                “Harga berapa pun, beli saja.”
              </div>
            </DashBox>
            <Appear at={W("Padahal cerita")} style={{ left: 0, top: 0 }}>
              <Line
                x={IN.x}
                y={CARD.y + 520}
                w={IN.w}
                text="Cerita bagus bukan berarti semua harga layak."
                mark="bukan berarti"
                size={48}
                align="center"
                weight={500}
              />
            </Appear>
          </div>
        ) : null}

        {/* 2 — fallen 50% */}
        {active === 1 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1 - ease(f, at[2] - m.fade, m.fade),
            }}
          >
            <svg
              width={theme.canvas.width}
              height={theme.canvas.height}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <line
                x1={IN.x + 20}
                y1={CARD.y + 560}
                x2={IN.x + 560}
                y2={CARD.y + 560}
                stroke={theme.color.skeleton}
                strokeWidth={3}
              />
              <Spark
                x={IN.x + 20}
                y={CARD.y + 220}
                w={540}
                h={320}
                pts={[0.62, 0.78, 0.9, 1, 0.86, 0.7, 0.66, 0.55, 0.5]}
                p={ease(f, at[1], m.sec(0.8)) * 0.4 + fall * 0.6}
                tone={c.indigo}
              />
            </svg>
            <Appear at={at[1] + m.sec(0.5)} style={{ left: 0, top: 0 }}>
              <WordPill
                x={IN.x + 20 + 540 * 0.375}
                y={CARD.y + 180}
                text="Tertinggi"
                size={30}
              />
            </Appear>
            <Appear
              at={W("turun 50%") + m.sec(1)}
              style={{ left: IN.x + 470, top: CARD.y + 410 }}
            >
              <div
                style={{
                  ...typeStyle("title"),
                  fontSize: 64,
                  fontWeight: 700,
                  color: theme.color.crossRed,
                }}
              >
                −50%
              </div>
            </Appear>
            <Appear at={W("diskon 50%")} style={{ left: 0, top: 0 }}>
              <Interactive.Div
                name="Bukan otomatis diskon 50%"
                style={{
                  position: "absolute",
                  left: IN.x + 680,
                  top: CARD.y + 210,
                  padding: "12px 30px",
                  borderRadius: 999,
                  background: theme.color.neutralDisc,
                  fontFamily: typeStyle("label").fontFamily,
                  letterSpacing: typeStyle("label").letterSpacing,
                  lineHeight: typeStyle("label").lineHeight,
                  fontSize: 36,
                  fontWeight: 600,
                  color: c.slate,
                  whiteSpace: "nowrap",
                }}
              >
                Bukan otomatis diskon 50%
              </Interactive.Div>
            </Appear>
            {[
              {
                text: "Harga sekarang vs harga tertinggi",
                p: vsPeak,
                grey: vsValue,
              },
              { text: "Harga sekarang vs nilai bisnis", p: vsValue, grey: 0 },
            ].map((k, i) =>
              k.p > 0.001 ? (
                <div
                  key={k.text}
                  style={{
                    position: "absolute",
                    left: IN.x + 680,
                    top: CARD.y + 340 + i * 150 + (1 - k.p) * 14,
                    width: 620,
                    height: 120,
                    opacity: k.p,
                  }}
                >
                  <Card
                    x={0}
                    y={0}
                    w={620}
                    h={120}
                    style={{
                      background: interpolateColors(
                        k.grey,
                        [0, 1],
                        [c.cardBg, theme.color.neutralDisc],
                      ),
                      boxShadow: i === 1 ? shadow.glow : shadow.soft,
                    }}
                  >
                    {i === 1 ? <Ring p={1} tone={c.indigo} /> : null}
                    <div
                      style={{
                        position: "absolute",
                        left: 30,
                        top: 60,
                        transform: "translateY(-50%)",
                        ...typeStyle("label"),
                        fontSize: 32,
                        fontWeight: 600,
                        color:
                          i === 1
                            ? c.indigo
                            : interpolateColors(
                                k.grey,
                                [0, 1],
                                [c.ink, theme.color.mute],
                              ),
                        whiteSpace: "nowrap",
                      }}
                    >
                      {k.text}
                    </div>
                  </Card>
                </div>
              ) : null,
            )}
          </div>
        ) : null}

        {/* 3 — cheaper and cheaper, worse and worse */}
        {active === 2 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1 - ease(f, at[3] - m.fade, m.fade),
            }}
          >
            <Falling
              x={IN.x + 120}
              y={CARD.y + 160}
              label="PE"
              p={ease(f, W("rasio valuasinya"), m.reveal)}
              lit={
                ease(f, W("rasio valuasinya"), m.pop) *
                (1 - ease(f, W("laba terus"), m.pop))
              }
            />
            <Falling
              x={IN.x + 520}
              y={CARD.y + 160}
              label="Laba"
              p={ease(f, W("laba terus"), m.reveal)}
              lit={
                ease(f, W("laba terus"), m.pop) *
                (1 - ease(f, W("nilai perusahaannya"), m.pop))
              }
            />
            <Falling
              x={IN.x + 920}
              y={CARD.y + 160}
              label="Nilai"
              p={ease(f, W("nilai perusahaannya"), m.reveal)}
              lit={
                ease(f, W("nilai perusahaannya"), m.pop) *
                (1 - ease(f, W("jebakan nilai"), m.pop))
              }
            />
            <Appear
              at={W("bukan kesempatan")}
              style={{ left: IN.x + 120, top: CARD.y + 560 }}
            >
              <div
                style={{
                  padding: "10px 26px",
                  borderRadius: 999,
                  background: theme.color.neutralDisc,
                  ...typeStyle("label"),
                  fontSize: 32,
                  fontWeight: 600,
                  color: c.slate,
                  whiteSpace: "nowrap",
                }}
              >
                Bukan kesempatan
              </div>
            </Appear>
            <Appear at={W("jebakan nilai")} style={{ left: 0, top: 0 }}>
              <Interactive.Div
                name="Jebakan nilai"
                style={{
                  position: "absolute",
                  left: IN.x + IN.w - 380,
                  top: CARD.y + 590,
                  transform: "translate(-50%, -50%)",
                  padding: "16px 56px",
                  borderRadius: 999,
                  background: c.cardBg,
                  boxShadow: `${shadow.glow}, inset 0 0 0 3px ${c.indigo}`,
                  fontFamily: typeStyle("title").fontFamily,
                  letterSpacing: typeStyle("title").letterSpacing,
                  lineHeight: typeStyle("title").lineHeight,
                  fontSize: 58,
                  fontWeight: 700,
                  color: c.indigo,
                  whiteSpace: "nowrap",
                }}
              >
                Jebakan nilai
              </Interactive.Div>
            </Appear>
          </div>
        ) : null}

        {/* 4 — a dividend at the top of the cycle */}
        {active === 3 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 1 - ease(f, at[4] - m.fade, m.fade),
            }}
          >
            {[0.35, 0.5, 0.7, 1].map((h, i) => {
              const p = Math.min(1, Math.max(0, divGrow * 4 - i));
              const x = IN.x + 120 + i * 170;
              const lit = i === 3 ? peak : 0;
              return p > 0.001 ? (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x,
                    top: CARD.y + 600 - h * 340 * p,
                    width: 120,
                    height: h * 340 * p,
                    borderRadius: 18,
                    background:
                      i === 3 ? c.indigo : theme.color.indigoWashDeepSolid,
                    boxShadow: lit > 0.5 ? shadow.glow : undefined,
                  }}
                />
              ) : null;
            })}
            <Appear
              at={W("Dividen yang besar")}
              style={{ left: IN.x + 120, top: CARD.y + 620 }}
            >
              <div
                style={{
                  ...typeStyle("label"),
                  fontSize: 32,
                  fontWeight: 600,
                  color: c.slate,
                }}
              >
                Dividen
              </div>
            </Appear>
            <Appear at={W("siklus bisnis")} style={{ left: 0, top: 0 }}>
              <WordPill
                x={IN.x + 120 + 3 * 170 + 60}
                y={CARD.y + 220}
                text="Puncak siklus"
                size={32}
              />
            </Appear>
            {next > 0.001 ? (
              <Interactive.Div
                name="Objek"
                style={{
                  position: "absolute",
                  left: IN.x + 120 + 4 * 170,
                  top: CARD.y + 600 - 0.6 * 340,
                  width: 120,
                  height: 0.6 * 340,
                  borderRadius: 18,
                  border: `4px dashed ${c.indigo}`,
                  boxSizing: "border-box",
                  background: c.cardBg,
                  opacity: next,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: typeStyle("title").fontFamily,
                  letterSpacing: typeStyle("title").letterSpacing,
                  lineHeight: typeStyle("title").lineHeight,
                  fontSize: 60,
                  fontWeight: 700,
                  color: c.indigo,
                }}
              >
                ?
              </Interactive.Div>
            ) : null}
            <Appear
              at={W("tahun depan")}
              style={{
                left: IN.x + 120 + 4 * 170 - 30,
                top: CARD.y + 620,
                width: 180,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  ...typeStyle("label"),
                  fontSize: 32,
                  fontWeight: 600,
                  color: c.indigo,
                  whiteSpace: "nowrap",
                }}
              >
                Tahun depan
              </div>
            </Appear>
            <Appear
              at={W("nggak otomatis", 1)}
              style={{ left: IN.x + 780, top: CARD.y + 300 }}
            >
              <div
                style={{
                  padding: "12px 30px",
                  borderRadius: 999,
                  background: theme.color.neutralDisc,
                  ...typeStyle("label"),
                  fontSize: 32,
                  fontWeight: 600,
                  color: c.slate,
                  whiteSpace: "nowrap",
                }}
              >
                Dividen besar belum tentu murah
              </div>
            </Appear>
          </div>
        ) : null}

        {/* 5 — a good company, bought at any price */}
        {active === 4 ? (
          <div style={{ position: "absolute", inset: 0 }}>
            <Appear
              at={W("paling sering")}
              style={{ left: CARD.x + CARD.w - 330, top: CARD.y + 46 }}
            >
              <div
                style={{
                  padding: "10px 28px",
                  borderRadius: 999,
                  background: theme.color.indigoWashSolid,
                  boxShadow: `inset 0 0 0 2px ${c.indigo}`,
                  ...typeStyle("label"),
                  fontSize: 32,
                  fontWeight: 600,
                  color: c.indigo,
                  whiteSpace: "nowrap",
                }}
              >
                Paling sering
              </div>
            </Appear>
            <DashBox
              cx={IN.x + IN.w / 2}
              y={CARD.y + 170}
              w={900}
              h={150}
              at={W("perusahaannya sangat")}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...typeStyle("title"),
                  fontSize: 46,
                  fontWeight: 500,
                  fontStyle: "italic",
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                “Perusahaan bagus, beli lalu simpan.”
              </div>
            </DashBox>
            <Appear
              at={W("Ingat investor")}
              style={{
                left: IN.x + IN.w / 2 - 300,
                top: CARD.y + 360,
                width: 600,
                height: 150,
              }}
            >
              <Card x={0} y={0} w={600} h={150}>
                <Interactive.Div
                  name="BBCA"
                  style={{
                    position: "absolute",
                    left: 36,
                    top: 30,
                    fontFamily: typeStyle("title").fontFamily,
                    letterSpacing: typeStyle("title").letterSpacing,
                    lineHeight: typeStyle("title").lineHeight,
                    fontSize: 40,
                    fontWeight: 700,
                    color: c.ink,
                  }}
                >
                  BBCA
                </Interactive.Div>
                <Interactive.Div
                  name="Beli ±Rp11.000"
                  style={{
                    position: "absolute",
                    left: 36,
                    top: 88,
                    fontFamily: typeStyle("label").fontFamily,
                    letterSpacing: typeStyle("label").letterSpacing,
                    lineHeight: typeStyle("label").lineHeight,
                    fontSize: 30,
                    fontWeight: 500,
                    color: c.slate,
                    whiteSpace: "nowrap",
                  }}
                >
                  Beli ±Rp11.000
                </Interactive.Div>
                <Interactive.Div
                  name="Objek"
                  style={{
                    position: "absolute",
                    right: 40,
                    top: 75,
                    transform: "translateY(-50%)",
                    fontFamily: typeStyle("title").fontFamily,
                    letterSpacing: typeStyle("title").letterSpacing,
                    lineHeight: typeStyle("title").lineHeight,
                    fontSize: 72,
                    fontWeight: 700,
                    color: theme.color.crossRed,
                  }}
                >
                  −{-BBCA_RESULT.high}%
                </Interactive.Div>
              </Card>
            </Appear>
            <Appear at={W("Tapi: perusahaan")} style={{ left: 0, top: 0 }}>
              <Line
                x={IN.x}
                y={CARD.y + 600}
                w={IN.w}
                text="Perusahaan bagus juga harus dibeli cukup murah."
                mark="cukup murah"
                size={50}
                align="center"
                weight={600}
              />
            </Appear>
          </div>
        ) : null}
      </Shot>
    </Stage>
  );
};
