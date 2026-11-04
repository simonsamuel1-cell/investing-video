/**
 * HARGA PASAR ILUSTRATIF Scene 03 (brief Simon: "↓ MARKET PRICE ↑↓↑↓"). Angka harga TIDAK ditampilkan (bukan data real —
 * Simon 7 Okt); sumbu waktu 0–10 tahun relatif, bukan tanggal historis.
 * 64 titik = PCHIP (tanpa overshoot) lewat titik kendali + riak deterministik yang diredam di 4 titik kunci,
 * jadi titik kunci = ekstrem lokal yang sebenarnya (diperiksa saat dibangkitkan):
 *   i8 lembah (Beli · untung) · i28 puncak (Jual · untung) · i36 puncak (Beli · rugi) · i56 lembah (Jual · rugi)
 */
export const HARGA: number[] = [104.53, 105.88, 106.84, 107.92, 107.21, 103.08, 99.06, 96.97, 95.0, 95.48, 97.56, 96.22, 98.6, 97.81, 95.87, 96.21, 97.1, 98.42, 100.83, 104.93, 105.12, 107.38, 110.04, 108.88, 112.59, 115.47, 118.1, 122.74, 124.0, 122.6, 119.76, 118.07, 115.33, 117.93, 124.23, 127.14, 130.0, 128.62, 123.45, 121.68, 117.78, 114.03, 113.01, 114.02, 114.0, 115.23, 117.17, 114.17, 114.27, 112.9, 108.95, 109.8, 108.28, 106.74, 106.94, 106.33, 106.0, 106.49, 109.02, 108.32, 110.16, 110.61, 107.39, 108.83];
export const KUNCI = { beliU: 8, jualU: 28, beliR: 36, jualR: 56 } as const;
