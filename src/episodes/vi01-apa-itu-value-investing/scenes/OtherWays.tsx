/**
 * VI01 · SC06 — "Bandingkan dengan Cara Lain", from Simon's VISUAL / TEKS LAYAR notes ("4 tracks") and the ChatGPT storyboard
 * docs/vi-style/storyboards/VI01-SC06.png: four lanes, the one the VO is on grows tall, the others thin out.
 *
 *  Day trading: what it needs; Brasil 97% rugi, 1,1% > upah minimum; Taiwan mayoritas rugi (the script's studies).
 *  Quantitative trading: data, programming, kecepatan, modal — vs server institusi.
 *  Berita / KOL: the news passes five hands before it reaches you; you are last.
 *  Value investing: since the 1930s; speed, insider information and a day at the screen crossed out.
 *  Then Buffett, and Simon's two lines.
 *
 * Simon's note: never say technical analysis is "tidak valid" — nothing here does.
 */
import { staticFile, useCurrentFrame } from "remotion";
import { theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { ART, Card, Glyph, Line, Pic, ease, useWords } from "../components/kit";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const LANES = [
  { icon: "lightning", title: "Day trading", at: "Day trading" },
  { icon: "code", title: "Quantitative trading", at: "Quantitative" },
  { icon: "megaphone", title: "Berita / KOL", at: "Mengikuti berita" },
  { icon: "book-open", title: "Value investing", at: "Value investing bermain" },
] as const;
const AREA = { x: 140, y: 160, w: 1640, h: 730, gap: 18, tall: 450, head: 136 };

const Chip = ({ text, p, crossed = 0, tone }: { text: string; p: number; crossed?: number; tone?: string }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "relative", padding: "14px 30px", borderRadius: 999, background: theme.color.neutralDisc, opacity: p, transform: `translateY(${((1 - p) * 10).toFixed(1)}px)`, ...typeStyle("label"), fontSize: 34, fontWeight: 500, color: tone ?? c.ink, whiteSpace: "nowrap" }}>
      {text}
      {crossed > 0.001 ? <div style={{ position: "absolute", left: 18, right: 18, top: "50%", height: 4, borderRadius: 2, background: theme.color.crossRed, transformOrigin: "0 50%", transform: `scaleX(${crossed.toFixed(3)})` }} /> : null}
    </div>
  );
};

const Stat = ({ where, big, small, p }: { where: string; big: string; small: string; p: number }) => {
  const c = usePalette();
  if (p <= 0.001) return null;
  return (
    <div style={{ opacity: p, transform: `translateY(${((1 - p) * 12).toFixed(1)}px)`, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ ...typeStyle("label"), fontSize: 30, fontWeight: 500, color: c.slate }}>{where}</div>
      <div style={{ ...typeStyle("title"), fontSize: 72, fontWeight: 600, color: theme.color.crossRed, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{big}</div>
      <div style={{ ...typeStyle("label"), fontSize: 32, fontWeight: 500, color: c.ink }}>{small}</div>
    </div>
  );
};

export const SC06 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const shadow = useShadow();
  const m = useMotion();
  const W = useWords(6, BLOCK.SC06);

  const laneIn = LANES.map((_, i) => ease(f, W("Coba bandingkan") + i * 8, m.reveal));
  const quote = ease(f, W("Buffett pernah"), m.move);
  const focus = LANES.map((l, i) => ease(f, W(l.at), m.move) * (i < 3 ? 1 - ease(f, W(LANES[i + 1].at), m.move) : 1));
  const anyFocus = Math.min(1, focus.reduce((a, b) => a + b, 0));
  const thin = (AREA.h - AREA.tall - 3 * AREA.gap) / 3;
  const even = (AREA.h - 3 * AREA.gap) / 4;
  const heights = focus.map((p) => mix(even, mix(thin, AREA.tall, p), anyFocus));
  const tops = heights.map((_, i) => AREA.y + heights.slice(0, i).reduce((a, b) => a + b, 0) + i * AREA.gap);

  const content = (i: number) => {
    const at = (w: string, n = 0) => ease(f, W(w, n), m.reveal);
    if (i === 0)
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <Chip text="Kecepatan" p={at("kecepatan")} />
            <Chip text="Disiplin" p={at("disiplin")} />
            <Chip text="Waktu layar" p={at("waktu melihat")} />
          </div>
          <div style={{ display: "flex", gap: 90 }}>
            <Stat where="Brasil · > 300 hari" big="97%" small="rugi" p={at("97%")} />
            <Stat where="Brasil" big="1,1%" small="> upah minimum" p={at("1,1%")} />
            <Stat where="Taiwan" big="Mayoritas" small="rugi" p={at("Penelitian di Taiwan")} />
          </div>
        </div>
      );
    if (i === 1)
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, width: 560 }}>
            <Chip text="Data" p={at("data")} />
            <Chip text="Programming" p={at("programming")} />
            <Chip text="Kecepatan" p={at("kecepatan", 1)} />
            <Chip text="Modal" p={at("modal")} />
          </div>
          <div style={{ ...typeStyle("title"), fontSize: 48, fontWeight: 600, color: c.slate, opacity: at("Dan lawanmu") }}>vs</div>
          <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: at("server") }}>
            <div style={{ width: 120, height: 120, borderRadius: 30, background: theme.color.neutralDotOn, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Glyph icon="server" size={70} tone={c.cardBg} />
            </div>
            <div style={{ ...typeStyle("label"), fontSize: 38, fontWeight: 600, color: c.ink }}>Server institusi</div>
          </div>
        </div>
      );
    if (i === 2) {
      const pass = ease(f, W("ketika informasi"), W("terakhir") - W("ketika informasi"));
      return (
        <div style={{ position: "relative", width: 1050, height: 220 }}>
          {[0, 1, 2, 3, 4].map((k) => {
            const lit = pass * 4 >= k - 0.01;
            const last = k === 4;
            return (
              <div key={k} style={{ position: "absolute", left: k * 240, top: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 120, opacity: at("Masalahnya") }}>
                <div style={{ width: 96, height: 96, borderRadius: 999, background: last && lit ? c.indigo : lit ? theme.color.indigoWashSolid : theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: last && lit ? shadow.glow : undefined }}>
                  <Glyph icon={k === 0 ? "newspaper" : "user-circle"} size={56} tone={last && lit ? c.cardBg : lit ? c.indigo : theme.color.neutralDot} />
                </div>
                <div style={{ ...typeStyle("label"), fontSize: 30, fontWeight: 600, color: c.ink, whiteSpace: "nowrap" }}>{k === 0 ? "Sumber" : last ? "Kamu" : ""}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 120, top: 86, width: 840 * pass, height: 4, borderRadius: 2, background: theme.color.connector, opacity: at("Masalahnya") }} />
          <div style={{ position: "absolute", left: 1010, top: 172, transform: "translateX(-50%)", ...typeStyle("label"), fontSize: 34, fontWeight: 600, color: c.indigo, whiteSpace: "nowrap", opacity: at("terakhir") }}>Kamu tahu paling akhir</div>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        <div style={{ display: "flex", gap: 18 }}>
          <Chip text="Sejak 1930-an" p={at("Metodenya")} tone={c.indigo} />
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          <Chip text="Kecepatan" p={at("Tidak bergantung")} crossed={ease(f, W("Tidak bergantung") + m.sec(0.5), m.reveal)} />
          <Chip text="Insider information" p={at("insider")} crossed={ease(f, W("insider") + m.sec(0.5), m.reveal)} />
          <Chip text="Layar seharian" p={at("Dan nggak")} crossed={ease(f, W("Dan nggak") + m.sec(0.6), m.reveal)} />
        </div>
      </div>
    );
  };

  const lineA = ease(f, W("kerangka berpikir"), m.reveal);
  const lineB = ease(f, W("Nggak harus full-time"), m.reveal);
  const buffett = ease(f, W("Buffett pernah"), m.reveal);

  return (
    <>
      {quote < 0.999
        ? LANES.map((l, i) => {
            if (laneIn[i] <= 0.001) return null;
            const fp = focus[i];
            const dim = anyFocus > 0.5 && fp < 0.5;
            return (
              <div key={l.title} style={{ position: "absolute", left: AREA.x, top: tops[i], width: AREA.w, height: heights[i], opacity: laneIn[i] * (1 - quote), transform: `translateY(${((1 - laneIn[i]) * 16).toFixed(1)}px)` }}>
                <Card x={0} y={0} w={AREA.w} h={heights[i]} style={{ boxShadow: fp > 0.5 ? `${shadow.soft}, inset 0 0 0 3px ${c.indigo}` : shadow.soft, overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 40, top: Math.min(heights[i] / 2, 70), transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 24 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 999, background: fp > 0.5 ? c.indigo : theme.color.neutralDisc, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Glyph icon={l.icon} size={40} tone={fp > 0.5 ? c.cardBg : theme.color.neutralIcon} />
                    </div>
                    <div style={{ ...typeStyle("title"), fontSize: 44, fontWeight: 600, color: dim ? c.slate : c.ink, whiteSpace: "nowrap" }}>{l.title}</div>
                  </div>
                  {fp > 0.001 ? <div style={{ position: "absolute", left: AREA.head, top: 130, opacity: fp }}>{content(i)}</div> : null}
                </Card>
              </div>
            );
          })
        : null}

      {/* Buffett, and Simon's two lines */}
      {buffett > 0.001 ? (
        <>
          <Pic src={staticFile("art/vi01/buffett.png")} style={{ position: "absolute", left: 240, top: 300 + (1 - buffett) * 18, width: 380, height: (380 * ART.buffett.h) / ART.buffett.w, opacity: buffett * quote }} />
          <div style={{ position: "absolute", left: 240, top: 720, width: 380, textAlign: "center", ...typeStyle("label"), fontSize: 38, fontWeight: 600, color: c.ink, opacity: buffett * quote }}>Warren Buffett</div>
        </>
      ) : null}
      {lineA > 0.001 ? <div style={{ opacity: lineA }}><Line x={760} y={440} w={1000} text="Perlu kerangka berpikir + disiplin." size={64} weight={500} mark="kerangka berpikir + disiplin" /></div> : null}
      {lineB > 0.001 ? <div style={{ opacity: lineB }}><Line x={760} y={600} w={1000} text="Tidak perlu menjadi yang tercepat." size={52} weight={500} /></div> : null}
    </>
  );
};
