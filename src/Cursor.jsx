import { useEffect, useRef } from 'react';

// Cursor propio: un punto que sigue al ratón y un anillo que lo acompaña con inercia.
// Crece sobre enlaces y botones. Solo en dispositivos con ratón.

export default function Cursor() {
  const punto = useRef(null);
  const anillo = useRef(null);

  useEffect(() => {
    const fino = window.matchMedia('(pointer: fine)').matches;
    if (!fino) return undefined;
    document.documentElement.classList.add('con-cursor');

    let x = -100;
    let y = -100;
    let ax = -100;
    let ay = -100;
    let raf = 0;
    const mover = (e) => {
      x = e.clientX;
      y = e.clientY;
      const sobre = e.target.closest?.('a, button, iframe, .labs-row, [role="tab"]');
      anillo.current?.classList.toggle('is-sobre', Boolean(sobre));
      punto.current?.classList.add('is-visible');
      anillo.current?.classList.add('is-visible');
    };
    const ocultar = () => {
      punto.current?.classList.remove('is-visible');
      anillo.current?.classList.remove('is-visible');
    };
    const bucle = () => {
      ax += (x - ax) * 0.18;
      ay += (y - ay) * 0.18;
      if (punto.current) punto.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (anillo.current) anillo.current.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      raf = requestAnimationFrame(bucle);
    };
    window.addEventListener('pointermove', mover, { passive: true });
    document.addEventListener('pointerleave', ocultar);
    raf = requestAnimationFrame(bucle);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', mover);
      document.removeEventListener('pointerleave', ocultar);
      document.documentElement.classList.remove('con-cursor');
    };
  }, []);

  return (
    <>
      <div ref={anillo} className="cursor-anillo" aria-hidden="true" />
      <div ref={punto} className="cursor-punto" aria-hidden="true" />
    </>
  );
}
