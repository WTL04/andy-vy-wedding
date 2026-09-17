import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import './RsvpModal.css'
import {
  submitRsvp,
  type RsvpGuest,
  type RsvpResponse,
} from '../data/rsvp'

type Step = 'names' | 'response' | 'done'

interface RsvpModalProps {
  onClose: () => void
}

export default function RsvpModal({ onClose }: RsvpModalProps) {
  const [step, setStep] = useState<Step>('names')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [hasPlusOne, setHasPlusOne] = useState(false)
  const [plusFirst, setPlusFirst] = useState('')
  const [plusLast, setPlusLast] = useState('')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    plusFirst?: string
    plusLast?: string
  }>({})
  const [isClosing, setIsClosing] = useState(false)
  const closingRef = useRef(false)
  const closeTimer = useRef<number | null>(null)

  // Clear a pending close timer if the modal unmounts early.
  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current)
      }
    }
  }, [])

  // Play the close-out animation first, then unmount.
  const requestClose = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setIsClosing(true)
    closeTimer.current = window.setTimeout(onClose, 180)
  }, [onClose])

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [requestClose])

  function submitNames(e: FormEvent) {
    e.preventDefault()
    const next: {
      firstName?: string
      lastName?: string
      plusFirst?: string
      plusLast?: string
    } = {}
    if (!firstName.trim()) next.firstName = 'Please enter your first name'
    if (!lastName.trim()) next.lastName = 'Please enter your last name'
    if (hasPlusOne) {
      if (!plusFirst.trim())
        next.plusFirst = "Please enter your plus one's first name"
      if (!plusLast.trim())
        next.plusLast = "Please enter your plus one's last name"
    }
    setErrors(next)
    if (Object.keys(next).length === 0) setStep('response')
  }

  function removePlusOne() {
    setHasPlusOne(false)
    setPlusFirst('')
    setPlusLast('')
    setErrors((prev) => {
      const next = { ...prev }
      delete next.plusFirst
      delete next.plusLast
      return next
    })
  }

  function choose(attendingChoice: boolean) {
    const guests: RsvpGuest[] = [
      { firstName: firstName.trim(), lastName: lastName.trim() },
    ]
    if (hasPlusOne) {
      guests.push({ firstName: plusFirst.trim(), lastName: plusLast.trim() })
    }
    const response: RsvpResponse = {
      guests,
      attending: attendingChoice,
      submittedAt: new Date().toISOString(),
    }
    // Fire-and-forget: never block the thank-you screen.
    void submitRsvp(response)
    setAttending(attendingChoice)
    setStep('done')
  }

  const guestLabel =
    `${firstName.trim()} ${lastName.trim()}`.trim() || 'Guest'

  return (
    <div
      className={`rv-overlay${isClosing ? ' is-closing' : ''}`}
      onClick={requestClose}
    >
      <div
        className={`rv-modal${isClosing ? ' is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="RSVP"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="rv-close"
          onClick={requestClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* ── Step 1: names ─────────────────────────────────── */}
        {step === 'names' && (
          <div className="rv-body">
            <h2 className="rv-title">RSVP</h2>
            <p className="rv-sub">
              Saturday, February 27, 2027
              <br />
              Garden Grove, California
            </p>
            <form onSubmit={submitNames} noValidate>
              <div className="rv-row">
                <div className="rv-field">
                  <label className="rv-label" htmlFor="rv-first">
                    First name
                  </label>
                  <input
                    id="rv-first"
                    type="text"
                    className={`rv-input ${errors.firstName ? 'is-invalid' : ''}`}
                    placeholder="Vy"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    autoFocus
                  />
                  {errors.firstName && (
                    <p className="rv-error" role="alert">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="rv-field">
                  <label className="rv-label" htmlFor="rv-last">
                    Last name
                  </label>
                  <input
                    id="rv-last"
                    type="text"
                    className={`rv-input ${errors.lastName ? 'is-invalid' : ''}`}
                    placeholder="Nguyen"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                  {errors.lastName && (
                    <p className="rv-error" role="alert">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {hasPlusOne ? (
                <div className="rv-plusone">
                  <div className="rv-plusone__head">
                    <span className="rv-plusone__title">Plus one</span>
                    <button
                      type="button"
                      className="rv-link"
                      onClick={removePlusOne}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="rv-row">
                    <div className="rv-field">
                      <label className="rv-label" htmlFor="rv-plus-first">
                        First name
                      </label>
                      <input
                        id="rv-plus-first"
                        type="text"
                        className={`rv-input ${errors.plusFirst ? 'is-invalid' : ''}`}
                        placeholder="Andy"
                        value={plusFirst}
                        onChange={(e) => setPlusFirst(e.target.value)}
                        autoComplete="off"
                      />
                      {errors.plusFirst && (
                        <p className="rv-error" role="alert">
                          {errors.plusFirst}
                        </p>
                      )}
                    </div>
                    <div className="rv-field">
                      <label className="rv-label" htmlFor="rv-plus-last">
                        Last name
                      </label>
                      <input
                        id="rv-plus-last"
                        type="text"
                        className={`rv-input ${errors.plusLast ? 'is-invalid' : ''}`}
                        placeholder="Phan"
                        value={plusLast}
                        onChange={(e) => setPlusLast(e.target.value)}
                        autoComplete="off"
                      />
                      {errors.plusLast && (
                        <p className="rv-error" role="alert">
                          {errors.plusLast}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="rv-link rv-addone"
                  onClick={() => setHasPlusOne(true)}
                >
                  + Add a plus one
                </button>
              )}

              <button type="submit" className="rv-primary">
                Continue
              </button>
            </form>
          </div>
        )}

        {/* ── Step 2: response ──────────────────────────────── */}
        {step === 'response' && (
          <div className="rv-body rv-body--center">
            <h2 className="rv-title">{guestLabel}, will you be joining us?</h2>
            <p className="rv-sub">
              Please choose one option for your party.
            </p>
            <button
              type="button"
              className="rv-choice"
              onClick={() => choose(true)}
            >
              Joyfully Accept
            </button>
            <button
              type="button"
              className="rv-choice rv-choice--decline"
              onClick={() => choose(false)}
            >
              Regretfully Decline
            </button>
          </div>
        )}

        {/* ── Step 3: confirmation ──────────────────────────── */}
        {step === 'done' && (
          <div className="rv-body rv-body--center">
            {attending ? (
              <>
                <h2 className="rv-title">We can&apos;t wait! 🤍</h2>
                <p className="rv-sub">
                  Thank you, {guestLabel}. Your response has been recorded
                  — we&apos;ll see you on February 27th!
                </p>
              </>
            ) : (
              <>
                <h2 className="rv-title">You&apos;ll be missed</h2>
                <p className="rv-sub">
                  Thank you for letting us know, {guestLabel}. Your response
                  has been recorded.
                </p>
              </>
            )}
            <button
              type="button"
              className="rv-primary"
              onClick={requestClose}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
