# Personal Portfolio Website

It presents software projects, solved coding problems, and scientific research
side by side as short case studies, with a notes/blog section and an interactive
graphics demo on the home page.

The site is organised into these sections:

- **Projects** — my build work in three tiers: Original Ideas, Guided builds following a tutorial/course, and small tools that solve a real, everyday annoyance.
- **Problems** — my competitive-programming profile (in progress),
  plus worked coding-challenge solutions with complexity analysis.
- **Research** — my scientific work, kept in its own section.
- **Notes** — short blog-style write-ups.

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
src/content/          the projects, research, problems and notes themselves
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
(`projects`, `research`, `challenges`, `notes`). It exports a `meta` object
(title, date, tags, …) and a default component containing the write-up.

1. Copy an existing file in the folder and rename it.
2. Edit its `meta` (the `id` becomes the URL) and the write-up.
3. Import it in that folder's `index.js` and add one line to the list.
