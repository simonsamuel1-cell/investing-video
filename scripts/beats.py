"""Ketukan kata untuk skrip Python (lembar pratinjau/QA) — logika SAMA dengan src/beats.ts `urut`: tiap kata = kemunculan
pertama SESUDAH kata sebelumnya. Frame still diambil relatif ke kata, jadi tetap benar saat VO direkam ulang."""
import json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
OFS = int(re.search(r'VO_OFFSET = (\d+)', (ROOT / 'src/offset.ts').read_text()).group(1))
_s = (ROOT / "src/words.gen.ts").read_text()
WORDS = json.loads(_s[_s.index("= [") + 2: _s.rindex("]") + 1])
BATAS = {k: eval(v, {"O": OFS}) for k, v in re.findall(r"^\s*(\w+):\s*([0-9 *+O]+),", (ROOT / "src/batas.ts").read_text(), re.M)}
def kata(w, sesudah=0):
    for t, a, *_ in WORDS:
        if t == w and a >= sesudah: return a
    raise KeyError(f"{w} sesudah f{sesudah}")
def urut(words, dari):
    out, t = [], dari
    for i, w in enumerate(words):
        t = kata(w, dari if i == 0 else t + 1); out.append(t)
    return dict(zip([f"{w}{'' if words[:i].count(w) == 0 else words[:i].count(w) + 1}" for i, w in enumerate(words)], out))
