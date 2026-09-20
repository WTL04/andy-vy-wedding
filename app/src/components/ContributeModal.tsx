import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import {
  PAYMENT_METHODS,
  formatAmount,
  registry,
  venmoUrl,
  type PaymentMethod,
  type RegistryItem,
} from '../data/registry'

type Step = 'amount' | 'details' | 'method' | 'done'

interface ContributeModalProps {
  item: RegistryItem
  onClose: () => void
}

export default function ContributeModal({
  item,
  onClose,
}: ContributeModalProps) {
  const [step, setStep] = useState<Step>('amount')
  const [amount, setAmount] = useState('')
  const [from, setFrom] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('venmo')
  const [errors, setErrors] = useState<{
    amount?: string
    from?: string
  }>({})
  const [isClosing, setIsClosing] = useState(false)
  const closingRef = useRef(false)
  const closeTimer = useRef<number | null>(null)

  const parsedAmount = Number(amount)

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

  function submitAmount(e: FormEvent) {
    e.preventDefault()
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrors({ amount: 'Please enter an amount greater than $0' })
      return
    }
    setErrors({})
    setStep('details')
  }

  function submitDetails(e: FormEvent) {
    e.preventDefault()
    if (!from.trim()) {
      setErrors({ from: 'Let the couple know who this gift is from' })
      return
    }
    setErrors({})
    setStep('method')
  }

  function openVenmo() {
    window.open(
      venmoUrl(parsedAmount, from.trim()),
      '_blank',
      'noopener,noreferrer'
    )
  }

  function submitMethod(e: FormEvent) {
    e.preventDefault()
    if (method === 'venmo') openVenmo()
    setStep('done')
  }

  const safeAmount = Number.isFinite(parsedAmount) ? parsedAmount : 0

  return (
    <div
      className={`cm-overlay${isClosing ? ' is-closing' : ''}`}
      onClick={requestClose}
    >
      <div
        className={`cm-modal${isClosing ? ' is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Contribute to ${item.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back pills (steps after the first) */}
        {step === 'details' && (
          <button
            type="button"
            className="cm-back"
            onClick={() => setStep('amount')}
          >
            ‹ Gift
          </button>
        )}
        {step === 'method' && (
          <button
            type="button"
            className="cm-back"
            onClick={() => setStep('details')}
          >
            ‹ Details
          </button>
        )}
        <button
          type="button"
          className="cm-close"
          onClick={requestClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* ── Step 1: gift amount ─────────────────────────────── */}
        {step === 'amount' && (
          <>
            <img className="cm-image" src={item.image} alt={item.title} />
            <div className="cm-body">
              <p className="cm-desc">{item.longDescription}</p>
              <form onSubmit={submitAmount} noValidate>
                <label className="cm-label" htmlFor="cm-amount">
                  Gift Amount
                </label>
                <div className="cm-amountwrap">
                  <span aria-hidden="true">$</span>
                  <input
                    id="cm-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    autoFocus
                  />
                </div>
                {errors.amount && (
                  <p className="cm-error" role="alert">
                    {errors.amount}
                  </p>
                )}
                <button type="submit" className="cm-primary">
                  Give Now
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── Step 2: giver details ───────────────────────────── */}
        {step === 'details' && (
          <>
            <div className="cm-imagewrap">
              <img className="cm-image" src={item.image} alt={item.title} />
              <span className="cm-image__label">
                {item.title} <span aria-hidden="true">{item.emoji}</span>
              </span>
              <span className="cm-image__amount">
                {formatAmount(safeAmount)}
              </span>
            </div>
            <div className="cm-body">
              <p className="cm-sub">
                Please share your details to help Vy &amp; Andy track your
                gift.
              </p>
              <form onSubmit={submitDetails} noValidate>
                <label className="cm-label cm-label--required" htmlFor="cm-from">
                  From
                </label>
                <input
                  id="cm-from"
                  type="text"
                  className={`cm-input ${errors.from ? 'is-invalid' : ''}`}
                  placeholder="e.g. Evan & Julia, or The Sanchez Family"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  autoComplete="name"
                />
                <p className={`cm-hint ${errors.from ? 'is-error' : ''}`}>
                  {errors.from ?? 'Let the couple know who this gift is from'}
                </p>
                <button type="submit" className="cm-primary">
                  Add Details
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── Step 3: payment method ──────────────────────────── */}
        {step === 'method' && (
          <>
            <div className="cm-imagewrap">
              <img className="cm-image" src={item.image} alt={item.title} />
              <span className="cm-image__label">
                {item.title} <span aria-hidden="true">{item.emoji}</span>
              </span>
              <span className="cm-image__amount">
                {formatAmount(safeAmount)}
              </span>
            </div>
            <div className="cm-body">
              <p className="cm-sub">How would you like to give?</p>
              <form onSubmit={submitMethod}>
                <div
                  className="cm-methods"
                  role="radiogroup"
                  aria-label="Payment method"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`cm-method${method === m.id ? ' is-selected' : ''
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={m.id}
                        checked={method === m.id}
                        onChange={() => setMethod(m.id)}
                      />
                      <span
                        className="cm-method__check"
                        aria-hidden="true"
                      >
                        {method === m.id ? '✓' : ''}
                      </span>
                      {m.label}
                    </label>
                  ))}
                </div>
                <button type="submit" className="cm-next">
                  Next
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── Step 4: done ────────────────────────────────────── */}
        {step === 'done' && (
          <div className="cm-body cm-done">
            <h3 className="cm-done__thanks">Thank you! 🤍</h3>
            {method === 'venmo' && (
              <>
                <p className="cm-sub">
                  We opened Venmo in a new tab to complete your{' '}
                  {formatAmount(safeAmount)} gift
                  {from.trim() ? ` from ${from.trim()}` : ''}.
                </p>
                <button
                  type="button"
                  className="cm-link"
                  onClick={openVenmo}
                >
                  Open Venmo again
                </button>
              </>
            )}
            {method === 'zelle' && (
              <>
                <p className="cm-sub">
                  Send {formatAmount(safeAmount)} via Zelle to{' '}
                  <strong>{registry.payment.zelleContact}</strong>
                </p>
                {registry.payment.zelleQrSrc ? (
                  <img
                    className="cm-qr"
                    src={registry.payment.zelleQrSrc}
                    alt="Zelle QR code for sending a gift"
                  />
                ) : (
                  <div className="cm-qr cm-qr--placeholder">
                    Zelle QR coming soon
                  </div>
                )}
              </>
            )}
            <button
              type="button"
              className="cm-primary"
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
