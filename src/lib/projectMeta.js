// ============================================================================
//  src/lib/projectMeta.js  —  shared labels for project categories & statuses
// ============================================================================
//
//  WHY THIS EXISTS: several pages (home, /projects, and each project page) need
//  to turn a category like "big-unique" into a friendly label like "Flagship"
//  with a matching colour. Keeping those definitions in ONE place means they
//  always agree. Edit a label or colour here and it changes everywhere.
//
//  "tone" is a colour name looked up in TONES below (accent / teal / amber /
//  emerald / slate).
// ============================================================================

// A "tone" is just a named colour scheme for a pill/badge. Listing the full
// class strings here (rather than building them on the fly) is what lets
// Tailwind see and keep them. Add a new tone by adding a line below.
export const TONES = {
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

// The three project tiers. `order` controls the section order on /projects;
// `title` and `blurb` are the heading and one-liner shown above each section.
export const CATEGORY_META = {
  'big-unique': {
    label: 'Flagship',
    tone: 'accent',
    order: 0,
    title: 'Flagship projects',
    blurb: 'Original, ambitious ideas I came up with myself and am building out.',
  },
  guided: {
    label: 'Guided',
    tone: 'teal',
    order: 1,
    title: 'Guided builds',
    blurb: 'Projects built by following a tutorial or course, to learn a topic deeply.',
  },
  'mini-unique': {
    label: 'Mini',
    tone: 'amber',
    order: 2,
    title: 'Mini projects',
    blurb: 'Small tools I wrote to solve a real, everyday annoyance of my own.',
  },
};

// Status pills. "complete" is null because a finished project needs no pill.
export const STATUS_META = {
  planned: { label: 'Planned', tone: 'slate' },
  'in-progress': { label: 'In progress', tone: 'amber' },
  complete: null,
};
