# VI01 — PASSIVE INCOME
## Script re-timed against the recorded VO

**Source of timing:** `INV01 - Main VO.srt` (Premiere STT) → `assets/VI01_PassiveIncome_Sub_CORRECTED.srt`
**VO file:** `INV01 - Main VO.MP3` → `public/vo/passive-income.mp3` — durasi audio **317.656 s (05:17.656)**
**VO length (SRT):** kata terakhir keluar 05:17.566 · **f19054 @ 60 fps** · comp length **19,260 f (05:21.000)** — 206 f / 3.4 s tail untuk menahan quote penutup
**Episode folder:** `src/episodes/vi01-passive-income/` · composition **`VI01-PassiveIncome`** · fps **60**
**Original script estimate:** 04:10 → rekaman nyata **05:17.7 (termasuk dua jeda 0,5 s), +67.7 s lebih panjang.** Semua timestamp di script asli mati; pakai hanya tabel di bawah. Script dengan timing baru: `docs/VI01_PassiveIncome_Script_RETIMED.txt`.

### Cara subtitle dibuat ulang
`scripts/vi01-align.py` — kata-kata script dicocokkan ke kata-kata SRT (waktunya dari SRT), lalu:
- **satu cue = satu kalimat**, satu baris. Kalimat yang terlalu lebar untuk satu baris (diukur dengan font aslinya, Plus Jakarta Sans 36px, maks 1560 px) dipotong — hanya di titik dua, koma, atau jeda bicara, tidak pernah di tengah frasa;
- batas kalimat yang jatuh **di dalam** satu cue SRT (mis. "…kita tunggu: GAJIAN. Kita kerja, …") dipindah ke 20 ms paling sunyi di audio dekat perkiraan — itu napas si pembicara;
- tulisan 100% dari script asli (huruf kapital, tanda baca). Yang dibetulkan dari SRT: *pasif → passive, human aset → human asset, finansial aset → financial asset, lokeng Hong → Lo Kheng Hong, bca → BCA, karir → karier, sekedar → sekadar, 50.100 ribu → Rp50 ribu, Rp100 ribu, 15.000 → Rp15 ribu, Aku → aku, cebeli → beli*.

Hasil: **86 cue dari 65 kalimat**, cue terlebar 1554 px.

Dua timing per scene:
- **VO** — kata pertama masuk / kata terakhir keluar.
- **BLOCK** — blok scene kontinu, dipotong di **titik tengah keheningan** antar scene; blok bertemu ujung-ke-ujung, timeline utuh f0 → f19260.

---

## ⚠ Jeda di VO

| Di | Panjang | Kenapa |
|---|---|---|
| f150 (00:02.500, antara "tunggu:" dan "GAJIAN") | **+30 f / 0.5 s** | Simon, 2026-10-06: "Di frame 150, beri jeda 30 frame (VO dan scene visual)" |
| f230 (00:03.833, antara "GAJIAN." dan "Kita kerja") | **+30 f / 0.5 s** | Simon, 2026-10-06: "230 kasih jeda 30 frame" — setelahnya GAJIAN + kalender naik keluar, foto "Orang Kerja" naik dari bawah ke tengah |

Semua angka di dokumen ini sudah termasuk jeda itu. VO dibangun ulang dari file asli oleh `scripts/vi01-vo.py` (daftar jeda: `src/episodes/vi01-passive-income/data/pads.json`); subtitle oleh `scripts/vi01-align.py`, yang membaca daftar yang sama.

## Master timing table

| Scene | BLOCK (frames) | BLOCK (tc) | Dur | VO in – VO out | Cues | Part |
|---|---|---|---|---|---|---|
| SC01 | 0 – 999 | 00:00.000 – 00:16.650 | 16.65 s | 00:00.166 – 00:16.366 | 1–4 | cold open |
| SC02 | 999 – 2093 | 00:16.650 – 00:34.883 | 18.23 s | 00:16.933 – 00:34.666 | 5–9 | cold open |
| SC03 | 2093 – 3085 | 00:34.883 – 00:51.417 | 16.53 s | 00:35.100 – 00:51.266 | 10–14 | cold open |
| SC04 | 3085 – 4038 | 00:51.417 – 01:07.300 | 15.88 s | 00:51.566 – 01:07.100 | 15–18 | 01 |
| SC05 | 4038 – 5335 | 01:07.300 – 01:28.917 | 21.62 s | 01:07.500 – 01:28.700 | 19–23 | 01 |
| SC06 | 5335 – 6417 | 01:28.917 – 01:46.950 | 18.03 s | 01:29.133 – 01:46.900 | 24–28 | 01 |
| SC07 | 6417 – 7628 | 01:46.950 – 02:07.133 | 20.18 s | 01:47.000 – 02:06.866 | 29–35 | 01 |
| SC08 | 7628 – 8582 | 02:07.133 – 02:23.033 | 15.90 s | 02:07.400 – 02:22.900 | 36–39 | 01 |
| SC09 | 8582 – 9604 | 02:23.033 – 02:40.067 | 17.03 s | 02:23.166 – 02:39.866 | 40–43 | 02 |
| SC10 | 9604 – 10660 | 02:40.067 – 02:57.667 | 17.60 s | 02:40.266 – 02:57.466 | 44–49 | 02 |
| SC11 | 10660 – 11746 | 02:57.667 – 03:15.767 | 18.10 s | 02:57.866 – 03:15.500 | 50–54 | 02 |
| SC12 | 11746 – 12533 | 03:15.767 – 03:28.883 | 13.12 s | 03:16.033 – 03:28.700 | 55–58 | 02 |
| SC13 | 12533 – 13669 | 03:28.883 – 03:47.817 | 18.93 s | 03:29.066 – 03:47.733 | 59–63 | 03 |
| SC14 | 13669 – 14939 | 03:47.817 – 04:08.983 | 21.17 s | 03:47.900 – 04:08.900 | 64–68 | 03 |
| SC15 | 14939 – 15978 | 04:08.983 – 04:26.300 | 17.32 s | 04:09.066 – 04:26.133 | 69–72 | 03 |
| SC16 | 15978 – 16854 | 04:26.300 – 04:40.900 | 14.60 s | 04:26.466 – 04:40.566 | 73–75 | close |
| SC17 | 16854 – 18066 | 04:40.900 – 05:01.100 | 20.20 s | 04:41.233 – 05:01.000 | 76–82 | close |
| SC18 | 18066 – 19260 | 05:01.100 – 05:21.000 | 19.90 s | 05:01.200 – 05:17.566 | 83–86 | close |

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
| ST1 — cold open → bab 1 | SC03 → SC04 | 0.30 s | **3050 – 3220** |
| ST2 — bab 1 → bab 2 | SC08 → SC09 | 0.27 s | **8546 – 8716** |
| ST3 — bab 2 → bab 3 | SC12 → SC13 | 0.37 s | **12497 – 12667** |

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

### SCENE 01 — f0–999 · 00:00.000–00:16.650 · **16.65 s**
**NARRATION** (VO 00:00.166–00:16.366)
Setiap bulan, ada satu momen yang selalu kita tunggu: GAJIAN.
Kita kerja, dapat penghasilan, lalu pakai uang itu untuk menjalani hidup.
Tapi coba bayangin kalau suatu hari kita harus berhenti kerja sementara.
Apakah penghasilan kita juga ikut berhenti?

**Beat anchors**
- "GAJIAN" — 00:03.2 · f190
- "Kita kerja" — 00:03.7 · f220
- "berhenti kerja sementara" — 00:12.2 · f731
- "Apakah" — 00:14.3 · f856

**VISUAL**
Grid bergerak pelan. Kartu kalender bulan ini; tanggal-tanggal lewat cepat, lalu berhenti di tanggal gajian — stempel **GAJIAN** jatuh di f190 (pop, satu-satunya pop di scene).
Si pekerja (pose 01) masuk dari kiri. Di sebelahnya tumbuh alur tiga node: **Kerja → Penghasilan → Hidup** (indigo), satu per frasa (f220 / ~f290 / ~f390).
f731 "berhenti kerja sementara": node **Kerja** meredup dan diberi ikon jeda; panah ke Penghasilan putus. Si pekerja ganti ke pose 04 (lesu).
f856: tanda tanya muncul di node Penghasilan — **"Penghasilan ikut berhenti?"**
Akhiri: alur yang terputus di tengah.

### SCENE 02 — f1059–2093 · 00:16.650–00:34.883 · **18.23 s**
**NARRATION** (VO 00:16.933–00:34.666)
Makanya, banyak orang berusaha menambah penghasilan.
Ada yang mengejar naik jabatan, belajar skill baru, bangun bisnis, ambil freelance, atau cari side hustle.
Semua itu bagus, tapi hampir semuanya tetap membutuhkan satu hal yang sama: waktu dan tenaga kita.

**Beat anchors**
- "naik jabatan" — 00:22.0 · f1318
- "belajar skill" — 00:23.2 · f1390
- "bangun bisnis" — 00:24.7 · f1482
- "ambil freelance" — 00:25.7 · f1540
- "side hustle" — 00:28.0 · f1682
- "waktu dan tenaga" — 00:33.4 · f2002

> ⚠ Lima chip mendarat **di kata masing-masing** — jaraknya tidak rata (72 / 92 / 58 / 142 f). Jangan dibuat grid rata.

**VISUAL**
Judul **Menambah Penghasilan**. Lima chip muncul satu per kata, menyebar mengelilingi si pekerja (pose 06): **Naik jabatan · Skill baru · Bangun bisnis · Freelance · Side hustle**.
f2002: dari kelima chip ditarik garis ke satu pil di bawah — **Waktu + Tenaga** (indigo, ikon jam & baterai). Semua jalan bertemu di sana.
Akhiri: lima jalan, satu sumber yang sama.

### SCENE 03 — f2153–3085 · 00:34.883–00:51.417 · **16.53 s**
**NARRATION** (VO 00:35.100–00:51.266)
Masalahnya, sehari tetap cuma 24 jam.
Semakin dewasa, tanggung jawab biasanya justru makin banyak.
Jadi selain bertanya, “Gimana caranya aku bisa menghasilkan lebih banyak?”
Kita juga perlu mulai bertanya: “Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”

**Beat anchors**
- "24 jam" — 00:37.1 · f2225
- "Semakin dewasa" — 00:38.1 · f2284
- "Jadi selain" — 00:42.3 · f2538
- "Kita juga perlu" — 00:47.0 · f2818
- "ikut bekerja" — 00:50.5 · f3028

**VISUAL**
Satu bar hari: **24 kotak jam**. f2284: kotak-kotaknya terisi blok tanggung jawab (Kerja, Perjalanan, Keluarga, Istirahat…) sampai penuh — tidak ada kotak kosong tersisa. Si pekerja pose 04.
Bar mundur ke atas. f2538: pertanyaan pertama di kotak garis-putus TA07, diketik — **“Gimana caranya aku bisa menghasilkan lebih banyak?”**
f2818: pertanyaan pertama meredup dan bergeser; pertanyaan kedua diketik di bawahnya — **“Gimana caranya uang yang sudah aku hasilkan ikut bekerja?”**, dengan **ikut bekerja** ber-tint cyan tepat di f3028.
Akhiri: pertanyaan kedua menyala, pertanyaan pertama redup.

**→ SCENE TRANSISI 1 overlay f3110–3220** — SC03 dilipat ke kartu atas **Gaji & Waktu**, tiga kartu bab terbuka, kartu 1 **Uang Yang Ikut Bekerja** menyala, kamera masuk.

## PART 01 — UANG YANG IKUT BEKERJA

### SCENE 04 — f3145–4038 · 00:51.417–01:07.300 · **15.88 s**
**NARRATION** (VO 00:51.566–01:07.100)
Di sinilah konsep passive income mulai masuk.
Bukan berarti investasi hari ini, lalu besok langsung berhenti kerja.
Kita tetap kerja, tetap bangun karier, dan tetap belajar.
Bedanya, sebagian uang yang kita hasilkan mulai kita ubah menjadi aset.

**Beat anchors**
- "passive income" — 00:52.6 · f3158
- "Bukan berarti" — 00:54.7 · f3284
- "lalu besok" — 00:56.9 · f3416
- "Kita tetap kerja" — 00:59.1 · f3548
- "Bedanya" — 01:02.8 · f3768
- "menjadi aset" — 01:06.3 · f3978

**VISUAL**
Judul besar di tengah **Passive Income** (f3158), lalu naik ke posisi judul.
f3284: anggapan yang salah ditulis — **Investasi hari ini → besok berhenti kerja** — dan dicoret di f3416 (Strike, merah hanya di kata yang menamai kesalahan).
f3548: tiga chip ✓ — **Tetap kerja · Tetap bangun karier · Tetap belajar**.
f3768: alur SC01 kembali (**Kerja → Penghasilan**), lalu sebagian Penghasilan terpisah dan mengalir ke node baru **Aset** (cyan) di f3978.
Akhiri: Kerja → Penghasilan → **Aset**.

### SCENE 05 — f4098–5335 · 01:07.300–01:28.917 · **21.62 s**
**NARRATION** (VO 01:07.500–01:28.700)
Dan di sini, waktu punya peran besar.
Kalau sebuah aset menghasilkan keuntungan, keuntungan itu bisa ikut menghasilkan keuntungan berikutnya.
Misalnya, 100 jadi 110, lalu 121, lalu 133.
Itulah konsep compounding: hasil yang terus ikut bertumbuh seiring waktu.

**Beat anchors**
- "waktu punya peran besar" — 01:08.8 · f4128
- "keuntungan itu" — 01:13.0 · f4378
- "Misalnya" / "100" — 01:16.4 · f4584
- **"110"** — 01:18.7 · **f4724**
- **"121"** — 01:20.3 · **f4818**
- **"133"** — 01:22.6 · **f4957**
- "compounding" — 01:25.2 · f5112

> ⚠ Angka **mendarat di kata yang diucapkan** (140 / 94 / 139 f) — tidak rata.

**VISUAL**
Sumbu waktu horizontal (f4128). Empat batang tumbuh satu per angka: **100 → 110 → 121 → 133**. Tiap batang = batang sebelumnya (cyan pucat) + tambahan baru di atasnya (cyan penuh); dari batang ketiga, tambahan itu dibelah dua: bagian dari modal awal dan bagian **dari keuntungan sebelumnya** — itu yang dinamai f4378 "keuntungan itu bisa ikut menghasilkan keuntungan".
f5112: judul **Compounding** dan baris di bawahnya — **hasil yang terus ikut bertumbuh seiring waktu**.
Angka ini ilustrasi (10% per periode, 133,1 dibulatkan) — bukan data pasar.
Akhiri: empat batang + kata Compounding.

### SCENE 06 — f5395–6417 · 01:28.917–01:46.950 · **18.03 s**
**NARRATION** (VO 01:29.133–01:46.900)
Makanya, kita nggak harus nunggu punya modal besar dulu.
Yang penting adalah mulai membangun kebiasaannya.
Karena investasi bukan cuma soal uang.
Semakin sering kita belajar dan mengevaluasi keputusan,
semakin baik juga kemampuan kita mengelola aset.

**Beat anchors**
- "modal besar" — 01:31.6 · f5496
- "kebiasaannya" — 01:35.5 · f5731
- "Karena investasi" — 01:37.0 · f5818
- "Semakin sering" — 01:39.8 · f5986
- "semakin baik" — 01:43.5 · f6212

**VISUAL**
f5496: tumpukan uang besar berlabel **Modal besar dulu?** — dicoret.
f5731: kalender kebiasaan — kotak-kotak bulan terisi ✓ satu per satu (streak), label **Kebiasaan**.
f5986: siklus tiga node berputar — **Belajar → Evaluasi keputusan → Kelola aset** — dan tiap putaran, bar **Kemampuan** di sampingnya naik satu tingkat (f6212).
Akhiri: siklus + bar kemampuan naik.

### SCENE 07 — f6477–7628 · 01:46.950–02:07.133 · **20.18 s**
**NARRATION** (VO 01:47.000–02:06.866)
Kalau dipikir-pikir, kekayaan kita punya dua bagian.
Yang pertama, human asset: waktu, kemampuan, dan pengalaman yang membantu kita menghasilkan uang.
Yang kedua, financial asset: tabungan, investasi, dan aset yang kita bangun dari penghasilan tadi.
Human asset punya batas. Financial asset bisa terus kita miliki.

**Beat anchors**
- "dua bagian" — 01:48.9 · f6533
- "human asset" — 01:50.5 · f6630
- "financial asset" — 01:57.0 · f7017
- "punya batas" — 02:03.6 · f7415
- "Financial asset bisa" — 02:04.4 · f7467

**VISUAL**
Satu kartu dibelah dua (f6533): kiri **Human Asset** (indigo), kanan **Financial Asset** (cyan).
Kiri, di f6630: **Waktu · Kemampuan · Pengalaman** (tiga baris dengan ikon). Kanan, di f7017: **Tabungan · Investasi · Aset**.
f7415: di bawah Human Asset muncul jam pasir yang menipis — **Punya batas**. f7467: di bawah Financial Asset garis yang terus naik — **Bisa terus dimiliki**.
Akhiri: dua kolom, dua nasib.

### SCENE 08 — f7688–8582 · 02:07.133–02:23.033 · **15.90 s**
**NARRATION** (VO 02:07.400–02:22.900)
Waktu masih muda, wajar kalau sebagian besar penghasilan datang dari kerja.
Tapi idealnya, saat income kita meningkat, aset kita juga ikut tumbuh.
Bayangin seperti estafet: kita kerja untuk menghasilkan uang, lalu sebagian uang itu kita teruskan untuk membangun aset.

**Beat anchors**
- "Waktu masih muda" — 02:07.4 · f7644
- "Tapi idealnya" — 02:11.6 · f7894
- "estafet" — 02:16.7 · f8204
- "lalu sebagian" — 02:19.3 · f8360

**VISUAL**
Dua warna SC07 dibawa ke sumbu umur (**Muda → Tua**): di kiri hampir semua penghasilan indigo (dari kerja); f7894 kedua lapisan naik, lapisan cyan (aset) makin tebal ke kanan. Ilustrasi bentuk, tanpa angka.
f8204: berganti ke **estafet** — dua pelari: **Kerja** (indigo) membawa tongkat **Uang**, f8360 menyerahkannya ke pelari **Aset** (cyan).
Akhiri: tongkat berpindah tangan.

**→ SCENE TRANSISI 2 overlay f8606–8716** — SC08 dilipat ke kartu 1, kartu 2 **Ikut Punya Bisnis** menyala, kamera masuk.

## PART 02 — IKUT PUNYA BISNIS

### SCENE 09 — f8642–9604 · 02:23.033–02:40.067 · **17.03 s**
**NARRATION** (VO 02:23.166–02:39.866)
Hal menarik dari investasi adalah:
kita nggak harus bekerja di sebuah perusahaan untuk ikut memiliki sebagian dari bisnisnya.
Ada orang yang bekerja di BCA untuk mendapatkan penghasilan.
Di sisi lain, sebagai investor, kita juga bisa punya sebagian kecil dari bisnis BCA.

**Beat anchors**
- "kita nggak harus" — 02:25.5 · f8730
- "Ada orang" — 02:31.3 · f9080
- "BCA" — 02:32.6 · f9154
- "Di sisi lain" — 02:35.1 · f9308
- "sebagian kecil" — 02:38.2 · f9493

**VISUAL**
Satu gedung perusahaan di tengah: kartu **Bank Central Asia · BBCA**.
f9080: di kiri, si pekerja (pose 01) — panah **kerja** masuk ke gedung, panah **gaji** kembali (indigo). Label **Karyawan**.
f9308: di kanan, orang kedua — tidak ada panah kerja; sebuah irisan kecil gedung terangkat dan mendarat di tangannya (cyan, f9493). Label **Investor**.
Akhiri: satu perusahaan, dua cara terhubung — Karyawan (gaji) / Investor (sebagian kecil bisnis).

### SCENE 10 — f9664–10660 · 02:40.067–02:57.667 · **17.60 s**
**NARRATION** (VO 02:40.266–02:57.466)
Hal yang sama sebenarnya ada di sekitar kita setiap hari.
Kita makan Indomie, minum Ultra Milk, dan menggunakan banyak produk dari perusahaan besar.
Sebagai konsumen, kita menikmati produknya.
Tapi lewat investasi, kita juga bisa ikut punya sebagian kecil dari bisnis di balik produk-produk itu.

**Beat anchors**
- "Indomie" — 02:44.5 · f9868
- "Ultra Milk" — 02:45.4 · f9924
- "dan menggunakan" — 02:46.2 · f9972
- "Sebagai konsumen" — 02:48.7 · f10124
- "Tapi lewat" — 02:52.2 · f10330
- "di balik" — 02:56.1 · f10564

**VISUAL**
Kartu produk mendarat satu per kata: **Indomie** (f9868), **Ultra Milk** (f9924), lalu dua kartu produk generik (f9972). Label kiri atas **Konsumen** (f10124).
f10330: kartu-kartu itu **berbalik** — di belakangnya perusahaan dan kodenya: **Indofood CBP · ICBP**, **Ultrajaya · ULTJ**. Label berganti **Pemilik (sebagian kecil)** di f10564.
`[NEEDS ASSET: foto/kemasan produk Indomie & Ultra Milk — opsional; tanpa itu kartunya teks + ilustrasi sederhana, bukan logo tiruan]`
Akhiri: produk di depan, bisnis di belakangnya.

### SCENE 11 — f10720–11746 · 02:57.667–03:15.767 · **18.10 s**
**NARRATION** (VO 02:57.866–03:15.500)
Dan di sinilah bedanya antara sekadar menghasilkan uang, dengan mulai membangun aset.
Sebuah bisnis bisa menghasilkan pendapatan, mencetak laba, lalu memakai laba itu untuk berkembang lebih jauh.
Sebagai pemilik sebagian dari bisnis tersebut, kita ikut punya exposure terhadap pertumbuhan nilainya.

**Beat anchors**
- "bedanya" — 02:58.6 · f10719
- "dengan mulai" — 03:02.2 · f10930
- "pendapatan" — 03:05.8 · f11148
- "mencetak laba" — 03:06.4 · f11182
- "lalu memakai" — 03:07.4 · f11246
- "exposure" — 03:13.1 · f11588

**VISUAL**
f10719: dua label berhadapan — **Menghasilkan uang** (indigo) vs **Membangun aset** (cyan, f10930).
f11148: roda bisnis tiga node — **Pendapatan → Laba (f11182) → Berkembang (f11246)** — dan tiap putaran rodanya membesar.
f11588: irisan kecil roda itu disorot cyan — **Pemilik ikut punya exposure ke pertumbuhan nilainya**. Tanpa angka, tanpa grafik harga.
Akhiri: roda yang tumbuh + irisan pemilik.

### SCENE 12 — f11806–12533 · 03:15.767–03:28.883 · **13.12 s**
**NARRATION** (VO 03:16.033–03:28.700)
Dan mulainya nggak harus besar. Bisa Rp50 ribu, Rp100 ribu, atau Rp300 ribu.
Yang paling penting bukan nominal pertamanya, tapi kebiasaan untuk menyisihkan sebagian income dan mulai mengubahnya menjadi aset.

**Beat anchors**
- **"Rp50"** — 03:18.1 · **f11885**
- **"Rp100"** — 03:18.6 · **f11913**
- **"Rp300"** — 03:19.9 · **f11996**
- "Yang paling" — 03:21.2 · f12074
- "tapi kebiasaan" — 03:23.6 · f12214
- "mengubahnya" — 03:27.2 · f12433

> ⚠ Tiga nominal hanya 28 f lalu 83 f terpisah — chip harus cepat (pop UI, bukan reveal teks).

**VISUAL**
Tiga chip nominal: **Rp50 ribu · Rp100 ribu · Rp300 ribu** di kata masing-masing.
f12074: ketiganya meredup — "bukan nominal pertamanya".
f12214: barisan bulan (Jan…Des): tiap bulan bar income masuk, sepotong kecil di atasnya dipotong dan jatuh ke toples **Aset** (cyan) — berulang, toples terisi. f12433 label **Kebiasaan menyisihkan**.
Akhiri: toples yang terisi pelan-pelan.

**→ SCENE TRANSISI 3 overlay f12557–12667** — SC12 dilipat ke kartu 2, kartu 3 **Cerita Lo Kheng Hong** menyala, kamera masuk.

## PART 03 — CERITA LO KHENG HONG

### SCENE 13 — f12593–13669 · 03:28.883–03:47.817 · **18.93 s**
**NARRATION** (VO 03:29.066–03:47.733)
Lo Kheng Hong juga nggak langsung mulai sebagai investor besar.
Sebelum dikenal seperti sekarang, dia pernah bekerja sebagai pegawai bank.
Sambil bekerja, dia menabung, belajar, membaca laporan perusahaan, dan pelan-pelan mulai berinvestasi.
Salah satu contoh terkenalnya adalah saat dia membeli saham United Tractors.

**Beat anchors**
- "Lo Kheng Hong" — 03:29.1 · f12544
- "pegawai bank" — 03:36.4 · f12986
- "menabung" — 03:38.2 · f13091
- "membaca laporan" — 03:39.2 · f13155
- "pelan-pelan" — 03:41.0 · f13258
- "United Tractors" — 03:46.3 · f13580

**VISUAL**
Kartu nama **Lo Kheng Hong** (f12544). `[NEEDS ASSET: foto Lo Kheng Hong — opsional; tanpa foto, kartu nama saja]`
Garis waktu kiri → kanan, satu titik per kata: **Pegawai bank** (f12986) → **Menabung** (f13091) → **Belajar & membaca laporan perusahaan** (f13155) → **Mulai berinvestasi** (f13258).
f13580: titik terakhir — kartu **United Tractors · UNTR**.
Akhiri: garis waktu dengan UNTR di ujungnya (dibawa ke SC14).

### SCENE 14 — f13729–14939 · 03:47.817–04:08.983 · **21.17 s**
**NARRATION** (VO 03:47.900–04:08.900)
Saat krisis 1998, Lo Kheng Hong membeli United Tractors di harga sekitar Rp250 per saham.
Beberapa tahun kemudian, nilainya sudah meningkat berkali-kali lipat, bahkan pernah berada di kisaran sekitar Rp15 ribu.
Tapi tentu saja, ini adalah contoh dari masa lalu.
Nggak semua investasi akan memberikan hasil seperti ini.

**Beat anchors**
- "krisis 1998" — 03:48.5 · f13710
- "Rp250" — 03:53.7 · f14023
- "berkali-kali lipat" — 03:57.7 · f14260
- "Rp15 ribu" — 04:01.0 · f14460
- "Tapi tentu saja" — 04:02.0 · f14520
- "Nggak semua" — 04:05.7 · f14742

**VISUAL**
Kartu UNTR dari SC13 pindah ke tengah (continuity).
f13710: chip tahun **Krisis 1998**. f14023: label harga **± Rp250 / saham**.
f14260: panah panjang ke kanan atas — **beberapa tahun kemudian** — dan f14460 label **± Rp15 ribu**. Hanya dua angka yang diucapkan narasi; **tanpa grafik harga** (tidak ada data yang diberikan untuk itu).
f14520: semuanya meredup di balik kotak peringatan — **Contoh dari masa lalu**; f14742 baris **Nggak semua investasi akan memberikan hasil seperti ini.**
Akhiri: peringatan di depan, cerita di belakang.

### SCENE 15 — f14999–15978 · 04:08.983–04:26.300 · **17.32 s**
**NARRATION** (VO 04:09.066–04:26.133)
Yang menarik dari cerita ini sebenarnya bukan: “Cari saham yang bisa naik berkali-kali.”
Yang lebih penting justru prosesnya.
Kerja untuk menghasilkan uang, sisihkan sebagian, pelajari asetnya, beli sesuatu yang benar-benar dipahami, lalu beri waktu untuk berkembang.

**Beat anchors**
- "Cari saham" — 04:11.5 · f15093
- "Yang lebih penting" — 04:14.5 · f15272
- **"Kerja untuk"** — 04:17.1 · **f15424**
- **"sisihkan"** — 04:18.5 · **f15512**
- **"pelajari"** — 04:20.1 · **f15608**
- **"beli"** — 04:21.2 · **f15672**
- **"lalu beri waktu"** — 04:24.1 · **f15844**

> ⚠ Lima langkah mendarat di kata masing-masing (88 / 96 / 64 / 172 f).

**VISUAL**
f15093: kotak garis-putus TA07 — **“Cari saham yang bisa naik berkali-kali.”** — lalu dicoret saat "Yang lebih penting" (f15272).
Rel lima langkah: **1 Kerja · 2 Sisihkan · 3 Pelajari · 4 Beli yang dipahami · 5 Beri waktu**, tiap langkah menyala di katanya.
Akhiri: rel lima langkah penuh.

## PENUTUP

### SCENE 16 — f16038–16854 · 04:26.300–04:40.900 · **14.60 s**
**NARRATION** (VO 04:26.466–04:40.566)
Jadi membangun passive income bukan berarti kita harus lari dari pekerjaan.
Kita tetap bisa bangun karier, urus keluarga, dan menikmati hidup sekarang.
Bedanya, sebagian hasil kerja kita hari ini mulai ikut disiapkan untuk masa depan.

**Beat anchors**
- "lari dari" — 04:29.2 · f16152
- "Kita tetap bisa" — 04:31.2 · f16274
- "urus keluarga" — 04:32.8 · f16367
- "menikmati hidup" — 04:34.0 · f16442
- "Bedanya" — 04:35.8 · f16546
- "masa depan" — 04:39.9 · f16796

**VISUAL**
Si pekerja (pose 01) di tengah. f16152: label **Lari dari pekerjaan** — dicoret.
Tiga chip ✓ di katanya: **Bangun karier · Urus keluarga · Menikmati hidup**.
f16546: bar **hasil kerja hari ini** dibelah — sebagian besar **Hari ini** (indigo), sepotong **Masa depan** (cyan, f16796).
Akhiri: bar terbelah dua warna.

### SCENE 17 — f16914–18066 · 04:40.900–05:01.100 · **20.20 s**
**NARRATION** (VO 04:41.233–05:01.000)
Di awal, aset kita mungkin masih kecil.
Tapi kalau kemampuan kerja terus berkembang, income bertambah, dan aset juga ikut tumbuh, pelan-pelan kita nggak cuma punya satu sumber kekuatan finansial.
Kita juga mulai punya lebih banyak pilihan. Jadi setiap kali income masuk, coba tanya: “Berapa yang bisa aku sisihkan untuk mulai punya aset?”

**Beat anchors**
- "Di awal" — 04:41.2 · f16874
- "Tapi kalau" — 04:44.0 · f17040
- "income bertambah" — 04:46.0 · f17158
- "dan aset juga" — 04:46.9 · f17216
- "pelan-pelan" — 04:48.6 · f17314
- "lebih banyak pilihan" — 04:53.1 · f17587
- "Jadi setiap" — 04:54.8 · f17688
- “Berapa…” — 04:57.9 · f17872

**VISUAL**
Tiga bar: **Kemampuan · Income · Aset**. f16874 Aset masih pendek. f17040 / f17158 / f17216 ketiganya naik bergantian.
f17314: dua pilar — **Kerja** (indigo) dan **Aset** (cyan) — menopang satu atap **Kekuatan finansial**. f17587: dari atap itu tumbuh beberapa cabang **Pilihan**.
f17688: kotak garis-putus TA07 diketik — **“Berapa yang bisa aku sisihkan untuk mulai punya aset?”**, **mulai punya aset** ber-tint cyan.
Akhiri: pertanyaan itu, menyala.

### SCENE 18 — f18126–19260 · 05:01.100–05:21.000 · **19.90 s**
**NARRATION** (VO 05:01.200–05:17.566)
Karena pada akhirnya, kerja berarti kita menggunakan waktu untuk menghasilkan uang.
Sedangkan investasi, membuat sebagian uang yang sudah kita hasilkan ikut bekerja untuk masa depan.
Jadi kita pelan-pelan berubah dari sekadar pekerja menjadi pekerja yang juga punya aset.

**Beat anchors**
- "kerja berarti" — 05:02.4 · f18144
- "Sedangkan investasi" — 05:06.2 · f18370
- "ikut bekerja" — 05:10.1 · f18608
- "Jadi kita" — 05:12.5 · f18752
- "menjadi pekerja" — 05:15.7 · f18944

**VISUAL**
Dua baris, gaya Rules TA11: **Kerja** → *Waktu jadi uang* (indigo) (f18144) · **Investasi** → *Uang ikut bekerja* (cyan) (f18370 / f18608).
f18752: semuanya bersih; quote card penutup TA09 di atas grid, Tuntun mark melayang di atasnya — **Dari sekadar pekerja, menjadi pekerja yang juga punya aset.** dengan **juga punya aset** ber-tint cyan (f18944). Si pekerja (pose 05) di samping kartu.
Tahan sampai f19260.

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
