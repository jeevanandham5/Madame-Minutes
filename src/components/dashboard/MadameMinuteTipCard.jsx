import React, { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { MadameMinuteLogo } from '../common/MadameMinuteLogo'

const MADAME_MINUTE_TIPS = [
  "Welcome! Don't let your daily task logs slip away without tracking your hours!",
  "Remember agent: A detailed work journal keeps the Master Timeline running on schedule!",
  "Logged work over 6 hours today? Outstanding! Make sure to take a 15-minute coffee break!",
  "Need to format quick bullet points? Use our AI Rewrite tool to turn raw notes into executive logs!",
  "Tip: Press Cmd + K anytime to trigger the TMA Command Center and search your entire history!",
  "Don't type yesterday's tasks again! Click 'Copy Yesterday' to duplicate entries in one second flat!"
]

export function MadameMinuteTipCard() {
  const [tipIndex, setTipIndex] = useState(0)

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % MADAME_MINUTE_TIPS.length)
  }

  return (
    <div className="relative bg-gradient-to-br from-[#2D1B0A] via-[#1E1E1E] to-[#141414] border border-amber-500/50 rounded-2xl p-7 font-mono shadow-[0_0_35px_rgba(245,158,11,0.2)] flex flex-col md:flex-row items-center gap-6 overflow-hidden">
      {/* Big Analog Madame Minute Clock */}
      <div className="shrink-0 relative group cursor-pointer" onClick={handleNextTip} title="Click Madame Minute for next tip">
        <MadameMinuteLogo size={92} className="drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-extrabold bg-amber-500 text-black px-2 py-0.5 rounded-full uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
          NEXT TIP!
        </span>
      </div>

      {/* Announcement Copy */}
      <div className="flex-1 text-center md:text-left space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-400 tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            MADAME MINUTE OFFICIAL ANNOUNCEMENT
          </span>

          <button 
            onClick={handleNextTip}
            title="Next Announcement"
            className="text-zinc-400 hover:text-amber-400 transition-colors p-1.5 bg-[#141414] border border-zinc-800 rounded-lg flex items-center gap-1 text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Next Tip</span>
          </button>
        </div>

        <p className="text-sm sm:text-base text-amber-100 leading-relaxed font-sans font-semibold italic border-l-2 border-amber-500/60 pl-3 py-1">
          "{MADAME_MINUTE_TIPS[tipIndex]}"
        </p>

        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          CHRONO ADVISORY MODULE • TASK MANAGEMENT ASSOCIATION
        </div>
      </div>
    </div>
  )
}

export const MissMinutesTipCard = MadameMinuteTipCard
