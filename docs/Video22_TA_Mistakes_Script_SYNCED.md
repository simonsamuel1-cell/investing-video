# VIDEO 22 — COMMON MISTAKES IN TECHNICAL ANALYSIS
## Script re-timed against the recorded VO

**Source of timing:** `TA_Mistakes_Sub_FIXED.srt` (Premiere STT, dikoreksi Simon) → `assets/TA_Mistakes_Sub_CORRECTED.srt`
**VO file:** `Common Mistake VO_FINAL.MP3` — durasi audio terukur **277.107 s (04:37.107)**
**VO length (SRT):** 00:04:37.000 · **16,620 frames @ 60 fps** · recommended comp length **16,800 f** (04:40.000 — 180 f / 3.0 s tail untuk menahan quote card penutup)
**Episode folder:** `src/episodes/022-ta-mistakes/` · fps **60**

**Tidak ada file script asli (.docx) di folder VIDEO 22**, jadi tidak ada estimasi lama yang bisa dibandingkan. Yang berlaku hanya tabel di bawah ini — semuanya dihitung dari milidetik SRT, bukan dari perkiraan.

Dua timing diberikan per scene:
- **VO** — kata pertama masuk / kata terakhir keluar, langsung dari SRT terkoreksi.
- **BLOCK** — blok scene yang kontinu, dipotong di **titik tengah keheningan** antar scene. Blok bertemu ujung-ke-ujung tanpa celah, jadi timeline utuh dari f0 sampai f16620.

---

## Master timing table

`node scripts/scene-table.mjs assets/TA_Mistakes_Sub_CORRECTED.srt 60 --breaks 4,7,10,14,19,23,28,33,37,41,46,51,57,60,63,71,75 --cards 4,6,8,12,14,18`

| Scene | BLOCK (frames) | BLOCK (tc) | Dur | VO in – VO out | SRT cues | Part |
|---|---|---|---|---|---|---|
| SC01 | 0 – 646 | 00:00.000 – 00:10.766 | 10.77 s | 00:00.200 – 00:10.366 | 1–3 | cold open |
| SC02 | 646 – 1140 | 00:10.766 – 00:19.000 | 8.23 s | 00:11.166 – 00:18.866 | 4–6 | cold open |
| SC03 | 1140 – 1995 | 00:19.000 – 00:33.250 | 14.25 s | 00:19.133 – 00:32.900 | 7–9 | premis |
| SC04 | 1995 – 3084 | 00:33.250 – 00:51.400 | 18.15 s | 00:33.600 – 00:51.266 | 10–13 | 01 |
| SC05 | 3084 – 4047 | 00:51.400 – 01:07.450 | 16.05 s | 00:51.533 – 01:07.300 | 14–18 | 01 |
| SC06 | 4047 – 5031 | 01:07.450 – 01:23.850 | 16.40 s | 01:07.600 – 01:23.700 | 19–22 | 02 |
| SC07 | 5031 – 5954 | 01:23.850 – 01:39.233 | 15.38 s | 01:24.000 – 01:39.066 | 23–27 | 02 |
| SC08 | 5954 – 7034 | 01:39.233 – 01:57.233 | 18.00 s | 01:39.400 – 01:57.066 | 28–32 | 03 |
| SC09 | 7034 – 7965 | 01:57.233 – 02:12.750 | 15.52 s | 01:57.400 – 02:12.400 | 33–36 | 03 |
| SC10 | 7965 – 8968 | 02:12.750 – 02:29.466 | 16.72 s | 02:13.100 – 02:29.266 | 37–40 | 03 |
| SC11 | 8968 – 10005 | 02:29.466 – 02:46.750 | 17.28 s | 02:29.666 – 02:46.333 | 41–45 | 03 |
| SC12 | 10005 – 11044 | 02:46.750 – 03:04.066 | 17.32 s | 02:47.166 – 03:03.966 | 46–50 | 04 |
| SC13 | 11044 – 12316 | 03:04.066 – 03:25.266 | 21.20 s | 03:04.166 – 03:24.966 | 51–56 | 04 |
| SC14 | 12316 – 13040 | 03:25.266 – 03:37.333 | 12.07 s | 03:25.566 – 03:37.100 | 57–59 | 05 |
| SC15 | 13040 – 13670 | 03:37.333 – 03:47.833 | 10.50 s | 03:37.566 – 03:47.666 | 60–62 | 05 |
| SC16 | 13670 – 14750 | 03:47.833 – 04:05.833 | 18.00 s | 03:48.000 – 04:05.533 | 63–70 | 05 |
| SC17 | 14750 – 15724 | 04:05.833 – 04:22.066 | 16.23 s | 04:06.133 – 04:21.866 | 71–74 | 05 |
| SC18 | 15724 – 16620 | 04:22.066 – 04:37.000 | 14.93 s | 04:22.266 – 04:37.000 | 75–80 | close |

**18 scene. Tidak ada satu pun batas scene yang jatuh di tengah cue** — join tersempit adalah SC05 → SC06 dengan 0.30 s udara. Ini kabar bagus dibanding VIDEO 20, yang punya dua potongan mid-word.

**Empat join tanpa keheningan sama sekali — semuanya JATUH DI DALAM scene, bukan di batas scene:**

| Join | Di | Ada di dalam | Artinya |
|---|---|---|---|
| cue 1 → 2 | 00:03.778 · f227 | SC01 | "…kelihatannya lengkap." langsung "Trend naik," — beat visual harus nyambung, tanpa jeda |
| cue 21 → 22 | 01:21.667 · f4900 | SC06 | "…trade yang layak." langsung "Tidak trading, juga keputusan." — kalimat penutup SC06 mendarat keras |
| cue 31 → 32 | 01:55.275 · f6917 | SC08 | "…membuktikan aku salah?" langsung "Ini membantu tetap objektif." |
| cue 57 → 58 | 03:28.270 · f12496 | SC14 | "…copy trade orang lain." langsung "Sahamnya mungkin sama," |

Tidak ada transition card yang terhalang oleh keempatnya. **Tidak ada wipe di antara scene** — hard cut atau CameraCut saja.

---

## Transition cards — semua enam muat, VO tidak perlu disentuh

Keheningan nyata di setiap titik kartu:

| Card | Sits between | Real silence available |
|---|---|---|
| LEARNING ROADMAP | SC03 → SC04 | **0.70 s** |
| CHAPTER 02 | SC05 → SC06 | **0.30 s** |
| CHAPTER 03 | SC07 → SC08 | **0.33 s** |
| CHAPTER 04 | SC11 → SC12 | **0.83 s** ← keheningan terpanjang di seluruh rekaman |
| CHAPTER 05 | SC13 → SC14 | **0.60 s** |
| FINAL RECAP | SC17 → SC18 | **0.40 s** |

**Applied default — VO tetap utuh, kartu naik di atas potongan.** Tiap kartu adalah overlay full-frame yang mulai **36 f sebelum** kata terakhir scene keluar dan bersih **36 f setelah** kata pertama scene berikutnya masuk. Scene yang keluar sudah selesai bicara di titik itu, jadi tidak ada yang hilang.

| Card | Overlay window (frames) | Length |
|---|---|---|
| LEARNING ROADMAP | 1938 – 2052 | 114 f / 1.90 s |
| CHAPTER 02 | 4002 – 4092 | 90 f / 1.50 s |
| CHAPTER 03 | 5908 – 6000 | 92 f / 1.53 s |
| CHAPTER 04 | 9944 – 10066 | 122 f / 2.03 s |
| CHAPTER 05 | 12262 – 12370 | 108 f / 1.80 s |
| FINAL RECAP | 15676 – 15772 | 96 f / 1.60 s |

Tidak ada kartu yang perlu dilipat ke dalam scene, dan **VO tidak perlu di-pad**. Kalau nanti Simon mau setiap kartu berdiri penuh di keheningan (bukan menumpang potongan), harganya ~1.0 s silence insert per titik → runtime naik ke ~04:43 dan **seluruh angka frame di dokumen ini bergeser**. Bilang saja, tabelnya saya generate ulang dari VO yang sudah di-recut.

---

## Chapters

Lima part, verb-first, plus cold open dan close di luar roadmap:

| Part | Nama di roadmap | Scenes | Isi |
|---|---|---|---|
| — | (cold open) | SC01–SC02 | setup lengkap → harga berbalik → "TA-nya gagal?" |
| — | (premis) | SC03 | probabilitas, bukan kepastian |
| **01** | **Tentukan Invalidation** | SC04–SC05 | masuk tanpa tahu kapan analisis salah; harapan setelah entry |
| **02** | **Kendalikan Emosi** | SC06–SC07 | overtrading; revenge trading |
| **03** | **Jaga Objektivitas** | SC08–SC11 | confirmation bias; konteks market; indicator overload; hindsight bias |
| **04** | **Uji Skenario di Chart** | SC12–SC13 | studi kasus ADMR — skenario yang berubah karena buktinya berubah |
| **05** | **Jalankan Prosesmu** | SC14–SC18 | asal copy trade; checklist sebelum entry; cek diri sendiri; rule penutup |

Delapan kesalahan diberi nomor dan **satu counter chip dipakai ulang** (lihat CG-E), bukan judul baru tiap scene:

01 TANPA INVALIDATION (SC04) · 02 OVERTRADING (SC06) · 03 REVENGE TRADING (SC07) · 04 CONFIRMATION BIAS (SC08) · 05 ABAI KONTEKS MARKET (SC09) · 06 INDICATOR OVERLOAD (SC10) · 07 HINDSIGHT BIAS (SC11) · 08 ASAL COPY TRADE (SC14)

---

# SCENES

## COLD OPEN

### SCENE 01 — f0–646 · 00:00.000–00:10.766 · **10.77 s**
**NARRATION** (VO 00:00.200–00:10.366)
Bayangin kamu sudah menemukan setup yang kelihatannya lengkap.
Trend naik, support bertahan, volume menguat, lalu breakout terjadi.
Kamu masuk dengan yakin.

**Beat anchors**
- "setup yang kelihatannya lengkap" — 00:01.98 · **f119**
- "Trend naik," — 00:03.78 · **f227** ⚠ tidak ada keheningan sebelum ini
- "support bertahan," — 00:04.92 · **f295**
- "volume menguat," — 00:06.03 · **f362**
- "lalu breakout terjadi." — 00:07.73 · **f464**
- "Kamu masuk dengan yakin." — 00:09.20 · **f552**

**VISUAL**
Candlestick tape ilustrasi + volume pane (CG-A — tape ini dipakai lagi di SC02, SC04, SC05).
Empat chip checklist mendarat satu per beat di kiri, masing-masing dengan ✓:
TREND ↑ · SUPPORT BERTAHAN · VOLUME MENGUAT · BREAKOUT
Di f464 candle terakhir close di atas garis resistance, garis resistance restyle jadi putus-putus.
Di f552 tombol `BUY` muncul dan langsung "tertekan" → berubah jadi chip status `POSISI TERBUKA` di kiri-atas. **Tidak ada panah entry, tidak ada target harga.**
Akhiri: **SETUP TERLIHAT LENGKAP**

---

### SCENE 02 — f646–1140 · 00:10.766–00:19.000 · **8.23 s**
**NARRATION** (VO 00:11.166–00:18.866)
Tapi beberapa candle kemudian, harga justru berbalik turun.
Apa berarti Technical Analysis-nya gagal?
Belum tentu.

**Beat anchors**
- "Tapi beberapa candle kemudian," — 00:11.17 · **f670**
- "harga justru berbalik turun." — 00:13.97 · **f838**
- "Apa berarti Technical Analysis-nya gagal?" — 00:15.47 · **f928**
- "Belum tentu." — 00:18.07 · **f1084**

**VISUAL**
Tape yang sama lanjut jalan (CG-A) — tiga candle setelah breakout balik turun, menembus kembali ke bawah resistance.
Di f838 keempat chip ✓ dari SC01 memudar jadi abu; chip `POSISI TERBUKA` ikut redup.
Di f928 teks besar naik di tengah: **TA-NYA GAGAL?**
Di f1084 teks itu diganti (fade + rise, bukan pop): **BELUM TENTU.**
Akhiri: chart tinggal siluet di belakang teks.

---

## PREMIS

### SCENE 03 — f1140–1995 · 00:19.000–00:33.250 · **14.25 s**
**NARRATION** (VO 00:19.133–00:32.900)
Intinya: Technical Analysis bekerja dengan probabilitas, bukan kepastian.
Setup yang bagus membantu meningkatkan kualitas keputusan di pasar yang bergerak cepat, tapi tidak pernah menjamin hasil.
Setup lengkap tetap bisa gagal.

**Beat anchors**
- "Intinya:" — 00:19.13 · **f1148**
- "probabilitas, bukan kepastian." — 00:22.05 · **f1323**
- "Setup yang bagus" — 00:24.33 · **f1460**
- "meningkatkan kualitas keputusan" — 00:25.68 · **f1541**
- "tidak pernah menjamin hasil." — 00:29.42 · **f1765**
- "Setup lengkap tetap bisa gagal." — 00:30.80 · **f1848**

**VISUAL**
Chart keluar (fade + geser turun). Split comparison — SATU objek dibelah dua, bukan dua scene:
kiri **PROBABILITAS** · kanan **KEPASTIAN** (kanan digambar dengan strike, tone netral)
Di f1541 pane kiri terisi: `SETUP BAGUS → KUALITAS KEPUTUSAN NAIK`
Di f1765 pane kanan terisi: `≠ JAMINAN HASIL`
**Jangan tampilkan angka probabilitas, win-rate, atau skor apa pun** — pembelahan frame-nya sendiri yang jadi argumen.
Akhiri, satu baris di tengah: **SETUP LENGKAP TETAP BISA GAGAL.**

**→ LEARNING ROADMAP overlay f1938–2052** (114 f)
`TA — COMMON MISTAKES` · 01 Tentukan Invalidation ● / 02 Kendalikan Emosi / 03 Jaga Objektivitas / 04 Uji Skenario di Chart / 05 Jalankan Prosesmu. Part 01 menyala, sisanya redup. Objek roadmap ini dipakai ulang di setiap chapter card dan kembali all-✓ di SC18 (CG-D).

---

## PART 01 — TENTUKAN INVALIDATION

### SCENE 04 — f1995–3084 · 00:33.250–00:51.400 · **18.15 s**
**NARRATION** (VO 00:33.600–00:51.266)
Kita mulai dari kesalahan paling berbahaya: masuk tanpa tahu kapan analisis dianggap salah.
Misalnya kamu beli karena support bertahan.
Kalau harga breakdown dan close di bawah support, alasan utama trade itu mulai tidak berlaku.
Setup mulai invalid.

**Beat anchors**
- "kesalahan paling berbahaya:" — 00:35.38 · **f2123**
- "masuk tanpa tahu kapan analisis dianggap salah." — 00:36.28 · **f2177**
- "Misalnya kamu beli karena support bertahan." — 00:39.87 · **f2392**
- "close di bawah support," — 00:46.50 · **f2790**
- "alasan utama trade itu mulai tidak berlaku." — 00:46.83 · **f2810**
- "Setup mulai invalid." — 00:49.60 · **f2976**

**VISUAL**
Counter chip mendarat di kiri-atas, merah hanya pada kata kesalahannya (CG-E): `MISTAKE 01 — TANPA INVALIDATION`
Tape CG-A kembali, di-reframe ke area support yang beberapa kali bertahan. Garis level `SUPPORT` digambar di f2392.
Di f2790 candle close **di bawah** garis itu → garis **restyle** (solid → putus-putus, tone netral), bukan digambar ulang.
Di f2810 chip alasan yang tadinya ✓ berubah jadi strike: ~~SUPPORT BERTAHAN~~ → `ALASAN UTAMA TRADE TIDAK BERLAKU`
Akhiri: **SETUP MULAI INVALID.**

---

### SCENE 05 — f3084–4047 · 00:51.400–01:07.450 · **16.05 s**
**NARRATION** (VO 00:51.533–01:07.300)
Masalahnya, setelah entry kita sering mulai berharap.
“Sedikit lagi.”
“Mungkin nanti balik.”
Karena itu, tentukan invalidation sebelum entry, bukan setelah posisi mulai rugi.
Sejak awal kamu sudah tahu kapan skenario tidak lagi sesuai rencana.

**Beat anchors**
- "kita sering mulai berharap." — 00:54.08 · **f3245**
- **“Sedikit lagi.”** — 00:55.13 · **f3308**
- **“Mungkin nanti balik.”** — 00:56.27 · **f3376**
- "tentukan invalidation" — 00:58.72 · **f3523**
- "sebelum entry," — 00:59.75 · **f3585**
- "bukan setelah posisi mulai rugi." — 01:00.77 · **f3646**
- "Sejak awal kamu sudah tahu" — 01:03.80 · **f3828**

**VISUAL**
Chart meredup jadi latar. Dua speech-bubble chip naik berurutan, **teks persis seperti tertulis, termasuk tanda kutip lengkung:**
“Sedikit lagi.”
“Mungkin nanti balik.”
Di f3523 keduanya fade, digantikan step rail dua baris:
`SEBELUM ENTRY → tentukan invalidation` ✓ (menyala di f3585)
`SETELAH POSISI RUGI → cari alasan` ✗ (strike di f3646)
Di f3828 satu garis vertikal putus-putus mendarat di chart yang redup, label `INVALIDATION` — ditaruh **sebelum** candle entry, menegaskan urutannya.
Akhiri: **INVALIDATION DITENTUKAN SEBELUM ENTRY.**

**→ CHAPTER 02 overlay f4002–4092** (90 f)
`02 KENDALIKAN EMOSI` · roadmap: part 01 ✓, part 02 menyala.

---

## PART 02 — KENDALIKAN EMOSI

### SCENE 06 — f4047–5031 · 01:07.450–01:23.850 · **16.40 s**
**NARRATION** (VO 01:07.600–01:23.700)
Kesalahan berikutnya datang dari diri kita.
Overtrading terjadi saat kita merasa harus selalu punya posisi.
Padahal kalau trend belum jelas, level belum menarik, atau trigger belum muncul, belum tentu ada trade yang layak.
Tidak trading, juga keputusan.

**Beat anchors**
- "datang dari diri kita." — 01:08.38 · **f4103**
- "Overtrading" — 01:10.50 · **f4230**
- "harus selalu punya posisi." — 01:12.48 · **f4349**
- "trend belum jelas," — 01:15.57 · **f4534**
- "level belum menarik," — 01:16.70 · **f4602**
- "trigger belum muncul," — 01:18.23 · **f4694**
- **"Tidak trading, juga keputusan."** — 01:21.67 · **f4900**

> ⚠ **f4900 tidak punya udara sama sekali** (cue 21 → 22 bersambung langsung). Kalimat penutup ini harus sudah siap di frame itu — jangan pakai animasi masuk yang butuh lebih dari ~10 f, dan jangan taruh jeda visual sebelumnya.

**VISUAL**
Counter (CG-E) berganti: `MISTAKE 02 — OVERTRADING`
Rolling list: entri-entri kecil menumpuk cepat di sisi kanan, satu demi satu, sampai penuh dan berantakan — ilustrasi "harus selalu punya posisi".
Di f4534 / f4602 / f4694 tiga chip kondisi mendarat **tepat di kata masing-masing**, semuanya ✗:
TREND BELUM JELAS · LEVEL BELUM MENARIK · TRIGGER BELUM MUNCUL
Di f4900 seluruh tumpukan entri hilang sekaligus dan tinggal satu baris besar:
Akhiri: **TIDAK TRADING, JUGA KEPUTUSAN.**

---

### SCENE 07 — f5031–5954 · 01:23.850–01:39.233 · **15.38 s**
**NARRATION** (VO 01:24.000–01:39.066)
Lalu ada revenge trading.
Setelah loss, kita ingin cepat mengembalikan kerugian dan buru-buru masuk lagi.
Padahal loss sebelumnya tidak membuat setup berikutnya lebih valid.
Kalau belum ada setup, jawabannya tetap: jangan trade.
Setiap trade baru harus memenuhi aturan yang sama.

**Beat anchors**
- "revenge trading." — 01:24.85 · **f5091**
- "Setelah loss," — 01:25.93 · **f5156**
- "buru-buru masuk lagi." — 01:28.75 · **f5325**
- "tidak membuat setup berikutnya lebih valid." — 01:32.07 · **f5524**
- "jawabannya tetap: jangan trade." — 01:35.68 · **f5741**
- "Setiap trade baru harus memenuhi aturan yang sama." — 01:36.57 · **f5794**

**VISUAL**
Counter (CG-E): `MISTAKE 03 — REVENGE TRADING`
Chip `LOSS` mendarat di kiri (f5156), lalu sebuah panah melengkung langsung balik ke chip `TRADE BERIKUTNYA` (f5325) — cepat, tanpa jeda, itulah poinnya.
Di f5524 panah itu **dipotong silang**: `LOSS SEBELUMNYA ✗→ SETUP BERIKUTNYA`, dengan caption `TIDAK MEMBUAT LEBIH VALID`.
Di f5741 muncul jawaban tegas di tengah: **BELUM ADA SETUP → JANGAN TRADE**
Di f5794 satu gerbang/aturan yang sama muncul di atas kedua trade — bukan dua aturan.
Akhiri: **SETIAP TRADE BARU = ATURAN YANG SAMA.**

**→ CHAPTER 03 overlay f5908–6000** (92 f)
`03 JAGA OBJEKTIVITAS` · roadmap: part 01–02 ✓, part 03 menyala.

---

## PART 03 — JAGA OBJEKTIVITAS

### SCENE 08 — f5954–7034 · 01:39.233–01:57.233 · **18.00 s**
**NARRATION** (VO 01:39.400–01:57.066)
Kesalahan berikutnya adalah confirmation bias.
Kita terlalu fokus pada hal yang mendukung skenario, lalu mengabaikan informasi yang berlawanan.
Jangan cuma bertanya: “Apa yang membuat analisisku benar?”
Tanya juga: “Apa yang bisa membuktikan aku salah?”
Ini membantu tetap objektif.

**Beat anchors**
- "confirmation bias." — 01:41.03 · **f6062**
- "hal yang mendukung skenario," — 01:45.42 · **f6325**
- "mengabaikan informasi yang berlawanan." — 01:46.82 · **f6409**
- **“Apa yang membuat analisisku benar?”** — 01:50.32 · **f6619**
- **“Apa yang bisa membuktikan aku salah?”** — 01:53.12 · **f6787**
- "Ini membantu tetap objektif." — 01:55.28 · **f6917** ⚠ tanpa udara

**VISUAL**
Counter (CG-E): `MISTAKE 04 — CONFIRMATION BIAS`
Chart ilustrasi dengan enam penanda bukti tersebar. Di f6325 sebuah highlight box tumbuh dan hanya memuat tiga penanda yang **mendukung**; di f6409 tiga penanda **berlawanan** di luar kotak memudar sampai hampir hilang — penonton melihat sendiri apa yang diabaikan.
Di f6619 quote card kiri naik: “Apa yang membuat analisisku benar?” (tone netral)
Di f6787 quote card kanan naik dan **menyala**: “Apa yang bisa membuktikan aku salah?”
Di f6917 highlight box collapse, ketiga penanda berlawanan menyala kembali penuh.
Akhiri: **TANYA JUGA: APA YANG BISA MEMBUKTIKAN AKU SALAH?**

---

### SCENE 09 — f7034–7965 · 01:57.233–02:12.750 · **15.52 s**
**NARRATION** (VO 01:57.400–02:12.400)
Kondisi market juga penting.
Setup yang berjalan baik saat market trending bisa lebih sering gagal saat market sideways atau mulai melemah.
Setup-nya bisa sama, tapi konteksnya berbeda.
Jadi jangan membaca chart tanpa melihat market yang lebih luas.

**Beat anchors**
- "Kondisi market juga penting." — 01:57.40 · **f7044**
- "saat market trending" — 02:01.63 · **f7298**
- "bisa lebih sering gagal" — 02:03.05 · **f7383**
- "market sideways atau mulai melemah." — 02:04.12 · **f7447**
- "Setup-nya bisa sama, tapi konteksnya berbeda." — 02:05.90 · **f7554**
- "melihat market yang lebih luas." — 02:08.87 · **f7732**

**VISUAL**
Counter (CG-E): `MISTAKE 05 — ABAI KONTEKS MARKET`
Product-page pair — dua window berdampingan, **setup yang identik** di keduanya (tape yang sama persis, digambar dua kali dengan konteks berbeda di atasnya):
window kiri, header `MARKET TRENDING` — garis market luas naik di strip atas; setup jalan
window kanan, header `MARKET SIDEWAYS / MELEMAH` — garis market luas datar lalu turun; setup yang sama gagal
Di f7554 sebuah garis penghubung digambar antara kedua setup dengan label `SETUP-NYA SAMA`, dan kedua strip konteks di atas disorot dengan label `KONTEKSNYA BEDA`.
Di f7732 kamera zoom out sedikit sehingga strip market luas jadi kelihatan membingkai keduanya.
Akhiri: **SETUP SAMA, KONTEKS BEDA.**

---

### SCENE 10 — f7965–8968 · 02:12.750–02:29.466 · **16.72 s**
**NARRATION** (VO 02:13.100–02:29.266)
Jangan terjebak indicator overload.
Menambahkan banyak indikator tidak selalu menambah kualitas analisis.
Kalau beberapa indikator membaca hal yang mirip, kamu mungkin hanya melihat pesan yang sama dalam bentuk berbeda.
Lebih banyak indikator belum tentu berarti lebih banyak insight.

**Beat anchors**
- "indicator overload." — 02:14.08 · **f8045**
- "Menambahkan banyak indikator" — 02:15.20 · **f8112**
- "tidak selalu menambah kualitas analisis." — 02:18.05 · **f8283**
- "membaca hal yang mirip," — 02:20.83 · **f8450**
- "pesan yang sama dalam bentuk berbeda." — 02:23.40 · **f8604**
- "Lebih banyak indikator belum tentu berarti lebih banyak insight." — 02:25.57 · **f8734**

**VISUAL**
Counter (CG-E): `MISTAKE 06 — INDICATOR OVERLOAD`
Chart mulai bersih (harga saja). Dari f8112 sampai f8283 pane indikator ditambahkan satu per satu di bawahnya sampai area chart terjepit dan hampir tidak terbaca — pertambahannya sendiri yang jadi argumen. **Jangan masuk ke 108 px bawah** (band subtitle); kalau tumpukannya tidak muat, kecilkan pane, jangan geser ke bawah.
Di f8450 tiga pane menyala bersamaan, sisanya redup.
Di f8604 ketiganya **collapse jadi satu label**: `SAMA-SAMA MOMENTUM`, dan chart kembali lega.
Akhiri: **LEBIH BANYAK INDIKATOR ≠ LEBIH BANYAK INSIGHT.**
`[NEEDS DECISION: pane-nya dinamai konkret (mis. RSI / Stochastic / MACD histogram) atau generik (INDIKATOR A/B/C)? Nama konkret lebih jelas mengajarkan, tapi menyebut indikator tertentu — konfirmasi ke Simon.]`

---

### SCENE 11 — f8968–10005 · 02:29.466–02:46.750 · **17.28 s**
**NARRATION** (VO 02:29.666–02:46.333)
Ada juga hindsight bias.
Setelah harga bergerak, chart sering terlihat sangat jelas.
Padahal saat candle itu belum terbentuk, kita belum tahu apa yang terjadi berikutnya.
Jadi jangan nilai keputusan hanya dari hasil akhir.
Lihat juga apakah prosesnya sudah benar.

**Beat anchors**
- "hindsight bias." — 02:30.82 · **f9049**
- "chart sering terlihat sangat jelas." — 02:32.33 · **f9140**
- "saat candle itu belum terbentuk," — 02:36.07 · **f9364**
- "kita belum tahu apa yang terjadi berikutnya." — 02:37.53 · **f9452**
- "jangan nilai keputusan hanya dari hasil akhir." — 02:40.70 · **f9642**
- "Lihat juga apakah prosesnya sudah benar." — 02:44.07 · **f9844**

**VISUAL**
Counter (CG-E): `MISTAKE 07 — HINDSIGHT BIAS`
Chart ilustrasi **penuh** langsung tampil dengan pembacaan "ya jelas dong": trendline, level, panah pergerakan — semuanya rapi (f9140).
Di f9364 **reveal mask bergerak mundur dari kanan ke kiri** — kebalikan dari quiz biasa: masa depan ditutup lagi, anotasi yang ada di area tertutup ikut hilang. Yang tersisa cuma chart yang ambigu.
Di f9452 satu kalimat kecil di sisi kanan area tertutup: `DI SINI, KITA BELUM TAHU.`
Di f9642 dua chip naik: `HASIL` (redup) vs `PROSES` (menyala).
Akhiri: **NILAI PROSESNYA, BUKAN HANYA HASILNYA.**

> Perangkat mask ini sengaja dipakai duluan di sini supaya SC12–SC13 (ADMR) terbaca sebagai penerapannya, bukan trik baru.

**→ CHAPTER 04 overlay f9944–10066** (122 f — kartu terpanjang, keheningan 0.83 s)
`04 UJI SKENARIO DI CHART` · roadmap: part 01–03 ✓, part 04 menyala.

---

## PART 04 — UJI SKENARIO DI CHART

### SCENE 12 — f10005–11044 · 02:46.750–03:04.066 · **17.32 s**
**NARRATION** (VO 02:47.166–03:03.966)
Sekarang kita lihat contohnya di ADMR.
Secara jangka panjang, saham ini sebelumnya masih berada dalam uptrend.
Lalu terbentuk descending triangle.
Volume terakhir masih cukup aktif, dan MACD histogram sudah hijau.
Kalau terlalu fokus pada satu skenario, kondisi ini bisa terlihat seperti persiapan rebound.

**Beat anchors**
- "contohnya di ADMR." — 02:48.92 · **f10135**
- "masih berada dalam uptrend." — 02:52.78 · **f10367**
- "Lalu terbentuk descending triangle." — 02:53.30 · **f10398**
- "Volume terakhir masih cukup aktif," — 02:55.50 · **f10530**
- "MACD histogram sudah hijau." — 02:57.77 · **f10666**
- "kalau terlalu fokus pada satu skenario," — 02:59.67 · **f10780**
- "terlihat seperti persiapan rebound." — 03:03.63 · **f11018**

**VISUAL**
Counter (CG-E) **keluar** — ini bagian studi kasus, bukan daftar kesalahan.
Chart ADMR harian, **data asli**, dengan reveal mask menutup semuanya setelah tanggal keputusan (bar terakhir sebelum 11 Mei 2026). Volume pane + MACD histogram pane di bawah. Satu tape saja, dipakai lagi utuh di SC13 (CG-B).
f10367 — trendline uptrend jangka panjang digambar (trim path, bukan pop).
f10398 — descending triangle digambar: rangkaian high yang menurun + garis support datar.
f10530 — volume pane menyala, beberapa bar terakhir disorot.
f10666 — MACD histogram pane menyala hijau.
Ketiga bukti mendarat sebagai chip di sisi kiri: `UPTREND JANGKA PANJANG` · `VOLUME MASIH AKTIF` · `MACD HISTOGRAM HIJAU`
f11018 — satu baris sebagai **pertanyaan**, bukan klaim: **TERLIHAT SEPERTI PERSIAPAN REBOUND?**
`[NEEDS DATA: ADMR daily OHLCV + volume, ~Jan–Jun 2026, cukup panjang untuk menampung MA100 dan seluruh descending triangle]`

---

### SCENE 13 — f11044–12316 · 03:04.066–03:25.266 · **21.20 s**
**NARRATION** (VO 03:04.166–03:24.966)
Apa yang perlu diwaspadai?
Yang perlu diwaspadai justru perubahan skenario.
Pada 11 Mei 2026, harga break di bawah MA100.
Besoknya, harga mencoba retest, tapi gagal kembali ke atas MA100.
Lalu pada 18 Mei, support descending triangle ikut ditembus.
Kalau bukti berubah, skenario juga harus berubah.

**Beat anchors**
- "Apa yang perlu diwaspadai?" — 03:04.17 · **f11050**
- "justru perubahan skenario." — 03:07.15 · **f11229**
- "Pada 11 Mei 2026," — 03:08.80 · **f11328**
- "harga break di bawah MA100." — 03:10.47 · **f11428**
- "Besoknya, harga mencoba retest," — 03:13.17 · **f11590**
- "gagal kembali ke atas MA100." — 03:15.27 · **f11716**
- "Lalu pada 18 Mei," — 03:18.00 · **f11880**
- "support descending triangle ikut ditembus." — 03:19.83 · **f11990**
- "Kalau bukti berubah, skenario juga harus berubah." — 03:22.37 · **f12142**

**VISUAL**
Tape ADMR yang **sama** (CG-B) — jangan digambar ulang. MA100 digambar masuk di f11229.
Mask terbuka bertahap, satu peristiwa per kalimat, masing-masing dengan anotasi bertanggal:
f11328–11428 — **① 11 MEI 2026 — BREAK DI BAWAH MA100**; garis MA100 restyle di titik tembus.
f11590–11716 — **② RETEST GAGAL** (label tanggalnya diambil dari bar berikutnya di data, bukan diasumsikan); panah kecil naik lalu tertahan di bawah MA100.
f11880–11990 — **③ 18 MEI — SUPPORT TRIANGLE DITEMBUS**; garis support triangle restyle jadi putus-putus.
Bersamaan dengan tiap peristiwa, chip bukti dari SC12 di sisi kiri **berubah, tidak dihapus**: `UPTREND JANGKA PANJANG` → strike, `MACD HISTOGRAM HIJAU` → redup + caption `TIDAK DIKONFIRMASI HARGA`.
Akhiri: **KALAU BUKTI BERUBAH, SKENARIO JUGA HARUS BERUBAH.**
**Tanpa penanda beli/jual, tanpa target harga, tanpa saran keluar-masuk.** Yang ditampilkan hanya bukti dan pembacaannya.
`[NEEDS DATA: sama dengan SC12 — satu dataset, dibagi dua scene]`

**→ CHAPTER 05 overlay f12262–12370** (108 f)
`05 JALANKAN PROSESMU` · roadmap: part 01–04 ✓, part 05 menyala.

---

## PART 05 — JALANKAN PROSESMU

### SCENE 14 — f12316–13040 · 03:25.266–03:37.333 · **12.07 s**
**NARRATION** (VO 03:25.566–03:37.100)
Kesalahan lain adalah asal copy trade orang lain.
Sahamnya mungkin sama, tapi timeframe, harga entry, batas risiko, dan rencana exit bisa berbeda.
Saham sama belum tentu trade-nya sama.

**Beat anchors**
- "asal copy trade orang lain." — 03:26.58 · **f12395**
- "Sahamnya mungkin sama," — 03:28.27 · **f12496** ⚠ tanpa udara
- "tapi timeframe," — 03:30.17 · **f12610**
- "harga entry," — 03:30.63 · **f12638**
- "batas risiko," — 03:31.58 · **f12695**
- "dan rencana exit" — 03:33.00 · **f12780**
- "Saham sama belum tentu trade-nya sama." — 03:35.27 · **f12916**

**VISUAL**
Counter (CG-E) kembali: `MISTAKE 08 — ASAL COPY TRADE`
Dua trade card berdampingan, **ticker identik** di header keduanya (pakai ticker ilustrasi, bukan ADMR — supaya tidak terbaca sebagai komentar atas contoh nyata tadi).
Empat baris terisi satu per beat, nilainya berbeda kiri-kanan dan **ditulis dengan kata, bukan angka harga**:
`TIMEFRAME` — Harian vs Mingguan (f12610)
`HARGA ENTRY` — lebih awal vs lebih tinggi (f12638)
`BATAS RISIKO` — lebih ketat vs lebih longgar (f12695)
`RENCANA EXIT` — bertahap vs sekaligus (f12780)
Akhiri: **SAHAM SAMA ≠ TRADE-NYA SAMA.**

---

### SCENE 15 — f13040–13670 · 03:37.333–03:47.833 · **10.50 s**
**NARRATION** (VO 03:37.566–03:47.666)
Jadi jangan cuma bertanya: “Dia beli saham apa?”
Lebih penting pahami kenapa trade itu diambil, dan kapan logikanya dianggap salah.
Kalau logikanya tidak kamu pahami, jangan langsung ikut.

**Beat anchors**
- **“Dia beli saham apa?”** — 03:39.12 · **f13147**
- "pahami kenapa trade itu diambil," — 03:41.82 · **f13309**
- "kapan logikanya dianggap salah." — 03:43.40 · **f13404**
- "jangan langsung ikut." — 03:46.62 · **f13597**

**VISUAL**
Dua trade card dari SC14 menyusut ke sisi dan tinggal jadi latar redup.
Di f13147 satu pertanyaan besar muncul di tengah: “Dia beli saham apa?” — lalu **di-strike** dan turun.
Di f13309 dan f13404 dua pertanyaan pengganti naik berurutan, keduanya menyala:
**“KENAPA TRADE ITU DIAMBIL?”**
**“KAPAN LOGIKANYA DIANGGAP SALAH?”**
Akhiri: **KALAU LOGIKANYA TIDAK KAMU PAHAMI, JANGAN LANGSUNG IKUT.**

---

### SCENE 16 — f13670–14750 · 03:47.833–04:05.833 · **18.00 s**
**NARRATION** (VO 03:48.000–04:05.533)
Sebelum entry, tarik semua yang sudah dipelajari menjadi satu proses.
“Trend-nya bagaimana?”
“Level pentingnya di mana?”
“Setup-nya apa?”
“Volume mendukung?”
“Timeframe lain sejalan?”
Dan yang paling penting: “apa invalidation-nya?”
Kalau satu bagian penting belum jelas, trade belum siap.

**Beat anchors**
- "tarik semua yang sudah dipelajari menjadi satu proses." — 03:48.75 · **f13725**
- **“Trend-nya bagaimana?”** — 03:52.33 · **f13940**
- **“Level pentingnya di mana?”** — 03:53.50 · **f14010**
- **“Setup-nya apa?”** — 03:54.97 · **f14098**
- **“Volume mendukung?”** — 03:55.90 · **f14154**
- **“Timeframe lain sejalan?”** — 03:57.13 · **f14228**
- "Dan yang paling penting:" — 03:59.13 · **f14348**
- **“apa invalidation-nya?”** — 04:01.08 · **f14465**
- "Kalau satu bagian penting belum jelas, trade belum siap." — 04:02.37 · **f14542**

> ⚠ **Keenam pertanyaan ini TIDAK berjarak rata.** Jeda antar kedatangan: 70 f → 88 f → 56 f → 74 f, lalu **120 f** ke "Dan yang paling penting:" dan **117 f** lagi ke pertanyaan keenam. Mendaratkan tiap baris pada kata yang diucapkan; **jangan disebar di grid yang rapi** — ini persis cara sebuah build lepas dari suaranya.

**VISUAL**
Semua sisa SC15 keluar. Step rail vertikal `PROSES SEBELUM ENTRY`, baris terisi satu per pertanyaan, **teks persis termasuk tanda kutip lengkung**:
“Trend-nya bagaimana?”
“Level pentingnya di mana?”
“Setup-nya apa?”
“Volume mendukung?”
“Timeframe lain sejalan?”
Di f14348 rail berhenti sejenak, kelima baris redup satu tingkat.
Di f14465 baris keenam mendarat lebih besar dan menyala, dengan bingkai tersendiri:
**“apa invalidation-nya?”**
Di f14542 satu baris hilang isinya (jadi kosong berkedip) untuk menunjukkan "satu bagian belum jelas".
Akhiri: **SATU BAGIAN BELUM JELAS → TRADE BELUM SIAP.**

> Kelima pertanyaan pertama adalah judul episode-episode sebelumnya (trend, level, setup, volume, multi-timeframe). Rail ini adalah tempat seri itu ditutup — biarkan terbaca begitu, tanpa narasi tambahan.

---

### SCENE 17 — f14750–15724 · 04:05.833–04:22.066 · **16.23 s**
**NARRATION** (VO 04:06.133–04:21.866)
Lalu cek juga dirimu sendiri.
Kalau ingin entry karena FOMO, kesal, atau ingin membalas loss, berhenti dulu.
Technical Analysis adalah alat bantu keputusan, bukan alat untuk mencari kepastian.
Emosi boleh ada, tapi jangan biarkan emosi mengambil alih proses.

**Beat anchors**
- "Lalu cek juga dirimu sendiri." — 04:06.13 · **f14768**
- "FOMO," — 04:09.98 · **f14999**
- "kesal," — 04:10.40 · **f15024**
- "ingin membalas loss," — 04:11.65 · **f15099**
- "berhenti dulu." — 04:12.47 · **f15148**
- "alat bantu keputusan," — 04:14.58 · **f15275**
- "bukan alat untuk mencari kepastian." — 04:15.78 · **f15347**
- "Emosi boleh ada," — 04:18.30 · **f15498**
- "jangan biarkan emosi mengambil alih proses." — 04:19.73 · **f15584**

**VISUAL**
Step rail SC16 menyusut ke kiri dan tetap terlihat (CG-C) — proses tetap ada, sekarang orangnya yang diperiksa.
Panel `CEK DIRIMU SENDIRI` naik di kanan (f14768). Tiga chip merah mendarat tepat di katanya:
`FOMO` (f14999) · `KESAL` (f15024) · `INGIN MEMBALAS LOSS` (f15099)
Di f15148 ketiganya dibungkus satu chip tegas: **BERHENTI DULU**
Di f15275 / f15347 dua baris kontras di bawah panel:
`TA = ALAT BANTU KEPUTUSAN` ✓
`TA = ALAT MENCARI KEPASTIAN` ✗
Di f15584 chip emosi tidak dihapus — hanya digeser keluar dari jalur proses, dan step rail di kiri menyala kembali penuh.
Akhiri: **EMOSI BOLEH ADA — JANGAN BIARKAN MENGAMBIL ALIH PROSES.**

**→ FINAL RECAP overlay f15676–15772** (96 f)
Roadmap lengkap **semua ✓**: 01 Tentukan Invalidation ✓ / 02 Kendalikan Emosi ✓ / 03 Jaga Objektivitas ✓ / 04 Uji Skenario di Chart ✓ / 05 Jalankan Prosesmu ✓ (CG-D — objek roadmap yang sama sejak f1938).

---

## CLOSE

### SCENE 18 — f15724–16620 · 04:22.066–04:37.000 · **14.93 s** (+ tail sampai f16800)
**NARRATION** (VO 04:22.266–04:37.000)
Jadi rule penutupnya sederhana.
Kalau kondisi belum lengkap, tunggu.
Kalau setup sudah invalid, keluar.
Kalau kondisi berubah, evaluasi ulang.
Dan kalau alasan masuknya emosional, jangan dipaksakan.
No trade unless the conditions are met.

**Beat anchors**
- "Jadi rule penutupnya sederhana." — 04:22.27 · **f15736**
- **"Kalau kondisi belum lengkap, tunggu."** — 04:24.20 · **f15852**
- **"Kalau setup sudah invalid, keluar."** — 04:25.90 · **f15954**
- **"Kalau kondisi berubah, evaluasi ulang."** — 04:28.07 · **f16084**
- **"Dan kalau alasan masuknya emosional, jangan dipaksakan."** — 04:30.57 · **f16234**
- **"No trade unless the conditions are met."** — 04:33.80 · **f16428**

> ⚠ Keempat rule juga **tidak rata**: 102 f → 130 f → 150 f. Mendarat pada kata, bukan pada grid.

**VISUAL**
Roadmap all-✓ dari kartu FINAL RECAP menyusut ke atas dan keluar (f15736).
Empat baris rule mendarat satu per kalimat, format `KONDISI → TINDAKAN`:
`BELUM LENGKAP → TUNGGU` (f15852)
`SUDAH INVALID → KELUAR` (f15954)
`KONDISI BERUBAH → EVALUASI ULANG` (f16084)
`ALASANNYA EMOSIONAL → JANGAN DIPAKSAKAN` (f16234)
Di f16428 keempatnya collapse ke tengah dan berubah jadi quote card dengan maskot di atas grid yang bergerak pelan — objek yang sama dengan pembuka chapter, supaya penutupnya berima dengan pembukanya:
**“No trade unless the conditions are met.”**
Tahan sampai **f16800** (3.0 s setelah kata terakhir). Tidak ada elemen baru di tail — hanya hold.

---

## Continuity groups

> **CG-A · SC01 · SC02 · SC04 · SC05** — satu tape ilustrasi, digambar sekali. Kegagalan di cold open **adalah** contoh yang dibedah di Mistake 01; SC04 bilang "Misalnya kamu beli karena support bertahan" dan support itu sudah ada di checklist SC01. Chart kedua akan membuat kalimat itu jadi cerita lain.

> **CG-B · SC12 · SC13** — satu tape ADMR, satu dataset. SC12 memakai reveal mask, SC13 membukanya. Menggambar ulang chart di SC13 akan menghapus seluruh poin "bukti yang sama, ternyata berubah".

> **CG-C · SC16 · SC17** — step rail proses. Dibangun di SC16, menyusut ke kiri di SC17 dan tetap hidup di sana; SC17 memeriksa orangnya, bukan mengganti prosesnya.

> **CG-D · f1938 → SC18** — objek roadmap yang sama sepanjang video: muncul di LEARNING ROADMAP, dipakai ulang di tiap chapter card dengan part berikutnya menyala, dan kembali all-✓ di FINAL RECAP. Bukan enam kartu berbeda.

> **CG-E · SC04 → SC14** — satu counter chip kesalahan di kiri-atas, angkanya naik 01 → 08, keluar hanya selama PART 04 (studi kasus ADMR). Satu objek, tidak dibangun ulang tiap scene.

---

## Aturan yang berlaku di seluruh episode

- **Tidak ada wipe antar scene.** Hard cut atau CameraCut.
- **108 px bawah milik subtitle** — dibakar verbatim dari `assets/TA_Mistakes_Sub_CORRECTED.srt` lewat `scripts/srt-to-cues.mjs`. Tidak ada label, gridline, atau latar yang masuk ke sana.
- **360×150 kanan-atas dikosongkan** (zona logo). Konten di 150 px teratas berhenti sebelum x = 1368.
- **Tanpa penanda beli/jual, tanpa panah entry, tanpa target harga, tanpa angka probabilitas atau skor.** Tombol `BUY` di SC01 adalah bagian cerita, bukan ajakan.
- Merah hanya untuk kata yang **menyebut** kesalahan dan untuk body candle. Chrome pakai indigo/cyan/netral.
- Semua tape ilustrasi ditandai otomatis dari `series.kind` — jangan menulis label ilustrasi ke dalam direction, dan jangan memintanya dihapus.
- Teks yang dikutip ditulis **persis** seperti di SRT, termasuk tanda kutip lengkung “ ” dan huruf kecilnya (`“apa invalidation-nya?”` bukan Title Case).

---

## Open items

- `[NEEDS DATA]` **ADMR daily OHLCV + volume**, kira-kira Jan–Jun 2026 — cukup panjang untuk MA100 dan seluruh descending triangle, dan harus memuat: uptrend jangka panjang, 11 Mei 2026 break di bawah MA100, hari bursa berikutnya (retest gagal), 18 Mei support triangle ditembus. **Satu dataset, dipakai SC12 dan SC13.** Ini satu-satunya data nyata di episode ini — semua chart lain ilustrasi.
- `[NEEDS DATA]` **MACD histogram ADMR** pada window yang sama (SC12 f10666). Kalau di-derive dari OHLC yang sama, cukup sebut parameternya (12/26/9?).
- `[NEEDS DECISION]` "Besoknya" (SC13, f11590) — labelnya diambil dari **tanggal bar berikutnya di data**, bukan diasumsikan 12 Mei. Kalau 12 Mei bukan hari bursa, label mengikuti data.
- `[NEEDS DECISION]` SC10 — pane indikator dinamai konkret (RSI / Stochastic / MACD histogram) atau generik (INDIKATOR A/B/C)?
- `[NEEDS DECISION]` SC01 — tombol `BUY` yang "tertekan" lalu jadi chip `POSISI TERBUKA`. Ini keputusan compliance yang saya ambil supaya cerita "kamu masuk dengan yakin" bisa digambar **tanpa** panah entry di chart. Kalau Simon mau lebih konservatif lagi, alternatifnya: tidak ada tombol sama sekali, cukup chip status muncul di kiri-atas.
- **Tidak ada script .docx di folder VIDEO 22**, jadi tidak ada perbandingan estimasi-vs-rekaman untuk episode ini. Semua angka berasal dari SRT dan dari durasi audio terukur (277.107 s).
- **VO tidak perlu di-pad.** Keenam transition card muat di keheningan yang ada; join tersempit antar scene 0.30 s. Ini berbeda dari VIDEO 20, yang harus melipat satu kartu ke dalam scene.
- Keputusan yang saya ambil atas nama Simon: **18 scene, 5 part**, delapan kesalahan dinomori dengan satu counter chip, dan studi kasus ADMR diangkat jadi PART 04 tersendiri (bukan diselipkan ke daftar kesalahan) — karena narasinya berhenti menyebut "kesalahan" di situ dan beralih ke pembuktian.
- Nama part masih bisa diubah tanpa menyentuh angka frame mana pun: **01 Tentukan Invalidation · 02 Kendalikan Emosi · 03 Jaga Objektivitas · 04 Uji Skenario di Chart · 05 Jalankan Prosesmu.**
