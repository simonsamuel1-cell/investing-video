import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, CORET, F, R, WARNA, io, lerp } from '../theme';
import { cin } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import { PilNominal } from '../parts/nominal';
import type { KunciIkon } from '../ikon';
import { Chip, DompetUang, NAMA_UANG, WARNA_UANG, denyut } from '../parts/umum';
import { INVESTOR_NAVY, ORANG_MUDA, Kaca, KarakterLingkar, ORANG_SAKU, MaskerKeluar, durMasker, geser, type PoseKarakter } from '../parts/kaca';
import { S17_MASUK } from '../s17/Scene17';

/**
 * SCENE 16 — Bab "Tidak Ada Rasio yang Sama untuk Semua Orang". Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL  Tiga orang berbeda: A → Uang Aktif lebih besar · B → Uang Stabil lebih besar · C → Uang Jangka Panjang lebih besar · Tanpa ranking.
 *   TEXT    "Nggak ada rasio yang sama" / "yang ada adalah rasio yang [sesuai] kebutuhan"
 * Rakitan 13 Okt — acuan Simon ref-10 · ref-21: TIGA KARTU KACA sejajar, ukuran & warna SAMA (tanpa peringkat), orang di atas kartu (gambar
 * orang, brief Video 02: murid berkemeja biru · karyawan Scene 01 · investor berjas), kondisi, batang pembagian, keterangan.
 *   A  "Lalu, berapa banyak uang yang harus masuk ke masing-masing kelompok? Jawabannya: nggak ada satu persentase yang cocok untuk semua orang."
 *        MASUK = masker Scene 15 mendarat jadi dompet Uang Aktif · dua dompet lain di "uang" · pil "?%" · judul TEXT · pembagian rata 33 · 33 · 33 %
 *        → dicoret MERAH di "cocok untuk semua orang"
 *   B  "Ada yang masih perlu membangun dana darurat. Ada yang dua tahun lagi punya kebutuhan besar. Ada juga yang belum punya tujuan jangka pendek."
 *        kartu + orang di tiap "ada yang" · kondisi · batang pembagian terisi di katanya · "… lebih besar" berwarna jenis uangnya
 *   C  "Jadi pembagiannya harus mengikuti kondisi hidup dan tujuan kita masing-masing."   kartu berdenyut bergiliran · sub-judul TEXT (sorot "sesuai")
 * KELUAR = masker ke lingkaran "%" Scene 17.
 */

const [uang, kelompok, jawabannya, persentase, cocok, orang, ada1, membangun, ada2, kebutuhan, ada3, pendek, jadi, kondisi, hidup, tujuan, masing] = urut([
  'uang', 'kelompok', 'jawabannya', 'persentase', 'cocok', 'orang', 'ada', 'membangun', 'ada', 'kebutuhan', 'ada', 'pendek', 'jadi', 'kondisi', 'hidup', 'tujuan',
  'masing-masing'], BATAS.s16);

/* ── tata letak ── */
// x −37 (verifikasi pusat 14 Okt, Simon "ya perbaiki"): label "Uang Jangka Panjang" lebih panjang → deretan + label terukur +37 px ke kanan
const DOMPET = { y: 400, d: 150, x: [483, 923, 1363] };
const RATA = { x: 510, y: 720, w: 900, h: 56 };
/** audit 14 Okt (Simon "spacing, size, alignment masih bermasalah"): kartu 470 → 480 & chip 24 → 22 px (chip "Belum ada tujuan jangka pendek" dulu 7 px dari
 *  tepi kartu) · lingkaran orang turun 12 px (dulu menimpa pita atas kartu) · susunan kartu naik 30 px (pindai pusat: +30 di bawah tengah) */
const KARTU = { x: [440, 960, 1480], w: 480, y: 515, h: 450 };
const ATAS = KARTU.y - KARTU.h / 2;
const Y = { orang: ATAS + 104, kondisi: ATAS + 238, batang: ATAS + 330, ket: ATAS + 394 };
/** A (tiga dompet → pil "?%" → batang rata → chip coret) BERPUSAT di tiap tahap: susunan tumbuh ke bawah, jadi turun dulu lalu naik bertahap */
const DY_A = [112, 77, 2, -36];
const ORANG_D = 168;
/** satu warna untuk ketiga kartu (tanpa peringkat): Dark Orange terang — kemeja biru murid & karyawan menyatu di lingkaran biru/langit
 *  (pelajaran Video 02 12 Okt: murid di lingkaran oranye); lebih terang dari oranye dompet Uang Jangka Panjang */
const AKSEN = WARNA.oranyeMuda;
const ORANG: { pose: PoseKarakter; kondisi: string; ikonK: KunciIkon; bagi: number[]; besar: number }[] = [
  // Simon 14 Okt: "ganti 3 investor dengan gambar yang aku kirimkan" (kemeja biru · kemeja biru muda · jas navy)
  { pose: ORANG_SAKU, kondisi: 'Membangun dana darurat', ikonK: 'danaDarurat', bagi: [0.6, 0.25, 0.15], besar: 0 },
  { pose: ORANG_MUDA, kondisi: 'Kebutuhan besar 2 tahun lagi', ikonK: 'kalender', bagi: [0.2, 0.6, 0.2], besar: 1 },
  { pose: INVESTOR_NAVY, kondisi: 'Belum ada tujuan jangka pendek', ikonK: 'targetUtama', bagi: [0.15, 0.25, 0.6], besar: 2 },
];

/** MASUK Scene 16 = masker Scene 15 menyusut ke dompet Uang Aktif (mendarat 40f sesudah batas, sebelum "uang") */
export const S16_MASUK = { x: DOMPET.x[0], y: DOMPET.y + DY_A[0], r: DOMPET.d / 2, warna: WARNA_UANG[0], mulai: BATAS.s16 - 20 };
const DARAT = S16_MASUK.mulai + durMasker;

const T = {
  dompet: [DARAT, DARAT + 18, DARAT + 36], denyutUang: uang, tanya: kelompok, judul: jawabannya, denyutJawab: jawabannya + 30, rata: persentase - 10, coret: cocok + 20, denyutCoret: orang,
  keluarA: ada1 - 20, kartu: [ada1 + 20, ada2, ada3], orang: [ada1 + 34, ada2 + 16, ada3 + 16], kondisi: [ada1 + 54, ada2 + 40, ada3 + 40], batang: [membangun, kebutuhan, pendek],
  denyutC: [jadi + 20, kondisi, hidup + 10, tujuan], sub: kondisi, subSorot: masing,
};

/** KELUAR Scene 16 = milik Scene 17: masker lingkaran menyusut ke lingkaran "%" Scene 17 (S17_MASUK) */
export const S16_KELUAR = S17_MASUK.mulai;
export const Scene16: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s16 - 30 || f >= S16_KELUAR + durMasker) return null;
  const kelA = cin(f, T.keluarA);
  const coret = R(f, T.coret - 30, T.coret + 30, 0, 1, io);
  return (
    <MaskerKeluar f={f} mulai={S16_KELUAR} ke={S17_MASUK} warna={S17_MASUK.warna}>
      {/* A: tiga dompet "?%" + satu pembagian rata yang dicoret */}
      {kelA < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - kelA, transform: geser(0, lerp(lerp(lerp(DY_A[0], DY_A[1], cin(f, T.tanya - 24)), DY_A[2], cin(f, T.rata - 24)), DY_A[3], cin(f, T.coret - 24)) - 40 * kelA) }}>
          {[0, 1, 2].map((k) => (
            <React.Fragment key={k}>
              <DompetUang k={k} x={DOMPET.x[k]} y={DOMPET.y} d={DOMPET.d} f={f} labelAt={k === 0 ? DARAT + 30 : T.dompet[k] + 10} labelPx={30}
                p={(k === 0 ? (f >= DARAT ? 0.99996 : 0) : popIn(f, T.dompet[k])) * (1 + denyut(f, T.denyutUang + 12 * k, 0.07))} ikonAlfa={k === 0 ? R(f, DARAT, DARAT + 20, 0, 1, io) : 1} />
              <PilNominal x={DOMPET.x[k]} y={DOMPET.y + DOMPET.d / 2 + 100} teks="? %" arah={0} p={popIn(f, T.tanya + 12 * k) * (1 + denyut(f, T.denyutJawab + 10 * k, 0.1))} size={26} />
            </React.Fragment>))}
          {(() => {
            const p = popIn(f, T.rata) * (1 + denyut(f, T.denyutCoret, 0.04));
            if (p <= 0.001) return null;
            return (
              <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(RATA.x + RATA.w / 2, RATA.y)} translate(-50%, -50%) scale(${p})`, width: RATA.w, height: RATA.h,
                display: 'flex', borderRadius: RATA.h / 2, overflow: 'hidden', opacity: 1 - 0.4 * coret }}>
                {[0, 1, 2].map((k) => (
                  <div key={k} style={{ flex: 1, background: WARNA_UANG[k], display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.white }}>33%</div>))}
              </div>);
          })()}
          {coret > 0.001 ? <div style={{ position: 'absolute', left: RATA.x - 20, top: RATA.y - 3, width: (RATA.w + 40) * coret, height: 7, borderRadius: 4, background: CORET }} /> : null}
          <Chip x={RATA.x + RATA.w / 2} y={RATA.y + 80} teks="Untuk semua orang" warna={CORET} p={popIn(f, T.coret)} coret={R(f, T.coret + 10, T.coret + 50, 0, 1, io)} size={26} />
        </div>) : null}

      {/* B–C: tiga kartu kaca, satu orang per kartu — ukuran & warna sama (tanpa peringkat). Sebelum keterangan warna muncul di bawah, susunan
          (kepala orang menyembul di atas kartu) diturunkan 36 px supaya tetap berpusat (pindai 14 Okt) */}
      <div style={{ position: 'absolute', inset: 0, transform: geser(0, 36 * (1 - cin(f, T.batang[0] + 18))) }}>
      {ORANG.map((o, i) => {
        // GESER BERTAHAP (tanpa kartu "?" kosong, Simon 13 Okt): kartu pertama sendirian di tengah, baris bergeser saat kartu berikutnya muncul
        const x = KARTU.x[i] + (KARTU.x[1] - KARTU.x[0]) / 2 * ((1 - cin(f, T.kartu[1] - 24)) + (1 - cin(f, T.kartu[2] - 24)));
        const pk = popIn(f, T.kartu[i]);
        if (pk <= 0.001) return null;
        const g = R(f, T.batang[i] - 20, T.batang[i] + 40, 0, 1, io);
        const dn = 1 + T.denyutC.reduce((s, t) => s + denyut(f, t + 14 * i, 0.03), 0);
        let acc = 0;
        return (
          <React.Fragment key={i}>
            <Kaca x={x} y={KARTU.y} w={KARTU.w} h={KARTU.h} p={pk * dn} warna={AKSEN} tab="atas" tabTebal={12} rona={0.6} radius={34} />
            <KarakterLingkar pose={o.pose} x={x} y={Y.orang} D={ORANG_D} warna={AKSEN} s={popIn(f, T.orang[i]) * dn} />
            <Chip x={x} y={Y.kondisi} teks={o.kondisi} ikon={o.ikonK} warna={AKSEN} p={popIn(f, T.kondisi[i])} size={22} />
            {/* batang pembagian (tiga jenis uang) */}
            <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, Y.batang)} translate(-50%, -50%) scale(${dn})`, width: 390, height: 46,
              borderRadius: 23, overflow: 'hidden', background: 'rgba(22,24,27,0.06)', opacity: Math.min(0.9999, g * 4) }}>
              {o.bagi.map((b, k) => {
                const left = acc; acc += b;
                return <div key={k} style={{ position: 'absolute', left: `${left * 100 * g}%`, width: `${b * 100 * g}%`, top: 0, bottom: 0, background: WARNA_UANG[k] }} />;
              })}
            </div>
            {g > 0.05 ? (
              <div style={{ position: 'absolute', left: x - 230, width: 460, top: Y.ket - 17, textAlign: 'center', fontFamily: F, fontSize: 26, fontWeight: 800,
                color: WARNA_UANG[o.besar], opacity: R(g, 0.4, 1, 0, 1), whiteSpace: 'nowrap' }}>{NAMA_UANG[o.besar]} lebih besar</div>) : null}
          </React.Fragment>);
      })}
      </div>
      {/* keterangan warna (sekali, di bawah kartu) */}
      {(() => {
        const p = popIn(f, T.batang[0] + 30);
        if (p <= 0.001) return null;
        return (
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(960, 825)} translate(-50%, -50%) scale(${p})`, display: 'flex', gap: 40, fontFamily: F, fontSize: 26,
            fontWeight: 700, color: B.gray, whiteSpace: 'nowrap' }}>
            {NAMA_UANG.map((n, k) => <span key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: WARNA_UANG[k], display: 'inline-block' }} />{n}</span>)}
          </div>);
      })()}

      <AbsoluteFill>
        <Judul f={f} kata={['Nggak', 'ada', 'rasio', 'yang', 'sama']} at={T.judul} />
        <Judul f={f} kata={['yang', 'ada', 'adalah', 'rasio', 'yang', 'sesuai', 'kebutuhan']} sorotIdx={5} at={T.sub} sorotAt={T.subSorot} top={128} size={36} />
      </AbsoluteFill>
    </MaskerKeluar>);
};

export const S16_T = T;
