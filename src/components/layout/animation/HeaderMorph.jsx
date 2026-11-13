// ============================================================================
//  HeaderMorph.jsx  —  the small morphing wireframe next to the name
// ============================================================================
//
//  WHAT IT IS: a tiny <canvas> in the header showing a wireframe that morphs
//  box -> DNA helix -> graph continuously, and turns to follow the mouse
//  when it is close by and inside the header bar.
//
//  HOW IT WORKS IN REACT: same pattern as Background.jsx. A ref reaches the
//  real <canvas>, and useEffect starts the drawing code (plain JavaScript in
//  src/components/layout/animation/morphCanvas.js). It restarts as a still frame when reduced motion
//  is enabled. startMorph() returns cleanup for restarts and unmounting.
//
//  Its size is set by the .header-morph rule in src/styles/global.css.
// ============================================================================

import { useEffect, useRef } from 'react';
import { startMorph } from './morphCanvas';
import { useMotion } from '../../../features/preferences/useMotion';

function HeaderMorph() {
  const canvasRef = useRef(null);
  const { reducedMotion } = useMotion();

  useEffect(() => {
    return startMorph(canvasRef.current, { reducedMotion });
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="header-morph" aria-hidden="true"></canvas>;
}

export default HeaderMorph;
