// ============================================================================
//  SectionPortals.jsx: Home-page navigation cards
// ============================================================================
//
//  WHAT IT IS: three cards (Projects / Problems / Research) for the Home page.
//  Each card is a link to its section.
//
//  HOW IT WORKS IN REACT: the `portals` array below holds the words for each
//  card. SectionPortals loops over it with map() and renders one <Link> per
//  entry. To change a card's text, edit the array.
//
//  Styling uses the site's existing Tailwind classes and the accent-*/slate-*
//  tokens, so it matches the ProjectCard look (rounded-xl, hairline border,
//  hover lift + accent border).
// ============================================================================

import { Link } from 'react-router';

const portals = [
  { href: '/projects', kicker: 'Software', title: 'Projects', blurb: 'Ambitious projects, guided builds, and small tools.' },
  { href: '/problems', kicker: 'Algorithms', title: 'Problems', blurb: 'Competitive programming and worked solutions.' },
  { href: '/research', kicker: 'Molecular biology', title: 'Research', blurb: 'Lab work, written up as short case studies.' },
];

function SectionPortals() {
  return (
    <section className="py-8" aria-label="Explore sections">
      <h2 className="mb-6 text-center font-serif text-2xl font-semibold text-slate-900 dark:text-white">
        Explore
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {portals.map((portal) => (
          <Link
            key={portal.href}
            to={portal.href}
            className="min-h-[158px] rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-accent-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-accent-500"
          >
            <span className="block text-xs font-semibold uppercase tracking-wider text-link">{portal.kicker}</span>
            <span className="mt-1.5 block font-serif text-2xl font-bold text-slate-900 dark:text-white">{portal.title}</span>
            <span className="mt-1 block text-sm leading-snug text-slate-600 dark:text-slate-400">{portal.blurb}</span>
            <span className="mt-3 inline-block text-sm font-semibold text-link">Open &rarr;</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SectionPortals;
