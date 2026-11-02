import React from 'react';
import { B, F, R, io } from '../theme';
import { BAB } from '../s01/data';
import { MODE_UKUR, WordText, lerp } from './kit';
import { popIn } from './pop';
import { SimpulBab } from './rantai';

/**
 * PEMBUKA BAB lewat PETA BAB — Simon 8 Okt: "pertahankan ini [peta Scene 01] di setiap instrumen yang disebut di script, hanya saja
 * gunakan highlight seperti saat tabungan dan deposito" + "di scene emas hanya 1 icon … 5 icon sisanya tidak ada → blank frame".
 * Jadi peta = PERSIS peta akhir Scene 01: enam simpul terisi warna bab, nama di bawah (nomor dihapus 8 Okt), garis putus penghubung.
 * Isi scene sebelumnya MENYUSUT ke simpul bab-nya sendiri lewat masker lingkaran (lihat `SIMPUL_PETA`); bab lain muncul di sekitarnya.
 * Lalu SOROT bab baru = pola Tabungan & Deposito (Scene 02): cincin warna bab + membesar 1→1,16, bab lain meredup 0,6 —
 * dipusatkan di nama bab; sesudahnya bab lain turun + pudar dan simpul bab baru meluncur ke tengah jadi simpul utama scene.
 */
// geometri = peta Scene 01 (Ø170, jarak 290, nama 32 px di bawah). Simon 8 Okt: nomor bab DIHAPUS → y 489 (dulu 518): tinta grup
// lingkaran (y−85) … nama 2 baris naik 29 px supaya pusatnya sama dengan dulu → kamera S03/S05–S08 tidak perlu diukur ulang
export const PETA = { y: 489, d: 170, x: (k: number) => 960 + (k - 2.5) * 290 };

/** target masker lingkaran: isi scene bab `k` menyusut ke simpul bab `k` di peta */
export const SIMPUL_PETA = (k: number) => ({ x: PETA.x(k), y: PETA.y, r: PETA.d / 2 });

export const PembukaBab: React.FC<{
  f: number; s0: number; k: number; isiAt: number; tengah: { x: number; y: number; d: number }; selesai: number;
  /** isi simpul bab baru dari luar (mis. Scene 08: ikon Saham terbang dari keranjang lalu MENJADI simpul ini; tanpa pop) */
  isiLuar?: number;
  /** bab lain mulai turun (default = bersamaan simpul bab baru meluncur, selesai−60). Scene 03: lebih awal — baris peta = baris garis waktu */
  pergi?: number;
}> = ({ f, s0, k, isiAt, tengah, selesai, isiLuar, pergi }) => {
  if (f >= selesai) return null;
  // simpul bab baru TIBA di tengah tepat di `selesai` (serah-terima ke simpul utama scene tanpa loncatan)
  const keTengah = R(f, selesai - 60, selesai, 0, 1, io);
  const garis = R(f, s0 + 20, s0 + 70, 0, 1, io) * (1 - keTengah);
  // MODE UKUR (kamera): peta UTUH sejak awal, tanpa sorot/redup — pembuka bab singkat (S05: peta tak pernah diam ≥ 30f karena simpul
  // baru sudah meluncur sebelum nama terakhir selesai) → tanpa ini kamera memakai posisi adegan berikutnya (terukur: meleset 224 px)
  const sorot = MODE_UKUR ? 0 : isiLuar === undefined ? R(f, isiAt - 30, isiAt + 30, 0, 1, io) : R(f, isiAt - 10, isiAt + 30, 0, 1, io);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <line x1={PETA.x(0)} x2={PETA.x(5)} y1={PETA.y} y2={PETA.y} stroke={B.grayLite} strokeWidth={2.5} strokeDasharray="7 11" strokeLinecap="round" opacity={garis} />
      </svg>
      {BAB.map((b, j) => {
        // bab sebelumnya = tempat isi scene lama menyusut (masker mendarat s0+50): muncul DI TEMPAT tanpa pop — benda yang sama
        const lama = j === k - 1;
        const pop = MODE_UKUR ? 1 : lama ? R(f, s0 + 40, s0 + 52, 0, 1, io) : popIn(f, s0 + 30 + 8 * j);
        const isi = j === k && isiLuar !== undefined ? isiLuar : pop;
        const turun = j === k ? 0 : pergi === undefined ? keTengah : R(f, pergi, pergi + 60, 0, 1, io); // bab lain: turun + pudar
        const redup = j === k ? 1 : 1 - 0.4 * sorot;
        const op = (1 - turun) * redup;
        if (op <= 0.001 || (pop <= 0.001 && isi <= 0.001)) return null;
        const x = j === k ? lerp(PETA.x(j), tengah.x, keTengah) : PETA.x(j);
        const y = j === k ? lerp(PETA.y, tengah.y, keTengah) : PETA.y + 160 * turun;
        const d = j === k ? lerp(PETA.d * (1 + 0.16 * sorot), tengah.d, keTengah) : PETA.d;
        const label = op * (j === k ? 1 - keTengah : 1); // nama bab baru pudar saat meluncur ke tengah
        const cincin = j === k ? sorot * (1 - keTengah) : 0;
        const r = d / 2, sk = d / PETA.d;
        return (
          <React.Fragment key={b.no}>
            {/* slot dasar putus-putus DIHAPUS (Simon 16 Okt: "hapus juga placeholder" — aturan V03 13 Okt); simpul muncul langsung berisi */}
            {cincin > 0.001 ? <div style={{ position: 'absolute', left: x - r - 14 * sk, top: y - r - 14 * sk, width: d + 28 * sk, height: d + 28 * sk, borderRadius: '50%', border: `3px solid ${b.warna}`, opacity: cincin, boxShadow: `0 0 36px 4px ${b.warna}55` }} /> : null}
            <SimpulBab x={x} y={y} d={d} col={b.warna} ikon={b.ikon} isi={isi} op={op} />
            {label > 0.001 ? (
              <div style={{ position: 'absolute', left: x - 135, width: 270, top: y + r + 34 * sk, textAlign: 'center', lineHeight: 1.18, opacity: label }}>
                <WordText halus f={f} at={MODE_UKUR ? s0 - 100 : lama ? s0 + 50 : s0 + 35 + 8 * j} rataBaris style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{b.nama}</WordText>
              </div>) : null}
          </React.Fragment>);
      })}
    </>);
};
