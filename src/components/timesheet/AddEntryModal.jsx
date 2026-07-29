import React, { useState, useEffect } from 'react'
import { X, Check, Sparkles, Mic, Clock, Palmtree, Briefcase, Tag } from 'lucide-react'
import { useTimesheetStore } from '../../store/useTimesheetStore'
import { useProjectStore } from '../../store/useProjectStore'
import { useAuthStore } from '../../store/useAuthStore'
import { rewriteTaskDescription } from '../../utils/aiRewriter'
import { calculateHours } from '../../utils/dateUtils'
import { playTvaSuccess, playTvaChirp, playTvaClick } from '../../utils/tvaAudio'
import { toast } from 'sonner'
import dayjs from 'dayjs'

const TASK_PRESETS = [
  { label: 'Morning Standup', text: 'Morning Standup Meeting' },
  { label: 'Evening Wrap-up', text: 'Evening Wrap-up & Daily Sync' },
  { label: 'Code Review', text: 'Code Review & Pull Request Inspection' },
  { label: 'Bug Fixes', text: 'Critical Bug Fixes & Debugging' },
  { label: 'Documentation', text: 'Technical Documentation & Planning' },
  { label: 'Deployment', text: 'Production Deployment & Monitoring' }
]

export function AddEntryModal({ isOpen, onClose, onOpenVoiceModal, initialTaskTitle = '' }) {
  const { addEntry } = useTimesheetStore()
  const { projects } = useProjectStore()
  const { user } = useAuthStore()

  const [entryType, setEntryType] = useState('work') // 'work' | 'holiday'
  const [taskTitle, setTaskTitle] = useState(initialTaskTitle)
  const [project, setProject] = useState(projects[0]?.name || 'TMA Core / Nexus')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [breakMinutes, setBreakMinutes] = useState('30')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [status, setStatus] = useState('Completed')
  const [tagInput, setTagInput] = useState('Frontend, TMA')
  const [isAiRewriting, setIsAiRewriting] = useState(false)

  useEffect(() => {
    if (initialTaskTitle) {
      setTaskTitle(initialTaskTitle)
    }
  }, [initialTaskTitle, isOpen])

  if (!isOpen) return null

  const computedHours = entryType === 'holiday' ? 8.0 : calculateHours(startTime, endTime, breakMinutes)

  const handleSelectEntryType = (type) => {
    setEntryType(type)
    if (type === 'holiday') {
      if (!taskTitle || taskTitle.trim() === '') {
        setTaskTitle('Official Public Holiday - Organization Recess')
      }
      setProject('Official Recess')
      setStatus('Holiday')
      setTagInput('Holiday, Recess')
    } else {
      if (taskTitle === 'Official Public Holiday - Organization Recess') {
        setTaskTitle('')
      }
      setProject(projects[0]?.name || 'TMA Core / Nexus')
      setStatus('Completed')
      setTagInput('Frontend, TMA')
    }
  }

  const handleSelectPreset = (text) => {
    setTaskTitle(text)
    playTvaClick()
    toast.info(`Selected task preset: "${text}"`)
  }

  const handleAiEnhance = () => {
    if (!taskTitle.trim()) {
      toast.error('Please enter a short task note first before AI enhancement.')
      return
    }
    setIsAiRewriting(true)
    playTvaChirp()
    setTimeout(() => {
      const rewritten = rewriteTaskDescription(taskTitle, project)
      setTaskTitle(rewritten)
      setIsAiRewriting(false)
      playTvaSuccess()
      toast.success('AI Enhanced task description!')
    }, 400)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskTitle.trim()) return

    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean)
    const isHoliday = entryType === 'holiday'

    addEntry({
      date,
      project: isHoliday ? 'Official Recess' : project,
      taskTitle: taskTitle.trim(),
      description: description.trim() || (isHoliday ? 'Official TMA Organization Holiday & Recess Day.' : ''),
      status: isHoliday ? 'Holiday' : status,
      isHoliday,
      entryType,
      startTime: isHoliday ? '00:00' : startTime,
      endTime: isHoliday ? '23:59' : endTime,
      hours: computedHours,
      tags
    }, user?.uid)

    playTvaSuccess()
    toast.success(isHoliday ? 'Holiday / Recess logged!' : 'Journal entry logged successfully!')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in font-mono">
      <div className="w-full max-w-xl bg-[#1E1E1E] border border-amber-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(245,158,11,0.25)] text-zinc-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-400">LOG TIME / HOLIDAY ENTRY</h2>
            <p className="text-xs text-zinc-400">Record a new temporal task or official holiday into Madame Minute journal.</p>
          </div>
        </div>

        {/* Entry Category Selector: Standard Task vs Official Holiday */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => handleSelectEntryType('work')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              entryType === 'work'
                ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-[#141414] text-zinc-400 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>STANDARD WORK TASK</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectEntryType('holiday')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              entryType === 'holiday'
                ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-[#141414] text-purple-400 border-purple-500/30 hover:border-purple-500/60'
            }`}
          >
            <Palmtree className="w-4 h-4" />
            <span>OFFICIAL HOLIDAY / PTO</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title with Mic & AI Buttons inside Input */}
          <div>
            <label className="text-xs text-zinc-400 font-bold block mb-1">
              {entryType === 'holiday' ? 'HOLIDAY / RECESS NAME *' : 'TASK OBJECTIVE *'}
            </label>
            <div className="relative mb-2">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder={entryType === 'holiday' ? 'e.g. Official Public Holiday / Organization Recess' : 'e.g. Fixed bug in user login auth flow'}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg pl-3 pr-28 py-2.5 text-sm text-amber-200 placeholder-zinc-600 focus:outline-none transition-colors"
                required
                autoFocus
              />
              
              {/* Mic & AI Buttons Inside Input */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onOpenVoiceModal}
                  title="Voice Journal Dictation (Speech to Text)"
                  className="p-1.5 rounded-md bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/30 text-amber-400 transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleAiEnhance}
                  disabled={isAiRewriting}
                  title="AI Description Rewrite"
                  className="px-2 py-1 rounded-md bg-orange-500/10 hover:bg-orange-500 hover:text-black border border-orange-500/30 text-orange-400 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isAiRewriting ? '...' : 'AI'}</span>
                </button>
              </div>
            </div>

            {/* Quick Preset Tags Pills */}
            {entryType === 'work' && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1 mr-1">
                  <Tag className="w-3 h-3 text-amber-500" />
                  <span>PRESETS:</span>
                </span>
                {TASK_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectPreset(preset.text)}
                    className="px-2.5 py-1 rounded-md bg-[#141414] hover:bg-amber-500/20 border border-zinc-800 hover:border-amber-500/50 text-amber-400 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">PROJECT REGISTRY</label>
              <select
                value={project}
                disabled={entryType === 'holiday'}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none disabled:opacity-60"
              >
                {entryType === 'holiday' ? (
                  <option value="Official Recess">Official Recess (Holiday)</option>
                ) : (
                  projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">STATUS</label>
              <select
                value={status}
                disabled={entryType === 'holiday'}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none disabled:opacity-60"
              >
                {entryType === 'holiday' ? (
                  <option value="Holiday">Holiday / PTO</option>
                ) : (
                  <>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Logged">Logged</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1 font-mono">DATE</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">START TIME</label>
              <input
                type="time"
                value={startTime}
                disabled={entryType === 'holiday'}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">END TIME</label>
              <input
                type="time"
                value={endTime}
                disabled={entryType === 'holiday'}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Computed Hours Display */}
          <div className={`p-3 rounded-lg flex items-center justify-between text-xs border ${
            entryType === 'holiday' 
              ? 'bg-purple-950/30 border-purple-500/40 text-purple-300' 
              : 'bg-[#141414] border-amber-500/20 text-zinc-400'
          }`}>
            <span>{entryType === 'holiday' ? 'Holiday Duration Credit:' : 'Calculated Net Duration:'}</span>
            <strong className={`text-sm font-bold ${entryType === 'holiday' ? 'text-purple-300' : 'text-amber-400'}`}>
              {computedHours} Hours ({entryType === 'holiday' ? 'Paid Recess' : 'Work'})
            </strong>
          </div>

          {/* Description Notes */}
          <div>
            <label className="text-xs text-zinc-400 font-bold block mb-1">ADDITIONAL NOTES</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={entryType === 'holiday' ? 'Details about this official holiday or paid time off...' : 'Add technical context or execution logs for future reference...'}
              rows={2}
              className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-200 placeholder-zinc-600 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                entryType === 'holiday'
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{entryType === 'holiday' ? 'Save Holiday Entry' : 'Save Work Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
