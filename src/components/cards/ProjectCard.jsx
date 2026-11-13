// ============================================================================
//  ProjectCard.jsx  —  one clickable card for a project or research entry
// ============================================================================
//
//  PURPOSE: shows a single entry's title, description, tags, and (optionally) a
//  coloured category badge, a status pill, a "Completed" pill, or a progress
//  bar. Used on the home page, the /projects page, and the /research page.
//
//  PROPS:
//    id          — the URL id of the entry (the last part of its address).
//    title, description, tags
//    basePath    — the section this card links into: "/projects" (default) or
//                  "/research".
//    badge       — optional category label, e.g. { label: 'Ambitious', tone: 'accent' }.
//    status      — optional status pill, e.g. { label: 'In progress', tone: 'amber' }.
//    completed   — when true, show a "Completed" pill (finished mini projects).
//    progress    — 0–100; when set, shows a progress bar (guided builds).
//
//  You normally don't edit this — it just displays what the page hands it.
// ============================================================================

import { Link } from 'react-router';
import ProgressBar from '../ui/ProgressBar';
import { TONES } from '../../lib/projectMeta';

function ProjectCard({
  id,
  title,
  description,
  tags,
  basePath = '/projects',
  badge,
  status,
  completed = false,
  progress,
  headingAs: Heading = 'h3',
}) {
  const hasPills = badge || status || completed;

  return (
    <article className="interactive-card group relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-accent-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-accent-500">
      {/* Top row of pills (only rendered if there's something to show). */}
      {hasPills && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {badge && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[badge.tone]}`}>
              {badge.label}
            </span>
          )}
          {status && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[status.tone]}`}>
              {status.label}
            </span>
          )}
          {completed && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES.emerald}`}>
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
              </svg>
              Completed
            </span>
          )}
        </div>
      )}

      <Heading className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
        <Link to={`${basePath}/${id}`} className="after:absolute after:inset-0">
          <span className="relative">{title}</span>
        </Link>
      </Heading>

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

      {/* Guided builds show how far along they are. */}
      {typeof progress === 'number' && (
        <div className="mt-4">
          <ProgressBar value={progress} />
        </div>
      )}
    </article>
  );
}

export default ProjectCard;
