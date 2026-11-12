# Personal Portfolio Website

It presents software projects, solved coding problems, and scientific research
side by side as short case studies.

The site is organised into these sections:

- **Projects** — my build work in three tiers: Ambitious projects, Guided builds following a tutorial/course, and small tools that solve a real, everyday annoyance.
- **Problems** — my competitive-programming profile (in progress),
  plus worked coding-challenge solutions with complexity analysis.
- **Research** — my scientific work, kept in its own section.

## How it's built

A single-page application made with **React** and **Vite**, styled with
**Tailwind CSS**, with **React Router** handling the pages.

```
index.html            the one real HTML page (React renders inside #root)
src/main.jsx          entry point: starts React and the router
src/App.jsx           the route table (which URL shows which page)
src/pages/            one component per page
src/components/       reusable pieces (header, cards, canvases, …)
src/hooks/            custom hooks (useTheme, usePageMeta)
src/lib/              plain JavaScript helpers (dates, labels, canvas drawing)
src/content/          the projects, research and problems themselves
src/styles/global.css colours, fonts and shared styles
python-projects/      my Python programs (the Wordle assistant and its tests)
public/wordle/        the word list the in-browser Wordle terminal downloads
```

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173. Other commands: `npm run build` (production
build into `dist/`), `npm run preview` (serve that build), `npm run lint`.

## Adding content

Each entry is one `.jsx` file in the matching `src/content/` folder
(`projects`, `research`, `challenges`). It exports a `meta` object
(title, date, tags, …) and a default component containing the write-up.

1. Copy an existing file in the folder and rename it.
2. Edit its `meta` (the `id` becomes the URL) and the write-up.
3. Import it in that folder's `index.js` and add one line to the list.

The freeCodeCamp daily challenge total on the Problems page is updated manually.
Change `DAILY_PROGRESS.solved` and `DAILY_PROGRESS.updatedAt` in
`src/components/FreeCodeCampProfile.jsx` together. Daily completions are separate
from curriculum exercises and are not included in freeCodeCamp's public profile API.

Research PDFs live in `public/documents/research/`. Each research entry's
`meta.documents` array supplies its document titles, descriptions, paths relative
to `public/`, and page counts. The research detail page adds open/download links
and optional previews, which keep a white background in both site themes.

## Accessibility

The header's **Reduce motion** control stops decorative animation and follows
device preferences. Run `npm run test:a11y` for the production-build accessibility
and keyboard checks. See [the accessibility audit](docs/accessibility.md) for
coverage, setup, and the remaining screen-reader and document checks.

## YouTube interface demo

The completed HTML/CSS source is in `html-css-course/youtube.html`,
`youtube.css`, and `styles/`. Its six thumbnail/avatar pairs are bundled locally.
The demo is linked from `/projects/youtube-clone` and served at
`/demos/youtube-clone/index.html`. The explicit HTML filename also lets Vite's
development server serve the demo without falling back to the portfolio app.

`npm run dev`, `npm start`, and `npm run build` prepare the demo automatically.
After editing the course files during a running dev session, run
`npm run demo:youtube` to refresh the generated copy. The generated
`public/demos/youtube-clone/` directory is ignored; edit the course source instead.
Unrelated flexbox/grid exercises stay separate from the published demo.
