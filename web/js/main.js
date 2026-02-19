import { CONFIG } from "./config.js";
import {
  createBouncingTextState,
  computeFontSize,
  randomVividColor,
  stepBouncingText,
  updateBounds,
} from "./flags.js";
import { createSimplexNoise } from "./noise.js";

const canvas = document.getElementById("scene");
const ctx = canvas ? canvas.getContext("2d") : null;

if (!canvas || !ctx) {
  throw new Error("Canvas2D is required for this demo.");
}

const noise2D = createSimplexNoise(CONFIG.seed);

let width = 0;
let height = 0;
let dpr = 1;
let bgCols = 0;
let bgRows = 0;
let state = createBouncingTextState(CONFIG.text, window.innerWidth, window.innerHeight);
let lastTime = performance.now();

function resize() {
  dpr = Math.max(1, window.devicePixelRatio || 1);
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  bgCols = Math.ceil(width / CONFIG.bgCellSize);
  bgRows = Math.ceil(height / CONFIG.bgCellSize);

  state.size = computeFontSize(CONFIG.text, width, height);
  updateBounds(ctx, state, CONFIG.text);
  state.x = Math.min(Math.max(0, state.x), Math.max(0, width - state.width));
  state.y = Math.min(Math.max(state.ascent, state.y), Math.max(state.ascent, height - state.descent));
}

function drawNoiseBackground(timeSeconds) {
  for (let gy = 0; gy < bgRows; gy += 1) {
    for (let gx = 0; gx < bgCols; gx += 1) {
      const nx = gx * CONFIG.bgCellSize * CONFIG.noiseScale;
      const ny = gy * CONFIG.bgCellSize * CONFIG.noiseScale;
      const value = noise2D(nx + timeSeconds * CONFIG.noiseSpeed, ny + timeSeconds * CONFIG.noiseSpeed);
      const normalized = Math.max(0, Math.min(1, value * 0.5 + 0.5));
      const hue = 190 + normalized * 90;
      const light = 10 + normalized * 40;
      ctx.fillStyle = `hsl(${hue} 75% ${light}%)`;
      ctx.fillRect(
        gx * CONFIG.bgCellSize,
        gy * CONFIG.bgCellSize,
        CONFIG.bgCellSize + 1,
        CONFIG.bgCellSize + 1,
      );
    }
  }
}

function drawText() {
  ctx.font = `${CONFIG.text.fontWeight} ${state.size}px ${CONFIG.text.fontFamily}`;
  ctx.fillStyle = state.color;
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 14;
  ctx.fillText(CONFIG.text.value, state.x, state.y);
  ctx.shadowBlur = 0;
}

function tick(now) {
  const dt = Math.min(0.04, (now - lastTime) / 1000);
  lastTime = now;

  drawNoiseBackground(now / 1000);
  stepBouncingText(state, dt, width, height);
  drawText();

  requestAnimationFrame(tick);
}

function changeTextColor(event) {
  event.preventDefault();
  state.color = randomVividColor();
}

canvas.addEventListener("pointerdown", changeTextColor);
window.addEventListener("resize", resize);

resize();
requestAnimationFrame((now) => {
  lastTime = now;
  tick(now);
});
