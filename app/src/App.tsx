import { useState } from 'react'
import Navbar from './components/Navbar'
import Monogram from './components/Monogram'
import CountdownTimer from './components/CountdownTimer'
import RsvpButton from './components/RsvpButton'
import PhotoCarousel, { type CarouselPhoto } from './components/PhotoCarousel'
import Schedule from './components/Schedule'
import SpecialThanks from './components/SpecialThanks'
import QandA from './components/QandA'
import OurStory from './components/OurStory'
import Registry from './components/Registry'
import Footer from './components/Footer'
import RsvpModal from './components/RsvpModal'
import './App.css'

const coolTonePhotos: CarouselPhoto[] = [
  { src: '/imgs/cool tone 1.JPG', alt: 'Cool tone 1' },
  { src: '/imgs/cool tone 2.JPG', alt: 'Cool tone 2' },
  { src: '/imgs/cool tone 3.JPG', alt: 'Cool tone 3' },
]

const warmTonePhotos: CarouselPhoto[] = [
  { src: '/imgs/warmish tone.JPG', alt: 'Cool tone 0' },
  { src: '/imgs/warm tone 1.JPG', alt: 'Cool tone 1' },
  { src: '/imgs/warm tone 2.JPG', alt: 'Cool tone 2' },
  { src: '/imgs/warm tone 3.JPG', alt: 'Cool tone 3' },

]

const landscapePhotos: CarouselPhoto[] = [
  { src: '/imgs/hero 1.JPG', alt: 'Hero 1' },
  { src: '/imgs/hero 2.JPG', alt: 'Hero 2' },
  { src: '/imgs/hero 3.JPG', alt: 'Hero 3' },
  { src: '/imgs/hero 4.JPG', alt: 'Hero 4' },
]

function App() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false)
  const openRsvp = () => setIsRsvpOpen(true)
  const closeRsvp = () => setIsRsvpOpen(false)

  return (
    <>
      <Navbar onRsvpClick={openRsvp} />
      <div className="mobile-container">
        <div id="home">
          <Monogram />
          <h1>You are Invited!</h1>
          <p className="date">Saturday, February 27, 2027</p>
          <p className="location">Garden Grove, California</p>
          <CountdownTimer targetDate="2027-02-27T12:00:00-08:00" />
        </div>
        <div id="rsvp">
          <RsvpButton onRsvpClick={openRsvp} />
        </div>
        <SpecialThanks />
        <PhotoCarousel
          photos={coolTonePhotos}
          orientation="portrait"
          label="Portrait"
        />
        <OurStory />
      </div>
      <div className="carousel-fullbleed">
        <PhotoCarousel
          photos={landscapePhotos}
          orientation="landscape"
          label="Landscape"
        />
      </div>
      <div className="mobile-container mobile-container--continuation">
        <div id="schedule">
          <Schedule />
        </div>

        <PhotoCarousel
          photos={warmTonePhotos}
          orientation="portrait"
          label="Portrait"
        />
        <div id="qa">
          <QandA />
        </div>
        <Registry />
      </div>
      <Footer />
      {isRsvpOpen && <RsvpModal onClose={closeRsvp} />}
    </>
  )
}

export default App
