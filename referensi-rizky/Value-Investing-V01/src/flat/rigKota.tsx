import React from 'react';
import { B } from '../theme';
import { BAYANGAN, lebarBayangan, type Pose } from './rigTegak';
import { KOTA, SENDI_KOTA as J, UKUR_KOTA, URUTAN_KOTA } from './priaKota.gen';
import { BAGIAN as PRIA_BIRU, KEPALA as KEPALA_PB } from './priaBiru.gen';

/**
 * RIG TOKOH KOTA (Simon 27 Okt: "@Untitled-1.svg gunakan ini untuk char yang memegang hp") — karakter pria-biru dari Untitled-1.svg Simon, dirakit
 * TEGAK di guide oleh scripts/bangun-pria-kota.py (04_Asset/karakter-flat/pria-kota_tegak.svg). Sendi sama dengan rig tokoh gua: badan berputar di
 * akar (tengah pinggul), kepala di dasar leher, lengan bahu → siku → pergelangan, kaki pinggul → lutut → pergelangan kaki; urutan lapis = file Simon.
 * Pose memakai tipe Pose rigTegak (derajat, 0 = pose dasar tegak, + = searah jarum jam). Kaki TIDAK ikut badan (badan = condong tubuh atas saja).
 * Tangan main hp = tangan pria-biru paket (grup 35 menggenggam hp tampak samping, grup 67 menunjuk) — skala 3,54 = lingkaran bahu 23,2 / 6,55.
 */
type P2 = [number, number];
type Rantai = [number, P2][];
const rad = (d: number) => (d * Math.PI) / 180;
const putar = ([x, y]: P2, d: number, [cx, cy]: P2): P2 => {
  const c = Math.cos(rad(d)), s = Math.sin(rad(d)), dx = x - cx, dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
};
const arah = (a: P2, b: P2) => (Math.atan2(-(b[0] - a[0]), b[1] - a[1]) * 180) / Math.PI; // 0 = tegak ke bawah, + = searah jarum jam
/** akar = tengah dua pinggul */
const H: P2 = [(J.pinggul[0][0] + J.pinggul[1][0]) / 2, J.pinggul[0][1]];
const PANJANG_LA = J.siku[0][1] - J.bahu[0][1], PANJANG_LB = J.perg[0][1] - J.siku[0][1];
const tf = (r: Rantai) => r.map(([d, c]) => `rotate(${d.toFixed(3)} ${c[0]} ${c[1]})`).join(' ');
const titik = (r: Rantai, q: P2): P2 => {
  let x = q;
  for (let k = r.length - 1; k >= 0; k--) x = putar(x, r[k][0], r[k][1]);
  return [x[0] - H[0], x[1] - H[1]];
};
const rantai = (p: Pose, i: 0 | 1) => {
  const bdn: Rantai = [[p.badan, H]];
  const la: Rantai = [...bdn, [p.bahu[i], J.bahu[i]]], lb: Rantai = [...la, [p.siku[i], J.siku[i]]], tg: Rantai = [...lb, [p.tangan[i], J.perg[i]]];
  const paha: Rantai = [[p.paha[i], J.pinggul[i]]], betis: Rantai = [...paha, [p.lutut[i], J.lutut[i]]], kaki: Rantai = [...betis, [p.telapak[i], J.pkaki[i]]];
  return { bdn, kepala: [...bdn, [p.kepala, J.leher]] as Rantai, la, lb, tg, paha, betis, kaki };
};

/* ── ALAS & KEPALA (untuk tanah, bayangan, kamera) ── */
/** ujung tumit & ujung jari sol (bawah sepatu) relatif pusat lingkaran pergelangan kaki (rakitan Simon: sol 849,8–970 di y 791,6) */
const SOL: P2[] = UKUR_KOTA.sol;
const titikSol = (p: Pose) => ([0, 1] as const).flatMap((i) => SOL.map((o) => titik(rantai(p, i).kaki, [J.pkaki[i][0] + o[0], J.pkaki[i][1] + o[1]])));
export const alasTerendahKota = (p: Pose) => Math.max(...titikSol(p).map((q) => q[1]));
export const rentangAlasKota = (p: Pose): P2 => { const xs = titikSol(p).map((q) => q[0]); return [Math.min(...xs), Math.max(...xs)]; };
/** pusat kepala (tengah kotak kepala, garis guide "pusat kepala") */
export const titikKepalaKota = (p: Pose): P2 => titik(rantai(p, 0).kepala, [UKUR_KOTA.pusatKepala, (UKUR_KOTA.puncak + J.leher[1]) / 2]);
export const puncakKota = (p: Pose): P2 => titik(rantai(p, 0).kepala, [UKUR_KOTA.pusatKepala, UKUR_KOTA.puncak]);

/* ── TANGAN PRIA-BIRU (main hp) ── */
const PB = 3.54;
const pasangTangan = (pusat: P2, lenganDeg: number, perg: P2) => {
  const rot = 90 - lenganDeg;
  const peta = (q: P2): P2 => { const v = putar([(q[0] - pusat[0]) * PB, (q[1] - pusat[1]) * PB], rot, [0, 0]); return [perg[0] + v[0], perg[1] + v[1]]; };
  return { tf: `translate(${perg[0]} ${perg[1]}) rotate(${rot.toFixed(3)}) scale(${PB}) translate(${-pusat[0]} ${-pusat[1]})`, peta };
};
/** grup 35 (tangan kanan menggenggam hp tampak samping): lingkaran telapak (126,16, 304,48) · sumbu lengan bawah figur −37,66° */
const T_HP = pasangTangan([126.16, 304.48], -37.66, J.perg[1]);
/** grup 67 (tangan kiri menunjuk): lingkaran telapak (679,16, 170,13) · ujung telunjuk (692,96, 156,91) · sumbu lengan bawah −40° */
const T_TUNJUK = pasangTangan([679.155, 170.125], -40, J.perg[0]);
export const UJUNG_TUNJUK_KOTA: P2 = (() => { const q = T_TUNJUK.peta([692.96, 156.91]); return [q[0] - J.perg[0][0], q[1] - J.perg[0][1]]; })();
/** hp di tangan kanan (relatif akar): pusat, ujung atas/bawah, normal layar (ke wajah) */
export const hpDiTanganKota = (p: Pose) => {
  const r = rantai(p, 1).tg, k = (q: P2) => titik(r, T_HP.peta(q));
  const pusat = k([128.18, 295.17]), atas = k([136.55, 288.92]), bawah = k([119.81, 301.42]);
  const d: P2 = [atas[0] - bawah[0], atas[1] - bawah[1]], L = Math.hypot(d[0], d[1]);
  return { pusat, atas, bawah, layar: [d[1] / L, -d[0] / L] as P2 };
};
/** IK dua ruas lengan i: titik `genggam` (offset dari pergelangan, pose dasar) ke `t` (relatif akar); tangan diputar `tangan`°; siku ke bawah-belakang */
export const ikLenganKota = (p: Pose, i: 0 | 1, t: P2, tangan: number, genggam: P2): Pose => {
  const S = titik(rantai(p, i).bdn, J.bahu[i]);
  const g = putar(genggam, tangan, [0, 0]);
  const v: P2 = [g[0], PANJANG_LB + g[1]], a = PANJANG_LA, b = Math.hypot(v[0], v[1]), dl = arah([0, 0], v);
  const dx = t[0] - S[0], dy = t[1] - S[1];
  const d = Math.max(Math.abs(a - b) + 0.5, Math.min(a + b - 0.5, Math.hypot(dx, dy)));
  const A = Math.acos((a * a + d * d - b * b) / (2 * a * d)), dasar = Math.atan2(dy, dx);
  const E = [dasar + A, dasar - A].map((e) => [S[0] + a * Math.cos(e), S[1] + a * Math.sin(e)] as P2)
    .sort((u, w) => (w[1] - 0.6 * w[0]) - (u[1] - 0.6 * u[0]))[0];
  const t1 = arah(S, E), t2 = arah(E, t) - dl;
  const bahu = [...p.bahu] as P2, siku = [...p.siku] as P2, tg = [...p.tangan] as P2;
  bahu[i] = t1 - p.badan; siku[i] = t2 - t1; tg[i] = tangan;
  return { ...p, bahu, siku, tangan: tg };
};

/** wajah MENYESAL = kepala "sedih" lembar kepala pria-biru (kotak 547,0 × 32,1, lebar 20,7) × 3,54 di kotak kepala Untitled-1 (897,6, 65,7; lebar 73,3 =
 * 20,7 × 3,54 — sama persis); kerah lembar kepala dibuang (kerah milik badan) */
const SEDIH = KEPALA_PB.sedih.markup.split('#000004').join('#F8AB9C').split('#000003').join('#0A131D').split('#000002').join('#32499F').split('fill="#000001"').join('fill="none"');
const TF_SEDIH = `translate(895.6 77) scale(${PB}) translate(-547 -32.1)`; // kotak rambut kepala rakitan Simon (895,6, 77)

/** TOKOH KOTA — akar (tengah pinggul) di (x, tanah − tinggi alas) · `ponsel` = tangan kanan menggenggam hp · `ketuk` = tangan kiri menunjuk ·
 * `sedih` 0…1 = wajah menyesal ditimpakan (pudar masuk) */
export const TokohKota: React.FC<{ x: number; tanah: number; s: number; pose: Pose; ponsel?: boolean; ketuk?: boolean; guide?: boolean; bayangan?: boolean;
  sedih?: number }> = ({ x, tanah, s, pose: p, ponsel, ketuk, guide, bayangan = true, sedih = 0 }) => {
    const R0 = rantai(p, 0), R1 = rantai(p, 1), y = tanah - alasTerendahKota(p) * s, kp = titikKepalaKota(p);
    const bag = (r: Rantai, m: string) => <g transform={tf(r)} dangerouslySetInnerHTML={{ __html: m }} />;
    return (
      <g transform={`translate(${x} ${y}) scale(${s}) translate(${-H[0]} ${-H[1]})`}>
        {bayangan ? (() => { const rx = lebarBayangan(kp[0], rentangAlasKota(p)); return (
          <ellipse cx={H[0] + kp[0]} cy={H[1] + alasTerendahKota(p)} rx={rx} ry={rx * BAYANGAN.rasio} fill={B.night} opacity={BAYANGAN.alfa} />); })() : null}
        {URUTAN_KOTA.map((n) => {
          // urutan lapis = file rakitan Simon
          if (n === 'kepala') return (
            <React.Fragment key={n}>
              {sedih >= 1 ? null : bag(R0.kepala, KOTA.kepala)}
              {sedih > 0 ? <g transform={tf(R0.kepala)} opacity={sedih >= 1 ? undefined : sedih}><g transform={TF_SEDIH} dangerouslySetInnerHTML={{ __html: SEDIH }} /></g> : null}
            </React.Fragment>);
          if (n === 'tanganR' && ponsel) return (
            <g key={n} transform={tf(R1.tg)}><g transform={T_HP.tf} dangerouslySetInnerHTML={{ __html: PRIA_BIRU.tanganHp.split('#00000A').join(B.night).split('#000004').join('#F8AB9C') }} /></g>);
          if (n === 'tanganL' && ketuk) return (
            <g key={n} transform={tf(R0.tg)}><g transform={T_TUNJUK.tf} dangerouslySetInnerHTML={{ __html: PRIA_BIRU.tanganTunjuk.split('#000004').join('#F8AB9C') }} /></g>);
          const R = n.endsWith('R') ? R1 : R0;
          const r = n === 'panggul' || n === 'badan' ? R0.bdn : n.startsWith('lenganAtas') ? R.la : n.startsWith('lenganBawah') ? R.lb : n.startsWith('tangan') ? R.tg
            : n.startsWith('paha') ? R.paha : n.startsWith('betis') ? R.betis : R.kaki;
          return <React.Fragment key={n}>{bag(r, KOTA[n])}</React.Fragment>;
        })}
        {guide ? <GuideKota p={p} /> : null}
      </g>);
  };

/** kerangka sendi ikut bergerak + garis tengah kepala → pusat bayangan */
const GuideKota: React.FC<{ p: Pose }> = ({ p }) => {
  const R = [rantai(p, 0), rantai(p, 1)];
  const S = (i: 0 | 1) => [titik(R[i].bdn, J.bahu[i]), titik(R[i].la, J.siku[i]), titik(R[i].lb, J.perg[i])];
  const K = (i: 0 | 1) => [titik(R[i].paha, J.pinggul[i]), titik(R[i].paha, J.lutut[i]), titik(R[i].betis, J.pkaki[i])];
  const kp = titikKepalaKota(p), alas = alasTerendahKota(p);
  return (
    <g transform={`translate(${H[0]} ${H[1]})`} fill="none" stroke="#00AEEF" strokeWidth={2.4}>
      {([0, 1] as const).map((i) => (
        <g key={i} opacity={i ? 0.55 : 1}>
          {[S(i), K(i)].map((rs, k) => <polyline key={k} points={rs.map((q) => q.join(',')).join(' ')} />)}
          {[...S(i), ...K(i)].map((q, k) => <circle key={`c${k}`} cx={q[0]} cy={q[1]} r={5} fill="#00AEEF" stroke="none" />)}
        </g>))}
      <line x1={kp[0]} x2={kp[0]} y1={kp[1] - 70} y2={alas + 40} stroke="#E5475D" strokeDasharray="10 7" />
    </g>);
};

/** lapis layar (seperti TokohTegakLapis): svg 800 × 900, akar di (400, 820) */
export const TokohKotaLapis: React.FC<React.ComponentProps<typeof TokohKota>> = (props) => (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `translate3d(${props.x - 400}px, ${props.tanah - 820}px, 0)`, willChange: 'transform' }}>
    <svg width={800} height={900} style={{ display: 'block', overflow: 'visible' }}>
      <TokohKota {...props} x={400} tanah={820} />
    </svg>
  </div>);
/** titik genggam tangan sisi i (relatif akar) — `genggam` = offset dari pergelangan di pose dasar */
export const titikTanganKota = (p: Pose, i: 0 | 1, genggam: P2): P2 => titik(rantai(p, i).tg, [J.perg[i][0] + genggam[0], J.perg[i][1] + genggam[1]]);
