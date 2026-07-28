import React from 'react'

export function ScanlineOverlay() {
  return (
    <>
      {/* CRT Corner Vignette */}
      <div className="crt-vignette" aria-hidden="true" />

      {/* Moving CRT Scanning Beam */}
      <div className="crt-scanline-beam" aria-hidden="true" />

      {/* Fine CRT Scanline Texture Grid */}
      <div 
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden opacity-20 animate-crt-flicker"
        aria-hidden="true"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 158, 11, 0.03), rgba(0, 255, 0, 0.01), rgba(249, 115, 22, 0.03))',
          backgroundSize: '100% 3px, 6px 100%'
        }}
      />
    </>
  )
}
