import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Las letras que nacen esperan a las fuentes. Al recargar a fondo (o en la
// primera visita) las de Google llegan tarde: la animación empezaba con la
// fuente de reserva y a mitad cambiaba a Instrument Serif, y las letras
// saltaban. Con .fuentes-listas en <html> el CSS suelta las animaciones; si
// las fuentes no llegan en 2 s, arranca igual.
const raiz = document.documentElement;
const fuentesListas = () => raiz.classList.add('fuentes-listas');
if (document.fonts?.load) {
  Promise.all(['400 1em "Instrument Serif"', '400 1em Michroma', '400 1em Inter', '400 1em "JetBrains Mono"']
    .map((f) => document.fonts.load(f)))
    .then(fuentesListas, fuentesListas);
  setTimeout(fuentesListas, 2000);
} else {
  fuentesListas();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
