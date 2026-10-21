const test = require("node:test");
const assert = require("node:assert/strict");
const card = require("../北建奶龙大学/assets/card.js");

test("escapeXml escapes five XML characters", () => {
  assert.equal(card.escapeXml(`<&>"'`), "&lt;&amp;&gt;&quot;&apos;");
});

test("normalizeNickname rejects empty and overlong values", () => {
  assert.deepEqual(card.normalizeNickname("   "), { ok: false, error: "请填写昵称" });
  assert.deepEqual(card.normalizeNickname("一二三四五六七八九十一二三"), { ok: false, error: "昵称最多 12 个字" });
});

test("normalizeNickname trims and accepts 12 characters", () => {
  assert.deepEqual(card.normalizeNickname("  奶龙同学  "), { ok: true, value: "奶龙同学" });
  assert.equal(card.normalizeNickname("一二三四五六七八九十一二").ok, true);
});

test("makeSerial formats YYMMDD and four digits", () => {
  assert.equal(card.makeSerial(new Date(2026, 9, 19), [1, 2, 3, 4]), "BNLU-261019-1234");
});

test("buildCardSvg contains escaped nickname and serial", () => {
  const svg = card.buildCardSvg({
    nickname: "<奶龙>",
    college: "建筑与城市规划学院",
    date: "2026-10-19",
    serial: "BNLU-261019-0001"
  });
  assert.match(svg, /&lt;奶龙&gt;/);
  assert.match(svg, /BNLU-261019-0001/);
  assert.match(svg, /建筑与城市规划学院/);
  assert.doesNotMatch(svg, /<奶龙>/);
});

test("makeSerial pads single-digit month and day", () => {
  assert.equal(card.makeSerial(new Date(2026, 0, 5), [9, 8, 7, 6]), "BNLU-260105-9876");
});

test("normalizeNickname counts emoji as one character", () => {
  assert.equal(card.normalizeNickname("🐉🐉🐉🐉🐉🐉🐉🐉🐉🐉🐉🐉").ok, true);
  assert.equal(card.normalizeNickname("🐉🐉🐉🐉🐉🐉🐉🐉🐉🐉🐉🐉🐉").ok, false);
});
