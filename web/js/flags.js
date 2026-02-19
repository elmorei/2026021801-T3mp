export function createBouncingTextState(config, width, height) {
  const size = computeFontSize(config, width, height);
  const metrics = measure(config.value, size, config.fontWeight, config.fontFamily);

  return {
    x: Math.max(0, (width - metrics.width) * 0.5),
    y: Math.max(metrics.ascent, (height + metrics.ascent) * 0.5),
    vx: config.speedX,
    vy: config.speedY,
    color: config.initialColor,
    size,
    width: metrics.width,
    ascent: metrics.ascent,
    descent: metrics.descent,
  };
}

export function computeFontSize(config, width, height) {
  const byWidth = width * 0.16;
  const byHeight = height * 0.14;
  const preferred = Math.min(byWidth, byHeight, config.baseSize);
  return Math.round(Math.max(config.minSize, Math.min(config.maxSize, preferred)));
}

function measure(text, size, weight, family) {
  const probeCtx = document.createElement("canvas").getContext("2d");
  if (!probeCtx) {
    return {
      width: text.length * size * 0.5,
      ascent: size * 0.8,
      descent: size * 0.2,
    };
  }

  probeCtx.font = `${weight} ${size}px ${family}`;
  const m = probeCtx.measureText(text);
  return {
    width: m.width,
    ascent: m.actualBoundingBoxAscent || size * 0.8,
    descent: m.actualBoundingBoxDescent || size * 0.2,
  };
}

export function updateBounds(ctx, state, config) {
  ctx.font = `${config.fontWeight} ${state.size}px ${config.fontFamily}`;
  const m = ctx.measureText(config.value);
  state.width = m.width;
  state.ascent = m.actualBoundingBoxAscent || state.size * 0.8;
  state.descent = m.actualBoundingBoxDescent || state.size * 0.2;
}

export function stepBouncingText(state, dt, width, height) {
  state.x += state.vx * dt;
  state.y += state.vy * dt;

  if (state.x <= 0) {
    state.x = 0;
    state.vx = Math.abs(state.vx);
  } else if (state.x + state.width >= width) {
    state.x = Math.max(0, width - state.width);
    state.vx = -Math.abs(state.vx);
  }

  const top = state.y - state.ascent;
  const bottom = state.y + state.descent;

  if (top <= 0) {
    state.y = state.ascent;
    state.vy = Math.abs(state.vy);
  } else if (bottom >= height) {
    state.y = Math.max(state.ascent, height - state.descent);
    state.vy = -Math.abs(state.vy);
  }
}

export function randomVividColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue} 95% 65%)`;
}
