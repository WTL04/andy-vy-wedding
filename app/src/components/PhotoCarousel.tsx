import photo from '../assets/photo_3.png'

export default function PhotoCarousel() {
  return (
    <div className="carousel">
      <img
        className="carousel-image"
        src={photo}
        alt="Photo"
      />
    </div>
  )
}
