(function () {
  "use strict";

  var OWNER = "Piggywu981";
  var projects = window.PROJECTS || [];
  var EN = window.PROJECTS_EN || {};
  var UI = window.UI || { zh: {}, en: {} };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var state = { q: "", cat: "all", onlyLive: false };
  var boot = { api: "syncing", time: "" };
  var sync = { kind: "idle", time: "", changed: 0, missing: [] };
  var lang = readLang();

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var els = {
    liveGrid: $("#live-grid"), ownGrid: $("#own-grid"), forkGrid: $("#fork-grid"),
    ownSection: $("#own-section"), forkSection: $("#fork-section"), liveSection: $("#live-section"),
    chips: $("#chips"), search: $("#search"), onlyLive: $("#only-live"),
    bootlog: $("#bootlog"), heroStats: $("#hero-stats"),
    liveCount: $("#live-count"), ownCount: $("#own-count"), forkCount: $("#fork-count"),
    empty: $("#empty"), syncLine: $("#sync-state"),
    theme: $("#theme-toggle"), langBtn: $("#lang-toggle"), liveLabel: $("#live-label")
  };

  function readLang() {
    var saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) {}
    return saved === "zh" ? "zh" : "en";
  }

  function T() { return UI[lang] || UI.zh || {}; }

  function t(path) {
    var dicts = [T(), UI.zh, UI.en];
    for (var i = 0; i < dicts.length; i++) {
      var node = dicts[i];
      if (!node) continue;
      var ok = true;
      path.split(".").forEach(function (k) {
        if (node && Object.prototype.hasOwnProperty.call(node, k)) node = node[k];
        else ok = false;
      });
      if (ok && typeof node === "string") return node;
    }
    return "";
  }

  function fmt(str, params) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      return params && k in params ? params[k] : m;
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function repoUrl(p) { return "https://github.com/" + OWNER + "/" + p.n; }
  function slot(p) { return String(projects.indexOf(p) + 1).padStart(2, "0"); }
  function nameOf(p) { return (lang === "en" && EN[p.n] && EN[p.n].t) || p.t; }
  function descOf(p) { return (lang === "en" && EN[p.n] && EN[p.n].d) || p.d; }
  function liveCount() { return projects.filter(function (p) { return p.live; }).length; }

  function link(href, label, cls) {
    return '<a class="btn ' + (cls || "") + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(label) + "</a>";
  }

  function entryLinks(p) {
    var out = [];
    if (p.live) out.push(link(p.live, t("links.live"), "btn-live"));
    out.push(link(repoUrl(p), t("links.repo")));
    if (p.rel) out.push(link(p.rel.url, fmt(t("links.release"), { t: p.rel.tag })));
    if (p.site) out.push(link(p.site, t("links.site")));
    if (p.up) out.push(link(p.up, t("links.upstream"), "btn-up"));
    return out.join("");
  }

  function card(p) {
    var tags = [];
    if (p.l) tags.push('<span class="lang">' + esc(p.l) + "</span>");
    tags.push('<span class="cat">' + esc((T().cats || {})[p.c] || p.c) + "</span>");
    if (p.live) tags.push('<span class="live-badge">' + esc(t("badges.live")) + "</span>");
    if (p.fork) tags.push('<span class="fork-badge">' + esc(t("badges.fork")) + "</span>");
    if (p.self) tags.push('<span class="self-badge">' + esc(t("badges.self")) + "</span>");

    return '<article class="card">' +
      '<span class="slot">#' + slot(p) + "</span>" +
      '<div class="card-top"><h3>' + esc(nameOf(p)) + "</h3>" +
      '<p class="repo-name">' + esc(p.n) + "</p></div>" +
      '<p class="summary">' + esc(descOf(p)) + "</p>" +
      '<div class="tags">' + tags.join("") + "</div>" +
      '<div class="stats">' +
      '<span class="stat" data-stars="' + esc(p.n) + '">★ ' + p.s + "</span>" +
      '<span class="stat" data-updated="' + esc(p.n) + '">' + esc(t("pushed")) + " " + esc(p.p) + "</span>" +
      "</div>" +
      '<div class="links">' + entryLinks(p) + "</div>" +
      "</article>";
  }

  function liveCard(p) {
    var host = String(p.live).replace(/^https?:\/\//, "").replace(/\/$/, "");
    return '<article class="live-card">' +
      '<div class="live-head"><span class="pulse"></span> ' + esc(t("links.deploy")) +
      '<span class="slot-live"> #' + slot(p) + "</span></div>" +
      '<div class="live-body"><h3><a href="' + esc(p.live) + '" target="_blank" rel="noopener">' + esc(nameOf(p)) + "</a></h3>" +
      '<p class="repo-name">' + esc(p.n) + "</p>" +
      '<p class="summary">' + esc(descOf(p)) + "</p></div>" +
      '<div class="live-actions">' + link(p.live, t("links.open"), "btn-live") + link(repoUrl(p), t("links.repo")) + "</div>" +
      '<a class="live-url" href="' + esc(p.live) + '" target="_blank" rel="noopener">' + esc(host) + "</a>" +
      "</article>";
  }

  function matches(p) {
    if (state.onlyLive && !p.live) return false;
    if (state.cat !== "all" && p.c !== state.cat) return false;
    if (!state.q) return true;
    var en = EN[p.n] || {};
    var hay = [p.n, p.t, p.d, en.t, en.d, p.l].join(" ").toLowerCase();
    return hay.indexOf(state.q) !== -1;
  }

  var revealer = null;
  function reveal(scope) {
    var nodes = scope.querySelectorAll(".card:not(.in), .live-card:not(.in)");
    if (reduce || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(nodes, function (n) { n.classList.add("in"); });
      return;
    }
    if (!revealer) {
      revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("in");
          revealer.unobserve(en.target);
        });
      }, { rootMargin: "0px 0px 12% 0px" });
    }
    Array.prototype.forEach.call(nodes, function (n, i) {
      n.style.setProperty("--d", (i % 8) * 45 + "ms");
      revealer.observe(n);
    });
  }

  function render() {
    var list = projects.filter(matches);
    var own = list.filter(function (p) { return !p.fork; });
    var forks = list.filter(function (p) { return p.fork; });

    els.ownGrid.innerHTML = own.map(card).join("");
    els.forkGrid.innerHTML = forks.map(card).join("");
    reveal(els.ownGrid);
    reveal(els.forkGrid);

    els.ownSection.hidden = own.length === 0;
    els.forkSection.hidden = forks.length === 0;
    els.empty.hidden = list.length !== 0;
    els.ownCount.textContent = "(" + own.length + ")";
    els.forkCount.textContent = "(" + forks.length + ")";

    var filtering = state.q !== "" || state.cat !== "all" || state.onlyLive;
    els.liveSection.hidden = filtering;
    els.liveCount.textContent = filtering ? "" : "(" + liveCount() + ")";
  }

  function renderLive() {
    els.liveGrid.innerHTML = projects.filter(function (p) { return p.live; }).map(liveCard).join("");
    reveal(els.liveGrid);
  }

  function renderChips() {
    var cats = (T().cats) || {};
    var groups = { all: projects.length };
    Object.keys(cats).forEach(function (k) {
      groups[k] = projects.filter(function (p) { return p.c === k; }).length;
    });
    var html = '<button class="chip' + (state.cat === "all" ? " is-on" : "") + '" type="button" data-cat="all">' +
      esc(t("chipAll")) + " " + groups.all + "</button>";
    Object.keys(cats).forEach(function (k) {
      html += '<button class="chip' + (state.cat === k ? " is-on" : "") + '" type="button" data-cat="' + k + '">' +
        esc(cats[k]) + " " + groups[k] + "</button>";
    });
    els.chips.innerHTML = html;
  }

  els.chips.addEventListener("click", function (e) {
    var btn = e.target.closest(".chip");
    if (!btn) return;
    state.cat = btn.dataset.cat;
    $$(".chip", els.chips).forEach(function (c) { c.classList.toggle("is-on", c === btn); });
    render();
  });

  function mark(str) {
    return '<span class="' + str.cls + '">' + esc(str.text) + "</span>";
  }

  function renderBoot() {
    var apiText = boot.api === "syncing" ? t("apiState.syncing")
      : boot.api === "failed" ? t("apiState.failed")
      : fmt(t("apiState.synced"), { t: boot.time });
    var apiCls = boot.api === "synced" ? "ok" : "run";
    var toolchain = toolchainParts().map(function (p) { return p.k + (p.v ? " " + p.v : ""); }).join(" · ");

    function line(tpl, params, cls, clsText) {
      var head = "[ " + mark({ cls: cls || "ok", text: clsText || t("boot.ok") }) + " ] ";
      return head + esc(fmt(tpl, params));
    }

    els.bootlog.innerHTML = [
      line(t("boot.index"), { n: projects.length }),
      line(t("boot.deployments"), { n: liveCount() }),
      line(t("boot.forks"), { n: projects.length - ownCount() }),
      line(t("boot.toolchain"), { v: toolchain }),
      line(t("boot.api"), { v: apiText }, apiCls, apiCls === "ok" ? t("boot.ok") : t("boot.run"))
    ].join("\n");
  }

  function ownCount() { return projects.filter(function (p) { return !p.fork; }).length; }

  function renderSyncLine() {
    var m = {
      idle: t("syncLine.idle"),
      ok: fmt(t("syncLine.ok"), { t: sync.time }),
      okChanged: fmt(t("syncLine.okChanged"), { t: sync.time, n: sync.changed }),
      missing: fmt(t("syncLine.missing"), { t: sync.time, n: sync.missing.length, list: sync.missing.join("、") }),
      failed: t("syncLine.failed")
    };
    els.syncLine.textContent = m[sync.kind] || m.idle;
  }

  function countUp(el, to) {
    el.textContent = to;
    if (reduce) return;
    var start = 0, dur = 620;
    function step(ts) {
      if (!start) start = ts;
      var k = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = to;
    }
    requestAnimationFrame(step);
  }

  function setStat(key, val) {
    var el = $('[data-stat="' + key + '"]');
    if (el) countUp(el, val);
  }

  function renderHero() {
    var forks = projects.length - ownCount();
    var live = liveCount();
    var latest = projects.map(function (p) { return p.p; }).sort().pop() || "";

    setStat("total", projects.length);
    setStat("own", ownCount());
    setStat("fork", forks);
    setStat("live", live);
    els.liveLabel.textContent = fmt(t("liveLabel"), { n: live });
    els.heroStats.innerHTML = fmt(t("heroStats"), { total: projects.length, live: live, latest: esc(latest) });
  }

  function toolchainParts() {
    var m = window.META || {};
    var out = [];
    if (m.qoder) out.push({ k: "Qoder", v: m.qoder });
    if (m.agentSdk) out.push({ k: "Agent SDK", v: m.agentSdk });
    if (m.model) out.push({ k: m.model, v: m.modelVersion || "" });
    return out;
  }

  function renderToolchain() {
    var parts = toolchainParts();
    if (!parts.length) return;
    var plate = $("#toolchain");
    if (!plate) return;
    plate.textContent = "";
    var title = document.createElement("p");
    title.className = "plate-title";
    title.textContent = t("foot.toolchain");
    plate.appendChild(title);
    parts.forEach(function (p) {
      var tag = document.createElement("span");
      tag.className = "tag";
      tag.setAttribute("aria-label", p.k + (p.v ? " " + p.v : ""));
      var k = document.createElement("b");
      k.textContent = p.k;
      tag.appendChild(k);
      if (p.v) {
        var v = document.createElement("i");
        v.textContent = p.v;
        tag.appendChild(v);
      }
      plate.appendChild(tag);
    });
  }

  function applyStatic() {
    var dict = T();
    document.documentElement.lang = dict.htmlLang || "zh-CN";
    document.title = dict.docTitle || document.title;
    var meta = $('meta[name="description"]');
    if (meta) meta.setAttribute("content", dict.docDesc || "");

    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });
    $$("[data-i18n-al]").forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAl)); });

    els.langBtn.textContent = dict.langBtn;
    els.langBtn.setAttribute("lang", lang === "zh" ? "en" : "zh");
    els.langBtn.setAttribute("aria-label", lang === "zh" ? "切换到英文" : "Switch to Chinese");
  }

  function renderAll() {
    applyStatic();
    renderChips();
    renderLive();
    renderHero();
    renderBoot();
    renderToolchain();
    renderSyncLine();
    render();
  }

  function trackSpot() {
    [els.ownGrid, els.forkGrid, els.liveGrid].forEach(function (grid) {
      grid.addEventListener("pointermove", function (e) {
        var cardEl = e.target.closest(".card, .live-card");
        if (!cardEl) return;
        var r = cardEl.getBoundingClientRect();
        cardEl.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        cardEl.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      });
    });
  }

  function syncFromApi() {
    fetch("https://api.github.com/users/" + OWNER + "/repos?per_page=100&type=public&sort=updated", {
      headers: { Accept: "application/vnd.github+json" }
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (repos) {
      var known = {};
      projects.forEach(function (p) { known[p.n] = p; });

      var changed = 0;
      repos.forEach(function (r) {
        var p = known[r.name];
        if (!p) return;
        if (r.stargazers_count !== p.s) {
          p.s = r.stargazers_count;
          var node = $('[data-stars="' + CSS.escape(r.name) + '"]');
          if (node) node.textContent = "★ " + r.stargazers_count;
          changed++;
        }
        var d = (r.pushed_at || "").slice(0, 10);
        if (d && d !== p.p) {
          p.p = d;
          var u = $('[data-updated="' + CSS.escape(r.name) + '"]');
          if (u) u.textContent = t("pushed") + " " + d;
          changed++;
        }
      });

      var missing = repos.filter(function (r) { return !known[r.name]; }).map(function (r) { return r.name; });
      boot = { api: "synced", time: new Date().toTimeString().slice(0, 5) };
      sync = missing.length
        ? { kind: "missing", time: boot.time, changed: changed, missing: missing }
        : { kind: changed ? "okChanged" : "ok", time: boot.time, changed: changed, missing: [] };
      renderBoot();
      renderSyncLine();
    }).catch(function () {
      boot = { api: "failed", time: "" };
      sync = { kind: "failed", time: "", changed: 0, missing: [] };
      renderBoot();
      renderSyncLine();
    });
  }

  function initToggles() {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    if (saved) document.documentElement.dataset.theme = saved;

    els.theme.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
    });

    els.langBtn.addEventListener("click", function () {
      lang = lang === "zh" ? "en" : "zh";
      try { localStorage.setItem("lang", lang); } catch (e) {}
      renderAll();
    });
  }

  if (!reduce) document.documentElement.classList.add("anim");

  renderAll();
  initToggles();
  trackSpot();

  els.search.addEventListener("input", function () {
    state.q = els.search.value.trim().toLowerCase();
    render();
  });
  els.onlyLive.addEventListener("change", function () {
    state.onlyLive = els.onlyLive.checked;
    render();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== els.search) {
      e.preventDefault();
      els.search.focus();
    }
  });

  syncFromApi();
})();
