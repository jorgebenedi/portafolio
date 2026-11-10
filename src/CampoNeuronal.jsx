import { useEffect, useRef } from 'react';

// Fondo de la portada: una red neuronal muy tenue que ocupa todo.
// Los nodos flotan despacio; las conexiones son casi invisibles salvo cerca del cursor,
// donde se encienden en verde. Al cargar, aparece poco a poco.

const VERDE = '60, 240, 125';
const GRIS = '232, 230, 222';

export default function CampoNeuronal() {
  const lienzoRef = useRef(null);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    const caja = lienzo.parentElement;
    const ctx = lienzo.getContext('2d');
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0;
    let H = 0;
    let nodos = [];
    const crear = () => {
      const n = Math.round(Math.min(170, Math.max(55, (W * H) / 9500)));
      nodos = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 0.6 + Math.random() * 1.1,
        fase: Math.random() * Math.PI * 2,
      }));
    };
    const ajustar = () => {
      const r = caja.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      lienzo.width = Math.round(W * dpr);
      lienzo.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      crear();
    };
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(caja);

    const raton = { x: -9999, y: -9999, ax: -9999, ay: -9999 };
    const mover = (e) => {
      const r = lienzo.getBoundingClientRect();
      raton.x = e.clientX - r.left;
      raton.y = e.clientY - r.top;
    };
    const salir = () => {
      raton.x = -9999;
      raton.y = -9999;
    };
    window.addEventListener('pointermove', mover, { passive: true });
    document.addEventListener('pointerleave', salir);

    const DIST = 120;
    const ZONA = 220;
    const inicio = performance.now();
    let raf = 0;
    let activo = true;

    const dibujar = (ahora) => {
      const t = (ahora - inicio) / 1000;
      const aparece = quieto ? 1 : Math.min(t / 1.8, 1);
      // el foco del cursor se mueve con un poco de inercia
      if (raton.x < -999) {
        raton.ax = raton.x;
        raton.ay = raton.y;
      } else if (raton.ax < -999) {
        raton.ax = raton.x;
        raton.ay = raton.y;
      } else {
        raton.ax += (raton.x - raton.ax) * 0.12;
        raton.ay += (raton.y - raton.ay) * 0.12;
      }
      ctx.clearRect(0, 0, W, H);

      if (!quieto) {
        for (const n of nodos) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = W + 20;
          if (n.x > W + 20) n.x = -20;
          if (n.y < -20) n.y = H + 20;
          if (n.y > H + 20) n.y = -20;
        }
      }

      // conexiones
      for (let i = 0; i < nodos.length; i++) {
        const a = nodos[i];
        for (let j = i + 1; j < nodos.length; j++) {
          const b = nodos[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (Math.abs(dx) > DIST || Math.abs(dy) > DIST) continue;
          const d = Math.hypot(dx, dy);
          if (d > DIST) continue;
          const mx = (a.x + b.x) / 2 - raton.ax;
          const my = (a.y + b.y) / 2 - raton.ay;
          const cerca = Math.max(0, 1 - Math.hypot(mx, my) / ZONA);
          const base = (1 - d / DIST) * 0.085;
          if (cerca > 0) {
            ctx.strokeStyle = `rgba(${VERDE}, ${((base + cerca * 0.5 * (1 - d / DIST)) * aparece).toFixed(3)})`;
            ctx.lineWidth = 0.6 + cerca * 0.5;
          } else {
            ctx.strokeStyle = `rgba(${GRIS}, ${(base * aparece).toFixed(3)})`;
            ctx.lineWidth = 0.5;
          }
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // nodos
      for (const n of nodos) {
        const cerca = Math.max(0, 1 - Math.hypot(n.x - raton.ax, n.y - raton.ay) / ZONA);
        const parpadeo = 0.75 + 0.25 * Math.sin(t * 1.2 + n.fase);
        if (cerca > 0.05) {
          ctx.fillStyle = `rgba(${VERDE}, ${((0.25 + cerca * 0.7) * aparece).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + cerca * 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${GRIS}, ${(0.26 * parpadeo * aparece).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (activo && !quieto) raf = requestAnimationFrame(dibujar);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !activo) {
        activo = true;
        raf = requestAnimationFrame(dibujar);
      } else if (!e.isIntersecting && activo) {
        activo = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(caja);
    raf = requestAnimationFrame(dibujar);

    return () => {
      activo = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', mover);
      document.removeEventListener('pointerleave', salir);
    };
  }, []);

  return <canvas ref={lienzoRef} className="campo-neuronal" aria-hidden="true" />;
}
