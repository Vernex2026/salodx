import * as THREE from "three";

/* ──────────────────────────────────────────────────────────
   Bank-card canvas texture generator.

   Each bank gets a FRONT face (brand colour + monogram + chip +
   faux card number + Saldox watermark). All cards share the
   same BACK face (Saldox brand block + magstripe).

   Output: THREE.CanvasTexture pair { front, back } per bank,
   memo-cached so React StrictMode double-mount doesn't redraw.
   ────────────────────────────────────────────────────────── */

const W = 1024; // texture width (front + back share dims)
const H = 645; // 1024 / 1.586 ≈ 645 — ISO/IEC 7810 ID-1 ratio

const BANKS = {
  mBank: {
    colorA: "#E11D48",
    colorB: "#7F0B26",
    monogram: "m",
    wordmark: "mBank",
    accentDot: "#FFFFFF",
  },
  Santander: {
    colorA: "#DC2626",
    colorB: "#5A0A06",
    monogram: "S",
    wordmark: "Santander",
    accentDot: "#FFFFFF",
  },
  ING: {
    colorA: "#F97316",
    colorB: "#7A2E04",
    monogram: "ING",
    wordmark: "ING",
    accentDot: "#FFFFFF",
  },
};

const cache = new Map();

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawChip(ctx, x, y, w, h) {
  // Body — warm gold gradient
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, "#D9B36A");
  grad.addColorStop(0.5, "#F5DA9E");
  grad.addColorStop(1, "#9B7E3F");
  ctx.fillStyle = grad;
  roundedRect(ctx, x, y, w, h, 10);
  ctx.fill();

  // Inner contact lines — etched chip detail
  ctx.strokeStyle = "rgba(0,0,0,0.32)";
  ctx.lineWidth = 2;
  // horizontal
  ctx.beginPath();
  ctx.moveTo(x + 10, y + h * 0.35);
  ctx.lineTo(x + w - 10, y + h * 0.35);
  ctx.moveTo(x + 10, y + h * 0.65);
  ctx.lineTo(x + w - 10, y + h * 0.65);
  ctx.stroke();
  // vertical
  ctx.beginPath();
  ctx.moveTo(x + w * 0.35, y + 8);
  ctx.lineTo(x + w * 0.35, y + h - 8);
  ctx.moveTo(x + w * 0.65, y + 8);
  ctx.lineTo(x + w * 0.65, y + h - 8);
  ctx.stroke();

  // Center square
  ctx.fillStyle = "rgba(0,0,0,0.20)";
  roundedRect(ctx, x + w * 0.35, y + h * 0.35, w * 0.30, h * 0.30, 3);
  ctx.fill();
}

function drawContactlessIcon(ctx, x, y, size) {
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i += 1) {
    const r = size * (0.18 + i * 0.18);
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI * 0.30, Math.PI * 0.30);
    ctx.stroke();
  }
}

function drawFront(bankKey) {
  const cfg = BANKS[bankKey];
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background — bank brand diagonal gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, cfg.colorA);
  bg.addColorStop(1, cfg.colorB);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle radial sheen — premium soft highlight, off-center
  const sheen = ctx.createRadialGradient(
    W * 0.28, H * 0.30, 20,
    W * 0.28, H * 0.30, W * 0.62
  );
  sheen.addColorStop(0, "rgba(255,255,255,0.20)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, H);

  // Inner top-left wordmark + bank monogram block
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 56px Geist, Inter, sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(cfg.wordmark, 64, 56);

  // Chip
  drawChip(ctx, 72, 230, 130, 96);

  // Contactless icon right of chip
  drawContactlessIcon(ctx, 280, 278, 48);

  // Faux card number — 4 groups, mono, slightly embossed look
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font = "600 44px ui-monospace, 'JetBrains Mono', monospace";
  ctx.letterSpacing = "4px";
  const num = bankKey === "mBank"
    ? "5471  ····  ····  8492"
    : bankKey === "Santander"
      ? "4923  ····  ····  1107"
      : "4485  ····  ····  6630";
  ctx.fillText(num, 64, 420);

  // Cardholder + valid thru row
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "500 18px Geist, Inter, sans-serif";
  ctx.fillText("VALID THRU", 64, 510);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "600 26px ui-monospace, 'JetBrains Mono', monospace";
  ctx.fillText("12/29", 64, 532);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "500 18px Geist, Inter, sans-serif";
  ctx.fillText("CARDHOLDER", 240, 510);
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "600 22px Geist, Inter, sans-serif";
  ctx.fillText("ANNA KOWALSKA", 240, 534);

  // Card-scheme placeholder (interlocking circles, generic)
  ctx.save();
  ctx.translate(W - 180, H - 110);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.30)";
  ctx.beginPath();
  ctx.arc(48, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Saldox watermark — bottom-right corner, subtle
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.font = "600 14px Geist, Inter, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("via saldox.pl", W - 64, H - 32);
  ctx.textAlign = "start";

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function drawBack() {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Dark base
  ctx.fillStyle = "#0A0C14";
  ctx.fillRect(0, 0, W, H);

  // Subtle vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * 0.6);
  vig.addColorStop(0, "rgba(255,255,255,0.05)");
  vig.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Magnetic stripe — solid band near top
  ctx.fillStyle = "#06070B";
  ctx.fillRect(0, 80, W, 96);

  // Signature strip
  ctx.fillStyle = "#F2F2F2";
  ctx.fillRect(64, 240, W * 0.55, 60);
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.font = "600 20px ui-monospace, 'JetBrains Mono', monospace";
  ctx.fillText("ANNA KOWALSKA  ····  CVV 482", 80, 268);

  // Saldox monogram + wordmark — centered low
  ctx.save();
  ctx.translate(W / 2, H * 0.66);

  // Monogram square (white "S" on white block)
  ctx.fillStyle = "#FFFFFF";
  roundedRect(ctx, -44, -44, 88, 88, 18);
  ctx.fill();
  ctx.fillStyle = "#0A0C14";
  ctx.font = "700 64px Geist, Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("S", 0, 4);

  // Wordmark below
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 40px Geist, Inter, sans-serif";
  ctx.fillText("Saldox", 0, 90);

  // Microline
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "500 18px Geist, Inter, sans-serif";
  ctx.fillText("oferta przez Saldox", 0, 124);
  ctx.restore();

  // Footer URL
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "500 16px ui-monospace, 'JetBrains Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText("saldox.pl", 64, H - 40);
  ctx.textAlign = "right";
  ctx.fillText("This card is a visual mockup", W - 64, H - 40);
  ctx.textAlign = "start";

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

let cachedBack = null;

export function getBankCardTextures(bank) {
  if (cache.has(bank)) return cache.get(bank);
  const front = drawFront(bank);
  if (!cachedBack) cachedBack = drawBack();
  const pair = { front, back: cachedBack };
  cache.set(bank, pair);
  return pair;
}

export function disposeBankCardTextures() {
  cache.forEach(({ front }) => front.dispose());
  if (cachedBack) cachedBack.dispose();
  cache.clear();
  cachedBack = null;
}
