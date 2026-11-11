// ============================================================================
//  A GUIDED build — following a tutorial. This one is a PLACEHOLDER: fill in
//  the tutorial link and your own notes/devlog as you work through it.
// ============================================================================

export const meta = {
  id: 'youtube-clone', // becomes the URL: /projects/youtube-clone
  title: 'YouTube interface clone (HTML, CSS & JavaScript)',
  description:
    'Rebuilding the YouTube interface from scratch to learn front-end fundamentals — semantic HTML, layout with CSS, and interactivity with vanilla JavaScript.',
  category: 'guided', // big-unique | guided | mini-unique
  status: 'complete', // planned | in-progress | complete
  date: '2026-07-06', // YYYY-MM-DD
  tags: ['HTML', 'CSS', 'JavaScript'],
  progress: 10, // EDIT HERE: 0–100. Guided builds show this as a bar.
  // githubUrl: '[[GITHUB_URL]]', // optional — uncomment and set
  // demoUrl: '[[DEMO_URL]]',     // optional — uncomment and set
  featured: false, // show on the home page?
  // EDIT HERE: add a dated entry each day you work on it, for example:
  //   { date: '2026-07-06', summary: 'Set up the page structure and the header bar.' },
  // The devlog renders as a timeline at the bottom of this project's page.
  devlog: [],
};

// EDIT HERE: this is a placeholder for the guided build from issue #6.
// Add the tutorial link and rewrite this once you've started.
export default function YoutubeClone() {
  return (
    <>
      <h2>The problem</h2>
      <p>
        I wanted a solid grounding in front-end fundamentals — how a real, familiar
        interface is actually put together — rather than only building from finished
        component libraries.
      </p>

      <h2>Approach</h2>
      {/* EDIT HERE: paste the tutorial link. */}
      <p>
        I’m rebuilding the <strong>YouTube interface</strong> by following a video tutorial, writing
        the HTML, CSS, and JavaScript by hand.
      </p>

      <h2>What I want to get out of it</h2>
      <p>
        A confident feel for semantic HTML structure, laying out a responsive grid with
        CSS, and adding interactivity with plain JavaScript — the groundwork under any
        framework I pick up later.
      </p>
    </>
  );
}
