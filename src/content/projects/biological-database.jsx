// ============================================================================
//  A MINI project that is PLANNED — not started yet. When you begin, change
//  `status` to 'in-progress', and to 'complete' when it is done.
// ============================================================================

export const meta = {
  id: 'biological-database', // becomes the URL: /projects/biological-database
  title: 'Biological database query system (SQL + Python)',
  description:
    'A small relational database of genes, sequences and expression values, queried with SQL from Python — letting the database do the heavy lifting instead of loops.',
  category: 'mini-unique', // big-unique | guided | mini-unique
  status: 'planned', // planned | in-progress | complete
  date: '2026-11-11', // YYYY-MM-DD
  tags: ['SQL', 'SQLite', 'Python', 'joins', 'schema design'], // what the project needs
  devlog: [],
  featured: false, // show on the home page?
};

export default function BiologicalDatabase() {
  return (
    <>
      <h2>The goal</h2>

      <p>
        Think in data rather than in loops: design the tables first, then answer questions with
        queries.
      </p>

      <h2>What it needs</h2>

      <ul>
        <li>
          A small database with three tables: genes, sequences and expression.
        </li>
        <li>
          Queries for the top expressed genes, for genes containing a specific motif, and for
          sequence joined with expression data.
        </li>
        <li>
          A Python program (using <code>sqlite3</code>) that runs the queries and displays the
          results.
        </li>
      </ul>

      <h2>What I want to practise</h2>

      <p>
        <strong>Relational thinking</strong> — a sensible schema, and joins that are correct —
        and keeping storage separate from program logic. For example, the average expression of
        each gene should be one <code>GROUP BY</code> query, not a Python loop.
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
