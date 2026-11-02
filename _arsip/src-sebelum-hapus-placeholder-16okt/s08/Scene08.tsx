import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { frasa, urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { gayaIsi, kamera, keLayar } from '../kamera';
import { ARAH, B, F, GAP, LINE, R, WARNA, io, mixHex, rgba } from '../theme';
import { Icon, MODE_UKUR, WordText, cin, glass, grow, lerp } from '../parts/kit';
import { Backdrop } from '../parts/Backdrop';
import { INVESTOR_JAS, KarakterLingkar, MURID_S06 } from '../parts/karakter';
import { popIn } from '../parts/pop';
import { Konektor, SimpulBab } from '../parts/rantai';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { LembarUang } from '../parts/uang';
import { Gedung, GedungLingkar } from '../parts/gedung';
import { Judul } from '../parts/judul';
import { PilNominal, rpJuta, rpMiliar } from '../parts/nominal';
import { ISI_D, SAHAM7, SAHAM_ANGKAT } from '../s07/Scene07';

/**
 * SAHAM — naskah REVISI 16 Okt: Scene 07 (kunci batas s8) + Scene 08 (kunci s9) dalam SATU dunia (benang merah, kamera bersambung).
 *   S07 VISUAL "STOCK ↓ OWNERSHIP IN A COMPANY ↓ BUSINESS Revenue → Profit vs. MARKET PRICE Stock Price ↑/↓"
 *       TEXT   "Perusahaan menghasilkan laba / pasar menentukan harga saham"
 *   S08 VISUAL "COMPANY Revenue ↓ Profit ↓ Reinvestment ↓ Business Growth —— MARKET ↓ Valuation ↓ Stock Price ↑/↓"
 *       TEXT   "Bisnis menciptakan nilai / pasar menentukan harganya"
 * Feedback (Video 02 · Scene 8): "memiliki sebagian perusahaan", BUKAN "pemilik kecil" (label & tokohnya dihapus); jelaskan perusahaan =
 * laba yang terus dihasilkan VS harga saham — jangan dicampur; volatilitas TIDAK dibahas di saham.
 * Alur: ikon Saham dari keranjang reksa dana → peta bab → simpul ke tengah → perusahaan (cakram) terbentuk di sekelilingnya, potongan oranye =
 * bagian yang kita beli → "dua hal yang harus dibedakan": cakram mengecil jadi lencana PERUSAHAAN di atas, bercabang ke kartu BISNIS
 * (Produk & layanan → Pendapatan → Laba) dan kartu HARGA SAHAM (pasar memberi harga, harga berubah dari waktu ke waktu).
 * S08: perusahaan berkembang (pendapatan & laba ▲), sebagian laba diinvestasikan kembali (Skala usaha · Produk baru · Pasar baru),
 * gedung tumbuh = nilai bisnis; "dua hal yang berbeda" (≠); grafik laba (stabil) vs harga (naik-turun) — pasar menilai; return investor
 * dari dua hal: hasil bisnis + perubahan harga (dua panah ke investor). Keluar = masker ke simpul bab 06 di peta pembuka Rangkuman.
 */
export const S8 = BATAS.s8;
export const IDE_S08_AWAL = S8;

const [saham, , kita, sebagian, kepemilikan, perusahaan, dua, pertama, bisnisnya, produk, pendapatan, laba, kedua, sahamnya,
  diberikan, pasar, , nilainya, , waktu2] = urut(['saham', 'saat', 'kita', 'sebagian', 'kepemilikan', 'perusahaan', 'dua', 'pertama',
  'bisnisnya', 'produk', 'pendapatan', 'laba', 'kedua', 'sahamnya', 'diberikan', 'pasar', 'kepemilikan', 'nilainya', 'waktu', 'waktu'], S8);
const [berkembang, , labanya, tumbuh, , laba2, kembali, memperbesar, mengembangkan, pasar2, menciptakan, nilai2, , berbeda,
  , , laba3, , menilai, investor, , hasil, perubahan] = urut(['berkembang', 'pendapatan', 'labanya', 'tumbuh', 'sebagian', 'laba',
  'kembali', 'memperbesar', 'mengembangkan', 'pasar', 'menciptakan', 'nilai', 'tapi', 'berbeda', 'harga', 'tidak', 'laba', 'karena',
  'menilai', 'investor', 'potensi', 'hasil', 'perubahan'], BATAS.s9);
/** awal (frame) 18f sebelum frasa yang memuat kata di frame `at` */
const A0 = (w: string, at: number) => frasa(w, at) - 18;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ── geometri (dunia) ── */
const JARAK = 16;
const NODE = { x: 960, y: 512, d: 200 };
const PIE_R = 190;
const PIE0 = { x: 960, y: 526 };
const rad = (d: number) => (d * Math.PI) / 180;
const MID = rad(-67.5);
/** lencana PERUSAHAAN di atas kedua kartu (sesudah "dua hal") */
const LENCANA = { x: 960, y: 262, D: 132 };
const SKALA_LENCANA = LENCANA.D / (2 * PIE_R);
/** kartu: kiri (Bisnis) sendirian di tengah → bergeser ke kiri saat kartu kanan (Harga saham) muncul */
const KARTU = { w: 600, h: 450, top: 420 };
const X_KANAN = 1300, X_KIRI = 620; // celah antarkartu 80 (tanda ≠ di tengahnya)
const BARIS = [575, 688, 801]; // Produk & layanan · Pendapatan · Laba
const ID = 84; // diameter ikon baris
const KEPALA_Y = KARTU.top + 58;

/* ── waktu ── */
const TIBA = saham;
const TENGAH = TIBA + 90;
const PIE_AT = A0('kita', kita);
const KECIL = dua - 30; // cakram → lencana perusahaan
const KIRI_AT = pertama; // kartu Bisnis
const KANAN_AT = kedua; // kartu Harga saham
const BALIK = investor; // lencana perusahaan → investor

/* ── grafik harga di kartu kanan ── */
const GR = { x0: X_KANAN - 250, x1: X_KANAN + 250, y: 790, a: 62 };
const hargaRel = (u: number) => Math.sin(3.2 * Math.PI * u) * 0.55 + Math.sin(9 * Math.PI * u) * 0.18 + u * 0.55; // naik-turun, cenderung naik
const LABA_Y = (u: number) => GR.y + 30 - u * 120; // garis laba: naik mulus (S08)

export const Scene08: React.FC<{ f: number }> = ({ f }) => {
  if (f < S8) return null;
  // KELUAR = masker lingkaran ke simpul bab 06 (Saham) di peta pembuka Rangkuman (kunci batas s12), berubah oranye + ikon. 50f.
  if (f >= BATAS.s12 + 52) return null;
  const ex = R(f, BATAS.s12, BATAS.s12 + 50, 0, 1, io);
  const kam12 = kamera('S12', BATAS.s12 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam12, SIMPUL_PETA(5)), r: SIMPUL_PETA(5).r * kam12.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6);
  const kam = kamera(f < BATAS.s9 ? 'S08' : 'S09', f);

  /* simpul Saham → masuk potongan cakram */
  const kePotong = R(f, PIE_AT, PIE_AT + 60, 0, 1, io);
  const potong0 = { x: PIE0.x + Math.cos(MID) * PIE_R * 0.66, y: PIE0.y + Math.sin(MID) * PIE_R * 0.66 };
  const nx = lerp(NODE.x, potong0.x, kePotong), ny = lerp(NODE.y, potong0.y, kePotong), nd = lerp(NODE.d, 70, kePotong);
  const potong = popIn(f, sebagian + 15);
  const opNode = 1 - R(f, sebagian + 20, sebagian + 45, 0, 1, io);
  const pie = cin(f, PIE_AT + 30);
  const labelBab = cin(f, TENGAH + 20) * (1 - R(f, PIE_AT, PIE_AT + 30, 0, 1, io));
  /* cakram → lencana */
  const kecil = R(f, KECIL, KECIL + 60, 0, 1, io);
  const pieS = lerp(1, SKALA_LENCANA, kecil), pieX = lerp(PIE0.x, LENCANA.x, kecil), pieY = lerp(PIE0.y, LENCANA.y, kecil);
  const opPie = 1 - R(f, KECIL + 40, KECIL + 60, 0, 1, io); // cakram silang-pudar ke lencana gedung
  const opLencana = R(f, KECIL + 40, KECIL + 60, 0, 1, io) * (1 - R(f, BALIK - 20, BALIK + 20, 0, 1, io));
  const opInvestor = R(f, BALIK - 20, BALIK + 20, 0, 1, io);
  /* kartu (tempat tetap: "dua hal" → dua ikon di pusat kartu masing-masing, lalu jadi ikon kepala kartu) */
  const XL = X_KIRI;
  const keKepalaKiri = R(f, KIRI_AT - 30, KIRI_AT + 30, 0, 1, io), keKepalaKanan = R(f, KANAN_AT - 20, KANAN_AT + 40, 0, 1, io);
  const pKiri = cin(f, KIRI_AT), pKanan = cin(f, KANAN_AT + 10);
  const sorotAkhir = (at: number) => R(f, at - 30, at + 30, 0, 1, io);

  /* nominal */
  const tumbuhUang = R(f, labanya - 20, tumbuh + 20, 0, 1, io);
  const nilaiPerusahaan = 100 + 20 * R(f, berkembang - 20, berkembang + 40, 0, 1, io) + 60 * R(f, nilai2 - 30, nilai2 + 40, 0, 1, io);

  /* grafik harga: tergambar "nilainya bisa berubah dari waktu ke waktu" */
  const gHarga = R(f, nilainya - 10, waktu2 + 30, 0, 1, io);
  const N = 80;
  const titik = Array.from({ length: Math.max(2, Math.ceil(gHarga * (N - 1)) + 1) }, (_, i) => {
    const u = Math.min(gHarga, i / (N - 1));
    return { x: lerp(GR.x0, GR.x1, u), y: GR.y - GR.a * hargaRel(u) };
  });
  const ujung = titik[titik.length - 1];
  const nilaiLembar = 1250 + 260 * hargaRel(gHarga);
  const gLaba = R(f, laba3 - 40, laba3 + 30, 0, 1, io);

  return (
    <AbsoluteFill style={f >= BATAS.s12 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>
    {/* sejak BATAS.s12 (bukan ex > 0): lapis ini langsung di atas + salinan latar global PEKAT di dalam lingkaran → peta Rangkuman hanya
        tersingkap di luar lingkaran (pola perbaikan S11→S12, 12 Okt; jeglek f18476 beda 7,1 sebelum perbaikan) */}
    {f >= BATAS.s12 ? (MODE_UKUR ? <AbsoluteFill style={{ background: '#00FF00' }} /> : <Backdrop f={f} />) : null}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s12, BATAS.s12 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <AbsoluteFill style={gayaIsi(kam, f >= BATAS.s12 - 30)}>
        {/* ═════ pembuka bab: peta → simpul bab 06 (diisi ikon Saham dari keranjang) ke tengah ═════ */}
        <PembukaBab f={f} s0={S8} k={5} isiAt={TIBA} tengah={NODE} selesai={TENGAH} isiLuar={f >= TIBA ? 1 : 0} />
        {labelBab > 0.001 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, width: 400, transform: geser(nx - 200, ny + NODE.d / 2 + JARAK), textAlign: 'center', opacity: labelBab, lineHeight: 1 }}>
            <WordText halus f={f} at={TENGAH + 20} style={{ fontFamily: F, fontSize: 40, fontWeight: 800, color: B.night }}>Saham</WordText>
          </div>) : null}

        {/* ═════ perusahaan = cakram berpotongan; potongan oranye = bagian kepemilikan yang kita beli ═════ */}
        {pie > 0.001 && opPie > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: pie * opPie, transform: `${geser(pieX - PIE0.x, pieY - PIE0.y)} scale(${lerp(0.9, 1, pie) * pieS})`, transformOrigin: `${PIE0.x}px ${PIE0.y}px` }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              {Array.from({ length: 8 }, (_, k) => {
                const a0 = -90 + k * 45, a1 = a0 + 45, isBagian = k === 0;
                const keluar = isBagian ? 16 * Math.min(1, potong) : 0;
                const mid = rad((a0 + a1) / 2), ox = Math.cos(mid) * keluar, oy = Math.sin(mid) * keluar, rr = PIE_R;
                const p0 = [PIE0.x + ox + Math.cos(rad(a0)) * rr, PIE0.y + oy + Math.sin(rad(a0)) * rr];
                const p1 = [PIE0.x + ox + Math.cos(rad(a1)) * rr, PIE0.y + oy + Math.sin(rad(a1)) * rr];
                const dPath = `M${PIE0.x + ox} ${PIE0.y + oy} L${p0[0]} ${p0[1]} A${rr} ${rr} 0 0 1 ${p1[0]} ${p1[1]} Z`;
                return (
                  <g key={k}>
                    <path d={dPath} fill={k % 2 ? B.blue : B.blueLite} stroke={B.white} strokeWidth={4} />
                    {isBagian && potong > 0.001 ? <path d={dPath} fill={B.orange} fillOpacity={Math.min(1, potong)} stroke={B.white} strokeWidth={4} /> : null}
                  </g>);
              })}
              <circle cx={PIE0.x} cy={PIE0.y} r={92} fill={B.white} />
            </svg>
            {/* bagian KITA = murid di potongan oranye ("sebagian kepemilikan"); potongan lain = investor lain */}
            {Array.from({ length: 8 }, (_, k) => {
              const ps = popIn(f, kepemilikan - 20 + (k === 0 ? 0 : 6 + 5 * k), 30) * (1 - kecil);
              if (ps <= 0.001) return null;
              const mid = rad(-90 + k * 45 + 22.5), keluar = k === 0 ? 16 * Math.min(1, potong) : 0, r = PIE_R * 0.71 + keluar;
              return <KarakterLingkar key={`o${k}`} pose={k === 0 ? MURID_S06 : INVESTOR_JAS} x={PIE0.x + Math.cos(mid) * r} y={PIE0.y + Math.sin(mid) * r} D={48} s={ps} warna={B.white} />;
            })}
            <Gedung k="kecil" x={PIE0.x} dasar={PIE0.y + 84} h={165} s={popIn(f, PIE_AT + 50)} />
            <div style={{ position: 'absolute', left: PIE0.x - 200, width: 400, top: PIE0.y + PIE_R + JARAK, textAlign: 'center', lineHeight: 1, opacity: 1 - kecil }}>
              <WordText halus f={f} at={perusahaan} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Perusahaan</WordText>
            </div>
            {/* nominal: nilai perusahaan (miliar) · bagian kita (juta, di sisi potongan oranye) */}
            <PilNominal x={PIE0.x + 112} y={PIE0.y + PIE_R + JARAK + 17} jangkar="kiri" teks={rpMiliar(100, 0)} arah={0} p={popIn(f, perusahaan + 20) * (1 - kecil)} size={24} />
            <PilNominal x={PIE0.x + PIE_R * 0.74 + 30} y={PIE0.y - PIE_R * 0.84} jangkar="kiri" teks={rpJuta(1)} arah={0} p={popIn(f, kepemilikan + 30) * (1 - kecil)} size={24} />
          </div>) : null}
        {f >= TENGAH && opNode > 0.001 ? <SimpulBab x={nx} y={ny} d={nd} col={B.orange} ikon="saham" isi={1} op={opNode} /> : null}

        {/* ═════ lencana PERUSAHAAN (→ investor di akhir) + cabang ke dua kartu ═════ */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {/* cabang: perusahaan → kartu (tumbuh BERSAMA kartunya); di akhir jadi panah return ke investor */}
          <Cabang x1={LENCANA.x} y1={LENCANA.y + LENCANA.D / 2 + GAP} x2={XL} y2={KARTU.top - GAP} g={grow(f, KIRI_AT)} panahBalik={grow(f, hasil)} col={B.blue} />
          <Cabang x1={LENCANA.x} y1={LENCANA.y + LENCANA.D / 2 + GAP} x2={X_KANAN} y2={KARTU.top - GAP} g={grow(f, KANAN_AT + 10)} panahBalik={grow(f, perubahan)} col={B.orange} />
        </svg>
        {opLencana > 0.001 ? <div style={{ position: 'absolute', inset: 0, opacity: opLencana }}>
          {/* tahap gedung: yang lama mengecil + pudar, yang baru pop dari 0 (dulu tukar gambar seketika — jeglek f16899) */}
          {([['kecil', 120, -1e9, berkembang + 10], ['menengah', 150, berkembang + 10, menciptakan - 10], ['besar', 178, menciptakan - 10, 1e9]] as const).map(([k, h, a, b]) => {
            const masuk = a < 0 ? 1 : popIn(f, a), keluar = 1 - R(f, b - 20, b + 10, 0, 1, io);
            const s = masuk * keluar;
            return s > 0.001 ? <div key={k} style={{ position: 'absolute', inset: 0, opacity: Math.min(1, keluar * 1.5) }}><GedungLingkar k={k} x={LENCANA.x} cy={LENCANA.y} D={LENCANA.D} h={h} s={s} warna={B.turq} wash={B.turqWash} /></div> : null;
          })}
          <div style={{ position: 'absolute', left: LENCANA.x + LENCANA.D / 2 + JARAK, top: LENCANA.y - 30, whiteSpace: 'nowrap', lineHeight: 1 }}>
            <span style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>Perusahaan</span>
          </div>
          <PilNominal x={LENCANA.x + LENCANA.D / 2 + JARAK} y={LENCANA.y + 26} jangkar="kiri" teks={rpMiliar(nilaiPerusahaan, 0)} arah={R(nilaiPerusahaan, 100, 120, 0, 1, io)} p={1} size={24} lebarMin={130} />
        </div> : null}
        {opInvestor > 0.001 ? <div style={{ position: 'absolute', inset: 0, opacity: opInvestor }}>
          <KarakterLingkar pose={MURID_S06} x={LENCANA.x} y={LENCANA.y} D={LENCANA.D} s={1} warna={B.orange} />
          <div style={{ position: 'absolute', left: LENCANA.x + LENCANA.D / 2 + JARAK, top: LENCANA.y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', lineHeight: 1 }}>
            <WordText halus f={f} at={BALIK + 10} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>Investor</WordText>
          </div>
        </div> : null}
        {/* dua sumber return (di panah ke investor) */}
        <PilLabel x={lerp(LENCANA.x, X_KIRI, 0.5) - 40} y={(LENCANA.y + KARTU.top) / 2 + 26} p={popIn(f, hasil + 20)} teks="Hasil bisnis" ikon="bisnisLaba" col={B.blue} />
        <PilLabel x={lerp(LENCANA.x, X_KANAN, 0.5) + 40} y={(LENCANA.y + KARTU.top) / 2 + 26} p={popIn(f, perubahan + 20)} teks="Perubahan harga" ikon="naikTurunHarga" col={B.orange} />

        {/* ═════ kartu BISNIS ═════ */}
        {pKiri > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: pKiri }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: KARTU.w, height: KARTU.h, transform: `${geser(XL - KARTU.w / 2, KARTU.top + (1 - pKiri) * 30)}`, ...glass(B.blue), background: B.white }} />
            {/* sorot "hasil yang dihasilkan bisnis" = baris Laba */}
            {sorotAkhir(hasil) > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: KARTU.w - 40, height: 100, borderRadius: 20, background: rgba(B.orange, 0.12 * sorotAkhir(hasil)), border: `2.5px solid ${rgba(B.orange, 0.6 * sorotAkhir(hasil))}`, transform: geser(XL - KARTU.w / 2 + 20, BARIS[2] - 50) }} /> : null}
            <KepalaKartu x={XL} f={f} at={bisnisnya} teks="Bisnis" />
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              {[1, 2].map((i) => <Konektor key={i} x1={XL - 230} y1={BARIS[i - 1] + ID / 2 + 8} x2={XL - 230} y2={BARIS[i] - ID / 2 - 8} g={grow(f, [produk, pendapatan, laba][i] - 30)} col={[WARNA.langit, B.orange][i - 1]} />)}
              {/* laba diinvestasikan kembali: lengkung dari Laba naik ke Produk & layanan (S08) */}
              <LengkungBalik x={XL - 230 - ID / 2 - 12} yA={BARIS[2]} yB={BARIS[0]} g={grow(f, kembali)} />
            </svg>
            {[
              { y: BARIS[0], ikon: 'produkLayanan' as KunciIkon, col: B.turq, teks: 'Produk & layanan', at: produk },
              { y: BARIS[1], ikon: 'pendapatan' as KunciIkon, col: WARNA.langit, teks: 'Pendapatan', at: pendapatan, rp: lerp(50, 80, tumbuhUang) },
              { y: BARIS[2], ikon: 'bisnisLaba' as KunciIkon, col: B.orange, teks: 'Laba', at: laba, rp: lerp(10, 16, tumbuhUang) },
            ].map((b) => (
              <React.Fragment key={b.teks}>
                <Bulat x={XL - 230} y={b.y} d={ID} col={b.col} ikon={b.ikon} s={popIn(f, b.at)} />
                <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(XL - 230 + ID / 2 + JARAK, b.y - (b.rp ? 34 : 17)), whiteSpace: 'nowrap', lineHeight: 1 }}>
                  <WordText halus f={f} at={b.at + 10} style={{ fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night }}>{b.teks}</WordText>
                </div>
                {b.rp ? <PilNominal x={XL - 230 + ID / 2 + JARAK} y={b.y + 22} jangkar="kiri" teks={rpMiliar(b.rp, 0)} arah={tumbuhUang} p={popIn(f, b.at + 30)} size={22} lebarMin={110} /> : null}
              </React.Fragment>))}
            {/* uang mengalir: produk → pendapatan → laba */}
            {[1, 2].map((i) => {
              const t0 = [produk, pendapatan, laba][i] - 30, t = R(f, t0, t0 + 45, 0, 1, io);
              if (t <= 0 || t >= 1) return null;
              return <LembarUang key={i} x={XL - 230} y={lerp(BARIS[i - 1] + ID / 2, BARIS[i] - ID / 2, t)} w={60} putar={lerp(-10, 8, t)} op={Math.min(1, R(f, t0, t0 + 8, 0, 1, io), R(f, t0 + 37, t0 + 45, 1, 0, io))} />;
            })}
            {/* S08: sebagian laba dipakai lagi — Skala usaha (perusahaan) · Produk baru · Pasar baru (pendapatan) */}
            <PilLabel x={XL + 208} y={KEPALA_Y} p={popIn(f, memperbesar)} teks="Skala usaha" ikon="skalaUsaha" col={WARNA.ungu} kecil />
            <PilLabel x={XL + 208} y={BARIS[0]} p={popIn(f, mengembangkan)} teks="Produk baru" ikon="produkLayanan" col={B.turq} kecil />
            <PilLabel x={XL + 208} y={BARIS[1]} p={popIn(f, pasar2)} teks="Pasar baru" ikon="pasarBaru" col={WARNA.langit} kecil />
          </div>) : null}

        {/* ═════ kartu HARGA SAHAM ═════ */}
        {pKanan > 0.001 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: pKanan }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: KARTU.w, height: KARTU.h, transform: `${geser(X_KANAN - KARTU.w / 2, KARTU.top + (1 - pKanan) * 30)}`, ...glass(B.orange), background: B.white }} />
            {sorotAkhir(perubahan) > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, width: KARTU.w - 40, height: 236, borderRadius: 20, background: rgba(B.orange, 0.1 * sorotAkhir(perubahan)), border: `2.5px solid ${rgba(B.orange, 0.6 * sorotAkhir(perubahan))}`, transform: geser(X_KANAN - KARTU.w / 2 + 20, GR.y - 150) }} /> : null}
            <KepalaKartu x={X_KANAN} f={f} at={sahamnya} teks="Harga saham" />
            {/* rata-rata return historis saham (grafik Simon: 15,2%/tahun) — feedback: tiap aset sebutkan return historisnya */}
            <PilNominal x={X_KANAN + 84} y={KEPALA_Y} jangkar="kiri" teks="±15,2%/tahun" arah={0} p={popIn(f, sahamnya + 40)} size={20} />
            {/* pasar (pembeli & penjual) memberi harga untuk kepemilikan itu; "menilai" = kaca pembesar */}
            <KarakterLingkar pose={INVESTOR_JAS} x={X_KANAN - 225} y={588} D={78} s={popIn(f, pasar)} warna={B.turq} />
            <KarakterLingkar pose={MURID_S06} x={X_KANAN - 135} y={588} D={78} s={popIn(f, pasar + 8)} warna={B.orange} />
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              <Konektor x1={X_KANAN - 80} y1={588} x2={X_KANAN - 10} y2={588} g={grow(f, pasar + 30)} col={B.orange} />
            </svg>
            <PilNominal x={X_KANAN} y={588} jangkar="kiri" teks={`Rp${Math.round(nilaiLembar).toLocaleString('id-ID')}/lembar`} arah={gHarga > 0 ? Math.max(-1, Math.min(1, (nilaiLembar - 1250) / 120)) : 0} p={popIn(f, pasar + 40)} size={24} lebarMin={200} />
            <KacaMenilai x={X_KANAN - 66} y={548} p={popIn(f, menilai) * (1 - R(f, investor - 20, investor + 20, 0, 1, io))} />
            {/* grafik: harga (hijau/merah thd harga awal) · S08: garis LABA mulus (biru putus) — tidak harus sama setiap hari */}
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              <line x1={GR.x0} x2={lerp(GR.x0, GR.x1, grow(f, pasar + 50))} y1={GR.y} y2={GR.y} stroke={B.grayLite} strokeWidth={3} strokeDasharray={LINE.dash} strokeLinecap="round" />
              {gHarga > 0.001 ? (
                <>
                  <defs>
                    <clipPath id="s8-atas"><rect x={0} y={0} width={1920} height={GR.y} /></clipPath>
                    <clipPath id="s8-bawah"><rect x={0} y={GR.y} width={1920} height={1080 - GR.y} /></clipPath>
                  </defs>
                  <polyline clipPath="url(#s8-atas)" points={titik.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} fill="none" stroke={ARAH.naik} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                  <polyline clipPath="url(#s8-bawah)" points={titik.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} fill="none" stroke={ARAH.turun} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx={ujung.x} cy={ujung.y} r={8} fill={ujung.y <= GR.y ? ARAH.naik : ARAH.turun} stroke={B.white} strokeWidth={3} />
                </>) : null}
              {gLaba > 0.001 ? <polyline points={Array.from({ length: 21 }, (_, i) => { const u = (i / 20) * gLaba; return `${lerp(GR.x0, GR.x1, u).toFixed(1)},${LABA_Y(u).toFixed(1)}`; }).join(' ')} fill="none" stroke={B.blue} strokeWidth={4} strokeDasharray="10 9" strokeLinecap="round" /> : null}
            </svg>
            {/* legenda kecil grafik (S08): Laba vs Harga */}
            <Legenda x={GR.x0} y={GR.y + 64} p={gLaba} />
          </div>) : null}
        {/* ═════ "dua hal yang harus dibedakan": bisnis ≠ harga saham (ikon tanpa teks) → menjadi ikon kepala kartu ═════ */}
        <Bulat x={lerp(X_KIRI, X_KIRI - 230, keKepalaKiri)} y={lerp(KARTU.top + KARTU.h / 2, KEPALA_Y, keKepalaKiri)} d={lerp(120, 70, keKepalaKiri)} col={B.blue} ikon="perusahaan" s={popIn(f, dua)} />
        <Bulat x={lerp(X_KANAN, X_KANAN - 230, keKepalaKanan)} y={lerp(KARTU.top + KARTU.h / 2, KEPALA_Y, keKepalaKanan)} d={lerp(120, 70, keKepalaKanan)} col={B.orange} ikon="saham" s={popIn(f, dua + 16)} />
        <TidakSama x={(X_KIRI + X_KANAN) / 2} y={KARTU.top + KARTU.h / 2} p={popIn(f, dua + 32)} op={1 - R(f, KIRI_AT - 10, KIRI_AT + 20, 0, 1, io)} />

        {/* ≠ : pertumbuhan bisnis vs pergerakan harga (S08 "dua hal yang berbeda") */}
        <TidakSama x={(X_KIRI + X_KANAN) / 2} y={KARTU.top + KARTU.h / 2} p={popIn(f, berbeda)} op={1 - R(f, hasil - 30, hasil, 0, 1, io)} />
      </AbsoluteFill>
      {/* judul (kolom TEXT naskah) */}
      <Judul f={f} kata={['Perusahaan', 'menghasilkan', 'laba']} at={laba - 20} sorotAt={laba + 20} keluar={pasar - 30} />
      <Judul f={f} kata={['Pasar', 'menentukan', 'harga saham']} at={pasar} sorotAt={nilainya} keluar={menciptakan - 40} />
      <Judul f={f} kata={['Bisnis', 'menciptakan nilai']} at={menciptakan} sorotAt={nilai2 + 10} keluar={menilai - 40} />
      <Judul f={f} kata={['Pasar', 'menentukan', 'harganya']} at={menilai - 10} sorotAt={menilai + 30} />
      <SahamTerbang f={f} />
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.orange, opacity: R(f, BATAS.s12 + 22, BATAS.s12 + 48, 0, 1, io) }} /> : null}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s12 + 34, BATAS.s12 + 48, 0, 1, io) }}><Icon name="saham" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/** Saham terangkat (akhir Reksa Dana) → slot bab 06 di peta bab; koordinat LAYAR (kamera dua scene diperhitungkan) */
const SahamTerbang: React.FC<{ f: number }> = ({ f }) => {
  if (f >= TIBA) return null;
  const t = R(f, S8, TIBA, 0, 1, io);
  const k7 = kamera('S07', S8), k8 = kamera('S08', f);
  const a = keLayar(k7, { x: SAHAM7.x, y: SAHAM7.y - SAHAM_ANGKAT });
  const b = keLayar(k8, SIMPUL_PETA(5));
  const puncak = (cy: number) => { const p = a.y, q = b.y, den = p + q - 2 * cy; return den <= 0 ? Math.min(p, q) : p - ((p - cy) ** 2) / den; };
  const batas = 150 + Math.max(ISI_D * k7.z, SIMPUL_PETA(5).r * 2 * k8.z) / 2;
  let cy = Math.min(a.y, b.y) - 120;
  if (puncak(cy) < batas) { let lo = cy, hi = Math.min(a.y, b.y); for (let i = 0; i < 30; i += 1) { const m = (lo + hi) / 2; if (puncak(m) < batas) lo = m; else hi = m; } cy = hi; }
  const c = { x: (a.x + b.x) / 2, y: cy };
  const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y;
  const d = lerp(ISI_D * k7.z, SIMPUL_PETA(5).r * 2 * k8.z, t);
  return (
    <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: B.orange, border: `${2.5 * (1 - t)}px solid ${B.white}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', zIndex: 1, boxShadow: `0 ${lerp(7, 18, t)}px ${lerp(15, 40, t)}px -${lerp(6, 12, t)}px ${B.orange}aa` }}>
      <Icon name="saham" size={d * lerp(0.56, 96 / 170, t)} color={B.white} />
    </div>);
};

/** cabang perusahaan → kartu (garis putus tumbuh bersama kartu); `panahBalik` = berubah jadi panah PENUH ke atas (return ke investor) */
const Cabang: React.FC<{ x1: number; y1: number; x2: number; y2: number; g: number; panahBalik: number; col: string }> = ({ x1, y1, x2, y2, g, panahBalik, col }) => {
  if (g <= 0.001) return null;
  const ex = lerp(x1, x2, g), ey = lerp(y1, y2, g);
  const sud = Math.atan2(y1 - y2, x1 - x2), ah = 16;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={mixHex(B.grayLite, col, panahBalik)} strokeWidth={LINE.w + panahBalik} strokeDasharray={panahBalik > 0.5 ? undefined : LINE.dash} strokeLinecap="round" />
      {panahBalik > 0.001 ? <path d={`M ${x1 + Math.cos(sud + Math.PI - 0.5) * -ah} ${y1 + Math.sin(sud + Math.PI - 0.5) * -ah} L ${x1} ${y1} L ${x1 + Math.cos(sud + Math.PI + 0.5) * -ah} ${y1 + Math.sin(sud + Math.PI + 0.5) * -ah}`} fill="none" stroke={col} strokeWidth={LINE.w + 1} strokeLinecap="round" strokeLinejoin="round" opacity={panahBalik} /> : null}
    </g>);
};

/** lengkung dari Laba kembali ke atas (laba diinvestasikan kembali) — di kiri kolom ikon, ujung panah di atas */
const LengkungBalik: React.FC<{ x: number; yA: number; yB: number; g: number }> = ({ x, yA, yB, g }) => {
  if (g <= 0.001) return null;
  const xl = x - 34;
  const d = `M ${x} ${yA} C ${xl - 10} ${yA}, ${xl - 10} ${yA}, ${xl} ${yA - 30} L ${xl} ${yB + 30} C ${xl - 10} ${yB}, ${xl - 10} ${yB}, ${x} ${yB}`;
  return (
    <g>
      <path d={d} fill="none" stroke={B.orange} strokeWidth={LINE.w + 1} strokeLinecap="round" pathLength={1000} strokeDasharray={`${1000 * g} 1000`} />
      {g > 0.95 ? <path d={`M ${x - 12} ${yB - 9} L ${x} ${yB} L ${x - 12} ${yB + 9}`} fill="none" stroke={B.orange} strokeWidth={LINE.w + 1} strokeLinecap="round" strokeLinejoin="round" /> : null}
    </g>);
};

/** kepala kartu: judul (ikonnya = ikon "dua hal" yang meluncur ke sini, digambar di luar kartu) */
const KepalaKartu: React.FC<{ x: number; f: number; at: number; teks: string }> = ({ x, f, at, teks }) => (
  <>
    <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x - 230 + 35 + JARAK, KEPALA_Y - 20), whiteSpace: 'nowrap', lineHeight: 1 }}>
      <WordText halus f={f} at={at} style={{ fontFamily: F, fontSize: 38, fontWeight: 800, color: B.night }}>{teks}</WordText>
    </div>
  </>);

/** pil ikon + teks (rata tengah di x) */
const PilLabel: React.FC<{ x: number; y: number; p: number; teks: string; ikon: KunciIkon; col: string; kecil?: boolean }> = ({ x, y, p, teks, ikon, col, kecil }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 10, background: B.white, border: `2.5px solid ${col}`, borderRadius: 999,
    padding: kecil ? '6px 18px 6px 6px' : '8px 22px 8px 8px', fontFamily: F, fontSize: kecil ? 22 : 26, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}88` }}>
    <div style={{ width: kecil ? 36 : 42, height: kecil ? 36 : 42, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={kecil ? 24 : 28} color={B.white} /></div>
    {teks}
  </div>);

/** kaca pembesar stok di atas pasar ("bagaimana pasar menilai") */
const KacaMenilai: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0.001 ? null : (
  <Img src={staticFile('stok/kaca-pembesar.png')} style={{ position: 'absolute', left: 0, top: 0, width: 96, height: 96, transform: `${geser(x - 48, y - 48)} scale(${p}) rotate(-12deg)` }} />);

/** legenda grafik: garis laba (biru putus) · harga (hijau/merah) */
const Legenda: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: geser(x, y), opacity: p, display: 'flex', alignItems: 'center', gap: 26, fontFamily: F, fontSize: 22, fontWeight: 700, color: B.night, whiteSpace: 'nowrap', lineHeight: 1 }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><svg width={34} height={8}><line x1={2} x2={32} y1={4} y2={4} stroke={B.blue} strokeWidth={4} strokeDasharray="10 9" strokeLinecap="round" /></svg>Laba</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><svg width={34} height={8}><line x1={2} x2={17} y1={4} y2={4} stroke={ARAH.naik} strokeWidth={4} strokeLinecap="round" /><line x1={17} x2={32} y1={4} y2={4} stroke={ARAH.turun} strokeWidth={4} strokeLinecap="round" /></svg>Harga saham</span>
  </div>);

/** lingkaran ikon */
const Bulat: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s: number; op?: number }> = ({ x, y, d, col, ikon, s, op = 1 }) =>
  s <= 0.001 || op <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: `translate3d(${x - d / 2}px, ${y - d / 2}px, 0) scale(${s}) rotate(0.001deg)`, opacity: op, boxShadow: `0 14px 30px -12px ${col}aa` }}>
      <Icon name={ikon} size={d * 0.58} color={B.white} />
    </div>);

/** lencana "≠" */
const TidakSama: React.FC<{ x: number; y: number; p: number; op: number }> = ({ x, y, p, op }) => p <= 0.001 || op <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - 40, top: y - 40, width: 80, height: 80, borderRadius: '50%', background: B.white, border: `3px solid ${B.night}`, transform: `scale(${p * 0.8})`, opacity: op, display: 'grid', placeItems: 'center' }}>
    <svg width={80} height={80} viewBox="0 0 80 80"><g fill={B.night}><rect x={22} y={28} width={36} height={7} rx={3.5} /><rect x={22} y={45} width={36} height={7} rx={3.5} /></g><line x1={50} y1={18} x2={30} y2={62} stroke={B.night} strokeWidth={7} strokeLinecap="round" /></svg>
  </div>);

export const S08_BEAT = { saham, kita, sebagian, kepemilikan, perusahaan, dua, pertama, bisnisnya, produk, pendapatan, laba, kedua, sahamnya, diberikan, pasar, nilainya, waktu2, berkembang, labanya, tumbuh, laba2, kembali, memperbesar, mengembangkan, pasar2, menciptakan, nilai2, berbeda, laba3, menilai, investor, hasil, perubahan };
