/**
 * VI03 · SC08 — "Tiga Pertanyaan", from the ChatGPT storyboard docs/vi-style/storyboards/VI03-SC08.png, in VI02's look.
 *
 *  A  "Sebelum membeli, tanyakan tiga hal": three numbered question cards, each on its sentence.
 *  B  "Lalu ingat tiga kalimat" (a cut): the three sentences as three lines, each lit in turn.
 *  C  "John Templeton pernah mengatakan" (a cut): his sentence in a dashed text box; Templeton Growth Fund ±15% a year for
 *     38 years, 1954–1992 (John Templeton Foundation: $10.000 → $2 juta), in the mono face.
 *  D  "Value investing adalah pilihan" (a cut): "Value investing" — investor profesional dunia, investor ritel Indonesia.
 *  E  "Di Tuntun" (a cut): the mascot, Reference Fair Value and Valuation Status as placeholder cards (the app's screens are
 *     not in yet: fitur-aplikasi rule), the three things RFV weighs.
 *  F  "Kemudian Most Undervalued" (a cut): a placeholder list, each row's gap between price and RFV growing on "selisih besar";
 *     "Kandidat" lit, "Bukan daftar beli" grey; Daftar → Kandidat → Analisis → Layak dimiliki?
 *  G  "Di video selanjutnya" (a cut): VI02's next-video pill, Mr. Market, the next topic.
 */
import { interpolateColors, useCurrentFrame } from "remotion";
import { SoftGround, Stage, TuntunMark, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, BoardGrid, Card, DashBox, Figure, Glyph, GrowArrow, Line, Ring, Shot, WordPill, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A — three questions
const Q = { w: 480, h: 400, y: 330, gap: 60, disc: 120 };
const qX = (i: number) => CX - (3 * Q.w + 2 * Q.gap) / 2 + i * (Q.w + Q.gap);
const QS = [
  { icon: "seal-check", text: "Layak dimiliki?", at: "Apakah perusahaan" },
  { icon: "scales", text: "Harga wajarnya?", at: "Kira-kira berapa" },
  { icon: "shield-check", text: "Ada ruang kalau salah?", at: "apakah harga sekarang" },
] as const;

// B — three sentences
const S = { x: 260, w: 1400, y0: 300, gap: 175, h: 140 };
const SENTENCES = [
  { text: "Harga yang kamu bayar, value yang kamu dapatkan.", mark: "value", at: "Harga adalah" },
  { text: "Nilai 100 dibeli di 70: kita mungkin salah menghitung.", mark: "mungkin salah", at: "Barang bernilai" },
  { text: "Perusahaan bagus juga harus dibeli murah.", mark: "dibeli murah", at: "perusahaan bagus juga" },
] as const;

// C — Templeton
const STAT = { w: 420, h: 200, y: 620, gap: 50 };
const statX = (i: number) => CX - (3 * STAT.w + 2 * STAT.gap) / 2 + i * (STAT.w + STAT.gap);

// E — Tuntun's screens, as placeholders
const APP = { x: 400, y: 220, w: 600, h: 380, gap: 60 };

// F — the list
const LIST = { x: 200, y: 190, w: 640, h: 560, rows: 5 };
const FLOW = { y: 860, items: ["Daftar", "Kandidat", "Analisis", "Layak dimiliki?"] as const };

/** A grey bar standing in for text not drawn yet. */
const Skel = ({ x, y, w, h = 20 }: { x: number; y: number; w: number; h?: number }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, background: theme.color.skeleton }} />;

export const SC08 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(8, BLOCK.SC08);
  const g = f + BLOCK.SC08;

  const sentAt = W("Lalu ingat");
  const tempAt = W("John Templeton");
  const viAt = W("Value investing adalah");
  const appAt = W("Di Tuntun");
  const listAt = W("Kemudian Most");
  const nextAt = W("Di video");

  const gaps = ease(f, W("selisih besar"), m.sec(1));
  const candidate = ease(f, W("kumpulan kandidat"), m.pop);

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — three questions before buying */}
      <Shot from={-1} to={sentAt} block={BLOCK.SC08} cutIn={false}>
        <Appear at={-m.reveal} style={{ left: 0, top: 0 }}>
          <Line x={160} y={220} w={1600} text="Sebelum membeli, tanyakan:" mark="tanyakan" size={64} align="center" weight={600} />
        </Appear>
        {QS.map((q, i) => {
          const at = W(q.at);
          const p = ease(f, at - m.sec(0.2), m.reveal);
          const lit = ease(f, at, m.pop) * (i < 2 ? 1 - ease(f, W(QS[i + 1].at), m.pop) : 1);
          return p > 0.001 ? (
            <div key={q.text} style={{ position: "absolute", left: qX(i), top: Q.y + (1 - p) * 14, width: Q.w, height: Q.h, opacity: p }}>
              <Card x={0} y={0} w={Q.w} h={Q.h} style={{ boxShadow: lit > 0.5 ? shadow.glow : shadow.soft }}>
                <Ring p={lit} tone={c.indigo} />
                <div style={{ position: "absolute", left: 30, top: 30, width: 64, height: 64, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 3px ${c.indigo}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 34, fontWeight: 700, color: c.indigo }}>{i + 1}</div>
                <div style={{ position: "absolute", left: (Q.w - Q.disc) / 2, top: 80, width: Q.disc, height: Q.disc, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Glyph icon={q.icon} size={Q.disc * 0.54} tone={interpolateColors(lit, [0, 1], [theme.color.neutralIcon, c.indigo])} />
                </div>
                <div style={{ position: "absolute", left: 20, right: 20, top: 250, textAlign: "center", ...typeStyle("title"), fontSize: 44, fontWeight: 600, lineHeight: 1.2, color: c.ink }}>{q.text}</div>
              </Card>
            </div>
          ) : null;
        })}
      </Shot>

      {/* B — three sentences to remember */}
      <Shot from={sentAt} to={tempAt} block={BLOCK.SC08}>
        <Appear at={sentAt} style={{ left: 0, top: 0 }}>
          <Line x={160} y={190} w={1600} text="Ingat tiga kalimat" size={56} align="center" weight={600} />
        </Appear>
        {SENTENCES.map((s, i) => {
          const at = W(s.at);
          const p = ease(f, at - m.sec(0.2), m.reveal);
          const lit = ease(f, at, m.pop) * (i < 2 ? 1 - ease(f, W(SENTENCES[i + 1].at), m.pop) : 1);
          return p > 0.001 ? (
            <div key={s.text} style={{ position: "absolute", left: S.x, top: S.y0 + i * S.gap + (1 - p) * 14, width: S.w, height: S.h, opacity: p }}>
              <Card x={0} y={0} w={S.w} h={S.h} style={{ boxShadow: lit > 0.5 ? shadow.glow : shadow.soft }}>
                <Ring p={lit} tone={c.indigo} />
                <div style={{ position: "absolute", left: 34, top: S.h / 2 - 34, width: 68, height: 68, borderRadius: 999, background: lit > 0.5 ? c.indigo : theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 36, fontWeight: 700, color: lit > 0.5 ? c.cardBg : c.slate }}>{i + 1}</div>
                <Line x={140} y={S.h / 2} w={S.w - 180} text={s.text} mark={s.mark} size={46} weight={500} />
              </Card>
            </div>
          ) : null;
        })}
      </Shot>

      {/* C — Templeton */}
      <Shot from={tempAt} to={viAt} block={BLOCK.SC08}>
        <DashBox cx={CX} y={200} w={1240} h={210} at={W("pasar bullish")}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 60, fontWeight: 500, fontStyle: "italic", color: c.ink, whiteSpace: "nowrap" }}>
            <span>
              “Bull markets are born on <span style={{ color: c.indigo }}>pessimism</span>.”
            </span>
          </div>
        </DashBox>
        <Appear at={tempAt} style={{ left: 0, width: theme.canvas.width, top: 450, textAlign: "center" }}>
          <div style={{ ...typeStyle("label"), fontSize: 40, fontWeight: 600, color: c.ink }}>John Templeton</div>
        </Appear>
        {[
          { big: "±15%", small: "per tahun", at: W("15% per") },
          { big: "38 tahun", small: "1954–1992", at: W("38 tahun") },
        ].map((k, i) => (
          <Appear key={k.big} at={k.at} style={{ left: statX(i + 0.5), top: STAT.y, width: STAT.w, height: STAT.h }}>
            <Card x={0} y={0} w={STAT.w} h={STAT.h}>
              <div style={{ position: "absolute", left: 0, width: STAT.w, top: 30, textAlign: "center", fontFamily: theme.text.mono, fontSize: 76, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap" }}>{k.big}</div>
              <div style={{ position: "absolute", left: 0, width: STAT.w, top: 130, textAlign: "center", ...typeStyle("label"), fontSize: 32, fontWeight: 500, color: c.slate, whiteSpace: "nowrap" }}>{k.small}</div>
            </Card>
          </Appear>
        ))}
        <Appear at={W("Templeton Growth")} style={{ left: 0, top: 0 }}>
          <WordPill x={CX} y={STAT.y - 50} text="Templeton Growth Fund" size={32} />
        </Appear>
      </Shot>

      {/* D — value investing, for professionals and for Indonesia's retail investors */}
      <Shot from={viAt} to={appAt} block={BLOCK.SC08}>
        <Appear at={viAt} style={{ left: 0, top: 0 }}>
          <Line x={160} y={330} w={1600} text="Value investing" size={96} align="center" weight={700} />
        </Appear>
        {[
          { icon: "users-three", text: "Investor profesional dunia", at: W("investor profesional") },
          { icon: "hand-coins", text: "Investor ritel Indonesia", at: W("investor ritel") },
        ].map((k, i) => (
          <Appear key={k.text} at={k.at} style={{ left: CX - 720 - 25 + i * 770, top: 500, width: 720, height: 140 }}>
            <Card x={0} y={0} w={720} h={140}>
              <div style={{ position: "absolute", left: 30, top: 25, width: 90, height: 90, borderRadius: 999, background: theme.color.indigoWashSolid, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Glyph icon={k.icon} size={50} tone={c.indigo} />
              </div>
              <div style={{ position: "absolute", left: 145, top: 70, transform: "translateY(-50%)", ...typeStyle("title"), fontSize: 42, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{k.text}</div>
            </Card>
          </Appear>
        ))}
      </Shot>

      {/* E — in Tuntun: Reference Fair Value and Valuation Status (placeholders until the app screens are in) */}
      <Shot from={appAt} to={listAt} block={BLOCK.SC08}>
        <TuntunMark x={220} y={APP.y + 90} height={140} />
        {[
          { title: "Reference Fair Value", at: W("Reference Fair Value") },
          { title: "Valuation Status", at: W("Valuation Status") },
        ].map((k, i) => (
          <Appear key={k.title} at={k.at} style={{ left: APP.x + i * (APP.w + APP.gap), top: APP.y, width: APP.w, height: APP.h }}>
            <Card x={0} y={0} w={APP.w} h={APP.h}>
              <div style={{ position: "absolute", left: 0, width: APP.w, top: 40, textAlign: "center", ...typeStyle("title"), fontSize: 44, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{k.title}</div>
              <Skel x={(APP.w - 260) / 2} y={140} w={260} h={46} />
              <Skel x={60} y={230} w={APP.w - 120} h={24} />
              <Skel x={60} y={290} w={180} h={20} />
              <Skel x={APP.w - 240} y={290} w={180} h={20} />
            </Card>
          </Appear>
        ))}
        {[
          { icon: "coins", text: "Berapa banyak laba", at: W("berapa banyak laba") },
          { icon: "clock", text: "Berapa lama", at: W("berapa lama") },
          { icon: "shield-check", text: "Seberapa pasti", at: W("seberapa pasti") },
        ].map((k, i) => (
          <Appear key={k.text} at={k.at} style={{ left: APP.x + i * 450 - 40, top: APP.y + APP.h + 70, width: 430, height: 110 }}>
            <Card x={0} y={0} w={430} h={110}>
              <div style={{ position: "absolute", left: 20, top: 17, width: 76, height: 76, borderRadius: 999, background: theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Glyph icon={k.icon} size={42} tone={c.indigo} />
              </div>
              <div style={{ position: "absolute", left: 114, top: 55, transform: "translateY(-50%)", ...typeStyle("title"), fontSize: 34, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{k.text}</div>
            </Card>
          </Appear>
        ))}
      </Shot>

      {/* F — Most Undervalued: candidates, not a buy list */}
      <Shot from={listAt} to={nextAt} block={BLOCK.SC08}>
        <Appear at={W("Most Undervalued")} style={{ left: LIST.x, top: LIST.y, width: LIST.w, height: LIST.h }}>
          <Card x={0} y={0} w={LIST.w} h={LIST.h} style={{ boxShadow: candidate > 0.5 ? shadow.glow : shadow.soft }}>
            <Ring p={candidate} tone={c.indigo} />
            <div style={{ position: "absolute", left: 40, top: 34, ...typeStyle("title"), fontSize: 42, fontWeight: 600, color: c.ink }}>Most Undervalued</div>
            {Array.from({ length: LIST.rows }, (_, i) => {
              const y = 120 + i * 84;
              const gap = [0.62, 0.55, 0.5, 0.46, 0.4][i];
              const x0 = 300;
              const x1 = 300 + 280 * gap * gaps;
              return (
                <div key={i} style={{ position: "absolute", left: 0, top: y, width: LIST.w, height: 70 }}>
                  <Skel x={40} y={25} w={150} h={22} />
                  <div style={{ position: "absolute", left: x0, top: 30, width: x1 - x0, height: 12, borderRadius: 6, background: theme.color.indigoWashDeepSolid }} />
                  <div style={{ position: "absolute", left: x0 - 10, top: 26, width: 20, height: 20, borderRadius: 999, background: c.indigo }} />
                  {gaps > 0.001 ? <div style={{ position: "absolute", left: x1 - 3, top: 18, width: 6, height: 36, borderRadius: 3, background: c.ink }} /> : null}
                </div>
              );
            })}
          </Card>
        </Appear>
        <Appear at={W("selisih besar")} style={{ left: LIST.x + LIST.w + 60, top: LIST.y + 120 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { dot: true, text: "Harga pasar" },
              { dot: false, text: "Reference Fair Value" },
            ].map((k) => (
              <div key={k.text} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {k.dot ? <div style={{ width: 22, height: 22, borderRadius: 999, background: c.indigo }} /> : <div style={{ width: 6, height: 36, borderRadius: 3, background: c.ink, margin: "0 8px" }} />}
                <div style={{ ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{k.text}</div>
              </div>
            ))}
          </div>
        </Appear>
        <Appear at={W("kumpulan kandidat")} style={{ left: LIST.x + LIST.w + 60, top: LIST.y + 330 }}>
          <div style={{ padding: "12px 34px", borderRadius: 999, background: theme.color.indigoWashSolid, boxShadow: `inset 0 0 0 3px ${c.indigo}`, ...typeStyle("title"), fontSize: 46, fontWeight: 700, color: c.indigo, whiteSpace: "nowrap" }}>Kandidat</div>
        </Appear>
        <Appear at={W("bukan daftar beli")} style={{ left: LIST.x + LIST.w + 60, top: LIST.y + 440 }}>
          <div style={{ padding: "10px 30px", borderRadius: 999, background: theme.color.neutralDisc, ...typeStyle("label"), fontSize: 36, fontWeight: 600, color: c.slate, whiteSpace: "nowrap" }}>Bukan daftar beli</div>
        </Appear>
        {/* Daftar → Kandidat → Analisis → Layak dimiliki? */}
        {FLOW.items.map((t, i) => {
          const at = i < 2 ? W("Daftar tersebut") + i * m.sec(0.3) : i === 2 ? W("Analisis membantu") : W("layak dimiliki");
          const p = ease(f, at, m.reveal);
          const lit = i === 3 ? ease(f, at, m.pop) : i === 2 ? ease(f, at, m.pop) * (1 - ease(f, W("layak dimiliki"), m.pop)) : 0;
          const x = 230 + i * 400;
          return p > 0.001 ? (
            <div key={t} style={{ position: "absolute", inset: 0, opacity: p }}>
              <div style={{ position: "absolute", left: x, top: FLOW.y, transform: "translateY(-50%)", padding: "12px 30px", borderRadius: 999, background: lit > 0.5 ? theme.color.indigoWashSolid : c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 ${lit > 0.5 ? 3 : 2}px ${lit > 0.5 ? c.indigo : theme.color.hairlineBrandSolid}`, ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: lit > 0.5 ? c.indigo : c.ink, whiteSpace: "nowrap" }}>{t}</div>
              {i > 0 ? <GrowArrow x0={x - 150} y0={FLOW.y} x1={x - 24} y1={FLOW.y} p={p} /> : null}
            </div>
          ) : null;
        })}
      </Shot>

      {/* G — the next video */}
      <Shot from={nextAt} to={1e6} block={BLOCK.SC08} cutOut={false}>
        <Appear at={nextAt + m.sec(0.15)} style={{ left: 260, top: 250 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 34px 12px 16px", borderRadius: 999, background: c.cardBg, boxShadow: `${shadow.soft}, inset 0 0 0 2px ${theme.color.hairlineBrandSolid}` }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: c.indigo, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={22} height={24} viewBox="0 0 22 24"><path d="M 3 2 L 20 12 L 3 22 Z" fill={c.cardBg} stroke={c.cardBg} strokeWidth={3} strokeLinejoin="round" /></svg>
            </div>
            <div style={{ ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.ink }}>Video selanjutnya</div>
          </div>
        </Appear>
        <Appear at={W("terlalu takut")} style={{ left: 260, top: 380, width: 1000 }}>
          <Card x={0} y={0} w={1000} h={300} style={{ boxShadow: `${shadow.soft}, inset 0 0 0 4px ${c.indigo}` }}>
            <div style={{ position: "absolute", left: 60, right: 60, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", ...typeStyle("title"), fontSize: 64, fontWeight: 600, lineHeight: 1.2, color: c.ink }}>
              <span>
                Pasar terlalu <span style={{ color: c.indigo }}>takut</span>,
              </span>
              <span style={{ opacity: ease(f, W("kadang terlalu", 1), m.reveal) }}>
                terlalu <span style={{ color: c.indigo }}>optimistis</span>
              </span>
            </div>
          </Card>
        </Appear>
        <Appear at={nextAt + m.sec(0.4)} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
          <Figure name="mr-market" cx={1500} floor={880} h={540} flip />
        </Appear>
      </Shot>
    </Stage>
  );
};
