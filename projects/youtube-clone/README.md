# YouTube interface clone

An HTML/CSS-only homepage. Native links, the search form, and the disclosure
menu use browser behaviour; the demo has no JavaScript.

| File or folder | Purpose |
| --- | --- |
| `index.html` | Page structure, links, menu, and native search form |
| `youtube.css` | Imports the three stylesheets |
| `styles/general.css` | Shared styles, sidebar, and responsive layout |
| `styles/header.css` | Header and controls |
| `styles/video.css` | Video cards and grid |
| `thumbnails/`, `channel-pictures/` | Local demo images |

Edit these source files. From the repository root, `npm run dev` prepares the
demo and starts the portfolio. Open `/projects/youtube-clone` and use Live demo,
or visit `/demos/youtube-clone/index.html` directly.

If development is already running, run `npm run assets:prepare` after edits.
The generated `public/demos/youtube-clone/` copy is ignored by Git. A production
build includes the same demo at the same public URL.

