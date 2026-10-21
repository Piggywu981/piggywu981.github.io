(function () {
  "use strict";

  var lastTrigger = null;

  function openDialog(id, trigger) {
    var dialog = document.getElementById(id);
    if (!dialog || typeof dialog.showModal !== "function") return;
    lastTrigger = trigger || null;
    dialog.showModal();
    var close = dialog.querySelector(".dlg-close");
    if (close) close.focus();
  }

  function closeDialog(dialog) {
    if (dialog && dialog.open) dialog.close();
  }

  function initDialogs() {
    document.querySelectorAll("[data-dialog]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openDialog(trigger.getAttribute("data-dialog"), trigger);
      });
    });

    document.querySelectorAll("dialog.dlg").forEach(function (dialog) {
      dialog.querySelectorAll(".dlg-close").forEach(function (button) {
        button.addEventListener("click", function () { closeDialog(dialog); });
      });
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) closeDialog(dialog);
      });
      dialog.addEventListener("close", function () {
        if (lastTrigger) lastTrigger.focus();
      });
    });
  }

  function initCard() {
    var form = document.getElementById("card-form");
    var preview = document.getElementById("card-preview");
    var error = document.getElementById("card-error");
    var download = document.getElementById("download-card");
    if (!form || !preview || !error || !download || !window.BNLUCard) return;

    var currentSvg = "";
    var currentName = "nailong-card.svg";

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      error.textContent = "";
      var result = window.BNLUCard.normalizeNickname(document.getElementById("nickname").value);
      if (!result.ok) {
        error.textContent = result.error;
        currentSvg = "";
        download.disabled = true;
        preview.innerHTML = '<p class="card-placeholder">填写昵称并点击「生成纪念卡」，这里会出现你的卡片。</p>';
        return;
      }
      var college = document.getElementById("college").value;
      var now = new Date();
      var serial = window.BNLUCard.makeSerial(now);
      var date = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
      currentSvg = window.BNLUCard.buildCardSvg({ nickname: result.value, college: college, date: date, serial: serial });
      currentName = "北建奶龙大学-入学纪念卡-" + serial + ".svg";
      preview.innerHTML = currentSvg;
      download.disabled = false;
    });

    download.addEventListener("click", function () {
      if (!currentSvg) return;
      var blob = new Blob([currentSvg], { type: "image/svg+xml;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = currentName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }

  function initNewsFilter() {
    var buttons = Array.from(document.querySelectorAll(".filter"));
    var cards = Array.from(document.querySelectorAll(".news-card"));
    var status = document.querySelector(".filter-status");
    if (!buttons.length || !cards.length) return;

    function apply(filter) {
      var visible = 0;
      cards.forEach(function (card) {
        var match = filter === "all" || card.getAttribute("data-category") === filter;
        card.hidden = !match;
        if (match) visible += 1;
      });
      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.getAttribute("data-filter") === filter));
      });
      if (status) status.textContent = "共 " + visible + " 条";
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        apply(button.getAttribute("data-filter"));
      });
    });
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    function closeMenu() {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    var mq = window.matchMedia("(max-width: 860px)");
    var onChange = function (event) { if (!event.matches) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  function initBackToTop() {
    var button = document.getElementById("back-to-top");
    if (!button) return;
    function update() { button.hidden = window.scrollY < 600; }
    window.addEventListener("scroll", update, { passive: true });
    update();
    button.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  function initSectionSpy() {
    var links = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
    var sections = links.map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    }).filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.setAttribute("aria-current", String(link.getAttribute("href") === "#" + entry.target.id));
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function init() {
    initDialogs();
    initCard();
    initNewsFilter();
    initNav();
    initBackToTop();
    initSectionSpy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
