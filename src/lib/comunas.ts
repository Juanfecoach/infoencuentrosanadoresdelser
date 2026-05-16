export type Comuna = {
  slug: string;
  number: number;
  name: string;
  address: string;
  pickupPoint: string;
  departureTime: string;
};

export const comunas: Comuna[] = [
  {
    slug: "popular",
    number: 1,
    name: "Popular",
    address: "Junta Acción Comunal, Cra 40 # 98 B 11",
    pickupPoint: "D1 del Parque de Guadalupe",
    departureTime: "8:00 a.m.",
  },
  {
    slug: "manrique",
    number: 3,
    name: "Manrique",
    address: "I.E San Juan Bautista de la Salle, Calle 93 # 40-42",
    pickupPoint:
      "I.E San Juan Bautista de la Salle, Calle 93 # 40-42, Comuna 3 Manrique",
    departureTime: "8:00 a.m.",
  },
  {
    slug: "aranjuez",
    number: 4,
    name: "Aranjuez",
    address: "Centro de Desarrollo Cultural de Moravia, Calle 82 A #52-25",
    pickupPoint:
      "Centro de Desarrollo Cultural de Moravia, Calle 82 A #52-25, Comuna 4 Aranjuez",
    departureTime: "8:00 a.m.",
  },
  {
    slug: "villahermosa",
    number: 8,
    name: "Villa Hermosa",
    address:
      "Sede Comunal Enciso, Cra 29 A # 58-47 (frente a la Iglesia Niño Jesús de Praga)",
    pickupPoint:
      "Sede Comunal Enciso, Cra 29 A # 58-47, frente a la Iglesia Niño Jesús de Praga, Comuna 8 Villa Hermosa",
    departureTime: "8:00 a.m.",
  },
  {
    slug: "belen",
    number: 16,
    name: "Belén",
    address: "I.E Carlos Franco, Cra 77 # 25-67",
    pickupPoint: "I.E Carlos Franco, Cra 77 # 25-67, Comuna 16 Belén",
    departureTime: "8:00 a.m.",
  },
  {
    slug: "prado",
    number: 80,
    name: "San Antonio de Prado",
    address: "Centro de Desarrollo Social Rosaleda, Cra 57 # 48 e sur 07",
    pickupPoint:
      "Centro de Desarrollo Social Rosaleda, Cra 57 # 48 e sur 07, Comuna 80 San Antonio de Prado",
    departureTime: "8:00 a.m.",
  },
];

export const getComuna = (slug: string) =>
  comunas.find((c) => c.slug === slug);