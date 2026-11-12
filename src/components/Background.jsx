// ============================================================================
//  Background.jsx  —  the page background, chosen per section
// ============================================================================
//
//  WHAT IT IS: the thing drawn BEHIND the page content. Which one you get
//  depends on the section of the site you are in:
//
//    /            -> a soft purple gradient that drifts slowly (Home only).
//                    Pure CSS: see the #home-bg rule in src/styles/global.css.
//    /projects    -> rotating wireframe cubes  (a nod to tinyrenderer)
//    /problems    -> graph traversal (edges "grow" node-to-node, like BFS)
//    /research    -> vertical DNA double helix
//    everything else (About, Contact, 404) -> nothing: a clean plain page.
//
//  HOW IT WORKS IN REACT: there are two components in this file.
//    - WireframeCanvas is the <canvas> version. useRef gives us the real
//      <canvas> DOM element, and because drawing on a canvas is a side effect
//      it is started inside useEffect. The drawing code itself is plain
//      JavaScript and lives in src/lib/backgroundCanvas.js. startBackground()
//      returns a cleanup function; returning it from the effect means React
//      stops the old animation before starting a new one. The effect depends
//      on [motif], so it only restarts when you move to a different SECTION.
//    - Background (the default export) looks at the current URL and decides
//      which of the three options above to render.
// ============================================================================

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { startBackground } from '../lib/backgroundCanvas';

// Pick the wireframe motif for the current route (or null for "no canvas").
function motifFor(path) {
  if (path.startsWith('/projects')) return 'cubes';
  if (path.startsWith('/problems')) return 'graph';
  if (path.startsWith('/research')) return 'helix';
  return null;
}

function WireframeCanvas({ motif }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    return startBackground(canvasRef.current, motif);
  }, [motif]);

  return <canvas id="site-bg" ref={canvasRef} aria-hidden="true"></canvas>;
}

function Background() {
  const { pathname } = useLocation();

  // Home gets the gradient. It is an empty <div>; all the looks and the
  // motion come from CSS.
  if (pathname === '/') {
    return <div id="home-bg" aria-hidden="true"></div>;
  }

  const motif = motifFor(pathname);
  if (motif) {
    return <WireframeCanvas motif={motif} />;
  }

  // About, Contact and anything else: no background at all.
  return null;
}

export default Background;
