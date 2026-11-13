// ============================================================================
//  src/components/layout/animation/morphCanvas.js: drawing code for the header's morphing wireframe
// ============================================================================
//
//  WHAT IT IS: plain JavaScript (no React in here) that draws a small
//  wireframe which continuously spins and morphs box -> DNA helix -> graph.
//  When the mouse comes close within the header, it also turns and tilts towards it.
//  The React component src/components/layout/animation/HeaderMorph.jsx owns the <canvas>
//  and calls startMorph() from a useEffect.
//
//  HOW THE MORPH WORKS: all three shapes are described with the SAME number of
//  3D points (16). To morph, every point slides in a straight line from its
//  place in one shape to its place in the next ("linear interpolation"), while
//  the old shape's edges fade out and the new shape's edges fade in.
//
//  ACCESSIBILITY / PERFORMANCE:
//    - honours "prefers-reduced-motion" by never animating,
//    - re-colours live when the dark/light theme changes,
//    - returns a cleanup function that removes every listener it added.
// ============================================================================

// ---- the three shapes: 16 points each, plus which points are joined -------
const box = [
  [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],
  [0,-1,-1],[1,0,-1],[0,1,-1],[-1,0,-1],[0,-1,1],[1,0,1],[0,1,1],[-1,0,1],
];
const boxE = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

const helix = [];
for (let k = 0; k < 8; k++) {
  const y = -1.15 + 2.3 * k / 7, th = k * 0.7;
  helix[k] = [Math.cos(th) * 0.62, y, Math.sin(th) * 0.62];
  helix[8 + k] = [Math.cos(th + Math.PI) * 0.62, y, Math.sin(th + Math.PI) * 0.62];
}
const helixE = [];
for (let k = 0; k < 7; k++) { helixE.push([k, k + 1]); helixE.push([8 + k, 9 + k]); }
for (let k = 0; k < 8; k++) helixE.push([k, 8 + k]);

const graph = [
  [0,0.05,0.85],[0.85,0.4,0.15],[-0.8,0.55,0.25],[0.45,-0.75,0.4],[-0.5,-0.65,-0.35],
  [0.7,0.7,-0.5],[-0.9,-0.15,0.5],[0.2,0.9,0.3],[-0.35,0.15,-0.9],[0.62,-0.35,-0.7],
  [-0.65,0.8,-0.2],[0.35,0.35,0.75],[-0.15,-0.9,0.25],[0.9,-0.2,0.35],[-0.75,-0.4,-0.55],[0.15,0.6,-0.7],
];
const graphE = [[0,1],[0,2],[0,11],[1,5],[1,13],[2,7],[2,10],[3,12],[3,9],[4,14],[4,8],[5,7],[6,15],[6,14],[8,15],[9,13],[11,7],[10,3],[12,4]];

const shapes = [
  { points: box, edges: boxE },
  { points: helix, edges: helixE },
  { points: graph, edges: graphE },
];

const HOLD = 3600;  // milliseconds a shape keeps its form while rotating
const MORPH = 2100; // milliseconds a morph takes
const CYCLE = HOLD + MORPH;
const N = 16;
// EDIT HERE: how close (in pixels, measured from the middle of the shape) the
// mouse has to be before the shape follows it.
const NEAR = 110;

function smooth(t) { return t * t * (3 - 2 * t); }
function lerp(a, b, t) { return a + (b - a) * t; }

function colors() {
  const d = document.documentElement.classList.contains('dark');
  return { line: d ? '129,140,248' : '79,70,229', node: d ? '165,180,252' : '99,102,241' };
}

export function startMorph(canvas, options = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) return undefined;
  const ctx = canvas.getContext('2d');
  if (!ctx) return undefined;
  const interactionArea = canvas.closest('header') || canvas;

  const reduced = options.reducedMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dpr = 1, w = 0, h = 0, raf = null, running = false;
  // Where the mouse is relative to the shape (-1 … 1 across the NEAR circle),
  // and a smoothed copy that chases it so the shape glides rather than jumps.
  let targetX = 0, targetY = 0, mx = 0, my = 0;
  // Keep animation time across pauses, so returning to the tab resumes smoothly.
  let clock = 0, last = null;

  function size() {
    dpr = window.devicePixelRatio || 1;
    // The canvas is sized by CSS (.header-morph); match the drawing surface to it.
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }

  function draw(ts) {
    const C = colors();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    mx += (targetX - mx) * 0.08;
    my += (targetY - my) * 0.08;

    // Turn the 3D points: spin around the vertical axis (plus the mouse's
    // left/right), tilt with the mouse's up/down, then apply perspective.
    const ang = ts * 0.0005 + mx * 0.9;
    const tilt = 0.32 + my * 0.6;
    const scale = Math.min(w, h) * 1.15;
    const ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(tilt), st = Math.sin(tilt);
    function project(x, y, z) {
      const rx = x * ca - z * sa;
      let rz = x * sa + z * ca;
      const ry = y * ct - rz * st;
      rz = y * st + rz * ct;
      const f = scale / (4.2 - rz);
      return [w / 2 + rx * f, h / 2 + ry * f, rz];
    }

    // Which shape are we on, and how far through the morph to the next one?
    const total = CYCLE * shapes.length;
    const tt = ((ts % total) + total) % total;
    const idx = Math.floor(tt / CYCLE), loc = tt - idx * CYCLE;
    const from = shapes[idx], to = shapes[(idx + 1) % shapes.length];
    const te = loc < HOLD ? 0 : smooth((loc - HOLD) / MORPH);

    const pts = [];
    for (let i = 0; i < N; i++) {
      const a = from.points[i], b = to.points[i];
      pts[i] = project(lerp(a[0], b[0], te), lerp(a[1], b[1], te), lerp(a[2], b[2], te));
    }

    function drawEdges(list, strength) {
      if (strength <= 0.01) return;
      ctx.lineWidth = 1;
      for (let q = 0; q < list.length; q++) {
        const pa = pts[list[q][0]], pb = pts[list[q][1]];
        const depth = ((pa[2] + pb[2]) / 2 + 1) / 2; // 0 = far, 1 = near
        ctx.strokeStyle = 'rgba(' + C.line + ',' + (strength * (0.3 + 0.6 * depth)) + ')';
        ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke();
      }
    }
    drawEdges(from.edges, 1 - te);
    drawEdges(to.edges, te);

    for (let n = 0; n < N; n++) {
      const depth = (pts[n][2] + 1) / 2;
      ctx.fillStyle = 'rgba(' + C.node + ',' + (0.5 + 0.45 * depth) + ')';
      ctx.beginPath(); ctx.arc(pts[n][0], pts[n][1], 0.8 + 0.7 * depth, 0, 6.283); ctx.fill();
    }
  }

  function frame(ts) {
    if (!running) return;
    if (last !== null) clock += ts - last; // add the time since the last frame
    last = ts;
    draw(clock);
    raf = requestAnimationFrame(frame);
  }
  function play() { if (running || reduced) return; running = true; last = null; raf = requestAnimationFrame(frame); }
  function pause() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  size();
  draw(clock);
  if (!document.hidden) play();

  function onResize() { size(); draw(clock); }
  function onVis() { if (document.hidden) pause(); else play(); }
  function onMove(e) {
    // How far is the mouse from the middle of the shape?
    const r = canvas.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) <= NEAR) {
      targetX = dx / NEAR;
      targetY = dy / NEAR;
    } else {
      targetX = 0;
      targetY = 0;
    }
  }
  function onLeave() { targetX = 0; targetY = 0; }
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVis);
  // Keep pointer interaction inside the header, including its vertical bounds.
  interactionArea.addEventListener('mousemove', onMove);
  interactionArea.addEventListener('mouseleave', onLeave);

  // Re-colour the still frame when the theme toggle flips the .dark class.
  const themeObs = new MutationObserver(function () { if (!running) draw(clock); });
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  return function stopMorph() {
    pause();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    interactionArea.removeEventListener('mousemove', onMove);
    interactionArea.removeEventListener('mouseleave', onLeave);
    themeObs.disconnect();
  };
}
