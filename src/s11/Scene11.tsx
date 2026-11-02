import React from 'react';
import { B, F, lerp, mixHex } from '../theme';
import { cin, popOut, WordText } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Bulat, Chip, Lencana, luarLingkaran } from '../parts/umum';
import { INVESTOR_JAS, INVESTOR_NAVY, KarakterLingkar, ORANG_MUDA, type PoseKarakter } from '../parts/kaca';
import { KAMU_S09 } from '../s09/Scene09';
import { KAMU_S10 } from '../s10/Scene10';
import { RASIO_UANG, Uang } from '../parts/nyata';
import { PenggarisTahun } from '../parts/penggaris';
import type { KunciIkon } from '../ikon';
import { urut } from '../beats';
import { BATAS } from '../batas';

/**
 * SCENE 11 — Ini Bukan Masalah Pemula (BATAS.s11 – BATAS.s12). GAYA RUMAH. Empat sosok dari ASET DASAR YANG SAMA (avatar) dibedakan properti kecil
 * (dokumen: "Cukup empat karakter sederhana yang dapat dibuat dari aset dasar yang sama"; pustaka foto hanya punya satu wajah investor & orang berjas =
 * figur guru — aturan 16/22 Okt).
 *  A f26749–27267 lingkaran kamu + "?" dari Scene 10 BER-MORF jadi ikon OTAK "?" (28 Okt; dulu kamu pop keluar lalu otak pop masuk) ("Kenapa semua ini
 *    begitu sulit?") → chip "Kurang pintar" DICORET → otak naik, PENGGARIS TAHUN 2026 → 300.000 SM bergulir di "ratusan ribu tahun" (29 Okt).
 *  29 Okt (Simon): teks peran di bawah ikon sosok DIHAPUS; dana = uang asli + nominal; ikon orang → FOTO ORANG ASLI video sebelumnya ("misalnya mengganti
 *    icon orang, dengan orang asli yang digunakan divideo sebelumnya"): ritel = kemeja biru muda · profesional = jas navy · orang biasa = kemeja biru tua ·
 *    fund manager = jas abu; orang biasa = pria kemeja biru TUA (aset Video 02) — empat orang berbeda.
 *  B f27289–27734 empat sosok muncul di katanya (tengah dulu, lalu memberi ruang): investor ritel & profesional → "Ikut kelompok"; orang biasa & fund
 *    manager → "Terlalu yakin" (langkah 1–2).
 *  C f27767–28135 dana sedikit (koin kecil) vs sangat besar (tumpukan besar); lalu reaksi & properti hilang, ikon OTAK YANG SAMA di atas semuanya;
 *    TEKS LAYAR "Ini masalah manusia." (langkah 3–4). Data 1998 (dokumen langkah 5) tidak dipakai — tidak ada di VO. Empat avatar diambil alih Scene 12
 *    di tempatnya (MENYATU jadi foto kamu).
 */
const W = urut(['kenapa', 'sulit', 'bukan', 'kurang', 'pintar', 'melawan', 'otak', 'terbentuk', 'ratusan', 'tahun', 'investor', 'ritel', 'kelompok', 'profesional',
  'bisa', 'orang', 'biasa', 'percaya', 'diri', 'fund', 'manager', 'bisa', 'mau', 'dana', 'sedikit', 'sangat', 'besar', 'menekan', 'tombol', 'keputusan', 'otak',
  'manusia', 'sama'], BATAS.s11 - 10);
let i = 0;
const n = () => W[i++];
const T = {
  kenapa: n(), sulit: n(), bukan: n(), kurang: n(), pintar: n(), melawan: n(), otak: n(), terbentuk: n(), ratusan: n(), tahun: n(), investor: n(), ritel: n(),
  kelompok: n(), profesional: n(), bisa: n(), orang: n(), biasa: n(), percaya: n(), diri: n(), fund: n(), manager: n(), bisa2: n(), mau: n(), dana: n(),
  sedikit: n(), sangat: n(), besar: n(), menekan: n(), tombol: n(), keputusan: n(), otak2: n(), manusia: n(), sama: n(),
};
export const S11_T = T;
const AWAL = BATAS.s11, AKHIR = BATAS.s12;
const EKOR = AKHIR + 30;

/** A: otak NAIK memberi ruang, lalu PENGGARIS TAHUN (= Scene 01) masuk & bergulir 2026 → 300.000 SM di "ratusan ribu tahun" (Simon 29 Okt: "untuk visualisasi
 *  ratusan ribu tahun, gunakan seperti yang kamu gunakan discene sebelumnya" — dulu gua ⇢ otak + chip "± ratusan ribu tahun") */
const tA = { otak: T.kenapa + 80, chip: T.bukan + 10, coret: T.pintar + 14, chipKeluar: T.melawan, naik: T.melawan + 20, masuk: T.otak + 20,
  gulir: [T.ratusan - 30, T.ratusan + 30] as [number, number], keluar: T.investor - 16 };
const TAHUN = ['2026', '2000', '1 M', '10.000 SM', '50.000 SM', '100.000 SM', '200.000 SM', '300.000 SM'];
// Simon 30 Okt (audit pusat): otak + penggaris dulu y 214–722 (pusat 468) → keduanya turun 29
const OTAK_Y = { awal: 440, atas: 339 }, PENGGARIS_Y = 629;
/** orang ke-4 (Simon 29 Okt: "ini double orangnya, sepertinya dulu ada 4 orang asli yang pernah aku buat") = pria kemeja biru tua dari aset Video 02
 *  ("Front-facing man in blue shirt.png" → public/karakter/orang_biru_tua.webp); pusat lingkaran diukur dari alfa foto (bahu x 264–756, kepala y 25) */
const ORANG_BIRU_TUA: PoseKarakter = { src: 'karakter/orang_biru_tua.webp', w: 1024, h: 1536, cx: 510, cy: 490, r: 262, pita: true };
const SOSOK: { label: string; foto: PoseKarakter; ikon: KunciIkon; warna: string; muncul: number; reaksi: string; ikonR: KunciIkon; tReaksi: number; besar: boolean }[] = [
  { label: 'Investor ritel', foto: { ...ORANG_MUDA, pita: true }, ikon: 'dompet', warna: B.turq, muncul: T.ritel, reaksi: 'Ikut kelompok', ikonR: 'ramai', tReaksi: T.kelompok, besar: false },
  { label: 'Profesional', foto: { ...INVESTOR_NAVY, pita: true }, ikon: 'grafikHarga', warna: B.blue, muncul: T.profesional, reaksi: 'Ikut kelompok', ikonR: 'ramai', tReaksi: T.bisa + 10, besar: true },
  { label: 'Orang biasa', foto: ORANG_BIRU_TUA, ikon: 'sofa', warna: B.turq, muncul: T.biasa, reaksi: 'Terlalu yakin', ikonR: 'trofi', tReaksi: T.diri, besar: false },
  { label: 'Fund manager', foto: { ...INVESTOR_JAS, pita: true }, ikon: 'portofolio', warna: B.blue, muncul: T.manager, reaksi: 'Terlalu yakin', ikonR: 'trofi', tReaksi: T.bisa2 + 10, besar: true },
];
// properti (uang + lencana peran) keluar di "tombol keputusan" (dulu "manusia") supaya selesai keluar sebelum teks layar masuk di tempatnya (aturan 17)
// chip reaksi (kini di BAWAH lingkaran) keluar di "mau" — selesai sebelum uang muncul di tempat yang sama (aturan 17)
const tC = { dana: [T.sedikit, T.besar], reaksiKeluar: T.mau - 20, otak: T.otak2 - 10, properti: T.keputusan, teks: T.manusia + 10 };
/** TATA LETAK DIAM (Simon 30 Okt, screenshot: chip "Ikut kelompok/Terlalu yakin" menimpa rambut, lencana peran menimpa bahu; tanpa geser kelompok):
 *  baris sosok y 485 · kepala menyembul 146–161 px di atas pusat lingkaran Ø170 (diukur dari alfa foto) · chip reaksi DI BAWAH lingkaran (label di bawah
 *  ikon), jarak 16 · lencana peran di LUAR lingkaran sebelah kanan · otak di atas kepala masing-masing, jarak 12 · uang di bawah lingkaran (jarak 16),
 *  nominal menempel di dasar uang · teks layar di bawah lingkaran. Pusat isi tiap keadaan ±24 px dari 497. */
const Y_SOSOK = 485, LANGKAH = 340;
const PUNCAK_KEPALA = [146, 146, 151, 161];
const UANG = { kecil: 80, besar: 130, alas: Y_SOSOK + 85 + 16 + 130 / RASIO_UANG };
/** posisi akhir empat avatar (diambil alih Scene 12) */
export const SOSOK_S11 = { y: Y_SOSOK, d: 170, x: [0, 1, 2, 3].map((k) => 960 + (k - 1.5) * LANGKAH), foto: SOSOK.map((o) => o.foto), warna: SOSOK.map((o) => o.warna) };

export const Scene11: React.FC<{ f: number }> = ({ f }) => {
  if (f < AWAL || f >= AKHIR + 70) return null;
  const keluar = popOut(f, EKOR);
  /* A */
  const aP = popOut(f, tA.keluar);
  /* morf kamu (S10) → otak: lingkaran berpindah & mengecil, foto memudar, ikon otak menebal (60 f berpusat di tA.otak) */
  const morf = cin(f, tA.otak);
  const yOtak = lerp(OTAK_Y.awal, OTAK_Y.atas, cin(f, tA.naik));
  const xM = lerp(KAMU_S10.x, 960, morf), yM = lerp(KAMU_S10.y, yOtak, morf), dM = lerp(KAMU_S10.d, 190, morf);
  /* B: n sosok terlihat (pecahan) → baris berpusat */
  const nTampil = SOSOK.reduce((s, o) => s + cin(f, o.muncul - 10), 0);
  const xSosok = (k: number) => 960 + (k - (Math.max(1, nTampil) - 1) / 2) * LANGKAH;
  const yS = Y_SOSOK;
  return (
    <>
      {/* ═════ A ═════ */}
      {morf < 1 ? (
        <>
          <div style={{ position: 'absolute', left: 0, top: 0, width: dM, height: dM, borderRadius: '50%', transform: `translate3d(${xM - dM / 2}px, ${yM - dM / 2}px, 0)`,
            background: mixHex(B.turq, B.white, morf) }} />
          {/* foto habis memudar di 60 % morf (kepala yang menyembul di atas lingkaran tidak tertinggal samar di atas ikon otak) */}
          <KarakterLingkar pose={KAMU_S09} x={xM} y={yM} D={dM} s={1} warna="transparent" alfa={Math.max(0, 1 - morf / 0.6)} cermin />
        </>) : null}
      {/* ikon otak (lingkaran putih bertepi biru) menebal di atas lingkaran kamu selama morf; keluar = pop di tA.keluar */}
      <Bulat x={xM} y={yM} d={dM} warna={B.blue} ikon="otak" p={morf < 1 ? (morf > 0.001 ? 1 : 0) : aP} alfa={morf < 1 ? morf : 1} />
      {/* "?" dari Scene 10 terbawa (dulu pop baru di "sulit") */}
      <Lencana x={luarLingkaran(xM, yM, dM, lerp(74, 70, morf))[0]} y={luarLingkaran(xM, yM, dM, lerp(74, 70, morf))[1]} d={0} p={popOut(f, tA.chipKeluar)} warna={B.orange} teks="?" besar={lerp(74, 70, morf)} />
      <Chip x={960} y={620} teks="Kurang pintar" warna={B.gray} p={popIn(f, tA.chip) * popOut(f, tA.chipKeluar)} size={30} coret={cin(f, tA.coret)} />
      <PenggarisTahun f={f} tahun={TAHUN} y={PENGGARIS_Y} masuk={tA.masuk} gulir={tA.gulir} keluar={tA.keluar} id="s11pg" jarak={760} />

      {/* ═════ B/C: empat sosok dari aset dasar yang sama ═════ */}
      {SOSOK.map((o, k) => {
        const p = popIn(f, o.muncul);
        if (p <= 0) return null;
        const avatarAda = f < AKHIR; // sejak AKHIR avatar digambar Scene 12 (menyatu jadi kamu); otak & teks tetap pop keluar di EKOR
        const x = xSosok(k);
        const prop = popOut(f, tC.properti + 6 * k); // properti pembeda hilang
        const reaksi = popIn(f, o.tReaksi) * popOut(f, tC.reaksiKeluar + 6 * k);
        const otak = popIn(f, tC.otak + 8 * k) * keluar;
        const dana = popIn(f, o.besar ? tC.dana[1] : tC.dana[0]) * prop;
        return (
          <React.Fragment key={k}>
            {/* FOTO ORANG ASLI dari video sebelumnya (Simon 29 Okt) — lingkaran pop, foto NAIK di dalam masker lingkaran yang sama (bukan pop) */}
            {avatarAda ? <KarakterLingkar pose={o.foto} x={x} y={yS} D={170} s={p} warna={o.warna} naik={cin(f, o.muncul + 25)} cermin={k % 2 === 0} /> : null}
            <Lencana x={x + 85 + 8 + 33} y={yS - 40} d={0} p={p * prop} warna={o.warna} ikon={o.ikon} besar={66} />
            <Chip x={x} y={yS + 85 + 16 + 25} teks={o.reaksi} ikon={o.ikonR} warna={o.ikonR === 'trofi' ? B.orange : B.blue} p={reaksi} size={24} />
            <Bulat x={x} y={yS - PUNCAK_KEPALA[k] - 12 - 36} d={72} warna={B.blue} ikon="otak" p={otak} />
            {/* dana: UANG ASLI (foto Simon, Video 03) + nominal (Simon 29 Okt: "icon uangnya tambahkan nominal, dan gunakan uang asli") — sedikit = tumpukan
                kecil "Rp1 juta", sangat besar = tumpukan besar "Rp1 triliun"; alas uang sebaris, nominal pop 20 f sesudah uangnya */}
            {(() => { const w = o.besar ? UANG.besar : UANG.kecil, h = w / RASIO_UANG;
              return <Uang x={x} y={UANG.alas - h / 2} w={w} p={dana} />; })()}
            <Chip x={x} y={UANG.alas - 4} teks={o.besar ? 'Rp1 triliun' : 'Rp1 juta'} warna={B.turq} p={popIn(f, (o.besar ? tC.dana[1] : tC.dana[0]) + 20) * prop} size={22} />
          </React.Fragment>);
      })}
      {/* TEKS LAYAR — di BAWAH lingkaran sosok (dulu y 120 di atas otak; audit pusat 30 Okt) */}
      {f >= tC.teks - 40 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: yS + 85 + 60, textAlign: 'center' }}>
          <WordText f={f} at={tC.teks} until={EKOR} style={{ fontFamily: F, fontSize: 64, fontWeight: 800, color: B.night }}>Ini masalah manusia.</WordText>
        </div>) : null}
    </>);
};
