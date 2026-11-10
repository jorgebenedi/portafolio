import { Fragment } from 'react';

// Texto que nace letra a letra, como en el onboarding de REGAIN AI:
// cada letra se proyecta (sale verde, con destello y desenfocada) y se asienta en blanco.
// Las palabras no se parten. Al pasar el ratón por un enlace, una ola de luz las recorre.
export default function Nace({ texto, como: Etiqueta = 'span', retardo = 0, paso = 20, className = '', ...resto }) {
  const palabras = String(texto).split(' ');
  let n = 0;
  return (
    <Etiqueta className={`nace ${className}`.trim()} {...resto}>
      <span className="sr">{texto}</span>
      {palabras.map((palabra, i) => (
        <Fragment key={i}>
          <span className="nace-palabra" aria-hidden="true">
            {Array.from(palabra).map((c, j) => {
              const k = n++;
              return (
                <span key={j} className="nace-letra" style={{ animationDelay: `${retardo + k * paso}ms` }}>
                  <span style={{ '--n': k }}>{c}</span>
                </span>
              );
            })}
          </span>
          {i < palabras.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Etiqueta>
  );
}
