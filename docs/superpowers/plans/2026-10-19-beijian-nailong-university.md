# 北建奶龙大学 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在当前 GitHub Pages 仓库下新建 `/北建奶龙大学/` 单页站，用建大紫与真实校史做成「像真官网」，再加入奶龙化的新闻、学院、校园导览与入学纪念卡。

**Architecture:** 纯静态单页：`index.html` 承载全部语义内容，`styles.css` 提供设计令牌与响应式布局，`assets/card.js` 提供可单测的纯函数，`app.js` 只做 DOM 交互。图片由 Seedream 5.0 生成后本地化到 `assets/images/`。

**Tech Stack:** HTML5、CSS Custom Properties、原生 JavaScript（ES2019，无模块、无构建）、Node.js 内置测试运行器、Python（仅用于调用 Seedream 技能）、PowerShell（下载图片）。

---

## 文件结构

| 路径 | 职责 |
| --- | --- |
| `北建奶龙大学/index.html` | 页面结构、全部静态文案、SEO、弹窗与表单 |
| `北建奶龙大学/styles.css` | 设计令牌、布局、组件、响应式、打印、减少动效 |
| `北建奶龙大学/app.js` | 导航、筛选、弹窗、纪念卡 UI、回到顶部、当前栏目高亮 |
| `北建奶龙大学/assets/card.js` | 纯函数：昵称校验、XML 转义、卡号、SVG 生成（可被 Node 测试） |
| `北建奶龙大学/assets/seal.svg` | 自绘校徽 / favicon |
| `北建奶龙大学/assets/images/*.png` | Seedream 生成的 7 张图片 |
| `tests/card.test.cjs` | `card.js` 的 Node 内置测试 |
| `scripts/check-site.mjs` | 静态站点结构自检（无第三方依赖） |
| `docs/superpowers/specs/2026-10-19-beijian-nailong-university-design.md` | 已确认的设计规格 |

**不修改**：仓库根目录的 `index.html`、`assets/app.js`、`assets/style.css`、`assets/projects.js`。首页入口卡片是可选后续项，本计划不执行。

---

## Task 1: 预检与 Seedream 图片生成

**Files:**
- Create: `北建奶龙大学/assets/images/hero-campus.png`
- Create: `北建奶龙大学/assets/images/news-opening.png`
- Create: `北建奶龙大学/assets/images/news-vibration.png`
- Create: `北建奶龙大学/assets/images/news-canteen.png`
- Create: `北建奶龙大学/assets/images/campus-xicheng.png`
- Create: `北建奶龙大学/assets/images/campus-daxing.png`
- Create: `北建奶龙大学/assets/images/campus-square.png`
- Create temporarily: `%TEMP%\bnu-gen-images.py`

- [ ] **Step 1: 检查 Seedream API Key**

Run:
```powershell
if ($env:ARK_API_KEY -or $env:MODEL_IMAGE_API_KEY -or $env:MODEL_AGENT_API_KEY) { 'key: set' } else { 'key: missing' }
```
Expected: `key: set`。若为 `key: missing`，停止执行并向用户索取 `ARK_API_KEY`，不要用占位图继续。

- [ ] **Step 2: 创建图片目录**

Run:
```powershell
New-Item -ItemType Directory -Force '北建奶龙大学\assets\images' | Out-Null
```

- [ ] **Step 3: 写入临时生成脚本**

Create `%TEMP%\bnu-gen-images.py`:

```python
import asyncio
import os
import sys
import urllib.request

SKILL = r"c:\Users\PiggyWu\.trae-cn\skills\byted-seedream-image-generate\scripts"
sys.path.append(SKILL)
from seedream_image_generate import seedream_generate

OUT = r"d:\Github\piggywu981.github.io-1\北建奶龙大学\assets\images"

PROMPTS = [
    ("hero-campus.png", "2048x1152",
     "Photorealistic architectural photography of a modern Chinese architecture university campus in autumn. A wide plaza with a giant cute cream-yellow round-bellied cartoon dragon sculpture as the centerpiece, big friendly eyes, soft matte surface. Red brick and glass academic buildings, ginkgo trees, students walking, warm late-afternoon sunlight, 35mm lens, high detail, no text, no logos, no watermark."),
    ("news-opening.png", "1600x1200",
     "Realistic campus news photograph: an opening ceremony in front of a Chinese university main building, students taking a group photo with a friendly cream-yellow round-bellied cartoon dragon mascot, colorful ribbons, natural daylight, candid documentary style, no text, no logos, no watermark."),
    ("news-vibration.png", "1600x1200",
     "Realistic structural engineering laboratory photograph: a large multi-axis shaking table array, engineers in safety vests recording data, a small cream-yellow round-bellied cartoon dragon plush wearing a tiny white safety helmet standing on the table, cool industrial lighting, high detail, no text, no logos, no watermark."),
    ("news-canteen.png", "1600x1200",
     "Realistic Chinese university canteen photograph: a serving counter with dragon-shaped steamed buns and a set meal tray, students queueing, warm pendant lights, steam, appetizing food photography, shallow depth of field, no text, no logos, no watermark."),
    ("campus-xicheng.png", "1600x1200",
     "Photorealistic photograph of an old Chinese architecture school campus gate and a 1950s brick academic building, plane trees, autumn afternoon shadows, bicycles, quiet academic atmosphere, architectural photography, no text, no logos, no watermark."),
    ("campus-daxing.png", "1600x1200",
     "Photorealistic photograph of a modern Chinese university library beside a lake, glass curtain wall, concrete and warm wood facade, sunset reflection, students on the waterfront steps, architectural photography, no text, no logos, no watermark."),
    ("campus-square.png", "1600x1200",
     "Photorealistic dusk photograph of a Chinese university campus plaza with a giant cream-yellow round-bellied cartoon dragon sculpture, students strolling, contemporary academic buildings silhouetted against a violet and amber sky, warm plaza lights, cinematic, no text, no logos, no watermark."),
]

async def main():
    tasks = [{"prompt": p, "size": s, "watermark": False, "output_format": "png"} for _, s, p in PROMPTS]
    result = await seedream_generate(tasks, version="5.0")
    if result["status"] != "success":
        print(result)
        raise SystemExit(1)
    by_index = {}
    for entry in result["success_list"]:
        for name, url in entry.items():
            idx = int(name.split("_")[1])
            by_index[idx] = url
    os.makedirs(OUT, exist_ok=True)
    for idx, (filename, _, _) in enumerate(PROMPTS):
        url = by_index.get(idx)
        if not url:
            raise SystemExit(f"missing image for task {idx}: {filename}")
        target = os.path.join(OUT, filename)
        urllib.request.urlretrieve(url, target)
        print(f"saved: {target} ({os.path.getsize(target)} bytes)")

asyncio.run(main())
```

- [ ] **Step 4: 运行生成脚本**

Run:
```powershell
python "$env:TEMP\bnu-gen-images.py"
```
Expected: 7 行 `saved: ...`，每张文件大于 100KB。若接口返回审核失败，逐条改写 prompt 中可能触发审核的词（如把 `dragon mascot` 改为 `round yellow cartoon creature`），重新运行。

- [ ] **Step 5: 校验图片文件**

Run:
```powershell
Get-ChildItem '北建奶龙大学\assets\images' | Select-Object Name, Length
```
Expected: 7 个 `.png`，`Length` 均大于 100000。

**实现备注：** 实际执行时已将 7 张 PNG 转为 JPEG（quality 86、progressive）以控制页面体积，并删除原始 PNG；`index.html` 引用 `.jpg`。最终 7 张图片合计约 2.7MB。

---

## Task 2: 设计令牌与基础布局

**Files:**
- Create: `北建奶龙大学/styles.css`
- Create: `北建奶龙大学/index.html`（先写空壳）

- [ ] **Step 1: 写 HTML 空壳**

Create `北建奶龙大学/index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>北建奶龙大学 | 在建筑里，装下一只奶龙的想象力</title>
<meta name="description" content="北京建筑大学非官方趣味二创站点：真实校史与校园文化，加上一只常驻奶龙。">
<meta name="color-scheme" content="light">
<meta property="og:title" content="北建奶龙大学">
<meta property="og:description" content="在建筑里，装下一只奶龙的想象力。">
<meta property="og:image" content="assets/images/hero-campus.png">
<meta property="og:type" content="website">
<link rel="icon" href="assets/seal.svg" type="image/svg+xml">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<a class="skip-link" href="#main">跳到主要内容</a>
<header class="site-header"></header>
<main id="main"></main>
<footer class="site-footer"></footer>
<script src="assets/card.js" defer></script>
<script src="app.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: 写设计令牌与基础样式**

Create `北建奶龙大学/styles.css` with this foundation:

```css
:root {
  --purple-900: #331A4A;
  --purple-700: #4A2568;
  --purple-500: #6B3E93;
  --purple-100: #EDE6F4;
  --yellow-500: #F2C14E;
  --paper: #F7F4EE;
  --white: #FFFFFF;
  --ink: #1E1B24;
  --ink-soft: #5F5A66;
  --line: #D9D2E2;
  --serif: "Songti SC", "Noto Serif SC", "Source Han Serif SC", serif;
  --sans: -apple-system, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;
  --wrap: 1180px;
  --shadow: 0 12px 40px rgba(51, 26, 74, .08);
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}
img { display: block; max-width: 100%; height: auto; }
a { color: var(--purple-500); text-underline-offset: .2em; }
a:hover { color: var(--purple-700); }
button, input, select { font: inherit; }
:focus-visible { outline: 3px solid var(--yellow-500); outline-offset: 3px; }

.wrap { width: min(var(--wrap), calc(100% - 48px)); margin-inline: auto; }
.skip-link {
  position: absolute; left: 16px; top: -48px; z-index: 100;
  background: var(--purple-700); color: #fff; padding: 10px 16px;
}
.skip-link:focus { top: 12px; }
.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
.section { padding: 96px 0; }
.section--tint { background: var(--white); border-block: 1px solid var(--line); }
.section-head { display: grid; gap: 10px; margin-bottom: 40px; }
.section-kicker {
  font-size: 12px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--purple-500); font-weight: 700;
}
.section-title {
  margin: 0; font-family: var(--serif); font-weight: 700;
  font-size: clamp(28px, 4vw, 42px); line-height: 1.25; color: var(--purple-900);
}
.section-lead { margin: 0; color: var(--ink-soft); max-width: 62ch; }
```

- [ ] **Step 3: 验证 CSS 能加载**

Run:
```powershell
python -m http.server 8765
```
Open `http://localhost:8765/北建奶龙大学/`; Expected: 空白页面，无 CSS 404，控制台无报错。验证后停止服务器。

---

## Task 3: 校徽、页头与 Hero

**Files:**
- Create: `北建奶龙大学/assets/seal.svg`
- Modify: `北建奶龙大学/index.html`
- Modify: `北建奶龙大学/styles.css`

- [ ] **Step 1: 写自绘校徽**

Create `assets/seal.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="北建奶龙大学校徽">
  <circle cx="128" cy="128" r="124" fill="#4A2568"/>
  <circle cx="128" cy="128" r="112" fill="none" stroke="#F2C14E" stroke-width="4"/>
  <circle cx="128" cy="128" r="84" fill="none" stroke="#FFFFFF" stroke-width="3"/>
  <path d="M78 132h100M88 116h80M98 100h60" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
  <path d="M96 156c0-18 14-32 32-32s32 14 32 32c0 14-12 26-32 26s-32-12-32-26z" fill="#F2C14E"/>
  <circle cx="116" cy="150" r="5" fill="#331A4A"/>
  <circle cx="140" cy="150" r="5" fill="#331A4A"/>
  <path d="M120 164c5 5 11 5 16 0" stroke="#331A4A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M104 132l-10-12M152 132l10-12" stroke="#F2C14E" stroke-width="5" stroke-linecap="round"/>
  <path id="seal-top" d="M128 24a104 104 0 0 1 73.5 30.5" fill="none"/>
  <text font-family="serif" font-size="17" fill="#FFFFFF" letter-spacing="3">
    <textPath href="#seal-top" startOffset="8%">北建奶龙大学</textPath>
  </text>
  <text x="128" y="222" text-anchor="middle" font-family="serif" font-size="9" fill="#FFFFFF" letter-spacing="1.2">BEIJIAN NAILONG UNIVERSITY</text>
</svg>
```

- [ ] **Step 2: 写页头与 Hero HTML**

Replace the line `<main id="main"></main>` with `<main id="main">`, the hero block below, and a closing `</main>` after the ticker. Later tasks insert new sections before that closing tag.

Replace the empty `<header class="site-header"></header>` with:

```html
<header class="site-header">
  <div class="utility">
    <div class="wrap utility-inner">
      <span>北建奶龙大学 · 非官方趣味站点</span>
      <nav aria-label="快捷入口">
        <a href="#about">教职工</a>
        <a href="#colleges">学生</a>
        <a href="#campus">校友</a>
        <a href="#faq">访客</a>
        <a href="https://www.bucea.edu.cn/" target="_blank" rel="noopener">真实北建大 ↗</a>
      </nav>
    </div>
  </div>
  <div class="masthead">
    <div class="wrap masthead-inner">
      <a class="brand" href="#home" aria-label="北建奶龙大学首页">
        <img src="assets/seal.svg" alt="" width="56" height="56">
        <span class="brand-text">
          <strong>北建奶龙大学</strong>
          <small>BEIJIAN NAILONG UNIVERSITY</small>
        </span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="nav-toggle-bar" aria-hidden="true"></span>
        <span class="nav-toggle-label">菜单</span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="主导航">
        <a href="#home">首页</a>
        <a href="#about">学校概况</a>
        <a href="#colleges">学院设置</a>
        <a href="#news">新闻动态</a>
        <a href="#research">学术研究</a>
        <a href="#admission">招生入学</a>
        <a href="#campus">校园生活</a>
        <a href="#notices">办事大厅</a>
      </nav>
    </div>
  </div>
</header>
<main id="main">
  <section class="hero" id="home">
    <img class="hero-bg" src="assets/images/hero-campus.png" alt="秋日校园广场上的巨型奶龙雕塑与学生" width="2048" height="1152">
    <div class="hero-veil" aria-hidden="true"></div>
    <div class="wrap hero-inner">
      <p class="hero-kicker">BEIJIAN NAILONG UNIVERSITY · AUTUMN 2026</p>
      <h1 class="hero-title">在建筑里，<br>装下一只奶龙的想象力。</h1>
      <p class="hero-motto">实事求是，精益求精；偶尔发呆，常常可爱。</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#about">走进北建奶龙大学</a>
        <a class="btn btn-ghost" href="#admission">领取入学纪念卡</a>
      </div>
      <p class="hero-note">非官方趣味二创 · 不招生 · 不发文凭</p>
    </div>
  </section>
  <div class="ticker">
    <div class="wrap ticker-inner">
      <span class="ticker-label">校园快讯</span>
      <a href="#news">北建奶龙大学网站正式上线，欢迎访问。</a>
      <time datetime="2026-10-19">2026 / 10 / 19</time>
    </div>
  </div>
</main>
```

- [ ] **Step 3: 写页头与 Hero 样式**

Append to `styles.css`:

```css
.utility { background: var(--purple-900); color: #fff; font-size: 12px; }
.utility-inner { display: flex; justify-content: space-between; gap: 16px; padding: 8px 0; }
.utility nav { display: flex; gap: 18px; flex-wrap: wrap; }
.utility a { color: #fff; text-decoration: none; opacity: .82; }
.utility a:hover { opacity: 1; color: var(--yellow-500); }

.masthead { background: var(--white); border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 30; }
.masthead-inner { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 14px 0; }
.brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--purple-900); }
.brand-text { display: grid; line-height: 1.2; }
.brand-text strong { font-family: var(--serif); font-size: 22px; letter-spacing: .06em; }
.brand-text small { font-size: 10px; letter-spacing: .14em; color: var(--ink-soft); }
.site-nav { display: flex; gap: 4px; flex-wrap: wrap; }
.site-nav a { padding: 8px 10px; color: var(--ink); text-decoration: none; font-size: 14px; border-bottom: 2px solid transparent; }
.site-nav a:hover, .site-nav a[aria-current="true"] { color: var(--purple-700); border-bottom-color: var(--yellow-500); }
.nav-toggle { display: none; }

.hero { position: relative; min-height: 620px; display: grid; align-items: end; overflow: hidden; background: var(--purple-900); }
.hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-veil {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(30, 12, 48, .86) 0%, rgba(30, 12, 48, .55) 48%, rgba(30, 12, 48, .12) 100%),
              linear-gradient(0deg, rgba(30, 12, 48, .72) 0%, transparent 45%);
}
.hero-inner { position: relative; z-index: 1; padding: 120px 0 72px; color: #fff; }
.hero-kicker { margin: 0 0 18px; font-size: 12px; letter-spacing: .2em; color: var(--yellow-500); }
.hero-title { margin: 0; font-family: var(--serif); font-size: clamp(38px, 6vw, 68px); line-height: 1.18; letter-spacing: .02em; }
.hero-motto { margin: 20px 0 0; font-size: clamp(16px, 2vw, 20px); color: rgba(255,255,255,.88); }
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 30px; }
.hero-note { margin: 22px 0 0; font-size: 12px; color: rgba(255,255,255,.62); }
.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 22px; border: 1px solid transparent; border-radius: 2px; text-decoration: none; font-weight: 600; }
.btn-primary { background: var(--yellow-500); color: var(--purple-900); }
.btn-primary:hover { background: #f7cf72; color: var(--purple-900); }
.btn-ghost { border-color: rgba(255,255,255,.55); color: #fff; }
.btn-ghost:hover { border-color: var(--yellow-500); color: var(--yellow-500); }

.ticker { background: var(--purple-100); border-bottom: 1px solid var(--line); }
.ticker-inner { display: flex; align-items: center; gap: 16px; padding: 10px 0; font-size: 14px; }
.ticker-label { flex: none; background: var(--purple-700); color: #fff; padding: 2px 10px; font-size: 12px; letter-spacing: .08em; }
.ticker a { color: var(--purple-900); text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ticker time { margin-left: auto; flex: none; color: var(--ink-soft); font-size: 12px; }
```

- [ ] **Step 4: 验证页头与 Hero**

Run: `python -m http.server 8765`，访问 `http://localhost:8765/北建奶龙大学/`。Expected: 校徽、导航、Hero 图和两个按钮正常显示；控制台无 404。

---

## Task 4: 学校概况与学院设置

**Files:**
- Modify: `北建奶龙大学/index.html`
- Modify: `北建奶龙大学/styles.css`

- [ ] **Step 1: 写概况与学院 HTML**

Insert after `</div>` of `.ticker` and before `</main>`:

```html
<section class="section" id="about">
  <div class="wrap">
    <div class="section-head">
      <p class="section-kicker">ABOUT · 01</p>
      <h2 class="section-title">一所有 119 年历史的学校，<br>和一只刚入职的奶龙。</h2>
      <p class="section-lead">北建奶龙大学以北京建筑大学为灵感，保留真实的校史、校训与学科底色，把奶龙放进校园日常。以下事实均可回到真实学校官网核对。</p>
    </div>
    <div class="stats">
      <div class="stat"><b>1907</b><span>建校渊源</span></div>
      <div class="stat"><b>11</b><span>学院</span></div>
      <div class="stat"><b>2</b><span>校区</span></div>
      <div class="stat"><b>1</b><span>只常驻奶龙</span></div>
      <div class="stat"><b>90000+</b><span>毕业生</span></div>
    </div>
    <div class="about-grid">
      <div class="about-copy">
        <p>学校源于 1907 年，2013 年更名为北京建筑大学。建筑学、土木工程、测绘科学与技术是北京高校高精尖学科，建筑遗产保护、城乡规划与建筑设计、海绵城市、精密测绘、智能建造、绿色建筑等方向形成了鲜明特色。</p>
        <p>从天安门城楼修缮、大兴机场航站楼钢结构关键技术，到冬奥会开闭幕式专项与雄安新区建设规划，北建大人的工作一直发生在真实城市里。现在，校园里多了一只奶龙，它主要负责在图纸旁边安静地看。</p>
        <p class="fineprint">「1 只常驻奶龙」为趣味设定；其余数据来自北京建筑大学官网。</p>
      </div>
      <div class="about-facts">
        <h3>学校名片</h3>
        <dl>
          <div><dt>校训</dt><dd>实事求是，精益求精</dd></div>
          <div><dt>办学理念</dt><dd>立德树人，开放创新</dd></div>
          <div><dt>西城校区</dt><dd>西城区展览馆路 1 号</dd></div>
          <div><dt>大兴校区</dt><dd>大兴区黄村镇永源路 15 号</dd></div>
        </dl>
      </div>
    </div>
  </div>
</section>

<section class="section section--tint" id="colleges">
  <div class="wrap">
    <div class="section-head">
      <p class="section-kicker">SCHOOLS · 02</p>
      <h2 class="section-title">各有所长，各自发光。</h2>
      <p class="section-lead">真实学院名称，加上一句奶龙化简介。点击卡片可查看学院的一句话设定。</p>
    </div>
    <div class="college-grid">
      <article class="college-card">
        <p class="college-no">01</p>
        <h3>建筑与城市规划学院</h3>
        <p>把奶龙画进城市天际线。</p>
        <button class="text-btn" type="button" data-college="建筑与城市规划学院">查看设定</button>
      </article>
      <article class="college-card">
        <p class="college-no">02</p>
        <h3>土木与交通工程学院</h3>
        <p>让每一只奶龙都站得稳。</p>
        <button class="text-btn" type="button" data-college="土木与交通工程学院">查看设定</button>
      </article>
      <article class="college-card">
        <p class="college-no">03</p>
        <h3>环境与能源工程学院</h3>
        <p>给奶龙一口好空气。</p>
        <button class="text-btn" type="button" data-college="环境与能源工程学院">查看设定</button>
      </article>
      <article class="college-card">
        <p class="college-no">04</p>
        <h3>智能科学与技术学院</h3>
        <p>教奶龙写第一行代码。</p>
        <button class="text-btn" type="button" data-college="智能科学与技术学院">查看设定</button>
      </article>
      <article class="college-card">
        <p class="college-no">05</p>
        <h3>测绘与城市空间信息学院</h3>
        <p>在校园里精准找到奶龙。</p>
        <button class="text-btn" type="button" data-college="测绘与城市空间信息学院">查看设定</button>
      </article>
      <article class="college-card">
        <p class="college-no">06</p>
        <h3>城市经济与管理学院</h3>
        <p>算清奶龙的伙食预算。</p>
        <button class="text-btn" type="button" data-college="城市经济与管理学院">查看设定</button>
      </article>
    </div>
    <details class="all-colleges">
      <summary>查看全部学院与教学单位</summary>
      <p>未来建筑技术学院、卓越工程师学院、建筑与城市规划学院、土木与交通工程学院、环境与能源工程学院、智能科学与技术学院、城市经济与管理学院、测绘与城市空间信息学院、机电与车辆工程学院、人文与社会科学学院、理学院、马克思主义学院、体育教研部、继续教育学院、国际教育学院。</p>
    </details>
  </div>
</section>
```

- [ ] **Step 2: 写概况与学院样式**

Append:

```css
.stats { display: grid; grid-template-columns: repeat(5, 1fr); border-block: 1px solid var(--line); margin-bottom: 40px; }
.stat { padding: 22px 16px; border-right: 1px solid var(--line); }
.stat:last-child { border-right: 0; }
.stat b { display: block; font-family: var(--serif); font-size: clamp(26px, 3vw, 38px); color: var(--purple-700); line-height: 1.1; }
.stat span { display: block; margin-top: 6px; font-size: 12px; color: var(--ink-soft); }
.about-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 48px; }
.about-copy p { margin: 0 0 16px; }
.fineprint { font-size: 12px; color: var(--ink-soft); }
.about-facts { background: var(--white); border: 1px solid var(--line); padding: 26px; box-shadow: var(--shadow); }
.about-facts h3 { margin: 0 0 16px; font-family: var(--serif); color: var(--purple-900); }
.about-facts dl { margin: 0; }
.about-facts dl > div { display: grid; grid-template-columns: 76px 1fr; gap: 12px; padding: 10px 0; border-top: 1px solid var(--line); }
.about-facts dt { color: var(--ink-soft); font-size: 13px; }
.about-facts dd { margin: 0; font-weight: 600; }
.college-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.college-card { background: var(--white); border: 1px solid var(--line); padding: 26px; display: grid; gap: 10px; align-content: start; transition: border-color .2s, transform .2s; }
.college-card:hover { border-color: var(--purple-500); transform: translateY(-3px); }
.college-no { margin: 0; font-size: 12px; letter-spacing: .18em; color: var(--purple-500); }
.college-card h3 { margin: 0; font-family: var(--serif); font-size: 20px; color: var(--purple-900); }
.college-card p { margin: 0; color: var(--ink-soft); }
.text-btn { justify-self: start; padding: 0; border: 0; background: none; color: var(--purple-500); border-bottom: 1px solid var(--yellow-500); cursor: pointer; }
.text-btn:hover { color: var(--purple-700); }
.all-colleges { margin-top: 28px; border-top: 1px solid var(--line); padding-top: 18px; }
.all-colleges summary { cursor: pointer; font-weight: 600; color: var(--purple-700); }
.all-colleges p { color: var(--ink-soft); max-width: 80ch; }
```

- [ ] **Step 3: 验证**

刷新页面。Expected: 5 个数据项、两栏概况、6 张学院卡片；窄屏下卡片换行，无横向滚动。

---

## Task 5: 新闻、通知与学术活动

**Files:**
- Modify: `北建奶龙大学/index.html`
- Modify: `北建奶龙大学/styles.css`

- [ ] **Step 1: 写新闻筛选与卡片 HTML**

Insert after the colleges section:

```html
<section class="section" id="news">
  <div class="wrap">
    <div class="section-head">
      <p class="section-kicker">NEWS &amp; STORIES · 03</p>
      <h2 class="section-title">此刻，奶龙大学正在发生。</h2>
      <p class="section-lead">六条校园新闻，三个分类。所有故事均为趣味虚构。</p>
    </div>
    <div class="filters" role="group" aria-label="新闻分类">
      <button class="filter" type="button" data-filter="all" aria-pressed="true">全部</button>
      <button class="filter" type="button" data-filter="campus" aria-pressed="false">校园动态</button>
      <button class="filter" type="button" data-filter="academic" aria-pressed="false">学术脑洞</button>
      <button class="filter" type="button" data-filter="life" aria-pressed="false">生活灵感</button>
    </div>
    <p class="filter-status" aria-live="polite">共 6 条</p>
    <div class="news-grid" id="news-grid">
      <article class="news-card" data-category="campus">
        <img src="assets/images/news-opening.png" alt="学生与奶龙人偶在校园主楼前合影" width="1600" height="1200" loading="lazy">
        <div class="news-body">
          <p class="news-meta">校园动态 · 2026.10.19</p>
          <h3>北建奶龙大学网站正式上线：从今天起，认真做一只有学问的龙。</h3>
          <p>以好奇为起点，以食堂为圆心。我们的大学生活，从这一页开始。</p>
        </div>
      </article>
      <article class="news-card" data-category="academic">
        <img src="assets/images/news-vibration.png" alt="奶龙玩偶在振动台阵上参与测试" width="1600" height="1200" loading="lazy">
        <div class="news-body">
          <p class="news-meta">学术脑洞 · 2026.10.17</p>
          <h3>多功能振动台阵完成首次「奶龙抗震舒适度」测试。</h3>
          <p>测试结论：晃是可以晃的，肚子不能瘪。</p>
        </div>
      </article>
      <article class="news-card" data-category="life">
        <img src="assets/images/news-canteen.png" alt="食堂窗口的奶龙造型包子与套餐" width="1600" height="1200" loading="lazy">
        <div class="news-body">
          <p class="news-meta">生活灵感 · 2026.10.16</p>
          <h3>大兴校区食堂上新：奶龙套餐窗口排队长度创本学期新高。</h3>
          <p>建议错峰用餐，或和奶龙一起再等五分钟。</p>
        </div>
      </article>
      <article class="news-card" data-category="campus">
        <img src="assets/images/campus-xicheng.png" alt="西城校区老校门与梧桐树" width="1600" height="1200" loading="lazy">
        <div class="news-body">
          <p class="news-meta">校园动态 · 2026.10.15</p>
          <h3>西城校区实验 5 号楼迎来一位常驻「建筑审查员」。</h3>
          <p>它不画图，只在图纸旁边点头；据说点头通过率很高。</p>
        </div>
      </article>
      <article class="news-card" data-category="academic">
        <img src="assets/images/campus-daxing.png" alt="大兴校区图书馆与湖面" width="1600" height="1200" loading="lazy">
        <div class="news-body">
          <p class="news-meta">学术脑洞 · 2026.10.14</p>
          <h3>建筑学院把奶龙写进城市设计课作业。</h3>
          <p>题目是：如何为一只喜欢发呆的龙设计一座城市广场。</p>
        </div>
      </article>
      <article class="news-card" data-category="life">
        <img src="assets/images/campus-square.png" alt="黄昏校园广场上的奶龙雕塑" width="1600" height="1200" loading="lazy">
        <div class="news-body">
          <p class="news-meta">生活灵感 · 2026.10.13</p>
          <h3>图书馆「留白阅览区」允许发呆，奶龙表示很满意。</h3>
          <p>不规定每分钟的产出，也欢迎暂时没有答案。</p>
        </div>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 2: 写通知与活动 HTML**

Insert after the news section:

```html
<section class="section section--tint" id="notices">
  <div class="wrap split">
    <div>
      <div class="section-head">
        <p class="section-kicker">NOTICES · 04</p>
        <h2 class="section-title">通知公告</h2>
      </div>
      <ul class="notice-list">
        <li><time datetime="2026-10-18">18</time><span>2026.10</span><a href="#admission">关于开放秋季学期「奶龙通识选修课」的通知</a><em>教务通知</em></li>
        <li><time datetime="2026-10-15">15</time><span>2026.10</span><a href="#admission">关于领取 2026 级新生趣味录取通知书的说明</a><em>学生事务</em></li>
        <li><time datetime="2026-10-11">11</time><span>2026.10</span><a href="#campus">关于维护图书馆安静秩序、请勿投喂奶龙的温馨提示</a><em>图书馆</em></li>
      </ul>
    </div>
    <div id="research">
      <div class="section-head">
        <p class="section-kicker">WHAT'S ON · 05</p>
        <h2 class="section-title">学术与活动</h2>
      </div>
      <div class="event-list">
        <article class="event">
          <p class="event-date">10 / 24</p>
          <h3>学术沙龙：当我们谈论奶龙时，我们在谈论什么？</h3>
          <p>通识教育中心 · 西城校区报告厅 · 14:00–16:00</p>
        </article>
        <article class="event">
          <p class="event-date">10 / 30</p>
          <h3>校园开放日：从西城校区走到大兴校区</h3>
          <p>约 30 公里 · 建议坐校车 · 09:00 出发</p>
        </article>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: 写样式**

Append:

```css
.filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
.filter { padding: 8px 16px; border: 1px solid var(--line); background: var(--white); color: var(--ink); cursor: pointer; border-radius: 2px; }
.filter[aria-pressed="true"] { background: var(--purple-700); border-color: var(--purple-700); color: #fff; }
.filter-status { margin: 0 0 22px; font-size: 12px; color: var(--ink-soft); }
.news-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.news-card { background: var(--white); border: 1px solid var(--line); display: grid; grid-template-rows: auto 1fr; }
.news-card[hidden] { display: none; }
.news-card img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.news-body { padding: 20px; }
.news-meta { margin: 0 0 8px; font-size: 12px; color: var(--purple-500); letter-spacing: .06em; }
.news-body h3 { margin: 0 0 8px; font-family: var(--serif); font-size: 19px; line-height: 1.45; color: var(--purple-900); }
.news-body p { margin: 0; color: var(--ink-soft); font-size: 14px; }
.split { display: grid; grid-template-columns: 1.15fr .85fr; gap: 56px; }
.notice-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.notice-list li { display: grid; grid-template-columns: 44px 56px 1fr auto; gap: 14px; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--line); }
.notice-list time { font-family: var(--serif); font-size: 26px; color: var(--purple-700); line-height: 1; }
.notice-list span { font-size: 11px; color: var(--ink-soft); }
.notice-list a { color: var(--ink); text-decoration: none; }
.notice-list a:hover { color: var(--purple-700); }
.notice-list em { font-style: normal; font-size: 11px; color: var(--purple-500); border: 1px solid var(--purple-100); padding: 2px 8px; }
.event-list { display: grid; gap: 16px; }
.event { background: var(--white); border-left: 3px solid var(--yellow-500); padding: 20px 22px; }
.event-date { margin: 0 0 6px; font-size: 12px; letter-spacing: .14em; color: var(--purple-500); }
.event h3 { margin: 0 0 6px; font-family: var(--serif); font-size: 18px; color: var(--purple-900); }
.event p { margin: 0; font-size: 13px; color: var(--ink-soft); }
```

- [ ] **Step 4: 验证**

刷新。Expected: 6 张新闻卡、3 条通知、2 场活动；窄屏下新闻卡变单列。

---

## Task 6: 校园生活与导览弹窗

**Files:**
- Modify: `北建奶龙大学/index.html`
- Modify: `北建奶龙大学/styles.css`
- Modify: `北建奶龙大学/app.js`

- [ ] **Step 1: 写校园卡片与三个 dialog**

Insert before `</main>`:

```html
<section class="section" id="campus">
  <div class="wrap">
    <div class="section-head">
      <p class="section-kicker">LIFE ON CAMPUS · 06</p>
      <h2 class="section-title">课堂之外，还有整个世界。</h2>
      <p class="section-lead">点击卡片，看看两个真实校区和一座虚构广场。</p>
    </div>
    <div class="campus-grid">
      <button class="campus-card" type="button" data-dialog="dlg-xicheng">
        <img src="assets/images/campus-xicheng.png" alt="西城校区老校门" width="1600" height="1200" loading="lazy">
        <span><b>西城校区</b><small>展览馆路 1 号 · 实验 5 号楼与建筑遗产</small></span>
      </button>
      <button class="campus-card" type="button" data-dialog="dlg-daxing">
        <img src="assets/images/campus-daxing.png" alt="大兴校区图书馆与湖面" width="1600" height="1200" loading="lazy">
        <span><b>大兴校区</b><small>永源路 15 号 · 图书馆、湖景与振动台阵</small></span>
      </button>
      <button class="campus-card" type="button" data-dialog="dlg-square">
        <img src="assets/images/campus-square.png" alt="黄昏校园广场上的奶龙雕塑" width="1600" height="1200" loading="lazy">
        <span><b>奶龙广场</b><small>虚构地标 · 巨型奶龙雕塑与「吨吨」石刻</small></span>
      </button>
    </div>
  </div>
</section>

<dialog class="dlg" id="dlg-xicheng" aria-labelledby="dlg-xicheng-title">
  <img src="assets/images/campus-xicheng.png" alt="西城校区老校门与梧桐" width="1600" height="1200">
  <div class="dlg-body">
    <p class="section-kicker">CAMPUS 01</p>
    <h2 id="dlg-xicheng-title">西城校区 · 展览馆路 1 号</h2>
    <p>老校门、实验 5 号楼和梧桐树影，是北建大最容易被认出的画面。奶龙通常出没在图纸旁边，偶尔被误认为建筑小品。</p>
    <p class="dlg-tags">建筑遗产 · 老校门 · 城市中心</p>
    <button class="btn btn-primary dlg-close" type="button">关闭</button>
  </div>
</dialog>

<dialog class="dlg" id="dlg-daxing" aria-labelledby="dlg-daxing-title">
  <img src="assets/images/campus-daxing.png" alt="大兴校区图书馆与湖面日落" width="1600" height="1200">
  <div class="dlg-body">
    <p class="section-kicker">CAMPUS 02</p>
    <h2 id="dlg-daxing-title">大兴校区 · 永源路 15 号</h2>
    <p>图书馆临湖，玻璃幕墙把日落切成很多块。多功能振动台阵就在附近，奶龙第一次上去时，坚持说自己只是有点紧张。</p>
    <p class="dlg-tags">图书馆 · 湖景 · 振动台阵</p>
    <button class="btn btn-primary dlg-close" type="button">关闭</button>
  </div>
</dialog>

<dialog class="dlg" id="dlg-square" aria-labelledby="dlg-square-title">
  <img src="assets/images/campus-square.png" alt="黄昏广场上的巨型奶龙雕塑" width="1600" height="1200">
  <div class="dlg-body">
    <p class="section-kicker">CAMPUS 03 · 虚构</p>
    <h2 id="dlg-square-title">奶龙广场 · 虚构地标</h2>
    <p>广场中央是一尊巨型奶龙雕塑，底座刻着「吨吨」。这里是校园里最适合发呆的地方，也是所有合影的默认背景。</p>
    <p class="dlg-tags">虚构设定 · 雕塑 · 发呆</p>
    <button class="btn btn-primary dlg-close" type="button">关闭</button>
  </div>
</dialog>
```

- [ ] **Step 2: 写校园与弹窗样式**

Append:

```css
.campus-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.campus-card { padding: 0; border: 1px solid var(--line); background: var(--white); text-align: left; cursor: pointer; overflow: hidden; }
.campus-card img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; transition: transform .35s ease; }
.campus-card:hover img { transform: scale(1.03); }
.campus-card span { display: grid; gap: 4px; padding: 18px 20px; }
.campus-card b { font-family: var(--serif); font-size: 20px; color: var(--purple-900); }
.campus-card small { color: var(--ink-soft); font-size: 13px; }
.dlg { width: min(760px, calc(100% - 40px)); padding: 0; border: 0; border-radius: 8px; background: var(--white); color: var(--ink); box-shadow: 0 24px 80px rgba(30, 12, 48, .3); }
.dlg::backdrop { background: rgba(30, 12, 48, .62); }
.dlg img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.dlg-body { padding: 26px 30px 30px; }
.dlg-body h2 { margin: 6px 0 12px; font-family: var(--serif); color: var(--purple-900); }
.dlg-body p { margin: 0 0 12px; }
.dlg-tags { font-size: 12px; color: var(--purple-500); letter-spacing: .06em; }
.dlg-close { margin-top: 8px; }
```

- [ ] **Step 3: 写弹窗交互**

Create `app.js` initial content:

```js
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDialogs);
  } else {
    initDialogs();
  }
})();
```

- [ ] **Step 4: 验证弹窗**

刷新，点击三张校园卡。Expected: 弹窗打开、图片与文字显示；点击关闭、按 Esc、点击遮罩均可关闭；关闭后焦点回到原卡片。

---

## Task 7: 入学纪念卡纯逻辑（TDD）

**Files:**
- Create: `北建奶龙大学/assets/card.js`
- Create: `tests/card.test.cjs`

- [ ] **Step 1: 写失败测试**

Create `tests/card.test.cjs`:

```js
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
```

- [ ] **Step 2: 运行测试确认失败**

Run:
```powershell
node --test tests/card.test.cjs
```
Expected: FAIL，报错 `Cannot find module ... card.js`。

- [ ] **Step 3: 实现 card.js**

Create `北建奶龙大学/assets/card.js`:

```js
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
      '<text x="790" y="96" font-family="serif" font-size="20" fill="#F2C14E" letter-spacing="2">BEIJIAN NAILONG UNIVERSITY</text>',
      '<text x="790" y="124" font-family="serif" font-size="14" fill="#FFFFFF" opacity=".7">ADMISSION SOUVENIR</text>',
      '<text x="70" y="250" font-family="serif" font-size="46" fill="#FFFFFF">入学纪念卡</text>',
      '<text x="72" y="292" font-family="sans-serif" font-size="16" fill="#F2C14E" letter-spacing="4">A LITTLE LETTER TO YOUR FUTURE</text>',
      '<line x1="70" y1="330" x2="930" y2="330" stroke="#FFFFFF" stroke-opacity=".28"/>',
      '<text x="70" y="382" font-family="sans-serif" font-size="14" fill="#FFFFFF" opacity=".65">亲爱的</text>',
      '<text x="70" y="446" font-family="serif" font-size="52" fill="#F2C14E">' + nickname + '</text>',
      '<text x="70" y="490" font-family="sans-serif" font-size="16" fill="#FFFFFF" opacity=".78">' + college + '</text>',
      '<text x="70" y="548" font-family="sans-serif" font-size="14" fill="#FFFFFF" opacity=".6">' + date + ' · ' + serial + '</text>',
      '<text x="930" y="548" text-anchor="end" font-family="sans-serif" font-size="13" fill="#FFFFFF" opacity=".55">非录取凭证 · 仅供娱乐纪念</text>',
      '<text x="930" y="120" text-anchor="end" font-family="serif" font-size="28" fill="#FFFFFF" opacity=".9">北建奶龙大学</text>',
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
```

- [ ] **Step 4: 运行测试确认通过**

Run:
```powershell
node --test tests/card.test.cjs
```
Expected: 5 tests PASS。

---

## Task 8: 入学纪念卡 UI、FAQ 与页脚

**Files:**
- Modify: `北建奶龙大学/index.html`
- Modify: `北建奶龙大学/styles.css`
- Modify: `北建奶龙大学/app.js`

- [ ] **Step 1: 写纪念卡表单与预览容器**

Insert before `</main>`:

```html
<section class="section section--tint" id="admission">
  <div class="wrap admission">
    <div>
      <div class="section-head">
        <p class="section-kicker">YOUR STORY · 07</p>
        <h2 class="section-title">下一位奶龙同学，就是你。</h2>
        <p class="section-lead">填一个昵称，选一个学院，在浏览器本地生成一张入学纪念卡。不上传、不注册、不存储。</p>
      </div>
      <form class="card-form" id="card-form" novalidate>
        <label for="nickname">昵称（最多 12 个字）</label>
        <input id="nickname" name="nickname" type="text" maxlength="12" autocomplete="nickname" placeholder="例如：奶龙同学" required>
        <label for="college">学院</label>
        <select id="college" name="college" required>
          <option value="建筑与城市规划学院">建筑与城市规划学院</option>
          <option value="土木与交通工程学院">土木与交通工程学院</option>
          <option value="环境与能源工程学院">环境与能源工程学院</option>
          <option value="智能科学与技术学院">智能科学与技术学院</option>
          <option value="测绘与城市空间信息学院">测绘与城市空间信息学院</option>
          <option value="城市经济与管理学院">城市经济与管理学院</option>
        </select>
        <p class="form-error" id="card-error" role="alert"></p>
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">生成纪念卡</button>
          <button class="btn btn-outline" type="button" id="download-card" disabled>下载 SVG</button>
        </div>
      </form>
    </div>
    <div class="card-preview" id="card-preview" aria-live="polite">
      <p class="card-placeholder">填写昵称并点击「生成纪念卡」，这里会出现你的卡片。</p>
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="wrap faq">
    <div class="section-head">
      <p class="section-kicker">GOOD TO KNOW · 08</p>
      <h2 class="section-title">入学前的小问号。</h2>
    </div>
    <details open><summary>这是真实存在的大学吗？</summary><p>不是。本站为「北建奶龙大学」粉丝趣味二创，与北京建筑大学无隶属关系。真实学校信息请访问 <a href="https://www.bucea.edu.cn/" target="_blank" rel="noopener">北京建筑大学官网</a>。</p></details>
    <details><summary>会招生、收费或发文凭吗？</summary><p>不会。本站不提供任何真实招生、缴费、学籍或学位服务，也不接受任何形式的费用。</p></details>
    <details><summary>领取纪念卡会收集我的信息吗？</summary><p>不会。昵称只在浏览器本地用于生成 SVG，不上传、不存储，关闭页面后不会保留。</p></details>
    <details><summary>和北京建筑大学、奶龙版权方是什么关系？</summary><p>均无隶属或合作关系。本站为非商业娱乐创作，相关校名、校徽、校园影像与奶龙形象权利归各自权利人所有。</p></details>
  </div>
</section>
```

- [ ] **Step 2: 写页脚与免责声明**

Replace `<footer class="site-footer"></footer>`:

```html
<footer class="site-footer">
  <div class="wrap footer-top">
    <div class="footer-brand">
      <img src="assets/seal.svg" alt="" width="52" height="52">
      <div>
        <strong>北建奶龙大学</strong>
        <p>在建筑里，装下一只奶龙的想象力。</p>
      </div>
    </div>
    <div class="footer-col">
      <h3>校区地址</h3>
      <p>西城校区：北京市西城区展览馆路 1 号，100044</p>
      <p>大兴校区：北京市大兴区黄村镇永源路 15 号，102616</p>
    </div>
    <div class="footer-col">
      <h3>相关链接</h3>
      <p><a href="https://www.bucea.edu.cn/" target="_blank" rel="noopener">北京建筑大学官网 ↗</a></p>
      <p><a href="#home">回到首页</a></p>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>本站为粉丝趣味二创，与北京建筑大学及奶龙角色版权方无任何隶属或合作关系。不招生、不收费、不发文凭、无实体校区。校名、校徽、校园影像与奶龙形象相关权利归各自权利人所有，仅作非商业娱乐用途。</p>
    <p>© 2026 北建奶龙大学 · 非官方站点</p>
  </div>
</footer>
```

- [ ] **Step 3: 写样式**

Append:

```css
.admission { display: grid; grid-template-columns: .9fr 1.1fr; gap: 56px; align-items: start; }
.card-form { display: grid; gap: 10px; max-width: 440px; }
.card-form label { font-weight: 600; font-size: 14px; }
.card-form input, .card-form select { width: 100%; min-height: 46px; padding: 0 12px; border: 1px solid var(--line); background: var(--white); color: var(--ink); border-radius: 2px; }
.form-error { min-height: 24px; margin: 0; color: #A4262C; font-size: 13px; }
.form-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-outline { border-color: var(--purple-700); color: var(--purple-700); background: transparent; }
.btn-outline:hover { background: var(--purple-100); }
.btn[disabled] { opacity: .45; cursor: not-allowed; }
.card-preview { min-height: 340px; display: grid; place-items: center; background: var(--white); border: 1px dashed var(--line); padding: 24px; }
.card-preview svg { width: 100%; height: auto; }
.card-placeholder { color: var(--ink-soft); text-align: center; }
.faq { max-width: 860px; }
.faq details { border-top: 1px solid var(--line); padding: 18px 0; }
.faq details:last-child { border-bottom: 1px solid var(--line); }
.faq summary { cursor: pointer; font-weight: 600; color: var(--purple-900); }
.faq details p { margin: 12px 0 0; color: var(--ink-soft); }
.site-footer { background: var(--purple-900); color: #fff; padding: 64px 0 28px; }
.footer-top { display: grid; grid-template-columns: 1.2fr 1fr .8fr; gap: 40px; padding-bottom: 36px; border-bottom: 1px solid rgba(255,255,255,.18); }
.footer-brand { display: flex; gap: 14px; align-items: center; }
.footer-brand strong { font-family: var(--serif); font-size: 22px; }
.footer-brand p { margin: 4px 0 0; color: rgba(255,255,255,.66); font-size: 13px; }
.footer-col h3 { margin: 0 0 10px; font-size: 13px; letter-spacing: .12em; color: var(--yellow-500); }
.footer-col p { margin: 0 0 8px; font-size: 13px; color: rgba(255,255,255,.72); }
.footer-col a { color: #fff; }
.footer-bottom { padding-top: 22px; }
.footer-bottom p { margin: 0 0 8px; font-size: 12px; color: rgba(255,255,255,.52); max-width: 100ch; }
```

- [ ] **Step 4: 写纪念卡交互**

Append to `app.js` inside the IIFE:

```js
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
      URL.revokeObjectURL(url);
    });
  }
```

Change the init call at the bottom to:

```js
  function init() {
    initDialogs();
    initCard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
```

- [ ] **Step 5: 验证纪念卡**

刷新，输入昵称、选择学院、点击生成。Expected: 预览出现 SVG；「下载 SVG」可下载；空昵称显示「请填写昵称」；输入 `<奶龙>` 时预览文字正常显示且不破坏图形。运行 `node --test tests/card.test.cjs`，Expected: 5 tests PASS。

---

## Task 9: 导航、筛选、移动端与动效

**Files:**
- Modify: `北建奶龙大学/app.js`
- Modify: `北建奶龙大学/styles.css`

- [ ] **Step 1: 写新闻筛选与移动导航**

Append inside the IIFE:

```js
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

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      });
    });
  }

  function initBackToTop() {
    var button = document.getElementById("back-to-top");
    if (!button) return;
    function update() { button.hidden = window.scrollY < 600; }
    window.addEventListener("scroll", update, { passive: true });
    update();
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
```

Update `init()`:

```js
  function init() {
    initDialogs();
    initCard();
    initNewsFilter();
    initNav();
    initBackToTop();
    initSectionSpy();
  }
```

- [ ] **Step 2: 加回到顶部按钮**

Insert before `</body>`:

```html
<button class="back-to-top" id="back-to-top" type="button" hidden>回到顶部 ↑</button>
```

- [ ] **Step 3: 写响应式与动效样式**

Append:

```css
.nav-toggle {
  display: none; align-items: center; gap: 8px; padding: 8px 12px;
  border: 1px solid var(--line); background: var(--white); color: var(--purple-900); cursor: pointer;
}
.nav-toggle-bar, .nav-toggle-bar::before, .nav-toggle-bar::after {
  display: block; width: 18px; height: 2px; background: currentColor; content: "";
}
.nav-toggle-bar { position: relative; }
.nav-toggle-bar::before { position: absolute; top: -6px; }
.nav-toggle-bar::after { position: absolute; top: 6px; }
.back-to-top {
  position: fixed; right: 20px; bottom: 20px; z-index: 40;
  padding: 10px 16px; border: 1px solid var(--purple-700); border-radius: 2px;
  background: var(--white); color: var(--purple-700); cursor: pointer; box-shadow: var(--shadow);
}
body.nav-open { overflow: hidden; }

@media (max-width: 1024px) {
  .college-grid, .news-grid, .campus-grid { grid-template-columns: repeat(2, 1fr); }
  .about-grid, .split, .admission { grid-template-columns: 1fr; }
  .stats { grid-template-columns: repeat(3, 1fr); }
  .stat:nth-child(3) { border-right: 0; }
}

@media (max-width: 860px) {
  .utility { display: none; }
  .nav-toggle { display: inline-flex; }
  .site-nav {
    display: none; position: absolute; left: 0; right: 0; top: 100%;
    background: var(--white); border-bottom: 1px solid var(--line);
    padding: 12px 20px 20px; flex-direction: column; gap: 0;
    max-height: calc(100vh - 80px); overflow: auto;
  }
  .site-nav.is-open { display: flex; }
  .site-nav a { padding: 12px 0; border-bottom: 1px solid var(--line); }
  .masthead-inner { position: relative; }
  .hero { min-height: 540px; }
  .hero-inner { padding: 88px 0 56px; }
  .section { padding: 64px 0; }
  .footer-top { grid-template-columns: 1fr; gap: 28px; }
}

@media (max-width: 600px) {
  .wrap { width: calc(100% - 32px); }
  .college-grid, .news-grid, .campus-grid { grid-template-columns: 1fr; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .stat { border-bottom: 1px solid var(--line); }
  .stat:nth-child(2n) { border-right: 0; }
  .notice-list li { grid-template-columns: 38px 1fr; }
  .notice-list em { grid-column: 2; justify-self: start; }
  .ticker time { display: none; }
  .card-preview { min-height: 240px; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}

@media print {
  .site-header, .ticker, .filters, .card-form, .back-to-top, .site-footer { display: none; }
  body { background: #fff; }
  .section { padding: 24px 0; }
}
```

- [ ] **Step 4: 验证**

刷新。Expected: 768px 宽度下导航变汉堡；筛选按钮工作；滚动 600px 后出现回到顶部；开启系统「减少动态效果」后无平滑滚动。

---

## Task 10: 静态自检脚本与最终验收

**Files:**
- Create: `scripts/check-site.mjs`

- [ ] **Step 1: 写自检脚本**

Create `scripts/check-site.mjs`:

```js
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve("北建奶龙大学");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const errors = [];

const requiredIds = ["home", "about", "colleges", "news", "notices", "research", "campus", "admission", "faq"];
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) errors.push(`missing id: ${id}`);
}

const images = [...html.matchAll(/src="(assets\/images\/[^"]+)"/g)].map((m) => m[1]);
for (const image of new Set(images)) {
  if (!existsSync(resolve(root, image))) errors.push(`missing image: ${image}`);
}

const external = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)]
  .map((m) => m[1])
  .filter((url) => !url.startsWith("https://www.bucea.edu.cn/"));
if (external.length) errors.push(`unexpected external assets: ${external.join(", ")}`);

for (const token of ["实事求是", "精益求精", "1907", "展览馆路 1 号", "永源路 15 号", "非官方"]) {
  if (!html.includes(token)) errors.push(`missing required content: ${token}`);
}

if (/<img\b(?![^>]*\balt=)/.test(html)) errors.push("found img without alt");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("check-site: OK");
```

- [ ] **Step 2: 运行语法与结构检查**

Run:
```powershell
node --check '北建奶龙大学\app.js'
node --check '北建奶龙大学\assets\card.js'
node --test tests/card.test.cjs
node scripts/check-site.mjs
```
Expected: `node --check` 无输出；5 tests PASS；`check-site: OK`。

- [ ] **Step 3: 浏览器三档验收**

Run:
```powershell
python -m http.server 8765
```
依次检查：
- 1440×900：Hero、5 个数据项、3 列新闻、3 列校园卡、页脚三列。
- 768×1024：导航变汉堡；新闻与学院 2 列；无横向滚动。
- 390×844：全部单列；汉堡菜单可开合；纪念卡可生成并下载。

Expected: 无横向滚动、无元素重叠、无控制台报错。

- [ ] **Step 4: 功能验收**

- 点击 4 个新闻筛选按钮，卡片数量与 `aria-pressed` 同步。
- 打开 3 个校园弹窗，Esc / 关闭按钮 / 遮罩均可关闭，焦点返回。
- 纪念卡：空昵称报错；12 字可生成；13 字被 `maxlength` 拦住；下载的 SVG 可独立打开；卡号形如 `BNLU-261019-1234`。
- 关闭 JavaScript 后，正文、新闻、通知、FAQ 仍可阅读。

- [ ] **Step 5: 不自动提交**

完成验收后，向用户汇报改动清单与预览方式。**不要**执行 `git add` / `git commit` / `git push`，除非用户明确要求。

---

## 自检结果

- **Spec 覆盖**：视觉系统 → Task 2/3/9；信息架构 → Task 3–8；真实事实 → Task 4；新闻/通知/活动 → Task 5；校园导览 → Task 6；纪念卡 → Task 7/8；FAQ/免责声明 → Task 8；无障碍/SEO/性能 → Task 2/3/9/10；Seedream 图片 → Task 1。
- **占位符**：无 TBD/TODO；所有代码步骤均给出可执行代码。
- **类型/命名一致性**：`BNLUCard.normalizeNickname`、`makeSerial`、`buildCardSvg`、`escapeXml` 在 Task 7/8 中命名一致；`data-filter` / `data-dialog` / `data-college` 与 JS 选择器一致。
- **已知边界**：`card.js` 在 Node 中调用 `crypto.getRandomValues` 时由测试传入固定随机数组；浏览器中由 Web Crypto 提供。
