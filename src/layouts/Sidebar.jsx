import React from 'react'
import { 
  LayoutDashboard, Clock3, CalendarDays, FolderKanban, FileText, UserRound, Settings, Zap, LogOut, Sparkles 
} from 'lucide-react'
import { MissMinutesLogo } from '../components/common/MissMinutesLogo'
import { HyperText } from '../components/common/HyperText'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'sonner'

export function Sidebar({ activeNav, onNavigate, onOpenAddModal, onNavigateLanding }) {
  const { user, logoutUser, isFirebaseActive } = useAuthStore()

  const handleExitVault = async () => {
    await logoutUser()
    toast.info('Logged out from Madame Minute Vault')
    if (typeof onNavigateLanding === 'function') {
      onNavigateLanding()
    }
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Timesheet', icon: Clock3 },
    { label: 'Timeline', icon: Zap },
    { label: 'Calendar', icon: CalendarDays },
    { label: 'Projects', icon: FolderKanban },
    { label: 'Reports', icon: FileText },
  ]

  return (
    <aside className="w-64 bg-[#1E1E1E] border-r border-amber-500/30 p-5 flex flex-col justify-between font-mono shrink-0 select-none">
      <div>
        {/* Brand Logo Header */}
        <div 
          onClick={() => onNavigate('Dashboard')}
          className="flex items-center gap-3 cursor-pointer group border-b border-zinc-800 pb-5 mb-6"
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

        {/* Command Center Label */}
        <div className="text-[10px] text-amber-500 font-extrabold tracking-widest uppercase mb-3 px-2">
          TVA COMMAND CENTER
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = activeNav === label
            return (
              <button
                key={label}
                onClick={() => onNavigate(label)}
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
            onClick={() => onNavigate('Profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
              activeNav === 'Profile' ? 'text-amber-400 bg-zinc-800' : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            <UserRound className="w-4 h-4 text-amber-500" />
            <span>Profile Clearance</span>
          </button>
          <button
            onClick={() => onNavigate('Settings')}
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
            {user?.displayName || 'Agent Mobius'}
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
    </aside>
  )
}
