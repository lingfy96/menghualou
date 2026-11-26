import { OPENING_SCENES } from './config.js';
import { SoundFX } from './audio.js';

// 李白经典诗句库（用于高密度纯文字构筑宋楼飞檐与垂柳）
const LIBAI_POEM_STREAM =
  '郎骑竹马来绕床弄青梅同居长干里两小无嫌猜' +
  '君不见黄河之水天上来奔流到海不复回人生得意须尽欢莫使金樽空对月天生我材必有用千金散尽还复来' +
  '花间一壶酒独酌无相亲举杯邀明月对影成三人' +
  '兰陵美酒郁金香玉碗盛来琥珀光但使主人能醉客不知何处是他乡' +
  '忆昔娇小姿春心亦自持嫁作商人妇长年守空闺' +
  '俱怀逸兴壮思飞欲上青天揽明月抽刀断水水更流举杯消愁愁更愁' +
  '清水出芙蓉天然去雕饰云想衣裳花想容春风拂槛露华浓';

export function initOpeningCutscene(onStartGame) {
  const screen = document.getElementById('opening-screen');
  const slides = [
    document.getElementById('opening-slide-0'),
    document.getElementById('opening-slide-1'),
    document.getElementById('opening-slide-2')
  ];
  const captionBox = document.getElementById('opening-caption-box');
  const tagEl = document.getElementById('opening-tag');
  const textEl = document.getElementById('opening-text');
  const ctaBox = document.getElementById('opening-title-cta');
  const btnSkip = document.getElementById('btn-skip-opening');
  const btnReplay = document.getElementById('btn-replay-opening');
  const tapHint = document.getElementById('opening-tap-hint');
  const btnStart = document.getElementById('btn-start-game');
  const canvas = document.getElementById('opening-particles');
  const ctx = canvas.getContext('2d');

  const reduceMotion = Boolean(
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // 三幕状态：0=倾奁化瀑，1=太白诗砌楼柳，2=海棠花窗终幕
  let phase = 0;
  let phaseStart = performance.now();
  let typingTimer = null;
  let autoTimer = null;
  let rafId = null;
  let finishedIntro = false;
  let charIdx = 0;
  let cw = 390, ch = 844;

  // 1) 幕一：棋子洒出 → 水滴化瀑粒子池
  const PRISM_COLORS = ['#9ce6da', '#f7df86', '#f4b5a0', '#a9bce4'];
  const stones = Array.from({ length: 26 }, (_, i) => ({
    t: (i / 26) * 1.1,
    speed: 0.34 + (i % 5) * 0.05,
    lane: (Math.random() - 0.5) * 0.14,
    isDark: i % 2 === 0,
    color: PRISM_COLORS[i % PRISM_COLORS.length],
    size: 4.5 + (i % 4) * 1.6
  }));

  // 2) 幕二：高密度纯文字李白诗句楼影（离屏一次预渲染，零卡顿） + 垂柳字帘 + 双燕
  const pavilionCache = document.createElement('canvas');
  const pavilionCacheCtx = pavilionCache.getContext('2d');
  let willowStrands = [];
  const swallows = [
    { x: -0.1, y: 0.28, vx: 0.15, vy: -0.025, scale: 1.0, phase: 0 },
    { x: -0.22, y: 0.34, vx: 0.14, vy: -0.02, scale: 0.8, phase: 1.7 }
  ];

  // 3) 幕三：海棠花窗流光微尘
  const motes = Array.from({ length: 18 }, (_, i) => ({
    x: 0.22 + Math.random() * 0.56,
    y: Math.random(),
    r: 1.5 + Math.random() * 2.4,
    vy: 0.012 + Math.random() * 0.022,
    phase: Math.random() * Math.PI * 2,
    aqua: i % 2 === 0
  }));

  function buildLibaiPavilionGlyphs() {
    willowStrands = [];
    const w = cw, h = ch;

    // 离屏绘制二层宋代飞檐阁楼剪影，采样高密度字阵
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d');

    const cx = w * 0.52;
    const baseY = h * 0.62;
    const span = Math.min(w * 0.86, 360);

    octx.fillStyle = '#000';
    // 上层歇山飞檐屋顶（高翘双翼）
    octx.beginPath();
    octx.moveTo(cx, baseY - span * 0.64);
    octx.quadraticCurveTo(cx + span * 0.14, baseY - span * 0.44, cx + span * 0.46, baseY - span * 0.40);
    octx.quadraticCurveTo(cx + span * 0.34, baseY - span * 0.31, cx + span * 0.26, baseY - span * 0.30);
    octx.lineTo(cx - span * 0.26, baseY - span * 0.30);
    octx.quadraticCurveTo(cx - span * 0.36, baseY - span * 0.31, cx - span * 0.46, baseY - span * 0.43);
    octx.quadraticCurveTo(cx - span * 0.16, baseY - span * 0.44, cx, baseY - span * 0.64);
    octx.closePath();
    octx.fill();

    // 屋脊正吻
    octx.fillRect(cx - span * 0.03, baseY - span * 0.72, span * 0.06, span * 0.10);

    // 上层楼身四柱
    const cols = [-0.21, -0.07, 0.07, 0.21];
    for (const c of cols) {
      octx.fillRect(cx + span * c - 6, baseY - span * 0.30, 12, span * 0.16);
    }
    // 窗格横梁
    octx.fillRect(cx - span * 0.24, baseY - span * 0.22, span * 0.48, 9);

    // 下层宽阔重檐飞翼
    octx.beginPath();
    octx.moveTo(cx - span * 0.28, baseY - span * 0.15);
    octx.lineTo(cx + span * 0.28, baseY - span * 0.15);
    octx.quadraticCurveTo(cx + span * 0.42, baseY - span * 0.11, cx + span * 0.50, baseY - span * 0.16);
    octx.quadraticCurveTo(cx + span * 0.40, baseY - span * 0.02, cx + span * 0.30, baseY - span * 0.02);
    octx.lineTo(cx - span * 0.32, baseY - span * 0.02);
    octx.quadraticCurveTo(cx - span * 0.42, baseY - span * 0.03, cx - span * 0.50, baseY - span * 0.14);
    octx.quadraticCurveTo(cx - span * 0.36, baseY - span * 0.11, cx - span * 0.28, baseY - span * 0.15);
    octx.closePath();
    octx.fill();

    // 台基
    octx.fillRect(cx - span * 0.30, baseY - span * 0.02, span * 0.60, span * 0.07);

    const imgData = octx.getImageData(0, 0, w, h).data;
    const stepX = Math.max(9, Math.round(span / 34));
    const stepY = Math.max(10, Math.round(span / 31));
    let charPtr = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    pavilionCache.width = Math.max(1, Math.round(w * dpr));
    pavilionCache.height = Math.max(1, Math.round(h * dpr));
    pavilionCacheCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pavilionCacheCtx.clearRect(0, 0, w, h);
    pavilionCacheCtx.textAlign = 'center';
    pavilionCacheCtx.textBaseline = 'middle';

    for (let y = Math.floor(baseY - span * 0.74); y < Math.ceil(baseY + span * 0.08); y += stepY) {
      if (y < 0 || y >= h) continue;
      for (let x = Math.floor(cx - span * 0.52); x < Math.ceil(cx + span * 0.52); x += stepX) {
        if (x < 0 || x >= w) continue;
        const alpha = imgData[(y * w + x) * 4 + 3];
        if (alpha > 90) {
          const chChar = LIBAI_POEM_STREAM[charPtr % LIBAI_POEM_STREAM.length];
          charPtr += 1;
          const isEave = y < baseY - span * 0.30 || (y > baseY - span * 0.16 && y < baseY - span * 0.01);
          pavilionCacheCtx.fillStyle = isEave ? '#22334d' : '#4a6285';
          pavilionCacheCtx.font = `700 ${(isEave ? stepX + 1.5 : stepX - 0.5).toFixed(1)}px "Noto Serif SC", "Songti SC", serif`;
          pavilionCacheCtx.fillText(chChar, x, y);
        }
      }
    }

    // 20 缕高密度竖排李白诗句垂柳（自飞檐与两侧垂落）
    const strandCount = 20;
    for (let i = 0; i < strandCount; i++) {
      const frac = i / (strandCount - 1);
      const sx = cx - span * 0.48 + frac * span * 0.96;
      const onWing = frac < 0.25 || frac > 0.72;
      const topY = onWing ? (baseY - span * 0.36 + Math.random() * 34) : (baseY + span * 0.02);
      const len = onWing ? (11 + (i % 6)) : (7 + (i % 5));
      const chars = [];
      for (let k = 0; k < len; k++) {
        chars.push(LIBAI_POEM_STREAM[(charPtr + k) % LIBAI_POEM_STREAM.length]);
      }
      charPtr += len;
      willowStrands.push({
        x: sx,
        topY,
        chars,
        step: 13 + (i % 3) * 1.5,
        size: 10.5 + (i % 3),
        swayAmp: 3.5 + (i % 4) * 1.4,
        phase: i * 0.65,
        color: i % 3 === 0 ? '#3c846c' : (i % 3 === 1 ? '#64a678' : '#2f6570')
      });
    }
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = screen.clientWidth || 390;
    ch = screen.clientHeight || 844;
    canvas.width = Math.max(1, Math.round(cw * dpr));
    canvas.height = Math.max(1, Math.round(ch * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildLibaiPavilionGlyphs();
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawSwallow(x, y, scale, flap) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#253854';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-8, -7 - flap * 5, -18, -3 - flap * 8);
    ctx.quadraticCurveTo(-9, -1, -3, 2);
    ctx.quadraticCurveTo(-11, 5, -16, 11);
    ctx.quadraticCurveTo(-6, 6, 1, 3);
    ctx.quadraticCurveTo(8, 2, 14, -2);
    ctx.quadraticCurveTo(7, -1, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function renderFrame(now) {
    const elapsed = (now - phaseStart) / 1000;
    ctx.clearRect(0, 0, cw, ch);

    if (phase === 0) {
      // 幕一：棋子自右上棋奁洒出 → 中段拉丝化作平笔藏色水滴瀑布
      const originX = cw * 0.69;
      const originY = ch * 0.25;
      for (const s of stones) {
        const p = (s.t + elapsed * s.speed) % 1;
        const x = originX - p * cw * 0.26 + Math.sin(p * 4.5 + s.t * 9) * 14 + s.lane * cw * p;
        const y = originY + Math.pow(p, 1.32) * (ch * 0.68);
        const alpha = p < 0.08 ? p / 0.08 : (p > 0.85 ? (1 - p) / 0.15 : 0.92);
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        if (p < 0.34) {
          // 棋子态（哑光藏青黑子 / 暖玉白子）
          ctx.fillStyle = s.isDark ? '#2c3d59' : '#fbf6e8';
          ctx.beginPath();
          ctx.ellipse(x, y, s.size * 1.15, s.size * 0.82, p * 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 水滴化瀑态（薄荷青 / 鹅黄 / 淡桃粉 / 丁香蓝拉丝水滴）
          const stretch = 1.6 + p * 2.2;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.ellipse(x, y, s.size * 0.62, s.size * stretch, 0.24, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    } else if (phase === 1) {
      // 幕二：高密度纯文字李白诗句构筑宋楼飞檐（单次 drawImage 流畅揭示） + 竖排垂柳字帘 + 双燕掠檐
      const revealP = Math.max(0, Math.min(1, elapsed * 1.15));
      ctx.save();
      ctx.globalAlpha = Math.min(1, revealP * 1.25);
      ctx.beginPath();
      ctx.rect(0, 0, cw, ch * (0.18 + revealP * 0.6));
      ctx.clip();
      ctx.drawImage(pavilionCache, 0, 0, cw, ch);
      ctx.restore();
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 竖排李白诗句垂柳随风轻摆
      for (const st of willowStrands) {
        for (let k = 0; k < st.chars.length; k++) {
          const dropLocal = Math.max(0, Math.min(1, (elapsed - 0.18 - k * 0.045) * 2.6));
          if (dropLocal <= 0) continue;
          const sway = Math.sin(now * 0.002 + st.phase + k * 0.35) * st.swayAmp * (k / st.chars.length);
          const fade = 1 - (k / st.chars.length) * 0.55;
          ctx.globalAlpha = dropLocal * fade * 0.88;
          ctx.fillStyle = st.color;
          ctx.font = `600 ${st.size}px "Noto Serif SC", "Songti SC", serif`;
          ctx.fillText(st.chars[k], st.x + sway, st.topY + k * st.step);
        }
      }
      ctx.restore();

      // 双燕掠过左上飞檐
      for (const sw of swallows) {
        const sx = (sw.x + elapsed * sw.vx) * cw;
        const sy = (sw.y + elapsed * sw.vy) * ch + Math.sin(elapsed * 4 + sw.phase) * 5;
        if (sx > -30 && sx < cw + 30) {
          drawSwallow(sx, sy, sw.scale, Math.sin(elapsed * 9 + sw.phase));
        }
      }
    } else if (phase === 2) {
      // 幕三：海棠花窗中轴柔和流光微尘
      for (const m of motes) {
        m.y -= m.vy * 0.016;
        if (m.y < 0.08) { m.y = 0.88; m.x = 0.25 + Math.random() * 0.5; }
        const px = m.x * cw + Math.sin(now * 0.001 + m.phase) * 9;
        const py = m.y * ch;
        const alpha = 0.26 + 0.44 * Math.abs(Math.sin(now * 0.0018 + m.phase));
        const g = ctx.createRadialGradient(px, py, 0, px, py, m.r * 2.4);
        if (m.aqua) {
          g.addColorStop(0, `rgba(242, 255, 252, ${alpha.toFixed(2)})`);
          g.addColorStop(0.55, `rgba(168, 237, 228, ${(alpha * 0.45).toFixed(2)})`);
          g.addColorStop(1, 'rgba(168, 237, 228, 0)');
        } else {
          g.addColorStop(0, `rgba(255, 252, 234, ${alpha.toFixed(2)})`);
          g.addColorStop(0.55, `rgba(249, 212, 118, ${(alpha * 0.45).toFixed(2)})`);
          g.addColorStop(1, 'rgba(249, 212, 118, 0)');
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, m.r * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    rafId = requestAnimationFrame(renderFrame);
  }

  function showCTA() {
    if (finishedIntro) return;
    finishedIntro = true;
    phase = 2;
    phaseStart = performance.now();
    clearInterval(typingTimer);
    clearTimeout(autoTimer);
    slides.forEach((el, i) => el && el.classList.toggle('active', i === 2));
    if (captionBox) captionBox.classList.add('fade-out');
    if (btnSkip) btnSkip.style.display = 'none';
    if (ctaBox) ctaBox.classList.add('visible');
  }

  function updateTapHint(doneTyping) {
    if (!tapHint) return;
    if (!doneTyping) tapHint.textContent = '轻触补全全文';
    else tapHint.textContent = phase === 0 ? '轻触观太白诗楼 ▾' : '轻触推窗入梦华 ▾';
  }

  function playPhase(idx) {
    phase = idx;
    phaseStart = performance.now();
    slides.forEach((el, i) => el && el.classList.toggle('active', i === idx));
    const data = OPENING_SCENES[idx] || OPENING_SCENES[0];
    if (tagEl) tagEl.textContent = idx === 0 ? '卷首 · 倾奁化瀑' : '入梦 · 太白诗砌楼柳';
    if (textEl) textEl.textContent = '';
    charIdx = 0;
    updateTapHint(false);
    clearInterval(typingTimer);
    clearTimeout(autoTimer);
    if (idx === 0) SoundFX.tapProp(2);
    else if (idx === 1) SoundFX.tapProp(4);

    typingTimer = setInterval(() => {
      charIdx += 1;
      if (textEl) textEl.textContent = data.text.slice(0, charIdx);
      if (charIdx >= data.text.length) {
        clearInterval(typingTimer);
        typingTimer = null;
        updateTapHint(true);
        autoTimer = setTimeout(() => {
          if (phase === 0) playPhase(1);
          else showCTA();
        }, idx === 0 ? 1500 : 2100);
      }
    }, 40);
  }

  screen.addEventListener('click', (e) => {
    if (e.target.closest('button') || finishedIntro) return;
    const data = OPENING_SCENES[phase] || OPENING_SCENES[0];
    if (charIdx < data.text.length) {
      clearInterval(typingTimer);
      typingTimer = null;
      charIdx = data.text.length;
      if (textEl) textEl.textContent = data.text;
      updateTapHint(true);
      return;
    }
    if (phase === 0) playPhase(1);
    else showCTA();
  });

  if (btnSkip) {
    btnSkip.addEventListener('click', (e) => {
      e.stopPropagation();
      showCTA();
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener('click', (e) => {
      e.stopPropagation();
      finishedIntro = false;
      screen.classList.remove('is-entering');
      if (ctaBox) ctaBox.classList.remove('visible');
      if (captionBox) captionBox.classList.remove('fade-out');
      if (btnSkip) btnSkip.style.display = '';
      if (!rafId && !reduceMotion) rafId = requestAnimationFrame(renderFrame);
      playPhase(0);
    });
  }

  if (btnStart) {
    btnStart.addEventListener('click', () => {
      if (screen.classList.contains('is-entering')) return;
      screen.classList.add('is-entering');
      SoundFX.serveOk();
      setTimeout(() => {
        screen.classList.add('hidden');
        if (rafId) cancelAnimationFrame(rafId);
        onStartGame();
      }, reduceMotion ? 40 : 220);
    });
  }

  if (reduceMotion) {
    showCTA();
  } else {
    rafId = requestAnimationFrame(renderFrame);
    playPhase(0);
  }
}
