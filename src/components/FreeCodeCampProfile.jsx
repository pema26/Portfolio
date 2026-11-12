import { formatShortDate } from '../lib/dates';

const USERNAME = 'pematsering';
const PROFILE_URL = `https://www.freecodecamp.org/${USERNAME}`;
const ARCHIVE_URL = 'https://www.freecodecamp.org/learn/daily-coding-challenge/archive';

// EDIT HERE: update both values when the daily challenge total changes.
// This owner-provided count covers daily challenges, not curriculum exercises.
// freeCodeCamp does not include daily completions in its public profile API.
const DAILY_PROGRESS = { solved: 300, updatedAt: '2026-9-30' };

function FreeCodeCampProfile() {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">freeCodeCamp</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Handle <span className="font-medium text-slate-700 dark:text-slate-200">{USERNAME}</span>
          </p>
        </div>
        <a
          href={PROFILE_URL}
          className="shrink-0 rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          View freeCodeCamp profile &rarr;
        </a>
      </div>

      <div className="mt-6 max-w-xs rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <p className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
          {DAILY_PROGRESS.solved}
        </p>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">daily coding challenges solved</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <a
          href={ARCHIVE_URL}
          className="text-sm font-medium text-link hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Daily challenge archive &rarr;
        </a>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Updated <time dateTime={DAILY_PROGRESS.updatedAt}>{formatShortDate(DAILY_PROGRESS.updatedAt)}</time>
        </p>
      </div>
    </div>
  );
}

export default FreeCodeCampProfile;
