// ============================================================================
//  CanvasDemo.jsx  —  the interactive "rotating wireframe" home-page demo
// ============================================================================
//
//  PURPOSE: a small animated graphic that draws a spinning 3D wireframe cube
//  using the SAME ideas as the tinyrenderer project — projecting 3D points to
//  2D, then joining them with straight lines drawn pixel-by-pixel using
//  Bresenham's line algorithm. It is a tasteful "show, don't tell" nod to the
//  graphics work.
//
//  HOW IT WORKS IN REACT:
//    - useRef gives us the real <canvas> element once React has put it on the
//      page.
//    - Drawing and animating is a side effect, so all of it happens inside
//      useEffect. The empty [] dependency array means "run once, when this
//      component first appears".
//    - The function returned from the effect is the cleanup: React runs it
//      when you navigate away, so the animation and listeners stop.
//
//  ACCESSIBILITY / PERFORMANCE: it pauses when scrolled off-screen, stops if
//  the visitor prefers reduced motion (showing a still frame instead), and
//  shows a friendly message if the browser can't do canvas at all.
//
//  The code below is written for a JavaScript beginner — every step is
//  explained. It is safe to read top-to-bottom.
// ============================================================================

import { useEffect, useRef } from 'react';

function CanvasDemo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // ---- 1. Grab the <canvas> and its 2D drawing toolbox --------------------
    const canvas = canvasRef.current;
    // If the element isn't there, quietly give up.
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Browser can't draw — the fallback text stays visible.

    // Match the canvas's internal pixel grid to the size it is actually
    // displayed at, including high-density ("Retina") screens. Without this
    // the 600×360 drawing gets stretched to fill the page and looks blurry.
    const pixelRatio = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth || canvas.width;
    // Aim for a wide 5:3 shape, but never let the demo grow taller than about
    // two thirds of the window — on big screens the canvas spans the full
    // page width, and uncapped it would be taller than the screen itself.
    const displayHeight = Math.min(displayWidth * 0.6, window.innerHeight * 0.66);
    canvas.width = Math.round(displayWidth * pixelRatio);
    canvas.height = Math.round(displayHeight * pixelRatio);

    const width = canvas.width;
    const height = canvas.height;
    // The "pixels" Bresenham colours in scale with the screen density so the
    // lines stay the same visual thickness everywhere.
    const dotSize = 1.5 * pixelRatio;

    // Does the visitor prefer reduced motion? If so we'll draw ONE still
    // frame and never animate.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // ---- 2. Define the cube as 8 corners (vertices) in 3D space -------------
    // Each corner is [x, y, z], each between -1 and 1.
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // back face
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],  // front face
    ];

    // The 12 edges of the cube: each pair lists which two corners to join.
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back face
      [4, 5], [5, 6], [6, 7], [7, 4], // front face
      [0, 4], [1, 5], [2, 6], [3, 7], // connecting struts
    ];

    // ---- 3. Bresenham's line algorithm --------------------------------------
    // This is the classic way to decide which pixels to colour in to draw a
    // straight line between two points, using only addition and comparisons.
    // It's the heart of the tinyrenderer line-drawing exercise. Here we use
    // it to place small dots so you can literally see it stepping pixel to
    // pixel.
    function drawBresenhamLine(x0, y0, x1, y1, colour) {
      // Round to whole pixels.
      x0 = Math.round(x0); y0 = Math.round(y0);
      x1 = Math.round(x1); y1 = Math.round(y1);

      const dx = Math.abs(x1 - x0);   // horizontal distance
      const dy = -Math.abs(y1 - y0);  // vertical distance (negative by trick)
      const stepX = x0 < x1 ? 1 : -1; // step left or right
      const stepY = y0 < y1 ? 1 : -1; // step up or down
      let error = dx + dy;            // the running "error" that decides steps

      ctx.fillStyle = colour;
      // Walk from the start pixel to the end pixel, one step at a time.
      while (true) {
        ctx.fillRect(x0, y0, dotSize, dotSize); // colour the current pixel
        if (x0 === x1 && y0 === y1) break; // reached the end
        const doubleError = 2 * error;
        if (doubleError >= dy) { error += dy; x0 += stepX; } // step horizontally
        if (doubleError <= dx) { error += dx; y0 += stepY; } // step vertically
      }
    }

    // ---- 4. Project a 3D point onto the flat 2D screen ----------------------
    // We rotate the point around the Y and X axes by `angle`, then apply a
    // simple perspective divide (things further away look smaller), and
    // finally shift it to the middle of the canvas.
    function project(point, angle) {
      const [x, y, z] = point;

      // Rotate around the vertical (Y) axis.
      const cosY = Math.cos(angle), sinY = Math.sin(angle);
      const rx = x * cosY - z * sinY;
      let rz = x * sinY + z * cosY;

      // Rotate a little around the horizontal (X) axis for a nicer angle.
      const cosX = Math.cos(angle * 0.6), sinX = Math.sin(angle * 0.6);
      const ry = y * cosX - rz * sinX;
      rz = y * sinX + rz * cosX;

      // Perspective: divide by distance from the camera. Sizing the cube from
      // whichever canvas dimension is smaller keeps it fully in view whatever
      // shape the canvas ends up (very wide screens cap its height above).
      const distance = 4;
      const scale = Math.min(width * 0.18, height * 0.3) / (distance - rz);

      return [width / 2 + rx * scale, height / 2 + ry * scale];
    }

    // ---- 5. Draw one frame of the cube at a given rotation ------------------
    function drawFrame(angle) {
      // Clear the canvas each frame (a faint trail-free background).
      ctx.clearRect(0, 0, width, height);

      // Accent colour matches the site (indigo). Change here to recolour.
      const lineColour = '#818cf8';

      // For every edge, project its two endpoints to 2D and Bresenham them.
      for (const [a, b] of edges) {
        const [x0, y0] = project(vertices[a], angle);
        const [x1, y1] = project(vertices[b], angle);
        drawBresenhamLine(x0, y0, x1, y1, lineColour);
      }
    }

    // ---- 6. The animation loop (or a single still frame) --------------------
    let angle = 0;
    let animationId = null;
    let isVisible = true;

    function loop() {
      angle += 0.012;        // advance the rotation a touch each frame
      drawFrame(angle);
      animationId = requestAnimationFrame(loop); // ask for the next frame
    }

    function play() {
      if (animationId === null) loop();
    }
    function pause() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    // Named handler so we can remove it again during cleanup (below).
    function handleVisibilityChange() {
      if (document.hidden) pause();
      else if (isVisible) play();
    }

    let observer = null;

    if (prefersReducedMotion) {
      // Honour the accessibility setting: draw once, then stop.
      drawFrame(0.7);
    } else {
      // ---- 7. Only animate while the canvas is actually on screen ----------
      // This saves the visitor's battery/CPU when they scroll past it.
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
          if (isVisible) play();
          else pause();
        }
      });
      observer.observe(canvas);

      // Also pause when the browser tab is hidden.
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // ---- 8. Tidy up when navigating away -------------------------------------
    // React runs this returned function when the component leaves the page.
    // We stop the animation and disconnect our listeners so they don't
    // quietly pile up each time you visit the home page.
    return () => {
      pause();
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      {/* The drawing surface. If canvas is unavailable, the text inside is
          shown instead (graceful fallback). */}
      <canvas
        ref={canvasRef}
        width="600"
        height="360"
        className="block h-auto w-full"
        role="img"
        aria-label="An animated rotating 3D wireframe cube, drawn line by line."
      >
        A rotating 3D wireframe cube (your browser does not support canvas).
      </canvas>
      <figcaption className="px-4 py-2 text-center text-xs text-slate-500 dark:text-slate-400">
        A rotating wireframe, drawn line-by-line with Bresenham's algorithm —
        a nod to building a software renderer from scratch.
      </figcaption>
    </figure>
  );
}

export default CanvasDemo;
