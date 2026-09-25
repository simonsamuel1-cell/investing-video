#!/usr/bin/env python3
"""
ta02-indo-timeline.py — the Indonesian cut of the Candlestick video, re-timed to
its own voice, with Simon's four new passages cut in.

    python3 scripts/ta02-indo-timeline.py            # data + subtitles
    python3 scripts/ta02-indo-timeline.py --audio    # ...and rebuild public/vo-indo.mp3

WHY THIS EXISTS. The Indonesian composition is the English picture with an
Indonesian voice laid over it, and the two were never synced: the Indonesian
narration reaches each scene's content early — by ~2s at SC07 and by ~10s from
SC13 to the start of BBRI — then falls back into step at the 3-2-1 countdown.
Simon's four passages go in at the gaps between his script's scenes, and a
transition there has to sit ON a picture's scene change. With the picture
running up to ten seconds behind the voice, that cannot be done without
re-timing the picture to the voice. So the picture is re-timed, for the
Indonesian cut only; the English composition does not use any of this.

HOW. Every scene start is anchored to the Indonesian line that opens it, with
the same lead the English picture had over its own line. Between anchors the
picture is stretched or squeezed ONLY on frames where it is standing still (a
frame identical to the one before it, measured from a quarter-size render of
the whole film — scripts/ref/ta02-motion.json). Dropping a repeated frame or
repeating one more is invisible; nothing that moves is sped up or slowed down.
BBRI, where the Indonesian runs longer than the English, is anchored beat by
beat so the countdown still lands on "Tiga… dua… satu…".

At each passage the picture holds the outgoing scene's last full frame for the
length of the passage; the roadmap (continuity/Roadmap.tsx) plays over it and
pushes into the incoming scene's first frame.

OUTPUTS
  src/episodeCandlestick/data/indoTimeline.ts   the frame map + passage windows
  src/episodeCandlestick/subtitlesIndo.ts       cues re-timed, passages added
  public/vo-indo.mp3 (--audio)                  voice with the passages cut in,
                                                on samples (44100/30 = 1470 per
                                                frame), from vo-indo.pre-extend.mp3
"""
import json, os, subprocess, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXT_DIR = os.path.expanduser("~/Documents/01 Academy/VIDEO 17 - Candlestick Intermediate/Extended Parts")
SPF = 1470  # samples per frame at 44.1 kHz / 30 fps
SR = 44100

# ── the four passages ────────────────────────────────────────────────────────
# `cut` is Simon's frame, in the ORIGINAL Indonesian voice; all four sit in
# silence (-51, -74, -180, -56 dB). `x_out` is the outgoing scene's last
# full-opacity frame (its SceneFade starts 12 frames before its end); `x_in` is
# the incoming scene's first frame. `frames` is the clip rounded UP to whole
# frames — the remainder is padded with silence.
PASSAGES = [
    dict(n=1, cut=284, x_out=227, x_in=240),     # SC01 → SC02
    dict(n=2, cut=2307, x_out=2332, x_in=2345),  # SC05 → SC06
    # n=3 (SC12 → SC13A, cut 7606) REMOVED — Simon: "8332-8722 part ini remove
    # aja deh, ga nyambung soalnya. Termasuk VO nya ya". SC12 runs into SC13A
    # on its own fade again; see the SC13A anchor.
    dict(n=4, cut=8753, x_out=9031, x_in=9044),  # SC13D → BBRI
]

# Subtitle WORDING comes from Simon's script (scripts/ref/ta02-indo-script.txt;
# its "[…]" heading lines are skipped). Subtitle TIMING comes from the SRTs —
# Simon: "timingnya jangan ditiru, kamu sesuaikan aja dari srt file
# sebelumnya". Each cue's words are matched to the script word by word and the
# cue takes the script's spelling, case and punctuation, so "10%" reads
# "sepuluh persen" and the passages' lower-case, unpunctuated SRTs read like
# the rest of the track.
SCRIPT = os.path.join(ROOT, "scripts/ref/ta02-indo-script.txt")

# ── anchors: (picture frame, Indonesian voice frame) ─────────────────────────
# Picture frame x is shown when the ORIGINAL Indonesian voice is at frame y.
# Scene starts: y = the Indonesian line that opens the scene, minus the lead
# the English picture had over ITS opening line. The legs that end in a
# passage are added from PASSAGES.
ANCHORS = [
    (0, 0),
    # passage 1 (SC01 → SC02)
    (614, 684),    # SC03  "Body kecil dengan wick atas…" 698 − lead 14
    (1074, 1079),  # SC04  "Wick bawah yang panjang…" 1090 − 11
    (1557, 1502),  # SC05  "Tiga candle merah…" 1520 − 18
    # passage 2 (SC05 → SC06)
    (3153, 3045),  # SC07  "Kalau wick bawah panjang" 3056 − 11
    (3657, 3508),  # SC08  "Ada puluhan pola candlestick…" 3516 − 8
    (4158, 3985),  # SC09  "Pertama, Hammer." 3996 − 11
    (5079, 4901),  # SC10  "Berikutnya, Bullish Engulfing." 4913 − 12
    (6057, 5976),  # SC11  "Ini Shooting Star," 5992 − 16
    (6926, 6808),  # SC12  "Pasangannya adalah Bearish Engulfing," 6816 − 8
    (7773, 7612),  # SC13A "Sekarang kamu sudah melihat" 7612 − 0 (passage 3 removed)
    (8015, 7774),  # SC13B "Morning Star dan Evening Star" 7779 − 5
    (8433, 8139),  # SC13C "Three White Soldiers…" 8139 − 0
    (8834, 8534),  # SC13D "Kamu tidak perlu menghafal nama." 8535 − 1
    # passage 4 (SC13D → BBRI) — then BBRI beat by beat (English line → Indonesian line)
    (9178, 8897),   # "The 8th — a red candle."          ↔ "Tanggal 8 muncul candle merah."
    (9307, 9101),   # "The next day opens even lower"     ↔ "Hari berikutnya dibuka lebih rendah,"
    (9423, 9196),   # "then buyers drive it…to 2,790"     ↔ "Lalu buyer masuk kuat,"
    (9552, 9348),   # "swallowing the entire previous day" ↔ "dan menelan seluruh body…"
    (9626, 9468),   # "Right after a run of selling."     ↔ "tepat setelah rangkaian tekanan jual"
    (9675, 9575),   # "You already know what this means." ↔ "Kamu sudah tahu artinya."
    (9740, 9683),   # "What happens next?" on screen      ↔ "Jadi, apa yang terjadi berikutnya?"
    # the countdown, number by number, on the Indonesian words' onsets
    (9788, 9763),   # "3" arrives                          ↔ "Tiga…"
    (9816, 9786),   # "2"                                  ↔ "dua…"
    (9845, 9814),   # "1"                                  ↔ "satu…"
    (9864, 9858),   # "It rose."                          ↔ "Harganya naik."
    (9890, 9900),   # "Over 10%…"                         ↔ "Lebih dari 10%…"
    (10026, 10070), # "No guarantee —"                    ↔ "Tentu tidak ada jaminan."
    (10176, 10216), # "But this?"                         ↔ "Tapi beginilah"
    (10386, 10386), # closing: "One candle is a sentence." ↔ "Satu candle adalah satu kalimat."
    (10443, 10439), # "Multiple candles are a paragraph." ↔ "Beberapa candle membentuk…"
    (10512, 10522), # "The chart is the full story."      ↔ "Seluruh chart adalah cerita…"
    (10579, 10600), # "Learn to read."                    ↔ "Belajarlah membaca ceritanya."
    (10651, 10706), # the closing's fade-out begins after "Bukan sekadar mengenali bentuk." (ends 10703)
    (10663, 10718), # …and runs its twelve frames to the end
]
ORIGINAL_FRAMES = 10663


def load_motion():
    return np.array(json.load(open(os.path.join(ROOT, "scripts/ref/ta02-motion.json")))["changed"])


def clip_frames(n):
    path = os.path.join(EXT_DIR, f"CandlestickExt_0{n}", f"CandlestickExt_0{n}.MP3")
    out = subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip()
    return path, int(np.ceil(float(out) * 30 - 1e-6))


def fill(x0, x1, L, still):
    """Picture frames [x0, x1) played over L output frames, changing only still frames."""
    xs = list(range(x0, x1))
    X = len(xs)
    if L == X:
        return xs, 0
    # still runs inside the leg; x0 itself stays (it is the anchor)
    runs, s = [], None
    for x in range(x0 + 1, x1):
        if still[x] and s is None:
            s = x
        if not still[x] and s is not None:
            runs.append((s, x)); s = None
    if s is not None:
        runs.append((s, x1))
    cap = sum(b - a for a, b in runs)
    if L > X:  # hold: repeat still frames, shared out by run length
        H = L - X
        if cap == 0:
            return xs + [x1 - 1] * H, 0
        share = [H * (b - a) / cap for a, b in runs]
        n = [int(v) for v in share]
        for i in sorted(range(len(runs)), key=lambda i: share[i] - n[i], reverse=True)[: H - sum(n)]:
            n[i] += 1
        extra = {}
        for (a, b), k in zip(runs, n):
            if k:
                extra[(a + b) // 2] = k
        out = []
        for x in xs:
            out.append(x)
            out += [x] * extra.get(x, 0)
        return out, 0
    # drop: remove still frames, shared out by run length
    D = X - L
    drop = set()
    if D <= cap:
        share = [D * (b - a) / cap for a, b in runs]
        n = [int(v) for v in share]
        for i in sorted(range(len(runs)), key=lambda i: share[i] - n[i], reverse=True)[: D - sum(n)]:
            n[i] += 1
        for (a, b), k in zip(runs, n):
            mid, span = (a + b) // 2, b - a
            pick = sorted(range(a, b), key=lambda x: abs(x - mid))[:k]
            drop.update(pick)
        moving = 0
    else:
        for a, b in runs:
            drop.update(range(a, b))
        moving = D - cap  # not enough stillness: take evenly spaced moving frames
        rest = [x for x in xs[1:] if x not in drop]
        step = len(rest) / moving
        drop.update(rest[int(i * step)] for i in range(moving))
    return [x for x in xs if x not in drop], moving


def build():
    motion = load_motion()
    still = motion <= 3
    for p in PASSAGES:
        p["path"], p["frames"] = clip_frames(p["n"])

    def T(y):  # original voice frame → output frame
        return y + sum(p["frames"] for p in PASSAGES if p["cut"] <= y)

    # Five stretches of picture — before passage 1, between each pair, after 4 —
    # each running anchor to anchor; a passage's window holds its x_out.
    anchors = sorted(ANCHORS)
    starts = [(0, 0)] + [(p["x_in"], p["cut"]) for p in PASSAGES]
    ends = [(p["x_out"], p["cut"]) for p in PASSAGES] + [anchors[-1]]
    report, xmap = [], []
    for k, ((xs_, ys_), (xe, ye)) in enumerate(zip(starts, ends)):
        pts = [(xs_, ys_)] + [a for a in anchors if xs_ < a[0] < xe] + [(xe, ye)]
        assert all(b[0] > a[0] and b[1] > a[1] for a, b in zip(pts, pts[1:])), pts
        for (xa, ya), (xb, yb) in zip(pts, pts[1:]):
            L = yb - ya
            seq, moving = fill(xa, xb, L, still)
            assert len(seq) == L, (xa, xb, L, len(seq))
            xmap += seq
            report.append((xa, xb, L, L - (xb - xa), moving))
        if k < len(PASSAGES):
            p = PASSAGES[k]
            p["at"] = len(xmap)
            xmap += [p["x_out"]] * p["frames"]
            p["end"] = len(xmap)
    assert all(b >= a for a, b in zip(xmap, xmap[1:])), "the map goes backwards"
    return xmap, len(xmap), report, T


def compress(xmap):
    """Runs of [output frame, original frame, rate]; rate 1 plays on, 0 holds."""
    segs = []  # [t0, x0, rate or None while one frame long]
    for t, x in enumerate(xmap):
        if segs:
            t0, x0, r = segs[-1]
            if r is None and x - x0 in (0, 1):
                segs[-1][2] = x - x0
                continue
            if r is not None and x == x0 + r * (t - t0):
                continue
        segs.append([t, x, None])
    return [(t, x, 1 if r is None else r) for t, x, r in segs]


def main():
    xmap, total, report, T = build()
    # sanity: every passage window starts exactly where the voice reaches its cut
    for p in PASSAGES:
        assert p["at"] == T(p["cut"]) - p["frames"], (p["n"], p["at"], T(p["cut"]))
    segs = compress(xmap)
    # verify the compressed map reproduces the full one
    def look(t):
        lo, hi = 0, len(segs) - 1
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if segs[mid][0] <= t:
                lo = mid
            else:
                hi = mid - 1
        t0, x0, r = segs[lo]
        return x0 + r * (t - t0)
    assert all(look(t) == xmap[t] for t in range(total))

    print(f"output frames {total} (original {ORIGINAL_FRAMES}); {len(segs)} map segments")
    for xa, xb, L, delta, moving in report:
        tag = f"hold {delta}" if delta > 0 else f"drop {-delta}" if delta < 0 else "as is"
        print(f"  picture {xa:5d}-{xb:5d} over {L:4d}  {tag}{'  (' + str(moving) + ' MOVING frames dropped)' if moving else ''}")
    for p in PASSAGES:
        print(f"  passage {p['n']}: voice cut {p['cut']}, {p['frames']} frames, output {p['at']}-{p['end']}, holds picture {p['x_out']}")

    # ── indoTimeline.ts ──────────────────────────────────────────────────────
    lines = [
        "/**",
        " * indoTimeline.ts — GENERATED by scripts/ta02-indo-timeline.py. Do not hand-edit:",
        " * change the anchors or passages there and run it again.",
        " *",
        " * The Indonesian cut's picture, re-timed to its own voice, with Simon's four",
        " * passages cut in. `indoFrame(t)` is the ORIGINAL frame of the film to show at",
        " * output frame t. The English composition never reads this file.",
        " */",
        f"export const INDO_TOTAL_FRAMES = {total};",
        "",
        "/** The four passages: output window [at, end), and the original frame held under it. */",
        "export const INDO_PASSAGES = [",
    ]
    for p in PASSAGES:
        lines.append(f"  {{ cut: {p['cut']}, frames: {p['frames']}, at: {p['at']}, end: {p['end']}, xOut: {p['x_out']}, xIn: {p['x_in']} }},")
    lines += [
        "] as const;",
        "",
        "/** [output frame, original frame, rate]: rate 1 plays on, rate 0 holds. */",
        "const MAP: readonly (readonly [number, number, 0 | 1])[] = [",
    ]
    row = []
    for t, x, r in segs:
        row.append(f"[{t},{x},{r}]")
        if len(row) == 8:
            lines.append("  " + ",".join(row) + ","); row = []
    if row:
        lines.append("  " + ",".join(row) + ",")
    lines += [
        "];",
        "",
        "/** The run output frame t falls in: [its first output frame, the original frame there, rate]. */",
        "export const indoSegment = (t: number): readonly [number, number, 0 | 1] => {",
        "  let lo = 0;",
        "  let hi = MAP.length - 1;",
        "  while (lo < hi) {",
        "    const mid = (lo + hi + 1) >> 1;",
        "    if (MAP[mid][0] <= t) lo = mid;",
        "    else hi = mid - 1;",
        "  }",
        "  return MAP[lo];",
        "};",
        "",
        "/** The ORIGINAL frame of the film to show at output frame t. */",
        "export const indoFrame = (t: number): number => {",
        "  const [t0, x0, rate] = indoSegment(t);",
        "  return x0 + rate * (t - t0);",
        "};",
        "",
    ]
    open(os.path.join(ROOT, "src/episodeCandlestick/data/indoTimeline.ts"), "w").write("\n".join(lines))

    # ── subtitlesIndo.ts ─────────────────────────────────────────────────────
    cues = json.load(open(os.path.join(ROOT, "scripts/ref/ta02-indo-cues.pre-extend.json")))
    for c in cues:
        for p in PASSAGES:
            assert not (c["start"] < p["cut"] < c["end"]), ("cue straddles a cut", c, p["cut"])
    out = [dict(start=T(c["start"]), end=T(c["end"]), text=c["text"]) for c in cues]
    ms = lambda s: (int(s[:2]) * 3600 + int(s[3:5]) * 60 + int(s[6:8])) * 1000 + int(s[9:12])
    for p in PASSAGES:
        srt = open(p["path"].replace(".MP3", ".srt"), encoding="utf-8-sig").read().strip().split("\n\n")
        for block in srt:
            rows = block.split("\n")
            a, b = rows[1].split(" --> ")
            out.append(dict(start=p["at"] + round(ms(a) * 0.03), end=p["at"] + round(ms(b) * 0.03), text=" ".join(rows[2:])))
    out.sort(key=lambda c: c["start"])
    for a, b in zip(out, out[1:]):
        assert a["end"] <= b["start"], ("overlap", a, b)
    changed = words_from_script(out)
    print(f"  wording from the script: {changed} cues changed from their SRT text")
    sub = [
        "/**",
        " * subtitlesIndo.ts — Indonesian burned-in cues (frames @30fps) for TA03-CandlestickIntermediate.",
        " * GENERATED by scripts/ta02-indo-timeline.py. Timing: CSI_Sub_Indo_FIXED.srt",
        " * (scripts/ref/ta02-indo-cues.pre-extend.json) re-timed around Simon's four",
        " * passages, plus the passages' own SRTs. Wording: Simon's script",
        " * (scripts/ref/ta02-indo-script.txt). Do not hand-edit.",
        " */",
        'import type { SubtitleCue } from "./subtitles";',
        "",
        "export const SUBTITLES_INDO: SubtitleCue[] = [",
    ] + [f"  {{ start: {c['start']}, end: {c['end']}, text: {json.dumps(c['text'], ensure_ascii=False)} }}," for c in out] + ["];", ""]
    open(os.path.join(ROOT, "src/episodeCandlestick/subtitlesIndo.ts"), "w").write("\n".join(sub))
    print(f"  {len(out)} cues ({len(cues)} re-timed, {len(out) - len(cues)} added); last ends {out[-1]['end']}")

    if "--audio" in sys.argv:
        build_audio(T)


def words_from_script(cues):
    """Rewrite every cue in the script's words, keeping the SRT's cue boundaries."""
    import difflib, re
    lines = [l for l in open(SCRIPT, encoding="utf-8") if l.strip() and not l.startswith("[")]
    script = " ".join(l.strip() for l in lines).replace("—", "— ").split()
    norm = lambda w: re.sub(r"[^\w%]", "", w.lower())
    words, owner = [], []
    for i, c in enumerate(cues):
        for w in c["text"].split():
            words.append(w)
            owner.append(i)
    take = [[] for _ in cues]
    sm = difflib.SequenceMatcher(None, [norm(w) for w in words], [norm(w) for w in script], autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            for k in range(i2 - i1):
                take[owner[i1 + k]].append(script[j1 + k])
        elif op == "insert":  # script words nobody speaks — e.g. a passage that was cut
            print(f"    script words not spoken, left out: {' '.join(script[j1:j2])!r}")
        else:  # replace / delete: the script's version goes to the cue holding the first word
            print(f"    SRT {' '.join(words[i1:i2])!r} -> script {' '.join(script[j1:j2])!r}")
            take[owner[i1]].extend(script[j1:j2])
    changed = 0
    for c, ws in zip(cues, take):
        assert ws, ("cue left empty", c)
        text = " ".join(ws)
        changed += text != c["text"]
        c["text"] = text
    return changed


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)


def build_audio(T):
    src = decode(os.path.join(ROOT, "public/vo-indo.pre-extend.mp3"))
    parts, prev = [], 0
    for p in PASSAGES:
        parts.append(src[prev * SPF: p["cut"] * SPF])
        clip = decode(p["path"])
        want = p["frames"] * SPF
        assert len(clip) <= want
        parts.append(np.vstack([clip, np.zeros((want - len(clip), 2), dtype=np.float32)]))
        prev = p["cut"]
    parts.append(src[prev * SPF:])
    out = np.vstack(parts)
    dst = os.path.join(ROOT, "public/vo-indo.mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                    "-c:a", "libmp3lame", "-b:a", "128k", dst], input=out.tobytes(), check=True)
    # verify: every join lines up with lag 0
    back = decode(dst)[:, 0]
    ref = out[:, 0]
    for p in PASSAGES:
        for edge in (p["at"], p["end"]):
            a = edge * SPF - SPF * 3
            seg = ref[a: a + SPF * 6]
            best = max(range(-400, 401), key=lambda lag: float(np.dot(seg, back[a + lag: a + lag + len(seg)])))
            r = np.corrcoef(seg, back[a + best: a + best + len(seg)])[0, 1] if seg.std() > 1e-5 else 1.0
            print(f"  join at output frame {edge}: lag {best} samples, r {r:.5f}")
    print(f"  voice {len(out) / SPF:.2f} frames -> {dst}")


if __name__ == "__main__":
    main()
