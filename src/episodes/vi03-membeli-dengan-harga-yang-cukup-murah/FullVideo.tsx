/**
 * VI03 finished: Intro ("Value Investing" / "Membeli dengan Harga yang Cukup Murah"), the episode, Outro, and the looped
 * bed made from Simon's Background Music.mp3 (scripts/vi/bgm-loop.py) — core/EpisodeWrap. The "video selanjutnya" line is
 * in this VO's Scene 08, so there is no separate next-video ending.
 */
import { EpisodeWrap, fullFrames } from "../../core";
import type { IntroTitleStyle } from "../../core";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

/** the intro title's face (Simon 19 Nov, after seeing it beside Plus Jakarta Sans: Montserrat, both lines 44 px) */
const { fontFamily: MONTSERRAT } = loadMontserrat("normal", { weights: ["400", "700"] });
import { MembeliCukupMurahComposition, VI03_FRAMES } from "./Composition";

/** The BGM switch. Simon turns it on or off; the bed's file is never touched. */
const BGM: boolean = true;
/** The bed 10 dB down (Simon 17 Nov: "bgm nya turunin 10 db … peaknya"): its peak −30.1 → −40.1 dBFS. The file is untouched. */
const BGM_GAIN_DB = -10;

export const VI03_FULL_FRAMES = fullFrames(VI03_FRAMES, 60);
/** The intro's two lines (Simon 19 Nov: "Value Investingnya buat all caps dan bold. Sub judul nya buat 4 px lebih kecil dan
 * italic", then "sub judul buat jadi 48 px dan 400 weight", then "reguler aja, lalu sub judul geser turun 6 px", then Montserrat
 * with "keduanya dibuat 44 px", then "subjudul nya yang jadi 54 px dan bold, sedangkan value investingnya jadi reguler weight"):
 * then "weightnya ditukar lagi", then "character spacing 10" (read as 10 % of the size; later cancelled): the series in capitals, 44 px / 700,
 * 0.1 em apart; the episode title 54 px / 400, 6 px lower — then "sub judul geser naik 4 px, dan gedein font 2 px", then 2 px more: 58 px, 2 px
 * lower than the shared place. */
const TITLE_STYLE: [IntroTitleStyle, IntroTitleStyle] = [
  { fontFamily: MONTSERRAT, fontSize: 42, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" },
  { fontFamily: MONTSERRAT, fontSize: 58, fontWeight: 400, dy: 2 },
];
/**
 * ALTERNATIVE, not used in VI03 (Simon 19 Nov: "kalo di kasih textbox kayak di 2660" → "bagus juga, widthnya tambahin 40 px" →
 * "sementara ini jadi alternatif dulu, kunci untuk kode video selanjutnya aja"): the two lines in a text box like SC02 quote
 * card. Pass it as EpisodeWrap `titleBox` to use it.
 */
export const TITLE_BOX_ALT = { w: 1380, h: 240 };
export const MembeliCukupMurahFull = () => (
  <EpisodeWrap title={["Value Investing", "Membeli dengan Harga yang Cukup Murah"]} titleStyle={TITLE_STYLE} frames={VI03_FRAMES} name="VI03 Membeli dengan Harga yang Cukup Murah" bgm={BGM} bgmSrc="bgm/background-music-bed.mp3" bgmGainDb={BGM_GAIN_DB}>
    <MembeliCukupMurahComposition />
  </EpisodeWrap>
);
