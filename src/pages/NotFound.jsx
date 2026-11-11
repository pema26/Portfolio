// ============================================================================
//  src/pages/NotFound.jsx  —  the custom "page not found" page
// ============================================================================
//
//  Shown when a visitor hits a URL that doesn't match any route in
//  src/App.jsx, or a project / note / problem id that doesn't exist.
// ============================================================================

import { Link } from 'react-router';
import { usePageMeta } from '../hooks/usePageMeta';

function NotFound() {
  usePageMeta('Page not found — Pema Tsering', 'That page could not be found.');

  return (
    <section className="py-16 text-center">
      <p className="font-serif text-6xl font-bold text-accent-500">404</p>
      <h1 className="mt-4 font-serif text-4xl font-semibold text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-400">
        Sorry, the page you were looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-500"
      >
        Back home
      </Link>
    </section>
  );
}

export default NotFound;
