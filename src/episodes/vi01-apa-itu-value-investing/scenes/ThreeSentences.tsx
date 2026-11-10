/**
 * VI01 · SC08 — "Tiga Kalimat untuk Diingat", from Simon's VISUAL notes and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI01-SC08.jpg.
 *
 *  A  the three sentences, cut short on three cards. B  "Timeline tadi berjalan sekali lagi": SC03's timeline, replayed.
 *  C  "annual report dari halaman pertama sendirian": a thick report; then Tuntun's Deep Research Report — Simon's real BBCA
 *     page (public/art/vi02/app/sc08-deep-research.jpg, as in VI02 SC08) — and his five points lighting on their words,
 *     then Gratis.
 *  D  "pintu ketiga tadi: memahami perusahaan": door 3; "tentukan sendiri … daftar": a watchlist taking one more company.
 *  E  "Di video selanjutnya" (a camera cut): the next video's head, and the four pillars with the first one lit.
 * The disclaimer is not on screen (Simon, 10 Nov).
 */
import { Img, staticFile, useCurrentFrame } from "remotion";
import { NextVideoHead, cutInStyle, cutOutStyle, theme, typeStyle, useMotion, usePalette, useShadow, type Cut } from "../../../core";
import { BLOCK, CUT } from "../data/timing";
import { Card, Column, Glyph, ease, useWords } from "../components/kit";
import { Timeline } from "../components/Timeline";

const CX = theme.canvas.width / 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const SENTENCES = [
  { icon: "book-open", text: "Saham = buku kas", at: "Saham adalah" },
  { icon: "tag", text: "Harga ≠ value", at: "Harga adalah" },
  { icon: "magnifying-glass", text: "Lihat bisnis di balik saham", at: "investor yang bertahan" },
] as const;
const SENT = { w: 1100, h: 140, y0: 250, gap: 40 };
const PHONE = { x: 300, y: 170, w: 430, h: 700, r: 56 };
const RIGHT = { x: 860, head: 230, y0: 330, gap: 100 };
const POINTS = [
  { icon: "storefront", text: "Business", at: "bisnis perusahaan" },
  { icon: "check-circle", text: "Quality", at: "Company Quality" },
  { icon: "trend-up", text: "Advantage", at: "competitive advantage" },
  { icon: "lightning", text: "Risk", at: "risiko" },
  { icon: "scales", text: "Fair Value", at: "Reference Fair Value" },
] as const;
const LIST = { x: 860, y: 470, w: 860, h: 340 };
// the four columns of SC02 (Simon 10 Nov: his "Pillar Infographic" reference) small and grey, the first one turning indigo
const MINI = { w: 240, gap: 50, col: 126, top: 470, h: 290, disc: 50 };

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(8, BLOCK.SC08);

  const next: Cut = { at: W("Di video selanjutnya"), axis: "x", ...CUT };
  // the cut's outgoing half ends ON the cut and the incoming half starts there: never both at once
  const main = f < next.at;

  const sentOut = ease(f, W("Timeline tadi") - m.fade, m.fade);
  const grow = ease(f, W("Timeline tadi"), W("1934 sampai 2026", 0, "f1") - W("Timeline tadi"));
  const tlOut = ease(f, W("Untuk mulai") - m.fade, m.fade);
  const report = ease(f, W("Untuk mulai"), m.reveal) * (1 - ease(f, W("Di Tuntun"), m.move));
  const phone = ease(f, W("Di Tuntun"), m.move);
  const head = ease(f, W("Deep Research"), m.reveal);
  const free = ease(f, W("gratis"), m.pop);
  const pointsOut = ease(f, W("Report ini") - m.fade, m.fade);
  const door = ease(f, W("Report ini"), m.reveal);
  const read = ease(f, W("Baca report-nya"), m.pop);
  const list = ease(f, W("Lalu tentukan"), m.reveal);
  const added = ease(f, W("daftar"), m.move);
  const pillars = ease(f, next.at + m.sec(0.8), m.reveal);
  const first = ease(f, W("pilar pertama"), m.pop);

  return (
    <>
      {main ? (
        <div style={{ position: "absolute", inset: 0, ...(f >= next.at - next.over / 2 ? cutOutStyle(f, next) : {}) }}>
          {/* A */}
          {SENTENCES.map((s, i) => {
            const p = ease(f, W(s.at), m.reveal) * (1 - sentOut);
            return p > 0.001 ? (
              <div key={s.text} style={{ position: "absolute", left: CX - SENT.w / 2, top: SENT.y0 + i * (SENT.h + SENT.gap), width: SENT.w, height: SENT.h, opacity: p, transform: `translateY(${((1 - p) * 18).toFixed(1)}px)` }}>
                <Card x={0} y={0} w={SENT.w} h={SENT.h}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 34, padding: "0 44px" }}>
                    <div style={{ width: 60, height: 60, borderRadius: 999, boxShadow: `inset 0 0 0 3px ${c.indigo}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.indigo, flex: "none" }}>{i + 1}</div>
                    <div style={{ width: 84, height: 84, borderRadius: 999, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                      <Glyph icon={s.icon} size={46} tone={c.indigo} />
                    </div>
                    <div style={{ ...typeStyle("title"), fontSize: 54, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>{s.text}</div>
                  </div>
                </Card>
              </div>
            ) : null;
          })}

          {/* B */}
          <Timeline grow={grow} opacity={1 - tlOut} />

          {/* C — the thick report, then the phone */}
          {report > 0.001
            ? [4, 3, 2, 1, 0].map((k) => (
                <div key={k} style={{ position: "absolute", left: CX - 210 + k * 14, top: 220 - k * 14, width: 420, height: 560, opacity: report, transform: `translateX(${((1 - report) * 0).toFixed(1)}px)` }}>
                  <Card x={0} y={0} w={420} h={560} style={{ boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.skeleton}` }}>
                    {k === 0 ? (
                      <div style={{ position: "absolute", inset: 0, padding: 44, display: "flex", flexDirection: "column", gap: 22 }}>
                        <div style={{ ...typeStyle("title"), fontSize: 46, fontWeight: 600, color: c.ink }}>Annual report</div>
                        {[300, 330, 280, 320, 260, 310, 290, 200].map((wd, j) => (
                          <div key={j} style={{ width: wd, height: 14, borderRadius: 7, background: theme.color.skeleton }} />
                        ))}
                      </div>
                    ) : null}
                  </Card>
                </div>
              ))
            : null}
          {phone > 0.001 ? (
            <div style={{ position: "absolute", left: mix(CX - PHONE.w / 2, PHONE.x, phone), top: PHONE.y, width: PHONE.w, height: PHONE.h, opacity: phone, borderRadius: PHONE.r, background: c.ink, padding: 14, boxSizing: "border-box", boxShadow: read > 0.001 ? shadow.glow : shadow.soft }}>
              <div style={{ width: "100%", height: "100%", borderRadius: PHONE.r - 14, overflow: "hidden", background: c.cardBg }}>
                <Img src={staticFile("art/vi02/app/sc08-deep-research.jpg")} style={{ width: "100%", display: "block" }} />
              </div>
            </div>
          ) : null}
          {head > 0.001 ? (
            <div style={{ position: "absolute", left: RIGHT.x, top: RIGHT.head, transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 26, opacity: head }}>
              <div style={{ ...typeStyle("title"), fontSize: 56, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>Deep Research Report</div>
              {free > 0.001 ? <div style={{ padding: "10px 28px", borderRadius: 999, background: c.indigo, opacity: free, transform: `scale(${(0.85 + 0.15 * free).toFixed(3)})`, ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.cardBg }}>Gratis</div> : null}
            </div>
          ) : null}
          {POINTS.map((pt, i) => {
            const p = ease(f, W("Tim riset") + i * 6, m.reveal) * (1 - pointsOut);
            if (p <= 0.001) return null;
            const lit = ease(f, W(pt.at), m.pop);
            return (
              <div key={pt.text} style={{ position: "absolute", left: RIGHT.x, top: RIGHT.y0 + i * RIGHT.gap, opacity: p, display: "flex", alignItems: "center", gap: 22, padding: "12px 34px 12px 12px", borderRadius: 999, background: lit > 0.5 ? theme.color.indigoWashSolid : c.cardBg, boxShadow: lit > 0.5 ? `${shadow.soft}, inset 0 0 0 2px ${c.indigo}` : shadow.soft }}>
                <div style={{ width: 60, height: 60, borderRadius: 999, background: lit > 0.5 ? c.indigo : theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon={pt.icon} size={34} tone={lit > 0.5 ? c.cardBg : theme.color.neutralIcon} />
                </div>
                <div style={{ ...typeStyle("label"), fontSize: 38, fontWeight: 600, color: lit > 0.5 ? c.indigo : c.ink }}>{pt.text}</div>
              </div>
            );
          })}

          {/* D — door 3, and the list */}
          {door > 0.001 ? (
            <div style={{ position: "absolute", left: RIGHT.x, top: RIGHT.y0, opacity: door, display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ width: 84, height: 84, borderRadius: 999, background: c.indigo, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Glyph icon="door-open" size={48} tone={c.cardBg} />
              </div>
              <div style={{ ...typeStyle("title"), fontSize: 46, fontWeight: 600, color: c.ink }}>3 · Pahami perusahaan</div>
            </div>
          ) : null}
          {list > 0.001 ? (
            <div style={{ position: "absolute", left: LIST.x, top: LIST.y, width: LIST.w, height: LIST.h, opacity: list, transform: `translateY(${((1 - list) * 18).toFixed(1)}px)` }}>
              <Card x={0} y={0} w={LIST.w} h={LIST.h}>
                <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 18 }}>
                  <Glyph icon="list-checks" size={48} tone={c.ink} />
                  <div style={{ ...typeStyle("title"), fontSize: 42, fontWeight: 600, color: c.ink }}>Daftar perusahaan</div>
                </div>
                {[0, 1, 2].map((r) => {
                  const isNew = r === 2;
                  const p = isNew ? added : 1;
                  return (
                    <div key={r} style={{ position: "absolute", left: 40, right: 40, top: 120 + r * 70, height: 56, borderRadius: 16, background: isNew ? theme.color.indigoWashSolid : theme.color.neutralDisc, display: "flex", alignItems: "center", gap: 20, padding: "0 20px", opacity: p, transform: `translateX(${((1 - p) * 40).toFixed(1)}px)` }}>
                      <Glyph icon="storefront" size={32} tone={isNew ? c.indigo : theme.color.neutralIcon} />
                      <div style={{ width: isNew ? 260 : 200 + r * 60, height: 12, borderRadius: 6, background: isNew ? theme.color.hairlineBrandSolid : theme.color.skeleton }} />
                      <div style={{ marginLeft: "auto", opacity: isNew ? p : 1 }}>
                        <Glyph icon="check-circle" size={34} tone={isNew ? c.indigo : theme.color.neutralIcon} />
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* E — the next video */}
      {!main ? (
        <div style={{ position: "absolute", inset: 0, ...(f < next.at + next.over / 2 ? cutInStyle(f, next) : {}) }}>
          <NextVideoHead title="Membeli Saham Berarti Membeli Perusahaan" chipAt={next.at} titleAt={next.at + m.sec(0.3)} light titleTone={c.indigo} />
          {[0, 1, 2, 3].map((i) => {
            const p = ease(f, next.at + m.sec(0.8) + i * 6, m.reveal) * pillars;
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
        </div>
      ) : null}
    </>
  );
};
