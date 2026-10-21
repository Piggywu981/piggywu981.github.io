(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BNLUCard = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var MAX_NICKNAME = 12;

  function escapeXml(value) {
    return String(value).replace(/[<>&"']/g, function (ch) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[ch];
    });
  }

  function normalizeNickname(raw) {
    var nickname = String(raw == null ? "" : raw).trim();
    if (!nickname) return { ok: false, error: "请填写昵称" };
    if (Array.from(nickname).length > MAX_NICKNAME) {
      return { ok: false, error: "昵称最多 12 个字" };
    }
    return { ok: true, value: nickname };
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function makeSerial(date, randomBytes) {
    var d = date || new Date();
    var ymd = String(d.getFullYear()).slice(-2) + pad(d.getMonth() + 1) + pad(d.getDate());
    var bytes = randomBytes || Array.from(crypto.getRandomValues(new Uint8Array(4)));
    var digits = bytes.map(function (n) { return n % 10; }).join("");
    return "BNLU-" + ymd + "-" + digits;
  }

  function buildCardSvg(input) {
    var nickname = escapeXml(input.nickname);
    var college = escapeXml(input.college);
    var date = escapeXml(input.date);
    var serial = escapeXml(input.serial);
    return [
      '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="630" viewBox="0 0 1000 630">',
      '<rect width="1000" height="630" fill="#4A2568"/>',
      '<rect x="26" y="26" width="948" height="578" fill="none" stroke="#F2C14E" stroke-width="2"/>',
      '<circle cx="110" cy="110" r="46" fill="#F2C14E"/>',
      '<circle cx="110" cy="110" r="36" fill="#4A2568"/>',
      '<text x="110" y="120" text-anchor="middle" font-family="serif" font-size="34" fill="#FFFFFF">奶</text>',
      '<text x="930" y="84" text-anchor="end" font-family="serif" font-size="28" fill="#FFFFFF" opacity=".95">北建奶龙大学</text>',
      '<text x="930" y="108" text-anchor="end" font-family="serif" font-size="13" fill="#F2C14E" letter-spacing="2">BEIJIAN NAILONG UNIVERSITY</text>',
      '<text x="930" y="130" text-anchor="end" font-family="sans-serif" font-size="11" fill="#FFFFFF" opacity=".6" letter-spacing="1">ADMISSION SOUVENIR</text>',
      '<text x="70" y="250" font-family="serif" font-size="46" fill="#FFFFFF">入学纪念卡</text>',
      '<text x="72" y="292" font-family="sans-serif" font-size="16" fill="#F2C14E" letter-spacing="4">A LITTLE LETTER TO YOUR FUTURE</text>',
      '<line x1="70" y1="330" x2="930" y2="330" stroke="#FFFFFF" stroke-opacity=".28"/>',
      '<text x="70" y="382" font-family="sans-serif" font-size="14" fill="#FFFFFF" opacity=".65">亲爱的</text>',
      '<text x="70" y="446" font-family="serif" font-size="52" fill="#F2C14E">' + nickname + '</text>',
      '<text x="70" y="490" font-family="sans-serif" font-size="16" fill="#FFFFFF" opacity=".78">' + college + '</text>',
      '<text x="70" y="548" font-family="sans-serif" font-size="14" fill="#FFFFFF" opacity=".6">' + date + ' · ' + serial + '</text>',
      '<text x="930" y="548" text-anchor="end" font-family="sans-serif" font-size="13" fill="#FFFFFF" opacity=".55">非录取凭证 · 仅供娱乐纪念</text>',
      '</svg>'
    ].join("");
  }

  return {
    MAX_NICKNAME: MAX_NICKNAME,
    escapeXml: escapeXml,
    normalizeNickname: normalizeNickname,
    makeSerial: makeSerial,
    buildCardSvg: buildCardSvg
  };
});
