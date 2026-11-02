#!/usr/bin/env python3
"""
LEMBAR PRATINJAU per scene, frame diambil RELATIF KE KATA VO (scripts/beats.py) — tetap benar saat VO direkam ulang.
  python3 scripts/lembar.py S03 frames   → cetak frame lokal (untuk: COMP=Ide-S03 node scripts/stills.mjs …)
  python3 scripts/lembar.py S03 buat     → 04_Asset/pratinjau-visual/S03_ide-visual.png
"""
import sys
from beats import urut, BATAS
from PIL import Image, ImageDraw, ImageFont

def tc(f): return f"{f // 3600:02d}:{f // 60 % 60:02d}.{f % 60:02d}"

def s01():
    a = 0; b = urut(['berbagai', 'berdampingan', 'hasilnya', 'jangka', 'jelas', 'pertumbuhan', 'stabil', 'penghasilan', 'bukan', 'return',
        'mana', 'modal', 'satu', 'investasi'], a)
    OFS = 31
    return "Scene 01 · Pembuka (adegan radial baru)", a, BATAS["s1Akhir"], [
        (12, "pusat 'instrumen investasi' muncul (animasi mulai 00:00.00, VO mulai 00:00.31)", "(sebelum VO)"),
        (b['berbagai'] + 20, "cincin + jari-jari: instrumen muncul searah jarum jam", "\"Kalau kita taruh berbagai instrumen investasi…\""),
        (b['berdampingan'] + 30, "sembilan instrumen berdampingan, diam utuh", "\"…berdampingan\""),
        (b['hasilnya'] + 5, "bar nama menutup bersamaan, pusat memudar", "\"…dan melihat hasilnya…\""),
        (b['hasilnya'] + 45, "ikon terbang jadi kolom ikon chart", "\"…hasilnya dalam jangka panjang,\""),
        (b['jelas'] + 60, "chart kinerja + jarak", "\"kelihatan jelas bahwa perbedaannya bisa cukup jauh.\""),
        (b['pertumbuhan'] + 40, "pertumbuhan lebih besar", "\"Ada yang punya ruang pertumbuhan lebih besar,\""),
        (b['stabil'] + 40, "lebih stabil", "\"ada yang hasilnya cenderung lebih stabil,\""),
        (b['penghasilan'] + 40, "naik terbatas + sewa", "\"…tapi bisa memberikan sumber penghasilan lain.\""),
        (OFS + 1642 + 100, "masker lingkaran: chart jadi kartu Return", "\"…bukan cuma: Mana yang return-nya paling tinggi?\""),
        (OFS + 2201 + 70, "lima kartu lensa", "\"Dan berapa modal yang dibutuhkan untuk mulai?\""),
        (BATAS["s1Akhir"] - 1, "peta enam bab (netral, akhir)", "\"…apa yang sebenarnya membedakan tiap instrumen investasi.\"")]

def s02():
    a = BATAS["s2"]; b = urut(['kita', 'familiar', 'tabungan', 'deposito', 'cara', 'yaitu', 'bunga', 'tabungan', 'fleksibel', 'digunakan', 'kapan',
        'deposito', 'menyimpan', 'periode', 'imbalan', 'bunga', 'tinggi', 'karakter', 'mengejar', 'tinggi', 'tapi', 'sederhana', 'stabil', 'dipahami'], a)
    return "Scene 02 · Tabungan & Deposito", a, BATAS["s3"], [
        (a + 30, "bab 01 diambil alih (cincin, bab lain turun)", "\"Kita mulai dari yang paling familiar:\""),
        (b['tabungan'] + 40, "lingkaran ke tengah, lalu kartu Tabungan", "\"tabungan…\""),
        (b['deposito'] + 40, "membelah: kartu Deposito", "\"…dan deposito.\""),
        (b['bunga'] + 50, "judul TEXT + koin bunga + baris Bunga", "\"…yaitu dari bunga.\""),
        (b['kapan'] + 30, "Tabungan: uang keluar · Likuiditas tinggi", "\"…mudah digunakan kapan saja.\""),
        (b['periode'] + 30, "Deposito: gembok · Tenor tetap", "\"…menyimpan dana selama periode tertentu,\""),
        (b['tinggi'] + 30, "koin lebih banyak · Bunga relatif lebih tinggi", "\"…tingkat bunga yang relatif lebih tinggi.\""),
        (b['tinggi2'] + 30, "Mengejar return tertinggi — dicoret", "\"…bukan untuk mengejar return paling tinggi,\""),
        (BATAS["s3"] - 1, "tiga sifat (akhir, tanpa keluar)", "\"…sederhana, relatif stabil, dan mudah dipahami.\"")]

def s03():
    a = BATAS["s3"]; b = urut(['karakternya', 'emas', 'hari', 'ini', 'gram', 'sepuluh', 'lagi', 'fisik', 'tetap', 'gram', 'emas', 'bunga', 'rutin', 'bisnis',
        'menghasilkan', 'laba', 'sumber', 'utamanya', 'datang', 'hal', 'perubahan', 'beli', 'rendah', 'menjualnya', 'tinggi', 'untung', 'sebaliknya', 'kalau', 'turun', 'rugi'], a)
    return "Scene 03 · Emas", a, BATAS["s4"], [
        (a + 40, "Scene 02 keluar (mengecil + pudar)", "\"Sekarang kita masuk…\""),
        (b['karakternya'] + 33, "slot bab 02 \"?\"", "\"…aset yang karakternya sangat berbeda:\""),
        (b['emas'] + 28, "slot terisi: bab 02 Emas", "\"emas.\""),
        (b['gram'] + 30, "emas ke garis waktu · Hari ini · 1 gram", "\"Kalau hari ini kita membeli satu gram emas,\""),
        (b['lagi'] + 5, "emas menempuh 10 tahun, jejaknya tertinggal", "\"sepuluh tahun lagi,\""),
        (b['gram2'] + 10, "1 gram = 1 gram", "\"secara fisik emas itu tetap satu gram.\""),
        (b['rutin'] + 56, "Bunga rutin dicoret", "\"Emas tidak membayar bunga secara rutin,\""),
        (b['laba'] + 39, "Laba bisnis dicoret · judul (TEXT naskah)", "\"…bisnis yang menghasilkan laba.\""),
        (b['perubahan'] + 73, "emas jadi lencana · chart harga × waktu", "\"Jadi sumber return … perubahan harga.\""),
        (b['menjualnya'] + 31, "Beli di lembah, Jual di puncak (hijau)", "\"Kalau kita beli di harga lebih rendah lalu menjualnya…\""),
        (b['untung'] + 36, "selisih naik = Untung", "\"…di harga lebih tinggi, kita untung.\""),
        (BATAS["s4"] - 1, "Beli di puncak, harga turun = Rugi (merah, akhir)", "\"Sebaliknya, kalau harganya turun, kita juga bisa rugi.\"")]

def s04():
    a = BATAS["s4"]; b = urut(['beberapa', 'terakhir', 'naik', 'kuat', 'alasannya', 'ketidakpastian', 'meningkat', 'investor', 'berhati-hati', 'permintaan',
        'emas', 'naik', 'hal', 'permintaan', 'investor', 'bank', 'sentral', 'meningkat', 'sebaliknya', 'sentimen', 'berubah', 'harga', 'turun', 'lagi', 'jadi',
        'logikanya', 'sama', 'menghasilkan', 'laba', 'berasal', 'perubahan'], a)
    return "Scene 04 · Kenapa harga emas naik", a, BATAS["s5"], [
        (a, "Scene 03 keluar: anotasi, garis ilustrasi & judul memudar", "\"Lalu kenapa harga emas…\""),
        (b['terakhir'] + 35, "chart ambil DATA ASLI (mingguan sejak 2016, log)", "\"…dalam beberapa tahun terakhir…\""),
        (b['kuat'] + 57, "judul TEXT + \"Naik ≈5,3× sejak 2016\"", "\"…bisa naik cukup kuat?\""),
        (b['ketidakpastian'] + 29, "chart menyusut jadi kartu · tiga pendorong muncul", "\"…saat ketidakpastian di pasar meningkat,\""),
        (b['berhati-hati'] + 59, "investor lebih berhati-hati", "\"investor biasanya menjadi lebih berhati-hati\""),
        (b['naik2'] + 12, "permintaan emas naik, harga emas naik", "\"dan permintaan terhadap emas ikut naik.\""),
        (b['sentral'] + 20, "investor + bank sentral mendorong permintaan", "\"…permintaan dari investor maupun bank sentral meningkat.\""),
        (b['sebaliknya'] + 58, "arah sebaliknya: semua lencana berbalik", "\"Tapi arah sebaliknya juga tetap mungkin terjadi.\""),
        (b['lagi'] + 16, "kartu membesar lagi · penurunan asli disorot", "\"Kalau sentimen berubah, harga emas bisa turun lagi.\""),
        (b['sama'] + 56, "judul TEXT baris 2", "\"Jadi logikanya tetap sama:\""),
        (b['laba'] + 15, "Laba bisnis dicoret (gema Scene 03)", "\"emas tidak terus-menerus menghasilkan laba,\""),
        (BATAS["s5"] - 1, "penanda naik/turun di ayunan harga asli (akhir)", "\"…return-nya terutama berasal dari perubahan harga.\"")]

def s05():
    a = BATAS["s5"]; b = urut(['properti', 'punya', 'pertama', 'kedua', 'sendiri', 'artinya', 'cash', 'sekaligus', 'naik', 'tapi', 'modal', 'dan',
        'rumah', 'menekan', 'tombol', 'selain', 'ada', 'administrasi', 'dan', 'kalau', 'kadang', 'rendah'], a)
    return "Scene 05 · Properti (revisi 7 Okt: peta bab + adegan tambahan)", a, BATAS["s6"], [
        (a + 30, "masker: chart Scene 04 menyusut ke simpul bab 02 di peta bab", "\"Selanjutnya, kita lihat properti.\""),
        (b['properti'] + 25, "slot bab 03 terisi Properti", "\"…properti.\""),
        (b['punya'] + 60, "simpul ke tengah; dua slot sumber return (kamera: diagram tetap di tengah)", "\"Properti punya dua sumber return…\""),
        (b['kedua'] + 70, "Pendapatan sewa · Potensi kenaikan nilai", "\"Kedua, potensi kenaikan nilai…\""),
        (b['cash'] + 10, "ADEGAN: sewa tiap bulan mengalir jadi pendapatan (12 sel bulan)", "\"…properti bisa menghasilkan cash flow,\""),
        (b['naik'] + 40, "ADEGAN: rumah menaiki garis nilai yang naik", "\"…berpotensi naik nilainya seiring waktu.\""),
        (b['tapi'] + 60, "kembali ke diagram: Trade-off", "\"Tapi ada trade-off…\""),
        (b['modal'] + 70, "ADEGAN: tumpukan modal properti menjulang", "\"Modal awalnya biasanya lebih besar,\""),
        (b['dan'] + 80, "ADEGAN: instrumen lain cepat cair, properti tertahan jam pasir", "\"…likuiditasnya juga lebih rendah.\""),
        (b['tombol'] + 10, "ADEGAN: tombol Sell ditekan, hanya berputar", "\"…semudah menekan tombol sell.\""),
        (b['administrasi'] + 70, "ADEGAN: hasil jual mengalir ke agen · administrasi · lainnya", "\"…biaya agen, administrasi, dan biaya transaksi lainnya.\""),
        (BATAS["s6"] - 1, "ADEGAN: dijual cepat → batang harga turun merah (akhir)", "\"…perlu menerima harga yang lebih rendah.\"")]

def s06():
    a = BATAS["s6"]; b = urut(['obligasi', 'uang', 'perusahaan', 'imbalannya', 'kupon', 'tempo', 'pokok', 'dikembalikan', 'jadi', 'bunga',
        'dijual', 'sebelum', 'naik', 'turun'], a)
    return "Scene 06 · Obligasi (revisi 7 Okt: peta bab + percabangan + adegan tanpa teks)", a, BATAS["s7"], [
        (a + 28, "masker: isi Scene 05 menyusut ke simpul bab 03 di peta bab", "\"Berikutnya, obligasi.\""),
        (b['obligasi'] + 50, "slot bab 04 terisi Obligasi", "\"…obligasi.\""),
        (b['obligasi'] + 140, "simpul bab 04 di tengah", "\"Cara paling gampang memahaminya adalah:\""),
        (b['uang'] + 5, "bercabang seperti Properti: Investor, Obligasi, lalu Pemerintah / Perusahaan", "\"kita meminjamkan uang…\""),
        (b['perusahaan'] + 30, "uang tiba di Pemerintah & Perusahaan", "\"…kepada pemerintah atau perusahaan.\""),
        (b['imbalannya'] + 25, "kupon mengalir balik ke investor", "\"Sebagai imbalannya,\""),
        (b['kupon'] + 40, "ADEGAN: kalender melompat per periode, tiap periode kupon jatuh ke investor", "\"…menerima … kupon secara berkala.\""),
        (b['tempo'] + 5, "ADEGAN: kalender tiba di jatuh tempo", "\"Saat obligasi jatuh tempo,\""),
        (b['pokok'] + 40, "ADEGAN: pokok keluar dari ujung garis waktu", "\"pokok investasinya…\""),
        (b['dikembalikan'] + 50, "ADEGAN: pokok kembali ke investor", "\"…dikembalikan sesuai ketentuan produk.\""),
        (b['bunga'] + 45, "rekap di diagram: kupon mengalir dari penerbit ke investor · judul TEXT", "\"Jadi sumber return utamanya … pendapatan bunga.\""),
        (b['dijual'] + 60, "ADEGAN: kalender berhenti di tengah masa obligasi · Jual", "\"Tapi kalau obligasi dijual…\""),
        (b['sebelum'] + 60, "ADEGAN: sisa periode hangus (sebelum jatuh tempo)", "\"…sebelum jatuh tempo,\""),
        (b['naik'] + 10, "ADEGAN: harga naik (hijau) di atas harga beli", "\"harganya tetap bisa naik…\""),
        (b['turun'] + 15, "ADEGAN: harga turun (merah)", "\"…atau turun,\""),
        (BATAS["s7"] - 1, "ADEGAN: suku bunga & kondisi pasar mendorong harga (akhir)", "\"tergantung suku bunga dan kondisi pasar.\"")]

def s07():
    a = BATAS["s7"]; b = urut(['reksa', 'melihat', 'label', 'tapi', 'sebenarnya', 'keranjang', 'kalau', 'obligasi', 'obligasi', 'saham', 'saham',
        'dipengaruhi', 'jadi', 'risikonya', 'bergantung'], a)
    return "Scene 07 · Reksa Dana (revisi 7 Okt: peta bab + keranjang + baris hasil sejajar)", a, BATAS["s8"], [
        (a + 28, "masker: isi Scene 06 menyusut ke simpul bab 04 di peta bab", "\"Sekarang kita masuk ke reksa dana.\""),
        (b['reksa'] + 25, "slot bab 05 terisi Reksa Dana", "\"…reksa dana.\""),
        (b['melihat'] + 80, "simpul di tengah; kaca pembesar mengitari", "\"Hal paling penting saat melihat reksa dana\""),
        (b['label'] + 60, "nama bab jadi LABEL bercincin", "\"…bukan sekadar melihat label reksa dana-nya,\""),
        (b['tapi'] + 90, "simpul jadi KERANJANG; label tergantung di bibirnya", "\"tapi melihat:\""),
        (b['sebenarnya'] + 90, "kaca pembesar menyapu isi yang belum diketahui", "\"sebenarnya dana itu diinvestasikan ke apa.\""),
        (b['keranjang'] + 30, "empat instrumen menumpuk di keranjang", "\"…reksa dana adalah sebuah keranjang investasi.\""),
        (b['kalau'] + 100, "Obligasi membesar (dominan), isi lain meredup", "\"Kalau sebagian besar isinya obligasi,\""),
        (b['obligasi'] + 30, "ikon Obligasi KELUAR; keranjang bergeser memberi ruang", "\"…isinya obligasi,\""),
        (b['obligasi2'] + 75, "baris Obligasi · Mirip obligasi · grafik mini tenang", "\"karakternya akan lebih mirip obligasi.\""),
        (b['saham2'] + 75, "baris Saham · Mirip saham · grafik mini bergejolak", "\"pergerakannya akan lebih mirip saham.\""),
        (b['dipengaruhi'] + 90, "baris Indeks saham · Ikut indeks · garis mengikuti garis indeks", "\"kinerjanya juga akan banyak dipengaruhi oleh indeks tersebut.\""),
        (b['jadi'] + 75, "ketiga ikon kembali ke keranjang", "\"Jadi…\""),
        (b['risikonya'] + 40, "Return · Volatilitas · Risiko dari isi keranjang", "\"…return, volatilitas, dan risikonya\""),
        (b['bergantung'] + 25, "isi melompat bergantian · Underlying asset · judul TEXT", "\"…sangat bergantung pada underlying asset-nya.\""),
        (BATAS["s8"] - 1, "akhir: Saham terangkat dari keranjang (Scene 08 menerbangkannya ke slot bab 06)", "\"…underlying asset-nya.\"")]

def s08():
    a = BATAS["s8"]; b = urut(['saham', 'emas', 'saat', 'bagian', 'yang', 'pemilik', 'produk', 'laba', 'berkembang', 'nilai', 'bertumbuh'], a)
    return "Scene 08 · Saham (revisi 7 Okt: peta bab + Saham dari keranjang + rantai mendatar + adegan pertumbuhan)", a, BATAS["s9"], [
        (a + 22, "isi Scene 07 menyusut ke bab 05; ikon Saham terbang dari keranjang", "\"Terakhir, kita masuk ke saham.\""),
        (b['saham'] + 2, "ikon Saham mengisi slot bab 06", "\"…saham.\""),
        (b['emas'] + 30, "simpul bab 06 meluncur ke kanan; Emas di kiri (tidak sama)", "\"…antara saham dan emas adalah:\""),
        (b['saat'] + 50, "emas pergi; Saham kembali ke tengah", "\"saat membeli saham,\""),
        (b['bagian'] + 45, "perusahaan terbentuk di sekeliling Saham, yang jadi potongan oranye", "\"kita membeli bagian dari sebuah perusahaan…\""),
        (b['yang'] + 40, "perusahaan berputar seperti roda yang bekerja", "\"…yang sedang menjalankan bisnis.\""),
        (b['pemilik'] + 45, "perusahaan bergeser; pemilik kecil · judul TEXT", "\"…salah satu pemilik kecil dari perusahaan tersebut.\""),
        (b['produk'] + 40, "perusahaan menjual produk & layanan", "\"Perusahaan menjual produk dan layanan,\""),
        (b['laba'] + 40, "rantai mendatar: produk & layanan, pendapatan, laba", "\"…menghasilkan pendapatan dan laba.\""),
        (b['berkembang'] - 40, "koin mengalir di rantai; perusahaan membesar", "\"Kalau bisnisnya terus berkembang,\""),
        (b['nilai'] + 90, "ADEGAN: perusahaan mini (potongan kita) menaiki garis nilai", "\"nilai bagian perusahaan yang kita miliki…\""),
        (b['bertumbuh'] + 40, "ADEGAN: nilai naik (hijau) · lencana naik", "\"…ikut bertumbuh…\""),
        (BATAS["s9"] - 1, "ADEGAN: jam pasir di ujung waktu (akhir)", "\"…dalam jangka panjang.\"")]

def s09():
    a = BATAS["s9"]; b = urut(['reksa', 'perusahaan-perusahaan', 'pertumbuhan', 'belakangnya', 'beroperasi', 'laba', 'sebagian', 'skala', 'pasar',
        'besar', 'kuat', 'pendanaan', 'digunakan', 'siklus', 'tumbuh', 'naik'], a)
    return "Scene 09 · Aset produktif (revisi 7–8 Okt: masker dari S08 + adegan uang tanpa teks + aset uang Simon)", a, BATAS["s10"], [
        (a + 25, "isi Scene 08 menyusut ke ubin Saham", "\"Inilah salah satu alasan kenapa saham,\""),
        (b['reksa'] + 90, "saham · reksa dana saham · reksa dana indeks", "\"…serta reksa dana saham dan reksa dana indeks…\""),
        (b['pertumbuhan'] + 70, "perusahaan produktif membesar (ruang pertumbuhan)", "\"…punya ruang pertumbuhan dalam jangka panjang.\""),
        (b['beroperasi'] + 30, "uang mengalir dari Bisnis ke Laba, bundel mulai menumpuk", "\"…bisnis yang bisa terus beroperasi…\""),
        (b['laba'] + 70, "tumpukan laba bertambah jadi empat bundel", "\"…dan menghasilkan laba.\""),
        (b['sebagian'] + 40, "sebagian laba kembali ke Bisnis lewat busur", "\"…memakai sebagian laba itu…\""),
        (b['skala'] + 40, "uang ditanam ke Skala usaha; Bisnis membesar", "\"…memperbesar skala usaha,\""),
        (b['pasar'] + 80, "Skala usaha · Produk baru · Pasar baru", "\"…atau masuk ke pasar baru.\""),
        (b['besar'] + 60, "perusahaan besar: Brand · Skala", "\"Banyak perusahaan besar juga sudah punya brand, skala,\""),
        (b['kuat'] + 40, "cincin perisai: Bisnis yang kuat", "\"…posisi pasar yang kuat,\""),
        (b['pendanaan'] + 45, "modal dari pasar modal masuk ke Bisnis", "\"…akses … terhadap pendanaan dari pasar modal.\""),
        (b['digunakan'] + 15, "modal + laba masuk ke Bisnis", "\"Kalau modal dan laba itu digunakan dengan baik,\""),
        (b['siklus'] + 90, "siklus terbentuk: slot lima simpul, Laba naik ke puncak", "\"…bisa terbentuk siklus:\""),
        (b['tumbuh'] + 70, "siklus lengkap, titik berputar per putaran", "\"laba, investasi kembali, ekspansi, laba lebih besar, tumbuh lagi.\""),
        (b['naik'] + 45, "Menunggu harga naik: dicoret · judul TEXT", "\"…bukan cuma menunggu harga naik,\""),
        (BATAS["s10"] - 1, "terus menciptakan nilai (akhir)", "\"…terus menciptakan nilai baru.\"")]

def s10():
    a = BATAS["s10"]; b = urut(['pertumbuhan', 'nyaman', 'naik', 'ini', 'turun', 'besok', 'volatilitas', 'tapi', 'sama', 'risiko', 'menggambarkan',
        'seberapa', 'naik', 'turun', 'risiko', 'kehilangan', 'permanen', 'memburuk', 'terpaksa', 'buruk', 'tepat'], a)
    return "Scene 10 · Volatilitas tidak sama dengan risiko (revisi 8 Okt: masker dari S09 + penunggang + fokus risiko)", a, BATAS["s11"], [
        (a + 25, "isi Scene 09 menyusut ke titik awal garis harga", "\"Tentu saja,\""),
        (b['nyaman'] + 20, "investor menaiki garis harga (roller coaster)", "\"…nggak berarti perjalanannya selalu nyaman.\""),
        (b['ini'] + 10, "naik hari ini (hijau) sampai puncak", "\"Harga saham bisa naik hari ini,\""),
        (b['besok'] + 30, "turun besok (merah)", "\"…lalu turun besok.\""),
        (b['volatilitas'] + 40, "inilah volatilitas", "\"Perubahan harga seperti ini disebut volatilitas.\""),
        (b['sama'] + 40, "panel Risiko · tidak sama; penunggang berayun naik-turun", "\"Tapi volatilitas tidak selalu sama dengan risiko.\""),
        (b['turun2'] + 20, "seberapa besar harga bergerak: braket", "\"Volatilitas hanya menggambarkan seberapa besar harga bergerak naik dan turun.\""),
        (b['risiko2'] + 90, "fokus ke risiko: panel meluas, tiga slot disapu kaca pembesar", "\"Risiko yang lebih penting untuk diperhatikan justru:\""),
        (b['permanen'] + 30, "kehilangan nilai permanen: jatuh & tak kembali", "\"…bisa kehilangan nilainya secara permanen,\""),
        (b['memburuk'] + 80, "bisnis memburuk: turun pelan", "\"apakah bisnisnya memburuk dalam jangka panjang,\""),
        (b['buruk'] + 20, "terpaksa menjual di titik terendah", "\"…terpaksa menjual di waktu yang buruk…\""),
        (BATAS["s11"] - 1, "harga pulih tanpa kita (penunggang bayangan) · akhir", "\"…karena pengaturan dana yang kurang tepat.\"")]

def s11():
    a = BATAS["s11"]; b = urut(['turun', 'dua', 'ekstrem', 'bukan', 'jelek', 'otomatis', 'lagi', 'mengecek', 'apa', 'mana', 'sejak', 'berlaku'], a)
    return "Scene 11 · Saat harga turun (revisi 8 Okt: dorongan kamera dari S10 + investor + gelembung pikiran + ubin cek)", a, BATAS["s12"], [
        (a + 25, "kamera mendorong ke investor di lembah Scene 10", "\"Makanya,\""),
        (b['turun'] + 40, "investor (tokoh) di atas chip Harga turun · judul TEXT", "\"saat harga turun,\""),
        (b['dua'] + 30, "dua slot pikiran dari kepala investor; investor menoleh", "\"jangan langsung mengambil salah satu dari dua kesimpulan…\""),
        (b['ekstrem'] + 40, "dua kesimpulan ekstrem terdorong ke tepi", "\"…dua kesimpulan ekstrem.\""),
        (b['bukan'] + 70, "gelembung 1 padat · titik sedang mengetik", "\"Bukan berarti:\""),
        (b['jelek'] - 30, "kutipan 1 · investor gemetar panik", "\"Harganya turun, berarti investasinya jelek.\""),
        (b['jelek'] + 50, "dicoret: Jangan panik", "\"…berarti investasinya jelek.\""),
        (b['otomatis'] + 40, "kesimpulan 1 meredup · gelembung 2 mengetik", "\"Tapi juga jangan otomatis berpikir:\""),
        (b['lagi'] - 10, "kutipan 2 · investor bersandar santai", "\"Tenang, nanti pasti naik lagi.\""),
        (b['lagi'] + 50, "dicoret: Jangan berasumsi", "\"…nanti pasti naik lagi.\""),
        (b['mengecek'] + 60, "pikiran naik jadi satu baris · AI Tuntun + kartu Cek lagi", "\"Yang perlu dilakukan adalah kembali mengecek:\""),
        (b['apa'] + 30, "ubin instrumen berganti, lalu dicentang", "\"sebenarnya kita membeli apa?\""),
        (b['mana'] + 30, "ubin sumber return berganti, lalu dicentang", "\"return-nya berasal dari mana?\""),
        (b['sejak'] + 30, "ubin tujuan berganti ke kalender (sejak awal)", "\"…alasan kita berinvestasi sejak awal…\""),
        (BATAS["s12"] - 1, "dicentang: masih berlaku (akhir)", "\"…masih tetap berlaku?\"")]

def s12():
    a = BATAS["s12"]; b = urut(['tidak', 'hal', 'bunga', 'perubahan', 'sewa', 'berkembang', 'memilih', 'return', 'mempertimbangkan', 'likuiditas'], a)
    return "Scene 12 · Rangkuman (revisi 8 Okt: masker S11 ke bab 06 + piala + sorotan sumber return + kaca pembesar)", a, BATAS["s13"], [
        (a + 25, "isi Scene 11 menyusut ke simpul bab 06 (Saham) di peta bab", "\"Kalau semua aset tadi…\""),
        (a + 110, "peta bab utuh: enam instrumen", "\"Kalau semua aset tadi kita bandingkan,\""),
        (b['tidak'] + 63, "piala paling unggul singgah di tiap bab, menggeleng", "\"…tidak ada satu instrumen yang paling unggul…\""),
        (b['hal'] + 40, "dicoret: paling unggul di semua hal", "\"…di semua hal.\""),
        (b['bunga'] - 30, "bunga: bab 01 & 04 disorot, uang mengalir dari sumbernya", "\"Ada yang return-nya terutama datang dari bunga,\""),
        (b['perubahan'] + 20, "perubahan harga: Emas", "\"ada yang lebih bergantung pada perubahan harga,\""),
        (b['sewa'], "pendapatan sewa: Properti", "\"ada yang bisa menghasilkan pendapatan sewa,\""),
        (b['berkembang'] - 20, "Saham berbalik jadi perusahaan; aliran uang makin rapat", "\"…bisnis di belakangnya terus berkembang.\""),
        (b['memilih'] + 60, "peta menyusut jadi baris instrumen, disapu kaca pembesar", "\"Jadi saat memilih instrumen investasi,\""),
        (b['return'] + 10, "kaca pembesar di kartu Return", "\"kita nggak bisa cuma melihat return.\""),
        (b['mempertimbangkan'] + 20, "kaca pembesar menyapu tiga slot", "\"Kita juga perlu mempertimbangkan:\""),
        (b['likuiditas'] + 40, "kartu lensa: volatilitas, likuiditas", "\"…volatilitas, likuiditas,\""),
        (BATAS["s13"] - 1, "kapan uang digunakan · judul TEXT lengkap (akhir)", "\"…dan kapan uang itu akan digunakan.\"")]

def s13():
    a = BATAS["s13"]; b = urut(['langkah', 'memahami', 'uang', 'dibagi', 'mana', 'mana', 'dan', 'jangka', 'video'], a)
    return "Scene 13 · Penutup (revisi 8 Okt: masker S12 ke instrumen + langkah berikutnya + kantong uang Simon + uang mengalir)", a, BATAS["akhir"], [
        (a + 25, "isi Scene 12 menyusut ke simpul instrumen", "\"Setelah memahami perbedaannya,\""),
        (a + 100, "instrumen: sudah dipahami (centang)", "\"Setelah memahami perbedaannya,\""),
        (b['memahami'], "jalur ke langkah berikutnya: slot ?", "\"langkah berikutnya adalah memahami:\""),
        (b['uang'] + 40, "slot terisi kantong uang = uang kita · judul TEXT", "\"uang kita sendiri…\""),
        (b['dibagi'] + 50, "instrumen pergi, kantong uang ke tengah; empat slot kantong", "\"…sebaiknya dibagi seperti apa.\""),
        (b['mana'] + 100, "kantong 1: kebutuhan sehari-hari; uang mengalir", "\"Mana yang memang dibutuhkan untuk kebutuhan sehari-hari,\""),
        (b['mana2'] + 100, "kantong 2: dana darurat", "\"mana yang harus disiapkan untuk kondisi darurat,\""),
        (b['dan'] + 110, "kantong 3: tujuan menengah · judul TEXT 2", "\"dan mana yang bisa disimpan lebih lama…\""),
        (b['jangka'] + 30, "kantong 4: pertumbuhan jangka panjang (membesar)", "\"…untuk mengejar pertumbuhan jangka panjang.\""),
        (b['video'] + 60, "AI Tuntun + kartu video berikutnya", "\"Di video berikutnya, kita akan bahas:\""),
        (BATAS["akhir"] - 1, "akhir video", "\"gimana cara membagi uang untuk tujuan yang berbeda.\"")]

SCENE = {"S01": s01, "S02": s02, "S03": s03, "S04": s04, "S05": s05, "S06": s06, "S07": s07, "S08": s08, "S09": s09, "S10": s10, "S11": s11, "S12": s12, "S13": s13}
judul, awal, akhir, S = SCENE[sys.argv[1]]()
S = [(min(max(g, awal), akhir - 1), j, v) for g, j, v in S]
if sys.argv[2] == "frames":
    print(" ".join(str(g - awal) for g, _, _ in S)); sys.exit()
F = "/System/Library/Fonts/Helvetica.ttc"
f1, f2, fh = ImageFont.truetype(F, 21), ImageFont.truetype(F, 20), ImageFont.truetype(F, 30)
W, H, CAP, PAD, cols = 760, 428, 92, 18, 3
rows = (len(S) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W + (cols + 1) * PAD, 70 + rows * (H + CAP + PAD) + PAD), "white")
d = ImageDraw.Draw(sheet)
d.text((PAD, 18), f"{judul} — ide visual   (Studio: komposisi Ide-{sys.argv[1]}, frame 0 = video {tc(awal)} · VO v4)", fill=(22, 24, 27), font=fh)
for k, (g, jd, vo) in enumerate(S):
    im = Image.open(f"out/stills/Ide-{sys.argv[1]}_f{g - awal:05d}.png").convert("RGB").resize((W, H), Image.LANCZOS)
    x, y = PAD + (k % cols) * (W + PAD), 70 + (k // cols) * (H + CAP + PAD)
    sheet.paste(im, (x, y))
    d.text((x, y + H + 6), f"{k + 1}.  Ide-{sys.argv[1]} {tc(g - awal)}   (video {tc(g)})", fill=(142, 142, 150), font=f1)
    d.text((x, y + H + 34), jd, fill=(22, 24, 27), font=f1)
    d.text((x, y + H + 62), vo, fill=(95, 77, 238), font=f2)
out = f"../04_Asset/pratinjau-visual/{sys.argv[1]}_ide-visual.png"
sheet.save(out); print("->", out)
