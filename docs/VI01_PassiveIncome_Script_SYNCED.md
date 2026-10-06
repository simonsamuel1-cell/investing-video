# VI01 — PASSIVE INCOME
## Script re-timed against the recorded VO

**Source of timing:** `INV01 - Main VO.srt` (Premiere STT) → `assets/VI01_PassiveIncome_Sub_CORRECTED.srt`
**VO file:** `INV01 - Main VO.MP3` → `public/vo/passive-income.mp3` — durasi audio **317.990 s (05:17.989)**
**VO length (SRT):** kata terakhir keluar 05:17.899 · **f19074 @ 60 fps** · comp length **19,280 f (05:21.333)** — 206 f / 3.4 s tail untuk menahan quote penutup
**Episode folder:** `src/episodes/vi01-passive-income/` · composition **`VI01-PassiveIncome`** · fps **60**
**Original script estimate:** 04:10 → rekaman nyata **05:18.0 (termasuk jeda 0,5 s + 0,5 s + 0,33 s), +68.0 s lebih panjang.** Semua timestamp di script asli mati; pakai hanya tabel di bawah. Script dengan timing baru: `docs/VI01_PassiveIncome_Script_RETIMED.txt`.

### Cara subtitle dibuat ulang
`scripts/vi01-align.py` — kata-kata script dicocokkan ke kata-kata SRT (waktunya dari SRT), lalu:
- **satu cue = satu kalimat**, satu baris. Kalimat yang terlalu lebar untuk satu baris (diukur dengan font aslinya, Plus Jakarta Sans 36px, maks 1560 px) dipotong — hanya di titik dua, koma, atau jeda bicara, tidak pernah di tengah frasa;
- batas kalimat yang jatuh **di dalam** satu cue SRT (mis. "…kita tunggu: GAJIAN. Kita kerja, …") dipindah ke 20 ms paling sunyi di audio dekat perkiraan — itu napas si pembicara;
- tulisan 100% dari script asli (huruf kapital, tanda baca). Yang dibetulkan dari SRT: *pasif → passive, human aset → human asset, finansial aset → financial asset, lokeng Hong → Lo Kheng Hong, bca → BCA, karir → karier, sekedar → sekadar, 50.100 ribu → Rp50 ribu, Rp100 ribu, 15.000 → Rp15 ribu, Aku → aku, cebeli → beli*.

Hasil: **86 cue dari 65 kalimat**, cue terlebar 1554 px.

Dua timing per scene:
- **VO** — kata pertama masuk / kata terakhir keluar.
- **BLOCK** — blok scene kontinu, dipotong di **titik tengah keheningan** antar scene; blok bertemu ujung-ke-ujung, timeline utuh f0 → f19280.

---

## ⚠ Jeda di VO

| Di | Panjang | Kenapa |
|---|---|---|
| f150 (00:02.500, antara "tunggu:" dan "GAJIAN") | **+30 f / 0.5 s** | Simon, 2026-10-06: "Di frame 150, beri jeda 30 frame (VO dan scene visual)" |
| f230 (00:03.833, antara "GAJIAN." dan "Kita kerja") | **+30 f / 0.5 s** | Simon, 2026-10-06: "230 kasih jeda 30 frame" — setelahnya GAJIAN + kalender naik keluar, foto "Orang Kerja" naik dari bawah ke tengah |
| f530 (00:08.833, saat enam ikon belanja selesai muncul) | **+20 f / 0.33 s** | Simon, 2026-10-06: "530 kasih jeda 20 frame. visual dan vo geser" |

Semua angka di dokumen ini sudah termasuk jeda itu. VO dibangun ulang dari file asli oleh `scripts/vi01-vo.py` (daftar jeda: `src/episodes/vi01-passive-income/data/pads.json`); subtitle oleh `scripts/vi01-align.py`, yang membaca daftar yang sama.

## Master timing table

| Scene | BLOCK (frames) | BLOCK (tc) | Dur | VO in – VO out | Cues | Part |
|---|---|---|---|---|---|---|
| SC01 | 0 – 1019 | 00:00.000 – 00:16.983 | 16.98 s | 00:00.166 – 00:16.699 | 1–4 | cold open |
| SC02 | 1019 – 2113 | 00:16.983 – 00:35.216 | 18.23 s | 00:17.266 – 00:34.999 | 5–9 | cold open |
| SC03 | 2113 – 3105 | 00:35.216 – 00:51.750 | 16.53 s | 00:35.433 – 00:51.599 | 10–14 | cold open |
| SC04 | 3105 – 4058 | 00:51.750 – 01:07.633 | 15.88 s | 00:51.899 – 01:07.433 | 15–18 | 01 |
| SC05 | 4058 – 5355 | 01:07.633 – 01:29.250 | 21.62 s | 01:07.833 – 01:29.033 | 19–23 | 01 |
| SC06 | 5355 – 6437 | 01:29.250 – 01:47.283 | 18.03 s | 01:29.466 – 01:47.233 | 24–28 | 01 |
| SC07 | 6437 – 7648 | 01:47.283 – 02:07.466 | 20.18 s | 01:47.333 – 02:07.199 | 29–35 | 01 |
| SC08 | 7648 – 8602 | 02:07.466 – 02:23.366 | 15.90 s | 02:07.733 – 02:23.233 | 36–39 | 01 |
| SC09 | 8602 – 9624 | 02:23.366 – 02:40.400 | 17.03 s | 02:23.499 – 02:40.199 | 40–43 | 02 |
| SC10 | 9624 – 10680 | 02:40.400 – 02:58.000 | 17.60 s | 02:40.599 – 02:57.799 | 44–49 | 02 |
| SC11 | 10680 – 11766 | 02:58.000 – 03:16.100 | 18.10 s | 02:58.199 – 03:15.833 | 50–54 | 02 |
| SC12 | 11766 – 12553 | 03:16.100 – 03:29.216 | 13.12 s | 03:16.366 – 03:29.033 | 55–58 | 02 |
| SC13 | 12553 – 13689 | 03:29.216 – 03:48.150 | 18.93 s | 03:29.399 – 03:48.066 | 59–63 | 03 |
| SC14 | 13689 – 14959 | 03:48.150 – 04:09.316 | 21.17 s | 03:48.233 – 04:09.233 | 64–68 | 03 |
| SC15 | 14959 – 15998 | 04:09.316 – 04:26.633 | 17.32 s | 04:09.399 – 04:26.466 | 69–72 | 03 |
| SC16 | 15998 – 16874 | 04:26.633 – 04:41.233 | 14.60 s | 04:26.799 – 04:40.899 | 73–75 | close |
| SC17 | 16874 – 18086 | 04:41.233 – 05:01.433 | 20.20 s | 04:41.566 – 05:01.333 | 76–82 | close |
| SC18 | 18086 – 19280 | 05:01.433 – 05:21.333 | 19.90 s | 05:01.533 – 05:17.899 | 83–86 | close |

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
| ST1 — cold open → bab 1 | SC03 → SC04 | 0.30 s | **3070 – 3240** |
| ST2 — bab 1 → bab 2 | SC08 → SC09 | 0.27 s | **8566 – 8736** |
| ST3 — bab 2 → bab 3 | SC12 → SC13 | 0.37 s | **12517 – 12687** |

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

### SCENE 02 — f1079–2113 · 00:16.983–00:35.216 · **18.23 s**
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

### SCENE 03 — f2173–3105 · 00:35.216–00:51.750 · **16.53 s**
**NARRATION** (VO 00:35.433–00:51.599)
Masalahnya, sehari tetap cuma 24 jam.
Semakin dewasa, tanggung jawab biasanya justru makin banyak.
Jadi selain bertanya, “Gimana caranya aku bisa menghasilkan lebih banyak?”
Kita juga perlu mulai bertanya: “Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”

**Beat anchors**
- "24 jam" — 00:37.4 · f2245
- "Semakin dewasa" — 00:38.4 · f2304
- "Jadi selain" — 00:42.6 · f2558
- "Kita juga perlu" — 00:47.3 · f2838
- "ikut bekerja" — 00:50.8 · f3048

**VISUAL**
Satu bar hari: **24 kotak jam**. f2304: kotak-kotaknya terisi blok tanggung jawab (Kerja, Perjalanan, Keluarga, Istirahat…) sampai penuh — tidak ada kotak kosong tersisa. Si pekerja pose 04.
Bar mundur ke atas. f2558: pertanyaan pertama di kotak garis-putus TA07, diketik — **“Gimana caranya aku bisa menghasilkan lebih banyak?”**
f2838: pertanyaan pertama meredup dan bergeser; pertanyaan kedua diketik di bawahnya — **“Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”**, dengan **ikut bekerja** ber-tint cyan tepat di f3048.
Akhiri: pertanyaan kedua menyala, pertanyaan pertama redup.

**→ SCENE TRANSISI 1 overlay f3130–3240** — SC03 dilipat ke kartu atas **Gaji & Waktu**, tiga kartu bab terbuka, kartu 1 **Uang Yang Ikut Bekerja** menyala, kamera masuk.

## PART 01 — UANG YANG IKUT BEKERJA

### SCENE 04 — f3165–4058 · 00:51.750–01:07.633 · **15.88 s**
**NARRATION** (VO 00:51.899–01:07.433)
Di sinilah konsep passive income mulai masuk.
Bukan berarti investasi hari ini, lalu besok langsung berhenti kerja.
Kita tetap kerja, tetap bangun karier, dan tetap belajar.
Bedanya, sebagian uang yang kita hasilkan mulai kita ubah menjadi aset.

**Beat anchors**
- "passive income" — 00:52.9 · f3178
- "Bukan berarti" — 00:55.0 · f3304
- "lalu besok" — 00:57.2 · f3436
- "Kita tetap kerja" — 00:59.4 · f3568
- "Bedanya" — 01:03.1 · f3788
- "menjadi aset" — 01:06.6 · f3998

**VISUAL**
Judul besar di tengah **Passive Income** (f3178), lalu naik ke posisi judul.
f3304: anggapan yang salah ditulis — **Investasi hari ini → besok berhenti kerja** — dan dicoret di f3436 (Strike, merah hanya di kata yang menamai kesalahan).
f3568: tiga chip ✓ — **Tetap kerja · Tetap bangun karier · Tetap belajar**.
f3788: alur SC01 kembali (**Kerja → Penghasilan**), lalu sebagian Penghasilan terpisah dan mengalir ke node baru **Aset** (cyan) di f3998.
Akhiri: Kerja → Penghasilan → **Aset**.

### SCENE 05 — f4118–5355 · 01:07.633–01:29.250 · **21.62 s**
**NARRATION** (VO 01:07.833–01:29.033)
Dan di sini, waktu punya peran besar.
Kalau sebuah aset menghasilkan keuntungan, keuntungan itu bisa ikut menghasilkan keuntungan berikutnya.
Misalnya, 100 jadi 110, lalu 121, lalu 133.
Itulah konsep compounding: hasil yang terus ikut bertumbuh seiring waktu.

**Beat anchors**
- "waktu punya peran besar" — 01:09.1 · f4148
- "keuntungan itu" — 01:13.3 · f4398
- "Misalnya" / "100" — 01:16.7 · f4604
- **"110"** — 01:19.0 · **f4744**
- **"121"** — 01:20.6 · **f4838**
- **"133"** — 01:22.9 · **f4977**
- "compounding" — 01:25.5 · f5132

> ⚠ Angka **mendarat di kata yang diucapkan** (140 / 94 / 139 f) — tidak rata.

**VISUAL**
Sumbu waktu horizontal (f4148). Empat batang tumbuh satu per angka: **100 → 110 → 121 → 133**. Tiap batang = batang sebelumnya (cyan pucat) + tambahan baru di atasnya (cyan penuh); dari batang ketiga, tambahan itu dibelah dua: bagian dari modal awal dan bagian **dari keuntungan sebelumnya** — itu yang dinamai f4398 "keuntungan itu bisa ikut menghasilkan keuntungan".
f5132: judul **Compounding** dan baris di bawahnya — **hasil yang terus ikut bertumbuh seiring waktu**.
Angka ini ilustrasi (10% per periode, 133,1 dibulatkan) — bukan data pasar.
Akhiri: empat batang + kata Compounding.

### SCENE 06 — f5415–6437 · 01:29.250–01:47.283 · **18.03 s**
**NARRATION** (VO 01:29.466–01:47.233)
Makanya, kita nggak harus nunggu punya modal besar dulu.
Yang penting adalah mulai membangun kebiasaannya.
Karena investasi bukan cuma soal uang.
Semakin sering kita belajar dan mengevaluasi keputusan,
semakin baik juga kemampuan kita mengelola aset.

**Beat anchors**
- "modal besar" — 01:31.9 · f5516
- "kebiasaannya" — 01:35.8 · f5751
- "Karena investasi" — 01:37.3 · f5838
- "Semakin sering" — 01:40.1 · f6006
- "semakin baik" — 01:43.8 · f6232

**VISUAL**
f5516: tumpukan uang besar berlabel **Modal besar dulu?** — dicoret.
f5751: kalender kebiasaan — kotak-kotak bulan terisi ✓ satu per satu (streak), label **Kebiasaan**.
f6006: siklus tiga node berputar — **Belajar → Evaluasi keputusan → Kelola aset** — dan tiap putaran, bar **Kemampuan** di sampingnya naik satu tingkat (f6232).
Akhiri: siklus + bar kemampuan naik.

### SCENE 07 — f6497–7648 · 01:47.283–02:07.466 · **20.18 s**
**NARRATION** (VO 01:47.333–02:07.199)
Kalau dipikir-pikir, kekayaan kita punya dua bagian.
Yang pertama, human asset: waktu, kemampuan, dan pengalaman yang membantu kita menghasilkan uang.
Yang kedua, financial asset: tabungan, investasi, dan aset yang kita bangun dari penghasilan tadi.
Human asset punya batas. Financial asset bisa terus kita miliki.

**Beat anchors**
- "dua bagian" — 01:49.2 · f6553
- "human asset" — 01:50.8 · f6650
- "financial asset" — 01:57.3 · f7037
- "punya batas" — 02:03.9 · f7435
- "Financial asset bisa" — 02:04.7 · f7487

**VISUAL**
Satu kartu dibelah dua (f6553): kiri **Human Asset** (indigo), kanan **Financial Asset** (cyan).
Kiri, di f6650: **Waktu · Kemampuan · Pengalaman** (tiga baris dengan ikon). Kanan, di f7037: **Tabungan · Investasi · Aset**.
f7435: di bawah Human Asset muncul jam pasir yang menipis — **Punya batas**. f7487: di bawah Financial Asset garis yang terus naik — **Bisa terus dimiliki**.
Akhiri: dua kolom, dua nasib.

### SCENE 08 — f7708–8602 · 02:07.466–02:23.366 · **15.90 s**
**NARRATION** (VO 02:07.733–02:23.233)
Waktu masih muda, wajar kalau sebagian besar penghasilan datang dari kerja.
Tapi idealnya, saat income kita meningkat, aset kita juga ikut tumbuh.
Bayangin seperti estafet: kita kerja untuk menghasilkan uang, lalu sebagian uang itu kita teruskan untuk membangun aset.

**Beat anchors**
- "Waktu masih muda" — 02:07.7 · f7664
- "Tapi idealnya" — 02:11.9 · f7914
- "estafet" — 02:17.0 · f8224
- "lalu sebagian" — 02:19.6 · f8380

**VISUAL**
Dua warna SC07 dibawa ke sumbu umur (**Muda → Tua**): di kiri hampir semua penghasilan indigo (dari kerja); f7914 kedua lapisan naik, lapisan cyan (aset) makin tebal ke kanan. Ilustrasi bentuk, tanpa angka.
f8224: berganti ke **estafet** — dua pelari: **Kerja** (indigo) membawa tongkat **Uang**, f8380 menyerahkannya ke pelari **Aset** (cyan).
Akhiri: tongkat berpindah tangan.

**→ SCENE TRANSISI 2 overlay f8626–8736** — SC08 dilipat ke kartu 1, kartu 2 **Ikut Punya Bisnis** menyala, kamera masuk.

## PART 02 — IKUT PUNYA BISNIS

### SCENE 09 — f8662–9624 · 02:23.366–02:40.400 · **17.03 s**
**NARRATION** (VO 02:23.499–02:40.199)
Hal menarik dari investasi adalah:
kita nggak harus bekerja di sebuah perusahaan untuk ikut memiliki sebagian dari bisnisnya.
Ada orang yang bekerja di BCA untuk mendapatkan penghasilan.
Di sisi lain, sebagai investor, kita juga bisa punya sebagian kecil dari bisnis BCA.

**Beat anchors**
- "kita nggak harus" — 02:25.8 · f8750
- "Ada orang" — 02:31.6 · f9100
- "BCA" — 02:32.9 · f9174
- "Di sisi lain" — 02:35.4 · f9328
- "sebagian kecil" — 02:38.5 · f9513

**VISUAL**
Satu gedung perusahaan di tengah: kartu **Bank Central Asia · BBCA**.
f9100: di kiri, si pekerja (pose 01) — panah **kerja** masuk ke gedung, panah **gaji** kembali (indigo). Label **Karyawan**.
f9328: di kanan, orang kedua — tidak ada panah kerja; sebuah irisan kecil gedung terangkat dan mendarat di tangannya (cyan, f9513). Label **Investor**.
Akhiri: satu perusahaan, dua cara terhubung — Karyawan (gaji) / Investor (sebagian kecil bisnis).

### SCENE 10 — f9684–10680 · 02:40.400–02:58.000 · **17.60 s**
**NARRATION** (VO 02:40.599–02:57.799)
Hal yang sama sebenarnya ada di sekitar kita setiap hari.
Kita makan Indomie, minum Ultra Milk, dan menggunakan banyak produk dari perusahaan besar.
Sebagai konsumen, kita menikmati produknya.
Tapi lewat investasi, kita juga bisa ikut punya sebagian kecil dari bisnis di balik produk-produk itu.

**Beat anchors**
- "Indomie" — 02:44.8 · f9888
- "Ultra Milk" — 02:45.7 · f9944
- "dan menggunakan" — 02:46.5 · f9992
- "Sebagai konsumen" — 02:49.0 · f10144
- "Tapi lewat" — 02:52.5 · f10350
- "di balik" — 02:56.4 · f10584

**VISUAL**
Kartu produk mendarat satu per kata: **Indomie** (f9888), **Ultra Milk** (f9944), lalu dua kartu produk generik (f9992). Label kiri atas **Konsumen** (f10144).
f10350: kartu-kartu itu **berbalik** — di belakangnya perusahaan dan kodenya: **Indofood CBP · ICBP**, **Ultrajaya · ULTJ**. Label berganti **Pemilik (sebagian kecil)** di f10584.
`[NEEDS ASSET: foto/kemasan produk Indomie & Ultra Milk — opsional; tanpa itu kartunya teks + ilustrasi sederhana, bukan logo tiruan]`
Akhiri: produk di depan, bisnis di belakangnya.

### SCENE 11 — f10740–11766 · 02:58.000–03:16.100 · **18.10 s**
**NARRATION** (VO 02:58.199–03:15.833)
Dan di sinilah bedanya antara sekadar menghasilkan uang, dengan mulai membangun aset.
Sebuah bisnis bisa menghasilkan pendapatan, mencetak laba, lalu memakai laba itu untuk berkembang lebih jauh.
Sebagai pemilik sebagian dari bisnis tersebut, kita ikut punya exposure terhadap pertumbuhan nilainya.

**Beat anchors**
- "bedanya" — 02:58.9 · f10739
- "dengan mulai" — 03:02.5 · f10950
- "pendapatan" — 03:06.1 · f11168
- "mencetak laba" — 03:06.7 · f11202
- "lalu memakai" — 03:07.7 · f11266
- "exposure" — 03:13.4 · f11608

**VISUAL**
f10739: dua label berhadapan — **Menghasilkan uang** (indigo) vs **Membangun aset** (cyan, f10950).
f11168: roda bisnis tiga node — **Pendapatan → Laba (f11202) → Berkembang (f11266)** — dan tiap putaran rodanya membesar.
f11608: irisan kecil roda itu disorot cyan — **Pemilik ikut punya exposure ke pertumbuhan nilainya**. Tanpa angka, tanpa grafik harga.
Akhiri: roda yang tumbuh + irisan pemilik.

### SCENE 12 — f11826–12553 · 03:16.100–03:29.216 · **13.12 s**
**NARRATION** (VO 03:16.366–03:29.033)
Dan mulainya nggak harus besar. Bisa Rp50 ribu, Rp100 ribu, atau Rp300 ribu.
Yang paling penting bukan nominal pertamanya, tapi kebiasaan untuk menyisihkan sebagian income dan mulai mengubahnya menjadi aset.

**Beat anchors**
- **"Rp50"** — 03:18.4 · **f11905**
- **"Rp100"** — 03:18.9 · **f11933**
- **"Rp300"** — 03:20.2 · **f12016**
- "Yang paling" — 03:21.5 · f12094
- "tapi kebiasaan" — 03:23.9 · f12234
- "mengubahnya" — 03:27.5 · f12453

> ⚠ Tiga nominal hanya 28 f lalu 83 f terpisah — chip harus cepat (pop UI, bukan reveal teks).

**VISUAL**
Tiga chip nominal: **Rp50 ribu · Rp100 ribu · Rp300 ribu** di kata masing-masing.
f12094: ketiganya meredup — "bukan nominal pertamanya".
f12234: barisan bulan (Jan…Des): tiap bulan bar income masuk, sepotong kecil di atasnya dipotong dan jatuh ke toples **Aset** (cyan) — berulang, toples terisi. f12453 label **Kebiasaan menyisihkan**.
Akhiri: toples yang terisi pelan-pelan.

**→ SCENE TRANSISI 3 overlay f12577–12687** — SC12 dilipat ke kartu 2, kartu 3 **Cerita Lo Kheng Hong** menyala, kamera masuk.

## PART 03 — CERITA LO KHENG HONG

### SCENE 13 — f12613–13689 · 03:29.216–03:48.150 · **18.93 s**
**NARRATION** (VO 03:29.399–03:48.066)
Lo Kheng Hong juga nggak langsung mulai sebagai investor besar.
Sebelum dikenal seperti sekarang, dia pernah bekerja sebagai pegawai bank.
Sambil bekerja, dia menabung, belajar, membaca laporan perusahaan, dan pelan-pelan mulai berinvestasi.
Salah satu contoh terkenalnya adalah saat dia membeli saham United Tractors.

**Beat anchors**
- "Lo Kheng Hong" — 03:29.4 · f12564
- "pegawai bank" — 03:36.7 · f13006
- "menabung" — 03:38.5 · f13111
- "membaca laporan" — 03:39.5 · f13175
- "pelan-pelan" — 03:41.3 · f13278
- "United Tractors" — 03:46.6 · f13600

**VISUAL**
Kartu nama **Lo Kheng Hong** (f12564). `[NEEDS ASSET: foto Lo Kheng Hong — opsional; tanpa foto, kartu nama saja]`
Garis waktu kiri → kanan, satu titik per kata: **Pegawai bank** (f13006) → **Menabung** (f13111) → **Belajar & membaca laporan perusahaan** (f13175) → **Mulai berinvestasi** (f13278).
f13600: titik terakhir — kartu **United Tractors · UNTR**.
Akhiri: garis waktu dengan UNTR di ujungnya (dibawa ke SC14).

### SCENE 14 — f13749–14959 · 03:48.150–04:09.316 · **21.17 s**
**NARRATION** (VO 03:48.233–04:09.233)
Saat krisis 1998, Lo Kheng Hong membeli United Tractors di harga sekitar Rp250 per saham.
Beberapa tahun kemudian, nilainya sudah meningkat berkali-kali lipat, bahkan pernah berada di kisaran sekitar Rp15 ribu.
Tapi tentu saja, ini adalah contoh dari masa lalu.
Nggak semua investasi akan memberikan hasil seperti ini.

**Beat anchors**
- "krisis 1998" — 03:48.8 · f13730
- "Rp250" — 03:54.0 · f14043
- "berkali-kali lipat" — 03:58.0 · f14280
- "Rp15 ribu" — 04:01.3 · f14480
- "Tapi tentu saja" — 04:02.3 · f14540
- "Nggak semua" — 04:06.0 · f14762

**VISUAL**
Kartu UNTR dari SC13 pindah ke tengah (continuity).
f13730: chip tahun **Krisis 1998**. f14043: label harga **± Rp250 / saham**.
f14280: panah panjang ke kanan atas — **beberapa tahun kemudian** — dan f14480 label **± Rp15 ribu**. Hanya dua angka yang diucapkan narasi; **tanpa grafik harga** (tidak ada data yang diberikan untuk itu).
f14540: semuanya meredup di balik kotak peringatan — **Contoh dari masa lalu**; f14762 baris **Nggak semua investasi akan memberikan hasil seperti ini.**
Akhiri: peringatan di depan, cerita di belakang.

### SCENE 15 — f15019–15998 · 04:09.316–04:26.633 · **17.32 s**
**NARRATION** (VO 04:09.399–04:26.466)
Yang menarik dari cerita ini sebenarnya bukan: “Cari saham yang bisa naik berkali-kali.”
Yang lebih penting justru prosesnya.
Kerja untuk menghasilkan uang, sisihkan sebagian, pelajari asetnya, beli sesuatu yang benar-benar dipahami, lalu beri waktu untuk berkembang.

**Beat anchors**
- "Cari saham" — 04:11.8 · f15113
- "Yang lebih penting" — 04:14.8 · f15292
- **"Kerja untuk"** — 04:17.4 · **f15444**
- **"sisihkan"** — 04:18.8 · **f15532**
- **"pelajari"** — 04:20.4 · **f15628**
- **"beli"** — 04:21.5 · **f15692**
- **"lalu beri waktu"** — 04:24.4 · **f15864**

> ⚠ Lima langkah mendarat di kata masing-masing (88 / 96 / 64 / 172 f).

**VISUAL**
f15113: kotak garis-putus TA07 — **“Cari saham yang bisa naik berkali-kali.”** — lalu dicoret saat "Yang lebih penting" (f15292).
Rel lima langkah: **1 Kerja · 2 Sisihkan · 3 Pelajari · 4 Beli yang dipahami · 5 Beri waktu**, tiap langkah menyala di katanya.
Akhiri: rel lima langkah penuh.

## PENUTUP

### SCENE 16 — f16058–16874 · 04:26.633–04:41.233 · **14.60 s**
**NARRATION** (VO 04:26.799–04:40.899)
Jadi membangun passive income bukan berarti kita harus lari dari pekerjaan.
Kita tetap bisa bangun karier, urus keluarga, dan menikmati hidup sekarang.
Bedanya, sebagian hasil kerja kita hari ini mulai ikut disiapkan untuk masa depan.

**Beat anchors**
- "lari dari" — 04:29.5 · f16172
- "Kita tetap bisa" — 04:31.5 · f16294
- "urus keluarga" — 04:33.1 · f16387
- "menikmati hidup" — 04:34.3 · f16462
- "Bedanya" — 04:36.1 · f16566
- "masa depan" — 04:40.2 · f16816

**VISUAL**
Si pekerja (pose 01) di tengah. f16172: label **Lari dari pekerjaan** — dicoret.
Tiga chip ✓ di katanya: **Bangun karier · Urus keluarga · Menikmati hidup**.
f16566: bar **hasil kerja hari ini** dibelah — sebagian besar **Hari ini** (indigo), sepotong **Masa depan** (cyan, f16816).
Akhiri: bar terbelah dua warna.

### SCENE 17 — f16934–18086 · 04:41.233–05:01.433 · **20.20 s**
**NARRATION** (VO 04:41.566–05:01.333)
Di awal, aset kita mungkin masih kecil.
Tapi kalau kemampuan kerja terus berkembang, income bertambah, dan aset juga ikut tumbuh, pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial.
Kita juga mulai punya lebih banyak pilihan. Jadi setiap kali income masuk, coba tanya: “Berapa yang bisa aku sisihkan untuk mulai punya aset?”

**Beat anchors**
- "Di awal" — 04:41.5 · f16894
- "Tapi kalau" — 04:44.3 · f17060
- "income bertambah" — 04:46.3 · f17178
- "dan aset juga" — 04:47.2 · f17236
- "pelan-pelan" — 04:48.9 · f17334
- "lebih banyak pilihan" — 04:53.4 · f17607
- "Jadi setiap" — 04:55.1 · f17708
- “Berapa…” — 04:58.2 · f17892

**VISUAL**
Tiga bar: **Kemampuan · Income · Aset**. f16894 Aset masih pendek. f17060 / f17178 / f17236 ketiganya naik bergantian.
f17334: dua pilar — **Kerja** (indigo) dan **Aset** (cyan) — menopang satu atap **Kekuatan finansial**. f17607: dari atap itu tumbuh beberapa cabang **Pilihan**.
f17708: kotak garis-putus TA07 diketik — **“Berapa yang bisa aku sisihkan untuk mulai punya aset?”**, **mulai punya aset** ber-tint cyan.
Akhiri: pertanyaan itu, menyala.

### SCENE 18 — f18146–19280 · 05:01.433–05:21.333 · **19.90 s**
**NARRATION** (VO 05:01.533–05:17.899)
Karena pada akhirnya, kerja berarti kita menggunakan waktu untuk menghasilkan uang.
Sedangkan investasi, membuat sebagian uang yang sudah kita hasilkan ikut bekerja untuk masa depan.
Jadi kita pelan-pelan berubah dari sekadar pekerja menjadi pekerja yang juga punya aset.

**Beat anchors**
- "kerja berarti" — 05:02.7 · f18164
- "Sedangkan investasi" — 05:06.5 · f18390
- "ikut bekerja" — 05:10.4 · f18628
- "Jadi kita" — 05:12.8 · f18772
- "menjadi pekerja" — 05:16.0 · f18964

**VISUAL**
Dua baris, gaya Rules TA11: **Kerja** → *Waktu jadi uang* (indigo) (f18164) · **Investasi** → *Uang ikut bekerja* (cyan) (f18390 / f18628).
f18772: semuanya bersih; quote card penutup TA09 di atas grid, Tuntun mark melayang di atasnya — **Dari sekadar pekerja, menjadi pekerja yang juga punya aset.** dengan **juga punya aset** ber-tint cyan (f18964). Si pekerja (pose 05) di samping kartu.
Tahan sampai f19280.

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
