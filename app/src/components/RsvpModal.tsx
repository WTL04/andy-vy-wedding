import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import './RsvpModal.css'
import {
  MAX_GUESTS,
  submitRsvp,
  type RsvpGuest,
  type RsvpResponse,
} from '../data/rsvp'

type Step = 'names' | 'response' | 'done'

interface RsvpModalProps {
  onClose: () => void
}

interface GuestForm {
  first: string
  last: string
  attending: boolean
}

const emptyGuest = (): GuestForm => ({ first: '', last: '', attending: true })

export default function RsvpModal({ onClose }: RsvpModalProps) {
  const [step, setStep] = useState<Step>('names')
  const [guests, setGuests] = useState<GuestForm[]>([emptyGuest()])
  const [errors, setErrors] = useState<Record<string, string>>({})
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

  function updateGuest(index: number, patch: Partial<GuestForm>) {
    setGuests((prev) =>
      prev.map((g, i) => (i === index ? { ...g, ...patch } : g))
    )
  }

  function addGuest() {
    setGuests((prev) =>
      prev.length >= MAX_GUESTS ? prev : [...prev, emptyGuest()]
    )
  }

  function removeGuest(index: number) {
    setGuests((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)
    )
    setErrors({})
  }

  function submitNames(e: FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    guests.forEach((g, i) => {
      const n = i + 1
      if (!g.first.trim())
        next[`${i}.first`] = `Please enter guest ${n}'s first name`
      if (!g.last.trim())
        next[`${i}.last`] = `Please enter guest ${n}'s last name`
    })
    setErrors(next)
    if (Object.keys(next).length === 0) setStep('response')
  }

  function submitResponse(e: FormEvent) {
    e.preventDefault()
    const trimmed: RsvpGuest[] = guests.map((g) => ({
      firstName: g.first.trim(),
      lastName: g.last.trim(),
      attending: g.attending,
    }))
    const response: RsvpResponse = {
      guests: trimmed,
      attending: trimmed.some((g) => g.attending),
      submittedAt: new Date().toISOString(),
    }
    // Fire-and-forget: never block the thank-you screen.
    void submitRsvp(response)
    setStep('done')
  }

  const attendingCount = guests.filter((g) => g.attending).length
  const guestLabel =
    `${guests[0]?.first.trim() ?? ''} ${guests[0]?.last.trim() ?? ''}`.trim() ||
    'Guest'

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
              {guests.map((g, i) => (
                <div key={i} className="rv-guest">
                  <div className="rv-guest__head">
                    <span className="rv-guest__title">Guest {i + 1}</span>
                    {guests.length > 1 && (
                      <button
                        type="button"
                        className="rv-link"
                        onClick={() => removeGuest(i)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="rv-row">
                    <div className="rv-field">
                      <label
                        className="rv-label"
                        htmlFor={`rv-first-${i}`}
                      >
                        First name
                      </label>
                      <input
                        id={`rv-first-${i}`}
                        type="text"
                        className={`rv-input ${errors[`${i}.first`] ? 'is-invalid' : ''}`}
                        placeholder="Vy"
                        value={g.first}
                        onChange={(e) =>
                          updateGuest(i, { first: e.target.value })
                        }
                        autoComplete={i === 0 ? 'given-name' : 'off'}
                        autoFocus={i === 0}
                      />
                      {errors[`${i}.first`] && (
                        <p className="rv-error" role="alert">
                          {errors[`${i}.first`]}
                        </p>
                      )}
                    </div>
                    <div className="rv-field">
                      <label className="rv-label" htmlFor={`rv-last-${i}`}>
                        Last name
                      </label>
                      <input
                        id={`rv-last-${i}`}
                        type="text"
                        className={`rv-input ${errors[`${i}.last`] ? 'is-invalid' : ''}`}
                        placeholder="Nguyen"
                        value={g.last}
                        onChange={(e) =>
                          updateGuest(i, { last: e.target.value })
                        }
                        autoComplete={i === 0 ? 'family-name' : 'off'}
                      />
                      {errors[`${i}.last`] && (
                        <p className="rv-error" role="alert">
                          {errors[`${i}.last`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {guests.length < MAX_GUESTS ? (
                <button
                  type="button"
                  className="rv-link rv-addone"
                  onClick={addGuest}
                >
                  + Add a guest ({guests.length} of {MAX_GUESTS})
                </button>
              ) : (
                <p className="rv-cap">
                  Maximum of {MAX_GUESTS} guests per RSVP.
                </p>
              )}

              <button type="submit" className="rv-primary">
                Continue
              </button>
            </form>
          </div>
        )}

        {/* ── Step 2: per-guest response ─────────────────────── */}
        {step === 'response' && (
          <div className="rv-body">
            <h2 className="rv-title">Who&apos;s joining us?</h2>
            <p className="rv-sub">
              Set each guest below, then continue.
            </p>
            <form onSubmit={submitResponse}>
              {guests.map((g, i) => {
                const name =
                  `${g.first.trim()} ${g.last.trim()}`.trim() ||
                  `Guest ${i + 1}`
                return (
                  <div key={i} className="rv-rsvp-row">
                    <span className="rv-rsvp-name">{name}</span>
                    <div
                      className="rv-toggle"
                      role="group"
                      aria-label={`Attendance for ${name}`}
                    >
                      <button
                        type="button"
                        className={g.attending ? 'is-selected' : ''}
                        aria-pressed={g.attending}
                        onClick={() => updateGuest(i, { attending: true })}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className={!g.attending ? 'is-selected' : ''}
                        aria-pressed={!g.attending}
                        onClick={() => updateGuest(i, { attending: false })}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )
              })}
              <button type="submit" className="rv-primary">
                Continue
              </button>
            </form>
          </div>
        )}

        {/* ── Step 3: confirmation ──────────────────────────── */}
        {step === 'done' && (
          <div className="rv-body rv-body--center">
            {attendingCount === guests.length ? (
              <>
                <h2 className="rv-title">We can&apos;t wait! 🤍</h2>
                <p className="rv-sub">
                  Thank you, {guestLabel}. Your response has been recorded
                  — we&apos;ll see you on February 27th!
                </p>
              </>
            ) : attendingCount === 0 ? (
              <>
                <h2 className="rv-title">You&apos;ll be missed</h2>
                <p className="rv-sub">
                  Thank you for letting us know, {guestLabel}. Your response
                  has been recorded.
                </p>
              </>
            ) : (
              <>
                <h2 className="rv-title">Thank you! 🤍</h2>
                <p className="rv-sub">
                  {attendingCount} of {guests.length} attending — your
                  response has been recorded. We&apos;ll see you on February
                  27th!
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
