/* KAMERA — [frame pusat tanjakan 60 f, geser x, geser y] (px). Dulu dibangkitkan scripts/gen-kamera.py (VI V01 tahap 1: diam).
 * 2 Nov (Simon, feedback seluruh video: "Spacing dan alignment visual masih banyak yang tidak center pada frame (terlalu keatas)"): pusat tinta isi
 * S02–S08 terukur rata-rata 35–70 px DI ATAS tengah frame 540 (out/ukur-pindai + pusat-pindai.py; dulu dipusatkan di 497). Satu geser kamera KONSTAN
 * +40 px ke bawah — tanpa gerak di dalam scene (aturan "tanpa geser tanpa arti") — mulai sesudah layar terbelah S01 keluar (tanjakan 60 f berpusat
 * f3662, saat kartu Investasi/Spekulasi pop; adegan flat S01 tidak ikut) sampai akhir S08. Sisa simpangan per scene dirapikan di tata letaknya.
 * Lapisan layar penuh di dalam kamera (latar transisi bentuk, MaskerKeluar) membalik geser ini. */
export const KAMERA: [number, number, number][] = [[0, 0, 0], [3662, 0, 40]];
