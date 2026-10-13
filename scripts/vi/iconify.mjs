#!/usr/bin/env node
/**
 * iconify.mjs — icons from Iconify (200k+ open icons, no key) before anything is generated.
 *
 *   node scripts/vi/iconify.mjs search "piggy bank" [--style duotone|color|line] [--limit 24]
 *   node scripts/vi/iconify.mjs get ph:piggy-bank-duotone public/icons/vi02 [--color "#5F4DEE"] [--name piggy-green]
 *
 * Only sets whose licence needs NO attribution are offered (MIT, ISC, Apache-2.0, CC0, OFL…) — CC BY sets
 * would oblige a credit on screen. Simon: "Kalau bisa dari iconify, ambil dari iconify dulu. Kalau iconify
 * tidak ada icon yang mewakili dan kamu tidak punya source lain, pakai chatgpt."
 * `get` writes the SVG with `currentColor` set to --color (default the theme indigo), so a monochrome or
 * duotone icon lands already in the episode's hue; multicolour sets keep their own colours.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const API = "https://api.iconify.design";
const FREE = /^(MIT|ISC|Apache-2\.0|CC0-1\.0|OFL-1\.1|BSD-2-Clause|BSD-3-Clause|Unlicense)$/;
/** Sets that read as flat / duotone / colour and suit the VI references, tried first. */
const PREFER = {
  duotone: ["ph", "solar", "iconamoon", "majesticons", "humbleicons", "hugeicons"],
  color: ["fluent-color", "flat-color-icons", "fluent-emoji-flat", "noto", "logos"],
  line: ["lucide", "tabler", "ph", "iconoir", "mingcute"],
};

const [cmd, ...rest] = process.argv.slice(2);
const opt = (k, d) => {
  const i = rest.indexOf(`--${k}`);
  return i >= 0 ? rest[i + 1] : d;
};

const licences = async (prefixes) => {
  const r = await fetch(`${API}/collections?prefixes=${prefixes.join(",")}`);
  return r.json();
};

if (cmd === "search") {
  const q = rest[0];
  const style = opt("style", "duotone");
  const limit = Number(opt("limit", 24));
  const r = await (await fetch(`${API}/search?query=${encodeURIComponent(q)}&limit=999`)).json();
  const icons = r.icons ?? [];
  const meta = await licences([...new Set(icons.map((i) => i.split(":")[0]))]);
  const ok = icons.filter((i) => FREE.test(meta[i.split(":")[0]]?.license?.spdx ?? ""));
  const rank = (i) => {
    const p = i.split(":")[0];
    const k = (PREFER[style] ?? []).indexOf(p);
    const flavour = style === "duotone" && /duotone|bulk/.test(i) ? -100 : 0;
    return (k < 0 ? 50 : k) + flavour;
  };
  ok.sort((a, b) => rank(a) - rank(b));
  for (const i of ok.slice(0, limit)) console.log(`${i}\t${meta[i.split(":")[0]].license.spdx}\thttps://api.iconify.design/${i.replace(":", "/")}.svg`);
  if (!ok.length) console.log("no attribution-free icon — fall back to ChatGPT");
} else if (cmd === "get") {
  const [id, dir] = rest;
  const color = opt("color", "#5F4DEE");
  const [prefix, name] = id.split(":");
  const svg = await (await fetch(`${API}/${prefix}/${name}.svg?height=auto`)).text();
  mkdirSync(dir, { recursive: true });
  /* --name: the same icon in two colours needs two file names */
  const out = join(dir, `${opt("name", `${prefix}-${name}`)}.svg`);
  writeFileSync(out, svg.replaceAll("currentColor", color));
  console.log(out);
} else {
  console.log("usage: search <query> [--style duotone|color|line] | get <prefix:name> <dir> [--color #hex]");
}
