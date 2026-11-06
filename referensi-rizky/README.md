# Referensi: video Rizky

Lima proyek Remotion dari `rizkysurya-max`, digabung ke `Module01_-_Technical_Analysis` pada 4 Nov 2026 supaya bisa
ditunjuk langsung sebagai referensi (Simon: "biar next time aku bisa tunjuk referensi langsung").

| Folder | Video | Di Studio (folder "Rizky") |
|---|---|---|
| `Investing-101-V02` | Investment Instruments | `Rizky-InvestmentInstruments` |
| `Investing-101-V03` | Tiga Jenis Uang | `Rizky-TigaJenisUang` |
| `Investing-101-V05` | Jalur Bertumbuh | `Rizky-JalurBertumbuh` |
| `Investing-101-V06` | Kesalahan yang Paling Sering Dilakukan Investor | `Rizky-KesalahanInvestor` |
| `Value-Investing-V01` | Apa Itu Value Investing | `Rizky-ApaItuValueInvesting` |

Tiap folder adalah proyeknya sendiri, dengan `package.json` dan `src/core` sendiri, dan isinya tidak diubah. Mereka tampil
di Studio kita lewat `src/RizkyComps.jsx`: `_studio/` mengarahkan impor `remotion` dan `staticFile` tiap proyek ke
`public/rizky/` (symlink ke folder ini). `tsconfig.json` mengecualikan folder ini. File `.wav` VO-nya tidak ada karena
melebihi batas 100 MB GitHub, jadi videonya tanpa suara. Branch aslinya tetap ada di GitHub.
