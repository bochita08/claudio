import { PublicUser, User } from '../types';
import { ApiError, networkDelay } from './api';
import {
  clearSession,
  getSessionUserId,
  readUsers,
  setSessionUserId,
  writeUsers,
} from './storage';

function toPublic(user: User): PublicUser {
  const { password, ...rest } = user;
  return rest;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export const authService = {
  /** Devuelve el usuario logueado desde la sesion persistida, o null. */
  async getCurrentUser(): Promise<PublicUser | null> {
    const id = await getSessionUserId();
    if (!id) return null;
    const users = await readUsers();
    const user = users.find((u) => u.id === id);
    return user ? toPublic(user) : null;
  },

  async signIn(email: string, password: string): Promise<PublicUser> {
    await networkDelay();
    const users = await readUsers();
    const user = users.find((u) => normalizeEmail(u.email) === normalizeEmail(email));
    if (!user || user.password !== password) {
      throw new ApiError('INVALID_CREDENTIALS', 'Email o contraseña incorrectos.');
    }
    await setSessionUserId(user.id);
    return toPublic(user);
  },

  async signUp(payload: SignUpPayload): Promise<PublicUser> {
    await networkDelay();
    const users = await readUsers();
    const exists = users.some(
      (u) => normalizeEmail(u.email) === normalizeEmail(payload.email),
    );
    if (exists) {
      throw new ApiError('EMAIL_TAKEN', 'Ya existe una cuenta con ese email.');
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: normalizeEmail(payload.email),
      phone: payload.phone.trim(),
      password: payload.password,
      photo: undefined,
      createdAt: new Date().toISOString(),
    };
    await writeUsers([...users, newUser]);
    return toPublic(newUser);
  },

  /**
   * No revela si el email existe (buena practica). Siempre resuelve OK salvo
   * error de red.
   */
  async forgotPassword(email: string): Promise<{ ok: true }> {
    await networkDelay();
    const users = await readUsers();
    const user = users.find((u) => normalizeEmail(u.email) === normalizeEmail(email));
    if (user) {
      // Aca un backend real dispararia el mail con el token de reset.
    }
    return { ok: true };
  },

  async signOut(): Promise<void> {
    await networkDelay(200);
    await clearSession();
  },
};
