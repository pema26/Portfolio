// ============================================================================
//  A GUIDED build: following a tutorial. Update `progress` and add `devlog`
//  entries as you work through it.
// ============================================================================

export const meta = {
  id: 'text-editor-in-c', // becomes the URL: /projects/text-editor-in-c
  title: 'Build your own text editor (C)',
  description:
    'Writing a terminal text editor from scratch in C by following the “Build Your Own Text Editor” tutorial, covering raw keyboard input, screen drawing, and file editing without external libraries.',
  category: 'guided', // big-unique | guided | mini-unique
  status: 'in-progress', // planned | in-progress | complete
  date: '2026-11-11', // YYYY-MM-DD
  tags: ['C', 'terminal', 'systems programming'],
  progress: 10, // EDIT HERE: 0–100. Guided builds show this as a bar.
  // githubUrl: '[[GITHUB_URL]]', // optional: uncomment and set
  // demoUrl: '[[DEMO_URL]]',     // optional: set to the tutorial's address
  featured: false, // show on the home page?
  // EDIT HERE: add a dated entry each day you work on it, for example:
  //   { date: '2026-11-11', summary: 'Switched the terminal into raw mode and read key presses one at a time.' },
  devlog: [],
};

export default function TextEditorInC() {
  return (
    <>
      <h2>The problem</h2>

      <p>
        I use a text editor every day without knowing how one works. Python and JavaScript also
        hide a lot from me: memory is managed for me, and strings just work. I wanted a project
        that takes both of those comforts away.
      </p>

      <h2>Approach</h2>

      <p>
        I’m following the <em>Build Your Own Text Editor</em> tutorial, which builds a small
        editor in <strong>C</strong> one step at a time, using only the standard library. The
        stages are:
      </p>

      <ul>
        <li>
          putting the terminal into <strong>raw mode</strong>, so the program receives each key
          press as it happens instead of a whole line at a time;
        </li>
        <li>
          drawing the screen myself by printing <strong>escape sequences</strong>, the special
          codes that move the cursor and clear lines;
        </li>
        <li>
          opening a file and holding its lines in memory that I allocate and free by hand;
        </li>
        <li>
          then editing, saving, searching and syntax highlighting.
        </li>
      </ul>

      <h2>What I want to get out of it</h2>

      <p>
        A working feel for C, including pointers, manual memory, and structs, and a clearer picture of
        what the higher-level languages I normally use are doing for me. It is also the
        groundwork for rebuilding my FASTA analyzer in a lower-level language later.
      </p>
    </>
  );
}
