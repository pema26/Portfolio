// ============================================================================
//  This is a PROJECT entry. To add your own, copy this whole file, rename it,
//  edit the `meta` fields below + the prose, and then add it to the list in
//  src/content/projects/index.js.
//  Fields marked "optional" can be deleted if they don't apply.
// ============================================================================

export const meta = {
  id: 'tinyrenderer', // becomes the URL: /projects/tinyrenderer
  title: 'tinyrenderer: a software rasterizer from scratch',
  description:
    'Building a 3D renderer with no graphics library — Bresenham line drawing, wireframes, and triangle rasterization, one pixel at a time.',
  category: 'guided', // big-unique | guided | mini-unique
  status: 'complete', // planned | in-progress | complete
  date: '2026-02-15', // YYYY-MM-DD
  tags: ['C++', 'graphics', 'rendering'],
  progress: 75, // EDIT HERE: 0–100. Guided builds show this as a bar.
  // EDIT HERE: add a dated entry each day you work on it, for example:
  //   { date: '2026-02-10', summary: 'Set up the project and drew my first Bresenham line.' },
  //   { date: '2026-02-12', summary: 'Joined lines into a wireframe model.' },
  devlog: [],
  demoUrl: 'https://haqr.eu/tinyrenderer', // optional
  // githubUrl: '[[GITHUB_URL]]',          // optional — uncomment and set
  featured: true, // show on the home page?
};

// EDIT HERE: write your case study below. A useful shape is
// Problem -> Approach -> Solution -> Result / tradeoffs.
export default function Tinyrenderer() {
  return (
    <>
      <h2>The problem</h2>
      <p>
        Modern graphics APIs hide an enormous amount of machinery behind a few function
        calls. I wanted to understand what actually happens between “here is some 3D
        geometry” and “here are coloured pixels on a screen” — so I set out to build a
        renderer that uses no graphics library at all, following the
        well-known <em>tinyrenderer</em> tutorial.
      </p>

      <h2>Approach</h2>
      <p>
        I worked up from the most basic primitive. The first milestone was drawing a
        single straight line between two points using <strong>Bresenham’s algorithm</strong>, which
        decides which pixels to fill using only integer addition and comparisons. From
        there I connected lines into <strong>wireframe</strong> models, then moved on to
        filling <strong>triangles</strong> so surfaces became solid.
      </p>
      <p>
        Each step forced a concrete decision: how to handle steep versus shallow lines,
        how to walk the edges of a triangle, and how to map 3D coordinates down onto the
        2D image plane.
      </p>

      <h2>Solution</h2>
      <p>
        The result is a small renderer that loads a model and produces an image entirely
        in code I wrote myself — projection, rasterization, and the pixel-level line
        drawing included. The live demo shows it running.
      </p>

      <h2>What I learned / tradeoffs</h2>
      <p>
        Doing it by hand made the performance tradeoffs tangible: a software rasterizer
        is far slower than the GPU, but writing every stage myself turned “graphics” from
        a black box into a set of ideas I genuinely understand. The next natural steps are
        z-buffering for correct depth and simple shading.
      </p>
    </>
  );
}
