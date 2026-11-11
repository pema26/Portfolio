// ============================================================================
//  src/pages/About.jsx  —  the ABOUT page  (the "/about" route)
// ============================================================================
//
//  WHAT'S HERE: a narrative bio tying together your coding journey and your
//  research background, a grouped skills list, and a CV download link.
//  Everything marked EDIT HERE is yours to rewrite.
// ============================================================================

import { usePageMeta } from '../hooks/usePageMeta';

// EDIT HERE: your skills, grouped by category. Add/remove freely.
const skillGroups = [
  { heading: 'Languages', items: ['Python', 'R', 'C++'] },
  { heading: 'Practice', items: ['Algorithms / Codeforces', 'Data science with R'] },
  { heading: 'Graphics', items: ['C++', 'Software rendering'] },
  { heading: 'Tools', items: ['Git', 'Command line'] },
];

function About() {
  usePageMeta(
    'About — [[YOUR_NAME]]',
    'The coding journey and research background of a London-based developer and molecular-biology researcher.',
  );

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">About</h1>

      {/* ===================== BIO ===================== */}
      {/* EDIT HERE: rewrite this narrative in your own voice. */}
      <div className="prose-content mt-6 text-slate-700 dark:text-slate-300">
        <p>
          I'm a London-based developer and researcher who enjoys working at the
          meeting point of software and science. My coding journey started with the
          fundamentals — working through <strong>freeCodeCamp</strong>, sharpening
          problem-solving on <strong>Codeforces</strong>, and learning to think with
          data through <em>R for Data Science</em>.
        </p>
        <p>
          That curiosity pulled me toward the low level, too: I've been building a
          software rasterizer from scratch (following
          the <em>tinyrenderer</em> tutorial) to really understand how a computer
          turns geometry into pixels — line drawing, wireframes, and triangle
          rasterization with no graphics library doing the work for me.
        </p>
        <p>
          Alongside the code is a research background in molecular biology, including
          site-directed mutagenesis of catechol 2,3-dioxygenase
          in <em>Pseudomonas aeruginosa</em> and a presentation on kinase inhibitors in
          targeted therapy. I like that both halves reward the same thing: careful,
          methodical work and a willingness to dig until something actually makes
          sense.
        </p>
      </div>

      {/* ===================== CV DOWNLOAD ===================== */}
      <div className="mt-8">
        {/* EDIT HERE: drop your real CV at public/cv.pdf and this just works.
            This is a plain <a> (not a <Link>) because it points at a file,
            not at a page of the app. */}
        <a
          href="/cv.pdf"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent-400 hover:text-accent-500 dark:border-slate-700 dark:text-slate-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0 4-4m-4 4-4-4m-3 9h14" />
          </svg>
          Download CV (PDF)
        </a>
      </div>

      {/* ===================== SKILLS ===================== */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">Skills</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.heading} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-500">
                {group.heading}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item} className="rounded bg-slate-100 px-2.5 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default About;
