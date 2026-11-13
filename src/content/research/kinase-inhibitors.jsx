// A RESEARCH entry. Copy this file to add another, then add it to the list in
// src/content/research/index.js.

export const meta = {
  id: 'kinase-inhibitors', // becomes the URL: /research/kinase-inhibitors
  title: 'Kinases as drug targets: a history of failures and successes',
  description:
    'A library dissertation comparing imatinib, gefitinib, and p38 MAPK inhibitors to explore how genetic context, signalling networks, and acquired resistance shape targeted therapy.',
  date: '2025-10-15', // YYYY-MM-DD
  researchType: 'Library dissertation',
  tags: ['kinase inhibitors', 'targeted therapy', 'precision medicine', 'drug resistance', 'literature review'],
  documents: [
    {
      title: 'Library dissertation',
      description: 'Kinases as Drug Targets: A History of Failures and Successes. The full literature-based dissertation, including figures, comparative analysis, and references.',
      path: 'documents/research/kinase-inhibitors-dissertation.pdf',
      pages: 16,
    },
  ],
  featured: false, // show on the home page?
};

export default function KinaseInhibitors() {
  return (
    <>
      <h2>Overview</h2>
      <p>
        This library project examined why some <strong>kinase-targeted therapies</strong> succeed
        while others fail. I compared evidence from cancer and inflammatory
        disease to explore how a drug's effects depend on the genetic context of the
        disease and the signalling network around its target.
      </p>

      <h2>Cases covered</h2>
      <ul>
        <li>
          <strong>Imatinib in chronic myeloid leukaemia (CML).</strong>{' '}
          The dissertation examines how targeting the BCR-ABL fusion kinase established
          an influential model of treatment directed at a dominant oncogenic driver.
        </li>
        <li>
          <strong>Gefitinib in non-small-cell lung cancer (NSCLC).</strong> An inhibitor of the EGFR
          kinase. Its contrasting outcomes in unselected and EGFR-mutant patient groups
          illustrate the importance of biomarker-driven patient selection.
        </li>
        <li>
          <strong>p38 MAPK inhibitors in rheumatoid arthritis.</strong> The dissertation contrasts
          their clinical failures with JAK inhibition to consider how pathway redundancy
          and a target's position in a signalling network affect therapeutic outcomes.
        </li>
      </ul>

      <h2>Resistance and emerging strategies</h2>
      <p>
        I also reviewed acquired resistance, including the BCR-ABL T315I and EGFR T790M
        gatekeeper mutations, and discussed next-generation, covalent, and allosteric
        inhibitors. The central argument is that potency alone cannot explain success:
        patient selection, network biology, and the evolution of resistance must be
        considered together.
      </p>

      <h2>Research skills</h2>
      <p>
        The project brought together critical reading of primary literature, comparison
        of clinical and mechanistic evidence, scientific writing, and visual explanation
        of signalling pathways and resistance mechanisms.
      </p>
    </>
  );
}
