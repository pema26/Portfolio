// ============================================================================
//  A MINI project that is PLANNED: not started yet. When you begin, change
//  `status` to 'in-progress', and to 'complete' when it is done.
// ============================================================================

export const meta = {
  id: 'digital-detox-cli', // becomes the URL: /projects/digital-detox-cli
  title: 'Digital detox analyzer (command-line tool)',
  description:
    'Turning my Digital Detox challenge solution into a proper command-line tool that reads a file of timestamps and reports usage per day, the longest gap and usage patterns.',
  category: 'mini-unique', // big-unique | guided | mini-unique
  status: 'planned', // planned | in-progress | complete
  date: '2026-11-11', // YYYY-MM-DD
  tags: ['Python', 'argparse', 'command line', 'file I/O'], // what the project needs
  devlog: [],
  featured: false, // show on the home page?
};

export default function DigitalDetoxCli() {
  return (
    <>
      <h2>The goal</h2>

      <p>
        I solved the Digital Detox problem as a coding challenge (it is on my Problems page).
        This project turns that logic into a tool someone else could actually run.
      </p>

      <h2>What it needs</h2>

      <ul>
        <li>
          Input: a list of timestamps, read from a file.
        </li>
        <li>
          Output: time spent per day, the longest gap between sessions, and usage patterns.
        </li>
        <li>
          A command-line interface built with <code>argparse</code>.
        </li>
        <li>
          Optional flags such as <code>--daily</code> and <code>--summary</code>.
        </li>
      </ul>

      <h2>What I want to practise</h2>

      <p>
        Keeping the <strong>logic separate from the interface</strong>: core functions in one
        place, the command-line handling in another, and nothing hard-coded. It is the same
        structure I used for my Wordle assistant.
      </p>

      <blockquote>
        <p>
          Status: planned. I have not started this one yet; the entry is here to track what it
          needs.
        </p>
      </blockquote>
    </>
  );
}
