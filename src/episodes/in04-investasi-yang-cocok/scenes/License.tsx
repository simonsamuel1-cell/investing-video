/**
 * IN04 · SC05 — "Kamu Sudah Bisa Mengemudikannya Belum?", rebuilt to Benchmark v1 + minimal (STYLE.md §0; Simon,
 * 22 Oct 2026) from the ChatGPT storyboard docs/vi-style/storyboards/IN04-SC05-v2.jpg.
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
import { Connector, SoftGround, Stage, theme, typeStyle, useMotion, usePalette, useShadow } from "../../../core";
import { BLOCK } from "../data/timing";
import { mixFrame } from "../components/Islands";
import { Appear, BoardGrid, Card, dockStyle, ease, IsoIcon, Line, NumRing, QUESTION_CARD, useWords, Vehicle } from "../components/kit";
import { HARBOUR_SIZE } from "../components/HarbourMap";
import { usePetaBaru } from "../components/PetaSwitch";
import { MapCamera, mapInto } from "../components/RouteMap";

const CX = theme.canvas.width / 2;

// B–C — the licence and its three parts
const HUB_PIC = { x: 140, y: 320, w: 480, h: 420 };
/**
 * On the master route map (the boss's SC05 notes, 3 Nov 2026 — only the picture changes, the licence stays): on "Kalau
 * memilih saham sendiri seperti bawa pesawat" the whole map comes up under the docked question — Kamu at one end,
 * TUJUAN INVESTASI far away at the other — and the plane's way draws, the most direct one, taking off right by Kamu;
 * the other two stay hidden. On "kita perlu punya lisensi" the map moves into the licence card, in the plane
 * picture's place (kept, for PETA_BARU = false), with "Perlu lisensi" under it. The card is wider than the picture's
 * so the map is not too small, and centred on the three nodes.
 */
const HUB_MAP = { x: 140, y: 340, w: 560, h: 470, pad: 20, textTop: 388 };
const MAP_ASPECT = HARBOUR_SIZE.simple.w / HARBOUR_SIZE.simple.h;
const MAP_IN_HUB = { x: HUB_MAP.x + HUB_MAP.pad, w: HUB_MAP.w - 2 * HUB_MAP.pad, cy: HUB_MAP.y + HUB_MAP.pad + (HUB_MAP.w - 2 * HUB_MAP.pad) / MAP_ASPECT / 2 };
/** The whole map, between the docked question card and the subtitle band. */
const MAP_WHOLE = { top: 240, bottom: theme.captionBand.top - 22 };
const MAP_SHOWN_W = (MAP_WHOLE.bottom - MAP_WHOLE.top) * MAP_ASPECT;
const MAP_SHOWN = { x: (theme.canvas.width - MAP_SHOWN_W) / 2, w: MAP_SHOWN_W, cy: (MAP_WHOLE.top + MAP_WHOLE.bottom) / 2 };
/** Only the plane's way is told here: the other two stay hidden. */
const PLANE_ONLY = [0, 0, 1];
const NODE = { x: 780, w: 1000, h: 170, ys: [280, 490, 700] };
type Row = { title: string; at: string; titleAt: string; chips: { text: string; at: string }[] };
const ROWS: Row[] = [
  { title: "Paham apa yang dilihat", at: "Pertama", titleAt: "kamu paham", chips: [{ text: "Laporan keuangan", at: "Laporan keuangan" }, { text: "Indikator teknikal", at: "indikator teknikal" }] },
  { title: "Punya logika sendiri", at: "Kedua, kamu punya", titleAt: "punya logika", chips: [{ text: "Kenapa beli?", at: "Kenapa beli" }, { text: "Kapan harus jual?", at: "Kapan harus jual" }, { text: "Bisa jelasin sendiri?", at: "Bisa jelasin" }] },
  { title: "Pernah melewati “badai”", at: "Ketiga", titleAt: "pernah melewati badai", chips: [{ text: "Punya pengalaman", at: "Punya pengalaman" }, { text: "Market crash tanpa panik", at: "market crash" }] },
];

// D — the levels
const LV = { w: 900, h: 130, ys: [300, 460, 620], tick: 52 };

// E — daring is not steering
// stacked, one line each (Simon, 22 Oct: "atas bawah aja", no ≠)
const ANS = { w: 960, h: 160, ys: [400, 600], icon: 124 };

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
  const shadow = useShadow();
  const g = f + BLOCK.SC05;
  const baru = usePetaBaru();
  const HUB = baru ? HUB_MAP : HUB_PIC;
  const HUB_OUT = { x: HUB.x + HUB.w, y: HUB.y + HUB.h / 2 };

  const qAt = W("Pertanyaan kedua");
  const planeAt = W("Kalau memilih saham");
  const licAt = W("punya “lisensi”");
  const threeAt = W("tiga hal");
  const levelAt = W("Kalau tiga-tiganya");
  const keyAt = W("Yang penting diingat");
  const rowAt = ROWS.map((r) => W(r.at));
  // B on the map: up once the question has docked; the plane's way draws on "bawa pesawat"; into the card on "kita perlu"
  const mapOn = ease(f, planeAt + m.move, m.reveal);
  const flyFor = m.sec(0.9);
  const flyAt = W("bawa pesawat");
  const intoAt = W("kita perlu");
  const into = ease(f, intoAt, m.sec(1.0));
  const hubAt = baru ? intoAt + m.sec(0.5) : W("bawa pesawat");

  const levels = [
    { ticks: [W("tiga-tiganya"), W("tiga-tiganya") + m.sec(0.15), W("tiga-tiganya") + m.sec(0.3)], at: levelAt, label: "Kemampuan matang", labelAt: W("lebih matang") },
    { ticks: [W("Baru satu"), W("atau dua")], at: W("Baru satu"), label: "Masih berkembang", labelAt: W("masih berkembang") },
    { ticks: [], at: W("Belum ada"), label: "Pemula", labelAt: W("masih pemula") },
  ];

  return (
    <Stage>
      <SoftGround f={g} />
      <BoardGrid g={g} on={1} />

      {/* A — the question */}
      {/* …then, on "Kalau memilih saham", it shrinks into the top left and stays as the heading — as SC04's does */}
      <Appear at={qAt + m.sec(0.15)} out={keyAt} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <div style={dockStyle(ease(f, planeAt, m.move))}>
          <Card x={QUESTION_CARD.x} y={QUESTION_CARD.y} w={QUESTION_CARD.w} h={QUESTION_CARD.h} style={{ display: "flex", alignItems: "center", gap: 40, padding: "0 56px" }}>
            <IsoIcon name="wheel" h={120} />
            <div>
              <div style={{ ...typeStyle("label"), color: c.slate }}>Pertanyaan kedua</div>
              <div style={{ marginTop: 8, ...typeStyle("title"), fontWeight: 500, color: c.ink, opacity: ease(f, W("kamu sudah bisa"), m.reveal) }}>Kamu sudah bisa mengemudikannya belum?</div>
            </div>
          </Card>
        </div>
      </Appear>

      {/* B–C — the licence, and what it is made of */}
      <Appear at={planeAt} out={levelAt} rise={0} style={{ left: 0, top: 0, width: theme.canvas.width, height: theme.canvas.height }}>
        <Appear at={hubAt} style={{ left: 0, top: 0 }}>
          <Card x={HUB.x} y={HUB.y} w={HUB.w} h={HUB.h} line={ease(f, licAt, m.reveal) > 0.5 ? theme.color.hairlineBrand : undefined}>
            {baru ? null : <Vehicle name="plane" cx={HUB.w / 2} cy={170} h={170} />}
            <div style={{ position: "absolute", left: 0, top: baru ? HUB_MAP.textTop : 300, width: HUB.w, textAlign: "center", ...typeStyle("title"), fontWeight: 500, color: c.ink, opacity: ease(f, licAt, m.reveal) }}>Perlu lisensi</div>
          </Card>
        </Appear>
        {baru && mapOn > 0.001 ? (
          <div style={{ position: "absolute", inset: 0, opacity: mapOn }}>
            <MapCamera fr={mixFrame(mapInto(MAP_SHOWN), mapInto(MAP_IN_HUB), into)} g={g} landAt={-1000} riverAt={-1000} youAt={-1000} goalAt={-1000} routesAt={flyAt - 2 * flyFor} drawFor={flyFor} lit={PLANE_ONLY} />
          </div>
        ) : null}
        {ROWS.map((r, i) => {
          const y = NODE.ys[i];
          const filled = ease(f, W(r.titleAt), m.reveal);
          const active = ease(f, rowAt[i], m.move);
          const later = i < 2 ? ease(f, rowAt[i + 1], m.move) : 0;
          const focus = 1 - 0.5 * (1 - active) * ease(f, rowAt[0], m.move) - 0.5 * later;
          /** the row being said glows indigo (Simon, 22 Oct) — until the next one takes over, or the levels come */
          const glow = ease(f, rowAt[i] + m.sec(0.2), m.reveal) * (1 - later) * (1 - ease(f, levelAt, m.fade));
          return (
            <div key={r.title} style={{ position: "absolute", inset: 0, opacity: focus }}>
              <Connector a={HUB_OUT} b={{ x: NODE.x, y: y + NODE.h / 2 }} p={ease(f, threeAt + m.sec(0.15) * i, m.sec(0.55))} shape="elbow" dot={i === 0} />
              <Appear at={threeAt + m.sec(0.15) * i + m.sec(0.3)} style={{ left: 0, top: 0 }}>
                <Card x={NODE.x} y={y} w={NODE.w} h={NODE.h} style={{ boxShadow: `${shadow.soft}, 0 0 ${(40 * glow).toFixed(1)}px ${(9 * glow).toFixed(1)}px ${theme.color.indigoGlow}` }}>
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
          { icon: "waves", title: "“Berani”", word: "Toleransi", at: W("berani", 1), wordAt: W("toleransi") },
          { icon: "wheel", title: "“Mengemudikan”", word: "Kemampuan", at: W("bisa mengemudikan"), wordAt: W("kemampuan") },
        ] as const
      ).map((a, i) => (
        <Appear key={a.title} at={a.at} style={{ left: 0, top: 0 }}>
          <Card x={CX - ANS.w / 2} y={ANS.ys[i]} w={ANS.w} h={ANS.h} style={{ display: "flex", alignItems: "center", gap: 34, padding: "0 48px" }}>
            {/* one slot for both icons, so the two lines start at the same x */}
            <div style={{ width: ANS.icon, display: "flex", justifyContent: "center", flex: "none" }}>
              <IsoIcon name={a.icon} h={96} />
            </div>
            <div style={{ ...typeStyle("title"), fontSize: 44, fontWeight: 500, color: c.ink, whiteSpace: "nowrap" }}>
              {a.title} = <span style={{ color: c.indigo, opacity: ease(f, a.wordAt - m.sec(0.3), m.reveal) }}>{a.word}</span>
            </div>
          </Card>
        </Appear>
      ))}
    </Stage>
  );
};
