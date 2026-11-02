import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { ARAH, B, F, R, io, lerp, rgba } from '../theme';
import { cin, Icon } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import type { KunciIkon } from '../ikon';
import { Chip, DompetUang, Kutipan, Lencana, NAMA_UANG, WARNA_UANG, denyut } from '../parts/umum';
import { Kaca, Penghubung, durMasker, geser } from '../parts/kaca';
import { LayarPortfolio, angkaRekamanWealth, angkaSelection } from '../parts/portfolio';

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
 *   C  (VO 15 Okt) "Di Tuntun, kamu bisa memilih instrumen … dari reksa dana, obligasi, sampai saham. Jadi uang aktif, uang stabil, dan uang jangka panjang
 *        bisa punya fungsi yang lebih jelas." — Simon 15 Okt: ADEGAN APLIKASI HANYA di kalimat "Di Tuntun … sampai saham" → ponsel (Selection · rekaman
 *        Obligasi · rekaman Saham) + kartu instrumen; ponsel keluar di "Jadi", kartu ke tengah & berubah jadi jenis uang · centang "jelas"
 *   D  "Karena investasi bukan cuma soal: 'Saya harus beli apa?' Tapi yang lebih penting: 'Saya harus memakai uang yang mana untuk membelinya?'"
 *        kutipan 1 dicoret · kutipan 2 menyala · TERAKHIR: Uang Aktif | Uang Stabil | Uang Jangka Panjang · judul TEXT "Setiap uang punya tempatnya"
 * Rakitan 13 Okt: MASUK = masker Scene 19 mendarat jadi dompet Uang Aktif di tempat pertama (brief Video 02 B); ponsel = bingkai kaca terang +
 * pilihan produk di KARTU KACA melayang dengan penghubung putus-putus bertitik (acuan Simon ref-16 · ref-15); tiga langkah bernomor 01·02·03.
 */

const [ingat, hal, setiap, tempatnya, hidup, tertata, tentukan, kapan, dipakai, pisahkan, tugasnya, baru, pilih, investasinya, tuntun, kamu, memilih,
  instrumen, , tujuan, , , reksa, obligasi, saham, jadi, aktif, stabil, dan, , fungsi, jelas, karena, soal, beli, tapi, saya2, mana] = urut([
  'ingat', 'hal', 'setiap', 'tempatnya', 'hidup', 'tertata', 'tentukan', 'kapan', 'dipakai', 'pisahkan', 'tugasnya', 'baru', 'pilih', 'investasinya', 'tuntun',
  'kamu', 'memilih', 'instrumen', 'setiap', 'tujuan', 'tersebut', 'dari', 'reksa', 'obligasi', 'saham', 'jadi', 'aktif', 'stabil', 'dan', 'jangka', 'fungsi',
  'jelas', 'karena', 'soal', 'beli', 'tapi', 'saya', 'mana', 'membelinya'], BATAS.s20);

/** MASUK Scene 20 = masker Scene 19 menyusut ke dompet Uang Aktif di tempat pertama (mendarat 40f sesudah batas, sebelum "Jadi ingat") */
/** pusat tiap momen (survei 14 Okt): selama A hanya deret dompet (y 333–560) → digeser +94 agar di tengah frame; masker Scene 19 mendarat di posisi geser itu */
const GESER_A = 94, GESER_AB = -21;
export const S20_MASUK = { x: 960, y: 430 + GESER_A, r: 75, warna: WARNA_UANG[0], mulai: BATAS.s20 - 20 };
const DARAT = S20_MASUK.mulai + durMasker;

const T = {
  // tempat muncul di "satu HAL" (tanpa jeda sesudah judul); dompet Uang Aktif sudah di tempatnya sejak masker mendarat
  judul: ingat, slot: [hal, hal + 16, hal + 32], masuk: [DARAT, tempatnya - 2, tempatnya + 16], tertata: tertata,
  langkah: [tentukan, pisahkan, pilih], denyutL: [kapan, tugasnya, investasinya], denyutL1b: dipakai, sub: baru - 20, subSorot: baru,
  // C (VO 15 Okt): "Di Tuntun, kamu bisa memilih instrumen … tujuan tersebut, dari reksa dana, obligasi, sampai saham. Jadi uang aktif, uang stabil, dan uang
  // jangka panjang bisa punya fungsi yang lebih jelas." — layar ponsel: halaman Selection (digulir) → Obligasi → Saham (frame beku); ponsel keluar di "Jadi"
  keluarAB: tuntun - 27, hp: tuntun + 10, chip: [reksa, obligasi, saham], layarB: obligasi, layarA: saham, keluarHP: jadi, pilihDenyut: [kamu, memilih, instrumen, tujuan],
  produk: [aktif, stabil, dan + 10], denyutSlot: setiap, denyutHidup: hidup, denyutFungsi: fungsi, centang: [jelas - 30, jelas - 12, jelas + 6],
  keluarC: karena, judul2: karena + 50, kutipan1: soal + 20, denyutK1: beli, coret: tapi + 10, kutipan2: saya2, sorot2: mana, akhir: [mana - 30, mana - 12, mana + 6], sorotAkhir: mana + 10,
};

/* ── tata letak ── */
const SLOT = { y: 430, d: 150, x: [600, 960, 1320] };
const LANGKAH = { y: 760, x: [490, 960, 1430], w: 400 };
const LANGKAH_ISI: { teks: string; ikon: KunciIkon }[] = [
  { teks: 'Tentukan kapan dipakai', ikon: 'kalender' }, { teks: 'Pisahkan sesuai tugasnya', ikon: 'dompet' }, { teks: 'Pilih cara investasinya', ikon: 'investasiLain' },
];
/** ponsel = layar aplikasi 924 × 2000 + BEZEL 34 (Simon 15 Okt "tambahkan frame hp") — skala dikecilkan supaya tinggi luar tetap 720 px seperti
 *  sebelum ada bingkai (y +30: Simon 15 Okt "turunkan sedikit hpnya") */
const BEZEL = 34;
const HP = { y: 570, s: (0.36 * 2000) / (2000 + 2 * BEZEL) };
/** baris status yang ditutup ("hapus jam, baterai, atau indikator lainnya"): terukur — Selection y 12–28 dari 402 (×2,2985 → tutup 0…86),
 *  frame beku rekaman y 20–71 dari 886 (×1,0429 → tutup 0…101); warna = latar halamannya */
const STATUS_SELECTION = { h: 86, warna: '#FFFFFF' }, STATUS_REKAMAN = { h: 101, warna: '#FFFDFF' };
const KARTU = { x0: 940, w: 680, h: 120, y: [385, 540, 695] };
/** kartu instrumen (VO 15 Okt "dari reksa dana, obligasi, sampai saham") — gambar realistis + menu aplikasinya; urutan = jenis uang yang dituju */
const INSTRUMEN = [
  { nama: 'Reksa dana', menu: 'Wealth · Selection', gambar: 'media/realistis/rd-pasar-uang.webp' },
  { nama: 'Obligasi', menu: 'Wealth · Obligasi', gambar: 'media/realistis/obligasi-pemerintah.webp' },
  { nama: 'Saham', menu: 'Saham · Investing Screener', gambar: 'media/realistis/saham.webp' },
];
const PRODUK_TEKS = ['Rekening bank · RDPU', 'Deposito · RDPT · Obligasi pemerintah', 'Reksa dana indeks · Reksa dana saham · Saham'];
/** Simon 15 Okt "untuk nominal portfolionya buat ulang saja": angka ringkasan aset di layar aplikasi (halaman Selection: Total Asset 9,999,732 · P&L 500,639 ·
 *  Funds 5,030,963 · Bonds 4,968,769; rekaman Obligasi: Total Aset 0 · P&L Kemarin 0) ditulis ulang — satu set yang konsisten di kedua layar:
 *  Reksa dana 61,8 jt + Obligasi 20,4 jt = Total Aset 82,2 jt · P&L +1.735.900 (hijau = naik). Format mengikuti bahasa layarnya (Selection Inggris: koma). */
const NOMINAL = { total: 82_200_000, funds: 61_800_000, bonds: 20_400_000, pnl: 1_735_900 };
const koma = (v: number) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const titik = (v: number) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const Scene20: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s20 - 30) return null;
  const kelAB = cin(f, T.keluarAB), kelC = cin(f, T.keluarC);
  // Simon 15 Okt: aplikasi hanya di kalimat "Di Tuntun … sampai saham" → ponsel keluar di "Jadi"; kartu bergeser ke tengah bersamaan
  const kHP = cin(f, T.keluarHP), x0K = lerp(KARTU.x0, 960 - KARTU.w / 2, kHP);
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

      {/* ── C (VO 15 Okt): "Di Tuntun, kamu bisa memilih instrumen yang sesuai untuk setiap tujuan tersebut, dari reksa dana, obligasi, sampai saham.
          Jadi uang aktif, uang stabil, dan uang jangka panjang bisa punya fungsi yang lebih jelas." ──
          Ponsel (aplikasi Tuntun) sendirian di TENGAH memutar halaman Wealth → Selection (digulir: Stable · Index · Equity Fund Selection = "memilih
          instrumen yang sesuai untuk setiap tujuan") → di tiap kata instrumen: kartu instrumen muncul di kanan & layar berganti (reksa dana = Selection,
          obligasi = Wealth/Obligasi, saham = Investing Screener · Sectors; keduanya frame beku) → "Jadi …" (Simon 15 Okt: aplikasi hanya di kalimat
          "Di Tuntun …"): ponsel keluar, kartu ke tengah; tiap kartu instrumen BERUBAH jadi kartu jenis uangnya di kata "aktif / stabil / jangka"
          (reksa dana pasar uang → Uang Aktif · obligasi → Uang Stabil · saham → Uang Jangka Panjang); centang hijau di "jelas". */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kelC, transform: geser(0, -40 * kelC) }}>
        {kHP < 0.999 ? (() => {
          // ponsel: TENGAH (sendirian) → kiri saat kartu instrumen pertama muncul (geser memimpin 24f) → keluar ke kiri sambil memudar di "Jadi"
          // layar: halaman Selection (digulir) → Obligasi → Saham; yang baru masuk MENUTUPI yang lama yang tetap pekat (tak ada celah tembus)
          // Obligasi & Saham = FRAME BEKU rekaman Simon (15 Okt "agar lebih terbaca … di freeze aja"): Obligasi detik 0,0 (atas daftar: 12 Produk ·
          // FR0101 Profit Tahunan Tertinggi · PBSG001 · PBS030) · Saham detik 7,5 ("yang saham ambil pas di sector aja": Investing Screener tab Sectors —
          // Energy GEMS · BSSR · RATU, Industrial MARK · NAIK; layar diam 5,6–8,2 dtk)
          const masukB = R(f, T.layarB - 12, T.layarB, 0, 1), masukA = R(f, T.layarA - 12, T.layarA, 0, 1);
          return (
            <div style={{ position: 'absolute', inset: 0, opacity: kHP > 0.001 ? 1 - kHP : undefined }}>
              <LayarPortfolio x={lerp(960, 466, cin(f, T.chip[0] - 24)) - 140 * kHP} y={HP.y} s={HP.s} p={popIn(f, T.hp)} bezel={BEZEL}
                halaman={{ src: 'media/rekaman/wealth-selection.jpg', tinggi: 924 * (2000 / 402), alfa: masukB < 1 ? 1 : 0,
                  gulir: 2450 * io(R(f, T.hp - 10, T.layarB, 0, 1)), status: STATUS_SELECTION,
                  angka: angkaSelection({ total: koma(NOMINAL.total), pnl: `+${koma(NOMINAL.pnl)}`, funds: koma(NOMINAL.funds), bonds: koma(NOMINAL.bonds) }) }}
                rekaman={[
                  { src: 'media/rekaman/obligasi-diam.webp', alfa: masukA < 1 ? masukB : 0, status: STATUS_REKAMAN,
                    angka: angkaRekamanWealth({ total: titik(NOMINAL.total), pnl: `+${titik(NOMINAL.pnl)}` }) },
                  { src: 'media/rekaman/saham-diam.webp', alfa: masukA, status: STATUS_REKAMAN },
                ]} />
            </div>);
        })() : null}
        {/* kartu: INSTRUMEN (di katanya) → berubah jadi JENIS UANG (di "aktif / stabil / jangka"); centang hijau "fungsi yang lebih jelas" */}
        {[0, 1, 2].map((k) => {
          const p = popIn(f, T.chip[k]) * (1 + denyut(f, T.denyutFungsi + 10 * k, 0.05));
          if (p <= 0.001) return null;
          // berurutan (bukan silang-pudar bersamaan — dua teks bertumpuk di tengah): isi instrumen habis di paruh pertama, jenis uang masuk di paruh kedua
          const mm = cin(f, T.produk[k]), m = Math.max(0, 2 * mm - 1), m0 = Math.min(1, 2 * mm);
          return (
            <React.Fragment key={`k${k}`}>
              <Kaca x={x0K + KARTU.w / 2} y={KARTU.y[k]} w={KARTU.w} h={KARTU.h} p={p} warna={WARNA_UANG[k]} tab="kiri" tabTebal={10} rona={0.5} radius={26}>
                {m0 < 0.999 ? (
                  <div style={{ position: 'absolute', inset: 0, opacity: Math.max(0.0001, 1 - m0), transform: `translateY(${-18 * m0}px)` }}>
                    <Img src={staticFile(INSTRUMEN[k].gambar)} style={{ position: 'absolute', left: 26, top: KARTU.h / 2 - 42, width: 84, height: 84, objectFit: 'contain' }} />
                    <div style={{ position: 'absolute', left: 122, top: '50%', transform: 'translateY(-50%)', fontFamily: F, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 30, fontWeight: 800, color: B.night }}>{INSTRUMEN[k].nama}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: B.gray }}>{INSTRUMEN[k].menu}</div>
                    </div>
                  </div>) : null}
                {m > 0.001 ? (
                  <div style={{ position: 'absolute', inset: 0, opacity: Math.min(0.9999, m), transform: `translateY(${18 * (1 - m)}px)` }}>
                    <div style={{ position: 'absolute', left: 32, top: KARTU.h / 2 - 34, width: 68, height: 68, borderRadius: '50%', background: WARNA_UANG[k], display: 'grid', placeItems: 'center' }}>
                      <Icon name="dompet" size={38} color={B.white} />
                    </div>
                    <div style={{ position: 'absolute', left: 122, top: '50%', transform: 'translateY(-50%)', fontFamily: F, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 30, fontWeight: 800, color: B.night }}>{NAMA_UANG[k]}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: B.gray }}>{PRODUK_TEKS[k]}</div>
                    </div>
                  </div>) : null}
              </Kaca>
              <Lencana x={x0K + KARTU.w - 30 - 0.36 * 120} y={KARTU.y[k] - KARTU.h / 2 + 30 + 0.36 * 120} d={120} p={popIn(f, T.centang[k])} warna={ARAH.naik} ikon="tersedia" besar={52} />
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
