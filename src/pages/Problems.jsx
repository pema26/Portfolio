// ============================================================================
//  src/pages/Problems.jsx  —  the PROBLEMS SOLVED page  ("/problems")
// ============================================================================
//
//  WHAT'S HERE: three parts —
//    1. My live Codeforces profile: rating, a rating chart, an activity
//       calendar and the problems I've solved, fetched from the Codeforces API
//       each time the page opens, plus my freeCodeCamp daily challenge total.
//    2. A search box that filters the worked solutions live (handy as the list
//       grows).
//    3. A showcase of individual solved problems from src/content/challenges/,
//       grouped by source (Codeforces, freeCodeCamp, …) and numbered
//       "Problem 1, 2, 3…" within each source.
//
//  HOW THE SEARCH WORKS IN REACT: the text in the search box is kept in state
//  (a "controlled input"). Every time you type, the state updates, React
//  re-renders this component, and the list below is filtered again from that
//  state. Nothing is hidden by hand.
// ============================================================================

import { useState } from 'react';
import ChallengeCard from '../components/cards/ChallengeCard';
import CodeforcesProfile from '../features/codeforces/CodeforcesProfile';
import FreeCodeCampProfile from '../features/freecodecamp/FreeCodeCampProfile';
import { usePageMeta } from '../hooks/usePageMeta';
import { challenges } from '../content/challenges';
import { oldestFirst } from '../lib/dates';

// The distinct sources (e.g. "Codeforces", "freeCodeCamp"), alphabetically.
// A Set drops the duplicates; spreading it gives back a normal array.
const sources = [...new Set(challenges.map((challenge) => challenge.source))].sort();

// Build a display model: one group per source, its problems ordered oldest →
// newest and numbered "Problem 1, 2, 3…" so the numbering is stable as new
// problems are added.
const groups = sources.map((source) => ({
  source,
  items: challenges
    .filter((challenge) => challenge.source === source)
    .sort(oldestFirst)
    .map((challenge, i) => {
      const label = `Problem ${i + 1}`;
      // Everything the search box should match against, lowercased once here.
      const searchText = [label, source, challenge.title, challenge.description, ...challenge.tags]
        .join(' ')
        .toLowerCase();
      return { challenge, label, searchText };
    }),
}));

// Which Codeforces problems have a worked solution on this site. A challenge
// says so with a `codeforcesId` in its meta (e.g. '339A'). The result is a
// lookup object:  { '339A': 'codeforces-helpful-maths', ... }
const writeUps = {};
for (const challenge of challenges) {
  if (challenge.codeforcesId) {
    writeUps[challenge.codeforcesId] = challenge.id;
  }
}

function Problems() {
  usePageMeta(
    'Problems solved — Pema Tsering',
    'Competitive programming and coding challenges — my Codeforces profile, plus worked solutions with complexity analysis.',
  );

  // What is currently typed in the search box.
  const [query, setQuery] = useState('');

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  // Split the query into words; a problem matches when it contains EVERY word.
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  // Keep only the matching problems, then drop any source group left empty.
  const visibleGroups = groups
    .map((group) => ({
      source: group.source,
      items: group.items.filter((item) => terms.every((term) => item.searchText.includes(term))),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Problems solved</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Where I sharpen algorithms and data-structures skills — my competitive
        profile, and worked solutions comparing my approach with an AI's.
      </p>

      {/* ===================== COMPETITIVE PROFILES ===================== */}
      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">
          Competitive profiles
        </h2>
        {/* Live rating, chart, calendar and solved problems, straight from
            the Codeforces API. See src/components/codeforces/. */}
        <CodeforcesProfile writeUps={writeUps} />
        <FreeCodeCampProfile />
      </section>

      {/* ===================== WORKED SOLUTIONS ===================== */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">
          Worked solutions
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Each one shows the problem, my solution, an AI's solution in Python and
          C++, and a short note on time and space complexity.
        </p>

        {challenges.length === 0 ? (
          <p className="mt-6 text-slate-600 dark:text-slate-400">No solutions yet.</p>
        ) : (
          <>
            {/* ---------- Search box ---------- */}
            <div className="mt-6 max-w-md">
              <label htmlFor="problem-search" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Search problems
              </label>
              <input
                id="problem-search"
                type="search"
                value={query}
                onChange={handleQueryChange}
                placeholder="Search problems by name, tag, or source…"
                autoComplete="off"
                aria-describedby="problem-search-count"
                aria-controls="worked-solutions"
                className="w-full rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-600 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-400"
              />
              <p id="problem-search-count" role="status" aria-atomic="true" className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {visibleGroups.reduce((count, group) => count + group.items.length, 0)} worked solutions found.
              </p>
            </div>

            {/* ---------- Grouped, numbered problems ---------- */}
            <div id="worked-solutions">
            {visibleGroups.map((group) => (
              <div key={group.source} className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-link">
                  {group.source}
                </h3>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {group.items.map(({ challenge, label }) => (
                    <ChallengeCard
                      key={challenge.id}
                      id={challenge.id}
                      title={challenge.title}
                      description={challenge.description}
                      source={challenge.source}
                      label={label}
                      date={challenge.date}
                      difficulty={challenge.difficulty}
                      tags={challenge.tags}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Shown only when the search matches nothing at all. */}
            {visibleGroups.length === 0 && (
              <p className="mt-8 text-slate-600 dark:text-slate-400">
                No problems match your search.
              </p>
            )}
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default Problems;
