import { useEffect, useRef } from 'react';
import red from './red-perfil.json';

// Red neuronal viva con forma de perfil humano.
// Los puntos llegan dispersos y se ensamblan, las conexiones se encienden y se desvanecen,
// unas señales recorren la red como pensamientos y los puntos se apartan del ratón.

const VERDE = '60, 240, 125';
const RADIO_RATON = 90;

const easeOut = (k) => 1 - Math.pow(1 - k, 3);

export default function RedNeuronal() {
  const lienzoRef = useRef(null);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    const caja = lienzo.parentElement;
    const ctx = lienzo.getContext('2d');
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // puntos: destino (del perfil), origen disperso y retraso de llegada
    const puntos = red.puntos.map(([tx, ty, b], i) => {
      const ang = Math.random() * Math.PI * 2;
      const dist = 0.35 + Math.random() * 0.45;
      return {
        tx, ty, b,
        sx: 0.5 + Math.cos(ang) * dist,
        sy: 0.5 + Math.sin(ang) * dist,
        retraso: 0.15 + (1 - b) * 0.5 + Math.random() * 0.9,
        fase: Math.random() * Math.PI * 2,
        x: 0, y: 0, a: 0,
        i,
      };
    });
    const lineas = red.lineas.map(([i, j]) => ({ i, j, fase: Math.random() * Math.PI * 2 }));
    const vecinos = puntos.map(() => []);
    lineas.forEach((l, k) => {
      vecinos[l.i].push(k);
      vecinos[l.j].push(k);
    });

    let W = 0;
    let H = 0;
    const ajustar = () => {
      const r = caja.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      lienzo.width = Math.round(W * dpr);
      lienzo.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(caja);

    const raton = { x: -9999, y: -9999 };
    const mover = (e) => {
      const r = lienzo.getBoundingClientRect();
      raton.x = e.clientX - r.left;
      raton.y = e.clientY - r.top;
    };
    const salir = () => {
      raton.x = -9999;
      raton.y = -9999;
    };
    caja.addEventListener('pointermove', mover);
    caja.addEventListener('pointerleave', salir);

    // señales: un destello que viaja por una línea y salta a la siguiente
    const senales = [];
    let proximaSenal = 2.6;
    const nuevaSenal = (desde) => {
      const p = desde ?? Math.floor(Math.random() * puntos.length);
      const opciones = vecinos[p];
      if (!opciones.length) return;
      const k = opciones[Math.floor(Math.random() * opciones.length)];
      const l = lineas[k];
      senales.push({ desde: p, hasta: l.i === p ? l.j : l.i, t: 0, saltos: 6 + Math.floor(Math.random() * 6) });
    };

    let inicio = performance.now();
    let ultimo = inicio;
    let raf = 0;
    let activo = true;

    const dibujar = (ahora) => {
      const t = quieto ? 99 : (ahora - inicio) / 1000;
      const dt = Math.min((ahora - ultimo) / 1000, 0.05);
      ultimo = ahora;
      ctx.clearRect(0, 0, W, H);

      // posiciones
      for (const p of puntos) {
        const k = Math.min(Math.max((t - p.retraso) / 1.7, 0), 1);
        const e = easeOut(k);
        let x = (p.sx + (p.tx - p.sx) * e) * W;
        let y = (p.sy + (p.ty - p.sy) * e) * H;
        // respiración suave una vez formado
        x += Math.sin(t * 0.7 + p.fase) * 1.4 * e;
        y += Math.cos(t * 0.55 + p.fase) * 1.4 * e;
        // se apartan del ratón
        const dx = x - raton.x;
        const dy = y - raton.y;
        const d = Math.hypot(dx, dy);
        if (d < RADIO_RATON && d > 0.01) {
          const f = (1 - d / RADIO_RATON) ** 2 * 22;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }
        p.x = x;
        p.y = y;
        p.a = e;
      }

      // conexiones: se encienden y se desvanecen
      ctx.lineWidth = 0.6;
      for (const l of lineas) {
        const a = puntos[l.i];
        const b = puntos[l.j];
        const forma = Math.min(a.a, b.a);
        if (forma < 0.05) continue;
        const brillo = 0.1 + 0.26 * (0.5 + 0.5 * Math.sin(t * 1.1 + l.fase));
        ctx.strokeStyle = `rgba(${VERDE}, ${(forma * brillo).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // puntos
      for (const p of puntos) {
        if (p.a < 0.02) continue;
        const r = 0.7 + 1.3 * p.b;
        const alfa = p.a * (0.45 + 0.55 * p.b) * (0.8 + 0.2 * Math.sin(t * 1.6 + p.fase));
        if (p.b > 0.7) {
          ctx.fillStyle = `rgba(${VERDE}, ${(alfa * 0.18).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${VERDE}, ${alfa.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // señales viajando por la red
      if (!quieto) {
        if (t > proximaSenal) {
          nuevaSenal();
          proximaSenal = t + 0.35 + Math.random() * 0.6;
        }
        for (let s = senales.length - 1; s >= 0; s--) {
          const sg = senales[s];
          sg.t += dt / 0.32;
          const a = puntos[sg.desde];
          const b = puntos[sg.hasta];
          const k = Math.min(sg.t, 1);
          const x = a.x + (b.x - a.x) * k;
          const y = a.y + (b.y - a.y) * k;
          ctx.strokeStyle = `rgba(${VERDE}, 0.7)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.fillStyle = 'rgba(200, 255, 220, 0.95)';
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${VERDE}, 0.25)`;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
          if (sg.t >= 1) {
            senales.splice(s, 1);
            if (sg.saltos > 0) {
              const opciones = vecinos[sg.hasta].filter((k2) => {
                const l = lineas[k2];
                return l.i !== sg.desde && l.j !== sg.desde;
              });
              if (opciones.length) {
                const l = lineas[opciones[Math.floor(Math.random() * opciones.length)]];
                senales.push({ desde: sg.hasta, hasta: l.i === sg.hasta ? l.j : l.i, t: 0, saltos: sg.saltos - 1 });
              }
            }
          }
        }
      }

      if (activo && !quieto) raf = requestAnimationFrame(dibujar);
    };

    // solo se anima mientras está a la vista
    const io = new IntersectionObserver(([e]) => {
      const visible = e.isIntersecting && !document.hidden;
      if (visible && !activo) {
        activo = true;
        ultimo = performance.now();
        raf = requestAnimationFrame(dibujar);
      } else if (!visible && activo) {
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
      caja.removeEventListener('pointermove', mover);
      caja.removeEventListener('pointerleave', salir);
    };
  }, []);

  return <canvas ref={lienzoRef} className="red-neuronal" aria-hidden="true" />;
}
