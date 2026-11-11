// ============================================================================
//  This is a NOTE entry (a short blog post). To add your own, copy this file,
//  rename it, edit the `meta` fields, write inside the component, and add it
//  to the list in src/content/notes/index.js.
// ============================================================================

export const meta = {
  id: 'welcome', // becomes the URL: /notes/welcome
  title: 'How this site is built (and how I add to it)',
  description:
    'A short note explaining the pattern this site uses, and how new pages and projects get added by editing files.',
  date: '2026-03-12', // YYYY-MM-DD
  tags: ['meta', 'react'],
};

export default function Welcome() {
  return (
    <>
      <p>
        This is an example note. It exists to show the pattern — and to be a template you
        can copy.
      </p>

      <h2>How notes work</h2>
      <p>
        Every note is a small React component in its own file
        in <code>src/content/notes/</code>. To write a new one:
      </p>
      <ol>
        <li>Copy this file and rename it.</li>
        <li>
          Edit the <code>id</code> (it becomes the URL), <code>title</code>, <code>description</code>, <code>date</code>,
          and <code>tags</code> in the <code>meta</code> object at the top.
        </li>
        <li>Write whatever you like inside the component, using <strong>JSX</strong>.</li>
        <li>
          Add it to the list in <code>src/content/notes/index.js</code>. It then appears on
          the <code>/notes</code> page — newest first.
        </li>
      </ol>

      <h2>Why it’s set up this way</h2>
      <p>
        The whole site is built with React, so I can add content by editing one small file
        per entry, without touching the page templates. Projects work exactly the same way,
        just in the <code>src/content/projects/</code> folder. The full step-by-step is in the
        project README.
      </p>

      <blockquote>
        <p>The goal: spend my time writing about the work, not wrestling with the website.</p>
      </blockquote>
    </>
  );
}
