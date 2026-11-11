// ============================================================================
//  A MINI project that is PLANNED — not started yet. When you begin, change
//  `status` to 'in-progress', and to 'complete' when it is done.
// ============================================================================

export const meta = {
  id: 'fasta-analyzer-cpp', // becomes the URL: /projects/fasta-analyzer-cpp
  title: 'FASTA analyzer, rebuilt in C++',
  description:
    'Re-implementing my Python FASTA analyzer in C++ and measuring the difference in speed and memory on large files.',
  category: 'mini-unique', // big-unique | guided | mini-unique
  status: 'planned', // planned | in-progress | complete
  date: '2026-11-11', // YYYY-MM-DD
  tags: ['C++', 'benchmarking', 'memory', 'large datasets'], // what the project needs
  devlog: [],
  featured: false, // show on the home page?
};

export default function FastaAnalyzerCpp() {
  return (
    <>
      <h2>The goal</h2>

      <p>
        Understand why lower-level languages exist by rebuilding something I have already
        written, and measuring what changes.
      </p>

      <h2>What it needs</h2>

      <ul>
        <li>
          The same features as my Python FASTA analyzer: lengths, GC content and motif search.
        </li>
        <li>
          Timing benchmarks comparing the two versions.
        </li>
        <li>
          Tests on large datasets, where the difference should show.
        </li>
        <li>
          A comparison of speed, memory use and code structure.
        </li>
      </ul>

      <h2>What I want to practise</h2>

      <p>
        <strong>Performance thinking</strong>: choosing data structures deliberately, avoiding
        unnecessary copies of long strings, and translating the idea rather than copying the
        Python line by line.
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
