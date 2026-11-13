// ============================================================================
//  src/hooks/usePageMeta.js: custom hook: set the tab title + description
// ============================================================================
//
//  PURPOSE: every page calls this once with its own title and description:
//
//      usePageMeta('About | Pema Tsering', 'A little about me.');
//
//  Changing the browser tab's title is a "side effect" (something outside of
//  React's rendering), so it belongs in a useEffect. The effect re-runs only
//  when the title or description actually changes.
// ============================================================================

import { useEffect } from 'react';

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title;

    // The <meta name="description"> tag already exists in index.html; we just
    // update its content for the current page.
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', description);
    }
  }, [title, description]);
}
