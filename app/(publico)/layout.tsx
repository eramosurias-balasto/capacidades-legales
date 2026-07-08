import '@/styles/ru/encuesta.css';

// Layout de las rutas públicas de la encuesta (/encuesta, /gracias). Carga los tokens del
// RU.L Design System SOLO aquí: no llegan al dashboard ni a ninguna otra ruta (scoping por
// segmento). El wrapper .ru-publico fija el fondo blanco, la tinta y la tipografía Switzer.
export default function PublicoLayout({ children }: { children: React.ReactNode }) {
  return <div className="ru-publico">{children}</div>;
}
