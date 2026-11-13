# Development guide

## Choose the right starting point

Use the [root file-location table](../README.md#find-your-files) for common edits
and [architecture guide](architecture.md) for folder responsibilities. Each
standalone project has its own README with runtime requirements and commands.

## Add or edit portfolio content

1. Open the relevant folder in `src/content/`: `projects`, `challenges`, or `research`.
2. Copy a similar `.jsx` entry, give it a unique `meta.id`, and edit the metadata
   and default component.
3. Import and register the entry in that folder's `index.js`.
4. Check its list and detail pages in development.

Project IDs become `/projects/<id>`; challenges use `/problems/<id>`; research
uses `/research/<id>`. The corresponding list/detail components live in `src/pages/`.
For a new top-level page, register its route in `src/App.jsx` and navigation in
`src/components/layout/Header.jsx`.

Research PDFs belong in `public/documents/research/`. Each research entry's
`meta.documents` supplies titles, descriptions, paths relative to `public/`, and
page counts. Keep screenshots in `public/projects_images/` and give them descriptive alt
text in the case study.

The freeCodeCamp daily total is maintained manually. Update `DAILY_PROGRESS.solved`
and `DAILY_PROGRESS.updatedAt` together in
`src/features/freecodecamp/FreeCodeCampProfile.jsx`. Daily completions are separate
from curriculum exercises.

## Edit a feature or standalone demo

Website features live under `src/features/`; related state and algorithms stay
beside the component. Shared visual components live under `src/components/`.

For the YouTube clone, edit `projects/youtube-clone/index.html`, `youtube.css`,
and `styles/`. `npm run dev`, `npm start`, and `npm run build` prepare its public
copy automatically. After further edits during an existing dev session, run
`npm run assets:prepare` and refresh `/demos/youtube-clone/index.html`.

For Wordle, update the common vocabulary in `public/wordle_words_texts/words.txt`. Run Python
commands from `projects/wordle-assistant/`. The Python and browser solvers are
separate implementations, so an algorithm change should be checked in both.

## Verify changes

From the repository root:

```sh
npm run build
npm run lint
npm run test:a11y
```

For a focused YouTube check:

```sh
npx playwright test tests/accessibility/youtube.spec.js
```

The browser suite builds the website, serves it, checks current content routes
in light/dark themes, and exercises keyboard and dynamic behaviour. Windows
uses installed Chrome by default. See [accessibility.md](accessibility.md) for
browser setup, audit coverage, and manual checks still required.

Run the Python solver tests from `projects/wordle-assistant/`:

```sh
python -m unittest discover -s tests -v
python -m wordle --answer apple
```

Payment Review's integration tests need its Python dependencies, PostgreSQL, and
`DATABASE_URL`. Follow [that project's README](../projects/payment-review/README.md).

## Review changes as a team

Start a task branch from an updated `main`. Keep commits focused, push the branch,
and open a pull request with the problem, resulting behaviour, and verification.
Address review feedback on the same branch before merging. Generated output and
local environments stay ignored; commit their source and preparation scripts.
