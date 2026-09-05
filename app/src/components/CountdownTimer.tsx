import { useState, useEffect } from 'react'

interface Props {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownTimer({ targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate))

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <p className="countdown">
      {timeLeft.days} days : {timeLeft.hours} hrs : {timeLeft.minutes} mins : {timeLeft.seconds} secs
    </p>
  )
}
