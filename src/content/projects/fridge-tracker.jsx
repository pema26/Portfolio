// ============================================================================
//  An AMBITIOUS project: a larger application (planned).
// ============================================================================

export const meta = {
  id: 'fridge-tracker', // becomes the URL: /projects/fridge-tracker
  title: 'Fridge tracker: use food before it expires',
  description:
    'A tool that keeps a list of what is in my fridge and sorts it by date, what has expired, what must be eaten today, and what is coming up so food gets used instead of thrown away.',
  category: 'big-unique', // big-unique | guided | mini-unique
  status: 'planned', // planned | in-progress | complete
  date: '2026-11-11', // YYYY-MM-DD
  tags: ['JavaScript', 'React', 'SQL', 'product idea'],
  // githubUrl: '[[GITHUB_URL]]', // optional: uncomment and set
  devlog: [],
  featured: false, // show on the home page?
};

export default function FridgeTracker() {
  return (
    <>
      <h2>The problem</h2>

      <p>
        Food gets pushed to the back of the fridge and forgotten. By the time I find it again it
        is past its date and goes in the bin, wasting both food and money. The information I
        need is printed on every packet; the trouble is that nobody reads thirty labels each
        time they open the fridge. The simple question I actually care about is: <em>what do I
        need to eat first?</em>
      </p>

      <h2>What I’m planning to build</h2>

      <p>
        A tool that keeps one list of everything in the fridge and sorts it into clear buckets,
        most urgent first:
      </p>

      <ul>
        <li>
          <strong>Expired:</strong> past its date; check it or bin it.
        </li>
        <li>
          <strong>Today:</strong> last day (most important).
        </li>
        <li>
          <strong>Next 3 days:</strong> plan a meal around these.
        </li>
        <li>
          <strong>This week:</strong> fine for now.
        </li>
        <li>
          <strong>Later:</strong> nothing to do yet.
        </li>
      </ul>

      <p>
        The key detail is the kind of date. A <strong>use-by</strong> date is about safety:
        after it, the food should not be eaten. A <strong>best-before</strong> date is about
        quality: the food is usually still fine for a while. The tool should store which one
        each item has, so it warns firmly about the first and gently about the second.
      </p>

      <h2>How I plan to build it</h2>

      <p>
        The tempting version is “point the camera at the fridge and it knows everything”. That
        is the hard, unreliable part, so I am leaving it until last and starting with what I can
        already build:
      </p>

      <ol>
        <li>
          <strong>A list I type into.</strong> A small React page with a form (name, date, use-by
          or best-before) and a list sorted by date into the buckets above. Items are saved in the
          browser, so it works with no server at all.
        </li>
        <li>
          <strong>Faster entry.</strong> Typing is the step that will make me give up, so: a
          one-tap list of things I buy every week, and sensible default dates for food that has no
          label (for example, a few days for leftovers).
        </li>
        <li>
          <strong>Shared between people.</strong> Move the data into a small back end using an Express
          API with a PostgreSQL table of items so everyone in the house sees the same list from
          their own phone.
        </li>
        <li>
          <strong>Scanning.</strong> Read the barcode to fill in the product name from an open
          food database. The expiry date is not in the barcode, so that still has to be typed or
          picked.
        </li>
        <li>
          <strong>Reminders.</strong> A short daily message listing what is in the Today and Next
          3 days buckets.
        </li>
      </ol>

      <p>
        Each step is useful on its own, so I can stop after any of them and still have something
        that works. Step 1 is deliberately small enough to finish in a weekend.
      </p>

      <h2>Where I want to take it</h2>

      <p>
        If the core idea holds up, the natural next steps are suggesting meals from whatever
        expires soonest, and a small always-on screen on the fridge door with the same idea as my
        parcel board, but for food.
      </p>

      <blockquote>
        <p>
          Status: planned. This entry describes the idea and the route I intend to take; I’m
          building it myself.
        </p>
      </blockquote>
    </>
  );
}
