// ============================================================================
//  src/pages/Projects.jsx  —  the PROJECTS list  ("/projects" route)
// ============================================================================
//
//  WHAT'S HERE: every entry in src/content/projects/, grouped into three
//  labelled sections — Flagship, Guided builds, and Mini projects — based on
//  each project's `category`. You never edit this page to add a project: add a
//  new file in src/content/projects/ with the right category (and list it in
//  that folder's index.js) and it appears under the matching heading.
// ============================================================================

import ProjectCard from '../components/ProjectCard';
import { usePageMeta } from '../hooks/usePageMeta';
import { projects } from '../content/projects';
import { CATEGORY_META, STATUS_META } from '../lib/projectMeta';
import { newestFirst } from '../lib/dates';

// Finished work is listed first, then work in progress, then plans.
const STATUS_ORDER = { complete: 0, 'in-progress': 1, planned: 2 };

// Every project: grouped by status as above, and newest first within each
// status. ([...projects] copies the array first, because sort() changes the
// array it is called on.)
const sortedProjects = [...projects].sort((a, b) => {
  if (a.status !== b.status) {
    return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  }
  return newestFirst(a, b);
});

// Build the sections in the order defined in projectMeta.js, each holding the
// projects whose category matches.
const sections = Object.keys(CATEGORY_META)
  .map((category) => ({
    category,
    meta: CATEGORY_META[category],
    items: sortedProjects.filter((project) => project.category === category),
  }))
  .sort((a, b) => a.meta.order - b.meta.order);

// Each tier shows something different in the card's corner:
//   guided builds  -> a progress bar
//   mini projects  -> a "Completed" pill once finished, otherwise a status pill
//   flagship       -> a status pill (Planned / In progress)
function extraCardProps(category, project) {
  if (category === 'guided') {
    return { progress: project.progress };
  }
  if (category === 'mini-unique') {
    if (project.status === 'complete') {
      return { completed: true };
    }
    return { status: STATUS_META[project.status] };
  }
  return { status: STATUS_META[project.status] };
}

function Projects() {
  usePageMeta(
    'Projects — Pema Tsering',
    'Software projects in three tiers: flagship original ideas, guided tutorial builds, and small tools that solve real problems.',
  );

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        My build work, grouped by kind — from original, ambitious ideas to small
        tools that scratch a real itch.
      </p>

      {sections.map((section) => (
        <section key={section.category} className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">
            {section.meta.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{section.meta.blurb}</p>

          {section.items.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Nothing here yet — watch this space.
            </p>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {section.items.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  {...extraCardProps(section.category, project)}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </>
  );
}

export default Projects;
