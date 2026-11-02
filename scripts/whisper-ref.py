"""Transkripsi rujukan (faster-whisper small) → sync/vo-words.whisper-small.json.
Hanya dipakai align-forced.py sebagai JANGKAR KASAR (kata → potongan audio yang benar) dan untuk
mengecek bahwa VO membaca naskah apa adanya; waktu akhirnya ditentukan forced alignment.
(Salinan metode Video 02 · instruments-episode)"""
import json, pathlib
from faster_whisper import WhisperModel
ROOT = pathlib.Path(__file__).resolve().parent.parent
m = WhisperModel("small", device="cpu", compute_type="int8")
segs, _ = m.transcribe(str(ROOT / "sync" / "_work16k.wav"), language="id", word_timestamps=True, beam_size=5)
words = [{"w": w.word.strip(), "a": round(w.start, 3), "b": round(w.end, 3)} for s in segs for w in s.words]
(ROOT / "sync" / "vo-words.whisper-small.json").write_text(json.dumps({"words": words}, ensure_ascii=False))
print(len(words), "kata")
