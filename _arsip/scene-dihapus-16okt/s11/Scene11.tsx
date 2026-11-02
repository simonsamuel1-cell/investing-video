import React from 'react';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { gayaIsi, kamera, keLayar } from '../kamera';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { ARAH, B, CORET, F, io, mixHex, R, WARNA } from '../theme';
import { Icon, MODE_UKUR, WordText, card, cin, lerp, popOut } from '../parts/kit';
import { Backdrop } from '../parts/Backdrop';
import { KarakterLingkar, MURID_S06 } from '../parts/karakter';
import { popIn } from '../parts/pop';
import { AiTuntun } from '../parts/aiTuntun';
import { Judul } from '../parts/judul';
import { SIMPUL12 } from '../s12/Scene12';

/**
 * SCENE 11 — SAAT HARGA TURUN · IDE VISUAL (7 Okt, VO v4). Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "PRICE ↓ → DON'T PANIC → DON'T ASSUME → RECHECK"
 *   TEXT   "Harga berubah / cek lagi alasan investasinya" (bergantian)
 * Revisi 8 Okt (Simon, brief B–I): MASUK = kamera Scene 10 mendorong ke INVESTOR di lembah "terpaksa menjual" (×3) — investor itu
 * tokoh scene ini. Investor berdiri di atas chip "Harga turun"; dua GELEMBUNG PIKIRAN keluar dari kepalanya (slot putus-putus →
 * "dua kesimpulan ekstrem" terdorong ke tepi → terisi kutipan naskah → dicoret). ADEGAN TANPA TEKS BARU: investor menoleh ke
 * tiap gelembung, titik "sedang mengetik" di gelembung kosong, gemetar panik ("…investasinya jelek"), bersandar santai ("Tenang,
 * nanti pasti naik lagi"); kartu Cek lagi (chat AI Tuntun) — tiap pertanyaan berubin ikon yang berganti (instrumen · sumber
 * return · tujuan → sejak awal → tujuan). Kamera pusat, jarak 16 px, pop berporos di tengah.
 * Revisi Simon 8 Okt (aturan seluruh video): gelembung yang dicoret berubah MERAH (CORET) tanpa diredupkan; gerak hiasan dibuang
 * (gemetar, goyang, toleh, denyut, titik mengetik memantul); semua yang muncul = pop easeOutBack berporos di tengahnya, tepat di kata
 * VO-nya; benda bersaudara berwarna beda (WARNA); teks gelembung/label ≥ 28 px sesudah skala ringkas ×0,78; ubin ≥ 72, kotak cek ≥ 60.
 */
export const S11 = BATAS.s11;
export const IDE_S11_AWAL = S11;

/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
const A0 = (w: string, at: number) => frasa(w, at) - 18;
/* Simon 8 Okt: + harga · jangan (ke-2) · kita · membeli · berasal — tiap benda / pergantian ikon tepat di kata VO-nya */
const [saat, harga, turun, salah, dua, ekstrem, bukan, berarti, harganya, /* turun */, jelek, tapi, jangan, otomatis, berpikir, tenang, lagi, yang,
  kembali, mengecek, sebenarnya, kita, membeli, apa, returnNya, berasal, mana, dan, alasan, sejak, masih, berlaku] = urut(['saat', 'harga', 'turun',
  'salah', 'dua', 'ekstrem', 'bukan', 'berarti', 'harganya', 'turun', 'jelek', 'tapi', 'jangan', 'otomatis', 'berpikir', 'tenang', 'lagi', 'yang',
  'kembali', 'mengecek', 'sebenarnya', 'kita', 'membeli', 'apa', 'return-nya', 'berasal', 'mana', 'dan', 'alasan', 'sejak', 'masih', 'berlaku'], S11);

/* ── tokoh: investor = penunggang Scene 10 diperbesar ×3 (Ø40 → Ø120, border-box) ── */
const ZOOM = 3;
export const INVESTOR11 = { x: 960, y: 560, d: 40 * ZOOM }; // Simon 9 Okt "masalah alignment": investor di TENGAH (dulu 1060)
const JARAK = 16;
/* chip "Harga turun" di bawah investor (tinggi 85: svg 60 + padding 2×10 + tepi 2×2,5) */
const CHIP = { x: INVESTOR11.x, y: INVESTOR11.y + INVESTOR11.d / 2 + JARAK + 85 / 2 };
/* gelembung — Simon 8 Okt: teks ≥ 28 px sesudah skala ringkas ×0,78 → kutipan 36 px. */
/* Simon 9 Okt "masalah pada alignment": dulu investor di 1060 dan gelembung 876 / 676 (tidak simetris). Kini investor di 960, dua
 * gelembung SAMA lebar 640, kutipan DUA baris (teks naskah sama, hanya dipatah) → pasangan 260…1660 simetris terhadap investor. */
const GEL_Y = 350, GEL_H = 150, GEL_W1 = 640, GEL_W2 = 640, CELAH = 120;
/* `dalam` = −1 gelembung kiri, +1 kanan; arah ke investor = −dalam. "dua kesimpulan ekstrem": slot mulai 30 px lebih dekat, lalu terdorong
 * ke tepi — celah awal 60 px > pembesaran lonjakan pop slot 2 (×1,1 → 34 px) → tak pernah bertumpuk (Simon 8 Okt: gelembung kini lebih lebar) */
const SEBAR = 30;
/* ringkas (kembali mengecek): satu baris [gelembung 1 · investor · gelembung 2] skala 0,78, celah 40, berpusat di 960 */
const S_R = 0.78, Y_R = 420;
const BARIS_R = (() => {
  const w1 = GEL_W1 * S_R, w2 = GEL_W2 * S_R, wa = INVESTOR11.d * S_R, kiri = 960 - (w1 + 40 + wa + 40 + w2) / 2;
  return { b1: kiri + w1 / 2, inv: kiri + w1 + 40 + wa / 2, b2: kiri + w1 + 40 + wa + 40 + w2 / 2 };
})();
/** posisi lewat transform ber-rotasi-mikro (bukan left/top): gerak lambat tidak dibulatkan Chrome ke piksel bulat */
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;
const KOREKSI = { coret1: jelek + 15, coret2: lagi + 15 };
/* Simon 8 Okt: tiap gelembung berwarna sendiri (konteks mirip ≠ warna sama) — label, titik mengetik, bingkai padat; dicoret → CORET.
 * label "Jangan …" muncul di kata penyangkalnya: "BUKAN berarti …" · "tapi juga JANGAN otomatis berpikir …"; titik mengetik di kata
 * yang membuka gelembungnya (bukan · tapi) */
const GEL = [
  { x: INVESTOR11.x - CELAH / 2 - GEL_W1 / 2, w: GEL_W1, xR: BARIS_R.b1, dalam: -1, kutip: ['“Harganya turun,', 'berarti investasinya jelek.”'], label: 'Jangan panik',
    warna: WARNA.oranye, slot: salah, padat: A0('bukan', bukan), ketik: bukan, labelAt: bukan, at: M('harganya', harganya), coret: KOREKSI.coret1 },
  { x: INVESTOR11.x + CELAH / 2 + GEL_W2 / 2, w: GEL_W2, xR: BARIS_R.b2, dalam: 1, kutip: ['“Tenang,', 'nanti pasti naik lagi.”'], label: 'Jangan berasumsi',
    warna: WARNA.turkisMuda, slot: dua, padat: A0('tapi', tapi), ketik: tapi, labelAt: jangan, at: M('tenang', tenang), coret: KOREKSI.coret2 },
];
const RINGKAS = A0('yang', yang) + 30;

/* ── kartu Cek lagi (chat AI Tuntun): kelompok maskot (209) + 40 + kartu (880) berpusat di 960 → maskot x 500, kartu x 645 ── */
const KARTU = { x: 645, y: 560, w: 880, h: 330 };
const MASKOT = { x: 500, y: 725, tinggi: 200 };
/* Simon 8 Okt: ubin ikon ≥ 72 (dulu 64), kotak cek ≥ 60 (dulu 54) — tak bertumpuk: teks terpanjang berakhir 739, ubin mulai 760 */
const UBIN = { d: 72, kanan: 48 };
const CENTANG = 60;
type Baris = { teks: string; at: number; cek: number; ikon: KunciIkon[]; ganti: number[]; warna: string };
/* ubin ikon tiap pertanyaan (tanpa teks): instrumen yang kita beli · sumber return-nya · tujuan → sejak awal → tujuan.
 * Simon 8 Okt: baris pop TEPAT di kata pertamanya, centang di kata terakhir, tiap pergantian ikon di satu kata VO (dulu jeda 22f
 * sembarang) → baris 1 hanya punya 3 kata sesudah "sebenarnya" = 4 ikon (properti & reksa dana dilepas). Warna tiap baris beda. */
const CEK: Baris[] = [
  { teks: 'Sebenarnya kita membeli apa?', at: sebenarnya, cek: apa, warna: WARNA.ungu,
    ikon: ['deposito', 'obligasi', 'emas', 'saham'], ganti: [kita, membeli, apa] },
  { teks: 'Return-nya berasal dari mana?', at: returnNya, cek: mana, warna: WARNA.oranyeMuda,
    ikon: ['bunga', 'kupon', 'bisnisLaba'], ganti: [berasal, mana] },
  { teks: 'Alasan investasinya masih berlaku?', at: alasan, cek: berlaku, warna: WARNA.turkis,
    ikon: ['tujuanMenengah', 'tenor', 'tujuanMenengah'], ganti: [sejak, masih] },
];

export const Scene11: React.FC<{ f: number }> = ({ f }) => {
  if (f < S11) return null;
  // KELUAR = milik Scene 12: MASKER LINGKARAN — seluruh isi menyusut ke simpul bab 06 (Saham) di peta bab Scene 12 ("Kalau semua aset
  // tadi kita bandingkan"), berubah oranye (warna bab 06) + ikonnya; bab lain tersingkap di balik lingkaran. 50f mulai BATAS.s12.
  if (f >= BATAS.s12 + 52) return null;
  const ex = R(f, BATAS.s12, BATAS.s12 + 50, 0, 1, io);
  const kam12 = kamera('S12', BATAS.s12 + 50);
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam12, SIMPUL12(5)), r: SIMPUL12(5).r * kam12.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6); // isi menyusut lebih lambat dari lingkarannya → terpotong bertahap
  const ringkas = cin(f, RINGKAS); // gelembung + investor naik jadi satu baris, chip pergi, kartu cek masuk
  const kartu = popIn(f, mengecek); // Simon 8 Okt: kartu cek POP (skala, poros tengah) di "mengecek" — dulu pudar + geser di "kembali"
  const sebar = R(f, ekstrem - 30, ekstrem + 30, 0, 1, io);

  /* investor: posisi & skala ringkas, bersandar santai. Simon 8 Okt: toleh ke gelembung, gemetar & goyang panik, ayun santai DIHAPUS
   * (gerak hiasan tanpa makna); yang tersisa hanya condong santai 6° (tanjakan 60f di "tenang", kembali tegak saat dicoret) */
  const inv = { x: lerp(INVESTOR11.x, BARIS_R.inv, ringkas), y: lerp(INVESTOR11.y, Y_R, ringkas), s: lerp(1, S_R, ringkas) };
  const santai = R(f, tenang - 30, tenang + 30, 0, 1, io) * (1 - R(f, KOREKSI.coret2 - 30, KOREKSI.coret2 + 30, 0, 1, io));
  const rot = -6 * santai;
  // puncak KEPALA (gambar orang menyembul 0,72 r di atas lingkaran: puncak rambut 1,72 r di atas pusat) — titik pikiran menuju kepala, bukan tepi lingkaran
  const kepala = { x: inv.x, y: inv.y - 1.72 * (INVESTOR11.d / 2) * inv.s - 6 };
  /* kamera: geseran tak pernah tepat 0 + rotasi mikro — Chrome tidak membulatkan pan lambat ke piksel bulat (judder 1 px) */
  const kam = kamera('S11', f);

  return (
    <AbsoluteFill style={f >= BATAS.s12 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama DI ATAS peta bab yang baru */}
    {/* Cek menyeluruh 12 Okt (pemindai jeglek f23825, beda 11,3 rata-rata): isi S11 tak berlatar → peta bab S12 TEMBUS di balik kartu cek
        ±12 frame (isian putih baru memudar masuk), dan di frame pertama (ex = 0, belum zIndex) peta tampil DI ATAS kartu. Kini sejak
        BATAS.s12: zIndex aktif + salinan latar global yang PEKAT di dalam lingkaran (rupa sama dengan latar di bawahnya) → peta hanya
        tersingkap di luar lingkaran yang menyusut, sesuai rancangan. */}
    {f >= BATAS.s12 ? (MODE_UKUR ? <AbsoluteFill style={{ background: '#00FF00' }} /> : <Backdrop f={f} />) : null}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s12, BATAS.s12 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      <Judul f={f} kata={['Harga', 'berubah']} at={M('saat', saat) + 20} sorotAt={turun + 40} keluar={RINGKAS} />
      <Judul f={f} kata={['Cek', 'lagi', 'alasan investasinya']} at={mengecek + 10} sorotAt={alasan + 30} />

      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut */}
      <AbsoluteFill style={gayaIsi(kam, f >= BATAS.s12 - 30)}>
        {/* harga turun (merah) — pijakan investor */}
        {/* Simon 8 Okt: pop tepat di "harga" (dulu pusat frasa), tanpa denyut */}
        <HargaTurun f={f} p={popIn(f, harga)} op={1 - ringkas} dy={30 * ringkas} />

        {/* titik pikiran: kepala investor → tiap gelembung. Simon 8 Okt: POP skala berporos di tengah titik (dulu pop dipakai sbg opasitas),
         *  diperbesar 28/18 → 36/24, bingkai ikut warna gelembungnya → MERAH saat dicoret (ekor gelembung = bagian gelembung) */}
        {GEL.map((g, k) => {
          const p = popIn(f, g.slot);
          const op = 1 - R(f, RINGKAS - 30, RINGKAS, 0, 1, io);
          if (p <= 0.001 || op <= 0.001) return null;
          // ekor ikut keadaan bingkai gelembungnya: abu (slot) → warna gelembung (padat) → CORET (dicoret)
          const tepi = mixHex(mixHex(B.grayLite, g.warna, R(f, g.padat, g.padat + 30, 0, 1, io)), CORET, R(f, g.coret - 30, g.coret + 30, 0, 1, io));
          const x = g.x - g.dalam * SEBAR * (1 - sebar);
          const besar = { x: x - g.dalam * (g.w / 2 - 60), y: GEL_Y + GEL_H / 2 + 28 }; // sisi DALAM gelembung (dekat kepala investor); jarak 10 ke tepi bawah
          const kecil = { x: lerp(besar.x, kepala.x, 0.5), y: lerp(besar.y, kepala.y, 0.5) };
          const titik = (c: { x: number; y: number }, d: number) => (
            <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: B.white, border: `3px solid ${tepi}`, opacity: op, transform: `${geser(c.x - d / 2, c.y - d / 2)} scale(${p})` }} />);
          return (
            <React.Fragment key={`t${k}`}>
              {titik(besar, 36)}
              {titik(kecil, 24)}
            </React.Fragment>);
        })}

        {/* dua kesimpulan ekstrem: slot putus-putus → terdorong ke tepi → padat + titik mengetik → kutipan → dicoret */}
        {GEL.map((g, k) => {
          const p = popIn(f, g.slot);
          if (p <= 0.001) return null;
          const coret = R(f, g.coret - 30, g.coret + 30, 0, 1, io);
          const padat = R(f, g.padat, g.padat + 30, 0, 1, io);
          // Simon 8 Okt: titik mengetik DIAM (tanpa pantul berulang) — pop masuk di kata pembuka gelembungnya, pop keluar selesai tepat
          // saat sapuan kutipan mulai (g.at − 30); perkalian, bukan Math.min (lonjakan easeOutBack tetap utuh)
          const ketik = popIn(f, g.ketik) * popOut(f, g.at - 45, 30);
          const x = lerp(g.x - g.dalam * SEBAR * (1 - sebar), g.xR, ringkas), y = lerp(GEL_Y, Y_R, ringkas), s = lerp(1, S_R, ringkas);
          const lab = popIn(f, g.labelAt);
          return (
            // Simon 8 Okt: tanpa denyut & tanpa peredupan (dulu meredup di "otomatis" dan ke 50% saat ringkas)
            <div key={k} style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p * s})` }}>
              <Gelembung f={f} baris={g.kutip} at={g.at} w={g.w} warna={g.warna} coret={coret} padat={padat} ketik={ketik} />
              {/* label "jangan …" — Simon 8 Okt: pop di kata penyangkalnya (dulu di coretan), 36 px (×0,78 ringkas = 28), warna gelembungnya;
               *  tinggi 56 (lineHeight 1) berpusat 44 di atas gelembung → jarak 16 ke tepinya */}
              {lab > 0.001 ? (
                <div style={{ position: 'absolute', left: '50%', top: -44, transform: `translate(-50%, -50%) scale(${lab})`, background: g.warna, color: B.white, borderRadius: 999, padding: '10px 28px', fontFamily: F, fontSize: 36, fontWeight: 800, lineHeight: 1, whiteSpace: 'nowrap' }}>{g.label}</div>) : null}
            </div>);
        })}

        {/* investor (diambil alih dari dorongan kamera Scene 10 — muncul tepat saat lingkarannya selesai, tanpa pop) */}
        {f >= S11 + 50 ? <Investor x={inv.x} y={inv.y} s={inv.s} rot={rot} /> : null}

        {/* AI Tuntun muncul lebih dulu, kartu = balasan chat-nya. Simon 8 Okt: pop tepat di "kembali" (dulu kembali − 10); animasi sprite
         *  (pantul + kedip) = animasi karakternya sendiri, tanpa transform pantul tambahan */}
        <AiTuntun f={f} x={MASKOT.x} y={MASKOT.y} tinggi={MASKOT.tinggi} p={popIn(f, kembali)} t0={kembali - 40} />

        {/* kartu cek lagi (gelembung chat AI Tuntun) — pop berporos di tengah kartu */}
        {kartu > 0.001 ? (
          <div style={{ position: 'absolute', left: KARTU.x, top: KARTU.y, width: KARTU.w, height: KARTU.h, transform: `scale(${kartu})`, transformOrigin: '50% 50%', ...card(B.blue) }}>
            {/* ekor chat menunjuk ke AI Tuntun */}
            <svg width={28} height={44} viewBox="0 0 28 44" style={{ position: 'absolute', left: -26, top: MASKOT.y - KARTU.y - 22 }}><path d="M28 0 L0 22 L28 44 Z" fill={B.white} /></svg>
            {CEK.map((c, k) => {
              const p = popIn(f, c.at);
              const ok = popIn(f, c.cek);
              const yb = 46 + k * 92 + 27;
              return (
                <React.Fragment key={c.teks}>
                  {/* Simon 8 Okt: baris tidak lagi memakai pop sbg opasitas — kotak cek POP (skala, poros tengah) di kata pertamanya, teks
                   *  menyapu per kata; centang = isian berwarna yang POP di kata terakhir (dulu latar berganti mendadak + denyut) */}
                  <div style={{ position: 'absolute', left: 72, top: yb - CENTANG / 2, display: 'flex', alignItems: 'center', gap: 22 }}>
                    <div style={{ position: 'relative', flexShrink: 0, boxSizing: 'border-box', width: CENTANG, height: CENTANG, borderRadius: 16, border: `3px solid ${c.warna}`, background: B.white, transform: `scale(${p})` }}>
                      {ok > 0.001 ? (
                        <div style={{ position: 'absolute', inset: -3, borderRadius: 16, background: c.warna, display: 'grid', placeItems: 'center', transform: `scale(${ok})` }}>
                          <svg width={38} height={38} viewBox="0 0 34 34"><path d="M7 18 L14 25 L28 9" fill="none" stroke={B.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>) : null}
                    </div>
                    <WordText halus f={f} at={c.at + 10} style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>{c.teks}</WordText>
                  </div>
                  <UbinGanti f={f} x={KARTU.w - UBIN.kanan - UBIN.d / 2} y={yb} p={p} b={c} />
                </React.Fragment>);
            })}
          </div>) : null}
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.orange, opacity: R(f, BATAS.s12 + 22, BATAS.s12 + 48, 0, 1, io) }} /> : null}
    {/* ikon bab memudar masuk di atas isian → saat ditukar ke simpul peta (BATAS.s12+52) gambarnya sudah identik */}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s12 + 34, BATAS.s12 + 48, 0, 1, io) }}><Icon name="saham" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/** investor = penunggang Scene 10 ×3 (bentuk & proporsi identik → serah-terima dari dorongan kamera tanpa loncatan); poros = tengah */
const Investor: React.FC<{ x: number; y: number; s: number; rot: number }> = ({ x, y, s, rot }) => (
  // Simon 12 Okt "ganti icon investor, dengan gambar orang berkemeja biru": murid S06 setengah badan di lingkaran oranye (dulu ikon investor di
  // cakram Neon Blue berbingkai putih); condong santai tetap lewat rotasi berporos di pusat lingkaran
  <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot + 0.001}deg)` }}>
    <KarakterLingkar pose={MURID_S06} x={0} y={0} D={INVESTOR11.d} s={s} warna={B.orange} />
  </div>);

/** ubin ikon yang berganti (balik sumbu-Y, 20f inOut cubic berpusat di kata; ikon ditukar saat ubin tegak lurus).
 *  Simon 8 Okt: tanpa denyut saat dicentang; Ø72 (dulu 64); warna = warna barisnya (tiga ubin tak lagi sama-sama oranye) */
const UbinGanti: React.FC<{ f: number; x: number; y: number; p: number; b: Baris }> = ({ f, x, y, p, b }) => {
  if (p <= 0.001) return null;
  const n = b.ganti.filter((t) => f >= t).length;
  const u = b.ganti.reduce((m, t) => Math.max(m, R(f, t - 10, t + 10, 0, 1, io) * (1 - R(f, t + 10, t + 11, 0, 1))), 0);
  const balik = Math.abs(Math.cos(Math.PI * u));
  return (
    <div style={{ position: 'absolute', left: x - UBIN.d / 2, top: y - UBIN.d / 2, width: UBIN.d, height: UBIN.d, borderRadius: '50%', background: b.warna, display: 'grid', placeItems: 'center', transform: `scale(${p}) scaleX(${Math.max(0.02, balik)})`, boxShadow: `0 10px 22px -10px ${b.warna}aa` }}>
      <Icon name={b.ikon[Math.min(n, b.ikon.length - 1)]} size={UBIN.d * 0.6} color={B.white} />
    </div>);
};

/** chip "Harga turun" dengan garis turun kecil (merah = arah harga). Simon 8 Okt: denyut di "harganya turun" dihapus */
const HargaTurun: React.FC<{ f: number; p: number; op: number; dy: number }> = ({ f, p, op, dy }) => {
  if (p <= 0.001 || op <= 0.001) return null;
  const g = R(f, A0('saat', saat) + 20, A0('saat', saat) + 80, 0, 1, io);
  const pts = [[0, 10], [26, 18], [44, 8], [70, 30], [92, 24], [120, 52]].map(([x, y]) => [x, y] as const);
  const n = Math.max(2, Math.round(g * (pts.length - 1)) + 1);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(CHIP.x, CHIP.y + dy)} translate(-50%, -50%) scale(${p})`, opacity: op, display: 'flex', alignItems: 'center', gap: 16, background: B.white, border: `2.5px solid ${ARAH.turun}`, borderRadius: 999, padding: '10px 30px 10px 22px', boxShadow: `0 12px 26px -12px ${ARAH.turun}aa` }}>
      <svg width={124} height={60} viewBox="-2 0 126 60"><polyline points={pts.slice(0, n).map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={ARAH.turun} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span style={{ fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night }}>Harga turun</span>
      <svg width={24} height={20} viewBox="0 0 22 18"><path d="M11 17 L21 1 L1 1 Z" fill={ARAH.turun} /></svg>
    </div>);
};

/** gelembung pikiran (kutipan naskah, SATU baris): slot putus-putus → padat; titik "sedang mengetik" sebelum kutipan; dicoret saat
 *  kesimpulannya dibantah — coretan selebar teks, bukan selebar gelembung.
 *  Simon 8 Okt: dicoret → bingkai + garis coret MERAH (CORET, seperti ChipCoret Scene 09), teks TIDAK diredupkan; bingkai padat = warna
 *  gelembungnya; kutipan 36 px; lebar tetap `w` (border-box); titik mengetik diam, hanya pop masuk/keluar (`ketik` = skala) */
const Gelembung: React.FC<{ f: number; baris: string[]; at: number; w: number; warna: string; coret: number; padat: number; ketik: number }> = ({ f, baris, at, w, warna, coret, padat, ketik }) => {
  const tepi = mixHex(warna, CORET, coret);
  return (
    <div style={{ position: 'relative', boxSizing: 'border-box', width: w, minHeight: GEL_H, borderRadius: 60, background: B.white, border: `3px dashed ${mixHex(B.grayLite, CORET, coret)}`, display: 'grid', placeItems: 'center', padding: '22px 40px', whiteSpace: 'nowrap' }}>
      {padat > 0.001 ? <div style={{ position: 'absolute', inset: -3, borderRadius: 60, border: `3px solid ${tepi}`, boxShadow: `0 18px 40px -18px ${tepi}55`, opacity: padat }} /> : null}
      {/* dua baris; tiap baris dicoret sendiri (baris 1 lalu baris 2, bertumpang) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {baris.map((t, i) => {
          const c = R(coret, 0.4 * i, 0.6 + 0.4 * i, 0, 1);
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
              <WordText halus f={f} at={at + 12 * i} style={{ fontFamily: F, fontSize: 36, fontWeight: 700, color: B.night, lineHeight: 1.25 }}>{t}</WordText>
              {c > 0.001 ? <div style={{ position: 'absolute', left: -8, top: '50%', height: 5, marginTop: -2.5, width: `calc(${c} * (100% + 16px))`, background: CORET, borderRadius: 3 }} /> : null}
            </span>);
        })}
      </div>
      {ketik > 0.001 ? (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${ketik})`, display: 'flex', gap: 14 }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: warna }} />)}
        </div>) : null}
    </div>);
};

export const S11_BEAT = { saat, turun, salah, dua, ekstrem, bukan, berarti, harganya, otomatis, berpikir, jelek, tapi, tenang, lagi, yang, kembali, mengecek, sebenarnya, apa, mana, dan, alasan, sejak, masih, berlaku };
