import React, { useState } from 'react'
import { Plus, Clock, Sparkles, ChevronLeft, ChevronRight, Palmtree } from 'lucide-react'
import dayjs from 'dayjs'
import { useTimesheetStore } from '../../store/useTimesheetStore'
import { useProjectStore } from '../../store/useProjectStore'

export function TimelineEditor({ onOpenAddModal }) {
  const { entries, addEntry } = useTimesheetStore()
  const { projects } = useProjectStore()
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))

  const dayEntries = entries.filter(e => dayjs(e.date).format('YYYY-MM-DD') === selectedDate)
  const isDayHoliday = dayEntries.some(e => e.isHoliday || e.status === 'Holiday' || e.project === 'Sacred Recess')

  // 24 Hour Slots (00:00 to 23:00)
  const hoursList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00')

  const getEntryPosition = (entry) => {
    if (!entry.startTime || !entry.endTime) return null
    const [sH, sM] = entry.startTime.split(':').map(Number)
    const [eH, eM] = entry.endTime.split(':').map(Number)

    const startMin = sH * 60 + (sM || 0)
    const endMin = eH * 60 + (eM || 0)
    const durationMin = Math.max(30, endMin - startMin)

    const topPercent = (startMin / 1440) * 100
    const heightPercent = (durationMin / 1440) * 100

    return { top: `${topPercent}%`, height: `${heightPercent}%` }
  }

  const handleHourClick = (hourStr) => {
    const endHour = String(parseInt(hourStr.split(':')[0], 10) + 1).padStart(2, '0') + ':00'
    addEntry({
      date: selectedDate,
      project: projects[0]?.name || 'TVA Core / Nexus',
      taskTitle: `Timeline Block ${hourStr}`,
      description: 'Logged via Madame Minute Visual Timeline Block Editor',
      status: 'Completed',
      startTime: hourStr,
      endTime: endHour,
      hours: 1.0,
      tags: ['Timeline']
    })
  }

  return (
    <div className="space-y-4 font-mono">
      {/* Date Header Switcher */}
      <div className="flex items-center justify-between p-4 bg-[#1E1E1E] border border-amber-500/30 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-amber-400">VISUAL CHRONO TIMELINE</h2>
            <p className="text-xs text-zinc-400">Click any hour slot to allocate visual work blocks across the day.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedDate(dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD'))}
            className="p-2 bg-[#141414] border border-zinc-800 hover:border-amber-500 text-amber-400 rounded-lg cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1.5 bg-[#141414] border border-zinc-800 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-2">
            {dayjs(selectedDate).format('dddd, MMM DD, YYYY')}
            {isDayHoliday && (
              <span className="px-2 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase font-extrabold flex items-center gap-1">
                <Palmtree className="w-3 h-3" /> HOLIDAY
              </span>
            )}
          </span>
          <button 
            onClick={() => setSelectedDate(dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD'))}
            className="p-2 bg-[#141414] border border-zinc-800 hover:border-amber-500 text-amber-400 rounded-lg cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 24-Hour Timeline Grid Container */}
      <div className="bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-6 shadow-[0_0_25px_rgba(245,158,11,0.1)] relative min-h-[600px]">
        <div className="relative border-l border-zinc-800 ml-16 space-y-6">
          {hoursList.map((hour) => (
            <div 
              key={hour} 
              onClick={() => handleHourClick(hour)}
              className="relative flex items-center group cursor-pointer border-t border-zinc-800/80 pt-1.5 hover:bg-amber-500/5 transition-colors"
            >
              <span className="absolute -left-16 text-xs text-zinc-500 font-mono w-12 text-right">
                {hour}
              </span>
              <span className="text-[11px] text-zinc-600 group-hover:text-amber-400 font-medium pl-3 opacity-0 group-hover:opacity-100 transition-opacity">
                + Click to block {hour} slot
              </span>
            </div>
          ))}

          {/* Render Active Entry Blocks */}
          {dayEntries.map((entry) => {
            const pos = getEntryPosition(entry)
            if (!pos) return null

            const isHolidayEntry = entry.isHoliday || entry.status === 'Holiday' || entry.project === 'Sacred Recess'

            return (
              <div
                key={entry.id}
                style={{ top: pos.top, minHeight: '44px' }}
                className={`absolute left-3 right-3 p-3 rounded-r-lg font-mono group hover:scale-[1.01] transition-transform z-10 ${
                  isHolidayEntry 
                    ? 'bg-gradient-to-r from-purple-950/60 to-purple-900/30 border-l-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-l-4 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-bold block flex items-center gap-1.5 ${isHolidayEntry ? 'text-purple-300' : 'text-amber-300'}`}>
                      {isHolidayEntry && <Palmtree className="w-3.5 h-3.5 text-purple-400" />}
                      <span>{entry.taskTitle}</span>
                    </span>
                    <span className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <strong className={isHolidayEntry ? 'text-purple-400' : 'text-amber-500'}>{entry.project}</strong>
                      <span>•</span>
                      <span>{entry.startTime} - {entry.endTime} ({entry.hours}h)</span>
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    isHolidayEntry ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40' : 'bg-amber-500 text-black'
                  }`}>
                    {entry.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
