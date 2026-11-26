let ctx = null, muted = false;
function getCtx() {
  if (muted) return null;
  if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
function tone(freq, dur, type = 'sine', vol = 0.08, delay = 0) {
  const ac = getCtx(); if (!ac) return;
  const t = ac.currentTime + delay, osc = ac.createOscillator(), gain = ac.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t); gain.gain.exponentialRampToValueAtTime(vol, t + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain); gain.connect(ac.destination); osc.start(t); osc.stop(t + dur + 0.02);
}
const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
export const SoundFX = {
  toggleMute() { muted = !muted; return muted; },
  tapProp(idx = 0) { tone(NOTES[idx % NOTES.length], 0.16, 'sine', 0.08, 0); },
  gestureTick() { tone(587.33 + Math.random() * 140, 0.07, 'sine', 0.035, 0); },
  sliceCut() { tone(880, 0.08, 'triangle', 0.08, 0); tone(1174.6, 0.12, 'sine', 0.06, 0.04); },
  cookDone() { tone(587.33, 0.14, 'triangle', 0.08, 0); tone(783.99, 0.18, 'sine', 0.08, 0.07); tone(1046.5, 0.28, 'sine', 0.07, 0.14); },
  serveOk() { tone(587.33, 0.12, 'triangle', 0.08, 0); tone(783.99, 0.16, 'sine', 0.08, 0.06); },
  wrong() { tone(196, 0.12, 'triangle', 0.05, 0); },
  smash() { tone(110, 0.22, 'sawtooth', 0.1, 0); },
  miracle() { [392, 440, 523.25, 587.33, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.35, 'sine', 0.07, i * 0.06)); }
};
