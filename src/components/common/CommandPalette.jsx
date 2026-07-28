import React, { useState, useEffect } from 'react'
import { Search, Clock3, Plus, FileText, Settings, Copy, Zap, ArrowRight, X, Calendar, Tag } from 'lucide-react'
import { useTimesheetStore } from '../../store/useTimesheetStore'
import dayjs from 'dayjs'

export function CommandPalette({ isOpen, onClose, onNavigate, onOpenAddModal, onExportPDF }) {
  const [query, setQuery] = useState('')
  const { entries, copyYesterdayEntries } = useTimesheetStore()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const q = query.trim().toLowerCase()

  const filteredEntries = q
    ? entries.filter(e => {
        const formattedDate = dayjs(e.date).format('MMMM D, YYYY').toLowerCase()
        const formattedDateShort = dayjs(e.date).format('MMM D').toLowerCase()
        const dateStr = (e.date || '').toLowerCase()
        const title = (e.taskTitle || '').toLowerCase()
        const proj = (e.project || '').toLowerCase()
        const desc = (e.description || '').toLowerCase()
        const status = (e.status || '').toLowerCase()
        const tags = (e.tags || []).join(' ').toLowerCase()

        return (
          title.includes(q) || 
          proj.includes(q) || 
          desc.includes(q) || 
          dateStr.includes(q) || 
          formattedDate.includes(q) || 
          formattedDateShort.includes(q) || 
          status.includes(q) || 
          tags.includes(q)
        )
      }).slice(0, 10)
    : entries.slice(0, 4) // Show 4 recent entries by default

  const actions = [
    {
      id: 'act-add',
      title: 'Log New Entry',
      subtitle: 'Open TVA Journal modal to log time',
      icon: Plus,
      run: () => { onOpenAddModal(); onClose() }
    },
    {
      id: 'act-copy',
      title: 'Copy Yesterday Work',
      subtitle: 'Duplicate previous day entries into today',
      icon: Copy,
      run: () => { copyYesterdayEntries(); onClose() }
    },
    {
      id: 'act-nav-timesheet',
      title: 'Go to Timesheet Table',
      subtitle: 'View and inline edit all time entries',
      icon: Clock3,
      run: () => { onNavigate('Timesheet'); onClose() }
    },
    {
      id: 'act-nav-timeline',
      title: 'Go to Timeline Editor',
      subtitle: 'Visual 24h drag block timeline',
      icon: Zap,
      run: () => { onNavigate('Timeline'); onClose() }
    },
    {
      id: 'act-pdf',
      title: 'Generate PDF Report',
      subtitle: 'Export branded TVA executive report',
      icon: FileText,
      run: () => { onExportPDF(); onClose() }
    },
    {
      id: 'act-nav-settings',
      title: 'Open Settings & Preferences',
      subtitle: 'Sound controls, hours targets, and organization format',
      icon: Settings,
      run: () => { onNavigate('Settings'); onClose() }
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/85 backdrop-blur-md animate-fade-in p-4 font-mono">
      <div className="w-full max-w-2xl bg-[#1E1E1E] border border-amber-500/50 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.25)] overflow-hidden">
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800 bg-[#141414]">
          <Search className="w-5 h-5 text-amber-500 animate-pulse" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dates (e.g. 2026-07-28), tasks, projects, notes (Cmd + K)..."
            className="flex-1 bg-transparent text-amber-300 placeholder-zinc-500 focus:outline-none text-sm font-semibold"
            autoFocus
          />
          <kbd className="px-2 py-0.5 text-[10px] bg-zinc-800 text-amber-400 border border-zinc-700 rounded">ESC</kbd>
          <button onClick={onClose} className="text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Command Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Timesheet Task & Date Results */}
          {filteredEntries.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] text-amber-500 font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>{q ? 'SEARCHED TIMESHEET LOGS & DATES' : 'RECENT LOGGED TASKS'}</span>
              </div>
              <div className="space-y-1.5 mt-1.5">
                {filteredEntries.map(e => (
                  <div
                    key={e.id}
                    onClick={() => { onNavigate('Timesheet'); onClose() }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#141414] hover:bg-zinc-800 cursor-pointer border border-zinc-800 hover:border-amber-500/50 transition-all group"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-amber-300 group-hover:text-amber-400">
                        {e.taskTitle}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-2">
                        <span className="text-amber-500 font-semibold">{e.project}</span>
                        <span>•</span>
                        <span className="text-zinc-300">{e.hours} hrs</span>
                        <span>•</span>
                        <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                          {e.date}
                        </span>
                      </div>
                      {e.description && (
                        <p className="text-[10px] text-zinc-500 line-clamp-1 font-sans">{e.description}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Command Actions */}
          <div>
            <div className="px-3 py-1 text-[10px] text-amber-500 font-bold tracking-wider uppercase">
              TVA COMMAND ACTIONS
            </div>
            <div className="space-y-1.5 mt-1.5">
              {actions.map(act => {
                const Icon = act.icon
                return (
                  <div
                    key={act.id}
                    onClick={act.run}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#141414] hover:bg-zinc-800 cursor-pointer border border-zinc-800 hover:border-amber-500/40 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-400">
                          {act.title}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {act.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 group-hover:text-amber-400 font-bold">SELECT ↵</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Palette Footer */}
        <div className="px-4 py-2.5 bg-[#141414] border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="font-bold text-amber-500">MADAME MINUTE COMMAND CENTER</span>
          <span>Press <kbd className="text-amber-400 font-bold">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  )
}
