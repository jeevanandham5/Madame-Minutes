import React, { useState } from 'react'
import { Activity, Eye, Shield, Users } from 'lucide-react'
import { useTimesheetStore } from '../../store/useTimesheetStore'
import { useAuthStore, getLocalRegisteredUsers } from '../../store/useAuthStore'
import { formatHours } from '../../utils/dateUtils'
import dayjs from 'dayjs'

export function TvaSacredTimelineMonitor({ onSelectAgent }) {
  const { entries, allEntries, allUsers } = useTimesheetStore()
  const { user } = useAuthStore()

  const [hoveredAgent, setHoveredAgent] = useState(null)
  const [selectedAgentId, setSelectedAgentId] = useState('all')
  const [isAnimating, setIsAnimating] = useState(true)

  // Use real entries pool (allEntries if available, else current entries)
  const sourceEntries = allEntries.length > 0 ? allEntries : entries

  // Build real user list dynamically from registered accounts + Firestore users
  const userMap = new Map()

  // Always include current logged-in user
  if (user) {
    const adminName = (user.displayName && user.displayName !== 'Agent User' && user.displayName !== 'TMA Agent')
      ? user.displayName
      : (user.email ? user.email.split('@')[0] : 'Admin User')

    userMap.set(user.uid || user.email, {
      id: user.uid || user.email,
      name: adminName,
      email: user.email || 'jeevajeevanandham30@gmail.com',
      role: user.role || 'Master Timeline Commander',
      color: '#F59E0B' // Amber
    })
  }

  // Include local registered users
  const localUsers = getLocalRegisteredUsers()
  if (localUsers && localUsers.length > 0) {
    localUsers.forEach((u) => {
      if (u.isGuest || u.email === 'agent@tma.org' || !u.email) return
      const colors = ['#F59E0B', '#3B82F6', '#10B981', '#A855F7', '#F97316', '#EC4899', '#06B6D4']
      const formattedName = (u.displayName && u.displayName !== 'Agent User' && u.displayName !== 'TMA Agent')
        ? u.displayName
        : (u.email ? u.email.split('@')[0] : 'TMA Agent')

      const key = u.uid || u.email
      if (!userMap.has(key)) {
        userMap.set(key, {
          id: key,
          name: formattedName,
          email: u.email || '',
          role: u.role || 'TMA Agent',
          color: colors[userMap.size % colors.length]
        })
      }
    })
  }

  // Include users from Firestore user collection if available
  if (allUsers && allUsers.length > 0) {
    allUsers.forEach((u, i) => {
      if (u.isGuest || u.email === 'agent@tma.org' || !u.email) return
      const colors = ['#F59E0B', '#3B82F6', '#10B981', '#A855F7', '#F97316', '#EC4899', '#06B6D4']
      const formattedName = (u.displayName && u.displayName !== 'Agent User' && u.displayName !== 'TMA Agent')
        ? u.displayName
        : (u.email ? u.email.split('@')[0] : 'TMA Agent')

      const key = u.uid || u.email
      userMap.set(key, {
        id: key,
        name: formattedName,
        email: u.email || '',
        role: u.role || 'TMA Agent',
        color: colors[i % colors.length]
      })
    })
  }

  // Extract unique users from real logged entries
  sourceEntries.forEach(e => {
    const userEmail = e.userEmail || e.email
    const userId = e.userId
    if (!userId && !userEmail) return // Skip unassigned sample entries

    const key = userId || userEmail
    if (key && key !== 'agent-user' && userEmail !== 'agent@tma.org' && !userMap.has(key)) {
      const colors = ['#3B82F6', '#10B981', '#A855F7', '#F97316', '#EC4899', '#06B6D4', '#EAB308']
      const name = (e.userName && e.userName !== 'Agent User' && e.userName !== 'TMA Agent') 
        ? e.userName 
        : (e.displayName && e.displayName !== 'Agent User' && e.displayName !== 'TMA Agent')
        ? e.displayName
        : (userEmail ? userEmail.split('@')[0] : 'TMA Agent')

      userMap.set(key, {
        id: key,
        name,
        email: userEmail || '',
        role: 'TMA Agent',
        color: colors[userMap.size % colors.length]
      })
    }
  })

  const timeHours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  const timeLabels = ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM']
  const todayStr = dayjs().format('YYYY-MM-DD')

  // Compute dynamic timeline data for each real user
  const agentTimelines = Array.from(userMap.values()).map((agentUser) => {
    const userEntries = sourceEntries.filter(e => 
      e.userId === agentUser.id || e.email === agentUser.email || e.userEmail === agentUser.email
    )

    const totalHoursToday = userEntries
      .filter(e => dayjs(e.date).format('YYYY-MM-DD') === todayStr)
      .reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0)

    const totalHoursAll = userEntries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0)

    const latestTask = userEntries[0]?.taskTitle || 'Monotonic Shift Synchronization'

    // Compute waveform y-points across 10 AM to 7 PM from actual entry time ranges
    const points = timeHours.map((h, index) => {
      let isWorking = false
      let isOvertime = false

      userEntries.forEach(entry => {
        if (!entry.startTime || !entry.endTime) return
        const [sH] = entry.startTime.split(':').map(Number)
        const [eH] = entry.endTime.split(':').map(Number)
        if (sH <= h && h <= (eH || sH + 1)) {
          isWorking = true
          if (sH < 10 || eH > 19) isOvertime = true
        }
      })

      // Y positioning: 50 = Sacred Baseline, 30 = Active Shift Work, 15/85 = Branch/Overtime
      let y = 50
      if (isWorking) {
        y = isOvertime ? (index % 2 === 0 ? 18 : 78) : 32
      } else {
        // Subtle natural variance wave
        y = 50 + (index % 2 === 0 ? 3 : -3)
      }

      return { time: timeLabels[index], y }
    })

    return {
      id: agentUser.id,
      name: agentUser.name,
      email: agentUser.email,
      role: agentUser.role,
      color: agentUser.color,
      status: totalHoursToday > 8 ? 'OVERTIME BRANCH' : totalHoursToday > 0 ? 'ACTIVE SHIFT' : 'RESTING',
      hours: totalHoursToday > 0 ? totalHoursToday : totalHoursAll,
      task: latestTask,
      points
    }
  })

  // Canvas dimension setup
  const width = 800
  const height = 260
  const topRedY = 40
  const bottomRedY = 220
  const centerCanvasY = 130

  const getX = (index) => 60 + index * (680 / 9)

  const generateBezierPath = (agent) => {
    const coords = agent.points.map((pt, idx) => {
      const x = getX(idx)
      const y = topRedY + 15 + (pt.y / 100) * (bottomRedY - topRedY - 30)
      return { x, y }
    })

    if (coords.length === 0) return ''

    let path = `M ${coords[0].x} ${coords[0].y}`
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i]
      const next = coords[i + 1]
      const cp1X = curr.x + (next.x - curr.x) / 2
      const cp1Y = curr.y
      const cp2X = curr.x + (next.x - curr.x) / 2
      const cp2Y = next.y
      path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${next.x} ${next.y}`
    }
    return path
  }

  const activeAgents = selectedAgentId === 'all'
    ? agentTimelines
    : agentTimelines.filter(a => a.id === selectedAgentId)

  return (
    <div className="relative font-mono my-6">
      {/* Retro TVA CRT Outer Workstation Housing Container */}
      <div className="bg-[#0F0F0F] border-2 border-amber-600/60 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] relative overflow-hidden">
        
        {/* Top Control Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-pulse">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-amber-400 uppercase tracking-wider">
                  TVA SACRED TIMELINE MONITOR (10:00 AM — 07:00 PM)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase hidden sm:inline-block">
                  REAL-TIME WORKFORCE DATA
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Shift boundaries (10 AM & 7 PM). Live wave paths generated from real logged agent entries.
              </p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-[#141414] border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none"
            >
              <option value="all">⚡ All Real Agents ({agentTimelines.length})</option>
              {agentTimelines.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                isAnimating 
                  ? 'bg-amber-500 text-black border-amber-500' 
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {isAnimating ? 'Pulse ON' : 'Pulse OFF'}
            </button>
          </div>
        </div>

        {/* CRT Display Container */}
        <div className="relative rounded-2xl bg-[#080B0E] border-4 border-[#221A0F] shadow-[inner_0_0_60px_rgba(0,0,0,0.9)] p-2 sm:p-4 overflow-hidden">
          
          {/* CRT Scanline Shader overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-25 z-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
              backgroundSize: '100% 4px'
            }}
          />

          {/* Threshold Boundary Labels */}
          <div className="absolute top-3 left-4 text-[10px] font-bold text-red-500 flex items-center gap-1.5 z-20 bg-black/60 px-2 py-0.5 rounded border border-red-500/40">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>10:00 AM SHIFT THRESHOLD LINE</span>
          </div>

          <div className="absolute bottom-3 left-4 text-[10px] font-bold text-red-500 flex items-center gap-1.5 z-20 bg-black/60 px-2 py-0.5 rounded border border-red-500/40">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>07:00 PM SHIFT THRESHOLD LINE</span>
          </div>

          <div className="absolute bottom-3 right-4 text-xs font-black text-amber-500/40 tracking-widest pointer-events-none z-20 uppercase font-mono">
            TVA MONOLITH v4.2
          </div>

          {/* SVG Canvas */}
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block select-none">
            <defs>
              <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {timeLabels.map((_, i) => (
              <line
                key={`vgrid-${i}`}
                x1={getX(i)}
                y1={topRedY - 10}
                x2={getX(i)}
                y2={bottomRedY + 10}
                stroke="#1E293B"
                strokeDasharray="2 4"
                strokeWidth="1"
              />
            ))}

            <line
              x1="40"
              y1={centerCanvasY}
              x2="760"
              y2={centerCanvasY}
              stroke="#334155"
              strokeDasharray="4 4"
              strokeWidth="1"
            />

            {/* TOP RED LINE (10:00 AM) */}
            <line
              x1="40"
              y1={topRedY}
              x2="760"
              y2={topRedY}
              stroke="#EF4444"
              strokeWidth="3"
              filter="url(#redGlow)"
            />

            {/* BOTTOM RED LINE (07:00 PM) */}
            <line
              x1="40"
              y1={bottomRedY}
              x2="760"
              y2={bottomRedY}
              stroke="#EF4444"
              strokeWidth="3"
              filter="url(#redGlow)"
            />

            {/* Waveform Curves for Real Agents */}
            {activeAgents.map((agent) => {
              const pathD = generateBezierPath(agent)
              const isHovered = hoveredAgent?.id === agent.id

              return (
                <g key={agent.id} className="cursor-pointer">
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="20"
                    onMouseEnter={() => setHoveredAgent(agent)}
                    onMouseLeave={() => setHoveredAgent(null)}
                    onClick={() => onSelectAgent && onSelectAgent(agent)}
                  />

                  <path
                    d={pathD}
                    fill="none"
                    stroke={agent.color}
                    strokeWidth={isHovered ? "4.5" : "2.5"}
                    strokeOpacity={hoveredAgent && !isHovered ? "0.35" : "0.95"}
                    filter={isHovered ? "url(#amberGlow)" : undefined}
                    className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
                    onMouseEnter={() => setHoveredAgent(agent)}
                    onMouseLeave={() => setHoveredAgent(null)}
                    onClick={() => onSelectAgent && onSelectAgent(agent)}
                  />

                  {agent.points.map((pt, pIdx) => {
                    const x = getX(pIdx)
                    const y = topRedY + 15 + (pt.y / 100) * (bottomRedY - topRedY - 30)
                    return (
                      <circle
                        key={`${agent.id}-pt-${pIdx}`}
                        cx={x}
                        cy={y}
                        r={isHovered ? "4" : "2"}
                        fill={agent.color}
                        className="transition-all"
                      />
                    )
                  })}
                </g>
              )
            })}

            {timeLabels.map((lbl, idx) => (
              <text
                key={`lbl-${idx}`}
                x={getX(idx)}
                y={bottomRedY + 26}
                fill="#94A3B8"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {lbl}
              </text>
            ))}
          </svg>

          {hoveredAgent && (
            <div className="absolute top-12 right-6 bg-[#141414]/95 border border-amber-500/60 rounded-xl p-3 shadow-[0_0_25px_rgba(245,158,11,0.3)] z-30 max-w-xs animate-fade-in backdrop-blur-md">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredAgent.color }} />
                <strong className="text-xs font-bold text-amber-300">{hoveredAgent.name}</strong>
              </div>
              <p className="text-[11px] text-zinc-300 font-sans truncate">{hoveredAgent.task}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800 pt-1.5">
                <span>Role: <strong className="text-zinc-200">{hoveredAgent.role}</strong></span>
                <span className="text-amber-400 font-bold">{formatHours(hoveredAgent.hours)} logged</span>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">ACTIVE AGENTS:</span>
            {agentTimelines.map(a => (
              <button
                key={a.id}
                onClick={() => setSelectedAgentId(selectedAgentId === a.id ? 'all' : a.id)}
                onMouseEnter={() => setHoveredAgent(a)}
                onMouseLeave={() => setHoveredAgent(null)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all cursor-pointer ${
                  selectedAgentId === a.id || hoveredAgent?.id === a.id
                    ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                    : 'bg-[#141414] border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="text-[11px] font-bold">{a.name}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>Click agent path to filter branch</span>
          </div>
        </div>
      </div>
    </div>
  )
}
