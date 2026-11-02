# Sofa Scene 04 — lanjut besok (status 27 Okt 17.48)

Simon: "sofa warnanya menyatu dengan baju, dan ukuran tidak realistis, cari dari freepik" → pilih **B** (Kampus, "Couple resting on sofa in living room").
Dua unduhan di `../../../04_Asset/` (folder episode): `couple-resting-sofa-…zip` (**B, dipakai**) · `boy-using-laptop-…zip` (C, tidak dipakai).

Ekspor SVG (Illustrator, `scripts/ekspor-svg.jsx` + `ekspor-svg.txt` berisi jalur masuk/keluar): `B_kampus_ruang-tamu.svg` (viewBox 2400 × 2000;
salinan mentah juga di `public/flat/s04/kampus-asli.svg`, BELUM dipakai kode). Peta grup (dari `scripts/bbox_svg.py`, kotak ± titik kendali):
- `0.0` latar (persegi ungu + gumpalan gradien) — TIDAK dipakai
- `0.1.0.0` rak buku (127–361 × 596–744) · `0.1.0.4` jendela + tirai (574–1345 × 562–1422) · `0.1.0.5` tanaman di ambang (879–1016 × 980–1151)
- `0.1.1` KURSI + PRIA (414–955 × 945–1431): bagian kursi = isi berwarna #84666E / #B08C98 / #997081 (+ garis putih tepi); pria = #9AD8F7, #591143, #440936,
  #417399, #CD2D45, #BC2845, #9B1535, #F39650, #FFA75B
- `0.1.2` SOFA 3 DUDUKAN + WANITA (1071–2107 × 943–1432): sofa = #84666E / #C19DAA / #B08C98 / #997081 + garis putih (indeks 9, 26, 27, 29, 30, 37);
  wanita = #490A3D, #FE6486, #E04B72, #6A964D, #96C677, #FFA75B, #F39650 + grup 15, 16, 19, 20
- `0.1.7` bingkai foto (1615–1839 × 607–904) · `0.1.8` garis lantai (173–2272 × 1429–1437)

Langkah berikut:
1. Pisahkan sofa (grup 0.1.2, buang warna/grup wanita) → `public/flat/s04/sofa.svg`; cek di still apakah bagian sofa di balik tubuh wanita utuh.
2. Warna ulang ke tint brand yang kontras dengan baju turkis tokoh (usul: oranye muda #EFBE73 / oranye #E49C2C; mauve asli bukan warna brand).
3. Skala: tinggi dudukan sofa = bokong tokoh duduk (`DUDUK_Y()` di Scene04Flat ±760) · lantai 860 → sandaran ±2× tinggi dudukan.
4. Ganti `RuangTamu`/`SandaranSofa` di `src/s04flat/Scene04Flat.tsx` (jendela/rak/bingkai/tanaman B boleh ikut agar satu gaya), still + pindai.
