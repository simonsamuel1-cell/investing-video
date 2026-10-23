/**
 * VI04 · SC09 — "Tuntun Personal Investment Plan", rebuilt to Benchmark v1 + minimal (STYLE.md §0; Simon, 22 Oct
 * 2026) from the ChatGPT storyboard docs/vi-style/storyboards/VI04-SC09-v2.jpg. The phone at the left shows the
 * REAL app; the column at the right says each step in the VO's words, numbered; connectors tie the two.
 *
 * The phone shows Simon's screenshots (Simon, 19 Oct: "hapus simulasi hp nya, kecuali frame/template hp nya.
 * Ganti isinya jadi T01.PNG, T02.PNG, T03.jpg, T04.jpg"), each on the VO line it belongs to, with his two
 * highlight boxes:
 *
 *  P0 T01  the More menu with the Personal Investment Plan banner (highlighted) — the two questions (Ombak, Kemudi)
 *          link into the phone: "dibantu lebih dalam lewat fitur Tuntun Personal Investment Plan"
 *  P1 T02  ① the return/drawdown curves (the middle one highlighted) — "lalu pilih yang … masih bisa kamu terima"
 *  P2 T04  ② the simulation: what you can see in it, then the two answers — held through P3 (there is no
 *          screenshot of the gaya/pengalaman step)
 *  P3      ③ gaya investasi and tingkat pengalaman, as chips on their words
 *  P4 T03  the report — six connectors grow from the phone to the six things in it
 *  P5      Orang Tuntun: "tinggal tes ulang … bukan versi diri kita lima tahun lalu, tapi: diri kita yang sekarang."
 */
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Connector, HighlightBox, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import type { HLRect } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, ease, IconDot, IsoIcon, Line, NumRing, ORANG_TUNTUN_RIGHT, OrangTuntun, OUTSIDE_RESERVES, useWords } from "../components/kit";

/** The screenshots are 1125×2436 and 1080×2340: the screen takes their shape so nothing is cropped. */
const SHOT = { w: 1125, h: 2436 };
/**
 * The status bar (time, notifications, battery) is cropped off every shot (Simon, 22 Oct): public/art/vi04/app/
 * *-nostatus.png are the originals minus their top rows — 130 px on T01/T02, 84 on T03, 115 on T04. The screen takes
 * the T01/T02 crop's shape; the others are a hair taller and lose a few px at the bottom (top-aligned).
 */
const STATUS_CROP = 130;
const BEZEL = 14;
const SCREEN_W = Math.round((832 * SHOT.w) / SHOT.h);
const SCREEN = { w: SCREEN_W, h: Math.round((SCREEN_W * (SHOT.h - STATUS_CROP)) / SHOT.w), r: 50 };
const PHONE = { cx: 495, y: 122, w: SCREEN.w + 2 * BEZEL, h: SCREEN.h + 2 * BEZEL, r: SCREEN.r + BEZEL };
/**
 * A highlight over rows `y1`–`y2` of a screenshot (its own pixels, measured on the PNG). Simon's rule for a box
 * over a phone: 20px wider than the phone on each side; only its height is scoped to what it marks.
 */
const HL_PAD = { side: 20, rows: 10 };
const hlRows = (y1: number, y2: number, cx: number = PHONE.cx): HLRect => {
  const k = SCREEN.w / SHOT.w;
  const top = PHONE.y + BEZEL - STATUS_CROP * k;
  return { x1: cx - PHONE.w / 2 - HL_PAD.side, x2: cx + PHONE.w / 2 + HL_PAD.side, y1: top + y1 * k - HL_PAD.rows, y2: top + y2 * k + HL_PAD.rows };
};
/** T01: the "FREE! Personal Investment Plan" banner — rows of the shot. (T02's highlight removed, Simon 22 Oct.) */
const HL_ROWS = { banner: [504, 701] } as const;
/**
 * T02's four figures (Simon, 22 Oct): each card's "Average Yearly Return" and "Potential drawdown" blocks, in the
 * shot's own pixels [x1, y1, x2, y2] — return boxes on "return", drawdown boxes on "drawdown".
 */
const T02_STATS = [
  { box: [110, 935, 500, 1045], kind: "return" },
  { box: [640, 935, 1000, 1045], kind: "drawdown" },
  { box: [110, 1530, 500, 1640], kind: "return" },
  { box: [640, 1530, 1000, 1640], kind: "drawdown" },
] as const;
/**
 * T04's simulation chart (Simon, 22 Oct), each on the words that name it: the Buy point ("kapan investasi dimulai"),
 * the waves before Sell ("seberapa dalam sempat turun"), the Sell point ("bagaimana hasil akhirnya"). T04 is 1080 wide
 * with 115 px of status bar cropped. Marked in cyan, not indigo — the chart's own line is indigo.
 */
const T04_MARKS = [
  { box: [160, 1088, 330, 1200], at: "kapan investasi dimulai" },
  { box: [585, 860, 800, 1025], at: "seberapa dalam sempat turun" },
  { box: [705, 750, 872, 846], at: "bagaimana hasil akhirnya" },
] as const;
/** A box in a shot's pixels → the screen, for the phone at centre `cx` (unscaled frame); `w`/`crop` = that shot's. */
const shotBox = (b: readonly number[], cx: number, w: number = SHOT.w, crop: number = STATUS_CROP): HLRect => {
  const k = SCREEN.w / w;
  const x0 = cx - PHONE.w / 2 + BEZEL;
  const y0 = PHONE.y + BEZEL - crop * k;
  return { x1: x0 + b[0] * k, y1: y0 + b[1] * k, x2: x0 + b[2] * k, y2: y0 + b[3] * k };
};

const CX = theme.canvas.width / 2;


/**
 * P0, in order (Simon, 22 Oct): the two questions in the middle; the phone slides in from off the right and stops to
 * their right while they move left to make room; the highlight and the links; then the feature's name, on its words.
 * At P1 the phone carries on to its place at the left for the rest of the scene.
 */
const ASK = { w: 360, h: 100, ys: [330, 470] };
const P0_COL = { w: 620, gap: 120 };
const P0_X = (theme.canvas.width - (P0_COL.w + P0_COL.gap + PHONE.w)) / 2;
const P0_PHONE_CX = P0_X + P0_COL.w + P0_COL.gap + PHONE.w / 2;
const OFF_RIGHT_CX = theme.canvas.width + PHONE.w / 2 + 40;
/**
 * P4 — the report, shown as the report itself (Simon, 22 Oct): the phone moves to the centre and grows 50% from its
 * top, and the whole Stable Architech PDF (public/art/vi04/app/stable-architech-full.jpg, its one long page at the
 * shot width) scrolls in its screen; each part the VO names is scrolled to and boxed. `top` = the PDF row at the
 * screen's top; `box` = the part, in the PDF's pixels [x1, y1, x2, y2]. With the phone grown, ~1620 PDF rows show
 * above the subtitle band.
 */
/** The report's six parts as labels either side of the centred phone (Simon, 22 Oct): 1–3 left, 4–6 right, each on its words. */
const REPORT_LABELS = [
  { icon: "t-profile-w", text: "Profil investasimu", at: "profil investasimu" },
  { icon: "t-fit-w", text: "Investasi yang paling sesuai", at: "investasi yang paling sesuai" },
  { icon: "t-levelup-w", text: "Pilihan untuk naik level", at: "pilihan untuk naik level" },
  { icon: "t-guide-w", text: "Panduan dari Tuntun", at: "panduan dari Tuntun" },
  { icon: "t-sim-w", text: "Simulasi investasi satu tahun", at: "simulasi investasi satu tahun" },
  { icon: "t-notyet-w", text: "Produk yang untuk sekarang mungkin belum cocok", at: "sampai produk" },
];
const RL = { w: 470, h: 136, gap: 40, ys: [310, 476, 642] };
const PDF_H = 7969;
const PDF_VIEW = 1620;
const REPORT_PARTS = [
  { at: "profil investasimu", top: 0, box: [25, 195, 1100, 655] },
  { at: "investasi yang paling sesuai", top: 1250, box: [30, 1365, 1095, 2500] },
  { at: "pilihan untuk naik level", top: 2450, box: [30, 2565, 1095, 3797] },
  { at: "simulasi investasi satu tahun", top: 4570, box: [30, 4582, 1095, 6184] },
  { at: "sampai produk", top: PDF_H - PDF_VIEW, box: [30, 6945, 1095, 7595] },
] as const;

/**
 * P1–P4 (Simon, 22 Oct): the phone stays at the RIGHT where P0 left it, the words on the left. One heading slot at the
 * top-left — number ring + heading at title size + 30 px, indigo — and each heading scrolls up into the next.
 */
/**
 * From point 1 to point 3 the phone is 50% bigger, grown from its top (Simon, 22 Oct) — its top-centre moves from P0's spot to BIG.cx/BIG.y.
 * BIG is placed so the grown phone clears the logo zone (its top below 150) and the text column (its left edge past
 * the widest heading); the part below the subtitle band is cut by the reserves clip.
 */
const BIG = { s: 1.5, cx: 1389, y: 160 };
const BIG_LEFT = BIG.cx - (PHONE.w * BIG.s) / 2;
const L = { x: 140, w: 880 };
const HEAD = { y: 240, h: 110, size: theme.type.title.size + 30, ring: 72 };
const BODY_Y = HEAD.y + HEAD.h + 30;
const HEADINGS = [
  { n: 1, title: "Investment Goal" },
  { n: 2, title: "Simulasi Investasi" },
  { n: 3, title: "Menentukan profilmu" },
];
/** P2's three things you can see, each hanging off the heading's line. */
const SEE = [
  { text: "Kapan investasi dimulai", at: "kapan investasi dimulai" },
  { text: "Seberapa dalam sempat turun", at: "seberapa dalam sempat turun" },
  { text: "Bagaimana hasil akhirnya", at: "bagaimana hasil akhirnya" },
];
const SEE_Y = (i: number) => BODY_Y + 30 + i * 80;
/** Where the heading's words start (after its number ring) — body text lines up under them. */
const TEXT_X = L.x + HEAD.ring + 26;
const SEE_X = TEXT_X;

/** The phone frame — the same light frame as SC06's (components/PhoneScreens); the screenshots sit in its screen. */
const Phone = ({ cx = PHONE.cx, children }: { cx?: number; children: React.ReactNode }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ position: "absolute", left: cx - PHONE.w / 2, top: PHONE.y, width: PHONE.w, height: PHONE.h, borderRadius: PHONE.r, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrand}` }}>
      <div style={{ position: "absolute", left: BEZEL, top: BEZEL, width: SCREEN.w, height: SCREEN.h, borderRadius: SCREEN.r, overflow: "hidden", background: theme.color.neutralDisc }}>{children}</div>
      {/* no notch: with the status bar cropped off, it would sit on the app's own header */}
    </div>
  );
};

/** One screenshot filling the screen, fading up over the one before it on `at`. */
/** `cut`: no fade, the screen just changes (a tap in the app — Simon, 22 Oct). */
const Shot = ({ file, at, still = false, cut = false }: { file: string; at: number; still?: boolean; cut?: boolean }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const p = still ? 1 : cut ? (f >= at ? 1 : 0) : ease(f, at, m.reveal);
  if (p <= 0.001) return null;
  return (
    <Img
      src={staticFile(`art/vi04/app/${file}`)}
      style={{ position: "absolute", left: 0, top: 0, width: SCREEN.w, height: SCREEN.h, maxWidth: "none", objectFit: "cover", objectPosition: "top", opacity: p, transform: `translateY(${((1 - p) * 16).toFixed(2)}px)` }}
    />
  );
};

/** The report PDF in the screen, at the shot width, its row `top` at the screen's top; fades up on `at`. */
const ReportPdf = ({ at, top }: { at: number; top: number }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const p = ease(f, at, m.reveal);
  if (p <= 0.001) return null;
  const k = SCREEN.w / SHOT.w;
  return <Img src={staticFile("art/vi04/app/stable-architech-full.jpg")} style={{ position: "absolute", left: 0, top: -top * k, width: SCREEN.w, height: PDF_H * k, maxWidth: "none", opacity: p }} />;
};
/**
 * A part of the PDF → the screen (unscaled frame), with the PDF scrolled to `top`. Its rows are the part's; its sides
 * are the PHONE's plus 20 px each way on screen (Simon's rule for a box over a phone) — `scale` is the phone's now.
 */
const pdfBox = (b: readonly number[], top: number, cx: number, scale: number): HLRect => {
  const k = SCREEN.w / SHOT.w;
  const y0 = PHONE.y + BEZEL;
  const side = HL_PAD.side / scale;
  return { x1: cx - PHONE.w / 2 - side, y1: y0 + (b[1] - top) * k, x2: cx + PHONE.w / 2 + side, y2: y0 + (b[3] - top) * k };
};

/** A small pill on a word: `solid` = an indigo button (white words, no border); `line` = white with an indigo border; else grey. */
const Pill = ({ text, p, line = false, solid = false }: { text: string; p: number; line?: boolean; solid?: boolean }) => {
  const c = usePalette();
  return (
    <div style={{ padding: "10px 24px", borderRadius: 999, background: solid ? c.indigo : line ? c.cardBg : theme.color.neutralDisc, boxShadow: line ? `inset 0 0 0 2px ${theme.color.connector}` : undefined, ...typeStyle("label"), fontWeight: solid ? 600 : 500, color: solid ? c.cardBg : c.ink, whiteSpace: "nowrap", opacity: p, transform: `translateY(${((1 - p) * 8).toFixed(2)}px)` }}>{text}</div>
  );
};

export const SC09 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(9, BLOCK.SC09);
  const g = f + BLOCK.SC09;

  const p0 = W("Dua pertanyaan tadi");
  const p1 = W("Pertama");
  const p2 = W("Setelah itu");
  const p3 = W("Berikutnya");
  const p4 = W("Dari semua jawaban");
  const p5 = W("Kalau kondisi hidupmu");
  const bannerAt = W("Tuntun Personal Investment");
  // P0's order: questions (p0) → the phone slides in, the questions make room → highlight + links → the name
  const slideAt = p0 + m.sec(0.8);
  const slide = ease(f, slideAt, m.sec(0.8));
  const phoneCx = OFF_RIGHT_CX + (P0_PHONE_CX - OFF_RIGHT_CX) * slide;
  const askX = CX - ASK.w / 2 + (P0_X - (CX - ASK.w / 2)) * slide;
  const linkAt = W("lewat fitur");
  const banner = hlRows(HL_ROWS.banner[0], HL_ROWS.banner[1], phoneCx);
  const pickAt = W("Dari situ");
  // the heading slot: each heading rolls in from below on its point, and up and away on the next
  const headAt = [p1, p2, p3];
  const roll = (i: number) => {
    const inn = ease(f, headAt[i], m.move);
    const out = i + 1 < headAt.length ? ease(f, headAt[i + 1], m.move) : ease(f, p4, m.move);
    return { y: (1 - inn) * HEAD.h - out * HEAD.h, o: inn * (1 - out) };
  };
  /** Big from point 1, back to its P0 size on point 3 (Simon, 22 Oct). */
  const grow = ease(f, p1, m.move) * (1 - ease(f, p3, m.move));
  // P4: to the centre, then 50% bigger from its top
  const toCentre = ease(f, p4, m.move);
  const grow4 = ease(f, p4 + m.move, m.move);
  const phoneDx = (BIG.cx - P0_PHONE_CX) * grow + (CX - P0_PHONE_CX) * toCentre;
  const phoneDy = (BIG.y - PHONE.y) * grow;
  const phoneScale = 1 + (BIG.s - 1) * (grow + grow4);
  // the PDF's scroll, and when each part is boxed
  const partAt = REPORT_PARTS.map((r) => W(r.at));
  const pdfTop = REPORT_PARTS.reduce((acc, r, i) => acc + (r.top - (i ? REPORT_PARTS[i - 1].top : 0)) * (i ? ease(f, partAt[i] - m.sec(0.15), m.sec(0.6)) : 0), 0);

  return (
    <Stage>
      <SoftGround f={g} />
      {/* the grid only for the closing with Orang Tuntun (Simon, 22 Oct) */}
      <BoardGrid g={g} on={ease(f, p5, m.reveal)} />

      {/* the phone, through P0–P4 */}
      <Appear at={slideAt} out={p5} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height, clipPath: OUTSIDE_RESERVES }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${P0_PHONE_CX}px ${PHONE.y}px`, transform: `translate(${phoneDx.toFixed(2)}px, ${phoneDy.toFixed(2)}px) scale(${phoneScale.toFixed(4)})` }}>
        <Phone cx={phoneCx}>
          <Shot file="T01-nostatus.png" at={p0} still />
          <Shot file="T02-nostatus.png" at={p1} />
          <Shot file="T04-nostatus.png" at={p2} />
          {/* P3, each screen on the words it shows (Simon, 22 Oct): Trading · Combine · Investing, then Newbie · Rising · Pro */}
          <Shot file="InvestingStrategy-nostatus.png" at={W("gaya investasimu")} />
          <Shot file="InvestingStrategy_1-nostatus.png" at={W("atau jangka panjang")} cut />
          <Shot file="InvestingStrategy_2-nostatus.png" at={W("jangka panjang")} cut />
          <Shot file="InvestingLevel-nostatus.png" at={W("tingkat pengalamanmu")} />
          <Shot file="InvestingLevel_1-nostatus.png" at={W("berkembang")} cut />
          <Shot file="InvestingLevel_2-nostatus.png" at={W("sudah berpengalaman")} cut />
          {/* the report: the Stable Architech PDF, whole, scrolling */}
          <ReportPdf at={p4} top={pdfTop} />
        </Phone>
        <HighlightBox rect={banner} grow={ease(f, linkAt + m.sec(0.25), m.reveal)} opacity={1 - ease(f, p1, m.fade)} width={4} radius={18} />
        {T04_MARKS.map((mk) => (
          <HighlightBox key={mk.at} rect={shotBox(mk.box, phoneCx, 1080, 115)} grow={ease(f, W(mk.at), m.reveal)} opacity={1 - ease(f, p3, m.fade)} width={3 / (1 + (BIG.s - 1) * grow)} radius={12} stroke={theme.color.cyanInk} fill={theme.color.cyanWash} />
        ))}
        {REPORT_PARTS.map((r, i) => (
          <HighlightBox key={r.at} rect={pdfBox(r.box, pdfTop, phoneCx, phoneScale)} grow={ease(f, partAt[i] + (i ? m.sec(0.5) : 0), m.reveal)} opacity={i + 1 < partAt.length ? 1 - ease(f, partAt[i + 1] - m.sec(0.2), m.fade) : 1} width={3 / phoneScale} radius={16} />
        ))}
        {T02_STATS.map((st, i) => (
          <HighlightBox key={i} rect={shotBox(st.box, phoneCx)} grow={ease(f, W(st.kind === "return" ? "return dan" : "drawdown,") + m.sec(0.1) * (i >> 1), m.reveal)} opacity={1 - ease(f, p2, m.fade)} width={3 / (1 + (BIG.s - 1) * grow)} radius={12} />
        ))}
        </div>
      </Appear>

      {/* P0 — the two questions, into the app */}
      <Appear at={p0} out={p1} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {(
          [
            { icon: "waves", title: "Ombak" },
            { icon: "wheel", title: "Kemudi" },
          ] as const
        ).map((q, i) => (
          <div key={q.title}>
            <Connector a={{ x: askX + ASK.w, y: ASK.ys[i] + ASK.h / 2 }} b={{ x: banner.x1 - 6, y: (banner.y1 + banner.y2) / 2 }} p={ease(f, linkAt + m.sec(0.15) * i, m.sec(0.6))} shape="curve" />
            <Appear at={p0 + m.sec(0.15) * i} style={{ left: 0, top: 0 }}>
              <Card x={askX} y={ASK.ys[i]} w={ASK.w} h={ASK.h} style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 26px" }}>
                <IsoIcon name={q.icon} h={60} />
                <div>
                  <div style={{ ...typeStyle("label"), fontSize: 24, color: c.slate }}>Pertanyaan {i + 1}</div>
                  <div style={{ ...typeStyle("body"), fontWeight: 600, color: c.ink }}>{q.title}</div>
                </div>
              </Card>
            </Appear>
          </div>
        ))}
      </Appear>
      {/* …then the feature's name, as it is said */}
      <Appear at={bannerAt - m.sec(0.1)} out={p1} style={{ left: P0_X, top: ASK.ys[1] + ASK.h + 70, width: P0_COL.w }}>
        <div style={{ ...typeStyle("title"), fontWeight: 600, lineHeight: 1.2, color: c.indigo }}>Tuntun Personal Investment Plan</div>
      </Appear>

      {/* P1–P3 — the heading slot, each heading scrolling up into the next */}
      <div style={{ position: "absolute", left: L.x, top: HEAD.y, width: BIG_LEFT - 30 - L.x, height: HEAD.h, overflow: "hidden" }}>
        {HEADINGS.map((h, i) => {
          const r = roll(i);
          if (r.o <= 0.001) return null;
          return (
            <div key={h.n} style={{ position: "absolute", left: 0, top: 0, height: HEAD.h, display: "flex", alignItems: "center", gap: 26, opacity: r.o, transform: `translateY(${r.y.toFixed(2)}px)` }}>
              <NumRing n={h.n} size={HEAD.ring} />
              <div style={{ fontFamily: theme.text.family, fontSize: HEAD.size, fontWeight: 600, letterSpacing: -1, color: c.indigo, whiteSpace: "nowrap" }}>{h.title}</div>
            </div>
          );
        })}
      </div>

      {/* P1 — return and drawdown */}
      <Appear at={W("return dan drawdown")} out={p2} style={{ left: TEXT_X, top: BODY_Y, width: BIG_LEFT - 40 - TEXT_X }}>
        <div style={{ ...typeStyle("body"), fontSize: 48, color: c.ink, lineHeight: 1.3 }}>Pilih berdasarkan return dan drawdown, sesuai yang bisa kamu terima</div>
      </Appear>

      {/* P2 — the simulation: three things, each hanging off the heading's line; then the choice */}
      <Appear at={p2} out={p3} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {SEE.map((it, i) => {
          const at = W(it.at);
          return (
            <div key={it.text}>
              <Connector a={{ x: L.x + HEAD.ring / 2, y: HEAD.y + HEAD.h / 2 + HEAD.ring / 2 }} b={{ x: SEE_X - 14, y: SEE_Y(i) }} p={ease(f, at - m.sec(0.3), m.sec(0.5))} shape="elbow" axis="y" mid={1} radius={22} dot={i === 0} />
              <div style={{ position: "absolute", left: SEE_X, top: SEE_Y(i) - 24, height: 48, display: "flex", alignItems: "center", ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap", opacity: ease(f, at, m.reveal) }}>{it.text}</div>
            </div>
          );
        })}
      </Appear>
      <Appear at={pickAt} out={p3} style={{ left: SEE_X, top: SEE_Y(2) + 90, width: L.w }}>
        <div style={{ ...typeStyle("body"), fontWeight: 600, color: c.indigo }}>Lalu putuskan</div>
        <div style={{ marginTop: 18, display: "flex", gap: 16 }}>
          <Pill text="Bisa diterima" p={ease(f, W("“Saya masih"), m.reveal)} solid />
          <Pill text="Coba yang lain" p={ease(f, W("“Coba yang lain"), m.reveal)} line />
        </div>
      </Appear>

      {/* P3 — style and experience: one line under the heading (as point 1's), the app's own screens say the rest */}
      <Appear at={W("memilih gaya")} out={p4} style={{ left: TEXT_X, top: BODY_Y, width: BIG_LEFT - 40 - TEXT_X }}>
        <div style={{ ...typeStyle("body"), fontSize: 48, color: c.ink, lineHeight: 1.3 }}>Pilih gaya investasimu dan tingkat pengalaman</div>
      </Appear>

      {/* P4 — the report: the PDF walks in the phone; its six parts as labels, three each side */}
      {REPORT_LABELS.map((r, i) => {
        const left = i < 3;
        const phoneHalf = (PHONE.w * BIG.s) / 2;
        const x = left ? CX - phoneHalf - RL.gap - RL.w : CX + phoneHalf + RL.gap;
        return (
          <Appear key={r.text} at={W(r.at)} out={p5} style={{ left: 0, top: 0 }}>
            <Card x={x} y={RL.ys[i % 3]} w={RL.w} h={RL.h} style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 26px" }}>
              <IconDot name={r.icon} size={26} neutral />
              <div style={{ ...typeStyle("body"), fontSize: 30, lineHeight: 1.25, color: c.ink }}>{r.text}</div>
            </Card>
          </Appear>
        );
      })}

      {/* P5 — the insight */}
      <OrangTuntun at={p5} />
      {/* two lines, both at the closing size (Simon, 22 Oct); the VO says them in full */}
      <Appear at={p5 + m.sec(0.2)} style={{ left: 0, top: 0 }}>
        <Line x={ORANG_TUNTUN_RIGHT + 90} y={320} w={theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 160} size={72} text="Tes ulang kalau kondisi hidup berubah" mark="Tes ulang" markInk={theme.color.selfAmberInk} />
      </Appear>
      <Appear at={W("Karena yang perlu")} style={{ left: 0, top: 0 }}>
        <Line x={ORANG_TUNTUN_RIGHT + 90} y={650} w={theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 160} size={72} text="Karena kita perlu kenali diri kita yang sekarang" mark="diri kita yang sekarang" markInk={theme.color.selfAmberInk} />
      </Appear>
    </Stage>
  );
};
