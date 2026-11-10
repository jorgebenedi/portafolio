// Todo el contenido del portafolio está aquí: cambia textos, enlaces y proyectos sin tocar el diseño.

export const PERFIL = {
  nombre: 'Jorge',
  rol: 'Desarrollador de inteligencia artificial y automatizaciones',
  frase: 'La IA no sustituye al criterio. Lo multiplica.',
  // portada: principio, áreas y menú grande de la derecha
  principio: 'Principio 01',
  areas: ['Inteligencia artificial', 'Automatizaciones', 'Desarrollo de producto'],
  // cada opción abre su sección; la portada no baja
  menu: [
    { label: 'Principios', vista: 'principios' },
    { label: 'Proyectos', vista: 'proyectos' },
    { label: 'Sobre mí', vista: 'sobre-mi' },
    { label: 'Contacto', vista: 'contacto' },
  ],
  intro:
    'Para mí, crear con IA empieza mucho antes del código: hay que conocer a fondo el terreno que pisas. REGAIN AI existe porque entreno y estudio el entrenamiento de fuerza; sé qué es una serie al fallo, cuándo toca descargar y por qué una rutina funciona o no. Ese conocimiento es lo que convierte un modelo en un producto útil.',
  // los tres principios que aparecen bajo la portada
  principios: [
    {
      titulo: 'Criterio antes que código',
      texto: 'La IA genera en segundos. Decidir qué está bien, qué sobra y qué es peligroso sigue siendo trabajo de quien conoce el oficio.',
    },
    {
      titulo: 'Conocer el nicho a fondo',
      texto: 'No se puede automatizar bien lo que no se entiende. Antes de programar un entrenador, hay que saber entrenar.',
    },
    {
      titulo: 'La IA piensa, el código calcula',
      texto: 'El juicio de entrenador lo pone la IA; las series, el volumen y las reglas exactas las pone el código. Así es fiable.',
    },
  ],
  // texto de la sección «Sobre mí»: un párrafo por elemento
  sobreMi: [
    'Empecé programando atajos de iPhone para replicar las funciones de Galaxy AI cuando Apple aún no las había integrado en sus dispositivos. Esa curiosidad evolucionó hasta construir aplicaciones donde la inteligencia artificial es el motor principal del producto.',
    'Hoy llevo ese enfoque a Avanzadi, integrando IA en proyectos reales: desde pipelines RAG hasta automatización de procesos y agentes de IA.',
    'Mi otra gran curiosidad es la ciberseguridad. Programo en Python y he desarrollado software malicioso para penetrar sistemas en entornos de prueba controlados: entender cómo se ataca un sistema es la mejor forma de saber protegerlo.',
    'Diseño y programo de punta a punta: la interfaz, el backend y la IA que lo mueve. Me interesa que lo digital tenga peso, textura y un poco de atmósfera.',
  ],
  ubicacion: '', // p. ej. 'Madrid, España'
  // Rellena solo lo que quieras mostrar; lo que quede vacío no aparece en la web.
  contacto: {
    email: '',
    github: 'https://github.com/jorgebenedi',
    linkedin: '',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROYECTOS — todos siguen el mismo guion, en este orden:
//   tipo · año  →  título  →  resumen  →  ventana «En vivo»  →  ficha
//   →  «Cómo está hecho» (4 puntos)  →  bloque final (título + frase + contenido)
//
// Reglas de estilo para que todos suenen igual:
//   · resumen: tres frases — qué es, qué hace de verdad, y un remate.
//   · rol: «Diseño, desarrollo y …».
//   · cada punto de «Cómo está hecho»: título corto + dos frases, en impersonal.
//   · bloque final: una frase de entrada que diga qué se va a ver.
// ─────────────────────────────────────────────────────────────────────────────
export const PROYECTOS = [
  {
    id: 'second-passenger',
    titulo: 'Second Passenger',
    tipo: 'Herramienta de datos · Web',
    año: '2026',
    rol: 'Diseño, desarrollo y dirección de arte',
    resumen:
      'Una terminal industrial de una nave de los años setenta, inspirada en Alien, el octavo pasajero (1979), con la sensación de que algo acecha en los pasillos. Funciona de verdad: una herramienta que extrae y analiza datos de Instagram, con la información de cada perfil, sus seguidores nuevos y en común, y las interacciones entre usuarios. Meta no estuvo especialmente de acuerdo con que la desarrollara.',
    stack: ['React', 'Vite', 'CSS container queries', 'Web Audio', 'Python + Pillow', 'Higgsfield · Nano Banana'],
    // ventana «En vivo»: la consola real, jugable
    vivo: {
      tipo: 'consola',
      src: '/second-passenger/index.html',
      pista: 'Haz clic en la pantalla para usarla.',
      pistaActiva: 'Escribe un objetivo y pulsa Enter. Las flechas mueven el menú.',
    },
    claves: [
      {
        titulo: 'Escenas generadas con IA',
        texto:
          'Cada escena se genera entera (pared, tuberías, consola y puerta) con la pantalla en verde puro. Un script en Python la recorta y mide dónde caen la pantalla y los seis botones.',
      },
      {
        titulo: 'La interfaz dentro del hueco',
        texto:
          'React coloca la pantalla y los botones reales sobre esas medidas. Todo escala con container queries, así que encaja a cualquier tamaño sin descuadrarse.',
      },
      {
        titulo: 'Un CRT hecho a mano',
        texto:
          'Líneas de barrido, grano, parpadeo y el reflejo de la pantalla sobre el marco. Los botones son de metal gastado, con las letras grabadas.',
      },
      {
        titulo: 'Un ataque en cuatro fotogramas',
        texto:
          'Cada cierto tiempo la luz falla y el alien sale por la puerta, cae sobre el monitor y se queda encima mientras se sigue usando. Al final, salta contra la cámara.',
      },
    ],
    // bloque final: el proceso en imágenes
    final: {
      tipo: 'imagenes',
      titulo: 'Proceso',
      intro: 'De la imagen generada a la escena viva, en tres momentos.',
      imagenes: [
        { img: '/proyectos/second-passenger/2-escena.jpg', pie: 'La escena completa, con la consola ya integrada en la pared.' },
        { img: '/proyectos/second-passenger/4-encima.jpg', pie: 'A oscuras, encima del monitor, mientras la terminal sigue encendida.' },
        { img: '/proyectos/second-passenger/5-salto.jpg', pie: 'El salto final contra la cámara.' },
      ],
    },
  },
  {
    id: 'regain',
    titulo: 'REGAIN AI',
    tipo: 'Producto · Web y móvil',
    año: '2026',
    rol: 'Diseño, desarrollo e integración de IA',
    resumen:
      'Una aplicación que desafía los límites de la innovación en el fitness, combinando inteligencia artificial y ciencia para llevar tu progreso en el gimnasio al siguiente nivel. Un entrenador personal potenciado con IA que genera rutinas y programas por semanas, analiza cada entrenamiento, realiza check-ins semanales y utiliza datos de Apple Salud para interpretar tu sueño, pasos y actividad cardiovascular. Todo diseñado para convertir tus datos en progreso real.',
    stack: ['React', 'Expo', 'Node', 'MongoDB', 'OpenAI', 'Stripe'],
    // ventana «En vivo»: la pantalla de carga de la app, tal cual
    vivo: {
      tipo: 'carga',
      href: 'https://app.regainaifitness.com',
      pista: 'La pantalla de carga de la app, tal cual.',
    },
    claves: [
      {
        titulo: 'Un entrenador que recuerda cada serie',
        texto:
          'Atlas, el coach de IA, responde con todo el historial delante: qué se levantó, cómo progresa y qué toca después. Se le habla o se le escribe.',
      },
      {
        titulo: 'La IA piensa, el código calcula',
        texto:
          'El criterio de entrenador lo pone la IA; las series, el volumen por músculo y las reglas de progresión, el código. Así las cifras siempre cuadran.',
      },
      {
        titulo: 'Más allá del gimnasio',
        texto:
          'Lee el sueño, los pasos, el cardio y el peso de Apple Salud. El check-in semanal lo cruza con los entrenos y dice si toca ajustar.',
      },
      {
        titulo: 'Web, móvil y suscripción',
        texto:
          'Web en React, app nativa con Expo y backend en Node y MongoDB. Los pagos van con Stripe y con compras dentro de la App Store.',
      },
    ],
    // bloque final: AI Labs en directo
    final: {
      tipo: 'ailabs',
      titulo: 'AI Labs',
      intro: 'Siete módulos de IA que cada usuario activa a su medida. Lo que no se activa, ni se calcula ni aparece.',
      video: '/proyectos/regain/ailabs-fondo.mp4',
      poster: '/proyectos/regain/ailabs-fondo.jpg',
      modulos: [
        { nombre: 'Funciones de Atlas', texto: 'Añade al check-in solo lo que se quiere usar.' },
        { nombre: 'Body Architect', texto: 'Análisis de la técnica y seguimiento biométrico con visión por computador.' },
        { nombre: 'Mis Ejercicios', texto: 'Favoritos por grupo muscular que la IA prioriza al generar rutinas.' },
        { nombre: 'Progress Analytics', beta: true, texto: 'Predicción del rendimiento y detección de estancamientos.' },
        { nombre: 'Estudios', texto: 'La evidencia científica guardada del chat de Atlas, siempre a mano.' },
        { nombre: 'Consejos guardados', texto: 'Lo que dijo el entrenador y merecía conservarse.' },
        { nombre: 'Notas', texto: 'Ideas, récords y medidas para recordar en el gimnasio.' },
      ],
    },
  },
];
