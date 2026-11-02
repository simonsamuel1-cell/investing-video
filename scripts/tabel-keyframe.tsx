// TABEL KEYFRAME JALAN & LARI (26 Okt, Simon: "aku ingin kamu memberikan contoh keyframe untuk membuat gerakan jalan dan lari dari salah
// satu char") — nilai Rotation per lapis (relatif induk, 0 = pose di tokoh gua.svg) + Position Y akar → markdown. Dibundel esbuild (cjs) lalu node.
import { writeFileSync } from 'node:fs';
import { JALAN, JALAN_FRAME, LARI, gaya, geserY, panjangSiklus } from '../src/flat/rigTegak';
import { SENDI_TEGAK as J } from '../src/flat/guaTegak.gen';

const KE = process.argv[2];
const S_ADEGAN = 0.82;
const n = (v: number) => (Math.abs(v) < 0.05 ? '0' : v.toFixed(1).replace('-', '−'));
const p2 = (q: number[]) => `${q[0].toFixed(1)}, ${q[1].toFixed(1)}`;
const baris: string[] = [];
const tulis = (s = '') => baris.push(s);

const blok = (judul: string, r: 0 | 1, N: number, kunci: number[]) => {
  tulis(`## ${judul} — 1 siklus = ${N.toFixed(1)} frame @60 fps (dibulatkan ${Math.round(N)}), maju ${panjangSiklus(r).toFixed(0)} px per siklus pada skala 100 %`);
  tulis();
  tulis('| # | frame | Badan | Pos Y | Kepala | Paha D | Betis D | Telapak D | Paha J | Betis J | Telapak J | L.atas D | L.bawah D | Tangan D | L.atas J | L.bawah J | Tangan J |');
  tulis('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  kunci.forEach((u, k) => {
    const p = gaya(u, r, 1);
    tulis(`| ${k + 1} | ${Math.round(u * N)} | ${n(p.badan)} | ${n(geserY(p))} | ${n(p.kepala)} | ${n(p.badan + p.paha[0])} | ${n(p.lutut[0])} | ${n(p.telapak[0])} | ${n(p.badan + p.paha[1])} | ${n(p.lutut[1])} | ${n(p.telapak[1])} | ${n(p.bahu[0])} | ${n(p.siku[0])} | ${n(p.tangan[0])} | ${n(p.bahu[1])} | ${n(p.siku[1])} | ${n(p.tangan[1])} |`);
  });
  tulis(`| 1 | ${Math.round(N)} | *(sama dengan kunci 1 — siklus berulang)* |`);
  tulis();
};

tulis('# Contoh keyframe jalan & lari — tokoh gua, pose dasar berdiri tegak (`tokoh-gua_tegak.svg`)');
tulis();
tulis('Pasangan lembar `Contoh-Keyframe_Jalan-Lari.png` (angkanya sama). Nilai = **Rotation tiap lapis**, dengan **0° = pose dasar berdiri tegak** di `karakter-flat/tokoh-gua_tegak.svg` (semua ruas tegak lurus, lingkaran sendi di garis guide). Pecah file itu per lapis di AE, pasang parent & titik jangkar seperti di bawah, lalu ketik angkanya langsung.');
tulis();
tulis('## Susunan lapis (parent) & titik jangkar');
tulis();
tulis('Titik jangkar = **pusat lingkaran sendi** = titik potong garis guide (koordinat artboard `tokoh-gua_tegak.svg`, px). D = sisi dekat (kiri layar, lengan di depan tunik), J = sisi jauh.');
tulis();
tulis('| Lapis | Parent | Jangkar D | Jangkar J |');
tulis('|---|---|---|---|');
const akar = [(J.pinggul[0][0] + J.pinggul[1][0]) / 2, J.pinggul[0][1]];
tulis(`| Badan (+ tunik, panggul) | — (akar) | tengah pinggul ${p2(akar)} | |`);
tulis(`| Kepala | Badan | leher ${p2(J.leher)} | |`);
tulis(`| Pinggul (null) | Badan, **hanya Position** (pick-whip Position, bukan parent) | ${p2(akar)} | |`);
tulis(`| Paha | Pinggul | ${p2(J.pinggul[0])} | ${p2(J.pinggul[1])} |`);
tulis(`| Betis | Paha | ${p2(J.lutut[0])} | ${p2(J.lutut[1])} |`);
tulis(`| Telapak (+ alas) | Betis | ${p2(J.pkaki[0])} | ${p2(J.pkaki[1])} |`);
tulis(`| Lengan atas | Badan | ${p2(J.bahu[0])} | ${p2(J.bahu[1])} |`);
tulis(`| Lengan bawah | Lengan atas | ${p2(J.siku[0])} | ${p2(J.siku[1])} |`);
tulis(`| Tangan | Lengan bawah | ${p2(J.perg[0])} | ${p2(J.perg[1])} |`);
tulis();
tulis('Kaki **tidak ikut putaran badan**: dua pangkal paha berjarak 36 px mendatar, jadi kalau ikut condong badan (13° saat lari) satu pinggul turun & yang lain naik → pincang. Karena itu paha di-parent ke null *Pinggul* yang hanya mengikuti Position badan, dan kolom **Paha = Rotation total** (condong badan sudah termasuk). Tidak perlu koreksi skala/geser kaki lagi: di pose tegak kedua kaki sudah sama panjang di garis guide.');
tulis();
tulis('**Pos Y** = naik-turun lapis Badan (akar) dari posisi berdiri, px pada skala 100 %, + = turun. Position X maju lurus dengan laju tetap (lihat "maju … px per siklus"); jangan di-ease — kaki tumpu baru diam di tanah kalau badan maju rata.');
tulis();
blok('JALAN', 0, JALAN_FRAME, JALAN.map((k) => k[0]));
blok('LARI', 1, (panjangSiklus(1) * S_ADEGAN) / 8.4, LARI.map((k) => k[0]));
tulis('## Cara pakai di AE');
tulis();
tulis('1. Ketik kunci 1–8 di frame yang tertulis, lalu salin kunci 1 ke frame akhir siklus. Seleksi semua kunci → **Keyframe Interpolation: Temporal = Auto Bezier** (atau Continuous Bezier). **Jangan Easy Ease** di tiap kunci: gerak berhenti sejenak di setiap kunci → terlihat patah-patah.');
tulis('2. Ulangi siklus dengan expression `loopOut("cycle")` di semua properti yang di-key.');
tulis('3. Lari: kunci 3 → 5 adalah fase melayang (kedua kaki di udara); Pos Y di tabel sudah berupa lengkung naik-turun, jadi cukup diketik.');
tulis('4. Lengan (jalan & lari) BERANTAI: lengan atas memimpin, lengan bawah tertinggal ±5 frame (jalan) / ±3 frame (lari), tangan tertinggal lagi dari lengan bawah — jadi puncak tiap kolom lengan jatuh di kunci yang berbeda. Jangan disamakan waktunya: justru beda waktu itu yang membuat lengan tidak kaku. Angka lengan di tabel = sampel lengkung ayunan di frame kunci; Auto Bezier di antaranya sudah mendekati lengkung aslinya.');
tulis(`5. Jalan = ${JALAN_FRAME} frame per siklus, kunci tiap 9 frame (8 pose); lari = laju 8,4 px/frame pada skala ${S_ADEGAN}. Untuk skala lain: frame tetap, jarak maju dikali skala.`);
tulis();
tulis('Sumber angka: `src/flat/rigTegak.tsx` (`JALAN`, `LARI`, `lenganBerantai()`, `gaya()`); tabel dibangkitkan `scripts/tabel-keyframe.tsx`.');
writeFileSync(KE, baris.join('\n') + '\n');
console.log('tulis', KE, baris.length, 'baris');
