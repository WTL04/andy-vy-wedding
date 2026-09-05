import Monogram from './components/Monogram'
import CountdownTimer from './components/CountdownTimer'
import RsvpButton from './components/RsvpButton'
import PhotoCarousel from './components/PhotoCarousel'
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
      <PhotoCarousel />
    </div>
  )
}

export default App
