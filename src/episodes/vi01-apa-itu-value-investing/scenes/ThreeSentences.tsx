/**
 * VI01 · SC08 — "Tiga Kalimat untuk Diingat", rebuilt in IN07's look (Simon 11 Nov: "Skalian ubah scene selanjutnya ya,
 * scene 5-akhir") from the ChatGPT storyboard docs/vi-style/storyboards/VI01-SC08-v2.png: one big picture at a time, a
 * camera cut between them.
 *
 *  A  (Simon 11 Nov: "Scene 8 revamp visual jadi lebih ber-value") three cards, each sentence under a small picture of what it
 *     recalls: the cash book; price swinging round value; a stock code (BBCA) and the business behind it.
 *  B  "Timeline tadi berjalan sekali lagi": SC03's timeline, replayed, each investor's growth a year (SC03's figures) popping
 *     over their node as the line reaches it.
 *  C  "annual report dari halaman pertama sendirian": one summary line (Simon 11 Nov).
 *  D  "Di Tuntun … Deep Research Report": the real screens IN07 SC04 shows (the stock page's Research tab, the report's
 *     first page — Simon's, public/art/in07/app), the five things the team summarises on their words, then Gratis.
 *  E  "pintu ketiga tadi: memahami perusahaan": door 3 opens to the report; "Baca report-nya … tentukan sendiri … daftar":
 *     the list takes the company whose report was read — BBCA, Bank Central Asia — and you decide.
 *  F  "Di video selanjutnya" (a camera cut): the next video's head, and the four pillars with the first one lit.
 * The disclaimer is not on screen (Simon, 10 Nov).
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { NextVideoHead, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { BoardGrid, Card, Column, Glyph, LedgerCard, Mark, NumRing, Shot, Skel, ease, useWords } from "../components/kit";
import { AXIS, MASTER, Timeline, nodeX } from "../components/Timeline";

const CX = theme.canvas.width / 2;
const CY = 590;

const SENTENCES = [
  { text: "Saham = buku kas", at: "Saham adalah" },
  { text: "Harga ≠ value", at: "Harga adalah" },
  { text: "Lihat bisnis di balik saham", at: "investor yang bertahan" },
] as const;
/** A — three cards, each the sentence under a small picture of what it recalls (Simon 11 Nov: "Scene 8 revamp visual jadi lebih ber-value"). */
const CARD3 = { w: 520, h: 600, gap: 40, y: 250, art: { top: 110, h: 300 } };
const card3X = (i: number) => CX - (3 * CARD3.w + 2 * CARD3.gap) / 2 + i * (CARD3.w + CARD3.gap);
/** B — each investor's growth a year, as SC03's cards gave it (its sources there), over their node on the timeline. */
const RETURNS: Record<(typeof MASTER)[number], { pct: string; years: string }> = {
  "Walter Schloss": { pct: "15,3%", years: "45 th" },
  "Berkshire Hathaway": { pct: "19,7%", years: "61 th" },
  "Sequoia Fund": { pct: "13,5%", years: "55 th" },
  "Fairfax Financial": { pct: "18,7%", years: "40 th" },
  Nomad: { pct: "20,8%", years: "12 th" },
  Fundsmith: { pct: "13%", years: "16 th" },
};


/** The real screens (IN07 SC04): the stock page's Research tab, and the report's first page. */
const APP = { src: "art/in07/app/sc04-deep-research-app.jpg", w: 980, h: 1560 };
const REPORT = { src: "art/in07/app/sc04-deep-research-report.jpg", w: 1080, h: 1461 };
const SHOT_H = 620;
const APP_W = (APP.w * SHOT_H) / APP.h;
const REP_W = 500;
const POINTS = [
  { text: "Bisnis perusahaan", at: "bisnis perusahaan" },
  { text: "Company Quality", at: "Company Quality" },
  { text: "Competitive advantage", at: "competitive advantage" },
  { text: "Risiko", at: "risiko" },
  { text: "Reference Fair Value", at: "Reference Fair Value" },
] as const;

const DOOR = { x: 495, y: 330, w: 270, h: 420 };
/** The report beside door 3 before it steps in (Simon 11 Nov: "gedein sizenya"), centred on the door, close beside it ("jaraknya deketin"); door + report centred on the canvas. */
const REP3 = { x: DOOR.x + DOOR.w + 160, w: 500, h: (500 * REPORT.h) / REPORT.w, inW: 200 };
// the list card widened for its full title (Simon 11 Nov: "Daftar perusahaan yang ingin dipahami"); the report beside it moves left with it
const LIST = { x: 680, y: 290, w: 900, rowH: 92, rows: [260, 320, 220] };
const READ = { x: 160, y: 300, w: 400 };

// F — the four columns of SC02 (Simon 10 Nov: his "Pillar Infographic" reference) small and grey, the first one turning indigo
const MINI = { w: 240, gap: 50, col: 126, top: 470, h: 290, disc: 50 };

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const shadow = useShadow();
  const W = useWords(8, BLOCK.SC08);
  const g = f + BLOCK.SC08;
  const B = BLOCK.SC08;
  const cut = (phrase: string) => W(phrase) - m.sec(0.15);
  const END = BLOCK.END - BLOCK.SC08;

  const TL = cut("Timeline tadi");
  const UM = cut("Untuk mulai");
  const DT = cut("Di Tuntun");
  const RI = cut("Report ini");
  const BR = cut("Baca report-nya");
  const NX = cut("Di video selanjutnya");

  const grow = ease(f, TL, W("1934 sampai 2026", 0, "f1") - TL);
  const free = ease(f, W("gratis"), m.pop);
  const open = ease(f, W("pintu ketiga"), m.sec(0.9));
  const into = ease(f, W("memahami perusahaan"), m.move);
  const readP = ease(f, W("Baca report-nya"), m.pop);
  const added = ease(f, W("daftar perusahaan"), m.move);
  const youP = ease(f, W("tentukan sendiri"), m.pop);
  const first = ease(f, W("pilar pertama"), m.pop);

  return (
    <>
      <BoardGrid g={g} on={1} />

      {/* A — three sentences, each with what it recalls */}
      <Shot from={0} to={TL} block={B} cutIn={false}>
        {SENTENCES.map((sn, i) => {
          const p = ease(f, W(sn.at) - m.sec(0.1), m.reveal);
          if (p <= 0.001) return null;
          const key = i === 2;
          return (
            <Card key={sn.text} x={card3X(i)} y={CARD3.y + (1 - p) * 18} w={CARD3.w} h={CARD3.h} line={key ? c.indigo : undefined} style={{ opacity: p }}>
              <div style={{ position: "absolute", left: 30, top: 30 }}>
                <NumRing n={i + 1} size={56} />
              </div>
              <div style={{ position: "absolute", left: 40, right: 40, top: CARD3.art.top, height: CARD3.art.h }}>
                {i === 0 ? (
                  // the cash book, small
                  <div style={{ position: "absolute", left: (CARD3.w - 80 - 300) / 2, top: 0, width: 300, height: 290, borderRadius: 22, boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}`, overflow: "hidden" }}>
                    <LedgerCard title="Buku kas" s={0.5} />
                  </div>
                ) : i === 1 ? (
                  // price swinging round a calm value line
                  <svg width={CARD3.w - 80} height={CARD3.art.h} style={{ position: "absolute", left: 0, top: 0 }}>
                    <line x1={10} y1={170} x2={CARD3.w - 180} y2={130} stroke={theme.color.neutralDotOn} strokeWidth={3} strokeDasharray="10 10" />
                    <polyline points={Array.from({ length: 60 }, (_, k) => { const t = k / 59; const x = 10 + t * (CARD3.w - 190); const y = 170 - 40 * t - 70 * Math.sin(t * 9.5) - 25 * Math.sin(t * 23); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ")} fill="none" stroke={c.indigo} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
                    <text x={CARD3.w - 172} y={110} fontFamily={theme.text.family} fontSize={24} fontWeight={600} fill={c.indigo}>Harga</text>
                    <text x={CARD3.w - 172} y={150} fontFamily={theme.text.family} fontSize={24} fontWeight={600} fill={c.slate}>Value</text>
                  </svg>
                ) : (
                  // a stock code, and the business behind it
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
                    <div style={{ height: 70, padding: "0 26px", borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", ...typeStyle("title"), fontSize: 34, fontWeight: 600, color: c.slate }}>BBCA</div>
                    <span style={{ fontFamily: theme.text.family, fontSize: 40, color: c.indigo }}>→</span>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 130, height: 130, borderRadius: 36, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Glyph icon="bank" size={76} tone={c.indigo} />
                      </div>
                      <div style={{ ...typeStyle("label"), fontSize: 24, fontWeight: 600, color: c.indigo }}>Bisnisnya</div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ position: "absolute", left: 30, right: 30, bottom: 50, textAlign: "center", ...typeStyle("title"), fontSize: 40, fontWeight: 600, lineHeight: 1.2, color: key ? c.indigo : c.ink }}>{sn.text}</div>
            </Card>
          );
        })}
      </Shot>

      {/* B — the timeline once more */}
      <Shot from={TL} to={UM} block={B}>
        <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: 330, textAlign: "center", ...typeStyle("title"), fontSize: 44, fontWeight: 600, color: c.ink, opacity: ease(f, TL, m.reveal) }}>Pertumbuhan per tahun</div>
        <Timeline grow={grow} />
        {/* each investor's growth a year over their node, as the line reaches it */}
        {MASTER.map((name, i) => {
          const at = (nodeX(i) - AXIS.x0) / (AXIS.x1 - AXIS.x0);
          const p = grow >= at ? ease(f, TL + at * (W("1934 sampai 2026", 0, "f1") - TL), m.pop) : 0;
          return p > 0.001 ? (
            <div key={name} style={{ position: "absolute", left: nodeX(i), top: AXIS.y - 150, transform: `translateX(-50%) scale(${(0.85 + 0.15 * p).toFixed(3)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: p }}>
              <div style={{ height: 66, padding: "0 22px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${c.indigo}`, display: "flex", alignItems: "center", ...typeStyle("title"), fontSize: 34, fontWeight: 600, color: c.indigo, fontVariantNumeric: "tabular-nums" }}>{RETURNS[name].pct}</div>
              <div style={{ ...typeStyle("label"), fontSize: 22, fontWeight: 500, color: c.slate }}>{RETURNS[name].years}</div>
            </div>
          ) : null;
        })}
      </Shot>

      {/* C — "Untuk mulai memahami sebuah perusahaan, kamu juga nggak harus membaca annual report dari halaman pertama sendirian":
          one summary line (Simon 11 Nov: "visual yang sekarang ganti jadi text ringkasan aja"), in two steps on the VO */}
      <Shot from={UM} to={DT} block={B}>
        <div style={{ position: "absolute", left: 0, width: theme.canvas.width, top: CY - 50, transform: "translateY(-50%)", textAlign: "center", fontFamily: theme.text.family, fontSize: 72, fontWeight: 500, letterSpacing: -1, color: c.ink, whiteSpace: "pre" }}>
          <span style={{ opacity: ease(f, UM + m.sec(0.2), m.reveal) }}>Nggak harus baca annual report </span>
          <span style={{ color: c.indigo, opacity: ease(f, W("sendirian") - m.sec(0.1), m.reveal) }}>sendirian</span>
        </div>
      </Shot>

      {/* D — Deep Research Report: the real screens, what it summarises, free */}
      <Shot from={DT} to={RI} block={B}>
        <div style={{ position: "absolute", left: 140, top: 162, display: "flex", alignItems: "center", gap: 20, opacity: ease(f, W("Deep Research") - m.sec(0.1), m.reveal) }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Glyph icon="file-text" size={32} tone={c.indigo} />
          </div>
          <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>Deep Research Report</div>
        </div>
        <div style={{ position: "absolute", left: 160, top: 280, width: APP_W, height: SHOT_H, borderRadius: theme.shape.cardRadius, overflow: "hidden", boxShadow: shadow.soft, background: c.cardBg, opacity: ease(f, W("Di Tuntun"), m.reveal) }}>
          <Img src={staticFile(APP.src)} style={{ width: APP_W, height: SHOT_H, display: "block" }} />
        </div>
        <div style={{ position: "absolute", left: 160 + APP_W + 40, top: 280, width: REP_W, height: SHOT_H, borderRadius: theme.shape.cardRadius, overflow: "hidden", boxShadow: shadow.soft, background: c.cardBg, opacity: ease(f, W("Deep Research") + m.sec(0.2), m.reveal) }}>
          <Img src={staticFile(REPORT.src)} style={{ width: REP_W, height: (REP_W * REPORT.h) / REPORT.w, display: "block" }} />
        </div>
        {POINTS.map((pt, i) => {
          const p = ease(f, W(pt.at) - m.sec(0.1), m.pop);
          if (p <= 0.001) return null;
          return (
            <div key={pt.text} style={{ position: "absolute", left: 160 + APP_W + 40 + REP_W + 70, top: 290 + i * 100, height: 76, padding: "0 30px", borderRadius: 999, background: c.cardBg, boxShadow: shadow.soft, display: "flex", alignItems: "center", gap: 16, ...typeStyle("title"), fontSize: 36, fontWeight: 500, color: c.ink, whiteSpace: "nowrap", opacity: p, transform: `translateX(${((1 - p) * 20).toFixed(1)}px)` }}>
              <span style={{ color: c.indigo, fontWeight: 700 }}>✓</span>
              {pt.text}
            </div>
          );
        })}
        {free > 0.001 ? (
          <div style={{ position: "absolute", left: 160 + APP_W + 40 + REP_W + 70, top: 290 + 5 * 100 + 10, height: 80, padding: "0 40px", borderRadius: 999, background: c.indigo, display: "flex", alignItems: "center", ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: c.cardBg, opacity: free, transform: `scale(${(0.85 + 0.15 * free).toFixed(3)})`, transformOrigin: "left center" }}>Gratis</div>
        ) : null}
      </Shot>

      {/* E — door 3 opens on the report; then the list, and you decide */}
      <Shot from={RI} to={BR} block={B}>
        <div style={{ position: "absolute", left: DOOR.x + DOOR.w / 2 - 45, top: DOOR.y - 120 }}>
          <NumRing n={3} size={90} />
        </div>
        <div style={{ position: "absolute", left: DOOR.x, top: DOOR.y, width: DOOR.w, height: DOOR.h, borderRadius: 28, background: theme.color.indigoWashSolid, boxShadow: `inset 0 0 0 3px ${theme.color.hairlineBrandSolid}` }} />
        {/* the report steps into the doorway */}
        <div style={{ position: "absolute", left: REP3.x + (DOOR.x + 35 - REP3.x) * into, top: DOOR.y + DOOR.h / 2 - REP3.h / 2 + (REP3.h / 2 - DOOR.h / 2 + 40) * into, width: REP3.w - (REP3.w - REP3.inW) * into, height: ((REP3.w - (REP3.w - REP3.inW) * into) * REPORT.h) / REPORT.w, borderRadius: 22, overflow: "hidden", boxShadow: shadow.soft, background: c.cardBg, opacity: ease(f, W("Report ini"), m.reveal) }}>
          <Img src={staticFile(REPORT.src)} style={{ width: "100%", display: "block" }} />
        </div>
        <div style={{ position: "absolute", left: DOOR.x, top: DOOR.y, width: DOOR.w, height: DOOR.h, borderRadius: 28, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 3px ${theme.color.skeleton}`, transformOrigin: "left center", transform: `perspective(1000px) rotateY(${(-72 * open).toFixed(2)}deg)` }}>
          <div style={{ position: "absolute", left: 30, right: 30, top: 32, height: 160, borderRadius: 16, boxShadow: `inset 0 0 0 3px ${theme.color.skeleton}` }} />
          <div style={{ position: "absolute", left: 30, right: 30, top: 222, height: 160, borderRadius: 16, boxShadow: `inset 0 0 0 3px ${theme.color.skeleton}` }} />
          <div style={{ position: "absolute", right: 32, top: DOOR.h / 2 - 11, width: 22, height: 22, borderRadius: 999, background: theme.color.neutralDotOn }} />
        </div>
        <div style={{ position: "absolute", left: DOOR.x - 250, width: DOOR.w + 500, top: DOOR.y + DOOR.h + 34, textAlign: "center", whiteSpace: "nowrap", ...typeStyle("title"), fontSize: 48, fontWeight: 600, color: c.indigo, opacity: ease(f, W("memahami perusahaan"), m.reveal) }}>Memahami perusahaan</div>
      </Shot>
      <Shot from={BR} to={NX} block={B}>
        <div style={{ position: "absolute", left: READ.x, top: READ.y, width: READ.w, height: (READ.w * REPORT.h) / REPORT.w, maxHeight: 560, borderRadius: 24, overflow: "hidden", boxShadow: shadow.soft, background: c.cardBg, opacity: ease(f, BR, m.reveal) }}>
          <Img src={staticFile(REPORT.src)} style={{ width: "100%", display: "block" }} />
        </div>
        <Mark kind="check" p={readP} x={READ.x + READ.w} y={READ.y} size={84} />
        <Card x={LIST.x} y={LIST.y} w={LIST.w} h={170 + (LIST.rows.length + 1) * LIST.rowH} style={{ opacity: ease(f, W("Lalu tentukan"), m.reveal) }}>
          <div style={{ position: "absolute", left: 44, top: 40, display: "flex", alignItems: "center", gap: 16, ...typeStyle("title"), fontSize: 40, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>
            <Glyph icon="list-checks" size={50} tone={c.indigo} />
            Daftar perusahaan yang ingin dipahami
          </div>
          {LIST.rows.map((wd, r) => (
            <div key={r} style={{ position: "absolute", left: 44, right: 44, top: 140 + r * LIST.rowH, height: 70, borderRadius: 18, boxShadow: `inset 0 0 0 2px ${theme.color.skeleton}` }}>
              <Skel w={wd} h={14} style={{ left: 28, top: 28 }} />
            </div>
          ))}
          {added > 0.001 ? (
            <div style={{ position: "absolute", left: 44, right: 44, top: 140 + LIST.rows.length * LIST.rowH + (1 - added) * 30, height: 70, borderRadius: 18, background: theme.color.indigoWashSolid, boxShadow: `inset 0 0 0 3px ${c.indigo}`, opacity: added }}>
              {/* the company whose report was just read (the Deep Research shown is BBCA's) */}
              <div style={{ position: "absolute", left: 24, top: 0, height: 70, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ padding: "2px 12px", borderRadius: 999, background: c.indigo, ...typeStyle("label"), fontSize: 22, fontWeight: 600, color: c.cardBg }}>BBCA</div>
                <div style={{ ...typeStyle("label"), fontSize: 26, fontWeight: 600, color: c.ink }}>Bank Central Asia</div>
              </div>
              <div style={{ position: "absolute", right: 24, top: 15, fontFamily: theme.text.family, fontSize: 34, fontWeight: 700, color: c.indigo }}>✓</div>
            </div>
          ) : null}
        </Card>
        {youP > 0.001 ? (
          <div style={{ position: "absolute", left: LIST.x + LIST.w + 50, top: LIST.y + 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: youP, transform: `scale(${(0.8 + 0.2 * youP).toFixed(3)})` }}>
            <div style={{ width: 120, height: 120, borderRadius: 999, background: theme.color.selfAmber, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph icon="user-circle" size={78} tone={c.cardBg} />
            </div>
            <div style={{ ...typeStyle("title"), fontSize: 36, fontWeight: 600, color: theme.color.selfAmberInk }}>Kamu</div>
          </div>
        ) : null}
      </Shot>

      {/* F — the next video */}
      <Shot from={NX} to={END} block={B} cutOut={false}>
        <NextVideoHead title="Membeli Saham Berarti Membeli Perusahaan" chipAt={NX} titleAt={NX + m.sec(0.3)} light titleTone={c.indigo} />
        {[0, 1, 2, 3].map((i) => {
          const p = ease(f, NX + m.sec(0.8) + i * 6, m.reveal);
          if (p <= 0.001) return null;
          const on = i === 0 ? first : 0;
          const x = CX - (4 * MINI.w + 3 * MINI.gap) / 2 + i * (MINI.w + MINI.gap);
          return (
            <div key={i}>
              <div style={{ position: "absolute", left: x + (MINI.w - MINI.col) / 2, top: MINI.top, width: MINI.col, height: MINI.h, clipPath: `inset(${((1 - p) * 100).toFixed(2)}% -20px 0 -20px)` }}>
                <Column w={MINI.col} h={MINI.h} tone={c.muted} />
                {on > 0.001 ? <div style={{ position: "absolute", inset: 0, opacity: on }}><Column w={MINI.col} h={MINI.h} tone={c.indigo} /></div> : null}
              </div>
              <div style={{ position: "absolute", left: x - MINI.gap / 2 + 5, width: MINI.w + MINI.gap - 10, top: MINI.top + MINI.h + 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: p }}>
                <div style={{ width: MINI.disc, height: MINI.disc, borderRadius: 999, background: on > 0.5 ? c.indigo : c.cardBg, boxShadow: `inset 0 0 0 3px ${on > 0.5 ? c.indigo : theme.color.hairlineBrandSolid}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("label"), fontSize: 26, fontWeight: 600, color: on > 0.5 ? c.cardBg : c.slate }}>{i + 1}</div>
                {i === 0 ? <div style={{ textAlign: "center", opacity: first, ...typeStyle("label"), fontSize: 26, fontWeight: 600, lineHeight: 1.25, color: c.indigo }}>Membeli saham = membeli perusahaan</div> : null}
              </div>
            </div>
          );
        })}
      </Shot>
    </>
  );
};
