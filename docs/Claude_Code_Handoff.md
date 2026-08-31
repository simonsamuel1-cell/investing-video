# Prompt untuk Claude Code

Salin blok di bawah ini ke Claude Code setelah file-file di-commit ke `main`.

---

## Langkah 0 — sebelum menjalankan prompt

Taruh file di repo `investing-video`, branch `main`:

```
docs/core-library-plan.md      ← Core_Library_Inventory.md
src/core/                       ← 19 file
src/core/chart/                 ←  7 file
scripts/audit.mjs
scripts/audit-frames.mjs
scripts/srt-to-cues.mjs
docs/Video20_Volume_Script_SYNCED.md
assets/Volume_Sub_CORRECTED.srt
public/vo/volume.mp3            ← VO Video 20
```

Commit. Baru jalankan prompt di bawah.

---

## PROMPT

```
Baca docs/core-library-plan.md lebih dulu — itu hasil analisa 5 episode terakhir
dan menjelaskan kenapa src/core ada.

KONTEKS
Repo ini punya 7+ episode video Remotion, masing-masing di branch sendiri, dan
branch-branch itu tidak pernah merge. Akibatnya tidak ada kode yang terakumulasi:
SafeArea ditulis 4 versi, chart 6 versi, subtitle 4 versi, dan biaya per episode
naik dari 15 ke 154 commit dalam 6 minggu. src/core adalah perbaikannya.

src/core sudah lengkap dan sudah lolos tsc --strict dan scripts/audit.mjs.
JANGAN menulis ulang komponen core. Kalau sebuah scene butuh sesuatu yang belum
ada, TAMBAHKAN KE src/core — jangan pernah membuat salinan di folder episode.
Menyalin ke folder episode persis cara 4 SafeArea itu lahir.

TUGAS
Bangun ulang Video 20 (Volume) di atas src/core, sebagai episode pertama yang
membuktikan library ini. Target: episode jadi TANPA menulis satu komponen baru
pun di luar core.

STRUKTUR
  src/episodes/020-volume/
    Composition.tsx     from/durationInFrames per scene
    subtitles.ts        DIGENERATE, jangan diketik
    scenes/             import dari ../../../core
    data/               OHLCV / anchor / shape

ATURAN KERAS
1. 60 fps. Composition fps={60}, durationInFrames minimal 19592.
2. Angka frame per scene diambil dari docs/Video20_Volume_Script_SYNCED.md.
   Tabel di situ SUDAH 60 fps — jangan dikonversi lagi.
3. subtitles.ts digenerate:
     node scripts/srt-to-cues.mjs assets/Volume_Sub_CORRECTED.srt 60 \
       > src/episodes/020-volume/subtitles.ts
   Kalau ada yang salah, perbaiki SRT-nya lalu generate ulang. Jangan edit
   file hasil generate.
4. Komponen tidak boleh menulis angka frame. Durasi lewat useMotion().
5. Warna hanya dari theme/palette. Tidak ada hex literal.
6. candleGreen/candleRed hanya di core/chart/Candles.tsx.
7. Tidak ada marker beli/jual di mana pun. Ini batas kepatuhan OJK.
8. Chart yang bukan dari data pasar asli WAJIB bertag Ilustrasi lewat
   <SourceTag kind={series.kind} />. Jangan lepas tag secara manual —
   ganti sumbernya ke fromOHLC dan tagnya copot sendiri.
9. Band subtitle 108px bawah dan zona logo 360x150 kanan-atas harus kosong
   di setiap scene.
10. Satu chart dibawa lintas scene, jangan di-mount ulang. Scene 01 dan Scene 11
    memakai chart yang SAMA — Scene 11 narasinya memang "kita kembali ke
    breakout tadi".

DATA
- SC15A/15B butuh BRPT harian sekitar 30 Jun - 1 Jul 2026 sampai recovery ~1.750.
  Kalau ada CSV TradingView, pakai fromOHLC (paling presisi, dan bebas tag
  Ilustrasi). Kalau belum ada, pakai fromShape sementara dan tandai
  [NEEDS DATA: BRPT OHLCV] di kode. Jangan mengarang angka seolah data asli.
- Scene penjelas lain pakai fromShape (uptrend/downtrend/sideways).

TRANSISI — baca bagian ini di dokumen sync, jangan diabaikan
VO rekaman TIDAK punya ruang untuk kartu transisi: silence antar scene cuma
0,27-0,63 detik, dan di SC10 -> SC11 NOL detik. Kartu transisi dibuat overlay
yang menumpang di atas cut, window frame-nya sudah ada di dokumen. Kartu
KEY POINT 4-kombinasi TIDAK dibuat berdiri sendiri: tabelnya diisi bertahap
satu baris per scene di SC07-SC10, jadi saat cut ke Part 03 tabelnya sudah
lengkap. Dua cut jatuh di tengah kata (f6798 dan f8154) — hard cut, tanpa wipe.

VERIFIKASI — kerjakan, jangan dilewat
  npx tsc --noEmit
  node scripts/audit.mjs src          -> harus 0 pelanggaran di src/core dan src/episodes
  npx remotion still Volume020 out/scene01.png --frame=<awal tiap scene>
  node scripts/audit-frames.mjs out/  -> band subtitle & zona logo harus kosong
                                         (render dengan captions & watermark off)

Render satu still per scene, susun jadi grid, tunjukkan ke Simon sekaligus —
bukan satu per satu. Simon menolak lebih cepat kalau bisa melihat semuanya
dalam satu tatapan.

LAPORKAN
- Komponen apa saja yang HARUS ditambahkan ke core (kalau ada). Ini sinyal
  paling penting: kalau nol, core terbukti; kalau banyak, core kurang lengkap
  dan itu temuan yang berguna.
- Semua [NEEDS DATA] dan [NEEDS ASSET] dalam satu daftar di akhir.

JANGAN
- Jangan sentuh branch episode lain.
- Jangan migrasi episode lama dulu. Video 20 dulu, buktikan, baru yang lain.
- Jangan ubah src/core/theme.ts nama kuncinya. Menambah key boleh; mengganti
  nama key memutus semua episode sekaligus.
```

---

## Prompt lanjutan (setelah Video 20 jadi dan disetujui Simon)

```
Video 20 sudah jalan di atas src/core. Sekarang pindahkan repo ke satu branch.

1. Merge branch episode ke main sebagai folder, bukan branch:
   src/episodes/018-market-structure/, 019-moving-average/, dst.
2. Untuk tiap episode, ganti komponen lokalnya dengan import dari src/core.
   Verifikasi TIAP episode dengan render still sebelum dan sesudah — kalau ada
   frame yang bergeser, itu regresi dan harus dibereskan sebelum merge.
3. Hapus src/episodeMovingAverage2/ dan src/episodeChartMemory2/ (10.328 baris
   backup beku). Setelah semua di main, git yang jadi backup.
4. Episode lama dikonversi ke 60fps: generate ulang Composition.tsx dan
   subtitles.ts DARI MILIDETIK, jangan mengalikan angka 30fps dengan 2 —
   itu mewarisi pembulatannya.
5. scripts/audit.mjs harus 0 pelanggaran di seluruh src/ saat selesai.
   Baseline sekarang: 141 pelanggaran di 86 file.

Kerjakan satu episode per commit, jangan sekaligus.
```

---

## Alur kerja episode baru (setelah semua ini beres)

```
git checkout -b episode/021-topik

src/episodes/021-topik/
  Composition.tsx     dari dokumen sync
  subtitles.ts        node scripts/srt-to-cues.mjs <srt> 60 > ...
  scenes/             import { Stage, Chart, Chip, ... } from "../../../core"
  data/               CSV TradingView -> fromOHLC

node scripts/audit.mjs src        sebelum render
npx remotion render ...
git merge ke main                  <- ini yang bikin akumulasi
```

Aturan yang cuma Simon bisa tegakkan: butuh sesuatu yang belum ada di core →
**tambahkan ke core**, jangan tulis di folder episode.
