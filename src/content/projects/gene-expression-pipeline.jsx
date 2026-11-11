// ============================================================================
//  A MINI project that is PLANNED — not started yet. When you begin, change
//  `status` to 'in-progress', and to 'complete' when it is done.
// ============================================================================

export const meta = {
  id: 'gene-expression-pipeline', // becomes the URL: /projects/gene-expression-pipeline
  title: 'Gene expression mini-pipeline',
  description:
    'A small RNA-seq style workflow: load a table of gene expression values, clean and transform it, group similar genes, and plot the result.',
  category: 'mini-unique', // big-unique | guided | mini-unique
  status: 'planned', // planned | in-progress | complete
  date: '2026-11-11', // YYYY-MM-DD
  tags: ['Python', 'pandas', 'matplotlib', 'statistics', 'R / ggplot2 (optional)'], // what the project needs
  devlog: [],
  featured: false, // show on the home page?
};

export default function GeneExpressionPipeline() {
  return (
    <>
      <h2>The goal</h2>

      <p>
        Simulate a basic RNA-seq style analysis from start to finish, so that I understand each
        step rather than only running someone else’s script.
      </p>

      <h2>What it needs</h2>

      <ul>
        <li>
          Input: a CSV file of gene expression values.
        </li>
        <li>
          Normalise the data with a log transform.
        </li>
        <li>
          Filter out genes with very low expression.
        </li>
        <li>
          Cluster the remaining genes (k-means or similar).
        </li>
        <li>
          Plot the results — optionally again in R with ggplot2, to compare.
        </li>
      </ul>

      <h2>What I want to practise</h2>

      <p>
        Building a <strong>pipeline</strong> with clear stages — load, clean, transform,
        analyse, visualise — instead of one long script, and being able to explain what each
        transformation does to the data and what the final plot actually shows.
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
