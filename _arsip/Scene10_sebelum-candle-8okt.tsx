import React from 'react';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { gayaKamera, kamera } from '../kamera';
import { INVESTOR11 } from '../s11/Scene11';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { ARAH, B, F, GAP, io, LINE, R } from '../theme';
import { Icon, LW, WordText, cin, glass, grow, lerp, popIn, KacaPembesar } from '../parts/kit';
import { PanahBadge, denyut } from '../parts/rantai';
import { Judul } from '../s03/Scene03';

/**
 * SCENE 10 — VOLATILITAS ≠ RISIKO · IDE VISUAL (7 Okt, VO v4). Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "LEFT: PRICE ↑↓↑↓ → VOLATILITY · RIGHT: Business Deterioration · Permanent Loss · Forced Selling → RISK"
 *   TEXT   "Volatilitas = perubahan harga / Risiko = potensi kehilangan nilai secara permanen" (bergantian)
 * Satu panel "perjalanan harga" (naik-turun, ilustratif) menyempit jadi panel KIRI "Volatilitas"; panel KANAN "Risiko" berisi
 * tiga risiko sebenarnya. Naik = hijau, turun = merah.
 * Revisi 7–8 Okt (Simon): MASUK = isi Scene 09 menyusut (masker) ke TITIK AWAL garis harga; ADEGAN TANPA TEKS BARU — investor
 * menaiki garis harga seperti roller coaster ("perjalanannya nggak selalu nyaman", naik hari ini → turun besok); slot tiga risiko
 * disapu kaca pembesar ("risiko yang lebih penting untuk diperhatikan"); grafik mini tiap risiko (jatuh & tak kembali · turun pelan
 * jangka panjang · jual di titik terendah lalu harga pulih tanpa kita). Kamera pusat, jarak 16 px, pop berporos di tengah.
 */
export const S10 = BATAS.s10;
export const IDE_S10_AWAL = S10;

/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
const A0 = (w: string, at: number) => frasa(w, at) - 18;
const [pertumbuhan, nyaman, naik, ini, turun, besok, volatilitas, tapi, sama, risiko, menggambarkan, seberapa, naik2, turun2, risiko2,
  kehilangan, permanen, memburuk, terpaksa, tepat] = urut(['pertumbuhan', 'nyaman', 'naik', 'ini', 'turun', 'besok', 'volatilitas', 'tapi',
  'sama', 'risiko', 'menggambarkan', 'seberapa', 'naik', 'turun', 'risiko', 'kehilangan', 'permanen', 'memburuk', 'terpaksa', 'tepat'], S10);

/* ── panel ── */
type Kotak = { x: number; y: number; w: number; h: number };
const PENUH: Kotak = { x: 300, y: 220, w: 1320, h: 620 };
/* celah 120 px: lencana ≠ (Ø80) tidak menyentuh tepi kedua panel */
const KIRI: Kotak = { x: 130, y: 220, w: 770, h: 620 };
const KANAN: Kotak = { x: 1020, y: 220, w: 770, h: 620 };
const lerpK = (a: Kotak, b: Kotak, t: number): Kotak => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });
/* harga ilustratif: naik dalam jangka panjang tapi bergelombang (tanpa angka, tanpa tanggal) */
const N = 72;
const HARGA = Array.from({ length: N }, (_, i) => 100 + 0.42 * i + 7 * Math.sin(i * 0.42) + 3.2 * Math.sin(i * 1.27 + 0.6));
const VMIN = Math.min(...HARGA) - 4, VMAX = Math.max(...HARGA) + 4;
/* SUMBU (aturan chart Scene 03 — Simon 7 Okt: "tambahkan label harga agar jelas maksud x axis dan y axisnya", angka harga TIDAK
 * ditampilkan karena ilustratif, isi SIMETRIS di panel): panel→sumbu-y = ujung sumbu-x→panel = 80 px; garis 45 px dari keduanya */
const sumbu = (k: Kotak) => ({ x: k.x + 80, right: k.x + k.w - 80, y: k.y + k.h - 100, top: k.y + 130 });
const titik = (k: Kotak, i: number) => {
  const a = sumbu(k);
  return { x: a.x + 45 + (i * (a.right - a.x - 90)) / (N - 1), y: a.y - 20 - ((HARGA[i] - VMIN) * (a.y - 20 - (a.top + 40))) / (VMAX - VMIN) };
};
/** titik awal garis harga: isi Scene 09 menyusut ke sini (masker) */
export const AWAL_GARIS10 = { ...titik(PENUH, 0), r: 10 };
/* ayunan "naik hari ini, turun besok": PUNCAK tertinggi di sepertiga akhir, lalu LEMBAH lokal pertama sesudahnya
 * (ruas merah harus turun terus — dulu puncak dicari di [44,62) sehingga ruas merah sempat naik dulu ke puncak sebenarnya) */
const iP = (() => { let m = 44; for (let i = 44; i < N - 3; i++) if (HARGA[i] > HARGA[m]) m = i; return m; })();
const iL = (() => { let m = iP + 1; while (m < N - 1 && HARGA[m + 1] < HARGA[m]) m++; return m; })();
const iA = (() => { let m = iP - 14; for (let i = iP - 14; i < iP; i++) if (HARGA[i] < HARGA[m]) m = i; return m; })();

const RISIKO: { teks: string; ikon: KunciIkon; at: number; jenis: 'permanen' | 'memburuk' | 'terpaksa' }[] = [
  { teks: 'Kehilangan nilai permanen', ikon: 'rugiPermanen', at: M('kehilangan', kehilangan), jenis: 'permanen' },
  { teks: 'Bisnis memburuk', ikon: 'bisnisMemburuk', at: M('memburuk', memburuk), jenis: 'memburuk' },
  { teks: 'Terpaksa menjual', ikon: 'terpaksaJual', at: M('terpaksa', terpaksa), jenis: 'terpaksa' },
];
const JARAK = 16;
/* "Risiko yang lebih penting untuk diperhatikan justru:" → panel Volatilitas mundur, panel Risiko MELUAS ke tengah (fokus pindah ke risiko);
   tiap baris risiko: ikon · label · grafik besar di kolom kanan (rata) */
const FOKUS: Kotak = PENUH;
const BARIS_RISIKO = (k: number, b: Kotak = FOKUS) => ({ x: b.x + 110, y: b.y + 200 + k * 140 });
const GRAFIK = { w: 380, h: 110, x: FOKUS.x + FOKUS.w - 50 - 380 };
/** penunggang baris "terpaksa menjual" di lembah pada akhir scene = pusat cakramnya (Ø40 border-box: left x−20, top y−44 → pusat y−24;
 *  terukur di render: (1380, 711,9) termasuk kamera dy 10). Scene 11 mendorong kamera ke sini — investor ini tokoh Scene 11. */
const PENUNGGANG_AKHIR = { x: GRAFIK.x + GRAFIK.w / 2, y: BARIS_RISIKO(2).y - GRAFIK.h / 2 + 18 + 0.85 * (GRAFIK.h - 36) - 24 };
/* roller coaster: investor menaiki garis harga — awal → puncak (perjalanan bergelombang, "naik hari ini"), puncak → lembah ("turun besok") */
const NAIK_AT = { mulai: pertumbuhan + 62, puncak: ini, lembah0: A0('lalu', ini), lembah1: besok + 14, ayun0: A0('tapi', tapi), ayun1: turun2 + 40 };
const FOKUS_AT = A0('risiko', risiko2);
const LENSA = { mulai: FOKUS_AT + 50, selesai: A0('kehilangan', kehilangan) }; // sesudah panel meluas; selesai sebelum klausa risiko pertama

export const Scene10: React.FC<{ f: number }> = ({ f }) => {
  if (f < S10) return null;
  // KELUAR = milik Scene 11: DORONGAN KAMERA ke investor di lembah "terpaksa menjual" — masker lingkaran menyusut mengikuti investor
  // yang membesar ×3 dan bergeser ke posisinya di Scene 11 ("Makanya, saat harga turun…": dia tokoh scene itu). 50f.
  if (f >= BATAS.s11 + 52) return null;
  const ex = R(f, BATAS.s11, BATAS.s11 + 50, 0, 1, io);
  const kam = kamera('S10', f), kam11 = kamera('S11', BATAS.s11 + 50);
  const P = { x: PENUNGGANG_AKHIR.x + kam.x, y: PENUNGGANG_AKHIR.y + kam.y };
  const T = { x: INVESTOR11.x + kam11.x, y: INVESTOR11.y + kam11.y };
  const zm = Math.pow(INVESTOR11.d / 40, ex);
  const mk = { x: lerp(P.x, T.x, ex), y: lerp(P.y, T.y, ex) };
  const R0 = Math.max(...[[0, 0], [1920, 0], [0, 1080], [1920, 1080]].map(([x, y]) => Math.hypot(x - P.x, y - P.y))) + 12;
  const rM = lerp(R0, INVESTOR11.d / 2, ex);
  const masuk = cin(f, S10 + 40);
  const belah = cin(f, tapi + 20); // panel penuh → kiri; panel kanan masuk
  const pk = lerpK(PENUH, KIRI, belah);
  const garis = cin(f, pertumbuhan + 20);
  const ax = cin(f, S10 + 80); // sumbu tumbuh sebelum garis harga
  const a = sumbu(pk);
  const pts = HARGA.map((_, i) => titik(pk, i));
  const nGaris = Math.max(2, Math.round(garis * (N - 1)) + 1);
  const amp = grow(f, seberapa + 10); // braket besar ayunan
  const kanan = cin(f, tapi + 40);
  const fokus = R(f, FOKUS_AT, FOKUS_AT + 60, 0, 1, io); // panel Risiko meluas, Volatilitas mundur
  const kR = lerpK(KANAN, FOKUS, fokus);

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${rM}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama di atas Scene 11 */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s11, BATAS.s11 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${P.x}px ${P.y}px`, transform: `translate(${mk.x - P.x}px, ${mk.y - P.y}px) scale(${zm})` } : undefined}>
      <Judul f={f} kata={['Volatilitas', '=', 'perubahan harga']} at={M('menggambarkan', menggambarkan)} sorotAt={seberapa + 20} keluar={risiko2 + 20} />
      <Judul f={f} kata={['Risiko', '=', 'potensi', 'kehilangan', 'nilai', 'secara permanen']} at={M('kehilangan', kehilangan) + 20} sorotAt={permanen + 15} size={40} />
      {/* ISI — kamera pusat (Simon 7 Okt); judul tidak ikut */}
      <AbsoluteFill style={gayaKamera('S10', f)}>

      {/* panel KIRI: perjalanan harga → volatilitas */}
      <AbsoluteFill style={{ opacity: 1 - fokus, transform: `translateX(${-140 * fokus}px)` }}>
      <div style={{ position: 'absolute', left: pk.x, top: pk.y, width: pk.w, height: pk.h, opacity: masuk, transform: `translateY(${(1 - masuk) * 40}px)`, ...glass(B.blue) }} />
      <AbsoluteFill style={{ opacity: masuk }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {ax > 0.001 ? (
            <g stroke={B.grayLite} strokeWidth={LW.main} strokeLinecap="round" fill="none">
              <line x1={a.x} x2={a.x} y1={a.y} y2={lerp(a.y, a.top, ax)} />
              <line x1={a.x} x2={lerp(a.x, a.right, ax)} y1={a.y} y2={a.y} />
              <path d={`M${a.x - 9} ${lerp(a.y, a.top, ax) + 12} L${a.x} ${lerp(a.y, a.top, ax)} L${a.x + 9} ${lerp(a.y, a.top, ax) + 12}`} />
              <path d={`M${lerp(a.x, a.right, ax) - 12} ${a.y - 9} L${lerp(a.x, a.right, ax)} ${a.y} L${lerp(a.x, a.right, ax) - 12} ${a.y + 9}`} />
            </g>) : null}
          {garis > 0.001 ? <polyline points={pts.slice(0, nGaris).map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={B.blue} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" /> : null}
          {/* naik hari ini (hijau) → turun besok (merah) */}
          {grow(f, naik) > 0.001 ? <polyline points={pts.slice(iA, iP + 1).map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={ARAH.naik} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={grow(f, naik)} /> : null}
          {grow(f, turun) > 0.001 ? <polyline points={pts.slice(iP, iL + 1).map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={ARAH.turun} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={grow(f, turun)} /> : null}
          {/* volatilitas = seberapa besar harga bergerak naik & turun: braket di kanan ayunan */}
          {amp > 0.001 ? (() => {
            // di kanan ujung garis, bukan menempel lembah
            const x = pts[N - 1].x + 28, y1 = pts[iP].y, y2 = pts[iL].y, m = (y1 + y2) / 2, h = (y2 - y1) / 2 * amp;
            return (
              <g stroke={B.night} strokeWidth={LINE.w} strokeLinecap="round" fill="none">
                <line x1={x} x2={x} y1={m - h} y2={m + h} />
                <line x1={x - 10} x2={x + 10} y1={m - h} y2={m - h} />
                <line x1={x - 10} x2={x + 10} y1={m + h} y2={m + h} />
              </g>);
          })() : null}
        </svg>
        {/* judul sumbu: "Harga saham" di ujung panah sumbu-y, "Waktu" di bawah ujung sumbu-x (tanpa angka — ilustratif) */}
        <div style={{ position: 'absolute', left: a.x + GAP, top: a.top, transform: 'translateY(-50%)', opacity: R(ax, 0.8, 1, 0, 1), fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night, whiteSpace: 'nowrap' }}>Harga saham</div>
        <div style={{ position: 'absolute', left: a.right - 300, width: 300, top: a.y + GAP, textAlign: 'right', opacity: R(ax, 0.8, 1, 0, 1), fontFamily: F, fontSize: 24, fontWeight: 800, color: B.night }}>Waktu</div>
        <PanahBadge x={pts[iP].x - 44} y={pts[iP].y - 34} d={42} naik p={popIn(f, ini)} flip={0} />
        <Penunggang f={f} pts={pts} />
        <PanahBadge x={pts[iL].x + 4} y={pts[iL].y + 44} d={42} p={popIn(f, besok)} flip={0} />
        <JudulPanel x={pk.x + 34} y={pk.y + 44} teks="Volatilitas" ikon="naikTurunHarga" col={B.blue} p={popIn(f, M('volatilitas', volatilitas))} pulse={denyut(f, naik2) + denyut(f, turun2)} />
      </AbsoluteFill>
      </AbsoluteFill>
      {/* titik awal garis harga — isi Scene 09 menyusut ke sini (di luar pudar panel: tanpa loncatan saat serah-terima) */}
      {/* … lalu memudar saat garis sudah tergambar dari situ & penunggang naik (dulu tertinggal di kiri sampai akhir → kamera meleset 28 px) */}
      {f >= S10 + 52 && f < NAIK_AT.mulai + 10 ? <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}><circle cx={pts[0].x} cy={pts[0].y} r={AWAL_GARIS10.r} fill={B.blue} opacity={1 - R(f, NAIK_AT.mulai - 40, NAIK_AT.mulai + 10, 0, 1, io)} /></svg> : null}

      {/* panel KANAN: risiko sebenarnya */}
      {kanan > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: kR.x, top: kR.y, width: kR.w, height: kR.h, opacity: kanan, transform: `translateX(${(1 - kanan) * 60}px)`, ...glass(B.orange) }} />
          <AbsoluteFill style={{ opacity: kanan }}>
            <JudulPanel x={kR.x + 34} y={kR.y + 44} teks="Risiko" ikon="risiko" col={B.orange} p={popIn(f, tapi + 70)} pulse={denyut(f, risiko2)} />
            {/* "risiko yang lebih penting untuk diperhatikan justru:" — tiga slot putus-putus, disapu kaca pembesar, lalu terisi */}
            {RISIKO.map((r, k) => {
              // slot "?" = risiko yang belum diketahui: muncul bersama panel Risiko, ikut bergeser saat panel meluas (dulu panel kosong ±6 dtk)
              const slot = cin(f, tapi + 100 + 10 * k) * (1 - R(f, r.at - 20, r.at + 10, 0, 1, io));
              const { x, y } = BARIS_RISIKO(k, kR);
              return slot > 0.001 ? <div key={`s${k}`} style={{ position: 'absolute', left: x - 42, top: y - 42, width: 84, height: 84, borderRadius: 99, border: `3px dashed ${B.grayLite}`, background: B.white, opacity: slot, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: 40, fontWeight: 800, color: B.grayLite }}>?</div> : null;
            })}
            {RISIKO.map((r, k) => {
              const p = popIn(f, r.at);
              if (p <= 0.001) return null;
              const { x, y } = BARIS_RISIKO(k);
              return (
                <React.Fragment key={r.teks}>
                  <div style={{ position: 'absolute', left: x - 42, top: y - 42, width: 84, height: 84, borderRadius: 99, background: B.orange, display: 'grid', placeItems: 'center', transform: `scale(${p + (k === 2 ? denyut(f, tepat) : 0)})`, boxShadow: `0 12px 26px -12px ${B.orange}aa` }}>
                    <Icon name={r.ikon} size={50} color={B.white} />
                  </div>
                  <div style={{ position: 'absolute', left: x + 42 + JARAK, top: y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', lineHeight: 1 }}>
                    <WordText f={f} at={r.at + 10} style={{ fontFamily: F, fontSize: 32, fontWeight: 800, color: B.night }}>{r.teks}</WordText>
                  </div>
                  <GrafikRisiko f={f} y={y} jenis={r.jenis} at={r.at + 40} />
                </React.Fragment>);
            })}
            <Lensa f={f} />
          </AbsoluteFill>
        </>) : null}
      {/* ≠ */}
      <TidakSama x={(KIRI.x + KIRI.w + KANAN.x) / 2} y={KIRI.y + KIRI.h / 2} p={popIn(f, sama) * (1 - fokus)} />
      </AbsoluteFill>
    </AbsoluteFill>
    </AbsoluteFill>);
};

/** investor menaiki garis harga (roller coaster): duduk di atas garis, ikut miring sesuai kemiringan, perjalanan inOut cubic */
const Penunggang: React.FC<{ f: number; pts: { x: number; y: number }[] }> = ({ f, pts }) => {
  const s = popIn(f, NAIK_AT.mulai - 20);
  if (s <= 0.001) return null;
  // "tidak selalu sama dengan risiko … seberapa besar harga bergerak naik dan turun": berayun lembah ⇄ puncak (tiap setengah ayunan 60f inOut cubic), kembali ke lembah
  const nAyun = 2 * Math.floor((NAIK_AT.ayun1 - NAIK_AT.ayun0) / 120), ka = Math.floor((f - NAIK_AT.ayun0) / 60);
  const ayun = f < NAIK_AT.ayun0 || ka >= nAyun ? 0 : (ka % 2 === 0 ? io(((f - NAIK_AT.ayun0) % 60) / 60) : 1 - io(((f - NAIK_AT.ayun0) % 60) / 60));
  const u = R(f, NAIK_AT.mulai, NAIK_AT.puncak, 0, iP, io) + R(f, NAIK_AT.lembah0, NAIK_AT.lembah1, 0, iL - iP, io) + (iP - iL) * ayun;
  const i = Math.min(N - 2, Math.floor(u)), r = u - i;
  const x = lerp(pts[i].x, pts[i + 1].x, r), y = lerp(pts[i].y, pts[i + 1].y, r);
  const miring = Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x) * 180 / Math.PI * 0.6;
  const D = 58;
  return (
    <div style={{ position: 'absolute', left: x - D / 2, top: y - D - 4, width: D, height: D, borderRadius: 99, background: B.blue, border: `3px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${s}) rotate(${miring}deg)`, transformOrigin: '50% 100%', boxShadow: `0 10px 20px -10px ${B.blue}aa` }}>
      <Icon name="investor" size={34} color={B.white} />
    </div>);
};

/** kaca pembesar menyapu tiga slot risiko */
const Lensa: React.FC<{ f: number }> = ({ f }) => {
  const s = popIn(f, LENSA.mulai + 20) * (1 - R(f, LENSA.selesai - 10, LENSA.selesai + 20, 0, 1, io));
  if (s <= 0.001) return null;
  const u = R(f, LENSA.mulai + 30, LENSA.selesai - 10, 0, 2, io), k = Math.min(1, Math.floor(u)), r = u - k;
  const a = BARIS_RISIKO(k), b = BARIS_RISIKO(k + 1);
  const x = lerp(a.x, b.x, r) + 56, y = lerp(a.y, b.y, r) + 46, D = 86;
  return <KacaPembesar x={x} y={y} d={D} s={s} />;
};

/** grafik mini tiap risiko (tanpa teks): permanen = jatuh & tak kembali · memburuk = turun pelan · terpaksa = jual di lembah, lalu pulih tanpa kita */
const GrafikRisiko: React.FC<{ f: number; y: number; jenis: 'permanen' | 'memburuk' | 'terpaksa'; at: number }> = ({ f, y, jenis, at }) => {
  const p = popIn(f, at - 30);
  if (p <= 0.001) return null;
  const g = R(f, at, at + 100, 0, 1, io);
  const pad = 18, w = GRAFIK.w - 2 * pad, h = GRAFIK.h - 2 * pad, x0 = GRAFIK.x + pad, y0 = y - GRAFIK.h / 2 + pad;
  const fy: Record<typeof jenis, (t: number) => number> = {
    permanen: (t) => (t < 0.4 ? 0.2 + 0.05 * Math.sin(t * 20) : t < 0.55 ? 0.2 + (t - 0.4) / 0.15 * 0.65 : 0.85 + 0.02 * Math.sin(t * 30)),
    memburuk: (t) => 0.15 + 0.7 * t + 0.06 * Math.sin(t * 14),
    terpaksa: (t) => (t < 0.5 ? 0.25 + 0.6 * Math.sin(Math.PI * t) ** 2 * (t / 0.5) : 0.85 - 0.75 * Math.sin(Math.PI * (t - 0.5))),
  };
  const titikPada = (t: number) => ({ x: x0 + t * w, y: y0 + fy[jenis](t) * h });
  const n = 40, ujung = jenis === 'terpaksa' ? 0.5 : 1;
  const garis = Array.from({ length: Math.max(2, Math.ceil(g * ujung * n) + 1) }, (_, i) => titikPada(Math.min(g * ujung, i / n)));
  const pulih = jenis === 'terpaksa' ? R(f, at + 130, at + 230, 0, 1, io) : 0; // harga pulih tanpa kita ("…pengaturan dana yang kurang tepat")
  const garisPulih = Array.from({ length: Math.max(2, Math.ceil(pulih * n / 2) + 1) }, (_, i) => titikPada(Math.min(0.5 + pulih * 0.5, 0.5 + i / n)));
  const lembah = titikPada(0.5);
  // penunggang (investor, sama dengan roller coaster Volatilitas) di ujung garis: ikut jatuh & tak naik lagi · turun pelan · turun ke
  // lembah lalu TERTINGGAL di sana saat harga pulih tanpa dia (terpaksa menjual)
  const kepala = garis[garis.length - 1], sp = popIn(f, at - 10), DP = 40;
  return (
    <>
      <div style={{ position: 'absolute', left: GRAFIK.x, top: y - GRAFIK.h / 2, width: GRAFIK.w, height: GRAFIK.h, borderRadius: 20, background: B.white, border: `2.5px solid ${B.orange}`, transform: `scale(${p})`, transformOrigin: 'center', boxShadow: `0 10px 24px -12px ${B.orange}aa` }} />
      {p > 0.9 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {g > 0.001 ? <polyline points={garis.map((q) => `${q.x},${q.y}`).join(' ')} fill="none" stroke={ARAH.turun} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
          {pulih > 0.001 ? <polyline points={garisPulih.map((q) => `${q.x},${q.y}`).join(' ')} fill="none" stroke={B.grayLite} strokeWidth={6} strokeDasharray="8 9" strokeLinecap="round" /> : null}
          {jenis === 'terpaksa' && g > 0.98 ? <circle cx={lembah.x} cy={lembah.y} r={11 * popIn(f, at + 110)} fill={ARAH.turun} stroke={B.white} strokeWidth={2.5} /> : null}
        </svg>) : null}
      {/* terpaksa menjual: penunggang BAYANGAN (garis putus, pucat) ikut naik di garis pemulihan — seandainya tidak terpaksa menjual */}
      {jenis === 'terpaksa' && pulih > 0.001 ? (() => {
        const q = titikPada(0.5 + 0.5 * pulih);
        return <div style={{ position: 'absolute', left: q.x - DP / 2, top: q.y - DP - 4, width: DP, height: DP, borderRadius: 99, background: B.white, border: `2.5px dashed ${B.blueLite}`, display: 'grid', placeItems: 'center', opacity: Math.min(1, pulih * 4) }}><Icon name="investor" size={24} color={B.blueLite} /></div>;
      })() : null}
      {p > 0.9 && sp > 0.001 ? (
        <div style={{ position: 'absolute', left: kepala.x - DP / 2, top: kepala.y - DP - 4, width: DP, height: DP, borderRadius: 99, background: B.blue, border: `2.5px solid ${B.white}`, display: 'grid', placeItems: 'center', transform: `scale(${sp})`, boxShadow: `0 8px 16px -8px ${B.blue}aa` }}>
          <Icon name="investor" size={24} color={B.white} />
        </div>) : null}
    </>);
};

/** judul di dalam panel (lingkaran ikon + teks) */
const JudulPanel: React.FC<{ x: number; y: number; teks: string; ikon: KunciIkon; col: string; p: number; pulse: number }> = ({ x, y, teks, ikon, col, p, pulse }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translateY(-50%) scale(${p + pulse})`, transformOrigin: 'center', display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ width: 56, height: 56, borderRadius: 99, background: col, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={36} color={B.white} /></div>
    <span style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: B.night }}>{teks}</span>
  </div>);

/** lencana ≠ */
const TidakSama: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - 40, top: y - 40, width: 80, height: 80, borderRadius: 99, background: B.white, border: `3px solid ${B.night}`, transform: `scale(${p})`, display: 'grid', placeItems: 'center', boxShadow: `0 10px 24px -12px ${B.night}66` }}>
    <svg width={80} height={80} viewBox="0 0 80 80"><g fill={B.night}><rect x={22} y={28} width={36} height={7} rx={3.5} /><rect x={22} y={45} width={36} height={7} rx={3.5} /></g><line x1={50} y1={18} x2={30} y2={62} stroke={B.night} strokeWidth={7} strokeLinecap="round" /></svg>
  </div>);

export const S10_BEAT = { pertumbuhan, nyaman, naik, ini, turun, besok, volatilitas, tapi, sama, risiko, menggambarkan, seberapa, naik2, turun2, risiko2, kehilangan, permanen, memburuk, terpaksa, tepat };
