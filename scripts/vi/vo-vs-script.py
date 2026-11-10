#!/usr/bin/env python3
"""
vo-vs-script.py — where a VO departs from its script, scene by scene: heard.json (scripts/vi/transcribe-align.py) is
matched to the script's narration word by word, and every stretch that differs is printed with its time in the VO.

  ~/.venvs/tuntun/bin/python scripts/vi/vo-vs-script.py script.txt heard.json [out.json]

Spelling that is not a difference is folded first — "15,3%" / "15,3 persen", "nggak" / "gak" / "enggak", "Rp50" / "50",
"S&P" / "SNP" — so what is left is wording: words the VO adds, drops or says differently.
"""
import difflib
import json
import re
import sys

NUM = {"nol": "0", "satu": "1", "dua": "2", "tiga": "3", "empat": "4", "lima": "5", "enam": "6", "tujuh": "7", "delapan": "8", "sembilan": "9", "sepuluh": "10", "sebelas": "11", "seratus": "100"}
SAME = {"gak": "nggak", "ngga": "nggak", "enggak": "nggak", "ga": "nggak", "nga": "nggak", "engga": "nggak", "tak": "nggak", "snp": "sp", "s&p": "sp"}


def toks(word):
    """A written or heard word as comparable tokens (a number keeps its decimal comma; % becomes "persen")."""
    out = []
    w = word.lower().replace("’", "'")
    w = re.sub(r"^rp\.?(?=\d)", "", w)
    for part in re.split(r"[\s\-—–/]+", w):
        pct = part.endswith("%") or part.endswith("%.") or part.endswith("%,")
        core = re.sub(r"[^0-9a-z,.&]", "", part.replace("%", ""))
        core = re.sub(r"^[,.]+|[,.]+$", "", core)
        if re.fullmatch(r"\d+([.,]\d+)*", core or "x"):
            core = core.replace(".", "") if re.fullmatch(r"\d{1,3}(\.\d{3})+", core) else core
        else:
            core = core.replace(",", "").replace(".", "")
        core = SAME.get(core, NUM.get(core, core))
        if core:
            out.append(core)
        if pct:
            out.append("persen")
    return out


def script_scenes(path):
    words, scene = [], None
    for line in open(path):
        m = re.match(r"\s*\[SCENE (\d+)[^\]]*\](.*)", line)
        if m:
            scene = int(m.group(1))
            continue
        if line.strip() in ("NARRATION", "NARASI", ""):
            continue
        for t in re.sub(r"\[[^\]]*\]", " ", line).split():
            words.append((t, scene))
    return words


def main():
    script = script_scenes(sys.argv[1])
    heard = json.load(open(sys.argv[2]))["words"]
    # glue whisper's split number tails ("15" ",3%") back on
    glued = []
    for h in heard:
        if glued and re.match(r"^[,.]\d|^%", h["w"]):
            glued[-1] = {"w": glued[-1]["w"] + h["w"], "start": glued[-1]["start"], "end": h["end"]}
        else:
            glued.append(dict(h))
    a = [(t, i) for i, (w, _) in enumerate(script) for t in toks(w)]
    b = [(t, j) for j, h in enumerate(glued) for t in toks(h["w"])]
    sm = difflib.SequenceMatcher(a=[t for t, _ in a], b=[t for t, _ in b], autojunk=False)
    diffs = []
    for op, a0, a1, b0, b1 in sm.get_opcodes():
        if op == "equal":
            continue
        si = sorted({a[k][1] for k in range(a0, a1)})
        hj = sorted({b[k][1] for k in range(b0, b1)})
        # the scene: of the script words involved, else of the script word just before
        scene = script[si[0]][1] if si else script[a[a0 - 1][1]][1] if a0 > 0 else script[0][1]
        t = glued[hj[0]]["start"] if hj else (glued[b[b0 - 1][1]]["end"] if b0 > 0 else 0.0)
        # context: the script words around it
        ctx_i = si[0] if si else (a[a0 - 1][1] + 1 if a0 > 0 else 0)
        before = " ".join(w for w, _ in script[max(0, ctx_i - 5) : ctx_i])
        after_i = (si[-1] + 1) if si else ctx_i
        after = " ".join(w for w, _ in script[after_i : after_i + 5])
        diffs.append({
            "scene": scene, "op": op, "time": round(t, 2),
            "script": " ".join(script[i][0] for i in si),
            "vo": " ".join(glued[j]["w"] for j in hj),
            "before": before, "after": after,
        })
    if len(sys.argv) > 3:
        json.dump(diffs, open(sys.argv[3], "w"), ensure_ascii=False, indent=1)
    for d in diffs:
        m, s = divmod(d["time"], 60)
        print(f"SC{d['scene']:02d} {int(m)}:{s:05.2f} {d['op']:7s} script[{d['script']}]  VO[{d['vo']}]   …{d['before'][-40:]} | {d['after'][:40]}…")


main()
