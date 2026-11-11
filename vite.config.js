// ============================================================================
//  vite.config.js  —  the configuration file for Vite (the build tool)
// ============================================================================
//
//  WHAT THIS FILE DOES: tells Vite which plugins to use. You rarely touch it.
//    • react()       — lets Vite understand JSX and React components.
//    • tailwindcss() — wires in Tailwind CSS v4. Your design tokens (colours,
//                      fonts) live in src/styles/global.css, not here.
//
//  GITHUB PAGES NOTE (only if you deploy to  username.github.io/repo-name ):
//  uncomment the `base` line below and set it to "/your-repo-name/", and give
//  <BrowserRouter> in src/main.jsx the matching  basename="/your-repo-name".
//  With a custom domain or Cloudflare Pages, leave it commented out.
// ============================================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // base: '/your-repo-name/',
  plugins: [react(), tailwindcss()],
});
