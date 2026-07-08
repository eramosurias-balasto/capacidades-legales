// AUTOGENERADO desde SPEC-app-encuesta-railway.md §5 (extracción literal, no retecleado).
// REGLA CRÍTICA: los textos son un instrumento validado (P&B 2018). NO editar ni una letra.
// La instrucción de DPJ se reconstruyó según DECISIONES.md D1 (verificada carácter por carácter).
// Ver lib/instrumento.verify.test.ts, que revalida cada string contra el SPEC.

export type EscalaId = 'eaj' | 'eal' | 'clg' | 'iaj' | 'dpj';

export interface Escala {
  /** Identificador canónico de la escala. */
  id: EscalaId;
  /** Nombre descriptivo (no se muestra necesariamente al alumno). */
  nombre: string;
  /** Instrucción introductoria, literal del instrumento. */
  instruccion: string;
  /** Textos de los ítems, en orden. Literales del instrumento. */
  items: string[];
  /** Categorías de respuesta EN ORDEN DE CAPTURA (índice 0..3). */
  categorias: string[];
}

/** Orden canónico de las cinco escalas psicométricas. */
export const ORDEN_ESCALAS: EscalaId[] = ['eaj', 'eal', 'clg', 'iaj', 'dpj'];

/** Número de ítems esperado por escala (para validación de longitudes en el servidor). */
export const NUM_ITEMS: Record<EscalaId, number> = {
  eaj: 6,
  eal: 4,
  clg: 6,
  iaj: 9,
  dpj: 6,
};

export const ESCALAS: Record<EscalaId, Escala> = {
  eaj: {
    id: "eaj",
    nombre: "Escala de autoeficacia jurídica (EAJ)",
    instruccion:
      "Piense en general en problemas jurídicos importantes, como ser despedido injustamente por su empleador, sufrir lesiones como consecuencia de la negligencia de otra persona, verse envuelto en una disputa por dinero en el marco de un divorcio o enfrentarse al despojo de su vivienda. ¿En qué medida le describen las siguientes afirmaciones?",
    items: [
      "Siempre consigo resolver problemas difíciles si me esfuerzo lo suficiente.",
      "Si alguien se opone a mí, puedo encontrar los medios y las formas de conseguir lo que quiero.",
      "Me resulta fácil mantenerme fiel a mis objetivos y alcanzarlos.",
      "Puedo mantener la calma ante las dificultades porque confío en mi capacidad para afrontarlas.",
      "Cuando me enfrento a un problema, suelo encontrar varias soluciones.",
      "Soy bueno buscando información que ayude a resolver problemas.",
    ],
    categorias: ["nada cierto", "casi nada cierto", "moderadamente cierto", "totalmente cierto"],
  },
  eal: {
    id: "eal",
    nombre: "Escala de ansiedad legal (EAL)",
    instruccion:
      "Ahora, piense en general en problemas legales importantes, como ser despedido injustamente por su empleador, sufrir lesiones como consecuencia de la negligencia de otra persona, verse envuelto en una disputa por dinero en el marco de un divorcio o enfrentarse al despojo de su vivienda. ¿En qué medida le describen las siguientes afirmaciones?",
    items: [
      "Me da miedo hablar directamente con la gente para hacer valer mis derechos.",
      "La preocupación por no expresarme con claridad puede impedirme actuar.",
      "Evito hacer valer mis derechos porque no estoy seguro de que vaya a tener éxito.",
      "No siempre consigo el mejor resultado para mí, porque intento evitar los conflictos.",
    ],
    categorias: ["nada cierto", "casi nada cierto", "moderadamente cierto", "totalmente cierto"],
  },
  clg: {
    id: "clg",
    nombre: "Escala de confianza jurídica general (CLG)",
    instruccion:
      "Si se encontrara ante un conflicto legal importante —como ser despedido injustamente por su empleador, sufrir lesiones como consecuencia de la negligencia de otra persona, verse envuelto en una disputa económica como parte de un divorcio o enfrentarse al despojo de su vivienda—, ¿qué grado de confianza tiene en que podría lograr un resultado justo y satisfactorio para usted en las siguientes situaciones?",
    items: [
      "El desacuerdo es considerable y la tensión es alta.",
      "La otra parte dice que \"no descansará hasta que se haga justicia\".",
      "La otra parte se niega a hablar contigo salvo a través de su abogado.",
      "Una notificación del tribunal le indica que debe rellenar ciertos formularios, incluyendo la exposición de su caso.",
      "El asunto llega a los tribunales, un abogado representa a la otra parte y usted está solo.",
      "El tribunal dicta una sentencia en su contra, que usted considera injusta. Le informan de que tiene derecho a apelar.",
    ],
    categorias: ["muy seguro", "bastante seguro", "no muy seguro", "nada seguro"],
  },
  iaj: {
    id: "iaj",
    nombre: "Escala de inaccesibilidad a la justicia (IAJ)",
    instruccion:
      "Ahora, algunas preguntas sobre su impresión general y su experiencia con el sistema de justicia. No nos interesa el sistema de justicia penal. Nos interesa el sistema de justicia que se ocupa de cuestiones como el despido injustificado por parte de su empleador, las lesiones sufridas como consecuencia de la negligencia de otra persona, las disputas económicas en el marco de un divorcio o el despojo de su vivienda. Teniendo en cuenta cuestiones como estas, ¿en qué medida está de acuerdo o en desacuerdo con las siguientes afirmaciones?",
    items: [
      "Cuestiones como estas suelen resolverse con rapidez y eficacia.",
      "Las personas con menos recursos económicos suelen obtener un resultado peor.",
      "En cuestiones como estas, la ley es como un juego en el que quienes son hábiles y tienen recursos tienen más probabilidades de conseguir lo que quieren.",
      "Es fácil llevar cuestiones como estas a los tribunales si es necesario.",
      "En cuestiones como estas, los abogados son demasiado caros para la mayoría de la gente.",
      "El sistema judicial ofrece una buena relación calidad-precio.",
      "En cuestiones como estas, personas como yo pueden permitirse la ayuda de un abogado.",
      "Los abogados de los ricos no son mejores que los de los pobres.",
      "Llevar un caso a los tribunales suele dar más problemas de lo que vale la pena.",
    ],
    categorias: ["totalmente de acuerdo", "mayoritariamente de acuerdo", "mayoritariamente en desacuerdo", "totalmente en desacuerdo"],
  },
  dpj: {
    id: "dpj",
    nombre: "Escala de desigualdad percibida de la justicia (DPJ)",
    instruccion:
      "Ahora, algunas preguntas sobre su impresión general y su experiencia con el sistema de justicia. No nos interesa el sistema de justicia penal. Nos interesa el sistema de justicia que se ocupa de cuestiones como el despido injustificado por parte de su empleador, las lesiones sufridas como consecuencia de la negligencia de otra persona, las disputas económicas en el marco de un divorcio o el despojo de su vivienda. Pensando en cuestiones como estas, ¿en qué medida está de acuerdo o en desacuerdo con las siguientes afirmaciones?",
    items: [
      "Las personas con menos dinero suelen obtener peores resultados.",
      "En cuestiones como estas, la ley es como un juego en el que los más hábiles y con más recursos tienen más probabilidades de conseguir lo que quieren.",
      "La ley siempre trata a ambas partes de forma justa, independientemente de su origen, género, etnia o religión.",
      "Los jueces tienen sus propios intereses y agendas, al margen de la ley.",
      "Las decisiones y acciones de los tribunales se ven influidas por la presión de la prensa y los políticos.",
      "Los juzgados y tribunales siempre tratan a ambas partes de forma justa, independientemente de su origen, género, etnia o religión.",
    ],
    categorias: ["totalmente de acuerdo", "mayoritariamente de acuerdo", "mayoritariamente en desacuerdo", "totalmente en desacuerdo"],
  },
};
