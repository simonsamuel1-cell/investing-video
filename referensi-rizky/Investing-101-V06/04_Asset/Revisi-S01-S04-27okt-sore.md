# Status revisi Scene 1–4 (brief Simon 27 Okt 15.30 + jawaban 16.00)

Pratinjau: `preview-revisi-27okt-sore/` (S01-01, S01-02, S02-S03_revisi, S04_revisi, S01-S04_garis-bantu, S02-H_sapuan-lembut).
Garis bantu: komposisi Studio **KesalahanInvestor-Guide** (atau input `{"guide": true}`) — sumbu x 960 / y 497 / y 540, area aman, 12 kolom,
zona logo & pita subtitle, kolom kustom per scene (`src/parts/Guide.tsx` → `KOLOM`). Tidak ikut render final.

## Scene 1
| Butir | Status | Frame |
|---|---|---|
| Kotak sorot turkis "Tiga kesalahan", teks **putih** (jawaban A) | selesai | 1716–1790 |
| Teks "yang paling sering dilakukan investor" ungu brand | selesai | 1800–1900 |
| Swipe ke bawah tidak bersamaan (guru → kartu 03 → 02 → 01 → teks → judul, selang 6 f); ikon berikutnya pop saat yang terakhir di setengah jalan | selesai | 2496–2616 |
| Hitung mundur 2026 → **50.000 SM** (zaman batu / awal manusia modern), penggaris tahun + motion blur | selesai | 2660–2775 |

## Scene 2
| Butir | Status | Frame |
|---|---|---|
| Lingkaran otak MEMBESAR & berubah bentuk jadi panel 1 (satu bentuk; bingkai ungu → oranye; isi putih + ikon memudar di dalam bingkai) | selesai | 3288–3348 |
| Panel 4 opsi A, tombak dipegang di TENGAH | selesai — lihat catatan ① | 3636–3840 |
| Penggabungan 4 panel → padang rumput (isi lama pudar → 4 jendela merapat → satu panel) | selesai | 4195–4285 |
| Tanda "=" rata tengah lingkaran (dua batang geometris, meleset ≤ 0,5 px) | selesai | 4440 (juga S04 10400) |
| Candle realistis & mengikuti naskah: ACES 20 Sep – 6 Nov 2023 riil (diskalakan Rp1.000): 4 BELI → 4 hijau, 4 JUAL → 4 merah, BELI investor 1 & 2 → naik lagi; sumbu harga | selesai | 4456–5400 |
| Lingkungan berubah → KOTA: SAPUAN LEMBUT (tokoh & latar diam, hanya latar & baju berganti, tepi ber-motion blur) — Simon 17.15: "dari dulu ke sekarang tidak perlu paralax" | selesai (pindai 0) | 6007–6067 |

## Scene 3
| Butir | Status | Frame |
|---|---|---|
| S02 → S03 paralaks dengan POHON Scene 3 (akasia dari Hutan.svg) + motion blur | selesai | 6130–6190 |
| Alam → anatomi: tiga cakram dari tengah (ST-02) | selesai | 6326–6392 |
| Siluet anatomi = BERKAS SIMON `23219 [Converted].svg` (tubuh depan pertama, tanpa organ; salinan `04_Asset/anatomi/`) — menggantikan trace manual 17.30 | selesai (pindai 0, 28 Okt); kartu kiri ≥ 100 px dari tangan kiri, kartu kanan ≥ 95 px dari tangan kanan — `S03_anatomi-file-Simon.png` | 6360–6740 |
| Anatomi → padang senja: DUA LINGKARAN ala video TA, mulai dari PUSAT FRAME, tumbuh DI ATAS papan anatomi yang masih LENGKAP (siluet + lingkaran otak + kartu + garis; Simon 28 Okt: "ketika lingkaran transisi muncul visualnya masih lengkap, bukan dihilangkan lalu mulai transisi") | selesai (pindai 0) — `S03_anatomi-ke-senja_papan-lengkap.jpg` | 6780–6846 |
| Buah tidak berputar (didekatkan ke mata + dicium + "?") | selesai | 6810–7130 |
| Bagian bawah toko / tokoh (Simon 28 Okt: "dari ini turunkan charnya sedikit (sampai mendekati garis putih)"): toko TETAP; tokoh adegan kota turun 50 px → kaki y 910, dekat garis putih jalan y 926 (tokoh yang berjalan juga, sejak muncul di adegan kota — Simon: "char yg berjalan ini seharusnya ikut turun") | selesai (pindai 0) — `S03_toko_f7840_tokoh-turun.png` | 7520–7990 |

## Scene 4
| Butir | Status | Frame |
|---|---|---|
| S03 → S04 tiga cakram | selesai | 8160–8226 |
| Duduk di sofa ruang tamu main ponsel (screenshot 2), ponsel tetap | selesai — lihat catatan ③ | 8190–9440, 11100–11511 |
| Klik BELI: jari menekan, tombol tertekan + riak, jadi "✓ Dibeli", jari turun | selesai | 9120–9200 |
| PE / ROE / tema untuk orang awam (konsep "lakukan dulu", angka ilustrasi) | selesai | 9440–10130 |
| S04 → adegan berikutnya: kotak naik (turkis → turkis muda → latar S05) | selesai | 11421–11511 |
| Ruang tamu → panel PE: KOTAK NAIK (Simon 17.14: "disini belum menggunakan transisi shape yang kotak"), panel PE naik bersama latar | selesai (pindai 0) | 9400–9490 |
| J → K ("kamu" → ruang tamu): TIGA CAKRAM (Simon 17.14: "ini gunakan shape lingkaran transisinya") | selesai (pindai 0) | 11054–11120 |
| Aturan swipe (Simon 17.20): adegan lama ikut tergeser ease-in cubic, tidak sampai keluar frame — kotak naik: adegan lama naik 320 px; paralaks: adegan lama sudah terdorong 960 px ease-in cubic | selesai | 9400–9440, 11421–11461 |
| RUANG TAMU = berkas Simon `Ruang tamu.svg` (28 Okt: "ganti ruang tamunya dengan ini" → "jangan discale, terapkan apa adanya"): 1:1 layar, dipecah lapis belakang + meja kopi di depan tokoh (`scripts/ekstrak-ruang-tamu.py`); tokoh duduk di sofa merah DIPERBESAR 1,23 ("Perbesar tokoh") sampai kaki menapak lantai; seluruh ruang turun 33 px sampai tepi meja menyentuh y 925 ("turunkan sampai mejanya menyentuh pita subtitle y 925"), lalu +20 = 53 px ("turunkan sedikit lagi"; berkas diperbarui Simon: tali lampu gantung sampai y −101); lingkaran otak ke kanan-atas kepala, kotak "Satu angka…" ke y 92. (Sofa Freepik B tidak dipakai lagi.) | selesai (pindai 0) — `S04_ruang-tamu-Simon*.png/jpg` | 8190–9440, 11100–11511 |

## Umum
- Subtitle berkotak di SEMUA scene + outro.
- Pindai loncatan: 2.164 pasang frame di semua jendela yang diubah → 1 lonjakan (f4225, latar & bayangan kotak penyatu) → diperbaiki → 0.

## Catatan / belum
① Urutan panel 4: naik batu → angkat tombak (membidik) → lempar → kena (lencana) → bertolak pinggang + kelompok bersorak. Pose membidik/bertolak
  pinggang/bersorak DIUKUR dari lembar pria-biru; gerak melempar = peralihan cepat antar dua pose terukur (paket tidak punya pose melempar).
② Siluet = gambar bentuk tubuh simetris (rig tokoh hanya 3/4, tidak punya tampak depan).
③ Pose duduk diukur dari figur duduk paket (3/4). Kaki screenshot 2 menyilang tampak DEPAN → tidak bisa dipindah ke rig 3/4; kaki sejajar.
- Belum dijalankan ulang: audit tabrakan DOM seluruh video, ukur fps Studio (motion blur di lapisan layar penuh bisa memperlambat pemutaran Studio;
  hasil render tidak terpengaruh).

## Lanjutan 28 Okt
- Selesai: sofa B terpasang, anatomi & dua lingkaran dipindai (975 pasang frame, 0 lonjakan).
- Toko S03: tokoh diturunkan ke dekat garis putih (toko tetap).
- Belum dijalankan: audit tabrakan DOM seluruh video, ukur fps Studio.

## Brief 28 Okt siang (koin · candle · teks · ponsel · alignment · easing · keyframe)
Pratinjau: `preview-revisi-28okt/`.

| Butir | Status | Frame |
|---|---|---|
| Koin balik modal: SEMUA 15 koin pop easeOutBack 60 f satu per satu (selang 6 f) — dulu koin ke-6…15 muncul begitu saja; angka PE & "N tahun laba" = jumlah koin yang tampak | selesai — `S04_koin-PE_*.jpg` | 9470–9535, 9615–9740 |
| Alignment koin & panel konteks: satu margin x 40 (judul, subjudul, garis dasar, baris koin, teks; dulu 30/32/40/46/50), baris 8 koin merentang penuh 40–500, koin ROE ukuran & jarak sama dengan PE | selesai — `S04_tiga-panel-margin-40_f10100_garis-bantu.png` | 9440–10130 |
| Teks panel yang dulu muncul dalam SATU frame ("Balik modal", "Laba Rp30", "30 ÷ 100", "Rp100/Rp300", "sendiri/utang", "Modal usaha") + label "Popularitas/Laba" yang hanya memudar → naik + opacity + motion blur 60 f | selesai | 9480–10070 |
| Contoh animasi candlestick + "pelajari dari video TA" → resep V08/V10: chart BERGULIR, riwayat sudah memenuhi jendela, candle baru TUMBUH linear dari harga buka (tutup/tertinggi/terendah bersama, opacity di sepertiga awal), candle tepi kiri memudar satu slot, skala harga terkunci. S02 (ACES + 19 hari riwayat asli sebelum 20 Sep) & chart pasar S04 (EMTK, 22 riwayat + 4 BELI). Waktu BELI/JUAL per kata tetap | selesai — `S02_candle-gulir-resep-TA.jpg`, `S04_candle-pasar-gulir-resep-TA.jpg` | 4426–5300, 10670–10840 |
| Kecilkan teks di atas tokoh: "Satu angka bukan analisis lengkap." huruf 52 → 40, pusat-x = kepala tokoh | selesai — `S04_teks-kecil-di-atas-kepala_*.png` | 11287–11508 |
| Ponsel geser kanan & turun: pusat 1300, 470 → 1360, 584; tombol BELI y 860 = setinggi permukaan meja (846–923). Catatan ④ | selesai — `S04_ponsel-BELI-sejajar-meja_f9200.png` | 8190–9440, 11100–11508 |
| Alignment S01–S04 (garis bantu, still tiap papan): siklus + kotak REFLEKSIVITAS S02 pusat 1009 → 960 · kartu anatomi S03 x 460/1450 → simetris 465/1455 · tiga kartu contoh & lingkaran otak akhir S03 y 470/440 → pusat isi 497 (cakram S04 ikut) | selesai — `S02-S04_alignment-dirapikan_garis-bantu.jpg` | 5800–5900, 6360–6850, 7900–8230 |
| Easing: pop yang di-ease DUA kali (skalaPop(cin) / io(cin)) → pop linear easeOutBack, geser inOut cubic sekali: tick penggaris & swipe keluar papan E/F S01, cincin ujung chart & mata panah busur S02, chip "puncak siklus" S04. Riak BELI ease-out → inOut cubic 60 f | selesai | 2496–2840, 4620–4710, 5440–5900, 9150–9210, 9620 |
| Keyframe konsisten 60 f (transisi, muncul, pergi): bilah kotak naik 40 → 60 f + adegan lama naik 60 f (dua tempat sama persis) · gulir penggaris 80 → 60 f, tinta 40 → 60 f · jari S03 40 → 60 f, jari S04 50 → 60 f · isi pudar saat panel menyatu S02 & S04 30 → 60 f, angka "02" 30 → 60 f. Tiga cakram (4 tempat) sudah identik 60 f selang 3 f | selesai | 2705–2765, 4165–4285, 7766–7912, 9100–9150, 9400–9490, 10120–10275, 11418–11508 |
| Pindai loncatan | 3.000 + 1.560 + 130 pasang frame · 0 lonjakan | semua jendela di atas |

④ Pusat BELI tepat di tengah permukaan meja (y 885) membuat dasar ponsel y 975 menempel kotak subtitle (y 978); dipilih BELI y 860 → dasar ponsel y 950.
**Komposisi dipusatkan** (Simon: "Ya, rapikan komposisi senja S03 dan padang S04 supaya kelompok tokoh + semak berada di tengah frame"):
S03 senja f6780–7480 tokoh + semak 705–1585 (pusat 1145) → geser −185 = 520–1400; matahari & latar tetap; saat layar terbelah tokoh tetap x 1440
(tengah belahan kanan). S04 padang f10244–10870 722–1325 (pusat 1023) → geser −63 = pusat 960; saat terbelah pusatnya x 480 (tengah belahan kiri,
dulu 543). Pindai 1.380 pasang frame · 0 lonjakan — `S03-S04_senja-padang-di-tengah_garis-bantu.jpg`. Chart kecil di ponsel S04 tetap diam.
Aksi tokoh (langkah, gestur, gigit, angguk) dan ketukan jari/tombol tetap berdurasi pendek — bukan muncul/pergi objek.

## Scene 05 — brief 28 Okt sore (setengah badan · awan pikiran · morf lingkaran)
Pratinjau: `preview-revisi-28okt/S05_*.jpg`.

| Butir | Status | Frame |
|---|---|---|
| Foto orang badan penuh → SETENGAH BADAN (skala 1,15, kepala y 160, pinggul memudar di pita subtitle) | selesai | 11480–11963 |
| Pertanyaan di dalam AWAN PIKIRAN = pola Video 05 Scene 01 (bentuk awan V02/03/05, dua titik pikiran kecil → besar, orang di tengah dulu lalu menepi bersamaan pop; orang + awan berpusat x 960). Dulu kartu oranye | selesai | 11663–11993 |
| "buat orangnya menghadap kekanan" → foto DICERMINKAN (sama dengan V05 yang memakai foto ini); lingkaran pembeli ikut dicerminkan | selesai | 11480–akhir S05 |
| Transisi: orang MENGECIL & DIMASKER LINGKARAN, satu bentuk, berakhir persis jadi lingkaran pembeli (mengikuti posisinya per frame); titik pikiran ikut terbawa kepala saat keluar | selesai | 11963–12023 |
| "timing masking dan lingkaran background seharusnya bersamaan · besar ke kecil · fade in" → cakram turkis = lingkaran masker itu sendiri (jari-jari 345 → 110 px bersamaan), opacity 0 → 1 dengan kemajuan yang sama | selesai | 11963–12023 |
| Hapus teks "Pembeli (kamu)" dan "Penjual" (chip BELI/JUAL tetap sebaris) | selesai | 12002–akhir S05 |
| BELI hijau · JUAL merah (warna naik/turun; dulu biru/oranye), riak tekan ikut warna tombol | selesai — ikon "ketuk" di samping tombol masih biru/oranye (ditanyakan) | 12032–12650 |
| Pindai loncatan | 730 + 200 + 240 pasang frame · 0 lonjakan | 11430–12240 |

## Audit aturan S01–S05 (28 Okt sore)
Ceklis per aturan + bukti frame: `Ceklis-aturan-S01-S05-28okt.md` · pratinjau `preview-revisi-28okt/Audit_*`.
Scene 05 tambahan: ikon ketuk DIHAPUS ("klik saja buttonnya secara harfiah"), papan D bergeser +130 bersama chip "Alasan beli/jual", chip di bawah lingkaran 73 → 43 px,
judul C 54 → 44 px, ▲/"?" lepas dari gelembung, cincin analisis trim path.

## Brief 28 Okt malam — Scene 05–08 + seluruh video
Pratinjau: `preview-revisi-28okt/S05_C-D_*`, `S06_idle-*`, `S07_*`, `S08_*`. Cadangan versi lama: `_arsip/s07-sebelum-28okt/`, `_arsip/s08-sebelum-28okt/`.

| Butir | Status | Frame |
|---|---|---|
| S05 gelembung jual-beli: tinggi sama, ekor TENGAH menunjuk kepala masing-masing (dulu ekor kiri, menghadap salah) | selesai | 12370–12760 |
| S05 alignment/spacing/layout sepanjang scene (orang turun ke y 585, judul C/D y 210, gelembung 258 px di atas pusat orang, panah & chip "Transaksi terjadi" di jarak tetap) | selesai | 11950–13000 |
| S06 idle dua tokoh lebih alami (napas + ayun kecil per fase, tanpa kaku) | selesai | 13300–14600 |
| S06 "berhenti untuk menganalisis…" : TANPA putar mundur — tokoh berhenti & ganti pose berpikir, tetangga tetap berlari | selesai — lengan jauh dibiarkan menggantung (lengan bersilang tidak bisa: lengan jauh di belakang badan) | 13926–14265 |
| S06 transisi PARALAKS ke dapur (detektor asap) & ke kota | selesai | 14590–14650, 15045–15110 |
| S06 sirene & api = berkas Simon (sirene merah "!" + sinar berkedip; api paket pemadam) | selesai | 14700–15030 |
| S06 kotak teks "Berlari dulu, baru bertanya kenapa." muncul KOSONG & sejak awal selebar seluruh kalimat → kotak pop bersama frasa pertama, melebar 60 f saat frasa kedua datang (ditemukan saat pratinjau) | selesai | 14410–14530 |
| S07 transisi masuk = "2 persegi" (bilah turkis · turkis muda, latar naik membawa kartu chart; resep kotak S04) | selesai | 15445–15535 |
| S07 candle = resep video TA (tumbuh dari harga buka, chart bergulir, domain halus; tiap BELI diklik → candle hijau) | selesai — sebelum BELI pertama (15535–15905) chart diam: 6 candle sebelum reli turun (1.255 → 1.145), bertentangan dengan VO "harga naik" | 15535–18012 |
| S07 orang menghadap kanan · teks "Kamu" dihapus · gelembung di ATAS KEPALA (ekor tengah, ujung ekor 16 px di atas kepala) | selesai | 16016–16570 |
| S07 tata letak: kamu (280–520) + kartu (820–1640) berpusat x 960 · notifikasi → pilihan sebaris berjarak 16 px · notifikasi keluar ke KIRI (dulu ke bawah melintasi chip pilihan) · klik BELI sebelum benda keluar (dulu tertekan saat sudah mengecil) | selesai | 16330–16580 |
| S07 transisi sesuai bentuk: kartu chart BER-MORF jadi panel padang & kembali (dulu chart pop keluar lalu panel pop masuk) | selesai | 16550–16610, 16925–16985 |
| S07 → S08: kartu chart BER-MORF jadi kartu IHSG | selesai | 18042–18102 |
| S08 candle IHSG HARIAN riil (Yahoo ^JKSE), resep TA: riwayat Des 2019–Feb 2020 penuh, candle Maret tumbuh di katanya, terendah 3.938 (intraday 3.912) 24 Mar | selesai | 18338–19082 |
| S08 "IHSG kemudian pulih": kartu melebar 96–1824, candle 26 Mar–30 Des tumbuh, chart menyusut sampai setahun tampak (seperti screenshot TradingView) | selesai — screenshot Simon berlanjut sampai 1 Mar 2021 (6.338); dipakai sampai 30 Des 2020 (5.979) supaya slot candle ±6,5 px (aturan ≥ 7 px) | 21212–21400 |
| S08 3 panel kejadian MUNCUL pop (keluar tetap swipe ke kanan) | selesai | 18308–18860 |
| S08 orang = brief S07 (menghadap kanan, tanpa "Kamu", gelembung di atas kepala) | selesai | 19880–20736 |
| S08 spacing/layout/animasi: kartu puncak y 210 (luar zona logo), notifikasi + kartu berpusat x 960, ruang kanan lembah 18 slot (penanda tak menutup label harga), JUAL diklik (resep klik), sorot kaki 60 f, tirai halt 60 f, panel padang = MORF (sama dengan S07), kamu G Ø170 di bawah kartu (kepala dulu menyentuh kartu) | selesai | 18012–21610 |
| Seluruh video — morf: S08 → S09 kartu IHSG membulat jadi lingkaran Ø320 = lingkaran yang membuka padang S09 (dulu kartu pop keluar sementara lingkaran S09 sudah membuka di atasnya) | selesai | 21577–21727 |
| Seluruh video — easing: S09 kabut 90 → 60 f · S10 "Tambah dana" denyut sinus 24 f → diklik (resep klik) · S10 ikon forced sell keluar 24 f → pop 60 f · S10 ganti warna kartu pasar meloncat di 50 % → tint · S10 "▲ seluruh pasar naik" pop ganda-easing → linear | selesai | 22900–23000, 24320–24990, 25800–26350 |
| Seluruh video — morf lain S09–S12 | dikerjakan sesudah persetujuan Simon ("Ya, lanjut S09–S12") — lihat bagian berikut | — |
| Audit tabrakan DOM S05–S08 (tiap 20 f) → diperbaiki: kamu S08 G jalur diagonal melintasi chip JUAL & sudut kartu → turun dulu lalu geser · panel padang S07/S08 pusat y 440 → 497 · isi S08 E bergeser −69 px → kartu x 1200, kamu x 410 · "±3.900" sempat menutup label 4.000 → ruang kanan dibuka lebih awal · kontras "▲ naik" hijau 2,3:1 → hijau + Midnight 30 % (±3,9:1), label harga abu 3,2:1 → #74747B (±4,7:1) | selesai | 16550–16990, 19000–19100, 19880–21270 |
| Audit — dilaporkan, tidak diubah: kontras teks berwarna di komponen BERSAMA (isi notifikasi hijau/oranye S07–S08, lencana "×2/×3" oranye S06) — mengubahnya ikut mengubah scene lain; "Tunggu & periksa" sengaja diredupkan sesudah BELI diklik | dilaporkan | 14758–15038, 16358–16558, 18578–18878 |
| Pindai loncatan | S05–S08 10.202 pasang · S08→S10 bagian berubah 2.170 · kotak teks S06 260 · perbaikan audit 2.140 · 0 lonjakan | 11438–21640, 21480–21800, 22500–23100, 24300–25000, 25800–26350, 14380–14640, 16500–17020, 18980–19130, 19850–21320 |

## S09–S12 — 28 Okt malam (Simon: "Ya, lanjut S09–S12")
Pratinjau: `preview-revisi-28okt/S09-S10_paralaks-morf-kamu-kanan-posisi.jpg`, `S10-S12_morf-otak-avatar-menyatu-gelembung.jpg`.

| Butir | Status | Frame |
|---|---|---|
| Kamu menghadap kanan (foto dicerminkan) di S09, S10, S12; teks "Kamu" dihapus | selesai | 23087–23339, 23339–26746, 28215–29900 |
| Gelembung di atas kepala, ekor tengah: S09 "Saya bisa!" (dulu kotak tanpa ekor), S10 "Saya benar beberapa kali." / "Saya memang hebat.", S12 "Kali ini saya pasti benar." | selesai | 22573–22981, 24012–24763, 29251–29400 |
| S09 padang → pantai: PARALAKS dengan pohon pembatas (dulu dorong); lencana ikut adegan | selesai | 22457–22517 |
| S09 pantai → gaya rumah: adegan pantai MENGECIL jadi lingkaran turkis = lingkaran foto kamu, foto pop di dalamnya; tumpukan posisi muncul sesudahnya | selesai | 23037–23137 |
| S09 → S10: delapan ikon posisi MENYATU ke chip "Posisi"; chip ikut bergeser lalu BER-MORF jadi kartu posisi, label "Posisi" memudar bersamaan 2 unit pertama pop (tanpa kartu kosong) | selesai | 23339–23528 |
| S10 spacing: isi dulu berpusat x 820 → kamu 300 → 440 (60 f), chart/kartu +140 → kelompok 220–1700 berpusat x 960 | selesai | 23399–26746 |
| S10 → S11: lingkaran kamu + "?" BER-MORF jadi ikon otak "?" (dulu kamu pop keluar, otak pop masuk) | selesai | 26799–26859 |
| S11 → S12: empat avatar MENYATU (bergerak & membesar) ke tempat kamu, lalu avatar → foto kamu (dulu avatar pop keluar, kamu pop masuk) | selesai | 28185–28275 |
| S12 spacing: isi dulu berpusat x 860 → kamu x 400, chart 850–1650, tombol, chip tanda, panel flat +100 → berpusat x 960 | selesai | 28215–29760 |
| S12 ikon TANGAN ("ketuk") yang menuju BELI/JUAL lalu berhenti → DIHAPUS (Simon: "Ya, ganti"): tombolnya sendiri turun setengah jalan (skala 0,96; klik penuh = 0,94) 60 f sampai kata berhenti, tanda jeda (lingkaran putih, ikon oranye) pop di pojok kanan-atas tombol, lalu tombol naik kembali tanpa riak — `S12_tombol-tertekan-berhenti-tanpa-tangan.jpg`. Pindai 660 pasang · 0 lonjakan | selesai | 28845–29461 |
| Panel padang S07/S08 (Simon, screenshot: "masih belum kamu perbaiki"): singa & bingkai putus-putus menempel tepi kiri panel (20 px vs 74 px di bawah), kepala singa keluar bingkai, "=" mengambang 147 px dari pusat bingkai → bingkai = siluet + 16 px tiap sisi (diukur dari render), berjarak 62 px dari tepi kiri & bawah; "=" tepat di atas pusat bingkai (celah 16 px); "×N" sebaris "=" berjarak 62 px dari tepi kanan; pelari mulai +78 bersama singa | selesai | 16568–16949, 20736–20985 |
| Audit S09–S12 → diperbaiki: "!" S09 tertutup foto S10 saat serah-terima (kini digambar S10 di atas foto) · dua gelembung S10 bertumpuk 21 f (aturan 17) · 10 f layar kosong S12 f30085–30095 (kamu & teks D keluar 10 f lebih lambat) · teks S12 "Saya sedang menganalisis" 6–12 px di luar area aman atas (top 46 → 60) · kontras: "✓ untung"/"▲ seluruh pasar naik" hijau, label bulan & catatan abu, "■ Pinjaman" & "atau hanya bereaksi?" oranye digelapkan | selesai | 23339–23399, 24139–24300, 29850–30100, 23410–26770, 29170–30030 |
| Audit S09–S12 — dilaporkan: angka "01/03" di komponen Nomor (bersama) kontras 1,9–2,3:1; "ARB" putih di merah (aturan teks putih); stempel FORCED SELL menimpa ikon posisi (disengaja) | dilaporkan | 25210–26330, 28850–31250 |
| Pindai S09–S12 | 4.010 + 140 + 1.490 pasang · 0 lonjakan | 22440–23560, 23900–24340, 25850–26350, 26650–26960, 28120–29760, 16550–16990, 20640–21060, 29850–30200 |

## Brief 29 Okt — Scene 09–12 + transisi ke outro
Pratinjau: `preview-revisi-28okt/S09_kotak-3kartu-pantai-meter-dorongan.jpg`, `S10_candle-KAEF-IHSG-panel-besar-margin-call-pop.jpg`,
`S11_penggaris-tahun-uang-asli-nominal.jpg`, `S12_aplikasi-awan-pikir-morf-hutan-outro.jpg`. Cadangan versi lama di scratchpad sesi (Scene09/10/12_lama.tsx).

| Butir | Status | Frame |
|---|---|---|
| S08 → S09 "shape 2 persegi": bilah turkis · turkis muda naik, padang naik menutupnya; adegan S08 naik ease-in (dulu kartu ber-morf jadi lingkaran) | selesai | 21610–21700 |
| S09 ilustrasi berburu · berpindah · berlayar = 3 kartu pola Scene 02 (jendela ke padang yang sama): padang layar penuh MENGECIL jadi kartu 1 (berlari bertombak), kartu 2 (tiga orang berjalan) & 3 (perahu) pop di katanya, kartu lama memberi ruang; kartu 3 MELEBAR jadi pantai | selesai | 22644–22890 |
| S09 "Saya bisa!" = gelembung di atas kepala tokoh padang | selesai | 22543–22669 |
| S09 foto kamu TIDAK pop: lingkaran turkis (= pantai yang mengecil) tetap, foto NAIK di dalam masker lingkaran yang sama (masker = lingkaran latar, timing sama) | selesai | 22966–23026 |
| S09 ide baru "Masalahnya bukan pada dorongan… terlalu jauh di pasar": METER "DORONGAN" setengah lingkaran hijau "Wajar" → oranye → merah "Berlebihan"; jarum di hijau + ✓ ("bukan pada dorongan itu sendiri"), naik ke oranye ("dorongan tersebut berjalan"), masuk merah + "!" + kartu menyala ("terlalu jauh") | selesai — label "Wajar"/"Berlebihan" & judul "Dorongan" = tambahan agar meter terbaca (bukan kata VO) | 22951–23339 |
| S10 IHSG garis → CANDLE; panel IHSG lebih tinggi (180 → 265) & lebar (760 → 1160); panel KAEF 760 → 1160 × 400 | selesai | 23402–26806 |
| S10 candle KAEF = data riil SEPERTI SCREENSHOT TradingView Simon ("belum sama seperti yang aku kirimkan" → diperbaiki): seluruh riwayat sejak 3 Agu 2020 tampak (sideways Agu–Nov, lonjakan Des, puncak Jan, ARB), candle baru tumbuh & chart melebar ke kanan (80 → 109 slot); IHSG ikut | selesai — data diperpanjang ke 3 Agu 2020 (`gen-lilin-riil.py`) | 23402–25318 |
| S10 layout & ruang kosong: kiri kamu + kartu posisi yang IKUT MEMBESAR sesuai jumlah unit; kanan dua panel bertumpuk; panel bawah berganti isi IHSG → ilustrasi Sebelum/Sesudah (diperbesar) → tempat margin call; "▼ hampir 20%" di baris judul | selesai | 23339–26746 |
| S10 MARGIN CALL pop masuk DAN pop keluar (Simon: "gunakan animasi pop ini dan pop out untuk tag ini"); kelompok margin call diperbesar 1,25× | selesai | 25837–26706 |
| S10 penanda BELI tidak lagi muncul di luar chart sebelum candle-nya terbentuk | selesai | 23555–23720 |
| S11 "ratusan ribu tahun" = PENGGARIS TAHUN Scene 01 (2026 → 300.000 SM; komponen bersama `parts/penggaris.tsx`, S01 tidak diubah); otak naik memberi ruang | selesai | 27049–27306 |
| S11 teks peran di bawah ikon sosok dihapus | selesai | 27292–28151 |
| S11 uang = foto uang asli (V03) + nominal ("Rp1 juta" sedikit · "Rp1 triliun" sangat besar) | selesai — nilai nominal pilihan saya | 27790–28100 |
| S11 ikon investor = FOTO ORANG ASLI video sebelumnya, empat orang berbeda: ritel = kemeja biru muda · profesional = jas navy · orang biasa = kemeja biru tua (aset root Video 02, "ini double orangnya" → diganti) · fund manager = jas abu; lingkaran pop, foto naik di masker | selesai | 27292–28151 |
| S12 avatar S11 menyatu (sudah benar) → lingkaran turkis → foto kamu NAIK di dalam masker lingkaran yang sama (tanpa pop) | selesai | 28185–28315 |
| S12 ide visual baru (orang awam): kartu APLIKASI SAHAM (chart + tombol BELI/JUAL) + awan perasaan di atas kepala (ikon + kata: Ingin mengejar · Takut menjual · "Kali ini saya pasti benar."), tombol mulai tertekan lalu berhenti, daftar tiga tanda di bawah kartu | selesai | 28255–29400 |
| S12 kartu aplikasi (candle) BER-MORF jadi panel padang (satu bentuk); teks "Berhenti. Tarik napas. Beri diri waktu." DIHAPUS → tanda jeda di panel, cincin napas, lencana jam | selesai | 29390–29792 |
| S12 pertanyaan = AWAN PIKIRAN kamu (pola S05), tiga hal yang diperiksa ✓ di bawahnya | selesai | 29848–30095 |
| Ke outro: tiga kartu SWIPE NAIK mulai TEPAT bersama halaman outro naik dari bawah (Simon: "gerakan swipenya harus secara bersamaan, jadi tidak ada blankframe"), durasi 36 · 48 · 60 f (titik akhir berbeda) | selesai — 0 frame kosong | 31254–31314 |
| Masker foto = lingkaran latar di KIRI, KANAN & BAWAH (hanya kepala keluar di atas) untuk kamu S09–S12 & empat sosok S11 ("besar kanan, kiri, dan bawah harus sama") | selesai | 22966–31254 |
| Gelembung "Saya bisa!" kini di atas kartu (dulu tertutup kartu 1 saat mulai mengecil → loncatan f22645) | selesai | 22609–22669 |
| Audit S09–S12 → diperbaiki: lingkaran sosok/kamu muncul tiba-tiba ukuran penuh (lingkaran latar ikut disembunyikan selama foto belum naik — bug komponen) · MARGIN CALL menimpa ilustrasi yang sedang keluar (kini pop sesudahnya) · tanda jeda menutup tepi huruf BELI/JUAL · label bulan KAEF menjulur keluar panel | selesai | 27292–28151, 25877–25937, 28900–29420, 23540–23780 |
| Audit — dilaporkan, tidak diubah: angka "01/03" komponen Nomor (bersama) kontras 1,9–2,3:1; "ARB" putih di merah (aturan teks putih di warna brand); stempel FORCED SELL menimpa ikon posisi (disengaja); awan pikiran B S12 membuat kelompok bergeser ±54 px ke kiri selama awan tampil | dilaporkan | — |
| Pindai loncatan S09–S12 | 9.790 pasang (2 lonjakan → diperbaiki) + bagian berubah 2.080 + 1.020 + 140 pasang · 0 lonjakan | 21540–31340 |

## Brief 30 Okt — transisi S11→S12 + audit seluruh video (cek & konfirmasi saja)
Pratinjau: `preview-revisi-28okt/S11-S12_menyatu-foto-swipe-bawah.jpg`.

| Butir | Status | Frame |
|---|---|---|
| S11→S12: saat empat lingkaran menyatu, foto orang SWIPE KE BAWAH di dalam masker lingkarannya (60 f inOut cubic, tanpa pudar), selesai tepat saat foto kamu mulai naik | selesai — pindai 190 pasang · 0 lonjakan | 28195–28255 |
| Audit easing/keyframe (kode): tanpa easing ganda; hanya inOut cubic · linear→easeOutBack (pop) · ease-in cubic (adegan lama terdorong) | dilaporkan | — |
| Bukan 60 f (non-karakter): klik tombol 8 + 12 f (S01/S04/S05/S07/S08/S10), kamera ikut S03 70 f, semak goyang S02, rumput gesek & denyut alarm S06 (34 f / 30 f), crossfade subtitle 10 f, candle tumbuh 8–30 f (resep TA), angka/baterai/senja/perahu/jam mengikuti VO, kartu ke outro 36·48·60 f (brief) | dilaporkan, tidak diubah | — |
| Timing: qa-cues BERSIH (141 cue, 1.179 kata), 782 kata pemicu S01–S12 semua ada di VO & di scene-nya, 0 cue berisi 2 kalimat | sesuai | — |
| Timing vs isi: S07 chart diam & candle terakhir merah saat VO "Harga naik" | belum sesuai | 15535–15905 |
| Aturan 11 (investor ≠ orang berjas): S11 "Fund manager" = foto guru (jas abu + nametag), "Profesional" = jas navy | belum sesuai | 27292–28255 |
| Pusat visual (ukur piksel tiap 30 f, pusat 960/497): S03 anatomi +55 y · S05 E −41 x · S06 D kelompok singa+tokoh ±470 x · S07 B −68 x, C +48/+51, E +62/−68 · S08 kartu sendiri −44…−62 y, G +62 y · S09 A +125 x · S10 +53 y (A +45 x) · S11 sosok+uang +82 y · S12 B −70/−82 + awan B y 36 (18 px di atas area aman 54) · S12 D/E −27…−33 y | dilaporkan, tidak diubah | lihat tabel laporan |

## "Perbaiki semua" (30 Okt) — perbaikan temuan audit
Pratinjau: `preview-revisi-28okt/Audit30okt_pusat-sesudah_1.jpg`, `_2.jpg`, `Audit30okt_keyframe-60f.jpg`.

| Butir | Status | Frame |
|---|---|---|
| S07 "Harga naik": candle hijau riil (1 Des, 1.145 → 1.155) tumbuh SENDIRI di kata itu, chip "▲ naik" pop di sana; klik BELI investor ketiga di "makin naik" dilepas (data riil hanya 10 hijau) | selesai | 15692–15760 |
| Pusat: S03 papan anatomi naik 55 · S05 papan +40 saat gelembung penjual keluar · S06 kamera: tokoh di tengah, lalu singa + tokoh dipusatkan saat rumput bergesek · S07 geser kelompok per keadaan (A, B, D, E) + S08 mulai dari posisi E · S08 geser kelompok per keadaan + kartu G memendek 450 → 326 · S09 tokoh + keranjang −110, matahari ke (960, 214) · S10 panel KAEF 400 → 362 & IHSG 265 → 239, naik 30, geser x mengikuti lebar kartu posisi, turun 46 saat gelembung · S11 geser y per keadaan, teks layar pindah ke bawah lingkaran, properti keluar di "tombol keputusan" · S12 +30 seluruh scene, awan B +70/+51 (puncak 115, dalam area aman) | selesai | lihat pratinjau |
| Sisa pusat > 25 px (tidak diubah, dilaporkan): S01 +26 y (S01 disetujui) · S03 papan anatomi sebelum kartu kedua (x ±629, ±3 dtk) · S05 akhir (−28, +39, ±1 dtk) · S07 kutipan +45 y (naik lebih = kartu masuk zona logo) | dilaporkan | 1710–2550, 6420–6600, 12930–12990, 17340–17520 |
| Keyframe 60 f: klik tombol (S01/S03/S04/S05/S07/S08/S10) 60 f turun dari sentuhan + 60 f naik (jari keluar bersama tombol naik) · garis harga ponsel S01 60 f · semak S02 · kamera S03 70 → 60 · baterai & senja S03 · rumput & alarm S06 · titik loop S07 (pop masuk/keluar) · perahu S09 · jam S10 tiga langkah | selesai | — |
| Tidak diubah: crossfade subtitle 10 f (komponen bersama semua video), candle tumbuh (resep video TA), kartu outro 36·48·60 f (brief) | dilaporkan | — |
| S11 investor berjas (aturan 11): aset orang asli tanpa jas hanya 2 wajah (kemeja biru muda = kamu, kemeja biru) | DIPERTAHANKAN — Simon 30 Okt: "fotonya sudah benar" (4 orang asli, termasuk jas navy & jas abu) | 27292–28255 |
| Pindai loncatan SELURUH video sesudah perbaikan (tiap frame, 0–31.776) | 31.776 pasang · 2 lonjakan (S09 f22649 & f22886: bingkai kartu `border` CSS pecahan < 1 px dibulatkan Chrome jadi 1 px → garis tepi + isi bergeser 1 px saat layar penuh ↔ kartu; ada sejak dulu, dulu tertutup gerak perahu) → bingkai jadi bayangan inset → pindai ulang 320 pasang · 0 lonjakan | 0–31776 |
