#!/usr/bin/env python3
"""BATAS SCENE Value Investing V01 → src/batas.ts (angka literal, pola Video 05: batas = 3 frame sebelum suara scene berikutnya = awal cue pertamanya − 3).
Jalankan sesudah gen-cues.py."""
import pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
src = (ROOT / "src/cues.ts").read_text(encoding="utf-8")
sc = [(int(n), int(a)) for n, a in re.findall(r"\{ n: (\d+), a: (\d+), b: \d+", src)]
# cues.ts = frame VIDEO (SUDAH + VO_OFFSET); batas.ts menulis O + angka → angka = frame VO (tanpa offset). 30 Okt malam: dulu tidak dikurangi → offset
# terhitung dua kali begitu VO_OFFSET ≠ 0 (intro 240 f)
OFS = int(re.search(r"VO_OFFSET = (\d+)", (ROOT / "src/offset.ts").read_text()).group(1))
baris = [f"  s1Akhir: O + {sc[1][1] - 3 - OFS}, // suara S2 mulai f{sc[1][1]}"]
baris += [f"  s{n}: O + {a - 3 - OFS}, // suara S{n} mulai f{a}" for n, a in sc[1:]]
ts = '''/**
 * BATAS SCENE (frame global, 60 fps) — SATU sumber (pola Video 02/03/05). DIBANGKITKAN scripts/gen-batas.py — jangan diedit tangan.
 * Aturan Simon (V02 6 Okt): scene lama berakhir SEBELUM suara scene baru masuk; scene baru dimulai SESUDAH suara scene lama habis.
 * VO Value Investing V01 v1 (29 Okt): 01_VO/MiniMax_2026-10-29_16_30_58 (public/vo/vi01_vo.wav); tanpa outro terpisah.
 * batas = 3 frame sebelum suara scene berikutnya (awal segmen bersuara kalimat pertamanya, src/cues.ts dari gen-cues.py).
 * Angka ditulis literal supaya scripts/potong-vo.py bisa membacanya.
 */
import { VO_OFFSET as O } from './offset';
import { TOTAL } from './cues';

export const BATAS = {
''' + "\n".join(baris) + "\n  akhir: TOTAL,\n} as const;\n"
(ROOT / "src/batas.ts").write_text(ts, encoding="utf-8")
print("\n".join(baris))
