// ============================================================================
//  An AMBITIOUS project — a larger application (planned).
// ============================================================================

export const meta = {
  id: 'virtual-lab', // becomes the URL: /projects/virtual-lab
  title: 'Virtual lab: VR training for first-year lab skills',
  description:
    'A 3D/VR environment where new students rehearse real lab equipment — starting with a centrifuge — including the small mistakes people actually make, so practical sessions feel familiar before they begin.',
  category: 'big-unique', // big-unique | guided | mini-unique
  status: 'planned', // planned | in-progress | complete
  date: '2026-06-05', // YYYY-MM-DD
  tags: ['VR', 'education', 'simulation', 'molecular biology'],
  devlog: [],
  featured: false, // show on the home page?
};

// EDIT HERE: this is your own, more ambitious idea. The notes below are a
// starting point — rewrite and expand as the concept develops.
export default function VirtualLab() {
  return (
    <>
      <h2>The idea</h2>
      <p>
        First-year students often meet lab equipment for the first time under pressure,
        and the resources available are usually flat, <strong>2D</strong> walkthroughs. I’d like to
        build a <strong>3D / VR</strong> environment where they can rehearse using real equipment
        hands-on before they ever set foot in the lab.
      </p>

      <h2>Why it could matter</h2>
      <p>
        The point isn’t just to show the ideal procedure — it’s to capture
        the <strong>small, human mistakes</strong> that actually happen, so students learn what to
        watch for:
      </p>
      <ul>
        <li>forgetting to put the lid back on before closing a centrifuge,</li>
        <li>not balancing the tubes by weight,</li>
        <li>and similar slips that an experienced demonstrator would catch.</li>
      </ul>
      <p>
        Getting these wrong in a simulation is free; getting them wrong on real equipment
        is not.
      </p>

      <h2>Scope</h2>
      <p>
        The <strong>minimum viable product</strong> is a single, well-modelled piece of equipment —
        a <strong>centrifuge</strong> — done properly, including those failure cases. If that proves
        valuable, later stages could grow toward more advanced techniques for second- and
        third-year (or higher) students, such as using a spectrophotometer or running a
        western blot.
      </p>

      <blockquote>
        <p>
          Status: planned / exploring. This is an idea I intend to design and build
          myself; the entry is here to track the direction.
        </p>
      </blockquote>
    </>
  );
}
