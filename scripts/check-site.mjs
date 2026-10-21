import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve("北建奶龙大学");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const errors = [];

const requiredIds = ["home", "about", "colleges", "news", "notices", "research", "campus", "admission", "faq"];
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) errors.push(`missing id: ${id}`);
}

const requiredFiles = ["styles.css", "app.js", "assets/card.js", "assets/seal.svg"];
for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) errors.push(`missing file: ${file}`);
}

const images = [...html.matchAll(/src="(assets\/images\/[^"]+)"/g)].map((m) => m[1]);
for (const image of new Set(images)) {
  if (!existsSync(resolve(root, image))) errors.push(`missing image: ${image}`);
}

const external = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)]
  .map((m) => m[1])
  .filter((url) => !url.startsWith("https://www.bucea.edu.cn/") && !url.startsWith("https://piggywu981.github.io/"));
if (external.length) errors.push(`unexpected external assets: ${external.join(", ")}`);

for (const token of ["实事求是", "精益求精", "1907", "展览馆路 1 号", "永源路 15 号", "非官方"]) {
  if (!html.includes(token)) errors.push(`missing required content: ${token}`);
}

const counts = [
  ['class="college-card"', 6],
  ['class="news-card"', 6],
  ["<li><time datetime=", 3],
  ['class="event"', 2],
  ['<dialog class="dlg"', 3],
  ['class="filter"', 4]
];
for (const [needle, expected] of counts) {
  const actual = html.split(needle).length - 1;
  if (actual !== expected) errors.push(`expected ${expected} × ${needle}, found ${actual}`);
}

if (/<img\b(?![^>]*\balt=)/.test(html)) errors.push("found img without alt");
if (/data-college=/.test(html)) errors.push("found dead data-college control");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("check-site: OK");
