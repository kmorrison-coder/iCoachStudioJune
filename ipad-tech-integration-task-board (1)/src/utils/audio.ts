// Programmatic Web Audio API synthesizers for lightweight, reliable, zero-asset sound effects

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    // Standard and vendor-prefixed support
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  
  // Resume context if suspended (common browser security behavior)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  return audioCtx;
}

/**
 * Synthesizes a clean, brief, professional click sound.
 * Good for button submissions and general item checks.
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    
    // Quick high pitch sweep down
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

    // Fast decay envelope
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (err) {
    console.warn('Web Audio API click suppressed or failed:', err);
  }
}

/**
 * Synthesizes a subtle, soft "whoosh" or "paper flutter" sound mimicking a page turning.
 * Perfectly suited for switching modes, select options, or opening task details.
 */
export function playPageTurnSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.25; // 1/4 second
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate White Noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter to sweep through mid-range frequencies, simulating soft brush-like movement of paper
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2.0, ctx.currentTime);
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.22);

    // Smooth envelope with brief attack and decay
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.05); // quiet peak
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
    noiseSource.stop(ctx.currentTime + 0.25);
  } catch (err) {
    console.warn('Web Audio API page turn suppressed or failed:', err);
  }
}
