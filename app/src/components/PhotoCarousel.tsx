import { useState, useRef, useCallback } from 'react'
import './PhotoCarousel.css'

const images = [
  '/imgs/photo_1.JPG',
  '/imgs/photo_1.JPG',
  '/imgs/photo_1.JPG',
]

function getOffset(index: number, active: number): number {
  const diff = index - active
  if (diff === -1 || diff === 2) return -1
  if (diff === 1 || diff === -2) return 1
  return 0
}

function getPosition(offset: number): string {
  if (offset === -1) return 'left'
  if (offset === 1) return 'right'
  return 'center'
}

const TRANSITION_MS = 600

const SWIPE_THRESHOLD = 50

export default function PhotoCarousel() {
  const [active, setActive] = useState(0)
  const locked = useRef(false)
  const touchStartX = useRef(0)

  const navigate = useCallback((next: number) => {
    if (locked.current) return
    setActive(next)
    locked.current = true
    setTimeout(() => { locked.current = false }, TRANSITION_MS)
  }, [])

  const handleClick = useCallback((i: number) => {
    navigate(i)
  }, [navigate])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    const next = delta < 0
      ? (active + 1) % images.length
      : (active - 1 + images.length) % images.length
    navigate(next)
  }, [active, navigate])

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, i) => {
          const offset = getOffset(i, active)
          return (
            <img
              key={i}
              className={`carousel-slide ${getPosition(offset)}`}
              src={src}
              alt={`Photo ${i + 1}`}
              onClick={() => handleClick(i)}
            />
          )
        })}
      </div>
    </div>
  )
}
