# VI01 — PASSIVE INCOME
## Script re-timed against the recorded VO

**Source of timing:** `INV01 - Main VO.srt` (Premiere STT) → `assets/VI01_PassiveIncome_Sub_CORRECTED.srt`
**VO file:** `INV01 - Main VO.MP3` → `public/vo/passive-income.mp3` — durasi audio **318.323 s (05:18.322)**
**VO length (SRT):** kata terakhir keluar 05:18.232 · **f19094 @ 60 fps** · comp length **19,300 f (05:21.666)** — 206 f / 3.4 s tail untuk menahan quote penutup
**Episode folder:** `src/episodes/vi01-passive-income/` · composition **`VI01-PassiveIncome`** · fps **60**
**Original script estimate:** 04:10 → rekaman nyata **05:18.3 (termasuk jeda 0,5 s + 0,5 s + 0,33 s + 0,33 s), +68.3 s lebih panjang.** Semua timestamp di script asli mati; pakai hanya tabel di bawah. Script dengan timing baru: `docs/VI01_PassiveIncome_Script_RETIMED.txt`.

### Cara subtitle dibuat ulang
`scripts/vi01-align.py` — kata-kata script dicocokkan ke kata-kata SRT (waktunya dari SRT), lalu:
- **satu cue = satu kalimat**, satu baris. Kalimat yang terlalu lebar untuk satu baris (diukur dengan font aslinya, Plus Jakarta Sans 36px, maks 1560 px) dipotong — hanya di titik dua, koma, atau jeda bicara, tidak pernah di tengah frasa;
- batas kalimat yang jatuh **di dalam** satu cue SRT (mis. "…kita tunggu: GAJIAN. Kita kerja, …") dipindah ke 20 ms paling sunyi di audio dekat perkiraan — itu napas si pembicara;
- tulisan 100% dari script asli (huruf kapital, tanda baca). Yang dibetulkan dari SRT: *pasif → passive, human aset → human asset, finansial aset → financial asset, lokeng Hong → Lo Kheng Hong, bca → BCA, karir → karier, sekedar → sekadar, 50.100 ribu → Rp50 ribu, Rp100 ribu, 15.000 → Rp15 ribu, Aku → aku, cebeli → beli*.

Hasil: **86 cue dari 65 kalimat**, cue terlebar 1554 px.

Dua timing per scene:
- **VO** — kata pertama masuk / kata terakhir keluar.
- **BLOCK** — blok scene kontinu, dipotong di **titik tengah keheningan** antar scene; blok bertemu ujung-ke-ujung, timeline utuh f0 → f19300.

---

## ⚠ Jeda di VO

| Di | Panjang | Kenapa |
|---|---|---|
| f150 (00:02.500, antara "tunggu:" dan "GAJIAN") | **+30 f / 0.5 s** | Simon, 2026-10-06: "Di frame 150, beri jeda 30 frame (VO dan scene visual)" |
| f230 (00:03.833, antara "GAJIAN." dan "Kita kerja") | **+30 f / 0.5 s** | Simon, 2026-10-06: "230 kasih jeda 30 frame" — setelahnya GAJIAN + kalender naik keluar, foto "Orang Kerja" naik dari bawah ke tengah |
| f530 (00:08.833, saat enam ikon belanja selesai muncul) | **+20 f / 0.33 s** | Simon, 2026-10-06: "530 kasih jeda 20 frame. visual dan vo geser" |
| f2110 (00:35.167, setelah "waktu dan tenaga kita.") | **+20 f / 0.33 s** | Simon, 2026-10-06: "2110 berikan jeda 20 frame, VO dan visualnya ikut geser timingnya. (transisinya juga geser)" |

Semua angka di dokumen ini sudah termasuk jeda itu. VO dibangun ulang dari file asli oleh `scripts/vi01-vo.py` (daftar jeda: `src/episodes/vi01-passive-income/data/pads.json`); subtitle oleh `scripts/vi01-align.py`, yang membaca daftar yang sama.

## Master timing table

| Scene | BLOCK (frames) | BLOCK (tc) | Dur | VO in – VO out | Cues | Part |
|---|---|---|---|---|---|---|
| SC01 | 0 – 1019 | 00:00.000 – 00:16.983 | 16.98 s | 00:00.166 – 00:16.699 | 1–4 | cold open |
| SC02 | 1019 – 2133 | 00:16.983 – 00:35.549 | 18.57 s | 00:17.266 – 00:34.999 | 5–9 | cold open |
| SC03 | 2133 – 3125 | 00:35.549 – 00:52.083 | 16.53 s | 00:35.766 – 00:51.932 | 10–14 | cold open |
| SC04 | 3125 – 4078 | 00:52.083 – 01:07.966 | 15.88 s | 00:52.232 – 01:07.766 | 15–18 | 01 |
| SC05 | 4078 – 5375 | 01:07.966 – 01:29.583 | 21.62 s | 01:08.166 – 01:29.366 | 19–23 | 01 |
| SC06 | 5375 – 6457 | 01:29.583 – 01:47.616 | 18.03 s | 01:29.799 – 01:47.566 | 24–28 | 01 |
| SC07 | 6457 – 7668 | 01:47.616 – 02:07.799 | 20.18 s | 01:47.666 – 02:07.532 | 29–35 | 01 |
| SC08 | 7668 – 8622 | 02:07.799 – 02:23.699 | 15.90 s | 02:08.066 – 02:23.566 | 36–39 | 01 |
| SC09 | 8622 – 9644 | 02:23.699 – 02:40.733 | 17.03 s | 02:23.832 – 02:40.532 | 40–43 | 02 |
| SC10 | 9644 – 10700 | 02:40.733 – 02:58.333 | 17.60 s | 02:40.932 – 02:58.132 | 44–49 | 02 |
| SC11 | 10700 – 11786 | 02:58.333 – 03:16.433 | 18.10 s | 02:58.532 – 03:16.166 | 50–54 | 02 |
| SC12 | 11786 – 12573 | 03:16.433 – 03:29.549 | 13.12 s | 03:16.699 – 03:29.366 | 55–58 | 02 |
| SC13 | 12573 – 13709 | 03:29.549 – 03:48.483 | 18.93 s | 03:29.732 – 03:48.399 | 59–63 | 03 |
| SC14 | 13709 – 14979 | 03:48.483 – 04:09.649 | 21.17 s | 03:48.566 – 04:09.566 | 64–68 | 03 |
| SC15 | 14979 – 16018 | 04:09.649 – 04:26.966 | 17.32 s | 04:09.732 – 04:26.799 | 69–72 | 03 |
| SC16 | 16018 – 16894 | 04:26.966 – 04:41.566 | 14.60 s | 04:27.132 – 04:41.232 | 73–75 | close |
| SC17 | 16894 – 18106 | 04:41.566 – 05:01.766 | 20.20 s | 04:41.899 – 05:01.666 | 76–82 | close |
| SC18 | 18106 – 19300 | 05:01.766 – 05:21.666 | 19.90 s | 05:01.866 – 05:18.232 | 83–86 | close |

**Tidak ada batas scene yang jatuh di tengah cue.** Join tersempit: **SC06 → SC07, 0.10 s** udara — potong keras di kata, tanpa transisi. Keheningan terpanjang di seluruh rekaman di batas scene hanya **0.67 s** (SC16 → SC17).

**Tidak ada wipe di antara scene** — hard cut atau CameraCut saja.

---

## Scene Transisi — gaya TA09, VO tidak disentuh

Bentuknya roadmap TA09 (`RoadmapCards` di core): frame scene yang sedang berjalan **dilipat masuk** ke kartunya sendiri, kartu-kartu lain terbuka di atas grid yang bergerak pelan, kartu bab berikutnya **menyala**, lalu kamera **masuk** ke kartu itu dan papan memudar di atas scene berikutnya yang sudah mulai menggambar. Susunannya 1 + 3: kartu pembuka di atas tengah, tiga bab di bawah.

| Kartu | Isi | Label |
|---|---|---|
| atas | SC01–SC03 | **Gaji & Waktu** |
| 1 | SC04–SC08 | **Uang Yang Ikut Bekerja** |
| 2 | SC09–SC12 | **Ikut Punya Bisnis** |
| 3 | SC13–SC15 | **Cerita Lo Kheng Hong** |

| Transisi | Di | Keheningan nyata | Overlay window |
|---|---|---|---|
| ST1 — cold open → bab 1 | SC03 → SC04 | 0.30 s | **3090 – 3260** |
| ST2 — bab 1 → bab 2 | SC08 → SC09 | 0.27 s | **8586 – 8756** |
| ST3 — bab 2 → bab 3 | SC12 → SC13 | 0.37 s | **12537 – 12707** |

Tiap overlay mulai ~36 f sebelum kata terakhir scene keluar (scene sudah selesai bicara) dan selesai ~130 f setelahnya, saat scene berikutnya sudah berjalan di bawahnya. Bagian penutup (SC16–SC18) **tidak** punya kartu — bab 3 ditutup dengan CameraCut biasa, karena penutupnya bukan bab baru melainkan kesimpulan.

> Alternatif: gaya TA11 (kartu-kartu bernomor yang dibagikan, kursor memilih, banjir indigo) — muat untuk berapa pun jumlah bab. Bilang saja kalau mau pakai yang itu.

---

## Bahasa visual episode ini

- **Tokoh: si pekerja kuning** (`public/art/guy/01–06.png`, dipakai TA11). Video ini tentang *pekerja yang juga punya aset* — dia tokohnya dari detik pertama sampai kalimat terakhir.
- **Dua warna, dua jenis aset — dikunci sepanjang video:** **indigo = kerja / human asset**, **cyan = aset / financial asset**. Diperkenalkan di SC04, dinamai di SC07, dipakai lagi di SC08, SC16–SC18.
- **Satu alur yang terus kembali:** `Kerja → Penghasilan → Aset` (tiga node bersambung). Lahir di SC01 (tanpa "Aset"), mendapat node ketiganya di SC04, menjadi estafet di SC08, dan menjadi kalimat penutup di SC18.
- **Kalimat penting** pakai kotak garis-putus TA07 (`DashedBox`, teks diketik, potongan kunci diberi tint indigo/cyan) atau quote card penutup TA09 (`QuoteCard` + Tuntun mark melayang).
- **Tidak ada logo merek tiruan.** Perusahaan ditulis sebagai kartu nama + kode saham (BBCA, ICBP, ULTJ, UNTR).
- **Tidak ada ajakan beli/jual, tidak ada prediksi harga.** Angka UNTR hanya angka yang diucapkan narasi, ditulis sebagai contoh masa lalu.

---

# SCENES

## COLD OPEN

### SCENE 01 — f0–1019 · 00:00.000–00:16.983 · **16.98 s**
**NARRATION** (VO 00:00.166–00:16.699)
Setiap bulan, ada satu momen yang selalu kita tunggu: GAJIAN.
Kita kerja, dapat penghasilan, lalu pakai uang itu untuk menjalani hidup.
Tapi coba bayangin kalau suatu hari kita harus berhenti kerja sementara.
Apakah penghasilan kita juga ikut berhenti?

**Beat anchors**
- "GAJIAN" — 00:03.2 · f190
- "Kita kerja" — 00:03.7 · f220
- "berhenti kerja sementara" — 00:12.5 · f751
- "Apakah" — 00:14.6 · f876

**VISUAL**
Grid bergerak pelan. Kartu kalender bulan ini; tanggal-tanggal lewat cepat, lalu berhenti di tanggal gajian — stempel **GAJIAN** jatuh di f190 (pop, satu-satunya pop di scene).
Si pekerja (pose 01) masuk dari kiri. Di sebelahnya tumbuh alur tiga node: **Kerja → Penghasilan → Hidup** (indigo), satu per frasa (f220 / ~f290 / ~f390).
f751 "berhenti kerja sementara": node **Kerja** meredup dan diberi ikon jeda; panah ke Penghasilan putus. Si pekerja ganti ke pose 04 (lesu).
f876: tanda tanya muncul di node Penghasilan — **"Penghasilan ikut berhenti?"**
Akhiri: alur yang terputus di tengah.

### SCENE 02 — f1079–2133 · 00:16.983–00:35.549 · **18.57 s**
**NARRATION** (VO 00:17.266–00:34.999)
Makanya, banyak orang berusaha menambah penghasilan.
Ada yang mengejar naik jabatan, belajar skill baru, bangun bisnis, ambil freelance, atau cari side hustle.
Semua itu bagus, tapi hampir semuanya tetap membutuhkan satu hal yang sama: waktu dan tenaga kita.

**Beat anchors**
- "naik jabatan" — 00:22.3 · f1338
- "belajar skill" — 00:23.5 · f1410
- "bangun bisnis" — 00:25.0 · f1502
- "ambil freelance" — 00:26.0 · f1560
- "side hustle" — 00:28.3 · f1702
- "waktu dan tenaga" — 00:33.7 · f2022

> ⚠ Lima chip mendarat **di kata masing-masing** — jaraknya tidak rata (72 / 92 / 58 / 142 f). Jangan dibuat grid rata.

**VISUAL**
Judul **Menambah Penghasilan**. Lima chip muncul satu per kata, menyebar mengelilingi si pekerja (pose 06): **Naik jabatan · Skill baru · Bangun bisnis · Freelance · Side hustle**.
f2022: dari kelima chip ditarik garis ke satu pil di bawah — **Waktu + Tenaga** (indigo, ikon jam & baterai). Semua jalan bertemu di sana.
Akhiri: lima jalan, satu sumber yang sama.

### SCENE 03 — f2193–3125 · 00:35.549–00:52.083 · **16.53 s**
**NARRATION** (VO 00:35.766–00:51.932)
Masalahnya, sehari tetap cuma 24 jam.
Semakin dewasa, tanggung jawab biasanya justru makin banyak.
Jadi selain bertanya, “Gimana caranya aku bisa menghasilkan lebih banyak?”
Kita juga perlu mulai bertanya: “Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”

**Beat anchors**
- "24 jam" — 00:37.7 · f2265
- "Semakin dewasa" — 00:38.7 · f2324
- "Jadi selain" — 00:42.9 · f2578
- "Kita juga perlu" — 00:47.6 · f2858
- "ikut bekerja" — 00:51.1 · f3068

**VISUAL**
Satu bar hari: **24 kotak jam**. f2324: kotak-kotaknya terisi blok tanggung jawab (Kerja, Perjalanan, Keluarga, Istirahat…) sampai penuh — tidak ada kotak kosong tersisa. Si pekerja pose 04.
Bar mundur ke atas. f2578: pertanyaan pertama di kotak garis-putus TA07, diketik — **“Gimana caranya aku bisa menghasilkan lebih banyak?”**
f2858: pertanyaan pertama meredup dan bergeser; pertanyaan kedua diketik di bawahnya — **“Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”**, dengan **ikut bekerja** ber-tint cyan tepat di f3068.
Akhiri: pertanyaan kedua menyala, pertanyaan pertama redup.

**→ SCENE TRANSISI 1 overlay f3150–3260** — SC03 dilipat ke kartu atas **Gaji & Waktu**, tiga kartu bab terbuka, kartu 1 **Uang Yang Ikut Bekerja** menyala, kamera masuk.

## PART 01 — UANG YANG IKUT BEKERJA

### SCENE 04 — f3185–4078 · 00:52.083–01:07.966 · **15.88 s**
**NARRATION** (VO 00:52.232–01:07.766)
Di sinilah konsep passive income mulai masuk.
Bukan berarti investasi hari ini, lalu besok langsung berhenti kerja.
Kita tetap kerja, tetap bangun karier, dan tetap belajar.
Bedanya, sebagian uang yang kita hasilkan mulai kita ubah menjadi aset.

**Beat anchors**
- "passive income" — 00:53.2 · f3198
- "Bukan berarti" — 00:55.3 · f3324
- "lalu besok" — 00:57.5 · f3456
- "Kita tetap kerja" — 00:59.7 · f3588
- "Bedanya" — 01:03.4 · f3808
- "menjadi aset" — 01:06.9 · f4018

**VISUAL**
Judul besar di tengah **Passive Income** (f3198), lalu naik ke posisi judul.
f3324: anggapan yang salah ditulis — **Investasi hari ini → besok berhenti kerja** — dan dicoret di f3456 (Strike, merah hanya di kata yang menamai kesalahan).
f3588: tiga chip ✓ — **Tetap kerja · Tetap bangun karier · Tetap belajar**.
f3808: alur SC01 kembali (**Kerja → Penghasilan**), lalu sebagian Penghasilan terpisah dan mengalir ke node baru **Aset** (cyan) di f4018.
Akhiri: Kerja → Penghasilan → **Aset**.

### SCENE 05 — f4138–5375 · 01:07.966–01:29.583 · **21.62 s**
**NARRATION** (VO 01:08.166–01:29.366)
Dan di sini, waktu punya peran besar.
Kalau sebuah aset menghasilkan keuntungan, keuntungan itu bisa ikut menghasilkan keuntungan berikutnya.
Misalnya, 100 jadi 110, lalu 121, lalu 133.
Itulah konsep compounding: hasil yang terus ikut bertumbuh seiring waktu.

**Beat anchors**
- "waktu punya peran besar" — 01:09.4 · f4168
- "keuntungan itu" — 01:13.6 · f4418
- "Misalnya" / "100" — 01:17.0 · f4624
- **"110"** — 01:19.3 · **f4764**
- **"121"** — 01:20.9 · **f4858**
- **"133"** — 01:23.2 · **f4997**
- "compounding" — 01:25.8 · f5152

> ⚠ Angka **mendarat di kata yang diucapkan** (140 / 94 / 139 f) — tidak rata.

**VISUAL**
Sumbu waktu horizontal (f4168). Empat batang tumbuh satu per angka: **100 → 110 → 121 → 133**. Tiap batang = batang sebelumnya (cyan pucat) + tambahan baru di atasnya (cyan penuh); dari batang ketiga, tambahan itu dibelah dua: bagian dari modal awal dan bagian **dari keuntungan sebelumnya** — itu yang dinamai f4418 "keuntungan itu bisa ikut menghasilkan keuntungan".
f5152: judul **Compounding** dan baris di bawahnya — **hasil yang terus ikut bertumbuh seiring waktu**.
Angka ini ilustrasi (10% per periode, 133,1 dibulatkan) — bukan data pasar.
Akhiri: empat batang + kata Compounding.

### SCENE 06 — f5435–6457 · 01:29.583–01:47.616 · **18.03 s**
**NARRATION** (VO 01:29.799–01:47.566)
Makanya, kita nggak harus nunggu punya modal besar dulu.
Yang penting adalah mulai membangun kebiasaannya.
Karena investasi bukan cuma soal uang.
Semakin sering kita belajar dan mengevaluasi keputusan,
semakin baik juga kemampuan kita mengelola aset.

**Beat anchors**
- "modal besar" — 01:32.2 · f5536
- "kebiasaannya" — 01:36.1 · f5771
- "Karena investasi" — 01:37.6 · f5858
- "Semakin sering" — 01:40.4 · f6026
- "semakin baik" — 01:44.1 · f6252

**VISUAL**
f5536: tumpukan uang besar berlabel **Modal besar dulu?** — dicoret.
f5771: kalender kebiasaan — kotak-kotak bulan terisi ✓ satu per satu (streak), label **Kebiasaan**.
f6026: siklus tiga node berputar — **Belajar → Evaluasi keputusan → Kelola aset** — dan tiap putaran, bar **Kemampuan** di sampingnya naik satu tingkat (f6252).
Akhiri: siklus + bar kemampuan naik.

### SCENE 07 — f6517–7668 · 01:47.616–02:07.799 · **20.18 s**
**NARRATION** (VO 01:47.666–02:07.532)
Kalau dipikir-pikir, kekayaan kita punya dua bagian.
Yang pertama, human asset: waktu, kemampuan, dan pengalaman yang membantu kita menghasilkan uang.
Yang kedua, financial asset: tabungan, investasi, dan aset yang kita bangun dari penghasilan tadi.
Human asset punya batas. Financial asset bisa terus kita miliki.

**Beat anchors**
- "dua bagian" — 01:49.5 · f6573
- "human asset" — 01:51.1 · f6670
- "financial asset" — 01:57.6 · f7057
- "punya batas" — 02:04.2 · f7455
- "Financial asset bisa" — 02:05.0 · f7507

**VISUAL**
Satu kartu dibelah dua (f6573): kiri **Human Asset** (indigo), kanan **Financial Asset** (cyan).
Kiri, di f6670: **Waktu · Kemampuan · Pengalaman** (tiga baris dengan ikon). Kanan, di f7057: **Tabungan · Investasi · Aset**.
f7455: di bawah Human Asset muncul jam pasir yang menipis — **Punya batas**. f7507: di bawah Financial Asset garis yang terus naik — **Bisa terus dimiliki**.
Akhiri: dua kolom, dua nasib.

### SCENE 08 — f7728–8622 · 02:07.799–02:23.699 · **15.90 s**
**NARRATION** (VO 02:08.066–02:23.566)
Waktu masih muda, wajar kalau sebagian besar penghasilan datang dari kerja.
Tapi idealnya, saat income kita meningkat, aset kita juga ikut tumbuh.
Bayangin seperti estafet: kita kerja untuk menghasilkan uang, lalu sebagian uang itu kita teruskan untuk membangun aset.

**Beat anchors**
- "Waktu masih muda" — 02:08.0 · f7684
- "Tapi idealnya" — 02:12.2 · f7934
- "estafet" — 02:17.3 · f8244
- "lalu sebagian" — 02:19.9 · f8400

**VISUAL**
Dua warna SC07 dibawa ke sumbu umur (**Muda → Tua**): di kiri hampir semua penghasilan indigo (dari kerja); f7934 kedua lapisan naik, lapisan cyan (aset) makin tebal ke kanan. Ilustrasi bentuk, tanpa angka.
f8244: berganti ke **estafet** — dua pelari: **Kerja** (indigo) membawa tongkat **Uang**, f8400 menyerahkannya ke pelari **Aset** (cyan).
Akhiri: tongkat berpindah tangan.

**→ SCENE TRANSISI 2 overlay f8646–8756** — SC08 dilipat ke kartu 1, kartu 2 **Ikut Punya Bisnis** menyala, kamera masuk.

## PART 02 — IKUT PUNYA BISNIS

### SCENE 09 — f8682–9644 · 02:23.699–02:40.733 · **17.03 s**
**NARRATION** (VO 02:23.832–02:40.532)
Hal menarik dari investasi adalah:
kita nggak harus bekerja di sebuah perusahaan untuk ikut memiliki sebagian dari bisnisnya.
Ada orang yang bekerja di BCA untuk mendapatkan penghasilan.
Di sisi lain, sebagai investor, kita juga bisa punya sebagian kecil dari bisnis BCA.

**Beat anchors**
- "kita nggak harus" — 02:26.1 · f8770
- "Ada orang" — 02:31.9 · f9120
- "BCA" — 02:33.2 · f9194
- "Di sisi lain" — 02:35.7 · f9348
- "sebagian kecil" — 02:38.8 · f9533

**VISUAL**
Satu gedung perusahaan di tengah: kartu **Bank Central Asia · BBCA**.
f9120: di kiri, si pekerja (pose 01) — panah **kerja** masuk ke gedung, panah **gaji** kembali (indigo). Label **Karyawan**.
f9348: di kanan, orang kedua — tidak ada panah kerja; sebuah irisan kecil gedung terangkat dan mendarat di tangannya (cyan, f9533). Label **Investor**.
Akhiri: satu perusahaan, dua cara terhubung — Karyawan (gaji) / Investor (sebagian kecil bisnis).

### SCENE 10 — f9704–10700 · 02:40.733–02:58.333 · **17.60 s**
**NARRATION** (VO 02:40.932–02:58.132)
Hal yang sama sebenarnya ada di sekitar kita setiap hari.
Kita makan Indomie, minum Ultra Milk, dan menggunakan banyak produk dari perusahaan besar.
Sebagai konsumen, kita menikmati produknya.
Tapi lewat investasi, kita juga bisa ikut punya sebagian kecil dari bisnis di balik produk-produk itu.

**Beat anchors**
- "Indomie" — 02:45.1 · f9908
- "Ultra Milk" — 02:46.0 · f9964
- "dan menggunakan" — 02:46.8 · f10012
- "Sebagai konsumen" — 02:49.3 · f10164
- "Tapi lewat" — 02:52.8 · f10370
- "di balik" — 02:56.7 · f10604

**VISUAL**
Kartu produk mendarat satu per kata: **Indomie** (f9908), **Ultra Milk** (f9964), lalu dua kartu produk generik (f10012). Label kiri atas **Konsumen** (f10164).
f10370: kartu-kartu itu **berbalik** — di belakangnya perusahaan dan kodenya: **Indofood CBP · ICBP**, **Ultrajaya · ULTJ**. Label berganti **Pemilik (sebagian kecil)** di f10604.
`[NEEDS ASSET: foto/kemasan produk Indomie & Ultra Milk — opsional; tanpa itu kartunya teks + ilustrasi sederhana, bukan logo tiruan]`
Akhiri: produk di depan, bisnis di belakangnya.

### SCENE 11 — f10760–11786 · 02:58.333–03:16.433 · **18.10 s**
**NARRATION** (VO 02:58.532–03:16.166)
Dan di sinilah bedanya antara sekadar menghasilkan uang, dengan mulai membangun aset.
Sebuah bisnis bisa menghasilkan pendapatan, mencetak laba, lalu memakai laba itu untuk berkembang lebih jauh.
Sebagai pemilik sebagian dari bisnis tersebut, kita ikut punya exposure terhadap pertumbuhan nilainya.

**Beat anchors**
- "bedanya" — 02:59.2 · f10759
- "dengan mulai" — 03:02.8 · f10970
- "pendapatan" — 03:06.4 · f11188
- "mencetak laba" — 03:07.0 · f11222
- "lalu memakai" — 03:08.0 · f11286
- "exposure" — 03:13.7 · f11628

**VISUAL**
f10759: dua label berhadapan — **Menghasilkan uang** (indigo) vs **Membangun aset** (cyan, f10970).
f11188: roda bisnis tiga node — **Pendapatan → Laba (f11222) → Berkembang (f11286)** — dan tiap putaran rodanya membesar.
f11628: irisan kecil roda itu disorot cyan — **Pemilik ikut punya exposure ke pertumbuhan nilainya**. Tanpa angka, tanpa grafik harga.
Akhiri: roda yang tumbuh + irisan pemilik.

### SCENE 12 — f11846–12573 · 03:16.433–03:29.549 · **13.12 s**
**NARRATION** (VO 03:16.699–03:29.366)
Dan mulainya nggak harus besar. Bisa Rp50 ribu, Rp100 ribu, atau Rp300 ribu.
Yang paling penting bukan nominal pertamanya, tapi kebiasaan untuk menyisihkan sebagian income dan mulai mengubahnya menjadi aset.

**Beat anchors**
- **"Rp50"** — 03:18.7 · **f11925**
- **"Rp100"** — 03:19.2 · **f11953**
- **"Rp300"** — 03:20.5 · **f12036**
- "Yang paling" — 03:21.8 · f12114
- "tapi kebiasaan" — 03:24.2 · f12254
- "mengubahnya" — 03:27.8 · f12473

> ⚠ Tiga nominal hanya 28 f lalu 83 f terpisah — chip harus cepat (pop UI, bukan reveal teks).

**VISUAL**
Tiga chip nominal: **Rp50 ribu · Rp100 ribu · Rp300 ribu** di kata masing-masing.
f12114: ketiganya meredup — "bukan nominal pertamanya".
f12254: barisan bulan (Jan…Des): tiap bulan bar income masuk, sepotong kecil di atasnya dipotong dan jatuh ke toples **Aset** (cyan) — berulang, toples terisi. f12473 label **Kebiasaan menyisihkan**.
Akhiri: toples yang terisi pelan-pelan.

**→ SCENE TRANSISI 3 overlay f12597–12707** — SC12 dilipat ke kartu 2, kartu 3 **Cerita Lo Kheng Hong** menyala, kamera masuk.

## PART 03 — CERITA LO KHENG HONG

### SCENE 13 — f12633–13709 · 03:29.549–03:48.483 · **18.93 s**
**NARRATION** (VO 03:29.732–03:48.399)
Lo Kheng Hong juga nggak langsung mulai sebagai investor besar.
Sebelum dikenal seperti sekarang, dia pernah bekerja sebagai pegawai bank.
Sambil bekerja, dia menabung, belajar, membaca laporan perusahaan, dan pelan-pelan mulai berinvestasi.
Salah satu contoh terkenalnya adalah saat dia membeli saham United Tractors.

**Beat anchors**
- "Lo Kheng Hong" — 03:29.7 · f12584
- "pegawai bank" — 03:37.0 · f13026
- "menabung" — 03:38.8 · f13131
- "membaca laporan" — 03:39.8 · f13195
- "pelan-pelan" — 03:41.6 · f13298
- "United Tractors" — 03:46.9 · f13620

**VISUAL**
Kartu nama **Lo Kheng Hong** (f12584). `[NEEDS ASSET: foto Lo Kheng Hong — opsional; tanpa foto, kartu nama saja]`
Garis waktu kiri → kanan, satu titik per kata: **Pegawai bank** (f13026) → **Menabung** (f13131) → **Belajar & membaca laporan perusahaan** (f13195) → **Mulai berinvestasi** (f13298).
f13620: titik terakhir — kartu **United Tractors · UNTR**.
Akhiri: garis waktu dengan UNTR di ujungnya (dibawa ke SC14).

### SCENE 14 — f13769–14979 · 03:48.483–04:09.649 · **21.17 s**
**NARRATION** (VO 03:48.566–04:09.566)
Saat krisis 1998, Lo Kheng Hong membeli United Tractors di harga sekitar Rp250 per saham.
Beberapa tahun kemudian, nilainya sudah meningkat berkali-kali lipat, bahkan pernah berada di kisaran sekitar Rp15 ribu.
Tapi tentu saja, ini adalah contoh dari masa lalu.
Nggak semua investasi akan memberikan hasil seperti ini.

**Beat anchors**
- "krisis 1998" — 03:49.1 · f13750
- "Rp250" — 03:54.3 · f14063
- "berkali-kali lipat" — 03:58.3 · f14300
- "Rp15 ribu" — 04:01.6 · f14500
- "Tapi tentu saja" — 04:02.6 · f14560
- "Nggak semua" — 04:06.3 · f14782

**VISUAL**
Kartu UNTR dari SC13 pindah ke tengah (continuity).
f13750: chip tahun **Krisis 1998**. f14063: label harga **± Rp250 / saham**.
f14300: panah panjang ke kanan atas — **beberapa tahun kemudian** — dan f14500 label **± Rp15 ribu**. Hanya dua angka yang diucapkan narasi; **tanpa grafik harga** (tidak ada data yang diberikan untuk itu).
f14560: semuanya meredup di balik kotak peringatan — **Contoh dari masa lalu**; f14782 baris **Nggak semua investasi akan memberikan hasil seperti ini.**
Akhiri: peringatan di depan, cerita di belakang.

### SCENE 15 — f15039–16018 · 04:09.649–04:26.966 · **17.32 s**
**NARRATION** (VO 04:09.732–04:26.799)
Yang menarik dari cerita ini sebenarnya bukan: “Cari saham yang bisa naik berkali-kali.”
Yang lebih penting justru prosesnya.
Kerja untuk menghasilkan uang, sisihkan sebagian, pelajari asetnya, beli sesuatu yang benar-benar dipahami, lalu beri waktu untuk berkembang.

**Beat anchors**
- "Cari saham" — 04:12.1 · f15133
- "Yang lebih penting" — 04:15.1 · f15312
- **"Kerja untuk"** — 04:17.7 · **f15464**
- **"sisihkan"** — 04:19.1 · **f15552**
- **"pelajari"** — 04:20.7 · **f15648**
- **"beli"** — 04:21.8 · **f15712**
- **"lalu beri waktu"** — 04:24.7 · **f15884**

> ⚠ Lima langkah mendarat di kata masing-masing (88 / 96 / 64 / 172 f).

**VISUAL**
f15133: kotak garis-putus TA07 — **“Cari saham yang bisa naik berkali-kali.”** — lalu dicoret saat "Yang lebih penting" (f15312).
Rel lima langkah: **1 Kerja · 2 Sisihkan · 3 Pelajari · 4 Beli yang dipahami · 5 Beri waktu**, tiap langkah menyala di katanya.
Akhiri: rel lima langkah penuh.

## PENUTUP

### SCENE 16 — f16078–16894 · 04:26.966–04:41.566 · **14.60 s**
**NARRATION** (VO 04:27.132–04:41.232)
Jadi membangun passive income bukan berarti kita harus lari dari pekerjaan.
Kita tetap bisa bangun karier, urus keluarga, dan menikmati hidup sekarang.
Bedanya, sebagian hasil kerja kita hari ini mulai ikut disiapkan untuk masa depan.

**Beat anchors**
- "lari dari" — 04:29.8 · f16192
- "Kita tetap bisa" — 04:31.8 · f16314
- "urus keluarga" — 04:33.4 · f16407
- "menikmati hidup" — 04:34.6 · f16482
- "Bedanya" — 04:36.4 · f16586
- "masa depan" — 04:40.5 · f16836

**VISUAL**
Si pekerja (pose 01) di tengah. f16192: label **Lari dari pekerjaan** — dicoret.
Tiga chip ✓ di katanya: **Bangun karier · Urus keluarga · Menikmati hidup**.
f16586: bar **hasil kerja hari ini** dibelah — sebagian besar **Hari ini** (indigo), sepotong **Masa depan** (cyan, f16836).
Akhiri: bar terbelah dua warna.

### SCENE 17 — f16954–18106 · 04:41.566–05:01.766 · **20.20 s**
**NARRATION** (VO 04:41.899–05:01.666)
Di awal, aset kita mungkin masih kecil.
Tapi kalau kemampuan kerja terus berkembang, income bertambah, dan aset juga ikut tumbuh, pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial.
Kita juga mulai punya lebih banyak pilihan. Jadi setiap kali income masuk, coba tanya: “Berapa yang bisa aku sisihkan untuk mulai punya aset?”

**Beat anchors**
- "Di awal" — 04:41.8 · f16914
- "Tapi kalau" — 04:44.6 · f17080
- "income bertambah" — 04:46.6 · f17198
- "dan aset juga" — 04:47.5 · f17256
- "pelan-pelan" — 04:49.2 · f17354
- "lebih banyak pilihan" — 04:53.7 · f17627
- "Jadi setiap" — 04:55.4 · f17728
- “Berapa…” — 04:58.5 · f17912

**VISUAL**
Tiga bar: **Kemampuan · Income · Aset**. f16914 Aset masih pendek. f17080 / f17198 / f17256 ketiganya naik bergantian.
f17354: dua pilar — **Kerja** (indigo) dan **Aset** (cyan) — menopang satu atap **Kekuatan finansial**. f17627: dari atap itu tumbuh beberapa cabang **Pilihan**.
f17728: kotak garis-putus TA07 diketik — **“Berapa yang bisa aku sisihkan untuk mulai punya aset?”**, **mulai punya aset** ber-tint cyan.
Akhiri: pertanyaan itu, menyala.

### SCENE 18 — f18166–19300 · 05:01.766–05:21.666 · **19.90 s**
**NARRATION** (VO 05:01.866–05:18.232)
Karena pada akhirnya, kerja berarti kita menggunakan waktu untuk menghasilkan uang.
Sedangkan investasi, membuat sebagian uang yang sudah kita hasilkan ikut bekerja untuk masa depan.
Jadi kita pelan-pelan berubah dari sekadar pekerja menjadi pekerja yang juga punya aset.

**Beat anchors**
- "kerja berarti" — 05:03.0 · f18184
- "Sedangkan investasi" — 05:06.8 · f18410
- "ikut bekerja" — 05:10.7 · f18648
- "Jadi kita" — 05:13.1 · f18792
- "menjadi pekerja" — 05:16.3 · f18984

**VISUAL**
Dua baris, gaya Rules TA11: **Kerja** → *Waktu jadi uang* (indigo) (f18184) · **Investasi** → *Uang ikut bekerja* (cyan) (f18410 / f18648).
f18792: semuanya bersih; quote card penutup TA09 di atas grid, Tuntun mark melayang di atasnya — **Dari sekadar pekerja, menjadi pekerja yang juga punya aset.** dengan **juga punya aset** ber-tint cyan (f18984). Si pekerja (pose 05) di samping kartu.
Tahan sampai f19300.

---

## Continuity groups

- **Alur Kerja → Penghasilan → Aset** — satu komponen, muncul di SC01 (2 node + Hidup), SC04 (node Aset lahir), SC08 (jadi estafet), SC18 (kalimat penutup). Bukan satu mount yang sama (scene-scene di antaranya jauh), tapi geometri dan warnanya identik supaya terbaca sebagai benda yang sama.
- **CG-A · SC07 + SC08** — dua warna aset. Kolom Human/Financial di SC07 berubah menjadi dua lapisan di sumbu umur SC08 tanpa cut: warna dan urutan kiri-kanan sama.
- **CG-B · SC13 + SC14** — garis waktu Lo Kheng Hong. Kartu UNTR di ujung garis waktu SC13 adalah kartu yang sama yang ke tengah di SC14.
- **Si pekerja** — satu tokoh, berganti pose, di SC01–03, SC09, SC16, SC18.

---

## Open items

- **Typo di script asli:** "pelajari asetnya,cbeli sesuatu" → ditulis **"pelajari asetnya, beli sesuatu"**. Simon: ok.
- **Placeholder — logo:** BCA (BBCA), Indofood CBP (ICBP), Ultrajaya (ULTJ), United Tractors (UNTR) saat ini kartu teks (nama + kode saham), bukan logo. Diganti dengan logo asli begitu filenya ada — tidak digambar ulang.
- **Placeholder — foto:** Lo Kheng Hong saat ini kartu nama saja.
- **UNTR**: hanya dua angka dari narasi (± Rp250 di 1998, ± Rp15 ribu kemudian), tanpa grafik.
- **SC05**: 100 → 110 → 121 → 133 adalah ilustrasi (10% per periode); bukan data pasar.
- **Label roadmap** (Gaji & Waktu · Uang Yang Ikut Bekerja · Ikut Punya Bisnis · Cerita Lo Kheng Hong) — usulan, silakan ganti.
