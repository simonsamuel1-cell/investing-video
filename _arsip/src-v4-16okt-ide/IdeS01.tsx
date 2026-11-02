import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { VO_OFFSET } from './offset';
import { Babak } from './Babak';
import { VO_IDE } from './vo';
import { BATAS } from './batas';

/**
 * IDE VISUAL Scene 01 — komposisi terpisah, komposisi utama belum disentuh.
 * Memakai Babak (semua scene, waktu global) supaya ekor Scene 01 sesudah f2829 — saat Scene 02 mengambil alih
 * lingkaran bab 01 — tampil sama persis dengan Ide-S02.
 */
/** AKHIR Scene 01 = arahan Simon: "scene 1 seharusnya berakhir di menit 00:47.00" (f2820) — sebelum suara Scene 02 masuk,
 *  dan peta bab TIDAK keluar/pudar di Scene 01 (animasi keluarnya milik Scene 02, mulai f2829). */
export const S01_LEN = BATAS.s1Akhir;
export const IdeS01: React.FC = () => (
  <>
    <Babak vo={false} />
    {/* VO dipotong tepat di batas scene (scripts/potong-vo.py) */}
    <Sequence from={VO_OFFSET} layout="none"><Audio src={staticFile(VO_IDE('S01'))} /></Sequence>
  </>);
