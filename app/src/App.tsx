import Monogram from './components/Monogram'
import CountdownTimer from './components/CountdownTimer'
import RsvpButton from './components/RsvpButton'
import PhotoCarousel from './components/PhotoCarousel'
import Schedule from './components/Schedule'
import SpecialThanks from './components/SpecialThanks'
import './App.css'

function App() {
  return (
    <div className="mobile-container">
      <Monogram />
      <h1>You are Invited!</h1>
      <p className="date">Saturday, February 27, 2027</p>
      <p className="location">Garden Grove, California</p>
      <CountdownTimer targetDate="2027-02-27T16:00:00-08:00" />
      <RsvpButton />
      <SpecialThanks />
      <PhotoCarousel />
      <h1>Our Story</h1>
      <p className="our_story">We met when we were eighteen and twenty years old. The thought that one day we would be married to each other never crossed our minds, but we made it through those harsh years, and we have grown to love each other even more dearly. We were together through our twenties and will continue to go through life together forever 🤍</p>
      <Schedule />
    </div>
  )
}

export default App
