// Web Audio API synthesizer for instant scan feedback without external audio files
let audioCtx = null

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (AudioCtx) {
      audioCtx = new AudioCtx()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export function playSuccessBeep() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, now) // A5
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12) // A6

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.15)

    if (navigator.vibrate) {
      navigator.vibrate(80)
    }
  } catch (err) {
    console.warn('Audio feedback error', err)
  }
}

export function playAlreadyBeep() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.setValueAtTime(440, now + 0.1) // A4

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)

    if (navigator.vibrate) {
      navigator.vibrate([60, 40, 60])
    }
  } catch (err) {
    console.warn('Audio feedback error', err)
  }
}

export function playErrorBeep() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now) // A3
    osc.frequency.linearRampToValueAtTime(180, now + 0.2)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)

    if (navigator.vibrate) {
      navigator.vibrate([150, 50, 150])
    }
  } catch (err) {
    console.warn('Audio feedback error', err)
  }
}
