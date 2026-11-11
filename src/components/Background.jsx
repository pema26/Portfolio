// ============================================================================
//  Background.jsx  —  site-wide animated wireframe background
// ============================================================================
//
//  WHAT IT IS: a single full-viewport <canvas> that draws a faint, slow
//  wireframe animation behind every page, in the site's own indigo accent.
//  It picks a different motif per section, and re-colours instantly when the
//  dark/light theme changes.
//
//  MOTIF PER ROUTE:
//    /projects    -> rotating wireframe cubes  (a nod to tinyrenderer)
//    /problems    -> graph traversal (edges "grow" node-to-node, like BFS)
//    /research    -> vertical DNA double helix
//    everything else -> morphing wireframe (box -> DNA helix -> graph)
//
//  HOW IT WORKS IN REACT:
//    - useRef gives us the real <canvas> DOM element.
//    - Drawing on a canvas is a side effect, so it is started inside
//      useEffect. The drawing code itself is plain JavaScript and lives in
//      src/lib/backgroundCanvas.js.
//    - startBackground() returns a cleanup function. Returning it from the
//      effect means React stops the old animation before starting a new one.
//    - The effect depends on [motif], so it only restarts when you move to a
//      different SECTION of the site, not on every page change.
//
//  The canvas is positioned by the #site-bg rule in src/styles/global.css.
// ============================================================================

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { startBackground } from '../lib/backgroundCanvas';

// Pick the motif for the current route.
function motifFor(path) {
  if (path.startsWith('/projects')) return 'cubes';
  if (path.startsWith('/problems')) return 'graph';
  if (path.startsWith('/research')) return 'helix';
  return 'morph';
}

function Background() {
  const canvasRef = useRef(null);
  const motif = motifFor(useLocation().pathname);

  useEffect(() => {
    return startBackground(canvasRef.current, motif);
  }, [motif]);

  return <canvas id="site-bg" ref={canvasRef} aria-hidden="true"></canvas>;
}

export default Background;
