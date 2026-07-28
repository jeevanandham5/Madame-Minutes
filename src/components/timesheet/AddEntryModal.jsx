import React, { useState, useEffect } from 'react'
import { X, Check, Sparkles, Mic, Clock } from 'lucide-react'
import { useTimesheetStore } from '../../store/useTimesheetStore'
import { useProjectStore } from '../../store/useProjectStore'
import { rewriteTaskDescription } from '../../utils/aiRewriter'
import { calculateHours } from '../../utils/dateUtils'
import { playTvaSuccess, playTvaChirp } from '../../utils/tvaAudio'
import { toast } from 'sonner'
import dayjs from 'dayjs'

export function AddEntryModal({ isOpen, onClose, onOpenVoiceModal, initialTaskTitle = '' }) {
  const { addEntry } = useTimesheetStore()
  const { projects } = useProjectStore()

  const [taskTitle, setTaskTitle] = useState(initialTaskTitle)
  const [project, setProject] = useState(projects[0]?.name || 'TVA Core / Nexus')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [breakMinutes, setBreakMinutes] = useState('30')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [status, setStatus] = useState('Completed')
  const [tagInput, setTagInput] = useState('Frontend, TVA')
  const [isAiRewriting, setIsAiRewriting] = useState(false)

  useEffect(() => {
    if (initialTaskTitle) {
      setTaskTitle(initialTaskTitle)
    }
  }, [initialTaskTitle, isOpen])

  if (!isOpen) return null

  const computedHours = calculateHours(startTime, endTime, breakMinutes)

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
      toast.success('🤖 AI Enhanced task description!')
    }, 400)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskTitle.trim()) return

    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean)

    addEntry({
      date,
      project,
      taskTitle: taskTitle.trim(),
      description: description.trim(),
      status,
      startTime,
      endTime,
      hours: computedHours,
      tags
    })

    playTvaSuccess()
    toast.success('Journal entry logged successfully!')
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
            <h2 className="text-lg font-bold text-amber-400">LOG TIME ENTRY</h2>
            <p className="text-xs text-zinc-400">Record a new temporal task into Madame Minute journal.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title with Mic & AI Buttons inside Input */}
          <div>
            <label className="text-xs text-zinc-400 font-bold block mb-1">TASK OBJECTIVE *</label>
            <div className="relative">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Fixed bug in user login auth flow"
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
                  title="🤖 AI Description Rewrite"
                  className="px-2 py-1 rounded-md bg-orange-500/10 hover:bg-orange-500 hover:text-black border border-orange-500/30 text-orange-400 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isAiRewriting ? '...' : 'AI'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Project & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">PROJECT REGISTRY</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">STATUS</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Logged">Logged</option>
              </select>
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">DATE</label>
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
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-bold block mb-1">END TIME</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Computed Hours Display */}
          <div className="p-3 bg-[#141414] border border-amber-500/20 rounded-lg flex items-center justify-between text-xs">
            <span className="text-zinc-400">Calculated Net Duration:</span>
            <strong className="text-amber-400 text-sm font-bold">{computedHours} Hours</strong>
          </div>

          {/* Description Notes */}
          <div>
            <label className="text-xs text-zinc-400 font-bold block mb-1">ADDITIONAL NOTES</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add technical context or execution logs for future reference..."
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
              className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
