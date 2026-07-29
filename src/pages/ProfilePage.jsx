import React from 'react'
import { User, Shield, Key, Mail, Award, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { MadameMinuteLogo } from '../components/common/MadameMinuteLogo'

export function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6 font-mono">
      <div className="bg-[#1E1E1E] border border-amber-500/40 rounded-2xl p-8 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-6 border-b border-zinc-800 pb-6 mb-6">
          {/* User Display Picture / Google PhotoURL */}
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'Agent'} 
              className="w-20 h-20 rounded-full border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] object-cover"
            />
          ) : (
            <MadameMinuteLogo size={64} />
          )}

          <div>
            <span className="text-xs text-amber-500 font-bold uppercase tracking-widest block">TMA CLEARANCE RECORD</span>
            <h1 className="text-2xl font-black text-amber-400">{user?.displayName || 'Agent User'}</h1>
            <p className="text-xs text-zinc-400">{user?.role || 'Senior Task Analyst'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl space-y-1">
            <span className="text-zinc-500 uppercase text-[10px]">REGISTERED EMAIL</span>
            <p className="text-amber-300 font-bold">{user?.email || 'agent@tma.org'}</p>
          </div>
          <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl space-y-1">
            <span className="text-zinc-500 uppercase text-[10px]">TMA AGENT ID</span>
            <p className="text-amber-300 font-bold">{user?.uid || 'tma-agent-007'}</p>
          </div>
          <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl space-y-1">
            <span className="text-zinc-500 uppercase text-[10px]">SECURITY ACCESS LEVEL</span>
            <p className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> LEVEL 4 CLEARANCE
            </p>
          </div>
          <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl space-y-1">
            <span className="text-zinc-500 uppercase text-[10px]">VAULT MODE</span>
            <p className="text-amber-400 font-bold">{user?.isGuest ? 'LOCAL VAULT MODE' : 'FIREBASE CONNECTED'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
