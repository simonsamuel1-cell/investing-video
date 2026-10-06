# VI01 — PASSIVE INCOME
## Script re-timed against the recorded VO

**Source of timing:** `INV01 - Main VO.srt` (Premiere STT) → `assets/VI01_PassiveIncome_Sub_CORRECTED.srt`
**VO file:** `INV01 - Main VO.MP3` → `public/vo/passive-income.mp3` — durasi audio **317.156 s (05:17.156)**
**VO length (SRT):** kata terakhir keluar 05:17.066 · **f19024 @ 60 fps** · comp length **19,230 f (05:20.500)** — 206 f / 3.4 s tail untuk menahan quote penutup
**Episode folder:** `src/episodes/vi01-passive-income/` · composition **`VI01-PassiveIncome`** · fps **60**
**Original script estimate:** 04:10 → rekaman nyata **05:17.2 (termasuk jeda 0,5 s di f150), +67.2 s lebih panjang.** Semua timestamp di script asli mati; pakai hanya tabel di bawah. Script dengan timing baru: `docs/VI01_PassiveIncome_Script_RETIMED.txt`.

### Cara subtitle dibuat ulang
`scripts/vi01-align.py` — kata-kata script dicocokkan ke kata-kata SRT (waktunya dari SRT), lalu:
- **satu cue = satu kalimat**, satu baris. Kalimat yang terlalu lebar untuk satu baris (diukur dengan font aslinya, Plus Jakarta Sans 36px, maks 1560 px) dipotong — hanya di titik dua, koma, atau jeda bicara, tidak pernah di tengah frasa;
- batas kalimat yang jatuh **di dalam** satu cue SRT (mis. "…kita tunggu: GAJIAN. Kita kerja, …") dipindah ke 20 ms paling sunyi di audio dekat perkiraan — itu napas si pembicara;
- tulisan 100% dari script asli (huruf kapital, tanda baca). Yang dibetulkan dari SRT: *pasif → passive, human aset → human asset, finansial aset → financial asset, lokeng Hong → Lo Kheng Hong, bca → BCA, karir → karier, sekedar → sekadar, 50.100 ribu → Rp50 ribu, Rp100 ribu, 15.000 → Rp15 ribu, Aku → aku, cebeli → beli*.

Hasil: **86 cue dari 65 kalimat**, cue terlebar 1554 px.

Dua timing per scene:
- **VO** — kata pertama masuk / kata terakhir keluar.
- **BLOCK** — blok scene kontinu, dipotong di **titik tengah keheningan** antar scene; blok bertemu ujung-ke-ujung, timeline utuh f0 → f19230.

---

## ⚠ Jeda di VO

| Di | Panjang | Kenapa |
|---|---|---|
| f150 (00:02.500, antara "tunggu:" dan "GAJIAN") | **+30 f / 0.5 s** | Simon, 2026-10-06: "Di frame 150, beri jeda 30 frame (VO dan scene visual)" |

Semua angka di dokumen ini sudah termasuk jeda itu. VO dibangun ulang dari file asli oleh `scripts/vi01-vo.py` (daftar jeda: `src/episodes/vi01-passive-income/data/pads.json`); subtitle oleh `scripts/vi01-align.py`, yang membaca daftar yang sama.

## Master timing table

| Scene | BLOCK (frames) | BLOCK (tc) | Dur | VO in – VO out | Cues | Part |
|---|---|---|---|---|---|---|
| SC01 | 0 – 969 | 00:00.000 – 00:16.150 | 16.15 s | 00:00.166 – 00:15.866 | 1–4 | cold open |
| SC02 | 969 – 2063 | 00:16.150 – 00:34.383 | 18.23 s | 00:16.433 – 00:34.166 | 5–9 | cold open |
| SC03 | 2063 – 3055 | 00:34.383 – 00:50.917 | 16.53 s | 00:34.600 – 00:50.766 | 10–14 | cold open |
| SC04 | 3055 – 4008 | 00:50.917 – 01:06.800 | 15.88 s | 00:51.066 – 01:06.600 | 15–18 | 01 |
| SC05 | 4008 – 5305 | 01:06.800 – 01:28.417 | 21.62 s | 01:07.000 – 01:28.200 | 19–23 | 01 |
| SC06 | 5305 – 6387 | 01:28.417 – 01:46.450 | 18.03 s | 01:28.633 – 01:46.400 | 24–28 | 01 |
| SC07 | 6387 – 7598 | 01:46.450 – 02:06.633 | 20.18 s | 01:46.500 – 02:06.366 | 29–35 | 01 |
| SC08 | 7598 – 8552 | 02:06.633 – 02:22.533 | 15.90 s | 02:06.900 – 02:22.400 | 36–39 | 01 |
| SC09 | 8552 – 9574 | 02:22.533 – 02:39.567 | 17.03 s | 02:22.666 – 02:39.366 | 40–43 | 02 |
| SC10 | 9574 – 10630 | 02:39.567 – 02:57.167 | 17.60 s | 02:39.766 – 02:56.966 | 44–49 | 02 |
| SC11 | 10630 – 11716 | 02:57.167 – 03:15.267 | 18.10 s | 02:57.366 – 03:15.000 | 50–54 | 02 |
| SC12 | 11716 – 12503 | 03:15.267 – 03:28.383 | 13.12 s | 03:15.533 – 03:28.200 | 55–58 | 02 |
| SC13 | 12503 – 13639 | 03:28.383 – 03:47.317 | 18.93 s | 03:28.566 – 03:47.233 | 59–63 | 03 |
| SC14 | 13639 – 14909 | 03:47.317 – 04:08.483 | 21.17 s | 03:47.400 – 04:08.400 | 64–68 | 03 |
| SC15 | 14909 – 15948 | 04:08.483 – 04:25.800 | 17.32 s | 04:08.566 – 04:25.633 | 69–72 | 03 |
| SC16 | 15948 – 16824 | 04:25.800 – 04:40.400 | 14.60 s | 04:25.966 – 04:40.066 | 73–75 | close |
| SC17 | 16824 – 18036 | 04:40.400 – 05:00.600 | 20.20 s | 04:40.733 – 05:00.500 | 76–82 | close |
| SC18 | 18036 – 19230 | 05:00.600 – 05:20.500 | 19.90 s | 05:00.700 – 05:17.066 | 83–86 | close |

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
| ST1 — cold open → bab 1 | SC03 → SC04 | 0.30 s | **3020 – 3190** |
| ST2 — bab 1 → bab 2 | SC08 → SC09 | 0.27 s | **8516 – 8686** |
| ST3 — bab 2 → bab 3 | SC12 → SC13 | 0.37 s | **12467 – 12637** |

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

### SCENE 01 — f0–969 · 00:00.000–00:16.150 · **16.15 s**
**NARRATION** (VO 00:00.166–00:15.866)
Setiap bulan, ada satu momen yang selalu kita tunggu: GAJIAN.
Kita kerja, dapat penghasilan, lalu pakai uang itu untuk menjalani hidup.
Tapi coba bayangin kalau suatu hari kita harus berhenti kerja sementara.
Apakah penghasilan kita juga ikut berhenti?

**Beat anchors**
- "GAJIAN" — 00:03.2 · f190
- "Kita kerja" — 00:03.7 · f220
- "berhenti kerja sementara" — 00:11.7 · f701
- "Apakah" — 00:13.8 · f826

**VISUAL**
Grid bergerak pelan. Kartu kalender bulan ini; tanggal-tanggal lewat cepat, lalu berhenti di tanggal gajian — stempel **GAJIAN** jatuh di f190 (pop, satu-satunya pop di scene).
Si pekerja (pose 01) masuk dari kiri. Di sebelahnya tumbuh alur tiga node: **Kerja → Penghasilan → Hidup** (indigo), satu per frasa (f220 / ~f260 / ~f360).
f701 "berhenti kerja sementara": node **Kerja** meredup dan diberi ikon jeda; panah ke Penghasilan putus. Si pekerja ganti ke pose 04 (lesu).
f826: tanda tanya muncul di node Penghasilan — **"Penghasilan ikut berhenti?"**
Akhiri: alur yang terputus di tengah.

### SCENE 02 — f999–2063 · 00:16.150–00:34.383 · **18.23 s**
**NARRATION** (VO 00:16.433–00:34.166)
Makanya, banyak orang berusaha menambah penghasilan.
Ada yang mengejar naik jabatan, belajar skill baru, bangun bisnis, ambil freelance, atau cari side hustle.
Semua itu bagus, tapi hampir semuanya tetap membutuhkan satu hal yang sama: waktu dan tenaga kita.

**Beat anchors**
- "naik jabatan" — 00:21.5 · f1288
- "belajar skill" — 00:22.7 · f1360
- "bangun bisnis" — 00:24.2 · f1452
- "ambil freelance" — 00:25.2 · f1510
- "side hustle" — 00:27.5 · f1652
- "waktu dan tenaga" — 00:32.9 · f1972

> ⚠ Lima chip mendarat **di kata masing-masing** — jaraknya tidak rata (72 / 92 / 58 / 142 f). Jangan dibuat grid rata.

**VISUAL**
Judul **Menambah Penghasilan**. Lima chip muncul satu per kata, menyebar mengelilingi si pekerja (pose 06): **Naik jabatan · Skill baru · Bangun bisnis · Freelance · Side hustle**.
f1972: dari kelima chip ditarik garis ke satu pil di bawah — **Waktu + Tenaga** (indigo, ikon jam & baterai). Semua jalan bertemu di sana.
Akhiri: lima jalan, satu sumber yang sama.

### SCENE 03 — f2093–3055 · 00:34.383–00:50.917 · **16.53 s**
**NARRATION** (VO 00:34.600–00:50.766)
Masalahnya, sehari tetap cuma 24 jam.
Semakin dewasa, tanggung jawab biasanya justru makin banyak.
Jadi selain bertanya, “Gimana caranya aku bisa menghasilkan lebih banyak?”
Kita juga perlu mulai bertanya: “Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”

**Beat anchors**
- "24 jam" — 00:36.6 · f2195
- "Semakin dewasa" — 00:37.6 · f2254
- "Jadi selain" — 00:41.8 · f2508
- "Kita juga perlu" — 00:46.5 · f2788
- "ikut bekerja" — 00:50.0 · f2998

**VISUAL**
Satu bar hari: **24 kotak jam**. f2254: kotak-kotaknya terisi blok tanggung jawab (Kerja, Perjalanan, Keluarga, Istirahat…) sampai penuh — tidak ada kotak kosong tersisa. Si pekerja pose 04.
Bar mundur ke atas. f2508: pertanyaan pertama di kotak garis-putus TA07, diketik — **“Gimana caranya aku bisa menghasilkan lebih banyak?”**
f2788: pertanyaan pertama meredup dan bergeser; pertanyaan kedua diketik di bawahnya — **“Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”**, dengan **ikut bekerja** ber-tint cyan tepat di f2998.
Akhiri: pertanyaan kedua menyala, pertanyaan pertama redup.

**→ SCENE TRANSISI 1 overlay f3050–3190** — SC03 dilipat ke kartu atas **Gaji & Waktu**, tiga kartu bab terbuka, kartu 1 **Uang Yang Ikut Bekerja** menyala, kamera masuk.

## PART 01 — UANG YANG IKUT BEKERJA

### SCENE 04 — f3085–4008 · 00:50.917–01:06.800 · **15.88 s**
**NARRATION** (VO 00:51.066–01:06.600)
Di sinilah konsep passive income mulai masuk.
Bukan berarti investasi hari ini, lalu besok langsung berhenti kerja.
Kita tetap kerja, tetap bangun karier, dan tetap belajar.
Bedanya, sebagian uang yang kita hasilkan mulai kita ubah menjadi aset.

**Beat anchors**
- "passive income" — 00:52.1 · f3128
- "Bukan berarti" — 00:54.2 · f3254
- "lalu besok" — 00:56.4 · f3386
- "Kita tetap kerja" — 00:58.6 · f3518
- "Bedanya" — 01:02.3 · f3738
- "menjadi aset" — 01:05.8 · f3948

**VISUAL**
Judul besar di tengah **Passive Income** (f3128), lalu naik ke posisi judul.
f3254: anggapan yang salah ditulis — **Investasi hari ini → besok berhenti kerja** — dan dicoret di f3386 (Strike, merah hanya di kata yang menamai kesalahan).
f3518: tiga chip ✓ — **Tetap kerja · Tetap bangun karier · Tetap belajar**.
f3738: alur SC01 kembali (**Kerja → Penghasilan**), lalu sebagian Penghasilan terpisah dan mengalir ke node baru **Aset** (cyan) di f3948.
Akhiri: Kerja → Penghasilan → **Aset**.

### SCENE 05 — f4038–5305 · 01:06.800–01:28.417 · **21.62 s**
**NARRATION** (VO 01:07.000–01:28.200)
Dan di sini, waktu punya peran besar.
Kalau sebuah aset menghasilkan keuntungan, keuntungan itu bisa ikut menghasilkan keuntungan berikutnya.
Misalnya, 100 jadi 110, lalu 121, lalu 133.
Itulah konsep compounding: hasil yang terus ikut bertumbuh seiring waktu.

**Beat anchors**
- "waktu punya peran besar" — 01:08.3 · f4098
- "keuntungan itu" — 01:12.5 · f4348
- "Misalnya" / "100" — 01:15.9 · f4554
- **"110"** — 01:18.2 · **f4694**
- **"121"** — 01:19.8 · **f4788**
- **"133"** — 01:22.1 · **f4927**
- "compounding" — 01:24.7 · f5082

> ⚠ Angka **mendarat di kata yang diucapkan** (140 / 94 / 139 f) — tidak rata.

**VISUAL**
Sumbu waktu horizontal (f4098). Empat batang tumbuh satu per angka: **100 → 110 → 121 → 133**. Tiap batang = batang sebelumnya (cyan pucat) + tambahan baru di atasnya (cyan penuh); dari batang ketiga, tambahan itu dibelah dua: bagian dari modal awal dan bagian **dari keuntungan sebelumnya** — itu yang dinamai f4348 "keuntungan itu bisa ikut menghasilkan keuntungan".
f5082: judul **Compounding** dan baris di bawahnya — **hasil yang terus ikut bertumbuh seiring waktu**.
Angka ini ilustrasi (10% per periode, 133,1 dibulatkan) — bukan data pasar.
Akhiri: empat batang + kata Compounding.

### SCENE 06 — f5335–6387 · 01:28.417–01:46.450 · **18.03 s**
**NARRATION** (VO 01:28.633–01:46.400)
Makanya, kita nggak harus nunggu punya modal besar dulu.
Yang penting adalah mulai membangun kebiasaannya.
Karena investasi bukan cuma soal uang.
Semakin sering kita belajar dan mengevaluasi keputusan,
semakin baik juga kemampuan kita mengelola aset.

**Beat anchors**
- "modal besar" — 01:31.1 · f5466
- "kebiasaannya" — 01:35.0 · f5701
- "Karena investasi" — 01:36.5 · f5788
- "Semakin sering" — 01:39.3 · f5956
- "semakin baik" — 01:43.0 · f6182

**VISUAL**
f5466: tumpukan uang besar berlabel **Modal besar dulu?** — dicoret.
f5701: kalender kebiasaan — kotak-kotak bulan terisi ✓ satu per satu (streak), label **Kebiasaan**.
f5956: siklus tiga node berputar — **Belajar → Evaluasi keputusan → Kelola aset** — dan tiap putaran, bar **Kemampuan** di sampingnya naik satu tingkat (f6182).
Akhiri: siklus + bar kemampuan naik.

### SCENE 07 — f6417–7598 · 01:46.450–02:06.633 · **20.18 s**
**NARRATION** (VO 01:46.500–02:06.366)
Kalau dipikir-pikir, kekayaan kita punya dua bagian.
Yang pertama, human asset: waktu, kemampuan, dan pengalaman yang membantu kita menghasilkan uang.
Yang kedua, financial asset: tabungan, investasi, dan aset yang kita bangun dari penghasilan tadi.
Human asset punya batas. Financial asset bisa terus kita miliki.

**Beat anchors**
- "dua bagian" — 01:48.4 · f6503
- "human asset" — 01:50.0 · f6600
- "financial asset" — 01:56.5 · f6987
- "punya batas" — 02:03.1 · f7385
- "Financial asset bisa" — 02:03.9 · f7437

**VISUAL**
Satu kartu dibelah dua (f6503): kiri **Human Asset** (indigo), kanan **Financial Asset** (cyan).
Kiri, di f6600: **Waktu · Kemampuan · Pengalaman** (tiga baris dengan ikon). Kanan, di f6987: **Tabungan · Investasi · Aset**.
f7385: di bawah Human Asset muncul jam pasir yang menipis — **Punya batas**. f7437: di bawah Financial Asset garis yang terus naik — **Bisa terus dimiliki**.
Akhiri: dua kolom, dua nasib.

### SCENE 08 — f7628–8552 · 02:06.633–02:22.533 · **15.90 s**
**NARRATION** (VO 02:06.900–02:22.400)
Waktu masih muda, wajar kalau sebagian besar penghasilan datang dari kerja.
Tapi idealnya, saat income kita meningkat, aset kita juga ikut tumbuh.
Bayangin seperti estafet: kita kerja untuk menghasilkan uang, lalu sebagian uang itu kita teruskan untuk membangun aset.

**Beat anchors**
- "Waktu masih muda" — 02:06.9 · f7614
- "Tapi idealnya" — 02:11.1 · f7864
- "estafet" — 02:16.2 · f8174
- "lalu sebagian" — 02:18.8 · f8330

**VISUAL**
Dua warna SC07 dibawa ke sumbu umur (**Muda → Tua**): di kiri hampir semua penghasilan indigo (dari kerja); f7864 kedua lapisan naik, lapisan cyan (aset) makin tebal ke kanan. Ilustrasi bentuk, tanpa angka.
f8174: berganti ke **estafet** — dua pelari: **Kerja** (indigo) membawa tongkat **Uang**, f8330 menyerahkannya ke pelari **Aset** (cyan).
Akhiri: tongkat berpindah tangan.

**→ SCENE TRANSISI 2 overlay f8546–8686** — SC08 dilipat ke kartu 1, kartu 2 **Ikut Punya Bisnis** menyala, kamera masuk.

## PART 02 — IKUT PUNYA BISNIS

### SCENE 09 — f8582–9574 · 02:22.533–02:39.567 · **17.03 s**
**NARRATION** (VO 02:22.666–02:39.366)
Hal menarik dari investasi adalah:
kita nggak harus bekerja di sebuah perusahaan untuk ikut memiliki sebagian dari bisnisnya.
Ada orang yang bekerja di BCA untuk mendapatkan penghasilan.
Di sisi lain, sebagai investor, kita juga bisa punya sebagian kecil dari bisnis BCA.

**Beat anchors**
- "kita nggak harus" — 02:25.0 · f8700
- "Ada orang" — 02:30.8 · f9050
- "BCA" — 02:32.1 · f9124
- "Di sisi lain" — 02:34.6 · f9278
- "sebagian kecil" — 02:37.7 · f9463

**VISUAL**
Satu gedung perusahaan di tengah: kartu **Bank Central Asia · BBCA**.
f9050: di kiri, si pekerja (pose 01) — panah **kerja** masuk ke gedung, panah **gaji** kembali (indigo). Label **Karyawan**.
f9278: di kanan, orang kedua — tidak ada panah kerja; sebuah irisan kecil gedung terangkat dan mendarat di tangannya (cyan, f9463). Label **Investor**.
Akhiri: satu perusahaan, dua cara terhubung — Karyawan (gaji) / Investor (sebagian kecil bisnis).

### SCENE 10 — f9604–10630 · 02:39.567–02:57.167 · **17.60 s**
**NARRATION** (VO 02:39.766–02:56.966)
Hal yang sama sebenarnya ada di sekitar kita setiap hari.
Kita makan Indomie, minum Ultra Milk, dan menggunakan banyak produk dari perusahaan besar.
Sebagai konsumen, kita menikmati produknya.
Tapi lewat investasi, kita juga bisa ikut punya sebagian kecil dari bisnis di balik produk-produk itu.

**Beat anchors**
- "Indomie" — 02:44.0 · f9838
- "Ultra Milk" — 02:44.9 · f9894
- "dan menggunakan" — 02:45.7 · f9942
- "Sebagai konsumen" — 02:48.2 · f10094
- "Tapi lewat" — 02:51.7 · f10300
- "di balik" — 02:55.6 · f10534

**VISUAL**
Kartu produk mendarat satu per kata: **Indomie** (f9838), **Ultra Milk** (f9894), lalu dua kartu produk generik (f9942). Label kiri atas **Konsumen** (f10094).
f10300: kartu-kartu itu **berbalik** — di belakangnya perusahaan dan kodenya: **Indofood CBP · ICBP**, **Ultrajaya · ULTJ**. Label berganti **Pemilik (sebagian kecil)** di f10534.
`[NEEDS ASSET: foto/kemasan produk Indomie & Ultra Milk — opsional; tanpa itu kartunya teks + ilustrasi sederhana, bukan logo tiruan]`
Akhiri: produk di depan, bisnis di belakangnya.

### SCENE 11 — f10660–11716 · 02:57.167–03:15.267 · **18.10 s**
**NARRATION** (VO 02:57.366–03:15.000)
Dan di sinilah bedanya antara sekadar menghasilkan uang, dengan mulai membangun aset.
Sebuah bisnis bisa menghasilkan pendapatan, mencetak laba, lalu memakai laba itu untuk berkembang lebih jauh.
Sebagai pemilik sebagian dari bisnis tersebut, kita ikut punya exposure terhadap pertumbuhan nilainya.

**Beat anchors**
- "bedanya" — 02:58.1 · f10689
- "dengan mulai" — 03:01.7 · f10900
- "pendapatan" — 03:05.3 · f11118
- "mencetak laba" — 03:05.9 · f11152
- "lalu memakai" — 03:06.9 · f11216
- "exposure" — 03:12.6 · f11558

**VISUAL**
f10689: dua label berhadapan — **Menghasilkan uang** (indigo) vs **Membangun aset** (cyan, f10900).
f11118: roda bisnis tiga node — **Pendapatan → Laba (f11152) → Berkembang (f11216)** — dan tiap putaran rodanya membesar.
f11558: irisan kecil roda itu disorot cyan — **Pemilik ikut punya exposure ke pertumbuhan nilainya**. Tanpa angka, tanpa grafik harga.
Akhiri: roda yang tumbuh + irisan pemilik.

### SCENE 12 — f11746–12503 · 03:15.267–03:28.383 · **13.12 s**
**NARRATION** (VO 03:15.533–03:28.200)
Dan mulainya nggak harus besar. Bisa Rp50 ribu, Rp100 ribu, atau Rp300 ribu.
Yang paling penting bukan nominal pertamanya, tapi kebiasaan untuk menyisihkan sebagian income dan mulai mengubahnya menjadi aset.

**Beat anchors**
- **"Rp50"** — 03:17.6 · **f11855**
- **"Rp100"** — 03:18.1 · **f11883**
- **"Rp300"** — 03:19.4 · **f11966**
- "Yang paling" — 03:20.7 · f12044
- "tapi kebiasaan" — 03:23.1 · f12184
- "mengubahnya" — 03:26.7 · f12403

> ⚠ Tiga nominal hanya 28 f lalu 83 f terpisah — chip harus cepat (pop UI, bukan reveal teks).

**VISUAL**
Tiga chip nominal: **Rp50 ribu · Rp100 ribu · Rp300 ribu** di kata masing-masing.
f12044: ketiganya meredup — "bukan nominal pertamanya".
f12184: barisan bulan (Jan…Des): tiap bulan bar income masuk, sepotong kecil di atasnya dipotong dan jatuh ke toples **Aset** (cyan) — berulang, toples terisi. f12403 label **Kebiasaan menyisihkan**.
Akhiri: toples yang terisi pelan-pelan.

**→ SCENE TRANSISI 3 overlay f12497–12637** — SC12 dilipat ke kartu 2, kartu 3 **Cerita Lo Kheng Hong** menyala, kamera masuk.

## PART 03 — CERITA LO KHENG HONG

### SCENE 13 — f12533–13639 · 03:28.383–03:47.317 · **18.93 s**
**NARRATION** (VO 03:28.566–03:47.233)
Lo Kheng Hong juga nggak langsung mulai sebagai investor besar.
Sebelum dikenal seperti sekarang, dia pernah bekerja sebagai pegawai bank.
Sambil bekerja, dia menabung, belajar, membaca laporan perusahaan, dan pelan-pelan mulai berinvestasi.
Salah satu contoh terkenalnya adalah saat dia membeli saham United Tractors.

**Beat anchors**
- "Lo Kheng Hong" — 03:28.6 · f12514
- "pegawai bank" — 03:35.9 · f12956
- "menabung" — 03:37.7 · f13061
- "membaca laporan" — 03:38.7 · f13125
- "pelan-pelan" — 03:40.5 · f13228
- "United Tractors" — 03:45.8 · f13550

**VISUAL**
Kartu nama **Lo Kheng Hong** (f12514). `[NEEDS ASSET: foto Lo Kheng Hong — opsional; tanpa foto, kartu nama saja]`
Garis waktu kiri → kanan, satu titik per kata: **Pegawai bank** (f12956) → **Menabung** (f13061) → **Belajar & membaca laporan perusahaan** (f13125) → **Mulai berinvestasi** (f13228).
f13550: titik terakhir — kartu **United Tractors · UNTR**.
Akhiri: garis waktu dengan UNTR di ujungnya (dibawa ke SC14).

### SCENE 14 — f13669–14909 · 03:47.317–04:08.483 · **21.17 s**
**NARRATION** (VO 03:47.400–04:08.400)
Saat krisis 1998, Lo Kheng Hong membeli United Tractors di harga sekitar Rp250 per saham.
Beberapa tahun kemudian, nilainya sudah meningkat berkali-kali lipat, bahkan pernah berada di kisaran sekitar Rp15 ribu.
Tapi tentu saja, ini adalah contoh dari masa lalu.
Nggak semua investasi akan memberikan hasil seperti ini.

**Beat anchors**
- "krisis 1998" — 03:48.0 · f13680
- "Rp250" — 03:53.2 · f13993
- "berkali-kali lipat" — 03:57.2 · f14230
- "Rp15 ribu" — 04:00.5 · f14430
- "Tapi tentu saja" — 04:01.5 · f14490
- "Nggak semua" — 04:05.2 · f14712

**VISUAL**
Kartu UNTR dari SC13 pindah ke tengah (continuity).
f13680: chip tahun **Krisis 1998**. f13993: label harga **± Rp250 / saham**.
f14230: panah panjang ke kanan atas — **beberapa tahun kemudian** — dan f14430 label **± Rp15 ribu**. Hanya dua angka yang diucapkan narasi; **tanpa grafik harga** (tidak ada data yang diberikan untuk itu).
f14490: semuanya meredup di balik kotak peringatan — **Contoh dari masa lalu**; f14712 baris **Nggak semua investasi akan memberikan hasil seperti ini.**
Akhiri: peringatan di depan, cerita di belakang.

### SCENE 15 — f14939–15948 · 04:08.483–04:25.800 · **17.32 s**
**NARRATION** (VO 04:08.566–04:25.633)
Yang menarik dari cerita ini sebenarnya bukan: “Cari saham yang bisa naik berkali-kali.”
Yang lebih penting justru prosesnya.
Kerja untuk menghasilkan uang, sisihkan sebagian, pelajari asetnya, beli sesuatu yang benar-benar dipahami, lalu beri waktu untuk berkembang.

**Beat anchors**
- "Cari saham" — 04:11.0 · f15063
- "Yang lebih penting" — 04:14.0 · f15242
- **"Kerja untuk"** — 04:16.6 · **f15394**
- **"sisihkan"** — 04:18.0 · **f15482**
- **"pelajari"** — 04:19.6 · **f15578**
- **"beli"** — 04:20.7 · **f15642**
- **"lalu beri waktu"** — 04:23.6 · **f15814**

> ⚠ Lima langkah mendarat di kata masing-masing (88 / 96 / 64 / 172 f).

**VISUAL**
f15063: kotak garis-putus TA07 — **“Cari saham yang bisa naik berkali-kali.”** — lalu dicoret saat "Yang lebih penting" (f15242).
Rel lima langkah: **1 Kerja · 2 Sisihkan · 3 Pelajari · 4 Beli yang dipahami · 5 Beri waktu**, tiap langkah menyala di katanya.
Akhiri: rel lima langkah penuh.

## PENUTUP

### SCENE 16 — f15978–16824 · 04:25.800–04:40.400 · **14.60 s**
**NARRATION** (VO 04:25.966–04:40.066)
Jadi membangun passive income bukan berarti kita harus lari dari pekerjaan.
Kita tetap bisa bangun karier, urus keluarga, dan menikmati hidup sekarang.
Bedanya, sebagian hasil kerja kita hari ini mulai ikut disiapkan untuk masa depan.

**Beat anchors**
- "lari dari" — 04:28.7 · f16122
- "Kita tetap bisa" — 04:30.7 · f16244
- "urus keluarga" — 04:32.3 · f16337
- "menikmati hidup" — 04:33.5 · f16412
- "Bedanya" — 04:35.3 · f16516
- "masa depan" — 04:39.4 · f16766

**VISUAL**
Si pekerja (pose 01) di tengah. f16122: label **Lari dari pekerjaan** — dicoret.
Tiga chip ✓ di katanya: **Bangun karier · Urus keluarga · Menikmati hidup**.
f16516: bar **hasil kerja hari ini** dibelah — sebagian besar **Hari ini** (indigo), sepotong **Masa depan** (cyan, f16766).
Akhiri: bar terbelah dua warna.

### SCENE 17 — f16854–18036 · 04:40.400–05:00.600 · **20.20 s**
**NARRATION** (VO 04:40.733–05:00.500)
Di awal, aset kita mungkin masih kecil.
Tapi kalau kemampuan kerja terus berkembang, income bertambah, dan aset juga ikut tumbuh, pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial.
Kita juga mulai punya lebih banyak pilihan. Jadi setiap kali income masuk, coba tanya: “Berapa yang bisa aku sisihkan untuk mulai punya aset?”

**Beat anchors**
- "Di awal" — 04:40.7 · f16844
- "Tapi kalau" — 04:43.5 · f17010
- "income bertambah" — 04:45.5 · f17128
- "dan aset juga" — 04:46.4 · f17186
- "pelan-pelan" — 04:48.1 · f17284
- "lebih banyak pilihan" — 04:52.6 · f17557
- "Jadi setiap" — 04:54.3 · f17658
- “Berapa…” — 04:57.4 · f17842

**VISUAL**
Tiga bar: **Kemampuan · Income · Aset**. f16844 Aset masih pendek. f17010 / f17128 / f17186 ketiganya naik bergantian.
f17284: dua pilar — **Kerja** (indigo) dan **Aset** (cyan) — menopang satu atap **Kekuatan finansial**. f17557: dari atap itu tumbuh beberapa cabang **Pilihan**.
f17658: kotak garis-putus TA07 diketik — **“Berapa yang bisa aku sisihkan untuk mulai punya aset?”**, **mulai punya aset** ber-tint cyan.
Akhiri: pertanyaan itu, menyala.

### SCENE 18 — f18066–19230 · 05:00.600–05:20.500 · **19.90 s**
**NARRATION** (VO 05:00.700–05:17.066)
Karena pada akhirnya, kerja berarti kita menggunakan waktu untuk menghasilkan uang.
Sedangkan investasi, membuat sebagian uang yang sudah kita hasilkan ikut bekerja untuk masa depan.
Jadi kita pelan-pelan berubah dari sekadar pekerja menjadi pekerja yang juga punya aset.

**Beat anchors**
- "kerja berarti" — 05:01.9 · f18114
- "Sedangkan investasi" — 05:05.7 · f18340
- "ikut bekerja" — 05:09.6 · f18578
- "Jadi kita" — 05:12.0 · f18722
- "menjadi pekerja" — 05:15.2 · f18914

**VISUAL**
Dua baris, gaya Rules TA11: **Kerja** → *Waktu jadi uang* (indigo) (f18114) · **Investasi** → *Uang ikut bekerja* (cyan) (f18340 / f18578).
f18722: semuanya bersih; quote card penutup TA09 di atas grid, Tuntun mark melayang di atasnya — **Dari sekadar pekerja, menjadi pekerja yang juga punya aset.** dengan **juga punya aset** ber-tint cyan (f18914). Si pekerja (pose 05) di samping kartu.
Tahan sampai f19230.

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
