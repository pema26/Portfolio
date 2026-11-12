# Accessibility work

This branch targets WCAG 2.2 Level AA for the React portfolio. Automated results
are evidence for the checks they cover, not a claim of full WCAG conformance.

The supplied `HTML_CSS_Review.txt` and
`FrontEnd_Development_Libraries_Review.txt` informed the audit. Relevant topics
include semantic HTML, heading order, descriptive links, form labels, keyboard
focus, contrast, reduced motion, and dynamic content in single-page applications.
The course examples are reference material; the implementation uses native HTML
controls and adds ARIA where it supplies missing information.

## Changes and coverage

| Area | Implementation |
| --- | --- |
| Page structure | One main landmark and page heading; desktop and mobile links share a named navigation landmark; research and problem cards follow their section heading levels. |
| Keyboard navigation | The skip link focuses main content. Route changes, including browser Back, focus the new page heading. No positive tab indexes are introduced. |
| Focus visibility | Three-pixel focus outlines remain visible despite input utility classes. Cards and the file-upload control show an outline around the control. Header height is measured so scrolling accounts for the sticky bar. Forced-colour mode uses the system highlight colour. |
| Contrast | Text links have their own light/dark colour token; secondary text is darker in light mode. Button hover fills remain dark enough for white labels. Form borders are stronger. The supplied Home gradient palettes are preserved. |
| Motion | A named, keyboard-operable Reduce motion toggle stops decorative CSS and canvas motion and remembers the choice. The device preference takes precedence and updates live. Normal-motion visitors keep the existing animations. |
| Forms and feedback | Problem search has a visible label and a persistent result-count status. FASTA input has instructions, an invalid state, and an associated status message; its results can be focused and scrolled. |
| Data visualisation | The calendar retains its visual heatmap and pointer/touch daily readout. Its date selector and daily totals table were removed at the owner's request. The rating chart retains keyboard focus, Escape dismissal, hoverable tooltips, and its captioned contest table. |
| Wordle demo | Command, guess, and feedback fields have readable labels. New output uses a named log; loading and benchmark states have status messages. Commands preserve focus, benchmarks expose Stop, and loading failures offer a retry. Code and terminal output are keyboard-scrollable. |
| Responsive layout | Navigation remains usable at narrow widths; Contact details stack; long text wraps. The suite checks 320 CSS pixels with increased line, letter, word, and paragraph spacing. |
| Documents and images | Original research PDFs retain descriptive open/download links and named optional previews. Existing project screenshot alt text is preserved. Decorative canvases and icons remain hidden from screen readers. |

The normal-text contrast target is 4.5:1; essential non-text control indicators
target 3:1. The light link colour `#4338ca` has at least 7.12:1 contrast against
the supplied light gradient stops. Light secondary text `#475569` has at least
6.83:1. The dark link colour `#c7d2fe` has at least 10.30:1 against the dark
gradient stops. These calculations do not replace inspection of hover, focus,
transparent surfaces, or animated backgrounds.

## Run the checks

Baseline audit on 12 November 2026 in Chrome: **90 checks passed** against a fresh
production build. This includes 64 axe route scans (32 routes in each theme)
and 26 checks of navigation, interactions, reflow, contrast, motion, and failures.
Desktop dark-mode and 320-pixel light-mode screenshots were also inspected.

The calendar was subsequently simplified at the owner's request. Its regression
test now covers the pointer readout and absence of the removed controls, rather
than keyboard date selection. Automated scans do not establish keyboard access
to individual calendar days.

After this change, the production build and six targeted checks passed: the
Problems-page axe scan, calendar pointer behaviour, and narrow-layout checks in
both light and dark modes.

The completed YouTube HTML/CSS demo is also included in the route audits. Sixteen
targeted checks passed across the initial run and corrected-test rerun in both
themes: Home, Projects, project-detail and demo axe scans, portfolio reflow,
project completion and learning links, native menu/search keyboard interaction,
image loading, and responsive demo layouts. This was a targeted verification;
the entire suite was not rerun for this addition.

```sh
npm install
npm run test:a11y
```

The suite builds the production site, audits every current top-level and content
route in both themes with axe, and tests keyboard and dynamic interactions. It
also covers network failures, live device-motion changes, persisted motion
settings, forced colours, and narrow layouts. Codeforces responses are fixtures
so the accessibility tests do not depend on an external service being available.

On Windows the suite uses an installed Chrome. On other systems it uses
Playwright's Chromium; install it with `npx playwright install chromium`. To use
that Chromium on Windows as well:

```powershell
npx playwright install chromium
$env:PLAYWRIGHT_CHANNEL = 'chromium'
npm run test:a11y
```

Failures save screenshots and traces under ignored `test-results/`. Both themes
must pass; do not disable contrast rules or exclude difficult components to make
the report green.

## Manual checks still required

- Test with NVDA and Chrome/Firefox on Windows and VoiceOver with Safari. Confirm
  heading/link navigation, route announcements, terminal output,
  and PDF preview entry/exit. Browser automation does not verify spoken output.
- Check real browser zoom at 200% and 400%, touch devices, and a full keyboard
  pass, including long chart tables and file-upload dialogs. A narrow viewport
  and text-spacing test cover useful cases but do not replace these checks.
- Individual calendar-day totals currently require pointer/touch interaction.
  The calendar can be scrolled with the keyboard, but has no equivalent keyboard
  interface for selecting a day after removal of the date selector and daily table.
- Review motion, focus and contrast visually across animation frames, themes,
  and hover states. Use the reduced-motion control when motion is distracting.
- Check the research PDFs in a document accessibility tool and with a screen
  reader. All three contain `/StructTreeRoot` and an English language declaration,
  but the presence of tags does not verify reading order, figure descriptions,
  equations, or table associations. The HTML research summaries are not full-text
  equivalents of the PDFs. Native PDF viewers and linked third-party sites are
  outside axe's portfolio-page scan.
- Replace `public/cv.pdf`: it currently contains only “Placeholder CV - replace
  public/cv.pdf”, has no structure tags, and declares no language. A real CV should
  have proper document tags; an HTML version would provide another reading option.
- Include feedback from people using assistive technology before describing the
  site as fully accessible. There is currently no audio/video content; provide
  appropriate captions, transcripts, and descriptions if it is added.

## References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Pause, stop, hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide)
- [Focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- [Target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [ARIA principles](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
- [Playwright accessibility testing and its limits](https://playwright.dev/docs/accessibility-testing)
