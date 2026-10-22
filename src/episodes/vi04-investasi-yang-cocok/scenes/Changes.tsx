/**
 * VI04 · SC07 — "Profilmu Bisa Berubah", rebuilt to Benchmark v1 + minimal (STYLE.md §0; Simon, 22 Oct 2026) from
 * the ChatGPT storyboard docs/vi-style/storyboards/VI04-SC07-v2.jpg.
 *
 *  A/B a life timeline — 22 · 30 · 40 · mendekati pensiun — as one hairline with four stops. Each stop lights on
 *      its word and a connector drops from it to ONE card below, whose content swaps: what that age looks like,
 *      and (on a brand hairline) what it means for investing.
 *  C   "empat hal yang terus berubah": a mindmap — Profil investasi in the middle, a connector growing to each of
 *      the four on its word.
 *  D   the insight, Orang Tuntun: "profil investasi bukan label seumur hidup. Kondisi berubah? Tes lagi."
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, Card, IconDot, Line, ORANG_TUNTUN_RIGHT, OrangTuntun, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// A/B — the timeline and its one card
const TRACK = { y: 290, x0: 360, x1: 1560 };
const CARD = { x: 360, y: 470, w: 1200, h: 380 };
type Stop = { label: string; at: string; icon: string; lines: { text: string; at: string }[]; chip: { lead: string; text: string; at: string; sub?: { text: string; at: string } }; tags?: { text: string; at: string }[] };
const STOPS: Stop[] = [
  {
    label: "Umur 22",
    at: "Umur 22",
    icon: "t-learn-w",
    lines: [
      { text: "Baru mulai kerja.", at: "baru mulai kerja" },
      { text: "Dana belum banyak, pengalaman juga masih sedikit.", at: "Dana belum banyak" },
    ],
    chip: { lead: "Fokusnya:", text: "belajar dulu.", at: "Fokusnya" },
  },
  {
    label: "Umur 30",
    at: "Umur 30",
    icon: "t-home-w",
    lines: [
      { text: "Mulai berkeluarga atau menyiapkan rumah.", at: "mulai berkeluarga" },
      { text: "Dana mungkin lebih besar,", at: "Dana mungkin lebih besar" },
    ],
    chip: { lead: "tapi", text: "toleransi terhadap penurunan bisa mengecil", at: "tapi toleransi", sub: { text: "karena uangnya akan segera dipakai.", at: "karena uangnya" } },
  },
  {
    label: "Umur 40",
    at: "Umur 40",
    icon: "t-career-w",
    lines: [
      { text: "Karier dan pengalaman lebih matang.", at: "karier dan pengalaman" },
      { text: "Kemampuan meningkat,", at: "Kemampuan meningkat" },
    ],
    chip: { lead: "tapi", text: "tujuan juga berubah:", at: "tapi tujuan" },
    tags: [
      { text: "Pendidikan anak", at: "pendidikan anak" },
      { text: "Orang tua", at: "orang tua" },
      { text: "Keluarga", at: "dan keluarga" },
    ],
  },
  {
    label: "Mendekati pensiun",
    at: "Mendekati pensiun",
    icon: "t-retire-w",
    lines: [{ text: "Kemampuan mungkin masih ada,", at: "kemampuan mungkin masih" }],
    chip: { lead: "tapi prioritas bisa berubah menjadi:", text: "cash flow yang lebih stabil.", at: "tapi prioritas" },
  },
];
const stopX = (i: number) => TRACK.x0 + ((TRACK.x1 - TRACK.x0) * i) / (STOPS.length - 1);

// C — the four things that keep changing
const HUB = { w: 420, h: 130, y: 520 };
const NODE = { w: 540, h: 120, xs: [140, theme.canvas.width - 140 - 540], ys: [380, 680] };
const FOUR = [
  { icon: "waves", text: "Toleransi terhadap penurunan", at: "toleransi terhadap penurunan", nth: 1, side: 0, row: 0 },
  { icon: "wheel", text: "Kemampuan investasi", at: "kemampuan investasi", nth: 0, side: 1, row: 0 },
  { icon: "t-target-w", text: "Tujuan hidup", at: "tujuan hidup", nth: 0, side: 0, row: 1 },
  { icon: "t-fund-w", text: "Dana yang bisa diinvestasikan", at: "dana yang bisa diinvestasikan", nth: 0, side: 1, row: 1 },
];

export const SC07 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(7, BLOCK.SC07);
  const g = f + BLOCK.SC07;

  const lineAt = W("Dan profil kita");
  const fourAt = W("Jadi ada empat hal");
  const insightAt = W("Karena itu");
  const track = ease(f, lineAt + m.sec(0.3), m.sec(1.2));
  const stopAt = STOPS.map((s) => W(s.at));
  const until = (i: number) => (i + 1 < stopAt.length ? stopAt[i + 1] : fourAt);

  return (
    <Stage>
      <SoftGround f={g} />

      {/* A/B — the life timeline */}
      <Appear at={lineAt} out={fourAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Line x={0} y={170} w={theme.canvas.width} align="center" size={44} weight={500} text="Profil kita nggak selalu sama selamanya." mark="nggak selalu sama" />
        <svg width={theme.canvas.width} height={theme.canvas.height} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={TRACK.x0} y1={TRACK.y} x2={TRACK.x0 + (TRACK.x1 - TRACK.x0) * track} y2={TRACK.y} stroke={theme.color.connector} strokeWidth={2.5} strokeLinecap="round" />
        </svg>
        {STOPS.map((s, i) => {
          const born = ease(f, lineAt + m.sec(0.3) + m.sec(0.25) * (i + 1), m.reveal);
          const on = ease(f, stopAt[i], m.pop) * (1 - ease(f, until(i), m.fade));
          return (
            <div key={s.label} style={{ position: "absolute", left: stopX(i) - 150, top: TRACK.y - 18, width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: born }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${on > 0.5 ? theme.color.connector : theme.color.connectorMute}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 14, height: 14, borderRadius: 999, background: c.indigo, opacity: on, transform: `scale(${(0.4 + 0.6 * on).toFixed(3)})` }} />
              </div>
              <div style={{ ...typeStyle("body"), fontWeight: on > 0.5 ? 600 : 500, color: on > 0.5 ? c.ink : c.slate, whiteSpace: "nowrap" }}>{s.label}</div>
            </div>
          );
        })}
        {/* the drop from the stop being said to the card */}
        {STOPS.map((s, i) => (
          <Appear key={`drop${s.label}`} at={stopAt[i]} out={until(i)} rise={0} style={{ left: 0, top: 0 }}>
            <Connector a={{ x: stopX(i), y: TRACK.y + 96 }} b={{ x: Math.min(Math.max(stopX(i), CARD.x + 80), CARD.x + CARD.w - 80), y: CARD.y }} p={ease(f, stopAt[i], m.sec(0.5))} shape="curve" axis="y" dot={false} />
          </Appear>
        ))}
        <Appear at={stopAt[0] + m.sec(0.3)} style={{ left: 0, top: 0 }}>
          <Card x={CARD.x} y={CARD.y} w={CARD.w} h={CARD.h} />
        </Appear>
        {STOPS.map((s, i) => (
          <Appear key={`card${s.label}`} at={stopAt[i] + m.sec(0.3)} out={until(i)} style={{ left: CARD.x + 60, top: CARD.y + 56, width: CARD.w - 120, display: "flex", gap: 44 }}>
            <IconDot name={s.icon} size={54} neutral />
            <div style={{ flex: 1 }}>
              {s.lines.map((ln, k) => (
                <div key={ln.text} style={{ ...typeStyle("body"), fontWeight: k === 0 ? 600 : 500, color: k === 0 ? c.ink : c.slate, lineHeight: 1.3, marginBottom: 6, opacity: ease(f, W(ln.at), m.reveal) }}>{ln.text}</div>
              ))}
              <div style={{ marginTop: 26, display: "inline-flex", flexDirection: "column", padding: "16px 28px", borderRadius: 24, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrand}`, opacity: ease(f, W(s.chip.at), m.reveal) }}>
                <div style={{ ...typeStyle("body"), fontSize: 32, color: c.slate }}>
                  {s.chip.lead} <span style={{ fontWeight: 600, color: c.ink }}>{s.chip.text}</span>
                </div>
                {s.chip.sub ? <div style={{ marginTop: 4, ...typeStyle("label"), color: c.slate, opacity: ease(f, W(s.chip.sub.at), m.reveal) }}>{s.chip.sub.text}</div> : null}
              </div>
              {s.tags ? (
                <div style={{ marginTop: 18, display: "flex", gap: 14 }}>
                  {s.tags.map((t) => (
                    <div key={t.text} style={{ padding: "8px 22px", borderRadius: 999, background: theme.color.neutralDisc, ...typeStyle("label"), color: c.ink, opacity: ease(f, W(t.at), m.reveal) }}>{t.text}</div>
                  ))}
                </div>
              ) : null}
            </div>
          </Appear>
        ))}
      </Appear>

      {/* C — four things that keep changing */}
      <Appear at={fourAt} out={insightAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Line x={0} y={190} w={theme.canvas.width} align="center" size={44} weight={500} text="Jadi ada empat hal yang terus berubah:" mark="terus berubah" />
        <Appear at={fourAt + m.sec(0.2)} style={{ left: 0, top: 0 }}>
          <Card x={CX - HUB.w / 2} y={HUB.y - HUB.h / 2} w={HUB.w} h={HUB.h} line={theme.color.hairlineBrand} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
            <IconDot name="t-profile-w" size={40} neutral />
            <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink }}>Profil investasi</div>
          </Card>
        </Appear>
        {FOUR.map((t) => {
          const at = W(t.at, t.nth);
          const nx = NODE.xs[t.side];
          const ny = NODE.ys[t.row];
          const a = { x: t.side === 0 ? CX - HUB.w / 2 : CX + HUB.w / 2, y: HUB.y };
          const b = { x: t.side === 0 ? nx + NODE.w : nx, y: ny };
          return (
            <div key={t.text}>
              <Connector a={a} b={b} p={ease(f, at - m.sec(0.2), m.sec(0.5))} shape="curve" />
              <Appear at={at + m.sec(0.15)} style={{ left: 0, top: 0 }}>
                <Card x={nx} y={ny - NODE.h / 2} w={NODE.w} h={NODE.h} style={{ display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
                  <IconDot name={t.icon} size={38} neutral />
                  <div style={{ ...typeStyle("body"), color: c.ink, lineHeight: 1.2 }}>{t.text}</div>
                </Card>
              </Appear>
            </div>
          );
        })}
      </Appear>

      {/* D — the insight */}
      <OrangTuntun at={insightAt} />
      <Appear at={insightAt + m.sec(0.2)} style={{ left: 0, top: 0 }}>
        <div style={{ position: "absolute", left: ORANG_TUNTUN_RIGHT + 90, top: 330, ...typeStyle("body"), color: c.slate, whiteSpace: "nowrap" }}>Karena itu,</div>
      </Appear>
      <Appear at={W("profil investasi bukan")} style={{ left: 0, top: 0 }}>
        <Line x={ORANG_TUNTUN_RIGHT + 90} y={470} w={theme.canvas.width - theme.margin.right - ORANG_TUNTUN_RIGHT - 160} size={64} text="profil investasi bukan label seumur hidup." mark="label seumur hidup" />
      </Appear>
      <Appear at={W("Kondisi berubah")} style={{ left: ORANG_TUNTUN_RIGHT + 90, top: 660, display: "flex", alignItems: "center", gap: 24 }}>
        <IconDot name="t-retest-w" size={40} neutral />
        <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>
          Kondisi berubah? <span style={{ color: theme.color.selfAmberInk, opacity: ease(f, W("Tes lagi"), m.reveal) }}>Tes lagi.</span>
        </div>
      </Appear>
    </Stage>
  );
};
