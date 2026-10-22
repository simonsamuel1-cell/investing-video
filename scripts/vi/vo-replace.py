#!/usr/bin/env python3
"""
vo-replace.py — Simon's "[script] - [file vo]" lines straight into data/vo-edits.json: finds each line in the
ORIGINAL take, cuts in the silences around it, and keeps the pauses the original had.

  ~/.venvs/tuntun/bin/python scripts/vi/vo-replace.py src/episodes/<ep> "Belum ada? Berarti masih pemula." "Scene 05 Part 2.mp3" \
      [more "line" "file" pairs] [--rewrite "old script text" "new script text"]

Where a line is (data/vo-original-words.json: the original take aligned to the script), it measures the speech
on both sides from the audio itself (whisper's word edges drift by up to half a second), then:
  cut-in  = the line's onset minus the new clip's own lead-in   → the pause before stays the original's
  resume  = the line's offset plus the clip's kept tail          → the pause after stays the original's
Lines that follow each other with nothing between are one group: their clips are joined by the original pause.
Then run scripts/vi/vo-refresh.sh.
"""
import argparse
import json
import re
import subprocess
from pathlib import Path

import numpy as np

SR = 16000
HOP = 0.01
SILENT_DB = -42.0
TAIL = 0.08
# between two re-recorded sentences whose original had no pause to copy
SENTENCE_PAUSE = 0.35


def norm(w):
    return re.sub(r"[^0-9a-z]", "", w.lower())


def envelope(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32)
    n = int(HOP * SR)
    frames = x[: len(x) // n * n].reshape(-1, n)
    return 20 * np.log10(np.sqrt((frames ** 2).mean(axis=1)) + 1e-9)


def silence_near(env, lo, hi):
    """The longest run of silent frames inside [lo, hi] s → (its start, its end) in seconds."""
    a, b = max(0, int(lo / HOP)), min(len(env), int(hi / HOP))
    best, run = None, None
    for i in range(a, b):
        if env[i] < SILENT_DB:
            run = (run[0], i + 1) if run else (i, i + 1)
            if best is None or run[1] - run[0] > best[1] - best[0]:
                best = run
        else:
            run = None
    if best is None:
        # the take runs one sentence into the next with no pause: cut at the quietest dip instead
        k = a + int(np.argmin(env[a:b]))
        print(f"  no pause between {lo:.2f}s and {hi:.2f}s; cutting at the dip {k * HOP:.2f}s ({env[k]:.0f} dB)")
        return k * HOP, k * HOP
    return best[0] * HOP, best[1] * HOP


def clip_edges(path):
    env = envelope(path)
    loud = np.where(env >= SILENT_DB)[0]
    dur = len(env) * HOP
    return loud[0] * HOP, (loud[-1] + 1) * HOP, dur


def find_line(words, line):
    q = [norm(t) for t in line.split() if norm(t)]
    toks = [norm(w["w"]) for w in words]
    hits = [i for i in range(len(toks) - len(q) + 1) if toks[i : i + len(q)] == q]
    if len(hits) != 1:
        raise SystemExit(f"{line!r}: found {len(hits)} times in the original take")
    return hits[0], hits[0] + len(q) - 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("pairs", nargs="+")
    ap.add_argument("--rewrite", nargs=2, action="append", default=[], metavar=("OLD", "NEW"))
    ap.add_argument("--note", default="")
    a = ap.parse_args()
    ep = Path(a.episode)
    spec_path = ep / "data/vo-edits.json"
    spec = json.loads(spec_path.read_text())
    base = Path(spec["base"])
    words = json.loads((ep / "data/vo-original-words.json").read_text())["words"]
    env = envelope(base / spec["source"])

    reps = []
    for line, clip in zip(a.pairs[::2], a.pairs[1::2]):
        i, j = find_line(words, line)
        lead, off, dur = clip_edges(base / "Revisi VO" / clip)
        tail = min(TAIL, dur - off)
        reps.append(dict(line=line, clip=clip, i=i, j=j, lead=lead, keep=off + tail, tail=tail))
    reps.sort(key=lambda r: r["i"])

    groups = [[reps[0]]]
    for r in reps[1:]:
        (groups[-1].append(r) if r["i"] == groups[-1][-1]["j"] + 1 else groups.append([r]))

    pieces = spec["pieces"]
    for g in groups:
        for r in g:
            r["e0"], r["s0"] = silence_near(env, words[r["i"]]["start"] - 0.6, words[r["i"]]["start"] + 0.25)
            r["e1"], r["n1"] = silence_near(env, words[r["j"]]["end"] - 0.25, words[r["j"]]["end"] + 0.7)
        cut_in = max(g[0]["s0"] - g[0]["lead"], g[0]["e0"] + 0.02)
        resume = min(g[-1]["e1"] + g[-1]["tail"], g[-1]["n1"] - 0.02)
        new = []
        for k, r in enumerate(g):
            if k:
                p = g[k - 1]
                gap = p["n1"] - p["e1"] if p["n1"] - p["e1"] > 0.1 else SENTENCE_PAUSE
                new.append({"silence": round(max(0.0, gap - p["tail"] - r["lead"]), 3)})
            new.append({"_": f"{a.note}'{r['line']}'".strip(), "src": f"Revisi VO/{r['clip']}", "to": round(r["keep"], 3), "match": f"original {r['s0']:.2f}-{r['e1']:.2f}"})
        at = [k for k, p in enumerate(pieces) if p.get("src") == "ORIGINAL" and p.get("from", 0) <= cut_in and resume <= p.get("to", 1e9)]
        if len(at) != 1:
            raise SystemExit(f"{g[0]['line']!r}: {cut_in:.2f}-{resume:.2f}s is not inside one untouched stretch of the original")
        old = pieces[at[0]]
        before = {"src": "ORIGINAL", "from": old.get("from", 0), "to": round(cut_in, 3)}
        after = {"src": "ORIGINAL", "from": round(resume, 3)} | ({"to": old["to"]} if "to" in old else {})
        pieces[at[0] : at[0] + 1] = [before] + new + [after]
        print(f"{' + '.join(r['clip'] for r in g)}: original {cut_in:.2f}-{resume:.2f}s replaced")
    spec_path.write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n")

    script = ep / "data/script.txt"
    text = script.read_text()
    for old, new in a.rewrite:
        if text.count(old) != 1:
            raise SystemExit(f"script: {old!r} found {text.count(old)} times")
        text = text.replace(old, new)
        print(f"script: {old!r} -> {new!r}")
    script.write_text(text)


if __name__ == "__main__":
    main()
