// 静态数据打底：抓取自 https://api.github.com/users/Piggywu981/repos （2026-10-12，21 条）
// 新增/删除仓库或上线新演示后，改这里即可；页面加载时 app.js 会用 API 增量刷新 star 与更新时间。
// 末条 piggywu981.github.io 是本站自身源码，带 self 标记，不占用在线演示位（站点尚未发布）。
window.PROJECTS = [
  {
    n: "ie-research-simulation",
    t: "ERP 沙盘模拟系统",
    d: "面向创新创业实践课程的企业运营模拟软件，覆盖建厂、生产、研发、市场与财务的完整决策流程。",
    l: "TypeScript", c: "web",
    live: "https://piggywu981.github.io/ie-research-simulation/",
    s: 5, p: "2026-10-07"
  },
  {
    n: "hikoutai-stamp",
    t: "航空自卫队风格照片打标器",
    d: "单文件网页工具，给任意图片叠上日本航空自卫队公开拦截照式的机型、高度与时间标注条。",
    l: "HTML", c: "web",
    live: "https://piggywu981.github.io/hikoutai-stamp/",
    s: 0, p: "2026-09-24"
  },
  {
    n: "MomentWebStitcher",
    t: "朋友圈长图拼接（网页版）",
    d: "浏览器内完成多张截图的垂直拼接与分组导出，免安装、纯前端。",
    l: "TypeScript", c: "web",
    live: "https://piggywu981.github.io/MomentWebStitcher/",
    s: 2, p: "2026-08-30"
  },
  {
    n: "WebClock-for-Exam",
    t: "考试网页时钟",
    d: "全屏大字显示考试剩余时间的 HTML/JS 时钟，另提供打包可执行版。",
    l: "JavaScript", c: "web",
    live: "https://piggywu981.github.io/WebClock-for-Exam/",
    rel: { tag: "v2.0.1", url: "https://github.com/Piggywu981/WebClock-for-Exam/releases/tag/v2.0.1" },
    s: 3, p: "2026-08-29"
  },
  {
    n: "AirplaneWar",
    t: "飞机大战",
    d: "HTML5 Canvas 实现的键盘操作射击小游戏。",
    l: "JavaScript", c: "web",
    live: "https://piggywu981.github.io/AirplaneWar/",
    s: 0, p: "2026-01-12"
  },
  {
    n: "ETS2LA-ThirdPartyPlugin",
    t: "ETS2LA 第三方插件合集",
    d: "为开源自动驾驶代理 ETS2LA 准备的第三方插件集合，含泊车、超车、换挡、限速等扩展与部署脚本。",
    l: "PowerShell", c: "sim",
    s: 1, p: "2026-10-07"
  },
  {
    n: "AutoParking",
    t: "自动泊车插件",
    d: "以 60Hz 向游戏下发油门、刹车、挡位与转向完成泊车动作。README 声明全部代码由 AI 生成、未经人工逐行审阅，仅靠热键中止。",
    l: "C#", c: "sim",
    s: 1, p: "2026-10-07"
  },
  {
    n: "OvertakeAssistant",
    t: "超车辅助插件",
    d: "复用既有打灯变道流程来协调超车，不改动寻路、车道保持与自适应巡航。",
    l: "C#", c: "sim",
    s: 1, p: "2026-09-27"
  },
  {
    n: "SequentialAutoShift",
    t: "序列变速箱自动换挡插件",
    d: "读取车辆遥测并发送升挡/降挡脉冲，采用保守策略完成序列箱自动换挡。",
    l: "C#", c: "sim",
    s: 1, p: "2026-09-27"
  },
  {
    n: "SpeedLimitUnlocker",
    t: "限速解锁插件",
    d: "阻止道路限速把全局 ACC 目标速度重置回当前路段限制，让巡航保持设定值。",
    l: "C#", c: "sim",
    s: 1, p: "2026-09-27"
  },
  {
    n: "Copyleft",
    t: "semi-utils 图形界面版",
    d: "把命令行的 semi-utils 迁移成 PyQt5 GUI，批量为照片添加水印、阴影与白边，支持多种布局。",
    l: "Python", c: "img",
    rel: { tag: "v2.6.0", url: "https://github.com/Piggywu981/Copyleft/releases/tag/v2.6.0" },
    up: "https://github.com/leslievan/semi-utils",
    s: 1, p: "2026-08-28"
  },
  {
    n: "MomentStitcher",
    t: "朋友圈长图拼接（桌面版）",
    d: "拖拽式的长图拼接工具，按图片数量智能分组、批量处理并实时显示进度。",
    l: "Python", c: "img",
    s: 1, p: "2025-07-29"
  },
  {
    n: "WeChatBot_WXAUTO_SE-4.1.2",
    t: "微信聊天机器人（改造版）",
    d: "在原 KouriChat 基础上改造，通过 wxautox 收发微信消息并调用 DeepSeek、GPT 等模型生成回复。",
    l: "Python", c: "auto",
    up: "https://github.com/KouriChat/KouriChat",
    s: 4, p: "2026-03-25"
  },
  {
    n: "uXuexitongJS",
    t: "学习通刷课脚本（复刻）",
    d: "支持后台播放、倍速与自动答题的学习通自动化脚本复刻仓库。",
    l: "Rust", c: "auto", fork: true,
    up: "https://github.com/unraous/uxuescript",
    s: 0, p: "2026-09-13"
  },
  {
    n: "ETS2LA",
    t: "ETS2LA 主程序（复刻）",
    d: "基于插件的 ETS2/ATS 接口程序，自动驾驶框架本体。",
    l: null, c: "sim", fork: true,
    up: "https://github.com/ETS2LA/ETS2LA", site: "http://ets2la.com/",
    s: 0, p: "2026-08-30"
  },
  {
    n: "semi-utils",
    t: "照片参数写入工具（复刻）",
    d: "批量把相机机型与拍摄参数写入照片的命令行工具复刻。",
    l: "Python", c: "img", fork: true,
    up: "https://github.com/leslievan/semi-utils", site: "https://lsvm.xyz/2023/02/semi-utils-intro/",
    s: 0, p: "2026-08-19"
  },
  {
    n: "fake-type",
    t: "VS Code 演示助手（复刻）",
    d: "预先备好代码与终端输出，演示时乱打键盘也能按脚本逐字呈现。",
    l: null, c: "auto", fork: true,
    s: 0, p: "2026-01-30"
  },
  {
    n: "modmaps",
    t: "ETS2/ATS 网页地图（复刻）",
    d: "为 ETS2LA 提供欧洲与美国卡车模拟网页地图。",
    l: "TypeScript", c: "sim", fork: true,
    s: 1, p: "2026-06-20"
  },
  {
    n: "solidworks-automation-skill",
    t: "SolidWorks 自动化（复刻）",
    d: "通过 Python COM 接口自动化零件建模、装配、工程图出图、钣金、焊件与 FEA 仿真。",
    l: null, c: "auto", fork: true,
    s: 0, p: "2026-03-17"
  },
  {
    n: "Wallpaper-24h",
    t: "24 小时壁纸切换（复刻）",
    d: "按当前小时切换 Windows 桌面壁纸并做淡入淡出过渡，支持托盘与休眠恢复刷新。",
    l: "C", c: "auto", fork: true,
    s: 1, p: "2026-03-26"
  },
  {
    n: "piggywu981.github.io",
    t: "本站源码",
    d: "这个入口站自身的仓库：纯静态 HTML/CSS/JS，无框架、无构建步骤。仓库已建但尚未推送，站点还未发布。",
    l: "HTML", c: "web", self: true,
    s: 0, p: "2026-10-12"
  }
];

// 分类名称的中英文在 i18n.js 的 UI[lang].cats 里，唯一来源。

// 制作工具铭牌：版本号会显示在页脚与开机自检日志里。
// qoder / agentSdk 取自本机实测（Qoder.exe ProductVersion、QODER_AGENT_SDK_VERSION）。
// modelVersion 没有可靠来源，留空则不显示；确认后填入，例如 "2507"。
window.META = {
  qoder: "1.0.1",
  agentSdk: "1.0.50",
  model: "qwen3.8-flash",
  modelVersion: ""
};
