/**
 * VI03 · SC03 — "Berapa Nilai Warung Ibu Sari?", from the ChatGPT storyboard docs/vi-style/storyboards/VI03-SC03.png, in
 * VI02's look: VI01's Ibu Sari and warung (black line art) in VI01's story frame, VI02's "Kamu", IN07's cards.
 *
 *  A  "Lalu, dari mana harga wajar itu datang?": one question card.
 *  B  "Kita kembali ke Ibu Sari" (a cut): the frame, the warung, Ibu Sari and her name; three chips on their words:
 *     Laba Rp20 juta / tahun, 10 tahun, Pelanggan stabil.
 *  C  "Kalau kamu ingin membeli warung itu" (a cut): "Kamu" asking "Berapa kali laba?", Ibu Sari and her warung at the right;
 *     a line of multiples 1x … 30x under them. 1x: Rp20 juta, Terlalu murah. 30x: Rp600 juta, 30 tahun balik modal.
 *     8–12x lit as a band: Warung sejenis.
 *  D  "Inti valuasi sebenarnya sederhana" (a cut): Berapa banyak? / Berapa lama? / Seberapa yakin?, joined into Discounting.
 *  E  "Buffett menghitung" (a cut): Buffett, Ibu Sari, Tuntun Research Institute, joined into Reference Fair Value.
 *
 * Ibu Sari's figures are the script's example (Rp20 juta a year, ten years), so no source tag.
 */
import {
  AppearE as Appear,
  CardE as Card,
  FigureE as Figure,
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
  KAMU_FULL,
  PhotoTile,
  Ring,
  Shot,
  ease,
  useWords,
} from "../components/kit";

const CX = theme.canvas.width / 2;

// A — the question
const ASK = { w: 1000, h: 260, y: 360, size: 84 };

// B — VI01's story frame, the warung and Ibu Sari
const FRAME = { x: 160, y: 190, w: 1600, h: 700, line: 3 };
const FLOOR = 770;
const WARUNG = { h: 450, cx: 880 };
const IBU = { h: 410, cx: 460 };
const NAME_Y = 830;
const CHIP = {
  x: 1200,
  w: 520,
  h: 104,
  ys: [300, 440, 580],
  disc: 72,
  size: 34,
};
const CHIPS = [
  { icon: "coins", text: "Laba Rp20 juta / tahun", at: "laba bersih" },
  { icon: "calendar-check", text: "10 tahun", at: "sepuluh tahun" },
  { icon: "users-three", text: "Pelanggan stabil", at: "pelanggannya relatif" },
] as const;

// C — you, her warung, and the line of multiples
const C_FLOOR = 540;
const KAMU = { cx: 330, h: 330 };
const KAMU_W = (KAMU.h * KAMU_FULL.w) / KAMU_FULL.h;
const BUBBLE = { x: 440, y: 200, w: 470, h: 110 };
const C_WARUNG = { cx: 1380, h: 300 };
const C_IBU = { cx: 1080, h: 280 };
const LINE = {
  x0: 360,
  x1: 1560,
  y: 730,
  tick: 14,
  callY: 650,
  labelY: 778,
  chipY: 860,
};
const MULT = { lo: 1, hi: 30 };
const xOf = (k: number) =>
  LINE.x0 + ((k - MULT.lo) / (MULT.hi - MULT.lo)) * (LINE.x1 - LINE.x0);
const BAND = { lo: 8, hi: 12, h: 26 };

// D — the three questions
const Q = { w: 440, h: 360, y: 210, gap: 70, disc: 130, size: 44 };
const qX = (i: number) => CX - (3 * Q.w + 2 * Q.gap) / 2 + i * (Q.w + Q.gap);
const QS = [
  { icon: "coins", text: "Berapa banyak?", at: "berapa banyak" },
  { icon: "clock", text: "Berapa lama?", at: "berapa lama" },
  { icon: "shield-check", text: "Seberapa yakin?", at: "seberapa yakin" },
] as const;
const JOIN = { y: 640, pillY: 770 };

// E — the three who count the same way
const T = { d: 300, y: 200, gap: 110 };
const T_H = (T.d * 423) / 406;
const tX = (i: number) => CX - (3 * T.d + 2 * T.gap) / 2 + i * (T.d + T.gap);
const T_NAME = T.y + T_H + 22;

/** A chip: an icon on a grey disc, a short text. */
const Chip = ({
  icon,
  text,
  w,
  h,
  disc,
  size,
}: {
  icon: string;
  text: string;
  w: number;
  h: number;
  disc: number;
  size: number;
}) => {
  const c = usePalette();
  return (
    <Card x={0} y={0} w={w} h={h}>
      <Interactive.Div
        name="Objek"
        style={{
          position: "absolute",
          left: (h - disc) / 2,
          top: (h - disc) / 2,
          width: disc,
          height: disc,
          borderRadius: 999,
          background: theme.color.neutralDisc,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Glyph icon={icon} size={disc * 0.56} tone={c.indigo} />
      </Interactive.Div>
      <Interactive.Div
        name="Objek"
        style={{
          position: "absolute",
          left: h,
          right: 20,
          top: h / 2,
          transform: "translateY(-50%)",
          fontFamily: typeStyle("label").fontFamily,
          letterSpacing: typeStyle("label").letterSpacing,
          lineHeight: typeStyle("label").lineHeight,
          fontSize: size,
          fontWeight: 600,
          color: c.ink,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Interactive.Div>
    </Card>
  );
};

/** Lines from the bottoms of `xs` (at `y0`) joining at `yj` and running down to `y1` at `cx`, drawn up to `p`. */
const Join = ({
  xs,
  y0,
  yj,
  y1,
  cx,
  p,
}: {
  xs: number[];
  y0: number;
  yj: number;
  y1: number;
  cx: number;
  p: number;
}) => {
  if (p <= 0.001) return null;
  const lo = Math.min(...xs);
  const hi = Math.max(...xs);
  const len = (yj - y0) * xs.length + (hi - lo) + (y1 - yj);
  const d =
    xs.map((x) => `M ${x} ${y0} L ${x} ${yj}`).join(" ") +
    ` M ${lo} ${yj} L ${hi} ${yj} M ${cx} ${yj} L ${cx} ${y1}`;
  return (
    <svg
      width={theme.canvas.width}
      height={theme.canvas.height}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <path
        d={d}
        fill="none"
        stroke={theme.color.connector}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
    </svg>
  );
};

export const SC03 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(3, BLOCK.SC03);
  const g = f + BLOCK.SC03;

  const sariAt = W("Kita kembali");
  const buyAt = W("Kalau kamu ingin");
  const coreAt = W("Inti valuasi");
  const whoAt = W("Buffett menghitung");

  // C
  const lineAt = W("berapa kali laba");
  const oneAt = W("Satu kali");
  const oneRp = W("dua puluh juta");
  const cheapAt = W("Terlalu murah");
  const thirtyAt = W("Tiga puluh kali");
  const thirtyRp = W("enam ratus");
  const backAt = W("tiga puluh tahun");
  const bandAt = W("warung sejenis");
  const band = ease(f, bandAt, m.reveal);

  // D
  const discAt = W("discounting");

  // E
  const resultAt = W("Reference Fair Value");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the question */}
      <Shot start={-1} to={sariAt} block={BLOCK.SC03} cutIn={false}>
        <Appear
          at={-m.reveal}
          style={{
            left: CX - ASK.w / 2,
            top: ASK.y,
            width: ASK.w,
            height: ASK.h,
          }}
        >
          <Card x={0} y={0} w={ASK.w} h={ASK.h}>
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
                <span style={{ color: c.indigo }}>Harga wajar</span> dari mana?
              </span>
            </div>
          </Card>
        </Appear>
      </Shot>

      {/* B — Ibu Sari's warung, and what it makes */}
      <Shot start={sariAt} to={buyAt} block={BLOCK.SC03}>
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
        <Figure name="warung" cx={WARUNG.cx} floor={FLOOR} h={WARUNG.h} />
        {(() => {
          const at = W("Ibu Sari");
          return f >= at - m.reveal ? (
            <Figure
              name="ibu-sari"
              cx={IBU.cx}
              floor={FLOOR}
              h={IBU.h}
              style={{ opacity: ease(f, at - m.reveal / 2, m.reveal) }}
            />
          ) : null;
        })()}
        <Appear at={W("Ibu Sari") + m.sec(0.3)} style={{ left: 0, top: 0 }}>
          <WordPill x={IBU.cx} y={NAME_Y} text="Ibu Sari" size={32} />
        </Appear>
        {CHIPS.map((k, i) => (
          <Appear
            key={k.text}
            at={W(k.at)}
            style={{
              left: CHIP.x,
              top: CHIP.ys[i],
              width: CHIP.w,
              height: CHIP.h,
            }}
          >
            <Chip
              icon={k.icon}
              text={k.text}
              w={CHIP.w}
              h={CHIP.h}
              disc={CHIP.disc}
              size={CHIP.size}
            />
          </Appear>
        ))}
      </Shot>

      {/* C — how many times its profit would you pay? */}
      <Shot start={buyAt} to={coreAt} block={BLOCK.SC03}>
        {/* flipped, as in SC01: he looks at the warung */}
        <Pic
          src={staticFile(KAMU_FULL.src)}
          style={{
            position: "absolute",
            left: KAMU.cx - KAMU_W / 2,
            top: C_FLOOR - KAMU.h,
            width: KAMU_W,
            height: KAMU.h,
            opacity: ease(f, -m.reveal, m.reveal),
            transform: "scaleX(-1)",
          }}
        />
        <Appear
          at={W("berapa kali")}
          style={{
            left: BUBBLE.x,
            top: BUBBLE.y,
            width: BUBBLE.w,
            height: BUBBLE.h,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: BUBBLE.h / 2,
              background: c.cardBg,
              boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...typeStyle("title"),
              fontSize: 46,
              fontWeight: 600,
              color: c.indigo,
              whiteSpace: "nowrap",
            }}
          >
            Berapa kali laba?
          </div>
        </Appear>
        <Figure
          name="warung"
          cx={C_WARUNG.cx}
          floor={C_FLOOR}
          h={C_WARUNG.h}
          style={{ opacity: ease(f, -m.reveal, m.reveal) }}
        />
        <Figure
          name="ibu-sari"
          cx={C_IBU.cx}
          floor={C_FLOOR}
          h={C_IBU.h}
          style={{ opacity: ease(f, -m.reveal, m.reveal) }}
        />
        <Interactive.Div
          name="Laba Rp20 juta / tahun"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            opacity: ease(f, -m.reveal, m.reveal),
          }}
        >
          <WordPill
            x={C_WARUNG.cx}
            y={C_FLOOR - C_WARUNG.h - 40}
            text="Laba Rp20 juta / tahun"
            size={28}
          />
        </Interactive.Div>

        {/* the line of multiples */}
        <svg
          width={theme.canvas.width}
          height={theme.canvas.height}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {(() => {
            const p = ease(f, lineAt, m.sec(0.7));
            const len = LINE.x1 - LINE.x0;
            return p > 0.001 ? (
              <g>
                {band > 0.001 ? (
                  <rect
                    x={xOf(BAND.lo)}
                    y={LINE.y - BAND.h / 2}
                    width={(xOf(BAND.hi) - xOf(BAND.lo)) * band}
                    height={BAND.h}
                    rx={BAND.h / 2}
                    fill={theme.color.indigoWashSolid}
                    stroke={c.indigo}
                    strokeWidth={2}
                  />
                ) : null}
                <line
                  x1={LINE.x0}
                  y1={LINE.y}
                  x2={LINE.x1}
                  y2={LINE.y}
                  stroke={c.ink}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - p)}
                />
                {[MULT.lo, MULT.hi].map((k) => (
                  <circle
                    key={k}
                    cx={xOf(k)}
                    cy={LINE.y}
                    r={LINE.tick}
                    fill={c.cardBg}
                    stroke={c.ink}
                    strokeWidth={4}
                    opacity={ease(
                      f,
                      lineAt + m.sec(k === MULT.lo ? 0 : 0.6),
                      m.pop,
                    )}
                  />
                ))}
              </g>
            ) : null;
          })()}
        </svg>
        {[MULT.lo, MULT.hi].map((k) => (
          <Appear
            key={k}
            at={lineAt + m.sec(k === MULT.lo ? 0 : 0.6)}
            style={{
              left: xOf(k) - 100,
              width: 200,
              top: LINE.labelY - 26,
              textAlign: "center",
            }}
          >
            <div
              style={{
                ...typeStyle("title"),
                fontSize: 40,
                fontWeight: 600,
                color: c.ink,
              }}
            >
              {k}x
            </div>
          </Appear>
        ))}

        {/* 1x: too cheap */}
        <Appear at={oneAt} style={{ left: 0, top: 0 }}>
          <svg
            width={theme.canvas.width}
            height={theme.canvas.height}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <circle
              cx={xOf(MULT.lo)}
              cy={LINE.y}
              r={LINE.tick * 0.55}
              fill={c.indigo}
            />
          </svg>
        </Appear>
        <Appear at={oneRp} style={{ left: 0, top: 0 }}>
          <WordPill
            x={xOf(MULT.lo)}
            y={LINE.callY}
            text="Rp20 juta"
            size={36}
          />
        </Appear>
        <Appear at={cheapAt} style={{ left: 0, top: 0 }}>
          <Interactive.Div
            name="Terlalu murah"
            style={{
              position: "absolute",
              left: xOf(MULT.lo),
              top: LINE.chipY,
              transform: "translate(-50%, -50%)",
              padding: "10px 26px",
              borderRadius: 999,
              background: theme.color.neutralDisc,
              fontFamily: typeStyle("label").fontFamily,
              letterSpacing: typeStyle("label").letterSpacing,
              lineHeight: typeStyle("label").lineHeight,
              fontSize: 32,
              fontWeight: 600,
              color: c.slate,
              whiteSpace: "nowrap",
            }}
          >
            Terlalu murah
          </Interactive.Div>
        </Appear>

        {/* 30x: thirty years to get it back */}
        <Appear at={thirtyAt} style={{ left: 0, top: 0 }}>
          <svg
            width={theme.canvas.width}
            height={theme.canvas.height}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <circle
              cx={xOf(MULT.hi)}
              cy={LINE.y}
              r={LINE.tick * 0.55}
              fill={c.indigo}
            />
          </svg>
        </Appear>
        <Appear at={thirtyRp} style={{ left: 0, top: 0 }}>
          <WordPill
            x={xOf(MULT.hi)}
            y={LINE.callY}
            text="Rp600 juta"
            size={36}
          />
        </Appear>
        <Appear at={backAt} style={{ left: 0, top: 0 }}>
          <Interactive.Div
            name="30 tahun balik modal"
            style={{
              position: "absolute",
              left: xOf(MULT.hi),
              top: LINE.chipY,
              transform: "translate(-50%, -50%)",
              padding: "10px 26px",
              borderRadius: 999,
              background: theme.color.neutralDisc,
              fontFamily: typeStyle("label").fontFamily,
              letterSpacing: typeStyle("label").letterSpacing,
              lineHeight: typeStyle("label").lineHeight,
              fontSize: 32,
              fontWeight: 600,
              color: c.slate,
              whiteSpace: "nowrap",
            }}
          >
            30 tahun balik modal
          </Interactive.Div>
        </Appear>

        {/* 8–12x: what warungs like hers change hands at */}
        <Appear at={W("8–12")} style={{ left: 0, top: 0 }}>
          <WordPill
            x={(xOf(BAND.lo) + xOf(BAND.hi)) / 2}
            y={LINE.callY}
            text="8–12x"
            size={36}
          />
        </Appear>
        <Appear at={bandAt + m.sec(0.3)} style={{ left: 0, top: 0 }}>
          <Interactive.Div
            name="Warung sejenis"
            style={{
              position: "absolute",
              left: (xOf(BAND.lo) + xOf(BAND.hi)) / 2,
              top: LINE.chipY,
              transform: "translate(-50%, -50%)",
              padding: "10px 26px",
              borderRadius: 999,
              background: theme.color.indigoWashSolid,
              boxShadow: `inset 0 0 0 2px ${c.indigo}`,
              fontFamily: typeStyle("label").fontFamily,
              letterSpacing: typeStyle("label").letterSpacing,
              lineHeight: typeStyle("label").lineHeight,
              fontSize: 32,
              fontWeight: 600,
              color: c.indigo,
              whiteSpace: "nowrap",
            }}
          >
            Warung sejenis
          </Interactive.Div>
        </Appear>
      </Shot>

      {/* D — the three questions, one word for them */}
      <Shot start={coreAt} to={whoAt} block={BLOCK.SC03}>
        {QS.map((q, i) => {
          const at = W(q.at);
          const p = ease(f, at - m.sec(0.2), m.reveal);
          const lit =
            ease(f, at, m.pop) *
            (i < 2
              ? 1 - ease(f, W(QS[i + 1].at), m.pop)
              : 1 - ease(f, discAt, m.pop));
          return p > 0.001 ? (
            <div
              key={q.text}
              style={{
                position: "absolute",
                left: qX(i),
                top: Q.y + (1 - p) * 14,
                width: Q.w,
                height: Q.h,
                opacity: p,
              }}
            >
              <Card
                x={0}
                y={0}
                w={Q.w}
                h={Q.h}
                style={{ boxShadow: lit > 0.5 ? shadow.glow : shadow.soft }}
              >
                <Ring p={lit} tone={c.indigo} />
                <div
                  style={{
                    position: "absolute",
                    left: (Q.w - Q.disc) / 2,
                    top: 56,
                    width: Q.disc,
                    height: Q.disc,
                    borderRadius: 999,
                    background: theme.color.neutralDisc,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Glyph
                    icon={q.icon}
                    size={Q.disc * 0.54}
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
                    width: Q.w,
                    top: 236,
                    textAlign: "center",
                    ...typeStyle("title"),
                    fontSize: Q.size,
                    fontWeight: 600,
                    color: c.ink,
                    whiteSpace: "nowrap",
                  }}
                >
                  {q.text}
                </div>
              </Card>
            </div>
          ) : null;
        })}
        <Join
          xs={QS.map((_, i) => qX(i) + Q.w / 2)}
          y0={Q.y + Q.h + 14}
          yj={JOIN.y}
          y1={JOIN.pillY - 56}
          cx={CX}
          p={ease(f, discAt - m.sec(0.6), m.sec(0.6))}
        />
        <Appear at={discAt} style={{ left: 0, top: 0 }}>
          <Interactive.Div
            name="Discounting"
            style={{
              position: "absolute",
              left: CX,
              top: JOIN.pillY,
              transform: "translate(-50%, -50%)",
              padding: "18px 56px",
              borderRadius: 999,
              background: c.cardBg,
              boxShadow: `${shadow.glow}, inset 0 0 0 3px ${c.indigo}`,
              fontFamily: typeStyle("title").fontFamily,
              letterSpacing: typeStyle("title").letterSpacing,
              lineHeight: typeStyle("title").lineHeight,
              fontSize: 56,
              fontWeight: 600,
              color: c.indigo,
              whiteSpace: "nowrap",
            }}
          >
            Discounting
          </Interactive.Div>
        </Appear>
      </Shot>

      {/* E — Buffett, Ibu Sari, Tuntun: one principle, one result */}
      <Shot start={whoAt} to={1e6} block={BLOCK.SC03} cutOut={false}>
        <Appear
          at={-m.reveal}
          style={{ left: tX(0), top: T.y, width: T.d, height: T_H }}
        >
          <PhotoTile name="buffett" d={T.d} style={{ left: 0, top: 0 }} />
        </Appear>
        <Appear
          at={-m.reveal}
          style={{
            left: tX(0) - 60,
            width: T.d + 120,
            top: T_NAME,
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...typeStyle("label"),
              fontSize: 34,
              fontWeight: 600,
              color: c.ink,
            }}
          >
            Warren Buffett
          </div>
        </Appear>
        <Appear
          at={W("Ibu Sari secara")}
          style={{ left: tX(1), top: T.y, width: T.d, height: T_H }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: T.d * 0.13,
              background: c.cardBg,
              boxShadow: shadow.soft,
              overflow: "hidden",
            }}
          >
            <Figure
              name="ibu-sari"
              cx={T.d / 2}
              floor={T_H + 520}
              h={T_H + 520 - 22}
            />
          </div>
        </Appear>
        <Appear
          at={W("Ibu Sari secara")}
          style={{
            left: tX(1) - 60,
            width: T.d + 120,
            top: T_NAME,
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...typeStyle("label"),
              fontSize: 34,
              fontWeight: 600,
              color: c.ink,
            }}
          >
            Ibu Sari
          </div>
        </Appear>
        <Appear
          at={W("Tuntun Research")}
          style={{ left: tX(2), top: T.y, width: T.d, height: T_H }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: T.d * 0.13,
              background: c.cardBg,
              boxShadow: shadow.soft,
            }}
          />
          <TuntunMark x={T.d / 2} y={T_H / 2} height={T.d * 0.5} />
        </Appear>
        <Appear
          at={W("Tuntun Research")}
          style={{
            left: tX(2) - 80,
            width: T.d + 160,
            top: T_NAME,
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...typeStyle("label"),
              fontSize: 34,
              fontWeight: 600,
              color: c.ink,
              lineHeight: 1.2,
            }}
          >
            Tuntun Research Institute
          </div>
        </Appear>
        <Join
          xs={[0, 1, 2].map((i) => tX(i) + T.d / 2)}
          y0={T_NAME + 100}
          yj={T_NAME + 150}
          y1={T_NAME + 210}
          cx={CX}
          p={ease(f, resultAt - m.sec(0.6), m.sec(0.6))}
        />
        <Appear at={resultAt} style={{ left: 0, top: 0 }}>
          <Interactive.Div
            name="Reference Fair Value"
            style={{
              position: "absolute",
              left: CX,
              top: T_NAME + 270,
              transform: "translate(-50%, -50%)",
              padding: "20px 60px",
              borderRadius: 999,
              background: c.cardBg,
              boxShadow: `${shadow.glow}, inset 0 0 0 3px ${c.indigo}`,
              fontFamily: typeStyle("title").fontFamily,
              letterSpacing: typeStyle("title").letterSpacing,
              lineHeight: typeStyle("title").lineHeight,
              fontSize: 56,
              fontWeight: 600,
              color: c.indigo,
              whiteSpace: "nowrap",
            }}
          >
            Reference Fair Value
          </Interactive.Div>
        </Appear>
      </Shot>
    </Stage>
  );
};
