import React, { useRef, useState, useEffect } from 'react'
import {
  StackedCarousel,
  ResponsiveContainer,
} from 'react-stacked-center-carousel'
import './PhotoCarousel.css'

const photos = [
  { src: '/imgs/1.JPG', alt: 'Photo 1' },
  { src: '/imgs/2.JPG', alt: 'Photo 2' },
  { src: '/imgs/3.JPG', alt: 'Photo 3' },
  { src: '/imgs/4.JPG', alt: 'Photo 4' },
  { src: '/imgs/5.JPG', alt: 'Photo 5' },
  { src: '/imgs/6.JPG', alt: 'Photo 6' },
  { src: '/imgs/7.JPG', alt: 'Photo 7' },
  { src: '/imgs/8.JPG', alt: 'Photo 7' },
  { src: '/imgs/9.JPG', alt: 'Photo 9' },
]

const photosLength = Object.keys(photos).length;

const Card = React.memo(function Card(props: {
  data: { src: string; alt: string }[]
  dataIndex: number
}) {
  const { data, dataIndex } = props
  const { src, alt } = data[dataIndex]
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
        src={src}
        alt={alt}
      />
    </div>
  )
})

export default function PhotoCarousel() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(undefined)
  const [activeSlide, setActiveSlide] = useState(0)

  // Track window width to trigger the complete rebuild from the top down
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculate height state using tiers
  let carouselHeight = 800; // Desktop default
  if (windowWidth <= 600) carouselHeight = 700; // Mobile
  if (windowWidth < 450) carouselHeight = 500;  // SUPER Mobile

  return (
    <div className="photo-carousel">
      {/* The key is now on this wrapper. When carouselHeight changes, 
          the entire ResponsiveContainer unmounts and remounts. */}
      <div key={carouselHeight} style={{ width: '100%', position: 'relative' }}>
        <ResponsiveContainer
          carouselRef={ref}
          render={(parentWidth, carouselRef) => {
            let currentVisibleSlide = 5
            if (parentWidth <= 1080) currentVisibleSlide = 3
            if (parentWidth <= 600) currentVisibleSlide = 1
            // 350px tier doesn't need a currentVisibleSlide change since it's already 1

            return (
              <StackedCarousel
                ref={carouselRef}
                slideComponent={Card}
                slideWidth={parentWidth < 800 ? parentWidth - 40 : 750}
                carouselWidth={parentWidth}
                height={carouselHeight}
                data={photos}
                currentVisibleSlide={currentVisibleSlide}
                maxVisibleSlide={photosLength}
                useGrabCursor
                onActiveSlideChange={setActiveSlide}
              />
            )
          }}
        />
      </div>
      <div className="photo-carousel__dots">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`photo-carousel__dot ${index === activeSlide ? 'is-active' : ''}`}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
