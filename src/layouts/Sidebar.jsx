import React from 'react'
import { 
  LayoutDashboard, Clock3, CalendarDays, FolderKanban, FileText, UserRound, Settings, Zap, LogOut, X 
} from 'lucide-react'
import { MissMinutesLogo } from '../components/common/MissMinutesLogo'
import { HyperText } from '../components/common/HyperText'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'sonner'

export function Sidebar({ activeNav, onNavigate, onOpenAddModal, onNavigateLanding, isMobileOpen, onCloseMobile }) {
  const { user, logoutUser, isFirebaseActive } = useAuthStore()

  const handleExitVault = async () => {
    await logoutUser()
    toast.info('Logged out from Madame Minute Vault')
    if (typeof onCloseMobile === 'function') onCloseMobile()
    if (typeof onNavigateLanding === 'function') {
      onNavigateLanding()
    }
  }

  const handleNavClick = (label) => {
    onNavigate(label)
    if (typeof onCloseMobile === 'function') onCloseMobile()
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Timesheet', icon: Clock3 },
    { label: 'Timeline', icon: Zap },
    { label: 'Calendar', icon: CalendarDays },
    { label: 'Projects', icon: FolderKanban },
    { label: 'Reports', icon: FileText },
  ]

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full font-mono select-none p-5">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5 mb-6">
          <div 
            onClick={() => handleNavClick('Dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <MissMinutesLogo size={42} />
            <div>
              <div className="text-base font-black text-amber-500 tracking-wider group-hover:text-amber-400">
                <HyperText text="MADAME MINUTE" animateOnHover={true} />
              </div>
              <div className="text-[10px] text-zinc-500 font-bold tracking-widest">
                EVERY MINUTE MATTERS.
              </div>
            </div>
          </div>

          {/* Close Button for Mobile Drawer */}
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-zinc-400 hover:text-amber-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Command Center Label */}
        <div className="text-[10px] text-amber-500 font-extrabold tracking-widest uppercase mb-3 px-2">
          TMA COMMAND CENTER
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = activeNav === label
            return (
              <button
                key={label}
                onClick={() => handleNavClick(label)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-500 group-hover:scale-110'} transition-transform`} />
                  <span>{label}</span>
                </div>
                {label === 'Timeline' && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-orange-500 text-black font-extrabold uppercase animate-pulse">
                    NEW
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Account & System Footer */}
      <div className="space-y-4 border-t border-zinc-800 pt-5">
        <div className="space-y-1">
          <button
            onClick={() => handleNavClick('Profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
              activeNav === 'Profile' ? 'text-amber-400 bg-zinc-800' : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            <UserRound className="w-4 h-4 text-amber-500" />
            <span>Profile Clearance</span>
          </button>
          <button
            onClick={() => handleNavClick('Settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
              activeNav === 'Settings' ? 'text-amber-400 bg-zinc-800' : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-500" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Offline Vault Mode / Firebase Status Card */}
        <div className="p-3 bg-[#141414] border border-amber-500/20 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isFirebaseActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              {isFirebaseActive ? 'FIREBASE LIVE' : 'VAULT OFFLINE MODE'}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 truncate">
            {user?.displayName || 'Agent User'}
          </p>
        </div>


        {/* Exit Vault Logout Button */}
        <button
          onClick={handleExitVault}
          className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.15)]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Vault</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (hidden on small screens) */}
      <aside className="hidden md:flex w-64 bg-[#1E1E1E] border-r border-amber-500/30 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" 
          />
          <div className="relative w-72 max-w-[80vw] bg-[#1E1E1E] border-r border-amber-500/50 h-full z-10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
