// ============================================================================
//  src/pages/NoteDetail.jsx  —  ONE note's page
// ============================================================================
//
//  Same pattern as ProjectDetail.jsx: the route is "notes/:slug", and this one
//  component shows whichever note matches the id in the URL. Edit the note's
//  file in src/content/notes/ to change it; you don't edit this template.
// ============================================================================

import { Link, useParams } from 'react-router';
import NotFound from './NotFound';
import { usePageMeta } from '../hooks/usePageMeta';
import { notes } from '../content/notes';
import { formatLongDate } from '../lib/dates';

function NoteDetail() {
  const { slug } = useParams();
  const note = notes.find((item) => item.id === slug);

  usePageMeta(
    note ? `${note.title} — [[YOUR_NAME]]` : 'Page not found — [[YOUR_NAME]]',
    note ? note.description : 'That page could not be found.',
  );

  if (!note) {
    return <NotFound />;
  }

  const Content = note.Content;

  return (
    <>
      <Link to="/notes" className="text-sm font-medium text-accent-500 hover:underline">
        &larr; All notes
      </Link>

      <header className="mt-4">
        <time className="text-sm text-slate-500 dark:text-slate-400" dateTime={note.date}>
          {formatLongDate(note.date)}
        </time>
        <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900 dark:text-white">
          {note.title}
        </h1>
      </header>

      <article className="prose-content mt-8 text-slate-700 dark:text-slate-300">
        <Content />
      </article>
    </>
  );
}

export default NoteDetail;
