import React, { useState, useEffect } from 'react'

export function MissMinutesLogo({ size = 42, className = '' }) {
  const [secondsDeg, setSecondsDeg] = useState(0)
  const [minutesDeg, setMinutesDeg] = useState(0)
  const [hoursDeg, setHoursDeg] = useState(0)
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    const updateHands = () => {
      const now = new Date()
      const s = now.getSeconds()
      const m = now.getMinutes()
      const h = now.getHours() % 12

      setSecondsDeg(s * 6)
      setMinutesDeg((m + s / 60) * 6)
      setHoursDeg((h + m / 60) * 30)
    }

    updateHands()
    const timer = setInterval(updateHands, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 200)
    }, 4000)
    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      title="Madame Minute - TVA Chrono Assistant"
    >
      {/* Outer TVA Clock Gear Aura */}
      <div className="absolute inset-0 rounded-full border border-amber-500/40 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse" />
      
      {/* Madame Minute Face Clock Graphic */}

      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full transform hover:scale-105 transition-transform duration-300"
      >
        {/* Outer Vintage Clock Markings */}
        <circle cx="50" cy="50" r="46" fill="#F59E0B" stroke="#78350F" strokeWidth="4" />
        <circle cx="50" cy="50" r="40" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />

        {/* Hour Ticks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
          <line
            key={angle}
            x1="50"
            y1="14"
            x2="50"
            y2="19"
            stroke="#B45309"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}

        {/* Eyes (Blinking Animation) */}
        <ellipse 
          cx="38" 
          cy="38" 
          rx="5" 
          ry={isBlinking ? "0.8" : "7"} 
          fill="#1C1917" 
          className="transition-all duration-100"
        />
        <ellipse 
          cx="62" 
          cy="38" 
          rx="5" 
          ry={isBlinking ? "0.8" : "7"} 
          fill="#1C1917" 
          className="transition-all duration-100"
        />

        {/* Retro Smile */}
        <path 
          d="M 36 55 Q 50 66 64 55" 
          fill="none" 
          stroke="#1C1917" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />

        {/* Clock Hands */}
        {/* Hour Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="30"
          stroke="#78350F"
          strokeWidth="5"
          strokeLinecap="round"
          transform={`rotate(${hoursDeg} 50 50)`}
        />
        {/* Minute Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="22"
          stroke="#1C1917"
          strokeWidth="3.5"
          strokeLinecap="round"
          transform={`rotate(${minutesDeg} 50 50)`}
        />
        {/* Second Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="18"
          stroke="#EF4444"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${secondsDeg} 50 50)`}
        />

        {/* Center Cap */}
        <circle cx="50" cy="50" r="4" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
      </svg>
    </div>
  )
}
