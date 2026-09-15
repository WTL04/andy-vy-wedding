import { useEffect, useState, type FormEvent } from 'react'
import {
  PAYMENT_METHODS,
  formatAmount,
  paypalUrl,
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContributeModal({
  item,
  onClose,
}: ContributeModalProps) {
  const [step, setStep] = useState<Step>('amount')
  const [amount, setAmount] = useState('')
  const [from, setFrom] = useState('')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<PaymentMethod>('venmo')
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [errors, setErrors] = useState<{
    amount?: string
    from?: string
    email?: string
  }>({})

  const parsedAmount = Number(amount)

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

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
    const next: { from?: string; email?: string } = {}
    if (!from.trim()) next.from = 'Let the couple know who this gift is from'
    if (!email.trim() || !EMAIL_RE.test(email.trim()))
      next.email = 'Sharing your email is required'
    setErrors(next)
    if (Object.keys(next).length === 0) setStep('method')
  }

  function submitMethod(e: FormEvent) {
    e.preventDefault()
    if (method === 'venmo') {
      window.open(
        venmoUrl(parsedAmount, from.trim()),
        '_blank',
        'noopener,noreferrer'
      )
    } else if (method === 'paypal') {
      window.open(paypalUrl(parsedAmount), '_blank', 'noopener,noreferrer')
    }
    setStep('done')
  }

  function reopenPayment() {
    if (method === 'venmo') {
      window.open(
        venmoUrl(parsedAmount, from.trim()),
        '_blank',
        'noopener,noreferrer'
      )
    } else if (method === 'paypal') {
      window.open(paypalUrl(parsedAmount), '_blank', 'noopener,noreferrer')
    }
  }

  const safeAmount = Number.isFinite(parsedAmount) ? parsedAmount : 0

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div
        className="cm-modal"
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
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* ── Step 1: gift amount ─────────────────────────────── */}
        {step === 'amount' && (
          <>
            <img className="cm-image" src={item.image} alt={item.title} />
            <div className="cm-body">
              <h2 className="cm-title">
                {item.title} <span aria-hidden="true">{item.emoji}</span>
              </h2>
              <p className="cm-desc">
                {showFullDesc ? item.longDescription : item.shortDescription}{' '}
                <button
                  type="button"
                  className="cm-readmore"
                  onClick={() => setShowFullDesc((v) => !v)}
                >
                  {showFullDesc ? 'Show less' : 'Read more'}
                </button>
              </p>
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
              <h2 className="cm-title">Add your details</h2>
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
                <label
                  className="cm-label cm-label--required"
                  htmlFor="cm-email"
                >
                  Email
                </label>
                <input
                  id="cm-email"
                  type="email"
                  className={`cm-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <p className={`cm-hint ${errors.email ? 'is-error' : ''}`}>
                  {errors.email ?? 'Sharing your email is required'}
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
              <h2 className="cm-title">How would you like to give?</h2>
              <p className="cm-sub">
                Vy &amp; Andy would like to receive their gifts using one of
                the methods below:
              </p>
              <form onSubmit={submitMethod}>
                <div
                  className="cm-methods"
                  role="radiogroup"
                  aria-label="Payment method"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`cm-method${
                        method === m.id ? ' is-selected' : ''
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
            <h2 className="cm-title">Thank you! 🤍</h2>
            {(method === 'venmo' || method === 'paypal') && (
              <>
                <p className="cm-sub">
                  We opened {method === 'venmo' ? 'Venmo' : 'PayPal'} in a new
                  tab to complete your {formatAmount(safeAmount)} gift
                  {from.trim() ? ` from ${from.trim()}` : ''}.
                </p>
                <button
                  type="button"
                  className="cm-link"
                  onClick={reopenPayment}
                >
                  Open {method === 'venmo' ? 'Venmo' : 'PayPal'} again
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
            {method === 'cash' && (
              <p className="cm-sub">{registry.payment.cashInstructions}</p>
            )}
            <button type="button" className="cm-primary" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
