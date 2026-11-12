// ============================================================================
//  HeaderMorph.jsx  —  the small morphing wireframe next to the name
// ============================================================================
//
//  WHAT IT IS: a tiny <canvas> in the header showing a wireframe that morphs
//  box -> DNA helix -> graph in a loop, and turns to follow the mouse.
//
//  HOW IT WORKS IN REACT: same pattern as Background.jsx. A ref reaches the
//  real <canvas>, and useEffect starts the drawing code (plain JavaScript in
//  src/lib/morphCanvas.js) once, when the header first appears. The empty
//  dependency array [] means "run once"; the function startMorph() hands back
//  is the cleanup React runs if the header is ever removed.
//
//  Its size is set by the .header-morph rule in src/styles/global.css.
// ============================================================================

import { useEffect, useRef } from 'react';
import { startMorph } from '../lib/morphCanvas';

function HeaderMorph() {
  const canvasRef = useRef(null);

  useEffect(() => {
    return startMorph(canvasRef.current);
  }, []);

  return <canvas ref={canvasRef} className="header-morph" aria-hidden="true"></canvas>;
}

export default HeaderMorph;
