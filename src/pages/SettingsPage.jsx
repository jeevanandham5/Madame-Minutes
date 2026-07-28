import React, { useState } from 'react'
import { Settings as SettingsIcon, Bell, BellOff, Volume2, VolumeX, Save, Clock, Palette, Check, Sparkles } from 'lucide-react'
import { useSettingsStore, THEME_PALETTES } from '../store/useSettingsStore'
import { toast } from 'sonner'

export function SettingsPage() {
  const { 
    soundEnabled, 
    tickingEnabled, 
    timeFormat, 
    companyName, 
    dailyTargetHours, 
    themeColor,
    customAccentHex,
    setSoundEnabled, 
    setTickingEnabled, 
    setTimeFormat, 
    setCompanyName, 
    setDailyTargetHours,
    setThemeColor
  } = useSettingsStore()

  const [hexInput, setHexInput] = useState(customAccentHex)

  const handleSelectTheme = (paletteId) => {
    setThemeColor(paletteId, hexInput)
    const name = THEME_PALETTES[paletteId]?.name || 'Custom Theme'
    toast.success(`Theme palette switched to ${name}!`)
  }

  const handleCustomHexChange = (val) => {
    setHexInput(val)
    if (val.match(/^#[0-9A-Fa-f]{6}$/)) {
      setThemeColor('custom', val)
      toast.success(`Custom accent color updated to ${val}!`)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Settings saved to Madame Minute Vault!')
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1E1E1E] border border-amber-500/30 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-base font-bold text-amber-400">CHRONO PREFERENCES & APPEARANCE</h2>
            <p className="text-xs text-zinc-400">Customize theme accent color, sound effects, ticking clock, and organization specs.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-6 shadow-[0_0_25px_rgba(245,158,11,0.1)] space-y-6 max-w-2xl">
        {/* APPEARANCE & THEME ACCENT COLOR SECTION */}
        <div>
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-500" />
            <span>APPEARANCE & THEME ACCENT COLOR</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {Object.values(THEME_PALETTES).map(pal => {
              const isSelected = themeColor === pal.id
              return (
                <div
                  key={pal.id}
                  onClick={() => handleSelectTheme(pal.id)}
                  className={`p-3.5 rounded-xl bg-[#141414] border cursor-pointer transition-all flex items-center justify-between group ${
                    isSelected 
                      ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20 shadow-md transition-transform group-hover:scale-110" 
                      style={{ backgroundColor: pal.hex }} 
                    />
                    <div>
                      <strong className="text-xs text-zinc-200 block">{pal.name}</strong>
                      <span className="text-[10px] text-zinc-500">{pal.hex}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </div>
              )
            })}
          </div>

          {/* Custom Accent Hex Input */}
          <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-zinc-300 font-bold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>CUSTOM ACCENT HEX COLOR</span>
              </label>
              <span className="text-[10px] text-zinc-500 uppercase">HEX CODE</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hexInput}
                onChange={(e) => handleCustomHexChange(e.target.value)}
                className="w-10 h-9 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                title="Choose custom color"
              />
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleCustomHexChange(e.target.value)}
                placeholder="#10B981"
                className="flex-1 bg-[#1E1E1E] border border-zinc-700 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleCustomHexChange(hexInput)}
                className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                Apply Color
              </button>
            </div>
          </div>
        </div>

        {/* Audio Sound Settings */}
        <div>
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
            AUDIO & SOUND SYNTHESIZER
          </h3>

          <div className="space-y-4">
            {/* Clock Second Ticking Sound Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#141414] border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {tickingEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </div>
                <div>
                  <strong className="text-xs text-zinc-200 block">Clock Ticking Sound (Every Second)</strong>
                  <span className="text-[11px] text-zinc-500">Plays an authentic vintage mechanical clock tick-tock matching live seconds.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTickingEnabled(!tickingEnabled)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tickingEnabled 
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}
              >
                {tickingEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* System UI Click Sound Effects Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#141414] border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </div>
                <div>
                  <strong className="text-xs text-zinc-200 block">System UI Click & Chirp Effects</strong>
                  <span className="text-[11px] text-zinc-500">Plays vintage computer relay switch sounds on button clicks and AI actions.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  soundEnabled 
                    ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}
              >
                {soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Display & Time Preferences */}
        <div>
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
            ORGANIZATION & TIME SPECS
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-bold">ORGANIZATION NAME</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-bold">DAILY TARGET HOURS</label>
              <input
                type="number"
                value={dailyTargetHours}
                onChange={(e) => setDailyTargetHours(parseFloat(e.target.value) || 8.0)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-bold">TIME DISPLAY FORMAT</label>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none"
              >
                <option value="24h">24-Hour Format (17:00:00)</option>
                <option value="12h">12-Hour Format (05:00:00 PM)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </form>
    </div>
  )
}
