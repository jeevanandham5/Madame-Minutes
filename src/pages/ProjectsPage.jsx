import React, { useState } from 'react'
import { FolderKanban, Plus, Trash2, Tag, Layers } from 'lucide-react'
import { useProjectStore } from '../store/useProjectStore'
import { useTimesheetStore } from '../store/useTimesheetStore'
import { formatHours } from '../utils/dateUtils'
import { toast } from 'sonner'

export function ProjectsPage() {
  const { projects, addProject, deleteProject } = useProjectStore()
  const { entries } = useTimesheetStore()

  const [name, setName] = useState('')
  const [color, setColor] = useState('#F59E0B')
  const [code, setCode] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    addProject({
      name: name.trim(),
      color,
      code: code.trim().toUpperCase() || name.substring(0, 4).toUpperCase(),
      budget: 100
    })

    setName('')
    setCode('')
    toast.success('Project added to TMA Registry')
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#1E1E1E] border border-amber-500/30 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-base font-bold text-amber-400">PROJECT REGISTRY</h2>
            <p className="text-xs text-zinc-400">Manage time allocation categories and project color tags.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Cards List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((p) => {
              const projectEntries = entries.filter(e => e.project === p.name)
              const totalHours = projectEntries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0)

              return (
                <div 
                  key={p.id}
                  className="bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-5 shadow-[0_0_20px_rgba(245,158,11,0.1)] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]"
                        style={{ backgroundColor: p.color, color: p.color }}
                      />
                      <div>
                        <h3 className="text-sm font-bold text-zinc-200">{p.name}</h3>
                        <span className="text-[10px] text-zinc-500 font-bold tracking-widest">{p.code}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { deleteProject(p.id); toast.success('Project deleted') }}
                      className="text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Logged Time:</span>
                    <strong className="text-amber-400 font-bold">{formatHours(totalHours)} ({projectEntries.length} tasks)</strong>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Add Project Form */}
        <div className="lg:col-span-4 bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-5 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
            REGISTER NEW PROJECT
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">PROJECT NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Master Project Security"
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">PROJECT CODE (UPPERCASE)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MPSEC"
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">COLOR TAG</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 bg-[#141414] border border-zinc-800 rounded-lg p-1 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Registry</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
