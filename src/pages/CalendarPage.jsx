import React, { useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Palmtree } from 'lucide-react'
import dayjs from 'dayjs'
import { useTimesheetStore } from '../store/useTimesheetStore'
import { formatHours } from '../utils/dateUtils'

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const { entries } = useTimesheetStore()

  const startOfMonth = currentMonth.startOf('month')
  const daysInMonth = currentMonth.daysInMonth()
  const startDayOfWeek = startOfMonth.day()

  const daysGrid = []
  for (let i = 0; i < startDayOfWeek; i++) {
    daysGrid.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(currentMonth.date(d))
  }

  return (
    <div className="space-y-4 font-mono">
      {/* Month Switcher Bar */}
      <div className="flex items-center justify-between p-4 bg-[#1E1E1E] border border-amber-500/30 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-amber-400">CHRONOLOGY CALENDAR</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
            className="p-2 bg-[#141414] border border-zinc-800 hover:border-amber-500 text-amber-400 rounded-lg cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-4 py-1.5 bg-[#141414] border border-zinc-800 text-amber-300 rounded-lg text-xs font-bold uppercase">
            {currentMonth.format('MMMM YYYY')}
          </span>
          <button
            onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
            className="p-2 bg-[#141414] border border-zinc-800 hover:border-amber-500 text-amber-400 rounded-lg cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-4 shadow-[0_0_25px_rgba(245,158,11,0.1)]">
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-amber-500 uppercase">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="p-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysGrid.map((dateObj, idx) => {
            if (!dateObj) return <div key={idx} className="h-28 bg-[#141414]/30 rounded-lg opacity-30" />

            const dateStr = dateObj.format('YYYY-MM-DD')
            const dayEntries = entries.filter(e => dayjs(e.date).format('YYYY-MM-DD') === dateStr)
            const totalHours = dayEntries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0)
            const isToday = dateObj.isSame(dayjs(), 'day')
            const hasHoliday = dayEntries.some(e => e.isHoliday || e.status === 'Holiday' || e.project === 'Sacred Recess')

            return (
              <div
                key={dateStr}
                className={`h-28 p-2 bg-[#141414] border rounded-lg flex flex-col justify-between transition-all hover:border-amber-500 ${
                  hasHoliday 
                    ? 'border-purple-500/60 bg-purple-950/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                    : isToday 
                    ? 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                    : 'border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${hasHoliday ? 'text-purple-300' : isToday ? 'text-amber-400' : 'text-zinc-400'}`}>
                    {dateObj.format('D')}
                  </span>
                  {hasHoliday ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-0.5">
                      <Palmtree className="w-2.5 h-2.5" />
                      <span>HOLIDAY</span>
                    </span>
                  ) : totalHours > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-bold">
                      {formatHours(totalHours)}
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto">
                  {dayEntries.slice(0, 2).map(e => {
                    const isHolidayEntry = e.isHoliday || e.status === 'Holiday'
                    return (
                      <div 
                        key={e.id} 
                        className={`text-[10px] p-1 rounded truncate font-medium ${
                          isHolidayEntry ? 'bg-purple-900/40 text-purple-200 border border-purple-500/30' : 'bg-zinc-800 text-amber-300'
                        }`}
                      >
                        {e.taskTitle}
                      </div>
                    )
                  })}
                  {dayEntries.length > 2 && (
                    <div className="text-[9px] text-zinc-500 font-medium">
                      +{dayEntries.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
