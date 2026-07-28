import React, { useState } from 'react'
import { Download, ShieldCheck, X, FileText, CheckCircle2, Calendar, Filter } from 'lucide-react'
import { MissMinutesLogo } from '../common/MissMinutesLogo'
import { generatePDFReport } from '../../utils/pdfGenerator'
import { toast } from 'sonner'
import dayjs from 'dayjs'

export function PDFReportModal({ isOpen, onClose, entries, user }) {
  if (!isOpen) return null

  const [reportType, setReportType] = useState('single') // 'single' | 'range'
  const [singleDate, setSingleDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  // Filter entries based on single date vs date range
  const filteredEntries = entries.filter(e => {
    const entryDateStr = dayjs(e.date).format('YYYY-MM-DD')
    if (reportType === 'single') {
      return entryDateStr === singleDate
    } else {
      return entryDateStr >= startDate && entryDateStr <= endDate
    }
  })

  const totalHours = filteredEntries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0)

  // Compute Multi-Day Groupings
  const dailySummaryMap = {}
  const projectSummaryMap = {}

  filteredEntries.forEach(e => {
    const dStr = dayjs(e.date).format('YYYY-MM-DD')
    const pStr = e.project || 'Other'
    const h = parseFloat(e.hours) || 0

    if (!dailySummaryMap[dStr]) {
      dailySummaryMap[dStr] = { date: dStr, totalHours: 0, count: 0, tasks: [] }
    }
    dailySummaryMap[dStr].totalHours += h
    dailySummaryMap[dStr].count += 1
    dailySummaryMap[dStr].tasks.push(e.taskTitle)

    projectSummaryMap[pStr] = (projectSummaryMap[pStr] || 0) + h
  })

  const dailySummaryList = Object.values(dailySummaryMap).sort((a, b) => b.date.localeCompare(a.date))
  const projectSummaryList = Object.keys(projectSummaryMap).map(name => ({
    name,
    hours: projectSummaryMap[name].toFixed(1)
  }))

  const handleDownloadPDF = async () => {
    toast.info('Generating branded TVA PDF Report...')
    const filename = reportType === 'single'
      ? `Madame_Minute_SingleDay_Report_${singleDate}.pdf`
      : `Madame_Minute_Range_Report_${startDate}_to_${endDate}.pdf`

    const success = await generatePDFReport({
      elementId: 'tva-pdf-content',
      filename
    })
    if (success) {
      toast.success('PDF Report downloaded successfully!')
      onClose()
    } else {
      toast.error('Failed to generate PDF')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto font-mono">
      <div className="w-full max-w-4xl bg-[#1E1E1E] border border-amber-500/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(245,158,11,0.25)] text-zinc-200 relative my-8">
        {/* Controls Header & Type Selector */}
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-4 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-amber-400 uppercase">TVA REPORT GENERATOR</h3>
              <p className="text-xs text-zinc-400">Configure single-day deep-dive or multi-day range summary.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button onClick={onClose} className="text-zinc-500 hover:text-amber-500 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Date Selection Options Form */}
        <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4">
            <label className="text-xs text-zinc-400 block font-bold mb-1">REPORT SCOPE</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs text-amber-300 focus:outline-none"
            >
              <option value="single">Single Day Deep-Dive Report</option>
              <option value="range">Date Range (Multi-Day) Summary</option>
            </select>
          </div>

          {reportType === 'single' ? (
            <div className="md:col-span-8">
              <label className="text-xs text-zinc-400 block font-bold mb-1">SELECT SPECIFIC DATE</label>
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="w-full bg-[#1E1E1E] border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs text-amber-300 focus:outline-none"
              />
            </div>
          ) : (
            <div className="md:col-span-8 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block font-bold mb-1">START DATE</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#1E1E1E] border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs text-amber-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block font-bold mb-1">END DATE</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#1E1E1E] border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs text-amber-300 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* PDF Printable Area with Explicit Standard Colors */}
        <div 
          id="tva-pdf-content" 
          style={{ backgroundColor: '#141414', color: '#E4E4E7', borderColor: '#F59E0B' }}
          className="border rounded-xl p-8 space-y-6 relative overflow-hidden"
        >
          {/* TVA Official Watermark Stamp */}
          <div className="absolute top-12 right-12 opacity-15 pointer-events-none transform rotate-12 flex flex-col items-center">
            <ShieldCheck className="w-32 h-32 text-amber-500" style={{ color: '#F59E0B' }} />
            <span className="text-xs font-bold tracking-widest mt-1" style={{ color: '#F59E0B' }}>APPROVED BY TVA</span>
          </div>

          {/* Report Header */}
          <div className="flex items-start justify-between border-b pb-6" style={{ borderColor: '#F59E0B' }}>
            <div className="flex items-center gap-4">
              <MissMinutesLogo size={56} />
              <div>
                <h1 className="text-2xl font-black tracking-wider" style={{ color: '#F59E0B' }}>MADAME MINUTE</h1>
                <p className="text-xs font-bold" style={{ color: '#FFB84D' }}>
                  {reportType === 'single' ? `SINGLE DAY REPORT (${dayjs(singleDate).format('MMM DD, YYYY')})` : `MULTI-DAY SUMMARY (${dayjs(startDate).format('MMM DD')} - ${dayjs(endDate).format('MMM DD, YYYY')})`}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: '#A1A1AA' }}>Generated: {dayjs().format('MMMM DD, YYYY HH:mm')}</p>
              </div>
            </div>
            <div className="text-right text-xs space-y-0.5" style={{ color: '#A1A1AA' }}>
              <div><strong style={{ color: '#F59E0B' }}>Agent:</strong> {user?.displayName || 'Agent Mobius'}</div>
              <div><strong style={{ color: '#F59E0B' }}>Role:</strong> {user?.role || 'Senior Temporal Analyst'}</div>
              <div><strong style={{ color: '#F59E0B' }}>Email:</strong> {user?.email || 'agent.mobius@tva.gov'}</div>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg text-center border" style={{ backgroundColor: '#1E1E1E', borderColor: '#2E2E2E' }}>
              <span className="text-[10px] uppercase block" style={{ color: '#A1A1AA' }}>TOTAL HOURS LOGGED</span>
              <strong className="text-2xl font-extrabold" style={{ color: '#F59E0B' }}>{totalHours.toFixed(1)} hrs</strong>
            </div>
            <div className="p-4 rounded-lg text-center border" style={{ backgroundColor: '#1E1E1E', borderColor: '#2E2E2E' }}>
              <span className="text-[10px] uppercase block" style={{ color: '#A1A1AA' }}>
                {reportType === 'single' ? 'DAY OBJECTIVES' : 'TOTAL PERIOD TASKS'}
              </span>
              <strong className="text-2xl font-extrabold" style={{ color: '#22C55E' }}>{filteredEntries.length} Tasks</strong>
            </div>
            <div className="p-4 rounded-lg text-center border" style={{ backgroundColor: '#1E1E1E', borderColor: '#2E2E2E' }}>
              <span className="text-[10px] uppercase block" style={{ color: '#A1A1AA' }}>TVA CLEARANCE</span>
              <strong className="text-sm font-bold flex items-center justify-center gap-1 mt-1" style={{ color: '#F59E0B' }}>
                <CheckCircle2 className="w-4 h-4" /> VERIFIED SACRED
              </strong>
            </div>
          </div>

          {/* SINGLE DAY DETAILED BREAKDOWN REPORT */}
          {reportType === 'single' ? (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#F59E0B' }}>
                DETAILED SINGLE DAY OBJECTIVE LOG ({singleDate})
              </h4>
              {filteredEntries.length === 0 ? (
                <p className="text-xs text-center py-6" style={{ color: '#71717A' }}>No time entries recorded for this date.</p>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b font-bold" style={{ backgroundColor: '#1E1E1E', borderColor: '#2E2E2E', color: '#F59E0B' }}>
                      <th className="p-2.5">Time Range</th>
                      <th className="p-2.5">Project</th>
                      <th className="p-2.5">Task Objective & Notes</th>
                      <th className="p-2.5 text-right">Net Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#2E2E2E', color: '#E4E4E7' }}>
                    {filteredEntries.map(e => (
                      <tr key={e.id}>
                        <td className="p-2.5 whitespace-nowrap" style={{ color: '#A1A1AA' }}>
                          {e.startTime && e.endTime ? `${e.startTime} - ${e.endTime}` : '—'}
                        </td>
                        <td className="p-2.5 font-semibold" style={{ color: '#F59E0B' }}>{e.project}</td>
                        <td className="p-2.5">
                          <strong className="block" style={{ color: '#FEF3C7' }}>{e.taskTitle}</strong>
                          {e.description && <span className="text-[11px] block mt-0.5" style={{ color: '#A1A1AA' }}>{e.description}</span>}
                        </td>
                        <td className="p-2.5 text-right font-bold" style={{ color: '#FFB84D' }}>{e.hours}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            /* MULTI-DAY RANGE EXECUTIVE SUMMARY REPORT */
            <div className="space-y-6">
              {/* Project Hours Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#F59E0B' }}>
                  PROJECT HOURS DISTRIBUTION ({startDate} TO {endDate})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {projectSummaryList.map(p => (
                    <div key={p.name} className="p-3 rounded-lg border" style={{ backgroundColor: '#1E1E1E', borderColor: '#2E2E2E' }}>
                      <span className="text-[10px] block truncate" style={{ color: '#A1A1AA' }}>{p.name}</span>
                      <strong className="text-sm font-bold" style={{ color: '#F59E0B' }}>{p.hours} hrs</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#F59E0B' }}>
                  DAILY ACTIVITY SUMMARY
                </h4>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b font-bold" style={{ backgroundColor: '#1E1E1E', borderColor: '#2E2E2E', color: '#F59E0B' }}>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Total Logged Tasks</th>
                      <th className="p-2.5">Primary Deliverables</th>
                      <th className="p-2.5 text-right">Daily Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#2E2E2E', color: '#E4E4E7' }}>
                    {dailySummaryList.map(d => (
                      <tr key={d.date}>
                        <td className="p-2.5 font-bold" style={{ color: '#FFB84D' }}>{d.date}</td>
                        <td className="p-2.5" style={{ color: '#A1A1AA' }}>{d.count} tasks logged</td>
                        <td className="p-2.5 truncate max-w-xs">{d.tasks.join(', ')}</td>
                        <td className="p-2.5 text-right font-bold" style={{ color: '#F59E0B' }}>{d.totalHours.toFixed(1)}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Report Footer */}
          <div className="border-t pt-4 flex items-center justify-between text-[10px]" style={{ borderColor: '#2E2E2E', color: '#71717A' }}>
            <span>GENERATED AUTOMATICALLY BY MADAME MINUTE ENGINE</span>
            <span>CONFIDENTIAL • TVA INTERNAL ENTERPRISE</span>
          </div>
        </div>
      </div>
    </div>
  )
}
