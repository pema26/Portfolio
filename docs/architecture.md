# Architecture and file ownership

The repository contains a portfolio website and the source of runnable projects
it showcases. Each has its own top-level folder.
Root configuration stays at the root so Vite, npm, ESLint, and Playwright work
with their standard commands.

## Website structure

```text
src/
|-- App.jsx
|-- main.jsx
|-- components/
|   |-- cards/                 ProjectCard and ChallengeCard
|   |-- layout/                Layout, Header, and Footer
|   |   `-- animation/         Background, HeaderMorph, and canvas helpers
|   |-- navigation/            SectionPortals
|   `-- ui/                    CodeBlock and ProgressBar
|-- content/
|   |-- challenges/            Solution write-ups and their index
|   |-- projects/              Project case studies and their index
|   `-- research/              Research write-ups and their index
|-- features/
|   |-- codeforces/            Profile, charts, API helpers, and data hook
|   |-- fasta/                 Browser demo and analysis functions
|   |-- freecodecamp/          Profile and manually maintained progress
|   |-- preferences/           Theme and motion controls, context, and hooks
|   |-- research/              Research document links and previews
|   `-- wordle/                Browser terminal, rules, and solver
|-- hooks/                     usePageMeta, shared by pages
|-- lib/                       Shared date formatting and project labels
|-- pages/                     Route-level list and detail components
`-- styles/                    Global CSS and Tailwind design tokens
```

`main.jsx` starts React and the router. `App.jsx` applies the motion provider and
shared layout, then chooses a page for the URL. Pages read the content indexes
and compose shared UI and features. A content entry supplies metadata and a
write-up; its filename does not create a route automatically.

Keep a feature's components, hooks, context, and plain JavaScript together in
`src/features/<name>/`. Put a component in `src/components/` when it is shared
site presentation. Only move a helper to `src/lib/` or `src/hooks/` when it has
shared ownership. Feature logic should not import page components or content
entries. Shared cards receive content through props.

Imports point directly to the owning file. Avoid duplicate re-export files and
empty folder hierarchies. The existing `pages/` and `content/` split stays flat
because each collection is small and easy to scan.

## Project source versus case studies

`projects/<slug>/` holds executable project source, dependencies, data, and local
tests. `src/content/projects/<slug>.jsx` holds the portfolio case study. Matching
slugs make the two easy to find together.

- `projects/payment-review/` runs independently with Python and PostgreSQL. The
  portfolio imports its actual SQL files as text for the case study.
- `projects/wordle-assistant/` contains the Python CLI. Its browser port belongs
  to `src/features/wordle/`. Both read `public/wordle_words_texts/words.txt`; this is the single
  maintained vocabulary. The Python CLI accepts `--words` when used outside this
  repository.
- `projects/youtube-clone/` contains an HTML/CSS-only demo. Its relative stylesheet
  and image paths work both in the source folder and in the published copy.

## Public assets and build flow

| Location | Ownership |
| --- | --- |
| `public/favicon.svg`, `og-image.png`, `robots.txt` | Maintained site assets |
| `public/documents/research/` | Original research PDFs |
| `public/projects_images/` | Project screenshots |
| `public/wordle_words_texts/words.txt` | Shared browser/Python vocabulary |
| `public/demos/youtube-clone/` | Generated copy; edit `projects/youtube-clone/` instead |
| `dist/` | Generated production website |
| `test-results/`, `playwright-report/` | Generated test output |

Before development or a production build, `scripts/prepare-assets.js` copies
the YouTube source and its assets into `public/demos/youtube-clone/`. Vite copies
`public/` into the production build. `scripts/create-spa-fallback.js` then writes
`dist/404.html` from the portfolio entry page for hosts that use that SPA fallback.
Playwright's setup uses the same preparation and fallback scripts.

`vercel.json` supplies Vercel's React Router fallback for direct page links.
The portfolio does not publish a CV; the About page contains the biography and skills.

Public URLs are independent of internal React file locations. Moving a component
must not change a project slug or a document URL. Keep the YouTube link explicit:
`/demos/youtube-clone/index.html`; the directory URL falls through to the portfolio
app in Vite development.

## Cleanup decisions

The tracked `.astro/` cache and the old Word README described an Astro application
that this repository no longer uses, so they were removed. The Markdown README
and this guide describe the current React application. The duplicate Python
Wordle vocabulary, unused Google image, and course exercise materials were removed.
