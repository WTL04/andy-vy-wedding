// Wedding RSVP -> Google Sheet writer (one row per party).
//
// SETUP (one time, in your Google account):
//   1. Open your spreadsheet -> Extensions -> Apps Script.
//   2. Paste this file's contents, save, name the project (e.g. "Wedding RSVP").
//   3. Deploy -> New deployment -> gear icon -> Web app.
//   4. Execute as: Me. Who has access: Anyone. Deploy.
//   5. Copy the /exec URL into VITE_GOOGLE_SHEETS_URL in the app's .env.
//
// SCHEMA (auto-created header row if the tab is empty):
//   Submitted At | Guest 1 | Guest 2 | Guest 3 | Guest 4 | Guest 5 | Guest 6
// - Each guest is "First Last" combined with a space; unused slots stay blank.
// - No Attending? column: each guest cell is color-coded instead —
//   GREEN background = attending, RED background = declined (white text).
//
// UPSERT: resubmitting under the same Guest 1 name overwrites that party's
// row instead of appending — changed answers and added/removed guests update
// in place, colors included (a flipped answer repaints its cell, removed
// guests' cells are cleared). (Name typo fixes orphan the old row; merge
// those by hand.)
//
// NOTE: renders timestamps in the spreadsheet's time zone --
// set File -> Settings -> Time zone to (GMT-08:00) Los Angeles.
//
// IMPORTANT: after ANY edit to this script, Deploy -> Manage deployments ->
// New version -- otherwise the live URL keeps serving the old code.

const SHEET_NAME = 'RSVPs';
const HEADERS = [
  'Submitted At',
  'Guest 1',
  'Guest 2',
  'Guest 3',
  'Guest 4',
  'Guest 5',
  'Guest 6',
 ];

const GREEN_BG = '#34a853';
const RED_BG = '#ea4335';
const WHITE_INK = '#ffffff';
const DEFAULT_INK = '#000000';

// Normalized identity key: same person resubmitting hits the same party.
function normalizeName(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

// Display name: trimmed + single spaces, original capitalization kept
// (unlike normalizeName, which lowercases for key matching only).
function fullName(g) {
  const first = String(g.firstName || '')
    .trim()
    .replace(/\s+/g, ' ');
  const last = String(g.lastName || '')
    .trim()
    .replace(/\s+/g, ' ');
  return (first + ' ' + last).trim();
}

// FUTURE (invite-list cross-check): look the party key up in a roster tab
// here and return { ok: false, error: 'not-invited' } when absent.
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // prevents lost rows if two guests submit at once
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }
    const data = JSON.parse(e.postData.contents);
    const guests = Array.isArray(data.guests) ? data.guests : [];
    if (guests.length === 0) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: 'no-guests' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    const listed = guests.slice(0, 6);
    const names = listed.map(fullName);
    while (names.length < 6) names.push('');
    // Real Date (not text) so the column still sorts chronologically.
    const submitted = data.submittedAt ? new Date(data.submittedAt) : new Date();
    const rowValues = [submitted, ...names];
    // Per-guest colors: green = attending, red = declined, blank = empty slot.
    const backgrounds = [null];
    const fontColors = [null];
    listed.forEach((g) => {
      const ok = g.attending === true;
      backgrounds.push(ok ? GREEN_BG : RED_BG);
      fontColors.push(WHITE_INK);
    });
    while (backgrounds.length < 7) {
      backgrounds.push(null);
      fontColors.push(DEFAULT_INK);
    }
    // Upsert on Guest 1 combined name: a resubmission (changed answers,
    // added or removed guests) overwrites the party's row in place.
    const key = normalizeName(names[0]);
    let row = -1;
    if (key !== '') {
      const values = sheet.getDataRange().getValues();
      for (let r = 1; r < values.length; r++) {
        // skip header (Guest 1 is now column B)
        if (normalizeName(values[r][1]) === key) {
          row = r + 1;
          break;
        }
      }
    }
    if (row > 0) {
      sheet.getRange(row, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
      row = sheet.getLastRow();
    }
    sheet.getRange(row, 1).setNumberFormat('mm/dd/yyyy - h:mm AM/PM');
    sheet.getRange(row, 1, 1, rowValues.length).setBackgrounds([backgrounds]);
    sheet.getRange(row, 1, 1, rowValues.length).setFontColors([fontColors]);
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, guests: guests.length })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
