// Wedding RSVP -> Google Sheet writer.
//
// SETUP (one time, in your Google account):
//   1. Open your spreadsheet -> Extensions -> Apps Script.
//   2. Paste this file's contents, save, name the project (e.g. "Wedding RSVP").
//   3. Deploy -> New deployment -> gear icon -> Web app.
//   4. Execute as: Me. Who has access: Anyone. Deploy.
//   5. Copy the /exec URL into VITE_GOOGLE_SHEETS_URL in the app's .env.
//
// The sheet tab below must exist (or it will be created) with headers:
//   Submitted At | Attending? | Guest First Name | Guest Last Name | Plus 1 First Name | Plus 1 Last Name
//
// IMPORTANT: after ANY edit to this script, Deploy -> Manage deployments ->
// New version -- otherwise the live URL keeps serving the old code.

const SHEET_NAME = 'RSVPs';
const HEADERS = [
  'Submitted At',
  'Attending?',
  'Guest First Name',
  'Guest Last Name',
  'Plus 1 First Name',
  'Plus 1 Last Name',
];

// Normalized identity key: same person resubmitting hits the same row.
function normalizeName(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

// FUTURE (invite-list cross-check): look the key up in a roster tab here
// and return { ok: false, error: 'not-invited' } when absent.
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
    const g1 = guests[0] || {};
    const g2 = guests[1] || {};
    // Real Date (not text) so the column still sorts chronologically.
    // Displayed via number format below, e.g. 09/16/2026 - 11:46 PM.
    // NOTE: renders in the spreadsheet's time zone --
    // set File -> Settings -> Time zone to (GMT-08:00) Los Angeles.
    const submitted = data.submittedAt ? new Date(data.submittedAt) : new Date();
    const rowValues = [
      submitted,
      data.attending === true ? 'Yes' : 'No',
      g1.firstName || '',
      g1.lastName || '',
      g2.firstName || '',
      g2.lastName || '',
    ];
    // Upsert on guest-1 name: a resubmission (changed attending, added or
    // removed plus-one) overwrites the existing row instead of appending.
    const key =
      normalizeName(g1.firstName) + '|' + normalizeName(g1.lastName);
    let row = -1;
    if (key !== '|') {
      const values = sheet.getDataRange().getValues();
      for (let r = 1; r < values.length; r++) {
        // skip header
        const rowKey =
          normalizeName(values[r][2]) + '|' + normalizeName(values[r][3]);
        if (rowKey === key) {
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
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
