// ============================================================================
//  scripts/copy-404.js  —  runs automatically at the end of `npm run build`
// ============================================================================
//
//  WHY THIS EXISTS: this site is a single-page application (SPA). There is
//  only ONE real HTML file (dist/index.html); React Router shows the right
//  page for each URL inside the browser. So if a visitor opens a deep link
//  such as /projects/tinyrenderer directly, the web host looks for a file at
//  that path, finds nothing, and serves its "not found" page instead.
//
//  Static hosts (GitHub Pages, Cloudflare Pages) serve dist/404.html in that
//  situation. By making 404.html a copy of index.html, the app still loads,
//  React Router reads the URL, and the visitor sees the page they asked for.
// ============================================================================

import { copyFile } from 'fs/promises';

async function copyFallbackPage() {
  try {
    await copyFile('dist/index.html', 'dist/404.html');
    console.log('Copied dist/index.html to dist/404.html (SPA fallback).');
  } catch (err) {
    console.error('Could not create dist/404.html:', err);
    process.exitCode = 1;
  }
}

copyFallbackPage();
