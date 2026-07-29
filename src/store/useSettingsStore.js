import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const THEME_PALETTES = {
  amber: {
    id: 'amber',
    name: 'Sacred Amber (TMA Classic)',
    hex: '#F59E0B',
    hover: '#D97706',
    rgb: '245, 158, 11'
  },
  green: {
    id: 'green',
    name: 'Nexus Emerald (Matrix Green)',
    hex: '#22C55E',
    hover: '#16A34A',
    rgb: '34, 197, 94'
  },
  cyan: {
    id: 'cyan',
    name: 'Quantum Cyan (Sci-Fi Sky)',
    hex: '#06B6D4',
    hover: '#0891B2',
    rgb: '6, 182, 212'
  },
  purple: {
    id: 'purple',
    name: 'Temporal Violet (Cosmic Void)',
    hex: '#A855F7',
    hover: '#9333EA',
    rgb: '168, 85, 247'
  },
  red: {
    id: 'red',
    name: 'Pruning Crimson (Red Alert)',
    hex: '#EF4444',
    hover: '#DC2626',
    rgb: '239, 68, 68'
  }
}

// Convert Hex to RGB string helper for custom colors
function hexToRgb(hex) {
  let c = hex.replace('#', '')
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('')
  }
  const num = parseInt(c, 16)
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`
}

export function applyThemeToCss(themeId, customHex) {
  if (typeof document === 'undefined') return
  const palette = THEME_PALETTES[themeId]
  const hex = themeId === 'custom' && customHex ? customHex : (palette?.hex || '#F59E0B')
  const hover = palette?.hover || hex
  const rgb = themeId === 'custom' && customHex ? hexToRgb(customHex) : (palette?.rgb || '245, 158, 11')

  const root = document.documentElement
  root.style.setProperty('--tva-accent', hex)
  root.style.setProperty('--tva-accent-light', hex)
  root.style.setProperty('--tva-accent-dark', hover)
  root.style.setProperty('--tva-accent-rgb', rgb)

  root.style.setProperty('--color-amber-500', hex)
  root.style.setProperty('--color-amber-400', hex)
  root.style.setProperty('--color-amber-300', hex)
  root.style.setProperty('--color-amber-600', hover)
}

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      soundEnabled: true,
      tickingEnabled: true,
      timeFormat: '24h',
      companyName: 'Task Management Association',

      dailyTargetHours: 8.0,
      themeColor: 'amber', // 'amber' | 'green' | 'cyan' | 'purple' | 'red' | 'custom'
      customAccentHex: '#22C55E',

      initTheme: () => {
        const { themeColor, customAccentHex } = get()
        applyThemeToCss(themeColor, customAccentHex)
      },

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setTickingEnabled: (enabled) => set({ tickingEnabled: enabled }),
      setTimeFormat: (fmt) => set({ timeFormat: fmt }),
      setCompanyName: (name) => set({ companyName: name }),
      setDailyTargetHours: (hrs) => set({ dailyTargetHours: hrs }),
      setThemeColor: (themeId, customHex) => {
        const hex = customHex || get().customAccentHex
        applyThemeToCss(themeId, hex)
        set({
          themeColor: themeId,
          customAccentHex: hex
        })
      }
    }),
    {
      name: 'madame-minute-settings',
      onRehydrateStorage: () => (state) => {
        if (state && typeof state.initTheme === 'function') {
          state.initTheme()
        }
      }
    }
  )
)
