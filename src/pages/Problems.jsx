// ============================================================================
//  src/pages/Problems.jsx  —  the PROBLEMS SOLVED page  ("/problems")
// ============================================================================
//
//  WHAT'S HERE: three parts —
//    1. A "Competitive profiles" card linking out to my Codeforces account so
//       visitors can see my live rating and history.
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
import ChallengeCard from '../components/ChallengeCard';
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

function Problems() {
  usePageMeta(
    'Problems solved — [[YOUR_NAME]]',
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
        {/* EDIT HERE: set [[CODEFORCES_URL]] (and the handle/rating) to your
            real account. */}
        <div className="mt-4 max-w-2xl rounded-xl border border-slate-200 p-5 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Codeforces</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Handle <span className="font-medium">[[CODEFORCES_HANDLE]]</span> ·
                current rating <span className="font-medium">[[CODEFORCES_RATING]]</span>
              </p>
            </div>
            <a
              href="[[CODEFORCES_URL]]"
              className="shrink-0 rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              View profile &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ===================== WORKED SOLUTIONS ===================== */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">
          Worked solutions
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Each one shows the problem, my solution, an AI's solution in Python and
          C++, and a short note on time and space complexity.
        </p>

        {challenges.length === 0 ? (
          <p className="mt-6 text-slate-500 dark:text-slate-400">No solutions yet.</p>
        ) : (
          <>
            {/* ---------- Search box ---------- */}
            <div className="mt-6 max-w-md">
              <label htmlFor="problem-search" className="sr-only">
                Search problems
              </label>
              <input
                id="problem-search"
                type="search"
                value={query}
                onChange={handleQueryChange}
                placeholder="Search problems by name, tag, or source…"
                autoComplete="off"
                className="w-full rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            {/* ---------- Grouped, numbered problems ---------- */}
            {visibleGroups.map((group) => (
              <div key={group.source} className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-500">
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
              <p className="mt-8 text-slate-500 dark:text-slate-400">
                No problems match your search.
              </p>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default Problems;
