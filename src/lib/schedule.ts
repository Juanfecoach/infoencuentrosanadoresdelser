import { comunas } from "./comunas";

export type Encounter = {
  date: string; // YYYY-MM-DD
  topic: string;
  facilitator: string;
  atSantaElena: boolean;
};

// Order matches comunas array: popular, manrique, aranjuez, villahermosa, belen, prado
const SLUGS = comunas.map((c) => c.slug);

// Each row: [date, ...6 [topic, facilitator] pairs]
type Row = [string, ...string[]];
const rows: Row[] = [
  ["2026-04-08",
    "Arquitectos Mentales", "Juan Fernando Echeverri",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda",
    "Nutrición Consciente", "Abraham Builes",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán",
    "Reiki 1", "Diana Natalia Echeverri",
    "Ayurveda", "Natali Sánchez"],
  ["2026-04-11",
    "Arquitectos Mentales", "Juan Fernando Echeverri",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda",
    "Nutrición Consciente", "Abraham Builes",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán",
    "Reiki 1", "Diana Natalia Echeverri",
    "Ayurveda", "Natali Sánchez"],
  ["2026-04-15",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda",
    "Nutrición Consciente", "Abraham Builes",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán",
    "Aromas para el Alma", "María Donadio",
    "Reiki 2", "Manuela Londoño",
    "Arquitectos Mentales", "Juan Fernando Echeverri"],
  ["2026-04-18",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda",
    "Nutrición Consciente", "Abraham Builes",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán",
    "Aromas para el Alma", "María Donadio",
    "Reiki 2", "Manuela Londoño",
    "Arquitectos Mentales", "Juan Fernando Echeverri"],
  ["2026-04-22",
    "Nutrición Consciente", "Abraham Builes",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán",
    "Aromas para el Alma", "María Donadio",
    "Reiki 1", "Diana Natalia Echeverri",
    "Arquitectos Mentales", "Juan Fernando Echeverri",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda"],
  ["2026-04-25",
    "Nutrición Consciente", "Abraham Builes",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán",
    "Aromas para el Alma", "María Donadio",
    "Reiki 1", "Diana Natalia Echeverri",
    "Arquitectos Mentales", "Juan Fernando Echeverri",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda"],
  ["2026-04-29",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán",
    "Aromas para el Alma", "María Donadio",
    "Reiki 1", "Diana Natalia Echeverri",
    "Reiki 2", "Manuela Londoño",
    "Ayurveda", "Natali Sánchez",
    "Nutrición Consciente", "Abraham Builes"],
  ["2026-05-02",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán",
    "Aromas para el Alma", "María Donadio",
    "Reiki 1", "Diana Natalia Echeverri",
    "Reiki 2", "Manuela Londoño",
    "Ayurveda", "Natali Sánchez",
    "Nutrición Consciente", "Abraham Builes"],
  ["2026-05-06",
    "Aromas para el Alma", "María Donadio",
    "Reiki 1", "Diana Natalia Echeverri",
    "Reiki 2", "Manuela Londoño",
    "Ayurveda", "Natali Sánchez",
    "Nutrición Consciente", "Abraham Builes",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán"],
  ["2026-05-09",
    "Aromas para el Alma", "María Donadio",
    "Reiki 1", "Diana Natalia Echeverri",
    "Reiki 2", "Manuela Londoño",
    "Ayurveda", "Natali Sánchez",
    "Nutrición Consciente", "Abraham Builes",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán"],
  ["2026-05-13",
    "Reiki 1", "Diana Natalia Echeverri",
    "Reiki 2", "Manuela Londoño",
    "Ayurveda", "Natali Sánchez",
    "Arquitectos Mentales", "Juan Fernando Echeverri",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda",
    "Aromas para el Alma", "María Donadio"],
  ["2026-05-16",
    "Reiki 1", "Diana Natalia Echeverri",
    "Reiki 2", "Manuela Londoño",
    "Ayurveda", "Natali Sánchez",
    "Arquitectos Mentales", "Juan Fernando Echeverri",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda",
    "Aromas para el Alma", "María Donadio"],
  ["2026-05-20",
    "Reiki 2", "Manuela Londoño",
    "Ayurveda", "Natali Sánchez",
    "Arquitectos Mentales", "Juan Fernando Echeverri",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda",
    "Aromas para el Alma", "María Donadio",
    "Reiki 1", "Diana Natalia Echeverri"],
  ["2026-05-23",
    "Reiki 2", "Manuela Londoño",
    "Ayurveda", "Natali Sánchez",
    "Arquitectos Mentales", "Juan Fernando Echeverri",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda",
    "Aromas para el Alma", "María Donadio",
    "Reiki 1", "Diana Natalia Echeverri"],
  ["2026-05-27",
    "Ayurveda", "Natali Sánchez",
    "Arquitectos Mentales", "Juan Fernando Echeverri",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda",
    "Nutrición Consciente", "Abraham Builes",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán",
    "Reiki 2", "Manuela Londoño"],
  ["2026-05-30",
    "Ayurveda", "Natali Sánchez",
    "Arquitectos Mentales", "Juan Fernando Echeverri",
    "Cuerpo Consciente, Yoga y Pranayamas", "Pilar Pineda",
    "Nutrición Consciente", "Abraham Builes",
    "El Poder del Ahora · Mindfulness y Meditación", "Astrid Urán",
    "Reiki 2", "Manuela Londoño"],
];

const isSaturday = (date: string) => {
  // date is YYYY-MM-DD; treat as local
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).getDay() === 6;
};

export const getScheduleForComuna = (slug: string): Encounter[] => {
  const idx = SLUGS.indexOf(slug);
  if (idx === -1) return [];
  return rows.map((r) => ({
    date: r[0],
    topic: r[1 + idx * 2],
    facilitator: r[2 + idx * 2],
    atSantaElena: isSaturday(r[0]),
  }));
};

export const getNextEncounter = (
  schedule: Encounter[],
  now: Date = new Date(),
): Encounter | null => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = schedule.find((e) => {
    const [y, m, d] = e.date.split("-").map(Number);
    return new Date(y, m - 1, d).getTime() >= today.getTime();
  });
  return upcoming ?? null;
};

export const formatLongDate = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};