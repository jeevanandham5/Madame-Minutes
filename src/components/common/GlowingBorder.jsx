import React from 'react'

export function GlowingBorder({ children, className = '' }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500 group-hover:duration-200" />
      <div className="relative bg-[#1E1E1E] border border-amber-500/30 rounded-xl">
        {children}
      </div>
    </div>
  )
}
