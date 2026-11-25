/**
 * VI03 · SC01 v3 — "Membeli Mangga" in VI01/VI02's own language (Simon 16 Nov: "lanjut scene 1 dengan cara yang sama" as SC02 v3):
 * ONE story frame that builds sentence by sentence, as VI01 SC01 (warung, Ibu Sari, her cash book inside the frame, then the
 * split screen) and VI02 SC03 do. No cuts inside the scene. Storyboard: docs/vi-style/storyboards/VI03-SC01-v3.png.
 * The first build (one Shot per sentence) is scenes/BuyingMangoes.tsx (switch SC01_LOOK).
 *
 *  A  "Kalau beli mangga di pasar tradisional": the frame, the fruit stall, "Kamu"; on "Rp20.000" a small board on the crate.
 *  B  "Kamu ambil dulu mangganya": a mango flies from the crate into a check card at the frame's right (like Ibu Sari's cash
 *     book): Matang? ✓, Rusak? ✓ on their sentences; on "Baru setelah itu" the card's Harga row appears (the crate's board
 *     stays where it is: Simon 16 Nov, "ga perlu terbang"); on "sepadan" the last row lights: Sepadan?
 *  C  "Tapi begitu masuk ke pasar saham": the frame splits (VI01 SC01's split screen). Simon 16 Nov: the stock on the LEFT with
 *     "Kamu" staying there; the stall and its board fade out, the check card stays put at full size in the right half; then a
 *     price card comes in beside "Kamu"; on "melupakan" the check card goes grey. On "satu harga" the price lights; on
 *     "dianggap sebagai" a chip "dianggap nilai perusahaan" hangs under it (Simon 16 Nov). The stall, grown, tucks under the
 *     check card (Simon: "gedein aja dikit sampe overlap dengan kartu mangganya").
 *  D  "Padahal": one summary line under the frame, "Harga bukan value" — in words: Simon 16 Nov, no "not equal" sign anywhere.
 *
 * The stock on the right has no code (no real stock is shown), so no source tag.
 */
import {
  AppearE as Appear,
  CardE as Card,
  DrawingVI03E as Drawing,
  LineE as Line,
  PicE as Pic,
  WordPillE as WordPill,
} from "../../../editable";
import {
  interpolateColors,
  staticFile,
  useCurrentFrame,
  Interactive,
} from "remotion";
import {
  Candles,
  SoftGround,
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
  KAMU_FULL,
  LINE_ART,
  Mark,
  Ring,
  ease,
  useWords,
} from "../components/kit";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// the story frame (VI01's)
const FRAME = { x: 160, y: 190, w: 1600, h: 700, line: 3 };
const FLOOR = 840;
const MID = FRAME.x + FRAME.w / 2;
/** The summary line's centre: between the frame's bottom (890) and the subtitle band (972). */
const SUMMARY_Y = 930;

// A–B: the market fills the frame; C–D: it shrinks into the left half
/** The market stays where it is and fades out at the split (Simon 16 Nov: "gajadi ke sisi kanan, tapi fade out aja"). */
const STALL = { cx: 720, h: 520 };
/** "Kamu" stays where he stands, at the left (Simon 16 Nov: "'kamu' juga stay di sisi kiri"). */
const KAMU = { cx: 330, h: 470 };
/** The crate's front in the stall drawing (its own pixels): where the price board sits and the mango comes from. */
const CRATE = { x: 280, y: 465 };
const BOARD = { w: 250, h: 88, size: 46 };
/** The check card: at the frame's right, then small in the left half. Its layout is in its own units, scaled by `s`. */
/** The check card stays where it is, at its full size (Simon 16 Nov: "kartu mangganya jangan mengecil"), centred in what becomes the
 * right half (Simon: "align-center pada sisi kanan") — from the frame's middle to its right edge — from the moment it appears. */
const CK_W = 540;
const CHECK = { x: (MID + FRAME.x + FRAME.w) / 2 - CK_W / 2, y: 230, s: 1 };
const CK = { w: CK_W, h: 620, pad: 34, head: 120, row: 92, gap: 14 };
const ROWS = [
  { label: "Matang?", at: "Cek matang", tick: "atau belum" },
  { label: "Rusak?", at: "Ada yang rusak", tick: "atau nggak" },
  { label: "Harga", at: "Baru setelah", tick: "" },
  { label: "Sepadan?", at: "harganya sepadan", tick: "" },
] as const;

// C–D: the stock market in the right half
const PRICE = { x: 450, y: 300, w: 440, h: 430, pad: 30 };
/** A short made-up tape, gently rising, for the price card: no code, no figures but the one price. */
const TAPE: Bar[] = [
  { o: 100, h: 101, l: 99.4, c: 100.6 },
  { o: 100.6, h: 101.4, l: 100.1, c: 100.3 },
  { o: 100.3, h: 101.9, l: 100.1, c: 101.6 },
  { o: 101.6, h: 102.2, l: 101.0, c: 101.2 },
  { o: 101.2, h: 103.0, l: 101.1, c: 102.7 },
  { o: 102.7, h: 103.6, l: 102.4, c: 103.3 },
];

/** The check card's face at scale `s`. `rows` 0..1 each; `ticks` 0..1; `lit` the last row; `grey` the whole card forgotten. */
const CheckFace = ({
  s,
  rows,
  ticks,
  lit,
  grey,
  priceIn,
}: {
  s: number;
  rows: number[];
  ticks: number[];
  lit: number;
  grey: number;
  priceIn: number;
}) => {
  const c = usePalette();
  const ink = interpolateColors(grey, [0, 1], [c.ink, theme.color.mute]);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Interactive.Div
        name="Mangga"
        style={{
          position: "absolute",
          left: CK.pad * s + 110 * s,
          top: CK.pad * s,
          height: 90 * s,
          display: "flex",
          alignItems: "center",
          fontFamily: typeStyle("title").fontFamily,
          letterSpacing: typeStyle("title").letterSpacing,
          lineHeight: typeStyle("title").lineHeight,
          fontSize: 46 * s,
          fontWeight: 600,
          color: ink,
        }}
      >
        Mangga
      </Interactive.Div>
      {ROWS.map((r, i) => {
        const p = rows[i];
        if (p <= 0.001) return null;
        const y = CK.pad * s + CK.head * s + i * (CK.row + CK.gap) * s;
        const isLit = i === 3 ? lit * (1 - grey) : 0;
        return (
          <div
            key={r.label}
            style={{
              position: "absolute",
              left: CK.pad * s,
              right: CK.pad * s,
              top: y + (1 - p) * 10 * s,
              height: CK.row * s,
              opacity: p,
              borderRadius: 20 * s,
              background: isLit > 0.5 ? theme.color.indigoWashSolid : c.cardBg,
              boxShadow: `inset 0 0 0 ${2 * s}px ${theme.color.skeleton}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `0 ${28 * s}px`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20 * s,
                boxShadow: `inset 0 0 0 ${3 * s}px ${c.indigo}`,
                opacity: isLit,
              }}
            />
            <div
              style={{
                ...typeStyle("label"),
                fontSize: 36 * s,
                fontWeight: 600,
                color:
                  i === 3
                    ? interpolateColors(isLit, [0, 1], [ink, c.indigo])
                    : ink,
                whiteSpace: "nowrap",
              }}
            >
              {r.label}
            </div>
            {i < 2 ? (
              <div
                style={{ position: "relative", width: 52 * s, height: 52 * s }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    filter:
                      grey > 0.001
                        ? `grayscale(${grey.toFixed(3)})`
                        : undefined,
                  }}
                >
                  <Mark
                    kind="check"
                    p={ticks[i]}
                    x={26 * s}
                    y={26 * s}
                    size={50 * s}
                  />
                </div>
              </div>
            ) : i === 2 ? (
              <div
                style={{
                  opacity: priceIn,
                  ...typeStyle("title"),
                  fontSize: 36 * s,
                  fontWeight: 600,
                  color: ink,
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                Rp20.000
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export const SC01 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(1, BLOCK.SC01);
  const g = f + BLOCK.SC01;

  const pickAt = W("Kamu ambil");
  const stockAt = W("Tapi begitu");
  const notAt = W("Padahal");

  const split = ease(f, stockAt, m.sec(1.1));
  const stall = STALL;
  const stallOut = ease(f, stockAt, m.fade);
  const kamu = KAMU;
  const kamuW = (kamu.h * KAMU_FULL.w) / KAMU_FULL.h;
  const card = CHECK;

  // where the crate is, on screen, for the stall's current size
  const k = stall.h / LINE_ART["fruit-stall"].h;
  const crate = {
    x: stall.cx - (LINE_ART["fruit-stall"].w * k) / 2 + CRATE.x * k,
    y: FLOOR - stall.h + CRATE.y * k,
  };

  // B — the mango and the price board fly into the card
  const cardIn = ease(f, pickAt, m.reveal);
  const mangoFly = ease(f, pickAt, m.sec(0.9));
  const mangoTo = {
    x: card.x + (CK.pad + 50) * card.s,
    y: card.y + (CK.pad + 45) * card.s,
    h: 100 * card.s,
  };
  const mango = {
    x: mix(crate.x, mangoTo.x, mangoFly),
    y: mix(crate.y - 40, mangoTo.y, mangoFly),
    h: mix(70, mangoTo.h, mangoFly),
  };
  const rows = ROWS.map((r) => ease(f, W(r.at) - m.sec(0.15), m.reveal));
  const ticks = ROWS.map((r) => (r.tick ? ease(f, W(r.tick), m.pop) : 0));
  const lit = ease(f, W("harganya sepadan"), m.pop);

  // C — forgotten; the screen's one price
  const grey = ease(f, W("melupakan"), m.move);
  /** the price card comes in on "pasar saham", after the stall has faded from that side */
  const priceAt = Math.max(W("pasar saham"), stockAt + m.fade);
  const priceCard = ease(f, priceAt, m.reveal);
  const priceLit = ease(f, W("satu harga"), m.pop);
  const equals = ease(f, W("dianggap sebagai"), m.reveal);

  // D — the summary line
  const named = ease(f, notAt, m.reveal);

  const grid = gridOf(
    TAPE.map((b) => b.c),
    [Math.min(...TAPE.map((b) => b.l)), Math.max(...TAPE.map((b) => b.h))],
    {
      x: PRICE.pad,
      y: 200,
      w: PRICE.w - 2 * PRICE.pad,
      h: PRICE.h - 200 - PRICE.pad,
    },
    0.08,
  );

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* the story frame */}
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
      {/* C — the split: a divider grows down the middle */}
      {split > 0.001 ? (
        <Interactive.Div
          name="Objek"
          style={{
            position: "absolute",
            left: MID - 1.5,
            top: FRAME.y + 40,
            width: 3,
            height: (FRAME.h - 80) * split,
            borderRadius: 2,
            background: theme.color.skeleton,
          }}
        />
      ) : null}

      {/* A — the stall, its price board */}
      {stallOut < 0.999 ? (
        <Drawing
          name="fruit-stall"
          cx={stall.cx}
          floor={FLOOR}
          h={stall.h}
          style={{ opacity: 1 - stallOut }}
        />
      ) : null}
      {/* "Kamu", who later walks across into the stock market */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: ease(f, W("kamu nggak"), m.reveal),
        }}
      >
        <Pic
          src={staticFile(KAMU_FULL.src)}
          style={{
            position: "absolute",
            left: kamu.cx - kamuW / 2,
            top: FLOOR - kamu.h,
            width: kamuW,
            height: kamu.h,
            transform: "scaleX(-1)",
          }}
        />
        <WordPill x={kamu.cx} y={FLOOR - kamu.h - 40} text="Kamu" size={30} />
      </div>

      {/* B — the check card */}
      {cardIn > 0.001 ? (
        <Interactive.Div
          name="Objek"
          style={{
            position: "absolute",
            left: card.x,
            top: card.y + (1 - cardIn) * 14,
            width: CK.w * card.s,
            height: CK.h * card.s,
            opacity: cardIn,
          }}
        >
          <Card
            x={0}
            y={0}
            w={CK.w * card.s}
            h={CK.h * card.s}
            style={{
              background: interpolateColors(
                grey,
                [0, 1],
                [c.cardBg, theme.color.neutralDisc],
              ),
            }}
          >
            <CheckFace
              s={card.s}
              rows={rows}
              ticks={ticks}
              lit={lit}
              grey={grey}
              priceIn={1}
            />
          </Card>
        </Interactive.Div>
      ) : null}
      {/* the crate's price board (indigo fill, white text, no border: Simon 16 Nov); it stays on the crate — the card's Harga row just appears (Simon 16 Nov) */}
      {f >= W("Rp20.000") && stallOut < 0.999
        ? (() => {
            const p = ease(f, W("Rp20.000"), m.pop) * (1 - stallOut);
            const s0 = 1;
            const x = crate.x;
            const y = crate.y;
            const sc = s0;
            return (
              <Interactive.Div
                name="Rp20.000"
                style={{
                  position: "absolute",
                  left: x - (BOARD.w * sc) / 2,
                  top: y - (BOARD.h * sc) / 2,
                  width: BOARD.w * sc,
                  height: BOARD.h * sc,
                  opacity: p,
                  borderRadius: 16 * sc,
                  background: c.indigo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: typeStyle("title").fontFamily,
                  letterSpacing: typeStyle("title").letterSpacing,
                  lineHeight: typeStyle("title").lineHeight,
                  fontSize: BOARD.size * sc,
                  fontWeight: 600,
                  color: c.cardBg,
                  whiteSpace: "nowrap",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                Rp20.000
              </Interactive.Div>
            );
          })()
        : null}

      {/* the mango: from the crate into the card's head */}
      {f >= pickAt ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            filter:
              grey > 0.001
                ? `grayscale(1) contrast(${(1 - 0.6 * grey).toFixed(3)}) brightness(${(1 + 0.45 * grey).toFixed(3)})`
                : undefined,
          }}
        >
          <Drawing
            name="mango"
            cx={mango.x}
            floor={mango.y + mango.h / 2}
            h={mango.h}
          />
        </div>
      ) : null}

      {/* C — the stock market: one price on a screen */}
      {priceCard > 0.001 ? (
        <Interactive.Div
          name="Harga saham"
          style={{
            position: "absolute",
            left: PRICE.x,
            top: PRICE.y + (1 - priceCard) * 14,
            width: PRICE.w,
            height: PRICE.h,
            opacity: priceCard,
          }}
        >
          <Card
            x={0}
            y={0}
            w={PRICE.w}
            h={PRICE.h}
            style={{ boxShadow: priceLit > 0.5 ? shadow.glow : shadow.soft }}
          >
            <Ring p={priceLit} tone={c.indigo} />
            <Interactive.Div
              name="Harga saham"
              style={{
                position: "absolute",
                left: PRICE.pad,
                top: 28,
                fontFamily: typeStyle("label").fontFamily,
                letterSpacing: typeStyle("label").letterSpacing,
                lineHeight: typeStyle("label").lineHeight,
                fontSize: 30,
                fontWeight: 600,
                color: c.slate,
              }}
            >
              Harga saham
            </Interactive.Div>
            <Interactive.Div
              name="20.000"
              style={{
                position: "absolute",
                left: PRICE.pad,
                top: 76,
                fontFamily: typeStyle("title").fontFamily,
                letterSpacing: typeStyle("title").letterSpacing,
                lineHeight: typeStyle("title").lineHeight,
                fontSize: 60,
                fontWeight: 700,
                color: interpolateColors(priceLit, [0, 1], [c.ink, c.indigo]),
                fontVariantNumeric: "tabular-nums",
              }}
            >
              20.000
            </Interactive.Div>
            <Candles
              bars={TAPE}
              grid={grid}
              shown={ease(f, priceAt + m.sec(0.2), m.sec(0.8))}
            />
          </Card>
        </Interactive.Div>
      ) : null}
      {equals > 0.001 ? (
        <Interactive.Div
          name="dianggap nilai perusahaan"
          style={{
            position: "absolute",
            left: PRICE.x + PRICE.w / 2,
            top: PRICE.y + PRICE.h + 50,
            transform: "translate(-50%, -50%)",
            opacity: equals,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "10px 28px",
            borderRadius: 999,
            background: interpolateColors(
              named,
              [0, 1],
              [c.cardBg, theme.color.neutralDisc],
            ),
            boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`,
            fontFamily: typeStyle("label").fontFamily,
            letterSpacing: typeStyle("label").letterSpacing,
            lineHeight: typeStyle("label").lineHeight,
            fontSize: 32,
            fontWeight: 600,
            color: interpolateColors(named, [0, 1], [c.ink, theme.color.mute]),
            whiteSpace: "nowrap",
          }}
        >
          dianggap nilai perusahaan
        </Interactive.Div>
      ) : null}

      {/* D — the summary, under the frame and clear of the subtitle band */}
      <Appear at={notAt} style={{ left: 0, top: 0 }}>
        <Line
          x={FRAME.x}
          y={SUMMARY_Y}
          w={FRAME.w}
          text="Harga bukan value"
          mark="value"
          size={46}
          align="center"
          weight={600}
        />
      </Appear>
    </Stage>
  );
};
