// 中英双语资源。projects.js 里的中文标题/说明是基准，PROJECTS_EN 提供英文对照；
// 缺英文条目的项目会回落显示中文，不会渲染成空白。
window.UI = {
  zh: {
    htmlLang: "zh-CN",
    docTitle: "Piggywu981 · 项目入口",
    docDesc: "Piggywu981 的全部公开项目入口：在线演示、源码与下载地址。",
    langBtn: "EN",
    themeBtn: "◐ 主题",
    themeBtnAl: "切换深浅色主题",
    github: "GitHub 主页",
    metaLine: "Beijing, China · github.com/Piggywu981",
    cats: { web: "网页应用", sim: "卡车模拟自动驾驶", img: "图像处理", auto: "自动化与辅助" },
    chipAll: "全部",
    sections: {
      live: "在线演示 · 点开即用",
      own: "自建项目",
      fork: "FORK 中转"
    },
    forkNote: "// 他人项目的复刻仓库，仅作备份或本地改动；入口同时给出上游地址。",
    searchPh: "grep 项目名 / 说明 / 语言　（按 / 聚焦）",
    searchAl: "搜索项目",
    onlyLive: "只看在线入口",
    filterAl: "按分类筛选",
    toolbarAl: "筛选",
    readoutTitle: "◤ 读数 ◢",
    rd: { total: "公开仓库", own: "自建", fork: "Fork", live: "在线入口" },
    liveLabel: "{n} 在线",
    panelFootColor: "显示色",
    heroStats: "<strong>{total}</strong> 个公开仓库；其中 <strong>{live}</strong> 个已部署到 GitHub Pages，点卡片上的入口即可直达。最近一次推送：{latest}。",
    boot: {
      ok: "ok",
      run: "··",
      index: "index.json ......... {n} 条仓库记录",
      deployments: "deployments ........ {n} 个可直接访问的在线入口",
      forks: "fork mirrors ....... {n} 个复刻仓库（已分区）",
      toolchain: "toolchain .......... {v}",
      api: "github api ......... {v}"
    },
    apiState: { syncing: "同步中", synced: "已同步 {t}", failed: "限流/离线 · 用内置索引" },
    syncLine: {
      idle: "项目数据内置于页面；打开时会尝试从 GitHub API 同步 star 数与更新时间。",
      ok: "已与 GitHub 同步 {t}，数据一致。",
      okChanged: "已与 GitHub 同步 {t}，刷新了 {n} 项数据。",
      missing: "已与 GitHub 同步 {t}，有 {n} 个新仓库尚未收录：{list}。",
      failed: "未能连接 GitHub API（限流或离线），当前展示内置数据。"
    },
    empty: "没有匹配的项目，换个关键词试试。",
    links: { live: "在线演示 ▸", repo: "源码", release: "Release {t}", site: "项目主页", upstream: "上游 ↗", open: "打开 ▸", deploy: "在线部署", allRepos: "全部仓库", top: "回到顶部入口" },
    badges: { live: "● 在线", fork: "复刻", self: "本站" },
    pushed: "推送",
    foot: { toolchain: "制作工具", syncAl: "本页制作工具与模型版本" }
  },
  en: {
    htmlLang: "en",
    docTitle: "Piggywu981 · Project Index",
    docDesc: "Every public project by Piggywu981 in one place: live demos, source and downloads.",
    langBtn: "中文",
    themeBtn: "◐ Theme",
    themeBtnAl: "Toggle light or dark theme",
    github: "GitHub profile",
    metaLine: "Beijing, China · github.com/Piggywu981",
    cats: { web: "Web apps", sim: "Truck sim / driving", img: "Image tools", auto: "Automation" },
    chipAll: "ALL",
    sections: {
      live: "Live demos · one click",
      own: "Own projects",
      fork: "Fork mirrors"
    },
    forkNote: "// Mirrors of other people's repositories, kept for backup or local changes; upstream links included.",
    searchPh: "grep name / summary / language　(press / to focus)",
    searchAl: "Search projects",
    onlyLive: "Live only",
    filterAl: "Filter by category",
    toolbarAl: "Filters",
    readoutTitle: "◤ READOUT ◢",
    rd: { total: "public repos", own: "own", fork: "fork", live: "live" },
    liveLabel: "{n} LIVE",
    panelFootColor: "DISPLAY",
    heroStats: "<strong>{total}</strong> public repositories; <strong>{live}</strong> of them are deployed on GitHub Pages and reachable straight from the cards. Latest push: {latest}.",
    boot: {
      ok: "ok",
      run: "··",
      index: "index.json ......... {n} repo entries",
      deployments: "deployments ........ {n} directly reachable live demos",
      forks: "fork mirrors ....... {n} mirrors (separate section)",
      toolchain: "toolchain .......... {v}",
      api: "github api ......... {v}"
    },
    apiState: { syncing: "syncing", synced: "synced {t}", failed: "rate-limited/offline · bundled index" },
    syncLine: {
      idle: "Project data ships inside the page; on load it tries to refresh stars and push dates from the GitHub API.",
      ok: "Synced with GitHub at {t}, data matches.",
      okChanged: "Synced with GitHub at {t}, refreshed {n} fields.",
      missing: "Synced with GitHub at {t}; {n} repos not indexed yet: {list}.",
      failed: "Could not reach the GitHub API (rate limit or offline), showing bundled data."
    },
    empty: "No project matches. Try another keyword.",
    links: { live: "Live demo ▸", repo: "Source", release: "Release {t}", site: "Website", upstream: "Upstream ↗", open: "Open ▸", deploy: "LIVE DEPLOY", allRepos: "All repositories", top: "Back to live entries" },
    badges: { live: "● LIVE", fork: "FORK", self: "THIS SITE" },
    pushed: "pushed",
    foot: { toolchain: "TOOLCHAIN", syncAl: "Tooling and model versions for this page" }
  }
};

window.PROJECTS_EN = {
  "ie-research-simulation": {
    t: "ERP Business Simulation",
    d: "Company-operation simulator built for innovation and entrepreneurship coursework, covering the full decision loop from plant setup through production, R&D, marketing and finance."
  },
  "hikoutai-stamp": {
    t: "JASDF Intercept-Photo Stamper",
    d: "Single-file web tool that overlays the Japan Air Self-Defense Force scramble-photo label — aircraft type, altitude, timestamp — onto any image."
  },
  "MomentWebStitcher": {
    t: "Moment Long-Shot Stitcher (Web)",
    d: "Stitches screenshots vertically in the browser with grouping and batch export. No install, entirely client-side."
  },
  "WebClock-for-Exam": {
    t: "Exam Clock (Web)",
    d: "Full-screen HTML/JS countdown clock for exams with large digits; a packaged desktop build is also provided."
  },
  "AirplaneWar": {
    t: "Airplane War",
    d: "Keyboard-driven shoot-'em-up implemented on HTML5 Canvas."
  },
  "ETS2LA-ThirdPartyPlugin": {
    t: "ETS2LA Third-Party Plugin Bundle",
    d: "Collection of third-party plugins for ETS2LA, the open-source driving agent, covering parking, overtaking, shifting and speed-limit handling, plus packaging and deployment scripts."
  },
  "AutoParking": {
    t: "Auto Parking Plugin",
    d: "Performs parking by sending throttle, brake, gear and steering into the running game at 60 Hz. Its README states the code is fully AI-generated and has not been reviewed line by line by a human, and that a hotkey is the only way to abort a manoeuvre."
  },
  "OvertakeAssistant": {
    t: "Overtake Assistant Plugin",
    d: "Coordinates overtaking by reusing the existing indicator lane-change flow, without modifying pathfinding, lane assist or adaptive cruise control."
  },
  "SequentialAutoShift": {
    t: "Sequential Gearbox Auto-Shift Plugin",
    d: "Reads vehicle telemetry and sends upshift/downshift control pulses, using a conservative strategy for sequential gearboxes."
  },
  "SpeedLimitUnlocker": {
    t: "Speed Limit Unlocker Plugin",
    d: "Keeps the road speed limit from resetting the global ACC target speed, so cruise control holds your setting."
  },
  "Copyleft": {
    t: "semi-utils GUI Port",
    d: "PyQt5 GUI port of the command-line semi-utils: batch-applies watermarks, shadows and white borders to photos across several layouts."
  },
  "MomentStitcher": {
    t: "Moment Long-Shot Stitcher (Desktop)",
    d: "Drag-and-drop long-image stitcher that groups pictures automatically based on count, processes them in batches and reports progress live."
  },
  "WeChatBot_WXAUTO_SE-4.1.2": {
    t: "WeChat Chat Bot (Modified)",
    d: "Rebuilt on the original KouriChat project: exchanges WeChat messages through wxautox and generates replies with DeepSeek, GPT and other language models."
  },
  "uXuexitongJS": {
    t: "Xuexitong Course Automation (Fork)",
    d: "Fork of the automation script for Xuexitong courses: background playback, speed-up and auto-answering of interaction questions."
  },
  "ETS2LA": {
    t: "ETS2LA Main Program (Fork)",
    d: "Plugin-based interface program for ETS2/ATS — the driving-agent framework itself."
  },
  "semi-utils": {
    t: "semi-utils (Fork)",
    d: "Fork of the command-line tool that batch-writes camera model and shooting parameters into photos."
  },
  "fake-type": {
    t: "fake-type (Fork)",
    d: "Fork of the VS Code live-demo helper: prepare code and terminal output in advance, then hammer the keyboard and the demo still plays perfectly."
  },
  "modmaps": {
    t: "modmaps (Fork)",
    d: "Fork providing web-based maps of Euro Truck Simulator 2 and American Truck Simulator for ETS2LA."
  },
  "solidworks-automation-skill": {
    t: "SolidWorks Automation Skill (Fork)",
    d: "Fork of the Python COM toolkit that drives SolidWorks through part modelling, assemblies, drawings, sheet metal, weldments and FEA simulation."
  },
  "Wallpaper-24h": {
    t: "Wallpaper 24h (Fork)",
    d: "Fork of the C utility that switches the Windows desktop wallpaper by hour with cross-fade, system-tray control and refresh after resume."
  },
  "piggywu981.github.io": {
    t: "This Site's Source",
    d: "The repository behind this index page: static HTML/CSS/JS, no framework and no build step. Created but not yet pushed, so the site itself is not live."
  }
};
