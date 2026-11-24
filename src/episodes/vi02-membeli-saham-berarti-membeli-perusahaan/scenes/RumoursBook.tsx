/**
 * VI02 · SC05 — "Kalau Cuma Tahu Kodenya, Semua Rumor Terasa Penting" in VI01's look (Simon 13 Nov: "revamp visual untuk
 * scene 5-8"), from the ChatGPT storyboard docs/vi-style/storyboards/VI02-SC05-v3.png. The old scene is scenes/Rumours.tsx
 * (VI01_LOOK = false).
 *
 *  A  "Sekarang bayangkan kebalikannya. Seseorang…": the investor (black line art in VI01's style, ChatGPT 13 Nov,
 *     public/art/vi02/investor: tenang, senang, panik, lesu) with his phone; "Seseorang membeli saham": a card with nothing
 *     but ABCD, its candles drawn on "kode dan chart-nya". ABCD is not a real code (V01: "Contoh saham jangan gunakan ICBP") and its tape is a shape.
 *  B  the three weeks: each message comes in as a chat bubble under its week; his pose and the pill over him change on his
 *     reaction (Tambah posisi → Panik → Jual rugi), the candles climb, then fall, an arrow over each week's move (Simon 16 Nov:
 *     up green, then down red twice).
 *  C  "Masalah utamanya bukan karena rumor selalu salah" (a cut): the three messages small in a row, Simon's line under them,
 *     and on "Rumor bisa benar, bisa juga salah" a tick, a cross and a question mark.
 *  D  "Masalahnya adalah" (a cut): one card headed by Simon's line "Masalahnya: ngga punya standar penilaian" (16 Nov, in
 *     place of "Buku bisnis" and its icon), its three rows coming in on their sentences, each a "?".
 *  E  "Bandingkan dengan Ibu Sari" (a cut): VI01's frame, warung and Ibu Sari (as in SC03); the rumour comes in at the frame's
 *     edge, her supplier book opens, its rows are checked one by one, and she answers.
 *  F  "Semakin kita memahami bisnis" (a cut): messages flow into the "Buku bisnis", now filled, and come out sorted: a short
 *     lit stack "Penting" and a tall grey one "Cuma bikin bereaksi".
 */
import { Line as Line_ } from "../components/kit";
import type React from "react";
import { Handle, NDiv, Keyed } from "../../../core/nudge";
import {
  Pic as Pic_,
  Appear as Appear_,
  WordPill as WordPill_,
  Card as Card_,
} from "../components/kit";
import { CardE as Card, FigureE as Figure } from "../../../editable";
import {
  interpolateColors,
  random,
  staticFile,
  useCurrentFrame,
  Easing,
  interpolate,
  Interactive,
} from "remotion";
import {
  Candles,
  SoftGround,
  SourceTag,
  Stage,
  gridOf,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
  type Bar,
} from "../../../core";
import { BLOCK } from "../data/timing";
import {
  BoardGrid,
  Glyph,
  GrowArrow,
  Shot,
  ease,
  useWords,
} from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const R = theme.shape.cardRadius;

// A–B — the investor, his card, the messages
const POSES = {
  tenang: { src: "art/vi02/investor/tenang.png", w: 248, h: 835 },
  senang: { src: "art/vi02/investor/senang.png", w: 278, h: 840 },
  panik: { src: "art/vi02/investor/panik.png", w: 572, h: 1412 },
  lesu: { src: "art/vi02/investor/lesu.png", w: 273, h: 834 },
} as const;
type Pose = keyof typeof POSES;
const MAN = { cx: 330, floor: 880, h: 560 };
const PILL_Y = MAN.floor - MAN.h - 56;
/** The card: wide and centred until the first message, then it makes room at the right. */
const TAPE = {
  y: 250,
  h: 520,
  x0: 640,
  w0: 760,
  x1: 590,
  w1: 600,
  pad: 40,
  head: 130,
  code: 64,
  bars: 34,
  noise: 0.06,
};
/** The tape's shape, week by week: quiet, up on the first message, down on the next two. */
const SHAPE = [
  0.46, 0.5, 0.45, 0.52, 0.48, 0.55, 0.5, 0.56, 0.72, 0.68, 0.84, 0.8, 0.9,
  0.62, 0.66, 0.46, 0.5, 0.3, 0.36, 0.16, 0.2, 0.06,
];
const REACH = [8, 12, 17, 21];
/**
 * Each week's move, as an arrow beside its candles (Simon 16 Nov): up on the first message (green), down on the second and the
 * third (red). From one REACH point of the shape to the next, lifted off the candles, growing as they come in.
 */
const TRENDS = [
  { from: 8, to: 12, up: true },
  { from: 12, to: 17, up: false },
  { from: 17, to: 21, up: false },
] as const;
/** `lift`: how far the arrow stands off its candles, square to its own direction (up-left of a rise, up-right of a fall) */
const TREND = { lift: 62, stroke: 7, head: 20, trim: 0.12 };
/** the red (falling) arrows, moved up 10 px and right 10 px (Simon 16 Nov: first 15, then "bukan 15 px tapi 10 px") */
const FALL_SHIFT = { x: 10, y: -10 };
const shapeAt = (t: number) => {
  const i = Math.min(Math.floor(t), SHAPE.length - 2);
  return SHAPE[i] + (SHAPE[i + 1] - SHAPE[i]) * (t - i);
};
const TAPE_BARS = Array.from({ length: TAPE.bars }).reduce<Bar[]>(
  (bars, _, i) => {
    const o = bars.length ? bars[bars.length - 1].c : SHAPE[0];
    const c =
      shapeAt((i / (TAPE.bars - 1)) * (SHAPE.length - 1)) +
      (random(`abcd-close-${i}`) - 0.5) * TAPE.noise;
    return [
      ...bars,
      {
        o,
        c,
        h: Math.max(o, c) + random(`abcd-high-${i}`) * TAPE.noise,
        l: Math.min(o, c) - random(`abcd-low-${i}`) * TAPE.noise,
      },
    ];
  },
  [],
);

/**
 * "hanya ilustrasi" under the chart card, left-aligned with it (Simon 16 Nov, his words and case — an exception he asked for
 * to the no-"Ilustrasi" rule), set as VI01's: an indigo dot and the words.
 */
const TAG = { dot: 14, gap: 12, size: 26, below: 18 };

const BUB = { x: 1250, w: 510, y: 360, h: 230, chipY: 312, size: 40 };
const WEEKS = [
  {
    week: "Minggu 1",
    said: "Katanya mau diakuisisi investor asing",
    then: "Tambah posisi",
    sign: "+",
    tone: theme.color.ok,
    pose: "senang",
    at: "Minggu pertama",
    saidAt: "Katanya perusahaan",
    thenAt: "Dia langsung menambah",
  },
  {
    week: "Minggu 2",
    said: "Pemegang saham besar mulai jual",
    then: "Panik",
    sign: "!",
    tone: theme.color.crossRed,
    pose: "panik",
    at: "Minggu berikutnya",
    saidAt: "Pemegang saham",
    thenAt: "Dia mulai panik",
  },
  {
    week: "Minggu 3",
    said: "Laporan keuangan bermasalah, bisa delisting",
    then: "Jual rugi",
    sign: "−",
    tone: theme.color.crossRed,
    pose: "lesu",
    at: "Lalu muncul",
    saidAt: "Laporan keuangannya",
    thenAt: "Dia langsung menjual",
  },
] as const;
const inRadius = `${R}px ${R}px ${R}px 6px`;

// C — the three again
const MINI = {
  w: 470,
  h: 210,
  gap: 50,
  y: 330,
  chipY: 284,
  size: 34,
  badge: 76,
  badgeY: 620,
  line: 790,
};
const miniX = (i: number) =>
  CX - (3 * MINI.w + 2 * MINI.gap) / 2 + i * (MINI.w + MINI.gap);

// D — the empty book
/**
 * D's card: Simon's line is its heading (16 Nov: "replace 'Buku bisnis' dengan 'Masalahnya: ngga…'", the book icon removed),
 * on two lines, the second all indigo ("Buat jadi 2 text line").
 */
/** as wide as the heading (Simon 16 Nov: "width kartu fit ke judul aja"): its longer line is 596 px at 44 px, plus `pad` each side */
const BOOK = { w: 680, y: 200, head: 110, rowH: 116, gap: 22, pad: 42 };
const BOOK_HEAD = 170;
const BOOK_H = BOOK_HEAD + 3 * BOOK.rowH + 2 * BOOK.gap + BOOK.pad;
const UNKNOWN = [
  { icon: "package", label: "Jual apa?", at: "perusahaan menjual" },
  { icon: "coins", label: "Income source?", at: "uangnya datang" },
  { icon: "chart-line-up", label: "Kesehatan bisnis?", at: "seberapa sehat" },
] as const;

// E — Ibu Sari's world, as in SC03
const FRAME = { x: 160, y: 190, w: 1600, h: 700, line: 3 };
const FLOOR = 722;
const WARUNG = { h: 364, cx: 760 };
const IBU = { h: 336, cx: 440 };
const RUMOUR = { x: 1130, y: 236, w: 560, h: 104 };
const SUP = { x: 1170, y: 380, w: 520, rowH: 88, gap: 14, head: 96 };
const SUP_H = SUP.head + 3 * SUP.rowH + 2 * SUP.gap + 34;
const SUPPLIERS = ["UD Makmur", "CV Sinar Jaya", "Toko Abadi"];
const REPLY = { x: 300, y: 250, w: 470, h: 104 };

// F — sorted
const SORT = {
  book: { x: 760, y: 300, w: 400 },
  lanes: [380, 500, 620],
  from: 170,
  out: 1330,
  outW: 380,
  keepY: 330,
  noiseY: 520,
};

/** A chat bubble, its tail at the bottom-left corner. */
const Bubble = ({
  x,
  y,
  w,
  h,
  text,
  size,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  size: number;
  tone?: string;
}) => {
  const c = usePalette();
  return (
    <Card
      x={x}
      y={y}
      w={w}
      h={h}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 36px",
        borderRadius: inRadius,
        background: tone ?? c.cardBg,
      }}
    >
      <div
        style={{
          ...typeStyle("title"),
          fontSize: size,
          fontWeight: 500,
          lineHeight: 1.25,
          color: c.ink,
          textWrap: "balance",
        }}
      >
        {text}
      </div>
    </Card>
  );
};

/**
 * The reaction's sign on its disc, drawn (Simon 16 Nov: the typed "+" and "−" sat off the disc's vertical centre — a font's
 * glyph box isn't centred on its stroke), so it is centred exactly.
 */
const Sign = ({ kind, tone }: { kind: "+" | "!" | "−"; tone: string }) => {
  const c = usePalette();
  return (
    <svg width={48} height={48} viewBox="0 0 48 48" style={{ flex: "none" }}>
      <circle cx={24} cy={24} r={24} fill={tone} />
      <g stroke={c.cardBg} strokeWidth={5} strokeLinecap="round">
        {kind !== "!" ? <line x1={14} y1={24} x2={34} y2={24} /> : null}
        {kind === "+" ? <line x1={24} y1={14} x2={24} y2={34} /> : null}
        {kind === "!" ? <line x1={24} y1={12} x2={24} y2={27} /> : null}
      </g>
      {kind === "!" ? <circle cx={24} cy={35} r={3.2} fill={c.cardBg} /> : null}
    </svg>
  );
};

/** A round badge: true, false, or nobody knows yet. */
const Verdict = ({
  x,
  y,
  p,
  kind,
}: {
  x: number;
  y: number;
  p: number;
  kind: "true" | "false" | "unknown";
}) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <Interactive.Div
      name="Badge"
      style={{
        position: "absolute",
        left: x - MINI.badge / 2,
        top: y - MINI.badge / 2,
        width: MINI.badge,
        height: MINI.badge,
        borderRadius: 999,
        background:
          kind === "true"
            ? theme.color.ok
            : kind === "false"
              ? theme.color.crossRed
              : c.indigo,
        opacity: p,
        transform: `scale(${(0.7 + 0.3 * p).toFixed(3)})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {kind === "unknown" ? (
        <div style={{ ...typeStyle("title"), fontSize: 42, color: c.cardBg }}>
          ?
        </div>
      ) : (
        <svg width={40} height={40} viewBox="0 0 40 40">
          <path
            d={
              kind === "true"
                ? "M 8 21 L 17 30 L 32 11"
                : "M 10 10 L 30 30 M 30 10 L 10 30"
            }
            fill="none"
            stroke={c.cardBg}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Interactive.Div>
  );
};

/** A book row: its icon on a grey disc, its label, and at the right either a "?" or a filled line. */
const BookRow = ({
  icon,
  label,
  p,
  open,
}: {
  icon: string;
  label?: string;
  p: number;
  open: boolean;
}) => {
  const c = usePalette();
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        borderRadius: 20,
        background: c.cardBg,
        boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 24px",
        opacity: p,
        transform: `translateY(${((1 - p) * 10).toFixed(1)}px)`,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          background: theme.color.neutralDisc,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "none",
        }}
      >
        <Glyph icon={icon} size={40} tone={theme.color.neutralIcon} />
      </div>
      {label ? (
        <div
          style={{
            ...typeStyle("label"),
            fontSize: 36,
            fontWeight: 600,
            color: c.ink,
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {label}
        </div>
      ) : (
        <div style={{ flex: 1 }} />
      )}
      {open ? (
        <div
          style={{
            width: 84,
            height: 72,
            borderRadius: 16,
            background: theme.color.neutralDisc,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...typeStyle("title"),
            fontSize: 44,
            color: c.indigo,
            flex: "none",
          }}
        >
          ?
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flex: "none",
          }}
        >
          <div
            style={{
              width: 150,
              height: 12,
              borderRadius: 6,
              background: c.indigo,
            }}
          />
          <div
            style={{
              width: 100,
              height: 12,
              borderRadius: 6,
              background: theme.color.skeleton,
            }}
          />
        </div>
      )}
    </div>
  );
};

export const SC05 = () => {
  const f = useCurrentFrame();
  const frame = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(5, BLOCK.SC05);
  const g = f + BLOCK.SC05;

  const lineAt = W("Masalah utamanya");
  const noBasisAt = W("Masalahnya adalah");
  const sariAt = W("Bandingkan");
  const endAt = W("Semakin kita");

  // A–B
  const codeAt = W("kode dan");
  const room = ease(f, W("Minggu pertama") - m.sec(0.25), m.move);
  const tapeX = mix(TAPE.x0, TAPE.x1, room);
  const tapeW = mix(TAPE.w0, TAPE.w1, room);
  const saidAt = WEEKS.map((k) => W(k.saidAt));
  const thenAt = WEEKS.map((k) => W(k.thenAt));
  const reach = [codeAt, ...saidAt].reduce(
    (n, at, i) =>
      n + (REACH[i] - (REACH[i - 1] ?? 0)) * ease(f, at, m.sec(i ? 0.9 : 0.7)),
    0,
  );
  const tapeGrid = gridOf(
    TAPE_BARS.map((b) => b.c),
    [0, 1],
    {
      x: TAPE.pad,
      y: TAPE.head,
      w: tapeW - 2 * TAPE.pad,
      h: TAPE.h - TAPE.head - TAPE.pad,
    },
    0,
  );
  /** his pose: each one takes over on its reaction */
  const poseOf: { pose: Pose; at: number }[] = [
    { pose: "tenang", at: -1e6 },
    ...WEEKS.map((k, i) => ({ pose: k.pose as Pose, at: thenAt[i] })),
  ];

  // C
  const verdicts = [W("bisa benar"), W("bisa juga"), W("juga salah")];

  // E
  const rumourAt = W("Supplier kamu");
  const checkAt = W("cek nama");
  /** the check runs down her suppliers, one row after another, and stops past the last */
  const scan = (f - checkAt) / m.sec(0.35);

  // F
  const keepAt = W("benar-benar penting");
  const noiseAt = W("hanya membuat");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A–B: the investor, his code, the messages */}
      <Shot from={-1} to={lineAt} block={BLOCK.SC05} cutIn={false}>
        {poseOf.map((k, i) => {
          const next = poseOf[i + 1]?.at ?? 1e6;
          const p =
            (i === 0
              ? ease(f, -m.reveal, m.reveal)
              : ease(f, k.at, m.sec(0.15))) *
            (1 - ease(f, next, m.sec(0.15)));
          if (p <= 0.001) return null;
          const a = POSES[k.pose];
          const wd = (MAN.h * a.w) / a.h;
          return (
            <Pic_
              key={k.pose}
              src={staticFile(a.src)}
              style={{
                position: "absolute",
                left: MAN.cx - wd / 2,
                top: MAN.floor - MAN.h,
                width: wd,
                height: MAN.h,
                opacity: p,
              }}
            />
          );
        })}
        {((it: React.ReactNode[]) => (
          <>
            <Handle name="senang">{it[0]}</Handle>
            <Handle name="panik">{it[1]}</Handle>
            <Handle name="lesu">{it[2]}</Handle>
          </>
        ))(
          WEEKS.map((k, i) => {
            const p =
              ease(f, thenAt[i], m.reveal) *
              (i < WEEKS.length - 1
                ? 1 - ease(f, thenAt[i + 1], m.sec(0.15))
                : 1);
            return p > 0.001 ? (
              <NDiv
                key={k.then}
                style={{
                  position: "absolute",
                  left: MAN.cx,
                  top: PILL_Y + (1 - p) * 10,
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 30px 10px 12px",
                  borderRadius: 999,
                  background: c.cardBg,
                  boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`,
                  opacity: p,
                  whiteSpace: "nowrap",
                }}
              >
                <Sign kind={k.sign} tone={k.tone} />
                <div
                  style={{
                    ...typeStyle("label"),
                    fontSize: 34,
                    fontWeight: 600,
                    color: c.ink,
                  }}
                >
                  {k.then}
                </div>
              </NDiv>
            ) : null;
          }),
        )}
        <Keyed
          name="ABCD"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
            opacity: interpolate(frame, [135, 159], [0, 1], {
              easing: Easing.bezier(0.65, 0, 0.35, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Card name="ABCD" x={tapeX} y={TAPE.y} w={tapeW} h={TAPE.h}>
            <Interactive.Div
              name="ABCD"
              style={{
                position: "absolute",
                left: TAPE.pad,
                top: 36,
                fontFamily: theme.text.family,
                fontSize: TAPE.code,
                fontWeight: 700,
                letterSpacing: 1,
                color: c.indigo,
              }}
            >
              ABCD
            </Interactive.Div>
            <Candles
              bars={TAPE_BARS}
              grid={tapeGrid}
              shown={reach / (SHAPE.length - 1)}
              opacity={ease(f, codeAt, m.fade)}
            />
            <svg
              width={tapeW}
              height={TAPE.h}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                overflow: "visible",
              }}
            >
              {TRENDS.map((t, i) => {
                const p = ease(f, saidAt[i], m.sec(0.9));
                if (p <= 0.001) return null;
                const bar = (k: number) =>
                  (k / (SHAPE.length - 1)) * (TAPE.bars - 1);
                const span = t.to - t.from;
                const a0 = {
                  x: tapeGrid.x(bar(t.from + span * TREND.trim)),
                  y: tapeGrid.y(shapeAt(t.from + span * TREND.trim)),
                };
                const b0 = {
                  x: tapeGrid.x(bar(t.to - span * TREND.trim)),
                  y: tapeGrid.y(
                    t.up
                      ? Math.max(SHAPE[t.to], shapeAt(t.to - span * TREND.trim))
                      : shapeAt(t.to - span * TREND.trim),
                  ),
                };
                const ang = Math.atan2(b0.y - a0.y, b0.x - a0.x);
                const n = {
                  x: Math.sin(ang) * TREND.lift + (t.up ? 0 : FALL_SHIFT.x),
                  y: -Math.cos(ang) * TREND.lift + (t.up ? 0 : FALL_SHIFT.y),
                };
                const a = { x: a0.x + n.x, y: a0.y + n.y };
                const b = { x: b0.x + n.x, y: b0.y + n.y };
                const tip = { x: mix(a.x, b.x, p), y: mix(a.y, b.y, p) };
                const head = (d: number) =>
                  `${(tip.x - TREND.head * Math.cos(ang + d)).toFixed(1)} ${(tip.y - TREND.head * Math.sin(ang + d)).toFixed(1)}`;
                return (
                  <g
                    key={i}
                    fill="none"
                    stroke={t.up ? theme.color.ok : theme.color.crossRed}
                    strokeWidth={TREND.stroke}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1={a.x} y1={a.y} x2={tip.x} y2={tip.y} />
                    <path
                      d={`M ${head(0.6)} L ${tip.x.toFixed(1)} ${tip.y.toFixed(1)} L ${head(-0.6)}`}
                    />
                  </g>
                );
              })}
            </svg>
            <SourceTag kind="synthetic" />
          </Card>
          <Interactive.Div
            name="hanya ilustrasi"
            style={{
              position: "absolute",
              left: tapeX + 6,
              top: TAPE.y + TAPE.h + TAG.below,
              display: "flex",
              alignItems: "center",
              gap: TAG.gap,
            }}
          >
            <div
              style={{
                width: TAG.dot,
                height: TAG.dot,
                borderRadius: 999,
                background: c.indigo,
                flex: "none",
              }}
            />
            <div
              style={{
                ...typeStyle("label"),
                fontSize: TAG.size,
                fontWeight: 500,
                color: c.ink,
                whiteSpace: "nowrap",
              }}
            >
              hanya ilustrasi
            </div>
          </Interactive.Div>
        </Keyed>
        {((it: React.ReactNode[]) => (
          <>
            <Handle name="senang">{it[0]}</Handle>
            <Handle name="panik">{it[1]}</Handle>
            <Handle name="lesu">{it[2]}</Handle>
          </>
        ))(
          WEEKS.map((k, i) => {
            const out =
              i < WEEKS.length - 1 ? W(WEEKS[i + 1].at) - m.sec(0.15) : 1e6;
            return (
              <Appear_
                key={k.week}
                at={W(k.at)}
                out={out}
                style={{
                  left: 0,
                  top: 0,
                  width: theme.canvas.width,
                  height: theme.canvas.height,
                }}
              >
                <WordPill_
                  x={BUB.x + 90}
                  y={BUB.chipY}
                  text={k.week}
                  size={28}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: ease(f, saidAt[i], m.reveal),
                    transform: `translateX(${((1 - ease(f, saidAt[i], m.move)) * 40).toFixed(1)}px)`,
                  }}
                >
                  <Bubble
                    x={BUB.x}
                    y={BUB.y}
                    w={BUB.w}
                    h={BUB.h}
                    text={k.said}
                    size={BUB.size}
                  />
                </div>
              </Appear_>
            );
          }),
        )}
      </Shot>

      {/* C: the three again — any of them may be true */}
      <Shot from={lineAt} to={noBasisAt} block={BLOCK.SC05}>
        {((it: React.ReactNode[]) => (
          <>
            <Handle name="senang">{it[0]}</Handle>
            <Handle name="panik">{it[1]}</Handle>
            <Handle name="lesu">{it[2]}</Handle>
          </>
        ))(
          WEEKS.map((k, i) => (
            <Appear_
              key={k.week}
              at={lineAt + i * m.sec(0.12)}
              style={{
                left: 0,
                top: 0,
                width: theme.canvas.width,
                height: theme.canvas.height,
              }}
            >
              <WordPill_
                x={miniX(i) + 80}
                y={MINI.chipY}
                text={k.week}
                size={26}
              />
              <Bubble
                x={miniX(i)}
                y={MINI.y}
                w={MINI.w}
                h={MINI.h}
                text={k.said}
                size={MINI.size}
              />
            </Appear_>
          )),
        )}
        {(["true", "false", "unknown"] as const).map((kind, i) => (
          <Verdict
            key={kind}
            x={miniX(i) + MINI.w / 2}
            y={MINI.badgeY}
            p={ease(f, verdicts[i], m.reveal)}
            kind={kind}
          />
        ))}
        <Keyed
          name="Masalahnya bukan rumornya."
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: theme.canvas.width,
            opacity: interpolate(frame, [1603, 1627], [0, 1], {
              easing: Easing.bezier(0.65, 0, 0.35, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [1603, 1627],
              ["0px 18px", "0px 0px"],
              {
                easing: Easing.bezier(0.65, 0, 0.35, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <Line_
            x={0}
            y={MINI.line}
            w={theme.canvas.width}
            align="center"
            size={52}
            weight={500}
            text="Masalahnya bukan rumornya."
            mark="bukan rumornya"
          />
        </Keyed>
      </Shot>

      {/* D: what he can't check — an empty book */}
      <Shot from={noBasisAt} to={sariAt} block={BLOCK.SC05}>
        <Keyed
          name="Masalahnya:"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
            opacity: interpolate(frame, [1908, 1932], [0, 1], {
              easing: Easing.bezier(0.65, 0, 0.35, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Card_ x={CX - BOOK.w / 2} y={BOOK.y} w={BOOK.w} h={BOOK_H}>
            <Interactive.Div
              name="Masalahnya:"
              style={{
                position: "absolute",
                left: BOOK.pad,
                top: 30,
                ...typeStyle("title"),
                fontSize: 44,
                fontWeight: 600,
                lineHeight: 1.25,
                color: c.ink,
                whiteSpace: "nowrap",
              }}
            >
              <div>Masalahnya:</div>
              <div style={{ color: c.indigo }}>
                ngga punya standar penilaian
              </div>
            </Interactive.Div>
            {((it: React.ReactNode[]) => (
              <>
                <Handle name="Jual apa?">{it[0]}</Handle>
                <Handle name="Income source?">{it[1]}</Handle>
                <Handle name="Kesehatan bisnis?">{it[2]}</Handle>
              </>
            ))(
              UNKNOWN.map((u, i) => (
                <NDiv
                  key={u.icon}
                  style={{
                    position: "absolute",
                    left: BOOK.pad,
                    top: BOOK_HEAD + i * (BOOK.rowH + BOOK.gap),
                    width: BOOK.w - 2 * BOOK.pad,
                    height: BOOK.rowH,
                  }}
                >
                  <BookRow
                    icon={u.icon}
                    label={u.label}
                    p={ease(f, W(u.at), m.reveal)}
                    open
                  />
                </NDiv>
              )),
            )}
          </Card_>
        </Keyed>
      </Shot>

      {/* E: Ibu Sari can check */}
      <Shot from={sariAt} to={endAt} block={BLOCK.SC05}>
        <Interactive.Div
          name="Bingkai"
          style={{
            position: "absolute",
            left: FRAME.x,
            top: FRAME.y,
            width: FRAME.w,
            height: FRAME.h,
            borderRadius: R,
            background: c.cardBg,
            boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME.line}px ${c.ink}`,
          }}
        />
        <Figure name="warung" cx={WARUNG.cx} floor={FLOOR} h={WARUNG.h} />
        <Figure name="ibu-sari" cx={IBU.cx} floor={FLOOR} h={IBU.h} />
        <Keyed
          name="Ibu Sari"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            opacity: interpolate(frame, [2565, 2589], [0, 1], {
              easing: Easing.bezier(0.65, 0, 0.35, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [2565, 2589],
              ["0px 18px", "0px 0px"],
              {
                easing: Easing.bezier(0.65, 0, 0.35, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <WordPill_ x={IBU.cx} y={790} text="Ibu Sari" size={32} />
        </Keyed>
        {/* the rumour, from someone at the frame's edge */}
        <Keyed
          name="Supplier kamu mau bangkrut."
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
            opacity: interpolate(frame, [2752, 2776], [0, 1], {
              easing: Easing.bezier(0.65, 0, 0.35, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [2752, 2776],
              ["0px 18px", "0px 0px"],
              {
                easing: Easing.bezier(0.65, 0, 0.35, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${((1 - ease(f, rumourAt, m.move)) * 50).toFixed(1)}px)`,
            }}
          >
            <Card
              name="Supplier kamu mau bangkrut."
              x={RUMOUR.x}
              y={RUMOUR.y}
              w={RUMOUR.w}
              h={RUMOUR.h}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: `${R}px ${R}px 6px ${R}px`,
                background: theme.color.neutralDisc,
              }}
            >
              <div
                style={{
                  ...typeStyle("title"),
                  fontSize: 36,
                  fontWeight: 500,
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                Supplier kamu mau bangkrut.
              </div>
            </Card>
          </div>
        </Keyed>
        {/* her book of suppliers, checked row by row */}
        <Keyed
          name="Supplier"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
            opacity: interpolate(frame, [2888, 2912], [0, 1], {
              easing: Easing.bezier(0.65, 0, 0.35, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [2888, 2912],
              ["0px 18px", "0px 0px"],
              {
                easing: Easing.bezier(0.65, 0, 0.35, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <Card_ x={SUP.x} y={SUP.y} w={SUP.w} h={SUP_H}>
            <Interactive.Div
              name="Supplier"
              style={{
                position: "absolute",
                left: 34,
                top: 26,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Glyph icon="notebook" size={46} tone={c.ink} />
              <div
                style={{
                  ...typeStyle("title"),
                  fontSize: 40,
                  fontWeight: 600,
                  color: c.ink,
                }}
              >
                Supplier
              </div>
            </Interactive.Div>
            {((it: React.ReactNode[]) => (
              <>
                <Handle name="UD Makmur">{it[0]}</Handle>
                <Handle name="CV Sinar Jaya">{it[1]}</Handle>
                <Handle name="Toko Abadi">{it[2]}</Handle>
              </>
            ))(
              SUPPLIERS.map((name, i) => {
                const on =
                  Math.max(0, 1 - Math.abs(scan - i - 0.5) * 1.6) *
                  (f >= checkAt ? 1 : 0);
                const done = scan > i + 0.5 ? 1 : 0;
                return (
                  <NDiv
                    key={name}
                    style={{
                      position: "absolute",
                      left: 34,
                      top: SUP.head + i * (SUP.rowH + SUP.gap),
                      width: SUP.w - 68,
                      height: SUP.rowH,
                      borderRadius: 18,
                      background:
                        on > 0.3 ? theme.color.indigoWashSolid : c.cardBg,
                      boxShadow: `inset 0 0 0 ${on > 0.3 ? 3 : 2}px ${on > 0.3 ? c.indigo : theme.color.skeleton}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 26px",
                    }}
                  >
                    <div
                      style={{
                        ...typeStyle("label"),
                        fontSize: 34,
                        fontWeight: 600,
                        color: c.ink,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {name}
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        background: theme.color.ok,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: theme.text.family,
                        fontWeight: 700,
                        fontSize: 22,
                        color: c.cardBg,
                        opacity: done,
                        transform: `scale(${(0.7 + 0.3 * done).toFixed(2)})`,
                      }}
                    >
                      ✓
                    </div>
                  </NDiv>
                );
              }),
            )}
          </Card_>
        </Keyed>
        {/* her answer */}
        <Keyed
          name="Itu bukan supplier saya."
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
            opacity: interpolate(frame, [3074, 3098], [0, 1], {
              easing: Easing.bezier(0.65, 0, 0.35, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [3074, 3098],
              ["0px 18px", "0px 0px"],
              {
                easing: Easing.bezier(0.65, 0, 0.35, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <Card_
            x={REPLY.x}
            y={REPLY.y}
            w={REPLY.w}
            h={REPLY.h}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: inRadius,
              boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.indigo}`,
            }}
          >
            <div
              style={{
                ...typeStyle("title"),
                fontSize: 36,
                fontWeight: 600,
                color: c.indigo,
                whiteSpace: "nowrap",
              }}
            >
              Itu bukan supplier saya.
            </div>
          </Card_>
        </Keyed>
      </Shot>

      {/* F: what understanding does — the messages come out sorted */}
      <Shot from={endAt} to={1e6} block={BLOCK.SC05} cutOut={false}>
        {Array.from({ length: 9 }, (_, i) => {
          const at = endAt + m.sec(0.3) + i * m.sec(0.42);
          const t = ease(f, at, m.sec(1));
          if (t <= 0.001 || t >= 0.999) return null;
          const y = SORT.lanes[i % 3];
          const x = mix(SORT.from, SORT.book.x - 40, t);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 70,
                top: y - 34,
                width: 140,
                height: 68,
                borderRadius: `${R}px ${R}px ${R}px 6px`,
                background: c.cardBg,
                boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                opacity: Math.min(1, t * 6, (1 - t) * 6),
              }}
            >
              {((it: React.ReactNode[]) => (
                <>
                  <Handle name="Objek 1">{it[0]}</Handle>
                  <Handle name="Objek 2">{it[1]}</Handle>
                  <Handle name="Objek 3">{it[2]}</Handle>
                </>
              ))(
                [0, 1, 2].map((d) => (
                  <NDiv
                    key={d}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: theme.color.neutralIcon,
                    }}
                  />
                )),
              )}
            </div>
          );
        })}
        <Keyed
          name="Buku bisnis"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
            opacity: interpolate(frame, [3190, 3214], [0, 1], {
              easing: Easing.bezier(0.65, 0, 0.35, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Card_
            x={SORT.book.x}
            y={SORT.book.y}
            w={SORT.book.w}
            h={BOOK.head + 3 * 96 + 2 * 16 + 30}
          >
            <Interactive.Div
              name="Buku bisnis"
              style={{
                position: "absolute",
                left: 30,
                top: 30,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <Glyph icon="book-open" size={46} tone={c.ink} />
              <div
                style={{
                  ...typeStyle("title"),
                  fontSize: 38,
                  fontWeight: 600,
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                Buku bisnis
              </div>
            </Interactive.Div>
            {((it: React.ReactNode[]) => (
              <>
                <Handle name="Jual apa?">{it[0]}</Handle>
                <Handle name="Income source?">{it[1]}</Handle>
                <Handle name="Kesehatan bisnis?">{it[2]}</Handle>
              </>
            ))(
              UNKNOWN.map((u, i) => (
                <NDiv
                  key={u.icon}
                  style={{
                    position: "absolute",
                    left: 30,
                    top: BOOK.head - 10 + i * 112,
                    width: SORT.book.w - 60,
                    height: 96,
                  }}
                >
                  <BookRow icon={u.icon} p={1} open={false} />
                </NDiv>
              )),
            )}
          </Card_>
        </Keyed>
        <GrowArrow
          x0={SORT.book.x + SORT.book.w + 16}
          y0={SORT.keepY + 50}
          x1={SORT.out - 16}
          y1={SORT.keepY + 50}
          p={ease(f, keepAt - m.sec(0.25), m.sec(0.3))}
        />
        <Keyed
          name="Penting"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            opacity: interpolate(frame, [3401, 3425], [0, 1], {
              easing: Easing.bezier(0.65, 0, 0.35, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [3401, 3425],
              ["0px 18px", "0px 0px"],
              {
                easing: Easing.bezier(0.65, 0, 0.35, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          <Card_
            x={SORT.out}
            y={SORT.keepY}
            w={SORT.outW}
            h={100}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.indigo}`,
            }}
          >
            <div
              style={{
                ...typeStyle("title"),
                fontSize: 40,
                fontWeight: 600,
                color: c.indigo,
              }}
            >
              Penting
            </div>
          </Card_>
        </Keyed>
        <GrowArrow
          x0={SORT.book.x + SORT.book.w + 16}
          y0={SORT.noiseY + 90}
          x1={SORT.out - 16}
          y1={SORT.noiseY + 90}
          p={ease(f, noiseAt - m.sec(0.25), m.sec(0.3))}
        />
        <Keyed
          name="Cuma bikin"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            opacity: interpolate(frame, [3531, 3555], [0, 1], {
              easing: Easing.bezier(0.65, 0, 0.35, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [3531, 3555],
              ["0px 18px", "0px 0px"],
              {
                easing: Easing.bezier(0.65, 0, 0.35, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          {((it: React.ReactNode[]) => (
            <>
              <Handle name="Objek 1">{it[0]}</Handle>
              <Handle name="Objek 2">{it[1]}</Handle>
              <Handle name="Objek 3">{it[2]}</Handle>
            </>
          ))(
            [2, 1, 0].map((k) => (
              <Card_
                key={k}
                x={SORT.out + k * 12}
                y={SORT.noiseY + k * 14}
                w={SORT.outW}
                h={180}
                style={{
                  background: interpolateColors(
                    k,
                    [0, 2],
                    [theme.color.neutralDisc, theme.color.skeleton],
                  ),
                  boxShadow: shadow.soft,
                }}
              />
            )),
          )}
          <Interactive.Div
            name="Cuma bikin"
            style={{
              position: "absolute",
              left: SORT.out,
              top: SORT.noiseY,
              width: SORT.outW,
              height: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              ...typeStyle("title"),
              fontSize: 38,
              fontWeight: 500,
              lineHeight: 1.2,
              color: theme.color.neutralIcon,
            }}
          >
            Cuma bikin
            <br />
            bereaksi
          </Interactive.Div>
        </Keyed>
      </Shot>
    </Stage>
  );
};
