import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  StackedCarousel,
  ResponsiveContainer,
} from 'react-stacked-center-carousel'
import './PhotoCarousel.css'

export interface CarouselPhoto {
  src: string
  alt: string
  /** Eager-load this slide. Set on the initially visible window. */
  eager?: boolean
}

interface PhotoCarouselProps {
  photos: CarouselPhoto[]
  orientation: 'portrait' | 'landscape'
  label: string
  intervalMs?: number
  /** Eager-load the initially visible slides. Set on the first carousel only. */
  priority?: boolean
}

// Number of slides visible at once never exceeds 3 for these photo sets
// (desktop cap is min(5, maxVisibleSlide), maxVisibleSlide is 3).
const EAGER_WINDOW = 3

// Module-level so its identity is stable across renders: if the component
// type changed, React would remount every slide (and refetch every image).
// The library only passes { data, dataIndex }, so eagerness travels in data.
const Card = React.memo(function Card(props: {
  data: CarouselPhoto[]
  dataIndex: number
}) {
  const { data, dataIndex } = props
  const photo = data[dataIndex]
  if (!photo) return null
  const eager = photo.eager ?? false
  return (
    <div style={{ width: '100%', height: '100%', userSelect: 'none' }}>
      <img
        style={{
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          borderRadius: 8,
        }}
        draggable={false}
        src={photo.src}
        alt={photo.alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
      />
    </div>
  )
})

// Mount the heavy carousel only when it's near the viewport, so
// offscreen images and carousel JS don't compete with first paint.
// `mounted` latches (avoids remount cost); `visible` stays live so
// autoplay pauses when scrolled away.
function useNearViewport<T extends HTMLElement>(rootMargin = '200px') {
  const ref = useRef<T | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setMounted(true)
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target !== el) continue
          if (entry.isIntersecting) setMounted(true)
          setVisible(entry.isIntersecting)
        }
      },
      { rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin])
  return { ref, mounted, visible }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export default function PhotoCarousel({
  photos,
  orientation,
  label,
  intervalMs = 3000,
  priority = false,
}: PhotoCarouselProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(undefined)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { ref: viewportRef, mounted, visible } = useNearViewport<HTMLDivElement>()
  const reducedMotion = usePrefersReducedMotion()

  // Normalize once: encode spaced filenames, flag the visible window eager.
  const data = useMemo(
    () =>
      photos.map((p, i) => ({
        ...p,
        src: encodeURI(p.src),
        eager: priority && i < EAGER_WINDOW,
      })),
    [photos, priority]
  )

  // Auto-advance slides; paused while offscreen, hovered, touch-dragged,
  // or when the user prefers reduced motion.
  useEffect(() => {
    if (!visible || isPaused || reducedMotion) return
    const id = window.setInterval(() => {
      ref.current?.goNext?.()
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [visible, isPaused, reducedMotion, intervalMs])

  // StackedCarousel requires odd slide counts, with
  // currentVisibleSlide <= maxVisibleSlide.
  const maxVisibleSlide =
    photos.length % 2 === 1 ? photos.length : photos.length - 1

  const isPortrait = orientation === 'portrait'
  // Portrait photos are 2:3, landscape photos are 3:2.
  const aspectRatio = isPortrait ? 1.5 : 2 / 3
  const desktopSlideWidth = isPortrait ? 560 : 1200
  const mobileGutter = isPortrait ? 40 : 24

  // Placeholder mirrors the mounted carousel's own sizing math
  // (slideWidth = min(cap, 100% - gutter)) so swapping it in
  // introduces no layout shift.
  const placeholderStyle: React.CSSProperties = {
    maxWidth: desktopSlideWidth,
    width: `calc(100% - ${mobileGutter}px)`,
    margin: '0 auto',
    aspectRatio: isPortrait ? '2 / 3' : '3 / 2',
  }

  return (
    <div
      ref={viewportRef}
      className={`photo-carousel photo-carousel--${orientation}`}
    >
      {!mounted ? (
        <div
          className="photo-carousel__placeholder"
          style={placeholderStyle}
          role="status"
          aria-label={`Loading ${label} photos`}
        />
      ) : (
        <div
          style={{ width: '100%', position: 'relative' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <ResponsiveContainer
            carouselRef={ref}
            render={(parentWidth, carouselRef) => {
              let currentVisibleSlide = Math.min(5, maxVisibleSlide)
              if (parentWidth <= 1080)
                currentVisibleSlide = Math.min(3, maxVisibleSlide)
              if (parentWidth <= 600) currentVisibleSlide = 1
              // Never wider than the available track (minus gutter),
              // so mid-size viewports get a fully visible slide instead
              // of a cropped fixed-width one. Clamped: the container can
              // report 0 on the cold-mount frame.
              const slideWidth = Math.max(
                0,
                Math.min(desktopSlideWidth, parentWidth - mobileGutter)
              )
              const height = Math.round(slideWidth * aspectRatio)
              return (
                <StackedCarousel
                  ref={carouselRef}
                  slideComponent={Card}
                  slideWidth={slideWidth}
                  carouselWidth={parentWidth}
                  height={height}
                  data={data}
                  currentVisibleSlide={currentVisibleSlide}
                  maxVisibleSlide={maxVisibleSlide}
                  useGrabCursor
                  onActiveSlideChange={setActiveSlide}
                />
              )
            }}
          />
        </div>
      )}
      <div className="photo-carousel__dots">
        {photos.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`photo-carousel__dot ${index === activeSlide ? 'is-active' : ''}`}
            aria-label={`Go to ${label} photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
