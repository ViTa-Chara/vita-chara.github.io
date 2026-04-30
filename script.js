const canvas = document.querySelector("#matrixRain");
const context = canvas.getContext("2d");
const glyphs = "昊通机械VITACHARA010101HTWALLPAPERBILIBILIQZONE";
let columns = [];
let columnWidth = 18;

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
  context.fillStyle = "rgba(0, 0, 0, 0.12)";
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  context.font = "14px monospace";
  context.fillStyle = "rgba(255, 255, 255, 0.72)";

  columns.forEach((y, index) => {
    const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
    const x = index * columnWidth;
    context.fillText(glyph, x, y);
    columns[index] = y > window.innerHeight + Math.random() * 900 ? 0 : y + columnWidth;
  });

  requestAnimationFrame(drawMatrix);
}

document.querySelectorAll(".node-card").forEach((card) => {
  card.addEventListener("mouseenter", () => card.classList.add("is-lit"));
  card.addEventListener("mouseleave", () => card.classList.remove("is-lit"));
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawMatrix();
