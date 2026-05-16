import type { Comuna } from "./comunas";

export type FaqItem = { q: string; a: string };

export const buildFaqs = (
  comuna: Comuna,
  nextTopic: string | null,
): FaqItem[] => [
  {
    q: "¿De qué trata el Diplomado Sanadores del Ser?",
    a: "Es un programa formativo en terapias complementarias y alternativas para el bienestar integral del ser humano. Combina autoconocimiento, manejo emocional, cuidado del cuerpo y servicio a otros, para que las personas puedan ofrecer servicios como terapeutas holísticos.",
  },
  {
    q: "¿Cuáles son los módulos del diplomado?",
    a: "Son ocho: Ayurveda, Arquitectos Mentales (Coaching, PNL e Hipnosis), Aromas para el Alma (Aromaterapia), Cuerpo Consciente (Yoga y Pranayamas), El Poder del Ahora (Mindfulness y Meditación), Nutrición Consciente, Reiki Nivel 1 y Reiki Nivel 2.",
  },
  {
    q: "¿Cómo es la metodología?",
    a: "Talleres participativos con componente teórico (contexto, evidencia, técnicas, beneficios y precauciones) y práctico. Los estudiantes son parte activa de los ejercicios para integrar el conocimiento y poder practicarlo por su cuenta.",
  },
  {
    q: "¿Cuándo y dónde son los encuentros de mi comuna?",
    a: `En la Comuna ${comuna.number} ${comuna.name}, las clases son los miércoles de 5:00 p.m. a 9:00 p.m. en ${comuna.address}. Los sábados el encuentro es en Santa Elena de 8:00 a.m. a 4:00 p.m.${nextTopic ? ` Tu próximo módulo es: ${nextTopic}.` : ""}`,
  },
  {
    q: "¿A qué hora y desde dónde sale el bus los sábados?",
    a: `El bus sale a las ${comuna.departureTime} desde ${comuna.pickupPoint} y deja al grupo en el mismo punto al regreso. Por favor llega al menos 10 minutos antes; el bus no puede retrasarse.`,
  },
  {
    q: "¿Qué debo llevar al encuentro de Santa Elena?",
    a: "Tus medicamentos personales, hidratación (termo de agua), toalla personal, abrigo para el frío, repelente y bloqueador. Si lo deseas, puedes llevar fruta o algún alimento para los descansos.",
  },
  {
    q: "¿Incluye alimentación?",
    a: "Sí, el encuentro incluye almuerzo y refrigerio. No incluye desayuno.",
  },
  {
    q: "¿Puedo ir por mis propios medios a Santa Elena?",
    a: "Sí, pero debes firmar un formato de exoneración a Pera de Olmo por cualquier incidente, accidente o inconveniente en el camino, ya que el proyecto dispone de un bus específico. No se reembolsan gastos de transporte para quienes usen otro medio.",
  },
  {
    q: "¿El bus puede recogerme en otro punto?",
    a: `No. El bus solo recoge en el punto acordado: ${comuna.pickupPoint}. Si necesitas bajarte en otro punto del regreso, debes firmar durante el encuentro un documento de exoneración de responsabilidad por exigencia de la aseguradora.`,
  },
  {
    q: "¿Puedo llevar acompañantes, niños o mascotas?",
    a: "No. El bus solo lleva a las personas inscritas y confirmadas por Pera de Olmo. Tampoco se permiten mascotas, computadores ni equipos.",
  },
  {
    q: "¿Qué pasa si hay una novedad en el punto de parqueo del bus?",
    a: "Comunícate de inmediato con el operador Pera de Olmo. El punto de recogida y regreso es siempre el mismo informado para tu comuna; cualquier cambio será notificado por los canales oficiales.",
  },
  {
    q: "¿Las terapias reemplazan un tratamiento médico?",
    a: "No. Son terapias complementarias y preventivas, reconocidas por la OMS, que promueven el autoconocimiento y el bienestar. No sustituyen los tratamientos médicos convencionales.",
  },
];