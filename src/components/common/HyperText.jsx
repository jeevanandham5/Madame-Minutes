import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const TVA_CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*@!'

export function HyperText({
  children,
  text,
  duration = 800,
  delay = 0,
  className = '',
  animateOnHover = true
}) {
  const targetText = text || (typeof children === 'string' ? children : '')
  const [displayText, setDisplayText] = useState(targetText.split(''))
  const interValRef = useRef(null)

  const triggerAnimation = () => {
    if (!targetText) return
    let iteration = 0
    const maxIterations = targetText.length * 2
    const intervalTime = Math.max(20, duration / maxIterations)

    clearInterval(interValRef.current)

    interValRef.current = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n') return char
            if (index < iteration / 2) {
              return targetText[index]
            }
            return TVA_CHAR_SET[Math.floor(Math.random() * TVA_CHAR_SET.length)]
          })
      )

      if (iteration >= maxIterations) {
        clearInterval(interValRef.current)
        setDisplayText(targetText.split(''))
      }

      iteration += 1
    }, intervalTime)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerAnimation()
    }, delay)

    return () => {
      clearTimeout(timer)
      clearInterval(interValRef.current)
    }
  }, [targetText, delay])

  return (
    <span
      className={`inline-flex overflow-hidden cursor-pointer ${className}`}
      onMouseEnter={() => animateOnHover && triggerAnimation()}
    >
      {displayText.map((letter, index) => (
        <span key={index} className="inline-block whitespace-pre">
          {letter}
        </span>
      ))}
    </span>
  )
}
