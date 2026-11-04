import React from 'react';
import { RS13_MASUK } from './RS13';
import { Kaca, MaskerKeluar, durMasker, geser, type Masuk, daratDari } from '../parts/kaca';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, io, lerp, mixHex, rgba } from '../theme';
import { Icon, cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import { DompetUang, denyut } from '../parts/umum';
import { Uang } from '../parts/nyata';
import { GrafikLilin, gCandle, jtKoma, laju, nilaiLilin, relatif, rentang } from '../parts/lilin';
import { IHSG_2012_2021_MINGGU } from '../data/pasar';

/**
 * REVISI SCENE 12 v3 (Simon 14 Okt: "scene 12 hapus orangnya. dan recreate ide visual dan redesign lagi").
 * Evaluasi (5 pertanyaan): pesan = uang yang ≥3 tahun pasti tidak dipakai boleh ke investasi bertumbuh, karena WAKTUNYA panjang untuk melewati naik-turun.
 * Cara paling sederhana: SATU GARIS WAKTU yang juga sumbu grafik. Dulu sosok di sofa yang "menjelaskan" santai/tidak dipakai — kini waktunya sendiri
 * yang tergambar: pita 3 tahun terkunci → grafik berjalan di garis waktu → garis waktu MEMANJANG ke 10 tahun (pita 3 tahun mengecil jadi bagian kecil).
 *   A  "yang terakhir adalah uang jangka panjang"  deret tiga dompet (Scene 03), Uang Jangka Panjang disorot (tetap)
 *   B  "ini adalah uang yang setidaknya dalam tiga tahun ke depan kita sudah yakin nggak akan dipakai"  dompet → tumpukan uang Rp50 jt; garis waktu
 *      2026 → 2029 tergambar, simpul tahun menyala satu per satu, pita oranye "3 tahun" tersapu di belakang uang; "nggak akan dipakai" → ikon gembok
 *   C  "kenapa uang seperti ini bisa ditempatkan pada investasi dengan potensi pertumbuhan lebih tinggi?"  pita tumbuh jadi panel Saham / RD saham
 *      (gambar realistis Simon), uang masuk ke kepala panel; "potensi pertumbuhan" → candle tiga tahun pertama tumbuh di dalam pita (IHSG asli)
 *   D  "karena kita punya lebih banyak waktu untuk menghadapi naik-turunnya pasar"  garis waktu MEMANJANG 2029 → 2036 (zoom keluar), candle berjalan
 *      terus: turun-naik besar terlewati, nilai akhir di atas modal
 */

const [terakhir, jangka, ini, uang, setidaknya, dalam, tiga, tahun, depan, yakin, nggak, dipakai, kenapa, ditempatkan, investasi, potensi, karena, punya, lebih, waktu] = urut([
  'terakhir', 'jangka', 'ini', 'uang', 'setidaknya', 'dalam', 'tiga', 'tahun', 'depan', 'yakin', 'nggak', 'dipakai', 'kenapa', 'ditempatkan', 'investasi', 'potensi',
  'karena', 'punya', 'lebih', 'waktu'], BATAS.s12);

/** MASUK (revisi 14 Okt): masker Scene 11 mendarat di dompet Uang Jangka Panjang (deret kanan) */
export const RS12_MASUK: Masuk = { x: 1360, y: 510, r: 100, warna: B.orange, mulai: BATAS.s12 - 20 };
const DARAT = daratDari(RS12_MASUK);

const T = {
  denyutTerakhir: terakhir, sorot: jangka, judul: jangka + 20,
  b: ini, uang: ini + 10, pil: uang, garis: setidaknya, simpul: [setidaknya, tiga, tahun, depan], pita: [dalam, depan + 20], chip: tahun, gembok: nggak, denyutYakin: yakin,
  sub: tiga, subSorot: dipakai,
  panel: ditempatkan, masuk: [ditempatkan, investasi], kepala: investasi, nilai: investasi + 20, candle1: [potensi, karena], zoom: lebih, candle2: [punya, BATAS.s13 - 20],
  denyutKenapa: kenapa, denyutWaktu: waktu,
};

const NILAI = 50_000_000;
/** Simon 14 Okt — naik-turun pasar = candlestick realistis: IHSG MINGGUAN asli Jan 2012 – Des 2021 (10 tahun ≈ 516 candle; bulanan terlalu halus) */
const PASAR = relatif(IHSG_2012_2021_MINGGU);
/** candle terakhir tahun ke-3 (Des 2014) — batas fase "potensi pertumbuhan" */
const AKHIR_3TH = IHSG_2012_2021_MINGGU.filter(([, o, h, l, c]) => !(o === h && h === l && l === c)).findIndex((r) => r[0] >= '2015-01-01') - 1;
const DOM = rentang(PASAR, 0.08);
/** garis waktu = sumbu grafik: x0 … x0 + LEBAR. B: 3 tahun mengisi lebar penuh · D: 10 tahun mengisi lebar penuh (zoom keluar) */
const X0 = 320, LEBAR = 1280, SUMBU_Y = 760;
const GRAFIK = { atas: 462, h: 266 };
/** pita B (belakang uang) → C mengerut ke tinggi grafik; panel C tumbuh dari pita */
const PITA_B = { atas: 330 }, PANEL = { x: 960, y: 560, w: 1400, h: 600 };
const UANG = { x: 960, y: 500, w: 280, pil: 680 };
const G1 = gCandle(PASAR.length, AKHIR_3TH); // akhir tahun ke-3

export const RS12: React.FC<{ f: number }> = ({ f }) => {
  // keluar = masker lingkaran ke elemen pertama scene berikutnya (RS13_MASUK; gaya rumah: perpindahan scene = masker, bukan pudar biasa)
  if (f < BATAS.s12 || f >= RS13_MASUK.mulai + durMasker) return null;
  const sorot = cin(f, T.sorot), b = cin(f, T.b);
  // garis waktu memanjang tepat di "lebih banyak waktu" (80f berpusat di 'lebih')
  const zoom = cin(f, T.zoom, 80);
  const ppt = lerp(LEBAR / 3, LEBAR / 10, zoom); // piksel per tahun
  const xT = (k: number) => X0 + k * ppt;
  const pan = cin(f, T.panel);
  const masuk = R(f, T.masuk[0], T.masuk[1], 0, 1, io);
  // candle: tiga tahun pertama (C) lalu sisa tujuh tahun (D)
  const g = f < T.candle2[0] ? G1 * laju(f, T.candle1[0], T.candle1[1]) : lerp(G1, 1, laju(f, T.candle2[0], T.candle2[1]));
  const rel = nilaiLilin(PASAR, g), dd = rel - 1;
  const arah = Math.max(-1, Math.min(1, dd * 12));
  const col = arah >= 0 ? mixHex(B.night, ARAH.naik, arah) : mixHex(B.night, ARAH.turun, -arah);
  // pita (dan chip "3 tahun" di tepinya) baru turun ke tinggi grafik SESUDAH uang meninggalkan tengah (dulu chip menembus tumpukan uang)
  const pitaAtas = lerp(PITA_B.atas, GRAFIK.atas - 12, cin(f, T.panel + 45));
  const pitaKanan = X0 + LEBAR * R(f, T.pita[0], T.pita[1], 0, 1, io) * (ppt * 3 / LEBAR);
  const gembok = cin(f, T.gembok, 30);
  const sapuGaris = R(f, T.garis - 30, T.garis + 30, 0, 1, io);
  return (
    <MaskerKeluar f={f} mulai={RS13_MASUK.mulai} ke={RS13_MASUK} warna={RS13_MASUK.warna}>
    <AbsoluteFill>
      {/* ═════════ A: deret tiga dompet → Uang Jangka Panjang disorot ═════════ */}
      {b < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - b }}>
          {[0, 1, 2].map((k) => {
            const mundur = k === 2 ? 0 : sorot;
            const x = k === 2 ? lerp(1360, 960, sorot) : [560, 960][k] - 200 * sorot;
            return (
              <div key={k} style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, 1 - mundur), transform: `translateY(${160 * mundur}px)` }}>
                {/* Uang Jangka Panjang = cakram pendaratan (tanpa pop, ikon memudar masuk); dua dompet lain pop di sampingnya */}
                <DompetUang k={k} x={x} y={510} d={k === 2 ? lerp(200, 260, sorot) * (1 - 0.4 * b) : 200} p={k === 2 ? (f >= DARAT ? 1 + denyut(f, T.sorot + 40, 0.05) : 0) : popIn(f, DARAT + 14 + 14 * k)} f={f}
                  labelAt={k === 2 ? DARAT + 10 : DARAT + 24 + 14 * k} ikonAlfa={k === 2 ? R(f, DARAT, DARAT + 20, 0, 1, io) : 1} />
              </div>);
          })}
        </div>) : null}

      {/* ═════════ C–D: panel Saham / RD saham tumbuh dari pita ═════════ */}
      {pan > 0.001 ? (
        <Kaca x={PANEL.x} y={lerp((PITA_B.atas + SUMBU_Y + 40) / 2, PANEL.y, pan)} w={lerp(LEBAR + 40, PANEL.w, pan)} h={lerp(SUMBU_Y + 40 - PITA_B.atas, PANEL.h, pan)}
          p={0.99996} warna={B.orange} tab="atas" rona={0.35 * pan} alfa={Math.min(0.9999, pan * 3)} />) : null}

      {/* pita 3 tahun (belakang uang / candle tiga tahun pertama) */}
      {pitaKanan > X0 + 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: pitaKanan - X0, height: SUMBU_Y - pitaAtas, transform: geser(X0, pitaAtas), borderRadius: 22,
          background: `linear-gradient(180deg, ${rgba(B.orange, 0.16)}, ${rgba(B.orange, 0.07)})`, border: `2.5px dashed ${rgba(B.orange, 0.55)}`, boxSizing: 'border-box' }} />) : null}
      {/* chip "3 tahun" di tepi atas pita: ikon kalender → gembok saat "nggak akan dipakai" */}
      {popIn(f, T.chip) > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(X0 + 1.5 * ppt, pitaAtas)} translate(-50%, -50%) scale(${popIn(f, T.chip)})`, display: 'flex',
          alignItems: 'center', gap: 10, background: B.white, border: `3px solid ${B.orange}`, borderRadius: 999, padding: `${lerp(12, 9, zoom)}px ${lerp(24, 18, zoom)}px`, fontFamily: F,
          fontSize: lerp(30, 26, zoom), fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 12px 24px -14px ${B.orange}` }}>
          <div style={{ position: 'relative', width: 32, height: 32 }}>
            <Icon name="kalender" size={32} color={B.orange} style={{ position: 'absolute', left: 0, top: 0, opacity: Math.max(0.0001, 1 - gembok) }} />
            {gembok > 0.001 ? <Icon name="kunci" size={32} color={B.orange} style={{ position: 'absolute', left: 0, top: 0, opacity: Math.min(0.9999, gembok) }} /> : null}
          </div>
          3 tahun
        </div>) : null}

      {/* garis waktu = sumbu grafik: B 2026–2029 · D memanjang sampai 2036 (tahun baru masuk dari kanan) */}
      {sapuGaris > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <line x1={X0} y1={SUMBU_Y} x2={X0 + LEBAR * sapuGaris} y2={SUMBU_Y} stroke={rgba(B.night, 0.2)} strokeWidth={5} strokeLinecap="round" />
        </svg>) : null}
      {Array.from({ length: 11 }, (_, k) => {
        const x = xT(k);
        // tahun baru masuk dari ujung kanan sumbu: memudar masuk dalam 30 px terakhir (2036 tepat di ujung pada akhir zoom → penuh)
        if (x > X0 + LEBAR + 31) return null;
        const p = k <= 3 ? popIn(f, T.simpul[k]) : Math.min(1, (X0 + LEBAR + 31 - x) / 30);
        if (p <= 0.001) return null;
        const d = k === 0 || k === 3 ? 22 : 16;
        const warna = k <= 3 ? B.orange : B.grayLite;
        return (
          <React.Fragment key={k}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', boxSizing: 'border-box', border: `5px solid ${warna}`, background: B.white,
              transformOrigin: 'center', transform: `${geser(x - d / 2, SUMBU_Y - d / 2)} scale(${k <= 3 ? p : 1})`, opacity: k <= 3 ? undefined : Math.min(0.9999, p) }} />
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, SUMBU_Y + 38)} translate(-50%, -50%)`, fontFamily: F, fontSize: lerp(28, 24, zoom),
              fontWeight: k === 0 || k === 3 ? 800 : 700, color: k <= 3 ? B.night : B.gray, whiteSpace: 'nowrap', lineHeight: 1,
              opacity: Math.min(0.9999, k <= 3 ? cin(f, T.simpul[k] + 6, 30) : p) }}>{String(2026 + k)}</div>
          </React.Fragment>);
      })}

      {/* candle di garis waktu (lebar grafik = 10 tahun × piksel per tahun, dipotong di ujung kanan sumbu) */}
      {g > 0.0001 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: LEBAR, height: GRAFIK.h + 30, transform: geser(X0, GRAFIK.atas - 15), overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 15 }}>
            <GrafikLilin d={PASAR} w={ppt * 10} h={GRAFIK.h} g={g} dom={DOM} />
          </div>
        </div>) : null}

      {/* kepala panel: gambar Saham · RD saham (berkas realistis Simon) + nama · nilai berjalan + persen (kanan) */}
      {pan > 0.001 ? (
        <>
          {/* Simon 14 Okt: panel besar TIDAK memakai gambar realistis (hanya panel kecil) → ikon kotak seperti kepala kartu nilai */}
          {popIn(f, T.kepala) > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 76, height: 76, borderRadius: 22, background: B.orange, display: 'grid', placeItems: 'center',
              transformOrigin: 'center', transform: `${geser(PANEL.x - PANEL.w / 2 + 50, PANEL.y - PANEL.h / 2 + 92 - 38)} scale(${popIn(f, T.kepala)})`,
              boxShadow: `0 12px 24px -12px ${B.orange}` }}><Icon name="saham" size={46} color={B.white} /></div>) : null}
          {cin(f, T.kepala + 12) > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(PANEL.x - PANEL.w / 2 + 148, PANEL.y - PANEL.h / 2 + 92)} translateY(-50%)`, fontFamily: F, fontSize: 38, fontWeight: 800,
              color: B.night, whiteSpace: 'nowrap', lineHeight: 1, opacity: Math.min(0.9999, cin(f, T.kepala + 12)) }}>Saham / RD saham</div>) : null}
          {popIn(f, T.nilai) > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(PANEL.x + PANEL.w / 2 - 50, PANEL.y - PANEL.h / 2 + 92)} translate(-100%, -50%) scale(${popIn(f, T.nilai)})`,
              transformOrigin: 'right center', display: 'flex', alignItems: 'center', gap: 16, fontFamily: F }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999, background: rgba(col, 0.12), fontSize: 26, fontWeight: 800, color: col,
                fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', opacity: Math.max(0.0001, Math.min(0.9999, (Math.abs(arah) - 0.02) / 0.12)) }}>
                <svg width={20} height={16} viewBox="0 0 22 18"><path d={dd >= 0 ? 'M11 1 L21 17 L1 17 Z' : 'M11 17 L21 1 L1 1 Z'} fill={col} /></svg>
                {`${Math.round(Math.abs(dd) * 100) === 0 ? '' : dd >= 0 ? '+' : '−'}${Math.abs(Math.round(dd * 100))}%`}
              </div>
              <div style={{ fontSize: 60, fontWeight: 800, color: col, fontVariantNumeric: 'tabular-nums', lineHeight: 1, whiteSpace: 'nowrap', minWidth: 300, textAlign: 'right' }}>{jtKoma(NILAI * rel)}</div>
            </div>) : null}
          <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL.w - 80, height: 2, transform: geser(PANEL.x - PANEL.w / 2 + 40, PANEL.y - PANEL.h / 2 + 150),
            background: rgba(B.night, 0.07), opacity: Math.min(0.9999, pan) }} />
        </>) : null}

      {/* ═════════ B: uang Rp50 jt (keluar dari dompet) → masuk ke kepala panel (C); jalur melengkung KE BAWAH supaya tidak melintasi chip "3 tahun" ═════════ */}
      {b > 0.001 && masuk < 0.999 ? (
        <>
          <Uang x={lerp(UANG.x, PANEL.x - PANEL.w / 2 + 88, masuk)} y={lerp(UANG.y, PANEL.y - PANEL.h / 2 + 92, masuk) + Math.sin(Math.PI * masuk) * 130} w={lerp(UANG.w, 90, masuk)} p={popIn(f, T.uang)} alfa={R(masuk, 0.75, 1, 1, 0)} />
          <div style={{ position: 'absolute', inset: 0, opacity: Math.max(0.0001, 1 - cin(f, T.masuk[0], 30)) }}>
            <PilNominal x={UANG.x} y={UANG.pil} teks="Rp50.000.000" arah={0} p={popIn(f, T.pil)} size={34} />
          </div>
        </>) : null}

      <Judul f={f} kata={['Uang', 'Jangka', 'Panjang']} nomor="3" warnaNomor={B.orange} at={T.judul} />
      <Judul f={f} kata={['3+', 'tahun', '·', 'Tidak', 'ada', 'kebutuhan', 'dekat']} sorotIdx={6} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
    </AbsoluteFill>
    </MaskerKeluar>);
};
