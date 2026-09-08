import Navbar from './components/Navbar'
import Monogram from './components/Monogram'
import CountdownTimer from './components/CountdownTimer'
import RsvpButton from './components/RsvpButton'
import PhotoCarousel from './components/PhotoCarousel'
import Schedule from './components/Schedule'
import SpecialThanks from './components/SpecialThanks'
import QandA from './components/QandA'
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
          <CountdownTimer targetDate="2027-02-27T16:00:00-08:00" />
        </div>
        <div id="rsvp">
          <RsvpButton />
        </div>
        <SpecialThanks />
        <PhotoCarousel />
        <div id="story">
          <h1>Our Story</h1>
          <p className="our_story">We met when we were eighteen and twenty years old. The thought that one day we would be married to each other never crossed our minds, but we made it through those harsh years, and we have grown to love each other even more dearly. We were together through our twenties and will continue to go through life together forever 🤍</p>
        </div>
        <div id="schedule">
          <Schedule />
        </div>
        <div id="qa">
          <QandA />
        </div>
        <div id="registry">
          <h1>Registry</h1>
        </div>
        <div id="moments">
          <h1>Moments</h1>
        </div>
      </div>
    </>
  )
}

export default App
