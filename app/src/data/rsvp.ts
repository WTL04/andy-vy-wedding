// RSVP response model + submission seam.
//
// Google Sheets integration (see apps-script/rsvp.gs):
//   1. Deploy the script (Execute as: Me, Who has access: Anyone) and put
//      the /exec URL in VITE_GOOGLE_SHEETS_URL in .env (see .env.example).
//   2. The script writes one row per party:
//      Submitted At | Attending? | Guest 1..6 ("First Last" combined),
//      upserting on the Guest 1 name so resubmissions update in place.
// Submissions are live whenever the URL is set — empty means local stub.
// No component changes needed — submitRsvp() is the single integration point.

export const MAX_GUESTS = 6

export interface RsvpGuest {
  firstName: string
  lastName: string
  attending: boolean
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
