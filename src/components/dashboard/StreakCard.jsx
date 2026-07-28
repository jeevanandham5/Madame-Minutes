import React from 'react'
import { Flame, Trophy, Clock, CheckCircle2 } from 'lucide-react'
import { calculateStreak } from '../../utils/dateUtils'

export function StreakCard({ entries }) {
  const streak = calculateStreak(entries)
  const totalHours = entries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0)
  const completedTasks = entries.filter(e => e.status === 'Completed').length

  return (
    <div className="bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-5 font-mono shadow-[0_0_20px_rgba(245,158,11,0.1)] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">TEMPORAL METRICS</span>
        <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {/* Streak Counter */}
        <div className="p-3 bg-[#141414] border border-zinc-800 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-orange-500 font-extrabold text-2xl">
            <Flame className="w-5 h-5 fill-current" />
            <span>{streak}</span>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase block mt-1">DAY STREAK</span>
        </div>

        {/* Total Hours */}
        <div className="p-3 bg-[#141414] border border-zinc-800 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-amber-400 font-extrabold text-2xl">
            <span>{totalHours.toFixed(1)}</span>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase block mt-1">TOTAL HOURS</span>
        </div>

        {/* Tasks Done */}
        <div className="p-3 bg-[#141414] border border-zinc-800 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-emerald-400 font-extrabold text-2xl">
            <span>{completedTasks}</span>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase block mt-1">LOGGED OBJECTIVES</span>
        </div>
      </div>

      {/* Retro Status Pill */}
      <div className="mt-4 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between text-xs text-amber-300">
        <span className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Productivity Rating:</span>
        </span>
        <strong className="text-amber-400">CLASS-A VARIANT (98%)</strong>
      </div>
    </div>
  )
}
