// ============================================================================
//  src/lib/backgroundCanvas.js  —  the drawing code for the site background
// ============================================================================
//
//  WHAT IT IS: plain JavaScript (no React in here) that draws the faint, slow
//  wireframe animation behind every page on a <canvas>, in the site's indigo
//  accent. The React component src/components/Background.jsx owns the
//  <canvas> element and simply calls startBackground() from a useEffect.
//
//  MOTIFS (the component picks one per section of the site):
//    "morph"  -> morphing wireframe (box -> DNA helix -> graph, in a loop)
//    "cubes"  -> rotating wireframe cubes  (a nod to tinyrenderer)
//    "graph"  -> graph traversal (edges "grow" node-to-node, like BFS)
//    "helix"  -> vertical DNA double helix
//
//  ACCESSIBILITY / PERFORMANCE:
//    - pauses when the browser tab is hidden,
//    - honours "prefers-reduced-motion" by drawing a single still frame,
//    - re-colours live when the dark/light theme changes,
//    - returns a cleanup function that removes every listener it added.
// ============================================================================

export function startBackground(canvas, motif) {
  // Nothing to do if there is no canvas or the browser cannot draw on it.
  if (!(canvas instanceof HTMLCanvasElement)) return undefined;
  const ctx = canvas.getContext('2d');
  if (!ctx) return undefined;

  let dpr = 1, w = 0, h = 0, raf = null, running = false;
  let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    // Draw in CSS pixels on sharp ("Retina") screens: scale every drawing
    // command by the pixel ratio so the motif fills the whole viewport.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ---- theme-driven colours (read live every frame) --------------------
  function colors() {
    let d = document.documentElement.classList.contains('dark');
    return {
      line: d ? '129,140,248' : '79,70,229',
      node: d ? '165,180,252' : '99,102,241',
      glow: d ? '129,140,248' : '99,102,241',
      dim:  d ? '148,163,184' : '100,116,139'
    };
  }

  // ---- shared drawing utilities ---------------------------------------
  function makeProj(cx, cy, ang, tilt, scale) {
    let cy2 = Math.cos(ang), sy2 = Math.sin(ang), ct = Math.cos(tilt), st = Math.sin(tilt);
    return function (x, y, z) {
      let rx = x * cy2 - z * sy2, rz = x * sy2 + z * cy2;
      let ry = y * ct - rz * st; rz = y * st + rz * ct;
      let f = scale / (4.2 - rz);
      return [cx + rx * f, cy + ry * f, rz];
    };
  }
  function dotLine(x0, y0, x1, y1, rgb, al, gap, sz) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy, step = 0, hs = sz / 2;
    ctx.fillStyle = 'rgba(' + rgb + ',' + al + ')';
    while (true) {
      if (step % gap === 0) ctx.fillRect(x0 - hs, y0 - hs, sz, sz);
      if (x0 === x1 && y0 === y1) break;
      let e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
      step++; if (step > 5000) break;
    }
  }
  function dot(p, rgb, al, sz) {
    let s = sz * (0.7 + 0.6 * (p[2] + 1) / 2);
    ctx.fillStyle = 'rgba(' + rgb + ',' + (al * (0.5 + 0.45 * (p[2] + 1) / 2)) + ')';
    ctx.beginPath(); ctx.arc(p[0], p[1], s, 0, 6.283); ctx.fill();
  }

  // ---- MOTIF: morphing wireframe (box -> helix -> graph) ---------------
  let box = [
    [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],
    [0,-1,-1],[1,0,-1],[0,1,-1],[-1,0,-1],[0,-1,1],[1,0,1],[0,1,1],[-1,0,1]
  ];
  let boxE = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  let helix = [];
  for (let k = 0; k < 8; k++) { let yy = -1.15 + 2.3 * k / 7, th = k * 0.7; helix[k] = [Math.cos(th) * 0.62, yy, Math.sin(th) * 0.62]; }
  for (let k2 = 0; k2 < 8; k2++) { let y2 = -1.15 + 2.3 * k2 / 7, th2 = k2 * 0.7 + Math.PI; helix[8 + k2] = [Math.cos(th2) * 0.62, y2, Math.sin(th2) * 0.62]; }
  let helixE = [];
  for (let e1 = 0; e1 < 7; e1++) helixE.push([e1, e1 + 1]);
  for (let e2 = 0; e2 < 7; e2++) helixE.push([8 + e2, 8 + e2 + 1]);
  for (let e3 = 0; e3 < 8; e3++) helixE.push([e3, 8 + e3]);
  let graph = [
    [0,0.05,0.85],[0.85,0.4,0.15],[-0.8,0.55,0.25],[0.45,-0.75,0.4],[-0.5,-0.65,-0.35],
    [0.7,0.7,-0.5],[-0.9,-0.15,0.5],[0.2,0.9,0.3],[-0.35,0.15,-0.9],[0.62,-0.35,-0.7],
    [-0.65,0.8,-0.2],[0.35,0.35,0.75],[-0.15,-0.9,0.25],[0.9,-0.2,0.35],[-0.75,-0.4,-0.55],[0.15,0.6,-0.7]
  ];
  let graphE = [[0,1],[0,2],[0,11],[1,5],[1,13],[2,7],[2,10],[3,12],[3,9],[4,14],[4,8],[5,7],[6,15],[6,14],[8,15],[9,13],[11,7],[10,3],[12,4]];
  let shapes = { box: box, helix: helix, graph: graph };
  let edgeSets = { box: boxE, helix: helixE, graph: graphE };
  let order = ['box', 'helix', 'graph'];
  let mStars = null, mx = 0, my = 0;
  function smooth(t) { return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function drawMorph(ts, C) {
    let HOLD = 3600, MORPH = 2100, CYCLE = HOLD + MORPH, N = 16;
    ctx.clearRect(0, 0, w, h);
    if (!mStars) { mStars = []; for (let i = 0; i < 44; i++) mStars.push({ x: Math.random(), y: Math.random(), z: Math.random() }); }
    for (let s = 0; s < mStars.length; s++) {
      let p = mStars[s];
      let y = (((p.y + ts * 0.000010 * (0.3 + p.z)) % 1) + 1) % 1 * h;
      ctx.fillStyle = 'rgba(' + C.dim + ',' + (0.05 + p.z * 0.09) + ')';
      ctx.beginPath(); ctx.arc(p.x * w, y, 0.6 + p.z * 1.4, 0, 6.283); ctx.fill();
    }
    let base = Math.min(w, h) * 0.34;
    let ang = ts * 0.00022 + mx * 0.5;
    let tilt = 0.32 + my * 0.22;
    let P = makeProj(w / 2, h / 2, ang, tilt, base);
    let total = CYCLE * order.length, tt = (((ts % total) + total) % total);
    let idx = Math.floor(tt / CYCLE), loc = tt - idx * CYCLE, nxt = (idx + 1) % order.length;
    let te = loc < HOLD ? 0 : smooth((loc - HOLD) / MORPH);
    let A = shapes[order[idx]], B = shapes[order[nxt]];
    let proj = [];
    for (let i = 0; i < N; i++) proj[i] = P(lerp(A[i][0], B[i][0], te), lerp(A[i][1], B[i][1], te), lerp(A[i][2], B[i][2], te));
    function drawSet(list, mul) {
      if (mul <= 0.01) return;
      for (let q = 0; q < list.length; q++) {
        let pa = proj[list[q][0]], pb = proj[list[q][1]];
        let dz = (pa[2] + pb[2]) / 2;
        dotLine(pa[0], pa[1], pb[0], pb[1], C.line, mul * (0.3 + 0.5 * (dz + 1) / 2) * 0.9, 6, 1.9);
      }
    }
    drawSet(edgeSets[order[idx]], 1 - te);
    drawSet(edgeSets[order[nxt]], te);
    let graphy = order[idx] === 'graph' || order[nxt] === 'graph';
    for (let n = 0; n < N; n++) { let pulse = graphy ? 0.7 + 0.3 * Math.sin(ts * 0.002 + n) : 1; dot(proj[n], C.node, 0.9 * pulse, 2.1); }
  }

  // ---- MOTIF: rotating wireframe cubes ---------------------------------
  let cV = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  let cE = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  function drawCubes(ts, C) {
    ctx.clearRect(0, 0, w, h);
    let cx = w / 2, cy = h / 2, base = Math.min(w, h);
    function cube(ang, tilt, scale, al, gap, sz) {
      let P = makeProj(cx, cy, ang, tilt, scale);
      for (let i = 0; i < cE.length; i++) {
        let pa = P(cV[cE[i][0]][0], cV[cE[i][0]][1], cV[cE[i][0]][2]);
        let pb = P(cV[cE[i][1]][0], cV[cE[i][1]][1], cV[cE[i][1]][2]);
        let dz = (pa[2] + pb[2]) / 2;
        dotLine(pa[0], pa[1], pb[0], pb[1], C.line, al * (0.3 + 0.55 * (dz + 1) / 2), gap, sz);
      }
      for (let v = 0; v < cV.length; v++) dot(P(cV[v][0], cV[v][1], cV[v][2]), C.node, al, sz + 0.2);
    }
    cube(ts * 0.00026, 0.42, base * 0.24, 0.85, 6, 1.8);
    cube(-ts * 0.0004 + 2.1, 0.8, base * 0.10, 0.45, 5, 1.4);
  }

  // ---- MOTIF: graph traversal (edges grow node-to-node) ----------------
  let G = null;
  function buildGraph() {
    let div = 210;
    let cols = Math.max(3, Math.round(w / div)), rows = Math.max(2, Math.round(h / (div * 0.9)));
    let nodes = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      let x = (c + 0.5) / cols * w + (Math.random() - 0.5) * (w / cols) * 0.5;
      let y = (r + 0.5) / rows * h + (Math.random() - 0.5) * (h / rows) * 0.5;
      nodes.push({ x: x, y: y, bx: x, by: y, ph: Math.random() * 6.283 });
    }
    let edges = [], lim = Math.min(w / cols, h / rows) * 1.25;
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      let d = Math.hypot(nodes[i].bx - nodes[j].bx, nodes[i].by - nodes[j].by);
      if (d < lim) edges.push([i, j]);
    }
    let adj = nodes.map(function () { return []; });
    edges.forEach(function (e, ki) { adj[e[0]].push([e[1], ki]); adj[e[1]].push([e[0], ki]); });
    return { w: w, h: h, nodes: nodes, edges: edges, adj: adj, start: 0, t0: 0, wave: null };
  }
  function bfs(g, sNode) {
    let dist = g.nodes.map(function () { return Infinity; }); dist[sNode] = 0;
    let eTime = g.edges.map(function () { return Infinity; });
    let q = [sNode];
    while (q.length) {
      let u = q.shift();
      for (let a = 0; a < g.adj[u].length; a++) {
        let v = g.adj[u][a][0], ki = g.adj[u][a][1];
        if (dist[v] === Infinity) { dist[v] = dist[u] + 1; eTime[ki] = dist[v]; q.push(v); }
        else eTime[ki] = Math.min(eTime[ki], Math.max(dist[u], dist[v]));
      }
    }
    let mxd = 0; for (let i = 0; i < dist.length; i++) if (dist[i] < Infinity && dist[i] > mxd) mxd = dist[i];
    return { dist: dist, eTime: eTime, max: mxd };
  }
  function egrow(t) { return t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t); }
  function drawGraph(ts, C) {
    ctx.clearRect(0, 0, w, h);
    if (!G || G.w !== w || G.h !== h) { G = buildGraph(); G.t0 = ts; G.wave = bfs(G, G.start); }
    let STEP = 560, GROW = 460, HOLD = 1400;
    let elapsed = ts - G.t0;
    if (elapsed > G.wave.max * STEP + GROW + HOLD + 700) { G.start = Math.floor(Math.random() * G.nodes.length); G.t0 = ts; G.wave = bfs(G, G.start); }
    for (let i = 0; i < G.nodes.length; i++) { let n = G.nodes[i]; n.x = n.bx + Math.sin(ts * 0.0006 + n.ph) * 6; n.y = n.by + Math.cos(ts * 0.0007 + n.ph) * 6; }
    for (let kk = 0; kk < G.edges.length; kk++) {
      let e = G.edges[kk], A = G.nodes[e[0]], B = G.nodes[e[1]];
      ctx.strokeStyle = 'rgba(' + C.line + ',0.12)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      let p = egrow((elapsed - G.wave.eTime[kk] * STEP) / GROW);
      if (p > 0) {
        let from = G.wave.dist[e[0]] <= G.wave.dist[e[1]] ? A : B, to = from === A ? B : A;
        let tx = from.x + (to.x - from.x) * p, ty = from.y + (to.y - from.y) * p;
        ctx.strokeStyle = 'rgba(' + C.line + ',0.55)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(tx, ty); ctx.stroke();
        if (p < 1) { ctx.fillStyle = 'rgba(' + C.glow + ',0.9)'; ctx.beginPath(); ctx.arc(tx, ty, 2.2, 0, 6.283); ctx.fill(); }
      }
    }
    for (let m = 0; m < G.nodes.length; m++) {
      let nn = G.nodes[m];
      let pr = egrow((elapsed - G.wave.dist[m] * STEP) / GROW);
      let rad = 2.2 + 2.8 * pr;
      if (pr > 0 && pr < 1) { ctx.fillStyle = 'rgba(' + C.glow + ',' + (0.22 * pr) + ')'; ctx.beginPath(); ctx.arc(nn.x, nn.y, rad + 8, 0, 6.283); ctx.fill(); }
      ctx.fillStyle = 'rgba(' + C.node + ',' + (0.4 + 0.55 * pr) + ')';
      ctx.beginPath(); ctx.arc(nn.x, nn.y, rad, 0, 6.283); ctx.fill();
    }
  }

  // ---- MOTIF: vertical DNA double helix (seamless scroll) --------------
  function drawHelix(ts, C) {
    ctx.clearRect(0, 0, w, h);
    let along = h, cross = w, center = cross / 2, amp = Math.min(cross * 0.24, 150);
    let K = 0.016, Period = 2 * Math.PI / K;
    let scroll = (((ts * 0.05) % Period) + Period) % Period;
    let spacing = 20, count = Math.ceil((along + Period) / spacing) + 2;
    function za(z) { return 0.3 + 0.55 * (z + 1) / 2; }
    function zw(z) { return 0.8 + 1.4 * (z + 1) / 2; }
    let A = [], B = [];
    for (let i = 0; i < count; i++) {
      let pos = i * spacing - scroll, a = pos * K;
      A.push({ x: center + Math.sin(a) * amp, y: pos, z: Math.cos(a) });
      B.push({ x: center + Math.sin(a + Math.PI) * amp, y: pos, z: Math.cos(a + Math.PI) });
    }
    for (let r = 0; r < count; r += 2) {
      let pa = A[r], pb = B[r], zc = (pa.z + pb.z) / 2;
      ctx.strokeStyle = 'rgba(' + C.node + ',' + (za(zc) * 0.5) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }
    function strand(arr) {
      for (let i = 1; i < count; i++) {
        let p0 = arr[i - 1], p1 = arr[i], z = (p0.z + p1.z) / 2;
        ctx.strokeStyle = 'rgba(' + C.line + ',' + (za(z) * 0.9) + ')'; ctx.lineWidth = zw(z);
        ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
      }
    }
    strand(A); strand(B);
    let all = A.concat(B);
    for (let d = 0; d < all.length; d++) { let pp = all[d]; ctx.fillStyle = 'rgba(' + C.node + ',' + za(pp.z) + ')'; ctx.beginPath(); ctx.arc(pp.x, pp.y, 1.6 * zw(pp.z), 0, 6.283); ctx.fill(); }
  }

  // ---- pick the drawing function for the requested motif ---------------
  const motifs = { cubes: drawCubes, graph: drawGraph, helix: drawHelix, morph: drawMorph };
  const draw = motifs[motif] || drawMorph;

  // ---- loop + lifecycle -----------------------------------------------
  function frame(ts) { if (!running) return; draw(ts, colors()); raf = requestAnimationFrame(frame); }
  function play() { if (running || reduced) return; running = true; raf = requestAnimationFrame(frame); }
  function pause() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  size();
  if (reduced) { draw(0, colors()); } else { play(); }

  function onResize() { size(); G = null; mStars = null; if (reduced) draw(0, colors()); }
  function onVis() { if (document.hidden) pause(); else play(); }
  function onMove(e) { mx = (e.clientX / window.innerWidth) - 0.5; my = (e.clientY / window.innerHeight) - 0.5; }
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('mousemove', onMove);

  // Re-colour immediately when the theme toggle flips the .dark class.
  let themeObs = new MutationObserver(function () { if (reduced) draw(0, colors()); });
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Hand back a "cleanup" function. React calls it when the motif changes or
  // the component is removed, so listeners and animation frames never pile up.
  return function stopBackground() {
    pause();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('mousemove', onMove);
    themeObs.disconnect();
  };
}
