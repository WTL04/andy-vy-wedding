import Navbar from './components/Navbar'
import Monogram from './components/Monogram'
import CountdownTimer from './components/CountdownTimer'
import RsvpButton from './components/RsvpButton'
import PhotoCarousel from './components/PhotoCarousel'
import Schedule from './components/Schedule'
import SpecialThanks from './components/SpecialThanks'
import QandA from './components/QandA'
import OurStory from './components/OurStory'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <div className="mobile-container">
        <div id="home">
          <Monogram />
          <h1>You are Invited!</h1>
          <p className="date">Saturday, February 27, 2027</p>
          <p className="location">Garden Grove, California</p>
          <CountdownTimer targetDate="2027-02-27T12:00:00-08:00" />
        </div>
        <div id="rsvp">
          <RsvpButton />
        </div>
        <SpecialThanks />
        <PhotoCarousel />
        <OurStory />
        <div id="schedule">
          <Schedule />
        </div>
        <div id="qa">
          <QandA />
        </div>
        <div id="registry">
          <h1>Registry</h1>
          <p>WIP</p>
        </div>
        <div id="moments">
          <h1>Moments</h1>
          <p>WIP</p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App
