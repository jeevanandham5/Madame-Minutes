/**
 * TVA Vintage Computer & Mechanical Clock Web Audio Synthesizer
 * Generates authentic 1970s analog control panel button clicks, relay switches, terminal chirps, and real mechanical clock tick-tocks.
 */
import { useSettingsStore } from '../store/useSettingsStore'

let audioCtx = null
let tickState = false // Toggles between tick (true) and tock (false)

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

/**
 * Authentic Mechanical Escapement Clock Tick-Tock Sound
 * Synthesizes a real mechanical clock pallet-fork strike and gear impact.
 */
export function playTvaTick() {
  const { tickingEnabled } = useSettingsStore.getState()
  if (!tickingEnabled) return

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    tickState = !tickState

    // 1. Mechanical Pallet-Fork Impact (Noise Burst)
    const bufferSize = ctx.sampleRate * 0.006 // 6ms impact
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    // Alternates pitch slightly for real Tick vs Tock mechanical cadence
    noiseFilter.frequency.value = tickState ? 2400 : 1800
    noiseFilter.Q.value = 4.0

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.12, ctx.currentTime)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.006)

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)

    noise.start()

    // 2. Escapement Gear Body Click Tone
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()

    osc.type = 'sine'
    const startFreq = tickState ? 2200 : 1600
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.012)

    oscGain.gain.setValueAtTime(0.1, ctx.currentTime)
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012)

    osc.connect(oscGain)
    oscGain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.012)
  } catch (err) {
    // Ignore audio restrictions
  }
}

/**
 * Vintage TVA Relay Click Sound
 */
export function playTvaClick(frequency = 600, duration = 0.04) {
  const { soundEnabled } = useSettingsStore.getState()
  if (!soundEnabled) return

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration)

    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (err) {
    // Ignore
  }
}

/**
 * 1970s Mainframe Terminal Chirp
 */
export function playTvaChirp() {
  const { soundEnabled } = useSettingsStore.getState()
  if (!soundEnabled) return

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.02)

    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  } catch (err) {
    // Ignore
  }
}

/**
 * TVA Retro Success Chime
 */
export function playTvaSuccess() {
  const { soundEnabled } = useSettingsStore.getState()
  if (!soundEnabled) return

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06)

      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.1)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + i * 0.06)
      osc.stop(ctx.currentTime + i * 0.06 + 0.1)
    })
  } catch (err) {
    // Ignore
  }
}

/**
 * Attaches a global event listener so EVERY button or interactive element click plays the vintage TVA click sound automatically!
 */
export function initGlobalTvaSoundListener() {
  if (typeof window === 'undefined') return

  const handleGlobalClick = (event) => {
    // Unlock Web Audio API context on first user gesture
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    } else if (!audioCtx) {
      getAudioContext()
    }

    const target = event.target
    if (!target) return

    const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], tr')
    if (isInteractive) {
      playTvaClick()
    }
  }

  window.addEventListener('click', handleGlobalClick, { capture: true })
  window.addEventListener('keydown', handleGlobalClick, { capture: true })
}
