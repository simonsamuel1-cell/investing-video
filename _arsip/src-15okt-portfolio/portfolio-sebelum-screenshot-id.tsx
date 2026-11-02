import React from 'react';
import { Img, staticFile } from 'remotion';
import { ARAH, B, F, lerp, rgba } from '../theme';
import { IKON_UI, type KunciUi } from './ikonUi';
import { geser } from './kaca';

/**
 * LAYAR PORTFOLIO APLIKASI TUNTUN (Simon 14 Okt: "gunakan screenshoot yang aku kirimkan, tapi ganti backgroundnya ke warna putih, tambahkan asset
 * investasi"). Tiruan setia tata letak screenshot (924 × 2000, 04_Asset/realistis-simon/portfolio-40/41/42.png) dalam koordinat layar asli, lalu
 * diskalakan `s`. Latar & teks versi terang; kartu Total Asset tetap bergradien seperti aslinya.
 * Simon 15 Okt: "aku mengirimkan 3 screenshot, itu digunakan ketiganya sesuai dengan voicenya" → TIGA TAB (40 Stocks · 41 Mutual Fund · 42 Bonds),
 * masing-masing berisi asetnya; layar berpindah tab (garis bawah bergeser, isi silang-geser) — `tab` = { dari, ke, e }.
 */
export const LAYAR = { w: 924, h: 2000 };
const TEKS = '#16181B', ABU = '#8E8E96', GARIS = '#ECECF1', LATAR2 = '#F4F4F7', UNGU = '#6A4CF5';

const Ui: React.FC<{ k: KunciUi; x: number; y: number; s: number; warna: string }> = ({ k, x, y, s, warna }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ position: 'absolute', left: x - s / 2, top: y - s / 2, color: warna }}
    dangerouslySetInnerHTML={{ __html: IKON_UI[k] }} />);

const T: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; warna?: string; tebal?: number; jangkar?: 'kiri' | 'tengah' | 'kanan'; miring?: boolean }> =
  ({ x, y, size, children, warna = TEKS, tebal = 600, jangkar = 'kiri', miring = false }) => (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${jangkar === 'kiri' ? '0' : jangkar === 'tengah' ? '-50%' : '-100%'}, -50%)`, fontFamily: F,
      fontSize: size, fontWeight: tebal, color: warna, whiteSpace: 'nowrap', lineHeight: 1, fontStyle: miring ? 'italic' : undefined }}>{children}</div>);

/** logo (Simon 15 Okt: berkas logo ORI · ST · BCA · BRI · Telkom): `penuh` = logo persegi berlatar warna (diisi penuh ubin) · `muat` = logo lebar di ubin putih */
export type BarisPortfolio = { nama: string; jenis: string; nilai: string; untung: string; turun?: boolean; gambar?: string; lencana?: string; logo?: { src: string; isi: 'penuh' | 'muat'; latar?: string };
  warna?: string; sorot?: number };
export type TabPortfolio = { judul: string; ikon: KunciUi; warnaIkon: string; diinvestasi: string; baris: BarisPortfolio[] };
/** label tab (x kiri) & garis bawahnya — diukur dari ketiga screenshot (garis bawah: Stocks 39–152 · Mutual Fund 185–386 · Bonds 415–525) */
const TAB = [{ teks: 'Stocks', x: 40, gx: 39, gw: 113 }, { teks: 'Mutual Fund', x: 184, gx: 185, gw: 201 }, { teks: 'Bonds', x: 418, gx: 415, gw: 110 }];

/** layar berpusat (x, y), skala s; `p` = pop dari pusat. `atas`…`bawah` (koordinat layar asli) = bagian yang terlihat — zoom ke daftar aset
 *  memperkecil jendela ini sambil memperbesar s (jendela berpusat di (x, y)); `radius` = sudut jendela dalam px layar asli */
export const LayarPortfolio: React.FC<{ x: number; y: number; s: number; p: number; total: string; tabs: TabPortfolio[];
  /** perpindahan tab: dari → ke, e 0…1 (inOut sudah diterapkan pemanggil) */
  tab: { dari: number; ke: number; e: number };
  /** sorot label tab 0…1 per tab ("tiga jenis uang ini … disusun terpisah") */
  sorotTab?: number[];
  atas?: number; bawah?: number; radius?: number }> = ({ x, y, s, p, total, tabs, tab, sorotTab = [0, 0, 0], atas = 0, bawah = LAYAR.h, radius = 96 }) => {
    if (p <= 0.001) return null;
    const tinggi = bawah - atas;
    const { dari, ke, e } = tab;
    const bobot = (j: number) => (j === dari ? 1 - e : 0) + (j === ke ? e : 0);
    const arah = Math.sign(ke - dari) || 1;
    const gx = lerp(TAB[dari].gx, TAB[ke].gx, e), gw = lerp(TAB[dari].gw, TAB[ke].gw, e);
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: LAYAR.w, height: tinggi, transformOrigin: '0 0',
        transform: `${geser(x - (LAYAR.w * s * p) / 2, y - (tinggi * s * p) / 2)} scale(${s * p})`, borderRadius: radius, overflow: 'hidden', background: B.white,
        boxShadow: `0 60px 120px -50px ${rgba(B.blue, 0.55)}, 0 20px 50px -30px ${rgba(B.night, 0.35)}` }}>
        <div style={{ position: 'absolute', left: 0, top: -atas, width: LAYAR.w, height: LAYAR.h, background: B.white }}>
          {/* bilah status */}
          <T x={52} y={56} size={36} tebal={700}>15.18</T>
          <div style={{ position: 'absolute', left: 724, top: 42, display: 'flex', alignItems: 'flex-end', gap: 5 }}>
            {[12, 18, 24, 30].map((h) => <div key={h} style={{ width: 7, height: h, borderRadius: 2, background: TEKS }} />)}
          </div>
          <T x={778} y={57} size={30} tebal={600}>4G</T>
          <div style={{ position: 'absolute', left: 828, top: 41, width: 54, height: 30, borderRadius: 9, background: TEKS, color: B.white, fontFamily: F, fontSize: 22,
            fontWeight: 800, display: 'grid', placeItems: 'center' }}>39</div>

          {/* kepala: logo · kolom cari · bot · headset · surat */}
          <Img src={staticFile('brand/logo-ikon.png')} style={{ position: 'absolute', left: 48, top: 125, width: 76, height: 76 }} />
          <div style={{ position: 'absolute', left: 153, top: 123, width: 460, height: 78, borderRadius: 22, background: LATAR2 }} />
          <Ui k="cari" x={193} y={162} s={40} warna={ABU} />
          <T x={228} y={163} size={26} warna={ABU} tebal={500}>Search here</T>
          <div style={{ position: 'absolute', left: 642, top: 130, width: 66, height: 64, borderRadius: 24, background: rgba(UNGU, 0.14) }} />
          <Ui k="robot" x={675} y={162} s={46} warna={UNGU} />
          <Ui k="headset" x={776} y={162} s={48} warna={TEKS} />
          <Ui k="surat" x={865} y={162} s={52} warna={TEKS} />

          {/* kartu Total Asset (gradien seperti aslinya) */}
          <div style={{ position: 'absolute', left: 30, top: 237, width: 864, height: 171, borderRadius: 32,
            background: 'linear-gradient(100deg, #2C2470 0%, #33287E 45%, #1F6C7A 100%)' }} />
          <T x={60} y={293} size={30} warna={rgba(B.white, 0.85)} tebal={500}>Total Asset</T>
          <Ui k="mata" x={242} y={293} s={28} warna={rgba(B.white, 0.85)} />
          <T x={60} y={348} size={46} warna={B.white} tebal={700}>{total}</T>
          {(['deposit', 'tarik'] as const).map((k, i) => (
            <React.Fragment key={k}>
              <div style={{ position: 'absolute', left: [608, 768][i], top: 266, width: 70, height: 70, borderRadius: 16, background: rgba(B.white, 0.9) }} />
              <Ui k={k} x={[643, 803][i]} y={301} s={38} warna={'#2C2470'} />
              <T x={[643, 803][i]} y={368} size={28} warna={rgba(B.white, 0.9)} tebal={500} jangkar="tengah">{['Deposit', 'Withdraw'][i]}</T>
            </React.Fragment>))}
          <div style={{ position: 'absolute', left: 412, top: 384, width: 100, height: 32, borderRadius: '50px 50px 0 0', background: B.white }} />
          <Ui k="bawah" x={462} y={400} s={26} warna={ABU} />

          {/* Order List · History */}
          <Ui k="daftarOrder" x={126} y={493} s={56} warna={UNGU} />
          <T x={126} y={549} size={28} tebal={500} jangkar="tengah">Order List</T>
          <Ui k="riwayat" x={350} y={493} s={56} warna={B.orange} />
          <T x={350} y={549} size={28} tebal={500} jangkar="tengah">History</T>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 595, height: 14, background: LATAR2 }} />

          {/* tab: label aktif = tebal miring hitam, lainnya abu (silang-pudar saat pindah) · garis bawah bergeser */}
          {TAB.map((t, j) => {
            const w = Math.min(1, bobot(j)), sr = sorotTab[j] ?? 0;
            return (
              <React.Fragment key={t.teks}>
                {sr > 0.001 ? <div style={{ position: 'absolute', left: t.x - 16, top: 632, width: TAB[j].gw + 34, height: 62, borderRadius: 31,
                  background: rgba(UNGU, 0.14 * sr), border: `3px solid ${rgba(UNGU, 0.55 * sr)}` }} /> : null}
                {w < 0.999 ? <div style={{ opacity: Math.max(0.0001, 1 - w) }}><T x={t.x} y={664} size={36} warna={ABU} tebal={500}>{t.teks}</T></div> : null}
                {w > 0.001 ? <div style={{ opacity: Math.min(0.9999, w) }}><T x={t.x} y={660} size={36} tebal={800} miring>{t.teks}</T></div> : null}
              </React.Fragment>);
          })}
          <div style={{ position: 'absolute', left: gx, top: 680, width: gw, height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${UNGU}, ${rgba(UNGU, 0.35)})` }} />

          {/* isi tiap tab (kepala + aset): silang-geser 70 px ke arah perpindahan */}
          {/* isi tab BERGESER seperti geser-layar aplikasi (dipotong tepi layar): lama keluar ke satu sisi, baru masuk dari sisi lain — tidak pernah kosong
              (pudar berurutan = layar kosong ±6 frame di tengah) dan tidak bertumpuk (silang-pudar = dua daftar menumpuk) */}
          {tabs.map((tb, j) => {
            const pindah = dari !== ke;
            const w = !pindah ? (j === ke ? 1 : 0) : j === dari || j === ke ? 1 : 0;
            if (w <= 0.001 || (pindah && ((j === dari && e >= 0.999) || (j === ke && e <= 0.001)))) return null;
            const dx = !pindah ? 0 : j === ke ? LAYAR.w * arah * (1 - e) : -LAYAR.w * arah * e;
            return (
              <div key={tb.judul} style={{ position: 'absolute', left: 0, top: 0, width: LAYAR.w, height: LAYAR.h, opacity: Math.min(0.9999, w), transform: `translateX(${dx}px)` }}>
                <div style={{ position: 'absolute', left: 0, top: 728, width: 10, height: 58, borderRadius: '0 6px 6px 0', background: UNGU }} />
                <div style={{ position: 'absolute', left: 39, top: 728, width: 58, height: 58, borderRadius: '50%', background: rgba(tb.warnaIkon, 0.12) }} />
                <Ui k={tb.ikon} x={68} y={757} s={34} warna={tb.warnaIkon} />
                <T x={119} y={758} size={34} tebal={800}>{tb.judul}</T>
                <div style={{ position: 'absolute', left: 119 + tb.judul.length * 19.5 + 22, top: 737, width: 2, height: 42, background: GARIS }} />
                <T x={119 + tb.judul.length * 19.5 + 44} y={758} size={30} warna={ABU} tebal={500}>Total Invested <span style={{ color: TEKS, fontWeight: 800 }}>{tb.diinvestasi}</span></T>
                {tb.baris.map((b, i) => {
                  const top = 830 + i * 196, sorot = b.sorot ?? 0;
                  return (
                    <div key={b.nama} style={{ position: 'absolute', left: 30, top, width: 864, height: 172, borderRadius: 26, background: B.white, boxSizing: 'border-box',
                      border: `3px solid ${sorot > 0.001 && b.warna ? rgba(b.warna, 0.2 + 0.8 * sorot) : GARIS}`,
                      boxShadow: sorot > 0.001 && b.warna ? `0 0 0 ${10 * sorot}px ${rgba(b.warna, 0.14)}` : undefined }}>
                      {b.warna ? <div style={{ position: 'absolute', left: -3, top: 30, width: 10, height: 106, borderRadius: '0 6px 6px 0', background: b.warna, opacity: Math.min(0.9999, Math.max(0.0001, sorot)) }} /> : null}
                      {b.logo ? (
                        <div style={{ position: 'absolute', left: 30, top: 30, width: 112, height: 112, borderRadius: 28, overflow: 'hidden', background: b.logo.latar ?? B.white,
                          boxShadow: b.logo.isi === 'muat' && !b.logo.latar ? `inset 0 0 0 2px ${GARIS}` : undefined, display: 'grid', placeItems: 'center' }}>
                          <Img src={staticFile(b.logo.src)} style={b.logo.isi === 'penuh' ? { width: 112, height: 112, objectFit: 'cover' } : { width: b.logo.latar ? 104 : 88, height: b.logo.latar ? 104 : 88, objectFit: 'contain' }} />
                        </div>)
                        : b.gambar ? <Img src={staticFile(b.gambar)} style={{ position: 'absolute', left: 26, top: 26, width: 120, height: 120, objectFit: 'contain' }} />
                        : <div style={{ position: 'absolute', left: 36, top: 36, width: 100, height: 100, borderRadius: '50%', background: rgba(tb.warnaIkon, 0.12), display: 'grid',
                          placeItems: 'center', fontFamily: F, fontSize: b.lencana && b.lencana.length > 3 ? 26 : 30, fontWeight: 800, color: tb.warnaIkon }}>{b.lencana}</div>}
                      <T x={170} y={66} size={32} tebal={800}>{b.nama}</T>
                      <T x={170} y={112} size={26} warna={ABU} tebal={500}>{b.jenis}</T>
                      <T x={836} y={66} size={32} tebal={800} jangkar="kanan">{b.nilai}</T>
                      <T x={836} y={112} size={26} warna={b.turun ? ARAH.turun : ARAH.naik} tebal={700} jangkar="kanan">{b.untung}</T>
                    </div>);
                })}
              </div>);
          })}

          {/* navigasi bawah */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 1798, height: 2, background: GARIS }} />
          {([['insight', 'Insight'], ['watchlist', 'Watchlist'], ['stock', 'Stock'], ['wealth', 'Wealth'], ['consult', 'Consult'], ['portfolio', 'Portfolio']] as const).map(([k, t], i) => {
            const cx = 76 + i * 154, aktif = k === 'portfolio';
            return (
              <React.Fragment key={k}>
                <Ui k={k} x={cx} y={1840} s={52} warna={aktif ? UNGU : TEKS} />
                <T x={cx} y={1897} size={28} warna={aktif ? UNGU : TEKS} tebal={aktif ? 700 : 500} jangkar="tengah">{t}</T>
              </React.Fragment>);
          })}
          <div style={{ position: 'absolute', left: 298, top: 1966, width: 330, height: 12, borderRadius: 6, background: TEKS }} />
        </div>
      </div>);
  };
