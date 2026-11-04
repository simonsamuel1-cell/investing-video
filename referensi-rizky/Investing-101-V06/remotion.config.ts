import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

// AAC PRIMING (28 Sep, arahan Simon "perbaiki itu"): Remotion mengodekan audio campuran ke ADTS (.aac) —
// wadah yang tidak bisa menyimpan jeda encoder — lalu menyalinnya ke mp4 dengan edit list yang tidak melewati
// apa pun. Akibatnya SEMUA pemutar mendengar suara 2048 sampel (42,7 ms ≈ 2,6 frame @60fps) terlambat dari
// gambar — terukur di render Studio 16:49 (out/video10.mp4) dengan dekoder ffmpeg DAN Apple. Geser trek AAC
// mundur 2048 sampel -> muxer menulis edit list yang melewati priming. Resep yang sama terbukti di V04 S&R.
// Berlaku untuk CLI dan tombol Render Studio (Studio harus DIJALANKAN ULANG supaya config ini terbaca).
Config.overrideFfmpegCommand(({ type, args }) => {
  if (type !== "stitcher") return args;
  const i = args.findIndex((a, k) => a === "-i" && String(args[k + 1]).endsWith(".aac"));
  if (i < 0) return args;
  return [...args.slice(0, i), "-itsoffset", String(-2048 / 48000), ...args.slice(i)];
});
