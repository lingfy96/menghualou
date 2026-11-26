import { BOARD_RECIPES } from './config.js';
import { SoundFX } from './audio.js';

const stageEl = document.getElementById('board-stage');
const canvas = document.getElementById('board-canvas');
const ctx = canvas.getContext('2d');
const propsLayer = document.getElementById('board-props-layer');
const titleEl = document.getElementById('board-dish-title');
const gestureHint = document.getElementById('gesture-hint');
const gestureIconImg = document.getElementById('gesture-icon-img');
const semanticWrap = document.getElementById('board-semantic-steps');
const tipBubble = document.getElementById('board-tip-bubble');
const btnBoardHelp = document.getElementById('btn-board-help');
const btnFinish = document.getElementById('btn-finish-dish');

const loadedImgs = {};
function preloadImg(key, src) {
  const im = new Image();
  im.src = src;
  loadedImgs[key] = im;
}

for (const [k, r] of Object.entries(BOARD_RECIPES)) {
  preloadImg(`dish_${k}`, r.img);
}
for (const st of [
  'flour_mound', 'cake_base',
  'raw_skewers', 'roasted_skewers',
  'jar_empty', 'jar_filled',
  'pot_cold', 'pot_hot'
]) {
  preloadImg(`state_${st}`, `./assets/states/${st}.png`);
}
for (const tp of ['topping_osmanthus', 'topping_herbs', 'topping_plum', 'rock_sugar']) {
  preloadImg(`prop_${tp}`, `./assets/props/${tp}.png`);
}
for (const g of ['circle', 'paint', 'scatter', 'hold', 'swipe']) {
  preloadImg(`gesture_${g}`, `./assets/ui/gesture_${g}.png`);
}

// Offscreen canvases for real brush painting & bottom-up liquid fill masking
const maskCanvas = document.createElement('canvas');
maskCanvas.width = 360;
maskCanvas.height = 360;
const maskCtx = maskCanvas.getContext('2d');

const compCanvas = document.createElement('canvas');
compCanvas.width = 360;
compCanvas.height = 360;
const compCtx = compCanvas.getContext('2d');

const glazeCanvas = document.createElement('canvas');
glazeCanvas.width = 360;
glazeCanvas.height = 360;
const glazeCtx = glazeCanvas.getContext('2d');

let activeDishKey = null;
let stepIdx = 0;
let finished = false;
let isStepTransitioning = false;
let onDoneCb = null;

let gestureProgress = 0;
let isPointerDown = false;
let lastAngle = null;
let lastPointer = null;
let trail = [];
let particles = [];
let completedProps = new Set();
let placedToppings = [];
let paintedCells = new Set();
let sliceSplitGap = 0;
let boardRaf = null;
let lastFrameTime = 0;
let tickSoundCooldown = 0;

function resetSimulatorLayers() {
  isStepTransitioning = false;
  gestureProgress = 0;
  lastAngle = null;
  lastPointer = null;
  trail = [];
  placedToppings = [];
  paintedCells = new Set();
  sliceSplitGap = 0;
  maskCtx.clearRect(0, 0, 360, 360);
}

function resizeBoardCanvas() {
  const rect = stageEl.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeBoardCanvas);

function spawnPuffCloud(cx, cy) {
  for (let i = 0; i < 11; i++) {
    const ang = (i / 11) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
    particles.push({
      kind: 'puff',
      x: cx + Math.cos(ang) * 18, y: cy + Math.sin(ang) * 14,
      vx: Math.cos(ang) * 46, vy: Math.sin(ang) * 32 - 12,
      life: 0.68, maxLife: 0.68, size: 18 + Math.random() * 14,
      tint: i % 2 === 0 ? 'aqua' : 'warm'
    });
  }
}

function spawnParticles(x, y, kind = 'sparkle', count = 6) {
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = kind === 'wisp' ? (16 + Math.random() * 28) : (24 + Math.random() * 52);
    particles.push({
      kind,
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: kind === 'wisp' ? (Math.random() - 0.5) * 24 : Math.cos(ang) * spd,
      vy: kind === 'drop' ? (-18 - Math.random() * 26) : (kind === 'wisp' ? (-36 - Math.random() * 34) : Math.sin(ang) * spd - 22),
      life: kind === 'wisp' ? 0.95 : 0.85,
      maxLife: kind === 'wisp' ? 0.95 : 0.85,
      size: kind === 'drop' ? (5 + Math.random() * 3.5) : (7 + Math.random() * 6),
      rot: Math.random() * Math.PI
    });
  }
}

function drawPainterlyParticle(p) {
  const ratio = Math.max(0, p.life / p.maxLife);
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalAlpha = ratio * (p.kind === 'puff' ? 0.62 : 0.88);

  if (p.kind === 'puff') {
    const r = p.size * (1.35 - ratio * 0.45);
    const g = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
    if (p.tint === 'aqua') {
      g.addColorStop(0, 'rgba(248, 255, 253, 0.92)');
      g.addColorStop(0.55, 'rgba(168, 237, 228, 0.42)');
      g.addColorStop(1, 'rgba(168, 237, 228, 0)');
    } else {
      g.addColorStop(0, 'rgba(255, 252, 242, 0.92)');
      g.addColorStop(0.55, 'rgba(249, 214, 134, 0.36)');
      g.addColorStop(1, 'rgba(249, 214, 134, 0)');
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.kind === 'drop') {
    const r = p.size;
    const g = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r * 1.15);
    g.addColorStop(0, 'rgba(255, 252, 236, 0.95)');
    g.addColorStop(0.55, 'rgba(242, 194, 96, 0.82)');
    g.addColorStop(1, 'rgba(168, 237, 228, 0.25)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.35);
    ctx.quadraticCurveTo(r * 1.05, 0, 0, r * 0.95);
    ctx.quadraticCurveTo(-r * 1.05, 0, 0, -r * 1.35);
    ctx.fill();
  } else if (p.kind === 'wisp') {
    const r = p.size * (1.5 - ratio * 0.5);
    const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 1.6);
    g.addColorStop(0, 'rgba(252, 255, 254, 0.78)');
    g.addColorStop(0.6, 'rgba(186, 234, 228, 0.32)');
    g.addColorStop(1, 'rgba(186, 234, 228, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.45, r * 0.85, p.rot || 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 'sparkle': 琉璃四芒星与暖金微光
    const r = p.size * (0.65 + 0.45 * ratio);
    ctx.rotate(p.rot || 0);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.4);
    g.addColorStop(0, 'rgba(255, 252, 230, 0.96)');
    g.addColorStop(0.5, 'rgba(249, 200, 45, 0.62)');
    g.addColorStop(1, 'rgba(249, 200, 45, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 250, 230, 0.95)';
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.16, -r * 0.16, r, 0);
    ctx.quadraticCurveTo(r * 0.16, r * 0.16, 0, r);
    ctx.quadraticCurveTo(-r * 0.16, r * 0.16, -r, 0);
    ctx.quadraticCurveTo(-r * 0.16, -r * 0.16, 0, -r);
    ctx.fill();
  }
  ctx.restore();
}

function getStageMetrics() {
  const rect = stageEl.getBoundingClientRect();
  return { w: rect.width, h: rect.height, cx: rect.width / 2, cy: rect.height * 0.43 };
}

function showTipBubble(text) {
  gestureHint.textContent = text;
  tipBubble.classList.remove('faded');
  tipBubble.classList.remove('pulse-hint');
  void tipBubble.offsetWidth;
  tipBubble.classList.add('pulse-hint');
}

if (btnBoardHelp) {
  btnBoardHelp.addEventListener('click', () => {
    if (!activeDishKey) return;
    const recipe = BOARD_RECIPES[activeDishKey];
    const msg = finished ? '制作完成！请轻点右下角【出品】印章' : recipe.steps[stepIdx].hint;
    showTipBubble(msg);
  });
}

function renderPropsUI() {
  const recipe = BOARD_RECIPES[activeDishKey];
  const curStep = finished ? null : recipe.steps[stepIdx];
  propsLayer.innerHTML = '';

  for (const p of recipe.props) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'board-prop-btn';
    const isCurrent = Boolean(curStep && curStep.type === 'tap' && curStep.propId === p.id);
    const isDone = completedProps.has(p.id);

    if (isCurrent) btn.classList.add('highlight');
    else if (isDone) btn.classList.add('used');
    else btn.classList.add('locked');

    btn.innerHTML = `<img src="${p.img}" alt="${p.label}" title="${p.label}" />${isDone ? '<span class="prop-done-check">✓</span>' : ''}`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isCurrent || isStepTransitioning) return;
      isStepTransitioning = true;
      const { cx, cy } = getStageMetrics();
      btn.classList.add('flying');
      SoundFX.tapProp(stepIdx);
      setTimeout(() => {
        btn.classList.remove('flying');
        completedProps.add(p.id);
        spawnPuffCloud(cx, cy);
        advanceStep();
      }, 220);
    });
    propsLayer.appendChild(btn);
  }
}

function renderStepUI() {
  const recipe = BOARD_RECIPES[activeDishKey];
  titleEl.textContent = recipe.name;

  // Map current step index to 4 semantic stages (0, 1, 2, 3)
  const labels = recipe.semanticSteps || ['备料', '加工', '调味', '出品'];
  let activeStage = 3;
  if (!finished) {
    activeStage = recipe.steps[stepIdx].stageIndex ?? 0;
  }

  semanticWrap.innerHTML = labels.map((lbl, i) => {
    const isDone = finished ? (i < 3) : (i < activeStage);
    const isAct = finished ? (i === 3) : (i === activeStage);
    const cls = isDone ? 'sem-step done' : (isAct ? 'sem-step active' : 'sem-step');
    const sep = i < labels.length - 1 ? '<span class="sem-sep">·</span>' : '';
    return `<span class="${cls}" role="listitem">${isDone ? '✓ ' : ''}${lbl}</span>${sep}`;
  }).join('');

  if (finished) {
    if (gestureIconImg) gestureIconImg.style.display = 'none';
    showTipBubble(`${recipe.name}已备妥，请轻点右下角【出品】`);
    btnFinish.disabled = false;
    btnFinish.classList.add('ready');
  } else {
    const step = recipe.steps[stepIdx];
    const gMap = { circle: 'circle', paint: 'paint', scatter: 'scatter', hold: 'hold', slice: 'swipe', rub: 'swipe' };
    const gKey = gMap[step.type];
    if (gestureIconImg) {
      if (gKey) {
        gestureIconImg.src = `./assets/ui/gesture_${gKey}.png`;
        gestureIconImg.classList.toggle('is-vertical', step.type === 'rub');
        gestureIconImg.style.display = 'block';
      } else {
        gestureIconImg.style.display = 'none';
      }
    }
    showTipBubble(step.hint);
    btnFinish.disabled = true;
    btnFinish.classList.remove('ready');
  }
  renderPropsUI();
}

function advanceStep() {
  isStepTransitioning = false;
  const recipe = BOARD_RECIPES[activeDishKey];
  gestureProgress = 0;
  lastAngle = null;
  lastPointer = null;
  trail = [];

  if (stepIdx + 1 < recipe.steps.length) {
    stepIdx += 1;
    renderStepUI();
  } else {
    finished = true;
    SoundFX.cookDone();
    const { cx, cy } = getStageMetrics();
    spawnParticles(cx, cy, 'sparkle', 12);
    renderStepUI();
  }
}

function drawCenteredImg(targetCtx, img, x, y, maxDim) {
  if (!img || !img.complete || !img.naturalWidth) return;
  const sc = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight);
  const w = img.naturalWidth * sc;
  const h = img.naturalHeight * sc;
  targetCtx.drawImage(img, x - w / 2, y - h / 2, w, h);
}

function paintBrushAt(relX, relY, radius = 34) {
  const mx = 180 + relX;
  const my = 180 + relY;
  const grad = maskCtx.createRadialGradient(mx, my, radius * 0.2, mx, my, radius);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  maskCtx.fillStyle = grad;
  maskCtx.beginPath();
  maskCtx.arc(mx, my, radius, 0, Math.PI * 2);
  maskCtx.fill();

  if (Math.abs(relX) <= 105 && Math.abs(relY) <= 95) {
    const gx = Math.floor((relX + 105) / 30);
    const gy = Math.floor((relY + 95) / 30);
    paintedCells.add(`${gx},${gy}`);
  }
}

function drawPlacedToppings(targetCtx) {
  const mapImg = {
    osmanthus: { im: loadedImgs.prop_topping_osmanthus, size: 22 },
    herbs: { im: loadedImgs.prop_topping_herbs, size: 26 },
    plums: { im: loadedImgs.prop_topping_plum, size: 32 }
  };
  for (const t of placedToppings) {
    targetCtx.save();
    targetCtx.translate(t.x, t.y);
    targetCtx.rotate(t.rot);
    targetCtx.scale(t.scale, t.scale);
    const sprite = mapImg[t.kind];
    if (sprite && sprite.im && sprite.im.complete && sprite.im.naturalWidth) {
      drawCenteredImg(targetCtx, sprite.im, 0, 0, sprite.size);
    } else if (t.kind === 'osmanthus') {
      targetCtx.fillStyle = '#f2a829';
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        targetCtx.beginPath();
        targetCtx.ellipse(Math.cos(a) * 4, Math.sin(a) * 4, 4.5, 2.8, a, 0, Math.PI * 2);
        targetCtx.fill();
      }
      targetCtx.fillStyle = '#fff3b8';
      targetCtx.beginPath();
      targetCtx.arc(0, 0, 2.2, 0, Math.PI * 2);
      targetCtx.fill();
    } else if (t.kind === 'herbs') {
      targetCtx.fillStyle = '#4ea86b';
      targetCtx.beginPath();
      targetCtx.ellipse(0, 0, 8, 4.2, 0.3, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.fillStyle = '#e5a93c';
      targetCtx.beginPath();
      targetCtx.arc(7, 4, 2.4, 0, Math.PI * 2);
      targetCtx.arc(-6, 5, 2.1, 0, Math.PI * 2);
      targetCtx.fill();
    } else if (t.kind === 'plums') {
      const g = targetCtx.createRadialGradient(-4, -4, 2, 0, 0, 15);
      g.addColorStop(0, '#a6e896');
      g.addColorStop(0.6, '#5cb568');
      g.addColorStop(1, '#3b8254');
      targetCtx.fillStyle = g;
      targetCtx.beginPath();
      targetCtx.arc(0, 0, 15, 0, Math.PI * 2);
      targetCtx.fill();
      targetCtx.fillStyle = 'rgba(255,255,255,0.65)';
      targetCtx.beginPath();
      targetCtx.ellipse(-5, -5, 4.5, 2.6, -0.5, 0, Math.PI * 2);
      targetCtx.fill();
    }
    targetCtx.restore();
  }
}

function drawFoodOnBoard(cx, cy, nowSec) {
  const recipe = BOARD_RECIPES[activeDishKey];
  ctx.save();
  ctx.translate(cx, cy);

  if (finished) {
    const im = loadedImgs[`dish_${activeDishKey}`];
    ctx.shadowColor = 'rgba(223, 166, 66, 0.28)';
    ctx.shadowBlur = 8;
    drawCenteredImg(ctx, im, 0, 0, 215);
    ctx.restore();
    return;
  }

  // ==================== 1. 桂花糕 ====================
  if (activeDishKey === 'osmanthus_cake') {
    if (stepIdx === 1) {
      const squeeze = 1 - gestureProgress * 0.16;
      const wobble = Math.sin(nowSec * 9) * (1 - gestureProgress) * 4;
      ctx.save();
      ctx.scale(squeeze + wobble * 0.01, squeeze - wobble * 0.01);
      drawCenteredImg(ctx, loadedImgs.state_flour_mound, 0, 0, 220);
      ctx.restore();
    } else if (stepIdx >= 2) {
      compCtx.clearRect(0, 0, 360, 360);
      drawCenteredImg(compCtx, loadedImgs.state_cake_base, 180, 180, 225);

      if (stepIdx >= 3) {
        compCtx.save();
        glazeCtx.globalCompositeOperation = 'source-over';
        glazeCtx.clearRect(0, 0, 360, 360);
        glazeCtx.drawImage(maskCanvas, 0, 0);
        glazeCtx.globalCompositeOperation = 'source-in';
        const honeyGrad = glazeCtx.createLinearGradient(80, 80, 280, 280);
        honeyGrad.addColorStop(0, 'rgba(255, 214, 92, 0.72)');
        honeyGrad.addColorStop(0.5, 'rgba(238, 162, 46, 0.65)');
        honeyGrad.addColorStop(1, 'rgba(255, 226, 128, 0.75)');
        glazeCtx.fillStyle = honeyGrad;
        glazeCtx.fillRect(0, 0, 360, 360);
        compCtx.globalCompositeOperation = 'source-atop';
        compCtx.drawImage(glazeCanvas, 0, 0);
        compCtx.restore();
      }

      compCtx.save();
      compCtx.translate(180, 180);
      drawPlacedToppings(compCtx);
      compCtx.restore();

      if (stepIdx === 7) {
        const gap = sliceSplitGap;
        const quads = [
          { sx: 0, sy: 0, dx: -gap, dy: -gap },
          { sx: 180, sy: 0, dx: gap, dy: -gap },
          { sx: 0, sy: 180, dx: -gap, dy: gap },
          { sx: 180, sy: 180, dx: gap, dy: gap },
        ];
        for (const q of quads) {
          ctx.drawImage(compCanvas, q.sx, q.sy, 180, 180, q.sx - 180 + q.dx, q.sy - 180 + q.dy, 180, 180);
        }
        if (gap === 0) {
          ctx.strokeStyle = 'rgba(185, 54, 40, 0.75)';
          ctx.setLineDash([7, 5]);
          ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(-88, 0); ctx.lineTo(88, 0); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, -76); ctx.lineTo(0, 76); ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        ctx.drawImage(compCanvas, -180, -180);
      }
    }
  }

  // ==================== 2. 炙羊肉 ====================
  else if (activeDishKey === 'meat') {
    if (stepIdx >= 1) {
      drawCenteredImg(ctx, loadedImgs.state_raw_skewers, 0, 0, 245);
      if (stepIdx >= 2) {
        compCtx.clearRect(0, 0, 360, 360);
        drawCenteredImg(compCtx, loadedImgs.state_roasted_skewers, 180, 180, 245);
        compCtx.globalCompositeOperation = 'destination-in';
        compCtx.drawImage(maskCanvas, 0, 0);
        compCtx.globalCompositeOperation = 'source-over';
        ctx.drawImage(compCanvas, -180, -180);
      }
      drawPlacedToppings(ctx);
    }
  }

  // ==================== 3. 青梅酿 (100% 手绘琉璃坛 PNG + 自由投梅 + 自下而上注酒显露) ====================
  else if (activeDishKey === 'plum_wine') {
    if (stepIdx >= 1) {
      drawCenteredImg(ctx, loadedImgs.state_jar_empty, 0, 0, 235);
      if (stepIdx <= 3) {
        drawPlacedToppings(ctx);
      }
      // Step 3 (hold to pour): reveal jar_filled.png smoothly from bottom to top!
      if (stepIdx === 3) {
        compCtx.clearRect(0, 0, 360, 360);
        drawCenteredImg(compCtx, loadedImgs.state_jar_filled, 180, 180, 235);
        const clipTop = 295 - gestureProgress * 230;
        compCtx.globalCompositeOperation = 'destination-in';
        compCtx.fillStyle = '#ffffff';
        compCtx.fillRect(0, clipTop, 360, 360 - clipTop);
        compCtx.globalCompositeOperation = 'source-over';
        ctx.drawImage(compCanvas, -180, -180);
      } else if (stepIdx >= 4) {
        // Gentle stir rotation during step 6
        ctx.save();
        if (stepIdx === 6) {
          const sway = Math.sin(nowSec * 8) * 0.04;
          ctx.rotate(sway);
        }
        drawCenteredImg(ctx, loadedImgs.state_jar_filled, 0, 0, 235);
        // Watercolor rock sugar inside jar after step 5
        if (stepIdx >= 5) {
          const sugarIm = loadedImgs.prop_rock_sugar;
          if (sugarIm && sugarIm.complete && sugarIm.naturalWidth) {
            ctx.save();
            ctx.globalAlpha = 0.88;
            drawCenteredImg(ctx, sugarIm, -14, 24, 24);
            drawCenteredImg(ctx, sugarIm, 12, 30, 20);
            ctx.restore();
          } else {
            ctx.fillStyle = 'rgba(235, 248, 255, 0.85)';
            ctx.fillRect(-16, 18, 13, 13);
            ctx.fillRect(6, 24, 11, 11);
          }
        }
        ctx.restore();
      }
    }
  }

  // ==================== 4. 温酒：v46 冷壶/热壶同框交叉淡化，禁止叠画重影 ====================
  else if (activeDishKey === 'wine') {
    if (stepIdx >= 1) {
      const drawPot = (img, alpha) => {
        if (!img || !img.complete || !img.naturalWidth || alpha <= 0.001) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, -88.5, -117.5, 177, 235);
        ctx.restore();
      };
      if (stepIdx === 4) {
        const p = Math.max(0, Math.min(1, gestureProgress));
        drawPot(loadedImgs.state_pot_cold, 1 - p);
        drawPot(loadedImgs.state_pot_hot, p);
      } else if (stepIdx >= 5) {
        drawPot(loadedImgs.state_pot_hot, 1);
      } else {
        drawPot(loadedImgs.state_pot_cold, 1);
      }
    }
  }

  const curStep = recipe.steps[stepIdx];
  if (curStep && curStep.type !== 'tap' && !isPointerDown && gestureProgress < 0.05 && sliceSplitGap === 0) {
    const gMap = { circle: 'circle', paint: 'paint', scatter: 'scatter', hold: 'hold', slice: 'swipe', rub: 'swipe' };
    const gIm = loadedImgs[`gesture_${gMap[curStep.type]}`];
    if (gIm && gIm.complete && gIm.naturalWidth) {
      ctx.save();
      ctx.globalAlpha = 0.56 + 0.14 * Math.sin(nowSec * 3.6);
      const pulse = 1 + 0.04 * Math.sin(nowSec * 3.6);
      if (curStep.type === 'rub') ctx.rotate(Math.PI / 2);
      ctx.scale(pulse, pulse);
      drawCenteredImg(ctx, gIm, 0, 0, 74);
      ctx.restore();
    }
  }
  if (curStep && curStep.type !== 'tap' && sliceSplitGap === 0) {
    ctx.strokeStyle = 'rgba(185, 54, 40, 0.75)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 104, -Math.PI / 2, -Math.PI / 2 + gestureProgress * Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function renderBoardLoop(now) {
  if (!lastFrameTime) lastFrameTime = now;
  const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
  lastFrameTime = now;
  if (tickSoundCooldown > 0) tickSoundCooldown -= dt;

  const { w, h, cx, cy } = getStageMetrics();
  ctx.clearRect(0, 0, w, h);

  if (activeDishKey) {
    const recipe = BOARD_RECIPES[activeDishKey];
    const curStep = finished ? null : recipe.steps[stepIdx];
    if (isPointerDown && curStep && curStep.type === 'hold') {
      gestureProgress = Math.min(1, gestureProgress + dt * 0.72);
      if (tickSoundCooldown <= 0) {
        SoundFX.gestureTick();
        spawnParticles(cx, cy - 18, 'drop', 1);
        tickSoundCooldown = 0.22;
      }
      if (gestureProgress >= 1) {
        isPointerDown = false;
        spawnPuffCloud(cx, cy);
        advanceStep();
      }
    }

    drawFoodOnBoard(cx, cy, now * 0.001);

    if (trail.length > 1) {
      ctx.save();
      ctx.strokeStyle = 'rgba(185, 54, 40, 0.55)';
      ctx.shadowColor = 'rgba(223, 166, 66, 0.35)';
      ctx.shadowBlur = 4;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
      ctx.stroke();
      ctx.restore();
      if (!isPointerDown) trail.shift();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      drawPainterlyParticle(p);
    }
  }

  boardRaf = requestAnimationFrame(renderBoardLoop);
}

function getLocalPt(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function addToppingAt(relX, relY, kind) {
  const limitX = kind === 'plums' ? 62 : 95;
  const limitY = kind === 'plums' ? 68 : 85;
  if (Math.abs(relX) > limitX || Math.abs(relY) > limitY) return false;
  placedToppings.push({
    x: relX,
    y: kind === 'plums' ? Math.max(-10, relY) : relY,
    rot: Math.random() * Math.PI * 2,
    scale: 0.85 + Math.random() * 0.3,
    kind
  });
  return true;
}

canvas.addEventListener('pointerdown', (e) => {
  if (!activeDishKey || finished || isStepTransitioning) return;
  canvas.setPointerCapture(e.pointerId);
  isPointerDown = true;
  const pt = getLocalPt(e);
  lastPointer = pt;
  trail = [pt];
  const { cx, cy } = getStageMetrics();
  lastAngle = Math.atan2(pt.y - cy, pt.x - cx);

  const recipe = BOARD_RECIPES[activeDishKey];
  const curStep = recipe.steps[stepIdx];
  const relX = pt.x - cx;
  const relY = pt.y - cy;

  if (curStep.type === 'paint') {
    paintBrushAt(relX, relY, 36);
    gestureProgress = Math.min(1, paintedCells.size / 16);
    SoundFX.gestureTick();
  }

  if (curStep.type === 'scatter') {
    const needCount = curStep.mode === 'plums' ? 6 : 8;
    if (addToppingAt(relX, relY, curStep.mode)) {
      SoundFX.tapProp(placedToppings.length);
      gestureProgress = Math.min(1, placedToppings.length / needCount);
      if (gestureProgress >= 1) {
        isPointerDown = false;
        isStepTransitioning = true;
        spawnParticles(cx, cy, 'sparkle', 6);
        setTimeout(() => advanceStep(), 260);
      }
    }
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (!isPointerDown || !activeDishKey || finished || isStepTransitioning) return;
  const pt = getLocalPt(e);
  trail.push(pt);
  if (trail.length > 18) trail.shift();

  const recipe = BOARD_RECIPES[activeDishKey];
  const curStep = recipe.steps[stepIdx];
  const { cx, cy } = getStageMetrics();
  const relX = pt.x - cx;
  const relY = pt.y - cy;

  if (curStep.type === 'circle') {
    const ang = Math.atan2(relY, relX);
    let diff = ang - lastAngle;
    if (diff > Math.PI) diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;
    lastAngle = ang;
    gestureProgress = Math.min(1, gestureProgress + Math.abs(diff) / (Math.PI * 2.8));
    if (tickSoundCooldown <= 0 && Math.abs(diff) > 0.08) {
      SoundFX.gestureTick();
      tickSoundCooldown = 0.2;
    }
    if (gestureProgress >= 1) {
      isPointerDown = false;
      spawnPuffCloud(cx, cy);
      advanceStep();
    }
  } else if (curStep.type === 'paint') {
    paintBrushAt(relX, relY, 36);
    gestureProgress = Math.min(1, paintedCells.size / 16);
    if (tickSoundCooldown <= 0) {
      SoundFX.gestureTick();
      spawnParticles(pt.x, pt.y, 'sparkle', 1);
      tickSoundCooldown = 0.18;
    }
    if (gestureProgress >= 1) {
      isPointerDown = false;
      maskCtx.fillStyle = '#ffffff';
      maskCtx.fillRect(0, 0, 360, 360);
      spawnParticles(cx, cy, 'sparkle', 7);
      advanceStep();
    }
  } else if (curStep.type === 'scatter') {
    const needCount = curStep.mode === 'plums' ? 6 : 8;
    const dist = Math.hypot(pt.x - lastPointer.x, pt.y - lastPointer.y);
    if (dist > 28 && addToppingAt(relX, relY, curStep.mode)) {
      SoundFX.gestureTick();
      gestureProgress = Math.min(1, placedToppings.length / needCount);
      if (gestureProgress >= 1) {
        isPointerDown = false;
        isStepTransitioning = true;
        spawnParticles(cx, cy, 'sparkle', 6);
        setTimeout(() => advanceStep(), 260);
      }
    }
  } else if (curStep.type === 'rub') {
    const dist = Math.hypot(pt.x - lastPointer.x, pt.y - lastPointer.y);
    gestureProgress = Math.min(1, gestureProgress + dist / 420);
    if (tickSoundCooldown <= 0 && dist > 6) {
      SoundFX.gestureTick();
      spawnParticles(pt.x, pt.y, 'wisp', 1);
      tickSoundCooldown = 0.18;
    }
    if (gestureProgress >= 1) {
      isPointerDown = false;
      advanceStep();
    }
  } else if (curStep.type === 'slice') {
    const dist = Math.hypot(pt.x - lastPointer.x, pt.y - lastPointer.y);
    gestureProgress = Math.min(1, gestureProgress + dist / 170);
    if (gestureProgress >= 1 && sliceSplitGap === 0) {
      isPointerDown = false;
      isStepTransitioning = true;
      SoundFX.sliceCut();
      sliceSplitGap = 14;
      spawnParticles(cx, cy, 'sparkle', 8);
      setTimeout(() => {
        spawnPuffCloud(cx, cy);
        advanceStep();
      }, 580);
    }
  }
  lastPointer = pt;
});

canvas.addEventListener('pointerup', () => { isPointerDown = false; });
canvas.addEventListener('pointercancel', () => { isPointerDown = false; });

btnFinish.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!finished || !activeDishKey) return;
  btnFinish.classList.add('stamped');
  SoundFX.tapProp(4);
  const doneKey = activeDishKey;
  setTimeout(() => {
    btnFinish.classList.remove('stamped');
    stopCookingBoard();
    if (onDoneCb) onDoneCb(doneKey);
  }, 90);
});

export function startCookingBoard(dishKey, onDone) {
  activeDishKey = dishKey;
  stepIdx = 0;
  finished = false;
  completedProps = new Set();
  particles = [];
  onDoneCb = onDone;
  resetSimulatorLayers();

  resizeBoardCanvas();
  renderStepUI();

  if (boardRaf) cancelAnimationFrame(boardRaf);
  lastFrameTime = performance.now();
  boardRaf = requestAnimationFrame(renderBoardLoop);
}

export function stopCookingBoard() {
  if (boardRaf) cancelAnimationFrame(boardRaf);
  boardRaf = null;
}

export function hasBoardProgress() {
  return Boolean(activeDishKey && !finished && (stepIdx > 0 || gestureProgress > 0 || placedToppings.length > 0 || paintedCells.size > 0));
}
