import React, { useRef, useState } from 'react'
import {
  StackedCarousel,
  ResponsiveContainer,
} from 'react-stacked-center-carousel'
import './PhotoCarousel.css'

export interface CarouselPhoto {
  src: string
  alt: string
}

interface PhotoCarouselProps {
  photos: CarouselPhoto[]
  orientation: 'portrait' | 'landscape'
  label: string
}

const Card = React.memo(function Card(props: {
  data: CarouselPhoto[]
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

export default function PhotoCarousel({
  photos,
  orientation,
  label,
}: PhotoCarouselProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(undefined)
  const [activeSlide, setActiveSlide] = useState(0)

  // StackedCarousel requires odd slide counts, with
  // currentVisibleSlide <= maxVisibleSlide.
  const maxVisibleSlide =
    photos.length % 2 === 1 ? photos.length : photos.length - 1

  const isPortrait = orientation === 'portrait'
  // Portrait photos are 2:3, landscape photos are 3:2.
  const aspectRatio = isPortrait ? 1.5 : 2 / 3
  const desktopSlideWidth = isPortrait ? 560 : 1200
  const mobileGutter = isPortrait ? 40 : 24

  return (
    <div className={`photo-carousel photo-carousel--${orientation}`}>
      <div style={{ width: '100%', position: 'relative' }}>
        <ResponsiveContainer
          carouselRef={ref}
          render={(parentWidth, carouselRef) => {
            let currentVisibleSlide = Math.min(5, maxVisibleSlide)
            if (parentWidth <= 1080)
              currentVisibleSlide = Math.min(3, maxVisibleSlide)
            if (parentWidth <= 600) currentVisibleSlide = 1
            // Never wider than the available track (minus gutter),
            // so mid-size viewports get a fully visible slide instead
            // of a cropped fixed-width one.
            const slideWidth = Math.min(
              desktopSlideWidth,
              parentWidth - mobileGutter
            )
            const height = Math.round(slideWidth * aspectRatio)
            return (
              <StackedCarousel
                ref={carouselRef}
                slideComponent={Card}
                slideWidth={slideWidth}
                carouselWidth={parentWidth}
                height={height}
                data={photos}
                currentVisibleSlide={currentVisibleSlide}
                maxVisibleSlide={maxVisibleSlide}
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
            aria-label={`Go to ${label} photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
