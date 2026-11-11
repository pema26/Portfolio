// ============================================================================
//  src/pages/ProblemDetail.jsx  —  ONE solved problem's page
// ============================================================================
//
//  Same pattern as ProjectDetail.jsx: the route is "problems/:slug", and this
//  one component shows whichever challenge matches the id in the URL. Edit the
//  challenge's file in src/content/challenges/ to change it; you don't edit
//  this template.
// ============================================================================

import { Link, useParams } from 'react-router';
import NotFound from './NotFound';
import { usePageMeta } from '../hooks/usePageMeta';
import { challenges } from '../content/challenges';
import { formatMonthYear } from '../lib/dates';

function ProblemDetail() {
  const { slug } = useParams();
  const challenge = challenges.find((item) => item.id === slug);

  usePageMeta(
    challenge ? `${challenge.title} — [[YOUR_NAME]]` : 'Page not found — [[YOUR_NAME]]',
    challenge ? challenge.description : 'That page could not be found.',
  );

  if (!challenge) {
    return <NotFound />;
  }

  const Content = challenge.Content;

  return (
    <>
      <Link to="/problems" className="text-sm font-medium text-accent-500 hover:underline">
        &larr; All problems
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-900/50 dark:text-accent-300">
            {challenge.source}
          </span>
          {challenge.difficulty && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Rating {challenge.difficulty}
            </span>
          )}
          <time className="text-sm text-slate-500 dark:text-slate-400">{formatMonthYear(challenge.date)}</time>
        </div>

        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 dark:text-white">
          {challenge.title}
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
          {challenge.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {challenge.tags.map((tag) => (
            <li key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {tag}
            </li>
          ))}
        </ul>

        {challenge.problemUrl && (
          <div className="mt-5">
            <a
              href={challenge.problemUrl}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-accent-500 dark:border-slate-700 dark:text-slate-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Original problem &rarr;
            </a>
          </div>
        )}
      </header>

      <article className="prose-content mt-8 text-slate-700 dark:text-slate-300">
        <Content />
      </article>
    </>
  );
}

export default ProblemDetail;
