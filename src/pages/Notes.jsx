// ============================================================================
//  src/pages/Notes.jsx  —  the NOTES / blog list  ("/notes" route)
// ============================================================================
//
//  WHAT'S HERE: lists every entry in src/content/notes/, newest first. Add a
//  note by adding a new file in that folder (and listing it in its index.js) —
//  no need to touch this file.
// ============================================================================

import { Link } from 'react-router';
import { usePageMeta } from '../hooks/usePageMeta';
import { notes } from '../content/notes';
import { formatLongDate, newestFirst } from '../lib/dates';

// Newest first. ([...notes] copies the array, because sort() changes the
// array it is called on.)
const sortedNotes = [...notes].sort(newestFirst);

function Notes() {
  usePageMeta(
    'Notes — [[YOUR_NAME]]',
    'Short write-ups and notes on software, graphics, and research.',
  );

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Notes</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Short write-ups on things I'm learning and building.
      </p>

      <ul className="mt-8 space-y-4">
        {sortedNotes.map((note) => (
          <li key={note.id} className="rounded-xl border border-slate-200 p-5 transition hover:border-accent-400 dark:border-slate-800 dark:hover:border-accent-500">
            <Link to={`/notes/${note.id}`} className="block">
              <time className="text-sm text-slate-500 dark:text-slate-400" dateTime={note.date}>
                {formatLongDate(note.date)}
              </time>
              <h2 className="mt-1 font-serif text-xl font-semibold text-slate-900 dark:text-white">
                {note.title}
              </h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{note.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Notes;
