import { useState } from 'react'
import { setGateCookie } from '../lib/gateCookie'
import './PasswordGate.css'

// Baked in at build time from .env (VITE_SITE_PASSWORD).
// Frontend-only: visible in the bundle, so this keeps casual visitors out
// rather than providing real access control.
const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD ?? ''

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 30_000

export default function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(0)

  const locked = Date.now() < lockedUntil

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (locked) return
    if (SITE_PASSWORD !== '' && password === SITE_PASSWORD) {
      setGateCookie(remember)
      onUnlock()
      return
    }
    const next = attempts + 1
    if (next >= MAX_ATTEMPTS) {
      setAttempts(0)
      setLockedUntil(Date.now() + LOCKOUT_MS)
      setError('Too many tries — please wait 30 seconds.')
    } else {
      setAttempts(next)
      setError('Incorrect password. Please try again.')
    }
  }

  return (
    <div className="gate">
      <form className="gate-card" onSubmit={handleSubmit}>
        <p className="gate-subtitle">Please enter the password to view </p>
        <input
          className="gate-input"
          type="password"
          autoFocus
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          disabled={locked}
          onChange={(e) => {
            setPassword(e.target.value)
            if (error) setError('')
          }}
        />
        <label className="gate-remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me for 30 days
        </label>
        {error && <p className="gate-error">{error}</p>}
        <button className="gate-button" type="submit" disabled={locked}>
          {locked ? 'Please wait…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
