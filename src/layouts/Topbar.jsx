import React from 'react'
import { Search, Plus, Home, Menu } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export function Topbar({ 
  activeNav, 
  onOpenCommandPalette, 
  onOpenAddModal, 
  onNavigateLanding, 
  onNavigate,
  onToggleMobileMenu 
}) {
  const { user } = useAuthStore()

  return (
    <header className="h-16 bg-[#1E1E1E] border-b border-amber-500/30 px-4 sm:px-6 flex items-center justify-between font-mono shrink-0 select-none z-20">
      {/* Left Mobile Menu Toggle & Page Name */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 md:hidden text-amber-500 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          title="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onNavigateLanding}
          className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
          title="Return to Marketing Landing Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Landing</span>
        </button>
        <span className="text-zinc-700 hidden sm:inline">/</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-500 uppercase truncate max-w-[120px] sm:max-w-none">{activeNav}</span>
        </div>
      </div>

      {/* Right Actions & Command Search */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Cmd + K Trigger Button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 bg-[#141414] border border-zinc-800 hover:border-amber-500/50 rounded-xl text-xs text-zinc-400 hover:text-amber-300 transition-all cursor-pointer group"
        >
          <Search className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Search or command...</span>
          <span className="md:hidden text-[10px]">Search</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-zinc-800 text-amber-400 border border-zinc-700 rounded font-sans">
            ⌘K
          </kbd>
        </button>

        {/* Quick Log Entry Button */}
        <button
          onClick={onOpenAddModal}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log Entry</span>
        </button>

        {/* User Clearance Avatar Pill */}
        <div className="pl-1 sm:pl-2 border-l border-zinc-800">
          <button
            onClick={() => onNavigate && onNavigate('Profile')}
            title="View TVA Agent Profile"
            className="flex items-center gap-2 hover:opacity-80 transition-all cursor-pointer group"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Agent'}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-500/60 object-cover group-hover:border-amber-400 group-hover:scale-105 transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold text-[10px] sm:text-xs group-hover:border-amber-400 group-hover:scale-105 transition-all">
                {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'AM'}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
