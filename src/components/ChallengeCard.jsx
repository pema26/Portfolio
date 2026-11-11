// ============================================================================
//  ChallengeCard.jsx  —  one clickable card for a solved coding problem
// ============================================================================
//
//  PURPOSE: shows a single challenge's problem number, source (Codeforces /
//  freeCodeCamp / …), date, optional difficulty, title, description and tags,
//  linking to its full page where the problem and the solutions live. Used on
//  the /problems page.
//
//  PROPS:
//    id          — the URL id of the challenge.
//    title, description, source, tags
//    label       — a sequence label within its source, e.g. "Problem 1".
//    date        — the date the problem was solved, as "YYYY-MM-DD".
//    difficulty  — optional rating label, e.g. a Codeforces "800".
// ============================================================================

import { Link } from 'react-router';
import { formatShortDate } from '../lib/dates';

function ChallengeCard({ id, title, description, source, label, date, difficulty, tags }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-accent-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-accent-500">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">
          {source}
        </span>
        {difficulty && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Rating {difficulty}
          </span>
        )}
      </div>

      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">{label}</span>
        <span aria-hidden="true">&middot;</span>
        {/* A friendly date for people, plus a machine-readable one for <time>. */}
        <time dateTime={date}>{formatShortDate(date)}</time>
      </div>

      <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
        <Link to={`/problems/${id}`} className="after:absolute after:inset-0">
          <span className="relative">{title}</span>
        </Link>
      </h3>

      <p className="mt-2 flex-grow text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default ChallengeCard;
