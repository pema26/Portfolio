// ============================================================================
//  src/pages/ProjectDetail.jsx  —  ONE project's case-study page
// ============================================================================
//
//  WHAT'S HERE: this single component shows the page for EVERY project. The
//  route in src/App.jsx is "projects/:slug", so for /projects/wordle-assistant
//  the useParams hook gives us  slug === "wordle-assistant". We look that id up in the
//  projects list and show the matching entry.
//
//  You almost never edit this file — it's the template all projects share.
//  To change a project's words, edit its file in src/content/projects/.
// ============================================================================

import { Link, useParams } from 'react-router';
import ProgressBar from '../components/ProgressBar';
import NotFound from './NotFound';
import { usePageMeta } from '../hooks/usePageMeta';
import { projects } from '../content/projects';
import { CATEGORY_META, STATUS_META, TONES } from '../lib/projectMeta';
import { formatMonthYear, formatShortDate, newestFirst } from '../lib/dates';

function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((item) => item.id === slug);

  usePageMeta(
    project ? `${project.title} — Pema Tsering` : 'Page not found — Pema Tsering',
    project ? project.description : 'That page could not be found.',
  );

  // No project with that id? Show the "not found" page instead.
  if (!project) {
    return <NotFound />;
  }

  // `Content` is the component that renders this project's write-up.
  const Content = project.Content;

  const category = CATEGORY_META[project.category];
  const status = STATUS_META[project.status];

  // Guided builds get a progress bar + a dated devlog; finished flagship and
  // mini projects get a "Completed" pill.
  const isGuided = project.category === 'guided';
  const isComplete = !isGuided && project.status === 'complete';
  const progress = project.progress;

  // Devlog newest-first for display (copied first, so the original is untouched).
  const devlog = [...project.devlog].sort(newestFirst);

  return (
    <>
      {/* Back link */}
      <Link to="/projects" className="text-sm font-medium text-accent-500 hover:underline">
        &larr; All projects
      </Link>

      {/* ===================== HEADER ===================== */}
      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[category.tone]}`}>
            {category.label}
          </span>
          {status && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[status.tone]}`}>
              {status.label}
            </span>
          )}
          {isComplete && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES.emerald}`}>
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
              </svg>
              Completed
            </span>
          )}
          <time className="text-sm text-slate-500 dark:text-slate-400">{formatMonthYear(project.date)}</time>
        </div>

        {/* Guided builds show a progress bar under the header meta. */}
        {isGuided && typeof progress === 'number' && (
          <div className="mt-4 max-w-sm">
            <ProgressBar value={progress} large />
          </div>
        )}

        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 dark:text-white">
          {project.title}
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
          {project.description}
        </p>

        {/* Tags */}
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {tag}
            </li>
          ))}
        </ul>

        {/* Optional external links (only shown if set in the project's meta). */}
        <div className="mt-5 flex flex-wrap gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo &rarr;
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-accent-500 dark:border-slate-700 dark:text-slate-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              View code
            </a>
          )}
        </div>
      </header>

      {/* ===================== CASE-STUDY BODY ===================== */}
      {/* This renders the write-up component from the project's content file. */}
      <article className="prose-content mt-8 text-slate-700 dark:text-slate-300">
        <Content />
      </article>

      {/* ===================== DEVLOG (guided builds only) ===================== */}
      {/* A day-by-day log of what got done. Add entries to the `devlog` array
          in the project's meta — each is a { date, summary } object. */}
      {isGuided && (
        <section className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">Devlog</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            What I worked on, day by day.
          </p>

          {devlog.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              No entries yet — I'll add them as I work through this build.
            </p>
          ) : (
            <ol className="mt-6 space-y-5">
              {devlog.map((entry, i) => (
                <li key={entry.date} className="relative border-l-2 border-slate-200 pl-5 dark:border-slate-800">
                  <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-accent-500" aria-hidden="true" />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Day {devlog.length - i}
                    </span>
                    <time className="text-xs text-slate-500 dark:text-slate-400">{formatShortDate(entry.date)}</time>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {entry.summary}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </>
  );
}

export default ProjectDetail;
