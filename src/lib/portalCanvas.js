// ============================================================================
//  src/lib/portalCanvas.js  —  drawing code for the Home "portal" previews
// ============================================================================
//
//  WHAT IT IS: plain JavaScript (no React in here) that draws the small motif
//  inside each Home-page portal card:
//     "cubes" -> mini rotating wireframe cube
//     "graph" -> mini graph traversal (edges grow node-to-node)
//     "helix" -> mini horizontal DNA double helix
//
//  The React component src/components/SectionPortals.jsx owns the <canvas>
//  and calls startPortal() from a useEffect. It gets back three functions:
//  play() and stop() for hover/focus, and cleanup() for when the card goes away.
//  The preview is theme-aware and honours "prefers-reduced-motion".
// ============================================================================

function colors() {
  let d = document.documentElement.classList.contains('dark');
  return {
    line: d ? '129,140,248' : '79,70,229',
    node: d ? '165,180,252' : '99,102,241',
    glow: d ? '129,140,248' : '99,102,241'
  };
}
function proj(cx, cy, ang, tilt, scale) {
  let cy2 = Math.cos(ang), sy2 = Math.sin(ang), ct = Math.cos(tilt), st = Math.sin(tilt);
  return function (x, y, z) {
    let rx = x * cy2 - z * sy2, rz = x * sy2 + z * cy2;
    let ry = y * ct - rz * st; rz = y * st + rz * ct;
    let f = scale / (4.2 - rz);
    return [cx + rx * f, cy + ry * f, rz];
  };
}
function dotLine(ctx, x0, y0, x1, y1, rgb, al, gap, sz) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, step = 0, hs = sz / 2;
  ctx.fillStyle = 'rgba(' + rgb + ',' + al + ')';
  while (true) {
    if (step % gap === 0) ctx.fillRect(x0 - hs, y0 - hs, sz, sz);
    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
    step++; if (step > 3000) break;
  }
}
function dot(ctx, p, rgb, al, sz) {
  let s = sz * (0.7 + 0.6 * (p[2] + 1) / 2);
  ctx.fillStyle = 'rgba(' + rgb + ',' + (al * (0.5 + 0.45 * (p[2] + 1) / 2)) + ')';
  ctx.beginPath(); ctx.arc(p[0], p[1], s, 0, 6.283); ctx.fill();
}

let cV = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
let cE = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
function drawCube(ctx, w, h, ts, C) {
  ctx.clearRect(0, 0, w, h);
  let P = proj(w / 2, h / 2, ts * 0.0005, 0.5, Math.min(w, h) * 0.28);
  for (let i = 0; i < cE.length; i++) {
    let a = P(cV[cE[i][0]][0], cV[cE[i][0]][1], cV[cE[i][0]][2]);
    let b = P(cV[cE[i][1]][0], cV[cE[i][1]][1], cV[cE[i][1]][2]);
    let dz = (a[2] + b[2]) / 2;
    dotLine(ctx, a[0], a[1], b[0], b[1], C.line, 0.45 * (0.3 + 0.55 * (dz + 1) / 2), 5, 1.5);
  }
  for (let v = 0; v < cV.length; v++) dot(ctx, P(cV[v][0], cV[v][1], cV[v][2]), C.node, 0.5, 1.6);
}

function makeGraph(w, h) {
  let cols = 4, rows = 3, nodes = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    let x = (c + 0.5) / cols * w + (Math.random() - 0.5) * (w / cols) * 0.5;
    let y = (r + 0.5) / rows * h + (Math.random() - 0.5) * (h / rows) * 0.5;
    nodes.push({ x: x, y: y, bx: x, by: y, ph: Math.random() * 6.283 });
  }
  let edges = [], lim = Math.min(w / cols, h / rows) * 1.3;
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++)
    if (Math.hypot(nodes[i].bx - nodes[j].bx, nodes[i].by - nodes[j].by) < lim) edges.push([i, j]);
  let adj = nodes.map(function () { return []; });
  edges.forEach(function (e, k) { adj[e[0]].push([e[1], k]); adj[e[1]].push([e[0], k]); });
  let dist = nodes.map(function () { return Infinity; }); dist[0] = 0;
  let eTime = edges.map(function () { return Infinity; }); let q = [0];
  while (q.length) { let u = q.shift(); for (let m = 0; m < adj[u].length; m++) { let vv = adj[u][m][0], kk = adj[u][m][1]; if (dist[vv] === Infinity) { dist[vv] = dist[u] + 1; eTime[kk] = dist[vv]; q.push(vv); } else eTime[kk] = Math.min(eTime[kk], Math.max(dist[u], dist[vv])); } }
  let mx = 0; for (let d = 0; d < dist.length; d++) if (dist[d] < Infinity && dist[d] > mx) mx = dist[d];
  return { nodes: nodes, edges: edges, dist: dist, eTime: eTime, max: mx, t0: 0 };
}
function eg(t) { return t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t); }
function drawGraph(ctx, w, h, ts, C, st) {
  ctx.clearRect(0, 0, w, h);
  if (!st.g) { st.g = makeGraph(w, h); st.g.t0 = ts; }
  let G = st.g, STEP = 430, GROW = 360, elapsed = ts - G.t0;
  if (elapsed > G.max * STEP + GROW + 1300) { st.g = makeGraph(w, h); st.g.t0 = ts; return; }
  for (let i = 0; i < G.nodes.length; i++) { let n = G.nodes[i]; n.x = n.bx + Math.sin(ts * 0.0007 + n.ph) * 3; n.y = n.by + Math.cos(ts * 0.0008 + n.ph) * 3; }
  for (let k = 0; k < G.edges.length; k++) {
    let e = G.edges[k], A = G.nodes[e[0]], B = G.nodes[e[1]];
    ctx.strokeStyle = 'rgba(' + C.line + ',0.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    let p = eg((elapsed - G.eTime[k] * STEP) / GROW);
    if (p > 0) {
      let from = G.dist[e[0]] <= G.dist[e[1]] ? A : B, to = from === A ? B : A;
      let tx = from.x + (to.x - from.x) * p, ty = from.y + (to.y - from.y) * p;
      ctx.strokeStyle = 'rgba(' + C.line + ',0.55)'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(tx, ty); ctx.stroke();
      if (p < 1) { ctx.fillStyle = 'rgba(' + C.glow + ',0.9)'; ctx.beginPath(); ctx.arc(tx, ty, 1.8, 0, 6.283); ctx.fill(); }
    }
  }
  for (let m = 0; m < G.nodes.length; m++) { let nn = G.nodes[m], pr = eg((elapsed - G.dist[m] * STEP) / GROW); ctx.fillStyle = 'rgba(' + C.node + ',' + (0.4 + 0.55 * pr) + ')'; ctx.beginPath(); ctx.arc(nn.x, nn.y, 1.8 + 2 * pr, 0, 6.283); ctx.fill(); }
}

function drawHelix(ctx, w, h, ts, C) {
  ctx.clearRect(0, 0, w, h);
  let cy = h / 2, amp = Math.min(h * 0.26, 42), K = 0.02, Period = 2 * Math.PI / K;
  let scroll = (((ts * 0.045) % Period) + Period) % Period, spacing = 12, count = Math.ceil((w + Period) / spacing) + 2;
  function za(z) { return 0.3 + 0.55 * (z + 1) / 2; }
  function zw(z) { return 0.7 + 1.2 * (z + 1) / 2; }
  let A = [], B = [];
  for (let i = 0; i < count; i++) { let pos = i * spacing - scroll, a = pos * K; A.push({ x: pos, y: cy + Math.sin(a) * amp, z: Math.cos(a) }); B.push({ x: pos, y: cy + Math.sin(a + Math.PI) * amp, z: Math.cos(a + Math.PI) }); }
  for (let r = 0; r < count; r += 2) { let pa = A[r], pb = B[r]; ctx.strokeStyle = 'rgba(' + C.node + ',' + (za((pa.z + pb.z) / 2) * 0.45) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke(); }
  function strand(arr) { for (let i = 1; i < count; i++) { let p0 = arr[i - 1], p1 = arr[i], z = (p0.z + p1.z) / 2; ctx.strokeStyle = 'rgba(' + C.line + ',' + (za(z) * 0.85) + ')'; ctx.lineWidth = zw(z); ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); } }
  strand(A); strand(B);
}

const drawers = { cubes: drawCube, graph: drawGraph, helix: drawHelix };

export function startPortal(canvas, motif) {
  const noop = function () {};
  const nothing = { play: noop, stop: noop, cleanup: noop };
  if (!(canvas instanceof HTMLCanvasElement)) return nothing;
  const ctx = canvas.getContext('2d');
  if (!ctx) return nothing;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const draw = drawers[motif] || drawCube;
  let st = {}, dpr = 1, w = 0, h = 0, raf = null, running = false;

  function size() {
    dpr = window.devicePixelRatio || 1;
    // The canvas is stretched over the whole card, so its size is the card's.
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  function paint(ts) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(ctx, w, h, ts, colors(), st); }
  function loop(ts) { if (!running) return; paint(ts); raf = requestAnimationFrame(loop); }
  // A single still frame: what the card shows when it is not hovered.
  function still() { if (!w) size(); paint(performance.now()); }
  function play() { if (running || reduced) return; if (!w) size(); running = true; raf = requestAnimationFrame(loop); }
  function halt() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }
  function stop() { halt(); still(); }

  size();
  still();

  function onResize() { size(); if (!running) still(); }
  window.addEventListener('resize', onResize);

  // Re-colour the still frame when the theme toggle flips the .dark class.
  const themeObs = new MutationObserver(function () { if (!running) still(); });
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  function cleanup() {
    halt();
    window.removeEventListener('resize', onResize);
    themeObs.disconnect();
  }

  return { play: play, stop: stop, cleanup: cleanup };
}
