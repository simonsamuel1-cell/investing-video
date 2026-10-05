# VI01 — PASSIVE INCOME
## Script re-timed against the recorded VO

**Source of timing:** `INV01 - Main VO.srt` (Premiere STT) → `assets/VI01_PassiveIncome_Sub_CORRECTED.srt`
**VO file:** `INV01 - Main VO.MP3` → `public/vo/passive-income.mp3` — durasi audio **316.656 s (05:16.656)**
**VO length (SRT):** kata terakhir keluar 05:16.566 · **f18994 @ 60 fps** · comp length **19,200 f (05:20.000)** — 206 f / 3.4 s tail untuk menahan quote penutup
**Episode folder:** `src/episodes/vi01-passive-income/` · composition **`VI01-PassiveIncome`** · fps **60**
**Original script estimate:** 04:10 → rekaman nyata **05:16.7, +66.7 s lebih panjang.** Semua timestamp di script asli mati; pakai hanya tabel di bawah. Script dengan timing baru: `docs/VI01_PassiveIncome_Script_RETIMED.txt`.

### Cara subtitle dibuat ulang
`scripts/vi01-align.py` — kata-kata script dicocokkan ke kata-kata SRT (waktunya dari SRT), lalu:
- **satu cue = satu kalimat**, satu baris. Kalimat yang terlalu lebar untuk satu baris (diukur dengan font aslinya, Plus Jakarta Sans 36px, maks 1560 px) dipotong — hanya di titik dua, koma, atau jeda bicara, tidak pernah di tengah frasa;
- batas kalimat yang jatuh **di dalam** satu cue SRT (mis. "…kita tunggu: GAJIAN. Kita kerja, …") dipindah ke 20 ms paling sunyi di audio dekat perkiraan — itu napas si pembicara;
- tulisan 100% dari script asli (huruf kapital, tanda baca). Yang dibetulkan dari SRT: *pasif → passive, human aset → human asset, finansial aset → financial asset, lokeng Hong → Lo Kheng Hong, bca → BCA, karir → karier, sekedar → sekadar, 50.100 ribu → Rp50 ribu, Rp100 ribu, 15.000 → Rp15 ribu, Aku → aku, cebeli → beli*.

Hasil: **86 cue dari 65 kalimat**, cue terlebar 1554 px.

Dua timing per scene:
- **VO** — kata pertama masuk / kata terakhir keluar.
- **BLOCK** — blok scene kontinu, dipotong di **titik tengah keheningan** antar scene; blok bertemu ujung-ke-ujung, timeline utuh f0 → f19200.

---

## Master timing table

| Scene | BLOCK (frames) | BLOCK (tc) | Dur | VO in – VO out | Cues | Part |
|---|---|---|---|---|---|---|
| SC01 | 0 – 939 | 00:00.000 – 00:15.650 | 15.65 s | 00:00.166 – 00:15.366 | 1–4 | cold open |
| SC02 | 939 – 2033 | 00:15.650 – 00:33.883 | 18.23 s | 00:15.933 – 00:33.666 | 5–9 | cold open |
| SC03 | 2033 – 3025 | 00:33.883 – 00:50.417 | 16.53 s | 00:34.100 – 00:50.266 | 10–14 | cold open |
| SC04 | 3025 – 3978 | 00:50.417 – 01:06.300 | 15.88 s | 00:50.566 – 01:06.100 | 15–18 | 01 |
| SC05 | 3978 – 5275 | 01:06.300 – 01:27.917 | 21.62 s | 01:06.500 – 01:27.700 | 19–23 | 01 |
| SC06 | 5275 – 6357 | 01:27.917 – 01:45.950 | 18.03 s | 01:28.133 – 01:45.900 | 24–28 | 01 |
| SC07 | 6357 – 7568 | 01:45.950 – 02:06.133 | 20.18 s | 01:46.000 – 02:05.866 | 29–35 | 01 |
| SC08 | 7568 – 8522 | 02:06.133 – 02:22.033 | 15.90 s | 02:06.400 – 02:21.900 | 36–39 | 01 |
| SC09 | 8522 – 9544 | 02:22.033 – 02:39.067 | 17.03 s | 02:22.166 – 02:38.866 | 40–43 | 02 |
| SC10 | 9544 – 10600 | 02:39.067 – 02:56.667 | 17.60 s | 02:39.266 – 02:56.466 | 44–49 | 02 |
| SC11 | 10600 – 11686 | 02:56.667 – 03:14.767 | 18.10 s | 02:56.866 – 03:14.500 | 50–54 | 02 |
| SC12 | 11686 – 12473 | 03:14.767 – 03:27.883 | 13.12 s | 03:15.033 – 03:27.700 | 55–58 | 02 |
| SC13 | 12473 – 13609 | 03:27.883 – 03:46.817 | 18.93 s | 03:28.066 – 03:46.733 | 59–63 | 03 |
| SC14 | 13609 – 14879 | 03:46.817 – 04:07.983 | 21.17 s | 03:46.900 – 04:07.900 | 64–68 | 03 |
| SC15 | 14879 – 15918 | 04:07.983 – 04:25.300 | 17.32 s | 04:08.066 – 04:25.133 | 69–72 | 03 |
| SC16 | 15918 – 16794 | 04:25.300 – 04:39.900 | 14.60 s | 04:25.466 – 04:39.566 | 73–75 | close |
| SC17 | 16794 – 18006 | 04:39.900 – 05:00.100 | 20.20 s | 04:40.233 – 05:00.000 | 76–82 | close |
| SC18 | 18006 – 19200 | 05:00.100 – 05:20.000 | 19.90 s | 05:00.200 – 05:16.566 | 83–86 | close |

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
| ST1 — cold open → bab 1 | SC03 → SC04 | 0.30 s | **2990 – 3160** |
| ST2 — bab 1 → bab 2 | SC08 → SC09 | 0.27 s | **8486 – 8656** |
| ST3 — bab 2 → bab 3 | SC12 → SC13 | 0.37 s | **12437 – 12607** |

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

### SCENE 01 — f0–939 · 00:00.000–00:15.650 · **15.65 s**
**NARRATION** (VO 00:00.166–00:15.366)
Setiap bulan, ada satu momen yang selalu kita tunggu: GAJIAN.
Kita kerja, dapat penghasilan, lalu pakai uang itu untuk menjalani hidup.
Tapi coba bayangin kalau suatu hari kita harus berhenti kerja sementara.
Apakah penghasilan kita juga ikut berhenti?

**Beat anchors**
- "GAJIAN" — 00:02.7 · f160
- "Kita kerja" — 00:03.2 · f190
- "berhenti kerja sementara" — 00:11.2 · f671
- "Apakah" — 00:13.3 · f796

**VISUAL**
Grid bergerak pelan. Kartu kalender bulan ini; tanggal-tanggal lewat cepat, lalu berhenti di tanggal gajian — stempel **GAJIAN** jatuh di f160 (pop, satu-satunya pop di scene).
Si pekerja (pose 01) masuk dari kiri. Di sebelahnya tumbuh alur tiga node: **Kerja → Penghasilan → Hidup** (indigo), satu per frasa (f190 / ~f230 / ~f330).
f671 "berhenti kerja sementara": node **Kerja** meredup dan diberi ikon jeda; panah ke Penghasilan putus. Si pekerja ganti ke pose 04 (lesu).
f796: tanda tanya muncul di node Penghasilan — **"Penghasilan ikut berhenti?"**
Akhiri: alur yang terputus di tengah.

### SCENE 02 — f939–2033 · 00:15.650–00:33.883 · **18.23 s**
**NARRATION** (VO 00:15.933–00:33.666)
Makanya, banyak orang berusaha menambah penghasilan.
Ada yang mengejar naik jabatan, belajar skill baru, bangun bisnis, ambil freelance, atau cari side hustle.
Semua itu bagus, tapi hampir semuanya tetap membutuhkan satu hal yang sama: waktu dan tenaga kita.

**Beat anchors**
- "naik jabatan" — 00:21.0 · f1258
- "belajar skill" — 00:22.2 · f1330
- "bangun bisnis" — 00:23.7 · f1422
- "ambil freelance" — 00:24.7 · f1480
- "side hustle" — 00:27.0 · f1622
- "waktu dan tenaga" — 00:32.4 · f1942

> ⚠ Lima chip mendarat **di kata masing-masing** — jaraknya tidak rata (72 / 92 / 58 / 142 f). Jangan dibuat grid rata.

**VISUAL**
Judul **Menambah Penghasilan**. Lima chip muncul satu per kata, menyebar mengelilingi si pekerja (pose 06): **Naik jabatan · Skill baru · Bangun bisnis · Freelance · Side hustle**.
f1942: dari kelima chip ditarik garis ke satu pil di bawah — **Waktu + Tenaga** (indigo, ikon jam & baterai). Semua jalan bertemu di sana.
Akhiri: lima jalan, satu sumber yang sama.

### SCENE 03 — f2033–3025 · 00:33.883–00:50.417 · **16.53 s**
**NARRATION** (VO 00:34.100–00:50.266)
Masalahnya, sehari tetap cuma 24 jam.
Semakin dewasa, tanggung jawab biasanya justru makin banyak.
Jadi selain bertanya, “Gimana caranya aku bisa menghasilkan lebih banyak?”
Kita juga perlu mulai bertanya: “Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”

**Beat anchors**
- "24 jam" — 00:36.1 · f2165
- "Semakin dewasa" — 00:37.1 · f2224
- "Jadi selain" — 00:41.3 · f2478
- "Kita juga perlu" — 00:46.0 · f2758
- "ikut bekerja" — 00:49.5 · f2968

**VISUAL**
Satu bar hari: **24 kotak jam**. f2224: kotak-kotaknya terisi blok tanggung jawab (Kerja, Perjalanan, Keluarga, Istirahat…) sampai penuh — tidak ada kotak kosong tersisa. Si pekerja pose 04.
Bar mundur ke atas. f2478: pertanyaan pertama di kotak garis-putus TA07, diketik — **“Gimana caranya aku bisa menghasilkan lebih banyak?”**
f2758: pertanyaan pertama meredup dan bergeser; pertanyaan kedua diketik di bawahnya — **“Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”**, dengan **ikut bekerja** ber-tint cyan tepat di f2968.
Akhiri: pertanyaan kedua menyala, pertanyaan pertama redup.

**→ SCENE TRANSISI 1 overlay f2990–3160** — SC03 dilipat ke kartu atas **Gaji & Waktu**, tiga kartu bab terbuka, kartu 1 **Uang Yang Ikut Bekerja** menyala, kamera masuk.

## PART 01 — UANG YANG IKUT BEKERJA

### SCENE 04 — f3025–3978 · 00:50.417–01:06.300 · **15.88 s**
**NARRATION** (VO 00:50.566–01:06.100)
Di sinilah konsep passive income mulai masuk.
Bukan berarti investasi hari ini, lalu besok langsung berhenti kerja.
Kita tetap kerja, tetap bangun karier, dan tetap belajar.
Bedanya, sebagian uang yang kita hasilkan mulai kita ubah menjadi aset.

**Beat anchors**
- "passive income" — 00:51.6 · f3098
- "Bukan berarti" — 00:53.7 · f3224
- "lalu besok" — 00:55.9 · f3356
- "Kita tetap kerja" — 00:58.1 · f3488
- "Bedanya" — 01:01.8 · f3708
- "menjadi aset" — 01:05.3 · f3918

**VISUAL**
Judul besar di tengah **Passive Income** (f3098), lalu naik ke posisi judul.
f3224: anggapan yang salah ditulis — **Investasi hari ini → besok berhenti kerja** — dan dicoret di f3356 (Strike, merah hanya di kata yang menamai kesalahan).
f3488: tiga chip ✓ — **Tetap kerja · Tetap bangun karier · Tetap belajar**.
f3708: alur SC01 kembali (**Kerja → Penghasilan**), lalu sebagian Penghasilan terpisah dan mengalir ke node baru **Aset** (cyan) di f3918.
Akhiri: Kerja → Penghasilan → **Aset**.

### SCENE 05 — f3978–5275 · 01:06.300–01:27.917 · **21.62 s**
**NARRATION** (VO 01:06.500–01:27.700)
Dan di sini, waktu punya peran besar.
Kalau sebuah aset menghasilkan keuntungan, keuntungan itu bisa ikut menghasilkan keuntungan berikutnya.
Misalnya, 100 jadi 110, lalu 121, lalu 133.
Itulah konsep compounding: hasil yang terus ikut bertumbuh seiring waktu.

**Beat anchors**
- "waktu punya peran besar" — 01:07.8 · f4068
- "keuntungan itu" — 01:12.0 · f4318
- "Misalnya" / "100" — 01:15.4 · f4524
- **"110"** — 01:17.7 · **f4664**
- **"121"** — 01:19.3 · **f4758**
- **"133"** — 01:21.6 · **f4897**
- "compounding" — 01:24.2 · f5052

> ⚠ Angka **mendarat di kata yang diucapkan** (140 / 94 / 139 f) — tidak rata.

**VISUAL**
Sumbu waktu horizontal (f4068). Empat batang tumbuh satu per angka: **100 → 110 → 121 → 133**. Tiap batang = batang sebelumnya (cyan pucat) + tambahan baru di atasnya (cyan penuh); dari batang ketiga, tambahan itu dibelah dua: bagian dari modal awal dan bagian **dari keuntungan sebelumnya** — itu yang dinamai f4318 "keuntungan itu bisa ikut menghasilkan keuntungan".
f5052: judul **Compounding** dan baris di bawahnya — **hasil yang terus ikut bertumbuh seiring waktu**.
Angka ini ilustrasi (10% per periode, 133,1 dibulatkan) — bukan data pasar.
Akhiri: empat batang + kata Compounding.

### SCENE 06 — f5275–6357 · 01:27.917–01:45.950 · **18.03 s**
**NARRATION** (VO 01:28.133–01:45.900)
Makanya, kita nggak harus nunggu punya modal besar dulu.
Yang penting adalah mulai membangun kebiasaannya.
Karena investasi bukan cuma soal uang.
Semakin sering kita belajar dan mengevaluasi keputusan,
semakin baik juga kemampuan kita mengelola aset.

**Beat anchors**
- "modal besar" — 01:30.6 · f5436
- "kebiasaannya" — 01:34.5 · f5671
- "Karena investasi" — 01:36.0 · f5758
- "Semakin sering" — 01:38.8 · f5926
- "semakin baik" — 01:42.5 · f6152

**VISUAL**
f5436: tumpukan uang besar berlabel **Modal besar dulu?** — dicoret.
f5671: kalender kebiasaan — kotak-kotak bulan terisi ✓ satu per satu (streak), label **Kebiasaan**.
f5926: siklus tiga node berputar — **Belajar → Evaluasi keputusan → Kelola aset** — dan tiap putaran, bar **Kemampuan** di sampingnya naik satu tingkat (f6152).
Akhiri: siklus + bar kemampuan naik.

### SCENE 07 — f6357–7568 · 01:45.950–02:06.133 · **20.18 s**
**NARRATION** (VO 01:46.000–02:05.866)
Kalau dipikir-pikir, kekayaan kita punya dua bagian.
Yang pertama, human asset: waktu, kemampuan, dan pengalaman yang membantu kita menghasilkan uang.
Yang kedua, financial asset: tabungan, investasi, dan aset yang kita bangun dari penghasilan tadi.
Human asset punya batas. Financial asset bisa terus kita miliki.

**Beat anchors**
- "dua bagian" — 01:47.9 · f6473
- "human asset" — 01:49.5 · f6570
- "financial asset" — 01:56.0 · f6957
- "punya batas" — 02:02.6 · f7355
- "Financial asset bisa" — 02:03.4 · f7407

**VISUAL**
Satu kartu dibelah dua (f6473): kiri **Human Asset** (indigo), kanan **Financial Asset** (cyan).
Kiri, di f6570: **Waktu · Kemampuan · Pengalaman** (tiga baris dengan ikon). Kanan, di f6957: **Tabungan · Investasi · Aset**.
f7355: di bawah Human Asset muncul jam pasir yang menipis — **Punya batas**. f7407: di bawah Financial Asset garis yang terus naik — **Bisa terus dimiliki**.
Akhiri: dua kolom, dua nasib.

### SCENE 08 — f7568–8522 · 02:06.133–02:22.033 · **15.90 s**
**NARRATION** (VO 02:06.400–02:21.900)
Waktu masih muda, wajar kalau sebagian besar penghasilan datang dari kerja.
Tapi idealnya, saat income kita meningkat, aset kita juga ikut tumbuh.
Bayangin seperti estafet: kita kerja untuk menghasilkan uang, lalu sebagian uang itu kita teruskan untuk membangun aset.

**Beat anchors**
- "Waktu masih muda" — 02:06.4 · f7584
- "Tapi idealnya" — 02:10.6 · f7834
- "estafet" — 02:15.7 · f8144
- "lalu sebagian" — 02:18.3 · f8300

**VISUAL**
Dua warna SC07 dibawa ke sumbu umur (**Muda → Tua**): di kiri hampir semua penghasilan indigo (dari kerja); f7834 kedua lapisan naik, lapisan cyan (aset) makin tebal ke kanan. Ilustrasi bentuk, tanpa angka.
f8144: berganti ke **estafet** — dua pelari: **Kerja** (indigo) membawa tongkat **Uang**, f8300 menyerahkannya ke pelari **Aset** (cyan).
Akhiri: tongkat berpindah tangan.

**→ SCENE TRANSISI 2 overlay f8486–8656** — SC08 dilipat ke kartu 1, kartu 2 **Ikut Punya Bisnis** menyala, kamera masuk.

## PART 02 — IKUT PUNYA BISNIS

### SCENE 09 — f8522–9544 · 02:22.033–02:39.067 · **17.03 s**
**NARRATION** (VO 02:22.166–02:38.866)
Hal menarik dari investasi adalah:
kita nggak harus bekerja di sebuah perusahaan untuk ikut memiliki sebagian dari bisnisnya.
Ada orang yang bekerja di BCA untuk mendapatkan penghasilan.
Di sisi lain, sebagai investor, kita juga bisa punya sebagian kecil dari bisnis BCA.

**Beat anchors**
- "kita nggak harus" — 02:24.5 · f8670
- "Ada orang" — 02:30.3 · f9020
- "BCA" — 02:31.6 · f9094
- "Di sisi lain" — 02:34.1 · f9248
- "sebagian kecil" — 02:37.2 · f9433

**VISUAL**
Satu gedung perusahaan di tengah: kartu **Bank Central Asia · BBCA**.
f9020: di kiri, si pekerja (pose 01) — panah **kerja** masuk ke gedung, panah **gaji** kembali (indigo). Label **Karyawan**.
f9248: di kanan, orang kedua — tidak ada panah kerja; sebuah irisan kecil gedung terangkat dan mendarat di tangannya (cyan, f9433). Label **Investor**.
Akhiri: satu perusahaan, dua cara terhubung — Karyawan (gaji) / Investor (sebagian kecil bisnis).

### SCENE 10 — f9544–10600 · 02:39.067–02:56.667 · **17.60 s**
**NARRATION** (VO 02:39.266–02:56.466)
Hal yang sama sebenarnya ada di sekitar kita setiap hari.
Kita makan Indomie, minum Ultra Milk, dan menggunakan banyak produk dari perusahaan besar.
Sebagai konsumen, kita menikmati produknya.
Tapi lewat investasi, kita juga bisa ikut punya sebagian kecil dari bisnis di balik produk-produk itu.

**Beat anchors**
- "Indomie" — 02:43.5 · f9808
- "Ultra Milk" — 02:44.4 · f9864
- "dan menggunakan" — 02:45.2 · f9912
- "Sebagai konsumen" — 02:47.7 · f10064
- "Tapi lewat" — 02:51.2 · f10270
- "di balik" — 02:55.1 · f10504

**VISUAL**
Kartu produk mendarat satu per kata: **Indomie** (f9808), **Ultra Milk** (f9864), lalu dua kartu produk generik (f9912). Label kiri atas **Konsumen** (f10064).
f10270: kartu-kartu itu **berbalik** — di belakangnya perusahaan dan kodenya: **Indofood CBP · ICBP**, **Ultrajaya · ULTJ**. Label berganti **Pemilik (sebagian kecil)** di f10504.
`[NEEDS ASSET: foto/kemasan produk Indomie & Ultra Milk — opsional; tanpa itu kartunya teks + ilustrasi sederhana, bukan logo tiruan]`
Akhiri: produk di depan, bisnis di belakangnya.

### SCENE 11 — f10600–11686 · 02:56.667–03:14.767 · **18.10 s**
**NARRATION** (VO 02:56.866–03:14.500)
Dan di sinilah bedanya antara sekadar menghasilkan uang, dengan mulai membangun aset.
Sebuah bisnis bisa menghasilkan pendapatan, mencetak laba, lalu memakai laba itu untuk berkembang lebih jauh.
Sebagai pemilik sebagian dari bisnis tersebut, kita ikut punya exposure terhadap pertumbuhan nilainya.

**Beat anchors**
- "bedanya" — 02:57.6 · f10659
- "dengan mulai" — 03:01.2 · f10870
- "pendapatan" — 03:04.8 · f11088
- "mencetak laba" — 03:05.4 · f11122
- "lalu memakai" — 03:06.4 · f11186
- "exposure" — 03:12.1 · f11528

**VISUAL**
f10659: dua label berhadapan — **Menghasilkan uang** (indigo) vs **Membangun aset** (cyan, f10870).
f11088: roda bisnis tiga node — **Pendapatan → Laba (f11122) → Berkembang (f11186)** — dan tiap putaran rodanya membesar.
f11528: irisan kecil roda itu disorot cyan — **Pemilik ikut punya exposure ke pertumbuhan nilainya**. Tanpa angka, tanpa grafik harga.
Akhiri: roda yang tumbuh + irisan pemilik.

### SCENE 12 — f11686–12473 · 03:14.767–03:27.883 · **13.12 s**
**NARRATION** (VO 03:15.033–03:27.700)
Dan mulainya nggak harus besar. Bisa Rp50 ribu, Rp100 ribu, atau Rp300 ribu.
Yang paling penting bukan nominal pertamanya, tapi kebiasaan untuk menyisihkan sebagian income dan mulai mengubahnya menjadi aset.

**Beat anchors**
- **"Rp50"** — 03:17.1 · **f11825**
- **"Rp100"** — 03:17.6 · **f11853**
- **"Rp300"** — 03:18.9 · **f11936**
- "Yang paling" — 03:20.2 · f12014
- "tapi kebiasaan" — 03:22.6 · f12154
- "mengubahnya" — 03:26.2 · f12373

> ⚠ Tiga nominal hanya 28 f lalu 83 f terpisah — chip harus cepat (pop UI, bukan reveal teks).

**VISUAL**
Tiga chip nominal: **Rp50 ribu · Rp100 ribu · Rp300 ribu** di kata masing-masing.
f12014: ketiganya meredup — "bukan nominal pertamanya".
f12154: barisan bulan (Jan…Des): tiap bulan bar income masuk, sepotong kecil di atasnya dipotong dan jatuh ke toples **Aset** (cyan) — berulang, toples terisi. f12373 label **Kebiasaan menyisihkan**.
Akhiri: toples yang terisi pelan-pelan.

**→ SCENE TRANSISI 3 overlay f12437–12607** — SC12 dilipat ke kartu 2, kartu 3 **Cerita Lo Kheng Hong** menyala, kamera masuk.

## PART 03 — CERITA LO KHENG HONG

### SCENE 13 — f12473–13609 · 03:27.883–03:46.817 · **18.93 s**
**NARRATION** (VO 03:28.066–03:46.733)
Lo Kheng Hong juga nggak langsung mulai sebagai investor besar.
Sebelum dikenal seperti sekarang, dia pernah bekerja sebagai pegawai bank.
Sambil bekerja, dia menabung, belajar, membaca laporan perusahaan, dan pelan-pelan mulai berinvestasi.
Salah satu contoh terkenalnya adalah saat dia membeli saham United Tractors.

**Beat anchors**
- "Lo Kheng Hong" — 03:28.1 · f12484
- "pegawai bank" — 03:35.4 · f12926
- "menabung" — 03:37.2 · f13031
- "membaca laporan" — 03:38.2 · f13095
- "pelan-pelan" — 03:40.0 · f13198
- "United Tractors" — 03:45.3 · f13520

**VISUAL**
Kartu nama **Lo Kheng Hong** (f12484). `[NEEDS ASSET: foto Lo Kheng Hong — opsional; tanpa foto, kartu nama saja]`
Garis waktu kiri → kanan, satu titik per kata: **Pegawai bank** (f12926) → **Menabung** (f13031) → **Belajar & membaca laporan perusahaan** (f13095) → **Mulai berinvestasi** (f13198).
f13520: titik terakhir — kartu **United Tractors · UNTR**.
Akhiri: garis waktu dengan UNTR di ujungnya (dibawa ke SC14).

### SCENE 14 — f13609–14879 · 03:46.817–04:07.983 · **21.17 s**
**NARRATION** (VO 03:46.900–04:07.900)
Saat krisis 1998, Lo Kheng Hong membeli United Tractors di harga sekitar Rp250 per saham.
Beberapa tahun kemudian, nilainya sudah meningkat berkali-kali lipat, bahkan pernah berada di kisaran sekitar Rp15 ribu.
Tapi tentu saja, ini adalah contoh dari masa lalu.
Nggak semua investasi akan memberikan hasil seperti ini.

**Beat anchors**
- "krisis 1998" — 03:47.5 · f13650
- "Rp250" — 03:52.7 · f13963
- "berkali-kali lipat" — 03:56.7 · f14200
- "Rp15 ribu" — 04:00.0 · f14400
- "Tapi tentu saja" — 04:01.0 · f14460
- "Nggak semua" — 04:04.7 · f14682

**VISUAL**
Kartu UNTR dari SC13 pindah ke tengah (continuity).
f13650: chip tahun **Krisis 1998**. f13963: label harga **± Rp250 / saham**.
f14200: panah panjang ke kanan atas — **beberapa tahun kemudian** — dan f14400 label **± Rp15 ribu**. Hanya dua angka yang diucapkan narasi; **tanpa grafik harga** (tidak ada data yang diberikan untuk itu).
f14460: semuanya meredup di balik kotak peringatan — **Contoh dari masa lalu**; f14682 baris **Nggak semua investasi akan memberikan hasil seperti ini.**
Akhiri: peringatan di depan, cerita di belakang.

### SCENE 15 — f14879–15918 · 04:07.983–04:25.300 · **17.32 s**
**NARRATION** (VO 04:08.066–04:25.133)
Yang menarik dari cerita ini sebenarnya bukan: “Cari saham yang bisa naik berkali-kali.”
Yang lebih penting justru prosesnya.
Kerja untuk menghasilkan uang, sisihkan sebagian, pelajari asetnya, beli sesuatu yang benar-benar dipahami, lalu beri waktu untuk berkembang.

**Beat anchors**
- "Cari saham" — 04:10.5 · f15033
- "Yang lebih penting" — 04:13.5 · f15212
- **"Kerja untuk"** — 04:16.1 · **f15364**
- **"sisihkan"** — 04:17.5 · **f15452**
- **"pelajari"** — 04:19.1 · **f15548**
- **"beli"** — 04:20.2 · **f15612**
- **"lalu beri waktu"** — 04:23.1 · **f15784**

> ⚠ Lima langkah mendarat di kata masing-masing (88 / 96 / 64 / 172 f).

**VISUAL**
f15033: kotak garis-putus TA07 — **“Cari saham yang bisa naik berkali-kali.”** — lalu dicoret saat "Yang lebih penting" (f15212).
Rel lima langkah: **1 Kerja · 2 Sisihkan · 3 Pelajari · 4 Beli yang dipahami · 5 Beri waktu**, tiap langkah menyala di katanya.
Akhiri: rel lima langkah penuh.

## PENUTUP

### SCENE 16 — f15918–16794 · 04:25.300–04:39.900 · **14.60 s**
**NARRATION** (VO 04:25.466–04:39.566)
Jadi membangun passive income bukan berarti kita harus lari dari pekerjaan.
Kita tetap bisa bangun karier, urus keluarga, dan menikmati hidup sekarang.
Bedanya, sebagian hasil kerja kita hari ini mulai ikut disiapkan untuk masa depan.

**Beat anchors**
- "lari dari" — 04:28.2 · f16092
- "Kita tetap bisa" — 04:30.2 · f16214
- "urus keluarga" — 04:31.8 · f16307
- "menikmati hidup" — 04:33.0 · f16382
- "Bedanya" — 04:34.8 · f16486
- "masa depan" — 04:38.9 · f16736

**VISUAL**
Si pekerja (pose 01) di tengah. f16092: label **Lari dari pekerjaan** — dicoret.
Tiga chip ✓ di katanya: **Bangun karier · Urus keluarga · Menikmati hidup**.
f16486: bar **hasil kerja hari ini** dibelah — sebagian besar **Hari ini** (indigo), sepotong **Masa depan** (cyan, f16736).
Akhiri: bar terbelah dua warna.

### SCENE 17 — f16794–18006 · 04:39.900–05:00.100 · **20.20 s**
**NARRATION** (VO 04:40.233–05:00.000)
Di awal, aset kita mungkin masih kecil.
Tapi kalau kemampuan kerja terus berkembang, income bertambah, dan aset juga ikut tumbuh, pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial.
Kita juga mulai punya lebih banyak pilihan. Jadi setiap kali income masuk, coba tanya: “Berapa yang bisa aku sisihkan untuk mulai punya aset?”

**Beat anchors**
- "Di awal" — 04:40.2 · f16814
- "Tapi kalau" — 04:43.0 · f16980
- "income bertambah" — 04:45.0 · f17098
- "dan aset juga" — 04:45.9 · f17156
- "pelan-pelan" — 04:47.6 · f17254
- "lebih banyak pilihan" — 04:52.1 · f17527
- "Jadi setiap" — 04:53.8 · f17628
- “Berapa…” — 04:56.9 · f17812

**VISUAL**
Tiga bar: **Kemampuan · Income · Aset**. f16814 Aset masih pendek. f16980 / f17098 / f17156 ketiganya naik bergantian.
f17254: dua pilar — **Kerja** (indigo) dan **Aset** (cyan) — menopang satu atap **Kekuatan finansial**. f17527: dari atap itu tumbuh beberapa cabang **Pilihan**.
f17628: kotak garis-putus TA07 diketik — **“Berapa yang bisa aku sisihkan untuk mulai punya aset?”**, **mulai punya aset** ber-tint cyan.
Akhiri: pertanyaan itu, menyala.

### SCENE 18 — f18006–19200 · 05:00.100–05:20.000 · **19.90 s**
**NARRATION** (VO 05:00.200–05:16.566)
Karena pada akhirnya, kerja berarti kita menggunakan waktu untuk menghasilkan uang.
Sedangkan investasi, membuat sebagian uang yang sudah kita hasilkan ikut bekerja untuk masa depan.
Jadi kita pelan-pelan berubah dari sekadar pekerja menjadi pekerja yang juga punya aset.

**Beat anchors**
- "kerja berarti" — 05:01.4 · f18084
- "Sedangkan investasi" — 05:05.2 · f18310
- "ikut bekerja" — 05:09.1 · f18548
- "Jadi kita" — 05:11.5 · f18692
- "menjadi pekerja" — 05:14.7 · f18884

**VISUAL**
Dua baris, gaya Rules TA11: **Kerja** → *Waktu jadi uang* (indigo) (f18084) · **Investasi** → *Uang ikut bekerja* (cyan) (f18310 / f18548).
f18692: semuanya bersih; quote card penutup TA09 di atas grid, Tuntun mark melayang di atasnya — **Dari sekadar pekerja, menjadi pekerja yang juga punya aset.** dengan **juga punya aset** ber-tint cyan (f18884). Si pekerja (pose 05) di samping kartu.
Tahan sampai f19200.

---

## Continuity groups

- **Alur Kerja → Penghasilan → Aset** — satu komponen, muncul di SC01 (2 node + Hidup), SC04 (node Aset lahir), SC08 (jadi estafet), SC18 (kalimat penutup). Bukan satu mount yang sama (scene-scene di antaranya jauh), tapi geometri dan warnanya identik supaya terbaca sebagai benda yang sama.
- **CG-A · SC07 + SC08** — dua warna aset. Kolom Human/Financial di SC07 berubah menjadi dua lapisan di sumbu umur SC08 tanpa cut: warna dan urutan kiri-kanan sama.
- **CG-B · SC13 + SC14** — garis waktu Lo Kheng Hong. Kartu UNTR di ujung garis waktu SC13 adalah kartu yang sama yang ke tengah di SC14.
- **Si pekerja** — satu tokoh, berganti pose, di SC01–03, SC09, SC16, SC18.

---

## Open items

- **Branch.** VI01 bukan video TA, tapi aku taruh di folder yang sama dengan video TA (`moving-average-core`, branch Module01) karena library bersamanya (`src/core`) hanya ada di sana dan Studio :3004 langsung bisa membukanya. Kalau mau dipindah ke branch modul sendiri, bilang.
- **Typo di script asli:** "pelajari asetnya,cbeli sesuatu" → ditulis **"pelajari asetnya, beli sesuatu"**. SRT mendengarnya "cebeli" — kemungkinan narator membacanya apa adanya. Cek audionya di 04:20.2 (f15612); kalau memang terdengar "cebeli", perlu take ulang baris itu.
- **File audio lain di folder INV01** (`01 Kita tetap kerja…`, `02 dengan mulai membangun aset`, `03–05, 09 Lo Keng Hong`, `06 15 ribu`, `07_1/07_2 Cari saham…`, `08 Kita tetap bisa bangun karir`, `MiniMax_…Compelling_Storyteller`) — **tidak dipakai**; yang dipakai hanya `INV01 - Main VO.MP3`. Kalau itu take pengganti untuk baris tertentu, bilang baris mana dan aku sambungkan seperti di TA07.
- `[NEEDS ASSET]` foto Lo Kheng Hong — opsional.
- `[NEEDS ASSET]` kemasan Indomie / Ultra Milk, logo BCA / Indofood CBP / Ultrajaya / United Tractors — opsional. Tanpa itu: kartu nama + kode saham, **bukan logo tiruan**.
- **UNTR**: hanya dua angka dari narasi (± Rp250 di 1998, ± Rp15 ribu kemudian), tanpa grafik. Kalau mau grafik harga sungguhan: `[NEEDS DATA: UNTR harga bulanan 1998–2008]`.
- **SC05**: 100 → 110 → 121 → 133 adalah ilustrasi (10% per periode); bukan data pasar, tidak diberi tag apa pun di layar.
- **Label roadmap** (Gaji & Waktu · Uang Yang Ikut Bekerja · Ikut Punya Bisnis · Cerita Lo Kheng Hong) — usulanku, silakan ganti.
- Gaya Scene Transisi: TA09. Alternatif TA11 (kartu bernomor + kursor) tersedia.
