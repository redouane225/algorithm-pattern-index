"use client";
/* eslint-disable @typescript-eslint/no-non-null-assertion -- indices are always derived from the arrays they access */

import { useEffect, useRef } from "react";

type V3 = [number, number, number];

// Fibonacci sphere: evenly spread 3D nodes
function sphere(n: number): V3[] {
  const pts: V3[] = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = g * i;
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return pts;
}

const COLORS = ["#3B82F6", "#EF4444", "#9CA3AF"];

export function HeroGraph3D() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes = sphere(42);
    const colors = nodes.map((_, i) => COLORS[i % 3]);
    // connect each node to its 3 nearest neighbours
    const edges: [number, number][] = [];
    nodes.forEach((a, i) => {
      nodes
        .map((b, j) => ({ j, d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 }))
        .filter((o) => o.j > i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 3)
        .forEach((o) => edges.push([i, o.j]));
    });

    // travelling pulses along edges
    const pulses = Array.from({ length: 3 }, () => ({ e: Math.floor(Math.random() * edges.length), t: Math.random() }));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    const mouse = { x: 0, y: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
      mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 0.6;
    };
    window.addEventListener("pointermove", onMove);

    let rotY = 0;
    let tiltX = 0.35, tiltY = 0;
    const lit = new Float32Array(nodes.length);

    const frame = () => {
      if (!reduce) rotY += 0.0025;
      tiltX += (0.35 + mouse.y - tiltX) * 0.04;
      tiltY += (mouse.x - tiltY) * 0.04;

      const R = Math.min(w, h) * 0.36;
      const cx = w / 2, cy = h / 2;
      const cyR = Math.cos(rotY + tiltY), syR = Math.sin(rotY + tiltY);
      const cxR = Math.cos(tiltX), sxR = Math.sin(tiltX);

      const proj = nodes.map(([x, y, z]) => {
        const x1 = x * cyR + z * syR;
        const z1 = -x * syR + z * cyR;
        const y2 = y * cxR - z1 * sxR;
        const z2 = y * sxR + z1 * cxR;
        const s = 2.6 / (2.6 + z2); // perspective
        return { x: cx + x1 * R * s, y: cy + y2 * R * s, z: z2, s };
      });

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // edges (depth-faded)
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const pa = proj[a]!, pb = proj[b]!;
        const depth = 1 - ((pa.z + pb.z) / 2 + 1) / 2; // 0 back .. 1 front
        ctx.strokeStyle = `rgba(255,255,255,${0.03 + depth * 0.14})`;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      // pulses
      for (const p of pulses) {
        if (!reduce) p.t += 0.0035;
        const [a, b] = edges[p.e]!;
        if (p.t >= 1) {
          lit[b] = 0.6;
          // hop to a connected edge
          const next = edges.map((e, i) => ({ e, i })).filter(({ e }) => e[0] === b || e[1] === b);
          const pick = next[Math.floor(Math.random() * next.length)]!;
          p.e = pick.i;
          if (pick.e[1] === b) edges[p.e] = [b, pick.e[0]];
          p.t = 0;
          continue;
        }
        const pa = proj[a]!, pb = proj[b]!;
        // ease in/out so the light glides instead of snapping
        const e = p.t * p.t * (3 - 2 * p.t);
        const x = pa.x + (pb.x - pa.x) * e;
        const y = pa.y + (pb.y - pa.y) * e;
        const t0 = Math.max(0, e - 0.35);
        // fade in at start and out at end of each edge
        const fade = Math.sin(Math.PI * p.t);
        const g = ctx.createLinearGradient(pa.x + (pb.x - pa.x) * t0, pa.y + (pb.y - pa.y) * t0, x, y);
        g.addColorStop(0, "rgba(96,165,250,0)");
        g.addColorStop(1, `rgba(147,197,253,${0.4 * fade})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.1;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(pa.x + (pb.x - pa.x) * t0, pa.y + (pb.y - pa.y) * t0);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // nodes back-to-front
      const order = proj.map((_, i) => i).sort((i, j) => proj[j]!.z - proj[i]!.z);
      for (const i of order) {
        const p = proj[i]!;
        const c = colors[i]!;
        const L = lit[i]! * 0.988;
        lit[i] = L;
        const depth = 1 - (p.z + 1) / 2;
        const r = (1.6 + depth * 2.4) * p.s * (1 + L * 0.4);
        if (L > 0.03) {
          ctx.globalAlpha = L * 0.18;
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.25 + depth * 0.6 + L * 0.2;
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}
