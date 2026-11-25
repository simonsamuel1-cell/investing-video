/**
 * VI03 · SC03 v3 — "Berapa Nilai Warung Ibu Sari?" as ONE layout that builds sentence by sentence, the way SC01–SC02 were
 * rebuilt (Simon 17 Nov: "lanjut revisi scene 3"). Storyboard: docs/vi-style/storyboards/VI03-SC03-v3.png. The first,
 * cut-per-sentence build is IbuSariValue.tsx; switch SC03_LOOK.
 *
 *  A  "Lalu, dari mana harga wajar itu datang?": the question opens in the middle, "Harga wajar" in indigo.
 *  B  "Kita kembali ke Ibu Sari": the question docks top left as the scene's heading. Upper left, VI01's story frame with the
 *     warung and Ibu Sari; upper right her warung's card, one row per fact as it is said: Laba bersih Rp20 juta / tahun,
 *     Sudah berjalan 10 tahun, Pelanggan stabil.
 *  C  "Kalau kamu ingin membeli warung itu": a card underneath — "Kamu" asking "Berapa kali laba?", the sum "Harga beli = laba ×
 *     kelipatan", a scale 1x … 30x with a knob, the price it makes, and one block per year of profit the price is worth.
 *     1x: Rp20 juta, one block, "Terlalu murah"; Ibu Sari's "Tidak dijual".
 *  D  "Tiga puluh kali": the knob runs to 30x, the price counts up to Rp600 juta and all thirty blocks fill: "30 tahun balik
 *     modal".
 *  E  "Warung sejenis": the knob comes back to the 8–12x band, Rp160–240 juta; blocks 1–8 lit, 9–12 lighter.
 *  F  "Inti valuasi": the scale goes and the thirty blocks rise into thirty years of profit. Each row of the warung's card gets
 *     its question — Berapa banyak? (the bars' height, Rp20 juta), Berapa lama? (the years along them), Seberapa yakin? (the
 *     far years paler) — and "discounting" shrinks every year to what it is worth today, flowing into "Nilai hari ini".
 *  G  "Buffett menghitung": the story frame now holds the three who count this way — Buffett, Ibu Sari, Tuntun Research
 *     Institute — joined to the result, which becomes "Reference Fair Value"; the heading's "Harga wajar" is underlined.
 *
 * Every figure is the script's own example (Rp20 juta a year, 1x, 30x, 8–12x) or a product of it (Rp160–240 juta = 8–12 ×
 * Rp20 juta); the discounted bars are a shape, with no figures. No source tag.
 */
import {
  CardE as Card,
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
  SoftGround,
  SpeechBubble,
  Stage,
  TuntunMark,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
} from "../../../core";
import { BLOCK } from "../data/timing";
import {
  BoardGrid,
  Glyph,
  HEADING,
  KAMU_FULL,
  PhotoTile,
  ease,
  useWords,
} from "../components/kit";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A → B: the question, opened in the middle, then the heading
const ASK = { y: 500, scale: 1.7 };

// upper left — VI01's story frame; positions inside it are the frame's own
/** the rows end at y 900, so even the cards' soft shadows stay out of the subtitle band */
const FRAME = { x: 140, y: 240, w: 740, h: 320, line: 3 };
const SARI = { cx: 150, floor: 262, h: 220, nameY: 292 };
const WARUNG = { cx: 560, floor: 262, h: 250 };
/** her answer to 1x, the tail on her face */
const NO_SALE = { x: 172, y: 8, w: 210, h: 66 };

// upper right — the warung's card
const PROFILE = {
  x: 920,
  y: 240,
  w: 860,
  h: 320,
  pad: 32,
  titleY: 50,
  rowY: [96, 168, 240],
  rowH: 60,
  disc: 42,
};
const ROW_W = { full: PROFILE.w - 2 * PROFILE.pad, narrow: 480 };
const ROWS = [
  {
    icon: "coins",
    label: "Laba bersih",
    value: "Rp20 juta / tahun",
    at: "laba bersih",
    valueAt: "Rp20",
    q: "Berapa banyak?",
    qAt: "berapa banyak",
  },
  {
    icon: "calendar-check",
    label: "Sudah berjalan",
    value: "10 tahun",
    at: "Sudah berjalan",
    valueAt: "sepuluh",
    q: "Berapa lama?",
    qAt: "berapa lama",
  },
  {
    icon: "users-three",
    label: "Pelanggan",
    value: "Stabil",
    at: "pelanggannya",
    valueAt: "stabil",
    q: "Seberapa yakin?",
    qAt: "seberapa yakin",
  },
] as const;
/** the arrow and the question after a narrowed row */
const Q = { arrow: 40, gap: 10, h: 50, size: 26 };

// the card underneath; positions inside it are the card's own
const LOW = { x: 140, y: 590, w: 1640, h: 310 };
const KAMU = { cx: 110, floor: 290, h: 250 };
const KAMU_W = (KAMU.h * KAMU_FULL.w) / KAMU_FULL.h;
/** "Berapa kali laba?" — core SpeechBubble, its tail on Kamu's face */
const ASK_BUBBLE = { x: 150, y: 10, w: 340, h: 70 };
const SUM = { x: 600, y: 58, size: 34 };
const READOUT = { right: 1600, y: 58, size: 60 };
const STATUS = { right: 1600, y: 132, h: 46, size: 28 };
/** the scale of multiples, and one block per year under it, block k under k× */
const SCALE = { x0: 640, x1: 1540, y: 192, knob: 15 };
const MULT = { lo: 1, hi: 30 };
const xOf = (k: number) =>
  SCALE.x0 + ((k - MULT.lo) / (MULT.hi - MULT.lo)) * (SCALE.x1 - SCALE.x0);
const BAND = { lo: 8, hi: 12, h: 30, labelY: 150 };
const YEARS = Array.from({ length: MULT.hi }, (_, i) => i + 1);
/** a block (C–E) and the bar it rises into (F), standing on BASE */
const BAR = { w: 22, block: 30, full: 160, base: 258 };
/** what a year's profit is worth today, as a share: the shape of discounting, no rate shown */
const worth = (k: number) => 1 / 1.1 ** k;
/** the years labelled along the bars */
const YEAR_TICKS = [1, 10, 20, 30];
const AXIS_Y = 286;
const DISC_PILL = { y: 44, size: 32 };
/** "Nilai hari ini", later "Reference Fair Value": its left edge fixed, the icon staying put */
const RESULT = { x: 40, y: 176, h: 64, size: 30, disc: 44, w: [300, 446] };

// G — the three who count this way, inside the story frame
const TILE = { d: 170, top: 20, cxs: [140, 370, 600] };
const TILE_H = (TILE.d * 423) / 406;
const TILE_NAME_Y = TILE.top + TILE_H + 12;
/** the lines from them to the result: down out of the frame, across the gap above the card, down to the pill */
const JOIN = { y0: FRAME.y + 290, yj: (FRAME.y + FRAME.h + LOW.y) / 2 };

/** A white pill on the card: indigo hairline and type, or grey. */
const Pill = ({
  text,
  size,
  h,
  tone,
}: {
  text: string;
  size: number;
  h: number;
  tone: "indigo" | "grey";
}) => {
  const c = usePalette();
  return (
    <div
      style={{
        height: h,
        padding: `0 ${h * 0.5}px`,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        background: tone === "indigo" ? c.cardBg : theme.color.neutralDisc,
        boxShadow:
          tone === "indigo" ? `inset 0 0 0 2px ${c.indigo}` : undefined,
        ...typeStyle("label"),
        fontSize: size,
        fontWeight: 600,
        color: tone === "indigo" ? c.indigo : c.slate,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(3, BLOCK.SC03);
  const g = f + BLOCK.SC03;

  // A → B
  const dockAt = W("Kita kembali");
  const dock = ease(f, dockAt - m.sec(0.2), m.move);
  const frameIn = ease(f, dockAt + m.move * 0.5, m.reveal);
  const profileIn = ease(f, W("Warungnya"), m.reveal);

  // C–E
  const buyAt = W("Kalau kamu");
  const coreAt = W("Inti valuasi");
  const lowIn = ease(f, buyAt, m.reveal);
  /** everything of C–E but the blocks leaves on "Inti valuasi" */
  const buyOut = ease(f, coreAt - m.sec(0.2), m.fade);
  const scaleDraw = ease(f, W("laba tahunannya"), m.sec(0.7));
  const oneAt = W("Satu kali");
  const thirtyAt = W("Tiga puluh kali");
  const run = ease(f, thirtyAt, W("enam ratus") - thirtyAt);
  const sejenisAt = W("warung sejenis");
  const back = ease(f, sejenisAt, m.sec(1.0));
  const bandAt = W("8–12");
  const band = ease(f, bandAt, m.reveal);
  /** the knob's multiple: 1 → 30 → 10, where the band takes over */
  const k = f < oneAt ? MULT.lo : mix(mix(MULT.lo, MULT.hi, run), 10, back);
  const knobOn = ease(f, oneAt, m.pop) * (1 - band);
  const readoutIn = ease(f, W("dua puluh juta"), m.reveal);
  /** a block is lit while the price still covers its year; in E, 1–8 lit and 9–12 lighter */
  const blockTone = (yr: number) => {
    if (band > 0.5)
      return yr <= BAND.lo
        ? c.indigo
        : yr <= BAND.hi
          ? theme.color.indigoWashDeepSolid
          : theme.color.skeleton;
    return knobOn > 0.001 && yr <= Math.round(k)
      ? c.indigo
      : theme.color.skeleton;
  };

  // F
  const rise = ease(f, coreAt + m.sec(0.3), m.move);
  const narrow = ease(f, coreAt, m.move);
  const qAts = ROWS.map((r) => W(r.qAt));
  const discountAt = W("Dalam dunia");
  const level = ease(f, qAts[0], m.reveal) * (1 - ease(f, discountAt, m.fade));
  const axis = ease(f, qAts[1], m.sec(0.8));
  const unsure = ease(f, qAts[2], m.sec(0.8));
  /** every year shrinks to its worth today together (a stagger left a valley mid-way), done by "discounting" */
  const shrink = (_yr: number) =>
    ease(f, discountAt, W("discounting") - discountAt);
  const discPill = ease(f, W("discounting"), m.reveal);
  const resultIn = ease(f, W("discounting") + m.sec(0.25), m.reveal);

  // G
  const whoAt = W("Buffett menghitung");
  const storyOut = ease(f, whoAt - m.sec(0.4), m.fade);
  const tileAts = [whoAt, W("Ibu Sari secara"), W("Tuntun Research")];
  const joinDraw = ease(f, W("prinsip yang sama"), m.sec(0.7));
  const rfvAt = W("Reference Fair Value");
  const rfv = ease(f, rfvAt, m.fade);
  const underline = ease(f, rfvAt + m.sec(0.3), m.sec(0.6));

  // the heading: centred and 1.7× at dock 0, top left at 1 (IN07's OpeningHeading, without a number)
  const hk = mix(ASK.scale, 1, dock);
  const hy = mix(ASK.y, HEADING.y, dock);
  const hx = mix(CX, HEADING.x, dock);
  const ho = 50 * (1 - dock);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A → B — the question, then the heading; "Harga wajar" underlined when the answer gets its name */}
      <Interactive.Div
        name="Harga wajar"
        style={{
          position: "absolute",
          left: hx,
          top: hy - 40,
          height: 80,
          display: "flex",
          alignItems: "center",
          opacity: ease(f, -m.reveal, m.reveal),
          transformOrigin: `${ho}% 50%`,
          transform: `translateX(${-ho}%) scale(${hk.toFixed(4)})`,
        }}
      >
        <div
          style={{
            fontFamily: theme.text.family,
            fontSize: theme.type.title.size,
            fontWeight: 500,
            letterSpacing: theme.type.title.tracking,
            color: c.ink,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ position: "relative", color: c.indigo }}>
            Harga wajar
            <span
              style={{
                position: "absolute",
                left: 0,
                bottom: "-0.12em",
                height: "0.08em",
                width: `${(underline * 100).toFixed(2)}%`,
                borderRadius: 999,
                background: c.indigo,
              }}
            />
          </span>{" "}
          dari mana?
        </div>
      </Interactive.Div>

      {/* upper left — the story frame: Ibu Sari and her warung, then the three who count this way */}
      {frameIn > 0.001 ? (
        <Interactive.Div
          name="warung"
          style={{
            position: "absolute",
            left: FRAME.x,
            top: FRAME.y,
            width: FRAME.w,
            height: FRAME.h,
            opacity: frameIn,
            transform: `translateY(${((1 - frameIn) * 16).toFixed(1)}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: theme.shape.cardRadius,
              background: c.cardBg,
              boxShadow: `${shadow.soft}, inset 0 0 0 ${FRAME.line}px ${c.ink}`,
            }}
          />
          {storyOut < 0.999 ? (
            <div
              style={{ position: "absolute", inset: 0, opacity: 1 - storyOut }}
            >
              <Figure
                name="warung"
                cx={WARUNG.cx}
                floor={WARUNG.floor}
                h={WARUNG.h}
                style={{ opacity: ease(f, W("warung"), m.reveal) }}
              />
              <Figure
                name="ibu-sari"
                cx={SARI.cx}
                floor={SARI.floor}
                h={SARI.h}
                style={{
                  opacity: ease(f, W("Ibu Sari") - m.sec(0.2), m.reveal),
                }}
              />
              <Interactive.Div
                name="Ibu Sari"
                style={{
                  position: "absolute",
                  left: SARI.cx,
                  top: SARI.nameY,
                  transform: "translate(-50%, -50%)",
                  opacity: ease(f, W("Ibu Sari") + m.sec(0.3), m.reveal),
                }}
              >
                <Pill text="Ibu Sari" size={26} h={42} tone="indigo" />
              </Interactive.Div>
              <SpeechBubble
                label="Tidak dijual"
                x={NO_SALE.x}
                y={NO_SALE.y}
                w={NO_SALE.w}
                h={NO_SALE.h}
                at={W("nggak mau")}
                opacity={1 - ease(f, W("laba", 3), m.fade)}
              />
            </div>
          ) : null}
          {TILE.cxs.map((cx, i) => {
            const p = ease(f, tileAts[i], m.reveal);
            if (p <= 0.001) return null;
            const left = cx - TILE.d / 2;
            const names = [
              "Warren Buffett",
              "Ibu Sari",
              "Tuntun Research\nInstitute",
            ];
            return (
              <div
                key={cx}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: p,
                  transform: `translateY(${((1 - p) * 14).toFixed(1)}px)`,
                }}
              >
                {i === 0 ? (
                  <PhotoTile
                    name="buffett"
                    d={TILE.d}
                    style={{ left, top: TILE.top }}
                  />
                ) : null}
                {i === 1 ? (
                  <div
                    style={{
                      position: "absolute",
                      left,
                      top: TILE.top,
                      width: TILE.d,
                      height: TILE_H,
                      borderRadius: TILE.d * 0.13,
                      background: c.cardBg,
                      boxShadow: shadow.soft,
                      overflow: "hidden",
                    }}
                  >
                    <Figure
                      name="ibu-sari"
                      cx={TILE.d / 2}
                      floor={TILE_H + 295}
                      h={TILE_H + 283}
                    />
                  </div>
                ) : null}
                {i === 2 ? (
                  <div
                    style={{
                      position: "absolute",
                      left,
                      top: TILE.top,
                      width: TILE.d,
                      height: TILE_H,
                      borderRadius: TILE.d * 0.13,
                      background: c.cardBg,
                      boxShadow: shadow.soft,
                    }}
                  >
                    <TuntunMark
                      x={TILE.d / 2}
                      y={TILE_H / 2}
                      height={TILE.d * 0.5}
                    />
                  </div>
                ) : null}
                <div
                  style={{
                    position: "absolute",
                    left: cx - 130,
                    width: 260,
                    top: TILE_NAME_Y,
                    textAlign: "center",
                    whiteSpace: "pre-line",
                    ...typeStyle("label"),
                    fontSize: 26,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: c.ink,
                  }}
                >
                  {names[i]}
                </div>
              </div>
            );
          })}
        </Interactive.Div>
      ) : null}

      {/* upper right — the warung's card; each row gets its question in F */}
      {profileIn > 0.001 ? (
        <Card
          x={PROFILE.x}
          y={PROFILE.y + (1 - profileIn) * 16}
          w={PROFILE.w}
          h={PROFILE.h}
          style={{ opacity: profileIn }}
        >
          <Interactive.Div
            name="Warung Ibu Sari"
            style={{
              position: "absolute",
              left: PROFILE.pad,
              top: PROFILE.titleY,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Glyph icon="storefront" size={40} tone={c.ink} />
            <div
              style={{
                ...typeStyle("title"),
                fontSize: 36,
                fontWeight: 600,
                color: c.ink,
                whiteSpace: "nowrap",
              }}
            >
              Warung Ibu Sari
            </div>
          </Interactive.Div>
          {ROWS.map((r, i) => {
            const p = ease(f, W(r.at), m.reveal);
            if (p <= 0.001) return null;
            const v = ease(f, W(r.valueAt), m.reveal);
            const w = mix(ROW_W.full, ROW_W.narrow, narrow);
            const q = ease(f, qAts[i], m.reveal);
            const lit =
              ease(f, qAts[i], m.pop) *
              (1 - ease(f, i < 2 ? qAts[i + 1] : discountAt, m.pop));
            const y = PROFILE.rowY[i];
            const ax = PROFILE.pad + ROW_W.narrow + Q.gap;
            return (
              <div
                key={r.label}
                style={{ position: "absolute", inset: 0, opacity: p }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: PROFILE.pad,
                    top: y + (1 - p) * 10,
                    width: w,
                    height: PROFILE.rowH,
                    borderRadius: 18,
                    background:
                      lit > 0.5 ? theme.color.indigoWashSolid : c.cardBg,
                    boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 20px 0 11px",
                    boxSizing: "border-box",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 18,
                      boxShadow: `inset 0 0 0 3px ${c.indigo}`,
                      opacity: lit,
                    }}
                  />
                  <div
                    style={{
                      width: PROFILE.disc,
                      height: PROFILE.disc,
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
                      size={PROFILE.disc * 0.58}
                      tone={c.indigo}
                    />
                  </div>
                  <div
                    style={{
                      ...typeStyle("label"),
                      fontSize: 26,
                      fontWeight: 500,
                      color: c.slate,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.label}
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      ...typeStyle("label"),
                      fontSize: 28,
                      fontWeight: 600,
                      color: c.ink,
                      whiteSpace: "nowrap",
                      opacity: v,
                    }}
                  >
                    {r.value}
                  </div>
                </div>
                {q > 0.001 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: ax,
                      top: y,
                      height: PROFILE.rowH,
                      display: "flex",
                      alignItems: "center",
                      gap: Q.gap,
                      opacity: q,
                    }}
                  >
                    <svg
                      width={Q.arrow}
                      height={20}
                      style={{ flex: "none", overflow: "visible" }}
                    >
                      <path
                        d={`M 0 10 L ${Q.arrow * q} 10`}
                        stroke={theme.color.connector}
                        strokeWidth={3}
                        strokeLinecap="round"
                      />
                      <path
                        d={`M ${Q.arrow - 9} 3 L ${Q.arrow} 10 L ${Q.arrow - 9} 17`}
                        fill="none"
                        stroke={theme.color.connector}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={q > 0.9 ? 1 : 0}
                      />
                    </svg>
                    <Pill text={r.q} size={Q.size} h={Q.h} tone="indigo" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </Card>
      ) : null}

      {/* the card underneath: the price as a multiple of profit (C–E), then thirty years of profit (F–G) */}
      {lowIn > 0.001 ? (
        <Card
          x={LOW.x}
          y={LOW.y + (1 - lowIn) * 16}
          w={LOW.w}
          h={LOW.h}
          style={{ opacity: lowIn }}
        >
          {buyOut < 0.999 ? (
            <div
              style={{ position: "absolute", inset: 0, opacity: 1 - buyOut }}
            >
              <Pic
                src={staticFile(KAMU_FULL.src)}
                style={{
                  position: "absolute",
                  left: KAMU.cx - KAMU_W / 2,
                  top: KAMU.floor - KAMU.h,
                  width: KAMU_W,
                  height: KAMU.h,
                }}
              />
              <SpeechBubble
                label="Berapa kali laba?"
                x={ASK_BUBBLE.x}
                y={ASK_BUBBLE.y}
                w={ASK_BUBBLE.w}
                h={ASK_BUBBLE.h}
                at={W("bersedia")}
              />
              <Interactive.Div
                name="Harga beli = laba × kelipata"
                style={{
                  position: "absolute",
                  left: SUM.x,
                  top: SUM.y,
                  transform: "translateY(-50%)",
                  opacity: ease(f, W("berapa kali laba"), m.reveal),
                  fontFamily: typeStyle("title").fontFamily,
                  letterSpacing: typeStyle("title").letterSpacing,
                  lineHeight: typeStyle("title").lineHeight,
                  fontSize: SUM.size,
                  fontWeight: 600,
                  color: c.ink,
                  whiteSpace: "nowrap",
                }}
              >
                Harga beli = laba × kelipatan
              </Interactive.Div>
              {/* the price the knob makes; the band's range once it takes over */}
              {readoutIn > 0.001 ? (
                <Interactive.Div
                  name="Rp"
                  style={{
                    position: "absolute",
                    right: LOW.w - READOUT.right,
                    top: READOUT.y,
                    transform: "translateY(-50%)",
                    opacity: readoutIn,
                    fontFamily: typeStyle("title").fontFamily,
                    letterSpacing: typeStyle("title").letterSpacing,
                    lineHeight: typeStyle("title").lineHeight,
                    fontSize: READOUT.size,
                    fontWeight: 600,
                    color: c.indigo,
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <span style={{ opacity: 1 - band }}>
                    Rp{Math.round(k) * 20} juta
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      opacity: band,
                    }}
                  >
                    Rp160–240 juta
                  </span>
                </Interactive.Div>
              ) : null}
              {(
                [
                  {
                    text: "Terlalu murah",
                    at: W("Terlalu murah"),
                    out: thirtyAt,
                    tone: "grey",
                  },
                  {
                    text: "30 tahun balik modal",
                    at: W("tiga puluh tahun"),
                    out: W("Sementara"),
                    tone: "grey",
                  },
                  {
                    text: "Warung sejenis",
                    at: sejenisAt + m.sec(0.2),
                    out: coreAt + 1e6,
                    tone: "indigo",
                  },
                ] as const
              ).map((s) => {
                const p =
                  ease(f, s.at, m.reveal) * (1 - ease(f, s.out, m.fade));
                return p > 0.001 ? (
                  <div
                    key={s.text}
                    style={{
                      position: "absolute",
                      right: LOW.w - STATUS.right,
                      top: STATUS.y - STATUS.h / 2,
                      opacity: p,
                    }}
                  >
                    <Pill
                      text={s.text}
                      size={STATUS.size}
                      h={STATUS.h}
                      tone={s.tone}
                    />
                  </div>
                ) : null;
              })}
              {/* the scale */}
              <svg
                width={LOW.w}
                height={LOW.h}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  overflow: "visible",
                }}
              >
                {scaleDraw > 0.001 ? (
                  <g>
                    {band > 0.001 ? (
                      <rect
                        x={mix(xOf(10), xOf(BAND.lo), band) - BAND.h / 2}
                        y={SCALE.y - BAND.h / 2}
                        width={
                          mix(0, xOf(BAND.hi) - xOf(BAND.lo), band) + BAND.h
                        }
                        height={BAND.h}
                        rx={BAND.h / 2}
                        fill={theme.color.indigoWashSolid}
                        stroke={c.indigo}
                        strokeWidth={2.5}
                      />
                    ) : null}
                    <line
                      x1={SCALE.x0}
                      y1={SCALE.y}
                      x2={mix(SCALE.x0, SCALE.x1, scaleDraw)}
                      y2={SCALE.y}
                      stroke={c.ink}
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                    {knobOn > 0.001 ? (
                      <circle
                        cx={xOf(k)}
                        cy={SCALE.y}
                        r={SCALE.knob * (0.6 + 0.4 * knobOn)}
                        fill={c.cardBg}
                        stroke={c.indigo}
                        strokeWidth={5}
                        opacity={knobOn}
                      />
                    ) : null}
                  </g>
                ) : null}
              </svg>
              {(
                [
                  { t: "1x", x: SCALE.x0 - 32, align: "right" },
                  { t: "30x", x: SCALE.x1 + 32, align: "left" },
                ] as const
              ).map((l) => (
                <div
                  key={l.t}
                  style={{
                    position: "absolute",
                    top: SCALE.y,
                    left: l.align === "left" ? l.x : undefined,
                    right: l.align === "right" ? LOW.w - l.x : undefined,
                    transform: "translateY(-50%)",
                    opacity: ease(
                      f,
                      W("laba tahunannya") + m.sec(l.t === "1x" ? 0 : 0.5),
                      m.reveal,
                    ),
                    ...typeStyle("label"),
                    fontSize: 30,
                    fontWeight: 600,
                    color: c.ink,
                  }}
                >
                  {l.t}
                </div>
              ))}
              <Interactive.Div
                name="8–12x"
                style={{
                  position: "absolute",
                  left: xOf(10),
                  top: BAND.labelY,
                  transform: "translate(-50%, -50%)",
                  opacity: band,
                  fontFamily: typeStyle("label").fontFamily,
                  letterSpacing: typeStyle("label").letterSpacing,
                  lineHeight: typeStyle("label").lineHeight,
                  fontSize: 30,
                  fontWeight: 600,
                  color: c.indigo,
                }}
              >
                8–12x
              </Interactive.Div>
            </div>
          ) : null}

          {/* the blocks → the bars; the level, the years, the discounting */}
          <svg
            width={LOW.w}
            height={LOW.h}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              overflow: "visible",
            }}
          >
            {scaleDraw > 0.001
              ? YEARS.map((yr) => {
                  const appear = ease(
                    f,
                    W("laba tahunannya") +
                      m.sec(0.6 * ((yr - 1) / (MULT.hi - 1))),
                    m.pop,
                  );
                  const full = mix(BAR.block, BAR.full, rise);
                  const h = full * mix(1, worth(yr), shrink(yr));
                  const pale = unsure * ((yr - 1) / (MULT.hi - 1));
                  const tone = interpolateColors(
                    rise,
                    [0, 1],
                    [
                      blockTone(yr),
                      interpolateColors(
                        pale,
                        [0, 1],
                        [c.indigo, theme.color.indigoWashDeepSolid],
                      ),
                    ],
                  );
                  const x = xOf(yr) - BAR.w / 2;
                  return (
                    <g key={yr} opacity={appear}>
                      {shrink(yr) > 0.001 ? (
                        <rect
                          x={x}
                          y={BAR.base - BAR.full}
                          width={BAR.w}
                          height={BAR.full}
                          rx={6}
                          fill="none"
                          stroke={theme.color.hairlineBrandSolid}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          opacity={shrink(yr)}
                        />
                      ) : null}
                      <rect
                        x={x}
                        y={BAR.base - h}
                        width={BAR.w}
                        height={h}
                        rx={Math.min(6, h / 2)}
                        fill={tone}
                      />
                    </g>
                  );
                })
              : null}
            {/* Berapa banyak? — every bar the same Rp20 juta */}
            {level > 0.001 ? (
              <line
                x1={xOf(1) - BAR.w}
                y1={BAR.base - BAR.full}
                x2={xOf(MULT.hi) + BAR.w}
                y2={BAR.base - BAR.full}
                stroke={c.indigo}
                strokeWidth={2.5}
                strokeDasharray="8 8"
                opacity={level}
              />
            ) : null}
            {/* Berapa lama? — the years along them */}
            {axis > 0.001 ? (
              <line
                x1={xOf(1) - BAR.w}
                y1={BAR.base + 1}
                x2={mix(xOf(1) - BAR.w, xOf(MULT.hi) + BAR.w, axis)}
                y2={BAR.base + 1}
                stroke={c.ink}
                strokeWidth={3}
                strokeLinecap="round"
              />
            ) : null}
            {/* the flow back to today */}
            {resultIn > 0.001 ? (
              <g opacity={resultIn}>
                <path
                  d={`M ${xOf(1) - BAR.w} ${RESULT.y} L ${mix(xOf(1) - BAR.w, RESULT.x + mix(RESULT.w[0], RESULT.w[1], rfv) + 14, resultIn)} ${RESULT.y}`}
                  stroke={theme.color.connector}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <path
                  d={`M ${RESULT.x + mix(RESULT.w[0], RESULT.w[1], rfv) + 24} ${RESULT.y - 8} L ${RESULT.x + mix(RESULT.w[0], RESULT.w[1], rfv) + 14} ${RESULT.y} L ${RESULT.x + mix(RESULT.w[0], RESULT.w[1], rfv) + 24} ${RESULT.y + 8}`}
                  fill="none"
                  stroke={theme.color.connector}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ) : null}
          </svg>
          {level > 0.001 ? (
            <Interactive.Div
              name="Rp20 juta"
              style={{
                position: "absolute",
                right: LOW.w - (xOf(1) - BAR.w - 14),
                top: BAR.base - BAR.full,
                transform: "translateY(-50%)",
                opacity: level,
                fontFamily: typeStyle("label").fontFamily,
                letterSpacing: typeStyle("label").letterSpacing,
                lineHeight: typeStyle("label").lineHeight,
                fontSize: 26,
                fontWeight: 600,
                color: c.indigo,
                whiteSpace: "nowrap",
              }}
            >
              Rp20 juta
            </Interactive.Div>
          ) : null}
          {YEAR_TICKS.map((yr, i) => {
            const p = ease(f, qAts[1] + m.sec(0.2 * i), m.reveal);
            return p > 0.001 ? (
              <div
                key={yr}
                style={{
                  position: "absolute",
                  left: xOf(yr),
                  top: AXIS_Y,
                  transform: "translate(-50%, -50%)",
                  opacity: p,
                  ...typeStyle("label"),
                  fontSize: 22,
                  fontWeight: 500,
                  color: c.slate,
                  whiteSpace: "nowrap",
                }}
              >
                {yr === 1 ? "Tahun 1" : yr}
              </div>
            ) : null;
          })}
          {discPill > 0.001 ? (
            <Interactive.Div
              name="Discounting"
              style={{
                position: "absolute",
                left: (xOf(1) + xOf(MULT.hi)) / 2,
                top: DISC_PILL.y,
                transform: "translate(-50%, -50%)",
                opacity: discPill,
              }}
            >
              <Pill
                text="Discounting"
                size={DISC_PILL.size}
                h={56}
                tone="indigo"
              />
            </Interactive.Div>
          ) : null}
          {/* Nilai hari ini → Reference Fair Value */}
          {resultIn > 0.001 ? (
            <Interactive.Div
              name="Objek"
              style={{
                position: "absolute",
                left: RESULT.x,
                top: RESULT.y - RESULT.h / 2,
                width: mix(RESULT.w[0], RESULT.w[1], rfv),
                height: RESULT.h,
                borderRadius: 999,
                background: c.cardBg,
                boxShadow: `${rfv > 0.5 ? shadow.glow : shadow.soft}, inset 0 0 0 ${2 + rfv}px ${c.indigo}`,
                opacity: resultIn,
                transform: `scale(${(0.9 + 0.1 * resultIn).toFixed(3)})`,
                transformOrigin: "100% 50%",
              }}
            >
              <Interactive.Div
                name="Objek"
                style={{
                  position: "absolute",
                  left: (RESULT.h - RESULT.disc) / 2,
                  top: (RESULT.h - RESULT.disc) / 2,
                  width: RESULT.disc,
                  height: RESULT.disc,
                  borderRadius: 999,
                  background: theme.color.neutralDisc,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph icon="coins" size={RESULT.disc * 0.6} tone={c.indigo} />
              </Interactive.Div>
              {(["Nilai hari ini", "Reference Fair Value"] as const).map(
                (t, i) => (
                  <div
                    key={t}
                    style={{
                      position: "absolute",
                      left: RESULT.h + 4,
                      top: RESULT.h / 2,
                      transform: "translateY(-50%)",
                      opacity: i === 0 ? 1 - rfv : rfv,
                      ...typeStyle("title"),
                      fontSize: RESULT.size,
                      fontWeight: 600,
                      color: c.indigo,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t}
                  </div>
                ),
              )}
            </Interactive.Div>
          ) : null}
        </Card>
      ) : null}

      {/* G — the three joined to the result */}
      {joinDraw > 0.001 ? (
        <svg
          width={theme.canvas.width}
          height={theme.canvas.height}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {(() => {
            const xs = TILE.cxs.map((cx) => FRAME.x + cx);
            const px = LOW.x + RESULT.x + RESULT.w[0] / 2;
            const py = LOW.y + RESULT.y - RESULT.h / 2 - 6;
            const d =
              xs.map((x) => `M ${x} ${JOIN.y0} L ${x} ${JOIN.yj}`).join(" ") +
              ` M ${xs[0]} ${JOIN.yj} L ${xs[2]} ${JOIN.yj} M ${px} ${JOIN.yj} L ${px} ${py}`;
            const len =
              3 * (JOIN.yj - JOIN.y0) + (xs[2] - xs[0]) + (py - JOIN.yj);
            return (
              <path
                d={d}
                fill="none"
                stroke={theme.color.connector}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - joinDraw)}
              />
            );
          })()}
        </svg>
      ) : null}
    </Stage>
  );
};
