/**
 * VI03 · SC04 v2 — "Margin of Safety", told the way Simon told SC03 (17 Nov: "pelajarin cara storytelling nya scene 1-3, lalu
 * revisi scene 4"): one white story frame, facts that build on their words, the one that matters carried on, a key-term cut.
 * Text: only the opening question and the closing insight (Simon 17 Nov: the per-sentence lines were "inisiatif tolol" that
 * "ngerusak layout"). Storyboard: docs/vi-style/storyboards/VI03-SC04-v2.png. The first build is MarginOfSafety.tsx
 * (switch SC04_LOOK).
 *
 *  A  "Kalau kita sudah punya estimasi harga wajar": the frame; Kamu at the left, named; a card "Harga wajar" with one marker,
 *     100 (no calculator, no band: Simon 17 Nov). The question "Beli tepat di harga wajar?" until "Karena".
 *  B  "Benjamin Graham" (a camera cut): his photo tile, named; on "Margin of Safety" the term, very large, over him; from
 *     "Bayangkan" it docks as the heading for the rest of the scene.
 *  C  "Bayangkan jembatan" (B fades, the frame comes back): Simon's stone bridge, "Kuat 10 ton" in its middle arch; a truck
 *     drives on, "3 ton" over it; under it a 0–10 ton bar filled to 3.
 *  D  "Kalau perusahaan kita perkirakan bernilai 100": the bridge and the white frame go (Simon 17 Nov: no white frame from
 *     here to the end); A's "Harga wajar" scale, larger, centred on the grid; the price paid a black triangle over the line, "Beli 95" then "Beli 70", a red bar from it to the 100.
 *  E  "Margin of Safety bukan jaminan": nothing new — the card holds.
 *  F  "Kalau harga sekarang belum memberi": the triangle to 98, "Hari ini 98"; the card holds till Mr. Market, then five
 *     trading days (no prices: Simon 17 Nov) between Kamu and Mr. Market (head icons), and "Nggak harus beli hari ini" —
 *     the block centred in the frame.
 *
 * 100 / 95 / 70 and 10 / 3 ton are the script's own example; 98 is a made-up price on that same 100 scale, giving no
 * margin. The five days carry no prices.
 */
import {
  CardE as Card,
  DrawingVI03E as Drawing,
  PicE as Pic,
} from "../../../editable";
import { staticFile, useCurrentFrame, Interactive } from "remotion";
import {
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
  KAMU_FULL,
  LINE_ART,
  PhotoTile,
  ease,
  useWords,
} from "../components/kit";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// the world: VI01's white frame, SC03's floor and name labels
const FRAME = { x: 160, y: 190, w: 1600, h: 700, line: 3 };
const MID_X = FRAME.x + FRAME.w / 2;
const FLOOR = 701;
const NAME = { gap: 22, size: 34 };
/** one summary line per sentence, SC03's style: 52 px bold indigo, centred, midway between the content and the frame's foot */
const LINE = { size: 52, cyA: 815 };

// A — Kamu and the fair value
const KAMU_H = 350;
const KAMU = { cx: 470, h: KAMU_H, w: (KAMU_H * KAMU_FULL.w) / KAMU_FULL.h };
const FAIR = {
  x: 760,
  y: 376,
  w: 860,
  h: 300,
  titleX: 40,
  titleY: 54,
  titleSize: 36,
  x0: 80,
  x1: 780,
  lineY: 196,
  dot: 16,
  valueY: 128,
  valueSize: 52,
};
const FAIR_MID = (FAIR.x0 + FAIR.x1) / 2;

// B — the term and the man who named it
/**
 * The term, very large on its cut; from "Bayangkan" it stays for the rest of the scene as the heading over the frame (Simon
 * 17 Nov: nothing on screen for only a second or two — "Either kamu ganti atau kamu panjangin!").
 */
const KEY = {
  text: "Margin of Safety",
  cy: 330,
  size: 160,
  headCy: 112,
  headSize: 64,
};
const GRAHAM = { d: 220, top: 470, nameGap: 22, nameSize: 30 };
const GRAHAM_H = (GRAHAM.d * 423) / 406;

// C — the bridge
/** Simon's stone arch bridge (17 Nov: "jembatan di scene 4 pake ini aja, recreate dari chatgpt") */
/** lower in the frame than first set (Simon 17 Nov: "terlalu mepet atas") */
const BRIDGE = { name: "bridge-stone" as const, h: 240, top: 325 };
const BRIDGE_FLOOR = BRIDGE.top + BRIDGE.h;
/** the road: the balustrade's foot, as a share of the drawing's height (measured on the PNG: row 211 of 705) — the truck stands
 * on it behind the railing, its wheels hidden by the balusters as on a real bridge */
const DECK_Y = BRIDGE.top + (211 / LINE_ART[BRIDGE.name].h) * BRIDGE.h;
/** "Kuat 10 ton" under the bridge now, then 50 + 50 px up, into the middle arch (Simon 17 Nov) */
const SIGN = { cy: BRIDGE.top + BRIDGE.h + 44 - 100, size: 34 };
/** VI02's line-art truck (371 × 254), from the bridge's left end to its middle */
const TRUCK_H = 84;
const TRUCK_W = (TRUCK_H * 371) / 254;
const BRIDGE_W = (BRIDGE.h * LINE_ART[BRIDGE.name].w) / LINE_ART[BRIDGE.name].h;
const TRUCK = {
  src: "art/vi02/line/truck.png",
  w0: 371,
  h0: 254,
  h: TRUCK_H,
  from: MID_X - BRIDGE_W / 2 + TRUCK_W / 2 + 12,
  to: MID_X,
  label: 30,
};
/** the 0–10 ton bar under the bridge */
const CAP = {
  x0: 560,
  x1: 1360,
  y: 650,
  h: 44,
  labelY: 722,
  labelSize: 26,
  max: 10,
  load: 3,
};

// D — the value bar the ton bar becomes
/**
 * D–F: A's "Harga wajar" card again, larger, centred in the frame (Simon 17 Nov: the value bar out, "pake parameter harga dari
 * gambar 2"). The line runs 50 → 150 with the value, 100, in its middle; the price paid is a black triangle right under the
 * line pointing up at it ("icon segitiga hitam persis di bawah garis parameternya"), named under it. No "Ruang …" (Simon 17
 * Nov: "HAPUS!").
 */
/** 100 sits 30 px higher than A's (Simon 17 Nov), making room for the triangle and its name above the line */
const PRICE = {
  x: 460,
  y: 375,
  w: 1000,
  h: 330,
  titleX: 40,
  titleY: 54,
  x0: 90,
  x1: 910,
  lineY: 190,
  lo: 50,
  hi: 150,
  triGap: 20,
  triW: 30,
  triH: 26,
  valueY: 128 - 30,
  roomY: 32,
  roomW: 20,
};
const priceX = (v: number) =>
  PRICE.x0 + ((v - PRICE.lo) / (PRICE.hi - PRICE.lo)) * (PRICE.x1 - PRICE.x0);

// F — Mr. Market every day
const DAYS = [
  /** the days only — no prices on them (Simon 17 Nov: "angkanya hapus") */
  { day: "Sen" },
  { day: "Sel" },
  { day: "Rab" },
  { day: "Kam" },
  { day: "Jum" },
] as const;
const DAY = { w: 120, h: 120, gap: 24, y: 417 };
const DAY_ROW = DAYS.length * DAY.w + (DAYS.length - 1) * DAY.gap;
const DAY_X0 = MID_X - DAY_ROW / 2;
/** the two heads either side of the row (SC03's crops, head to neck), one icon size */
const ICON_H = 100;
const HEADS = [
  {
    name: "Kamu",
    src: KAMU_FULL.src,
    crop: { x0: 80, y0: 20, x1: 410, y1: 362 },
    cx: DAY_X0 - 110,
    flip: false,
    at: "Mr. Market",
  },
  {
    name: "Mr. Market",
    src: "art/vi01/mr-market.png",
    crop: { x0: 90, y0: 0, x1: 330, y1: 215 },
    cx: DAY_X0 + DAY_ROW + 110,
    flip: true,
    at: "Mr. Market",
  },
] as const;
/** the days, the heads and their names, and the closing line under them, centred in the frame (190–890) as one block */
const NOT_TODAY = { cy: 643 };

/** A text line: plain, bold, indigo, centred in the frame. */
const Summary = ({ text, cy, p }: { text: string; cy: number; p: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: MID_X,
        top: cy,
        transform: `translate(-50%, calc(-50% + ${((1 - p) * 12).toFixed(1)}px))`,
        opacity: p,
        ...typeStyle("title"),
        fontSize: LINE.size,
        fontWeight: 700,
        lineHeight: 1.2,
        color: c.indigo,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const SC04 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(4, BLOCK.SC04);
  const g = f + BLOCK.SC04;
  /** in on `at`, out after `out` */
  const life = (at: number, out: number) =>
    ease(f, at, m.reveal) * (1 - ease(f, out, m.fade));

  // A
  const fairIn = ease(f, W("estimasi"), m.reveal);
  // B — the cut, just before "Benjamin"
  const cut: Cut = { at: W("Benjamin") - m.sec(0.1), axis: "x", ...CUT };
  const keyIn = ease(f, W("Margin of Safety"), m.reveal);
  const bridgeAt = W("Bayangkan");
  const bOut = ease(f, bridgeAt - m.fade, m.fade);
  const keyDock = ease(f, bridgeAt - m.fade, m.move);
  // C
  const worldIn = ease(f, bridgeAt, m.reveal);
  const signIn = ease(f, W("sepuluh ton"), m.reveal);
  const drive = ease(f, W("melewatkan"), W("tiga ton") - W("melewatkan"));
  const truckIn = ease(f, W("melewatkan") - m.sec(0.2), m.fade);
  const load = ease(f, W("tiga ton"), m.sec(0.7));
  // D
  const numbersAt = W("Kalau perusahaan");
  const bridgeOut = ease(f, numbersAt, m.fade);
  /** the ton bar's contents go with the bridge; then its empty outline moves up and grows into the value bar */
  const capGone = ease(f, numbersAt, m.fade);
  const priceIn = ease(f, numbersAt + m.fade, m.reveal);
  const buyIn = ease(f, W("dibeli di 95"), m.pop);
  const to70 = ease(f, W("dibeli di 70"), m.sec(0.8));
  // F
  const nowAt = W("Kalau harga sekarang");
  const to98 = ease(f, nowAt, m.sec(0.8));
  const marketAt = W("Mr. Market");
  /** the price card stays at "Hari ini 98" and goes just before the days come into its place */
  const barOut = ease(f, marketAt - m.fade, m.fade);
  /** the buy price on the bar: 95 → 70 → 98 */
  const buy = mix(mix(95, 70, to70), 98, to98);
  const buyN = Math.round(buy);

  /**
   * Text on screen: only the opening question and, at the end, the scene's one insight (Simon 17 Nov: "ini inisiatif tolol",
   * "Ngerusak layout"). No line per sentence — the bridge, the price card and the days say the rest.
   */
  const lines = [
    /** held through the pause after the question (+30 f, Simon 17 Nov), out just before "Karena" */
    {
      text: "Beli tepat di harga wajar?",
      at: W("kenapa"),
      out: W("Karena") - m.fade,
      cy: LINE.cyA,
    },
  ];

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the frame, Kamu, the fair value; cut away before "Benjamin" */}
      {f < cut.at ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            ...(f >= cut.at - cut.over / 2 ? cutOutStyle(f, cut) : {}),
          }}
        >
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
          {/* Kamu, turned to the card */}
          <Pic
            src={staticFile(KAMU_FULL.src)}
            style={{
              position: "absolute",
              left: KAMU.cx - KAMU.w / 2,
              top: FLOOR - KAMU.h,
              width: KAMU.w,
              height: KAMU.h,
              transform: "scaleX(-1)",
            }}
          />
          <Interactive.Div
            name="Kamu"
            style={{
              position: "absolute",
              left: KAMU.cx,
              top: FLOOR + NAME.gap,
              transform: "translateX(-50%)",
              ...typeStyle("label"),
              fontSize: NAME.size,
              fontWeight: 500,
              color: c.ink,
              whiteSpace: "nowrap",
            }}
          >
            Kamu
          </Interactive.Div>
          {fairIn > 0.001 ? (
            <Card
              x={FAIR.x}
              y={FAIR.y + (1 - fairIn) * 16}
              w={FAIR.w}
              h={FAIR.h}
              style={{ opacity: fairIn }}
            >
              <Interactive.Div
                name="Harga wajar"
                style={{
                  position: "absolute",
                  left: FAIR.titleX,
                  top: FAIR.titleY,
                  transform: "translateY(-50%)",
                  ...typeStyle("title"),
                  fontSize: FAIR.titleSize,
                  fontWeight: 600,
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                Harga wajar
              </Interactive.Div>
              <svg
                width={FAIR.w}
                height={FAIR.h}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  overflow: "visible",
                }}
              >
                <line
                  x1={FAIR.x0}
                  y1={FAIR.lineY}
                  x2={FAIR.x1}
                  y2={FAIR.lineY}
                  stroke={c.ink}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                {[FAIR.x0, FAIR.x1].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1={FAIR.lineY - 14}
                    x2={x}
                    y2={FAIR.lineY + 14}
                    stroke={c.ink}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                ))}
                <circle
                  cx={FAIR_MID}
                  cy={FAIR.lineY}
                  r={FAIR.dot}
                  fill={c.cardBg}
                  stroke={c.indigo}
                  strokeWidth={5}
                />
              </svg>
              <Interactive.Div
                name="100"
                style={{
                  position: "absolute",
                  left: FAIR_MID,
                  top: FAIR.valueY,
                  transform: "translate(-50%, -50%)",
                  ...typeStyle("title"),
                  fontSize: FAIR.valueSize,
                  fontWeight: 700,
                  color: c.indigo,
                }}
              >
                100
              </Interactive.Div>
            </Card>
          ) : null}
          {lines.map((l) => (
            <Summary
              key={l.text}
              text={l.text}
              cy={l.cy}
              p={life(l.at, l.out)}
            />
          ))}
        </div>
      ) : null}

      {/* B — Benjamin Graham, then the term over him; fades before the bridge */}
      {f >= cut.at && bOut < 0.999 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - bOut,
            ...(f < cut.at + cut.over / 2 ? cutInStyle(f, cut) : {}),
          }}
        >
          <PhotoTile
            name="graham"
            d={GRAHAM.d}
            style={{ left: MID_X - GRAHAM.d / 2, top: GRAHAM.top }}
          />
          <Interactive.Div
            name="Benjamin Graham"
            style={{
              position: "absolute",
              left: MID_X,
              top: GRAHAM.top + GRAHAM_H + GRAHAM.nameGap,
              transform: "translateX(-50%)",
              ...typeStyle("label"),
              fontSize: GRAHAM.nameSize,
              fontWeight: 600,
              color: c.ink,
              whiteSpace: "nowrap",
            }}
          >
            Benjamin Graham
          </Interactive.Div>
        </div>
      ) : null}

      {/* C — the frame again; from "Kalau perusahaan" to the scene's end no white frame (Simon 17 Nov: "jangan pake background
          putihnya"): it fades with the bridge, and D–F stand on the grid */}
      {worldIn > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: worldIn }}>
          {bridgeOut < 0.999 ? (
            <Interactive.Div
              name="Objek"
              style={{
                position: "absolute",
                left: FRAME.x,
                top: FRAME.y,
                width: FRAME.w,
                height: FRAME.h,
                opacity: 1 - bridgeOut,
                borderRadius: theme.shape.cardRadius,
                background: c.cardBg,
                boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME.line}px ${c.ink}`,
              }}
            />
          ) : null}

          {/* C — the bridge, its sign, the truck */}
          {bridgeOut < 0.999 ? (
            <div
              style={{ position: "absolute", inset: 0, opacity: 1 - bridgeOut }}
            >
              {truckIn > 0.001 ? (
                <Interactive.Div
                  name="3 ton"
                  style={{
                    position: "absolute",
                    left: mix(TRUCK.from, TRUCK.to, drive) - TRUCK_W / 2,
                    top: DECK_Y - TRUCK.h,
                    width: TRUCK_W,
                    height: TRUCK.h,
                    opacity: truckIn,
                  }}
                >
                  <Pic
                    src={staticFile(TRUCK.src)}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: TRUCK_W,
                      height: TRUCK.h,
                    }}
                  />
                  {/* "3 ton" over the truck (Simon 17 Nov), going with it */}
                  <Interactive.Div
                    name="3 ton"
                    style={{
                      position: "absolute",
                      left: TRUCK_W / 2,
                      top: -24,
                      transform: "translate(-50%, -50%)",
                      opacity: load,
                      ...typeStyle("label"),
                      fontSize: TRUCK.label,
                      fontWeight: 600,
                      color: c.ink,
                      whiteSpace: "nowrap",
                    }}
                  >
                    3 ton
                  </Interactive.Div>
                </Interactive.Div>
              ) : null}
              <Drawing
                name={BRIDGE.name}
                cx={MID_X}
                floor={BRIDGE_FLOOR}
                h={BRIDGE.h}
              />
              <Interactive.Div
                name="Kuat 10 ton"
                style={{
                  position: "absolute",
                  left: MID_X,
                  top: SIGN.cy,
                  transform: "translate(-50%, -50%)",
                  opacity: signIn,
                  ...typeStyle("label"),
                  fontSize: SIGN.size,
                  fontWeight: 600,
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                Kuat 10 ton
              </Interactive.Div>
            </div>
          ) : null}

          {/* C — the ton bar: 3 tons of 10; it goes with the bridge */}
          {signIn > 0.001 && capGone < 0.999
            ? (() => {
                const capX = (t: number) =>
                  CAP.x0 + (t / CAP.max) * (CAP.x1 - CAP.x0);
                return (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: signIn * (1 - capGone),
                    }}
                  >
                    <svg
                      width={theme.canvas.width}
                      height={theme.canvas.height}
                      style={{ position: "absolute", left: 0, top: 0 }}
                    >
                      <rect
                        x={CAP.x0}
                        y={CAP.y}
                        width={CAP.x1 - CAP.x0}
                        height={CAP.h}
                        rx={CAP.h / 2}
                        fill={c.cardBg}
                        stroke={c.ink}
                        strokeWidth={2.5}
                      />
                      {load > 0.001 ? (
                        <rect
                          x={CAP.x0}
                          y={CAP.y}
                          width={(capX(CAP.load) - CAP.x0) * load}
                          height={CAP.h}
                          rx={CAP.h / 2}
                          fill={c.indigo}
                        />
                      ) : null}
                    </svg>
                    {[
                      { t: "0 ton", x: CAP.x0, on: 1 },
                      { t: "3 ton", x: capX(CAP.load), on: load },
                      { t: "10 ton", x: CAP.x1, on: 1 },
                    ].map((l) => (
                      <div
                        key={l.t}
                        style={{
                          position: "absolute",
                          left: l.x,
                          top: CAP.labelY,
                          transform: "translate(-50%, -50%)",
                          opacity: l.on,
                          ...typeStyle("label"),
                          fontSize: CAP.labelSize,
                          fontWeight: 500,
                          color: c.slate,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {l.t}
                      </div>
                    ))}
                  </div>
                );
              })()
            : null}

          {/* D–F — A's "Harga wajar" scale again (Simon 17 Nov: "pake parameter harga dari gambar 2"): the value, 100, on the line;
              the price paid a black triangle right under the line, pointing up at it (his words); the room between them read out */}
          {priceIn > 0.001 && barOut < 0.999 ? (
            <Card
              x={PRICE.x}
              y={PRICE.y + (1 - priceIn) * 16}
              w={PRICE.w}
              h={PRICE.h}
              style={{ opacity: priceIn * (1 - barOut) }}
            >
              <Interactive.Div
                name="Harga wajar"
                style={{
                  position: "absolute",
                  left: PRICE.titleX,
                  top: PRICE.titleY,
                  transform: "translateY(-50%)",
                  ...typeStyle("title"),
                  fontSize: FAIR.titleSize,
                  fontWeight: 600,
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                Harga wajar
              </Interactive.Div>
              <svg
                width={PRICE.w}
                height={PRICE.h}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  overflow: "visible",
                }}
              >
                <line
                  x1={PRICE.x0}
                  y1={PRICE.lineY}
                  x2={PRICE.x1}
                  y2={PRICE.lineY}
                  stroke={c.ink}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                {[PRICE.x0, PRICE.x1].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1={PRICE.lineY - 14}
                    x2={x}
                    y2={PRICE.lineY + 14}
                    stroke={c.ink}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                ))}
                {/* the room between the price paid and the value: a thick bar under the line, from the triangle to the 100 (Simon
                    17 Nov, drawn on his screenshot), following the price as it moves — red, his call ("ganti warna merah deh") */}
                {buyIn > 0.001 ? (
                  <line
                    x1={priceX(buy)}
                    y1={PRICE.lineY + PRICE.roomY}
                    x2={priceX(100) - FAIR.dot}
                    y2={PRICE.lineY + PRICE.roomY}
                    stroke={theme.color.crossRed}
                    strokeWidth={PRICE.roomW}
                    strokeLinecap="round"
                    opacity={buyIn}
                  />
                ) : null}
                <circle
                  cx={priceX(100)}
                  cy={PRICE.lineY}
                  r={FAIR.dot}
                  fill={c.cardBg}
                  stroke={c.indigo}
                  strokeWidth={5}
                />
                {buyIn > 0.001
                  ? (() => {
                      const x = priceX(buy);
                      /** above the line now, its tip down on the price (Simon 17 Nov: "di atas garis aja") */
                      const y = PRICE.lineY - PRICE.triGap;
                      return (
                        <path
                          d={`M ${x} ${y} L ${x + PRICE.triW / 2} ${y - PRICE.triH} L ${x - PRICE.triW / 2} ${y - PRICE.triH} Z`}
                          fill={c.ink}
                          stroke={c.ink}
                          strokeWidth={2}
                          strokeLinejoin="round"
                          opacity={buyIn}
                        />
                      );
                    })()
                  : null}
              </svg>
              <Interactive.Div
                name="100"
                style={{
                  position: "absolute",
                  left: priceX(100),
                  top: PRICE.valueY,
                  transform: "translate(-50%, -50%)",
                  ...typeStyle("title"),
                  fontSize: FAIR.valueSize,
                  fontWeight: 700,
                  color: c.indigo,
                }}
              >
                100
              </Interactive.Div>
              {/* the price's name beside its triangle, on the triangle's left, so it clears the 100 even at 98 */}
              {buyIn > 0.001 ? (
                <Interactive.Div
                  name="Objek"
                  style={{
                    position: "absolute",
                    left: priceX(buy) - PRICE.triW / 2 - 14,
                    top: PRICE.lineY - PRICE.triGap - PRICE.triH / 2,
                    transform: "translate(-100%, -50%)",
                    opacity: buyIn,
                    ...typeStyle("label"),
                    fontSize: 32,
                    fontWeight: 600,
                    color: c.ink,
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {to98 > 0.001 ? `Hari ini ${buyN}` : `Beli ${buyN}`}
                </Interactive.Div>
              ) : null}
            </Card>
          ) : null}

          {/* F — Mr. Market every day, and you */}
          {DAYS.map((d, i) => {
            const p = ease(f, marketAt + m.sec(0.12 * i), m.reveal);
            if (p <= 0.001) return null;
            return (
              <Card
                key={d.day}
                x={DAY_X0 + i * (DAY.w + DAY.gap)}
                y={DAY.y + (1 - p) * 14}
                w={DAY.w}
                h={DAY.h}
                style={{ opacity: p }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: DAY.w / 2,
                    top: DAY.h / 2,
                    transform: "translate(-50%, -50%)",
                    ...typeStyle("title"),
                    fontSize: 34,
                    fontWeight: 600,
                    color: c.ink,
                  }}
                >
                  {d.day}
                </div>
              </Card>
            );
          })}
          {HEADS.map((hd) => {
            const p = ease(f, W(hd.at), m.reveal);
            if (p <= 0.001) return null;
            const img = hd.name === "Kamu" ? KAMU_FULL : ART["mr-market"];
            const k = ICON_H / (hd.crop.y1 - hd.crop.y0);
            const w = (hd.crop.x1 - hd.crop.x0) * k;
            const cy = DAY.y + DAY.h / 2;
            return (
              <div
                key={hd.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: p,
                  transform: `translateY(${((1 - p) * 14).toFixed(1)}px)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: hd.cx - w / 2,
                    top: cy - ICON_H / 2 - 16,
                    width: w,
                    height: ICON_H,
                    overflow: "hidden",
                    transform: hd.flip ? "scaleX(-1)" : undefined,
                  }}
                >
                  <Pic
                    src={staticFile(hd.src)}
                    style={{
                      position: "absolute",
                      left: -hd.crop.x0 * k,
                      top: -hd.crop.y0 * k,
                      width: img.w * k,
                      height: img.h * k,
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: hd.cx,
                    top: cy + ICON_H / 2 - 6,
                    transform: "translateX(-50%)",
                    ...typeStyle("label"),
                    fontSize: 30,
                    fontWeight: 500,
                    color: c.ink,
                    whiteSpace: "nowrap",
                  }}
                >
                  {hd.name}
                </div>
              </div>
            );
          })}

          <Summary
            text="Nggak harus beli hari ini"
            cy={NOT_TODAY.cy}
            p={ease(f, marketAt + m.fade, m.reveal)}
          />
        </div>
      ) : null}

      {/* the term: over Graham on its cut, then the scene's heading to the end */}
      {keyIn > 0.001 ? (
        <Interactive.Div
          name="Objek"
          style={{
            position: "absolute",
            left: MID_X,
            top: mix(KEY.cy, KEY.headCy, keyDock),
            transform: `translate(-50%, calc(-50% + ${((1 - keyIn) * 14).toFixed(1)}px)) scale(${mix(1, KEY.headSize / KEY.size, keyDock).toFixed(4)})`,
            opacity: keyIn,
            ...typeStyle("title"),
            fontSize: KEY.size,
            fontWeight: 700,
            lineHeight: 1.1,
            color: c.indigo,
            whiteSpace: "nowrap",
          }}
        >
          {KEY.text}
        </Interactive.Div>
      ) : null}
    </Stage>
  );
};
