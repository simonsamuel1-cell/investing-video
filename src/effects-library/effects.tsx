/**
 * effects-library/effects.tsx — the catalogue behind the Effects Library panel (Simon, 24 Nov 2026). One entry = one effect that
 * exists in the episodes, shown through ITS OWN component, never a copy. Codes are permanent: "SC05 pakai TX-03" must mean the
 * same effect next year, so a retired code is not reused. usage.json (which video uses it) is written by
 * scripts/effects-usage.mjs from the episodes' imports. Sample words and prices here are placeholders, never facts.
 */
import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import {
  Candles, Chip, Connector, Countdown, Cursor, DashedBox, HighlightBox, HighlightCircle, IndicatorLine, KeyPoint,
  Level, MarkerArrow, PaletteProvider, Panel, Ping, QuizTitle, RollList, SoftGround, SpeechBubble, SplitDivider, StepRail, TabRow,
  Title, TuntunMark, VerdictMark, VolumeBars, Words, Zone, bollinger, cutInStyle, cutOutStyle, domainOf, fmtRp, fromShape, gridOf, popIn,
  progress, progressInOut, sma, theme, typeStyle, useMotion, usePalette, volumeOf, type Cut,
} from "../core";
import { BollingerBands } from "../episodes/019-moving-average/components/BollingerBands";
import EXCERPTS from "./excerpts.json";
import { GlitchSwap, LowerThird, TypeBox, DashBox as CentreDashBox } from "../episodes/in01-passive-income/components/kit";
import { CheckBox } from "../episodes/in04-investasi-yang-cocok/components/kit";
import { Gauge, VoiceBubble } from "../episodes/in07-cara-tuntun-membantu-investor/components/kit";
import { SpinCoin } from "../episodes/in07-cara-tuntun-membantu-investor/components/SpinCoin";

export type Effect = { id: string; group: string; name: string; how: string; symbol: string; C: React.FC; /** An excerpt of a finished video: where it plays. */ from?: { video: string; start: number; comp: string }; /** Draws the demo larger, for effects that are small on a full frame. */ zoom?: number };

const CX = theme.canvas.width / 2;
const CY = theme.canvas.height / 2;
export const EFFECT_FRAMES = 180;
const AT = 20;

const Sample = ({ text }: { text: string }) => {
  const c = usePalette();
  return <div style={{ position: "absolute", left: CX - 380, top: CY - 190, width: 760, height: 380, borderRadius: theme.shape.cardRadius, background: c.cardBg, boxShadow: `inset 0 0 0 4px ${c.indigo}`, display: "flex", alignItems: "center", justifyContent: "center", ...typeStyle("title"), fontSize: 80, color: c.ink }}>{text}</div>;
};
const CutDemo = ({ cut }: { cut: Cut }) => {
  const f = useCurrentFrame();
  return f < cut.at ? <AbsoluteFill style={cutOutStyle(f, cut)}><Sample text="Scene A" /></AbsoluteFill> : <AbsoluteFill style={cutInStyle(f, cut)}><Sample text="Scene B" /></AbsoluteFill>;
};

// one made-up tape for every chart entry
const S = fromShape({ n: 32, start: 1000, shape: "sideways", noise: 5, seed: 23, wickScale: 1.4 });
const BOX = { x: 200, y: 180, w: 1520, h: 600 };
const G = gridOf(S.closes, domainOf(S.closes, S.bars), BOX);
const [LO, HI] = domainOf(S.closes, S.bars);
const BANDS = bollinger(S.closes, 8);
const VOL = volumeOf(S.bars, 5);
const Tape = () => <Candles bars={S.bars} grid={G} />;

export const EFFECTS: Effect[] = [
  // ── Transisi
  { id: "TX-01", group: "Transisi", name: "Camera cut ke samping", how: "Scene bergeser dan buram sebentar di titik potong", symbol: "cutInStyle", C: () => <CutDemo cut={{ at: 90, over: 40, distance: 120, blur: 10, axis: "x" }} /> },
  { id: "TX-02", group: "Transisi", name: "Camera cut ke atas", how: "Sama, arahnya vertikal", symbol: "cutInStyle", C: () => <CutDemo cut={{ at: 90, over: 40, distance: 120, blur: 10, axis: "y" }} /> },
  { id: "TX-03", group: "Transisi", name: "Camera push in", how: "Kamera mendekat lalu pindah scene", symbol: "cutInStyle", C: () => <CutDemo cut={{ at: 90, over: 40, blur: 10, axis: "zoom", origin: { x: CX, y: CY }, amount: 0.35 }} /> },
  { id: "TX-04", group: "Transisi", name: "Garis pembagi dua", how: "Layar terbelah dua oleh garis yang tumbuh", symbol: "SplitDivider", C: () => <><Panel rect={theme.stage.card} at={0} /><SplitDivider at={AT} over={40} /></> },
  // ── Teks
  { id: "TK-01", group: "Teks", name: "Judul naik", how: "Judul dan subjudul muncul sambil naik", symbol: "Title", zoom: 2.4, C: () => <Title text="Judul scene" sub="Subjudul" at={AT} y={CY} /> },
  { id: "TK-02", group: "Teks", name: "Kata per kata", how: "Kata muncul satu per satu", symbol: "Words", C: () => <Words text="Kata muncul satu per satu" x={CX} y={CY} at={AT} size={72} stagger={14} /> },
  { id: "TK-03", group: "Teks", name: "Highlighter", how: "Frasa disapu warna seperti stabilo", symbol: "Words", C: () => <Words text="Frasa yang penting disorot" x={CX} y={CY} at={AT} size={72} stagger={4} marks={[{ text: "yang penting", color: theme.color.indigoWash }]} markAt={80} /> },
  { id: "TK-04", group: "Teks", name: "Seleksi mouse", how: "Frasa diblok seperti ditarik kursor", symbol: "Words", C: () => <Words text="Frasa yang penting disorot" x={CX} y={CY} at={AT} size={72} stagger={4} marks={[{ text: "yang penting", color: theme.color.indigoWash }]} markAt={80} markStyle="selection" /> },
  { id: "TK-05", group: "Teks", name: "Garis bawah tumbuh", how: "Garis bawah digambar kiri ke kanan", symbol: "Words", C: () => <Words text="Frasa yang penting disorot" x={CX} y={CY} at={AT} size={72} stagger={4} marks={[{ text: "yang penting", color: theme.color.indigo }]} markAt={80} markStyle="underline" /> },
  { id: "TK-06", group: "Teks", name: "Text box ketik", how: "Kotak putus-putus terbuka, teks diketik", symbol: "TypeBox", zoom: 1.6, C: () => <TypeBox cx={CX} y={CY - 60} w={900} at={AT} typeAt={AT + 40} text="Teks diketik di dalam kotak" mark="diketik" /> },
  { id: "TK-07", group: "Teks", name: "Glitch ganti teks", how: "Satu teks pecah dan berubah jadi teks lain", symbol: "GlitchSwap", C: () => <GlitchSwap from="Teks lama" to="Teks baru" x={CX} y={CY} at={60} span={45} size={96} /> },
  { id: "TK-08", group: "Teks", name: "Nama tokoh", how: "Huruf outline lalu terisi, jabatan diketik", symbol: "LowerThird", zoom: 1.7, C: () => <LowerThird first="Nama" last="Tokoh" role="Jabatan" at={AT} out={130} cx={CX} y={CY - 80} /> },
  { id: "TK-09", group: "Teks", name: "Judul kuis", how: "Besar di tengah, lalu mengecil ke pojok", symbol: "QuizTitle", C: () => <QuizTitle text="Judul kuis" at={AT} hold={50} walk={40} /> },
  { id: "TK-10", group: "Teks", name: "Poin kunci", how: "Satu kalimat besar di tengah kartu", symbol: "KeyPoint", zoom: 1.2, C: () => <KeyPoint text="Satu kalimat kunci" sub="Keterangan pendek" at={AT} /> },
  { id: "TK-11", group: "Teks", name: "Daftar berputar", how: "Daftar menggulung, yang aktif membesar", symbol: "RollList", C: () => <RollList items={["Pertama", "Kedua", "Ketiga"]} select={[AT, 70, 120]} at={AT} x={CX} y={CY} lead={110} size={64} grow={14} roll={24} anchor="center" /> },
  // ── Kotak & sorotan
  { id: "KT-01", group: "Kotak & sorotan", name: "Kotak putus-putus dari tengah", how: "Text box standar, terbuka pelan dari tengah", symbol: "DashBox", zoom: 1.3, C: () => <CentreDashBox cx={CX} y={CY - 110} w={900} h={220} at={AT} closeAt={140} /> },
  { id: "KT-02", group: "Kotak & sorotan", name: "Kotak putus-putus dari kiri", how: "Versi TA, terbuka dari kiri", symbol: "DashedBox", zoom: 1.3, C: () => <DashedBox x={CX - 450} y={CY - 110} w={900} h={220} at={AT} /> },
  { id: "KT-03", group: "Kotak & sorotan", name: "Kotak sorot", how: "Kotak indigo tumbuh menandai area", symbol: "HighlightBox", C: () => { const f = useCurrentFrame(); return <HighlightBox rect={{ x1: CX - 400, y1: CY - 130, x2: CX + 400, y2: CY + 130 }} grow={progressInOut(f, AT, 45)} opacity={progress(f, AT, 12)} />; } },
  { id: "KT-04", group: "Kotak & sorotan", name: "Lingkaran sorot", how: "Cincin mengecil lalu mendarat di titik", symbol: "HighlightCircle", C: () => { const f = useCurrentFrame(); return <HighlightCircle cx={CX} cy={CY} r={170} land={progressInOut(f, AT, 40)} />; } },
  { id: "KT-05", group: "Kotak & sorotan", name: "Ping", how: "Titik dengan riak, menunjuk satu tempat", symbol: "Ping", zoom: 4, C: () => <Ping cx={CX} cy={CY} at={AT} label="1" /> },
  { id: "KT-06", group: "Kotak & sorotan", name: "Panah spidol", how: "Panah digambar tangan, lalu kepalanya", symbol: "MarkerArrow", C: () => <MarkerArrow from={{ x: CX - 420, y: CY + 170 }} to={{ x: CX + 360, y: CY - 130 }} bow={120} at={AT} over={50} /> },
  // ── Penghubung
  { id: "PH-01", group: "Penghubung", name: "Garis tumbuh lengkung", how: "Garis mengalir dari satu objek ke objek lain", symbol: "Connector", C: () => { const f = useCurrentFrame(); return <Connector a={{ x: 420, y: 300 }} b={{ x: 1500, y: 760 }} p={progressInOut(f, AT, 60)} width={5} />; } },
  { id: "PH-02", group: "Penghubung", name: "Garis siku", how: "Garis mind map dengan sudut bulat", symbol: "Connector", C: () => { const f = useCurrentFrame(); return <>{[300, 540, 780].map((y, i) => <Connector key={y} a={{ x: 480, y: CY }} b={{ x: 1440, y }} p={progressInOut(f, AT + i * 12, 50)} shape="elbow" width={5} />)}</>; } },
  { id: "PH-03", group: "Penghubung", name: "Denyut di garis", how: "Cahaya kecil berjalan di sepanjang garis", symbol: "Connector", C: () => { const f = useCurrentFrame(); return <Connector a={{ x: 420, y: 300 }} b={{ x: 1500, y: 760 }} p={1} pulse={progress(f, 40, 100)} tone={theme.color.indigo} width={8} />; } },
  { id: "PH-04", group: "Penghubung", name: "Busur putus-putus", how: "Lengkung putus-putus, misalnya lompatan waktu", symbol: "Connector", C: () => { const f = useCurrentFrame(); return <Connector a={{ x: 420, y: 720 }} b={{ x: 1500, y: 720 }} p={progressInOut(f, AT, 60)} shape="arc" bend={360} dashed dash="14 12" width={5} />; } },
  // ── Chart
  { id: "CH-01", group: "Chart", name: "Candle muncul", how: "Candle tampil kiri ke kanan", symbol: "Candles", C: () => { const f = useCurrentFrame(); return <Candles bars={S.bars} grid={G} shown={progress(f, AT, 120)} />; } },
  { id: "CH-02", group: "Chart", name: "Garis indikator", how: "Garis rata-rata digambar di atas candle", symbol: "IndicatorLine", C: () => <><Tape /><IndicatorLine values={sma(S.closes, 6)} grid={G} at={AT} over={100} /></> },
  { id: "CH-03", group: "Chart", name: "Pita Bollinger", how: "Pita membuka dari garis tengahnya", symbol: "BollingerBands", C: () => { const f = useCurrentFrame(); return <><Tape /><BollingerBands mid={BANDS.mid} upper={BANDS.upper} lower={BANDS.lower} grid={G} unfold={progressInOut(f, AT, 90)} midTrace={progress(f, 0, 30)} /></>; } },
  { id: "CH-04", group: "Chart", name: "Garis level", how: "Garis harga tumbuh dengan label", symbol: "Level", C: () => <><Tape /><Level value={LO + (HI - LO) * 0.6} grid={G} at={AT} over={60} label="Level" /></> },
  { id: "CH-05", group: "Chart", name: "Zona", how: "Area harga terisi warna", symbol: "Zone", C: () => <><Tape /><Zone hi={LO + (HI - LO) * 0.8} lo={LO + (HI - LO) * 0.6} grid={G} at={AT} over={60} label="Zona" /></> },
  { id: "CH-06", group: "Chart", name: "Batang volume", how: "Volume tumbuh di bawah candle", symbol: "VolumeBars", C: () => { const f = useCurrentFrame(); return <VolumeBars bars={S.bars} volume={VOL} grid={G} box={{ x: 200, y: 400, w: 1520, h: 380 }} shown={progress(f, AT, 110)} />; } },
  // ── UI
  { id: "UI-01", group: "UI", name: "Pill", how: "Label kapsul muncul", symbol: "Chip", zoom: 2, C: () => <Chip label="Label" x={CX} y={CY} at={AT} pill size={64} /> },
  { id: "UI-02", group: "UI", name: "Pill dengan garis tunjuk", how: "Label dengan garis ke objek", symbol: "Chip", zoom: 1.4, C: () => <Chip label="Label" x={CX - 260} y={CY - 180} at={AT} pill size={54} leaderTo={{ x: CX + 280, y: CY + 160 }} /> },
  { id: "UI-03", group: "UI", name: "Kartu pop", how: "Kartu membesar pelan saat muncul", symbol: "Panel", C: () => <Panel rect={{ x: CX - 380, y: CY - 190, w: 760, h: 380 }} at={AT} /> },
  { id: "UI-04", group: "UI", name: "Rel langkah", how: "Daftar langkah, yang selesai dicentang", symbol: "StepRail", C: () => <StepRail steps={[{ n: "1", label: "Pertama" }, { n: "2", label: "Kedua" }, { n: "3", label: "Ketiga" }]} at={AT} active={1} done={[0]} /> },
  { id: "UI-05", group: "UI", name: "Tab berpindah", how: "Tab aktif membesar bergantian", symbol: "TabRow", zoom: 2, C: () => <TabRow tabs={["Pertama", "Kedua", "Ketiga"]} select={[AT, 70, 120]} x={CX} y={CY - 30} at={AT} size={54} lift={10} gap={60} /> },
  { id: "UI-06", group: "UI", name: "Balon bicara", how: "Balon tumbuh dari ujungnya", symbol: "SpeechBubble", zoom: 1.6, C: () => <SpeechBubble label="Halo" x={CX - 260} y={CY - 130} w={520} h={220} at={AT} /> },
  { id: "UI-07", group: "UI", name: "Pesan suara", how: "Balon voice note yang diputar", symbol: "VoiceBubble", zoom: 1.8, C: () => { const f = useCurrentFrame(); return <div style={{ position: "absolute", left: CX - 420, top: CY - 114 }}><VoiceBubble played={progress(f, AT, 130)} scale={3} /></div>; } },
  { id: "UI-08", group: "UI", name: "Kursor klik", how: "Kursor berjalan ke target", symbol: "Cursor", C: () => { const f = useCurrentFrame(); const p = progressInOut(f, AT, 70); return <Cursor x={CX - 400 + 400 * p} y={CY + 250 - 250 * p} size={90} />; } },
  { id: "UI-09", group: "UI", name: "Checkbox", how: "Kotak terisi centang", symbol: "CheckBox", zoom: 1.6, C: () => <div style={{ position: "absolute", left: CX - 100, top: CY - 100 }}><CheckBox size={200} checkAt={60} /></div> },
  { id: "UI-10", group: "UI", name: "Centang pop", how: "Badge hijau memantul saat muncul", symbol: "VerdictMark", C: () => { const f = useCurrentFrame(); const m = useMotion(); const q = popIn(f, AT, m.sec(0.5)); return <div style={{ position: "absolute", left: CX - 100, top: CY - 100, opacity: q.opacity, transform: `scale(${q.scale})` }}><VerdictMark kind="check" size={200} /></div>; } },
  { id: "UI-11", group: "UI", name: "Hitung mundur", how: "3, 2, 1", symbol: "Countdown", C: () => <Countdown beats={[AT, 70, 120]} /> },
  // ── Angka & data
  { id: "DT-01", group: "Angka & data", name: "Angka berjalan", how: "Nilai rupiah naik sampai angka akhir", symbol: "fmtRp", C: () => { const f = useCurrentFrame(); const c = usePalette(); return <div style={{ position: "absolute", left: 0, right: 0, top: CY - 80, textAlign: "center", ...typeStyle("title"), fontSize: 130, color: c.indigo, fontVariantNumeric: "tabular-nums" }}>{fmtRp(1_000_000 * progressInOut(f, AT, 110))}</div>; } },
  { id: "DT-02", group: "Angka & data", name: "Gauge", how: "Jarum setengah lingkaran bergerak", symbol: "Gauge", C: () => { const f = useCurrentFrame(); return <div style={{ position: "absolute", left: CX, top: CY, transform: "translate(-50%, -50%) scale(2.4)" }}><Gauge angle={160 - 120 * progressInOut(f, AT, 110)} /></div>; } },
  { id: "DT-03", group: "Angka & data", name: "Koin berputar", how: "Koin berputar pada porosnya", symbol: "SpinCoin", C: () => { const f = useCurrentFrame(); const m = useMotion(); return <SpinCoin t={f / m.sec(1)} p={progress(f, AT, 30)} x={CX} y={CY} phase={0} id="fx-coin" d={320} />; } },
  // ── Latar & maskot
  { id: "LT-01", group: "Latar & maskot", name: "Latar lembut", how: "Dua kabut warna bergerak pelan", symbol: "SoftGround", C: () => <SoftGround f={useCurrentFrame() * 6} /> },
  { id: "LT-02", group: "Latar & maskot", name: "Maskot melayang", how: "Maskot Tuntun naik turun pelan", symbol: "TuntunMark", C: () => { const f = useCurrentFrame(); return <TuntunMark x={CX} y={CY - 160 + 14 * Math.sin((f / EFFECT_FRAMES) * Math.PI * 4)} height={320} />; } },
];

/** Effects that live inside a scene: the real thing, as a muted clip of the finished video (scripts/effects-excerpts.mjs). */
EFFECTS.push(
  ...EXCERPTS.map((x) => ({
    id: x.id, group: x.group, name: x.name, how: x.how, symbol: "",
    from: { video: x.video, start: x.start, comp: x.comp },
    C: () => <OffthreadVideo muted src={staticFile(`effects-library/${x.id}.mp4`)} style={{ width: "100%", height: "100%" }} />,
  })),
);
/** The groups in the panel's order; inside a group, by code. */
const ORDER = ["Transisi", "Kamera", "Teks", "Kotak & sorotan", "Penghubung", "Chart", "UI", "Angka & data", "Orang & ilustrasi", "Latar & maskot"];
EFFECTS.sort((a, b) => ORDER.indexOf(a.group) - ORDER.indexOf(b.group) || a.id.localeCompare(b.id));

const ids = new Set(EFFECTS.map((e) => e.id));
if (ids.size !== EFFECTS.length) throw new Error("effects-library: duplicate code");

/** An effect on its own stage — what the panel plays and what its composition shows. */
export const EffectStage = ({ C, zoom = 1 }: { C: React.FC; zoom?: number }) => {
  const c = theme.color;
  return (
    <AbsoluteFill style={{ background: c.bg }}>
      <PaletteProvider>
        <AbsoluteFill style={zoom === 1 ? undefined : { transform: `scale(${zoom})` }}>
          <C />
        </AbsoluteFill>
      </PaletteProvider>
    </AbsoluteFill>
  );
};
export const effectComp = (e: Effect): React.FC => {
  const Comp: React.FC = () => <EffectStage C={e.C} zoom={e.zoom} />;
  Comp.displayName = e.id;
  return Comp;
};
/** Stable components, made once: a new component per render would remount the composition. */
export const effectFrames = (e: Effect) => (e.from ? 360 : EFFECT_FRAMES);
export const EFFECT_COMPS = EFFECTS.map((e) => ({ e, Comp: effectComp(e) }));
