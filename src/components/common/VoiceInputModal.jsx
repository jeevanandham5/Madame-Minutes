import React, { useState, useEffect } from 'react'
import { Mic, MicOff, Check, X, Sparkles, AlertCircle } from 'lucide-react'

export function VoiceInputModal({ isOpen, onClose, onApplyText }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [recognition, setRecognition] = useState(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Browser does not support Speech Recognition API.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (event) => {
      let current = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        current += event.results[i][0].transcript
      }
      setTranscript(current)
    }

    rec.onerror = (event) => {
      console.error('Speech error', event.error)
      setError('Voice recognition error: ' + event.error)
      setIsListening(false)
    }

    rec.onend = () => {
      setIsListening(false)
    }

    setRecognition(rec)
  }, [])

  if (!isOpen) return null

  const toggleListening = () => {
    if (!recognition) return
    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      setTranscript('')
      setError(null)
      recognition.start()
      setIsListening(true)
    }
  }

  const handleApply = () => {
    if (transcript.trim()) {
      onApplyText(transcript.trim())
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#1E1E1E] border border-amber-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(245,158,11,0.25)] font-mono text-zinc-200 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-500 hover:text-amber-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-400">TVA Voice Journaling</h3>
            <p className="text-xs text-zinc-400">Speak your work log to transcribe into timesheet format.</p>
          </div>
        </div>

        {/* Retro Mic Soundwave Visualizer */}
        <div className="flex flex-col items-center justify-center p-8 bg-[#141414] border border-zinc-800 rounded-xl my-4 text-center">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-amber-500 text-black shadow-[0_0_30px_#F59E0B] scale-110 animate-pulse' 
                : 'bg-zinc-800 text-amber-400 border border-amber-500/30 hover:border-amber-500 hover:scale-105'
            }`}
          >
            {isListening ? <Mic className="w-9 h-9" /> : <MicOff className="w-9 h-9" />}
          </button>

          {/* Animated Audio Equalizer Bars */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 mt-6 h-8">
              {[40, 70, 100, 60, 90, 50, 80, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-amber-500 rounded-full animate-bounce"
                  style={{ 
                    height: `${h}%`, 
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
          )}

          <div className="mt-4 text-xs font-semibold text-amber-500">
            {isListening ? 'LISTENING... SPEAK CLEARLY' : 'CLICK MIC TO START DICTATION'}
          </div>
        </div>

        {/* Live Transcript Display */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl min-h-24 max-h-40 overflow-y-auto mb-6">
          <span className="text-xs text-zinc-500 block mb-1">TRANSCRIBED TEXT:</span>
          {transcript ? (
            <p className="text-sm text-amber-200 leading-relaxed font-sans">{transcript}</p>
          ) : (
            <p className="text-xs text-zinc-600 italic font-sans">e.g. "Completed refactoring of authentication API endpoints and tested Firebase login flow for 3 hours."</p>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!transcript.trim()}
            className="px-5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg disabled:opacity-40 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            <Check className="w-4 h-4" />
            Use Transcribed Text
          </button>
        </div>
      </div>
    </div>
  )
}
