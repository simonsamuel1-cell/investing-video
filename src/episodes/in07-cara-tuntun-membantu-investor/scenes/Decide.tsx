/**
 * IN07 · SC11 — "Kamu Memutuskan, Tuntun Membantu", the close. From the ChatGPT storyboard
 * docs/vi-style/storyboards/IN07-SC11.jpg.
 *
 *  A  the mascot (Membantu) and you — Orang_2 (Memutuskan) — a short line between them
 *     (Simon 30 Oct: "icon avatarnya ganti jadi Orang. Garisnya pendekin. Kasih label Kamu"); Beli and Jual sit on
 *     YOUR side — the mascot's reach to them is crossed out.
 *  B  what travels along the line: Kualitas, Fair value, Peristiwa, Transaksi, Market.
 *  C  none of it is certain: the line goes dashed; the price can fall further below the fair value; a cheap market can
 *     get cheaper; no promise of a rise, no decision to follow.
 *  D  as Simon directed (30 Oct): "Saat temanmu menyuruhmu, kamu bisa lihat dulu" at the top, every app screenshot
 *     under it, one highlight round them all, Beli and Jual under that; then Orang Tuntun and the script's line —
 *     "Itulah arti Invest with Guidance bersama Tuntun." since the 9 Nov VO (it replaced "Jadi sebelum menekan tombol
 *     berikutnya: lihat dulu. Baru putuskan.").
 *  E  "Di lesson berikutnya …": a camera cut into the next lesson, Value Investing (scenes/NextLesson.tsx; Simon 9 Nov:
 *     "buat ulang visual untuk script baru di scene 11").
 */
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Connector, HighlightBox, SoftGround, Stage, TuntunMark, cutOutStyle, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK, CUT } from "../data/timing";
import { NextLesson } from "./NextLesson";
import { Appear, BoardGrid, Disc, Mark, ORANG_TUNTUN_RIGHT, OrangTuntun, ease, useWords } from "../components/kit";
import { BUMI_CARD } from "../data/bumi-card";
import { BumiCrop, cropW } from "../components/BumiCrop";
import { PERSON_2, Person } from "../components/Person";

const CX = theme.canvas.width / 2;
const ROW_Y = 470;
const HELP_X = 400;
const YOU_X = 1520;
/**
 * A's two buttons: side by side in the middle, each filled its own colour, and both gone at Simon's f29939 — the
 * frame B's information starts arriving (30 Oct: "saling bersebelahan ... di tengah horizontal ... warna fillnya
 * masing2 hijau dan merah, lalu keduanya hilang di 29939"). That frame was the word "menampilkan", so `BUTTONS_OUT`
 * is that word: as a frame number it went 3 s late when the frog pause left the timeline and 26 s early when SC04 grew.
 */
const BUTTONS = [
  { text: "Beli", sign: "▲", fill: theme.color.gainGreen, at: "tombol beli", cross: "untukmu." },
  { text: "Jual", sign: "▼", fill: theme.color.alarmRed, at: "tombol jual.", cross: "jual." },
] as const;
const BTN = { w: 300, h: 96, gap: 40, y: 724 };
const btnX = (i: number) => CX - (2 * BTN.w + BTN.gap) / 2 + i * (BTN.w + BTN.gap);
const BUTTONS_OUT = "menampilkan informasi";
/** You: Orang_2 on the self circle (Simon 30 Oct), the circle `YOU_D` across — the mascot's weight on the other end. */
const YOU_D = 200;
const YOU_S = YOU_D / PERSON_2.d;
const INFO = [
  { text: "Kualitas", icon: "company", at: "kualitas perusahaan" },
  { text: "Fair value", icon: "scale", at: "fair value," },
  { text: "Peristiwa", icon: "event", at: "dampak sebuah" },
  { text: "Transaksi", icon: "volume", at: "aktivitas transaksi" },
  { text: "Market", icon: "gauge", at: "kondisi market." },
] as const;
const infoX = (i: number) => 600 + i * 180;
/**
 * C's two pictures, over the chips they belong to (Simon 30 Oct: "ubah jadi yang kayak di screenshot aja"): the Fair
 * Value column of BUMI_3's card, and IHSG's valuation page — both shots the episode already uses.
 */
const SHOT = { y: 158, h: 240 };
const VAL = { src: "art/in07/app/IHSG-valuation.jpg", w: 1080, r: { x1: 0, y1: 0, x2: 1080, y2: 853 } };
/** The Fair Value column with a margin of the card's own white around it, so nothing of its type is cut. */
const FV_PAD = 34;
const FV = { r: { x1: BUMI_CARD.fv.x1 - FV_PAD, y1: BUMI_CARD.fv.y1 - FV_PAD, x2: BUMI_CARD.fv.x2 + FV_PAD, y2: BUMI_CARD.fv.y2 + FV_PAD } };
/** C's close, as one summary line of the script's own sentence (Simon 30 Oct: "jadi text ringkasan berdasarkan script"). */
const SUMMARY_Y = 756;
/**
 * D, as Simon directed it (30 Oct, after two versions he rejected): the summary line at the top in two steps — "Saat
 * temanmu menyuruhmu," then "kamu bisa lihat dulu"; with the second, every app screenshot the episode has, in two
 * rows; on "Tuntun membantu memberi konteks" one highlight round all of them; on "Keputusan tetap ada di tanganmu" Beli
 * and Jual under them; on "Itulah arti…" the picture changes to Orang Tuntun and the script's line.
 */
const D_TEXT_Y = theme.logoZone.height + 6;
type Pic = { src: string; w: number; h: number; bumi?: true };
const D_SHOTS: Pic[][] = [
  [
    { src: BUMI_CARD.src, w: BUMI_CARD.framed.x2 - BUMI_CARD.framed.x1, h: BUMI_CARD.framed.y2 - BUMI_CARD.framed.y1, bumi: true },
    { src: "art/in07/app/IHSG-valuation.jpg", w: 1080, h: 853 },
    { src: "art/in07/app/IHSG-sentiment.jpg", w: 1080, h: 1073 },
  ],
  [
    { src: "art/in07/app/BUMI-halaman-saham.png", w: 1080, h: 2417 },
    { src: "art/in07/app/sc06-volume.jpg", w: 1080, h: 1240 },
    { src: "art/in07/app/sc06-broker-summary.jpg", w: 1080, h: 1700 },
    { src: "art/in07/app/sc06-broker-analysis.jpg", w: 1080, h: 1700 },
    { src: "art/in07/app/sc06-foreign-flow.jpg", w: 1080, h: 1700 },
  ],
];
/** The band the screenshots fill, leaving room under it for the buttons; `hl` is the highlight's margin round them. */
const D_BAND = { top: 262, bottom: 760, rowGap: 24, gap: 24, hl: 20 };
/** Each row's height, chosen so both rows come out the same width. */
const D_ROW_H = (() => {
  const [a, b] = D_SHOTS.map((row) => row.reduce((t, p) => t + p.w / p.h, 0));
  const [ga, gb] = D_SHOTS.map((row) => (row.length - 1) * D_BAND.gap);
  const H = D_BAND.bottom - D_BAND.top - D_BAND.rowGap;
  const h0 = (b * H + gb - ga) / (a + b);
  return [h0, H - h0];
})();
const D_BOXES = D_SHOTS.flatMap((row, r) => {
  const h = D_ROW_H[r];
  const w = row.reduce((t, p) => t + (p.w / p.h) * h, 0) + (row.length - 1) * D_BAND.gap;
  const y = r === 0 ? D_BAND.top : D_BAND.top + D_ROW_H[0] + D_BAND.rowGap;
  let x = CX - w / 2;
  return row.map((pic) => {
    const box = { pic, x, y, w: (pic.w / pic.h) * h, h };
    x += box.w + D_BAND.gap;
    return box;
  });
});
const D_HL = {
  x1: Math.min(...D_BOXES.map((b) => b.x)) - D_BAND.hl,
  y1: D_BAND.top - D_BAND.hl,
  x2: Math.max(...D_BOXES.map((b) => b.x + b.w)) + D_BAND.hl,
  y2: D_BAND.bottom + D_BAND.hl,
};
/** Beli and Jual under the highlight, A's own buttons. */
const D_BTN_Y = D_HL.y2 + 26;

/** A picture, `w` × `h`, centred on `cx`, rounded and lifted, rising in with `p`. */
const ShotFrame = ({ cx, y, w, h, p, children }: { cx: number; y: number; w: number; h: number; p: number; children: React.ReactNode }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: y + (1 - p) * 14, width: w, height: h, borderRadius: 28, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft, opacity: p }}>
      {children}
    </div>
  );
};

export const SC11 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(11, BLOCK.SC11);
  const g = f + BLOCK.SC11;

  // A
  const lineP = ease(f, W("hubungan kita"), m.sec(0.8));
  const helpAt = W("Tuntun membantu,");
  const youAt = W("kamu yang memutuskan");
  const crossOut = ease(f, W("Tuntun membantu menampilkan"), m.fade);

  // C
  const unsure = ease(f, W("bukan kepastian"), m.reveal);
  const fvPop = ease(f, W("Harga masih"), m.reveal);
  const mkPop = ease(f, W("Market yang"), m.reveal);
  const promiseAt = W("pasti naik");
  const followAt = W("harus kamu ikuti");

  // D
  const dAt = W("Tujuannya sederhana");
  const abOut = ease(f, dAt, m.fade);
  const sayAt = W("saat temanmu");
  const seeAt = W("kamu punya");
  const hlAt = W("Tuntun membantu memberi");
  const handsAt = W("Keputusan tetap");
  const jadiAt = W("Itulah arti");
  const guideAt = W("Invest with Guidance");
  const withAt = W("bersama Tuntun.");
  const dOut = ease(f, jadiAt - m.sec(0.1), m.fade);

  // E — the cut into the next lesson; the close leaves through it
  const lessonCut = { at: W("Di lesson berikutnya"), axis: "x" as const, ...CUT };
  const closeOut = f >= lessonCut.at - lessonCut.over / 2 ? cutOutStyle(f, lessonCut) : {};

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={f >= lessonCut.at ? 1 : 1 - ease(f, jadiAt, m.fade)} />

      {/* A–C — the two of you, and what passes between */}
      {abOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - abOut }}>
          <div style={{ opacity: unsure }}>
            <Connector a={{ x: HELP_X + 100, y: ROW_Y }} b={{ x: YOU_X - YOU_D / 2 - 10, y: ROW_Y }} p={lineP} shape="curve" dashed dash="10 10" tone={theme.color.connectorMuteSolid} dot={false} />
          </div>
          <div style={{ opacity: 1 - unsure }}>
            <Connector a={{ x: HELP_X + 100, y: ROW_Y }} b={{ x: YOU_X - YOU_D / 2 - 10, y: ROW_Y }} p={lineP} shape="curve" tone={theme.color.connector} dot={false} />
          </div>
          <Appear at={helpAt - m.sec(0.1)} style={{ left: 0, top: 0 }}>
            <TuntunMark x={HELP_X} y={ROW_Y - 80 + 3 * Math.sin((g / m.sec(1.6)) * Math.PI * 2)} height={160} />
            <div style={{ position: "absolute", left: HELP_X - 150, top: ROW_Y + 100, width: 300, textAlign: "center", ...typeStyle("body"), color: c.ink }}>Membantu</div>
          </Appear>
          <Appear at={youAt - m.sec(0.1)} style={{ left: 0, top: 0 }}>
            <Person cx={YOU_X} cy={ROW_Y} s={YOU_S} pic={PERSON_2} />
            <div style={{ position: "absolute", left: YOU_X - 150, top: ROW_Y + 110, width: 300, textAlign: "center", ...typeStyle("label"), color: theme.color.selfAmberInk }}>Kamu</div>
            <div style={{ position: "absolute", left: YOU_X - 150, top: ROW_Y + 160, width: 300, textAlign: "center", ...typeStyle("body"), color: c.ink }}>Memutuskan</div>
          </Appear>

          {/* the two buttons, in the middle; the mascot's reach to them is crossed out, and both go at BUTTONS_OUT */}
          {BUTTONS.map((b, i) => {
            const at = W(b.at);
            const out = 1 - ease(f, W(BUTTONS_OUT) - m.fade, m.fade);
            const p = ease(f, at - m.sec(0.1), m.pop) * out;
            const x = btnX(i);
            return (
              <React.Fragment key={b.text}>
                <div style={{ opacity: (1 - crossOut) * out }}>
                  <Connector a={{ x: HELP_X + 60, y: ROW_Y + 60 }} b={{ x, y: BTN.y + BTN.h / 2 }} p={ease(f, at, m.sec(0.5))} shape="curve" dashed dash="8 10" tone={theme.color.connectorMuteSolid} />
                </div>
                {p > 0.001 ? (
                  <div style={{ position: "absolute", left: x, top: BTN.y, width: BTN.w, height: BTN.h, borderRadius: 26, background: b.fill, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, ...typeStyle("title"), fontSize: 40, fontWeight: 500, color: c.cardBg, opacity: p }}>
                    <span style={{ fontSize: 26 }}>{b.sign}</span>
                    {b.text}
                  </div>
                ) : null}
                <Mark kind="cross" p={ease(f, W(b.cross) - m.sec(0.05), m.pop) * (1 - crossOut) * out} x={x - 10} y={BTN.y + 12} />
              </React.Fragment>
            );
          })}

          {/* B — what Tuntun shows, along the line */}
          {INFO.map((k, i) => {
            const p = ease(f, W(k.at) - m.sec(0.1), m.pop);
            if (p <= 0.001) return null;
            return (
              <div key={k.text} style={{ position: "absolute", left: infoX(i) - 40, top: ROW_Y - 40 - (1 - p) * 16, width: 80, opacity: p, filter: unsure > 0.001 ? `grayscale(${unsure.toFixed(3)})` : undefined }}>
                {/* certain: white with its indigo ring — uncertain: a mute fill and no ring, crossfaded (Simon 30 Oct) */}
                <div style={{ position: "relative", width: 80, height: 80 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: theme.color.neutralDisc, boxShadow: shadow.soft }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.connector}`, opacity: 1 - unsure }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Disc icon={k.icon} size={64} tone={c.indigo} tint="transparent" />
                  </div>
                </div>
                <div style={{ position: "absolute", left: -60, top: 92, width: 200, textAlign: "center", ...typeStyle("label"), fontSize: 26, color: c.ink }}>{k.text}</div>
              </div>
            );
          })}

          {/* C — not certain: fair value as the app shows it, and the market's own valuation page */}
          {fvPop > 0.001 ? (
            <ShotFrame cx={infoX(1)} y={SHOT.y} w={cropW(FV.r, SHOT.h)} h={SHOT.h} p={fvPop}>
              <BumiCrop r={FV.r} h={SHOT.h} />
            </ShotFrame>
          ) : null}
          {mkPop > 0.001 ? (
            <ShotFrame cx={infoX(4) - 60} y={SHOT.y} w={cropW(VAL.r, SHOT.h)} h={SHOT.h} p={mkPop}>
              <Img src={staticFile(VAL.src)} style={{ width: cropW(VAL.r, SHOT.h), height: SHOT.h }} />
            </ShotFrame>
          ) : null}
          {/* no promise of a rise, no decision to follow — the script's sentence, short */}
          <div style={{ position: "absolute", left: 0, top: SUMMARY_Y, width: theme.canvas.width, textAlign: "center", fontFamily: theme.text.family, fontSize: 58, fontWeight: 500, letterSpacing: -1, color: c.ink }}>
            <span style={{ opacity: ease(f, promiseAt - m.sec(0.1), m.reveal) }}>Bukan janji harga, </span>
            <span style={{ opacity: ease(f, followAt - m.sec(0.1), m.reveal) }}>bukan keputusan untukmu.</span>
          </div>
        </div>
      ) : null}

      {/* D — the summary line, every screenshot, one highlight, then Beli and Jual */}
      {f >= sayAt - m.sec(0.2) && dOut < 0.999 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - dOut }}>
          <div style={{ position: "absolute", left: 0, top: D_TEXT_Y, width: theme.canvas.width, textAlign: "center", fontFamily: theme.text.family, fontSize: 56, fontWeight: 500, letterSpacing: -1, color: c.ink, whiteSpace: "pre" }}>
            <span style={{ opacity: ease(f, sayAt - m.sec(0.1), m.reveal) }}>Saat temanmu menyuruhmu, </span>
            <span style={{ color: c.indigo, opacity: ease(f, seeAt - m.sec(0.1), m.reveal) }}>kamu bisa lihat dulu</span>
          </div>
          {D_BOXES.map((b, i) => (
            <Appear key={b.pic.src} at={seeAt + i * m.sec(0.05)} style={{ left: b.x, top: b.y }}>
              <div style={{ width: b.w, height: b.h, borderRadius: 16, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft }}>
                {b.pic.bumi ? <BumiCrop r={BUMI_CARD.framed} h={b.h} /> : <Img src={staticFile(b.pic.src)} style={{ width: b.w, height: b.h, display: "block" }} />}
              </div>
            </Appear>
          ))}
          <HighlightBox rect={D_HL} grow={ease(f, hlAt, m.sec(0.5))} opacity={ease(f, hlAt, m.sec(0.1))} fill="none" width={4} radius={24} />
          {BUTTONS.map((b, i) => (
            <Appear key={b.text} at={handsAt + i * m.sec(0.12)} style={{ left: btnX(i), top: D_BTN_Y }}>
              <div style={{ width: BTN.w, height: BTN.h, borderRadius: 26, background: b.fill, boxShadow: shadow.soft, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, ...typeStyle("title"), fontSize: 40, fontWeight: 500, color: c.cardBg }}>
                <span style={{ fontSize: 26 }}>{b.sign}</span>
                {b.text}
              </div>
            </Appear>
          ))}
        </div>
      ) : null}

      {/* the close: Orang Tuntun and the script's line, out through the cut into the next lesson */}
      {f >= jadiAt - 1 && f < lessonCut.at ? (
        <div style={{ position: "absolute", inset: 0, ...closeOut }}>
          <OrangTuntun at={jadiAt} />
          <div style={{ position: "absolute", left: ORANG_TUNTUN_RIGHT + 90, top: 500, width: theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 90, transform: "translateY(-50%)", fontFamily: theme.text.family, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.22 }}>
            {/* "Itulah arti" in black, the rest in indigo (Simon 9 Nov) */}
            <div style={{ fontSize: 48, color: c.ink, marginBottom: 18, opacity: ease(f, jadiAt + m.sec(0.2), m.reveal) }}>Itulah arti</div>
            <div style={{ fontSize: 72, color: c.indigo }}>
              <span style={{ opacity: ease(f, guideAt - m.sec(0.1), m.reveal) }}>Invest with Guidance</span>
              <br />
              <span style={{ opacity: ease(f, withAt - m.sec(0.1), m.reveal) }}>bersama Tuntun.</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* E — the next lesson */}
      <NextLesson cut={lessonCut} />
    </Stage>
  );
};
