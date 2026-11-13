# Personal Portfolio

A React, Vite, and Tailwind CSS portfolio for software projects, coding challenge
solutions, and scientific research. React Router defines the pages in `src/App.jsx`.

## Run the website

From the repository root:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

| Command | Purpose |
| --- | --- |
| `npm run dev` / `npm start` | Prepare demo assets and start development |
| `npm run assets:prepare` | Refresh the generated HTML/CSS demo after editing it |
| `npm run build` | Prepare assets and create `dist/`, including the SPA fallback |
| `npm run preview` | Serve the last production build |
| `npm run lint` | Check JavaScript and JSX |
| `npm run test:a11y` | Build and run the browser/accessibility suite |

## Find your files

```text
Portfolio_test/
|-- src/                       Portfolio website
|   |-- App.jsx                Routes and application providers
|   |-- main.jsx               React entry point
|   |-- pages/                 Page components
|   |-- content/               Project, challenge, and research write-ups
|   |-- components/            Shared layout, cards, navigation, and UI
|   |-- features/              Feature components with their hooks and logic
|   |-- hooks/                 Hooks shared across pages
|   |-- lib/                   Shared dates and project metadata helpers
|   `-- styles/                Global styles and design tokens
|-- projects/                  Runnable source for showcased projects
|   |-- payment-review/        Flask + PostgreSQL dashboard
|   |-- wordle-assistant/      Python command-line solver and tests
|   `-- youtube-clone/         HTML/CSS-only demo and its assets
|-- public/                    Static files served at stable public URLs
|   |-- projects_images/       Screenshots for project case studies
|   `-- wordle_words_texts/    Vocabulary shared by both Wordle versions
|-- scripts/                   Asset preparation and build helpers
|-- tests/accessibility/       Browser, keyboard, and accessibility checks
`-- docs/                      Architecture, development, and audit notes
```

| What you want to change | Where to look |
| --- | --- |
| Colours, fonts, shared CSS | [`src/styles/global.css`](src/styles/global.css) |
| Navigation and site frame | [`src/components/layout/`](src/components/layout/) |
| Decorative canvas animations | [`src/components/layout/animation/`](src/components/layout/animation/) |
| Shared cards and small UI elements | [`src/components/`](src/components/) |
| Codeforces profile, charts, API, and hook | [`src/features/codeforces/`](src/features/codeforces/) |
| freeCodeCamp progress | [`src/features/freecodecamp/FreeCodeCampProfile.jsx`](src/features/freecodecamp/FreeCodeCampProfile.jsx) |
| Theme and reduced-motion controls | [`src/features/preferences/`](src/features/preferences/) |
| Wordle browser terminal and solver | [`src/features/wordle/`](src/features/wordle/) |
| FASTA browser demo and analysis | [`src/features/fasta/`](src/features/fasta/) |
| Research document previews | [`src/features/research/`](src/features/research/) |
| Project descriptions | [`src/content/projects/`](src/content/projects/) |
| CV, research PDFs, and screenshots | [`public/`](public/) |

Read [the architecture guide](docs/architecture.md) for folder responsibilities
and [the development guide](docs/development.md) for content editing and checks.

## Standalone projects

- [YouTube interface clone](projects/youtube-clone/README.md): edit its HTML/CSS
  source here; the Live demo opens `/demos/youtube-clone/index.html`.
- [Wordle assistant](projects/wordle-assistant/README.md): Python CLI using the
  same vocabulary as the browser demo in `public/wordle_words_texts/words.txt`.
- [Payment Review](projects/payment-review/README.md): separate Flask application
  with its own Python dependencies and PostgreSQL setup.

The website build prepares the YouTube demo automatically. During a running dev
session, use `npm run assets:prepare` after editing its source. Treat
`public/demos/youtube-clone/`, `dist/`, and test reports as generated output.

Accessibility coverage and manual verification limits are documented in
[the accessibility audit](docs/accessibility.md).
