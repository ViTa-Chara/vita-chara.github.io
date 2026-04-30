const canvas = document.querySelector("#matrixRain");
const context = canvas.getContext("2d");
const glyphs = "薛若米昊通机械VITACHARA010101HTWALLPAPERBILIBILI音MADQZONE";
let columns = [];
let columnWidth = 18;
let pointerBurst = 0;
let transitionTimer;

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
    columns[index] = y > window.innerHeight + Math.random() * 900 ? 0 : y + columnWidth + pointerBurst;
  });

  pointerBurst = Math.max(0, pointerBurst - 0.2);
  requestAnimationFrame(drawMatrix);
}

function writeLog(lines) {
  const output = document.querySelector("#signalLog");
  if (!output) return;
  output.textContent = lines.join("\n");
}

document.querySelectorAll(".node-card, .repo-card").forEach((card) => {
  card.addEventListener("mouseenter", () => card.classList.add("is-lit"));
  card.addEventListener("mouseleave", () => card.classList.remove("is-lit"));
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${(-y * 9).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(x * 9).toFixed(2)}deg`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" });
    pointerBurst = 7;
  });
});

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

function runPageTransition(target) {
  clearTimeout(transitionTimer);
  document.body.classList.add("is-transitioning");
  pointerBurst = 16;
  transitionTimer = setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${target.id || "top"}`);
  }, 210);
  setTimeout(() => document.body.classList.remove("is-transitioning"), 820);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    const target = id === "#top" ? document.querySelector("#top") : document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    runPageTransition(target);
  });
});

const sections = [...document.querySelectorAll(".page-section")];
const navLinks = [...document.querySelectorAll(".top-nav a")];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle("is-visible", entry.isIntersecting);
    if (entry.isIntersecting) {
      const id = entry.target.id ? `#${entry.target.id}` : "#top";
      navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === id));
    }
  });
}, { threshold: 0.34, rootMargin: "-12% 0px -42% 0px" });

sections.forEach((section) => observer.observe(section));
document.querySelector(".hero")?.classList.add("is-visible");

window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawMatrix();
