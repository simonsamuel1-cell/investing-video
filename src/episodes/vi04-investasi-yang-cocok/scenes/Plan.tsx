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
import { Appear, Card, IconDot, IsoIcon, Line, NumRing, ORANG_TUNTUN_RIGHT, OrangTuntun, ease, useWords } from "../components/kit";

/** The screenshots are 1125×2436 and 1080×2340: the screen takes their shape so nothing is cropped. */
const SHOT = { w: 1125, h: 2436 };
const BEZEL = 14;
const SCREEN = { h: 832, w: Math.round((832 * SHOT.w) / SHOT.h), r: 50 };
const PHONE = { cx: 495, y: 100, w: SCREEN.w + 2 * BEZEL, h: SCREEN.h + 2 * BEZEL, r: SCREEN.r + BEZEL };
const PHONE_RIGHT = PHONE.cx + PHONE.w / 2;
/**
 * A highlight over rows `y1`–`y2` of a screenshot (its own pixels, measured on the PNG). Simon's rule for a box
 * over a phone: 20px wider than the phone on each side; only its height is scoped to what it marks.
 */
const HL_PAD = { side: 20, rows: 10 };
const hlRows = (y1: number, y2: number): HLRect => {
  const k = SCREEN.h / SHOT.h;
  const top = PHONE.y + BEZEL;
  return { x1: PHONE.cx - PHONE.w / 2 - HL_PAD.side, x2: PHONE_RIGHT + HL_PAD.side, y1: top + y1 * k - HL_PAD.rows, y2: top + y2 * k + HL_PAD.rows };
};
/** T01: the "FREE! Personal Investment Plan" banner. T02: the middle curve (+8%~12%, 5%~15%). */
const HL = { banner: hlRows(504, 701), middle: hlRows(1118, 1658) };

// the column at the right
const COL = { x: 880, w: 900 };
const CAP_Y = 250;

// P0 — the two questions
const ASK = { x: COL.x, w: 360, h: 100, ys: [250, 390] };
// P4 — what the report holds
const REPORT = { x: 920, w: 840, h: 64, y0: 450, step: 80 };
const REPORT_ITEMS = [
  { icon: "t-profile-w", text: "Profil investasimu", at: "profil investasimu" },
  { icon: "t-fit-w", text: "Investasi yang paling sesuai", at: "investasi yang paling sesuai" },
  { icon: "t-levelup-w", text: "Pilihan untuk naik level", at: "pilihan untuk naik level" },
  { icon: "t-guide-w", text: "Panduan dari Tuntun", at: "panduan dari Tuntun" },
  { icon: "t-sim-w", text: "Simulasi investasi satu tahun", at: "simulasi investasi satu tahun" },
  { icon: "t-notyet-w", text: "Produk yang untuk sekarang mungkin belum cocok", at: "sampai produk" },
];

/** The phone frame — the same light frame as SC06's (components/PhoneScreens); the screenshots sit in its screen. */
const Phone = ({ children }: { children: React.ReactNode }) => {
  const c = usePalette();
  const shadow = useShadow();
  return (
    <div style={{ position: "absolute", left: PHONE.cx - PHONE.w / 2, top: PHONE.y, width: PHONE.w, height: PHONE.h, borderRadius: PHONE.r, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrand}` }}>
      <div style={{ position: "absolute", left: BEZEL, top: BEZEL, width: SCREEN.w, height: SCREEN.h, borderRadius: SCREEN.r, overflow: "hidden", background: theme.color.neutralDisc }}>{children}</div>
      <div style={{ position: "absolute", left: PHONE.w / 2 - 50, top: BEZEL + 8, width: 100, height: 24, borderRadius: 999, background: theme.color.neutralDisc }} />
    </div>
  );
};

/** One screenshot filling the screen, fading up over the one before it on `at`. */
const Shot = ({ file, at, still = false }: { file: string; at: number; still?: boolean }) => {
  const f = useCurrentFrame();
  const m = useMotion();
  const p = still ? 1 : ease(f, at, m.reveal);
  if (p <= 0.001) return null;
  return (
    <Img
      src={staticFile(`art/vi04/app/${file}`)}
      style={{ position: "absolute", left: 0, top: 0, width: SCREEN.w, height: SCREEN.h, maxWidth: "none", objectFit: "cover", opacity: p, transform: `translateY(${((1 - p) * 16).toFixed(2)}px)` }}
    />
  );
};

/** A step at the right: its number (if any) and a small lead line, then the step itself in normal weight. */
const Caption = ({ n, lead, text, at, out, textAt, top = CAP_Y }: { n?: number; lead: string; text: React.ReactNode; at: number; out: number; textAt?: number; top?: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  return (
    <Appear at={at} out={out} style={{ left: COL.x, top, width: COL.w }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {n ? <NumRing n={n} size={46} /> : null}
        <div style={{ ...typeStyle("label"), color: c.slate, lineHeight: 1.3 }}>{lead}</div>
      </div>
      <div style={{ marginTop: 16, ...typeStyle("title"), fontWeight: 500, lineHeight: 1.25, color: c.ink, opacity: textAt === undefined ? 1 : ease(f, textAt, m.reveal) }}>{text}</div>
    </Appear>
  );
};

/** A small pill: on a word, with a brand hairline (`line`) or on the grey disc colour. */
const Pill = ({ text, p, line = false }: { text: string; p: number; line?: boolean }) => {
  const c = usePalette();
  return (
    <div style={{ padding: "10px 24px", borderRadius: 999, background: line ? c.cardBg : theme.color.neutralDisc, boxShadow: line ? `inset 0 0 0 2px ${theme.color.connector}` : undefined, ...typeStyle("label"), color: c.ink, whiteSpace: "nowrap", opacity: p, transform: `translateY(${((1 - p) * 8).toFixed(2)}px)` }}>{text}</div>
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
  const middleAt = W("pilih yang benar-benar");
  const seeAt = W("Kamu bisa melihat");
  const pickAt = W("Dari situ");

  return (
    <Stage>
      <SoftGround f={g} />

      {/* the phone, through P0–P4 */}
      <Appear at={p0} out={p5} rise={30} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Phone>
          <Shot file="T01.PNG" at={p0} still />
          <Shot file="T02.PNG" at={p1} />
          <Shot file="T04.jpg" at={p2} />
          <Shot file="T03.jpg" at={p4} />
        </Phone>
        <HighlightBox rect={HL.banner} grow={ease(f, bannerAt, m.reveal)} opacity={1 - ease(f, p1, m.fade)} width={4} radius={18} />
        <HighlightBox rect={HL.middle} grow={ease(f, middleAt, m.reveal)} opacity={1 - ease(f, p2, m.fade)} width={4} radius={18} />
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
            <Connector a={{ x: ASK.x, y: ASK.ys[i] + ASK.h / 2 }} b={{ x: HL.banner.x2 + 6, y: (HL.banner.y1 + HL.banner.y2) / 2 }} p={ease(f, bannerAt - m.sec(0.3) + m.sec(0.15) * i, m.sec(0.6))} shape="curve" />
            <Appear at={p0 + m.sec(0.15) * i} style={{ left: 0, top: 0 }}>
              <Card x={ASK.x} y={ASK.ys[i]} w={ASK.w} h={ASK.h} style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 26px" }}>
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
      <Caption top={590} at={p0 + m.sec(0.3)} out={p1} lead="Dua pertanyaan tadi akan dibantu lebih dalam lewat fitur" text={<span style={{ color: c.indigo }}>Tuntun Personal Investment Plan.</span>} textAt={bannerAt} />

      {/* P1 — return and drawdown */}
      <Caption n={1} at={p1} out={p2} lead="Pertama, kamu akan melihat beberapa pilihan return dan drawdown," text="lalu pilih yang benar-benar masih bisa kamu terima." textAt={W("lalu pilih")} />

      {/* P2 — the simulation */}
      <Caption n={2} at={p2} out={p3} lead="Setelah itu, kamu akan mencoba simulasi investasi" text="dari produk nyata, berdasarkan data historisnya." textAt={W("dari produk nyata")} />
      <Appear at={seeAt} out={p3} style={{ left: COL.x, top: 500, width: COL.w }}>
        <div style={{ ...typeStyle("label"), color: c.slate }}>Kamu bisa melihat</div>
        {(
          [
            { text: "Kapan investasi dimulai", at: "kapan investasi dimulai" },
            { text: "Seberapa dalam sempat turun", at: "seberapa dalam sempat turun" },
            { text: "Bagaimana hasil akhirnya", at: "bagaimana hasil akhirnya" },
          ] as const
        ).map((it) => (
          <div key={it.text} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 18, opacity: ease(f, W(it.at), m.reveal) }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, boxShadow: `inset 0 0 0 2px ${theme.color.connector}` }} />
            <div style={{ ...typeStyle("body"), color: c.ink }}>{it.text}</div>
          </div>
        ))}
      </Appear>
      <Appear at={pickAt} out={p3} style={{ left: COL.x, top: 760, width: COL.w }}>
        <div style={{ ...typeStyle("label"), color: c.slate }}>Dari situ, kamu tinggal pilih:</div>
        <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
          <Pill text="“Saya masih bisa menerima ini.”" p={ease(f, W("“Saya masih"), m.reveal)} line />
          <Pill text="“Coba yang lain.”" p={ease(f, W("“Coba yang lain"), m.reveal)} />
        </div>
      </Appear>

      {/* P3 — style and experience */}
      <Caption n={3} at={p3} out={p4} lead="Berikutnya, kamu akan memilih" text="gaya investasimu dan tingkat pengalamanmu." textAt={W("gaya investasimu")} />
      {(
        [
          { lead: "Gaya investasi", at: "gaya investasimu", y: 520, chips: [{ text: "Jangka pendek", at: "jangka pendek" }, { text: "Jangka panjang", at: "jangka panjang" }] },
          { lead: "Tingkat pengalaman", at: "tingkat pengalamanmu", y: 680, chips: [{ text: "Pemula", at: "pemula" }, { text: "Berkembang", at: "berkembang" }, { text: "Sudah berpengalaman", at: "sudah berpengalaman" }] },
        ] as const
      ).map((r) => (
        <Appear key={r.lead} at={W(r.at)} out={p4} style={{ left: COL.x, top: r.y, width: COL.w }}>
          <div style={{ ...typeStyle("label"), color: c.slate }}>{r.lead}</div>
          <div style={{ marginTop: 16, display: "flex", gap: 14 }}>
            {r.chips.map((ch) => (
              <Pill key={ch.text} text={ch.text} p={ease(f, W(ch.at), m.reveal)} line />
            ))}
          </div>
        </Appear>
      ))}

      {/* P4 — the report: six connectors from the phone */}
      <Caption at={p4} out={p5} lead="Dari semua jawaban tadi," text={<>laporan investasi yang <span style={{ color: theme.color.selfAmberInk }}>personal untukmu:</span></>} textAt={W("laporan investasi")} />
      <Appear at={p4} out={p5} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {REPORT_ITEMS.map((it, i) => {
          const at = W(it.at);
          const y = REPORT.y0 + i * REPORT.step;
          return (
            <div key={it.text}>
              <Connector a={{ x: PHONE_RIGHT + 4, y: PHONE.y + PHONE.h / 2 + 40 }} b={{ x: REPORT.x, y: y + REPORT.h / 2 }} p={ease(f, at - m.sec(0.3), m.sec(0.5))} shape="curve" dot={i === 0} />
              <Appear at={at} style={{ left: 0, top: 0 }}>
                <Card x={REPORT.x} y={y} w={REPORT.w} h={REPORT.h} style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 20px" }}>
                  <IconDot name={it.icon} size={26} neutral />
                  <div style={{ ...typeStyle("body"), fontSize: 30, color: c.ink, whiteSpace: "nowrap" }}>{it.text}</div>
                </Card>
              </Appear>
            </div>
          );
        })}
      </Appear>

      {/* P5 — the insight */}
      <OrangTuntun at={p5} />
      <Appear at={p5 + m.sec(0.2)} style={{ left: ORANG_TUNTUN_RIGHT + 90, top: 250, display: "flex", alignItems: "center", gap: 22 }}>
        <IconDot name="t-retest-w" size={36} neutral />
        <div style={{ ...typeStyle("body"), color: c.ink, whiteSpace: "nowrap" }}>
          Kalau kondisi hidupmu berubah, <span style={{ color: theme.color.selfAmberInk, opacity: ease(f, W("tinggal tes ulang"), m.reveal) }}>tinggal tes ulang.</span>
        </div>
      </Appear>
      <Appear at={W("Karena yang perlu")} style={{ left: ORANG_TUNTUN_RIGHT + 90, top: 420, width: theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 160 }}>
        <div style={{ ...typeStyle("body"), color: c.slate, lineHeight: 1.3 }}>Karena yang perlu kita kenali bukan versi diri kita lima tahun lalu,</div>
      </Appear>
      <Appear at={W("tapi:")} style={{ left: 0, top: 0 }}>
        <Line x={ORANG_TUNTUN_RIGHT + 90} y={620} w={theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 160} size={72} text="tapi: diri kita yang sekarang." mark="diri kita yang sekarang." markInk={theme.color.selfAmberInk} />
      </Appear>
    </Stage>
  );
};
