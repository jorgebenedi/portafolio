import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // rutas relativas: así funciona igual en la raíz de un dominio que en jorgebenedi.github.io/portafolio/
  base: './',
  plugins: [react()],
  server: { port: 5330, strictPort: true },
});
