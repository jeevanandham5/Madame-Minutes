import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { MainLayout } from './layouts/MainLayout'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { TimesheetPage } from './pages/TimesheetPage'
import { TimelinePage } from './pages/TimelinePage'
import { CalendarPage } from './pages/CalendarPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ReportsPage } from './pages/ReportsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { MadameMinuteLogo } from './components/common/MadameMinuteLogo'
import { ScanlineOverlay } from './components/common/ScanlineOverlay'
import { useAuthStore } from './store/useAuthStore'
import { useSettingsStore } from './store/useSettingsStore'
import { useTimesheetStore } from './store/useTimesheetStore'
import { initGlobalTvaSoundListener } from './utils/tvaAudio'
import './styles.css'

function App() {
  const { user, isAuthLoading, initAuthListener } = useAuthStore()
  const { initTheme } = useSettingsStore()
  const { syncFirestoreEntries } = useTimesheetStore()
  
  // State for viewMode: 'loading' | 'app' | 'landing'
  const [viewMode, setViewMode] = useState('loading')
  const [activeNav, setActiveNav] = useState('Dashboard')

  useEffect(() => {
    initTheme()
    initGlobalTvaSoundListener()
    const unsubscribe = initAuthListener()
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [initAuthListener, initTheme])

  useEffect(() => {
    if (!isAuthLoading) {
      if (user && !user.isGuest) {
        setViewMode('app')
        if (user.uid) {
          syncFirestoreEntries(user.uid)
        }
      } else {
        setViewMode('landing')
      }
    }
  }, [user, isAuthLoading, syncFirestoreEntries])

  // Loading Screen while Firebase Auth restores session from local storage / cookies
  if (isAuthLoading || viewMode === 'loading') {
    return (
      <div className="h-screen w-screen bg-[#141414] text-amber-500 font-mono flex flex-col items-center justify-center relative overflow-hidden select-none">
        <ScanlineOverlay />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6">
          <MadameMinuteLogo size={64} />
          <div>
            <h2 className="text-xl font-black tracking-widest text-amber-400 uppercase animate-pulse">
              MADAME MINUTE VAULT
            </h2>
            <p className="text-xs text-zinc-500 font-bold mt-1">INITIALIZING SECURITY CLEARANCE...</p>
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === 'landing') {
    return (
      <>
        <Toaster position="top-right" theme="dark" toastOptions={{ style: { background: '#1E1E1E', border: '1px solid #F59E0B', color: '#F59E0B', fontFamily: 'monospace' } }} />
        <LandingPage onEnterApp={() => setViewMode('app')} />
      </>
    )
  }

  const renderActivePage = (onOpenAddModal) => {
    switch (activeNav) {
      case 'Dashboard':
        return <DashboardPage onOpenAddModal={onOpenAddModal} />
      case 'Timesheet':
        return <TimesheetPage onOpenAddModal={onOpenAddModal} />
      case 'Timeline':
        return <TimelinePage onOpenAddModal={onOpenAddModal} />
      case 'Calendar':
        return <CalendarPage />
      case 'Projects':
        return <ProjectsPage />
      case 'Reports':
        return <ReportsPage />
      case 'Profile':
        return <ProfilePage />
      case 'Settings':
        return <SettingsPage />
      default:
        return <DashboardPage onOpenAddModal={onOpenAddModal} />
    }
  }

  return (
    <>
      <Toaster position="top-right" theme="dark" toastOptions={{ style: { background: '#1E1E1E', border: '1px solid #F59E0B', color: '#F59E0B', fontFamily: 'monospace' } }} />
      <MainLayout 
        activeNav={activeNav}
        onNavigate={(nav) => setActiveNav(nav)}
        onNavigateLanding={() => setViewMode('landing')}
      >
        {(onOpenAddModal) => renderActivePage(onOpenAddModal)}
      </MainLayout>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
