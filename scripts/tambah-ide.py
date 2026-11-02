#!/usr/bin/env python3
"""Daftarkan komposisi Ide-Sxx baru (pola Ide-S01 …): src/IdeSxx.tsx dari pola scene sebelumnya + Babak + Root. Pakai: tambah-ide.py 12"""
import pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
n = int(sys.argv[1]); prev = n - 1
N, P = f"{n:02d}", f"{prev:02d}"
src = (ROOT / f"src/IdeS{P}.tsx").read_text()
out = (src.replace(f"S{P}", f"S{N}").replace(f"Scene {P}", f"Scene {N}")
       .replace(f"BATAS.s{prev + 1} - S{N}_AWAL", f"BATAS.s{n + 1} - S{N}_AWAL").replace(f"= BATAS.s{prev};", f"= BATAS.s{n};")
       .replace(f"(global BATAS.s{prev})", f"(global BATAS.s{n})"))
(ROOT / f"src/IdeS{N}.tsx").write_text(out)
b = ROOT / "src/Babak.tsx"; s = b.read_text()
if f"Scene{N}" not in s:
    s = s.replace(f"import {{ Scene{P} }} from './s{P}/Scene{P}';", f"import {{ Scene{P} }} from './s{P}/Scene{P}';\nimport {{ Scene{N} }} from './s{N}/Scene{N}';")
    s = s.replace(f"      {{tampil('S{P}') ? <Scene{P} f={{f}} /> : null}}", f"      {{tampil('S{P}') ? <Scene{P} f={{f}} /> : null}}\n      {{tampil('S{N}') ? <Scene{N} f={{f}} /> : null}}")
    b.write_text(s)
r = ROOT / "src/Root.tsx"; s = r.read_text()
if f"IdeS{N}" not in s:
    s = s.replace(f"import {{ IdeS{P}, S{P}_LEN }} from './IdeS{P}';", f"import {{ IdeS{P}, S{P}_LEN }} from './IdeS{P}';\nimport {{ IdeS{N}, S{N}_LEN }} from './IdeS{N}';")
    a = f'    <Composition id="Ide-S{P}" component={{IdeS{P}}} durationInFrames={{S{P}_LEN}} fps={{60}} width={{1920}} height={{1080}} />'
    assert a in s
    s = s.replace(a, a + f'\n    <Composition id="Ide-S{N}" component={{IdeS{N}}} durationInFrames={{S{N}_LEN}} fps={{60}} width={{1920}} height={{1080}} />')
    r.write_text(s)
print((ROOT / f"src/IdeS{N}.tsx").read_text().splitlines()[6:9])
