import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, Clock, Sparkles, FolderKanban } from 'lucide-react'
import { useTimesheetStore } from '../../store/useTimesheetStore'
import { useProjectStore } from '../../store/useProjectStore'

export function LiveTimerCard({ onOpenAddModal }) {
  const { activeTimer, startTimer, pauseTimer, tickTimer, stopAndSaveTimer } = useTimesheetStore()
  const { projects } = useProjectStore()

  const [taskInput, setTaskInput] = useState(activeTimer.taskTitle || '')
  const [selectedProj, setSelectedProj] = useState(activeTimer.project || projects[0]?.name || 'TVA Core / Nexus')

  useEffect(() => {
    let interval = null
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        tickTimer()
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeTimer.isRunning, tickTimer])

  const formatSeconds = (sec) => {
    const hrs = String(Math.floor(sec / 3600)).padStart(2, '0')
    const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
    const secs = String(sec % 60).padStart(2, '0')
    return { hrs, mins, secs }
  }, { hrs, mins, secs } = formatSeconds(activeTimer.elapsedSeconds)

  const handleToggleTimer = () => {
    if (activeTimer.isRunning) {
      pauseTimer()
    } else {
      startTimer(taskInput, selectedProj)
    }
  }

  const handleStopAndSave = () => {
    const saved = stopAndSaveTimer()
    setTaskInput('')
  }

  return (
    <div className="relative bg-[#1E1E1E] border border-amber-500/40 rounded-xl p-6 shadow-[0_0_25px_rgba(245,158,11,0.15)] font-mono overflow-hidden">
      {/* Background Retro Grid Ambient */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Status */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${activeTimer.isRunning ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
          <span className="text-xs font-bold tracking-wider text-amber-500 uppercase">
            {activeTimer.isRunning ? 'TEMPORAL LOGGING IN PROGRESS' : 'CHRONO TIMER READY'}
          </span>
        </div>
        <button 
          onClick={onOpenAddModal}
          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Manual Entry</span>
        </button>
      </div>

      {/* Timer Controls Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-3">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">CURRENT OBJECTIVE</label>
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="What TVA mission are you working on?"
              className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-sm text-amber-200 placeholder-zinc-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">PROJECT REGISTRY</label>
            <select
              value={selectedProj}
              onChange={(e) => setSelectedProj(e.target.value)}
              className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none transition-colors"
            >
              {projects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Big Retro Digital Readout */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#141414] border border-amber-500/30 rounded-xl text-center">
          <div className="text-4xl font-extrabold text-amber-500 tracking-widest font-mono shadow-amber-500/20 drop-shadow-md">
            <span>{hrs}</span>
            <span className="animate-pulse">:</span>
            <span>{mins}</span>
            <span className="animate-pulse">:</span>
            <span className="text-amber-400">{secs}</span>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">SESSION DURATION</span>

          {/* Action Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleToggleTimer}
              className={`px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeTimer.isRunning 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500 hover:bg-amber-500 hover:text-black' 
                  : 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              }`}
            >
              {activeTimer.isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{activeTimer.elapsedSeconds > 0 ? 'RESUME' : 'START LOG'}</span>
                </>
              )}
            </button>

            {activeTimer.elapsedSeconds > 0 && (
              <button
                onClick={handleStopAndSave}
                className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>SAVE</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
