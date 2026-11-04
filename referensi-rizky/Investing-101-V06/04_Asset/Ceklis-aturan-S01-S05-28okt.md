# Ceklis aturan Simon — Scene 01–05 (audit 28 Okt sore)

Simon: "cek kembali scene 1 sampai 5: spacing visual · easing animasi · keyframe animasi · dan hal hal yang sebelumnya aku buat sebagai aturan,
pastikan semua sudah kamu kerjakan dengan benar, jangan membuat laporan palsu."

Status: **SUDAH** = dicek & sesuai · **DIPERBAIKI** = ditemukan menyimpang, sudah diubah hari ini · **DILAPORKAN** = menyimpang tapi tidak diubah
(perlu keputusan Simon) · **BELUM DICEK** = tidak diperiksa di audit ini.
Alat: pindai loncatan piksel tiap frame (`scripts/pindai.mjs` + `jeglek-alir.py`), audit tabrakan DOM tiap 20 f (`audit-tabrakan.mjs/.py`),
pindai diam tiap 30 f (`diam.py`), ukur pusat tinta dari render, still bergaris bantu, grep kode.

## A. Aturan wajib animasi (22–23 Okt)
| # | Aturan | Status | Bukti / frame |
|---|---|---|---|
| 1 | Swipe = inOut cubic 60 f | DIPERBAIKI | swipe keluar papan E S01 & keluar penggaris dulu di-ease DUA kali (io(cin)) → sekali (f2496–2620, 2775–2835); bilah kotak naik S04 40 → 60 f (f9400–9490, 11418–11508) |
| 2 / 21 | Semua animasi 60 f (termasuk pudar, tint, benda berjalan) | DIPERBAIKI | penggaris gulir 80 → 60 f & tinta 40 → 60 f (S01 f2705–2765) · kamera S02 70 → 60 f · garis harga jatuh 40 → 60 f · hitungan lembar 30 → 60 f · kamera kota S03 100 → 60 f · jari S03 40 → 60 f, jari S04 50 → 60 f · riak tombol 36 → 60 f · pudar isi saat panel menyatu S02 & S04 30 → 60 f · "02" 30 → 60 f · buah mengecil 10 → 60 f |
| 2 | — pengecualian yang SENGAJA tetap | DILAPORKAN | akting tokoh (laju jalan/lari, jongkok, gestur, meraih, angguk); tekan tombol 8 f turun + 12 f naik (klik yang sama di S01/S04/S05, riaknya 60 f); candle tumbuh 20 f per candle (resep video TA) |
| 3 | Pop = easeOutBack, waktu linear | DIPERBAIKI | easing dobel skalaPop(cin) → linear: tick penggaris S01, cincin ujung chart S02, mata panah busur S02, chip "puncak siklus" S04 |
| 5–6 | Bentuk sama dibawa / digabung | SUDAH | lingkaran → panel (S02), 4 panel → 1 (S02), 3 kartu → otak (S03), 3 panel → lencana 02 (S04), orang setengah badan → lingkaran pembeli (S05, baru) |
| 7 | Swipe sampai keluar frame | SUDAH | papan E S01 turun 1100 px; orang S05 masuk dari bawah 1100 px |
| 8 / 14 | Ikon, tag, panel, kartu MUNCUL = pop | SUDAH | — ikon ketuk S05 DIHAPUS (Simon: "klik saja buttonnya secara harfiah") |
| 15 | Teks naik + opacity + motion blur | DIPERBAIKI | teks panel S04 yang muncul dalam SATU frame: "Balik modal", "Laba Rp30", "30 ÷ 100", "Rp100/Rp300", "sendiri/utang", "Modal usaha"; label "Popularitas/Laba" yang hanya memudar |
| 16 | Tengah dulu, lalu memberi ruang | DIPERBAIKI | S05 papan D: chip "Alasan beli" membuat isi berpusat x 830 & keluar area aman 3 px → papan bergeser +130 bersamaan pop chip (pusat 960, f12990); pembeli/penjual dulu memberi ruang ±50 f sebelum "Catatan penjual" muncul (pusat x 720, f12700) → kini bersamaan |
| 17 | Yang lama selesai keluar dulu baru yang baru masuk | DIPERBAIKI | 5 pertukaran di tempat yang sama tumpang 10–30 f: S01 ▼→▲ di hp (f1143–1223), S04 ✓→? di kartu hp (✓ keluar 30 f lebih awal, "?" tetap di "konteks" f9342+), S05 JUAL→"Mungkin salah", BELI→"Mungkin benar", ▲→"?" |
| 12 | Ganti warna = tint | SUDAH | Hari ini → Dulu (S01), BELI → ✓ Dibeli (S04) |
| 13 | Jangkar pop di tengah benda | SUDAH | komponen pop memakai transformOrigin center |
| 23 | Gerbang tampil tanpa ambang ter-ease | DIPERBAIKI | penggaris S01 digerbang `masuk ≤ 0,001` → tick ber-pop linear muncul di skala ±27 % → kini batas frame. Sisa ambang 0,001 lain di S01–S05 hanya pada glow/opacity (tak terlihat) |
| 9–10 | Garis putus-putus 3–5 px, trim path | DIPERBAIKI | `Penghubung` menjepit 3–5 px + trim (bawaan). Menyimpang: separuh kanan cincin analisis S05 & jalurnya MEMUDAR → kini trim (f12905–12965); garis harga terakhir chart S02 2 px → 3 px |
| 11 | "Investor" ≠ orang berjas | SUDAH | S05 investor = kemeja biru; jas hanya guru (S01) |

## B. Aturan lain
| Aturan | Status | Bukti / frame |
|---|---|---|
| Klik tombol harfiah (tertekan + riak + akibat) | DIPERBAIKI | S01 JUAL dulu denyut sinus 30 f tanpa riak → resep klik S04 (f1026); S05 tanpa ikon tangan, tombol tertekan + riak warna tombol |
| Spacing / tumpang tindih | DIPERBAIKI | pil "▲ 8% · 12% · 15%" S02 saling menempel 4–8 px (f4150–4225) → celah 14 px · chip "PE N×" layar terbelah S04 ±4 px dari logo (f10560–10860) → 17 px · judul S05 C masuk zona logo & menabrak logo saat naik keluar (f12620) → huruf 54 → 44, tinta x 457–1458 · chip di bawah lingkaran S05 menggantung 73 px sesudah label dihapus → 43 px |
| Spacing — ▲/"?" pembeli S05 | DIPERBAIKI | menumpuk 10 px di ujung gelembung "Harga ini menarik." (f12280–12740, 12860–13040; ditemukan di putaran audit ke-2) → celah 17 px = sisi penjual; audit ulang 0 tumpang |
| Spacing / tumpang tindih — sisa | DILAPORKAN | S03 f7800–7860: ponsel rating (overlay) menutupi papan nama toko, tepi lingkarannya mengintip di atas ponsel · S02 f4130–4180: papan "JUAL" di vignet kota menutupi kaki tokoh yang berlari di belakangnya (susunan kedalaman adegan) |
| Alignment tengah | DIPERBAIKI (pagi) | siklus S02, kartu anatomi S03, kartu contoh & otak S03, senja S03, padang S04 — lihat Revisi-S01-S04 |
| Kontras teks | DIPERBAIKI (Simon: "Yes, darken it") | oranye teks = oranye brand + Midnight 22 % (#B77F28): "utang", "Popularitas", chip "Sebagian besar modal dari utang" & "puncak siklus" 2,1–2,3:1 → ±3,15–3,45:1 (ambang 3:1 teks tebal ≥ 19 px; label "utang"/"sendiri"/"puncak siklus" 18 → 19 px); abu "angka pertama" #74747B 3,25 → ±4,7:1. Audit ulang: keempat teks tak lagi tercatat. Sisa catatan = teks PUTIH di oranye brand (koin "Rp", batang "Rp300") — tetap putih sesuai aturan Simon. Pindai f9600–10140, 11100–11420: 860 pasang · 0 lonjakan |
| Subtitle 1 cue ≤ 1 kalimat | SUDAH | 0 cue dua kalimat di S01–S05 |
| Visual tiap detik / tanpa blank | SUDAH | 6 jendela diam ≥ 36 f (f1890–1950, 2010–2070, 2430–2490, 3030–3090, 6450–6570, 6690–6780): papan lengkap yang sesuai kalimat VO, tidak ada frame kosong |
| Tanpa slot kosong / chart terisi | SUDAH | chart S02 & S04 penuh riwayat sejak muncul |
| Warna brand | SUDAH | BELI hijau / JUAL merah = permintaan Simon |
| Pindai loncatan | SUDAH | putaran akhir (kode terakhir): S01 3.195 · S02 2.965 · S03 2.070 · S04 3.350 · S05 1.650 pasang frame = 13.230 · 0 lonjakan; S05 C–D sesudah perbaikan panah 1.075 · 0 |
| Audit tabrakan DOM (tiap 20 f) | SUDAH | KENA-LOGO 4 → 2 (sisa = latar toko/gedung S03 di bawah logo). TEKS-TEKS/LEWAT-TEPI/LUAR-AMAN pada teks ponsel yang sedang berputar (f920, 1340, 7780–7880, 8280, 11120) = positif palsu (kotak teks diputar 45°). PERMUKAAN-TUMPANG di adegan flat = bagian tubuh/ilustrasi yang memang bertumpuk; lencana di sudut avatar = disengaja |
| Ukur fps Studio | BELUM DICEK | |
