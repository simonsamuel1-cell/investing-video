# Thumbnail — Technical Analysis

Thumbnail YouTube 1920×1080 untuk lima video seri Technical Analysis.

| Lesson | Judul | Berkas |
|---|---|---|
| 02 | Candlestick Basics | `Thumbnail - Candlestick.svg` |
| 04 | Support & Resistance | `Thumbnail - Support & Resistance.svg` |
| 06 | Chart Pattern | `Thumbnail - Chart Pattern.svg` |
| 08 | RSI, MACD & Stochastic | `Thumbnail - Oscillator.svg` |
| 10 | Multi-Timeframe & Confluence | `Thumbnail - Multi-Timeframe & Confluence.svg` |

Pratinjau PNG ada di `Pratinjau PNG/`.

## Aturan

- **Layout:** mengikuti thumbnail Support & Resistance yang diedit di Illustrator: pil seri, judul, garis bawah turkis, logo Tuntun, dan kartu chart putih.
- **Latar:** `_latar/1.jpg` (ungu brand + kisi). `_latar/Background_*.png` adalah opsi latar lain yang tidak dipakai.
- **Judul:** 100 px, Plus Jakarta Sans ExtraBold. Teks tetap hidup (tidak di-outline), jadi bisa diedit di Illustrator.
- **Kartu chart:** dilebarkan ke kiri bila judulnya pendek, 2 / 1 / 0 blok kisi (1 blok = 84 px), dengan jarak minimal 80 px dari judul.
- **Isi chart:** memakai chart ilustrasi yang tampil di video masing-masing, bukan data saham riil.

| Lesson | Sumber chart di video |
|---|---|
| 02 | Chart pembuka video + candle cerita (O 500 · H 550 · L 460 · C 510) |
| 04 | Scene SC11: zona 5.180–5.240 berganti peran dari resistance menjadi support (34 dari 44 lilin) |
| 06 | Scene SC03: Ascending Triangle (vektor Illustrator) |
| 08 | Seri ilustrasi `illus.ts` bar 96–216, ditambah RSI (14), Stochastic (14,3,3), dan MACD (12,26,9) |
| 10 | Seri ilustrasi `v10/illus.ts`, 30 bar terakhir Weekly › Daily › 1 Hour |

## Membuat ulang

```bash
cd _generator
python3 build_thumbs.py             # semua; atau: python3 build_thumbs.py 04 08
node svg2png.mjs "../Thumbnail - Oscillator.svg" "../Pratinjau PNG/Oscillator.png"
```

Generator membaca data chart dari folder proyek video di disk (`022. Technical Analysis/Video 0x …`), yang **tidak** ikut di branch ini. Kebutuhan lain:

- Python 3 + Pillow
- font Plus Jakarta Sans di `~/Library/Fonts`
- Google Chrome (untuk `svg2png.mjs`)

`_generator/data_illus02.json` dan `_generator/data_illus10.json` adalah salinan data ilustrasi video 02 dan 10 yang sudah diekspor.

## Arsip

- `_generator/arsip_sr_simon/` — file Support & Resistance asli dari Illustrator (chart BMRI, judul 132 px), juga sumber logo dan pil seri.
- `_generator/arsip_v1`, `arsip_v2`, `arsip_v3` — versi sebelumnya.
- `_generator/PINDAH-20nov.txt` — catatan pemindahan berkas ke folder ini.
