import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

const COLORS = [
  'rgba(99,102,241,',   // indigo
  'rgba(139,92,246,',   // violet
  'rgba(59,130,246,',   // blue
  'rgba(6,182,212,',    // cyan
];

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const COUNT = 80;

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }

    function createParticle(): Particle {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 0.8,
        opacity: Math.random() * 0.5 + 0.15,
        color,
      };
    }

    function init() {
      particles = Array.from({ length: COUNT }, createParticle);
    }

    function drawAurora(t: number) {
      // Three slow-drifting aurora blobs
      const blobs = [
        { cx: width * 0.2, cy: height * 0.3, rx: width * 0.45, ry: height * 0.4, color: 'rgba(99,102,241,0.07)' },
        { cx: width * 0.75, cy: height * 0.6, rx: width * 0.4, ry: height * 0.35, color: 'rgba(139,92,246,0.06)' },
        { cx: width * 0.5, cy: height * 0.85, rx: width * 0.5, ry: height * 0.3, color: 'rgba(6,182,212,0.05)' },
      ];

      blobs.forEach((blob, i) => {
        const drift = Math.sin(t * 0.0003 + i * 1.7) * 60;
        const grd = ctx!.createRadialGradient(
          blob.cx + drift, blob.cy, 0,
          blob.cx + drift, blob.cy, blob.rx
        );
        grd.addColorStop(0, blob.color);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.ellipse(blob.cx + drift, blob.cy, blob.rx, blob.ry, 0, 0, Math.PI * 2);
        ctx!.fill();
      });
    }

    function drawConnections() {
      const maxDist = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx!.strokeStyle = `rgba(139,92,246,${alpha})`;
            ctx!.lineWidth = 0.6;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    }

    function update(t: number) {
      ctx!.clearRect(0, 0, width, height);

      // Dark base
      ctx!.fillStyle = '#09090b';
      ctx!.fillRect(0, 0, width, height);

      // Aurora glow blobs
      drawAurora(t);

      // Subtle grid
      ctx!.strokeStyle = 'rgba(255,255,255,0.025)';
      ctx!.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }

      // Particle connections
      drawConnections();

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const grd = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        grd.addColorStop(0, `${p.color}${p.opacity})`);
        grd.addColorStop(1, `${p.color}0)`);
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx!.fill();

        // Core dot
        ctx!.fillStyle = `${p.color}${p.opacity + 0.3})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      });

      animFrameId = requestAnimationFrame(update);
    }

    resize();
    init();
    animFrameId = requestAnimationFrame(update);

    window.addEventListener('resize', () => {
      resize();
      init();
    });

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
