// ============================================================================
//  A FLAGSHIP project — your own original, ambitious idea.
//  These can be "planned" or "in-progress" while you build them; set the
//  `status` field accordingly so the right pill shows on the card.
// ============================================================================

export const meta = {
  id: 'parcel-board', // becomes the URL: /projects/parcel-board
  title: 'Parcel board: a shared delivery tracker for the home',
  description:
    "A tool that reads my family's delivery emails and shows, at a glance, what's arriving today, this week, this month, and later — with one tidy entry per parcel that updates itself as new emails arrive.",
  category: 'big-unique', // big-unique | guided | mini-unique
  status: 'in-progress', // planned | in-progress | complete
  date: '2026-06-01', // YYYY-MM-DD
  tags: ['Python', 'automation', 'product idea'],
  // githubUrl: '[[GITHUB_URL]]', // optional — uncomment and set
  devlog: [],
  featured: false, // show on the home page?
};

// EDIT HERE: this is your own project. The notes below are a starting
// point in your own words — rewrite and expand as you build it.
export default function ParcelBoard() {
  return (
    <>
      <h2>The problem</h2>
      <p>
        In a shared household, parcel updates are scattered across everyone’s inboxes,
        and the same delivery generates a stream of emails — ordered, dispatched,
        delayed, out for delivery. It’s hard to answer the simple question we actually
        care about: <em>what is arriving, and roughly when?</em>
      </p>

      <h2>What I’m building</h2>
      <p>
        A tool that reads the family’s delivery emails and sorts every parcel into four
        clear buckets:
      </p>
      <ul>
        <li><strong>Today</strong> — arriving today (most important).</li>
        <li><strong>This week</strong> — due within the next seven days.</li>
        <li><strong>This month</strong> — roughly one to four weeks away.</li>
        <li><strong>Later</strong> — estimated more than four weeks out.</li>
      </ul>
      <p>
        The key detail is that each parcel is a <strong>single, living entry</strong>: when a new
        email about that same parcel arrives (a delay, a new estimate, an “out for
        delivery”), the existing entry is <strong>updated in place</strong> rather than piling up as
        duplicates.
      </p>

      <h2>Where I want to take it</h2>
      <p>
        If the core idea works well, the plan is to turn it into an app, and eventually a
        small <strong>always-on display by the front door</strong> — so instead of checking our
        phones, anyone can glance at the board on the way past to see what’s on its way.
      </p>

      <blockquote>
        <p>
          Status: in progress. This entry describes the idea and direction; I’m building
          it myself.
        </p>
      </blockquote>
    </>
  );
}
