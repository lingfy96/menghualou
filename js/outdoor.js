import { BOARD_RECIPES, DISH_KEYS } from './config.js';
import { state, recordChoice } from './state.js';
import { SoundFX } from './audio.js';
import {
  openAvgDialogue, closeAvgDialogue, renderHUD,
  showToast, unlockCodex, showSettlementBanner, checkGameOver, setRumor
} from './ui.js';

const pillHot = document.getElementById('pill-hot-dish');
const pillMat = document.getElementById('pill-fine-mat');

// v35 一景一器：檐下三灯 & 青荷折扇 专属DOM
const lanternOverlay = document.getElementById('lantern-stage-overlay');
const lanternBackdrop = document.getElementById('lantern-stage-backdrop');
const lanternNote = document.getElementById('lantern-stage-note');
const btnLanternCancel = document.getElementById('btn-lantern-cancel');
const lanternBtns = lanternOverlay ? Array.from(lanternOverlay.querySelectorAll('.lantern-hang-btn')) : [];

const intelOverlay = document.getElementById('intel-fan-overlay');
const intelBackdrop = document.getElementById('intel-fan-backdrop');
const intelSilverPill = document.getElementById('intel-silver-pill');
const btnIntelHot = document.getElementById('btn-intel-hot');
const intelHotSeal = document.getElementById('intel-hot-seal');
const intelHotDesc = document.getElementById('intel-hot-desc');
const intelHotPrice = document.getElementById('intel-hot-price');
const btnIntelMat = document.getElementById('btn-intel-mat');
const intelMatSeal = document.getElementById('intel-mat-seal');
const intelMatDesc = document.getElementById('intel-mat-desc');
const intelMatPrice = document.getElementById('intel-mat-price');
const btnIntelCancel = document.getElementById('btn-intel-cancel');

let pendingSummonCallback = null;
let diegeticBound = false;

function openDiegeticOverlay(el) {
  if (!el) return;
  el.classList.remove('closing');
  el.classList.add('open');
  state.paused = true;
  state.modalOpen = true;
  renderHUD();
}

function closeDiegeticOverlay(el, restoreState = true) {
  if (!el || !el.classList.contains('open')) return;
  el.classList.add('closing');
  window.setTimeout(() => {
    el.classList.remove('open', 'closing');
  }, 210);
  if (restoreState) {
    state.modalOpen = false;
    state.paused = false;
    renderHUD();
  }
}

function bindDiegeticEventsOnce() {
  if (diegeticBound) return;
  diegeticBound = true;

  // 檐下三灯：点任意一盏宫灯即选
  for (const btn of lanternBtns) {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.lantern || 'normal';
      SoundFX.tapProp(3);
      const cb = pendingSummonCallback;
      pendingSummonCallback = null;
      closeDiegeticOverlay(lanternOverlay, false);
      state.modalOpen = false;
      state.paused = false;
      if (typeof cb === 'function') cb(kind);
    });
  }

  const dismissLantern = () => {
    pendingSummonCallback = null;
    closeDiegeticOverlay(lanternOverlay, true);
  };
  if (btnLanternCancel) btnLanternCancel.addEventListener('click', dismissLantern);
  if (lanternBackdrop) lanternBackdrop.addEventListener('click', dismissLantern);

  // 青荷折扇：商情采买双契
  if (btnIntelHot) {
    btnIntelHot.addEventListener('click', () => {
      if (state.hotDish) return;
      if (state.silver >= 15) {
        state.silver -= 15;
        state.hotDish = DISH_KEYS[Math.floor(Math.random() * DISH_KEYS.length)];
        unlockCodex('market_intel');
        SoundFX.serveOk();
        const dishName = BOARD_RECIPES[state.hotDish].name;
        closeDiegeticOverlay(intelOverlay, true);
        renderOutdoorStatus();
        renderHUD();
        showSettlementBanner({
          seal: '商情',
          title: `锁定热销【${dishName}】`,
          multText: '今夜 2×',
          effects: [{ type: 'silver', delta: -15 }, { type: 'custom', text: `${dishName} 售价翻倍`, tone: 'gold' }]
        });
      } else {
        SoundFX.wrong();
        showToast('银两不足15两，暂无法打听商情。', 'warn');
      }
    });
  }

  if (btnIntelMat) {
    btnIntelMat.addEventListener('click', () => {
      if (state.fineMaterial) return;
      if (state.silver >= 20) {
        state.silver -= 20;
        state.fineMaterial = true;
        unlockCodex('market_intel');
        SoundFX.serveOk();
        closeDiegeticOverlay(intelOverlay, true);
        renderOutdoorStatus();
        renderHUD();
        showSettlementBanner({
          seal: '采买',
          title: '已购上等鲜料入库',
          effects: [{ type: 'silver', delta: -20 }, { type: 'custom', text: '今夜每单文心 +3', tone: 'pos' }]
        });
      } else {
        SoundFX.wrong();
        showToast('银两不足20两，暂无法采买上等原料。', 'warn');
      }
    });
  }

  const dismissIntel = () => closeDiegeticOverlay(intelOverlay, true);
  if (btnIntelCancel) btnIntelCancel.addEventListener('click', dismissIntel);
  if (intelBackdrop) intelBackdrop.addEventListener('click', dismissIntel);

  // Esc 快捷退出两处出街特化界面
  window.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    if (lanternOverlay && lanternOverlay.classList.contains('open')) {
      dismissLantern();
    } else if (intelOverlay && intelOverlay.classList.contains('open')) {
      dismissIntel();
    }
  });
}

const OUTDOOR_ENCOUNTERS = [
  {
    portrait: './assets/portraits/scholar.png',
    speaker: '落榜书生', sub: '御街长桥',
    text: '掌柜的，你也出来透气？方才我在桥头卖字画无人问津，连回乡的盘缠都快凑不齐了……',
    choices: [
      {
        title: '买下墨宝挂进梦华楼', tag: '长线垫付', minSilver: 20,
        effects: [{ type: 'silver', delta: -20 }, { type: 'wenxin', delta: 12 }, { type: 'rep', delta: 10 }, { type: 'custom', text: '第2夜回报 +80两/+10点文心', tone: 'gold' }],
        apply() {
          if (state.silver < 20) {
            return { blocked: true, reply: '（摸了摸袖袋，银两不足20两……）掌柜手头紧，先改用别法相助吧。' };
          }
          state.silver -= 20; state.investments.scholar = true; state.wenxin += 12; state.reputation = Math.min(120, state.reputation + 10);
          recordChoice('在桥头买下书生墨宝挂进梦华楼', 'wen', 2);
          setRumor('掌柜识才惜才', 'pos', 'wen');
          unlockCodex('market_humanity');
          return {
            reply: '书生热泪盈眶：“掌柜大义！他日若得高中，必亲题金匾相赠！”',
            banner: { seal: '奇遇', title: '买下书生墨宝 · 跨夜伏笔已埋', effects: [{ type: 'silver', delta: -20 }, { type: 'wenxin', delta: 12 }, { type: 'rep', delta: 10 }] }
          };
        }
      },
      {
        title: '教他改写为夜市灯谜售卖', tag: '即时分润',
        effects: [{ type: 'silver', delta: 15 }, { type: 'wenxin', delta: 6 }],
        apply() {
          state.silver += 15; state.dayEarnedSilver += 15; state.wenxin += 6;
          recordChoice('教书生将诗作改写为夜市灯谜售卖', 'trade', 1);
          setRumor('善以文墨生财', 'neutral', 'trade');
          unlockCodex('market_intel');
          return {
            reply: '书生恍然大悟：“妙啊！原来文学也能与市井商道相融！”',
            banner: { seal: '润笔', title: '指点灯谜商道 · 书生分润', effects: [{ type: 'silver', delta: 15 }, { type: 'wenxin', delta: 6 }] }
          };
        }
      }
    ]
  },
  {
    portrait: './assets/portraits/painter.png',
    speaker: '汴京画师', sub: '运河柳岸',
    text: '掌柜快看这运河水色，碧蓝里浮着金柳倒影！我正愁颜料不够，没法把这清透景致画全。',
    choices: [
      {
        title: '资助画师采买石青金粉', tag: '长线资助', minSilver: 15,
        effects: [{ type: 'silver', delta: -15 }, { type: 'wenxin', delta: 10 }, { type: 'rep', delta: 8 }, { type: 'custom', text: '第3夜回报 +100两/+15商誉', tone: 'gold' }],
        apply() {
          if (state.silver < 15) {
            return { blocked: true, reply: '（盘点账房银两不足15两……）画师笑道：无妨，请我喝盏青梅酿便好！' };
          }
          state.silver -= 15; state.investments.painter = true; state.wenxin += 10; state.reputation = Math.min(120, state.reputation + 8);
          recordChoice('资助画师采买石青金粉', 'wen', 2);
          setRumor('资助画师绘夜市', 'pos', 'wen');
          unlockCodex('market_humanity');
          return {
            reply: '画师欣喜作揖：“多谢掌柜成全！我必把梦华楼画成御街最亮眼的一景！”',
            banner: { seal: '奇遇', title: '资助画师采买颜料 · 跨夜伏笔', effects: [{ type: 'silver', delta: -15 }, { type: 'wenxin', delta: 10 }, { type: 'rep', delta: 8 }] }
          };
        }
      },
      {
        title: '请画师回店免费喝盏青梅酿', tag: '即时结缘',
        effects: [{ type: 'wenxin', delta: 6 }, { type: 'rep', delta: 5 }],
        apply() {
          state.wenxin += 6; state.reputation = Math.min(120, state.reputation + 5);
          recordChoice('邀汴京画师回店免费品盏青梅酿', 'heart', 1);
          setRumor('待人宽厚不计利', 'pos', 'heart');
          return {
            reply: '画师笑道：“掌柜真懂风雅，待我收好画卷便登门拜访！”',
            banner: { seal: '结缘', title: '邀画师品青梅酿', effects: [{ type: 'wenxin', delta: 6 }, { type: 'rep', delta: 5 }] }
          };
        }
      }
    ]
  },
  {
    portrait: './assets/portraits/peddler_v2.png',
    speaker: '御街货郎', sub: '夜市摊头',
    text: '掌柜出来转悠啦？今夜汴京城里都在传，有几位贵客专门奔着清爽手作的吃食来的！',
    choices: [
      {
        title: '顺嘴寒暄 · 打听客群偏好', tag: '广结人缘',
        effects: [{ type: 'silver', delta: 10 }, { type: 'rep', delta: 5 }],
        apply() {
          state.silver += 10; state.dayEarnedSilver += 10; state.reputation = Math.min(120, state.reputation + 5);
          unlockCodex('market_intel');
          return {
            reply: '货郎压低声音：“记好了，客官们最爱看掌柜在案板上慢工细作！”',
            banner: { seal: '商情', title: '货郎引荐熟客', effects: [{ type: 'silver', delta: 10 }, { type: 'rep', delta: 5 }] }
          };
        }
      },
      {
        title: '邀货郎互相引流揽客', tag: '双赢商道',
        effects: [{ type: 'silver', delta: 25 }, { type: 'rep', delta: 4 }],
        apply() {
          state.silver += 25; state.dayEarnedSilver += 25; state.reputation = Math.min(120, state.reputation + 4);
          recordChoice('与御街货郎互推引流揽客', 'trade', 2);
          setRumor('善与街坊联营', 'neutral', 'trade');
          unlockCodex('market_intel');
          return {
            reply: '货郎哈哈大笑：“掌柜真是做生意的奇才，一言为定！”',
            banner: { seal: '联营', title: '御街互推引流结算', effects: [{ type: 'silver', delta: 25 }, { type: 'rep', delta: 4 }] }
          };
        }
      }
    ]
  }
];

let encounterCursor = 0;

export function renderOutdoorStatus() {
  if (pillHot) {
    pillHot.textContent = state.hotDish
      ? `热销${BOARD_RECIPES[state.hotDish].name}2×`
      : '热销未打听';
    pillHot.classList.toggle('is-active', Boolean(state.hotDish));
  }
  if (pillMat) {
    pillMat.textContent = state.fineMaterial
      ? '鲜料已备'
      : '鲜料未采买';
    pillMat.classList.toggle('is-active', Boolean(state.fineMaterial));
  }
  const wbFine = document.getElementById('wb-fine-mat');
  const wbHot = document.getElementById('wb-hot-dish');
  if (wbFine) wbFine.textContent = state.fineMaterial ? '已备好鲜料' : '尚未采买';
  if (wbHot) wbHot.textContent = state.hotDish ? `${BOARD_RECIPES[state.hotDish].name} 2×` : '尚未打听';

  // v36 同步右下角书册状态点与四大热点挂签状态
  const dotMat = document.getElementById('memo-dot-mat');
  const dotHot = document.getElementById('memo-dot-hot');
  if (dotMat) dotMat.classList.toggle('is-ready', Boolean(state.fineMaterial));
  if (dotHot) dotHot.classList.toggle('is-ready', Boolean(state.hotDish));

  const hsIntel = document.getElementById('hotspot-intel');
  const intelTag = document.getElementById('hotspot-intel-tag');
  const intelDoneSeal = document.getElementById('hotspot-intel-done');
  const allBought = Boolean(state.fineMaterial && state.hotDish);
  if (hsIntel) hsIntel.classList.toggle('is-done', allBought);
  if (intelTag) intelTag.textContent = allBought ? '商情备妥' : '商情采买';
  if (intelDoneSeal) intelDoneSeal.classList.toggle('visible', allBought);

  const hsLanternBusy = document.getElementById('hotspot-lantern-busy');
  if (hsLanternBusy) hsLanternBusy.classList.toggle('visible', Boolean(state.currentGuest));
}

export function triggerOutdoorEncounter() {
  const enc = OUTDOOR_ENCOUNTERS[encounterCursor % OUTDOOR_ENCOUNTERS.length];
  encounterCursor += 1;
  SoundFX.tapProp(1);

  openAvgDialogue({
    portrait: enc.portrait,
    speaker: enc.speaker,
    sub: enc.sub,
    text: enc.text,
    isOutdoorEncounter: true,
    choices: enc.choices.map((c) => ({
      title: c.title,
      tag: c.tag,
      effects: c.effects,
      disabled: Boolean(c.minSilver && state.silver < c.minSilver),
      disabledReason: (c.minSilver && state.silver < c.minSilver) ? '银两不足' : '',
      onSelect: () => {
        const res = c.apply();
        if (res.blocked) SoundFX.wrong();
        else SoundFX.serveOk();
        renderHUD();
        renderOutdoorStatus();
        checkGameOver();
        openAvgDialogue({
          portrait: enc.portrait,
          speaker: enc.speaker,
          sub: res.blocked ? '银两不足' : '回礼',
          text: res.reply,
          isOutdoorEncounter: true,
          onDismiss: () => {
            closeAvgDialogue();
            state.modalOpen = false;
            state.paused = false;
            renderHUD();
            if (res.banner) showSettlementBanner(res.banner);
          }
        });
      }
    }))
  });
}

export function triggerOutdoorIntel() {
  bindDiegeticEventsOnce();
  SoundFX.tapProp(2);

  if (intelSilverPill) {
    intelSilverPill.textContent = `囊中银两：${state.silver}两`;
  }

  // 刷新「热销商情」契约状态
  if (btnIntelHot) {
    const owned = Boolean(state.hotDish);
    const short = !owned && state.silver < 15;
    btnIntelHot.classList.toggle('is-owned', owned);
    btnIntelHot.classList.toggle('is-short', short);
    btnIntelHot.disabled = owned || short;
    if (intelHotSeal) {
      intelHotSeal.textContent = owned ? '已定' : (short ? '银两不足' : '商情');
    }
    if (intelHotDesc) {
      intelHotDesc.textContent = owned
        ? `已锁定【${BOARD_RECIPES[state.hotDish].name}】今夜售价 2×`
        : '随机锁定 1 道菜品今夜售价 2×';
    }
    if (intelHotPrice) {
      intelHotPrice.textContent = owned ? '今夜生效' : '-15两';
    }
  }

  // 刷新「上等鲜料」契约状态
  if (btnIntelMat) {
    const owned = Boolean(state.fineMaterial);
    const short = !owned && state.silver < 20;
    btnIntelMat.classList.toggle('is-owned', owned);
    btnIntelMat.classList.toggle('is-short', short);
    btnIntelMat.disabled = owned || short;
    if (intelMatSeal) {
      intelMatSeal.textContent = owned ? '已备' : (short ? '银两不足' : '鲜料');
    }
    if (intelMatDesc) {
      intelMatDesc.textContent = owned
        ? '已入库：今夜每单额外文心 +3'
        : '上等金桂与鲜青梅，今夜每单文心 +3';
    }
    if (intelMatPrice) {
      intelMatPrice.textContent = owned ? '今夜生效' : '-20两';
    }
  }

  openDiegeticOverlay(intelOverlay);
}

export function triggerOutdoorLantern(onSummonGuest) {
  bindDiegeticEventsOnce();
  SoundFX.tapProp(3);
  pendingSummonCallback = onSummonGuest;

  const lanternNoteBox = document.getElementById('lantern-note-box');
  if (lanternNote) {
    if (state.currentGuest) {
      const dishHint = state.preparedDish ? `（已备【${BOARD_RECIPES[state.preparedDish].name}】）` : '';
      lanternNote.innerHTML = `前厅尚有<strong class="warn-guest-em">「${state.currentGuest.name}」</strong>候座${dishHint}，另邀新客将请其离席并撤下已备菜品`;
      lanternNote.classList.add('is-warning');
      if (lanternNoteBox) lanternNoteBox.classList.add('is-warning');
    } else {
      lanternNote.textContent = '暮色漫过运河，轻触一盏宫灯，诚邀有缘客官入座';
      lanternNote.classList.remove('is-warning');
      if (lanternNoteBox) lanternNoteBox.classList.remove('is-warning');
    }
  }

  openDiegeticOverlay(lanternOverlay);
}
