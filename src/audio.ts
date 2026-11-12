let audioCtx: AudioContext | null = null;

/**
 * Programmatically synthesizes a short, polyphonic, ultra-polished "click/tap"
 * sound effect, resembling a modern phone UI. Designed with two staggered
 * high-frequency sine oscillators to achieve a professional polyphonic tone.
 */
export const playInteractionSound = () => {
  try {
    // 1. Lazy initialize standard web audio context to comply with autoplay constraints
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // 2. Resume suspended audio context on user interaction if locked
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    
    // 3. Polyphonic tone combination (High elegant chimes at 1200Hz and 1800Hz)
    const frequencies = [1200, 1800];
    
    frequencies.forEach((freq, index) => {
      if (!audioCtx) return;
      
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now);
      
      // Slightly stagger the oscillators for organic, sophisticated polyphonic feedback
      const startTime = now + index * 0.006;
      const decayDuration = 0.06; // extremely fast modern clicking decay
      
      gainNode.gain.setValueAtTime(0, now);
      // Fast linear attack
      gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.003);
      // Exponential decay to a near-zero amplitude
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + decayDuration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + decayDuration + 0.01);
    });
  } catch (err) {
    // Graceful fallback for browsers or frames restricting AudioContext
    console.warn('[Audio Synth Feedback] Not supported or blocked by sandbox permissions:', err);
  }
};
