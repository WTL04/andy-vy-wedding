import { useEffect, useRef, useState } from 'react'
import './MusicToggle.css'

const SRC = '/audio/wedding.m4a'

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  // Create once, lazily — the 2.8MB file isn't fetched until first play.
  const getAudio = () => {
    if (!audioRef.current) {
      const el = new Audio(SRC)
      el.loop = true
      el.preload = 'none'
      el.volume = 0.8
      audioRef.current = el
    }
    return audioRef.current
  }

  const toggle = () => {
    const el = getAudio()
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      el
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }
  }

  // Pause when the tab is hidden so music doesn't play unseen.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
        setPlaying(false)
      }
    }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      audioRef.current?.pause()
    }
  }, [])

  // Best-effort autoplay: browsers allow it only with prior engagement,
  // so also start on the first tap/keypress anywhere on the page.
  useEffect(() => {
    let cancelled = false
    const start = () => {
      getAudio()
        .play()
        .then(() => {
          if (!cancelled) setPlaying(true)
        })
        .catch(() => {})
    }
    start()
    window.addEventListener('pointerdown', start, { once: true })
    window.addEventListener('keydown', start, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }
  }, [])

  return (
    <button
      type="button"
      className={`music-toggle${playing ? ' is-playing' : ''}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause wedding music' : 'Play wedding music'}
      title={playing ? 'Pause music' : 'Play music'}
    >
      <span className="music-bars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
    </button>
  )
}
