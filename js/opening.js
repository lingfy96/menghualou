import { SoundFX } from './audio.js';

export function initOpeningCutscene(onStartGame) {
  const screen = document.getElementById('opening-screen');
  const slideAlley = document.getElementById('opening-slide-0');
  const slideWindow = document.getElementById('opening-slide-1');
  const poemProj = document.getElementById('alley-poem-projection');
  const tapWhisper = document.getElementById('opening-tap-whisper');
  const ctaBox = document.getElementById('opening-title-cta');
  const btnSkip = document.getElementById('btn-skip-opening');
  const btnReplay = document.getElementById('btn-replay-opening');
  const btnStart = document.getElementById('btn-start-game');

  const reduceMotion = Boolean(
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  let poemTimer = null;
  let autoTimer = null;
  let finishedIntro = false;

  function clearTimers() {
    clearTimeout(poemTimer);
    clearTimeout(autoTimer);
    poemTimer = null;
    autoTimer = null;
  }

  function showWindowCTA() {
    if (finishedIntro) return;
    finishedIntro = true;
    clearTimers();
    if (slideAlley) slideAlley.classList.remove('active');
    if (slideWindow) slideWindow.classList.add('active');
    if (tapWhisper) tapWhisper.classList.add('fade-out');
    if (btnSkip) btnSkip.style.display = 'none';
    if (ctaBox) ctaBox.classList.add('visible');
  }

  function startAlleySequence() {
    finishedIntro = false;
    clearTimers();
    screen.classList.remove('is-entering', 'hidden');
    if (ctaBox) ctaBox.classList.remove('visible');
    if (tapWhisper) tapWhisper.classList.remove('fade-out');
    if (btnSkip) btnSkip.style.display = '';
    if (slideWindow) slideWindow.classList.remove('active');
    if (slideAlley) {
      slideAlley.classList.add('active');
      const img = slideAlley.querySelector('.alley-push-in');
      if (img) {
        img.style.animation = 'none';
        void img.offsetWidth;
        img.style.animation = '';
      }
    }
    if (poemProj) poemProj.classList.remove('visible');

    // 第 0.25s 玉子轻叩 + 左侧阴影墙浮现两列疏朗太白诗影
    poemTimer = setTimeout(() => {
      SoundFX.tapProp(2);
      if (poemProj) poemProj.classList.add('visible');
    }, 280);

    // 2.6s 后自然叠化至冷影海棠花窗定格
    autoTimer = setTimeout(() => {
      showWindowCTA();
    }, 2700);
  }

  screen.addEventListener('click', (e) => {
    if (e.target.closest('button') || finishedIntro) return;
    showWindowCTA();
  });

  if (btnSkip) {
    btnSkip.addEventListener('click', (e) => {
      e.stopPropagation();
      showWindowCTA();
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener('click', (e) => {
      e.stopPropagation();
      startAlleySequence();
    });
  }

  if (btnStart) {
    btnStart.addEventListener('click', () => {
      if (screen.classList.contains('is-entering')) return;
      screen.classList.add('is-entering');
      SoundFX.serveOk();
      setTimeout(() => {
        if (ctaBox) ctaBox.classList.remove('visible');
        screen.classList.add('hidden');
        onStartGame();
      }, reduceMotion ? 40 : 220);
    });
  }

  if (reduceMotion) {
    showWindowCTA();
  } else {
    startAlleySequence();
  }
}
