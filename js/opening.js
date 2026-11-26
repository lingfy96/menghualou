import { OPENING_SCENES } from './config.js';
export function initOpeningCutscene(onStartGame) {
  const screen = document.getElementById('opening-screen');
  const slides = [document.getElementById('opening-slide-0'), document.getElementById('opening-slide-1')];
  const captionBox = document.querySelector('.opening-caption-box');
  const tagEl = document.getElementById('opening-tag');
  const textEl = document.getElementById('opening-text');
  const ctaBox = document.getElementById('opening-title-cta');
  const btnSkip = document.getElementById('btn-skip-opening');
  const btnReplay = document.getElementById('btn-replay-opening');
  const tapHint = document.getElementById('opening-tap-hint');
  const btnStart = document.getElementById('btn-start-game');
  const particleCanvas = document.getElementById('opening-particles');

  let sceneIdx = 0, charIdx = 0, typingTimer = null, autoTimer = null, particleRaf = null, finishedIntro = false;
  const pctx = particleCanvas.getContext('2d');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sparks = Array.from({ length: 22 }, (_, idx) => ({
    x: Math.random(), y: Math.random(), r: 1.6 + Math.random() * 2.6,
    vy: 0.014 + Math.random() * 0.028, phase: Math.random() * Math.PI * 2,
    aqua: idx % 3 === 0
  }));

  function resizeParticles() { particleCanvas.width = screen.clientWidth || 390; particleCanvas.height = screen.clientHeight || 844; }
  resizeParticles(); window.addEventListener('resize', resizeParticles);

  function renderParticles(now) {
    const w = particleCanvas.width, h = particleCanvas.height;
    pctx.clearRect(0, 0, w, h);
    for (const s of sparks) {
      s.y -= s.vy * 0.016; if (s.y < -0.05) { s.y = 1.05; s.x = Math.random(); }
      const px = s.x * w + Math.sin(now * 0.0009 + s.phase) * 12, py = s.y * h;
      const alpha = 0.28 + 0.52 * Math.abs(Math.sin(now * 0.0016 + s.phase));
      const g = pctx.createRadialGradient(px, py, 0, px, py, s.r * 2.4);
      if (s.aqua) {
        g.addColorStop(0, `rgba(232, 255, 250, ${alpha.toFixed(2)})`);
        g.addColorStop(0.5, `rgba(168, 237, 228, ${(alpha * 0.45).toFixed(2)})`);
        g.addColorStop(1, 'rgba(168, 237, 228, 0)');
      } else {
        g.addColorStop(0, `rgba(255, 250, 224, ${alpha.toFixed(2)})`);
        g.addColorStop(0.5, `rgba(249, 200, 45, ${(alpha * 0.45).toFixed(2)})`);
        g.addColorStop(1, 'rgba(249, 200, 45, 0)');
      }
      pctx.fillStyle = g;
      pctx.beginPath(); pctx.arc(px, py, s.r * 2.4, 0, Math.PI * 2); pctx.fill();
    }
    particleRaf = requestAnimationFrame(renderParticles);
  }
  if (!reduceMotion) particleRaf = requestAnimationFrame(renderParticles);

  function showCTA() {
    if (finishedIntro) return; finishedIntro = true;
    clearInterval(typingTimer); clearTimeout(autoTimer);
    slides[0].classList.remove('active'); slides[1].classList.add('active');
    captionBox.classList.add('fade-out'); btnSkip.style.display = 'none'; ctaBox.classList.add('visible');
  }

  function updateTapHint(doneTyping) {
    if (!tapHint) return;
    if (!doneTyping) tapHint.textContent = '轻触补全全文';
    else tapHint.textContent = sceneIdx + 1 < OPENING_SCENES.length ? '轻触进入下一幕 ▾' : '轻触开启梦华楼 ▾';
  }
  function playScene(idx) {
    sceneIdx = idx; slides.forEach((el, i) => el.classList.toggle('active', i === idx));
    const data = OPENING_SCENES[idx]; tagEl.textContent = data.tag; textEl.textContent = ''; charIdx = 0;
    updateTapHint(false);
    clearInterval(typingTimer); clearTimeout(autoTimer);
    typingTimer = setInterval(() => {
      charIdx += 1; textEl.textContent = data.text.slice(0, charIdx);
      if (charIdx >= data.text.length) {
        clearInterval(typingTimer);
        updateTapHint(true);
        autoTimer = setTimeout(() => { if (sceneIdx + 1 < OPENING_SCENES.length) playScene(sceneIdx + 1); else showCTA(); }, 2400);
      }
    }, 50);
  }

  screen.addEventListener('click', (e) => {
    if (e.target.closest('button') || finishedIntro) return;
    const data = OPENING_SCENES[sceneIdx];
    if (charIdx < data.text.length) { clearInterval(typingTimer); charIdx = data.text.length; textEl.textContent = data.text; updateTapHint(true); return; }
    if (sceneIdx + 1 < OPENING_SCENES.length) playScene(sceneIdx + 1); else showCTA();
  });

  btnSkip.addEventListener('click', (e) => { e.stopPropagation(); showCTA(); });
  if (btnReplay) {
    btnReplay.addEventListener('click', (e) => {
      e.stopPropagation();
      finishedIntro = false;
      ctaBox.classList.remove('visible');
      captionBox.classList.remove('fade-out');
      btnSkip.style.display = '';
      playScene(0);
    });
  }
  btnStart.addEventListener('click', () => { screen.classList.add('hidden'); if (particleRaf) cancelAnimationFrame(particleRaf); onStartGame(); });
  playScene(0);
}
