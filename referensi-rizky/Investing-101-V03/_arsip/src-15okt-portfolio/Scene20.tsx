import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, io, lerp, rgba } from '../theme';
import { cin, Icon } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import type { KunciIkon } from '../ikon';
import { Chip, DompetUang, Kutipan, Lencana, NAMA_UANG, WARNA_UANG, denyut } from '../parts/umum';
import { Kaca, Penghubung, durMasker, geser } from '../parts/kaca';
import { LayarPortfolio, type TabPortfolio } from '../parts/portfolio';

/**
 * SCENE 20 — IDE VISUAL (13 Okt). PENUTUP. Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  TUNTUN PORTFOLIO ↓ UANG AKTIF ✓ → Rekening Bank / RDPU · UANG STABIL ✓ → Deposito / RDPT / Obligasi Pemerintah ·
 *           UANG JANGKA PANJANG ✓ → Index Fund / Reksa Dana Saham / Saham · Terakhir: UANG AKTIF | UANG STABIL | UANG JANGKA PANJANG
 *   TEXT    "Pisahkan uangnya dulu" / "[baru] pilih investasinya" · "Setiap uang punya [tempatnya]"
 * Empat ketukan (35,7 dtk):
 *   A  "Jadi ingat satu hal: kalau setiap uang punya tempatnya, hidup juga jadi lebih tertata."
 *        isi Scene 19 keluar · judul TEXT · tiga tempat (putus-putus) · tiga dompet masuk ke tempatnya · centang "tertata"
 *   B  "Tentukan dulu kapan uang itu akan dipakai, pisahkan sesuai tugasnya, baru pilih cara investasinya."
 *        tiga langkah ① kapan dipakai → ② pisahkan sesuai tugas → ③ pilih investasi, di katanya · sub-judul TEXT (sorot "baru")
 *   C  "Di portofolio Tuntun, tiga jenis uang ini juga bisa disusun terpisah, supaya uang aktif, uang stabil, dan uang jangka panjang punya tempat yang jelas."
 *        ponsel "Portofolio Tuntun" (tiruan sederhana) · tiga kantong tersusun terpisah · tiap jenis uang → pilihan produknya · centang "tempat yang jelas"
 *   D  "Karena investasi bukan cuma soal: 'Saya harus beli apa?' Tapi yang lebih penting: 'Saya harus memakai uang yang mana untuk membelinya?'"
 *        kutipan 1 dicoret · kutipan 2 menyala · TERAKHIR: Uang Aktif | Uang Stabil | Uang Jangka Panjang · judul TEXT "Setiap uang punya tempatnya"
 * Rakitan 13 Okt: MASUK = masker Scene 19 mendarat jadi dompet Uang Aktif di tempat pertama (brief Video 02 B); ponsel = bingkai kaca terang +
 * pilihan produk di KARTU KACA melayang dengan penghubung putus-putus bertitik (acuan Simon ref-16 · ref-15); tiga langkah bernomor 01·02·03.
 */

const [ingat, hal, setiap, tempatnya, hidup, tertata, tentukan, kapan, dipakai, pisahkan, tugasnya, baru, pilih, investasinya, portofolio, tuntun, tiga, disusun,
  terpisah, supaya, aktif, stabil, dan, jangka, jelas, karena, soal, beli, tapi, saya2, mana] = urut([
  'ingat', 'hal', 'setiap', 'tempatnya', 'hidup', 'tertata', 'tentukan', 'kapan', 'dipakai', 'pisahkan', 'tugasnya', 'baru', 'pilih', 'investasinya', 'portofolio',
  'tuntun', 'tiga', 'disusun', 'terpisah', 'supaya', 'aktif', 'stabil', 'dan', 'jangka', 'jelas', 'karena', 'soal', 'beli', 'tapi', 'saya', 'mana',
  'membelinya'], BATAS.s20);

/** MASUK Scene 20 = masker Scene 19 menyusut ke dompet Uang Aktif di tempat pertama (mendarat 40f sesudah batas, sebelum "Jadi ingat") */
/** pusat tiap momen (survei 14 Okt): selama A hanya deret dompet (y 333–560) → digeser +94 agar di tengah frame; masker Scene 19 mendarat di posisi geser itu */
const GESER_A = 94, GESER_AB = -21;
export const S20_MASUK = { x: 960, y: 430 + GESER_A, r: 75, warna: WARNA_UANG[0], mulai: BATAS.s20 - 20 };
const DARAT = S20_MASUK.mulai + durMasker;

const T = {
  // tempat muncul di "satu HAL" (tanpa jeda sesudah judul); dompet Uang Aktif sudah di tempatnya sejak masker mendarat
  judul: ingat, slot: [hal, hal + 16, hal + 32], masuk: [DARAT, tempatnya - 2, tempatnya + 16], tertata: tertata,
  langkah: [tentukan, pisahkan, pilih], denyutL: [kapan, tugasnya, investasinya], denyutL1b: dipakai, sub: baru - 20, subSorot: baru,
  keluarAB: portofolio - 20, hp: portofolio + 10, zoom: tiga - 10, logo: tuntun, kantong: [tiga, tiga + 18, tiga + 36], pisah: [disusun, terpisah + 20],
  denyutKantong: supaya, produk: [aktif, stabil, dan + 10], denyutSlot: setiap, denyutHidup: hidup, denyutK3: jangka, denyutP3: jangka + 30, centang: [jelas - 30, jelas - 12, jelas + 6],
  keluarC: karena, judul2: karena + 50, kutipan1: soal + 20, denyutK1: beli, coret: tapi + 10, kutipan2: saya2, sorot2: mana, akhir: [mana - 30, mana - 12, mana + 6], sorotAkhir: mana + 10,
};

/* ── tata letak ── */
const SLOT = { y: 430, d: 150, x: [600, 960, 1320] };
const LANGKAH = { y: 760, x: [490, 960, 1430], w: 400 };
const LANGKAH_ISI: { teks: string; ikon: KunciIkon }[] = [
  { teks: 'Tentukan kapan dipakai', ikon: 'kalender' }, { teks: 'Pisahkan sesuai tugasnya', ikon: 'dompet' }, { teks: 'Pilih cara investasinya', ikon: 'investasiLain' },
];
/** layar Portfolio (LAYAR 924 × 2000 diskalakan 0,36 → 333 × 720) · baris aset di layar (y layar) · kartu jenis uang di kanan */
/** zoom (Simon 14 Okt: layar utuh 0,36 terlalu kecil untuk dibaca): utuh dulu → memperbesar ke tab + daftar aset (layar asli y 580…1460, skala 0,62) */
// atasZ 614: jendela zoom mulai DI BAWAH pita abu pemisah (layar asli y 595–609), bukan memotongnya
const HP = { x: 586, y: 540, s: 0.36, sZ: 0.62, atasZ: 614, bawahZ: 1460 }; // y 540 (pindai pusat 14 Okt: dulu +35)
const BARIS_HP = { kanan: (894 - 462) * 0.62, y: [916, 1112, 1308].map((v) => HP.y + (v - (614 + 1460) / 2) * 0.62) };
const KARTU = { x0: 940, w: 680, h: 120, y: [385, 540, 695] };
const PRODUK_TEKS = ['Rekening bank · RDPU', 'Deposito · RDPT · Obligasi pemerintah', 'Reksa dana indeks · Reksa dana saham · Saham'];
/** Simon 15 Okt: "aku mengirimkan 3 screenshot, itu digunakan ketiganya sesuai dengan voicenya" → tiga tab layar Portfolio, masing-masing di kata VO-nya:
 *  "uang AKTIF" → tab Mutual Fund (RD Pasar Uang) · "uang STABIL" → tab Bonds (obligasi pemerintah) · "dan uang JANGKA PANJANG" → tab Stocks (saham).
 *  Isi (Simon 14 Okt "tambahkan asset investasi"): total Rp108.350.000 = aktif 15,25 jt · stabil 40,8 jt (RDPT + ORI + SBR) · jangka panjang 52,3 jt
 *  (RD saham + BBCA + BBRI + TLKM). Untung = nilai × p / (1 + p). Tab awal = Stocks (screenshot pertama, tab bawaan aplikasi). */
const ribu = (v: number) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const persen = (p: number) => `${(Math.abs(p) * 100).toFixed(2).replace('.', ',')}%`;
const aset = (nama: string, jenis: string, v: number, p: number, rupa: { gambar?: string; lencana?: string }) => ({
  nama, jenis, nilai: `Rp${ribu(v)}`, untung: `${p < 0 ? '−' : '+'}Rp${ribu(Math.round(Math.abs((v * p) / (1 + p)) / 100) * 100)} (${p < 0 ? '−' : ''}${persen(p)})`, turun: p < 0, ...rupa });
const TABS: TabPortfolio[] = [
  { judul: 'Stocks', ikon: 'stock', warnaIkon: B.blue, diinvestasi: 'Rp26.150.000', baris: [
    aset('BBCA', 'Bank Central Asia Tbk', 13_200_000, 0.0526, { lencana: 'BBCA' }),
    aset('BBRI', 'Bank Rakyat Indonesia Tbk', 7_500_000, 0.0582, { lencana: 'BBRI' }),
    aset('TLKM', 'Telkom Indonesia Tbk', 5_450_000, -0.0291, { lencana: 'TLKM' })] },
  { judul: 'Mutual Funds', ikon: 'reksa', warnaIkon: B.blue, diinvestasi: 'Rp61.800.000', baris: [
    aset('RD Pasar Uang', 'Mutual Fund · Money Market', 15_250_000, 0.004, { gambar: 'media/realistis/rd-pasar-uang.webp' }),
    aset('RD Pendapatan Tetap', 'Mutual Fund · Fixed Income', 20_400_000, 0.021, { gambar: 'media/realistis/rd-pendapatan-tetap.webp' }),
    aset('RD Saham', 'Mutual Fund · Equity', 26_150_000, 0.046, { gambar: 'media/realistis/rd-saham.webp' })] },
  { judul: 'Bonds', ikon: 'bonds', warnaIkon: B.orange, diinvestasi: 'Rp20.400.000', baris: [
    aset('Obligasi Negara Ritel', 'ORI · Obligasi Pemerintah', 10_000_000, 0.0051, { lencana: 'ORI' }),
    aset('Savings Bond Ritel', 'SBR · Obligasi Pemerintah', 10_400_000, 0.0053, { lencana: 'SBR' })] },
];
/** jenis uang k → tab & baris yang disorot (aktif: RD Pasar Uang · stabil: kedua obligasi · jangka panjang: ketiga saham) */
const PETA = [{ tab: 1, baris: [0] }, { tab: 2, baris: [0, 1] }, { tab: 0, baris: [0, 1, 2] }];

export const Scene20: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s20 - 30) return null;
  const kelAB = cin(f, T.keluarAB), kelC = cin(f, T.keluarC);
  const zoom = cin(f, T.zoom);
  // geser memimpin 18f: pop (ease-out-back, waktu linear) sudah 75 % besar di −15f sementara geser inOut baru 6 % → dulu kutipan 2 & dompet muncul di bawah
  const dD = lerp(lerp(230, 135, cin(f, T.kutipan2 - 20)), 8, cin(f, T.akhir[0] - 20));
  return (
    <AbsoluteFill>
      {/* ── A–B: setiap uang punya tempatnya · tiga langkah ── */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kelAB, transform: geser(0, lerp(GESER_A, GESER_AB, cin(f, T.langkah[0] - 24)) - 40 * kelAB) }}>
        {[0, 1, 2].map((k) => {
          // TANPA tempat kosong (Simon 13 Okt): tiap tempat tumbuh BERSAMA dompetnya (tempat 1 di "hal" mengelilingi dompet Uang Aktif yang sudah ada);
          // baris tempat bergeser bertahap saat dompet berikutnya masuk — tengah di setiap momen
          const s = popIn(f, k === 0 ? T.slot[0] : T.masuk[k] + 14) * (1 + denyut(f, T.denyutSlot + 10 * k, 0.06) + denyut(f, T.denyutHidup + 12 * k, 0.07));
          const m = R(f, T.masuk[k] - 30, T.masuk[k] + 20, 0, 1, io);
          const c = popIn(f, T.tertata + 10 * k);
          // −36 begitu dompet ketiga masuk: label "Uang Jangka Panjang" lebih panjang → deretan + label terukur +36 px ke kanan (verifikasi 14 Okt)
          const x = SLOT.x[k] + (SLOT.x[1] - SLOT.x[0]) / 2 * ((1 - cin(f, T.masuk[1] - 24)) + (1 - cin(f, T.masuk[2] - 24))) - 36 * cin(f, T.masuk[2] - 24);
          return (
            <React.Fragment key={k}>
              {s > 0.001 ? <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: 'center', width: SLOT.d + 44, height: SLOT.d + 44, borderRadius: 34,
                border: `3px solid ${c > 0.5 ? WARNA_UANG[k] : rgba(WARNA_UANG[k], 0.35)}`, background: rgba(B.white, 0.6), transform: `${geser(x - SLOT.d / 2 - 22, SLOT.y - SLOT.d / 2 - 22)} scale(${s})` }} /> : null}
              {k === 0 ? (f >= DARAT ? <DompetUang k={0} x={x} y={SLOT.y} d={SLOT.d} p={0.99996 * (1 + denyut(f, T.judul + 24, 0.07))} f={f} labelAt={Math.max(T.slot[0] + 10, DARAT + 30)} labelPx={30} ikonAlfa={R(f, DARAT, DARAT + 20, 0, 1, io)} /> : null)
                : m > 0.001 ? <div style={{ position: 'absolute', inset: 0, transform: geser(0, lerp(-260, 0, m)), opacity: Math.min(1, m * 3) }}>
                  <DompetUang k={k} x={x} y={SLOT.y} d={SLOT.d} p={1} f={f} labelAt={T.masuk[k] + 20} labelPx={30} />
                </div> : null}
              <Lencana x={x + 22} y={SLOT.y - 22} d={SLOT.d} p={c} warna={ARAH.naik} ikon="tersedia" besar={56} />
            </React.Fragment>);
        })}
        {/* tiga langkah: GESER BERTAHAP supaya langkah yang sudah muncul selalu berpusat (aturan Simon: tengah di setiap momen) */}
        <div style={{ position: 'absolute', inset: 0, transform: geser((LANGKAH.x[1] - LANGKAH.x[0]) / 2 * ((1 - cin(f, T.langkah[1] - 24)) + (1 - cin(f, T.langkah[2] - 24))), 0) }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {[0, 1].map((i) => <Penghubung key={`l${i}`} d={`M ${LANGKAH.x[i] + LANGKAH.w / 2 + 12} ${LANGKAH.y} L ${LANGKAH.x[i + 1] - LANGKAH.w / 2 - 12} ${LANGKAH.y}`}
            g={R(f, T.langkah[i + 1] - 40, T.langkah[i + 1], 0, 1, io)} warna={WARNA_UANG[i + 1]} tebal={4}
            panah={{ x: LANGKAH.x[i + 1] - LANGKAH.w / 2 - 12, y: LANGKAH.y, sudut: 0 }} />)}
        </svg>
        {LANGKAH_ISI.map((l, i) => (
          <React.Fragment key={l.teks}>
            <Chip x={LANGKAH.x[i]} y={LANGKAH.y} teks={l.teks} ikon={l.ikon} warna={WARNA_UANG[i]} lebar={LANGKAH.w} size={26}
              p={popIn(f, T.langkah[i]) * (1 + denyut(f, T.denyutL[i], 0.06) + (i === 0 ? denyut(f, T.denyutL1b, 0.06) : 0))} />
            {(() => {
              const p = popIn(f, T.langkah[i] + 8);
              if (p <= 0.001) return null;
              return <div style={{ position: 'absolute', left: LANGKAH.x[i] - LANGKAH.w / 2 - 26, top: LANGKAH.y - 26 - 36, width: 52, height: 52, borderRadius: '50%',
                background: WARNA_UANG[i], color: B.white, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 21, fontWeight: 800, transform: `scale(${p})`,
                border: `3px solid ${B.white}`, boxShadow: `0 8px 18px -8px ${WARNA_UANG[i]}cc` }}>{String(i + 1).padStart(2, '0')}</div>;
            })()}
          </React.Fragment>))}
        </div>
      </div>

      {/* ── C: portofolio Tuntun — layar Portfolio aplikasi (tiruan screenshot Simon, latar putih, berisi tiga reksa dana) → tiap aset ke jenis uangnya ── */}
      {/* GESER BERTAHAP: layar sendirian di TENGAH, lalu bergeser ke kiri saat kartu jenis uang pertama muncul (tengah di setiap momen) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kelC, transform: geser((960 - HP.x) * (1 - cin(f, T.produk[0] - 20)), -40 * kelC) }}>
        {(() => {
          // perpindahan tab DI KATANYA: berpusat 10f sebelum kata (60f inOut) supaya isi tab sudah mendarat saat kartu jenis uangnya muncul
          let dari = 0, ke = 0, e = 0;
          PETA.forEach((m, k) => {
            const t = cin(f, T.produk[k] - 10);
            if (t > 0.001) { dari = k === 0 ? 0 : PETA[k - 1].tab; ke = m.tab; e = t; }
          });
          return (
            <LayarPortfolio x={HP.x} y={HP.y} s={lerp(HP.s, HP.sZ, zoom)} atas={lerp(0, HP.atasZ, zoom)} bawah={lerp(2000, HP.bawahZ, zoom)} radius={lerp(96, 44, zoom)}
              p={popIn(f, T.hp)} total="Rp108.350.000" tab={{ dari, ke, e }}
              // "tiga jenis uang ini juga bisa disusun terpisah": ketiga tab menyala bergiliran, lalu padam bersama sesudah "terpisah"
              sorotTab={[0, 1, 2].map((j) => cin(f, T.kantong[j], 30) * (1 - cin(f, T.pisah[1], 40)))}
              tabs={TABS.map((tb, j) => ({ ...tb, baris: tb.baris.map((b, i) => {
                const k = PETA.findIndex((m) => m.tab === j && m.baris.includes(i));
                return k < 0 ? b : { ...b, warna: WARNA_UANG[k], sorot: cin(f, T.produk[k] + 10) };
              }) }))} />);
        })()}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {[0, 1, 2].map((k) => {
            // penghubung dari kelompok baris yang disorot di tab AKTIF → kartu jenis uangnya; ditarik kembali saat tab berpindah lagi (sumbernya keluar layar)
            const bs = PETA[k].baris, y0 = (BARIS_HP.y[bs[0]] + BARIS_HP.y[bs[bs.length - 1]]) / 2;
            const x0 = HP.x + BARIS_HP.kanan + 10, x1 = KARTU.x0 - 14, y1 = KARTU.y[k];
            const g = R(f, T.produk[k] + 5, T.produk[k] + 45, 0, 1, io) * (k < 2 ? 1 - R(f, T.produk[k + 1] - 55, T.produk[k + 1] - 15, 0, 1, io) : 1);
            return <Penghubung key={`p${k}`} d={`M ${x0} ${y0} C ${x0 + 90} ${y0} ${x1 - 90} ${y1} ${x1} ${y1}`} g={g} warna={WARNA_UANG[k]} tebal={4} />;
          })}
        </svg>
        {/* kartu jenis uang (kaca melayang, ref-16): dompet + nama + pilihan produknya; centang hijau "tempat yang jelas" */}
        {[0, 1, 2].map((k) => {
          const p = popIn(f, T.produk[k] + 10);
          if (p <= 0.001) return null;
          return (
            <React.Fragment key={`k${k}`}>
              <Kaca x={KARTU.x0 + KARTU.w / 2} y={KARTU.y[k]} w={KARTU.w} h={KARTU.h} p={p} warna={WARNA_UANG[k]} tab="kiri" tabTebal={10} rona={0.5} radius={26}>
                <div style={{ position: 'absolute', left: 32, top: KARTU.h / 2 - 34, width: 68, height: 68, borderRadius: '50%', background: WARNA_UANG[k], display: 'grid', placeItems: 'center' }}>
                  <Icon name="dompet" size={38} color={B.white} />
                </div>
                <div style={{ position: 'absolute', left: 122, top: '50%', transform: 'translateY(-50%)', fontFamily: F, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: B.night }}>{NAMA_UANG[k]}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: B.gray }}>{PRODUK_TEKS[k]}</div>
                </div>
              </Kaca>
              <Lencana x={KARTU.x0 + KARTU.w - 30 - 0.36 * 120} y={KARTU.y[k] - KARTU.h / 2 + 30 + 0.36 * 120} d={120} p={popIn(f, T.centang[k])} warna={ARAH.naik} ikon="tersedia" besar={52} />
            </React.Fragment>);
        })}
      </div>

      {/* ── D: dua kutipan · terakhir tiga jenis uang ── */}
      {/* D berpusat di setiap momen: kutipan 1 sendirian di tengah → bergeser naik saat kutipan 2 muncul → posisi akhir saat dompet muncul */}
      <Kutipan x={960} y={310 + dD} teks="Saya harus beli apa?" p={popIn(f, T.kutipan1) * (1 + denyut(f, T.denyutK1, 0.05))} warna={B.gray} coret={R(f, T.coret - 30, T.coret + 30, 0, 1, io)}
        alfa={1 - 0.4 * cin(f, T.coret)} ikon="jual" size={36} />
      <Kutipan x={960} y={500 + dD} teks="Saya harus memakai uang yang mana untuk membelinya?" p={popIn(f, T.kutipan2) * (1 + denyut(f, T.sorot2, 0.04))} warna={B.orange}
        sorot={cin(f, T.sorot2)} ikon="dompet" size={36} />
      {[0, 1, 2].map((k) => (
        <DompetUang key={k} k={k} x={SLOT.x[k]} y={730 + dD} d={110} p={popIn(f, T.akhir[k]) * (1 + denyut(f, T.sorotAkhir + 12 * k, 0.06))} f={f} labelAt={T.akhir[k] + 10} labelPx={28} />))}

      <Judul f={f} kata={['Pisahkan', 'uangnya', 'dulu']} at={T.judul} keluar={T.keluarC} />
      <Judul f={f} kata={['baru', 'pilih', 'investasinya']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={T.keluarC} />
      <Judul f={f} kata={['Setiap', 'uang', 'punya', 'tempatnya']} sorotIdx={3} at={T.judul2} sorotAt={T.sorotAkhir} />
    </AbsoluteFill>);
};

export const S20_T = T;
