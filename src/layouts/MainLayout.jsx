import React, { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ChronoHeaderBar } from '../components/common/ChronoHeaderBar'
import { ScanlineOverlay } from '../components/common/ScanlineOverlay'
import { CommandPalette } from '../components/common/CommandPalette'
import { VoiceInputModal } from '../components/common/VoiceInputModal'
import { AddEntryModal } from '../components/timesheet/AddEntryModal'
import { PDFReportModal } from '../components/reports/PDFReportModal'
import { useTimesheetStore } from '../store/useTimesheetStore'
import { useAuthStore } from '../store/useAuthStore'

export function MainLayout({ activeNav, onNavigate, onNavigateLanding, children }) {
  const [showCmdPalette, setShowCmdPalette] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [presetTaskTitle, setPresetTaskTitle] = useState('')

  const { entries } = useTimesheetStore()
  const { user } = useAuthStore()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setShowCmdPalette((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen bg-[#141414] text-zinc-200 overflow-hidden relative font-mono">
      {/* CRT Scanline Shader */}
      <ScanlineOverlay />

      {/* TVA Sidebar Navigation (Desktop + Mobile Drawer) */}
      <Sidebar 
        activeNav={activeNav} 
        onNavigate={onNavigate} 
        onNavigateLanding={onNavigateLanding}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenAddModal={() => {
          setPresetTaskTitle('')
          setShowAddModal(true)
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Topbar 
          activeNav={activeNav}
          onNavigate={onNavigate}
          onOpenCommandPalette={() => setShowCmdPalette(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          onOpenAddModal={() => {
            setPresetTaskTitle('')
            setShowAddModal(true)
          }}
          onNavigateLanding={onNavigateLanding}
        />

        <ChronoHeaderBar />

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {children}
        </main>
      </div>

      {/* Modals */}
      <CommandPalette
        isOpen={showCmdPalette}
        onClose={() => setShowCmdPalette(false)}
        onNavigate={onNavigate}
        onOpenAddModal={() => {
          setPresetTaskTitle('')
          setShowAddModal(true)
        }}
        onExportPDF={() => setShowPDFModal(true)}
      />

      <AddEntryModal
        isOpen={showAddModal}
        initialTaskTitle={presetTaskTitle}
        onClose={() => {
          setShowAddModal(false)
          setPresetTaskTitle('')
        }}
        onOpenVoiceModal={() => {
          setShowAddModal(false)
          setShowVoiceModal(true)
        }}
      />

      <VoiceInputModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onApplyText={(text) => {
          setPresetTaskTitle(text)
          setShowVoiceModal(false)
          setShowAddModal(true)
        }}
      />

      <PDFReportModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        entries={entries}
        user={user}
      />
    </div>
  )
}
