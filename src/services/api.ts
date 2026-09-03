/**
 * Capa de acceso a datos. Hoy todo es mock en memoria + AsyncStorage, pero la
 * firma de cada service imita la de un cliente HTTP real: son async, tiran
 * ApiError y tardan un poco. Para conectar un backend, reemplaza el cuerpo de
 * cada funcion en los *Service.ts por un fetch() a API_BASE_URL.
 */
export const API_BASE_URL = 'https://api.propplus.example.com';

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    // Sin esto, `err instanceof ApiError` puede dar false en el build release
    // (Hermes rompe la cadena de prototipos al extender Error).
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/** Devuelve el `code` de un error de la API, sea o no `instanceof ApiError`. */
export function apiErrorCode(err: unknown): string | undefined {
  if (err instanceof ApiError) return err.code;
  if (err && typeof err === 'object' && 'code' in err) {
    return (err as { code?: string }).code;
  }
  return undefined;
}

/** Simula latencia de red. */
export function networkDelay(ms = 650): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
