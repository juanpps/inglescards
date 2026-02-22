/**
 * Utilidades de audio para feedback de usuario sin necesidad de archivos externos
 */

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

function playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

export const playSuccessSound = () => {
    // Tono ascendente alegre
    playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.15, 0.1), 100); // E5
};

export const playErrorSound = () => {
    // Tono descendente sutil
    playTone(220, 'triangle', 0.2, 0.1); // A3
    setTimeout(() => playTone(196, 'triangle', 0.2, 0.1), 100); // G3
};

export const playFlipSound = () => {
    playTone(800, 'sine', 0.05, 0.02);
};
