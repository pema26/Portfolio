// ============================================================================
//  src/lib/dates.js  —  small helpers for showing and sorting dates
// ============================================================================
//
//  Content entries store their date as a "YYYY-MM-DD" string (for example
//  "2026-02-15"). `new Date("2026-02-15")` reads that as midnight UTC, so every
//  label below is also formatted in UTC. That way the date on screen is the
//  date you typed, whatever timezone the visitor is in.
// ============================================================================

// "15 February 2026"
export function formatLongDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// "15 Feb 2026"
export function formatShortDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// "February 2026"
export function formatMonthYear(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

// Comparison functions for Array.sort(). Each takes two objects that have a
// `date` field and says which should come first.
export function newestFirst(a, b) {
  return new Date(b.date) - new Date(a.date);
}

export function oldestFirst(a, b) {
  return new Date(a.date) - new Date(b.date);
}
