'use client';

import { useEffect, useRef } from 'react';

const SPACING       = 28;
const BASE_R        = 1.2;
const MAX_R         = 2.8;
const INFLUENCE     = 110;
const BASE_OP_LIGHT = 0.18;
const BASE_OP_DARK  = 0.09;
const MAX_OP_LIGHT  = 0.45;
const MAX_OP_DARK   = 0.38;
const NOISE_AMP     = 0.06;

const dotNoise = (c: number, r: number) => {
  const s = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};

export default function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const isDark = () => document.documentElement.classList.contains('dark');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dark   = isDark();
      const baseOp = dark ? BASE_OP_DARK  : BASE_OP_LIGHT;
      const maxOp  = dark ? MAX_OP_DARK   : MAX_OP_LIGHT;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      const cols = Math.ceil(canvas.width  / SPACING) + 1;
      const rows = Math.ceil(canvas.height / SPACING) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x     = c * SPACING;
          const y     = r * SPACING;
          const dist  = Math.hypot(x - mx, y - my);
          const t     = Math.max(0, 1 - dist / INFLUENCE);
          const noise = dotNoise(c, r) * NOISE_AMP;

          const radius  = BASE_R + t * (MAX_R - BASE_R);
          const opacity = Math.max(0, baseOp + noise + t * (maxOp - baseOp));

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = dark
            ? `rgba(255,255,255,${opacity.toFixed(3)})`
            : `rgba(15,23,42,${opacity.toFixed(3)})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const onMove  = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = ()               => { mouse.current = { x: -9999, y: -9999 }; };

    resize();
    window.addEventListener('resize',     resize);
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize',     resize);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
