import React, { useState } from 'react'
import { FileText, Download, Printer, Filter, Calendar } from 'lucide-react'
import { useTimesheetStore } from '../store/useTimesheetStore'
import { useAuthStore } from '../store/useAuthStore'
import { PDFReportModal } from '../components/reports/PDFReportModal'
import { formatHours } from '../utils/dateUtils'

export function ReportsPage() {
  const { entries } = useTimesheetStore()
  const { user } = useAuthStore()
  const [showPDFModal, setShowPDFModal] = useState(false)

  return (
    <div className="space-y-6 font-mono">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-[#1E1E1E] border border-amber-500/30 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-base font-bold text-amber-400">EXECUTIVE REPORTS CENTER</h2>
            <p className="text-xs text-zinc-400">Generate, preview, and download branded TMA manager timesheet reports.</p>
          </div>
        </div>

        <button
          onClick={() => setShowPDFModal(true)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Generate PDF Report</span>
        </button>
      </div>

      {/* Reports Dashboard Summary */}
      <div className="bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-6 shadow-[0_0_25px_rgba(245,158,11,0.1)] space-y-4">
        <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider border-b border-zinc-800 pb-3">
          LOGGED WORK SUMMARY
        </h3>

        <div className="space-y-3">
          {entries.map(e => (
            <div key={e.id} className="p-3 bg-[#141414] border border-zinc-800 rounded-lg flex items-center justify-between text-xs">
              <div>
                <strong className="text-amber-300 block">{e.taskTitle}</strong>
                <span className="text-[11px] text-zinc-500">{e.project} • {e.date} • {e.startTime} - {e.endTime}</span>
              </div>
              <strong className="text-amber-400 text-sm font-bold">{formatHours(e.hours)} ({e.hours}h)</strong>
            </div>
          ))}
        </div>
      </div>

      <PDFReportModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        entries={entries}
        user={user}
      />
    </div>
  )
}
