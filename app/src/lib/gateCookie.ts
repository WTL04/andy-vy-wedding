// Frontend-only gate helpers. NOTE: this is obfuscation, not real security —
// the password ships in the client bundle and anyone can bypass the gate
// via devtools. Good enough to keep casual visitors out.

const COOKIE_NAME = 'av_unlocked'
const COOKIE_VALUE = '1'
const REMEMBER_DAYS = 30

function cookieFlags(): string {
  const parts = [`${COOKIE_NAME}=${COOKIE_VALUE}`, 'path=/', 'SameSite=Lax']
  if (typeof location !== 'undefined' && location.protocol === 'https:') {
    parts.push('Secure')
  }
  return parts.join('; ')
}

export function setGateCookie(remember: boolean): void {
  if (remember) {
    document.cookie = `${cookieFlags()}; max-age=${REMEMBER_DAYS * 24 * 60 * 60}`
  } else {
    // Session cookie: the browser drops it on close.
    document.cookie = cookieFlags()
  }
}

export function hasGateCookie(): boolean {
  return document.cookie
    .split(';')
    .some((part) => part.trim() === `${COOKIE_NAME}=${COOKIE_VALUE}`)
}

export function clearGateCookie(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`
}
