// ============================================================================
//  src/features/codeforces/codeforces.js: talking to Codeforces + turning its data into
//                            the numbers the Problems page shows
// ============================================================================
//
//  Codeforces has a free, public API (https://codeforces.com/apiHelp). It
//  needs no key and allows requests straight from a web page, so the visitor's
//  browser asks Codeforces directly every time the Problems page opens. That
//  is why the profile section is always up to date without rebuilding the site.
//
//  Everything below the fetch function is plain data work (no React, no
//  network): it takes the raw API answer and works out solved problems,
//  streaks and the activity calendar.
//
//  TIME: Codeforces gives times as "seconds since 1 January 1970" (Unix time).
//  All day boundaries here are in UTC, like the rest of the site's dates.
// ============================================================================

const API_URL = 'https://codeforces.com/api';
const SECONDS_PER_DAY = 24 * 60 * 60;

// Rating needed to reach each rank. Used for the "next rank" line on the chart.
export const RANKS = [
  { rating: 1200, name: 'Pupil' },
  { rating: 1400, name: 'Specialist' },
  { rating: 1600, name: 'Expert' },
  { rating: 1900, name: 'Candidate Master' },
  { rating: 2100, name: 'Master' },
  { rating: 2300, name: 'International Master' },
  { rating: 2400, name: 'Grandmaster' },
  { rating: 2600, name: 'International Grandmaster' },
  { rating: 3000, name: 'Legendary Grandmaster' },
];

// Ask the API one question and hand back the "result" part of its answer.
async function callApi(method) {
  const res = await fetch(`${API_URL}/${method}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const body = await res.json();
  if (body.status !== 'OK') {
    throw new Error(body.comment || 'Codeforces returned an error');
  }
  return body.result;
}

// Everything the profile section needs, in three requests made one after
// another (Codeforces asks API users not to send bursts of requests).
export async function fetchCodeforcesProfile(handle) {
  const users = await callApi(`user.info?handles=${handle}`);
  const ratingChanges = await callApi(`user.rating?handle=${handle}`);
  const submissions = await callApi(`user.status?handle=${handle}`);
  return { user: users[0], ratingChanges, submissions };
}

// "2026-11-07" for a Unix time, in UTC.
export function dayKey(seconds) {
  return new Date(seconds * 1000).toISOString().slice(0, 10);
}

// The address of a problem's page on Codeforces.
export function problemUrl(contestId, index) {
  const section = contestId >= 100000 ? 'gym' : 'contest';
  return `https://codeforces.com/${section}/${contestId}/problem/${index}`;
}

// One entry per problem with an accepted submission, newest first.
// A problem solved twice counts once, dated by its FIRST accepted submission.
export function getSolvedProblems(submissions) {
  const firstAccepted = {}; // "2284B" -> the earliest accepted submission

  for (const submission of submissions) {
    if (submission.verdict !== 'OK') {
      continue;
    }
    const problem = submission.problem;
    const id = `${problem.contestId}${problem.index}`;
    const earlier = firstAccepted[id];
    if (!earlier || submission.creationTimeSeconds < earlier.creationTimeSeconds) {
      firstAccepted[id] = submission;
    }
  }

  return Object.keys(firstAccepted)
    .map((id) => {
      const submission = firstAccepted[id];
      const problem = submission.problem;
      return {
        id,
        name: problem.name,
        rating: problem.rating, // undefined until Codeforces rates the problem
        solvedAt: submission.creationTimeSeconds,
        inContest: submission.author.participantType === 'CONTESTANT',
        url: problemUrl(problem.contestId, problem.index),
      };
    })
    .sort((a, b) => b.solvedAt - a.solvedAt);
}

// How many problems were solved in the last `days` days.
export function countSolvedSince(solved, nowSeconds, days) {
  const cutoff = nowSeconds - days * SECONDS_PER_DAY;
  return solved.filter((problem) => problem.solvedAt >= cutoff).length;
}

// The longest run of consecutive days with at least one solved problem,
// looking only at the last `days` days (leave `days` out for all time).
export function longestStreak(solved, nowSeconds, days) {
  const cutoff = days ? nowSeconds - days * SECONDS_PER_DAY : 0;

  // A Set keeps each day once, however many problems were solved on it.
  const dayNumbers = new Set();
  for (const problem of solved) {
    if (problem.solvedAt >= cutoff) {
      dayNumbers.add(Math.floor(problem.solvedAt / SECONDS_PER_DAY));
    }
  }

  let longest = 0;
  for (const day of dayNumbers) {
    // Only start counting from the FIRST day of a run.
    if (dayNumbers.has(day - 1)) {
      continue;
    }
    let length = 1;
    while (dayNumbers.has(day + length)) {
      length += 1;
    }
    longest = Math.max(longest, length);
  }
  return longest;
}

// The activity calendar: the last 53 weeks as columns, each a list of 7 days
// (Sunday at the top), ending with the current week.
// Each day is { date: "YYYY-MM-DD", count, isFuture }.
export function buildCalendar(solved, nowSeconds) {
  const counts = {}; // "YYYY-MM-DD" -> problems solved that day
  for (const problem of solved) {
    const key = dayKey(problem.solvedAt);
    counts[key] = (counts[key] || 0) + 1;
  }

  const today = Math.floor(nowSeconds / SECONDS_PER_DAY); // days since 1970
  // 1 January 1970 was a Thursday (weekday 4, counting Sunday as 0).
  const weekday = (today + 4) % 7;
  const firstDay = today - weekday - 52 * 7; // the Sunday 52 weeks back

  const weeks = [];
  for (let w = 0; w < 53; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const day = firstDay + w * 7 + d;
      const date = dayKey(day * SECONDS_PER_DAY);
      week.push({ date, count: counts[date] || 0, isFuture: day > today });
    }
    weeks.push(week);
  }
  return weeks;
}

// Which of the five colour steps a day gets: 0 (nothing) to 4 (a lot).
export function activityLevel(count) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

// The first rank the user has not reached yet (undefined at the very top).
export function nextRank(rating) {
  return RANKS.find((rank) => rank.rating > rating);
}
