// ============================================================================
//  src/pages/Research.jsx  —  the RESEARCH list  ("/research" route)
// ============================================================================
//
//  WHAT'S HERE: every entry in src/content/research/. Add a research write-up
//  by adding a new file in that folder (and listing it in its index.js) — you
//  don't edit this page.
// ============================================================================

import ProjectCard from '../components/ProjectCard';
import { usePageMeta } from '../hooks/usePageMeta';
import { research } from '../content/research';
import { newestFirst } from '../lib/dates';

// Newest first. ([...research] copies the array, because sort() changes the
// array it is called on.)
const sortedResearch = [...research].sort(newestFirst);

function Research() {
  usePageMeta(
    'Research — [[YOUR_NAME]]',
    'Scientific and research work in molecular biology, presented as short write-ups.',
  );

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Research</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Scientific work from my molecular-biology background, written up as short
        case studies.
      </p>

      {sortedResearch.length === 0 ? (
        <p className="mt-8 text-slate-500 dark:text-slate-400">No research entries yet.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sortedResearch.map((entry) => (
            <ProjectCard
              key={entry.id}
              id={entry.id}
              title={entry.title}
              description={entry.description}
              tags={entry.tags}
              basePath="/research"
              badge={{ label: 'Research', tone: 'teal' }}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Research;
