import React, { useEffect } from 'react'
import { playTvaTick } from '../../utils/tvaAudio'

export function ChronoHeaderBar() {
  useEffect(() => {
    const timer = setInterval(() => {
      playTvaTick()
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return null
}
