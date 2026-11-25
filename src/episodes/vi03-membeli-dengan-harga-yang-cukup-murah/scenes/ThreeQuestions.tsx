/**
 * VI03 · SC08 — "Tiga Pertanyaan", from the ChatGPT storyboard docs/vi-style/storyboards/VI03-SC08.png, in VI02's look.
 *
 *  A  "Sebelum membeli, tanyakan tiga hal": three numbered question cards, each on its sentence.
 *  B  "Lalu ingat tiga kalimat" (a cut): the three sentences as three lines, each lit in turn.
 *  C–F  from "John Templeton" (Simon 18 Nov, rebuilt from storyboard VI03-SC08-v2): scenes/TempletonTuntun.tsx — his photo
 *     and line, the fund's compounding, "Value investing" with Buffett, Graham, Templeton and the retail investor; a cut to
 *     Tuntun's real BBCA card (Reference Fair Value, Valuation Status), the three things it weighs, a Top Undervalued list
 *     (placeholder) and Kandidat → Analisis → Layak dimiliki?
 *  G  "Di video selanjutnya" (a cut): VI02's next-video pill, Mr. Market, the next topic.
 */
import {
  AppearE as Appear,
  CardE as Card,
  LineE as Line,
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
  Stage,
  theme,
  typeStyle,
  useMotion,
  usePalette,
  useShadow,
} from "../../../core";
import { BLOCK } from "../data/timing";
import { TempletonPart, TuntunPart } from "./TempletonTuntun";
import {
  BoardGrid,
  Glyph,
  Ring,
  Shot,
  ease,
  useWords,
} from "../components/kit";

const CX = theme.canvas.width / 2;

// A — three questions
const Q = { w: 480, h: 400, y: 330, gap: 60, disc: 120 };
const qX = (i: number) => CX - (3 * Q.w + 2 * Q.gap) / 2 + i * (Q.w + Q.gap);
const QS = [
  { icon: "seal-check", text: "Layak dimiliki?", at: "Apakah perusahaan" },
  { icon: "scales", text: "Harga wajarnya?", at: "Kira-kira berapa" },
  {
    icon: "shield-check",
    text: "Ada ruang kalau salah?",
    at: "apakah harga sekarang",
  },
] as const;

// B — three sentences
const S = { x: 260, w: 1400, y0: 300, gap: 175, h: 140 };
const SENTENCES = [
  {
    text: "Harga yang kamu bayar, value yang kamu dapatkan.",
    mark: "value",
    at: "Harga adalah",
  },
  {
    text: "Nilai 100 dibeli di 70: kita mungkin salah menghitung.",
    mark: "mungkin salah",
    at: "Barang bernilai",
  },
  {
    text: "Perusahaan bagus juga harus dibeli murah.",
    mark: "dibeli murah",
    at: "perusahaan bagus juga",
  },
] as const;

// G — the next video: pill, card (three lines at 52 px) and Orang Tuntun whole at the right; the block from the pill's top to his
// feet centred in the free height (54–972)
/**
 * Orang Tuntun, then larger (Simon 18 Nov: "perbesar (anchor atas) hingga yang terlihat di layar adalah kepala hingga pinggul.
 * Ekspektasi Orang Tuntun dan Text akan overlap"): his head's top kept where it was (the 640-tall figure's), scaled until his hips
 * (y 960 of the drawing; the legs part at 975, the head starts at 85) sit just over the subtitle band, his body fading out before
 * it; his middle kept where it was; drawn over the card.
 */
const ORANG_TUNTUN = {
  src: "art/in01/orang-tuntun.png",
  w: 941,
  h: 1672,
  head: 85,
  hips: 960,
  mid: 513,
};
const NEXT_H = 640;
const NEXT_TOP =
  (theme.stage.active.y +
    theme.stage.active.y +
    theme.stage.active.h -
    NEXT_H) /
  2;
const NEXT = {
  x: 230,
  cardW: 1070,
  cardH: 320,
  size: 52,
  pillTop: NEXT_TOP,
  cardTop: NEXT_TOP + 130,
  manH: NEXT_H,
  floor: NEXT_TOP + NEXT_H,
  manCx: 1580,
};
const MAN0_K = NEXT_H / ORANG_TUNTUN.h;
const MAN_HEAD_Y = NEXT.floor - NEXT_H + ORANG_TUNTUN.head * MAN0_K;
const MAN_MID_X =
  NEXT.manCx - (ORANG_TUNTUN.w * MAN0_K) / 2 + ORANG_TUNTUN.mid * MAN0_K;
/** his hips 32 px over the subtitle band; the fade from 70 px over it to 8 px over it */
const MAN_FADE = {
  from: theme.captionBand.top - 70,
  to: theme.captionBand.top - 8,
};
const MAN_K =
  (theme.captionBand.top - 32 - MAN_HEAD_Y) /
  (ORANG_TUNTUN.hips - ORANG_TUNTUN.head);
const MAN = {
  x: MAN_MID_X - ORANG_TUNTUN.mid * MAN_K,
  y: MAN_HEAD_Y - ORANG_TUNTUN.head * MAN_K,
  w: ORANG_TUNTUN.w * MAN_K,
  h: ORANG_TUNTUN.h * MAN_K,
};

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(8, BLOCK.SC08);
  const g = f + BLOCK.SC08;

  const sentAt = W("Lalu ingat");
  const tempAt = W("John Templeton");
  const appAt = W("Di Tuntun");
  const nextAt = W("Di video");

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — three questions before buying */}
      <Shot start={-1} to={sentAt} block={BLOCK.SC08} cutIn={false}>
        <Appear at={-m.reveal} style={{ left: 0, top: 0 }}>
          <Line
            x={160}
            y={220}
            w={1600}
            text="Sebelum membeli, tanyakan:"
            mark="tanyakan"
            size={64}
            align="center"
            weight={600}
          />
        </Appear>
        {QS.map((q, i) => {
          const at = W(q.at);
          const p = ease(f, at - m.sec(0.2), m.reveal);
          const lit =
            ease(f, at, m.pop) *
            (i < 2 ? 1 - ease(f, W(QS[i + 1].at), m.pop) : 1);
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
                    left: 30,
                    top: 30,
                    width: 64,
                    height: 64,
                    borderRadius: 999,
                    background: c.cardBg,
                    boxShadow: `inset 0 0 0 3px ${c.indigo}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...typeStyle("title"),
                    fontSize: 34,
                    fontWeight: 700,
                    color: c.indigo,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: (Q.w - Q.disc) / 2,
                    top: 80,
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
                    left: 20,
                    right: 20,
                    top: 250,
                    textAlign: "center",
                    ...typeStyle("title"),
                    fontSize: 44,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: c.ink,
                  }}
                >
                  {q.text}
                </div>
              </Card>
            </div>
          ) : null;
        })}
      </Shot>

      {/* B — three sentences to remember */}
      <Shot start={sentAt} to={tempAt} block={BLOCK.SC08}>
        <Appear at={sentAt} style={{ left: 0, top: 0 }}>
          <Line
            x={160}
            y={190}
            w={1600}
            text="Ingat tiga kalimat"
            size={56}
            align="center"
            weight={600}
          />
        </Appear>
        {SENTENCES.map((s, i) => {
          const at = W(s.at);
          const p = ease(f, at - m.sec(0.2), m.reveal);
          const lit =
            ease(f, at, m.pop) *
            (i < 2 ? 1 - ease(f, W(SENTENCES[i + 1].at), m.pop) : 1);
          return p > 0.001 ? (
            <div
              key={s.text}
              style={{
                position: "absolute",
                left: S.x,
                top: S.y0 + i * S.gap + (1 - p) * 14,
                width: S.w,
                height: S.h,
                opacity: p,
              }}
            >
              <Card
                x={0}
                y={0}
                w={S.w}
                h={S.h}
                style={{ boxShadow: lit > 0.5 ? shadow.glow : shadow.soft }}
              >
                <Ring p={lit} tone={c.indigo} />
                <div
                  style={{
                    position: "absolute",
                    left: 34,
                    top: S.h / 2 - 34,
                    width: 68,
                    height: 68,
                    borderRadius: 999,
                    background: lit > 0.5 ? c.indigo : theme.color.neutralDisc,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...typeStyle("title"),
                    fontSize: 36,
                    fontWeight: 700,
                    color: lit > 0.5 ? c.cardBg : c.slate,
                  }}
                >
                  {i + 1}
                </div>
                <Line
                  x={140}
                  y={S.h / 2}
                  w={S.w - 180}
                  text={s.text}
                  mark={s.mark}
                  size={46}
                  weight={500}
                />
              </Card>
            </div>
          ) : null;
        })}
      </Shot>

      {/* C–F — Templeton, value investing; then Tuntun's card, Top Undervalued (scenes/TempletonTuntun.tsx; Simon 18 Nov,
          storyboard VI03-SC08-v2) */}
      <Shot start={tempAt} to={appAt} block={BLOCK.SC08}>
        <TempletonPart />
      </Shot>
      <Shot start={appAt} to={nextAt} block={BLOCK.SC08}>
        <TuntunPart />
      </Shot>

      {/* G — the next video (Simon 18 Nov): the card's line is his, "Cara menghadapi pasar yang kadang terlalu takut atau terlalu
          optimis, tanpa terbawa emosi", in on "cara menghadapi" as one fade (no word-by-word), "takut" and "optimis" in indigo as
          the old line had them; Orang Tuntun (public/art/in01/orang-tuntun.png, whole) in Mr. Market's place ("mr marketnya ganti
          dengan Orang Tuntun"). Pill, card and figure as one block, centred in the free height. */}
      <Shot start={nextAt} to={1e6} block={BLOCK.SC08} cutOut={false}>
        <Appear
          at={nextAt + m.sec(0.15)}
          style={{ left: NEXT.x, top: NEXT.pillTop }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 34px 12px 16px",
              borderRadius: 999,
              background: c.cardBg,
              boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}`,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 999,
                background: c.indigo,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={22} height={24} viewBox="0 0 22 24">
                <path
                  d="M 3 2 L 20 12 L 3 22 Z"
                  fill={c.cardBg}
                  stroke={c.cardBg}
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              style={{
                ...typeStyle("label"),
                fontSize: 34,
                fontWeight: 600,
                color: c.ink,
              }}
            >
              Video selanjutnya
            </div>
          </div>
        </Appear>
        <Appear
          at={W("cara menghadapi")}
          style={{ left: NEXT.x, top: NEXT.cardTop, width: NEXT.cardW }}
        >
          <Card
            x={0}
            y={0}
            w={NEXT.cardW}
            h={NEXT.cardH}
            style={{ boxShadow: `${shadow.soft}, inset 0 0 0 4px ${c.indigo}` }}
          >
            <Interactive.Div
              name="Cara menghadapi pasar yang k"
              style={{
                position: "absolute",
                left: 60,
                right: 60,
                top: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                fontFamily: typeStyle("title").fontFamily,
                letterSpacing: typeStyle("title").letterSpacing,
                fontSize: NEXT.size,
                fontWeight: 600,
                lineHeight: 1.25,
                color: c.ink,
              }}
            >
              <span>Cara menghadapi pasar yang kadang</span>
              <span>
                terlalu <span style={{ color: c.indigo }}>takut</span> atau
                terlalu <span style={{ color: c.indigo }}>optimis</span>,
              </span>
              <span>tanpa terbawa emosi</span>
            </Interactive.Div>
          </Card>
        </Appear>
        <Appear
          at={nextAt + m.sec(0.4)}
          style={{
            left: 0,
            top: 0,
            width: theme.canvas.width,
            height: theme.canvas.height,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              WebkitMaskImage: `linear-gradient(to bottom, black ${MAN_FADE.from}px, transparent ${MAN_FADE.to}px)`,
              maskImage: `linear-gradient(to bottom, black ${MAN_FADE.from}px, transparent ${MAN_FADE.to}px)`,
            }}
          >
            <Pic
              src={staticFile(ORANG_TUNTUN.src)}
              style={{
                position: "absolute",
                left: MAN.x,
                top: MAN.y,
                width: MAN.w,
                height: MAN.h,
              }}
            />
          </div>
        </Appear>
      </Shot>
    </Stage>
  );
};
