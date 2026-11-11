// ============================================================================
//  src/pages/Home.jsx  —  the HOME page  (the "/" route)
// ============================================================================
//
//  WHAT'S HERE: a hero with your name + one-liner, the section portals, a
//  strip of "featured" projects and research, and a contact call-to-action.
//  Edit the marked spots to make it yours.
// ============================================================================

import { Link } from 'react-router';
import ProjectCard from '../components/ProjectCard';
import SectionPortals from '../components/SectionPortals';
import { usePageMeta } from '../hooks/usePageMeta';
import { projects } from '../content/projects';
import { research } from '../content/research';
import { CATEGORY_META, STATUS_META } from '../lib/projectMeta';
import { newestFirst } from '../lib/dates';

// Keep only the projects marked `featured: true`, newest first.
// (filter() returns a new array, so sorting it leaves the original untouched.)
const featured = projects.filter((project) => project.featured).sort(newestFirst);

// Same for research — a small strip keeps the "code + science" balance on show.
const featuredResearch = research.filter((entry) => entry.featured).sort(newestFirst);

function Home() {
  usePageMeta(
    'Pema Tsering — Developer & Researcher',
    'London-based developer and researcher working across software engineering, low-level graphics, and molecular biology.',
  );

  return (
    <>
      {/* ===================== HERO ===================== */}
      {/* EDIT HERE: your name and one-line positioning statement. */}
      <section className="py-8 sm:py-12">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-accent-500">
          London-based developer &amp; researcher
        </p>
        <h1 className="font-serif text-4xl font-bold leading-tight text-slate-900 sm:text-5xl dark:text-white">
          Pema Tsering
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          I build with <strong className="font-semibold text-slate-800 dark:text-slate-100">Python</strong>, <strong className="font-semibold text-slate-800 dark:text-slate-100">R</strong>, and
          low-level <strong className="font-semibold text-slate-800 dark:text-slate-100">graphics</strong>, with
          a research background in molecular biology. This site is where my
          coding projects and scientific work sit side by side.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-500"
          >
            View my work
          </Link>
          <Link
            to="/contact"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-accent-500 dark:border-slate-700 dark:text-slate-200"
          >
            Get in touch
          </Link>
        </div>
      </section>

      {/* ===================== SECTION PORTALS ===================== */}
      {/* Three cards that preview each section's background motif on hover and
          link to it. See src/components/SectionPortals.jsx. */}
      <SectionPortals />

      {/* ===================== FEATURED PROJECTS ===================== */}
      <section className="py-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">
            Featured work
          </h2>
          <Link to="/projects" className="text-sm font-medium text-accent-500 hover:underline">
            All projects &rarr;
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            No featured projects yet. Set <code>featured: true</code> in a
            project's <code>meta</code> to show it here.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                tags={project.tags}
                badge={{
                  label: CATEGORY_META[project.category].label,
                  tone: CATEGORY_META[project.category].tone,
                }}
                status={STATUS_META[project.status]}
              />
            ))}
          </div>
        )}
      </section>

      {/* ===================== SELECTED RESEARCH ===================== */}
      {featuredResearch.length > 0 && (
        <section className="py-8">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">
              Selected research
            </h2>
            <Link to="/research" className="text-sm font-medium text-accent-500 hover:underline">
              All research &rarr;
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featuredResearch.map((entry) => (
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
        </section>
      )}

      {/* ===================== CONTACT CTA ===================== */}
      <section className="my-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">
          Let's talk
        </h2>
        <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-400">
          Interested in my work or have an opportunity to share? I'd love to hear
          from you.
        </p>
        <Link
          to="/contact"
          className="mt-5 inline-block rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-500"
        >
          Contact me
        </Link>
      </section>
    </>
  );
}

export default Home;
