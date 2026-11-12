// A RESEARCH entry. Copy this file to add another, then add it to the list in
// src/content/research/index.js.

export const meta = {
  id: 'site-directed-mutagenesis', // becomes the URL: /research/site-directed-mutagenesis
  title: 'Expression and Y255A mutagenesis of catechol 2,3-dioxygenase',
  description:
    'A molecular biology practical investigating recombinant protein expression, purification, and a sequencing-confirmed Y255A mutation, alongside a separate research proposal on the COMT L135P variant.',
  date: '2025-11-10', // YYYY-MM-DD
  researchType: 'Laboratory project',
  tags: ['molecular biology', 'site-directed mutagenesis', 'protein purification', 'Y255A', 'Sanger sequencing', 'COMT proposal'],
  documents: [
    {
      title: 'Practical research report',
      description: 'Expression, Purification, and Functional Analysis of a Y255A Mutant of Catechol 2,3-Dioxygenase — experimental results, figures, discussion, and raw data.',
      path: 'documents/research/molecular-biology-research-report.pdf',
      pages: 37,
    },
    {
      title: 'Molecular biology research proposal',
      description: 'Cloning, Expression, and Functional Analysis of the Destabilised L135P Missense Variant of Catechol-O-Methyltransferase (COMT) in Escherichia coli — a separate proposed study.',
      path: 'documents/research/molecular-biology-research-proposal.pdf',
      pages: 10,
    },
  ],
  featured: true, // show on the home page?
};

export default function SiteDirectedMutagenesis() {
  return (
    <>
      <h2>Practical research question</h2>
      <p>
        This practical investigated the role of Tyr255 in <strong>catechol 2,3-dioxygenase</strong>,
        an enzyme involved in the bacterial breakdown of aromatic compounds. The enzyme
        is encoded by the <em>xylE</em> gene from <em>Pseudomonas putida</em> mt-2 and was
        expressed recombinantly in <em>Escherichia coli</em>. The aim was to introduce a
        Y255A substitution and investigate its effect on enzyme activity.
      </p>

      <h2>Approach</h2>
      <p>
        The work combined plasmid verification by restriction digestion, recombinant
        protein expression, SDS-PAGE, and <strong>Ni-NTA affinity purification</strong>.
        Site-directed mutagenesis and colony screening were followed by Sanger sequencing
        to check whether the intended substitution had been introduced.
      </p>

      <h2>Findings</h2>
      <p>
        <strong>Sanger sequencing confirmed the Y255A substitution</strong> in the selected
        sample, with no additional mutations detected in the sequenced region. Qualitative
        catechol spray assays showed reduced yellow colour development in several screened
        colonies relative to the wild-type control, suggesting reduced rather than
        completely abolished activity.
      </p>

      <h2>Interpreting the evidence</h2>
      <p>
        The report distinguishes sequence confirmation from functional evidence: one
        colony was sequenced, and the spray assay provided a qualitative comparison.
        The quantitative enzyme activity data were supplied by the module academic with
        permission because I could not complete those assays within the practical time
        available. Purifying the mutant and comparing its kinetics with the wild-type
        enzyme remains a proposed next step.
      </p>

      <h2>Separate proposal: the COMT L135P variant</h2>
      <p>
        My molecular biology research proposal addresses a different enzyme:
        human soluble <strong>catechol-O-methyltransferase (S-COMT)</strong>. It proposes
        comparing the wild-type protein with the destabilising L135P missense variant
        to distinguish effects on protein stability from effects on catalytic function.
        This document describes a planned study; the completed practical report concerns
        catechol 2,3-dioxygenase instead.
      </p>
    </>
  );
}
