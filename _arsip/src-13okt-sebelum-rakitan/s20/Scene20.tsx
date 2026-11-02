import React from 'react';
import { AbsoluteFill } from 'remotion';
import { urut } from '../beats';
import { BATAS } from '../batas';
import { B, F, R, io, lerp, rgba } from '../theme';
import { cin, Icon } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Judul } from '../parts/judul';
import type { KunciIkon } from '../ikon';
import { Chip, DompetUang, Kutipan, Lencana, NAMA_UANG, WARNA_UANG, denyut, geser, panah } from '../parts/umum';

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
 */

const [ingat, hal, setiap, tempatnya, tertata, tentukan, kapan, dipakai, pisahkan, tugasnya, baru, pilih, investasinya, portofolio, tuntun, tiga, disusun,
  terpisah, supaya, aktif, stabil, dan, jangka, jelas, karena, soal, beli, tapi, saya2, mana, membelinya] = urut([
  'ingat', 'hal', 'setiap', 'tempatnya', 'tertata', 'tentukan', 'kapan', 'dipakai', 'pisahkan', 'tugasnya', 'baru', 'pilih', 'investasinya', 'portofolio',
  'tuntun', 'tiga', 'disusun', 'terpisah', 'supaya', 'aktif', 'stabil', 'dan', 'jangka', 'jelas', 'karena', 'soal', 'beli', 'tapi', 'saya', 'mana',
  'membelinya'], BATAS.s20);

const T = {
  // tempat muncul di "satu HAL" (tanpa jeda sesudah judul)
  judul: ingat, slot: [hal, hal + 16, hal + 32], masuk: [tempatnya - 10, tempatnya + 8, tempatnya + 26], tertata: tertata,
  langkah: [tentukan, pisahkan, pilih], denyutL: [kapan, tugasnya, investasinya], denyutL1b: dipakai, sub: baru - 20, subSorot: baru,
  keluarAB: portofolio - 20, hp: portofolio + 10, logo: tuntun, kantong: [tiga, tiga + 18, tiga + 36], pisah: [disusun, terpisah + 20],
  denyutKantong: supaya, produk: [aktif, stabil, dan + 10], denyutSlot: setiap, denyutK3: jangka, denyutP3: jangka + 30, centang: [jelas - 30, jelas - 12, jelas + 6],
  keluarC: karena, judul2: karena + 50, kutipan1: soal + 20, denyutK1: beli, coret: tapi + 10, kutipan2: saya2, sorot2: mana, akhir: [mana - 30, mana - 12, mana + 6], sorotAkhir: membelinya,
};

/* ── tata letak ── */
const SLOT = { y: 430, d: 150, x: [600, 960, 1320] };
const LANGKAH = { y: 760, x: [490, 960, 1430], w: 400 };
const LANGKAH_ISI: { teks: string; ikon: KunciIkon }[] = [
  { teks: 'Tentukan kapan dipakai', ikon: 'kalender' }, { teks: 'Pisahkan sesuai tugasnya', ikon: 'dompet' }, { teks: 'Pilih cara investasinya', ikon: 'investasiLain' },
];
const HP = { x: 600, y: 570, w: 380, h: 760 };
const KANTONG_Y = [380, 560, 740];
const PRODUK = ['Rekening bank · RDPU', 'Deposito · RDPT · Obligasi pemerintah', 'Reksa dana indeks · Reksa dana saham · Saham'];
const PRODUK_X = 1290;

export const Scene20: React.FC<{ f: number }> = ({ f }) => {
  if (f < BATAS.s20) return null;
  const kelAB = cin(f, T.keluarAB), kelC = cin(f, T.keluarC);
  const pisah = R(f, T.pisah[0], T.pisah[1], 0, 1, io);
  return (
    <AbsoluteFill>
      {/* ── A–B: setiap uang punya tempatnya · tiga langkah ── */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kelAB, transform: geser(0, -40 * kelAB) }}>
        {[0, 1, 2].map((k) => {
          const s = popIn(f, T.slot[k]) * (1 + denyut(f, T.denyutSlot + 10 * k, 0.06));
          const m = R(f, T.masuk[k] - 30, T.masuk[k] + 20, 0, 1, io);
          const c = popIn(f, T.tertata + 10 * k);
          const x = SLOT.x[k];
          return (
            <React.Fragment key={k}>
              {s > 0.001 ? <div style={{ position: 'absolute', left: x - SLOT.d / 2 - 22, top: SLOT.y - SLOT.d / 2 - 22, width: SLOT.d + 44, height: SLOT.d + 44, borderRadius: 34,
                border: `3px ${c > 0.5 ? 'solid' : 'dashed'} ${c > 0.5 ? WARNA_UANG[k] : B.grayLite}`, background: rgba(B.white, 0.6), transform: `scale(${s})` }} /> : null}
              {m > 0.001 ? <div style={{ position: 'absolute', inset: 0, transform: geser(0, lerp(-260, 0, m)), opacity: Math.min(1, m * 3) }}>
                <DompetUang k={k} x={x} y={SLOT.y} d={SLOT.d} p={1} f={f} labelAt={T.masuk[k] + 20} labelPx={30} />
              </div> : null}
              <Lencana x={x + 22} y={SLOT.y - 22} d={SLOT.d} p={c} warna={B.turq} ikon="tersedia" besar={56} />
            </React.Fragment>);
        })}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {[0, 1].map((i) => panah(LANGKAH.x[i] + LANGKAH.w / 2 + 6, LANGKAH.y, LANGKAH.x[i + 1] - LANGKAH.w / 2 - 6, LANGKAH.y,
            R(f, T.langkah[i + 1] - 40, T.langkah[i + 1], 0, 1, io), B.grayLite, `l${i}`, '0'))}
        </svg>
        {LANGKAH_ISI.map((l, i) => (
          <React.Fragment key={l.teks}>
            <Chip x={LANGKAH.x[i]} y={LANGKAH.y} teks={l.teks} ikon={l.ikon} warna={WARNA_UANG[i]} lebar={LANGKAH.w} size={26}
              p={popIn(f, T.langkah[i]) * (1 + denyut(f, T.denyutL[i], 0.06) + (i === 0 ? denyut(f, T.denyutL1b, 0.06) : 0))} />
            {(() => {
              const p = popIn(f, T.langkah[i] + 8);
              if (p <= 0.001) return null;
              return <div style={{ position: 'absolute', left: LANGKAH.x[i] - LANGKAH.w / 2 - 22, top: LANGKAH.y - 22 - 34, width: 44, height: 44, borderRadius: '50%',
                background: WARNA_UANG[i], color: B.white, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 24, fontWeight: 800, transform: `scale(${p})`,
                border: `3px solid ${B.white}` }}>{i + 1}</div>;
            })()}
          </React.Fragment>))}
      </div>

      {/* ── C: portofolio Tuntun — tiga kantong terpisah → pilihan produk ── */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - kelC, transform: geser(0, -40 * kelC) }}>
        {(() => {
          const p = popIn(f, T.hp);
          if (p <= 0.001) return null;
          return (
            <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `${geser(HP.x, HP.y)} scale(${p})` }}>
              <div style={{ position: 'absolute', left: -HP.w / 2, top: -HP.h / 2, width: HP.w, height: HP.h, borderRadius: 58, background: B.night, padding: 12, boxSizing: 'border-box',
                boxShadow: `0 40px 70px -30px ${rgba(B.night, 0.55)}` }}>
                <div style={{ width: '100%', height: '100%', borderRadius: 46, background: '#F4F5FB', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: '50%', top: 14, width: 110, height: 30, borderRadius: 16, background: B.night, transform: 'translateX(-50%)' }} />
                  <div style={{ position: 'absolute', left: 26, top: 70, fontFamily: F, fontSize: 30, fontWeight: 800, color: B.night,
                    transform: `scale(${1 + denyut(f, T.logo, 0.08)})`, transformOrigin: 'left center' }}>Portofolio</div>
                  <div style={{ position: 'absolute', left: 26, top: 110, fontFamily: F, fontSize: 20, fontWeight: 700, color: B.blue }}>Tuntun Sekuritas</div>
                </div>
              </div>
            </div>);
        })()}
        {/* kantong (di dalam ponsel) */}
        {[0, 1, 2].map((k) => {
          const p = popIn(f, T.kantong[k]) * (1 + denyut(f, T.produk[k] + 10, 0.05) + denyut(f, T.denyutKantong + 22 * k, 0.06) + (k === 2 ? denyut(f, T.denyutK3, 0.06) : 0));
          if (p <= 0.001) return null;
          const y = lerp(KANTONG_Y[1] + (k - 1) * 150, KANTONG_Y[k], pisah);
          const c = popIn(f, T.centang[k]);
          return (
            <div key={k} style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transform: `${geser(HP.x, y)} scale(${p})` }}>
              <div style={{ position: 'absolute', left: -160, top: -66, width: 320, height: 132, borderRadius: 22, background: B.white, boxShadow: `0 12px 26px -14px ${rgba(B.night, 0.3)}`,
                borderLeft: `8px solid ${WARNA_UANG[k]}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: WARNA_UANG[k], display: 'grid', placeItems: 'center', flex: 'none' }}>
                  <Icon name="dompet" size={36} color={B.white} />
                </div>
                <div style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night, lineHeight: 1.15 }}>{NAMA_UANG[k]}</div>
              </div>
              {c > 0.001 ? <div style={{ position: 'absolute', left: 160 - 28, top: -66 - 18, width: 48, height: 48, borderRadius: '50%', background: B.turq, border: `3px solid ${B.white}`,
                display: 'grid', placeItems: 'center', transform: `scale(${c})` }}><Icon name="tersedia" size={26} color={B.white} /></div> : null}
            </div>);
        })}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {[0, 1, 2].map((k) => panah(HP.x + 175, KANTONG_Y[k], PRODUK_X - 300, KANTONG_Y[k], R(f, T.produk[k] - 30, T.produk[k] + 10, 0, 1, io), WARNA_UANG[k], `p${k}`))}
        </svg>
        {[0, 1, 2].map((k) => <Chip key={k} x={PRODUK_X - 280} y={KANTONG_Y[k]} jangkar="kiri" teks={PRODUK[k]} warna={WARNA_UANG[k]} size={24}
          p={popIn(f, T.produk[k] + 10) * (1 + (k === 2 ? denyut(f, T.denyutP3, 0.06) : 0))} />)}
      </div>

      {/* ── D: dua kutipan · terakhir tiga jenis uang ── */}
      <Kutipan x={960} y={370} teks="Saya harus beli apa?" p={popIn(f, T.kutipan1) * (1 + denyut(f, T.denyutK1, 0.05))} warna={B.gray} coret={R(f, T.coret - 30, T.coret + 30, 0, 1, io)}
        alfa={1 - 0.4 * cin(f, T.coret)} ikon="jual" size={36} />
      <Kutipan x={960} y={560} teks="Saya harus memakai uang yang mana untuk membelinya?" p={popIn(f, T.kutipan2) * (1 + denyut(f, T.sorot2, 0.04))} warna={B.orange}
        sorot={cin(f, T.sorot2)} ikon="dompet" size={36} />
      {[0, 1, 2].map((k) => (
        <DompetUang key={k} k={k} x={SLOT.x[k]} y={790} d={110} p={popIn(f, T.akhir[k]) * (1 + denyut(f, T.sorotAkhir + 12 * k, 0.06))} f={f} labelAt={T.akhir[k] + 10} labelPx={28} />))}

      <Judul f={f} kata={['Pisahkan', 'uangnya', 'dulu']} at={T.judul} keluar={T.keluarC} />
      <Judul f={f} kata={['baru', 'pilih', 'investasinya']} sorotIdx={0} at={T.sub} sorotAt={T.subSorot} top={128} size={36} keluar={T.keluarC} />
      <Judul f={f} kata={['Setiap', 'uang', 'punya', 'tempatnya']} sorotIdx={3} at={T.judul2} sorotAt={T.sorotAkhir} />
    </AbsoluteFill>);
};

export const S20_T = T;
