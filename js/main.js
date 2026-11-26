const POETIC_RIDDLES = {
  osmanthus_cake: '掌柜，我想寻一盘“秋月落金、绵软清甜”的细点。',
  plum_wine: '掌柜，可有那“翠梅浮琥珀、最解离愁”的一盏？',
  wine: '红泥小火，微醺正好，请掌柜温一壶暖身。',
  meat: '闻得炭火椒盐香飘十里，请掌柜炙一份油亮解馋的！'
};
import { BOARD_RECIPES, CODEX_ENTRIES, DISH_KEYS, GAME_CONFIG, GUEST_POOL, POEM_EYES } from './config.js';
import { state, resetFullGame, startNextDayState, recordChoice } from './state.js';
import { SoundFX } from './audio.js';
import { initOpeningCutscene } from './opening.js';
import { startCookingBoard, stopCookingBoard, hasBoardProgress } from './cookingBoard.js';
import { renderOutdoorStatus, triggerOutdoorEncounter, triggerOutdoorIntel, triggerOutdoorLantern } from './outdoor.js';
import {
  dom, showToast, shakeTavern, triggerGoldenBurst, spawnCounterFloat,
  switchView, unlockCodex, renderCounterGuest, updateGuestPatienceBar,
  renderHUD, openCodexModal, closeCodexModal, openLedgerModal,
  openAvgDialogue, closeAvgDialogue, openThreeNightEnding, checkGameOver, showSettlementBanner, spawnSealActionFloat, setRumor, openGuestProfileModal, closeGuestProfileModal, toggleWorkbench
} from './ui.js';

let rafId = null, lastTime = 0;

function setDesktopMode(isDesktop) {
  dom.appFrame.classList.toggle('desktop-mode', isDesktop);
  if (dom.menuLayoutState) {
    dom.menuLayoutState.textContent = isDesktop ? '宽屏' : '竖屏';
  }
}
setDesktopMode(false);

function inviteNextGuest(forceType = null) {
  const extraPatience = state.upgrades.gold_sign * 8;
  const r = Math.random();
  const bias = state.rumor?.bias;
  const wLibai = bias === 'wen' ? 0.34 : (bias === 'trade' ? 0.16 : GAME_CONFIG.spawnWeights.libai);
  const wWife = bias === 'heart' ? 0.34 : (bias === 'trade' ? 0.16 : GAME_CONFIG.spawnWeights.wife);
  let g;

  if (forceType === 'libai' || (!forceType && r < wLibai)) {
    g = {
      type: 'libai', name: '醉吟词客', badge: '太白遗风',
      img: './assets/portraits/libai_face.png',
      needItem: 'wine', remaining: GAME_CONFIG.libai.needWineCount,
      line: '听闻贵楼粉墙存有前朝太白题墨，请掌柜亲手为我温两壶清酒！',
      waitedSec: 0, maxPatienceSec: GAME_CONFIG.libai.maxPatienceSec + extraPatience
    };
  } else if (forceType === 'wife' || (!forceType && r < wLibai + wWife)) {
    g = {
      type: 'wife', name: '江夏商妇', badge: '商人妇',
      img: './assets/portraits/wife.png',
      needItem: 'plum_wine', remaining: 1,
      line: '掌柜，给我亲手调一盏青梅酿吧，今夜心里堵得慌。',
      waitedSec: 0, maxPatienceSec: GAME_CONFIG.wife.maxPatienceSec + extraPatience
    };
  } else {
    const tpl = GUEST_POOL[Math.floor(Math.random() * GUEST_POOL.length)];
    const needItem = DISH_KEYS[Math.floor(Math.random() * DISH_KEYS.length)];
    g = {
      id: tpl.id, type: 'normal', name: tpl.name, badge: tpl.badge,
      img: tpl.img, postServe: tpl.postServe,
      needItem, remaining: 1,
      isRiddle: Math.random() < 0.55,
      riddleRevealed: false,
      line: '',
      waitedSec: 0, maxPatienceSec: GAME_CONFIG.normal.maxPatienceSec + extraPatience
    };
    g.line = g.isRiddle ? POETIC_RIDDLES[needItem] : tpl.lines[Math.floor(Math.random() * tpl.lines.length)];
  }

  const encKey = g.type === 'normal' ? g.id : g.type;
  if (state.encounters[encKey] !== undefined) state.encounters[encKey] += 1;
  state.currentGuest = g;
  state.preparedDish = null;
  renderCounterGuest();
  updateGuestPatienceBar();
}

function triggerLibaiStory() {
  SoundFX.miracle();
  triggerGoldenBurst();
  unlockCodex('changganxing_libai');

  openAvgDialogue({
    portrait: './assets/portraits/libai.png',
    speaker: '醉客', sub: '诵太白诗',
    text: '我读太白《长干行》三十年，今日醉了，竟觉那青梅竹马就在眼前……长安？我没去过。是诗带我去的。',
    showPoem: false,
    onDismiss: () => {
      openAvgDialogue({
        portrait: './assets/portraits/libai_face.png',
        speaker: '醉客', sub: '续墨题壁',
        text: '墙上太白的旧墨，被我补足了半阙。借古人的笔，写今日的心事——掌柜，这算不算我的题壁？',
        showPoem: true,
        poemKey: 'libai',
        poem: POEM_EYES.libai.poem,
        insights: POEM_EYES.libai.insights,
        onDismiss: () => {
          closeAvgDialogue();
          state.miracleRemaining = GAME_CONFIG.miracleDurationSec;
          state.currentGuest = null;
          state.nextGuestTimer = GAME_CONFIG.nextGuestGapSec;
          state.modalOpen = false; state.paused = false; lastTime = performance.now();
          setRumor('粉墙续了太白墨', 'pos', 'wen');
          showToast('【诗壁生辉】文人慕名而至，小费 2×！', 'gold');
          renderCounterGuest(); renderHUD();
        }
      });
    }
  });
}

function triggerWifeStory() {
  SoundFX.tapProp(2);
  unlockCodex('jiangxiaxing_wife');
  openAvgDialogue({
    portrait: './assets/portraits/wife.png',
    speaker: '江夏商妇', sub: '商人妇',
    text: '掌柜的，我家那口子行商扬州半年不归。你说，我该怎么过下去？',
    poemKey: 'wife',
    poem: POEM_EYES.wife.poem,
    insights: POEM_EYES.wife.insights,
    choices: [
      {
        title: '烈酒一盏 · 醉里忘忧', tag: '速酒',
        effects: [{ type: 'silver', delta: 100 }, { type: 'rep', delta: -10 }],
        onSelect: () => resolveWifeChoice(1)
      },
      {
        title: '青梅一盏 · 慢慢说来', tag: '温酒',
        effects: [{ type: 'wenxin', delta: 10 }, { type: 'rep', delta: 10 }],
        onSelect: () => resolveWifeChoice(2)
      }
    ]
  });
}

function resolveWifeChoice(num) {
  const cfg = num === 1 ? GAME_CONFIG.wife.choice1 : GAME_CONFIG.wife.choice2;
  state.silver += cfg.silver; state.dayEarnedSilver += cfg.silver;
  state.reputation = Math.max(0, Math.min(120, state.reputation + cfg.rep));
  state.wenxin += cfg.wenxin; state.dayServedCount += 1; state.totalServedCount += 1;
  state.currentGuest = null; state.nextGuestTimer = GAME_CONFIG.nextGuestGapSec;

  closeAvgDialogue(); state.modalOpen = false; state.paused = false; lastTime = performance.now();
  if (num === 1) {
    state.wifeChoseLiquor = true;
    recordChoice('力荐烈酒予江夏商妇，赚得百两却伤了人心', 'trade', 2);
    setRumor('专赚伤心人钱', 'warn', 'trade');
    SoundFX.smash(); shakeTavern();
    showSettlementBanner({
      seal: '抉择', title: '消耗青梅酿×1 · 改荐烈酒',
      consumedDish: 'plum_wine',
      effects: [{ type: 'silver', delta: 100 }, { type: 'rep', delta: -10 }]
    });
  } else {
    recordChoice('劝江夏商妇饮下青梅酿，听她说完扬州的旧事', 'heart', 2);
    setRumor('梦华酒能解心事', 'pos', 'heart');
    SoundFX.serveOk(); unlockCodex('righteous_merchant');
    showSettlementBanner({
      seal: '儒商', title: '消耗青梅酿×1 · 温言解愁',
      consumedDish: 'plum_wine',
      effects: [{ type: 'wenxin', delta: 10 }, { type: 'rep', delta: 10 }]
    });
  }
  if (state.wenxin >= 20) unlockCodex('righteous_merchant');
  renderCounterGuest(); renderHUD(); checkGameOver();
}

function serveCurrentGuest() {
  const g = state.currentGuest;
  if (!g || !state.preparedDish) return;
  const dishKey = state.preparedDish;
  state.preparedDish = null;
  if (dishKey !== g.needItem) {
    SoundFX.wrong();
    state.comboCount = 0;
    spawnCounterFloat(`客官要的是【${BOARD_RECIPES[g.needItem].name}】呀！`, true);
    showToast(`上错菜啦！客官其实想点【${BOARD_RECIPES[g.needItem].name}】，连击归零。`, 'warn');
    g.riddleRevealed = true;
    renderCounterGuest(); renderHUD();
    return;
  }
  state.comboCount += 1;

  if (g.type === 'libai') {
    g.remaining -= 1;
    g.waitedSec = Math.max(0, g.waitedSec - GAME_CONFIG.libai.patienceExtendPerWine);
    if (g.remaining > 0) {
      SoundFX.serveOk();
      spawnSealActionFloat('<span class="sf-cost">消耗温酒×1</span> · <span class="sf-gain">诗仙赞叹（还需1壶）</span>');
      g.line = '痛快！劳烦掌柜再温一壶来！';
      renderCounterGuest(); renderHUD();
      return;
    }
    state.dayServedCount += 1; state.totalServedCount += 1; state.libaiCount += 1;
    renderCounterGuest(); renderHUD();
    triggerLibaiStory();
    return;
  }

  if (g.type === 'wife') {
    renderCounterGuest(); renderHUD();
    triggerWifeStory();
    return;
  }

  // 普通客官：基础结账 + 热销加成 + 专属短对话抉择
  const basePrice = BOARD_RECIPES[dishKey].price;
  const hotMult = state.hotDish === dishKey ? 2 : 1;
  const miracleMult = state.miracleRemaining > 0 ? GAME_CONFIG.miracleTipMultiplier : 1;
  const riddleMult = (g.isRiddle && !g.riddleRevealed) ? 1.5 : 1;
  const comboMult = state.comboCount >= 3 ? 1.3 : (state.comboCount === 2 ? 1.15 : 1);
  const earned = Math.round(basePrice * (1 + state.upgrades.gold_sign * 0.2) * hotMult * miracleMult * riddleMult * comboMult);
  if (state.affection[g.id] !== undefined) state.affection[g.id] += 1;

  const dishName = BOARD_RECIPES[dishKey].name;
  const gainWenxin = (state.upgrades.tea_service > 0 ? state.upgrades.tea_service * 2 : 0) + (state.fineMaterial ? 3 : 0);
  const comboRep = state.comboCount >= 3 ? 1 : 0;
  const gainRep = (state.upgrades.tea_service > 0 ? state.upgrades.tea_service * 2 : 0) + comboRep;

  state.silver += earned; state.dayEarnedSilver += earned; state.dayServedCount += 1; state.totalServedCount += 1;
  state.wenxin += gainWenxin;
  state.reputation = Math.min(120, state.reputation + gainRep);

  SoundFX.serveOk();
  spawnSealActionFloat(`<span class="sf-cost">消耗${dishName}×1</span> · <img src="./assets/ui/sycee.png" alt="银" /><span class="sf-gold">+${earned}两</span>`);

  const multLabels = [];
  if (hotMult > 1) multLabels.push('热销2×');
  if (miracleMult > 1) multLabels.push('神迹2×');
  if (riddleMult > 1) multLabels.push('知音1.5×');
  if (comboMult > 1) multLabels.push(`连击${state.comboCount}`);

  const serveEffects = [{ type: 'silver', delta: earned }];
  if (gainRep > 0) serveEffects.push({ type: 'rep', delta: gainRep });
  if (gainWenxin > 0) serveEffects.push({ type: 'wenxin', delta: gainWenxin });
  showSettlementBanner({
    seal: '出品',
    title: `敬予${g.name} · 收益结算`,
    multText: multLabels.join(' · '),
    consumedDish: dishKey,
    effects: serveEffects
  });

  if (g.postServe) {
    const eyeCfg = POEM_EYES[g.id] || null;
    openAvgDialogue({
      portrait: g.img,
      speaker: g.name,
      sub: '餐后闲谈',
      text: g.postServe.text,
      poemKey: eyeCfg ? g.id : null,
      poem: eyeCfg ? eyeCfg.poem : null,
      insights: eyeCfg ? eyeCfg.insights : [],
      choices: g.postServe.choices.map((c) => ({
        title: c.title,
        tag: c.tag,
        effects: c.effects,
        onSelect: () => {
          state.silver += c.silver || 0;
          state.dayEarnedSilver += c.silver || 0;
          state.reputation = Math.max(0, Math.min(120, state.reputation + (c.rep || 0)));
          state.wenxin += c.wenxin || 0;
          if (c.codex) unlockCodex(c.codex);
          const pKey = (c.silver > 0 && !(c.wenxin >= 8)) ? 'trade' : (c.wenxin >= 8 ? 'wen' : 'heart');
          recordChoice(`面对${g.name}，你选择「${c.title}」`, pKey, 1);
          if (pKey === 'heart') setRumor(`善待${g.name}有人情`, 'pos', 'heart');
          else if (pKey === 'wen') setRumor('掌柜雅量高致', 'pos', 'wen');
          else setRumor('算盘精明客如云', 'neutral', 'trade');
          SoundFX.serveOk();
          closeAvgDialogue();
          state.currentGuest = null;
          state.nextGuestTimer = GAME_CONFIG.nextGuestGapSec;
          state.modalOpen = false; state.paused = false; lastTime = performance.now();
          renderCounterGuest(); renderHUD(); checkGameOver();
          showSettlementBanner({
            seal: '闲谈',
            title: `${g.name} · ${c.tag || '抉择结算'}`,
            effects: c.effects || []
          });
        }
      }))
    });
  } else {
    state.currentGuest = null; state.nextGuestTimer = GAME_CONFIG.nextGuestGapSec;
    renderCounterGuest(); renderHUD();
  }
}

let counterResumeGuard = 0; // v46：回柜台后的缓冲计时（秒），防止切回瞬间突兀弹出账本卷轴
let boardEntryElapsed = 0;  // v46：记录进入案板时刻，确保烹饪耗时完全不计入夜次时间

function openBoardFor(dishKey) {
  boardEntryElapsed = state.dayElapsedSec;
  switchView('board');
  renderHUD();
  startCookingBoard(dishKey, (finishedKey) => {
    toggleWorkbench(true); // v46 B2：强制立刻关闭备忘手账
    state.dayElapsedSec = boardEntryElapsed; // v46 B3：烹饪耗时不计入夜次
    state.preparedDish = finishedKey;
    unlockCodex('menghualu_food');
    switchView('counter');
    state.paused = false;
    state.modalOpen = false;
    counterResumeGuard = 2.0;
    lastTime = performance.now();
    renderCounterGuest();
    renderHUD();
    const fn = BOARD_RECIPES[finishedKey].name;
    spawnSealActionFloat(`<span class="sf-gain">手作完成【${fn}】×1</span> · 点印章上菜`);
  });
}

function updateGame(dt) {
  // 在俯视案板或门外御街期间，店内时间与客官耐心全部自动暂停！
  if (state.paused || state.modalOpen || state.viewMode !== 'counter' || state.gameOver) return;

  if (counterResumeGuard > 0) {
    counterResumeGuard = Math.max(0, counterResumeGuard - dt);
  }
  state.dayElapsedSec += dt;
  if (counterResumeGuard === 0
      && state.dayElapsedSec >= GAME_CONFIG.dayDurationSec
      && !state.currentGuest
      && !state.preparedDish) {
    SoundFX.miracle();
    if (state.day >= GAME_CONFIG.maxDays) openThreeNightEnding();
    else {
      openLedgerModal(
        (id, cost) => { if (state.silver < cost) return false; state.silver -= cost; state.upgrades[id] += 1; SoundFX.serveOk(); return true; },
        () => {
          startNextDayState(); renderCounterGuest(); renderHUD();
          if (state.day === 2 && state.investments.scholar) {
            state.investments.scholar = false;
            state.silver += 80; state.wenxin += 10;
            openAvgDialogue({
              portrait: './assets/portraits/scholar.png', speaker: '落榜书生', sub: '跨夜回报',
              text: '掌柜大恩！承蒙昨夜买下墨宝，今日竟被礼部大人赏识！特奉上润笔谢礼80两与文心10点！',
              onDismiss: () => { closeAvgDialogue(); state.modalOpen = false; state.paused = false; renderHUD(); lastTime = performance.now(); }
            });
          } else if (state.day === 3 && state.investments.painter) {
            state.investments.painter = false;
            state.silver += 100; state.reputation = Math.min(120, state.reputation + 15);
            openAvgDialogue({
              portrait: './assets/portraits/painter.png', speaker: '汴京画师', sub: '跨夜回报',
              text: '掌柜！我用你资助的石青金粉画成《梦华夜市图》，轰动全城！特带赏金100两与满城商誉前来报喜！',
              onDismiss: () => { closeAvgDialogue(); state.modalOpen = false; state.paused = false; renderHUD(); lastTime = performance.now(); }
            });
          } else {
            showToast(`第${state.day}夜开市！静候第一位客官。`, 'gold');
          }
          lastTime = performance.now();
        }
      );
    }
    return;
  }

  if (state.miracleRemaining > 0) state.miracleRemaining = Math.max(0, state.miracleRemaining - dt);

  if (!state.currentGuest) {
    state.nextGuestTimer -= dt;
    if (state.nextGuestTimer <= 0 && state.dayElapsedSec < GAME_CONFIG.dayDurationSec) inviteNextGuest();
  } else {
    state.currentGuest.waitedSec += dt;
    updateGuestPatienceBar();
    if (state.currentGuest.waitedSec >= state.currentGuest.maxPatienceSec) {
      const g = state.currentGuest;
      const pSilver = g.type === 'libai' ? GAME_CONFIG.libai.smashPenaltySilver : (g.type === 'wife' ? GAME_CONFIG.wife.smashPenaltySilver : GAME_CONFIG.normal.smashPenaltySilver);
      const pRep = g.type === 'libai' ? GAME_CONFIG.libai.smashPenaltyRep : (g.type === 'wife' ? GAME_CONFIG.wife.smashPenaltyRep : GAME_CONFIG.normal.smashPenaltyRep);
      state.silver -= pSilver; state.reputation = Math.max(0, state.reputation - pRep);
      state.currentGuest = null; state.preparedDish = null; state.nextGuestTimer = GAME_CONFIG.nextGuestGapSec;
      SoundFX.smash(); shakeTavern();
      spawnCounterFloat(`久等离去 -${pSilver}两`, true);
      showToast(`${g.name}久等离去（银两 -${pSilver}两，商誉 -${pRep}）`, 'warn');
      renderCounterGuest(); renderHUD(); checkGameOver();
    }
  }
  renderHUD();
}

function loop(now) {
  if (!lastTime) lastTime = now;
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  updateGame(dt);
  rafId = requestAnimationFrame(loop);
}

function startNewRun() {
  if (rafId) cancelAnimationFrame(rafId);
  stopCookingBoard();
  resetFullGame();
  closeAvgDialogue();
  dom.ledgerModal.classList.remove('open');
  dom.codexModal.classList.remove('open');
  dom.endingModal.classList.remove('open');
  if (dom.guestProfileModal) dom.guestProfileModal.classList.remove('open');
  switchView('counter');
  renderCounterGuest();
  renderHUD();
  lastTime = performance.now();
  rafId = requestAnimationFrame(loop);
}

// 交互绑定（含已备好菜品防误触保护）
let pendingRemakeDish = null;
let pendingRemakeTimer = null;

document.querySelectorAll('.pick-dish-mini').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!state.currentGuest) {
      SoundFX.tapProp(0);
      showToast('檐下静候中：客官尚未登门，可点右侧窗边【出街】探访御街', 'gold');
      return;
    }
    const pick = btn.dataset.pick;
    if (state.preparedDish) {
      const prepName = BOARD_RECIPES[state.preparedDish].name;
      if (pick === state.preparedDish) {
        SoundFX.tapProp(1);
        showToast(`【${prepName}】已备妥，请轻触右侧【上菜】印章奉客！`, 'gold');
        return;
      }
      if (pendingRemakeDish !== pick) {
        pendingRemakeDish = pick;
        clearTimeout(pendingRemakeTimer);
        pendingRemakeTimer = setTimeout(() => { pendingRemakeDish = null; }, 3200);
        SoundFX.tapProp(0);
        showToast(`手中已端着【${prepName}】，请点右印上菜；若要改做【${BOARD_RECIPES[pick].name}】请再点一次`, 'warn');
        return;
      }
      pendingRemakeDish = null;
      clearTimeout(pendingRemakeTimer);
    }
    openBoardFor(pick);
  });
});
dom.btnRiddleHint.addEventListener('click', () => {
  if (!state.currentGuest) return;
  state.currentGuest.riddleRevealed = true;
  SoundFX.tapProp(0);
  showToast(`客官轻声笑道：“其实就是想吃【${BOARD_RECIPES[state.currentGuest.needItem].name}】啦。”`);
  renderCounterGuest();
});
dom.btnServeDish.addEventListener('click', () => {
  if (!state.currentGuest) return;
  if (state.preparedDish) {
    pendingRemakeDish = null;
    serveCurrentGuest();
  } else if (!state.currentGuest.isRiddle || state.currentGuest.riddleRevealed) {
    openBoardFor(state.currentGuest.needItem);
  } else {
    SoundFX.tapProp(0);
    showToast('诗意点单中：请从下方 4 道菜品里选一道手作猜菜，或点【悄悄询问】', 'gold');
    if (dom.bottomDishShelf) {
      dom.bottomDishShelf.classList.remove('riddle-flash');
      void dom.bottomDishShelf.offsetWidth;
      dom.bottomDishShelf.classList.add('riddle-flash');
      setTimeout(() => dom.bottomDishShelf.classList.remove('riddle-flash'), 1100);
    }
  }
});
let pendingBoardExit = false, pendingBoardExitTimer = null;
const exitBoard = () => {
  if (hasBoardProgress() && !pendingBoardExit) {
    pendingBoardExit = true;
    clearTimeout(pendingBoardExitTimer);
    pendingBoardExitTimer = setTimeout(() => { pendingBoardExit = false; }, 3000);
    SoundFX.tapProp(0);
    const tip = document.getElementById('gesture-hint');
    if (tip) tip.textContent = '尚未出品，3秒内再点一次左下返回键将清空当前进度';
    return;
  }
  pendingBoardExit = false;
  clearTimeout(pendingBoardExitTimer);
  stopCookingBoard();
  state.dayElapsedSec = boardEntryElapsed; // v46 B3：中途退出案板同样不侵蚀夜次时间
  switchView('counter');
  counterResumeGuard = 2.0;
  renderHUD();
  lastTime = performance.now();
};
const btnBoardBackBottom = document.getElementById('btn-board-back-bottom');
if (btnBoardBackBottom) btnBoardBackBottom.addEventListener('click', exitBoard);

// 门外御街交互
dom.btnGoOutdoor.addEventListener('click', () => {
  renderOutdoorStatus();
  switchView('outdoor');
  renderHUD();
});
const handleReturnFromOutdoor = () => {
  switchView('counter');
  counterResumeGuard = 1.2;
  renderHUD();
  lastTime = performance.now();
};
const handleOutdoorLantern = () => {
  triggerOutdoorLantern((who) => {
    switchView('counter');
    counterResumeGuard = 1.2;
    inviteNextGuest(who);
    renderHUD();
    lastTime = performance.now();
  });
};

const outdoorHandlers = {
  intel: triggerOutdoorIntel,
  encounter: triggerOutdoorEncounter,
  lantern: handleOutdoorLantern,
  return: handleReturnFromOutdoor
};

const hsReturn = document.getElementById('hotspot-return');
const hsIntel = document.getElementById('hotspot-intel');
const hsEncounter = document.getElementById('hotspot-encounter');
const hsLantern = document.getElementById('hotspot-lantern');
if (hsReturn) hsReturn.addEventListener('click', outdoorHandlers.return);
if (hsIntel) hsIntel.addEventListener('click', outdoorHandlers.intel);
if (hsEncounter) hsEncounter.addEventListener('click', outdoorHandlers.encounter);
if (hsLantern) hsLantern.addEventListener('click', outdoorHandlers.lantern);



// 顶栏与课堂演示通道
dom.btnCodex.addEventListener('click', () => {
  if (state.gameOver) return;
  if (dom.codexModal.classList.contains('open')) closeCodexModal();
  else openCodexModal();
});
dom.btnCloseCodex.addEventListener('click', closeCodexModal);
if (dom.btnGuestProfile) {
  dom.btnGuestProfile.addEventListener('click', () => {
    if (state.currentGuest && !state.modalOpen && !state.gameOver) openGuestProfileModal(state.currentGuest);
  });
}
if (dom.btnCloseProfile) dom.btnCloseProfile.addEventListener('click', closeGuestProfileModal);
if (dom.workbenchBtn) {
  dom.workbenchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWorkbench();
  });
}
// v36 方案A：居中卷轴手账的合卷按钮、点遮罩与 Esc 关闭
const btnCloseWb = document.getElementById('btn-close-workbench');
if (btnCloseWb) {
  btnCloseWb.addEventListener('click', () => toggleWorkbench(true));
}
if (dom.workbenchPanel) {
  dom.workbenchPanel.addEventListener('click', (ev) => {
    if (ev.target === dom.workbenchPanel) toggleWorkbench(true);
  });
}
window.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && dom.workbenchPanel?.classList.contains('open')) {
    toggleWorkbench(true);
  }
});
function closeSettingsMenu() {
  if (!dom.hudSettingsMenu || !dom.btnSettings) return;
  dom.hudSettingsMenu.classList.remove('open');
  dom.hudSettingsMenu.setAttribute('aria-hidden', 'true');
  dom.btnSettings.setAttribute('aria-expanded', 'false');
}

function togglePause() {
  if (state.viewMode === 'counter' && !state.modalOpen && !state.gameOver) {
    state.paused = !state.paused;
    if (!state.paused) lastTime = performance.now();
    renderHUD();
  }
}

if (dom.btnSettings && dom.hudSettingsMenu) {
  dom.btnSettings.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !dom.hudSettingsMenu.classList.contains('open');
    dom.hudSettingsMenu.classList.toggle('open', willOpen);
    dom.hudSettingsMenu.setAttribute('aria-hidden', String(!willOpen));
    dom.btnSettings.setAttribute('aria-expanded', String(willOpen));
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#hud-settings-menu') && !e.target.closest('#btn-settings')) {
      closeSettingsMenu();
    }
  });
}

if (dom.menuPause) {
  dom.menuPause.addEventListener('click', () => {
    togglePause();
    closeSettingsMenu();
  });
}
if (dom.menuMute) {
  dom.menuMute.addEventListener('click', () => {
    const isMuted = SoundFX.toggleMute();
    if (dom.menuMuteState) dom.menuMuteState.textContent = isMuted ? '关' : '开';
    closeSettingsMenu();
  });
}
if (dom.menuLayout) {
  dom.menuLayout.addEventListener('click', () => {
    setDesktopMode(!dom.appFrame.classList.contains('desktop-mode'));
    closeSettingsMenu();
  });
}

// 暂停快捷方式：双击画面（排除按钮/菜单/案板）与 Space 键
dom.appFrame.addEventListener('dblclick', (e) => {
  if (e.target.closest('button, .hud-settings-menu, #board-canvas, .modal-overlay, .avg-overlay, .opening-screen')) return;
  togglePause();
});
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.repeat) {
    const opening = document.getElementById('opening-screen');
    if (opening && !opening.classList.contains('hidden')) return;
    if (state.viewMode === 'counter' && !state.modalOpen && !state.gameOver) {
      e.preventDefault();
      togglePause();
    }
  }
});

if (dom.btnResumeBanner) {
  dom.btnResumeBanner.addEventListener('click', () => {
    if (!state.modalOpen && !state.gameOver) { state.paused = false; lastTime = performance.now(); renderHUD(); }
  });
}
dom.btnPlayAgain.addEventListener('click', () => { SoundFX.serveOk(); startNewRun(); });

dom.btnDemoCook.addEventListener('click', () => { closeCodexModal(); if (!state.currentGuest) showToast('练习模式：当前无候座客官，可先体验桂花糕手作', 'gold'); openBoardFor('osmanthus_cake'); });
dom.btnDemoOutdoor.addEventListener('click', () => { closeCodexModal(); renderOutdoorStatus(); switchView('outdoor'); });
dom.btnDemoCodex.addEventListener('click', () => { for (const item of CODEX_ENTRIES) state.unlockedCodex.add(item.id); SoundFX.miracle(); openCodexModal(); });
dom.btnDemoLibai.addEventListener('click', () => { closeCodexModal(); triggerLibaiStory(); });
dom.btnDemoWife.addEventListener('click', () => { closeCodexModal(); triggerWifeStory(); });
if (dom.btnDemoEndWen) {
  dom.btnDemoEndWen.addEventListener('click', () => {
    closeCodexModal();
    state.paths = { wen: 9, trade: 2, heart: 4 };
    state.wenxin = Math.max(state.wenxin, 14);
    if (!state.choiceLog.length) {
      state.choiceLog.push('读懂醉客补壁之心，守住梦华楼前朝文脉', '在桥头买下书生墨宝挂进梦华楼', '资助画师采买石青金粉');
    }
    openThreeNightEnding();
  });
}
if (dom.btnDemoEndTrade) {
  dom.btnDemoEndTrade.addEventListener('click', () => {
    closeCodexModal();
    state.paths = { wen: 2, trade: 9, heart: 2 };
    state.silver = Math.max(state.silver, 190);
    if (!state.choiceLog.length) {
      state.choiceLog.push('教书生将诗作改写为夜市灯谜售卖', '与御街货郎互推引流揽客', '锁定御街热销菜品倍增收益');
    }
    openThreeNightEnding();
  });
}
if (dom.btnDemoEndHeart) {
  dom.btnDemoEndHeart.addEventListener('click', () => {
    closeCodexModal();
    state.paths = { wen: 3, trade: 2, heart: 9 };
    state.totalServedCount = Math.max(state.totalServedCount, 28);
    if (!state.choiceLog.length) {
      state.choiceLog.push('读懂江夏商妇离愁，明白她所求乃倾听而非烈酒', '劝江夏商妇饮下青梅酿，听她说完扬州的旧事', '邀汴京画师回店免费品盏青梅酿');
    }
    openThreeNightEnding();
  });
}

initOpeningCutscene(() => {
  SoundFX.serveOk();
  startNewRun();
});
