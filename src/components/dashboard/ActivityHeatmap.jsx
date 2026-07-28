import React from 'react'
import { getHeatmapData } from '../../utils/dateUtils'

export function ActivityHeatmap({ entries }) {
  const heatmapData = getHeatmapData(entries)

  const getLevelColor = (level) => {
    switch (level) {
      case 1: return 'bg-amber-950/80 border-amber-800/40 text-amber-500'
      case 2: return 'bg-amber-700/80 border-amber-600/50 text-amber-300'
      case 3: return 'bg-amber-500 border-amber-400 text-black'
      case 4: return 'bg-orange-500 border-orange-400 text-black shadow-[0_0_10px_#F97316]'
      default: return 'bg-zinc-900 border-zinc-800'
    }
  }

  return (
    <div className="bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-5 font-mono shadow-[0_0_20px_rgba(245,158,11,0.1)]">
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block">
            CHRONO ACTIVITY MATRIX (90 DAYS)
          </span>
          <span className="text-[11px] text-zinc-400">GitHub-style activity distribution of logged hours</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-zinc-900 border border-zinc-800" />
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-950/80 border border-amber-800/40" />
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-700/80 border border-amber-600/50" />
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 border border-amber-400" />
          <span className="w-2.5 h-2.5 rounded-xs bg-orange-500 border border-orange-400" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-max">
          {heatmapData.map((day) => (
            <div
              key={day.date}
              title={`${day.formattedDate}: ${day.totalHours} hrs logged (${day.count} entries)`}
              className={`w-3.5 h-3.5 rounded-xs border transition-all duration-200 hover:scale-125 cursor-pointer ${getLevelColor(day.level)}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
