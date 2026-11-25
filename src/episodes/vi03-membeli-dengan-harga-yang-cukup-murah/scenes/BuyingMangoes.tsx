/**
 * VI03 · SC01 — "Membeli Mangga", from the ChatGPT storyboard docs/vi-style/storyboards/VI03-SC01.png, in VI02's look:
 * black line art in VI01's story frame (a fruit stall and a mango, ChatGPT 16 Nov 2026, public/art/vi03/line), VI02's
 * "Kamu", IN07's cards and chips.
 *
 *  A  "Kalau beli mangga di pasar tradisional": the frame, "Kamu" at the left of a fruit stall; on "Rp20.000" a small price
 *     board on the crate.
 *  B  "Kamu ambil dulu mangganya" (a cut): one mango on a card; "Matang?" and "Rusak?" each ticked on its sentence; on
 *     "Dengan kondisi seperti ini" a dashed text box "Harganya sepadan?".
 *  C  "Tapi begitu masuk ke pasar saham" (a cut): a phone with one price; the mango's checklist, small, going grey on
 *     "melupakan"; on "dianggap sebagai nilai perusahaan" = Nilai perusahaan.
 *  D  "Padahal" (a cut): Harga ≠ Value.
 *
 * The phone's price is no real stock (no code on it), so no source tag.
 */
import {
  AppearE as Appear,
  CardE as Card,
  DrawingVI03E as Drawing,
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
  SoftGround,
  Stage,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
} from "../../../core";
import { PhoneScreens } from "../../in04-investasi-yang-cocok/components/PhoneScreens";
import { BLOCK } from "../data/timing";
import {
  BoardGrid,
  DashBox,
  KAMU_FULL,
  LINE_ART,
  Mark,
  Ring,
  Shot,
  ease,
  useWords,
} from "../components/kit";

const CX = theme.canvas.width / 2;

// A — the market: VI01's story frame, the stall, you
const FRAME = { x: 160, y: 190, w: 1600, h: 700, line: 3 };
const FLOOR = 840;
const STALL = { cx: 1170, h: 580 };
const STALL_K = STALL.h / LINE_ART["fruit-stall"].h;
const STALL_LEFT = STALL.cx - (LINE_ART["fruit-stall"].w * STALL_K) / 2;
/** The crate's front in the drawing (its own pixels), where the price board sits. No price-tag shape (Simon 16 Nov: never for a price). */
const CRATE = { x: 280, y: 465 };
const TAG = { w: 270, h: 96, size: 50, line: 3, radius: 18 };
const KAMU = { cx: 690, h: 500 };
const KAMU_W = (KAMU.h * KAMU_FULL.w) / KAMU_FULL.h;

// B — one mango, checked
const BOARD = { x: 240, y: 200, w: 1440, h: 640 };
const MANGO = { cx: 600, floor: 760, h: 470 };
const CHECK = { x: 1000, w: 540, h: 116, ys: [300, 456], size: 48, tick: 60 };
const CHECKS = [
  { text: "Matang?", at: "Cek matang", tick: "atau belum" },
  { text: "Rusak?", at: "Ada yang rusak", tick: "atau nggak" },
] as const;
const ASK = { cx: CHECK.x + CHECK.w / 2, y: 630, w: 600, h: 130, size: 46 };

// C — the stock market: one price on a screen
const PHONE = { cx: 480, y: 170, h: 720 };
const EQ = { x: 790, y: 500 };
const WORTH = { x: 870, y: 410, w: 440, h: 180 };
const MEMO = { x: 1380, y: 250, w: 340, h: 500, mango: 150 };
const CHART = [0.2, 0.32, 0.26, 0.44, 0.38, 0.55, 0.5, 0.68, 0.6, 0.78];

// D — the one line
const NOT = { w: 1180, h: 250, y: 380, size: 132 };

/** A chip with a question and, on `tick`, a green tick at its right. */
const CheckChip = ({
  text,
  w,
  h,
  size,
  tick,
  tickD,
  grey = 0,
}: {
  text: string;
  w: number;
  h: number;
  size: number;
  tick: number;
  tickD: number;
  grey?: number;
}) => {
  const c = usePalette();
  return (
    <Card x={0} y={0} w={w} h={h}>
      <div
        style={{
          position: "absolute",
          left: h * 0.42,
          top: h / 2,
          transform: "translateY(-50%)",
          ...typeStyle("title"),
          fontSize: size,
          fontWeight: 600,
          color: interpolateColors(grey, [0, 1], [c.ink, theme.color.mute]),
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
      <Mark
        kind="check"
        p={tick * (1 - 0.6 * grey)}
        x={w - h / 2}
        y={h / 2}
        size={tickD}
      />
    </Card>
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

  // C
  const forgetAt = W("melupakan");
  const forgot = ease(f, W("kebiasaan sederhana"), m.move);
  const priceLit = ease(f, W("satu harga"), m.pop);
  const eqAt = W("dianggap sebagai");

  // D
  const neq = ease(f, W("nggak sama"), m.pop);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — at the market: you, the stall, its price */}
      <Shot start={-1} to={pickAt} block={BLOCK.SC01} cutIn={false}>
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
        <Drawing name="fruit-stall" cx={STALL.cx} floor={FLOOR} h={STALL.h} />
        <Appear
          at={W("kamu nggak")}
          style={{
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
          }}
        >
          {/* he faces left as drawn: flipped, he looks at the stall */}
          <Pic
            src={staticFile(KAMU_FULL.src)}
            style={{
              position: "absolute",
              left: KAMU.cx - KAMU_W / 2,
              top: FLOOR - KAMU.h,
              width: KAMU_W,
              height: KAMU.h,
              transform: "scaleX(-1)",
            }}
          />
          <WordPill x={KAMU.cx} y={FLOOR - KAMU.h - 44} text="Kamu" size={32} />
        </Appear>
        <Appear at={W("Rp20.000")} rise={10} style={{ left: 0, top: 0 }}>
          {/* a small board on the crate, drawn like the stall: white, an ink line round it */}
          <Interactive.Div
            name="Rp20.000"
            style={{
              position: "absolute",
              left: STALL_LEFT + CRATE.x * STALL_K - TAG.w / 2,
              top: FLOOR - STALL.h + CRATE.y * STALL_K - TAG.h / 2,
              width: TAG.w,
              height: TAG.h,
              borderRadius: TAG.radius,
              background: c.cardBg,
              boxShadow: `inset 0 0 0 ${TAG.line}px ${c.ink}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: typeStyle("title").fontFamily,
              letterSpacing: typeStyle("title").letterSpacing,
              lineHeight: typeStyle("title").lineHeight,
              fontSize: TAG.size,
              fontWeight: 600,
              color: c.ink,
              whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            Rp20.000
          </Interactive.Div>
        </Appear>
      </Shot>

      {/* B — the mango in your hand, checked before you pay */}
      <Shot start={pickAt} to={stockAt} block={BLOCK.SC01}>
        <Card x={BOARD.x} y={BOARD.y} w={BOARD.w} h={BOARD.h} />
        <Appear
          at={pickAt}
          rise={30}
          style={{
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
          }}
        >
          <Drawing name="mango" cx={MANGO.cx} floor={MANGO.floor} h={MANGO.h} />
        </Appear>
        {CHECKS.map((k, i) => (
          <Appear
            key={k.text}
            at={W(k.at)}
            style={{
              left: CHECK.x,
              top: CHECK.ys[i],
              width: CHECK.w,
              height: CHECK.h,
            }}
          >
            <CheckChip
              text={k.text}
              w={CHECK.w}
              h={CHECK.h}
              size={CHECK.size}
              tick={ease(f, W(k.tick), m.pop)}
              tickD={CHECK.tick}
            />
          </Appear>
        ))}
        <DashBox
          cx={ASK.cx}
          y={ASK.y}
          w={ASK.w}
          h={ASK.h}
          at={W("Dengan kondisi")}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...typeStyle("title"),
              fontSize: ASK.size,
              fontWeight: 600,
              color: c.ink,
              whiteSpace: "nowrap",
            }}
          >
            <span>
              Harganya <span style={{ color: c.indigo }}>sepadan</span>?
            </span>
          </div>
        </DashBox>
      </Shot>

      {/* C — one price on a screen, taken for the company's value; the mango's habit forgotten */}
      <Shot start={stockAt} to={notAt} block={BLOCK.SC01}>
        <Appear
          at={stockAt}
          rise={24}
          style={{
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
          }}
        >
          <PhoneScreens cx={PHONE.cx} y={PHONE.y} h={PHONE.h}>
            <div
              style={{ position: "absolute", inset: 0, background: c.cardBg }}
            >
              <Interactive.Div
                name="Harga saham"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 120,
                  textAlign: "center",
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
                name="Rp20.000"
                style={{
                  position: "absolute",
                  left: 14,
                  right: 14,
                  top: 170,
                  height: 100,
                  borderRadius: 22,
                  background:
                    priceLit > 0.5 ? theme.color.indigoWashSolid : c.cardBg,
                }}
              >
                <Ring p={priceLit} tone={c.indigo} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...typeStyle("title"),
                    fontSize: 54,
                    fontWeight: 600,
                    color: interpolateColors(
                      priceLit,
                      [0, 1],
                      [c.ink, c.indigo],
                    ),
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  Rp20.000
                </div>
              </Interactive.Div>
              <svg
                viewBox="0 0 300 200"
                style={{
                  position: "absolute",
                  left: 20,
                  right: 20,
                  top: 330,
                  width: "calc(100% - 40px)",
                  height: 220,
                }}
              >
                <path
                  d={CHART.map(
                    (y, i) =>
                      `${i ? "L" : "M"} ${((i / (CHART.length - 1)) * 300).toFixed(1)} ${(200 - y * 200).toFixed(1)}`,
                  ).join(" ")}
                  fill="none"
                  stroke={c.indigo}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </PhoneScreens>
        </Appear>

        {/* = Nilai perusahaan */}
        <Appear
          at={eqAt}
          style={{
            left: EQ.x - 40,
            top: EQ.y - 60,
            width: 80,
            height: 120,
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...typeStyle("title"),
              fontSize: 110,
              fontWeight: 600,
              lineHeight: "120px",
              color: c.ink,
            }}
          >
            =
          </div>
        </Appear>
        <Appear
          at={eqAt + m.sec(0.25)}
          style={{
            left: WORTH.x,
            top: WORTH.y,
            width: WORTH.w,
            height: WORTH.h,
          }}
        >
          <Card x={0} y={0} w={WORTH.w} h={WORTH.h}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                ...typeStyle("title"),
                fontSize: 48,
                fontWeight: 600,
                lineHeight: 1.2,
                color: c.ink,
              }}
            >
              Nilai perusahaan
            </div>
          </Card>
        </Appear>

        {/* the habit from the market, small, forgotten */}
        <Appear
          at={forgetAt}
          style={{ left: MEMO.x, top: MEMO.y, width: MEMO.w, height: MEMO.h }}
        >
          <Card
            x={0}
            y={0}
            w={MEMO.w}
            h={MEMO.h}
            style={{
              background: interpolateColors(
                forgot,
                [0, 1],
                [c.cardBg, theme.color.neutralDisc],
              ),
            }}
          >
            <Drawing
              name="mango"
              cx={MEMO.w / 2}
              floor={40 + MEMO.mango}
              h={MEMO.mango}
              style={{
                filter:
                  forgot > 0.001
                    ? `contrast(${(1 - 0.62 * forgot).toFixed(3)}) brightness(${(1 + 0.5 * forgot).toFixed(3)})`
                    : undefined,
              }}
            />
            {CHECKS.map((k, i) => (
              <div
                key={k.text}
                style={{
                  position: "absolute",
                  left: 24,
                  top: 230 + i * 100,
                  width: MEMO.w - 48,
                  height: 80,
                }}
              >
                <CheckChip
                  text={k.text}
                  w={MEMO.w - 48}
                  h={80}
                  size={32}
                  tick={1}
                  tickD={44}
                  grey={forgot}
                />
              </div>
            ))}
            <Interactive.Div
              name="Harganya sepadan?"
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                top: 430,
                textAlign: "center",
                fontFamily: typeStyle("label").fontFamily,
                letterSpacing: typeStyle("label").letterSpacing,
                lineHeight: typeStyle("label").lineHeight,
                fontSize: 28,
                fontWeight: 600,
                color: interpolateColors(
                  forgot,
                  [0, 1],
                  [c.ink, theme.color.mute],
                ),
                whiteSpace: "nowrap",
              }}
            >
              Harganya sepadan?
            </Interactive.Div>
          </Card>
        </Appear>
      </Shot>

      {/* D — price is not value */}
      <Shot start={notAt} to={1e6} block={BLOCK.SC01} cutOut={false}>
        <Appear
          at={notAt}
          style={{
            left: CX - NOT.w / 2,
            top: NOT.y,
            width: NOT.w,
            height: NOT.h,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: NOT.h / 2,
              background: c.cardBg,
              boxShadow: `${shadow.soft}, inset 0 0 0 3px ${c.ink}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 48,
              ...typeStyle("title"),
              fontSize: NOT.size,
              fontWeight: 700,
              color: c.ink,
              whiteSpace: "nowrap",
            }}
          >
            <span>Harga</span>
            <span
              style={{
                color: c.indigo,
                opacity: neq,
                display: "inline-block",
                transform: `scale(${(0.6 + 0.4 * neq).toFixed(3)})`,
              }}
            >
              ≠
            </span>
            <span>Value</span>
          </div>
        </Appear>
      </Shot>
    </Stage>
  );
};
