// ============================================================================
//  A completed GUIDED HTML/CSS build. Editable demo: projects/youtube-clone/.
// ============================================================================

export const meta = {
  id: 'youtube-clone', // becomes the URL: /projects/youtube-clone
  title: 'YouTube interface clone (HTML & CSS)',
  description:
    'A completed YouTube-style homepage built with HTML and CSS, featuring a responsive video grid, navigation, and a native search form that opens YouTube results.',
  category: 'guided', // big-unique | guided | mini-unique
  status: 'complete', // planned | in-progress | complete
  date: '2026-11-12', // completion date
  tags: ['HTML', 'CSS'],
  progress: 100,
  // githubUrl: '[[GITHUB_URL]]', // optional — uncomment and set
  demoUrl: `${import.meta.env.BASE_URL}demos/youtube-clone/index.html`,
  featured: true,
  devlog: [
    {
      date: '2026-11-12',
      summary: 'Completed the header and navigation, refined the responsive video grid, added keyboard and screen-reader support, and prepared the HTML/CSS demo for the portfolio.',
    },
  ],
};

export default function YoutubeClone() {
  return (
    <>
      <h2>Overview</h2>
      <p>
        I recreated a YouTube-style homepage to practise turning a familiar interface
        into semantic HTML and CSS. This guided project brought together the layout,
        spacing, typography, and responsive design techniques I learned through
        SuperSimpleDev's HTML and CSS course.
      </p>

      <img
        src={`${import.meta.env.BASE_URL}projects_images/youtube-clone-preview.png`}
        alt="The completed YouTube-style homepage showing its search header, sidebar navigation, topic links, and six video cards with thumbnails and channel details."
        width="1440"
        height="1000"
        loading="lazy"
        className="my-6 w-full max-w-5xl rounded-lg border border-slate-200 dark:border-slate-800"
      />

      <h2>What I built</h2>
      <ul>
        <li>A header with a branded home link, labelled search field, and links back to my portfolio.</li>
        <li>A responsive CSS Grid feed containing six video cards, channel pictures, titles, and example viewing statistics.</li>
        <li>Sidebar and topic navigation, plus a compact menu using native HTML disclosure controls.</li>
        <li>A native HTML search form and video links that open YouTube.</li>
        <li>Layouts for phones, tablets, and desktop screens, with light and dark device-theme support.</li>
      </ul>

      <h2>Layout and accessibility</h2>
      <p>
        I used CSS Grid for the video feed, Flexbox for grouped controls, and media
        queries to adapt the layout. The completed page includes a skip link,
        semantic navigation, labelled controls, visible keyboard focus, and
        descriptive video links. Thumbnail and avatar images use empty alt text
        where the adjacent video title and channel name already provide the context.
      </p>

      <h2>Learning resources</h2>
      <p>
        The first course guided the HTML and CSS build. I have also included the
        second course as an additional resource from my wider learning.
      </p>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=G3e-cpL7ofc&t=15316s" target="_blank" rel="noopener noreferrer">SuperSimpleDev — HTML &amp; CSS course</a></li>
        <li><a href="https://www.youtube.com/watch?v=EerdGm-ehJQ" target="_blank" rel="noopener noreferrer">SuperSimpleDev — additional learning resource</a></li>
      </ul>
    </>
  );
}
