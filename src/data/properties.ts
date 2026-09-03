import { Property } from '../types';

/**
 * Imagenes: usamos picsum.photos con un seed fijo por propiedad/foto para que el
 * "random" sea estable entre recargas. Cada propiedad tiene 3 fotos (carrusel).
 */
const img = (seed: string) => `https://picsum.photos/seed/${seed}/900/600`;

export const PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Casa con jardín en Villa Devoto',
    address: 'Av. Nazca 4820',
    city: 'Villa Devoto, CABA',
    price: 245000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 2,
    area: 165,
    type: 'Casa',
    year: 2012,
    description:
      'Casa en dos plantas totalmente reciclada, con jardín al fondo y parrilla. Living comedor amplio con ventanales al parque, cocina integrada con isla y toilette de recepción. En la planta alta, tres dormitorios (suite principal con vestidor) y balcón corrido. Excelente luminosidad todo el día y muy buena ventilación cruzada.',
    images: [img('devoto-a'), img('devoto-b'), img('devoto-c')],
    latitude: -34.5989,
    longitude: -58.5136,
    agentId: 'ag-1',
    amenities: ['Jardín', 'Parrilla', 'Cochera para 2 autos', 'Cocina con isla', 'Vestidor'],
  },
  {
    id: 'prop-2',
    title: 'Departamento 2 ambientes en Palermo Soho',
    address: 'Honduras 5100',
    city: 'Palermo, CABA',
    price: 168000,
    currency: 'USD',
    bedrooms: 1,
    bathrooms: 1,
    area: 52,
    type: 'Departamento',
    year: 2019,
    description:
      'Dos ambientes a estrenar en el corazón de Palermo Soho. Piso alto con balcón aterrazado y vista abierta. Amenities completos: SUM, laundry, terraza con solárium y seguridad 24 horas. A metros de Plaza Serrano, transporte y gastronomía.',
    images: [img('palermo-a'), img('palermo-b'), img('palermo-c')],
    latitude: -34.5875,
    longitude: -58.4265,
    agentId: 'ag-1',
    amenities: ['Balcón aterrazado', 'SUM', 'Laundry', 'Seguridad 24h', 'Terraza con solárium'],
  },
  {
    id: 'prop-3',
    title: 'PH reciclado en Caballito',
    address: 'Rojas 560',
    city: 'Caballito, CABA',
    price: 132000,
    currency: 'USD',
    bedrooms: 2,
    bathrooms: 1,
    area: 74,
    type: 'PH',
    year: 2008,
    description:
      'PH al frente sin expensas, con patio propio y terraza de uso exclusivo. Dos dormitorios, living con hogar a leña y cocina comedor. Ideal primera vivienda o inversión para renta. Zona tranquila a tres cuadras del subte línea A.',
    images: [img('caballito-a'), img('caballito-b'), img('caballito-c')],
    latitude: -34.6167,
    longitude: -58.4372,
    agentId: 'ag-3',
    amenities: ['Patio propio', 'Terraza exclusiva', 'Sin expensas', 'Hogar a leña'],
  },
  {
    id: 'prop-4',
    title: 'Local comercial a la calle en Núñez',
    address: 'Av. Cabildo 3900',
    city: 'Núñez, CABA',
    price: 98000,
    currency: 'USD',
    bedrooms: 0,
    bathrooms: 1,
    area: 45,
    type: 'Local',
    year: 2005,
    description:
      'Local a la calle sobre avenida de alto tránsito peatonal y vehicular. Salón único con entrepiso, baño y kitchenette. Vidriera amplia, excelente cartel. Apto rubro gastronómico y comercial. Contrato de alquiler vigente con buena renta.',
    images: [img('nunez-a'), img('nunez-b'), img('nunez-c')],
    latitude: -34.5445,
    longitude: -58.4638,
    agentId: 'ag-2',
    amenities: ['Vidriera a la calle', 'Entrepiso', 'Alto tránsito', 'Apto gastronómico'],
  },
  {
    id: 'prop-5',
    title: 'Oficina premium en Puerto Madero',
    address: 'Olga Cossettini 750',
    city: 'Puerto Madero, CABA',
    price: 410000,
    currency: 'USD',
    bedrooms: 0,
    bathrooms: 2,
    area: 120,
    type: 'Oficina',
    year: 2021,
    description:
      'Oficina en torre corporativa con vista al dique. Planta libre de 120 m² con pisos técnicos, aire central e instalación lista para operar. Dos baños, kitchenette y sala de reuniones vidriada. Cochera opcional. Seguridad y recepción en planta baja.',
    images: [img('madero-a'), img('madero-b'), img('madero-c')],
    latitude: -34.6118,
    longitude: -58.3626,
    agentId: 'ag-2',
    amenities: ['Vista al dique', 'Aire central', 'Pisos técnicos', 'Sala de reuniones', 'Recepción'],
  },
];

export function getPropertyById(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}
