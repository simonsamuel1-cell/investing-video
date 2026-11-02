import { VO_OFFSET } from './offset';
/**
 * INTRO & OUTRO (Simon 30 Okt malam: "masukan intro dan outronya"):
 *  · intro = 000. BG Video/007. Intro App/Video 01 - Apa Itu Value Investing?.mp4 (H.264 1920×1080 60 fps, 240 f, latar #FDFDFD) → public/intro/intro-vi01.mp4,
 *    frame 0–239; isi video & VO mulai sesudahnya (VO_OFFSET = INTRO_N).
 *  · outro = 000. BG Video/005. Intro Outro TA/Outro 2.mov (QuickTime Animation ber-alfa 240 f — dekoder qtrle tidak ada di ffmpeg Remotion) → ditumpuk di
 *    atas putih (H.264 bt709 rentang TV → terdekode #FDFDFD = latar intro, terukur) jadi public/intro/outro-2.mp4, mulai di TOTAL (akhir VO + ekor 30 f).
 */
export const INTRO_N = 240;
export const OUTRO_N = 240;
export const LATAR_INTRO = '#FDFDFD';
if (VO_OFFSET !== INTRO_N) throw new Error(`VO_OFFSET (${VO_OFFSET}) harus = INTRO_N (${INTRO_N})`);
