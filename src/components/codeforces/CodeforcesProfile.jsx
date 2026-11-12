// ============================================================================
//  CodeforcesProfile.jsx  —  my live Codeforces profile on the Problems page
// ============================================================================
//
//  WHAT IT SHOWS: my handle and a link to the profile (always), and — once
//  the data has arrived from the Codeforces API — my rating, a rating chart,
//  an activity calendar, a few headline numbers, and the problems I've solved.
//
//  It is LIVE: the visitor's browser asks Codeforces each time this page
//  opens (see src/hooks/useCodeforces.js), so new contests and solved
//  problems appear here on their own.
//
//  THE THREE STATES (conditional rendering):
//    loading — a short "Loading…" line
//    error   — a message pointing at the profile link instead
//    data    — everything
//
//  PROPS:
//    writeUps — a lookup of the problems that have a worked solution on this
//               site: { '339A': 'codeforces-helpful-maths', ... }. Solved
//               problems found in it get a link to that page.
//
//  EDIT HERE: change HANDLE below if your Codeforces handle ever changes.
// ============================================================================

import { useState } from 'react';
import { Link } from 'react-router';
import { useCodeforces } from '../../hooks/useCodeforces';
import {
  buildCalendar,
  countSolvedSince,
  dayKey,
  getSolvedProblems,
  longestStreak,
} from '../../lib/codeforces';
import { formatShortDate } from '../../lib/dates';
import RatingChart from './RatingChart';
import ActivityHeatmap from './ActivityHeatmap';

const HANDLE = 'Vasta';
const PROFILE_URL = `https://codeforces.com/profile/${HANDLE}`;

// How many solved problems to list before the "Show all" button.
const INITIAL_PROBLEM_COUNT = 8;

// "newbie" -> "Newbie", "candidate master" -> "Candidate master"
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// One headline number with its caption.
function StatTile({ value, label }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  );
}

function CodeforcesProfile({ writeUps }) {
  const { data, loading, error } = useCodeforces(HANDLE);
  const [showAll, setShowAll] = useState(false);

  // ---- work out the numbers (only once the data is here) ---------------------
  let solved = [];
  let stats = [];
  let weeks = [];
  if (data) {
    const now = data.loadedAt;
    solved = getSolvedProblems(data.submissions);
    weeks = buildCalendar(solved, now);

    const days = (count) => (count === 1 ? '1 day' : `${count} days`);
    stats = [
      { value: solved.length, label: 'problems solved, all time' },
      { value: countSolvedSince(solved, now, 365), label: 'solved in the last year' },
      { value: countSolvedSince(solved, now, 30), label: 'solved in the last 30 days' },
      { value: days(longestStreak(solved, now)), label: 'longest streak, all time' },
      { value: days(longestStreak(solved, now, 365)), label: 'longest streak, last year' },
      { value: days(longestStreak(solved, now, 30)), label: 'longest streak, last 30 days' },
    ];
  }

  const visibleProblems = showAll ? solved : solved.slice(0, INITIAL_PROBLEM_COUNT);

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      {/* ---------- always shown: who + link ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Codeforces</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Handle <span className="font-medium text-slate-700 dark:text-slate-200">{HANDLE}</span>
            {data && data.user.rating !== undefined && (
              <>
                {' '}· {capitalize(data.user.rank)} · current rating{' '}
                <span className="font-medium text-slate-700 dark:text-slate-200">{data.user.rating}</span>
                {' '}(highest {data.user.maxRating})
              </>
            )}
          </p>
        </div>
        <a
          href={PROFILE_URL}
          className="shrink-0 rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Codeforces profile &rarr;
        </a>
      </div>

      {/* ---------- loading / error ---------- */}
      <p role="status" aria-atomic="true" className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        {loading
          ? 'Loading live data from Codeforces…'
          : error
            ? 'Live stats could not be loaded. Visit the Codeforces profile for the latest data.'
            : data ? `Codeforces profile loaded: ${solved.length} problems solved.` : ''}
      </p>

      {/* ---------- the live sections ---------- */}
      {data && (
        <>
          {data.ratingChanges.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-link">
                Rating after each contest
              </h4>
              <div className="mt-3">
                <RatingChart ratingChanges={data.ratingChanges} />
              </div>
            </div>
          )}

          <div className="mt-8">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-link">
              Problems solved per day, last 12 months
            </h4>
            <div className="mt-3">
              <ActivityHeatmap weeks={weeks} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <StatTile key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>

          {solved.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-link">
                Solved problems, newest first
              </h4>
              <ul id="codeforces-solved-problems" className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
                {visibleProblems.map((problem) => (
                  <li key={problem.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm">
                    <a
                      href={problem.url}
                      className="font-medium text-slate-800 transition hover:text-link dark:text-slate-100"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="tabular-nums text-slate-600 dark:text-slate-400">{problem.id}</span>{' '}
                      {problem.name}
                    </a>
                    {problem.rating && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Rating {problem.rating}
                      </span>
                    )}
                    {problem.inContest && (
                      <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">
                        In contest
                      </span>
                    )}
                    {writeUps[problem.id] && (
                      <Link
                        to={`/problems/${writeUps[problem.id]}`}
                        className="text-xs font-semibold text-link hover:underline"
                      >
                        Worked solution &rarr;
                      </Link>
                    )}
                    <time
                      dateTime={dayKey(problem.solvedAt)}
                      className="ml-auto text-xs text-slate-600 dark:text-slate-400"
                    >
                      {formatShortDate(dayKey(problem.solvedAt))}
                    </time>
                  </li>
                ))}
              </ul>

              {solved.length > INITIAL_PROBLEM_COUNT && (
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  aria-expanded={showAll}
                  aria-controls="codeforces-solved-problems"
                  className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-link dark:border-slate-700 dark:text-slate-200"
                >
                  {showAll ? 'Show fewer' : `Show all ${solved.length}`}
                </button>
              )}
            </div>
          )}

          <p className="mt-6 text-xs text-slate-600 dark:text-slate-400">
            Loaded live from the Codeforces API when this page opened. Days are counted in UTC.
          </p>
        </>
      )}
    </div>
  );
}

export default CodeforcesProfile;
