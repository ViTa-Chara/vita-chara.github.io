// ============================================================
//  HAOTONG ATLAS — Dynamic Script
//  Matrix rain + live data + status ticker + easter eggs
// ============================================================

const canvas = document.querySelector("#matrixRain");
const context = canvas.getContext("2d");
const glyphs = "薛若米昊通机械VITACHARA010101HTWALLPAPERBILIBILI音MADQZONE";
let columns = [];
let columnWidth = 18;
let pointerBurst = 0;
let matrixSpeedMultiplier = 1; // easter-egg adjustable

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  columns = Array.from({ length: Math.ceil(window.innerWidth / columnWidth) }, () => Math.random() * -60);
}

function drawMatrix() {
  context.fillStyle = "rgba(0, 0, 0, 0.13)";
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  context.font = "14px monospace";
  context.fillStyle = pointerBurst > 0 ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.72)";

  columns.forEach((y, index) => {
    const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
    const x = index * columnWidth;
    context.fillText(glyph, x, y);
    columns[index] = y > window.innerHeight + Math.random() * 900 ? 0 : y + (columnWidth + pointerBurst) * matrixSpeedMultiplier;
  });

  pointerBurst = Math.max(0, pointerBurst - 0.2);
  requestAnimationFrame(drawMatrix);
}

function writeLog(lines) {
  const output = document.querySelector("#signalLog");
  if (!output) return;
  output.textContent = lines.join("\n");
}

// ---- Existing: card hover ----
document.querySelectorAll(".node-card, .repo-card").forEach((card) => {
  card.addEventListener("mouseenter", () => card.classList.add("is-lit"));
  card.addEventListener("mouseleave", () => card.classList.remove("is-lit"));
});

// ---- Existing: jump buttons ----
document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" });
    pointerBurst = 7;
  });
});

// ---- Existing: repo filters ----
document.querySelectorAll(".repo-filter").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.repoFilter;
    document.querySelectorAll(".repo-filter").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll(".repo-card").forEach((card) => {
      const visible = filter === "all" || card.dataset.kind.split(" ").includes(filter);
      card.classList.toggle("is-hidden", !visible);
    });
    pointerBurst = 5;
  });
});

// ---- Existing: sample board ----
const sampleLogs = {
  "big-brother": [
    "> inspect_sample --node big_brother",
    "> source: B站主页可见标题《碎核音乐中的Big Brother采样：》",
    "> direction: 音乐采样 / 梗素材拆解 / 音 MAD 语境",
    "> status: highlighted"
  ],
  "liar-nasa": [
    "> inspect_sample --node liar_nasa",
    "> source: B站主页可见标题《Liar NASA》",
    "> direction: 角色图像、节奏切片、视觉重复",
    "> status: highlighted"
  ],
  apollo: [
    "> inspect_sample --node apollo_after_liar_nasa",
    "> source: B站主页可见标题《\"Apollo\". After Liar NASA...》",
    "> direction: 系列延展 / 音画后续实验",
    "> status: highlighted"
  ],
  hearing: [
    "> inspect_sample --node hearing_test",
    "> source: B站主页可见标题《做听力》",
    "> direction: 短梗、听觉错位、信息压缩",
    "> status: highlighted"
  ],
  city: [
    "> inspect_sample --node nanjing_machine_road_home",
    "> source: B站主页可见标题《南京、机械、路和家》",
    "> direction: 生活影像 / 城市路径 / 昊通机械语义",
    "> status: highlighted"
  ],
  contest: [
    "> inspect_sample --node new_star_plan",
    "> source: B站主页可见《新星计划 参赛作品》",
    "> direction: 参赛作品、系列表达、公开投稿入口",
    "> status: highlighted"
  ]
};

document.querySelectorAll(".sample-board button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".sample-board button").forEach((item) => item.classList.toggle("is-active", item === button));
    writeLog(sampleLogs[button.dataset.sample] || ["> node_missing"]);
    pointerBurst = 9;
  });
});

// ---- Existing: meme cards ----
document.querySelectorAll(".meme-card").forEach((button) => {
  button.addEventListener("click", () => {
    const preview = document.querySelector("#memePreview");
    const title = document.querySelector("#memeTitle");
    const desc = document.querySelector("#memeDesc");
    const log = document.querySelector("#memeLog");

    document.querySelectorAll(".meme-card").forEach((item) => item.classList.toggle("is-active", item === button));
    preview.src = button.dataset.src;
    preview.alt = `${button.dataset.title}表情包预览`;
    title.textContent = button.dataset.title;
    desc.textContent = button.dataset.desc;
    log.textContent = [
      `> meme_node selected: ${button.querySelector("span").textContent.toLowerCase()}`,
      `> suffix_status: ${button.dataset.status}`,
      "> matrix_filter: active",
      "> reaction_layer: injected"
    ].join("\n");
    pointerBurst = 12;
  });
});

// ---- Existing: cursor scan ----
window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawMatrix();

// ============================================================
//  NEW: Live Data Fetching
// ============================================================

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function cacheGet(key) {
  try {
    const entry = JSON.parse(localStorage.getItem(`haotong_${key}`));
    if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  } catch (_) { /* ignore */ }
  return null;
}

function cacheSet(key, data) {
  try {
    localStorage.setItem(`haotong_${key}`, JSON.stringify({ ts: Date.now(), data }));
  } catch (_) { /* ignore */ }
}

function formatNumber(n) {
  if (n == null || isNaN(n)) return "--";
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

async function fetchJSON(url, cacheKey) {
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cacheSet(cacheKey, data);
    return data;
  } catch (err) {
    console.warn(`[昊通] fetch failed: ${url} — ${err.message}`);
    return null;
  }
}

async function fetchGitHubData() {
  const user = await fetchJSON("https://api.github.com/users/ViTa-Chara", "github_user");
  const repos = await fetchJSON("https://api.github.com/users/ViTa-Chara/repos?per_page=100&sort=pushed", "github_repos");

  const publicRepos = user?.public_repos ?? null;
  const ownedRepos = Array.isArray(repos) ? repos.filter(r => !r.fork).length : null;
  const stars = Array.isArray(repos) ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0) : null;

  return { publicRepos, ownedRepos, stars, user, repos };
}

async function fetchBilibiliData() {
  const card = await fetchJSON(
    "https://api.bilibili.com/x/web-interface/card?mid=204339779",
    "bili_card"
  );
  const upstat = await fetchJSON(
    "https://api.bilibili.com/x/space/upstat?mid=204339779",
    "bili_upstat"
  );
  const relation = await fetchJSON(
    "https://api.bilibili.com/x/relation/stat?vmid=204339779",
    "bili_relation"
  );

  const follower = card?.data?.follower ?? relation?.data?.follower ?? null;
  const following = card?.data?.following ?? relation?.data?.following ?? null;
  const archiveCount = upstat?.data?.archive?.view ?? null;
  const likes = upstat?.data?.likes ?? null;
  const totalViews = upstat?.data?.archive?.view
    ? null // upstat doesn't have total views, just archive view count
    : null;

  return { follower, following, archiveCount, likes, totalViews };
}

// ============================================================
//  NEW: Dynamic UI Updates
// ============================================================

async function updateLiveMetrics() {
  const [gh, bili] = await Promise.all([fetchGitHubData(), fetchBilibiliData()]);

  // Hero metrics
  if (gh.publicRepos != null) {
    const el = document.querySelector("#metricRepos");
    if (el) el.textContent = gh.publicRepos;
  }
  if (bili.archiveCount != null) {
    const el = document.querySelector("#metricVideos");
    if (el) el.textContent = bili.archiveCount;
  }
  if (bili.likes != null) {
    const el = document.querySelector("#metricLikes");
    if (el) el.textContent = formatNumber(bili.likes);
  }

  // Bilibili stat grid
  if (bili.following != null) {
    const el = document.querySelector("#biliFollowing");
    if (el) el.textContent = bili.following;
  }
  if (bili.follower != null) {
    const el = document.querySelector("#biliFollowers");
    if (el) el.textContent = formatNumber(bili.follower);
  }
  if (bili.likes != null) {
    const el = document.querySelector("#biliLikes");
    if (el) el.textContent = formatNumber(bili.likes);
  }
  // Views aren't directly available from upstat; keep static fallback
  // but we can try to sum archive view count
  if (bili.totalViews != null) {
    const el = document.querySelector("#biliViews");
    if (el) el.textContent = formatNumber(bili.totalViews);
  }

  // Status ticker
  if (gh.stars != null) {
    const el = document.querySelector("#tickerGitHub");
    if (el) el.textContent = `★ ${gh.stars}`;
  }
  if (bili.follower != null) {
    const el = document.querySelector("#tickerBili");
    if (el) {
      const f = typeof bili.follower === "number" ? formatNumber(bili.follower) : bili.follower;
      el.textContent = `粉 ${f}`;
    }
  }

  // Update footer date to today
  const footerDate = document.querySelector("#footerDate");
  if (footerDate) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    footerDate.textContent = `${yyyy}-${mm}-${dd}`;
  }

  // Subtle indicator: metrics are now live
  document.querySelectorAll(".hero-metrics button").forEach(btn => {
    btn.title = btn.title || "Live data";
  });
}

// ============================================================
//  NEW: Status Ticker (clock + uptime + rotating signals)
// ============================================================

const signalMessages = [
  "昊通矩阵扫描中...",
  "信号强度：█▇▆▅ 稳定",
  "B站内容流在线接收",
  "GitHub提交记录同步完成",
  "QQ空间档案已归档",
  "音MAD采样器就绪",
  "HTWallpaper守护进程运行中",
  "维他柠檬茶库存：充足 ✓",
  "昊通机械系统一切正常",
  "正在捕捉新信号源...",
  "薛若米 — 在线",
  "矩阵节点扩展就绪",
  "LIVE DATA STREAM ACTIVE",
  "昊通地图持续编译中",
];

let signalIndex = 0;
let pageLoadTime = Date.now();

function padTime(n) {
  return String(Math.floor(n)).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  const hh = padTime(now.getHours());
  const mm = padTime(now.getMinutes());
  const ss = padTime(now.getSeconds());

  const clockEl = document.querySelector("#tickerClock");
  if (clockEl) clockEl.textContent = `${hh}:${mm}:${ss} CST`;

  // Uptime
  const uptimeSec = Math.floor((Date.now() - pageLoadTime) / 1000);
  const uh = padTime(uptimeSec / 3600);
  const um = padTime((uptimeSec % 3600) / 60);
  const us = padTime(uptimeSec % 60);
  const uptimeEl = document.querySelector("#tickerUptime");
  if (uptimeEl) uptimeEl.textContent = `${uh}:${um}:${us}`;
}

function rotateSignal() {
  signalIndex = (signalIndex + 1) % signalMessages.length;
  const el = document.querySelector("#tickerSignal");
  if (el) el.textContent = signalMessages[signalIndex];
}

// ============================================================
//  NEW: Easter Egg — Toast Notification
// ============================================================

let toastTimer = null;

function showToast(text, bigText = "", duration = 3500) {
  const toast = document.querySelector("#eeToast");
  if (!toast) return;

  if (toastTimer) clearTimeout(toastTimer);

  if (bigText) {
    toast.innerHTML = `<span class="toast-big">${bigText}</span>${text}`;
  } else {
    toast.textContent = text;
  }

  toast.hidden = false;
  toast.classList.add("is-visible");

  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => { toast.hidden = true; }, 350);
  }, duration);
}

// ============================================================
//  NEW: Easter Egg — Konami Code
// ============================================================

const konamiSequence = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA"
];

let konamiBuffer = [];

function checkKonami(e) {
  konamiBuffer.push(e.code);
  if (konamiBuffer.length > konamiSequence.length) {
    konamiBuffer = konamiBuffer.slice(-konamiSequence.length);
  }

  if (konamiBuffer.length === konamiSequence.length &&
      konamiBuffer.every((k, i) => k === konamiSequence[i])) {
    activateKonami();
    konamiBuffer = [];
  }
}

function activateKonami() {
  showToast("矩阵核心已解锁，信号强度提升至极限", "昊通矩阵解锁");

  // Dramatic matrix speed boost
  pointerBurst = 30;
  matrixSpeedMultiplier = 2.5;

  // Restore after a few seconds
  setTimeout(() => {
    matrixSpeedMultiplier = 1;
    pointerBurst = 10;
  }, 4000);

  // Also briefly light up all node cards
  document.querySelectorAll(".node-card").forEach(card => {
    card.classList.add("is-lit");
    setTimeout(() => card.classList.remove("is-lit"), 2500);
  });
}

document.addEventListener("keydown", checkKonami);

// ============================================================
//  NEW: Easter Egg — Keyboard Shortcuts
// ============================================================

const sectionMap = {
  KeyG: "#repos",
  KeyB: "#signal",
  KeyM: "#memes",
  KeyW: "#works",
  KeyT: "#top",
};

function handleKeyboardNav(e) {
  // Don't trigger when typing in inputs
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;
  // Don't trigger with modifiers
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  // Shortcut help
  if (e.code === "Slash" && e.shiftKey) {
    e.preventDefault();
    toggleKeyboardHelp();
    return;
  }

  // Close help
  if (e.code === "Escape") {
    const help = document.querySelector("#kbHelp");
    if (help && !help.hidden) {
      help.hidden = true;
      return;
    }
  }

  // Section navigation
  const target = sectionMap[e.code];
  if (target) {
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      pointerBurst = 6;
      showToast(`导航至 ${target.replace("#", "").toUpperCase()}`, "", 1800);
    }
  }
}

document.addEventListener("keydown", handleKeyboardNav);

function toggleKeyboardHelp() {
  const help = document.querySelector("#kbHelp");
  if (!help) return;
  if (help.hidden) {
    help.hidden = false;
  } else {
    help.hidden = true;
  }
}

// Click outside help to close
document.addEventListener("click", (e) => {
  const help = document.querySelector("#kbHelp");
  if (help && !help.hidden && !help.contains(e.target) && e.target !== help) {
    help.hidden = true;
  }
});

// ============================================================
//  NEW: Easter Egg — HT Logo Rapid-Click Debug Mode
// ============================================================

let logoClicks = 0;
let logoClickTimer = null;
const LOGO_CLICK_THRESHOLD = 5;
const LOGO_CLICK_WINDOW = 2500; // ms

const brandMark = document.querySelector(".brand-mark");
if (brandMark) {
  brandMark.style.cursor = "pointer";
  brandMark.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    logoClicks++;
    if (logoClickTimer) clearTimeout(logoClickTimer);

    // Subtle feedback on each click
    brandMark.style.transform = `scale(${1 + logoClicks * 0.04})`;

    logoClickTimer = setTimeout(() => {
      if (logoClicks >= LOGO_CLICK_THRESHOLD) {
        activateDebugMode();
      }
      logoClicks = 0;
      brandMark.style.transform = "";
    }, LOGO_CLICK_WINDOW);
  });
}

function activateDebugMode() {
  document.body.classList.add("debug-mode");
  showToast("DEBUG MODE ENGAGED — 系统诊断已启动", "昊通调试模式", 4000);

  // Burst the matrix
  pointerBurst = 20;
  matrixSpeedMultiplier = 1.8;

  // Flash the brand mark
  brandMark.classList.add("bursting");
  setTimeout(() => brandMark.classList.remove("bursting"), 800);

  // Log some fake diagnostics to the signal console
  const log = document.querySelector("#signalLog");
  if (log) {
    log.textContent = [
      "> debug_mode activated via logo_rapid_click",
      `> click_count: ${logoClicks}`,
      "> matrix_speed_multiplier: 1.8x",
      "> running system diagnostics...",
      "> haotong_atlas integrity: OK",
      "> github_signal: connected",
      "> bilibili_signal: connected",
      "> qzone_archive: intact",
      "> ht_wallpaper_daemon: running",
      "> vita_lemon_tea_level: optimal",
      "> all systems nominal",
    ].join("\n");
  }

  setTimeout(() => {
    document.body.classList.remove("debug-mode");
    matrixSpeedMultiplier = 1;
  }, 5000);
}

// ============================================================
//  NEW: Easter Egg — Hidden Console Art
// ============================================================

console.log(
  "%c昊通地图 %cHAOTONG ATLAS %cvita-chara.github.io",
  "font-size:18px;color:#a8f8ff;",
  "font-size:14px;color:#f2f2f2;",
  "font-size:12px;color:#787878;"
);
console.log(
  "%c试试：↑↑↓↓←→←→BA  |  按 ? 查看快捷键  |  连点 HT 图标 5 次",
  "color:#b8b8b8;font-style:italic;"
);

// ============================================================
//  INIT: Start all dynamic features
// ============================================================

function initDynamicFeatures() {
  // Clock ticks every second
  updateClock();
  setInterval(updateClock, 1000);

  // Signal rotates every 6 seconds (first rotation at 3s)
  setTimeout(() => {
    rotateSignal();
    setInterval(rotateSignal, 6000);
  }, 3000);

  // Fetch live data
  updateLiveMetrics();
}

initDynamicFeatures();
