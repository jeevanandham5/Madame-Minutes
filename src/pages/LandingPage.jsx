import React, { useState } from 'react'
import { 
  Sparkles, Clock, Zap, Shield, FileText, Mic, ArrowRight, Play, Flame, Lock, Terminal 
} from 'lucide-react'
import { motion } from 'framer-motion'
import { MadameMinuteLogo } from '../components/common/MadameMinuteLogo'
import { ScanlineOverlay } from '../components/common/ScanlineOverlay'
import { HyperText } from '../components/common/HyperText'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'sonner'

export function LandingPage({ onEnterApp }) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [aiDemoNote, setAiDemoNote] = useState('fixed bug in login auth')
  const [aiDemoResult, setAiDemoResult] = useState('Fixed bug in login auth')
  const [isRewritingDemo, setIsRewritingDemo] = useState(false)

  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuthStore()

  const handleRunAiDemo = () => {
    setIsRewritingDemo(true)
    setTimeout(() => {
      setAiDemoResult('Resolved critical authentication anomaly in TMA User Onboarding flow: conducted root-cause analysis, applied structural fix, and validated end-to-end security clearance.')
      setIsRewritingDemo(false)
      toast.success('AI Enhanced Task Note!')
    }, 500)
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return

    const res = isLogin 
      ? await loginWithEmail(email, password)
      : await registerWithEmail(email, password)

    if (res.success) {
      toast.success(isLogin ? 'Welcome back to Madame Minute Vault!' : 'TMA Credentials Issued!')
      setShowAuthModal(false)
      onEnterApp()
    } else {
      toast.error(res.error || 'Authentication error')
    }
  }

  const handleGoogleAuth = async () => {
    const res = await loginWithGoogle()
    if (res.success) {
      toast.success('Signed in with Google!')
      setShowAuthModal(false)
      onEnterApp()
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] text-zinc-200 font-mono relative overflow-hidden select-none">
      {/* Retro CRT Scanlines & Screen Vignette */}
      <ScanlineOverlay />

      {/* Ambient Retro Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none animate-crt-glow" />

      {/* Top Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <MadameMinuteLogo size={48} />
          <div>
            <span className="text-xl font-black text-amber-500 tracking-wider block leading-none">
              <HyperText text="MADAME MINUTE" />
            </span>
            <span className="text-[10px] text-zinc-500 tracking-widest font-bold">EVERY MINUTE MATTERS • TASK MANAGEMENT ASSOCIATION</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { setShowAuthModal(true); setIsLogin(true) }}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-bold px-3 py-2 cursor-pointer"
          >
            Agent Sign In
          </button>
          <button
            onClick={() => { setShowAuthModal(true); setIsLogin(true) }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Enter TMA Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-16 text-center relative z-10 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>TASK MANAGEMENT ASSOCIATION ENTERPRISE PLATFORM</span>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-black text-amber-500 tracking-tight leading-tight uppercase drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">
          <HyperText text="Master Your Work Timeline." /><br />
          <span className="text-zinc-100"><HyperText text="Replace Excel Forever." delay={400} /></span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
          Madame Minute combines interactive 24h timeline dragging, AI task rewriting, voice dictation, and manager PDF reports into a state-of-the-art work journal.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => { setShowAuthModal(true); setIsLogin(true) }}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all flex items-center gap-3 transform hover:scale-105 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>LAUNCH MADAME MINUTE APP</span>
          </button>
          <button
            onClick={() => { setShowAuthModal(true); setIsLogin(false) }}
            className="px-6 py-4 bg-zinc-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Issue Agent Credentials</span>
          </button>
        </div>
      </section>

      {/* Interactive AI Scrambler Live Demo Showcase Card */}
      <section className="max-w-5xl mx-auto px-6 pb-16 relative z-10">
        <div className="bg-[#1E1E1E] border border-amber-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-500 uppercase">TRY LIVE AI DESCRIPTION REWRITE ENGINE</span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase">INTERACTIVE PREVIEW</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs text-zinc-400 block font-bold">RAW TASK NOTE</label>
              <input
                type="text"
                value={aiDemoNote}
                onChange={(e) => setAiDemoNote(e.target.value)}
                className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none"
              />
              <button
                onClick={handleRunAiDemo}
                disabled={isRewritingDemo}
                className="w-full py-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500 hover:text-black font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRewritingDemo ? 'Enhancing note...' : 'Transform Note to Executive Log'}</span>
              </button>
            </div>

            <div className="md:col-span-7 p-4 bg-[#141414] border border-amber-500/30 rounded-xl">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1">ENHANCED EXECUTIVE DESCRIPTION:</span>
              <p className="text-xs text-amber-300 font-sans leading-relaxed">{aiDemoResult}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-zinc-800 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-amber-400 uppercase tracking-wider">
            <HyperText text="ENTERPRISE CHRONO FEATURES" delay={600} />
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Engineered for speed, precision, and executive presentation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ElaborateFeatureCard
            icon={Clock}
            title="Visual Timeline Editor"
            description="Drag and drop visual blocks across a 24-hour daily timeline grid instead of typing start and end times manually."
            badge="INTERACTIVE 24H GRID"
          />
          <ElaborateFeatureCard
            icon={Sparkles}
            title="AI Task Rewriter"
            description="Transform brief bullet notes like 'fixed bug' into executive descriptions ready for manager timesheet review."
            badge="LLM ENHANCER"
          />
          <ElaborateFeatureCard
            icon={Mic}
            title="Voice Journal Dictation"
            description="Hands-free work journaling using native Web Speech API with audio indicators."
            badge="SPEECH RECOGNITION"
          />
          <ElaborateFeatureCard
            icon={FileText}
            title="Executive PDF Reports"
            description="Generate branded PDF reports with single-day or multi-day date ranges and official approval stamps."
            badge="EXECUTIVE PDF"
          />
          <ElaborateFeatureCard
            icon={Flame}
            title="Activity Heatmap & Streaks"
            description="Track your daily work consistency with GitHub-style green/amber heatmap grids and streak counters."
            badge="STREAK METRICS"
          />
          <ElaborateFeatureCard
            icon={Shield}
            title="Offline-First Vault Sync"
            description="Works 100% offline with Zustand local storage and syncs seamlessly with Firebase Firestore when connected."
            badge="HYBRID OFFLINE"
          />
        </div>
      </section>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#1E1E1E] border border-amber-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(245,158,11,0.3)] relative font-mono">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-amber-500 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <MadameMinuteLogo size={42} />
              <div>
                <h3 className="text-base font-bold text-amber-400 uppercase">TMA ACCESS PORTAL</h3>
                <p className="text-xs text-zinc-400">{isLogin ? 'Sign in to access your journal' : 'Register new agent account'}</p>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">AGENT EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@tma.org"
                  className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">CLEARANCE PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141414] border border-zinc-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-amber-300 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                {isLogin ? 'Authenticate Clearance' : 'Create Agent Account'}
              </button>
            </form>

            <div className="relative my-4 text-center">
              <span className="text-[10px] text-zinc-500 bg-[#1E1E1E] px-2 relative z-10 uppercase">OR GOOGLE AUTH</span>
              <div className="absolute inset-0 top-1/2 border-t border-zinc-800" />
            </div>

            <button
              onClick={handleGoogleAuth}
              className="w-full py-2 bg-zinc-800 border border-zinc-700 hover:border-amber-500 text-amber-300 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In with Google</span>
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-amber-500 hover:underline cursor-pointer"
              >
                {isLogin ? "Don't have credentials? Register agent" : "Already registered? Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ElaborateFeatureCard({ icon: Icon, title, description, badge }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03, translateY: -4 }}
      className="bg-[#1E1E1E] border border-amber-500/30 rounded-xl p-6 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:border-amber-500 transition-all group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors">
            <Icon className="w-6 h-6" />
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
            {badge}
          </span>
        </div>
        <h3 className="text-base font-bold text-amber-400 mb-2">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">{description}</p>
      </div>
    </motion.div>
  )
}
