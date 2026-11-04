/* DIBANGKITKAN oleh scripts/kamera.py — [mulai, selesai, dx, dy] per scene (frame global). Jangan diedit tangan. 16 Okt (Simon: "hapus geser kanan kiri yang tidak ada artinya, zoom tanpa arti"): S03/S06/S08/S09 = tanpa kamera (scene gaya Video 3), S02/S05/S07 disederhanakan TANGAN jadi kamera tetap — JANGAN jalankan ulang kamera.py/zoom.py untuk scene ini. */
export const KAMERA: Record<string, [number, number, number, number][]> = {
  "S01": [[0, 0, 4, -8], [210, 310, 0, -15], [1500, 2470, 4, 14]],
  "S02": [[2860, 2860, 4, 14], [2930, 2990, 4, 12], [4255, 4315, 6, -14]],
  "S03": [[4707, 4707, 0, 0]],
  "S05": [[7044, 7044, -10, 0]],
  "S06": [[9479, 9479, 0, 0]],
  "S07": [[11899, 11899, 0, 10]],
  "S08": [[14282, 14282, 0, 0]],
  "S09": [[16067, 16067, 0, 0]],
  "S12": [[18476, 18476, 20, -4], [18576, 18636, -5, 40], [19236, 19296, -12, 18]],
  "S13": [[20028, 20028, 0, 257], [20417, 20477, -13, 64], [21256, 21316, -10, 112]]
};
