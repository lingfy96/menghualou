import { GAME_CONFIG } from './config.js';

export const state = {
  day: 1, dayElapsedSec: 0, dayEarnedSilver: 0, dayServedCount: 0,
  silver: GAME_CONFIG.initialSilver, reputation: GAME_CONFIG.initialReputation,
  wenxin: 0, totalServedCount: 0, libaiCount: 0,
  comboCount: 0,
  currentGuest: null,
  preparedDish: null,
  nextGuestTimer: 1.4,
  hotDish: null,
  fineMaterial: false,
  investments: { scholar: false, painter: false },
  affection: { scholar: 0, foodie: 0, constable: 0, painter: 0, heroine: 0 },
  encounters: { scholar: 0, foodie: 0, constable: 0, painter: 0, heroine: 0, libai: 0, wife: 0 },
  upgrades: { gold_sign: 0, tea_service: 0 },
  unlockedCodex: new Set(['menghualu_tavern']),
  paths: { wen: 0, trade: 0, heart: 0 },
  choiceLog: [],
  dayChoiceLog: [],
  poemSolved: new Set(),
  rumor: { text: '御街初开市', tone: 'neutral', bias: null },
  rumorLog: [],
  wifeChoseLiquor: false,
  miracleRemaining: 0,
  viewMode: 'counter',
  paused: true,
  modalOpen: true,
  gameOver: false
};

export function recordChoice(summary, pathKey = null, weight = 1) {
  if (pathKey && state.paths[pathKey] !== undefined) {
    state.paths[pathKey] += weight;
  }
  if (summary) {
    state.choiceLog.push(summary);
    state.dayChoiceLog.push(summary);
  }
}

export function resetFullGame() {
  state.day = 1; state.dayElapsedSec = 0; state.dayEarnedSilver = 0; state.dayServedCount = 0;
  state.silver = GAME_CONFIG.initialSilver; state.reputation = GAME_CONFIG.initialReputation;
  state.wenxin = 0; state.totalServedCount = 0; state.libaiCount = 0;
  state.comboCount = 0;
  state.currentGuest = null; state.preparedDish = null; state.nextGuestTimer = 1.2;
  state.hotDish = null; state.fineMaterial = false;
  state.investments = { scholar: false, painter: false };
  state.affection = { scholar: 0, foodie: 0, constable: 0, painter: 0, heroine: 0 };
  state.encounters = { scholar: 0, foodie: 0, constable: 0, painter: 0, heroine: 0, libai: 0, wife: 0 };
  state.upgrades = { gold_sign: 0, tea_service: 0 };
  state.unlockedCodex = new Set(['menghualu_tavern']);
  state.paths = { wen: 0, trade: 0, heart: 0 };
  state.choiceLog = [];
  state.dayChoiceLog = [];
  state.poemSolved = new Set();
  state.rumor = { text: '御街初开市', tone: 'neutral', bias: null };
  state.rumorLog = [];
  state.wifeChoseLiquor = false;
  state.miracleRemaining = 0; state.viewMode = 'counter';
  state.paused = false; state.modalOpen = false; state.gameOver = false;
}

export function startNextDayState() {
  state.day += 1; state.dayElapsedSec = 0; state.dayEarnedSilver = 0; state.dayServedCount = 0;
  state.currentGuest = null; state.preparedDish = null; state.nextGuestTimer = 1.2;
  state.hotDish = null; state.fineMaterial = false;
  state.dayChoiceLog = [];
  state.miracleRemaining = 0; state.viewMode = 'counter';
  state.paused = false; state.modalOpen = false;
}
