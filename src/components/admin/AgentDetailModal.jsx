import React from 'react'
import { X, UserCheck, Shield, Clock, Calendar, CheckCircle2, AlertTriangle, FileText, Activity, Zap, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatHours } from '../../utils/dateUtils'
import { exportToCSV } from '../../utils/exportUtils'
import { toast } from 'sonner'
import dayjs from 'dayjs'

export function AgentDetailModal({ isOpen, onClose, agent }) {
  if (!isOpen || !agent) return null

  // Generate 14-day mock trend data if not provided
  const trendData = agent.trendData || Array.from({ length: 14 }, (_, i) => {
    const d = dayjs().subtract(13 - i, 'day')
    const hours = Math.min(10, Math.max(3, Math.round((Math.random() * 5 + 4) * 10) / 10))
    return {
      date: d.format('MMM DD'),
      fullDate: d.format('YYYY-MM-DD'),
      hours
    }
  })

  // Sample tasks logged by agent
  const agentTasks = agent.tasks || [
    {
      id: 'task-1',
      date: dayjs().format('YYYY-MM-DD'),
      project: agent.department || 'TMA Core / Nexus',
      taskTitle: 'Master Timeline Sync & Audit',
      description: 'Audited branch variance anomalies and synced temporal logs.',
      startTime: '10:00',
      endTime: '14:30',
      hours: 4.5,
      status: 'Completed'
    },
    {
      id: 'task-2',
      date: dayjs().format('YYYY-MM-DD'),
      project: 'Madame Minute AI',
      taskTitle: 'Acoustic Voice Synthesis Calibration',
      description: 'Fine-tuned speech synthesis for retro terminal notifications.',
      startTime: '15:00',
      endTime: '18:30',
      hours: 3.5,
      status: 'In Progress'
    },
    {
      id: 'task-3',
      date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      project: 'Security Audit',
      taskTitle: 'Level 4 Security Access Review',
      description: 'Verified security logs and variant clearance certificates.',
      startTime: '09:30',
      endTime: '16:00',
      hours: 6.5,
      status: 'Completed'
    },
    {
      id: 'task-4',
      date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
      project: agent.department || 'TMA Core / Nexus',
      taskTitle: 'Timeline Calibration & Database Indexing',
      description: 'Optimized index queries for vintage CRT workstations.',
      startTime: '10:00',
      endTime: '17:00',
      hours: 7.0,
      status: 'Completed'
    }
  ]

  const totalHours = agent.hours || agentTasks.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0)

  const handleExportAgentCSV = () => {
    exportToCSV(agentTasks, `agent_${agent.name.replace(/\s+/g, '_')}_logs.csv`)
    toast.success(`Exported timesheet logs for ${agent.name}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in font-mono">
      <div className="w-full max-w-4xl bg-[#1E1E1E] border-2 border-amber-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-zinc-200 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5 mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-black shadow-[0_0_20px_currentColor]"
              style={{ backgroundColor: agent.color || '#F59E0B', color: '#000000' }}
            >
              {agent.name ? agent.name.charAt(0) : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-amber-400">{agent.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  {agent.role || 'TVA Agent'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{agent.email} • ID: <strong className="text-amber-500">{agent.badgeId || 'TVA-8829'}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAgentCSV}
              className="px-4 py-2 bg-zinc-800 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Audit</span>
            </button>
          </div>
        </div>

        {/* Key Agent Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-[#141414] border border-zinc-800 rounded-xl">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">TOTAL HOURS LOGGED</span>
            <strong className="text-xl font-extrabold text-amber-400">{formatHours(totalHours)}</strong>
          </div>
          <div className="p-3 bg-[#141414] border border-zinc-800 rounded-xl">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">TASKS COMPLETED</span>
            <strong className="text-xl font-extrabold text-emerald-400">{agent.completedTasks || agentTasks.length}</strong>
          </div>
          <div className="p-3 bg-[#141414] border border-zinc-800 rounded-xl">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">STREAK COUNT</span>
            <strong className="text-xl font-extrabold text-orange-400">{agent.streak || 12} Days</strong>
          </div>
          <div className="p-3 bg-[#141414] border border-zinc-800 rounded-xl">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">SACRED SYNC RATE</span>
            <strong className="text-xl font-extrabold text-cyan-400">{agent.compliance || '98.5%'}</strong>
          </div>
        </div>

        {/* 14-Day Work Trend Chart Section */}
        <div className="bg-[#141414] border border-amber-500/30 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                14-DAY WORK HOURS TREND
              </h3>
            </div>
            <span className="text-[11px] text-zinc-500">Target Shift: 8.0 hrs/day</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <XAxis dataKey="date" stroke="#71717A" fontSize={11} />
                <YAxis stroke="#71717A" fontSize={11} unit="h" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#F59E0B', color: '#FEF3C7', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }}
                />
                <Bar dataKey="hours" fill={agent.color || '#F59E0B'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Task Logs Table */}
        <div className="bg-[#141414] border border-amber-500/30 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>AGENT LOGGED TIME ENTRIES</span>
            </h3>
            <span className="text-xs text-zinc-500 font-bold">{agentTasks.length} Entries Logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#1E1E1E] text-amber-500 font-bold uppercase tracking-wider border-b border-zinc-800">
                  <th className="p-3">Date</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Task Objective</th>
                  <th className="p-3">Time Range</th>
                  <th className="p-3 text-right">Hours</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {agentTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3 text-zinc-400 whitespace-nowrap">{t.date}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {t.project}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-zinc-200">{t.taskTitle}</td>
                    <td className="p-3 text-zinc-400 whitespace-nowrap">{t.startTime} - {t.endTime}</td>
                    <td className="p-3 text-right font-bold text-amber-400 whitespace-nowrap">{formatHours(t.hours)}</td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>TVA Master Audit Clearance • Clearance Level 4</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all cursor-pointer"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  )
}
