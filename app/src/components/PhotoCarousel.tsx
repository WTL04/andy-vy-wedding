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

export default function PhotoCarousel() {
  const [active, setActive] = useState(0)
  const locked = useRef(false)

  const handleClick = useCallback((i: number) => {
    if (locked.current) return
    setActive(i)
    locked.current = true
    setTimeout(() => { locked.current = false }, TRANSITION_MS)
  }, [])

  return (
    <div className="carousel">
      <div className="carousel-track">
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
