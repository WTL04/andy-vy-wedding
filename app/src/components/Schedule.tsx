import './Schedule.css'

export default function Schedule() {
  return (
    <div className="schedule">
      <h2>Schedule</h2>
      <p className="schedule-date">Saturday, February 27, 2027</p>

      <div className="schedule-event">
        <span className="event-time">12:00pm</span>
        <div className="event-divider" />
        <div className="event-details">
          <p className="event-name">Ceremony @ Saint Bonaventure Catholic Church</p>
          <a
            className="event-address"
            href="https://maps.google.com/?q=16400+Springdale+St+Huntington+Beach+CA+92649"
            target="_blank"
            rel="noopener noreferrer"
          >
            16400 Springdale St
            <br />
            Huntington Beach, CA 92649
          </a>
        </div>
      </div>

      <div className="schedule-event">
        <span className="event-time">6:00pm</span>
        <div className="event-divider" />
        <div className="event-details">
          <p className="event-name">Reception @ Mon Chéri</p>
          <a
            className="event-address"
            href="https://maps.google.com/?q=12821+Harbor+Blvd+H1b+Garden+Grove+CA+92840"
            target="_blank"
            rel="noopener noreferrer"
          >
            12821 Harbor Blvd H1b
            <br />
            Garden Grove, CA 92840
          </a>
        </div>
      </div>

      <div className="dress-code">
        <img
          className="dress-code-icon"
          src="/imgs/hanger.png"
          alt="Dress code"
        />
        <p>Please no wine, burgundy, rustic, taupe, umber, or white colors :)</p>
      </div>
    </div>
  )
}
