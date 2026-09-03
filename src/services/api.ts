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
  }
}

/** Simula latencia de red. */
export function networkDelay(ms = 650): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
