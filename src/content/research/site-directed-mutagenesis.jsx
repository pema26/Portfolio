// A RESEARCH entry. Copy this file to add another, then add it to the list in
// src/content/research/index.js.

export const meta = {
  id: 'site-directed-mutagenesis', // becomes the URL: /research/site-directed-mutagenesis
  title: 'Site-directed mutagenesis of catechol 2,3-dioxygenase',
  description:
    'Designing mutagenic primers to alter a gene in Pseudomonas aeruginosa, then confirming the change by analysing Sanger sequencing chromatograms.',
  date: '2025-11-10', // YYYY-MM-DD
  tags: ['molecular biology', 'P. aeruginosa', 'Sanger sequencing'],
  // githubUrl: '[[GITHUB_URL]]', // optional — uncomment and set
  // demoUrl: '[[DEMO_URL]]',     // optional — uncomment and set
  featured: true, // show on the home page?
};

export default function SiteDirectedMutagenesis() {
  return (
    <>
      <h2>The problem</h2>
      <p>
        Catechol 2,3-dioxygenase is an enzyme in the bacterial degradation of aromatic
        compounds. The goal of this project was to introduce a specific, targeted change
        into its gene in <em>Pseudomonas aeruginosa</em> and then verify, at the level of the DNA
        sequence, that exactly the intended change had been made — and nothing else.
      </p>

      <h2>Approach</h2>
      <p>
        I designed <strong>mutagenic primers</strong> carrying the desired base change, flanked by
        enough matching sequence to bind reliably. After carrying out the mutagenesis, the
        key question was confirmation: did the mutation take, and was it clean?
      </p>

      <h2>Solution</h2>
      <p>
        To answer that I analysed the <strong>Sanger sequencing chromatograms</strong> of the product,
        reading the trace base by base around the target site, comparing it against the
        wild-type reference, and checking for the expected substitution as well as for any
        unintended secondary mutations or ambiguous peaks.
      </p>

      <h2>Result and what I learned</h2>
      <p>
        The sequencing trace is the source of truth — a clean, single peak at the right
        position is the confirmation; a double peak or a shifted frame tells a very
        different story. The project reinforced how much careful primer design and honest,
        methodical reading of the raw data matter. It’s the same discipline I bring to
        debugging code: trust the trace, not the assumption.
      </p>
    </>
  );
}
