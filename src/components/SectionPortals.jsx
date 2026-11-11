// ============================================================================
//  SectionPortals.jsx  —  Home-page hover-preview navigation cards
// ============================================================================
//
//  WHAT IT IS: three cards (Projects / Problems / Research) for the Home page.
//  Each card is a real link to its section AND shows a small animated preview
//  of that section's background motif WHILE HOVERED (or focused by keyboard):
//     Projects -> mini rotating wireframe cube
//     Problems -> mini graph traversal (edges grow node-to-node)
//     Research -> mini horizontal DNA double helix
//  Not hovered: a faint single still frame. Click: normal navigation.
//
//  HOW IT WORKS IN REACT: there are two components in this file.
//    - PortalCard is ONE card. It uses a ref to reach its <canvas>, starts the
//      drawing code (src/lib/portalCanvas.js) in a useEffect, and plays/stops
//      the preview from React event handlers (onMouseEnter, onFocus, …).
//    - SectionPortals (the default export) renders one PortalCard per entry of
//      the `portals` array, passing each entry's fields in as props.
//
//  Styling uses the site's existing Tailwind classes and the accent-*/slate-*
//  tokens, so it matches the ProjectCard look (rounded-xl, hairline border,
//  hover lift + accent border).
// ============================================================================

import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { startPortal } from '../lib/portalCanvas';

const portals = [
  { href: '/projects', motif: 'cubes', kicker: 'Graphics & software', title: 'Projects', blurb: 'Flagship ideas, guided builds, and small tools.' },
  { href: '/problems', motif: 'graph', kicker: 'Algorithms', title: 'Problems', blurb: 'Competitive programming and worked solutions.' },
  { href: '/research', motif: 'helix', kicker: 'Molecular biology', title: 'Research', blurb: 'Lab work, written up as short case studies.' },
];

function PortalCard({ href, motif, kicker, title, blurb }) {
  const canvasRef = useRef(null); // the <canvas> we draw on
  const previewRef = useRef(null); // the { play, stop, cleanup } controls

  useEffect(() => {
    const preview = startPortal(canvasRef.current, motif);
    previewRef.current = preview;
    return preview.cleanup;
  }, [motif]);

  const handlePlay = () => {
    if (previewRef.current) previewRef.current.play();
  };
  const handleStop = () => {
    if (previewRef.current) previewRef.current.stop();
  };

  return (
    <Link
      to={href}
      onMouseEnter={handlePlay}
      onMouseLeave={handleStop}
      onFocus={handlePlay}
      onBlur={handleStop}
      className="group relative min-h-[158px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition hover:-translate-y-1 hover:border-accent-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-accent-500"
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-60" aria-hidden="true"></canvas>
      <span className="relative z-10 block text-xs font-semibold uppercase tracking-wider text-accent-500">{kicker}</span>
      <span className="relative z-10 mt-1.5 block font-serif text-2xl font-bold text-slate-900 dark:text-white">{title}</span>
      <span className="relative z-10 mt-1 block text-sm leading-snug text-slate-600 dark:text-slate-400">{blurb}</span>
      <span className="relative z-10 mt-3 inline-block text-sm font-semibold text-accent-500">Open &rarr;</span>
    </Link>
  );
}

function SectionPortals() {
  return (
    <section className="py-8" aria-label="Explore sections">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Explore &mdash; hover to preview
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {portals.map((portal) => (
          <PortalCard key={portal.href} {...portal} />
        ))}
      </div>
    </section>
  );
}

export default SectionPortals;
