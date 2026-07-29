import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Check, X, Sparkles, AlertCircle } from 'lucide-react'

export function VoiceInputModal({ isOpen, onClose, onApplyText }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [recognition, setRecognition] = useState(null)
  const isListeningRef = useRef(false)

  useEffect(() => {
    isListeningRef.current = isListening
  }, [isListening])

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Browser does not support native Speech Recognition API.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (event) => {
      let accumulated = ''
      // Accumulate full paragraph from 0 to event.results.length - 1
      for (let i = 0; i < event.results.length; i++) {
        accumulated += event.results[i][0].transcript
      }
      setTranscript(accumulated)
    }

    rec.onerror = (event) => {
      if (event.error === 'no-speech') return // Silently ignore brief silence
      console.error('Speech error', event.error)
      setError('Voice recognition error: ' + event.error)
      setIsListening(false)
      isListeningRef.current = false
    }

    rec.onend = () => {
      // Auto-restart if user hasn't explicitly stopped listening
      if (isListeningRef.current) {
        try {
          rec.start()
        } catch (err) {
          setIsListening(false)
          isListeningRef.current = false
        }
      } else {
        setIsListening(false)
      }
    }

    setRecognition(rec)
  }, [])

  if (!isOpen) return null

  const toggleListening = () => {
    if (!recognition) return
    if (isListening) {
      isListeningRef.current = false
      recognition.stop()
      setIsListening(false)
    } else {
      setTranscript('')
      setError(null)
      isListeningRef.current = true
      try {
        recognition.start()
        setIsListening(true)
      } catch (err) {
        console.error('Recognition start error', err)
      }
    }
  }

  const handleApply = () => {
    if (isListening && recognition) {
      isListeningRef.current = false
      recognition.stop()
      setIsListening(false)
    }
    if (transcript.trim()) {
      onApplyText(transcript.trim())
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
      <div className="w-full max-w-lg bg-[#1E1E1E] border border-amber-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(245,158,11,0.25)] text-zinc-200 relative">
        <button 
          onClick={() => {
            if (isListening && recognition) {
              isListeningRef.current = false
              recognition.stop()
            }
            onClose()
          }} 
          className="absolute top-4 right-4 text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-400">TVA Voice Journaling</h3>
            <p className="text-xs text-zinc-400">Speak continuous paragraphs to transcribe into timesheet format.</p>
          </div>
        </div>

        {/* Retro Mic Soundwave Visualizer */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#141414] border border-zinc-800 rounded-xl my-4 text-center">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
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
            {isListening ? 'LISTENING... SPEAK CONTINUOUS PARAGRAPHS' : 'CLICK MIC TO START DICTATION'}
          </div>
        </div>

        {/* Live Continuous Transcript Display */}
        <div className="p-4 bg-[#141414] border border-zinc-800 rounded-xl min-h-28 max-h-48 overflow-y-auto mb-6">
          <span className="text-[10px] text-zinc-500 uppercase block mb-1 font-bold">TRANSCRIBED PARAGRAPH:</span>
          {transcript ? (
            <p className="text-sm text-amber-200 leading-relaxed font-sans font-medium whitespace-pre-wrap">{transcript}</p>
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
            onClick={() => {
              if (isListening && recognition) {
                isListeningRef.current = false
                recognition.stop()
              }
              onClose()
            }}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!transcript.trim()}
            className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-lg disabled:opacity-40 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Use Transcribed Text</span>
          </button>
        </div>
      </div>
    </div>
  )
}
