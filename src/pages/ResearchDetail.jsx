// ============================================================================
//  src/pages/ResearchDetail.jsx  —  ONE research entry's page
// ============================================================================
//
//  Same pattern as ProjectDetail.jsx: the route is "research/:slug", and this
//  one component shows whichever entry matches the id in the URL. Edit the
//  entry's file in src/content/research/ to change it; you don't edit this
//  template.
// ============================================================================

import { Link, useParams } from 'react-router';
import NotFound from './NotFound';
import { usePageMeta } from '../hooks/usePageMeta';
import { research } from '../content/research';
import { TONES } from '../lib/projectMeta';
import { formatMonthYear } from '../lib/dates';
import ResearchDocuments from '../components/ResearchDocuments';

function ResearchDetail() {
  const { slug } = useParams();
  const entry = research.find((item) => item.id === slug);

  usePageMeta(
    entry ? `${entry.title} — Pema Tsering` : 'Page not found — Pema Tsering',
    entry ? entry.description : 'That page could not be found.',
  );

  if (!entry) {
    return <NotFound />;
  }

  const Content = entry.Content;

  return (
    <>
      <Link to="/research" className="text-sm font-medium text-link hover:underline">
        &larr; All research
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES.teal}`}>
            {entry.researchType || 'Research'}
          </span>
          <time className="text-sm text-slate-600 dark:text-slate-400">{formatMonthYear(entry.date)}</time>
        </div>

        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 dark:text-white">
          {entry.title}
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
          {entry.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <li key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-3">
          {entry.demoUrl && (
            <a
              href={entry.demoUrl}
              className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              View &rarr;
            </a>
          )}
          {entry.githubUrl && (
            <a
              href={entry.githubUrl}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-link dark:border-slate-700 dark:text-slate-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              View code
            </a>
          )}
        </div>
      </header>

      <article className="prose-content mt-8 text-slate-700 dark:text-slate-300">
        <Content />
      </article>

      <ResearchDocuments documents={entry.documents} />
    </>
  );
}

export default ResearchDetail;
