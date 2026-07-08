'use client';

import { Card } from './ui';

// Vista "Inicio" del dashboard: texto de presentación del estudio (voz del autor, VERBATIM).
// Sin gráficas. Detrás del login, como todo el dashboard.

// Link interno a la encuesta general, con NEXT_PUBLIC_APP_URL si está definido; si no, ruta
// relativa. Abre en pestaña nueva.
const base = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
const ENCUESTA_HREF = base ? `${base}/encuesta/general` : '/encuesta/general';

const ESTUDIO_HREF =
  'https://research.thelegaleducationfoundation.org/research-learning/funded-research/legal-confidence-and-attitudes-to-law-developing-standardised-measures';

const linkExterno = 'font-medium text-slate-900 underline hover:text-slate-700';

export function Inicio() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Capacidades legales en México — tablero del estudio</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          A diario, las personas enfrentan problemas que no siempre reconocen como jurídicos: un despido injustificado, un conflicto
          familiar, la amenaza de perder la vivienda, un fraude al consumidor, un acto de discriminación. Que alguien pueda hacerles
          frente no depende solo de que existan derechos que lo amparen o tribunales a los que acudir. Depende, antes, de algo más
          elemental: de que reconozca el problema como jurídico, se sepa titular de derechos y cuente con la confianza y la disposición
          para actuar. A ese conjunto de conocimientos, actitudes y disposiciones la literatura reciente lo llama capacidades legales
          internas. Este tablero acompaña, en tiempo real, un intento por medirlas en México.
        </p>
      </div>

      <Card title="El estudio">
        <p className="text-sm leading-relaxed text-slate-700">
          Este tablero forma parte de una tesina de licenciatura en Derecho (ITAM) que adapta al contexto mexicano el método
          desarrollado por Pascoe Pleasence y Nigel Balmer (2018) para medir capacidades legales internas mediante escalas
          psicométricas. El instrumento consta de la medición de cinco categorías de capacidades legales internas: autoeficacia
          jurídica, ansiedad legal, confianza jurídica general, inaccesibilidad percibida de la justicia y desigualdad percibida de la
          justicia. El estudio original puede consultarse en{' '}
          <a href={ESTUDIO_HREF} target="_blank" rel="noopener noreferrer" className={linkExterno}>
            Legal Confidence and Attitudes to Law: Developing Standardised Measures of Legal Capability
          </a>
          .
        </p>
      </Card>

      <Card title="Quiénes responden">
        <p className="text-sm leading-relaxed text-slate-700">
          Estudiantes de educación media superior de tres instituciones participantes, mediante enlaces dedicados que permiten comparar
          dos cohortes: quienes cursaron la materia de Derecho en primavera de 2026 y quienes la cursarán en otoño de 2026.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Existe además un enlace abierto para una muestra general de adultos, por conveniencia, que funciona como piloto del
          instrumento y se analiza siempre por separado de la muestra estudiantil.
        </p>
      </Card>

      <Card title="Cómo se calculan las puntuaciones">
        <p className="text-sm leading-relaxed text-slate-700">
          Cada escala se suma a una puntuación bruta y se convierte a una métrica de 0 a 100 mediante las tablas de conversión Rasch
          publicadas por Pleasence y Balmer, calibradas con datos de Inglaterra y Gales. Son el estándar del instrumento y están
          disponibles desde la primera respuesta.
        </p>
      </Card>

      <Card title="La calibración mexicana se hará una vez terminado el estudio">
        <p className="text-sm leading-relaxed text-slate-700">
          Este dashboard no recalibra el modelo Rasch aún. La calibración con datos mexicanos se realizará por separado en R, con el
          paquete{' '}
          <a href="https://github.com/pgmj/easyRasch" target="_blank" rel="noopener noreferrer" className={linkExterno}>
            easyRasch
          </a>{' '}
          y los estimadores estándar de la literatura psicométrica, sobre los archivos exportables desde la pestaña Exportar, una vez
          que el tamaño de muestra lo permita.
        </p>
      </Card>

      <Card title="Toma la encuesta">
        <p className="text-sm leading-relaxed text-slate-700">
          Participa en el proyecto. Puedes tomar la encuesta en el siguiente vínculo:{' '}
          <a href={ENCUESTA_HREF} target="_blank" rel="noopener noreferrer" className={linkExterno}>
            Link a la encuesta general
          </a>
          .
        </p>
      </Card>

      <Card title="Sobre el autor">
        <p className="text-sm leading-relaxed text-slate-700">
          Ernesto Ramos Urías. Postulante a abogado por el ITAM. Escribiendo esta tesina sobre las capacidades legales de los
          estudiantes mexicanos de educación media superior. Contacto:{' '}
          <a href="mailto:eramosurias@gmail.com" className={linkExterno}>
            eramosurias@gmail.com
          </a>
        </p>
      </Card>
    </div>
  );
}
