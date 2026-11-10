import { Fragment, useEffect, useRef, useState } from 'react';
import { PERFIL, PROYECTOS } from './datos';
import CampoNeuronal from './CampoNeuronal';
import Cursor from './Cursor';
import Nace from './Nace';

// Bloques que aparecen al entrar en pantalla (el orden dentro de su grupo da el retraso)
const REVELAR = [
  '.principios-intro', '.principle',
  '.section-head > :not(.nace)', '.demo', '.facts > div', '.block-title', '.key-item', '.shot',
  '.final-intro',
  '.about-body > *', '.indice-lista li', '.siguiente',
  '.contacto-vista > *', '.footer',
].join(',');

function useEfectosScroll(vista) {
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.dataset.vista = vista;
    window.scrollTo({ top: 0, behavior: 'instant' });
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // aparición al entrar en pantalla
    const elementos = [...document.querySelectorAll(REVELAR)];
    let io;
    if (!quieto && 'IntersectionObserver' in window) {
      elementos.forEach((el) => {
        const hermanos = [...el.parentElement.children].filter((h) => h.matches(REVELAR));
        el.style.setProperty('--d', Math.min(hermanos.indexOf(el), 6));
        el.classList.add('reveal');
      });
      io = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in');
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
      );
      elementos.forEach((el) => io.observe(el));
    }

    // la pantalla de carga y AI Labs se reproducen cada vez que entran en pantalla
    let ioSplash;
    if ('IntersectionObserver' in window) {
      ioSplash = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            const video = e.target.querySelector('video');
            if (e.isIntersecting && e.intersectionRatio >= 0.35) {
              e.target.classList.add('is-playing');
              video?.play().catch(() => {});
            } else if (!e.isIntersecting) {
              e.target.classList.remove('is-playing');
              video?.pause();
            }
          });
        },
        { threshold: [0, 0.35] }
      );
      document.querySelectorAll('.splash, .labs').forEach((el) => ioSplash.observe(el));
    }

    // barra de progreso y menú que se esconde al bajar y vuelve al subir
    let ultimo = window.scrollY;
    let pendiente = false;
    const nav = document.querySelector('.nav');
    const alScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = raiz.scrollHeight - window.innerHeight;
        raiz.style.setProperty('--progreso', max > 0 ? (y / max).toFixed(4) : 0);
        if (nav) {
          if (y > 140 && y - ultimo > 6) nav.classList.add('is-hidden');
          else if (ultimo - y > 6 || y < 140) nav.classList.remove('is-hidden');
        }
        ultimo = y;
        pendiente = false;
      });
    };
    alScroll();
    window.addEventListener('scroll', alScroll, { passive: true });
    return () => {
      io?.disconnect();
      ioSplash?.disconnect();
      window.removeEventListener('scroll', alScroll);
    };
  }, [vista]);
}

// Secciones: cada una es su propia pantalla; se cambia con el menú (y el botón atrás funciona)
const VISTAS = ['principios', 'proyectos', 'sobre-mi', 'contacto', ...PROYECTOS.map((p) => p.id)];
const enlace = (vista) => (vista === 'inicio' ? '#/' : `#/${vista}`);

function useVista() {
  const leer = () => {
    const h = decodeURIComponent(window.location.hash.replace(/^#\/?/, ''));
    return VISTAS.includes(h) ? h : 'inicio';
  };
  const [vista, setVista] = useState(leer);
  useEffect(() => {
    const cambiar = () => setVista(leer());
    window.addEventListener('hashchange', cambiar);
    return () => window.removeEventListener('hashchange', cambiar);
  }, []);
  return vista;
}

// A dónde lleva «Volver»: de un proyecto, al índice de proyectos; de cualquier otra sección, a la portada
function destinoVolver(vista) {
  if (vista === 'inicio') return null;
  return PROYECTOS.some((p) => p.id === vista)
    ? { vista: 'proyectos', label: 'Proyectos' }
    : { vista: 'inicio', label: 'Inicio' };
}

// La tecla Escape también vuelve atrás
function useVolverConEscape(vista) {
  useEffect(() => {
    const destino = destinoVolver(vista);
    if (!destino) return undefined;
    const alPulsar = (e) => {
      if (e.key === 'Escape' && !e.defaultPrevented) window.location.hash = enlace(destino.vista);
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [vista]);
}

function Nav({ vista }) {
  const enProyecto = PROYECTOS.some((p) => p.id === vista);
  const volver = destinoVolver(vista);
  return (
    <header className="nav">
      <div className="nav-izq">
        <a href={enlace('inicio')} className="nav-name">{PERFIL.nombre}</a>
        {volver && (
          <a href={enlace(volver.vista)} className="nav-volver" aria-label={`Volver a ${volver.label}`}>
            <span aria-hidden="true">←</span>
            <span className="nav-volver-texto" aria-hidden="true">{volver.label}</span>
          </a>
        )}
      </div>
      <nav className="nav-links" aria-label="Secciones">
        {PERFIL.menu.map((m) => {
          const actual = m.vista === vista || (m.vista === 'proyectos' && enProyecto);
          return (
            <a key={m.vista} href={enlace(m.vista)} aria-current={actual ? 'page' : undefined}>
              {m.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}

const ICONO_GITHUB = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
    />
  </svg>
);

// Vídeo de la portada: una esfera de puntos que respira, con el núcleo verde.
// El fondo del vídeo es el mismo color que la página, así no se ve el borde.
function Orbe() {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);
  return (
    <div className="orbe" aria-hidden="true">
      <video ref={ref} src="/portada/orbe.mp4" poster="/portada/orbe-poster.jpg" autoPlay muted loop playsInline preload="auto" />
    </div>
  );
}

// Portada: principio, titular, fórmula y áreas a la izquierda; menú grande a la derecha;
// de fondo, una red neuronal tenue que se enciende alrededor del cursor
function Hero() {
  return (
    <section className="hero" id="inicio">
      <Orbe />
      <CampoNeuronal />
      <div className="hero-grid">
        <div className="hero-text">
          <p className="eyebrow">{PERFIL.principio}</p>
          <Nace como="h1" className="hero-title" texto={PERFIL.frase} retardo={250} paso={24} />
          <p className="areas">
            {PERFIL.areas.map((x, i) => (
              <Fragment key={x}>
                {i > 0 && <span className="areas-sep" aria-hidden="true">·</span>}
                <span>{x}</span>
              </Fragment>
            ))}
          </p>
        </div>
        <nav className="menu-grande" aria-label="Secciones">
          {PERFIL.menu.map((m, i) => (
            <a key={m.vista} href={enlace(m.vista)} style={{ '--i': i }}>
              <Nace texto={m.label} retardo={1250 + i * 170} paso={26} />
            </a>
          ))}
        </nav>
      </div>
      {PERFIL.contacto.github && (
        <a className="hero-github" href={PERFIL.contacto.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          {ICONO_GITHUB}
        </a>
      )}
    </section>
  );
}

// Lo que antes iba bajo el titular: el porqué y los tres principios, en su propia sección
function Principios() {
  return (
    <section className="principios" id="principios">
      <p className="eyebrow">{PERFIL.rol}</p>
      <p className="principios-intro">{PERFIL.intro}</p>
      <div className="principles">
        {PERFIL.principios.map((p) => (
          <div key={p.titulo} className="principle">
            <Nace como="h2" texto={p.titulo} retardo={150} paso={18} />
            <p>{p.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Ventana «En vivo»: el mismo marco para todos los proyectos (barra con etiqueta, pista y acciones)
function Ventana({ pista, acciones, activa = false, children }) {
  return (
    <figure className="demo">
      <div className="demo-bar">
        <span className="demo-live">En vivo</span>
        <span className="demo-hint">{pista}</span>
        <div className="demo-actions">{acciones}</div>
      </div>
      <div className={`demo-frame ${activa ? 'is-active' : ''}`}>{children}</div>
    </figure>
  );
}

// Second Passenger: la consola real, jugable dentro de la página
function VivoConsola({ vivo, titulo }) {
  const ref = useRef(null);
  const [activa, setActiva] = useState(false);

  useEffect(() => {
    // cuando el foco entra en el iframe, la ventana pierde el foco
    const onBlur = () => setTimeout(() => setActiva(document.activeElement === ref.current), 0);
    const onFocus = () => setActiva(false);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const atacar = () => {
    try {
      ref.current?.contentWindow?.__ataque?.();
    } catch {
      /* sin acceso al iframe */
    }
  };

  return (
    <Ventana
      activa={activa}
      pista={activa ? vivo.pistaActiva : vivo.pista}
      acciones={
        <>
          <button type="button" onClick={atacar}>
            Provocar el ataque
          </button>
          <a href={vivo.src} target="_blank" rel="noreferrer">
            Pantalla completa <span aria-hidden="true">↗</span>
          </a>
        </>
      }
    >
      <iframe ref={ref} src={vivo.src} title={`${titulo}, en vivo`} loading="lazy" />
    </Ventana>
  );
}

// REGAIN AI: la pantalla de carga de la app (la de F5), recreada tal cual
function VivoCarga({ vivo }) {
  const ref = useRef(null);
  const repetir = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove('is-playing');
    void el.offsetWidth; // reinicia las animaciones
    el.classList.add('is-playing');
  };
  return (
    <Ventana
      pista={vivo.pista}
      acciones={
        <>
          <button type="button" onClick={repetir}>
            Repetir
          </button>
          <a href={vivo.href} target="_blank" rel="noreferrer">
            Abrir la app <span aria-hidden="true">↗</span>
          </a>
        </>
      }
    >
      <div ref={ref} className="splash" role="img" aria-label="REGAIN AI, Fitness Intelligence">
        <div className="splash-glow" />
        <div className="splash-art">
          <img src="/proyectos/regain/carga-dragon.jpg" alt="" className="splash-bg" />
        </div>
        <div className="splash-overlay" />
        <div className="splash-content">
          <div className="splash-marca">
            <div className="splash-title marca">
              Regain&nbsp;<span>AI</span>
            </div>
            <div className="splash-raya" />
            <div className="splash-overline marca-sub">Fitness intelligence</div>
          </div>
        </div>
      </div>
    </Ventana>
  );
}

// Bloque final de REGAIN: AI Labs en directo, con su vídeo de fondo y las tarjetas entrando
function AILabsLive({ datos }) {
  return (
    <div className="labs" aria-label="AI Labs de REGAIN AI">
      <div className="labs-scene" aria-hidden="true">
        <video className="labs-video" src={datos.video} poster={datos.poster} muted loop playsInline preload="metadata" />
        <div className="labs-grade labs-grade-1" />
        <div className="labs-grade labs-grade-2" />
        <div className="labs-grade labs-grade-3" />
        <div className="labs-grade labs-grade-4" />
        <div className="labs-scan" />
      </div>
      <p className="labs-corner marca-sub">Regain AI · Fitness Intelligence</p>
      <div className="labs-menu">
        <div className="labs-head">
          <p className="labs-over marca-sub">Fitness Intelligence</p>
          <h4 className="labs-title marca">AI Labs</h4>
          <p className="labs-sub">Módulos</p>
          <div className="labs-loader">
            <span />
          </div>
        </div>
        <ul className="labs-list">
          {datos.modulos.map((m, i) => (
            <li key={m.nombre} className="labs-row" style={{ '--i': i }}>
              <span className="labs-text">
                <span className="labs-name">
                  {m.nombre}
                  {m.beta && <span className="labs-beta">Beta</span>}
                </span>
                <span className="labs-desc">{m.texto}</span>
              </span>
              <span className="labs-go" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Todos los proyectos con el mismo guion:
// tipo · año → título → resumen → ventana «En vivo» → ficha → «Cómo está hecho» → bloque final
function Proyecto({ p }) {
  const final = p.final;
  const siguiente = PROYECTOS[(PROYECTOS.indexOf(p) + 1) % PROYECTOS.length];
  return (
    <section className="featured" id={p.id}>
      <div className="section-head">
        <p className="eyebrow">{p.tipo} · {p.año}</p>
        <Nace como="h2" className="featured-title" texto={p.titulo} retardo={150} paso={34} />
        <p className="featured-summary">{p.resumen}</p>
      </div>

      {p.vivo.tipo === 'consola' && <VivoConsola vivo={p.vivo} titulo={p.titulo} />}
      {p.vivo.tipo === 'carga' && <VivoCarga vivo={p.vivo} />}

      <dl className="facts">
        <div>
          <dt>Rol</dt>
          <dd>{p.rol}</dd>
        </div>
        <div>
          <dt>Año</dt>
          <dd>{p.año}</dd>
        </div>
        <div className="facts-wide">
          <dt>Herramientas</dt>
          <dd className="chips">
            {p.stack.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="keys">
        <h3 className="block-title">Cómo está hecho</h3>
        <div className="keys-grid">
          {p.claves.map((k) => (
            <article key={k.titulo} className="key-item">
              <h4>{k.titulo}</h4>
              <p>{k.texto}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="final">
        <h3 className="block-title">{final.titulo}</h3>
        <p className="final-intro">{final.intro}</p>
        {final.tipo === 'imagenes' && (
          <div className="process-grid">
            {final.imagenes.map((im) => (
              <figure key={im.img} className="shot">
                <img src={im.img} alt={im.pie} loading="lazy" />
                <figcaption>{im.pie}</figcaption>
              </figure>
            ))}
          </div>
        )}
        {final.tipo === 'ailabs' && <AILabsLive datos={final} />}
      </div>

      <a className="siguiente" href={enlace(siguiente.id)}>
        <span className="eyebrow">Siguiente proyecto</span>
        <span className="siguiente-titulo">
          <Nace texto={siguiente.titulo} retardo={200} paso={30} /> <span aria-hidden="true">→</span>
        </span>
      </a>
    </section>
  );
}

// Índice: los proyectos en grande, como el menú de la portada
function IndiceProyectos() {
  return (
    <section className="indice">
      <p className="eyebrow">Proyectos</p>
      <ul className="indice-lista">
        {PROYECTOS.map((p, i) => (
          <li key={p.id}>
            <a href={enlace(p.id)}>
              <span className="indice-num">{String(i + 1).padStart(2, '0')}</span>
              <Nace className="indice-titulo" texto={p.titulo} retardo={150 + i * 220} paso={30} />
              <span className="indice-tipo">{p.tipo} · {p.año}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function enlacesContacto() {
  const { email, github, linkedin } = PERFIL.contacto;
  return [
    email && { label: email, href: `mailto:${email}` },
    github && { label: 'GitHub', href: github },
    linkedin && { label: 'LinkedIn', href: linkedin },
  ].filter(Boolean);
}

function Contacto() {
  return (
    <section className="contacto-vista">
      <p className="eyebrow">Contacto</p>
      <Nace como="h2" className="contacto-titulo" texto="Hablemos." retardo={150} paso={45} />
      <ul className="contacto-lista">
        {enlacesContacto().map((e) => (
          <li key={e.href}>
            <a href={e.href} target={e.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
              <span>{e.label}</span> <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SobreMi() {
  const enlaces = enlacesContacto();
  return (
    <section className="about" id="sobre-mi">
      <Nace como="h2" className="section-title" texto="Sobre mí" retardo={150} paso={40} />
      <div className="about-body">
        {[].concat(PERFIL.sobreMi).map((parrafo) => <p key={parrafo.slice(0, 24)}>{parrafo}</p>)}
        {enlaces.length > 0 && (
          <ul className="contact">
            {enlaces.map((e) => (
              <li key={e.href}>
                <a href={e.href} target={e.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                  {e.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function App() {
  const vista = useVista();
  useEfectosScroll(vista);
  useVolverConEscape(vista);
  const proyecto = PROYECTOS.find((p) => p.id === vista);
  const portada = vista === 'inicio';
  return (
    <>
      {!portada && <div className="progress" aria-hidden="true" />}
      <Cursor />
      <Nav vista={vista} />
      <main key={vista} className={`vista vista-${portada ? 'inicio' : 'seccion'}`}>
        {portada && <Hero />}
        {vista === 'principios' && <Principios />}
        {vista === 'proyectos' && <IndiceProyectos />}
        {proyecto && <Proyecto p={proyecto} />}
        {vista === 'sobre-mi' && <SobreMi />}
        {vista === 'contacto' && <Contacto />}
      </main>
      {!portada && (
        <footer className="footer">
          <span>© {new Date().getFullYear()} {PERFIL.nombre}</span>
          <a href={enlace('inicio')}>← Inicio</a>
        </footer>
      )}
    </>
  );
}
