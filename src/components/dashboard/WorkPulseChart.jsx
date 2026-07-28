import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import dayjs from 'dayjs'

export function WorkPulseChart({ entries }) {
  // Process last 7 days bar data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().subtract(6 - i, 'day')
    const dateStr = d.format('YYYY-MM-DD')
    const dayEntries = entries.filter(e => dayjs(e.date).format('YYYY-MM-DD') === dateStr)
    const hours = dayEntries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0)
    return {
      day: d.format('DDD'),
      shortDate: d.format('MMM DD'),
      hours: parseFloat(hours.toFixed(1))
    }
  })

  // Process Project Distribution Pie Data
  const projectMap = {}
  entries.forEach(e => {
    const pName = e.project || 'Other'
    const h = parseFloat(e.hours) || 0
    projectMap[pName] = (projectMap[pName] || 0) + h
  })

  const COLORS = ['#F59E0B', '#F97316', '#22C55E', '#3B82F6', '#A855F7', '#EC4899']

  const pieData = Object.keys(projectMap).map((name, i) => ({
    name,
    value: parseFloat(projectMap[name].toFixed(1)),
    color: COLORS[i % COLORS.length]
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
      {/* Weekly Hours Bar Chart */}
      <div className="lg:col-span-8 bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-5 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
        <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block">WEEKLY TEMPORAL PULSE</span>
            <span className="text-[11px] text-zinc-400">Total logged hours per day over the past week</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <XAxis dataKey="shortDate" stroke="#71717A" fontSize={11} />
              <YAxis stroke="#71717A" fontSize={11} unit="h" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141414', borderColor: '#F59E0B', color: '#FEF3C7', fontSize: '12px' }}
                cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }}
              />
              <Bar dataKey="hours" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Distribution Pie Chart */}
      <div className="lg:col-span-4 bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-5 shadow-[0_0_20px_rgba(245,158,11,0.1)] flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block mb-1">PROJECT DISTRIBUTION</span>
          <span className="text-[11px] text-zinc-400 block mb-3">Time split across registered projects</span>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#141414', borderColor: '#F59E0B', color: '#FEF3C7', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 mt-2 border-t border-zinc-800 pt-3 max-h-24 overflow-y-auto">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-zinc-300 truncate">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </span>
              <strong className="text-amber-400 shrink-0">{item.value}h</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
