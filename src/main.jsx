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
import { useAuthStore } from './store/useAuthStore'
import { useSettingsStore } from './store/useSettingsStore'
import { initGlobalTvaSoundListener } from './utils/tvaAudio'
import './styles.css'


function App() {
  const { user, initAuthListener } = useAuthStore()
  const { initTheme } = useSettingsStore()
  const [viewMode, setViewMode] = useState(user && !user.isGuest ? 'app' : 'landing')
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
    if (user && !user.isGuest) {
      setViewMode('app')
    }
  }, [user])



  if (viewMode === 'landing') {
    return (
      <>
        <Toaster position="top-right" theme="dark" toastOptions={{ style: { background: '#1E1E1E', border: '1px solid #F59E0B', color: '#F59E0B', fontFamily: 'monospace' } }} />
        <LandingPage onEnterApp={() => setViewMode('app')} />
      </>
    )
  }

  const renderActivePage = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <DashboardPage onOpenAddModal={() => {}} />
      case 'Timesheet':
        return <TimesheetPage onOpenAddModal={() => {}} />
      case 'Timeline':
        return <TimelinePage onOpenAddModal={() => {}} />
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
        return <DashboardPage onOpenAddModal={() => {}} />
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
        {renderActivePage()}
      </MainLayout>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
