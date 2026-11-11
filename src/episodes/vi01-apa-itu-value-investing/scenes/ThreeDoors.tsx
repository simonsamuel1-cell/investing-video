/**
 * VI01 · SC05 — "Tiga Pintu yang Harus Dilewati", rebuilt in IN07's look (Simon 11 Nov: "Skalian ubah scene selanjutnya ya,
 * scene 5-akhir" — as SC04: grid paper, a numbered heading per door, one big picture at a time, a camera cut between them,
 * charts as SC02's) from the ChatGPT storyboard docs/vi-style/storyboards/VI01-SC05-v2.png.
 *
 *  A   three closed doors, numbered; "Bisa dipelajari".
 *  1   "Proses jangka panjang" — "Kaya dalam semalam" crossed out beside a steady staircase; 15% a year for 20 years as
 *      SC02's chart, ending at 16× (1.15^20 = 16.4); Ibu Sari and three warung, the first one hers, two still faint.
 *  2   "Independent thinking" — door 2 docks; a group chat saying sell while you type something else, then the cash book;
 *      Ibu Sari reads it while the Rp50 juta offer goes pale.
 *  3   "Memahami perusahaan" — many companies, a few kept; Munger and a card of twenty; Orang Tuntun with 2 jam / minggu →
 *      10 perusahaan / tahun.
 *  E   the doors open, "Kebiasaan, bukan bakat"; then SC03's timeline once more.
 */
import { staticFile, useCurrentFrame } from "remotion";
import { Connector, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { ART, AreaLine, BoardGrid, Bubble, Card, Figure, Glyph, HEADING, LedgerCard, Line, NumRing, ORANG_TUNTUN_RIGHT, OrangTuntun, Pic, RingMark, Shot, Skel, ease, inBox, useWords, type Box } from "../components/kit";
import { Timeline } from "../components/Timeline";

const CX = theme.canvas.width / 2;
const CY = 590;

// A / E — the doors
const DOOR = { w: 230, h: 360, gap: 110, top: CY - 360 / 2 + 40 };
/**
 * A's group — the numbers 110 px above the doors, the doors, "Bisa dipelajari" 40 px under them — centred on the frame's
 * middle (Simon 11 Nov: "ini bisa center-vertikal"). The caption is 56 px type (≈ 67 px line).
 */
const A_GROUP = { above: 110, below: 40, caption: 67 };
const A_TOP = theme.canvas.height / 2 - (A_GROUP.above + DOOR.h + A_GROUP.below + A_GROUP.caption) / 2 + A_GROUP.above;
const doorX = (i: number) => CX - DOOR.w / 2 + (i - 1) * (DOOR.w + DOOR.gap);

// 1
/**
 * 1 — Simon 11 Nov: after the three doors, door 1 moves to the middle and its title is written under it; on "Menjadi kaya
 * dalam semalam sulit. Tapi pertumbuhan yang konsisten…" a one-line summary under the title; then the title and its number go
 * up to the heading's place top left (IN07's opening heading), and only the growth chart stays: Rp10 juta at 15 % a year
 * through 5, 10, 15, 20 years (1,15^n: 2,01 · 4,05 · 8,14 · 16,37). Rp10 juta is only a starting sum, not anyone's money.
 */
const OPEN = { ringTop: 210, doorTop: 320, titleY: 752, size: 64, sumY: 812 };
const CHART1: Box = { x: CX - 520, y: 290, w: 1040, h: 650 };
const PLOT: Box = { x: CHART1.x + 90, y: CHART1.y + 200, w: CHART1.w - 300, h: 320 };
const START = 10;
const rp = (jt: number) => `Rp${jt.toFixed(1).replace(".", ",")} jt`;
const MILES = [5, 10, 15, 20].map((y) => ({ y, t: y / 20, v: START * 1.15 ** y }));
/** 15% a year for 20 years, 1 → 16.4. */
const GROWTH = Array.from({ length: 121 }, (_, i) => {
  const t = i / 120;
  return [t, ((1.15 ** (20 * t) - 1) / (1.15 ** 20 - 1)) * 0.92 + 0.04] as [number, number];
});

// 2
/**
 * 2 — Simon 11 Nov ("uda diganti belom visualnya jadi lebih valuable?"): one frame — a group chat in the middle where everyone
 * says sell and you type something else (not sent); on "buku kas" the chat moves left and the cash book comes in on the right,
 * a line from it to what you typed. ("Keberanian" came out.) The chat is made up; no ticker.
 */
const CHAT: Box = { x: 140, y: 290, w: 760, h: 650 };
const MSGS = ["Jual semua!", "Udah pada cut loss", "Ikut yang lain aja", "Semua lagi jual"];
const MSG = { top: 130, h: 64, gap: 20, avatar: 48 };
/** Your answer, typed but not sent (Simon 11 Nov: "ganti jadi menjadi ketikan yang belum terkirim"), in the chat's input bar. */
const MINE = { text: "Cek buku kasnya dulu", barTop: 540, barH: 76, cps: 18 };
/** The chat opens in the middle and moves left to make room for the cash book (Simon 11 Nov). */
const CHAT_X = { mid: CX - 760 / 2, left: 140 };
const RIGHT2 = { cx: 1360, ledgerTop: 330 };
const LEDGER = { w: 560, h: 560 };

// 3
const MOSAIC = { cols: 8, rows: 4, w: 140, h: 92, gap: 22, keep: [9, 12, 18, 22, 27] };
const PUNCH = { cols: 5, rows: 4, d: 64, gap: 26 };

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(5, BLOCK.SC05);
  const g = f + BLOCK.SC05;
  const B = BLOCK.SC05;
  const cut = (phrase: string) => W(phrase) - m.sec(0.15);
  const END = BLOCK.SC06 - BLOCK.SC05;

  const IS = cut("Ibu Sari juga");
  const P2 = cut("Pintu kedua");
  const BK = cut("Ketika orang");
  const P3 = cut("Pintu ketiga");
  const MG = cut("Munger pernah");
  const DJ = cut("Kalau kamu menyediakan");
  const KB = cut("Tiga pintu ini");
  const TL = cut("Semua investor");

  /** A door, closed or opened by `open` (0–1), its number above it. */
  const Door = ({ i, p, open = 0, top = DOOR.top, left = doorX(i), ring = true }: { i: number; p: number; open?: number; top?: number; left?: number; ring?: boolean }) =>
    p <= 0.001 ? null : (
      <div style={{ position: "absolute", left, top: top + (1 - p) * 20, width: DOOR.w, height: DOOR.h, opacity: p }}>
        {ring ? (
          <div style={{ position: "absolute", left: DOOR.w / 2 - 40, top: -110 }}>
            <NumRing n={i + 1} size={80} />
          </div>
        ) : null}
        {/* the opening: the light behind the door */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: theme.color.indigoWashSolid, boxShadow: `inset 0 0 0 3px ${theme.color.hairlineBrandSolid}` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 3px ${theme.color.skeleton}`, transformOrigin: "left center", transform: `perspective(900px) rotateY(${(-70 * open).toFixed(2)}deg)` }}>
          <div style={{ position: "absolute", left: 28, right: 28, top: 30, height: 130, borderRadius: 16, boxShadow: `inset 0 0 0 3px ${theme.color.skeleton}` }} />
          <div style={{ position: "absolute", left: 28, right: 28, top: 186, height: 140, borderRadius: 16, boxShadow: `inset 0 0 0 3px ${theme.color.skeleton}` }} />
          <div style={{ position: "absolute", right: 30, top: DOOR.h / 2 - 10, width: 20, height: 20, borderRadius: 999, background: theme.color.neutralDotOn }} />
        </div>
      </div>
    );

  /**
   * Doors 2 and 3 in door 1's format (Simon 11 Nov: "kasih format dan layout pintu juga"): the door in the middle with its
   * number above and its title under it; then number and title dock to the heading's place top left and the door goes.
   */
  const DockDoor = ({ n, title, at, titleAt, dockAt }: { n: number; title: string; at: number; titleAt: number; dockAt: number }) => {
    const p = ease(f, at, m.reveal);
    const tp = ease(f, titleAt, m.reveal);
    const dk = ease(f, dockAt, m.move);
    const r2 = 1 - (1 - dk) ** 2;
    const open = { x: CX, y: OPEN.doorTop + (1 - p) * 20 - 70 };
    const rg = { x: open.x + (HEADING.x + HEADING.disc / 2 - open.x) * r2, y: open.y + (HEADING.y - open.y) * r2, d: 80 + (HEADING.disc - 80) * dk };
    const k = OPEN.size / theme.type.title.size + (1 - OPEN.size / theme.type.title.size) * dk;
    const tx = CX + (HEADING.x + HEADING.disc + 24 - CX) * dk;
    const o = 50 * (1 - dk);
    const ty = OPEN.titleY + (HEADING.y - OPEN.titleY) * dk;
    return (
      <>
        {dk < 0.999 ? (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - dk, transform: `translateY(${(dk * 24).toFixed(1)}px)` }}>
            <Door i={n - 1} p={p} top={OPEN.doorTop} left={CX - DOOR.w / 2} ring={false} />
          </div>
        ) : null}
        {p > 0.001 ? (
          <div style={{ position: "absolute", left: rg.x - rg.d / 2, top: rg.y - rg.d / 2, opacity: p }}>
            <NumRing n={n} size={rg.d} />
          </div>
        ) : null}
        {tp > 0.001 ? (
          <div style={{ position: "absolute", left: tx, top: ty - HEADING.disc / 2, height: HEADING.disc, display: "flex", alignItems: "center", opacity: tp, transformOrigin: `${o}% 50%`, transform: `translateX(${-o}%) scale(${k.toFixed(4)})` }}>
            <div style={{ fontFamily: theme.text.family, fontSize: theme.type.title.size, fontWeight: 500, letterSpacing: theme.type.title.tracking, color: c.ink, whiteSpace: "nowrap" }}>{title}</div>
          </div>
        ) : null}
      </>
    );
  };

  // 1
  const door0P = ease(f, W("tiga pintu"), m.pop);
  const othersOut = ease(f, W("Pintu pertama") - m.sec(0.1), m.fade);
  const toMiddle = ease(f, W("Pintu pertama") - m.sec(0.1), m.move);
  const titleP = ease(f, W("percaya pada"), m.reveal);
  const sumA = ease(f, W("Menjadi kaya"), m.reveal);
  const sumB = ease(f, W("Tapi pertumbuhan"), m.reveal);
  const dockAt = W("Return 15%") - m.sec(0.4);
  const dock = ease(f, dockAt, m.move);
  const chartP = ease(f, W("Return 15%"), m.reveal);
  const drawFrom = W("Return 15%") + m.sec(0.3);
  const drawLen = W("16 kali") - drawFrom;
  const growDraw = ease(f, drawFrom, drawLen);
  const timesP = ease(f, W("16 kali"), m.pop);
  const growEnd = inBox(PLOT, GROWTH[GROWTH.length - 1]);
  // door 1 on its way to the middle, and its number (the heading's ring) riding above it until the heading docks
  const door0Left = doorX(0) + (CX - DOOR.w / 2 - doorX(0)) * toMiddle;
  const door0Top = A_TOP + (OPEN.doorTop - A_TOP) * toMiddle;
  const ringOpen = { x: door0Left + DOOR.w / 2, y: door0Top + (1 - door0P) * 20 - 110 + 40 };
  const rr = 1 - (1 - dock) ** 2;
  const ring = { x: ringOpen.x + (HEADING.x + HEADING.disc / 2 - ringOpen.x) * rr, y: ringOpen.y + (HEADING.y - ringOpen.y) * rr, d: 80 + (HEADING.disc - 80) * dock };
  const titleK = OPEN.size / theme.type.title.size + (1 - OPEN.size / theme.type.title.size) * dock;
  const titleX = CX + (HEADING.x + HEADING.disc + 24 - CX) * dock;
  const titleO = 50 * (1 - dock);
  const titleY = OPEN.titleY + (HEADING.y - OPEN.titleY) * dock;
  // Ibu Sari: the three warung, then one
  const one = ease(f, W("mulai dari satu"), m.move);

  // 2
  const chatSlide = ease(f, W("buku kas.") - m.sec(0.7), m.move);
  const chatX = CHAT_X.mid + (CHAT_X.left - CHAT_X.mid) * chatSlide;
  const typeAt = W("berbeda dari");
  const typedN = Math.max(0, Math.min(MINE.text.length, Math.floor(((f - typeAt) * MINE.cps) / m.sec(1))));
  const caretOn = f >= typeAt && (typedN < MINE.text.length || Math.floor(g / m.sec(0.5)) % 2 === 0);
  const ledgerP = ease(f, W("buku kas.") - m.sec(0.2), m.reveal);
  const linkP = ease(f, W("buku kas.") + m.sec(0.2), m.sec(0.6));
  const dock2At = W("Kadang keputusan") - m.sec(0.4);
  const dock3At = W("Bukan semua") - m.sec(0.4);
  const offerP = ease(f, W("menawarkan Rp50"), m.pop);
  const offerPale = ease(f, W("bukan ekspresi"), m.fade);
  const readP = ease(f, W("Ibu Sari melihat"), m.reveal);

  // 3
  const fewP = ease(f, W("Bukan semua") + m.sec(0.6), m.fade);
  const keepP = ease(f, W("Cukup beberapa"), m.pop);

  // E
  const openP = ease(f, W("Tiga pintu ini"), m.sec(1));

  return (
    <>
      <BoardGrid g={g} on={1} />

      {/* A + 1 — three doors; door 1 to the middle, its title and summary; the title docks; the growth chart */}
      <Shot from={0} to={IS} block={B} cutIn={false}>
        {[1, 2].map((i) => {
          const p = ease(f, W("tiga pintu") + i * m.sec(0.15), m.pop) * (1 - othersOut);
          return p > 0.001 ? <div key={i} style={{ position: "absolute", inset: 0, transform: `translateY(${(othersOut * 30).toFixed(1)}px)` }}><Door i={i} p={p} top={A_TOP} /></div> : null;
        })}
        {dock < 0.999 ? (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - dock, transform: `translateY(${(dock * 24).toFixed(1)}px)` }}>
            <Door i={0} p={door0P} top={door0Top} left={door0Left} ring={false} />
          </div>
        ) : null}
        {ease(f, W("bisa dipelajari"), m.reveal) * (1 - othersOut) > 0.001 ? (
          <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: A_TOP + DOOR.h + A_GROUP.below, textAlign: "center", ...typeStyle("title"), fontSize: 56, fontWeight: 500, color: c.indigo, opacity: ease(f, W("bisa dipelajari"), m.reveal) * (1 - othersOut) }}>Bisa dipelajari</div>
        ) : null}
        {/* the summary under the title, in two steps on its two sentences */}
        {(sumA + sumB) * (1 - dock) > 0.001 ? (
          <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: OPEN.sumY, textAlign: "center", fontFamily: theme.text.family, fontSize: 40, fontWeight: 500, color: c.slate, whiteSpace: "pre", opacity: 1 - dock }}>
            <span style={{ opacity: sumA }}>Bukan kaya semalam, </span>
            <span style={{ color: c.indigo, opacity: sumB }}>tapi tumbuh konsisten</span>
          </div>
        ) : null}
        {/* the growth chart, the only card that stays (Simon 11 Nov: "Keep gambar ini, lainnya remove") */}
        <Card x={CHART1.x} y={CHART1.y} w={CHART1.w} h={CHART1.h} style={{ opacity: chartP, transform: `translateY(${((1 - chartP) * 18).toFixed(1)}px)` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 28, textAlign: "center", ...typeStyle("title"), fontSize: 36, fontWeight: 700, color: c.ink }}>Pertumbuhan konsisten</div>
          <div style={{ position: "absolute", left: 90, top: 96, display: "flex", gap: 14 }}>
            {[
              { text: "Modal Rp10 juta", at: "Return 15%" },
              { text: "15% / tahun", at: "15% per" },
            ].map((chip) => (
              <div key={chip.text} style={{ height: 52, padding: "0 22px", borderRadius: 999, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", ...typeStyle("label"), fontSize: 26, fontWeight: 600, color: c.indigo, opacity: ease(f, W(chip.at) - m.sec(0.1), m.reveal) }}>{chip.text}</div>
            ))}
          </div>
          <svg width={CHART1.w} height={CHART1.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <g transform={`translate(${-CHART1.x} ${-CHART1.y})`}>
              <AreaLine box={PLOT} pts={GROWTH} upto={growDraw} id="sc05-growth" />
              {MILES.slice(0, -1).map((mi) => {
                const [x, y] = inBox(PLOT, GROWTH[Math.round(mi.t * (GROWTH.length - 1))]);
                const p = growDraw >= mi.t ? ease(f, drawFrom + mi.t * drawLen, m.pop) : 0;
                return p > 0.001 ? <circle key={mi.y} cx={x} cy={y} r={8 * p} fill={c.indigo} stroke={c.cardBg} strokeWidth={3} /> : null;
              })}
              <RingMark x={growEnd[0]} y={growEnd[1]} y2={PLOT.y + PLOT.h} p={timesP} />
            </g>
          </svg>
          {/* the sum at each milestone, and the years under the axis */}
          {MILES.map((mi) => {
            const [x, y] = inBox(PLOT, GROWTH[Math.round(mi.t * (GROWTH.length - 1))]);
            const p = growDraw >= mi.t - 0.001 ? ease(f, drawFrom + mi.t * drawLen, m.reveal) : 0;
            return (
              <div key={mi.y}>
                {/* above-left of its dot, where the rising line isn't */}
                {p > 0.001 ? <div style={{ position: "absolute", left: x - CHART1.x - 12, top: y - CHART1.y - 16, transform: "translate(-100%, -100%)", padding: "2px 10px", borderRadius: 999, background: c.cardBg, ...typeStyle("label"), fontSize: 26, fontWeight: 600, color: mi.y === 20 ? c.indigo : c.ink, whiteSpace: "nowrap", opacity: p, fontVariantNumeric: "tabular-nums" }}>{rp(mi.v)}</div> : null}
                <div style={{ position: "absolute", left: x - CHART1.x - 60, width: 120, top: PLOT.y - CHART1.y + PLOT.h + 18, textAlign: "center", ...typeStyle("label"), fontSize: 24, fontWeight: 500, color: c.slate }}>{mi.y === 20 ? "20 tahun" : mi.y}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: PLOT.x - CHART1.x + 10, top: PLOT.y - CHART1.y - 10, width: 260, textAlign: "left", ...typeStyle("title"), fontSize: 96, fontWeight: 600, lineHeight: 1, color: c.indigo, opacity: timesP, fontVariantNumeric: "tabular-nums" }}>16×</div>
        </Card>
      </Shot>
      {/* door 1's number and title: opened under the door, then docked top left; held still through the cut to Ibu Sari */}
      <Shot from={0} to={P2} block={B} cutIn={false}>
        {door0P > 0.001 ? (
          <div style={{ position: "absolute", left: ring.x - ring.d / 2, top: ring.y - ring.d / 2, opacity: door0P }}>
            <NumRing n={1} size={ring.d} />
          </div>
        ) : null}
        {titleP > 0.001 ? (
          <div style={{ position: "absolute", left: titleX, top: titleY - HEADING.disc / 2, height: HEADING.disc, display: "flex", alignItems: "center", opacity: titleP, transformOrigin: `${titleO}% 50%`, transform: `translateX(${-titleO}%) scale(${titleK.toFixed(4)})` }}>
            <div style={{ fontFamily: theme.text.family, fontSize: theme.type.title.size, fontWeight: 500, letterSpacing: theme.type.title.tracking, color: c.ink, whiteSpace: "nowrap" }}>Proses jangka panjang</div>
          </div>
        ) : null}
      </Shot>
      <Shot from={IS} to={P2} block={B}>
        {/* Ibu Sari as tall as a warung (Simon 11 Nov); "3 warung ngga dalam semalam" over the three; then one stays, the others slide down and go */}
        <Figure name="ibu-sari" cx={420} floor={820} h={330} style={{ opacity: ease(f, W("Ibu Sari juga") - m.sec(0.1), m.reveal) }} />
        {ease(f, W("tiga warung") - m.sec(0.1), m.reveal) * (1 - one) > 0.001 ? (
          <div style={{ position: "absolute", left: 820 - 190, width: 2 * 380 + 380, top: 400, textAlign: "center", fontFamily: theme.text.family, fontSize: 48, fontWeight: 500, color: c.ink, opacity: ease(f, W("tiga warung") - m.sec(0.1), m.reveal) * (1 - one) }}>3 warung ngga dalam semalam</div>
        ) : null}
        {[0, 1, 2].map((i) => {
          const p = ease(f, W("tiga warung") + i * m.sec(0.12), m.reveal) * (i === 0 ? 1 : 1 - one);
          return p > 0.001 ? <div key={i} style={{ position: "absolute", inset: 0, transform: `translateY(${(i === 0 ? 0 : one * 60).toFixed(1)}px)` }}><Figure name="warung" cx={820 + i * 380} floor={820} h={330} style={{ opacity: p }} /></div> : null;
        })}
      </Shot>

      {/* 2 — Independent thinking: door 2, then one frame — the chat, what you type, the cash book under it */}
      <Shot from={P2} to={P3} block={B}>
        <DockDoor n={2} title="Independent thinking" at={P2} titleAt={W("independent thinking")} dockAt={dock2At} />
      </Shot>
      <Shot from={P2} to={BK} block={B}>
        <Card x={chatX} y={CHAT.y} w={CHAT.w} h={CHAT.h} style={{ opacity: ease(f, W("Kadang keputusan") - m.sec(0.1), m.reveal), transform: `translateY(${((1 - ease(f, W("Kadang keputusan") - m.sec(0.1), m.reveal)) * 18).toFixed(1)}px)` }}>
          <div style={{ position: "absolute", left: 36, right: 36, top: 26, height: 70, display: "flex", alignItems: "center", gap: 16, borderBottom: `2px solid ${theme.color.skeleton}`, paddingBottom: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph icon="users-three" size={34} tone={c.slate} />
            </div>
            <div style={{ ...typeStyle("title"), fontSize: 32, fontWeight: 700, color: c.ink }}>Grup Saham</div>
          </div>
          {/* everyone says sell */}
          {MSGS.map((t, k) => {
            const q = ease(f, W("Kadang keputusan") + k * m.sec(0.3), m.pop);
            return q > 0.001 ? (
              <div key={t} style={{ position: "absolute", left: 36, top: MSG.top + k * (MSG.h + MSG.gap), display: "flex", alignItems: "center", gap: 14, opacity: q, transform: `translateY(${((1 - q) * 12).toFixed(1)}px)` }}>
                <div style={{ width: MSG.avatar, height: MSG.avatar, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <Glyph icon="user-circle" size={34} tone={theme.color.neutralDotOn} />
                </div>
                <div style={{ height: MSG.h, padding: "0 24px", borderRadius: 22, background: theme.color.neutralDisc, display: "flex", alignItems: "center", ...typeStyle("label"), fontSize: 28, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>{t}</div>
              </div>
            ) : null;
          })}
          {/* and you, typing something else — not sent */}
          <div style={{ position: "absolute", left: 36, right: 36, top: MINE.barTop, height: MINE.barH, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, height: MINE.barH, borderRadius: MINE.barH / 2, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${typedN > 0 ? theme.color.selfAmber : theme.color.skeleton}`, display: "flex", alignItems: "center", padding: "0 28px", ...typeStyle("label"), fontSize: 28, fontWeight: 500, color: c.ink, whiteSpace: "nowrap", overflow: "hidden" }}>
              {MINE.text.slice(0, typedN)}
              {caretOn ? <span style={{ display: "inline-block", width: 3, height: 32, marginLeft: 2, background: theme.color.selfAmberInk }} /> : null}
            </div>
            <div style={{ width: MINE.barH, height: MINE.barH, borderRadius: 999, background: typedN > 0 ? theme.color.selfAmber : theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <svg width={34} height={34} viewBox="0 0 34 34"><path d="M 7 17 L 27 17 M 19 9 L 27 17 L 19 25" fill="none" stroke={c.cardBg} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </Card>
        {/* the cash book, and the line from it to your answer */}
        {ledgerP > 0.001 ? (
          <Card x={RIGHT2.cx - LEDGER.w / 2} y={RIGHT2.ledgerTop + (1 - ledgerP) * 18} w={LEDGER.w} h={LEDGER.h} style={{ opacity: ledgerP }}>
            <LedgerCard title="Buku kas" lit={[linkP, linkP, linkP]} />
          </Card>
        ) : null}
        {linkP > 0.001 ? <Connector a={{ x: chatX + CHAT.w - 36, y: CHAT.y + MINE.barTop + MINE.barH / 2 }} b={{ x: RIGHT2.cx - LEDGER.w / 2, y: RIGHT2.ledgerTop + LEDGER.h / 2 }} p={linkP} shape="curve" tone={theme.color.connector} dot={false} /> : null}
      </Shot>
      <Shot from={BK} to={P3} block={B}>
        <Card x={CX - LEDGER.w / 2} y={CY - LEDGER.h / 2 + 20} w={LEDGER.w} h={LEDGER.h} style={{ opacity: ease(f, W("buku kas.") - m.sec(0.2), m.reveal) }}>
          <LedgerCard title="Buku kas" lit={[readP, readP, readP]} />
        </Card>
        {/* Ibu Sari standing, facing right — toward her cash book and the offer (Simon 11 Nov: "pose yang menghadap kanan") */}
        <Figure name="ibu-sari" cx={330} floor={900} h={560} style={{ opacity: readP }} />
        {/* the offer, from Mr Market (Simon 11 Nov: "balikin mr market"), turned to face her; it goes pale on "bukan ekspresi" */}
        {offerP > 0.001 ? (
          <div style={{ position: "absolute", inset: 0, opacity: offerP }}>
            <div style={{ position: "absolute", inset: 0, filter: offerPale > 0.001 ? `grayscale(${offerPale.toFixed(3)}) brightness(${(1 + 0.12 * offerPale).toFixed(3)})` : undefined }}>
              <Bubble x={1270} y={250} w={380} h={120}>
                <div style={{ ...typeStyle("title"), fontSize: 52, fontWeight: 600, color: c.ink }}>Rp50 juta</div>
              </Bubble>
            </div>
            <Figure name="mr-market" cx={1630} floor={900} h={500} flip faint={offerPale} />
          </div>
        ) : null}
      </Shot>

      {/* 3 — Memahami perusahaan */}
      <Shot from={P3} to={DJ} block={B}>
        <DockDoor n={3} title="Memahami perusahaan" at={P3} titleAt={W("benar-benar meluangkan")} dockAt={dock3At} />
      </Shot>
      <Shot from={P3} to={MG} block={B}>
        {Array.from({ length: MOSAIC.cols * MOSAIC.rows }, (_, k) => {
          const col = k % MOSAIC.cols;
          const row = Math.floor(k / MOSAIC.cols);
          const dist = Math.hypot(col - (MOSAIC.cols - 1) / 2, row - (MOSAIC.rows - 1) / 2);
          const p = ease(f, dock3At + m.move * 0.6 + dist * m.sec(0.04), m.reveal);
          if (p <= 0.001) return null;
          const kept = MOSAIC.keep.includes(k);
          const x = CX - (MOSAIC.cols * MOSAIC.w + (MOSAIC.cols - 1) * MOSAIC.gap) / 2 + col * (MOSAIC.w + MOSAIC.gap);
          const y = CY - (MOSAIC.rows * MOSAIC.h + (MOSAIC.rows - 1) * MOSAIC.gap) / 2 + row * (MOSAIC.h + MOSAIC.gap);
          // "Bukan semua": all go pale; "Cukup beberapa": a few come back, ringed
          const pale = kept ? fewP * (1 - keepP) : fewP;
          return (
            <Card key={k} x={x} y={y + (1 - p) * 12} w={MOSAIC.w} h={MOSAIC.h} line={kept && keepP > 0.5 ? c.indigo : undefined} style={{ opacity: p, borderRadius: 18, filter: pale > 0.001 ? `grayscale(1) brightness(${(1 + 0.04 * pale).toFixed(3)}) contrast(${(1 - 0.35 * pale).toFixed(3)})` : undefined }}>
              <Skel w={64} h={10} style={{ left: 16, top: 18, background: kept && keepP > 0.5 ? theme.color.hairlineBrandSolid : undefined }} />
              <Skel w={100} h={10} style={{ left: 16, top: 40 }} />
              <Skel w={46} h={10} style={{ left: 16, top: 62 }} />
            </Card>
          );
        })}
      </Shot>
      <Shot from={MG} to={DJ} block={B}>
        <div style={{ position: "absolute", left: 300, top: CY - 190, width: 360, height: (360 * ART.munger.h) / ART.munger.w, borderRadius: 46, background: c.cardBg, boxShadow: shadow.soft, overflow: "hidden", opacity: ease(f, W("Munger pernah") - m.sec(0.1), m.reveal) }}>
          <Pic src={staticFile("art/vi01/munger.png")} style={{ position: "absolute", left: 0, top: 0, width: 360, height: (360 * ART.munger.h) / ART.munger.w }} />
        </div>
        <div style={{ position: "absolute", left: 300, width: 360, top: CY + 210, textAlign: "center", ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: c.ink, opacity: ease(f, W("Munger pernah"), m.reveal) }}>Charlie Munger</div>
        {/* twenty, filled one by one */}
        <Card x={860} y={CY - 260} w={PUNCH.cols * PUNCH.d + (PUNCH.cols - 1) * PUNCH.gap + 120} h={PUNCH.rows * PUNCH.d + (PUNCH.rows - 1) * PUNCH.gap + 220} style={{ opacity: ease(f, W("sepanjang hidup"), m.reveal) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 44, textAlign: "center", ...typeStyle("title"), fontSize: 48, fontWeight: 600, color: c.indigo }}>20 bisnis</div>
          {Array.from({ length: PUNCH.cols * PUNCH.rows }, (_, k) => {
            const on = ease(f, W("dua puluh") + k * m.sec(0.07), m.pop);
            return (
              <div key={k} style={{ position: "absolute", left: 60 + (k % PUNCH.cols) * (PUNCH.d + PUNCH.gap), top: 140 + Math.floor(k / PUNCH.cols) * (PUNCH.d + PUNCH.gap), width: PUNCH.d, height: PUNCH.d, borderRadius: 999, background: on > 0.5 ? c.indigo : theme.color.neutralDisc, boxShadow: `inset 0 0 0 2px ${on > 0.5 ? c.indigo : theme.color.skeleton}`, transform: `scale(${(1 + 0.12 * Math.sin(Math.PI * on)).toFixed(3)})` }} />
            );
          })}
        </Card>
      </Shot>
      <Shot from={DJ} to={KB} block={B}>
        <OrangTuntun at={DJ} />
        <div style={{ position: "absolute", left: ORANG_TUNTUN_RIGHT + 90, top: 330, width: theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 90 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: ease(f, W("dua jam"), m.reveal) }}>
            <div style={{ width: 96, height: 96, borderRadius: 999, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph icon="clock" size={58} tone={c.indigo} />
            </div>
            <div style={{ ...typeStyle("title"), fontSize: 64, fontWeight: 500, color: c.ink }}>2 jam / minggu</div>
          </div>
          <div style={{ marginTop: 26, marginLeft: 30, fontFamily: theme.text.family, fontSize: 56, color: c.slate, opacity: ease(f, W("dalam setahun"), m.reveal) }}>↓</div>
          <div style={{ marginTop: 20, ...typeStyle("title"), fontSize: 72, fontWeight: 600, color: c.indigo, opacity: ease(f, W("sepuluh perusahaan"), m.reveal) }}>10 perusahaan / tahun</div>
          <div style={{ position: "relative", height: 90, marginTop: 30 }}>
            {Array.from({ length: 10 }, (_, k) => {
              const p = ease(f, W("sepuluh perusahaan") + k * m.sec(0.06), m.pop);
              return p > 0.001 ? (
                <Card key={k} x={k * 92} y={(1 - p) * 10} w={76} h={76} style={{ opacity: p, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon="storefront" size={40} tone={c.indigo} />
                </Card>
              ) : null;
            })}
          </div>
        </div>
      </Shot>

      {/* E — habit, not talent; and the investors who started with one company */}
      <Shot from={KB} to={TL} block={B}>
        <Line x={0} y={250} w={theme.canvas.width} align="center" size={72} weight={500} text="Kebiasaan, bukan bakat" mark="Kebiasaan" />
        {[0, 1, 2].map((i) => (
          <Door key={i} i={i} p={ease(f, KB + i * m.sec(0.08), m.reveal)} open={ease(f, W("Tiga pintu ini") + i * m.sec(0.2), m.sec(0.9)) * openP} />
        ))}
      </Shot>
      <Shot from={TL} to={END} block={B} cutOut={false}>
        <Line x={0} y={300} w={theme.canvas.width} align="center" size={64} weight={500} text="Semua mulai dari perusahaan pertama" mark="perusahaan pertama" />
        <Timeline grow={ease(f, TL, m.sec(1.4))} />
      </Shot>
    </>
  );
};
