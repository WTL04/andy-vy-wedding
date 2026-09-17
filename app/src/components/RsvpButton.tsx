import { useEffect, useRef, useState } from "react";
import "./RsvpButton.css";

interface RsvpButtonProps {
  date?: string;
  onRsvpClick: () => void;
}

export default function RsvpButton({
  date = "February 27th, 2027",
  onRsvpClick,
}: RsvpButtonProps) {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
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
      <button
        ref={anchorRef}
        type="button"
        className="rsvp-button"
        onClick={onRsvpClick}
      >
        RSVP
      </button>

      <div
        className={`rsvp-floating ${showFloating ? "rsvp-floating--visible" : ""}`}
        aria-hidden={!showFloating}
      >
        <span className="rsvp-floating__date">{date}</span>
        <button
          type="button"
          className="rsvp-floating__button"
          onClick={onRsvpClick}
          tabIndex={showFloating ? 0 : -1}
        >
          RSVP
        </button>
      </div>
    </>
  );
}
