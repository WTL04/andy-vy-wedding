// RSVP response model + submission seam.
//
// Google Sheets integration:
//   1. Create a Google Apps Script Web App whose doPost() appends a row
//      [submittedAt, attending, guest1First, guest1Last, guest2First, guest2Last].
//   2. Deploy it (Execute as: Me, Who has access: Anyone) and put the
//      /exec URL in VITE_GOOGLE_SHEETS_URL in .env (see .env.example).
// Submissions are live whenever the URL is set — empty means local stub.
// No component changes needed — submitRsvp() is the single integration point.

export interface RsvpGuest {
  firstName: string
  lastName: string
}

export interface RsvpResponse {
  guests: RsvpGuest[]
  attending: boolean
  submittedAt: string
}

const GOOGLE_SHEETS_URL: string =
  import.meta.env.VITE_GOOGLE_SHEETS_URL ?? ''
const SEND_TO_SHEETS = GOOGLE_SHEETS_URL !== ''

export async function submitRsvp(
  response: RsvpResponse
): Promise<{ ok: boolean }> {
  if (SEND_TO_SHEETS && GOOGLE_SHEETS_URL) {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 8000)
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
        signal: controller.signal,
      })
      return { ok: true }
    } catch {
      // Never block the thank-you screen on a network hiccup.
      return { ok: false }
    } finally {
      window.clearTimeout(timeout)
    }
  }

  // Local stub until the sheet is wired up.
  if (import.meta.env.DEV) {
    console.info('[rsvp] stubbed submission:', response)
  }
  return { ok: true }
}
