import React from 'react';
import { gayaIsi, kamera, keLayar } from '../kamera';
import { AbsoluteFill } from 'remotion';
import { frasa, muncul, urut } from '../beats';
import { BATAS } from '../batas';
import type { KunciIkon } from '../ikon';
import { ARAH, B, F, GAP, HOUSE, R, io, WARNA } from '../theme';
import { Icon, WordText, cin, grow, lerp } from '../parts/kit';
import { popIn } from '../parts/pop';
import { Konektor, PanahBadge, SimpulBab, Tile, denyut } from '../parts/rantai';
import { PembukaBab, SIMPUL_PETA } from '../parts/peta';
import { BUKA_D, Vinyet } from '../parts/vinyet';
import { FotoLingkar, JARI_RUMAH, RumahLingkar } from '../parts/gedung';
import { Bundel, BundelKosong, LembarUang, TumpukanUang, UNIT_UANG, atasTumpukan, busur, kotakTumpukan, puncakUnit, pusatLapis, tumpukanDiPusat, unitTumpukan } from '../parts/uang';
import { Judul } from '../s03/Scene03';
import { PilNominal, rpJuta, rpJutaKoma, rpMiliar, rpRibu, tanda } from '../parts/nominal';

/**
 * SCENE 05 — PROPERTI. Brief = kolom VISUAL + TEXT naskah Simon:
 *   VISUAL "PROPERTY → Rental Income → Potential Price Appreciation · (di samping) Higher Capital Requirement ·
 *           Lower Liquidity · Transaction Costs"
 *   TEXT   "Properti / sewa + potensi kenaikan nilai"
 * Revisi 8 Okt (Simon): "aku kurang bisa memahami adegan sisipan … perjelas konteks visualnya (tanpa teks)", "tumpukan coin ganti
 * tumpukan kertas (aset, hijau)", "alignment tidak center", "perbesar", "transisi masking → ganti warna background (biru), kembali ke
 * ungu saat masker menutup (seperti adegan berpikir Scene 01)".
 *   · DIAGRAM SIMETRIS per fase (kamera diam): fase A satu baris [Pendapatan sewa] ← Properti → [Potensi kenaikan nilai];
 *     fase B ("Tapi ada trade-off") baris itu naik dan tiga trade-off muncul sebaris di bawahnya. Label DI BAWAH ikon. Nomor bab dihapus.
 *   · SISIPAN = masker ke LATAR PENUH berona lain (V1 biru · V2 krim · V3/V4 biru), isinya benda harfiah dari aset uang Simon:
 *     V1 uang sewa mengalir tiap bulan ke tumpukan + rumah menaiki garis nilai · V2 modal (tumpukan per instrumen) → likuiditas
 *     (tumpukan lain cair ke dompet, properti tertahan) → tombol Sell saham (uang langsung) vs rumah (hanya memuat) · V3 hasil jual
 *     dipotong ke Agen/Administrasi/Lainnya · V4 dijual cepat → tumpukan harga berkurang (▼).
 */
export const S5 = BATAS.s5;
export const IDE_S05_AWAL = S5;

const [properti, punya, pertama, pendapatan, kedua, potensi, sendiri, artinya, sekaligus, naik, tapi, modal, dan, rumah, menekan, tombol,
  selain, ada, administrasi, dan2, kalau, kadang, rendah] = urut(['properti', 'punya', 'pertama', 'pendapatan', 'kedua', 'potensi', 'sendiri',
  'artinya', 'sekaligus', 'naik', 'tapi', 'modal', 'dan', 'rumah', 'menekan', 'tombol', 'selain', 'ada', 'administrasi', 'dan', 'kalau',
  'kadang', 'rendah'], S5);
const [cash, likuiditasnya, dijual, semudah, agen, transaksi, cepat] = urut(['cash', 'likuiditasnya', 'dijual', 'semudah', 'agen', 'transaksi', 'cepat'], artinya);
/** pusat tanjakan 60f yang mulai 18f sebelum frasa yang memuat kata di frame `at` */
const M = (w: string, at: number) => muncul(w, at);
/** awal (frame) 18f sebelum frasa yang memuat kata di frame `at` */
const A0 = (w: string, at: number) => frasa(w, at) - 18;
const geser = (x: number, y: number) => `translate3d(${x}px, ${y + 0.03}px, 0) rotate(0.001deg)`;

/* ── geometri diagram (diperbesar, simetris di x 960) ── */
export const NODE5 = { x: 960, y: 540, d: 230 };
const TD = 160; // lingkaran sumber return & trade-off (dulu 100)
const KOL = [520, 960, 1400];
const BARIS_B = 360; // fase B: baris atas naik ke sini (fase A di NODE5.y)
const BAWAH = 760; // baris trade-off
const LABEL = 36; // label di bawah ikon (dulu 30, di samping)
const JARAK = 16;
const SUMBER = [
  { x: KOL[0], ikon: 'kunciSewa' as KunciIkon, teks: 'Pendapatan sewa', at: M('pertama', pertama), label: M('pendapatan', pendapatan), col: WARNA.turkis },
  { x: KOL[2], ikon: 'kenaikanNilai' as KunciIkon, teks: 'Potensi kenaikan nilai', at: M('kedua', kedua), label: M('potensi', potensi), col: WARNA.langit }, // Simon 9 Okt: konteks mirip → warna beda
];
const TRADE = [
  { x: KOL[0], ikon: 'modalAwal' as KunciIkon, teks: 'Modal awal lebih besar', at: M('modal', modal), col: WARNA.ungu },
  { x: KOL[1], ikon: 'likuiditas' as KunciIkon, teks: 'Likuiditas lebih rendah', at: M('dan', dan), col: WARNA.turkisMuda },
  { x: KOL[2], ikon: 'biayaTransaksi' as KunciIkon, teks: 'Biaya transaksi', at: M('selain', selain), col: WARNA.oranyeMuda },
];

/* ── waktu (frame global) ── */
const TENGAH = properti + 80; // simpul bab 03 tiba di tengah (PembukaBab: isiAt+20 … +80)
const HUBUNG = Math.max(M('punya', punya), TENGAH + 10);
/** V1 (Simon 8 Okt: "transisi ini seharusnya di potensi kenaikan nilai"): masker keluar dari ikon Potensi kenaikan nilai.
 *  Simon 9 Okt: "pertahankan sampai 'potensi kenaikan nilai properti itu sendiri.' baru masuk ke adegan sisipan pada saat voice
 *  mengatakan 'artinya'" → diagram ditahan sepanjang kalimat "Kedua, …", masker membuka 18f sebelum "Artinya" (dulu 40f sesudah label
 *  Potensi kenaikan nilai, di tengah kalimatnya). `naik` = batang nilai mulai tumbuh ("sekaligus berpotensi naik nilainya"). */
const V1 = { buka: A0('artinya', artinya), tutup: A0('tapi', tapi) - BUKA_D, cash: A0('artinya', artinya), b: A0('sekaligus', sekaligus) + 30, naik: A0('sekaligus', sekaligus) };
const FASE_B = M('tapi', tapi) + 10; // baris atas naik, kepala Trade-off muncul
/* Simon 9 Okt ("muncul satu per satu sesuai voice"): sumber return & trade-off pop di KATA masing-masing (pertama · kedua · modal · dan ·
 * selain); keseimbangan saat diagram baru separuh dijaga kamera (geser bertahap), bukan pop berkelompok */
const V2 = { buka: TRADE[0].at + 30, tutup: tombol + 15, b: A0('dan', dan), c: A0('rumah', rumah) };
const V3 = { buka: TRADE[2].at + 30, v4: A0('kalau', kalau) };

export const Scene05: React.FC<{ f: number }> = ({ f }) => {
  if (f < S5) return null;
  // KELUAR = milik Scene 06 (perpindahan seperti Scene 01–03, sama dengan Scene 04 → 05): MASKER LINGKARAN — seluruh isi
  // menyusut ke simpul bab 03 (Properti) di peta bab pembuka Scene 06, berubah oranye (warna bab 03), lalu peta mengambil alih.
  if (f >= BATAS.s6 + 52) return null;
  const ex = R(f, BATAS.s6, BATAS.s6 + 50, 0, 1, io);
  const kam6 = kamera('S06', BATAS.s6 + 50); // simpul bab 03 digambar Scene 06 di dalam kameranya → masker mendarat tepat di sana
  const M0 = { x: 960, y: 540, r: Math.hypot(960, 540) + 12 }, M1 = { ...keLayar(kam6, SIMPUL_PETA(2)), r: SIMPUL_PETA(2).r * kam6.z };
  const mk = { x: lerp(M0.x, M1.x, ex), y: lerp(M0.y, M1.y, ex), r: lerp(M0.r, M1.r, ex) };
  const sIsi = Math.pow(mk.r / M0.r, 0.6); // isi menyusut lebih lambat dari lingkarannya → terpotong bertahap
  const kam = kamera('S05', f);
  const sudahTengah = f >= TENGAH;
  // baris atas naik BERSAMAAN dengan sisipan V1 menutup (dulu sesudahnya → diagram tersingkap di posisi lama, +44 px dari tengah ±0,8 dtk,
  // terukur); kepala Trade-off tetap muncul di "tapi" (FASE_B + 10). Masker V1 mendarat di simpul yang ikut naik (ke.y + dyAtas).
  const naikB = cin(f, V1.tutup + BUKA_D / 2);
  const dyAtas = (BARIS_B - NODE5.y) * naikB;

  return (
    <AbsoluteFill style={ex > 0 ? { clipPath: `circle(${mk.r}px at ${mk.x}px ${mk.y}px)`, zIndex: 1 } : undefined}>{/* zIndex: isi lama DI ATAS peta bab yang baru → simpul peta tersingkap saat lingkaran menyusut, tidak menumpuk di atas isi lama */}
    {ex > 0 ? <AbsoluteFill style={{ background: B.white, opacity: R(f, BATAS.s6, BATAS.s6 + 12, 0, 1, io) }} /> : null}
    <AbsoluteFill style={ex > 0 ? { transformOrigin: `${M0.x}px ${M0.y}px`, transform: `translate(${mk.x - M0.x}px, ${mk.y - M0.y}px) scale(${sIsi})` } : undefined}>
      {/* ISI — kamera (diam: pusat dunia tiap fase disamakan); judul digambar SESUDAHNYA supaya tetap di atas latar sisipan */}
      <AbsoluteFill style={gayaIsi(kam, f >= BATAS.s6 - 30)}>
      {/* ═════ pembuka bab: peta bab → simpul bab 03 ke tengah ═════ */}
      <PembukaBab f={f} s0={S5} k={2} isiAt={properti} tengah={NODE5} selesai={TENGAH} />

      {/* ═════ DIAGRAM ═════ */}
      {/* baris atas (Properti + dua sumber return) — bergeser naik di fase B */}
      <AbsoluteFill style={{ transform: geser(0, dyAtas) }}>
        <div style={{ position: 'absolute', left: NODE5.x - 220, width: 440, top: NODE5.y + NODE5.d / 2 + JARAK, textAlign: 'center', lineHeight: 1 }}>
          <WordText f={f} at={TENGAH + 20} halus style={{ fontFamily: F, fontSize: 48, fontWeight: 800, color: B.night }}>Properti</WordText>
        </div>
        {/* Simon 12 Okt "pas disini iconnya ganti rumah": simpul Properti = foto rumah Simon di cakram oranye (warna bab). Ikon peta bab memudar
            ke foto 30f sesudah simpul tiba di tengah. Lalu "perbesar gambar rumahnya": 0,95 D → 1,165 D (268 px, +23 %), alas 0,487 r (56 px) di
            bawah pusat. Batas terukur: di garis penghubung (y pusat) dinding kanan rumah = 44 % lebar foto dari pusat → 114 px < awal penghubung
            129 px (tepi cakram + GAP); lis atap (paling lebar, 35–50 % tinggi) 17 px DI ATAS garis; alas 14 px di atas pil Rp1,0 M; puncak 56 px
            di bawah pil "Dua sumber return". Digeser 4 px ke kiri: foto lebih berat ke kanan (pusat massa 51,4 %). Foto di ukuran pikselnya
            sendiri (di luar kotak berskala simpul — pelajaran emas S03: foto di dalam scale() berkedip saat raster ulang). */}
        {sudahTengah ? <SimpulBab x={NODE5.x} y={NODE5.y} d={NODE5.d} col={B.orange} ikon="properti" isi={1} ikonOp={1 - R(f, TENGAH, TENGAH + 30, 0, 1, io)} /> : null}
        {sudahTengah ? <FotoLingkar k="rumah" x={NODE5.x - 4} cy={NODE5.y} D={NODE5.d} s={1} warna="none" lebar={1.165} alas={0.487} op={R(f, TENGAH, TENGAH + 30, 0, 1, io)} /> : null}
        <PilBesar x={NODE5.x} y={NODE5.y - NODE5.d / 2 - JARAK - 35} p={popIn(f, HUBUNG)} teks="Dua sumber return" ikon="sumberReturn" col={B.turq} />
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {SUMBER.map((k, i) => {
            const kiri = k.x < NODE5.x;
            const x1 = NODE5.x + (kiri ? -1 : 1) * (NODE5.d / 2 + GAP), x2 = k.x + (kiri ? 1 : -1) * (TD / 2 + GAP);
            return <Konektor key={k.teks} x1={x1} y1={NODE5.y} x2={x2} y2={NODE5.y} g={grow(f, k.at - 10)} col={k.col} />;
          })}
        </svg>
        {SUMBER.map((k, i) => <Slot key={`s${i}`} x={k.x} y={NODE5.y} d={TD} p={popIn(f, HUBUNG + 15 + 12 * i)} op={slotOp(f, k.at)} />)}
        {SUMBER.map((k, i) => (
          <Tile key={k.teks} x={k.x} y={NODE5.y} dsz={TD} ikon={k.ikon} col={k.col} p={popIn(f, k.at)} labelLebar={460}
            denyut={denyut(f, k.at) + (i === 1 ? denyut(f, V1.tutup + BUKA_D + 6) : 0)}
            label={<WordText f={f} at={k.label} halus style={{ fontFamily: F, fontSize: LABEL, fontWeight: 800, color: B.night }}>{k.teks}</WordText>}
            badge={i === 1 ? <PanahBadge x={k.x + TD * 0.36} y={NODE5.y - TD * 0.36} d={56} naik p={popIn(f, V1.tutup + BUKA_D)} flip={0} /> : undefined} />))}
        {/* Simon 9 Okt "nominal di seluruh adegan": harga properti (label harga di sudut simpul), sewa per bulan, nilai potensial —
            pil di bawah label sumbernya, pop bersama labelnya */}
        <PilNominal x={NODE5.x + 62} y={NODE5.y + 92} jangkar="kiri" teks={rpMiliar(1)} arah={0} p={popIn(f, TENGAH + 40)} size={26} />
        {SUMBER.map((k, i) => <PilNominal key={`n${i}`} x={k.x} y={NODE5.y + TD / 2 + JARAK + LABEL + 38} teks={i === 0 ? tanda(rpJuta(5), true) : rpMiliar(1.6)} arah={1} p={popIn(f, k.label + 20)} size={26} />)}
      </AbsoluteFill>

      {/* baris trade-off (fase B) */}
      <PilBesar x={960} y={BAWAH - TD / 2 - JARAK - 35} p={popIn(f, FASE_B + 10)} teks="Trade-off" ikon="tradeOff" col={B.blue} />
      {TRADE.map((k, i) => <Slot key={`s${i}`} x={k.x} y={BAWAH} d={TD} p={popIn(f, FASE_B + 25 + 12 * i)} op={slotOp(f, k.at)} />)}
      {TRADE.map((k, i) => (
        <Tile key={k.teks} x={k.x} y={BAWAH} dsz={TD} ikon={k.ikon} col={k.col} p={popIn(f, k.at)} labelLebar={460}
          denyut={denyut(f, k.at) + (k.ikon === 'likuiditas' ? denyut(f, V2.tutup + BUKA_D + 6) : 0)}
          label={<WordText f={f} at={k.at + 10} halus style={{ fontFamily: F, fontSize: LABEL, fontWeight: 800, color: B.night }}>{k.teks}</WordText>} />))}

      {/* ═════ SISIPAN (masker → latar penuh berona lain; menutup → latar ungu adegan tersingkap lagi) ═════ */}
      {/* V1 · "Kedua, potensi kenaikan nilai properti itu sendiri. Artinya, properti bisa menghasilkan cash flow, sekaligus berpotensi naik nilainya seiring waktu." */}
      <Vinyet f={f} dari={{ x: SUMBER[1].x, y: NODE5.y, r: TD / 2 }} ke={{ x: SUMBER[1].x, y: NODE5.y + dyAtas, r: TD / 2 }} buka={V1.buka} tutup={V1.tutup} col={B.turq} latar={HOUSE.biru} kam={kam}>
        <AdeganCashFlow f={f} />
      </Vinyet>
      {/* V2 · "Modal awalnya biasanya lebih besar, dan likuiditasnya juga lebih rendah. Rumah tidak bisa dijual semudah menekan tombol sell." */}
      <Vinyet f={f} dari={{ x: TRADE[0].x, y: BAWAH, r: TD / 2 }} ke={{ x: TRADE[1].x, y: BAWAH, r: TD / 2 }} buka={V2.buka} tutup={V2.tutup} col={B.orange} latar={HOUSE.krim} kam={kam}>
        <AdeganModalLikuid f={f} />
      </Vinyet>
      {/* V3 → V4 · "Selain itu, ada biaya agen, administrasi, dan biaya transaksi lainnya. Kalau harus cepat dijual, … harga yang lebih rendah." */}
      <Vinyet f={f} dari={{ x: TRADE[2].x, y: BAWAH, r: TD / 2 }} buka={V3.buka} col={B.blue} latar={HOUSE.biru} kam={kam} keluar={ex > 0 ? { dx: mk.x - M0.x, dy: mk.y - M0.y, s: sIsi } : undefined}>
        <AdeganBiaya f={f} />
        <AdeganDijualCepat f={f} />
      </Vinyet>
      </AbsoluteFill>
      <AbsoluteFill>
        <Judul f={f} kata={['Sewa', '+', 'potensi', 'kenaikan nilai']} at={sendiri - 10} sorotAt={sendiri + 30} />
      </AbsoluteFill>
    </AbsoluteFill>
    {ex > 0 ? <AbsoluteFill style={{ background: B.orange, opacity: R(f, BATAS.s6 + 22, BATAS.s6 + 48, 0, 1, io) }} /> : null}
    {/* ikon bab memudar masuk di atas isian → saat ditukar ke simpul peta (BATAS.s6+52) gambarnya sudah identik (dulu ikon muncul 1 frame) */}
    {ex > 0 ? <div style={{ position: 'absolute', left: mk.x - mk.r, top: mk.y - mk.r, width: 2 * mk.r, height: 2 * mk.r, display: 'grid', placeItems: 'center', opacity: R(f, BATAS.s6 + 34, BATAS.s6 + 48, 0, 1, io) }}><Icon name="properti" size={2 * mk.r * 0.56} color={B.white} /></div> : null}
    </AbsoluteFill>);
};

/** cincin "jadi uang tunai" (likuiditas): jalur abu-abu + busur turkis (warna dompet) yang terisi searah jarum jam dari atas */
const CincinTunai: React.FC<{ x: number; y: number; r: number; isi: number; p: number }> = ({ x, y, r, isi, p }) => {
  if (p <= 0.001) return null;
  const K = 2 * Math.PI * r, b = r + 6; // kotak SVG SEKETAT cincinnya: dulu SVG selayar penuh → begitu muncul (f1422) menimpa lapisan
  // komposit lingkaran instrumen, Chrome ikut mengangkat SEMUA yang dilukis sesudahnya (pil modal) ke lapisan lain → tepi teks berganti 1 frame
  return (
    <svg width={2 * b} height={2 * b} viewBox={`${x - b} ${y - b} ${2 * b} ${2 * b}`} style={{ position: 'absolute', left: x - b, top: y - b, opacity: p }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={B.grayLite} strokeWidth={7} />
      {isi > 0.005 ? <circle cx={x} cy={y} r={r} fill="none" stroke={B.turq} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${isi * K} ${K}`} transform={`rotate(-90 ${x} ${y})`} /> : null}
    </svg>);
};

/** slot putus-putus "?" (bahasa slot S13): kerangka kelompok muncul bersama kepalanya → susunan seimbang sejak awal, tiap anggota mengisi
 *  slotnya DI KATANYA (kamera tidak mengejar susunan setengah jadi). Memudar saat anggotanya pop di atasnya. */
const Slot: React.FC<{ x: number; y: number; d: number; p: number; op: number }> = ({ x, y, d, p, op }) => p <= 0.001 || op <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: B.white, border: `3px dashed ${B.grayLite}`, opacity: op, transform: `scale(${p})`, display: 'grid', placeItems: 'center', fontFamily: F, fontSize: d * 0.36, fontWeight: 800, color: B.grayLite }}>?</div>);
/** slot hilang tepat sebelum anggotanya selesai pop (pop 60f berpusat di `at`) */
const slotOp = (f: number, at: number) => 1 - R(f, at - 30, at, 0, 1, io);


/** pil kepala (diperbesar dari PilKepala: teks 34, lingkaran 56) */
const PilBesar: React.FC<{ x: number; y: number; p: number; teks: string; ikon: KunciIkon; col: string }> = ({ x, y, p, teks, ikon, col }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 14, background: B.white, border: `3px solid ${col}`, borderRadius: 999, padding: '8px 30px 8px 8px', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${col}aa` }}>
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center' }}><Icon name={ikon} size={38} color={B.white} /></div>
    {teks}
  </div>);

/* ───────────── komponen sisipan ───────────── */

/** lingkaran ikon (gaya rumah), posisi lewat transform */
const Lingkar: React.FC<{ x: number; y: number; d: number; col: string; ikon: KunciIkon; s?: number; op?: number; putar?: number }> = ({ x, y, d, col, ikon, s = 1, op = 1, putar = 0 }) =>
  s <= 0.001 || op <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', background: col, display: 'grid', placeItems: 'center', transform: `${geser(x - d / 2, y - d / 2)} scale(${s}) rotate(${putar}deg)`, opacity: op, boxShadow: `0 16px 34px -14px ${col}aa` }}>
      <Icon name={ikon} size={d * 0.58} color={B.white} />
    </div>);

/** 0→1 denyut tiap kali sebuah peristiwa terjadi (puncak di tiap t) */
const denyutBanyak = (f: number, ts: number[], k = 1) => Math.max(0, ...ts.map((t) => denyut(f, t))) * k;

/**
 * V1 — CASH FLOW lalu NILAI NAIK sekaligus (grafik batang di atas kisi, Simon 8 Okt: "graphicnya buat seperti ini … warnanya sama").
 *  Sejak Simon 9 Okt sisipan membuka di "Artinya" (kalimat "potensi kenaikan nilai …" kini milik diagram), jadi isinya mengikuti kalimat
 *  sisipan itu sendiri — benda sama, urutan ikut VO:
 *  "Artinya, properti bisa menghasilkan cash flow" → rumah di batang pertama (Rp1,0 M), uang sewa (lembar hijau) mengalir dari rumah ke
 *    tumpukan yang BERTAMBAH di kanan; susunan grafik + tumpukan sudah utuh sejak masker membuka (dulu grafik sendirian lalu bergeser kiri —
 *    kini geseran itu akan jatuh di tengah masker membuka);
 *  "sekaligus berpotensi naik nilainya seiring waktu" → batang tumbuh satu per satu, rumah naik di puncak batang terbaru, nilainya
 *    Rp1,0 M → Rp1,6 M (▲) SAMBIL uang sewa tetap mengalir.
 */
/* Simon 12 Okt: "rumah dan uang alignmentnya belum benar, kedua hal itu belum berada ditengah, tambahkan illustrasi sewa juga" +
 * "perbesar gambar rumahnya" + "tambahkan lingkaran masking seperti di adegan saham" → SATU BARIS di garis tengah yang sama:
 * [rumah di lingkaran] [papan "Disewakan"] [tumpukan uang sewa]; gabungan rumah + tumpukan berpusat di x 960. Grafik batang nilai pindah
 * ke BAWAH rumah (dulu rumah Ø74 px menaiki batang → rumah berpindah-pindah, tak pernah sebaris dengan tumpukan). */
/** lingkaran rumah (Simon 12 Okt: "warna background lingkaran rumah belum biru brand, itu masih menggunakan warna turunannya") = Dark
 *  Turquoise MURNI (B.turq — "biru" Simon; Neon Blue = "ungu" Simon), cincin wash = token turqWash. Dulu BIRU_GEDUNG #5E8AE8 (campuran). */
const LINGKAR_RUMAH = { isi: B.turq, wash: B.turqWash };
const BATANG = { n: 7, jarak: 44, lebar: 26, tinggi: 110, h: [0.17, 0.29, 0.41, 0.41, 0.62, 0.79, 0.97] };
const V1L = (() => {
  const D = 290, JR = JARI_RUMAH * D, W = 130, BARIS = 510, PAPAN_W = 238, CELAH = 36;
  const kt = kotakTumpukan(0, 0, W), lebarT = kt.x1 - kt.x0;
  const total = 2 * JR + CELAH + PAPAN_W + CELAH + lebarT, kiri = 960 - total / 2;
  return { D, JR, W, BARIS, RUMAH: { x: kiri + JR, y: BARIS }, PAPAN: { x: kiri + 2 * JR + CELAH + PAPAN_W / 2, y: BARIS },
    PILE: tumpukanDiPusat(kiri + total - lebarT / 2, BARIS, W), dasarB: BARIS + JR + 24 + BATANG.tinggi };
})();
const AdeganCashFlow: React.FC<{ f: number }> = ({ f }) => {
  const { D, JR, W, RUMAH, PAPAN, PILE, dasarB } = V1L;
  const MULAI = [V1.buka + 50, ...Array.from({ length: BATANG.n - 1 }, (_, k) => V1.naik + 16 * k)];
  const gB = MULAI.map((t) => R(f, t, t + 30, 0, 1, io));
  const bx = (i: number) => RUMAH.x + (i - (BATANG.n - 1) / 2) * BATANG.jarak;
  // uang sewa: tiap "bulan" satu lembar — 4 di "cash flow", 2 lagi di "sekaligus … naik nilainya" (mengalir SEKALIGUS)
  const KIRIM = [V1.cash + 70, V1.cash + 104, V1.cash + 138, V1.cash + 172, V1.b + 30, naik + 5];
  const TERBANG = 46;
  const tiba = KIRIM.map((t) => t + TERBANG);
  // tumpukan Simon (22 bundel): tumpukan awal = belakang-tinggi + kanan-depan bersama masker membuka. Lembar ke-k membawa bundel KE[k]
  const KE = [unitTumpukan(1), unitTumpukan(2).slice(0, 3), unitTumpukan(2).slice(3), unitTumpukan(4), unitTumpukan(5).slice(0, 2), unitTumpukan(5).slice(2)];
  const MASUK_U = UNIT_UANG.map((u, i) => {
    if (u.t === 0) return V1.cash + 40 + 2 * u.l;
    if (u.t === 3) return V1.cash + 48 + 2 * u.l;
    const k = KE.findIndex((g) => g.includes(i));
    return tiba[k] + 4 * KE[k].indexOf(i);
  });
  const kisi = grow(f, V1.buka + 30);
  const X0 = bx(0) - 34, X1 = bx(BATANG.n - 1) + 34;
  const atasT = kotakTumpukan(PILE.x, PILE.dasar, W);
  return (
    <>
      {/* grafik nilai rumah (di bawah rumah): kisi tipis + garis dasar, batang hijau tumbuh satu per satu di "naik nilainya seiring waktu" */}
      {kisi > 0.001 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <g stroke={B.grayLite} strokeWidth={1.5} opacity={0.75}>
            {Array.from({ length: 4 }, (_, k) => <line key={`h${k}`} x1={X0} x2={lerp(X0, X1, kisi)} y1={dasarB - 27.5 * (k + 1)} y2={dasarB - 27.5 * (k + 1)} />)}
          </g>
          <line x1={X0 - 6} x2={lerp(X0 - 6, X1 + 6, kisi)} y1={dasarB + 3} y2={dasarB + 3} stroke={B.night} strokeWidth={5} strokeLinecap="round" opacity={0.8} />
        </svg>) : null}
      {gB.map((g, i) => g > 0.001 ? (
        <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: BATANG.lebar, height: BATANG.h[i] * BATANG.tinggi, background: ARAH.naik, borderRadius: '5px 5px 0 0',
          transformOrigin: '50% 100%', transform: `${geser(bx(i) - BATANG.lebar / 2, dasarB - BATANG.h[i] * BATANG.tinggi)} scaleY(${g})` }} />) : null)}
      {/* ilustrasi SEWA: papan "Disewakan" berkunci (ikon = Pendapatan sewa di diagram) di antara rumah dan tumpukan */}
      <PapanSewa x={PAPAN.x} y={PAPAN.y} p={popIn(f, V1.buka + 46)} />
      {/* tumpukan uang sewa (bertambah satu bundel tiap lembar tiba) */}
      <TumpukanUang x={PILE.x} dasar={PILE.dasar} W={W} keadaan={(i) => { const t = R(f, MASUK_U[i] - 10, MASUK_U[i] + 10, 0, 1, io); return { op: t, dy: -30 * (1 - t) }; }} />
      {/* nominal: uang sewa terkumpul (+Rp5 jt tiap kiriman) di atas tumpukannya */}
      {(() => { const v = 5 * tiba.reduce((a, t) => a + R(f, t - 10, t + 10, 0, 1, io), 0);
        return <PilNominal x={atasT.cx} y={atasT.y0 - 16 - 27} teks={rpJuta(v)} arah={R(v, 0, 5, 0, 1)} p={popIn(f, tiba[0])} size={26} lebarMin={130} />; })()}
      {/* rumah di lingkaran (gaya gedung adegan saham); kalender "tiap bulan" di tepi kiri-atas berdenyut tiap kiriman uang sewa */}
      <RumahLingkar x={RUMAH.x} cy={RUMAH.y} D={D} s={popIn(f, V1.buka + 40)} warna={LINGKAR_RUMAH.isi} wash={LINGKAR_RUMAH.wash} />
      <Lingkar x={RUMAH.x - JR * 0.707} y={RUMAH.y - JR * 0.707} d={56} col={B.blue} ikon="tenor" s={popIn(f, V1.cash + 40) + denyutBanyak(f, KIRIM, 0.8)} />
      {/* lembar sewa terbang rumah → tumpukan (melengkung di atas papan) */}
      {KIRIM.map((t0, k) => {
        const t = R(f, t0, t0 + TERBANG, 0, 1, io);
        if (f < t0 || t >= 1) return null;
        const asal = { x: RUMAH.x + JR * 0.55, y: RUMAH.y + 0.05 * D };
        const q = puncakUnit(PILE.x, PILE.dasar, W, KE[k][KE[k].length - 1]);
        const p = busur(asal, { x: q.x, y: q.y - 30 }, 130, t);
        return <LembarUang key={k} x={p.x} y={p.y} w={130} putar={lerp(-20, 14, t)} s={R(t, 0, 0.3, 0, 1, io) * lerp(1, 0.7, R(t, 0.7, 1, 0, 1))} op={Math.min(R(t, 0, 0.15, 0, 1, io), R(t, 0.85, 1, 1, 0))} />;
      })}
      {/* Simon 9 Okt: NOMINAL yang bertambah — nilai rumah ikut naik bersama batangnya (Rp1,0 M → Rp1,6 M), di atas rumah. Batang pertama =
          harga awal; angka baru naik saat batang berikutnya tumbuh ("naik nilainya") */}
      {(() => { const tumbuh = Math.max(0, gB.reduce((a, g) => a + g, 0) - gB[0]);
        return <PilNominal x={RUMAH.x} y={RUMAH.y - JR - 16 - 31} teks={rpMiliar(1 + 0.6 * (tumbuh / (BATANG.n - 1)))} arah={R(tumbuh, 0, 1, 0, 1, io)} p={popIn(f, V1.buka + 50)} lebarMin={196} />; })()}
    </>);
};

/** papan "Disewakan" (ilustrasi sewa, Simon 12 Okt): papan putih berbingkai oranye (warna bab Properti) + kunci di lingkaran turkis
 *  (ikon Pendapatan sewa) di atas tiang; (x, y) = pusat papan + tiang, pop dari pusat itu */
const PapanSewa: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${p})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: B.white, border: `3px solid ${B.orange}`, borderRadius: 14, padding: '8px 18px 8px 8px', fontFamily: F, fontSize: 28, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${B.orange}aa` }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: WARNA.turkis, display: 'grid', placeItems: 'center' }}><Icon name="kunciSewa" size={32} color={B.white} /></div>
      Disewakan
    </div>
    <div style={{ width: 10, height: 46, background: B.orange, borderRadius: '0 0 4px 4px' }} />
  </div>);

const V2_ATAS = 395, D_RUMAH2 = 313;
/** V2 — MODAL (tumpukan per instrumen, properti jauh lebih tinggi) → LIKUIDITAS (tumpukan lain cair ke dompet, properti tertahan)
 *  → TOMBOL SELL: saham ditekan → uang langsung keluar; rumah ditekan → hanya memuat */
const AdeganModalLikuid: React.FC<{ f: number }> = ({ f }) => {
  const INS: { ikon: KunciIkon; col: string; n: number }[] = [
    { ikon: 'emas', col: WARNA.turkis, n: 1 }, { ikon: 'saham', col: WARNA.oranyeMuda, n: 1 }, { ikon: 'reksaDana', col: WARNA.turkisMuda, n: 1 },
    { ikon: 'obligasi', col: WARNA.biru, n: 2 }, { ikon: 'properti', col: B.orange, n: 7 }]; // Simon 8 Okt: konteks mirip → warna beda
  const X = (k: number) => 960 + (k - 2) * 240, Y = 800, W = 150;
  const MODAL = [rpJuta(2), rpRibu(500), rpRibu(100), rpJuta(1), rpMiliar(1)]; // emas · saham · reksa dana · obligasi · properti (ilustratif)
  const DOMPET = { x: 960, y: 280 };
  const keSell = R(f, V2.c, V2.c + 50, 0, 1, io);
  /* Simon 9 Okt: "aku mau sesuatu yang lebih menggambarkan 'dan likuiditasnya juga lebih rendah'" → CINCIN "jadi uang tunai" di tiap
   * instrumen (warna dompet): empat instrumen penuh cepat (40f, jenjang 8f) lalu tumpukannya terbang ke dompet; PROPERTI tertahan di 15 %
   * dan tumpukannya DIGEMBOK (dulu jam pasir berputar). Likuiditas = seberapa cepat aset jadi uang tunai. */
  const L = likuiditasnya;
  const isiCincin = (k: number) => (k === 4 ? R(f, L - 30, L + 30, 0, 0.15, io) : R(f, L - 30 + 8 * k, L + 10 + 8 * k, 0, 1, io));
  const cair = (k: number) => R(f, L + 6 + 8 * k, L + 46 + 8 * k, 0, 1, io); // cincin penuh → tumpukan k → dompet
  const tibaDompet = [0, 1, 2, 3].map((k) => L + 46 + 8 * k);
  return (
    <>
      {keSell < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - keSell }}>
          <Lingkar x={DOMPET.x} y={DOMPET.y} d={150} col={B.turq} ikon="uangKeluar" s={popIn(f, V2.buka + 40) + denyutBanyak(f, tibaDompet, 0.8)} />
          {/* nominal: uang tunai yang sudah cair masuk dompet (properti Rp1 M tidak ikut) */}
          <PilNominal x={DOMPET.x + 75 + JARAK} y={DOMPET.y} jangkar="kiri" teks={rpJutaKoma([2, 0.5, 0.1, 1].reduce((a, v, k) => a + v * R(f, tibaDompet[k] - 10, tibaDompet[k] + 10, 0, 1, io), 0))} arah={1} p={popIn(f, tibaDompet[0] - 10)} size={26} lebarMin={140} />
          {INS.map((it, k) => {
            const props = k === 4;
            const dasar = Y - 60 - JARAK;
            const c = props ? 0 : cair(k);
            return (
              <React.Fragment key={k}>
                {Array.from({ length: it.n }, (_, j) => {
                  const t0 = V2.buka + 24 + 6 * k + (props ? 3 : 6) * j; // jatuh bersama lingkarannya (baris bawah tidak sendirian)
                  const jatuh = R(f, t0, t0 + 24, 0, 1, io);
                  if (jatuh <= 0) return null;
                  const p0 = { x: X(k), y: pusatLapis(dasar, W, j) };
                  const p = c > 0 ? busur(p0, DOMPET, 120, c) : { x: p0.x, y: p0.y - (1 - jatuh) * 60 };
                  return <Bundel key={j} x={p.x} y={p.y} w={W} s={lerp(1, 0.4, c)} op={jatuh * (1 - R(c, 0.8, 1, 0, 1))} />;
                })}
                <Lingkar x={X(k)} y={Y} d={props ? 130 : 110} col={it.col} ikon={it.ikon} s={popIn(f, V2.buka + 20 + 6 * k)} />
                <CincinTunai x={X(k)} y={Y} r={(props ? 130 : 110) / 2 + 11} isi={isiCincin(k)} p={R(f, L - 40, L - 20, 0, 1, io)} />
                {/* nominal: modal awal tiap instrumen (properti jauh lebih besar) */}
                <PilNominal x={X(k)} y={Y + 65 + 11 + 30} teks={MODAL[k]} arah={0} p={popIn(f, V2.buka + 30 + 6 * k)} size={24} />
              </React.Fragment>);
          })}
          {/* properti tertahan: uangnya DIGEMBOK di atas tumpukannya ("juga lebih rendah") */}
          <Lingkar x={X(4)} y={pusatLapis(Y - 60 - JARAK, W, 6) - 110} d={84} col={B.blue} ikon="gembok" s={popIn(f, L + 55)} />
        </div>) : null}
      {keSell > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: keSell, transform: geser(0, -22) }}>
          {/* kiri: saham — tombol ditekan, uang LANGSUNG keluar */}
          {/* Simon 12 Okt (rumah diperbesar + lingkaran masking): baris atas di y 395 (dulu 410) — susunan rumah Ø360 tampak tetap berjarak
              dari tombol Sell; lingkaran saham ikut sebaris */}
          <Lingkar x={660} y={V2_ATAS} d={220} col={B.orange} ikon="saham" s={lerp(0.85, 1, keSell)} />
          <TombolSell x={660} y={640} tekan={semudah} />
          <Bundel x={660} y={800} w={180} s={popIn(f, semudah + 16)} />
          <PilNominal x={660 + 90 + JARAK} y={800} jangkar="kiri" teks={tanda(rpRibu(500), true)} arah={1} p={popIn(f, semudah + 26)} size={26} />
          {/* kanan: rumah — tombol ditekan, hanya memuat (jam pasir) */}
          {/* foto rumah Simon di lingkaran (gaya gedung adegan saham), rumah 360 px (+20 %, dulu 300 tanpa lingkaran) */}
          <RumahLingkar x={1260} cy={V2_ATAS} D={D_RUMAH2} s={lerp(0.85, 1, keSell)} warna={LINGKAR_RUMAH.isi} wash={LINGKAR_RUMAH.wash} />
          <Lingkar x={1260 + JARI_RUMAH * D_RUMAH2 * 0.707} y={V2_ATAS - JARI_RUMAH * D_RUMAH2 * 0.707} d={84} col={B.blue} ikon="jangkaWaktu" s={popIn(f, dijual + 30)} putar={180 * R(f, dijual + 50, dijual + 110, 0, 1, io)} />
          {/* rumah ditekan lebih dulu ("Rumah tidak bisa DIJUAL …"), saham di "semudah" — hasil tiap kolom muncul lebih awal */}
          <TombolSell x={1260} y={640} tekan={dijual} />
          {/* Simon 9 Okt "animasi idle": dulu pemuat berputar TERUS — kini tempat uang KOSONG (siluet putus-putus), diam: uang tidak keluar */}
          <BundelKosong x={1260} y={800} w={180} s={popIn(f, dijual + 16)} />
          <PilNominal x={1260 + 90 + JARAK} y={800} jangkar="kiri" teks="Rp0" arah={0} p={popIn(f, dijual + 26)} size={26} />
        </div>) : null}
    </>);

  function TombolSell({ x, y, tekan }: { x: number; y: number; tekan: number }) {
    const t = Math.sin(Math.PI * R(f, tekan - 8, tekan + 16, 0, 1, io)) * 0.1;
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `${geser(x, y)} translate(-50%, -50%) scale(${1 - t})`, background: ARAH.turun, color: B.white, borderRadius: 18, padding: '16px 52px', fontFamily: F, fontSize: 40, fontWeight: 800, boxShadow: `0 ${12 - 60 * t}px 24px -10px ${ARAH.turun}aa` }}>Sell</div>);
  }
};

/** V3 — HASIL JUAL DIPOTONG BIAYA: rumah terjual → tumpukan uang hasil jual; tiap biaya (Agen, Administrasi, Lainnya) mengambil satu
 *  bundel dari atas tumpukan → tumpukan menyusut 6 → 3 */
const AdeganBiaya: React.FC<{ f: number }> = ({ f }) => {
  const keluar = R(f, V3.v4, V3.v4 + 40, 0, 1, io);
  if (keluar >= 0.999) return null;
  /* Simon 9 Okt: "panjang garis penghubung harus sama dan terpusat di icon" → tumpukan hasil jual = PUSAT; rumah masuk dari kiri,
   * tiga penerima di BUSUR kanan berjari-jari sama (−35° · 0° · 35°). Semua penghubung berangkat/tiba di lingkaran r 140 sekeliling
   * pusat tumpukan → empat garis sama panjang. ±35° (bukan ±40°): sinar bawah tetap ≥ 24 px dari bayangan iso tumpukan (terukur). */
  // R1 210 (dulu 140–150): pangkal panah di luar jejak susunan acuan (lembar depan-kanan sempat tertimpa panah bawah, terlihat di still)
  // RB 455 (dulu 480): rumah di lingkaran diperbesar (Simon 12 Okt) → susunan selebar 1440 px (wilayah aman); keempat garis tetap sama panjang
  const PUSAT = { x: 970, y: 540 }, W = 110, RB = 455, R1 = 210;
  // tumpukan Simon: kotak bundelnya berpusat di (x + 0,21 W, dasar − 0,5 W) → pusatnya = PUSAT
  const PILE = { x: PUSAT.x - 0.21 * W, dasar: PUSAT.y + 0.5 * W };
  // bundel yang diambil Agen · Administrasi · Lainnya = puncak tumpukan yang menghadap penerima: kanan-tengah (atas-kanan) · kanan-depan ·
  // depan (paling depan, digambar terakhir → lewat di depan tumpukan kanan-depan)
  const PERGI = [atasTumpukan(1), atasTumpukan(3), atasTumpukan(5)];
  const BIAYA = [48, 16, 16]; // juta: agen 3 % · administrasi 1 % · lainnya 1 % dari Rp1,6 M (ilustratif)
  const D_RUMAH = 294, HW_RUMAH = JARI_RUMAH * D_RUMAH; // rumah di lingkaran: foto 338 px (+30 %, dulu 260 tanpa lingkaran)
  const RUMAH = { x: PUSAT.x - (RB - 75 + HW_RUMAH), y: PUSAT.y }; // garis rumah→tumpukan = panjang sinar

  const diBusur = (sudut: number) => ({ x: PUSAT.x + Math.cos((sudut * Math.PI) / 180) * RB, y: PUSAT.y + Math.sin((sudut * Math.PI) / 180) * RB });
  const TUJUAN: { ikon: KunciIkon; teks: string; at: number; x: number; y: number }[] = [
    // `at` = berangkatnya bundel biaya = KATA-nya
    { ikon: 'agenProperti', teks: 'Agen', at: agen + 10, ...diBusur(-35) },
    { ikon: 'administrasi', teks: 'Administrasi', at: administrasi, ...diBusur(0) },
    { ikon: 'biayaTransaksi', teks: 'Lainnya', at: transaksi, ...diBusur(35) }, // "transaksi lainnya"
  ];
  const sinar = (t: { x: number; y: number }) => {
    const ux = t.x - PUSAT.x, uy = t.y - PUSAT.y, L = Math.hypot(ux, uy), r2 = L - 75 - GAP;
    return { x1: PUSAT.x + (ux / L) * R1, y1: PUSAT.y + (uy / L) * R1, x2: PUSAT.x + (ux / L) * r2, y2: PUSAT.y + (uy / L) * r2 };
  };
  const masuk = (i: number) => R(f, V3.buka + 26 + i, V3.buka + 46 + i, 0, 1, io); // bundel hasil jual (22, jenjang 1f) — BERSAMA rumah, sebelum biaya pertama
  // perjalanan bundel biaya ke penerimanya: kurva kuadrat dari muka atasnya di tumpukan, lewat pangkal sinar, lalu MENYUSURI sinar (garis
  // singgung akhir = arah panah) dan masuk ke BAWAH lingkaran penerima (lingkaran digambar sesudahnya → bundel tertelan)
  const jalan = (i: number) => {
    const t = TUJUAN[i], k = R(f, t.at + 10, t.at + 60, 0, 1, io), sn = sinar(t);
    const a = puncakUnit(PILE.x, PILE.dasar, W, PERGI[i]), c = { x: sn.x1, y: sn.y1 }, b = { x: t.x, y: t.y };
    return { k, dx: (1 - k) * (1 - k) * a.x + 2 * k * (1 - k) * c.x + k * k * b.x - a.x, dy: (1 - k) * (1 - k) * a.y + 2 * k * (1 - k) * c.y + k * k * b.y - a.y };
  };
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - keluar }}>
      <RumahLingkar x={RUMAH.x} cy={RUMAH.y} D={D_RUMAH} s={popIn(f, V3.buka + 30)} warna={LINGKAR_RUMAH.isi} wash={LINGKAR_RUMAH.wash} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <Konektor x1={RUMAH.x + HW_RUMAH + GAP} y1={RUMAH.y} x2={PUSAT.x - R1} y2={RUMAH.y} g={grow(f, V3.buka + 35)} col={B.orange} />
        {TUJUAN.map((t, i) => <Konektor key={i} {...sinar(t)} g={grow(f, t.at - 20)} col={[WARNA.biru, WARNA.langit, WARNA.ungu][i]} />)}
      </svg>
      {/* tumpukan hasil jual (tumpukan Simon): tiap biaya mengambil satu bundel. Bundel itu terbang DI DALAM tumpukan (tetap di urutan
          gambarnya, mengecil 0,73×) — dulu salinan terbang di atas tumpukan + silang-pudar 12f */}
      <TumpukanUang x={PILE.x} dasar={PILE.dasar} W={W} keadaan={(i) => {
        const ti = PERGI.indexOf(i);
        if (ti >= 0 && f > TUJUAN[ti].at + 10) { const j = jalan(ti); return j.k >= 1 ? { op: 0 } : { op: 1, dx: j.dx, dy: j.dy, s: lerp(1, 0.73, j.k) }; }
        const t = masuk(i); return { op: t, dy: -30 * (1 - t) };
      }} />
      {/* nominal: hasil jual Rp1,60 M berkurang tiap biaya diambil (agen Rp48 jt · administrasi Rp16 jt · lainnya Rp16 jt → Rp1,52 M) */}
      {(() => { const ambil = TUJUAN.reduce((a, t, i) => a + BIAYA[i] * R(f, t.at + 10, t.at + 60, 0, 1, io), 0);
        return <PilNominal x={PUSAT.x} y={PUSAT.y - 1.105 * W - 45} teks={rpMiliar(1.6 - ambil / 1000, 2)} arah={-R(ambil, 0, 20, 0, 1)} p={popIn(f, V3.buka + 40)} size={26} lebarMin={150} />; })()}
      {TUJUAN.map((t, i) => {
        return (
          <React.Fragment key={t.teks}>
            <Slot x={t.x} y={t.y} d={150} p={popIn(f, V3.buka + 34 + 8 * i)} op={slotOp(f, t.at - 20)} />
            {/* slot PIL biaya (putus-putus, ukuran pil terukur 176 × 50) bersama slot penerimanya: tapak V3 lengkap sejak sisipan membuka →
                kamera diam (dulu tiap pil biaya melebarkan susunan ke kanan, kamera menyusul: simpangan sampai +103 px, terukur) */}
            {(() => {
              const sp = popIn(f, V3.buka + 34 + 8 * i), op = Math.min(1, sp) * (1 - R(f, t.at + 30, t.at + 60, 0, 1, io));
              return op > 0.001 ? <div style={{ position: 'absolute', left: t.x + 75 + JARAK, top: t.y - 25, width: 176, height: 50, borderRadius: 999, border: `3px dashed ${B.grayLite}`, background: B.white, boxSizing: 'border-box', opacity: op, transform: `scale(${Math.min(0.99996, sp)})` }} /> : null;
            })()}
            <Lingkar x={t.x} y={t.y} d={150} col={[WARNA.biru, WARNA.langit, WARNA.ungu][i]} ikon={t.ikon} s={popIn(f, t.at - 20)} />
            <PilNominal x={t.x + 75 + JARAK} y={t.y} jangkar="kiri" teks={tanda(rpJuta(BIAYA[i]), false)} arah={-1} p={popIn(f, t.at + 50)} size={26} />
            <div style={{ position: 'absolute', left: t.x - 200, width: 400, top: t.y + 75 + JARAK, textAlign: 'center' }}>
              <WordText f={f} at={t.at - 10} halus style={{ fontFamily: F, fontSize: LABEL, fontWeight: 800, color: B.night }}>{t.teks}</WordText>
            </div>
          </React.Fragment>);
      })}
    </div>);
};

/** V4 — DIJUAL CEPAT: rumah + stopwatch; tumpukan harganya kehilangan dua bundel teratas (jatuh) → ▼ "Harga lebih rendah" */
const AdeganDijualCepat: React.FC<{ f: number }> = ({ f }) => {
  const masuk = R(f, V3.v4 + 20, V3.v4 + 80, 0, 1, io);
  if (masuk <= 0.001) return null;
  /* Simon 12 Okt (screenshot V4): "alignment belum benar, rumah dan uang seharusnya center tengah" → rumah (di lingkaran, foto 443 px,
   * +30 %) dan tumpukan uang SEBARIS di garis tengah y 496 (dulu pusat rumah 488 vs tumpukan 585), gabungan keduanya berpusat di x 960;
   * pil harga pindah ke ATAS tumpukan (dulu di kanannya → susunan berat ke kanan) */
  const D = 385, JR = JARI_RUMAH * D, W = 130, Y = 496, CELAH = 80; // celah 80 (bukan 100): pil harga di atas tumpukan tetap di luar zona logo saat zoom 1,35
  const kt0 = kotakTumpukan(0, 0, W), lebarT = kt0.x1 - kt0.x0, total = 2 * JR + CELAH + lebarT, kiri = 960 - total / 2;
  const RUMAH = { x: kiri + JR, y: Y };
  const PILE = tumpukanDiPusat(kiri + total - lebarT / 2, Y, W); // tumpukan Simon; puncak tumpukan depan & kanan-depan jatuh = harga turun
  const kt = kotakTumpukan(PILE.x, PILE.dasar, W);
  const JATUH_U = [atasTumpukan(5), atasTumpukan(3)];
  const T = A0('kadang', kadang) + 20; // dua bundel teratas jatuh
  const jatuh = (j: number) => R(f, T + (5 - j) * 8, T + 50 + (5 - j) * 8, 0, 1, io);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: masuk }}>
      <RumahLingkar x={RUMAH.x} cy={RUMAH.y} D={D} s={lerp(0.85, 1, masuk)} warna={LINGKAR_RUMAH.isi} wash={LINGKAR_RUMAH.wash} />
      <Lingkar x={RUMAH.x - JR * 0.707} y={RUMAH.y - JR * 0.707} d={104} col={B.blue} ikon="cepat" s={popIn(f, cepat) + denyutBanyak(f, [cepat + 30, cepat + 60, cepat + 90], 0.7)} />
      <TumpukanUang x={PILE.x} dasar={PILE.dasar} W={W} keadaan={(i) => {
        const t = R(f, V3.v4 + 26 + i, V3.v4 + 46 + i, 0, 1, io); // bersama rumah (22 bundel, jenjang 1f)
        const ji = JATUH_U.indexOf(i);
        if (ji >= 0) { const k = jatuh(5 - ji); return { op: t * (1 - k), dy: -30 * (1 - t) + k * 220 }; }
        return { op: t, dy: -30 * (1 - t) };
      }} />
      {/* Simon 9 Okt: NOMINAL yang berkurang — harga rumah turun saat dua bundel tumpukan jatuh (Rp1,6 M → Rp1,3 M); dulu lencana ▼ saja */}
      <PilNominal x={kt.cx} y={kt.y0 - 16 - 31} teks={rpMiliar(1.6 - 0.3 * (jatuh(5) + jatuh(4)) / 2)} arah={-(jatuh(5) + jatuh(4)) / 2} p={popIn(f, V3.v4 + 50)} lebarMin={196} />
      <HargaTurun x={960} y={Y + JR + 16 + 39} p={popIn(f, M('kadang', kadang) + 30)} pulse={denyut(f, rendah)} />
    </div>);
};

/** chip harga rumah turun (merah ▼) — teks lama dari diagram */
const HargaTurun: React.FC<{ x: number; y: number; p: number; pulse: number }> = ({ x, y, p, pulse }) => p <= 0.001 ? null : (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${p + pulse})`, display: 'flex', alignItems: 'center', gap: 14, background: B.white, border: `3px solid ${ARAH.turun}`, borderRadius: 999, padding: '8px 30px 8px 8px', fontFamily: F, fontSize: 34, fontWeight: 800, color: B.night, whiteSpace: 'nowrap', lineHeight: 1, boxShadow: `0 10px 24px -12px ${ARAH.turun}aa` }}>
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: B.orange, display: 'grid', placeItems: 'center' }}><Icon name="hargaRumah" size={38} color={B.white} /></div>
    <svg width={24} height={20} viewBox="0 0 22 18"><path d="M11 17 L21 1 L1 1 Z" fill={ARAH.turun} /></svg>
    Harga lebih rendah
  </div>);

export const S05_BEAT = { properti, punya, pertama, pendapatan, kedua, potensi, sendiri, artinya, sekaligus, naik, tapi, modal, dan, rumah, menekan, tombol, selain, ada, administrasi, dan2, kalau, kadang, rendah, cash };
