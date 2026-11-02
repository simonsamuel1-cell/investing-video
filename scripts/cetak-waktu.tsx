// cetak waktu kata (T) tiap scene + BATAS → JSON (alat QA: still di dalam jendela beat). pakai: node scripts/cetak-waktu.mjs
import { S01_T } from '../src/s01/Scene01';
import { S02_T } from '../src/s02/Scene02';
import { S03_T } from '../src/s03/Scene03';
import { S04_T } from '../src/s04/Scene04';
import { S05_T } from '../src/s05/Scene05';
import { S06_T } from '../src/s06/Scene06';
import { S07_T } from '../src/s07/Scene07';
import { S08_T } from '../src/s08/Scene08';
import { BATAS } from '../src/batas';
console.log(JSON.stringify({ BATAS, S01: S01_T, S02: S02_T, S03: S03_T, S04: S04_T, S05: S05_T, S06: S06_T, S07: S07_T, S08: S08_T }));
