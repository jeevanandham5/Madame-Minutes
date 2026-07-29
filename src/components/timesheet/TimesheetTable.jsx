import React, { useState } from 'react'
import { 
  Search, Filter, Plus, Trash2, Download, Copy, Sparkles, Check, X, Edit3, ArrowUpDown, ChevronDown, Palmtree 
} from 'lucide-react'
import { useTimesheetStore } from '../../store/useTimesheetStore'
import { useProjectStore } from '../../store/useProjectStore'
import { useAuthStore } from '../../store/useAuthStore'
import { exportToCSV } from '../../utils/exportUtils'
import { rewriteTaskDescription } from '../../utils/aiRewriter'
import { formatHoursDetailed, formatHours } from '../../utils/dateUtils'
import { toast } from 'sonner'

export function TimesheetTable({ onOpenAddModal }) {
  const { 
    entries, 
    updateEntry, 
    deleteEntry, 
    bulkDelete, 
    copyYesterdayEntries,
    searchQuery,
    setSearchQuery,
    selectedProjectFilter,
    setSelectedProjectFilter,
    selectedStatusFilter,
    setSelectedStatusFilter
  } = useTimesheetStore()

  const { projects } = useProjectStore()
  const { user } = useAuthStore()

  const [selectedIds, setSelectedIds] = useState([])
  const [editingCell, setEditingCell] = useState(null) // { id, field }
  const [editValue, setEditValue] = useState('')
  const [editStartTime, setEditStartTime] = useState('09:00')
  const [editEndTime, setEditEndTime] = useState('17:00')

  // Filter entries
  const filtered = entries.filter(e => {
    const matchesSearch = !searchQuery || 
      (e.taskTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.project || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesProj = selectedProjectFilter === 'All' || e.project === selectedProjectFilter
    const matchesStatus = selectedStatusFilter === 'All' || e.status === selectedStatusFilter

    return matchesSearch && matchesProj && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map(e => e.id))
    }
  }

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleCopyYesterday = () => {
    const count = copyYesterdayEntries(user?.uid)
    if (count > 0) {
      toast.success(`Copied ${count} entry(ies) from yesterday into today!`)
    } else {
      toast.info('No entries found for yesterday to copy.')
    }
  }

  const handleBulkDelete = () => {
    if (!selectedIds.length) return
    bulkDelete(selectedIds, user?.uid)
    setSelectedIds([])
    toast.success('Selected entries deleted')
  }

  const handleExportCSV = () => {
    exportToCSV(filtered, 'madame_minute_timesheet.csv')
    toast.success('Timesheet CSV downloaded')
  }

  const handleStartCellEdit = (item, field) => {
    setEditingCell({ id: item.id, field })
    if (field === 'timeRange') {
      setEditStartTime(item.startTime || '09:00')
      setEditEndTime(item.endTime || '17:00')
    } else {
      setEditValue(item[field] || '')
    }
  }

  const handleSaveCellEdit = (id, field) => {
    if (!editingCell) return
    updateEntry(id, { [field]: editValue }, user?.uid)
    setEditingCell(null)
    toast.success('Entry updated')
  }

  const handleSaveTimeEdit = (id) => {
    if (!editingCell) return
    updateEntry(id, { startTime: editStartTime, endTime: editEndTime }, user?.uid)
    setEditingCell(null)
    toast.success('Time range updated & hours recalculated')
  }

  const handleAiRewriteCell = (id, currentTask, project) => {
    const rewritten = rewriteTaskDescription(currentTask, project)
    updateEntry(id, { taskTitle: rewritten }, user?.uid)
    toast.success('AI Enhanced task title!')
  }

  return (
    <div className="space-y-4 font-mono">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#1E1E1E] border border-amber-500/30 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, projects, notes..."
              className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-xs text-amber-300 placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Project Filter */}
          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-400 focus:outline-none"
          >
            <option value="All">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-400 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Logged">Logged</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={handleCopyYesterday}
            title="Duplicate yesterday's logged entries into today"
            className="px-3 py-2 bg-zinc-800 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Yesterday</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-zinc-800 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Entry</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#1E1E1E] border border-amber-500/30 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#141414] border-b border-zinc-800 text-amber-500 font-bold uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    className="accent-amber-500 rounded cursor-pointer"
                  />
                </th>
                <th className="p-3">Date</th>
                <th className="p-3">Project</th>
                <th className="p-3 min-w-[220px]">Task Objective</th>
                <th className="p-3 min-w-[200px]">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3">Time Range</th>
                <th className="p-3 text-right">Hours</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-zinc-500">
                    No time entries found matching filters. Click <strong className="text-amber-400">Log Entry</strong> to record work.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isSelected = selectedIds.includes(item.id)
                  const isEditingTask = editingCell?.id === item.id && editingCell?.field === 'taskTitle'
                  const isHoliday = item.isHoliday || item.status === 'Holiday' || item.project === 'Official Recess'

                  return (
                    <tr 
                      key={item.id}
                      className={`hover:bg-zinc-800/40 transition-colors ${
                        isHoliday ? 'bg-purple-950/20 border-l-2 border-l-purple-500' : isSelected ? 'bg-amber-500/10' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(item.id)}
                          className="accent-amber-500 rounded cursor-pointer"
                        />
                      </td>

                      {/* Date */}
                      <td className="p-3 whitespace-nowrap text-zinc-400 font-medium">
                        {item.date}
                      </td>

                      {/* Project Tag */}
                      <td className="p-3 whitespace-nowrap">
                        {isHoliday ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-900/40 text-purple-300 border border-purple-500/40">
                            <Palmtree className="w-3 h-3 text-purple-400" />
                            <span>{item.project}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            {item.project}
                          </span>
                        )}
                      </td>

                      {/* Task Title (Inline Edit + AI Rewrite) */}
                      <td className="p-3">
                        {isEditingTask ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="bg-[#141414] border border-amber-500 rounded px-2 py-1 text-xs text-amber-200 focus:outline-none flex-1"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveCellEdit(item.id, 'taskTitle')}
                              className="p-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingCell(null)}
                              className="p-1 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group">
                            <span 
                              onDoubleClick={() => handleStartCellEdit(item, 'taskTitle')}
                              className={`font-semibold cursor-pointer ${isHoliday ? 'text-purple-200' : 'text-zinc-200 group-hover:text-amber-300'}`}
                              title="Double click to inline edit"
                            >
                              {item.taskTitle}
                            </span>
                            {!isHoliday && (
                              <button
                                onClick={() => handleAiRewriteCell(item.id, item.taskTitle, item.project)}
                                title="AI Rewrite task description"
                                className="opacity-0 group-hover:opacity-100 p-1 text-amber-400 hover:scale-110 transition-all cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Description */}
                      <td className="p-3 text-zinc-400 max-w-xs truncate font-sans text-xs">
                        {item.description || '—'}
                      </td>

                      {/* Status Pill */}
                      <td className="p-3 whitespace-nowrap">
                        {isHoliday ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                            <Palmtree className="w-3 h-3" />
                            <span>HOLIDAY RECESS</span>
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            item.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}>
                            {item.status}
                          </span>
                        )}
                      </td>

                      {/* Time Range */}
                      <td className="p-3 whitespace-nowrap text-zinc-400 text-[11px]">
                        {editingCell?.id === item.id && editingCell?.field === 'timeRange' ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="time"
                              value={editStartTime}
                              onChange={(e) => setEditStartTime(e.target.value)}
                              className="bg-[#141414] border border-amber-500 rounded px-1 py-0.5 text-xs text-amber-200 focus:outline-none"
                              autoFocus
                            />
                            <span>-</span>
                            <input
                              type="time"
                              value={editEndTime}
                              onChange={(e) => setEditEndTime(e.target.value)}
                              className="bg-[#141414] border border-amber-500 rounded px-1 py-0.5 text-xs text-amber-200 focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveTimeEdit(item.id)}
                              className="p-0.5 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                              title="Save time range"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingCell(null)}
                              className="p-0.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span
                            onDoubleClick={() => handleStartCellEdit(item, 'timeRange')}
                            className="cursor-pointer hover:text-amber-300 transition-colors"
                            title="Double click to edit time range"
                          >
                            {item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : '—'}
                          </span>
                        )}
                      </td>

                      {/* Hours */}
                      <td className="p-3 whitespace-nowrap text-right font-bold text-amber-400">
                        {formatHoursDetailed(item.hours)}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => deleteEntry(item.id, user?.uid)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
