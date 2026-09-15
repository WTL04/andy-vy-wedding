import { useEffect, useRef, useState } from "react";
import "./RsvpButton.css";

const RSVP_URL = "https://withjoy.com/vyandandy/rsvp";

export default function RsvpButton({ date = "February 27th, 2027" }) {
  const anchorRef = useRef(null);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Once the inline button has scrolled above the viewport
        // (top < 0 and no longer intersecting), show the floating pill.
        // If it's below the viewport (not reached yet) or still visible,
        // keep it hidden.
        const scrolledPast =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setShowFloating(scrolledPast);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a
        ref={anchorRef}
        className="rsvp-button"
        href={RSVP_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        RSVP
      </a>

      <div
        className={`rsvp-floating ${showFloating ? "rsvp-floating--visible" : ""}`}
        aria-hidden={!showFloating}
      >
        <span className="rsvp-floating__date">{date}</span>
        <a
          className="rsvp-floating__button"
          href={RSVP_URL}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={showFloating ? 0 : -1}
        >
          RSVP
        </a>
      </div>
    </>
  );
}
