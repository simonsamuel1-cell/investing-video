#!/usr/bin/env python3
"""
VO PER KOMPOSISI IDE -> public/vo/ide/S0x.wav, dipotong TEPAT di batas scene (src/batas.ts, frame 60 fps, sampel-akurat).
Simon 7 Okt: suara "Selanjutnya, kita lihat properti." ikut terdengar di pratinjau Scene 04. Terukur di Studio: dengan loop menyala,
elemen audio berjalan ±0,6 dtk MELEWATI akhir komposisi sebelum lompat ke awal → kalimat scene berikutnya bocor. Batas sendiri
sudah di jeda hening. Dengan berkas terpotong, suara scene lain memang TIDAK ADA di berkas audio komposisi itu.
Ujung diberi pudar 10 ms (anti klik). Komposisi utama tetap memakai VO utuh.
"""
import pathlib, re, wave
import numpy as np
ROOT = pathlib.Path(__file__).resolve().parent.parent
OFS = int(re.search(r'VO_OFFSET = (\d+)', (ROOT / 'src/offset.ts').read_text()).group(1))
bt = dict((k, eval(v, {"O": OFS})) for k, v in re.findall(r"^\s*(\w+):\s*([0-9 *+O]+),", (ROOT / "src/batas.ts").read_text(), re.M))
# nomor = NASKAH REVISI 16 Okt (src/Ide.tsx); kunci BATAS = nomor scene lama (src/batas.ts)
RENTANG = {"S01": (OFS, bt["s1Akhir"]), "S02": (bt["s2"], bt["s3"]), "S03": (bt["s3"], bt["s5"]), "S04": (bt["s5"], bt["s6"]),
           "S05": (bt["s6"], bt["s7"]), "S06": (bt["s7"], bt["s8"]), "S07": (bt["s8"], bt["s9"]), "S08": (bt["s9"], bt["s12"]),
           "S09": (bt["s12"], bt["s13"]), "S10": (bt["s13"], bt["akhir"])}
w = wave.open(str(ROOT / "public" / re.search(r"VO_UTUH = '([^']+)'", (ROOT / "src/vo.ts").read_text()).group(1))); sr, ch, sw = w.getframerate(), w.getnchannels(), w.getsampwidth()
assert sw == 2
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, ch).astype(float)
DIR = re.search(r"vo/(ide-v\d+)/", (ROOT / "src/vo.ts").read_text()).group(1)  # = VO_IDE di src/vo.ts
(ROOT / "public/vo" / DIR).mkdir(parents=True, exist_ok=True)
fade = int(0.010 * sr)
for nama, (a, b) in RENTANG.items():
    s0, s1 = round((a - OFS) / 60 * sr), round((b - OFS) / 60 * sr)  # frame VIDEO -> sampel VO
    seg = x[s0:s1].copy()
    ramp = np.linspace(0, 1, fade)[:, None]
    if a > OFS: seg[:fade] *= ramp
    seg[-fade:] *= ramp[::-1]
    o = wave.open(str(ROOT / "public/vo" / DIR / f"{nama}.wav"), "wb"); o.setnchannels(ch); o.setsampwidth(2); o.setframerate(sr)
    o.writeframes(np.round(seg).astype(np.int16).tobytes()); o.close()
    ujung = seg[-int(sr * 0.1):]; db = 20 * np.log10(np.sqrt((ujung / 32768) ** 2).mean() + 1e-9)
    print(f"{nama}: f{a}–f{b} ({(b - a) / 60:.2f} dtk) · energi 100 ms terakhir {db:.0f} dB")
