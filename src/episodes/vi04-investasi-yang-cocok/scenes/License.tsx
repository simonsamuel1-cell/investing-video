/**
 * VI04 · SC05 — "Kamu Sudah Bisa Mengemudikannya Belum?", rebuilt to Benchmark v1 + minimal (STYLE.md §0; Simon,
 * 22 Oct 2026) from the ChatGPT storyboard docs/vi-style/storyboards/VI04-SC05-v2.jpg.
 *
 *  A  "Pertanyaan kedua": the question card (the Kemudi icon SC03 ended on); it then stays as the heading.
 *  B  "kita perlu punya lisensi … dilihat dari tiga hal": a mindmap — the licence (the plane, in grey) at the left,
 *     three connectors growing to three empty nodes.
 *  C  each node fills on its words — paham apa yang kamu lihat (laporan keuangan, indikator teknikal), punya logika
 *     sendiri (kenapa beli? kapan harus jual? bisa jelasin sendiri?), pernah melewati badai (pengalaman beberapa
 *     tahun, market crash tanpa panik); the one being said is in focus, the others step back. The boxes stay
 *     empty: they are for you to answer.
 *  D  three levels by how many are ticked: 3 lebih matang · 1–2 berkembang · 0 pemula — "dan itu normal".
 *  E  "berani … bukan berarti sudah bisa bawa pesawat": Berani = toleransi ≠ Bisa mengemudikan = kemampuan — the
 *     same two icons and words SC06 opens with.
 */
import { useCurrentFrame } from "remotion";
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette } from "../../../core";
import { BLOCK } from "../data/timing";
import { Appear, Card, Heading, IsoIcon, Line, NumRing, Vehicle, ease, useWords } from "../components/kit";

const CX = theme.canvas.width / 2;

// B–C — the licence and its three parts
const HUB = { x: 140, y: 320, w: 480, h: 420 };
const HUB_OUT = { x: HUB.x + HUB.w, y: HUB.y + HUB.h / 2 };
const NODE = { x: 780, w: 1000, h: 170, ys: [280, 490, 700] };
type Row = { title: string; at: string; titleAt: string; chips: { text: string; at: string }[] };
const ROWS: Row[] = [
  { title: "Paham apa yang kamu lihat", at: "Pertama", titleAt: "kamu paham", chips: [{ text: "Laporan keuangan", at: "Laporan keuangan" }, { text: "Indikator teknikal", at: "indikator teknikal" }] },
  { title: "Punya logika sendiri", at: "Kedua, kamu punya", titleAt: "punya logika", chips: [{ text: "Kenapa beli?", at: "Kenapa beli" }, { text: "Kapan harus jual?", at: "Kapan harus jual" }, { text: "Bisa jelasin sendiri?", at: "Bisa jelasin" }] },
  { title: "Pernah melewati badai", at: "Ketiga", titleAt: "pernah melewati badai", chips: [{ text: "Pengalaman beberapa tahun", at: "Punya pengalaman" }, { text: "Market crash tanpa panik", at: "market crash" }] },
];

// D — the levels
const LV = { w: 900, h: 130, ys: [300, 460, 620], tick: 52 };

// E — daring is not steering
const ANS = { w: 680, h: 200, y: 420, gap: 100 };
const ansX = (i: number) => CX + (i === 0 ? -ANS.gap / 2 - ANS.w : ANS.gap / 2);

/** An empty box with a hairline — for you to tick, not us. */
const OpenBox = ({ size }: { size: number }) => <div style={{ width: size, height: size, borderRadius: size * 0.28, boxShadow: `inset 0 0 0 2px ${theme.color.connectorMute}`, flex: "none" }} />;

/** A tick on a white disc with the brand hairline; before `at`, an empty ring. */
const Tick = ({ size, at }: { size: number; at?: number }) => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const p = at === undefined ? 0 : ease(f, at, m.pop);
  return (
    <div style={{ width: size, height: size, borderRadius: 999, background: c.cardBg, boxShadow: `inset 0 0 0 2px ${p > 0.5 ? theme.color.connector : theme.color.connectorMute}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
      <span style={{ fontFamily: theme.text.family, fontWeight: 600, fontSize: size * 0.5, lineHeight: 1, color: c.indigo, opacity: p, transform: `scale(${(0.7 + 0.3 * p).toFixed(3)})` }}>✓</span>
    </div>
  );
};

export const SC05 = () => {
  const f = useCurrentFrame();
  const c = usePalette();
  const m = useMotion();
  const W = useWords(5, BLOCK.SC05);
  const g = f + BLOCK.SC05;

  const qAt = W("Pertanyaan kedua");
  const planeAt = W("Kalau memilih saham");
  const licAt = W("punya “lisensi”");
  const threeAt = W("tiga hal");
  const levelAt = W("Kalau tiga-tiganya");
  const keyAt = W("Yang penting diingat");
  const rowAt = ROWS.map((r) => W(r.at));

  const levels = [
    { ticks: [W("tiga-tiganya"), W("tiga-tiganya") + m.sec(0.15), W("tiga-tiganya") + m.sec(0.3)], at: levelAt, label: "Lebih matang", labelAt: W("lebih matang") },
    { ticks: [W("Baru satu"), W("atau dua")], at: W("Baru satu"), label: "Berkembang", labelAt: W("masih berkembang") },
    { ticks: [], at: W("Belum ada"), label: "Pemula", labelAt: W("masih pemula") },
  ];

  return (
    <Stage>
      <SoftGround f={g} />

      {/* A — the question */}
      <Appear at={qAt + m.sec(0.15)} out={planeAt} style={{ left: 0, top: 0 }}>
        <Card x={CX - 560} y={360} w={1120} h={230} style={{ display: "flex", alignItems: "center", gap: 40, padding: "0 56px" }}>
          <IsoIcon name="wheel" h={120} />
          <div>
            <div style={{ ...typeStyle("label"), color: c.slate }}>Pertanyaan kedua</div>
            <div style={{ marginTop: 8, ...typeStyle("title"), fontWeight: 500, color: c.ink, opacity: ease(f, W("kamu sudah bisa"), m.reveal) }}>Kamu sudah bisa mengemudikannya belum?</div>
          </div>
        </Card>
      </Appear>
      <Appear at={planeAt} out={keyAt} style={{ left: 0, top: 0 }}>
        <Heading n={2} text="Kamu sudah bisa mengemudikannya belum?" />
      </Appear>

      {/* B–C — the licence, and what it is made of */}
      <Appear at={planeAt} out={levelAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Appear at={W("bawa pesawat")} style={{ left: 0, top: 0 }}>
          <Card x={HUB.x} y={HUB.y} w={HUB.w} h={HUB.h} line={ease(f, licAt, m.reveal) > 0.5 ? theme.color.hairlineBrand : undefined}>
            <Vehicle name="plane" cx={HUB.w / 2} cy={170} h={170} />
            <div style={{ position: "absolute", left: 0, top: 300, width: HUB.w, textAlign: "center", ...typeStyle("title"), fontWeight: 500, color: c.ink, opacity: ease(f, licAt, m.reveal) }}>Lisensi</div>
          </Card>
        </Appear>
        {ROWS.map((r, i) => {
          const y = NODE.ys[i];
          const filled = ease(f, W(r.titleAt), m.reveal);
          const active = ease(f, rowAt[i], m.move);
          const later = i < 2 ? ease(f, rowAt[i + 1], m.move) : 0;
          const focus = 1 - 0.5 * (1 - active) * ease(f, rowAt[0], m.move) - 0.5 * later;
          return (
            <div key={r.title} style={{ position: "absolute", inset: 0, opacity: focus }}>
              <Connector a={HUB_OUT} b={{ x: NODE.x, y: y + NODE.h / 2 }} p={ease(f, threeAt + m.sec(0.15) * i, m.sec(0.55))} shape="elbow" dot={i === 0} />
              <Appear at={threeAt + m.sec(0.15) * i + m.sec(0.3)} style={{ left: 0, top: 0 }}>
                <Card x={NODE.x} y={y} w={NODE.w} h={NODE.h}>
                  <div style={{ position: "absolute", left: 30, top: 28, display: "flex", alignItems: "center", gap: 22 }}>
                    <NumRing n={i + 1} size={46} />
                    <div style={{ position: "relative", height: 46, display: "flex", alignItems: "center" }}>
                      <div style={{ width: 340, height: 20, borderRadius: 999, background: theme.color.neutralDisc, opacity: 1 - filled }} />
                      <div style={{ position: "absolute", left: 0, top: 0, height: 46, display: "flex", alignItems: "center", whiteSpace: "nowrap", ...typeStyle("body"), color: c.ink, opacity: filled }}>{r.title}</div>
                    </div>
                  </div>
                  <div style={{ position: "absolute", right: 30, top: 28 }}>
                    <OpenBox size={46} />
                  </div>
                  <div style={{ position: "absolute", left: 98, top: 100, display: "flex", gap: 14 }}>
                    {r.chips.map((ch) => {
                      const p = ease(f, W(ch.at), m.reveal);
                      return (
                        <div key={ch.text} style={{ padding: "8px 20px", borderRadius: 999, boxShadow: `inset 0 0 0 2px ${theme.color.hairlineBrand}`, opacity: p, transform: `translateY(${((1 - p) * 8).toFixed(2)}px)`, ...typeStyle("label"), fontSize: 26, color: c.ink, whiteSpace: "nowrap" }}>{ch.text}</div>
                      );
                    })}
                  </div>
                </Card>
              </Appear>
            </div>
          );
        })}
      </Appear>

      {/* D — three levels, by how many are ticked */}
      <Appear at={levelAt} out={keyAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        {levels.map((lv, i) => (
          <Appear key={lv.label} at={lv.at} style={{ left: 0, top: 0 }}>
            <Card x={CX - LV.w / 2} y={LV.ys[i]} w={LV.w} h={LV.h} style={{ display: "flex", alignItems: "center", gap: 56, padding: "0 56px" }}>
              <div style={{ display: "flex", gap: 16 }}>
                {[0, 1, 2].map((k) => (
                  <Tick key={k} size={LV.tick} at={lv.ticks[k]} />
                ))}
              </div>
              <div style={{ ...typeStyle("title"), fontWeight: 500, color: c.ink, opacity: ease(f, lv.labelAt, m.reveal) }}>{lv.label}</div>
            </Card>
          </Appear>
        ))}
        <Appear at={W("Dan itu normal")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
          <Line x={0} y={850} w={theme.canvas.width} align="center" size={44} weight={500} text="Dan itu normal." mark="normal" />
        </Appear>
      </Appear>

      {/* E — daring is not steering */}
      <Appear at={W("berani menghadapi ombak")} style={{ left: 0, top: 0, width: theme.canvas.width }}>
        <Line x={theme.margin.left} y={250} w={theme.canvas.width - theme.margin.left - theme.margin.right} align="center" size={48} weight={500} text="Berani menghadapi ombak bukan berarti sudah bisa bawa pesawat." mark="bukan berarti" />
      </Appear>
      {(
        [
          { icon: "waves", title: "“Berani”", word: "toleransi", at: W("berani", 1), wordAt: W("toleransi") },
          { icon: "wheel", title: "“Bisa mengemudikan”", word: "kemampuan", at: W("bisa mengemudikan"), wordAt: W("kemampuan") },
        ] as const
      ).map((a, i) => (
        <Appear key={a.title} at={a.at} style={{ left: 0, top: 0 }}>
          <Card x={ansX(i)} y={ANS.y} w={ANS.w} h={ANS.h} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 40px" }}>
            <IsoIcon name={a.icon} h={96} />
            <div>
              <div style={{ ...typeStyle("title"), fontSize: 44, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>{a.title}</div>
              <div style={{ marginTop: 6, ...typeStyle("body"), color: c.slate, opacity: ease(f, a.wordAt - m.sec(0.3), m.reveal) }}>
                bicara soal <span style={{ color: c.indigo }}>{a.word}</span>.
              </div>
            </div>
          </Card>
        </Appear>
      ))}
      <Appear at={W("bisa mengemudikan")} style={{ left: CX - 40, top: ANS.y + ANS.h / 2 - 40, width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...typeStyle("statement"), fontWeight: 400, color: c.slate }}>≠</div>
      </Appear>
    </Stage>
  );
};
