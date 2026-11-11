// A RESEARCH entry. Copy this file to add another, then add it to the list in
// src/content/research/index.js.

export const meta = {
  id: 'kinase-inhibitors', // becomes the URL: /research/kinase-inhibitors
  title: 'Kinase inhibitors in targeted therapy',
  description:
    'A presentation on how small-molecule kinase inhibitors are used in cancer and inflammatory disease — imatinib, gefitinib, and JAK/p38 inhibitors.',
  date: '2025-10-15', // YYYY-MM-DD
  tags: ['pharmacology', 'oncology'],
  // githubUrl: '[[GITHUB_URL]]', // optional — uncomment and set
  // demoUrl: '[[DEMO_URL]]',     // optional — uncomment and set
  featured: false, // show on the home page?
};

export default function KinaseInhibitors() {
  return (
    <>
      <h2>Overview</h2>
      <p>
        Kinases are enzymes that drive many of the signalling pathways a cell uses to grow
        and divide. When those pathways are stuck “on,” the result can be cancer or chronic
        inflammation. This presentation explored how
        small-molecule <strong>kinase inhibitors</strong> exploit that biology to treat disease.
      </p>

      <h2>Cases covered</h2>
      <ul>
        <li>
          <strong>Imatinib in chronic myeloid leukaemia (CML).</strong> A landmark targeted therapy:
          imatinib blocks the BCR-ABL fusion kinase that drives CML, turning a once-fatal
          disease into a manageable condition for many patients.
        </li>
        <li>
          <strong>Gefitinib in non-small-cell lung cancer (NSCLC).</strong> An inhibitor of the EGFR
          kinase, most effective in tumours carrying specific activating EGFR mutations —
          a clear example of matching the drug to the molecular profile of the tumour.
        </li>
        <li>
          <strong>JAK and p38 inhibitors in rheumatoid arthritis.</strong> Moving beyond oncology:
          targeting the kinases that drive inflammatory signalling to dampen the immune
          over-activity seen in rheumatoid arthritis.
        </li>
      </ul>

      <h2>Themes</h2>
      <p>
        The through-line is <strong>selectivity</strong>: the therapeutic value of these drugs comes
        from hitting the right kinase hard while sparing the rest, and much of the clinical
        story is about resistance, mutation, and choosing the right patient for each agent.
      </p>
    </>
  );
}
