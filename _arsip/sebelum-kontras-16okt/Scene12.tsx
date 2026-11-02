import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { gayaIsi, kamera, keLayar, type Kam } from '../kamera';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { ARAH, B, CORET, F, R, io, mixHex, rgba } from '../theme';
import { Icon, MODE_UKUR, Sorot, geserSorot, WordText, cin, glass, lerp } from '../parts/kit';
import { popIn } from '../parts/pop';
import { SimpulBab } from '../parts/rantai';
import { PETA } from '../parts/peta';
import { BAB } from '../s01/data';
import { INSTRUMEN13 } from '../s13/Scene13';

/**
 * RANGKUMAN — naskah REVISI 16 Okt, Scene 09 (kunci batas s12). Kolom VISUAL kosong; NOTE Simon: "tabel rangkuman utama … setiap aset
 * dibandingkan berdasarkan historical return, sumber return, tingkat kesulitan, volatilitas, dan potensi risiko". TEXT "Beda aset / beda
 * sumber return / beda karakter". Data & tata letak = tabel Simon 16 Okt "Perbandingan Instrumen Investasi" (10 instrumen, 3 segmen
 * Rendah→Tinggi, setengah segmen = nilai antara; catatan "Potensi" Saham, "2016–2025" Emas, * & ** Properti). Warna = brand (acuan Simon
 * hijau/abu → oranye = baris saham yang Simon sorot, biru = lainnya). Kolom SUMBER RETURN (ikon) ditambahkan: narasi menyebut cash flow /
 * perubahan harga / keduanya, dan feedback minta sumber return di tabel.
 * Alur: isi Saham menyusut ke simpul bab 06 di PETA BAB (enam bab berdampingan) → simpul meluncur jadi ikon baris → kolom terisi satu per
 * satu tepat di kalimatnya → "Unggul di semua hal" dicoret. Keluar = masker ke simpul instrumen pembuka Penutup.
 */
export const S12 = BATAS.s12;
export const IDE_S12_AWAL = S12;

const [semua, taruh, perbedaannya, cash, perubahan, keduanya, ret, seberapa1, seberapa2, seberapa3, tidak, unggul, semuanya] =
  urut(['semua', 'taruh', 'perbedaannya', 'cash', 'perubahan', 'keduanya', 'return', 'seberapa', 'seberapa', 'seberapa', 'tidak',
    'unggul', 'semuanya'], S12);

const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ── data tabel Simon (0–3 segmen; .5 = setengah segmen) ── */
type Sumber = 'cash' | 'harga' | 'dua';
type Baris = { nama: string; ikon: KunciIkon; bab: number; v: [number, number, number, number]; sumber: Sumber; sorot?: 'kuat' | 'muda'; cat?: [string?, string?, string?, string?] };
const BARIS: Baris[] = [
  { nama: 'Saham', ikon: 'saham', bab: 5, v: [3, 3, 3, 3], sumber: 'dua', sorot: 'kuat', cat: ['Potensi'] },
  { nama: 'Reksa Dana Saham', ikon: 'rdSaham', bab: 4, v: [3, 1.5, 2.5, 2.5], sumber: 'dua', sorot: 'kuat' },
  { nama: 'Emas', ikon: 'emas', bab: 1, v: [3, 1, 2.5, 2], sumber: 'harga', cat: ['2016–2025'] },
  { nama: 'Reksa Dana Indeks', ikon: 'rdIndeks', bab: 4, v: [2.5, 1, 2.5, 2.5], sumber: 'dua', sorot: 'muda' },
  { nama: 'Obligasi Pemerintah', ikon: 'obligasi', bab: 3, v: [2, 1.5, 1.5, 1], sumber: 'cash' },
  { nama: 'Reksa Dana Pendapatan Tetap', ikon: 'rdPendapatanTetap', bab: 4, v: [2, 1, 1.5, 1.5], sumber: 'cash' },
  { nama: 'Reksa Dana Pasar Uang', ikon: 'rdPasarUang', bab: 4, v: [1.5, 1, 0.5, 1], sumber: 'cash' },
  { nama: 'Deposito', ikon: 'deposito', bab: 0, v: [1.5, 1, 0.5, 1], sumber: 'cash' },
  { nama: 'Properti', ikon: 'properti', bab: 2, v: [1, 3, 1, 2], sumber: 'dua', cat: ['*', undefined, '**'] },
  { nama: 'Tabungan', ikon: 'tabungan', bab: 0, v: [1, 1, 0.5, 1], sumber: 'cash' },
];
/** baris pertama tiap bab = tujuan simpul peta yang meluncur (bab lain di baris itu pop) */
const BARIS_BAB = BAB.map((_, k) => BARIS.findIndex((b) => b.bab === k));

/* ── geometri tabel (dunia) ── */
const T = { x0: 150, x1: 1780, kepala: 204, garis: 230, y0: 264, h: 58 };
const rowY = (i: number) => T.y0 + i * T.h;
const ID = 36; // ikon baris (avatar kartu dashboard: 36 di kartu 48)
const X = { ikon: T.x0 + 36, nama: T.x0 + 70, sumber: 740, kol: [866, 1146, 1376, 1606] }; // celah catatan (Potensi · 2016–2025 · **) sesudah batang
const SEG = { w: 54, h: 16, gap: 6 };
/** Simon 16 Okt: "buat seperti screenshoot yang aku kirimkan (tampilan dashboard)" — tiap baris = KARTU terpisah (sudut 12, celah 10);
 *  kepala kolom kecil abu-abu tanpa garis; ikon sumber = lencana kotak (tombol aksi acuan). Di dalam PANEL (Scene 01) kartu bernada lavender
 *  muda supaya tetap terpisah dari panel putih. */
const KARTU = { h: T.h - 10, r: 12, x0: T.x0 - 10 };
const LENCANA = 36;
const LATAR_KARTU = mixHex(B.white, B.blue, 0.045);
const KOLOM = ['Return', 'Kesulitan', 'Volatilitas', 'Risiko'];
/** Simon 16 Okt: Kesulitan · Volatilitas · Risiko diwarnai MENURUT TINGKAT nilainya — rendah hijau, sedang kuning, tinggi merah (permintaan
 *  eksplisit Simon, di luar palet brand; hijau/merah = warna arah harga yang sudah dipakai). Return tetap warna brand. */
const KUNING = '#F2B705';
const warnaTingkat = (v: number) => (v <= 1 ? ARAH.naik : v <= 2 ? KUNING : ARAH.turun);

/* ── LEBAR BERTAHAP + PANEL — Simon 16 Okt: "jika bagian ini tidak digunakan mungkin bisa kamu hapus saja agar secara visual bisa diperbesar
 *  lagi" (ujung kanan kartu kosong menunggu kolom yang belum muncul) + "tambahkan pannel juga untuk discene 9 seperti discene 1".
 *  Kartu & panel hanya selebar kolom yang SUDAH muncul (aturan tanpa slot kosong); tiap kolom baru → kartu memanjang 60f dipusatkan di
 *  kalimatnya (isi kolom terisi bersamaan), dan kamera tabel (geser + zoom) menjaga panel di tengah & sebesar mungkin. ── */
/** waktu kolom: tiap kolom (kepala + isi) muncul di kalimatnya, isi menyapu baris berjenjang 5f */
const T_KOL = [ret - 10, seberapa1 + 20, seberapa2 + 20, seberapa3 + 20];
/** kanan kartu per tahap: nama saja (terpanjang s.d. ±633) · + sumber (lencana s.d. 783) · + return (catatan "Potensi" s.d. ±1118) ·
 *  + kesulitan (1320) · + volatilitas ("**" s.d. ±1584) · + risiko (1780) — ruang dalam ±22–27 px */
const KANAN = [660, 810, 1140, 1346, 1608, 1802];
const T_TAHAP = [cash - 20, ...T_KOL];
const PAD = 24;
const PANEL = { x0: KARTU.x0 - PAD, y0: T.kepala - 28, y1: rowY(9) + KARTU.h / 2 + PAD };
// baris legenda (1 baris, h) + catatan kaki DI BAWAH panel (pola baris sumber Scene 01); Simon 16 Okt: catatan kaki 2 baris hitam → h2
const BAWAH = { y: PANEL.y1 + 12, h: 24, h2: 48 };
const TAG = { y: BAWAH.y + BAWAH.h2 + 44, h: 64 }; // pusat tag "Unggul di semua hal"
/** kartu memanjang 60f MENDAHULUI isi kolomnya 20f ([t−50, t+10]; isi menyapu [t−30, t+30]) — kalau serentak, kepala & lintasan batang
 *  terpotong di tepi kartu (terukur f18900: "Sumber" terbaca "Sur") */
const MAJU = 20;
const tahapKe = (f: number) => T_TAHAP.reduce((s, t) => s + R(f, t - 30 - MAJU, t + 30 - MAJU, 0, 1, io), 0);
const kananKartu = (f: number) => { const u = tahapKe(f), i = Math.min(KANAN.length - 2, Math.floor(u)); return lerp(KANAN[i], KANAN[i + 1], u - i); };
/** kamera tabel: kotak tinta tiap keadaan → pusatnya di (960, 548) (tengah antara bawah judul + 25 dan batas subtitle 960);
 *  zoom = min(1,2 · 1712/lebar · 823/tinggi). Keadaan berganti 60f dipusatkan di waktunya. */
const LAYAR = { cy: 548, w: 1712, h: 823, zMaks: 1.2 };
const KEADAAN = [
  { t: semua, x1: KANAN[0] + PAD, y1: PANEL.y1 },
  { t: T_TAHAP[0] - MAJU, x1: KANAN[1] + PAD, y1: PANEL.y1 },
  { t: T_TAHAP[1] - MAJU, x1: KANAN[2] + PAD, y1: PANEL.y1 },
  { t: T_TAHAP[2] - MAJU, x1: KANAN[3] + PAD, y1: BAWAH.y + BAWAH.h }, // legenda muncul di kalimat Kesulitan
  { t: T_TAHAP[3] - MAJU, x1: KANAN[4] + PAD, y1: BAWAH.y + BAWAH.h },
  { t: T_TAHAP[4] - MAJU, x1: KANAN[5] + PAD, y1: BAWAH.y + BAWAH.h2 }, // catatan kaki 2 baris muncul di kalimat Risiko
  { t: tidak + 10, x1: KANAN[5] + PAD, y1: TAG.y + TAG.h / 2 },
];
const KAM_T: Kam[] = KEADAAN.map((k) => {
  const z = Math.min(LAYAR.zMaks, LAYAR.w / (k.x1 - PANEL.x0), LAYAR.h / (k.y1 - PANEL.y0));
  return { x: 960 - (PANEL.x0 + k.x1) / 2, y: (LAYAR.cy - 540) / z + 540 - (PANEL.y0 + k.y1) / 2, z };
});
const kamTabel = (f: number): Kam => {
  let k = KAM_T[0];
  for (let i = 1; i < KEADAAN.length; i += 1) {
    const u = R(f, KEADAAN[i].t - 30, KEADAAN[i].t + 30, 0, 1, io);
    if (u <= 0) break;
    k = { x: lerp(k.x, KAM_T[i].x, u), y: lerp(k.y, KAM_T[i].y, u), z: lerp(k.z, KAM_T[i].z, u) };
  }
  return k;
};

export const Scene12: React.FC<{ f: number }> = ({ f }) => {
  if (f < S12) return null;
  // KELUAR = masker ke simpul INSTRUMEN Penutup ("Setelah memahami perbedaannya"), biru + ikon. 50f mulai BATAS.s13 (pola lama).
  if (f >= BATAS.s13 + 52) return null;
  const ex = R(f, BATAS.s13, BATAS.s13 + 50, 0, 1, io);
  const kam13 = kamera('S13', BATAS.s13 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam13, INSTRUMEN13), r: INSTRUMEN13.r * kam13.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);
  // peta = kamera kunci S12 (dipakai juga masker keluar Scene 08) dibekukan sebelum simpul meluncur; tabel = kamera tabel (lebar bertahap)
  const kamPeta = kamera('S12', Math.min(f, semua - 40));
  const kamT = kamTabel(f);
  const kanan = kananKartu(f), lebar = kanan - KARTU.x0;
  const panelOp = R(f, semua - 10, semua + 30, 0, 1, io);
  const T_SUMBER: Record<Sumber, number> = { cash: cash - 10, harga: perubahan - 10, dua: keduanya - 10 };
  const bangun = (i: number) => semua + 24 + 7 * i; // baris berdampingan, berjenjang — sesudah simpul peta tiba di barisnya
  // simpul peta → ikon baris pertama babnya
  const keBaris = R(f, semua - 40, semua + 30, 0, 1, io);
  const pudarPeta = R(f, semua - 40, semua - 5, 0, 1, io); // nama peta habis sebelum panel muncul (tanpa tumpang tindih)
  // sorot kategori sumber (pita baris) — satu kategori pada satu waktu
  const pita = (s: Sumber) => {
    const a = T_SUMBER[s], b = s === 'cash' ? T_SUMBER.harga : s === 'harga' ? T_SUMBER.dua : ret - 20;
    return R(f, a - 10, a + 20, 0, 1, io) * (1 - R(f, b - 20, b + 10, 0, 1, io));
  };
  const WARNA_SUMBER: Record<Sumber, string> = { cash: B.turq, harga: B.orange, dua: B.blue };

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s13, BATAS.s13 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <JudulBertahap f={f} />
      {/* ═════ peta bab (tempat isi Saham menyusut): garis + nama memudar ═════ */}
      {pudarPeta < 1 ? (
        <AbsoluteFill style={gayaIsi(kamPeta)}>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: 1 - pudarPeta }}>
            <line x1={PETA.x(0)} x2={PETA.x(5)} y1={PETA.y} y2={PETA.y} stroke={B.grayLite} strokeWidth={2.5} strokeDasharray="7 11" strokeLinecap="round" />
          </svg>
          {BAB.map((b, k) => (
            <div key={b.no} style={{ position: 'absolute', left: PETA.x(k) - 135, width: 270, top: PETA.y + PETA.d / 2 + 34, textAlign: 'center', lineHeight: 1.18, opacity: 1 - pudarPeta, fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{b.nama}</div>))}
        </AbsoluteFill>) : null}

      <AbsoluteFill style={gayaIsi(kamT, f >= BATAS.s13 - 30)}>
        {/* ═════ PANEL (gaya panel chart Scene 01) — selebar kolom yang sudah muncul ═════ */}
        {panelOp > 0.001 ? <div style={{ position: 'absolute', left: PANEL.x0, top: PANEL.y0, width: lebar + 2 * PAD, height: PANEL.y1 - PANEL.y0, opacity: panelOp, transform: `scale(${lerp(0.97, 1, panelOp)})`, ...glass() }} /> : null}

        {/* ═════ TABEL ═════ — isi DIPOTONG di tepi kanan kartu yang sedang melebar (overflow, bukan clip-path): lintasan batang & catatan kolom
            baru tersingkap bersama kartunya, tak pernah menggantung di luar panel (terukur f19250 sebelum ini: lintasan Return + "Potensi" di luar) */}
        <div style={{ position: 'absolute', left: KARTU.x0, top: PANEL.y0, width: lebar, height: PANEL.y1 - PANEL.y0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -KARTU.x0, top: -PANEL.y0, width: 1920, height: 1080 }}>
        {/* kepala kolom gaya dashboard: kecil abu-abu, rata kiri dengan isi kolomnya, tanpa garis (kartu baris sudah selebar tabel) */}
        <Kepala x={X.ikon - ID / 2} f={f} at={perbedaannya} teks="Instrumen" />
        <Kepala x={X.sumber - 22 - LENCANA / 2} f={f} at={cash - 20} teks="Sumber" />
        {KOLOM.map((k, j) => <Kepala key={k} x={X.kol[j]} f={f} at={T_KOL[j]} teks={k} />)}

        {BARIS.map((b, i) => {
          const pb = cin(f, bangun(i));
          if (pb <= 0.001) return null;
          const y = rowY(i);
          const warna = b.sorot === 'kuat' ? B.orange : b.sorot === 'muda' ? B.orangeLite : B.blue;
          const ps = pita(b.sumber);
          const bandSorot = b.sorot ? R(f, perbedaannya - 20, perbedaannya + 40, 0, 1, io) : 0; // baris saham disorot (acuan Simon)
          return (
            <React.Fragment key={b.nama}>
              {/* KARTU baris (dashboard): putih + bayangan lembut, naik 14 px sambil muncul; sorot saham = kartu bernada oranye (tetap) */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: lebar, height: KARTU.h, borderRadius: KARTU.r, opacity: pb, background: mixHex(LATAR_KARTU, mixHex(B.white, B.orange, b.sorot === 'kuat' ? 0.13 : 0.07), b.sorot ? bandSorot : 0), border: `1.5px solid ${rgba(B.blue, 0.05)}`, transform: geser(KARTU.x0, y - KARTU.h / 2 + (1 - pb) * 14) }} />
              {/* kategori sumber yang sedang disebut (sementara): bingkai kartu berwarna sumbernya */}
              {ps > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: lebar, height: KARTU.h, borderRadius: KARTU.r, border: `2.5px solid ${rgba(WARNA_SUMBER[b.sumber], 0.7 * ps)}`, background: rgba(WARNA_SUMBER[b.sumber], 0.08 * ps), transform: geser(KARTU.x0, y - KARTU.h / 2) }} /> : null}
              {/* ikon + nama (bab yang simpulnya meluncur ke sini: ikon baru tampil saat simpul tiba) */}
              <BulatKecil x={X.ikon} y={y} d={ID} col={BAB[b.bab].warna} ikon={b.ikon} s={BARIS_BAB[b.bab] === i ? (keBaris >= 1 ? 1 : 0) : popIn(f, bangun(i))} />
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(X.nama + (1 - pb) * -16, y - 17)}`, opacity: pb, whiteSpace: 'nowrap', lineHeight: 1, fontFamily: F, fontSize: 28, fontWeight: 800, color: b.sorot === 'kuat' ? mixHex(B.night, B.orange, bandSorot) : B.night }}>{b.nama}</div>
              {/* sumber return: cash flow (uang masuk) · perubahan harga (▲▼) · keduanya */}
              {b.sumber !== 'harga' ? <Lencana x={X.sumber - (b.sumber === 'dua' ? 22 : 0)} y={y} col={B.turq} ikon="pendapatan" s={popIn(f, (b.sumber === 'dua' ? T_SUMBER.dua : T_SUMBER.cash) + 4 * i)} /> : null}
              {b.sumber !== 'cash' ? <Lencana x={X.sumber + (b.sumber === 'dua' ? 22 : 0)} y={y} col={B.orange} ikon="naikTurunHarga" s={popIn(f, (b.sumber === 'dua' ? T_SUMBER.dua + 8 : T_SUMBER.harga) + 4 * i)} /> : null}
              {/* empat kolom: 3 segmen Rendah → Tinggi */}
              {b.v.map((v, j) => {
                const g = R(f, T_KOL[j] - 30 + 5 * i, T_KOL[j] + 30 + 5 * i, 0, 1, io);
                if (g <= 0.001) return null;
                return (
                  <React.Fragment key={j}>
                    <Segmen x={X.kol[j]} y={y} nilai={v * g} col={j === 0 ? warna : warnaTingkat(v)} op={Math.min(1, g * 3)} />
                    {b.cat?.[j] ? <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(X.kol[j] + 3 * SEG.w + 2 * SEG.gap + 12, y - (b.cat[j]!.length > 3 ? 22 : 12)), opacity: g, fontFamily: F, fontSize: b.cat[j]!.length > 3 ? 18 : 22, fontWeight: 700, color: B.gray, lineHeight: 1.1, whiteSpace: 'pre' }}>{b.cat[j] === '2016–2025' ? '2016–\n2025' : b.cat[j]}</div> : null}
                  </React.Fragment>);
              })}
            </React.Fragment>);
        })}
        </div>
        </div>

        {/* legenda + catatan kaki (* ** Properti — usulan teks, catatan Simon masih kosong) */}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(KARTU.x0, BAWAH.y + 2), opacity: cin(f, seberapa3 + 40), fontFamily: F, fontSize: 18, fontWeight: 600, color: B.night, whiteSpace: 'pre', lineHeight: 1.3 }}>
          {'* Properti: hanya kenaikan nilai, belum termasuk pendapatan sewa\n** Harga properti jarang diperbarui, jadi naik-turunnya tak terlihat setiap hari'}
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(kanan - 380, BAWAH.y), width: 380, opacity: cin(f, seberapa1 + 40), display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, fontFamily: F, fontSize: 20, fontWeight: 700, color: B.gray }}>
          {/* legenda tingkat (Kesulitan · Volatilitas · Risiko) */}
          {[['Rendah', ARAH.naik], ['Sedang', KUNING], ['Tinggi', ARAH.turun]].map(([t, c]) => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><svg width={SEG.w * 0.6} height={SEG.h}><rect width={SEG.w * 0.6} height={SEG.h} rx={SEG.h / 2} fill={c} /></svg>{t}</span>))}
        </div>

        {/* "Tidak ada satu instrumen yang unggul di semuanya" — tag piala dicoret merah */}
        <TagCoret f={f} x={(PANEL.x0 + KANAN[5] + PAD) / 2} y={TAG.y} at={tidak + 10} coretAt={semuanya} />
      </AbsoluteFill>

      {/* simpul peta MELUNCUR jadi ikon baris pertama babnya — RUANG LAYAR: dari posisi layar peta ke posisi layar ikon di kamera tabel
          (dua kamera berbeda); di keBaris = 1 ikon tabel menggantikan di titik yang sama */}
      {keBaris < 1 ? BAB.map((b, k) => {
        const a = keLayar(kamPeta, { x: PETA.x(k), y: PETA.y }), t = keLayar(kamT, { x: X.ikon, y: rowY(BARIS_BAB[k]) });
        return <SimpulBab key={b.no} x={lerp(a.x, t.x, keBaris)} y={lerp(a.y, t.y, keBaris)} d={lerp(PETA.d * kamPeta.z, ID * kamT.z, keBaris)} col={b.warna} ikon={b.ikon} isi={1} op={k === 5 ? R(f, S12 + 40, S12 + 52, 0, 1, io) : 1} />;
      }) : null}
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.blue, opacity: R(f, BATAS.s13 + 22, BATAS.s13 + 48, 0, 1, io) }} /> : null}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s13 + 34, BATAS.s13 + 48, 0, 1, io) }}><Icon name="instrumenInvestasi" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);

  /** judul TEXT tiga bagian: "Beda aset," → "beda sumber return," → "beda karakter" (disorot) */
  function JudulBertahap({ f: ff }: { f: number }) {
    if (MODE_UKUR) return null;
    const st: React.CSSProperties = { fontFamily: F, fontSize: 44, fontWeight: 800, letterSpacing: '-.02em', color: B.night };
    const h = R(ff, unggul - 30, unggul + 30, 0, 1, io);
    const bagian = [{ t: 'Beda aset,', at: perbedaannya }, { t: 'beda sumber return,', at: cash + 10 }];
    const p3 = R(ff, ret - 30, ret + 30, 0, 1, io);
    const gs = geserSorot('beda karakter', 44);
    if (ff < perbedaannya - 40) return null;
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center' }}>
        {bagian.map((b) => (
          <span key={b.t} style={{ ...st, display: 'inline-block', whiteSpace: 'pre', transform: `translateX(${gs * (1 - h)}px)` }}>
            <WordText halus f={ff} at={b.at} style={st}>{b.t}</WordText>{' '}
          </span>))}
        <span style={{ ...st, display: 'inline-block', opacity: p3, transform: `translateY(${(1 - p3) * 20}px)` }}>
          <Sorot w="beda karakter" h={h} size={44} />
        </span>
      </div>);
  }
};

/** kepala kolom (muncul di kalimat kolomnya) — gaya dashboard: kecil; Simon 16 Okt: "text judul buat warna hitam" */
const Kepala: React.FC<{ x: number; f: number; at: number; teks: string }> = ({ x, f, at, teks }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, T.kepala - 4), whiteSpace: 'nowrap', lineHeight: 1 }}>
    <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: B.night }}>{teks}</WordText>
  </div>);

/** lencana sumber return = tombol aksi kotak (acuan dashboard Simon). Versi bernada muda (latar 18 %, ikon berwarna) terlalu pudar —
 *  turkis di atas turkis muda tak terbaca → kotak berwarna penuh + ikon putih */
const Lencana: React.FC<{ x: number; y: number; col: string; ikon: KunciIkon; s: number }> = ({ x, y, col, ikon, s }) => s <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: LENCANA, height: LENCANA, borderRadius: 10, background: col, display: 'grid', placeItems: 'center', transform: `${geser(x - LENCANA / 2, y - LENCANA / 2)} scale(${s})` }}>
    <Icon name={ikon} size={LENCANA * 0.62} color={B.white} />
  </div>);

/** tiga segmen Rendah → Tinggi; `nilai` 0..3 (pecahan = sebagian segmen terisi) */
const Segmen: React.FC<{ x: number; y: number; nilai: number; col: string; op: number }> = ({ x, y, nilai, col, op }) => (
  <svg width={3 * SEG.w + 2 * SEG.gap} height={SEG.h} style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, y - SEG.h / 2), opacity: op, overflow: 'visible' }}>
    <defs>{[0, 1, 2].map((k) => <clipPath key={k} id={`seg-${x}-${y}-${k}`}><rect x={k * (SEG.w + SEG.gap)} y={0} width={SEG.w} height={SEG.h} rx={SEG.h / 2} /></clipPath>)}</defs>
    {[0, 1, 2].map((k) => {
      const isi = Math.max(0, Math.min(1, nilai - k));
      return (
        <g key={k}>
          <rect x={k * (SEG.w + SEG.gap)} y={0} width={SEG.w} height={SEG.h} rx={SEG.h / 2} fill={B.blueWash} />
          {isi > 0.001 ? <rect x={k * (SEG.w + SEG.gap)} y={0} width={SEG.w * isi} height={SEG.h} fill={col} clipPath={`url(#seg-${x}-${y}-${k})`} /> : null}
        </g>);
    })}
  </svg>);

/** lingkaran ikon kecil */
const BulatKecil: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s: number }> = ({ x, y, d, col, ikon, s }) => s <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${s})` }}>
    <Icon name={ikon} size={d * 0.6} color={B.white} />
  </div>);

/** tag "Unggul di semua hal" (piala) — pop lalu dicoret merah */
const TagCoret: React.FC<{ f: number; x: number; y: number; at: number; coretAt: number }> = ({ f, x, y, at, coretAt }) => {
  const p = popIn(f, at);
  if (p <= 0.001) return null;
  const coret = R(f, coretAt - 30, coretAt + 30, 0, 1, io);
  const col = mixHex(B.orange, CORET, coret);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 12, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999, padding: '8px 26px 8px 8px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}88` }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name="trofi" size={28} color={B.white} /></div>
      Unggul di semua hal
      <div style={{ position: 'absolute', left: 18, top: '50%', height: 4, marginTop: -2, width: `calc(${coret} * (100% - 36px))`, background: CORET, borderRadius: 2 }} />
    </div>);
};

export const S12_BEAT = { semua, taruh, perbedaannya, cash, perubahan, keduanya, ret, seberapa1, seberapa2, seberapa3, tidak, unggul, semuanya };
