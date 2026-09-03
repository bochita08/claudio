/** Separador de miles manual para no depender de Intl/Hermes. */
function groupThousands(value: number): string {
  const sign = value < 0 ? '-' : '';
  const digits = Math.round(Math.abs(value)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatPrice(value: number, currency: 'USD' | 'ARS' = 'USD'): string {
  const prefix = currency === 'USD' ? 'USD ' : '$ ';
  return `${prefix}${groupThousands(value)}`;
}

export function formatArea(value: number): string {
  return `${value} m²`;
}

export function pluralize(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

/** "3 dorm." / "1 baño" / "2 baños" */
export const formatBedrooms = (n: number) => `${n} dorm.`;
export const formatBathrooms = (n: number) => pluralize(n, 'baño', 'baños');

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

export function initialsOf(firstName: string, lastName: string): string {
  const a = firstName.trim().charAt(0);
  const b = lastName.trim().charAt(0);
  return `${a}${b}`.toUpperCase() || '?';
}
