#!/usr/bin/env python3
"""
align-words.py — every spoken word of a VO on the 60 fps frame grid, so a beat can be named by its WORD
("muncul di kata Rp50") instead of a frame number.

  ~/.venvs/tuntun/bin/python scripts/vi/align-words.py VO.mp3 out.json [--script script.txt] [--model small]
  ~/.venvs/tuntun/bin/python scripts/vi/align-words.py --find out.json "Rp50" "mulai punya aset"

faster-whisper (local, CPU) hears the words with their times. With --script, the SCRIPT's words are what
is written out — matched to the heard ones (difflib over normalised tokens), and any the model misheard
or skipped take a time interpolated between their matched neighbours — because the script is right
about the text and the audio is right about the time (the same split as vi01-align.py).

Output: {"fps": 60, "words": [{"i", "w", "start", "end", "f0", "f1", "heard"}]}  (seconds and frames).
"""
import argparse
import difflib
import json
import re
import sys

FPS = 60


# the script writes numbers and slang one way, whisper another: "tiga" is heard as "3", "nggak" as "gak"
NUMBER = {"satu": "1", "dua": "2", "tiga": "3", "empat": "4", "lima": "5", "enam": "6", "tujuh": "7", "delapan": "8", "sembilan": "9", "sepuluh": "10"}
SPELLING = {"gak": "nggak", "ngga": "nggak", "enggak": "nggak", "ga": "nggak", "nga": "nggak"}


def norm(w):
    """Lower-case letters and digits only; "Rp50" and the heard "50" are the same word, so are "tiga" and "3"."""
    t = re.sub(r"[^0-9a-z]", "", w.lower())
    t = re.sub(r"^rp(?=\d)", "", t)
    t = NUMBER.get(t, t)
    return SPELLING.get(t, t)


def parts(w):
    """A word as the parts whisper hears separately: "naik-turunnya" -> naik, turunnya; "membelinya—diri" -> two."""
    return [p for p in (norm(x) for x in re.split(r"[-—–]", w)) if p]


def hear(audio, model_size, language):
    from faster_whisper import WhisperModel

    import subprocess

    import numpy as np

    # decoded by ffmpeg here, not by PyAV inside faster-whisper (its PyAV call breaks on newer PyAV)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
    pcm = np.frombuffer(raw, dtype=np.float32)
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(pcm, language=language, word_timestamps=True, vad_filter=False)
    out = []
    for seg in segments:
        for w in seg.words or []:
            out.append({"w": w.word.strip(), "start": float(w.start), "end": float(w.end)})
    return out


def onto_script(heard, script_words):
    # whisper hears "26,7" as "26" + ",7" and "3%" as "3" + "%": glue those tails back onto their number
    glued = []
    for h in heard:
        if glued and re.match(r"^[,.%]", h["w"]):
            glued[-1] = {"w": glued[-1]["w"] + h["w"], "start": glued[-1]["start"], "end": h["end"]}
        else:
            glued.append(dict(h))
    # both sides as parts, each part remembering its word, so hyphenated words match whisper's split ones
    ha = [(p, h) for h in glued for p in parts(h["w"])]
    sb = [(p, i) for i, w in enumerate(script_words) for p in parts(w)]
    a = [p for p, _ in ha]
    b = [p for p, _ in sb]
    times = [None] * len(script_words)
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            h, i = ha[blk.a + k][1], sb[blk.b + k][1]
            s, e = (h["start"], h["end"]) if times[i] is None else (min(times[i][0], h["start"]), max(times[i][1], h["end"]))
            times[i] = (s, e, True)
    # interpolate the unmatched between matched neighbours
    known = [i for i, t in enumerate(times) if t]
    for i, t in enumerate(times):
        if t:
            continue
        lo = max([k for k in known if k < i], default=None)
        hi = min([k for k in known if k > i], default=None)
        s = times[lo][1] if lo is not None else (times[hi][0] if hi is not None else 0.0)
        e = times[hi][0] if hi is not None else s + 0.3
        n = (hi if hi is not None else len(times)) - (lo if lo is not None else -1)
        k = i - (lo if lo is not None else -1)
        a0 = s + (e - s) * (k - 1) / max(n - 1, 1)
        a1 = s + (e - s) * k / max(n - 1, 1)
        times[i] = (a0, max(a1, a0 + 0.05), False)
    return [{"w": w, "start": t[0], "end": t[1], "heard": t[2]} for w, t in zip(script_words, times)]


def silences(audio, silent_db=-42.0, hop=0.01, min_len=0.06):
    """Every pause in the audio as (start, end) seconds: 10 ms frames under silent_db for at least min_len."""
    import subprocess

    import numpy as np

    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32)
    n = int(hop * 16000)
    db = 20 * np.log10(np.sqrt((x[: len(x) // n * n].reshape(-1, n) ** 2).mean(axis=1)) + 1e-9)
    out, run = [], None
    for i, quiet in enumerate(db < silent_db):
        if quiet:
            run = run if run is not None else i
        elif run is not None:
            if (i - run) * hop >= min_len:
                out.append((run * hop, i * hop))
            run = None
    if run is not None:
        out.append((run * hop, len(db) * hop))
    return out


def snap_to_pauses(words, pauses, reach=0.6):
    """
    Whisper's word edges drift by up to half a second; the pauses in the audio don't. Where the script pauses
    (a word ending in . , ? ! : ; or a closing quote), the boundary moves onto the nearest real pause within
    `reach`: the word before ends where the silence starts, the word after starts where it ends. Words between
    two such anchors are stretched linearly onto the new span, so they keep their order and proportions.
    """
    if not words:
        return words
    old = [(w["start"], w["end"]) for w in words]
    anchors = {}  # word index -> (new start or None, new end or None)
    for k in range(len(words) - 1):
        if not re.search(r"[.,?!:;”\"—]$", words[k]["w"]):
            continue
        mid = (words[k]["end"] + words[k + 1]["start"]) / 2
        # the pause must sit between the two words (a comma the voice ran through must not grab the pause
        # before the sentence), and within reach of where whisper put the boundary
        near = [p for p in pauses if p[0] - reach <= mid <= p[1] + reach and words[k]["start"] < (p[0] + p[1]) / 2 < words[k + 1]["end"]]
        if not near:
            continue
        p = min(near, key=lambda p: (max(p[0] - mid, mid - p[1], 0), -(p[1] - p[0])))
        anchors.setdefault(k, [None, None])[1] = p[0]
        anchors.setdefault(k + 1, [None, None])[0] = p[1]
    # the voice's first onset and last offset
    lead = [p for p in pauses if p[0] <= words[0]["start"] + reach and p[1] <= words[0]["start"] + reach]
    if lead:
        anchors.setdefault(0, [None, None])[0] = max(p[1] for p in lead)
    tail = [p for p in pauses if p[1] >= words[-1]["end"] - reach and p[0] >= words[-1]["end"] - reach]
    if tail:
        anchors.setdefault(len(words) - 1, [None, None])[1] = min(p[0] for p in tail)
    # spans between consecutive anchored edges, each mapped old -> new
    edges = sorted([(k, 0, v[0]) for k, v in anchors.items() if v[0] is not None] + [(k, 1, v[1]) for k, v in anchors.items() if v[1] is not None])
    pts = [(old[k][side], t) for k, side, t in edges]
    pts = [pts[0]] + [q for p, q in zip(pts, pts[1:]) if q[0] > p[0] and q[1] > p[1]]

    def warp(t):
        if t <= pts[0][0]:
            return t + (pts[0][1] - pts[0][0])
        if t >= pts[-1][0]:
            return t + (pts[-1][1] - pts[-1][0])
        for (a0, b0), (a1, b1) in zip(pts, pts[1:]):
            if a0 <= t <= a1:
                return b0 + (t - a0) * (b1 - b0) / (a1 - a0)
        return t

    for k, w in enumerate(words):
        s, e = warp(old[k][0]), warp(old[k][1])
        if k in anchors:
            s = anchors[k][0] if anchors[k][0] is not None else s
            e = anchors[k][1] if anchors[k][1] is not None else e
        w["start"], w["end"] = s, max(e, s + 0.05)
    return words


def finish(words):
    for i, w in enumerate(words):
        w["i"] = i
        w["f0"] = round(w["start"] * FPS)
        w["f1"] = round(w["end"] * FPS)
    return {"fps": FPS, "words": words}


def find(path, phrases):
    words = json.load(open(path))["words"]
    toks = [norm(w["w"]) for w in words]
    for p in phrases:
        q = [norm(x) for x in p.split() if norm(x)]
        hits = [i for i in range(len(toks) - len(q) + 1) if toks[i : i + len(q)] == q]
        if not hits:
            print(f"{p!r}: not found")
        for i in hits:
            print(f"{p!r}: f{words[i]['f0']} – f{words[i + len(q) - 1]['f1']}  ({words[i]['start']:.2f}s)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("audio", nargs="?")
    ap.add_argument("out", nargs="?")
    ap.add_argument("--script")
    ap.add_argument("--model", default="small")
    ap.add_argument("--language", default="id")
    ap.add_argument("--find", nargs="+", metavar=("JSON", "PHRASE"))
    a = ap.parse_args()
    if a.find:
        find(a.find[0], a.find[1:])
        sys.exit(0)
    heard = hear(a.audio, a.model, a.language)
    if a.script:
        # scene headers ("[SCENE 13 | 02:44–02:59]", or a whole "[SCENE 01] — Title" line) and "NARRATION" lines
        # are not spoken; a header tells each word below it which scene it belongs to
        script_words, scenes, scene = [], [], None
        for line in open(a.script):
            m = re.match(r"\s*\[SCENE (\d+)[^\]]*\](.*)", line)
            if m:
                scene = int(m.group(1))
                line = "" if "—" in m.group(2) else m.group(2)
            if line.strip() == "NARRATION":
                continue
            for t in re.sub(r"\[[^\]]*\]", " ", line).split():
                script_words.append(t)
                scenes.append(scene)
        words = snap_to_pauses(onto_script(heard, script_words), silences(a.audio))
        if scene is not None:
            for w, s in zip(words, scenes):
                w["scene"] = s
    else:
        words = [dict(h, heard=True) for h in heard]
    json.dump(finish(words), open(a.out, "w"), ensure_ascii=False, indent=1)
    print(f"{len(words)} words -> {a.out}; matched {sum(w['heard'] for w in words)}")
