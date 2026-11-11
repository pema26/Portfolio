// A GUIDED build — following a book/course.

export const meta = {
  id: 'data-science-with-r', // becomes the URL: /projects/data-science-with-r
  title: 'Data science with R',
  description:
    'Working through R for Data Science — turning raw, messy data into clear, reproducible analysis and visualisation.',
  category: 'guided', // big-unique | guided | mini-unique
  status: 'complete', // planned | in-progress | complete
  date: '2025-12-05', // YYYY-MM-DD
  tags: ['R', 'data analysis', 'statistics'],
  progress: 45, // EDIT HERE: 0–100. Guided builds show this as a bar.
  // EDIT HERE: add a dated entry each day you work on it, for example:
  //   { date: '2025-12-01', summary: 'Worked through the data-import and tidy chapters.' },
  devlog: [],
  featured: false, // show on the home page?
};

export default function DataScienceWithR() {
  return (
    <>
      <h2>The problem</h2>
      <p>
        Coming from a research background, I’m often handed data that is messy, partial,
        or simply large. I wanted a disciplined, reproducible way to clean it, explore it,
        and communicate what it says.
      </p>

      <h2>Approach</h2>
      <p>
        I worked through <em>R for Data Science</em>, building fluency with
        the <strong>tidyverse</strong> workflow: importing and tidying data, transforming it
        with <code>dplyr</code>, and visualising it with <code>ggplot2</code>. I focused on the
        loop of asking a question, shaping the data to answer it, and plotting the result.
      </p>

      <h2>Solution</h2>
      <p>
        The payoff is a repeatable pipeline: from a raw file to a tidy table to a clear
        chart, all in a script that anyone can re-run and audit. That reproducibility
        matters as much as the analysis itself.
      </p>

      <h2>What I learned</h2>
      <p>
        Most of the real work is in <strong>tidying</strong> — getting data into a consistent,
        one-observation-per-row shape. Once it’s tidy, the analysis and the graphics fall
        out almost for free. This connects directly to my lab work, where careful,
        documented data handling is the difference between a result you can trust and one
        you can’t.
      </p>
    </>
  );
}
