function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function seed() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a) {
  return function rand() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

export function createSimplexNoise(seedValue) {
  const seedFn = xmur3(String(seedValue));
  const rng = mulberry32(seedFn());

  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) p[i] = i;
  for (let i = 255; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }

  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i += 1) perm[i] = p[i & 255];

  const grads = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  return function noise2D(x, y) {
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const x0 = x - (i - t);
    const y0 = y - (j - t);

    let i1 = 0;
    let j1 = 0;
    if (x0 > y0) i1 = 1;
    else j1 = 1;

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;

    const ii = i & 255;
    const jj = j & 255;

    const gi0 = perm[ii + perm[jj]] & 7;
    const gi1 = perm[ii + i1 + perm[jj + j1]] & 7;
    const gi2 = perm[ii + 1 + perm[jj + 1]] & 7;

    const n0 = corner(gi0, x0, y0, grads);
    const n1 = corner(gi1, x1, y1, grads);
    const n2 = corner(gi2, x2, y2, grads);

    return 70 * (n0 + n1 + n2);
  };
}

function corner(gradIndex, x, y, grads) {
  const t = 0.5 - x * x - y * y;
  if (t < 0) return 0;
  const t2 = t * t;
  const g = grads[gradIndex];
  return t2 * t2 * (g[0] * x + g[1] * y);
}
