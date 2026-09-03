import { t } from '../i18n';

/**
 * Cada validador devuelve un string con el mensaje de error, o undefined si el
 * valor es valido. Los formularios los combinan y muestran el mensaje debajo del
 * input correspondiente.
 */
export type FieldError = string | undefined;

const NAME_RE = /^[A-Za-zÀ-ÿ'’ -]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmpty(value: string | undefined | null): boolean {
  return value == null || String(value).trim().length === 0;
}

export function validateRequired(value: string, label: string): FieldError {
  if (isEmpty(value)) return t.validation.required(label);
  return undefined;
}

/** Solo letras (incluye acentos y enie), espacios, guion y apostrofe. */
export function validateName(value: string, label: string): FieldError {
  const req = validateRequired(value, label);
  if (req) return req;
  const v = value.trim();
  if (v.length < 2) return t.validation.nameMin(label);
  if (v.length > 40) return t.validation.nameMax(label);
  if (!NAME_RE.test(v)) return t.validation.nameChars(label);
  return undefined;
}

/** Debe tener @, un dominio con punto, sin espacios y formato general valido. */
export function validateEmail(value: string, label = 'El email'): FieldError {
  const req = validateRequired(value, label);
  if (req) return req;
  const v = value.trim();
  if (/\s/.test(v)) return t.validation.emailSpace;
  if (!v.includes('@')) return t.validation.emailAt;
  const [local, domain, ...rest] = v.split('@');
  if (rest.length > 0 || !local || !domain) return t.validation.emailFormat;
  if (!domain.includes('.')) return t.validation.emailDot;
  if (!EMAIL_RE.test(v)) return t.validation.emailFormat;
  return undefined;
}

/** Solo numeros, entre 7 y 15 digitos. */
export function validatePhone(value: string, label = 'El teléfono'): FieldError {
  const req = validateRequired(value, label);
  if (req) return req;
  const v = value.trim();
  if (!/^[0-9]+$/.test(v)) return t.validation.phoneDigits;
  if (v.length < 7) return t.validation.phoneMin;
  if (v.length > 15) return t.validation.phoneMax;
  return undefined;
}

/** Password fuerte: min 8, una mayuscula, una minuscula y un numero. */
export function validatePassword(value: string, label = 'La contraseña'): FieldError {
  const req = validateRequired(value, label);
  if (req) return req;
  if (value.length < 8) return t.validation.passwordMin;
  if (!/[A-Z]/.test(value)) return t.validation.passwordUpper;
  if (!/[a-z]/.test(value)) return t.validation.passwordLower;
  if (!/[0-9]/.test(value)) return t.validation.passwordNumber;
  return undefined;
}

/** En login solo exigimos que no este vacia (no revelamos la politica). */
export function validateLoginPassword(value: string): FieldError {
  return validateRequired(value, 'La contraseña');
}

export function validateConfirmPassword(value: string, original: string): FieldError {
  const req = validateRequired(value, 'La confirmación');
  if (req) return req;
  if (value !== original) return t.validation.confirmMismatch;
  return undefined;
}

/** Filtros de entrada: se aplican en onChangeText para que el input no acepte basura. */
export const sanitizers = {
  digits: (value: string) => value.replace(/[^0-9]/g, ''),
  letters: (value: string) => value.replace(/[^A-Za-zÀ-ÿ'’ -]/g, ''),
  email: (value: string) => value.replace(/\s/g, '').toLowerCase(),
  trim: (value: string) => value.replace(/^\s+/, ''),
};

/** Devuelve true si TODOS los errores del objeto son undefined. */
export function isFormValid(errors: Record<string, FieldError>): boolean {
  return Object.values(errors).every((e) => !e);
}
