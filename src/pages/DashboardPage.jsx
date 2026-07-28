import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Sparkles, UserCheck } from 'lucide-react'
import dayjs from 'dayjs'
import { LiveTimerCard } from '../components/dashboard/LiveTimerCard'
import { StreakCard } from '../components/dashboard/StreakCard'
import { MissMinutesTipCard } from '../components/dashboard/MissMinutesTipCard'
import { ActivityHeatmap } from '../components/dashboard/ActivityHeatmap'
import { WorkPulseChart } from '../components/dashboard/WorkPulseChart'
import { useTimesheetStore } from '../store/useTimesheetStore'
import { useAuthStore } from '../store/useAuthStore'
import { useSettingsStore } from '../store/useSettingsStore'
import { HyperText } from '../components/common/HyperText'

export function DashboardPage({ onOpenAddModal }) {
  const { entries } = useTimesheetStore()
  const { user } = useAuthStore()
  const { timeFormat } = useSettingsStore()
  const [now, setNow] = useState(dayjs())

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000)
    return () => clearInterval(timer)
  }, [])

  const currentHour = now.hour()
  const timeOfDayGreeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'
  const fullDateStr = now.format('dddd, MMMM D, YYYY')
  const timeTickerStr = timeFormat === '12h' ? now.format('hh:mm:ss A') : now.format('HH:mm:ss')

  return (
    <div className="space-y-8 font-mono">
      {/* Prominent Centered Big Digital Clock & Full Date Display */}
      <div className="p-8 bg-gradient-to-b from-[#1E1E1E] via-[#161616] to-[#141414] border border-amber-500/40 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.15)] text-center relative overflow-hidden space-y-3">
        {/* Background Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Top Greeting Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <UserCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>{timeOfDayGreeting}, <HyperText text={user?.displayName || 'Agent Mobius'} /></span>
        </div>

        {/* Big Centered Digital Clock Readout */}
        <div className="text-5xl sm:text-7xl font-black text-amber-500 tracking-widest font-mono drop-shadow-[0_0_35px_rgba(245,158,11,0.4)] my-2">
          {timeTickerStr}
        </div>

        {/* Prominent Full Date Banner */}
        <div className="text-base sm:text-xl font-extrabold text-amber-300 tracking-widest uppercase flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-amber-500/40" />
          <span>{fullDateStr}</span>
          <span className="w-8 h-px bg-amber-500/40" />
        </div>
      </div>

      {/* Bigger Madame Minute Announcement Card */}

      <MissMinutesTipCard />

      {/* Live Timer Section */}
      <LiveTimerCard onOpenAddModal={onOpenAddModal} />

      {/* Streak Metrics Row */}
      <StreakCard entries={entries} />

      {/* GitHub Activity Heatmap */}
      <ActivityHeatmap entries={entries} />

      {/* Recharts Work Pulse Graphs */}
      <WorkPulseChart entries={entries} />
    </div>
  )
}
