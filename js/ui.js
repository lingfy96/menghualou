import { BOARD_RECIPES, CODEX_ENTRIES, GAME_CONFIG, GUEST_POOL, SPECIAL_GUEST_PROFILES, UPGRADES } from './config.js';
import { state, recordChoice } from './state.js';

export const dom = {
  appFrame: document.getElementById('app-frame'),
  shell: document.getElementById('game-shell'),
  counterView: document.getElementById('counter-view'),
  boardView: document.getElementById('board-view'),
  outdoorView: document.getElementById('outdoor-view'),
  btnGoOutdoor: document.getElementById('btn-go-outdoor'),
  btnDemoOutdoor: document.getElementById('btn-demo-outdoor'),
  statDay: document.getElementById('stat-day'),
  statSilver: document.getElementById('stat-silver'),
  statRep: document.getElementById('stat-rep'),
  statWenxin: document.getElementById('stat-wenxin'),
  popSilver: document.getElementById('pop-silver'),
  popRep: document.getElementById('pop-rep'),
  popWenxin: document.getElementById('pop-wenxin'),
  tallyCounterText: document.getElementById('tally-counter-text'),
  settlementPanel: document.getElementById('settlement-panel'),
  settlementSeal: document.getElementById('settlement-seal'),
  settlementTitle: document.getElementById('settlement-title'),
  settlementMult: document.getElementById('settlement-mult'),
  settlementChips: document.getElementById('settlement-chips'),
  nightProgressFill: document.getElementById('night-progress-fill'),
  btnCodex: document.getElementById('btn-codex'),
  codexCount: document.getElementById('codex-count'),
  btnSettings: document.getElementById('btn-settings'),
  hudSettingsMenu: document.getElementById('hud-settings-menu'),
  menuPause: document.getElementById('menu-pause'),
  menuPauseState: document.getElementById('menu-pause-state'),
  menuMute: document.getElementById('menu-mute'),
  menuMuteState: document.getElementById('menu-mute-state'),
  menuLayout: document.getElementById('menu-layout'),
  menuLayoutState: document.getElementById('menu-layout-state'),
  pauseBanner: document.getElementById('pause-banner'),
  btnResumeBanner: document.getElementById('btn-resume-banner'),
  miracleBanner: document.getElementById('miracle-banner'),
  miracleTimer: document.getElementById('miracle-timer'),
  journalToast: document.getElementById('journal-toast'),
  // 前厅面对面元素
  guestActor: document.getElementById('guest-actor'),
  guestPortrait: document.getElementById('guest-portrait-img'),
  orderBubble: document.getElementById('order-bubble'),
  orderGuestName: document.getElementById('order-guest-name'),
  orderGuestBadge: document.getElementById('order-guest-badge'),
  orderGuestLine: document.getElementById('order-guest-line'),
  orderDishImg: document.getElementById('order-dish-img'),
  orderDishName: document.getElementById('order-dish-name'),
  orderDishCount: document.getElementById('order-dish-count'),
  orderYieldPreview: document.getElementById('order-yield-preview'),
  orderPatienceFill: document.getElementById('order-patience-fill'),
  orderPatienceLabel: document.getElementById('order-patience-label'),
  counterFxLayer: document.getElementById('counter-fx-layer'),
  sealFxAnchor: document.getElementById('seal-fx-anchor'),
  riddlePlaceholder: document.getElementById('riddle-placeholder'),
  preparedReadyPill: document.getElementById('prepared-ready-pill'),
  preparedReadyText: document.getElementById('prepared-ready-text'),
  bottomDishShelf: document.querySelector('.bottom-dish-shelf'),
  sealCharTop: document.getElementById('seal-char-top'),
  sealCharBot: document.getElementById('seal-char-bot'),
  orderDishRow: document.getElementById('order-dish-row'),
  btnRiddleHint: document.getElementById('btn-riddle-hint'),
  comboPill: document.getElementById('combo-pill'),
  btnServeDish: document.getElementById('btn-serve-dish'),
  // AVG
  avgOverlay: document.getElementById('avg-overlay'),
  avgBackdrop: document.getElementById('avg-backdrop'),
  avgStage: document.getElementById('avg-stage'),
  avgPetalLayer: document.getElementById('avg-petal-layer'),
  avgPortrait: document.getElementById('avg-portrait-img'),
  avgPoemCard: document.getElementById('avg-poem-card'),
  avgPoemEyeQuote: document.getElementById('avg-poem-eye-quote'),
  poemEyeSrc: document.getElementById('poem-eye-src'),
  poemEyeLine: document.getElementById('poem-eye-line'),
  avgChoices: document.getElementById('avg-choices'),
  avgPanel: document.getElementById('avg-dialogue-panel'),
  avgSpeakerName: document.getElementById('avg-speaker-name'),
  avgSpeakerSub: document.getElementById('avg-speaker-sub'),
  avgText: document.getElementById('avg-dialogue-text'),
  avgNextTri: document.getElementById('avg-next-tri'),
  btnAvgCollapse: document.getElementById('btn-avg-collapse'),
  avgPortraitWrap: document.querySelector('.avg-portrait-wrap'),
  // 账本 / 典故 / 结局
  ledgerModal: document.getElementById('ledger-modal'),
  ledgerTitle: document.getElementById('ledger-title'),
  ledgerReview: document.getElementById('ledger-review'),
  ledgerEarned: document.getElementById('ledger-earned'),
  ledgerServed: document.getElementById('ledger-served'),
  ledgerRep: document.getElementById('ledger-rep'),
  ledgerWenxin: document.getElementById('ledger-wenxin'),
  upgradeList: document.getElementById('upgrade-list'),
  btnNextDay: document.getElementById('btn-next-day'),
  codexModal: document.getElementById('codex-modal'),
  codexList: document.getElementById('codex-list'),
  btnCloseCodex: document.getElementById('btn-close-codex'),
  btnDemoCook: document.getElementById('btn-demo-cook'),
  btnDemoCodex: document.getElementById('btn-demo-codex'),
  btnDemoLibai: document.getElementById('btn-demo-libai'),
  btnDemoWife: document.getElementById('btn-demo-wife'),
  btnDemoEndWen: document.getElementById('btn-demo-end-wen'),
  btnDemoEndTrade: document.getElementById('btn-demo-end-trade'),
  btnDemoEndHeart: document.getElementById('btn-demo-end-heart'),
  endingPathsBar: document.getElementById('ending-paths-bar'),
  endingNotes: document.getElementById('ending-notes'),
  endingModal: document.getElementById('ending-modal'),
  endingSeal: document.getElementById('ending-seal'),
  endingEmblemImg: document.getElementById('ending-emblem-img'),
  endingTitle: document.getElementById('ending-title'),
  endingDesc: document.getElementById('ending-desc'),
  endSilver: document.getElementById('end-silver'),
  endServed: document.getElementById('end-served'),
  endWenxin: document.getElementById('end-wenxin'),
  endCodex: document.getElementById('end-codex'),
  btnPlayAgain: document.getElementById('btn-play-again'),
  btnGuestProfile: document.getElementById('btn-guest-profile'),
  guestProfileModal: document.getElementById('guest-profile-modal'),
  btnCloseProfile: document.getElementById('btn-close-profile'),
  profileGuestName: document.getElementById('profile-guest-name'),
  profileGuestImg: document.getElementById('profile-guest-img'),
  profileGuestBadge: document.getElementById('profile-guest-badge'),
  profileEncounterCount: document.getElementById('profile-encounter-count'),
  profileRows: document.getElementById('profile-rows'),
  ledgerNarrative: document.getElementById('ledger-narrative'),
  rumorLaneA: document.getElementById('rumor-lane-a'),
  rumorLaneB: document.getElementById('rumor-lane-b'),
  outdoorWorkbench: document.getElementById('outdoor-workbench'),
  workbenchBtn: document.getElementById('btn-workbench'),
  workbenchPanel: document.getElementById('workbench-panel'),
  wbFineMat: document.getElementById('wb-fine-mat'),
  wbHotDish: document.getElementById('wb-hot-dish'),
  wbRumorList: document.getElementById('wb-rumor-list'),
  workbenchTime: document.getElementById('workbench-time')
};

// ================= 1. 人物立绘预加载与防破图安全加载 =================
const ALL_PORTRAITS = [
  './assets/portraits/scholar.png',
  './assets/portraits/foodie.png',
  './assets/portraits/constable.png',
  './assets/portraits/painter.png',
  './assets/portraits/heroine.png',
  './assets/portraits/libai.png',
  './assets/portraits/libai_face.png',
  './assets/portraits/wife.png',
  './assets/portraits/peddler_v2.png',
  './assets/ui/lantern_celadon.png',
  './assets/ui/lantern_coral.png',
  './assets/ui/lantern_amber.png',
  './assets/ui/lotus_fan_deco.png',
  './assets/ui/boat_plum_deco.png',
  './assets/ui/brush_cta_coral.png',
  './assets/ui/cloud_nav_guide.png',
  './assets/ui/memo_book_amber_v2.png',
  './assets/ui/silk_dialogue_stroke.png',
  './assets/ui/silk_choice_stroke.png',
  './assets/ui/silk_nameplate_stroke.png'
];
const portraitCache = new Map();

export function preloadAllPortraits() {
  for (const src of ALL_PORTRAITS) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    portraitCache.set(src, img);
  }
}
preloadAllPortraits();

export function setPortraitSafely(imgEl, src) {
  if (!imgEl || !src) return;
  const fallback = './assets/portraits/scholar.png';
  imgEl.onerror = () => {
    if (imgEl.dataset.retried !== src) {
      imgEl.dataset.retried = src;
      imgEl.src = src;
    } else if (!imgEl.src.endsWith('scholar.png')) {
      imgEl.onerror = null;
      imgEl.src = fallback;
    }
  };
  imgEl.style.visibility = 'visible';
  imgEl.style.opacity = '';
  if (imgEl.getAttribute('src') !== src) {
    imgEl.setAttribute('src', src);
  }
  // v28 #1 逐角色底部补偿（基于各立绘 PNG 透明通道实测，把人物真实衣摆压入文本框）
  const actor = imgEl.parentElement;
  if (actor && actor.classList.contains('guest-actor')) {
    const key = (src || '').split('/').pop();
    const lift = {
      'scholar.png': 26, 'libai.png': 22, 'libai_face.png': 22,
      'foodie.png': 18, 'peddler.png': 18, 'peddler_v2.png': 14, 'constable.png': 10,
      'wife.png': 2, 'painter.png': 0, 'heroine.png': 0
    }[key] ?? 6;
    actor.style.setProperty('--portrait-lift', `${lift}px`);
  }
}

// ================= 2. 弹窗安全展开/收卷（杜绝快速切换时的定时器竞态） =================
function syncScrollFadeHint(modalEl) {
  const sheet = modalEl ? modalEl.querySelector('.book-sheet') : null;
  if (!sheet) return;
  const update = () => {
    const canScrollMore = (sheet.scrollHeight - sheet.clientHeight - sheet.scrollTop) > 8;
    sheet.classList.toggle('is-scrollable', canScrollMore);
  };
  if (!sheet._scrollFadeBound) {
    sheet._scrollFadeBound = true;
    sheet.addEventListener('scroll', update, { passive: true });
  }
  requestAnimationFrame(update);
}

function openModalSafely(el) {
  if (!el) return;
  if (el._closeTimer) {
    clearTimeout(el._closeTimer);
    el._closeTimer = null;
  }
  el.classList.remove('closing');
  el.classList.add('open');
  syncScrollFadeHint(el);
}

function closeModalWithMotion(el) {
  if (!el || !el.classList.contains('open')) return;
  if (el._closeTimer) clearTimeout(el._closeTimer);
  const wasChoosing = el.classList.contains('choosing');
  el.classList.remove('open');
  el.classList.add('closing');
  el._closeTimer = setTimeout(() => {
    el.classList.remove('closing');
    if (wasChoosing) el.classList.remove('choosing');
    el._closeTimer = null;
  }, 220);
}

// 全局按钮水墨晕染涟漪动效
document.addEventListener('pointerdown', (e) => {
  const btn = e.target.closest('button');
  if (!btn || btn.disabled || btn.classList.contains('board-prop-btn') || btn.classList.contains('art-hotspot')) return;
  const pos = getComputedStyle(btn).position;
  if (pos === 'static') return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 0.95;
  const ripple = document.createElement('span');
  ripple.className = 'ink-ripple';
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left}px`;
  ripple.style.top = `${e.clientY - rect.top}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 380);
});

const SHICHEN = ['戌时', '亥时', '子时', '丑时'];
const ATTR_META = {
  silver: { img: './assets/ui/sycee.png', label: '银两', unit: '两' },
  rep: { img: './assets/ui/seal.png', label: '商誉', unit: '' },
  wenxin: { img: './assets/ui/scroll.png', label: '文心', unit: '' }
};

function renderAttrChipHTML(ef) {
  if (ef.type === 'custom') {
    return `<span class="attr-chip ${ef.tone || 'gold'}">${ef.text}</span>`;
  }
  const meta = ATTR_META[ef.type];
  if (!meta) return '';
  const sign = ef.delta > 0 ? '+' : '';
  const cls = ef.delta > 0 ? (ef.type === 'silver' ? 'gold' : 'pos') : (ef.delta < 0 ? 'neg' : 'cost');
  return `<span class="attr-chip ${cls}" title="${meta.label}"><img src="${meta.img}" alt="${meta.label}" />${sign}${ef.delta}${meta.unit}</span>`;
}

// ================= 3. 全局收益结算面板 + HUD 变动飘字 + 手作印章飘条 =================
let settlementTimer = null;
let prevStats = { silver: state.silver, rep: state.reputation, wenxin: state.wenxin };

function triggerHudDelta(popEl, delta) {
  if (!popEl || !delta) return;
  const box = popEl.parentElement;
  popEl.textContent = `${delta > 0 ? '+' : ''}${delta}`;
  popEl.className = 'hud-delta-pop';
  void popEl.offsetWidth;
  popEl.classList.add(delta > 0 ? 'show-pos' : 'show-neg');
  if (box) {
    box.classList.add('bump');
    setTimeout(() => box.classList.remove('bump'), 220);
  }
}

export function showSettlementBanner({ seal = '结算', title = '', multText = '', consumedDish = null, effects = [] }) {
  dom.settlementSeal.textContent = seal;
  dom.settlementTitle.textContent = title;
  dom.settlementMult.textContent = multText;

  const chips = [];
  if (consumedDish && BOARD_RECIPES[consumedDish]) {
    const r = BOARD_RECIPES[consumedDish];
    chips.push(`<span class="attr-chip cost"><img src="${r.img}" alt="${r.name}" />消耗${r.name}×1</span>`);
  }
  for (const ef of effects) {
    if (ef.type === 'custom' || ef.delta !== 0) chips.push(renderAttrChipHTML(ef));
  }
  dom.settlementChips.innerHTML = chips.join('');
  dom.settlementPanel.classList.add('visible');
  if (dom.journalToast.classList.contains('visible')) {
    dom.journalToast.classList.add('below-settlement');
  }

  clearTimeout(settlementTimer);
  settlementTimer = setTimeout(() => {
    dom.settlementPanel.classList.remove('visible');
    dom.journalToast.classList.remove('below-settlement');
  }, 3200);
}

dom.settlementPanel.addEventListener('click', () => {
  clearTimeout(settlementTimer);
  dom.settlementPanel.classList.remove('visible');
  dom.journalToast.classList.remove('below-settlement');
});

export function spawnSealActionFloat(htmlContent) {
  if (!dom.sealFxAnchor) return;
  const el = document.createElement('div');
  el.className = 'seal-float-pill';
  el.innerHTML = htmlContent;
  dom.sealFxAnchor.appendChild(el);
  setTimeout(() => el.remove(), 1900);
}

let toastTimer = null;
export function showToast(text, cls = '') {
  if (!text) return;
  const below = dom.settlementPanel.classList.contains('visible') ? 'below-settlement' : '';
  dom.journalToast.textContent = text;
  dom.journalToast.className = `journal-toast visible ${below} ${cls}`.trim();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.journalToast.classList.remove('visible', 'below-settlement'), 2600);
}
export function shakeTavern() { dom.shell.classList.remove('shake-screen'); void dom.shell.offsetWidth; dom.shell.classList.add('shake-screen'); }
export function triggerGoldenBurst() { dom.shell.classList.remove('golden-burst'); void dom.shell.offsetWidth; dom.shell.classList.add('golden-burst'); }

export function spawnCounterFloat(text, isBad = false) {
  const el = document.createElement('div');
  el.className = `counter-float-text ${isBad ? 'bad' : ''}`;
  el.textContent = text;
  dom.counterFxLayer.appendChild(el);
  setTimeout(() => el.remove(), 1250);
}

export function switchView(mode) {
  state.viewMode = mode;
  dom.counterView.classList.toggle('active', mode === 'counter');
  dom.boardView.classList.toggle('active', mode === 'board');
  dom.outdoorView.classList.toggle('active', mode === 'outdoor');
  if (mode === 'outdoor') playRumorDanmu();
  else toggleWorkbench(true);
}

export function unlockCodex(id) {
  if (state.unlockedCodex.has(id)) return false;
  state.unlockedCodex.add(id);
  state.reputation = Math.min(120, state.reputation + 2);
  const entry = CODEX_ENTRIES.find((c) => c.id === id);
  if (entry) showToast(`解锁典故：《${entry.title}》（商誉 +2）`, 'gold');
  renderHUD();
  return true;
}

export function estimateGuestSilver(g) {
  if (!g) return 0;
  if (g.type === 'libai') return 0;
  if (g.type === 'wife') return 0;
  const basePrice = BOARD_RECIPES[g.needItem].price;
  const hotMult = state.hotDish === g.needItem ? 2 : 1;
  const miracleMult = state.miracleRemaining > 0 ? GAME_CONFIG.miracleTipMultiplier : 1;
  const riddleMult = (g.isRiddle && !g.riddleRevealed) ? 1.5 : 1;
  const nextCombo = state.comboCount + 1;
  const comboMult = nextCombo >= 3 ? 1.3 : (nextCombo === 2 ? 1.15 : 1);
  return Math.round(basePrice * (1 + state.upgrades.gold_sign * 0.2) * hotMult * miracleMult * riddleMult * comboMult);
}

export function renderCounterGuest() {
  const g = state.currentGuest;
  document.querySelectorAll('.pick-dish-mini').forEach((b) => {
    b.classList.remove('active-need', 'is-prepared', 'dimmed-while-prepared', 'is-idle');
    if (!g) b.classList.add('is-idle');
  });

  if (!g) {
    if (dom.btnGoOutdoor) dom.btnGoOutdoor.classList.add('is-inviting');
    if (dom.btnGuestProfile) dom.btnGuestProfile.style.display = 'none';
    dom.guestActor.classList.remove('visible');
    dom.orderBubble.classList.remove('visible');
    dom.orderDishRow.style.display = 'flex';
    dom.riddlePlaceholder.style.display = 'none';
    if (dom.preparedReadyPill) dom.preparedReadyPill.style.display = 'none';
    dom.orderDishName.textContent = '静候客官';
    dom.orderDishCount.textContent = '轻点右侧窗边【出街】探索御街';
    dom.orderYieldPreview.innerHTML = '';
    dom.orderPatienceFill.style.width = '0%';
    if (dom.orderPatienceLabel) { dom.orderPatienceLabel.textContent = ''; dom.orderPatienceLabel.classList.remove('is-urgent'); }
    dom.btnServeDish.disabled = true;
    dom.btnServeDish.classList.remove('ready-pulse', 'riddle-mode');
    dom.sealCharTop.textContent = '静';
    dom.sealCharBot.textContent = '候';
    return;
  }

  if (dom.btnGoOutdoor) dom.btnGoOutdoor.classList.remove('is-inviting');
  if (dom.btnGuestProfile) dom.btnGuestProfile.style.display = 'inline-flex';
  dom.guestActor.classList.add('visible');
  dom.orderBubble.classList.add('visible');

  setPortraitSafely(dom.guestPortrait, g.img);
  dom.orderGuestName.textContent = g.name;
  dom.orderGuestBadge.textContent = g.badge;
  dom.orderGuestLine.textContent = `“${g.line}”`;

  const recipe = BOARD_RECIPES[g.needItem];
  dom.orderDishImg.src = recipe.img;

  if (g.isRiddle && !g.riddleRevealed) {
    dom.orderDishRow.style.display = 'none';
    dom.riddlePlaceholder.style.display = 'block';
    dom.btnRiddleHint.style.display = 'inline-block';
  } else {
    dom.orderDishRow.style.display = 'flex';
    dom.riddlePlaceholder.style.display = 'none';
    dom.btnRiddleHint.style.display = 'none';
    const tile = document.querySelector(`.pick-dish-mini[data-pick="${g.needItem}"]`);
    if (tile) tile.classList.add('active-need');
  }

  dom.orderDishName.textContent = recipe.name;
  dom.orderDishCount.textContent = g.remaining > 1 ? `所需 ${g.remaining} 壶` : '所需 1 份';

  if (g.type === 'libai') {
    dom.orderYieldPreview.innerHTML = '赠酒 · 触发诗壁生辉 2×';
  } else if (g.type === 'wife') {
    dom.orderYieldPreview.innerHTML = '倾听 · 触发义利抉择';
  } else {
    const est = estimateGuestSilver(g);
    const hotTag = state.hotDish === g.needItem ? '热销2× ' : '';
    const extraWen = (state.upgrades.tea_service * 2) + (state.fineMaterial ? 3 : 0);
    const extraRep = state.upgrades.tea_service * 2;
    const extraParts = [];
    if (extraWen > 0) extraParts.push(`+${extraWen}文心`);
    if (extraRep > 0) extraParts.push(`+${extraRep}商誉`);
    const extraStr = extraParts.length ? ` · ${extraParts.join(' ')}` : '';
    dom.orderYieldPreview.innerHTML = `<img src="./assets/ui/sycee.png" alt="银" />${hotTag}+${est}两${extraStr}`;
  }

  if (state.preparedDish) {
    const prepName = BOARD_RECIPES[state.preparedDish]?.name || '菜品';
    if (dom.preparedReadyPill) {
      dom.preparedReadyPill.style.display = 'inline-flex';
      dom.preparedReadyText.textContent = `已备好【${prepName}】· 轻触右印呈上`;
    }
    document.querySelectorAll('.pick-dish-mini').forEach((b) => {
      if (b.dataset.pick === state.preparedDish) b.classList.add('is-prepared');
      else b.classList.add('dimmed-while-prepared');
    });
    dom.btnServeDish.disabled = false;
    dom.btnServeDish.classList.remove('riddle-mode');
    dom.btnServeDish.classList.add('ready-pulse');
    dom.sealCharTop.textContent = '上';
    dom.sealCharBot.textContent = (state.preparedDish === 'wine' || state.preparedDish === 'plum_wine') ? '酒' : '菜';
  } else {
    if (dom.preparedReadyPill) dom.preparedReadyPill.style.display = 'none';
    const isUnrevealedRiddle = Boolean(g.isRiddle && !g.riddleRevealed);
    dom.btnServeDish.disabled = isUnrevealedRiddle;
    dom.btnServeDish.classList.remove('ready-pulse');
    dom.btnServeDish.classList.toggle('riddle-mode', isUnrevealedRiddle);
    dom.sealCharTop.textContent = isUnrevealedRiddle ? '选' : '手';
    dom.sealCharBot.textContent = isUnrevealedRiddle ? '菜' : '作';
  }
}

export function updateGuestPatienceBar() {
  const g = state.currentGuest;
  if (!g) return;
  const ratio = Math.max(0, Math.min(1, 1 - g.waitedSec / g.maxPatienceSec));
  dom.orderPatienceFill.style.width = `${(ratio * 100).toFixed(1)}%`;
  dom.orderPatienceFill.style.backgroundColor = ratio < 0.25 ? '#a83226' : (ratio < 0.5 ? '#c4923a' : '#5c9184');
  if (dom.orderPatienceLabel) {
    const remSec = Math.max(0, Math.ceil(g.maxPatienceSec - g.waitedSec));
    const urgent = ratio < 0.25;
    dom.orderPatienceLabel.classList.toggle('is-urgent', urgent);
    dom.orderPatienceLabel.textContent = urgent ? `将离 · 剩${remSec}秒` : `耐心 ${remSec}秒`;
  }
}

export function renderHUD() {
  const ratio = Math.min(1, state.dayElapsedSec / GAME_CONFIG.dayDurationSec);
  const shichenIdx = Math.min(SHICHEN.length - 1, Math.floor(ratio * SHICHEN.length));
  dom.statDay.textContent = `第${state.day}夜 · ${SHICHEN[shichenIdx]}`;
  if (dom.outdoorView) dom.outdoorView.classList.toggle('is-late-night', shichenIdx >= 2);
  dom.nightProgressFill.style.width = `${(ratio * 100).toFixed(1)}%`;

  // 检测数值变化并弹出实时增减飘字
  if (state.silver !== prevStats.silver) triggerHudDelta(dom.popSilver, state.silver - prevStats.silver);
  if (state.reputation !== prevStats.rep) triggerHudDelta(dom.popRep, state.reputation - prevStats.rep);
  if (state.wenxin !== prevStats.wenxin) triggerHudDelta(dom.popWenxin, state.wenxin - prevStats.wenxin);
  prevStats = { silver: state.silver, rep: state.reputation, wenxin: state.wenxin };

  dom.statSilver.textContent = state.silver;
  dom.statRep.textContent = state.reputation;
  dom.statWenxin.textContent = state.wenxin;
  const silverBox = dom.statSilver.parentElement;
  const repBox = dom.statRep.parentElement;
  const wenxinBox = dom.statWenxin.parentElement;
  silverBox.classList.toggle('is-zero', state.silver === 0);
  silverBox.classList.toggle('is-danger', state.silver < 30);
  silverBox.classList.toggle('is-critical', state.silver < 0);
  repBox.classList.toggle('is-zero', state.reputation === 0);
  repBox.classList.toggle('is-danger', state.reputation < 30);
  wenxinBox.classList.toggle('is-zero', state.wenxin === 0);
  wenxinBox.classList.toggle('is-good', state.wenxin >= 15);

  const tallyStr = `今夜 +${state.dayEarnedSilver}两 · ${state.dayServedCount}位`;
  if (dom.tallyCounterText) dom.tallyCounterText.textContent = tallyStr;

  if (state.comboCount >= 2) {
    dom.comboPill.classList.add('active');
    dom.comboPill.textContent = state.comboCount >= 4 ? `满堂彩 ${state.comboCount}连击` : `绝品 ${state.comboCount}连击`;
  } else {
    dom.comboPill.classList.remove('active');
  }
  dom.codexCount.textContent = `${state.unlockedCodex.size}/${CODEX_ENTRIES.length}`;
  if (dom.menuPause) {
    const canPause = state.viewMode === 'counter' && !state.modalOpen && !state.gameOver;
    dom.menuPause.disabled = !canPause;
    if (dom.menuPauseState) {
      dom.menuPauseState.textContent = !canPause ? '已暂歇' : (state.paused ? '已暂停' : '播放中');
    }
  }

  if (dom.pauseBanner) {
    dom.pauseBanner.classList.toggle('active', state.paused && !state.modalOpen && !state.gameOver && state.viewMode === 'counter');
  }
  if (state.miracleRemaining > 0) {
    dom.miracleBanner.classList.add('active');
    dom.miracleTimer.textContent = `${state.miracleRemaining.toFixed(1)}秒`;
  } else dom.miracleBanner.classList.remove('active');
  if (dom.workbenchPanel?.classList.contains('open') && dom.workbenchTime) {
    dom.workbenchTime.textContent = dom.statDay.textContent;
  }
}

const TONE_LABEL = { neutral: '街谈', pos: '佳话', warn: '警语' };

export function setRumor(text, tone = 'neutral', bias = null) {
  state.rumor = { text, tone, bias };
  state.rumorLog.push({ text, tone });
  if (state.rumorLog.length > 6) state.rumorLog.shift();
  if (state.viewMode === 'outdoor') playRumorDanmu();
}

export function playRumorDanmu() {
  if (!dom.rumorLaneA || !dom.rumorLaneB) return;
  const { text, tone } = state.rumor;
  dom.rumorLaneA.replaceChildren();
  dom.rumorLaneB.replaceChildren();

  // v45：取消同句重复回声，主笺单条舒缓飘过水面；仅存在另一条不同历史风闻时才错峰 5.5 秒飘出第二条
  const main = document.createElement('div');
  main.className = `rumor-slip tone-${tone}`;
  main.textContent = `${TONE_LABEL[tone] || '街谈'} · ${text}`;
  dom.rumorLaneA.appendChild(main);
  main.addEventListener('animationend', () => main.remove(), { once: true });

  const prevOther = [...(state.rumorLog || [])].reverse().find((it) => it && it.text && it.text !== text);
  let second = null;
  if (prevOther) {
    second = document.createElement('div');
    second.className = `rumor-slip tone-${prevOther.tone || 'neutral'} is-echo`;
    second.textContent = `${TONE_LABEL[prevOther.tone] || '街谈'} · ${prevOther.text}`;
    dom.rumorLaneB.appendChild(second);
    second.addEventListener('animationend', () => second.remove(), { once: true });
  }

  setTimeout(() => {
    main.remove();
    if (second) second.remove();
  }, 24000);
}

export function toggleWorkbench(forceClose = false) {
  const btn = dom.workbenchBtn;
  const panel = dom.workbenchPanel;
  if (!btn || !panel) return;
  const isOpen = panel.classList.contains('open');
  const willOpen = !forceClose && !isOpen;
  // v46 B4：备忘手账只能在门外御街视角主动打开，严禁在柜台/案板视角被误触弹出
  if (willOpen && state.viewMode !== 'outdoor') return;

  if (!willOpen) {
    if (isOpen) {
      closeModalWithMotion(panel);
      state.modalOpen = false;
      state.paused = false;
      renderHUD();
    }
    if (dom.outdoorWorkbench) dom.outdoorWorkbench.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    return;
  }

  state.paused = true;
  state.modalOpen = true;
  renderHUD();
  if (dom.outdoorWorkbench) dom.outdoorWorkbench.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  btn.setAttribute('aria-expanded', 'true');

  if (dom.wbFineMat) dom.wbFineMat.textContent = state.fineMaterial ? '已备好鲜料' : '尚未采买';
  if (dom.wbHotDish) dom.wbHotDish.textContent = state.hotDish ? `${BOARD_RECIPES[state.hotDish].name} 2×` : '尚未打听';
  const cellMat = document.getElementById('wb-cell-mat');
  const cellHot = document.getElementById('wb-cell-hot');
  if (cellMat) cellMat.classList.toggle('is-ready', Boolean(state.fineMaterial));
  if (cellHot) cellHot.classList.toggle('is-ready', Boolean(state.hotDish));
  if (dom.workbenchTime) dom.workbenchTime.textContent = dom.statDay.textContent;

  if (dom.wbRumorList) {
    dom.wbRumorList.replaceChildren();
    const items = state.rumorLog.slice(-4).reverse();
    if (!items.length) {
      const li = document.createElement('li');
      li.textContent = state.rumor.text || '街上是静的，尚无风闻';
      dom.wbRumorList.appendChild(li);
    } else {
      for (const { text, tone } of items) {
        const li = document.createElement('li');
        li.className = tone === 'warn' ? 'tone-warn' : (tone === 'pos' ? 'tone-pos' : '');
        const lbl = TONE_LABEL[tone] || '街谈';
        li.textContent = `${lbl} · ${text}`;
        dom.wbRumorList.appendChild(li);
      }
    }
  }

  openModalSafely(panel);
}

export function openGuestProfileModal(g) {
  if (!g) return;
  state.paused = true; state.modalOpen = true; renderHUD();
  const key = g.type === 'normal' ? g.id : g.type;
  const tpl = GUEST_POOL.find((x) => x.id === key);
  const prof = tpl ? tpl.profile : SPECIAL_GUEST_PROFILES[key];
  const cnt = Math.max(1, state.encounters[key] || 1);
  dom.profileGuestName.textContent = g.name;
  dom.profileGuestBadge.textContent = g.badge;
  dom.profileEncounterCount.textContent = `已相遇 ${cnt} 次`;
  setPortraitSafely(dom.profileGuestImg, g.img);

  const items = [
    { label: '身份', text: prof ? prof.identity : '汴梁过客', need: 1 },
    { label: '来历', text: prof ? prof.origin : '夜游御街', need: 1 },
    { label: '偏好', text: prof ? prof.preference : '偏好手作吃食', need: 2 },
    { label: '隐藏需求', text: prof ? prof.hiddenNeed : '以诚相待即可结缘', need: 3 }
  ];
  dom.profileRows.innerHTML = items.map((it) => {
    const unlocked = cnt >= it.need;
    return `<div class="profile-row ${unlocked ? '' : 'locked'}"><strong>${it.label}</strong><p>${unlocked ? it.text : `再遇 ${it.need - cnt} 次即可知晓`}</p></div>`;
  }).join('');
  openModalSafely(dom.guestProfileModal);
}

export function closeGuestProfileModal() {
  closeModalWithMotion(dom.guestProfileModal);
  state.modalOpen = false; state.paused = false; renderHUD();
}

export function openCodexModal() {
  state.paused = true; state.modalOpen = true; renderHUD();
  dom.codexList.innerHTML = CODEX_ENTRIES.map((item) => {
    if (!state.unlockedCodex.has(item.id)) {
      return `<article class="codex-card locked"><div class="codex-card-head"><span class="codex-card-title">未解锁 · ${item.title}</span><span class="codex-source">${item.source}</span></div><p class="codex-note">解锁条件：${item.unlockHint}</p></article>`;
    }
    return `<article class="codex-card"><div class="codex-card-head"><span class="codex-card-title">${item.title}</span><span class="codex-source">${item.source}</span></div><blockquote class="codex-quote">${item.quote}</blockquote><p class="codex-note">${item.note}</p></article>`;
  }).join('');
  openModalSafely(dom.codexModal);
}

export function closeCodexModal() {
  closeModalWithMotion(dom.codexModal); state.modalOpen = false; state.paused = false; renderHUD();
}

export function openLedgerModal(onBuyUpgrade, onNextDay) {
  state.paused = true; state.modalOpen = true; unlockCodex('ledger_reinvest');
  dom.ledgerTitle.textContent = `第${state.day}夜 · 梦华账本`;
  dom.ledgerEarned.textContent = `+${state.dayEarnedSilver}两`;
  dom.ledgerServed.textContent = `${state.dayServedCount}位`;
  dom.ledgerRep.textContent = state.reputation;
  dom.ledgerWenxin.textContent = `${state.wenxin}点`;
  if (dom.ledgerNarrative) {
    const recent = state.dayChoiceLog.slice(-3);
    const itemsHtml = recent.length
      ? recent.map((t) => `<li>${t}</li>`).join('')
      : `<li>今夜安稳守铺，亲手招待了 ${state.dayServedCount} 位过客。</li>`;
    const warnCls = state.rumor.tone === 'warn' ? 'warn' : (state.rumor.tone === 'pos' ? 'pos' : '');
    dom.ledgerNarrative.innerHTML = `<div class="ledger-narrative-head">今夜你做了这几件事：</div><ul>${itemsHtml}</ul><div class="ledger-rumor-line ${warnCls}">街上开始有人说：${state.rumor.text}</div>`;
  }

  if (state.wenxin >= 12) dom.ledgerReview.textContent = '《梦华录》评语：以诗会友、义利兼顾，满城皆称“儒雅文商”！';
  else if (state.dayEarnedSilver >= 120) dom.ledgerReview.textContent = '《梦华录》评语：灯火彻夜、日进斗金，颇有汴京大贾之风！';
  else dom.ledgerReview.textContent = '《梦华录》评语：细水长流、手作匠心，明日可添置招牌广纳客源。';

  function renderUpgrades() {
    dom.upgradeList.innerHTML = '';
    for (const up of UPGRADES) {
      const lv = state.upgrades[up.id], isMax = lv >= up.maxLevel, cost = up.baseCost + lv * 50;
      const row = document.createElement('div');
      row.className = 'upgrade-row';
      row.innerHTML = `<div class="upgrade-info"><strong>${up.name} (Lv.${lv}/${up.maxLevel})</strong><span>${up.desc}</span></div><button type="button" class="seal-btn upgrade-buy-btn" ${isMax || state.silver < cost ? 'disabled' : ''}>${isMax ? '已满级' : `${cost}两`}</button>`;
      row.querySelector('button').addEventListener('click', () => { if (onBuyUpgrade(up.id, cost)) { renderUpgrades(); renderHUD(); } });
      dom.upgradeList.appendChild(row);
    }
  }
  renderUpgrades();
  dom.btnNextDay.disabled = false;
  dom.btnNextDay.textContent = `开启第${state.day + 1}夜`;
  dom.btnNextDay.onclick = () => {
    if (dom.btnNextDay.disabled) return;
    dom.btnNextDay.disabled = true;
    closeModalWithMotion(dom.ledgerModal);
    setTimeout(onNextDay, 210);
  };
  openModalSafely(dom.ledgerModal);
  renderHUD();
}

// ================= 4. 重构 AVG 两段式抉择心流（读完台词 → 点击暗化 + 落花展开图标选项） =================
let avgTypeTimer = null, avgFullText = '', avgOnPanelClick = null;
let avgHasChoices = false, avgChoicesRevealed = false;
let avgPendingStoryChoices = [], avgPendingOnDismiss = null;

function spawnAvgPetals() {
  if (!dom.avgPetalLayer) return;
  dom.avgPetalLayer.innerHTML = '';
  // v41 景深轻盈粒子：6枚不规则透明飘瓣(3D慢速翻落) + 6枚微光琉璃光尘，静谧透气不抢字
  const petalTones = [
    ['#fff7f0', '#f7cfc0'],
    ['#f2fffb', '#b8ece0'],
    ['#fffbe8', '#f5dfa0']
  ];
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('span');
    const isFar = i % 2 === 1;
    p.className = `avg-petal ${isFar ? 'is-far' : 'is-near'}`;
    const [c1, c2] = petalTones[i % petalTones.length];
    const size = isFar ? (11 + Math.random() * 4) : (15 + Math.random() * 5);
    p.style.left = `${6 + i * 16 + Math.random() * 8}%`;
    p.style.width = `${size.toFixed(1)}px`;
    p.style.height = `${(size * 0.72).toFixed(1)}px`;
    p.style.setProperty('--dur', `${(9.5 + Math.random() * 5.0).toFixed(2)}s`);
    p.style.setProperty('--delay', `${(-Math.random() * 8.0).toFixed(2)}s`);
    p.style.setProperty('--sway', `${(28 + Math.random() * 34).toFixed(0)}px`);
    p.innerHTML = `<svg viewBox="0 0 24 18" width="100%" height="100%" aria-hidden="true"><defs><linearGradient id="ptg${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}" stop-opacity="0.9"/><stop offset="100%" stop-color="${c2}" stop-opacity="0.65"/></linearGradient></defs><path d="M2,11 C4,3 14,1 22,5 C20,13 12,17 4,15 C2.5,14.5 1.8,13 2,11 Z" fill="url(#ptg${i})"/></svg>`;
    dom.avgPetalLayer.appendChild(p);
  }
  for (let j = 0; j < 6; j++) {
    const m = document.createElement('span');
    m.className = `avg-mote ${j % 2 === 0 ? 'is-gold' : 'is-aqua'}`;
    const sz = 4 + Math.random() * 5;
    m.style.left = `${10 + j * 15 + Math.random() * 8}%`;
    m.style.bottom = `${8 + Math.random() * 48}%`;
    m.style.width = `${sz.toFixed(1)}px`;
    m.style.height = `${sz.toFixed(1)}px`;
    m.style.setProperty('--dur', `${(10 + Math.random() * 6).toFixed(2)}s`);
    m.style.setProperty('--delay', `${(-Math.random() * 6).toFixed(2)}s`);
    dom.avgPetalLayer.appendChild(m);
  }
}

function revealAvgChoices() {
  if (!avgHasChoices || avgChoicesRevealed) return;
  avgChoicesRevealed = true;
  dom.avgOverlay.classList.add('choosing');
  dom.avgChoices.classList.add('revealed');
  dom.avgNextTri.style.display = 'none';
  if (dom.btnAvgCollapse) dom.btnAvgCollapse.style.display = 'inline-block';
  spawnAvgPetals();
}

function collapseAvgChoices() {
  if (!avgHasChoices || !avgChoicesRevealed) return;
  avgChoicesRevealed = false;
  dom.avgOverlay.classList.remove('choosing');
  dom.avgOverlay.classList.toggle('is-outdoor-encounter', Boolean(isOutdoorEncounter));
  dom.avgChoices.classList.remove('revealed');
  if (dom.btnAvgCollapse) dom.btnAvgCollapse.style.display = 'none';
  dom.avgNextTri.style.display = 'inline';
  const isPoemStep = Boolean(dom.avgChoices.querySelector('.poem-eye'));
  dom.avgNextTri.textContent = isPoemStep ? '▾ 轻触读诗眼' : '▾ 轻触抉择';
}

if (dom.btnAvgCollapse) {
  dom.btnAvgCollapse.addEventListener('click', (e) => {
    e.stopPropagation();
    collapseAvgChoices();
  });
}
if (dom.avgPortraitWrap) {
  dom.avgPortraitWrap.addEventListener('click', (e) => {
    if (avgChoicesRevealed) {
      e.stopPropagation();
      collapseAvgChoices();
    }
  });
}

function startAvgTypewriter(text) {
  clearInterval(avgTypeTimer);
  avgFullText = text;
  dom.avgText.textContent = '';
  let i = 0;
  avgTypeTimer = setInterval(() => {
    i += 1;
    dom.avgText.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(avgTypeTimer);
      avgTypeTimer = null;
    }
  }, 28);
}

function handleAvgAdvanceClick(e) {
  if (e.target.closest('.avg-choice-btn, #btn-avg-collapse')) return;
  if (avgTypeTimer) {
    clearInterval(avgTypeTimer);
    avgTypeTimer = null;
    dom.avgText.textContent = avgFullText;
    return;
  }
  if (avgHasChoices && !avgChoicesRevealed) {
    revealAvgChoices();
    return;
  }
  if (!avgHasChoices && avgOnPanelClick) {
    avgOnPanelClick();
  }
}

dom.avgStage.addEventListener('click', handleAvgAdvanceClick);
dom.avgBackdrop.addEventListener('click', handleAvgAdvanceClick);

function parseChoiceRows(ch) {
  const costs = [];
  const gains = [];
  let delayed = ch.delayed || '';
  const unitMap = { silver: '两', rep: '商誉', wenxin: '文心' };

  for (const ef of (ch.effects || [])) {
    if (ef.type === 'custom') {
      if (/第\d夜回报/.test(ef.text)) {
        delayed = ef.text;
      } else {
        gains.push(ef.text);
      }
    } else if (ef.delta < 0) {
      costs.push(`${ef.delta}${unitMap[ef.type] || ''}`);
    } else if (ef.delta > 0) {
      gains.push(`+${ef.delta}${unitMap[ef.type] || ''}`);
    }
  }
  return {
    costText: costs.join(' · '),
    gainText: gains.join(' · ') || ch.desc || '',
    delayedText: delayed
  };
}

function renderStoryChoicesList(choices) {
  dom.avgChoices.innerHTML = '';
  const parsed = choices.map((ch) => ({ ch, ...parseChoiceRows(ch) }));
  const groupHasDelayed = parsed.some((p) => Boolean(p.delayedText));

  for (const item of parsed) {
    const { ch, costText, gainText, delayedText } = item;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'avg-choice-btn';
    if (ch.disabled) {
      btn.disabled = true;
      btn.dataset.disabledReason = ch.disabledReason || '暂不可选';
    }
    const tagText = ch.subtitle || ch.tag || '';
    const tagHtml = tagText ? `<em class="choice-tag">${tagText}</em>` : '';
    const gainCls = (!costText && /^(返回|保留|立刻)/.test(gainText)) ? 'choice-gain is-neutral' : 'choice-gain';
    const row2 = (costText || gainText)
      ? `<span class="choice-row-2"><span class="choice-cost">${costText || '&nbsp;'}</span><span class="${gainCls}">${gainText || '&nbsp;'}</span></span>`
      : '';
    const row3 = groupHasDelayed
      ? `<span class="choice-row-3 ${delayedText ? '' : 'is-none'}">${delayedText || '无后续回报'}</span>`
      : '';

    btn.innerHTML = `<span class="choice-row-1"><strong>${ch.title}</strong>${tagHtml}</span>${row2}${row3}`;
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (ch.disabled || btn.disabled) return;
      btn.disabled = true;
      clearInterval(avgTypeTimer);
      avgTypeTimer = null;
      ch.onSelect();
    });
    dom.avgChoices.appendChild(btn);
  }
}

export function openAvgDialogue({ portrait, speaker, sub, text, showPoem = false, poem = null, insights = [], poemKey = null, choices = [], onDismiss = null, isOutdoorEncounter = false }) {
  state.paused = true;
  state.modalOpen = true;
  renderHUD();

  const hasInsights = Boolean(poem && insights && insights.length > 0);
  avgHasChoices = hasInsights || choices.length > 0;
  avgChoicesRevealed = false;
  avgPendingStoryChoices = choices;
  avgPendingOnDismiss = onDismiss;
  dom.avgOverlay.classList.remove('choosing');
  dom.avgChoices.classList.remove('revealed');
  if (dom.btnAvgCollapse) dom.btnAvgCollapse.style.display = 'none';
  if (dom.avgPetalLayer) dom.avgPetalLayer.innerHTML = '';

  dom.avgPortrait.style.animation = 'none';
  void dom.avgPortrait.offsetWidth;
  dom.avgPortrait.style.animation = '';
  setPortraitSafely(dom.avgPortrait, portrait);

  dom.avgSpeakerName.textContent = speaker;
  dom.avgSpeakerSub.textContent = sub ? `· ${sub}` : '';
  dom.avgPoemCard.classList.toggle('visible', showPoem);

  if (dom.avgPoemEyeQuote) {
    if (hasInsights && !showPoem) {
      dom.poemEyeSrc.textContent = `诗眼 · ${poem.source}`;
      dom.poemEyeLine.textContent = `“${poem.line}”`;
      dom.avgPoemEyeQuote.style.display = 'block';
    } else {
      dom.avgPoemEyeQuote.style.display = 'none';
    }
  }

  dom.avgChoices.innerHTML = '';
  dom.avgNextTri.style.display = 'inline';
  dom.avgNextTri.textContent = hasInsights ? '▾ 轻触读诗眼' : (choices.length > 0 ? '▾ 轻触抉择' : '▾');
  avgOnPanelClick = avgHasChoices ? null : onDismiss;

  if (hasInsights) {
    for (const ins of insights) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'avg-choice-btn poem-eye';
      btn.innerHTML = `<span class="choice-row-1"><strong>${ins.text}</strong><em class="choice-tag">诗眼解读</em></span>`;
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (btn.disabled) return;
        dom.avgChoices.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        clearInterval(avgTypeTimer);
        avgTypeTimer = null;
        if (ins.wenxinDelta) state.wenxin += ins.wenxinDelta;
        if (ins.correct && poemKey) state.poemSolved.add(poemKey);
        recordChoice(ins.log || `解读「${poem.source}」：${ins.text}`, ins.path || 'wen', 1);
        renderHUD();
        if (ins.correct) {
          showToast(`【诗眼通透】读懂诗意，文心 +${ins.wenxinDelta}点`, 'gold');
        } else if (ins.wenxinDelta > 0) {
          showToast(`【略有体悟】文心 +${ins.wenxinDelta}点`);
        } else {
          showToast('【浮光掠影】未尽得诗中深意，仍可继续应对');
        }
        if (avgPendingStoryChoices.length > 0) {
          renderStoryChoicesList(avgPendingStoryChoices);
        } else {
          dom.avgChoices.innerHTML = '';
          dom.avgChoices.classList.remove('revealed');
          avgHasChoices = false;
          avgOnPanelClick = avgPendingOnDismiss;
          dom.avgNextTri.style.display = 'inline';
          dom.avgNextTri.textContent = '▾ 轻触继续';
        }
      });
      dom.avgChoices.appendChild(btn);
    }
  } else {
    renderStoryChoicesList(choices);
  }

  openModalSafely(dom.avgOverlay);
  startAvgTypewriter(text);
}

export function closeAvgDialogue() {
  clearInterval(avgTypeTimer);
  avgTypeTimer = null;
  avgOnPanelClick = null;
  avgHasChoices = false;
  avgChoicesRevealed = false;
  if (dom.avgPetalLayer) dom.avgPetalLayer.innerHTML = '';
  if (dom.btnAvgCollapse) dom.btnAvgCollapse.style.display = 'none';
  dom.avgOverlay.classList.remove('is-outdoor-encounter');
  closeModalWithMotion(dom.avgOverlay);
}

function renderEndingMeta() {
  if (dom.endingPathsBar) {
    const mkDots = (v) => {
      const filled = Math.max(0, Math.min(4, Math.round(v / 2.2)));
      return '●'.repeat(filled) + '○'.repeat(4 - filled);
    };
    dom.endingPathsBar.innerHTML = [
      `<span class="path-meter wen">文脉 <span class="path-dots">${mkDots(state.paths.wen)}</span></span>`,
      `<span class="path-meter trade">商道 <span class="path-dots">${mkDots(state.paths.trade)}</span></span>`,
      `<span class="path-meter heart">人情 <span class="path-dots">${mkDots(state.paths.heart)}</span></span>`
    ].join('');
  }
  if (dom.endingNotes) {
    const notes = state.choiceLog.slice(-3);
    const listHtml = notes.length
      ? notes.map((n) => `<li>${n}</li>`).join('')
      : '<li>三夜灯火无波，安稳守住了御街这一方酒肆。</li>';
    dom.endingNotes.innerHTML = `<div class="ending-notes-title">商道手记：</div><ul>${listHtml}</ul>`;
  }
  dom.endSilver.textContent = `${state.silver}两`;
  dom.endServed.textContent = `${state.totalServedCount}位`;
  dom.endWenxin.textContent = `${state.wenxin}点`;
  dom.endCodex.textContent = `${state.unlockedCodex.size}/${CODEX_ENTRIES.length}`;
}

export function openThreeNightEnding() {
  state.gameOver = true; state.paused = true; state.modalOpen = true;
  dom.endingSeal.textContent = '三夜商道总评';

  const { wen, trade, heart } = state.paths;
  const maxP = Math.max(wen, trade, heart);
  const minP = Math.min(wen, trade, heart);

  let title = '', desc = '', emblem = null;

  // 1. 失败优先
  if (state.reputation <= 0) {
    title = '《众叛亲离》';
    desc = '你推烈酒让商妇哭了一夜，把书生的诗当噱头，把画师的颜料算进成本。第三夜没人再进门。孟元老路过只写一句：「有楼焉，灯亮而座空。」';
  } else if (state.silver <= GAME_CONFIG.bankruptSilver) {
    title = '《账房跑路》';
    desc = '账上的窟窿再也填不上。那晚你摘下最后一对红灯笼，从后门走了。御街的灯照常亮着，只是少了一盏写着「梦」字的。';
  }
  // 2. 隐藏结局《三不朽》
  else if (maxP - minP <= 1 && state.wenxin >= 12 && state.silver >= 180 && state.totalServedCount >= 25) {
    title = '《三不朽》';
    desc = '孟元老在书里写下了你——不是为了诗，不是为了钱，也不是为了人情，而是你居然三样都做到了。古人云立德、立功、立言，你在一间小酒楼里，把这三件事做了一遍。';
    emblem = './assets/ui/ending_scholar.png';
  }
  // 3. 三大路线判定
  else if (wen >= trade && wen >= heart) {
    if (state.wenxin >= 12) {
      title = '《一代儒商》';
      desc = '三夜灯火，你以义制利、以诗会友。孟元老写：「御街有梦华楼，壁有太白旧题，座有君子。」百年后人们记得的不是酒价，是那面墙。';
      emblem = './assets/ui/ending_scholar.png';
    } else if (state.wenxin <= 3 && !state.investments.scholar && !state.investments.painter && state.wifeChoseLiquor) {
      title = '《饥寒书生》';
      desc = '你把书生的墨宝换了三十两，把灯谜卖给了隔壁。第三夜他没再来。画师临走前把石青撒进汴河：丹青不遇知音，不如喂鱼。';
    } else {
      title = '《青灯书肆》';
      desc = '梦华楼没成为最赚钱的酒楼，却成了汴梁文人的据点。夜里常有穷书生来蹭一盏灯，你从来不赶。账薄了些，但墙上快挂满字了。';
      emblem = './assets/ui/ending_scholar.png';
    }
  } else if (trade >= wen && trade >= heart) {
    if (state.silver >= 180) {
      title = '《汴京大贾》';
      desc = '你算无遗策，商情、灯市、引流，每一两银子都生出了下一两。三年后梦华楼成了御街首富，账房先生姓孟——对，就是写《东京梦华录》的那位。';
      emblem = './assets/ui/ending_merchant.png';
    } else {
      title = '《御街灯市》';
      desc = '你没成为首富，但你点的那排灯成了御街一景。往来客商都认得「梦华楼的红灯」，说那光里有股人情味。';
      emblem = './assets/ui/ending_merchant.png';
    }
  } else {
    if (state.totalServedCount >= 25) {
      title = '《诗酒名楼》';
      desc = '你记得每位客人的酒。商妇再来时你没多问，只是默默温了一盏青梅酿。三年后她说：「整条御街，只有梦华楼记得我丈夫出门那年，我穿的是什么颜色的衣裳。」';
      emblem = './assets/ui/ending_tavern.png';
    } else {
      title = '《解愁一盏》';
      desc = '生意清淡，但总有人来。失意的人在这里坐一晚上，走时眼里松快些。你没赚到什么钱，只是那盏解愁暖灯，从没熄过。';
      emblem = './assets/ui/ending_tavern.png';
    }
  }

  dom.endingTitle.textContent = title;
  dom.endingDesc.textContent = desc;
  if (dom.endingEmblemImg) {
    if (emblem) {
      dom.endingEmblemImg.src = emblem;
      dom.endingEmblemImg.style.display = 'block';
    } else {
      dom.endingEmblemImg.style.display = 'none';
    }
  }
  renderEndingMeta();
  openModalSafely(dom.endingModal);
  renderHUD();
}

export function checkGameOver() {
  if (state.reputation <= 0 || state.silver <= GAME_CONFIG.bankruptSilver) {
    openThreeNightEnding();
  }
}
