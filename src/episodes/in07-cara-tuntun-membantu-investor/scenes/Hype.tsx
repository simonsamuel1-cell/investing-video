/**
 * IN07 · SC06 — "Ramai di Grup Belum Tentu Ramai di Pasar". Situation 3, Ikut ramai. From the ChatGPT storyboard
 * docs/vi-style/storyboards/IN07-SC06.jpg.
 *
 *  A  the heading opens big in the middle (as SC03/SC04) with the topic as its subjudul: one "Trending Stock" label
 *     (red fire), a voice note sliding down from behind it while "Masuk sekarang!" plays and back up behind it after —
 *     and the company beside it, linked only by a dashed line and a "?". The heading docks on "Sebelum ikut masuk"
 *     (Simon 29 Oct).
 *  B  three things to check, numbered: Dampak ke bisnis, Dana masuk, Transaksi naik — short cards (number, icon,
 *     words), each filling on its question (Simon 30 Oct: "format layout ini tetap dipertahankan"). Just before "Event
 *     Research" the three fly up and become pills beside the docked heading ("dipindahin ke atas aja, sebelah judul").
 *  C  on each tool's name (Event Research, Fund Flow, Volume — features in the app) its pill turns green with a ✓, and
 *     the tool's real screens (INV07/Revisi VO/Scene 06, BBCA; whole but for the status bar and the Buy row) fill the
 *     middle, as tall as the room under the heading: Event Research Simon's two shots side by side;
 *     Fund Flow three at once — Broker Summary, Dominant Broker Analysis, Foreign Flow; Volume one, the chart with
 *     its volume bars. Then (Simon 30 Oct, from 16874: "screenshot nya bisa fadeout, lalu 3 point di atas bisa kembali ke
 *     design sebelumnya, lalu bisa masukin lagi elemen/animasi yang tadi kuminta simpan") the screen fades, the green
 *     pills fly back down into the three cards, and the basis returns: a ✓ on each card and its line into one bar that
 *     fills as they agree, stops short of full (no guarantee), and "Bukan jaminan harga pasti naik." under it.
 *  D  one summary line on "Kalau buktinya…" (Simon 29 Oct: "text ringkasan aja"): the question alone in the middle,
 *     then "Tunggu dulu." on "menunggu", pushing it left — then Grup beside Pasar (an orderbook, Simon 29 Oct), and
 *     the scene's one line.
 *
 * No figures: the orderbook is shapes; the screenshots, when they come, are the app's own.
 */
import { Img, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Connector, HighlightBox, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, Disc, HEADING, Line, Mark, NumRing, OpeningHeading, SITUATION, VoiceBubble, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A — the subjudul row, laid out inside its own box: label (+ voice note under it) · dashed line with "?" · company
const TREND = { w: 440, h: 120 };
const VOICE = { w: 280, h: 76, gap: 24 };
const LINK = 300;
const FIRM = { w: 420, h: 120 };
const SUB = { w: TREND.w + LINK + FIRM.w, h: TREND.h + VOICE.gap + VOICE.h };

// B — the three short cards (number, icon, words)
const CARD = { w: 440, h: 250, gap: 60, y: 340 };
const cardX = (i: number) => CX - (3 * CARD.w + 2 * CARD.gap) / 2 + i * (CARD.w + CARD.gap);
// C — the checks as pills on the heading's row, from `x`; each turns green on its tool's name. `at` are where the
// pills land (centre, width — measured on still 16209: edges 500–802, 823–1047, 1068–1316), which the cards fly to.
const PILLS = { x: 500, gap: 20, h: 56, tick: 34, at: [{ cx: 651, w: 303 }, { cx: 935, w: 225 }, { cx: 1192, w: 249 }] };
/** The pills once checked (green, with their ✓ — wider), where the cards fly back from: measured on still 16860. */
const PILLS_DONE = [{ cx: 673, w: 347 }, { cx: 1001, w: 269 }, { cx: 1302, w: 293 }];
/**
 * The tools' screens: whole but for the status bar and the Buy row (1080 × 1890 of the phone's 1080 × 2340 = 4 : 7),
 * from under the heading to just over the subtitles, centred as a row.
 */
const SCREEN = { top: HEADING.y + HEADING.disc / 2 + 40, gap: 50, ratio: 4 / 7 };
const SCREEN_H = theme.captionBand.top - 12 - SCREEN.top;
const SCREEN_W = SCREEN_H * SCREEN.ratio;
/**
 * `shots`: the tool's screens under public/, shown together; none = one placeholder the same size ([NEEDS DATA]).
 * `ratio`: when a tool's screens are cropped further — Fund Flow's lose the BBCA header too (Simon 30 Oct: "crop bagian
 * ini"), 1080 × 1700 from y 300 = 54 : 85 — as tall as the others, so a little wider (Simon: "punya tinggi yang sama
 * dengan Volume"). Volume's loses its price header too ("crop out bagian ini"): 1080 × 1240 from y 760 = 27 : 31.
 * Event Research = Simon's two shots side by side, not alternating (2 Nov: "buat jadi sebelahan aja"), each 1080 × 2090
 * from y 110 — only the status bar and the phone's nav bar off — = 108 : 209.
 * `mark`: a box on the screen (its own pixels) on the words `markAt` — Volume's bars (rows 1610–1806, columns 30–1030
 * of the source, measured; Simon: "kasih highlight box di volume bars di bawah").
 */
type Box = { x1: number; y1: number; x2: number; y2: number };
const CHECKS: { text: string; icon: string; at: string; tool: string; toolAt: string; shots?: string[]; ratio?: number; mark?: Box; markAt?: string }[] = [
  { text: "Dampak ke bisnis", icon: "event", at: "peristiwanya", tool: "Event Research", toolAt: "Event Research", shots: ["art/in07/app/sc06-event-research-1.jpg", "art/in07/app/sc06-event-research-2.jpg"], ratio: 108 / 209 },
  { text: "Dana masuk", icon: "flow", at: "dana benar-benar", tool: "Fund Flow", toolAt: "Fund Flow", shots: ["art/in07/app/sc06-broker-summary.jpg", "art/in07/app/sc06-broker-analysis.jpg", "art/in07/app/sc06-foreign-flow.jpg"], ratio: 54 / 85 },
  { text: "Transaksi naik", icon: "volume", at: "aktivitas transaksinya", tool: "Volume", toolAt: "Sementara volume", shots: ["art/in07/app/sc06-volume.jpg"], ratio: 27 / 31, mark: { x1: 30, y1: 1610 - 760, x2: 1030, y2: 1806 - 760 }, markAt: "aktivitas pasar" },
];
/**
 * The basis bar the three checks feed, and its line "Bukan jaminan harga pasti naik." — taken off the screens' part
 * (Simon 30 Oct: "remove, tapi di simpan dulu") and back once the cards are (SHOW_BASIS turns it off again).
 */
const SHOW_BASIS = true;
const BAR = { x: CX - 450, y: 760, w: 900, h: 22 };
/** The bar never fills: agreement makes the basis stronger, not a guarantee. */
const BAR_MAX = 0.82;

// D
const GRUP = { x: 360, y: 290, w: 500, h: 380 };
const PASAR = { x: 1060, y: 290, w: 500, h: 380 };
/** Pasar as an orderbook: Bid | Offer, five levels each, depth bars growing out from the middle; the rows are bars, not numbers. */
const BOOK = { pad: 36, gap: 12, head: 92, top: 140, pitch: 44, row: 34, price: 72, lot: 52, pill: 14 };
const BOOK_BID = [0.55, 0.78, 0.62, 0.95, 0.7];
const BOOK_OFFER = [0.62, 0.5, 0.86, 0.68, 0.98];

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(6, BLOCK.SC06);
  const g = f + BLOCK.SC06;

  // A
  const topicP = ease(f, W("satu topik") - m.sec(0.1), m.reveal);
  const playA = W("Masuk sekarang");
  const playZ = W("Masuk sekarang", 0, "f1");
  const played = ease(f, playA, Math.max(1, playZ - playA));
  /** The voice note: out from behind the label on "voice note", back behind it once it has played. */
  const voiceOut = ease(f, W("voice note"), m.move) - ease(f, playZ + m.sec(0.25), m.move);
  const firmAt = W("Tapi topik");
  const askAt = W("belum tentu");
  /** The label stands alone in the middle until the company comes; then the row slides left to make room for it. */
  const rowShift = ((SUB.w - TREND.w) / 2) * (1 - ease(f, firmAt - m.sec(0.3), m.move));
  const dock = ease(f, W("Sebelum ikut"), m.move);

  // B/C
  const slotsAt = W("cek tiga hal");
  /** The cards fly up and land as pills just before "Event Research" (the swap to the real pills once they have landed). */
  const moveAt = W(CHECKS[0].toolAt) - m.move - m.sec(0.15);
  const move = ease(f, moveAt, m.move);
  const pillIn = ease(f, moveAt + m.move, m.sec(0.1));
  /** …and back down into the cards before "Semakin" (Simon: "dari 16874"), the screen fading as they go. */
  const backAt = W("Semakin") - m.sec(0.28);
  const back = ease(f, backAt, m.move);
  const returning = f >= backAt;
  /** On the way back the card starts as the green pill it was, ✓ and all, and turns white as it lands. */
  const tint = returning ? 1 - ease(f, backAt, m.move * 0.6) : 0;
  const agreeAt = W("sejalan");
  const fill = BAR_MAX * ease(f, agreeAt, W("pergerakannya.", 0, "f1") - agreeAt);
  const cOut = ease(f, W("Kalau buktinya"), m.fade);

  // D
  const waitAt = W("Kalau buktinya");
  const waitP = ease(f, W("menunggu"), m.move);
  const grupAt = W("ramai di grup");
  /** The orderbook comes on "belum tentu" (Simon 29 Oct), not on "ramai di pasar". */
  const pasarAt = W("belum tentu", 1);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />
      {/* A — the heading opens in the middle; the trending topic and the company it may not touch are its subjudul */}
      <OpeningHeading
        n={3}
        text={SITUATION[2].label}
        p={ease(f, W("Situasi berikutnya"), m.reveal)}
        dock={dock}
        subP={topicP}
        sub={
          <div style={{ position: "relative", width: SUB.w, height: SUB.h, transform: `translateX(${rowShift.toFixed(2)}px)` }}>
            {/* the voice note first, so the label covers it while it is "behind" */}
            {voiceOut > 0.001 ? (
              <div style={{ position: "absolute", left: (TREND.w - VOICE.w) / 2, top: (TREND.h - VOICE.h) / 2 + (TREND.h / 2 + VOICE.gap + VOICE.h / 2) * voiceOut }}>
                <VoiceBubble played={played} />
              </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, top: (1 - topicP) * 14, width: TREND.w, height: TREND.h, opacity: topicP }}>
              <Card x={0} y={0} w={TREND.w} h={TREND.h} style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 32px" }}>
                <Disc icon="hype" size={70} tone={theme.color.alarmRed} tint={theme.color.alarmWashSolid} />
                <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>Trending Stock</div>
              </Card>
            </div>
            <Connector a={{ x: TREND.w, y: TREND.h / 2 }} b={{ x: TREND.w + LINK, y: TREND.h / 2 }} p={ease(f, firmAt + m.sec(0.2), m.sec(0.5))} shape="curve" dashed dash="10 10" tone={theme.color.connectorMuteSolid} />
            <Appear at={askAt} style={{ left: TREND.w + LINK / 2 - 42, top: TREND.h / 2 - 42 }}>
              <div style={{ borderRadius: 999, boxShadow: shadow.soft }}>
                <Disc icon="question" size={84} tone={c.indigo} tint={c.cardBg} />
              </div>
            </Appear>
            <Appear at={firmAt} style={{ left: 0, top: 0 }}>
              <Card x={TREND.w + LINK} y={0} w={FIRM.w} h={FIRM.h} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 36px" }}>
                <Disc icon="company" size={70} tone={c.indigo} tint={theme.color.indigoWashSolid} />
                <div style={{ ...typeStyle("body"), color: c.ink }}>Perusahaan</div>
              </Card>
            </Appear>
          </div>
        }
      />

      {/* B — the three checks as cards, flying up into the pills, and back down after the screens */}
      {(pillIn < 0.999 || returning) && cOut < 0.999 && f >= slotsAt - m.sec(0.1) ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - cOut }}>
          {SHOW_BASIS && returning
            ? CHECKS.map((k, i) => (
                <Connector key={k.tool} a={{ x: cardX(i) + CARD.w / 2, y: CARD.y + CARD.h }} b={{ x: BAR.x + BAR.w * (0.2 + i * 0.3), y: BAR.y }} p={ease(f, agreeAt + i * m.sec(0.12), m.sec(0.45))} shape="curve" axis="y" />
              ))
            : null}
          {CHECKS.map((k, i) => {
            const slot = ease(f, slotsAt + i * m.sec(0.08), m.pop);
            const fillP = ease(f, W(k.at) - m.sec(0.1), m.reveal);
            // up to the plain pill, or back from the checked one: `t` 0 = the card, 1 = the pill
            const to = returning ? PILLS_DONE[i] : PILLS.at[i];
            const t = returning ? 1 - back : move;
            const x = cardX(i) + (to.cx - to.w / 2 - cardX(i)) * t;
            const y = CARD.y + (HEADING.y - PILLS.h / 2 - CARD.y) * t;
            const w = CARD.w + (to.w - CARD.w) * t;
            const h = CARD.h + (PILLS.h - CARD.h) * t;
            const radius = theme.shape.cardRadius + (PILLS.h / 2 - theme.shape.cardRadius) * t;
            return (
              <div key={k.text} style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: slot * (returning ? 1 : 1 - pillIn) }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: radius, border: `2px dashed ${theme.color.connectorMuteSolid}`, opacity: 1 - fillP }} />
                <Card x={0} y={(1 - fillP) * 14} w={w} h={h} line={t > 0.5 ? interpolateColors(tint, [0, 1], [theme.color.connector, theme.color.ok]) : undefined} style={{ opacity: fillP, overflow: "hidden", borderRadius: radius, background: interpolateColors(tint, [0, 1], [c.cardBg, theme.color.ok]) }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: CARD.h, opacity: 1 - Math.min(1, t * 2.5) }}>
                    <div style={{ position: "absolute", left: 28, top: 28 }}>
                      <NumRing n={i + 1} size={52} />
                    </div>
                    <div style={{ position: "absolute", left: CARD.w / 2 - 50, top: 50 }}>
                      <Disc icon={k.icon} size={100} tone={theme.color.neutralIcon} tint={theme.color.neutralDisc} />
                    </div>
                    <div style={{ position: "absolute", left: 0, top: 172, width: CARD.w, textAlign: "center", ...typeStyle("body"), color: c.ink }}>{k.text}</div>
                  </div>
                  {/* in flight, the words take the pill's look, so the card lands as the pill */}
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 * tint, opacity: Math.min(1, Math.max(0, (t - 0.25) / 0.45)), ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: interpolateColors(tint, [0, 1], [c.indigo, c.cardBg]), whiteSpace: "nowrap" }}>
                    <div style={{ width: PILLS.tick * tint, height: PILLS.tick, borderRadius: 999, background: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontSize: 20, fontWeight: 700, color: theme.color.ok, opacity: tint }}>✓</div>
                    {k.text}
                  </div>
                </Card>
                {/* back as cards, each checked as they agree */}
                {returning ? <Mark kind="check" p={ease(f, agreeAt + i * m.sec(0.12), m.pop)} x={w - 34} y={34} /> : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* C — the pills beside the heading; each tool's screens in the middle */}
      {cOut < 0.999 && pillIn > 0.001 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - cOut }}>
          <div style={{ position: "absolute", left: PILLS.x, top: HEADING.y - PILLS.h / 2, height: PILLS.h, display: "flex", alignItems: "center", gap: PILLS.gap }}>
            {CHECKS.map((k) => {
              const p = pillIn * (1 - ease(f, backAt, m.sec(0.1)));
              // green with a ✓ on the tool's name, and it stays checked
              const ok = ease(f, W(k.toolAt), m.pop);
              return (
                <div key={k.text} style={{ height: PILLS.h, display: "flex", alignItems: "center", gap: 10 * ok, padding: "0 24px", borderRadius: 999, background: interpolateColors(ok, [0, 1], [c.cardBg, theme.color.ok]), boxShadow: `${shadow.soft}, inset 0 0 0 2px ${interpolateColors(ok, [0, 1], [theme.color.connector, theme.color.ok])}`, opacity: p, ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: interpolateColors(ok, [0, 1], [c.indigo, c.cardBg]), whiteSpace: "nowrap" }}>
                  <div style={{ width: PILLS.tick * ok, height: PILLS.tick, borderRadius: 999, background: c.cardBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontSize: 20, fontWeight: 700, color: theme.color.ok, opacity: ok }}>✓</div>
                  {k.text}
                </div>
              );
            })}
          </div>
          {CHECKS.map((k, i) => {
            const start = W(k.toolAt);
            const out = i + 1 < CHECKS.length ? ease(f, W(CHECKS[i + 1].toolAt) - m.sec(0.1), m.fade) : ease(f, backAt, m.fade);
            const shots = k.shots ?? [null];
            const sw = k.ratio ? SCREEN_H * k.ratio : SCREEN_W;
            const rowW = shots.length * sw + (shots.length - 1) * SCREEN.gap;
            return shots.map((src, j) => {
              const p = ease(f, start + j * m.sec(0.12), m.reveal) * (1 - out);
              if (p <= 0.001) return null;
              return (
                <div key={`${k.tool}-${j}`} style={{ position: "absolute", left: CX - rowW / 2 + j * (sw + SCREEN.gap), top: SCREEN.top + (1 - p) * 24, width: sw, height: SCREEN_H, borderRadius: theme.shape.cardRadius, overflow: "hidden", background: c.cardBg, boxShadow: shadow.soft, opacity: p }}>
                  {src ? (
                    <Img src={staticFile(src)} style={{ width: sw, height: SCREEN_H, display: "block" }} />
                  ) : (
                    <div style={{ position: "absolute", inset: 14, borderRadius: theme.shape.cardRadius - 10, border: `3px dashed ${theme.color.connectorMuteSolid}`, background: theme.color.neutralDisc, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <div style={{ ...typeStyle("label"), color: c.slate }}>Screenshot</div>
                      <div style={{ ...typeStyle("body"), color: c.ink, textAlign: "center" }}>{k.tool}</div>
                    </div>
                  )}
                </div>
              );
            });
          })}
          {/* the box on a screen, on its words (Volume: the bars) */}
          <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
            {CHECKS.map((k, i) => {
              if (!k.mark || !k.markAt || !k.ratio) return null;
              const out = i + 1 < CHECKS.length ? ease(f, W(CHECKS[i + 1].toolAt) - m.sec(0.1), m.fade) : ease(f, backAt, m.fade);
              const p = ease(f, W(k.markAt), m.reveal) * (1 - out);
              if (p <= 0.001) return null;
              const sw = SCREEN_H * k.ratio;
              const kx = sw / 1080;
              const x0 = CX - sw / 2;
              const pad = 8;
              return <HighlightBox key={k.tool} rect={{ x1: x0 + k.mark.x1 * kx - pad, y1: SCREEN.top + k.mark.y1 * kx - pad, x2: x0 + k.mark.x2 * kx + pad, y2: SCREEN.top + k.mark.y2 * kx + pad }} grow={p} opacity={p} fill="none" width={4} radius={18} />;
            })}
          </svg>
          {/* the basis: fills as they agree, never to the end (SHOW_BASIS) */}
          {SHOW_BASIS && f >= agreeAt ? (
            <div style={{ position: "absolute", left: BAR.x, top: BAR.y, width: BAR.w, height: BAR.h, borderRadius: BAR.h / 2, background: theme.color.neutralDot, opacity: ease(f, agreeAt, m.reveal) }}>
              {/* what the bar is (the storyboard's "Dasar lebih kuat", cut to its keyword) */}
              <div style={{ position: "absolute", right: BAR.w + 28, top: BAR.h / 2, transform: "translateY(-50%)", ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>Dasar</div>
              <div style={{ position: "absolute", left: 0, top: 0, width: BAR.w * fill, height: BAR.h, borderRadius: BAR.h / 2, background: c.indigo }} />
              <div style={{ position: "absolute", left: BAR.w * BAR_MAX, top: -6, width: BAR.w * (1 - BAR_MAX), height: BAR.h + 12, borderRadius: (BAR.h + 12) / 2, border: `2px dashed ${theme.color.connectorMuteSolid}`, boxSizing: "border-box", opacity: ease(f, W("bukan jaminan"), m.reveal) }} />
            </div>
          ) : null}
          {/* "Tapi tetap bukan jaminan…" as one summary line under the bar (Simon 29 Oct) */}
          {SHOW_BASIS ? (
            <Appear at={W("Tapi tetap")} style={{ left: 0, top: 0 }}>
              <Line x={0} y={BAR.y + BAR.h + 58} w={theme.canvas.width} align="center" size={48} weight={500} text="Bukan jaminan harga pasti naik." mark="Bukan jaminan" />
            </Appear>
          ) : null}
        </div>
      ) : null}

      {/* D — wait; group ≠ market */}
      <Appear at={waitAt} out={W("Karena ramai")} style={{ left: 0, top: 0 }}>
        <div style={{ position: "absolute", left: 0, top: theme.canvas.height / 2, width: theme.canvas.width, transform: "translateY(-50%)", display: "flex", justifyContent: "center", fontFamily: theme.text.family, fontSize: 56, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.22, color: c.ink, whiteSpace: "nowrap" }}>
          <span>Bukti belum cukup?</span>
          {/* "Tunggu dulu." opens its own room (a grid column at waitP of its width), so the question slides left for it */}
          <div style={{ display: "grid", gridTemplateColumns: `minmax(0, ${waitP.toFixed(4)}fr)` }}>
            <span style={{ paddingLeft: "0.28em", color: c.indigo, opacity: waitP, transform: `translateY(${((1 - waitP) * 14).toFixed(2)}px)` }}>Tunggu dulu.</span>
          </div>
        </div>
      </Appear>
      <Appear at={grupAt} style={{ left: 0, top: 0 }}>
        <Card x={GRUP.x} y={GRUP.y} w={GRUP.w} h={GRUP.h}>
          <div style={{ position: "absolute", left: 38, top: 28, ...typeStyle("body"), color: c.ink }}>Grup</div>
          {[0, 1, 2, 3, 4].map((k) => (
            <div key={k} style={{ position: "absolute", left: k % 2 ? 150 : 36, top: 100 + k * 52, width: [260, 300, 220, 290, 240][k], height: 42, borderRadius: k % 2 ? "22px 8px 22px 22px" : "8px 22px 22px 22px", background: k % 2 ? theme.color.indigoWashSolid : theme.color.neutralDisc, opacity: ease(f, grupAt + k * m.sec(0.07), m.pop) }} />
          ))}
        </Card>
      </Appear>
      <Appear at={pasarAt} style={{ left: 0, top: 0 }}>
        <Card x={PASAR.x} y={PASAR.y} w={PASAR.w} h={PASAR.h}>
          <div style={{ position: "absolute", left: 38, top: 28, ...typeStyle("body"), color: c.ink }}>Pasar</div>
          {(["Bid", "Offer"] as const).map((side, s) => (
            <div key={side} style={{ position: "absolute", left: s ? PASAR.w / 2 + BOOK.gap / 2 : BOOK.pad, top: BOOK.head, width: PASAR.w / 2 - BOOK.gap / 2 - BOOK.pad, textAlign: s ? "right" : "left", ...typeStyle("label"), color: s ? theme.color.cyanInk : c.indigo }}>{side}</div>
          ))}
          <div style={{ position: "absolute", left: BOOK.pad, top: BOOK.top - 14, width: PASAR.w - 2 * BOOK.pad, height: 2, background: theme.color.neutralDot }} />
          {BOOK_BID.map((bid, k) => {
            const rowP = ease(f, pasarAt + k * m.sec(0.07), m.pop);
            const depth = ease(f, pasarAt + k * m.sec(0.07) + m.sec(0.1), m.reveal);
            const half = PASAR.w / 2 - BOOK.gap / 2 - BOOK.pad;
            const y = BOOK.top + k * BOOK.pitch;
            const pill = (x: number, w: number, fill: string) => <div style={{ position: "absolute", left: x, top: y + (BOOK.row - BOOK.pill) / 2, width: w, height: BOOK.pill, borderRadius: BOOK.pill / 2, background: fill }} />;
            return (
              <div key={k} style={{ opacity: rowP }}>
                {/* depth: bid grows left from the middle, offer right */}
                <div style={{ position: "absolute", left: PASAR.w / 2 - BOOK.gap / 2 - half * bid * depth, top: y, width: half * bid * depth, height: BOOK.row, borderRadius: 8, background: theme.color.indigoWashDeepSolid }} />
                <div style={{ position: "absolute", left: PASAR.w / 2 + BOOK.gap / 2, top: y, width: half * BOOK_OFFER[k] * depth, height: BOOK.row, borderRadius: 8, background: theme.color.cyanWashDeepSolid }} />
                {pill(BOOK.pad + 12, BOOK.lot, theme.color.neutralDot)}
                {pill(PASAR.w / 2 - BOOK.gap / 2 - 12 - BOOK.price, BOOK.price, c.indigo)}
                {pill(PASAR.w / 2 + BOOK.gap / 2 + 12, BOOK.price, theme.color.cyanInk)}
                {pill(PASAR.w - BOOK.pad - 12 - BOOK.lot, BOOK.lot, theme.color.neutralDot)}
              </div>
            );
          })}
        </Card>
      </Appear>
      <Appear at={grupAt} style={{ left: 0, top: 0 }}>
        <Line x={0} y={790} w={theme.canvas.width} align="center" size={54} weight={500} text="Ramai di grup, belum tentu ramai di pasar." mark="ramai di pasar" />
      </Appear>
    </Stage>
  );
};
